---
title: Serverless v1.16 - S3 server-side encryption and default exclusion of Node.js dev dependencies added
description: S3 server-side encryption, support for API Gateway usage plans, default exclusion of Node.js dev dependencies and more in the Serverless Framework v1.16 release.
date: 2017-06-22
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-v116.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-v116.png" width="210px" >

We're proud to announce the v1.16 release of the Serverless Framework!

This release introduces new features, improvements, and bugfixes. Let's take a look at all the new features v1.16 offers.

## Highlights of 1.16.0

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file or watch the video below.

Kudos to Ryan H. Lewis ([@ryanmurakami](https://twitter.com/ryanmurakami)) for taking the time to record this video!

<iframe width="560" height="315" src="https://www.youtube.com/embed/_F4YO6pi1sg" frameborder="0" allowfullscreen></iframe>

### S3 server-side encryption options

Serverless uploads and stores different revisions of your deployment artifacts including the services `.zip` files and the CloudFormation templates in a dedicated S3 bucket.

The Serverless Framework creates and manages this deployment bucket by default.

However you can also use the `deploymentBucket` configuration parameter which is nested in the `provider` property to specify a predefined S3 bucket which should be used when uploading and storing your deployment artifacts.

With v1.16, we're adding support for server-side encryption options for such buckets which ensures that your artifacts are encrypted in your bucket once uploaded.

Let's take a look at how you could use this feature.

The first thing we need to do is to create our new S3 bucket which should be used to store our deployment artifacts.

We assume that this bucket is called `serverless.deployment.bucket`. For example, this bucket could have the following "bucket policy" to ensure that the content is encrypted:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "RequiredEncryptedPutObject",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "s3:PutObject",
      "Resource": "arn:aws:s3:::serverless.deployment.bucket/*",
      "Condition": {
        "StringNotEquals": {
          "s3:x-amz-server-side-encryption": [
            "AES256",
            "aws:kms"
          ]
        }
      }
    }
  ]
}
```

Next, we simply define that we want to use this bucket in combination with a `AES256` server-side encryption for our deployments in our `serverless.yml` file:

```yml
service:
  name: service

provider:
  name: aws
  runtime: nodejs6.10
  deploymentBucket:
    name: serverless.deployment.bucket
    serverSideEncryption: AES256

functions:
  hello:
    handler: handler.hello
```

That's it. All files which will be uploaded to this bucket will be encrypted from now on.

You can read more in our [deploying to AWS](https://serverless.com/framework/docs/providers/aws/guide/deploying/) docs about this feature.

### API Gateway usage plans support

API keys are a widely used feature to enable/disable access to different endpoints of your API offering.

The [introduction of "API Gateway Usage Plans"](https://aws.amazon.com/de/blogs/aws/new-usage-plans-for-amazon-api-gateway/) makes it possible to control the usage patterns your API should support in a fine-grained way.

A recent AWS update finally added support for this feature in CloudFormation which makes it possible to automate the setup process. Serverless v1.16 takes advantage of this addition and adds native `serverless.yml` support for usage plan definitions.

The following is a sample `serverless.yml` file which showcases how you can use the new usage plan feature:

```yml
service:
  name: service

provider:
  name: aws
  runtime: nodejs6.10
  apiKeys:
    - myAPIKey
  usagePlan:
    quota:
      limit: 5000
      offset: 2
      period: MONTH
    throttle:
      burstLimit: 200
      rateLimit: 100

functions:
  greeter:
    handler: handler.greeter
    events:
      - http:
          method: POST
          path: greet
          private: true
```

**Note:** Please make sure to enable usage plan support in your [AWS API Gateway console](https://console.aws.amazon.com/apigateway/home) by following the steps in the [announcement blog post](https://aws.amazon.com/de/blogs/aws/new-usage-plans-for-amazon-api-gateway/).

### Significantly reduced time to deploy by excluding development dependencies

The Serverless Framework's `package` plugin includes a sophisticated zipping utility which gives you control over the `.zip` file creation process through config parameters such as `exclude` or `include`.

Most of the time the functions you work on rely on different 3rd party packages whether they're production relevant packages or packages used to streamline the development process (e.g. test runners, offline utilities, etc.).

In recent versions, Serverless included all your Node.js dependencies by default. This means that your production dependencies as well as your development dependencies are included in the final `.zip` artifact and uploaded to your deployment bucket. 

Such deployment artifacts can easily get quite large in size.

Serverless v1.16 changes this behavior and introduces a step which analyzes your dependencies while excluding development dependencies from the final `.zip` deployment artifact.

This feature is currently supported for `Node.js` runtimes and is enabled by default.

Do you have ideas on how we can add support for other runtimes as well? Please let us know by opening up a [new issue](https://github.com/serverless/serverless/issues/new)!

**Note:** Serverless analyzes and excludes development dependencies from all your `package.json` files, no matter how many `package.json` files you have or how nested your directory structure is.

### Enhancements & Bug Fixes

This release also includes lots of bug fixes and several other enhancements.

> Thank you very much for reporting bugs and opening issues!

### Contributors 

This release contains lots of hard work from our awesome community, and wouldn't have been possible without passionate people who decided to spend their time contributing to make Serverless better.

Thank You to all of the contributors who submitted changes for this release:

- Alex Casalboni
- David Gatti
- Eetu Tuomala
- Frank Schmid
- Geoffrey Wiseman
- Jeremy Benoist
- Joey van Dijk
- Juha Syrjälä
- Maciej Sobala
- Matt Hernandez
- Max Redmond
- Ryan Lewis
- Sequoia McDowell
- Vlad Holubiev
- zined

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Want to help us build the best Serverless tooling out there?

Contributing isn't just about code! Chime in on [discussions](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback), help with [documentation updates](https://github.com/serverless/serverless/labels/kind%2Fdocs) or [review Pull Requests](https://github.com/serverless/serverless/pulls).

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

Furthermore, we're always seeking feedback from our community to build the features in the best way possible. [Here's a list](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) with issues where we need your feedback and insights in your real world usage of Serverless.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.17 milestone](https://github.com/serverless/serverless/milestone/32) to see what we have planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can install and therefore enhance the capabilities of the Framework.

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
