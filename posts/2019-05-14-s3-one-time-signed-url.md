---
title: "Uploading objects to S3 using one-time pre signed URLs"
description: "Learn how to use Lambda@Edge to verify that S3 presigned URLs are only used once."
date: 2019-05-14
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/s3-one-time-signed-url/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/s3-one-time-signed-url/header.png"
category:
  - guides-and-tutorials
authors:
  - EetuTuomala
---
AWS provides the means to upload files to an S3 bucket using a pre signed URL. The URL is generated using IAM credentials or a role which has permissions to write to the bucket. A pre signed URL has an expiration time which defines the time when the upload has to be started, after which access is denied. The problem is that the URL can be used multiple times until it expires, and if a malevolent hacker gets their hands on the URL, your bucket may contain some unwanted data.

How then do we prevent the usage of the presigned URL after the initial upload?

The following example will leverage CloudFront and Lambda@Edge functions to expire the presigned URL when the initial upload starts, preventing the use of the URL 

Lambda@Edge functions are similar to AWS Lambda functions, but with a few limitations. The allowed execution time and memory size are smaller than in regular Lambda functions, and no environmental variables can be used.

[The example project](https://github.com/laardee/one-time-presigned-url) is made with the Serverless Framework. Let’s go through the basic concept and components.

## The Concept

The objective is to ensure that every pre signed URL is only ever used once, and becomes unavailable after the first use.

I had a few different ideas for the implementation until I settled on one that seemed to be the most efficient at achieving our objective.

![s3-signed-url-at-edge-get-signed-url](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/s3-one-time-signed-url/Serverless_Graph01-s3-signed-url-at-edge-get-signed-url.png)
**Figure 1.** Presigned URL creation

First, the user makes a request to the /url endpoint (step 1, Figure 1). This in turn triggers a lambda function (step 2, Figure 1) which creates a presigned URL using the S3 API (step 3, Figure 1). A hash is then created from the URL and saved to the bucket (step 4, Figure 1) as a valid signature. The Lambda function creates a response which contains the URL (step 5, Figure 1) and returns it to the user (step 6, Figure 1).


![s3-signed-url-at-edge-validate](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/s3-one-time-signed-url/Serverless_Graph02-s3-signed-url-at-edge-validate.png)
**Figure 2.** Verification of the presigned URL

The user then uses that URL to upload the file (step 1, Figure 2). A Cloudfront viewer request triggers a Lambda function(step 2, Figure 2) which verifies that the hashed URL is indexed as a valid token and is not indexed as an expired token (step 3, Figure 2). If we have a match from both conditions, the current hash is written to the expired signatures index (step 4, Figure 2).

In addition to that, the version of the expired signature object is checked. If this is the first version of this particular expired hash everything is ok (step 5, Figure 2). This check is meant to prevent someone intercepting the original response with a signed URL and using it before the legitimate client has had a chance to.

After all the verifications have successfully passed, the original request is returned to Cloudfront (step 6, Figure 2) and to the bucket (step 7, Figure 2), which then decides if the presigned URL is valid for PUTting the object.

## AWS Resources

The S3 bucket will contain the uploaded files and an index of used signatures. There no need for bucket policy, ACLs, or anything else; the bucket is private and cannot be accessed from outside without a pre signed URL.

The generation and invalidation of the signed URLs will happen on the Lambda@Edge functions, which are triggered in the CloudFront’s viewer request stage. Functions have a role which allows them to generate the presigned URL, check if the URL hash is in the valid index and add it if not.

The bucket and CloudFront distribution are defined in the resources block of the `serverless.yml` file. Since we cannot pass configuration values via environment variables (since Lambda@Edge functions cannot access environment variables), the bucket name is stored and fetched from an external json file.

```yaml
Bucket:
  Type: AWS::S3::Bucket
  Properties:
    BucketName: ${self:custom.config.bucket}
    BucketEncryption:
      ServerSideEncryptionConfiguration:
        - ServerSideEncryptionByDefault:
          SSEAlgorithm: AES256
    VersioningConfiguration:
      Status: Enabled
    CorsConfiguration:
      CorsRules:
        - AllowedHeaders: ['*']
          AllowedMethods: [GET, PUT]
          AllowedOrigins: ['*']
          Id: CORSRuleId1
          MaxAge: '3600'
```

The Cloudfront distribution has its origin set to our S3 bucket, and it has two behaviours; the default is to perform the upload with a pre signed URL, the second supports a URL pattern of /url which will respond with the presigned URL that is used for the upload.

The default behaviour in the distribution configuration allows all the HTTP methods so that `PUT` can be used to upload files. S3 allows files up to 5 gigabytes to be uploaded with that method, although it is better to use multipart upload for files bigger than 100 megabytes. For simplicity, this example uses only `PUT`.

Cloudfront should also forward the query string which contains the signature and token for the upload.

```yaml
ForwardedValues:
  QueryString: 'true' # S3 presigned URL
  Cookies:
    Forward: none
AllowedMethods:
  - DELETE
  - GET
  - HEAD
  - OPTIONS
  - PATCH
  - POST
  - PUT # Method used for upload
```

The behaviour for the `/url` pattern only allows GET and HEAD methods and it doesn't have to forward anything; the response will be created by the Lambda function.

The origin contains only the domain name, which is the bucket name, and id. The `S3OriginConfig` is an empty object because the bucket will be private. If you want to allow users to view files which are saved to the bucket, the origin access identity can be set.

```yaml
Origins:
  - DomainName: ${self:custom.config.bucket}.s3.amazonaws.com
    Id: S3Origin
    S3OriginConfig: {}
```

### Lambda Functions

Both of the functions are triggered in the viewer request stage, which is when CloudFront receives the request from the end user (browser, mobile app, and such).

The function which creates the presigned URL is straightforward; it uses the AWS SDK to create the URL, stores a hash of the URL to the bucket and returns the URL. I'm using node UUID module to generate a random object key for each upload.

```js
const signedUrl = s3.getSignedUrl('putObject', {
  Bucket: bucket,
  Key: `uploads/${uuidv4()}`,
});
```

This will return the full URL to the S3 bucket with presigned URL as a query string. As Cloudfront is used in front of the bucket, the URL domain must be the domain of the Cloudfront distribution. The path part is parsed from the signed URL using node URL module and CloudFront distribution domain is available in the request headers.

```js
const { path } = url.parse(signedUrl);
const host = headers.host[0].value;
const response = {
  status: '200',
  statusDescription: 'OK',
  headers: {
    'content-type': [
      {
        key: 'Content-Type',
        value: 'text/plain',
      },
    ],
    'content-encoding': [
      {
        key: 'Content-Encoding',
        value: 'UTF-8',
      },
    ],
  },
  body: `https://${host}${path}`,
};
```

The function that checks whether the current upload is the first one uses the indices of signatures written into that same bucket. The first check is to confirm an entry in the "valid index" and that the "expired index" doesn't contain the hash. Then the function will continue executing the code. Otherwise, it will return a `403 Forbidden` response.

```js
const [validSignature, expiredSignature] = await Promise.all([
  headSignature({ type: 'valid', hash }),
  headSignature({ type: 'expired', hash }),
]);
if (!validSignature || expiredSignature) {
  return forbiddenResponse;
}
```

If the entry doesn't exist, then it will write current filename and signature to index.

```js
const { VersionId: version } = await s3.putObject({
  Bucket: bucket,
  Key: `signatures/expired/${hash}`,
  Body: JSON.stringify({ created: Date.now() }),
  ContentType: 'application/json',
  ContentEncoding: 'gzip',
}).promise();
```

Lastly, there is an extra check that fetches the versions of the index key. If it is not the first version, the response is again `403 Forbidden`.

```js
const { Versions: versions } = await s3.listObjectVersions({
  Bucket: bucket,
  Prefix: `signatures/expired/${hash}`,
}).promise();
const sortedVersions = versions.concat().sort((a, b) => {
  return a.LastModified > b.LastModified;
});
if (sortedVersions.length > 1 && sortedVersions[0].VersionId !== version) {
  return forbiddenResponse;
}
```

If the version id matches the initial version id, Lambda will pass the request on as it is to the origin.

### Permissions

The function that creates the presigned URL needs to have s3:putObject permissions. The function that checks if the current upload is the initial upload requires permissions for s3:getObject, s3:putObject, s3:listBucket, and s3:listBucketVersions.

## Development and Deployment

Deploying the stack with the Serverless Framework is easy; `sls deploy` and then wait. And wait. Everything related to Cloudfront takes time. At least 10 minutes. And removal of the replicated functions can take up to 45 minutes. That is a good driver for test driven development. The example project uses jest with a mocked AWS SDK; that way local development is fast and if you make small logic errors, they are caught before deployment.

Bear in mind that Lambda@Edge functions are always deployed to the North Virginia (us-east-1) region. From there they are replicated to edge locations and called from the CDN closest to the client.

## Time for a Test Run!

First, determine the domain name of the created distribution, either by logging in to the AWS web console or with the AWS CLI. The following snippet lists all the deployed distributions and shows domain names and comments. The comment field is the same one that is defined as a comment in the Cloudfront resource in `serverless.yml`. In the example, it is the service name, e.g. `dev-presigned-upload`.

```shell
aws cloudfront list-distributions \
     --query DistributionList.Items[*][DomainName,Comment] \
     --region us-east-1
```

Pick the domain name from the list and run `curl https://DOMAIN_NAME/url`. Copy the response and then run following snippet.

```shell
curl --request PUT \
     --url "URL_FROM_RESPONSE" \
     --verbose \
     --data "My data"
```
You should get something like this as a response.

```shell
< HTTP/2 200
< content-length: 0
< x-amz-id-2: uFQvK....c=
< x-amz-request-id: 94....C1
< date: Tue, 07 May 2019 08:11:58 GMT
< x-amz-version-id: YQ....iR
< x-amz-server-side-encryption: AES256
< etag: "1d...18"
< server: AmazonS3
< x-cache: Miss from cloudfront
< via: 1.1 9f....72.cloudfront.net (CloudFront)
< x-amz-cf-id: tx....jw==
```

Then rerun the same upload snippet, with the same presigned URL, and the response should be the following.

```shell
< HTTP/2 403
< content-type: text/plain
< content-length: 9
< server: CloudFront
< date: Tue, 07 May 2019 08:18:11 GMT
< content-encoding: UTF-8
< x-cache: LambdaGeneratedResponse from cloudfront
< via: 1.1 a5....f4.cloudfront.net (CloudFront)
< x-amz-cf-id: 44....Rg==
```

In the latter example, the Lambda function has determined that the pre signed URL has already been used and responded with `403 Forbidden`.


---

Now you have a Cloudfront distribution that creates pre signed URLs for uploading files and verifies that those are not used more than one time.

To secure the endpoint that creates the presigned URL’s, you can create a custom authorizer which validates each request, e.g. using an authorization header or you can use AWS WAF to limit access.

If you have any improvements or corrections related to the code, please open an issue or PR to the repository.

**Links to relevant resources**

* [Example project](https://github.com/laardee/one-time-presigned-url)
* [Serverless Framework](https://serverless.com)
* [AWS Lambda@Edge docs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html)
* [Amazon S3 Presigned URL docs](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html)
