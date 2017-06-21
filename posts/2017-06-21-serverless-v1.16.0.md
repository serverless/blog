---
title: Serverless v1.16 - S3 server-side encryption and default exclusion of Node.js dev dependencies added
description: S3 server-side encryption, support for API Gateway usage plans, default excludion of Node.js dev dependencies and more in the Serverless Framework v1.16 release.
date: 2017-06-21
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-v116.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-v116.png" width="210px" >

We're proud to announce the v1.16 release of the Serverless Framework!

This release introduces new features, improvements and bugfixes. Let's take a look at all the new features v1.16 includes.

## Highlights of 1.16.0

You can find a complete list of all the updates in the [CHANGELOG](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### S3 server-side encryption options

Serverless uploads and stores different revisions of your deployment artifacts including the services .zip files and the CloudFormation templates in a dedicated S3 bucket.

The Serverless Framework will create this deployment bucket by default for you.

However you can also use the `deploymentBucket` configuration parameter which is nested in the `provider` property to specify a pre-defined S3 bucket which should be used when uploading and storign your deployment artifacts.

With v1.16 we're adding support for server-side encryption options for such buckets which ensures that your artifacts are encrypted in your bucket once uploaded.

Let's take how you could use this feature.

The fist thing we need to do is to create our new S3 bucket which should be used to store our deployment artifacts.

We assume that this bucket is called `serverless.deployment.bucket`. This bucket could e.g. have the following "bucket policy" to ensure that the content is encrypted:

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

Next up we simply define that we want to use this bucket in combination with a `AWS256` server-side encryption for our deployments in our `serverless.yml` file:

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

That's it. All files which will be uploaded to this bucket will be encrpyted from now on.

You can read more in our docs about [deploying to AWS](https://serverless.com/framework/docs/providers/aws/guide/deploying/) about this feature.

### API Gateway usage plans support

Controling the access to your API through API keys 

### Exclude Node.js dev dependencies in services .zip file

https://github.com/serverless/serverless/pull/3737

### Enhancements & Bug Fixes

This release also includes lots of bug fixes and several other enhancements.

> Thank you very much for reporting bugs and opening issues!

### Contributors 

This release contains lots of hard work from our awesome community, and wouldn't have been possible without passionate people who decided to spend their time contributing to make Serverless better.

Thank You to all of the contributors who submitted changes for this release:

- John Doe

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
