---
title: Serverless v1.18 - Existing API Gateway support, request parameter support for Lambda Proxy added
description: Support to existing API Gateways across services, request parameters for Lambda Proxy and more added in the Serverless Framework v1.18 release.
date: 2017-07-19
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-release-1.18.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-release-1.18.png" width="210px" >

Toaday we're excited to announce the new Serverless Frameowrk v1.18 release!

The v1.18 mostly focuses on enhancements and bugfixes. Let's take a look at some of the changes v1.18 introduces.

## Noteable changes v1.18 introduces

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file or watch the video below.

### Request parameter support for Lambda Proxy integration

https://github.com/serverless/serverless/pull/3722

### Add default value for plugin options

https://github.com/serverless/serverless/pull/3808

### Add support to use whole JavaScript files via Serverless Variables

https://github.com/serverless/serverless/pull/3842

### Support for absolute paths in Serverless Variables

https://github.com/serverless/serverless/pull/3888

### Other enhancements & bug fixes

This release also includes tons of other improvements and bug fixes.

> Thank you very much for reporting bugs, opening issues and joining the discussions!

### Contributors 

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make Serverless better.

Thank you to all of the contributors who submitted changes for this release:

- John Doe

## Upcoming releases and contributions

The Serverless Team is currently working on exciting new projects we'll announce at the [Emit conference](http://www.emitconference.com/) in August!

That's why upcoming Serverless releases will mostly include bug fixes and minor enhancements.

In addition to the [1.19 milestone](https://github.com/serverless/serverless/milestone/34) Issues and PRs we still have lots and lots of other [Issues](https://github.com/serverless/serverless/issues) and [PRs](https://github.com/serverless/serverless/pulls) we'd love to implement and introduce in some of the upcoming releases!

> Do you want to improve the Serverless Framework?

Great! Our lovely and welcoming community is here to help you contribute to the Serverless Framework.

We've compiled a list with some of the most wished features to make it easier for you to find areas where help is greatly appreciated:


### Deploy many micro/nano services to one API Gateway

[Issue #3078](https://github.com/serverless/serverless/issues/3078)

We currently have [this PR](https://github.com/serverless/serverless/pull/3934) which provides a partial solution for the problem. However we're still facing some problems here.

### Unable to create services with a high resource count

[Issue #2387](https://github.com/serverless/serverless/issues/2387)

Services can grow in size significantly. We've worked on different solutions for this (see [this PR](https://github.com/serverless/serverless/pull/3504)) however we're still not 100% there yet.

Do you have a good idea how we can solve this problem?

### Support for AWS API Gateway Basic Request Validation

[Issue #3464](https://github.com/serverless/serverless/issues/3464)

We're looking for a way to implement basic request validation via CloudFormation.

### Let resources depend on the ApiGateway::Deployment

[Issue #2233](https://github.com/serverless/serverless/issues/2233)

The `ApiGateway::Deployment` resource has a random string in its name so that deployments are re-triggered on AWS end.

This makes it hard to create resources which are dependent on it.

### Skip resource if already exists

[Issue #3183](https://github.com/serverless/serverless/issues/3183)

It would be nice to skip resource delpoyments if the resources already exists (e.g. when using DynamoDB tables) to prevent errors.

### Global arn parser with intrinsic functions (Ref, Fn::GetAtt, Fn::ImportValue, ...) support

[Issue #3212](https://github.com/serverless/serverless/issues/3212)

`arns` are used everywhere. However some of our event sources still don't support all the different types of intrinsic functions which can be used to reference `arns`.

It would be great to have a global `arn` parser which can be re-used throughout the whole codebase. Futhermore this parser could be exposed to the user e.g. via `this.provider.findAllCfReferences()` so that plugin authors can benefit from this functionality as well.

However that's not everything! We have lots of other [issues](https://github.com/serverless/serverless/issues) where you could leave some feedback. Additionally [PR reviews](https://github.com/serverless/serverless/pulls) are also highly welcomed as they greatly speed up the "time-to-merge".

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about the Serverless Framework and serverless architectures in general.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can install and therefore enhance the capabilities of the Framework.

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
