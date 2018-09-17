---
title: "Serverless v1.25 - S3 Transfer Acceleration, API Gateway endpoint type configuration, variable system improvements"
description: "S3 Transfer Acceleration, API Gateway endpoint type configuration, variable system improvements, enhancements, bug fixes and more added in the Serverless Framework v1.25 release."
date: 2017-12-21
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework_v1.25_1.jpg
category:
  - news
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework_v1.25_1.jpg" width="210px" >

Here at Serverless, we've been working hard to deliver some holiday goodies.

Today we're proud to announce Serverless Framework v1.25.


## Changes v1.25 introduces

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

### S3 Transfer Acceleration

Faster deployments? Yes, please!

This feature adds [S3 Transfer Acceleration](http://docs.aws.amazon.com/AmazonS3/latest/dev/transfer-acceleration.html) support for uploading your deployment packages to S3. Rather than uploading to your region's origin for S3, it uploads the package to CloudFront edge locations and quickly transfers it to S3.

To enable this new feature, use the `--aws-s3-accelerate` flag when deploying your service:

```bash
$ sls deploy --aws-s3-accelerate
```

In testing, we've seen huge speedups in package uploads. In an example test, this was **42%** faster than using the normal S3 upload for someone located in the target AWS region. When uploading to a different region (e.g. from Italy to us-west-2), we saw **10x** speedups! ⚡️

Much thanks to [Alex Casalboni](https://twitter.com/alex_casalboni) for adding this feature!

### API Gateway Endpoint Type Configuration

AWS recently announced [regional endpoints](https://aws.amazon.com/about-aws/whats-new/2017/11/amazon-api-gateway-supports-regional-api-endpoints/) for API Gateway. These endpoints are accessed from the same region where your API Gateway REST API is deployed. This enables a lot of interesting use cases, including multi-region Serverless applications with lower latency or the ability to use AWS WAF with your API Gateway REST APIs.

You can enable this feature using the `endpointType` property in the `provider` block of your `serverless.yml`:

```yml
# serverless.yml

provider:
  name: aws
  endpointType: regional
...
```

Serverless defaults to an EDGE endpoint, which was the standard before AWS released regional endpoints.

### Improved variable processing

For power users of the Framework, the variable resolution could cause some issues. There are a number of bug fixes related to the variable system including [support for circular references](https://github.com/serverless/serverless/pull/4144) and a [few](https://github.com/serverless/serverless/pull/4499) [different](https://github.com/serverless/serverless/pull/4294) [PRs](https://github.com/serverless/serverless/pull/4518) to better handle resolving variables that call out to external services like CloudFormation, SSM, or S3.

These are huge improvements to the power and stability of the Framework, and they're difficult to implement in a consistent, non-breaking way. We appreciate the hard work of our community members in these fixes, particularly Framework core maintainer [Frank Schmid](https://github.com/HyperBrain), [Benjamin Forster](https://github.com/e-e-e), and long-time user [Erik Erikson](https://github.com/erikerikson). Be sure to thank these fine folks for their contributions!

### Other enhancements & bug fixes

This release also includes tons of other improvements and bug fixes.

> Thank you very much for reporting bugs, opening issues and joining the discussions!

We hope that you enjoy this release! Feel free to provide some feedback in our [Forum](https://forum.serverless.com), via [Twitter](https://twitter.com/goserverless) or on [GitHub](https://github.com/serverless/serverless).

### Contributors

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make the Serverless Framework better.

Huge round of applause to all of the contributors who submitted changes for this release:

- Alex Casalboni
- Benjamin Forster
- Bill Wang
- Brendan Jurd
- Carlos Hernando Carasol
- Erik Erikson
- Farley
- Francisco Guimarães
- Frank Schmid
- Gary Richards
- Geoffrey Lancaster
- Hassan Khan
- Ivan Schwarz
- James Tharpe
- Jarrod Swift
- Jeffrey Noehren
- Michael Jalkio
- Rafal Wilinski
- Seiji Komatsu
- Sherif O
- Takahiro Horike
- Vlad Holubiev
- dbachko
- jeffnoehren
- liamgray
- raids
- sax

## Upcoming releases / contributions

In addition to the [1.26 milestone](https://github.com/serverless/serverless/milestone/41) and its Issues and PRs, we still have lots and lots of other [Issues](https://github.com/serverless/serverless/issues) and [PRs](https://github.com/serverless/serverless/pulls). We'd love to implement and introduce these in some of the upcoming releases.

> Do you want to help out and improve the Serverless Framework?

Great! We have lots of [issues](https://github.com/serverless/serverless/issues) where you could leave some feedback or jump directly into the implementation.

Additionally [PR reviews](https://github.com/serverless/serverless/pulls) are also highly welcomed as they greatly speed up the time-to-merge.

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples, or learn more about the Serverless Framework and serverless architectures in general.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can use to further enhance the capabilities of the Framework. You can find the full list at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
