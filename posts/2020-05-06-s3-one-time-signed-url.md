---
title: "Uploading Objects to S3 Using One-Time Presigned URLs"
description: "Learn how to use Lambda@Edge to verify that S3 presigned URLs are only used once."
date: 2019-05-06
thumbnail: ""
heroImage: ""
category:
  - guides-and-tutorials
authors:
  - EetuTuomala
---
AWS provides means to upload files to S3 bucket using a presigned URL. That URL is generated using credentials or a role which has permissions to write to the bucket. Presigned URL has an expiration time which defines the time when the upload has to be started. The problem is that the URL can be used multiple times until it expires, and if a malevolent hacker gets hands into that URL, your bucket will contain some unwanted data.

How to then prevent the usage of the presigned URL after the initial upload?

The following example will leverage CloudFront and Lambda@Edge functions to expire the presigned URL when the initial upload starts.

Lambda@Edge functions are similar to AWS Lambda functions, but with a few limitations. At the time the execution time and memory size are more limited than in the regular Lambda functions, and no environmental variables can be used.

[The example project](https://github.com/laardee/one-time-presigned-url) is made with the Serverless Framework. For those who are new with the Serverless Framework, it is a deployment tool which can be used to deploy resources to AWS and other cloud environments. Next, I'll go through the basic concept and components.

## The Concept

The objective is that the object can be created with a presigned URL, but so that each presigned URL can only be used once.

I had a few different ideas for the implementation.
The first one was to index expired tokens only, which was not as good as I thought. In this approach, I would have to check that the token is valid ok before I write anything to the index. I ended up getting everything from favicon.ico to my signature index.

Then I thought that if I only write signature hash to valid index and then delete it when it is used, but that was no go because S3 is eventual consistency on delete. I might still get an object although it was deleted earlier. I could use, e.g. DynamoDB with global tables for this approach, but single bucket deployment is much more comfortable.

I could also create a homebrew token system, but I rather use something AWS engineers have developed and tested.

How this implementation work is that first, the user makes a request to /url endpoint (step 1, Figure 1), it triggers a lambda function (step 2, Figure 1) which creates a presigned URL using S3 API (step 3, Figure 1). Then a hash created from it is saved to the bucket (step 4, Figure 1) as a valid signature. After that Lambda function creates a response which contains the URL (step 5, Figure 1) and returns it to the user (step 6, Figure 1).

![s3-signed-url-at-edge-get-signed-url](https://user-images.githubusercontent.com/4726921/57304228-a042cf00-70e7-11e9-81ad-00f03470d8c2.png)

**Figure 1.** Presigned URL creation

The user then uses that URL to upload the file (step 1, Figure 2) and validation lambda check (step 2, Figure 2) if the hash created from URL can be found from valid signatures index and is not in the indexed as an expired token. If we have a match from both conditions, the current hash is written to expired signatures index (step 4, Figure 2).

For addition to that, the version of the expired signature object is checked, and if the current version of the hash is first, everything is ok (step 5, Figure 2). This is just in case someone is speedy and gets between head and put object. There is a window that is open for some milliseconds.

After all the verifications are successfully passed, the original request is returned to CloudFront (step 6, Figure 2) and to the bucket (step 7, Figure 2), which then decides if the presigned URL is valid for putting the object.

![s3-signed-url-at-edge-validate](https://user-images.githubusercontent.com/4726921/57304222-9caf4800-70e7-11e9-85d4-18119b188635.png)

**Figure 2.** Verification of the presigned URL

## AWS Resources

The S3 bucket will contain the uploaded files and an index of used signatures. There will be no bucket policy, ACLs, or anything; the bucket is private and cannot be accessed from outside without presigned URL.

The generation and invalidation of the signed URLs will happen on the Lambda@Edge functions, which are triggered in the CloudFront's viewer request stage. Functions have a role which allows them to generate the presigned URL, and check if the URL is in the index and write it there if it doesn't yet exist.

The bucket and CloudFront distribution are defined in the resources block of serverless.yml. The bucket name is fetched from an external json file, which is also used in lambda functions due to the limitation of the environmental variables that Lambda@Edge functions have.

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

The origin in CloudFront is this bucket, and it has two behaviours; the default behaviour is for the upload and behaviour with pattern /url will respond with the presigned URL that is used for the upload.

The default behaviour in Distribution config allows all the HTTP methods so that `PUT` can be used to upload files. S3 allows files up to 5 gigabytes to be uploaded with that method, although it is better to use multipart upload for files bigger than 100 megabytes. For simplicity, this example uses only `PUT`.

CloudFront should also forward the query string which contains the signature and token for the upload.

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

The behaviour for the `/url` pattern only allows GET and HEAD methods and it doesn't have to forward anything; the response will be created with Lambda function.

The origin contains only the domain name, which is the bucket name, and id. The `S3OriginConfig` is an empty object because the bucket will be private. If you want to allow users to view files which are saved to the bucket, the origin access identity can be set.

```yaml
Origins:
  - DomainName: ${self:custom.config.bucket}.s3.amazonaws.com
    Id: S3Origin
    S3OriginConfig: {}
```

### Lambda Functions

Both of the functions are triggered in viewer request stage, that is when the CloudFront receives the request from the end user (browser, mobile app, and such).

The function which creates the presigned URL is straightforward; it uses AWS SDK to create the URL, stores a hash created from it to the bucket and returns the URL. I'm using node UUID module to generate a random object key for the upload.

```js
const signedUrl = s3.getSignedUrl('putObject', {
  Bucket: bucket,
  Key: `uploads/${uuidv4()}`,
});
```

This will return the full URL to the S3 bucket with presigned URL as a query string. As the CloudFront is used in front of the bucket, the URL domain must be the domain of the CloudFront distribution. The path part is parsed from the signed using node URL module and CloudFront distribution domain is available in the request headers.

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

The functions that check whether the upload is initial use indices of signatures written into that same bucket. The first check is that if there is an entry in the "valid index" with the same hash and the "expired index" doesn't contain the hash, the function will continue executing the code, otherwise, it will return Forbidden 403 response.

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

Then there is an extra check that fetches the versions of the index key and checks if the one that has been written is the first version. If not, the response is again forbidden 403.

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

If the version id matches to the initial version id, Lambda will pass the request as it is to the origin.

### Permissions

The function which creates the presigned URL needs to have s3:putObject permissions for the object in that bucket and one that checks if it is an initial upload requires permissions for s3:getObject, s3:putObject, s3:listBucket, and s3:listBucketVersions.

## Development and deployment

Deploying the stack with Serverless Framework is easy; sls deploy and then wait. And wait, everything related to CloudFront takes time. At least 10 minutes, and removal of the replicated functions can take up to 45 minutes. That is a good driver for test-driven-development. The example project uses jest with mocked AWS SDK, that way the development is fast and if you make small logic errors those are caught before deployment.

Lambda@Edge functions have to be deployed to the North Virginia (us-east-1) region. From there the functions are replicated to edge locations.

CloudFormation is also not a best friend with those replicated functions what comes to the removal, the removal usually times out.

## Time for a test run!

First, find out the domain name of the created distribution either by logging in to the AWS web console or with the AWS CLI. The following snipped lists all the deployed distributions and shows domain names and comments. The comment field is the same one that is defined as a comment in CloudFront resource in serverless.yml. In the example, it is the service name, e.g. dev-presigned-upload.

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

Then rerun the same upload snippet, with the same presigned URL, and the response should be following.

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

In the latter one, the Lambda has generated the 403 response.


---

Now you have a CloudFront distribution which creates presigned URLs for uploading files and verifies that those are not used more than one time.

To secure the endpoint which creates presigned URL, you can create a custom authorizer which validates, e.g. authorization header or you can use AWS WAF to limit access.

If you have any improvements, corrections, or anything related to the code, please open an issue or PR to the repository.

**Links to relevant resources**

* [Example project](https://github.com/laardee/one-time-presigned-url)
* [Serverless Framework](https://serverless.com)
* [AWS Lambda@Edge docs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-edge.html)
* [Amazon S3 Presigned URL docs](https://docs.aws.amazon.com/AmazonS3/latest/dev/PresignedUrlUploadObject.html)
