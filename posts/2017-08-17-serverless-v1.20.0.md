---
title: Serverless v1.20 - Enhancements, bug fixes and tweaks added
description: Enhancements, bug fixes and more added in the Serverless Framework v1.20 release.
date: 2017-08-17
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-release1.20.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-release1.20.png" width="210px" >

We're excited to announce Serverless Framework v1.20.

This is another release which mostly focuses on small enhancements and bug fixes. *Big* thanks to everyone in our community who reported bugs, opened issues and joined in on discussions.

## v1.20 Changelog

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

Thoughts or questions about the release? Feel free to provide some feedback in our [Forum](https://forum.serverless.com), via [Twitter](https://twitter.com/goserverless) or on [GitHub](https://github.com/serverless/serverless).

### Contributors 

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make the Serverless Framework better.

Huge round of applause to all of the contributors who submitted changes for this release:

- Alper
- Geoffrey Wiseman
- Len Boyette
- Martin Hartt
- Sebastien Bramille
- Sebastien Goasguen

## Upcoming releases / contributions

The Serverless Team is currently working on some exciting new projects which will be announced at [Emit conference](http://www.emitconference.com/) on August 17th.

As a result, upcoming Serverless releases will likely focus on bug fixes and minor enhancements. But thanks to you, our stellar community, we still have some cool stuff coming up.

In addition to the [1.21 milestone](https://github.com/serverless/serverless/milestone/36) and its Issues and PRs, we still have lots and lots of other [Issues](https://github.com/serverless/serverless/issues) and [PRs](https://github.com/serverless/serverless/pulls). We'd love to implement and introduce these in some of the upcoming releases.

> Do you want to help out and improve the Serverless Framework?

Great! We've compiled a list with some of the most wished features to make it easier for you to find areas where we could most use a hand.

### Deploy many micro/nano services to one API Gateway

[Issue #3078](https://github.com/serverless/serverless/issues/3078)

We already started a WIP implementation with the following [PR](https://github.com/serverless/serverless/pull/3934), but for now it only provides a partial solution. Do you have any ideas how we can improve the support for this feature?

### Unable to create services with a high resource count

[Issue #2387](https://github.com/serverless/serverless/issues/2387)

Services can grow significantly in size. We've worked on different solutions for this problem (see [this PR](https://github.com/serverless/serverless/pull/3504)) but we're still not 100% there yet.

### Support for AWS API Gateway Basic Request Validation

[Issue #3464](https://github.com/serverless/serverless/issues/3464)

We're currently looking for a way to implement basic request validation via raw CloudFormation.

### Let resources depend on the ApiGateway::Deployment

[Issue #2233](https://github.com/serverless/serverless/issues/2233)

The `ApiGateway::Deployment` resource has a random string in its name so that deployments are re-triggered on AWS end.

This makes it hard to create other CloudFormation resources which dependend on it.

### Skip resource if already exists

[Issue #3183](https://github.com/serverless/serverless/issues/3183)

It would be nice to skip resource delpoyments if the corresponding resource already exists (e.g. when using DynamoDB tables). Could you think of a reliable, production ready way that will detect which resources deployments could be skipped?

### Global arn parser with intrinsic functions (Ref, Fn::GetAtt, Fn::ImportValue, ...) support

[Issue #3212](https://github.com/serverless/serverless/issues/3212)

`arns` are used everywhere in CloudFormation. However some of our event sources don't support all the different types of intrinsic functions which can be used to reference `arns`.

It would be great to have a global `arn` parser which can be re-used throughout the whole codebase. This parser could also be exposed to the framework user e.g. via `this.provider.findAllCfReferences()`, so that plugin authors can benefit from this functionality as well.

### Other issues and PRs

This list is just a gist with some of the most wished features from our community.

We have lots of other [issues](https://github.com/serverless/serverless/issues) where you could leave some feedback or jump directly into the implementation.

Additionally [PR reviews](https://github.com/serverless/serverless/pulls) are also highly welcomed as they greatly speed up the time-to-merge.

## Emit Conference

[Emit](http://www.emitconference.com/) is today! We're meeting up at [The Pearl SF](http://thepearlsf.com/) to discuss the future of serverless architectures. Catch all the live-tweets with [#EmitConf](https://twitter.com/search?src=typd&q=%23emitconf), and/or follow Emit at [@emitconf](https://twitter.com/emitconf) and [@goserverless](https://twitter.com/goserverless). Subscribe to our newsletter to catch all the followup videos and blog posts.

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples, or learn more about the Serverless Framework and serverless architectures in general.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can use to further enhance the capabilities of the Framework. You can find the full list at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
