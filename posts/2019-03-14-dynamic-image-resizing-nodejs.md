---
title: "Dynamic image resizing with Node.js and the Serverless Framework"
description: "Learn how to create an API that allows you to resize images dynamically using AWS, S3, Lambda & Serverless Framework."
date: 2019-03-14
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/dynamic-image-resizing/dynamic-image-resizing-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/dynamic-image-resizing/dynamic-image-resizing-header.png"
category:
  - guides-and-tutorials
authors:
  - NickGottlieb
---

Does your website or app contain images? Then you've probably had to deal with the problem of resizing those images for different page layouts and devices of all shapes and sizes, not all of them predictable. But the lower-effort alternative, serving the full-size original image, doesn't scale.

Above all, large images dramatically increase page load times, impacting the user experience and driving up bounce rates. Then there's the fact that mobile visitors may well have a less-than-reliable network connection. If the image download gets interrupted, they have to reload the entire page, eating into their data plan and causing frustration to boot. And finally, most visitors can't tell the difference between an original image and one with a data footprint 10 times smaller.

With those downsides in mind, it's in your interest to generate and serve a compressed image of lower but still good quality. But what's the ideal image size? Given the huge variety of potential screen sizes, that question is nearly impossible to answer. And pre-scaling the original image to all imaginable sizes will result in an unsustainable hit to your cloud storage capacity and therefore to your monthly bill. So what's the solution?

Serverless Framework, which makes it very easy to build applications using AWS Lambda and other Serverless compute providers, is a great solution for this use case. Serverless' auto-scaling, pay-per-execution functions not only let you avoid that massive collection of pre-scaled cloud data, but also significantly cut down on your compute costs, since you won't need to maintain a fleet of image scaling servers.

In this article, we'll take an in-depth look at the benefits of dynamic image resizing and walk you through using the Serverless Framework to resize your images dynamically with AWS Lambda. So, let's get to it!

#### A solution using S3

In this example we'll be using Node.js along with [the Serverless framework](https://serverless.com/framework/) to build our app. We’ll also be using S3, the AWS cloud storage service, but the Serverless Framework works with Azure, GCP and Kubernetes as well, among others.

Here's the core logic of our process: If we already have the properly sized image in our S3 storage, calling the corresponding S3 URI will serve us the previously stored image directly. But if we don't have the image in that size yet, following the S3 link will first generate the image in that size and then serve it to us. And, of course, the newly resized image gets stored in S3.

To implement this process we'll first pick a few ranges of possible image sizes (for example, we'd serve one size image to screens 100-249px wide, and a slightly larger image to those 250-600px wide). Then, we’ll build a system from event-driven functions that will generate the specified image sizes from the original photo.

By only generating images sized for the devices that actually request your site, we make the system smart. When a particular article has only been viewed by 600px-wide screens, the Serverless app won't generate the rest of the sizes... not until someone with a different screen size comes along. The first reader with a 400px screen to load the article must wait for a split second while the system generates the new image size, but the user experience impact is minimal. Once the new size has been generated, we save it for future use.

And so this Serverless approach represents an easy, low-cost and scalable solution. Should no one happen to visit your site or use your app, no code will run, costing you nothing. But when new visitors begin needing different image sizes, the system will scale, doing all the necessary work and no more. As soon there are no more new images to generate, the system stops running. Another plus: it's an optimal experience for users, where their devices get served the right size image in a timely manner.

#### Creating a Serverless API for image resizing

Let’s look at how to implement the Serverless image-resizing API in detail. In this section, we’ll cover the following steps:

- Writing a `serverless.yml` config file that contains all the specifics for the resizing service
- Implementing the resizing logic in a handler function
- Setting up an S3 bucket to work with the resizing endpoint

##### Writing the `serverless.yml` file

Let’s start with the `serverless.yml` config file. First, we define the name of our service:

```yaml
service:
  name: image-resizing
```

We then specify our cloud provider (AWS) and a Node.js version that works for us:

```yaml
provider:
  name: aws
  runtime: nodejs8.10
```

Now, let’s add the definition for our resizing function:

```yaml
functions:
  resize:
    handler: src/handlers/resizer/index.handler
    events:
      - http:
          path: /{size}/{image}
          method: get
    environment:
      BUCKET: dynamic-image-resizing
      REGION: us-east-1
    iamRoleStatements:
      - Effect: "Allow"
        Action:
          - "s3:GetObject"
        Resource: "arn:aws:s3:::dynamic-image-resizing/*"
      - Effect: "Allow"
        Action:
          - "s3:PutObject"
        Resource: "arn:aws:s3:::dynamic-image-resizing/*"
```

We define the location of our future image-resizing handler and specify the path our handler will accept. We only need two components in the path: the size of the image and the image name. In the `environment` section, we define the S3 `BUCKET` where our images will be stored, and the `REGION` where the S3 bucket will live (in our example, it’s `us-east-1`).

We also specify the [IAM](https://docs.aws.amazon.com/iam/index.html#lang/en_us) roles that we want to grant to the resizing function. We’ll make it broad and let the function read from and write to all paths in the S3 bucket.

##### The handler function

Now we’ll switch to the `src/handlers/resizer/index.js` file that we mentioned previously as the location of the image-resizing handler. Our handler looks quite simple:

```javascript
import { resizeHandler } from "./resizeHandler";

export const handler = async event => {
  try {
    const imagePath = await resizeHandler.process(event);
    const URL = `http://${process.env.BUCKET}.s3-website.${
      process.env.REGION
    }.amazonaws.com`;

    return {
      headers: { location: `${URL}/${imagePath}` },
      statusCode: 301,
      body: ""
    };
  } catch (error) {
    console.log(error);
    return new Error(error);
  }
};
```

The handler accepts an HTTP request, calls `resizeHandler._process` on it, and returns an HTTP 301 redirect to the location of the new image once it’s been successfully generated.

We’ll put the `resizeHandler` code in a separate file: `src/handlers/resizer/resizeHandler.js`. We start by importing the S3 supporting functions and our image processing library, `sharp`:

```javascript
import { s3Handler } from "./s3Handler";
const sharp = require("sharp");
```

We then build a handler and add our `process` function:

```javascript
    class ResizerHandler {
      constructor(){ }

      async process(event) {
        const { size, image } = event.pathParameters
        return await this.resize(size, image)
      }
      ...
    }
```

Now that our `process` function is receiving a raw HTTP event from our HTTP handler, we can derive the size and the name of the image from the parameters. Then we use those values to call the `resize` function. In `resize`, we convert the parameters to integers and construct the path where we can find the resized image after conversion:

```javascript
    async resize(size, path) {
      try {
        const sizeArray = size.split('x')
        const width = parseInt(sizeArray[0])
        const height = parseInt(sizeArray[1])
        const Key = path
        const newKey = '' + width + 'x' + height + '/' + path
        ...
      }
    }
```

We then call `sharp` to create a resizing stream for the image with the corresponding width and height, specifying `png` format as the output. Finally, we create S3 read and write streams, allowing us to string together our input stream, `sharp` stream and output stream. After all that, we need only wait for the upload to finish, at which point we can return the new image path:

```javascript
    async resize(size, path) {
      try {
        ...
        const Bucket = process.env.BUCKET
        const streamResize = sharp()
          .resize(width, height)
          .toFormat('png')

        const readStream = s3Handler.readStream({ Bucket, Key })
        const { writeStream, uploaded } = s3Handler.writeStream({ Bucket, Key: newKey })

        readStream
          .pipe(streamResize)
          .pipe(writeStream)

          await uploaded
          return newKey
      }
    }
```

The `s3Handler.js` file contains the `s3Handler` convenience functions, which wrap the `S3.getObject` and `S3.upload` functions from the AWS SDK for Node.js:

```javascript
import * as AWS from "aws-sdk";
import stream from "stream";

const S3 = new AWS.S3();

class S3Handler {
  constructor() {}

  readStream({ Bucket, Key }) {
    return S3.getObject({ Bucket, Key }).createReadStream();
  }

  writeStream({ Bucket, Key }) {
    const passThrough = new stream.PassThrough();
    return {
      writeStream: passThrough,
      uploaded: S3.upload({
        ContentType: "image/png",
        Body: passThrough,
        Bucket,
        Key
      }).promise()
    };
  }
}

export const s3Handler = new S3Handler();
```

We use both `readStream` and `writeStream` to simplify the streaming in the `resizeHandler` functions.

##### Deploying the image resizing API

Now that we’ve set up our code, we’re ready for deployment. In the Serverless framework, we can deploy the change (or changes, as the case may be) to our `serverless.yml` file by running:

`serverless deploy`

This translates the syntax of our `serverless.yml` file into an AWS CloudFormation template and sends that change to AWS. For more on the deployment process, [check out the Serverless AWS documentation](https://serverless.com/framework/docs/providers/aws/guide/deploying/).

##### Setting up the S3 bucket

When a user requests a file from an S3 bucket that doesn’t exist, S3 conveniently lets us call a function to create or get that file. This allows us to implement the following logic:

- If the properly sized image exists in the S3 bucket, return it.
- If the image does not yet exist in the requested size, call our resizing function and then return the newly available image.

Once we’ve deployed our new API, we need to configure our S3 bucket to work together with our Serverless function as follows:

1. Configure our S3 bucket for website hosting as shown [in the S3 documentation](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html).
2. In the [Advanced Conditional Redirects](https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html#advanced-conditional-redirects) section of the Website Hosting settings for the S3 bucket, set up the following redirect rule:

```yaml
<RoutingRules>
<RoutingRule>
<Condition>
<HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
</Condition>
<Redirect>
<Protocol>https</Protocol>
<HostName>YOUR-API-ENDPOINT.execute-api.us-east-1.amazonaws.com</HostName>
<ReplaceKeyPrefixWith>dev-1/</ReplaceKeyPrefixWith>
<HttpRedirectCode>307</HttpRedirectCode>
</Redirect>
</RoutingRule>
</RoutingRules>
```

In place of `YOUR-API-ENDPOINT` we will add the Lambda endpoint of our Serverless function. We can get that by running:

    serverless info

Keep in mind that if you specify a custom stage during deployment you also need to specify it in the `info` command to get the right endpoint address. See [the docs for the](https://serverless.com/framework/docs/providers/aws/cli-reference/info/) `[info](https://serverless.com/framework/docs/providers/aws/cli-reference/info/)` [command](https://serverless.com/framework/docs/providers/aws/cli-reference/info/) for more details.

##### The API in action

Let’s take a look at the API in action. First we’ll request a size we know exists:

![](https://d2mxuefqeaa7sj.cloudfront.net/s_8FE7B267DA95DBD09C62EC26F73D28A8C646719D9EB7858AE304A21F878756CC_1551907411588_resizing-1.gif)

Now let’s request the image in a size that doesn’t exist yet:

![](https://d2mxuefqeaa7sj.cloudfront.net/s_8FE7B267DA95DBD09C62EC26F73D28A8C646719D9EB7858AE304A21F878756CC_1551907487412_resizing-2.gif)

It works! The next time we request this size, the image will be served directly from S3.

#### Wrapping up

This article walked you through the process of creating a Serverless app that dynamically resizes images. In the process, we saw that image resizing using Serverless keeps costs low, gives users a good experience and scales perfectly with your needs.

If you've never used Serverless before, building an app that resizes images is a great introduction. But Serverless also offers significant advantages in use cases much more complex than this common one, such as workflow automation and task scheduling.

To get going with Serverless, start with [their own documentation](https://serverless.com/framework/docs/getting-started/), or check out their [AWS-based introduction to the Serverless framework](https://serverless.com/framework/docs/providers/aws/guide/intro/). For other cloud providers, [Serverless can help you there too](https://serverless.com/framework/docs/#Supported-Providers).

You can find the full example project from this article [in this GitHub repo](https://serverless.com/examples/aws-node-dynamic-image-resizer).
