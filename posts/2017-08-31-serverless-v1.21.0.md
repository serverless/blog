---
title: Serverless v1.21 - Kubeless provider support, AWS credentials management and invoke improvements added
description: Kubeless support, AWS credentials management, new AWS service templates, invoke improvements, enhancements, bug fixes and more added in the Serverless Framework v1.21 release.
date: 2017-08-31
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-v1.21.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-v1.21.png" width="210px" >

It's been a wild two weeks, everyone.

We not only held [Emit](http://www.emitconference.com/), but showed up with a [whole new look and logo](https://serverless.com), too. If you weren't there, rest easy. Videos of Emit talks are on their way, and the [speaker slides are already up](https://serverless.com/blog/key-takeaways-for-the-future-of-serverless-emit-2017/).

We also announced our new open-source project, [Event Gateway](https://serverless.com/event-gateway/) and the [`serverless run`](https://serverless.com/framework/docs/platform/commands/run/) integration.

What we're trying to say is: sorry for the temporary lull in new action-packed features for the past couple of releases. But this week, we're back! Please enjoy a really nice feature-set for the Serverless Framework v1.21 release.

## Noteable changes v1.21 introduces

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

### Kubeless provider support

We're thrilled to announce that [Kubeless](http://kubeless.io/) provider support has just landed in the Serverless Framework!

Kubeless is a Kubernetes-Native framework developed by [Bitnami](https://bitnami.com/) which makes it possible to provision and run serverless functions atop [Kubernetes](https://kubernetes.io/).

You can create a new `kubeless` service with the help of the `kubeless-nodejs` or `kubeless-python` service templates:

```bash
serverless create --template kubeless-nodejs --path my-kubeless-service
```

Make sure to read the [announcement blog post](https://serverless.com/blog/serverless-and-kubernetes-via-kubeless/) (which includes a nice showcase video) and check out their [plugin repository](https://github.com/serverless/serverless-kubeless).

### Raw data passing for `invoke` and `invoke local`

The `invoke` and `invoke local` commands make it easy to invoke and test-drive remote or local functions with custom input.

All the input data is automatically parsed as JSON and handed over to the function as it corresponding input data.

Sometimes you want to have more control over the way the input data reaches your functions. This is why a `--raw` flag was added to `invoke` and `invoke local`.

Using this flag makes it possible to pass in the invocation data as is without any automatic transformations.

Here's an example how this `--raw` option can be used in practice:

```bash
serverless invoke --function my_function --data '{"foo":"bar"}' --raw
```

### Support for custom `context` in `invoke local`

One function parameter which is automatically passed into your Lambda functions is the `context` parameter which encapsulates all the information about the current context of the functions invocation.

It includes information such as e.g. the `logGroupName` or `functionVersion`.

With `invoke local` we've implemented a fixed mock object which contains all the information AWS also passes in your Lambda function when it's invoked on their end. This makes the experience comparable to AWS even if the function is just invoked locally.

While this `context` object is always passed in as the default it's now possible to specify an own `context` object with the help of the `--context` and `--contextPath` options.

Let's take a look how this `context` object works in practice:

```bash
serverless invoke local --function my_function --context '{ "data": 1 }'
```

You could also use a path to a file which describes your `context`:

```bash
serverless invoke local --function my_function --contextPath ./custom-context.json
```

### Update AWS profiles through Serverless CLI

Back in an earlier version of Serverless, we added support to set up provider credentials with the help of the Serverless CLI.

This streamlines the onboarding experience and lets you do the account configuration with Serverless rather than having to install and use the providers CLI tool.

For example setting up AWS credentials is as easy as:

```bash
serverless config credentials --provider aws --key AKIAIOSFODNN7EXAMPLE --secret wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY
```

Serverless v1.21 introduces an enhancement for this `config credentials` command. You are now able to update existing profiles through the Serverless CLI.

The `--overwrite` flag is necessary if you want to update an existing profile. It signals that this is a "dangerous" operation and helps preventing unintended changes:

```bash
serverless config credentials --provider aws --key 1234 --secret 5678 --profile custom-profile --overwrite
```

### Display stack name in `info`

Large serverless applications are usually compositions of individual serverless services. That's where the `info` plugin comes in handy as it shows important information about the service the user is currently working on.

Serverless v1.21 has a slight improvement for the `info` plugin so that the stack name is now displayed as well.

This makes it easier to see and understand which stack information is currently displayed on your terminal.

### TypeScript and ECMAScript AWS service templates

Serverless v1.21 ships with two new service templates for AWS:

- `aws-nodejs-ecma-script`
- `aws-nodejs-typescript`

Creating new services with the templates is as easy as:

```bash
serverless create --template aws-nodejs-ecma-script
```

or:

```bash
serverless create --template aws-nodejs-typescript
```

### Other enhancements & bug fixes

This release also includes tons of other improvements and bug fixes.

> Thank you very much for reporting bugs, opening issues and joining the discussions!

We hope that you enjoy this release! Feel free to provide some feedback in our [Forum](https://forum.serverless.com), via [Twitter](https://twitter.com/goserverless) or on [GitHub](https://github.com/serverless/serverless).

### Contributors 

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make the Serverless Framework better.

Huge round of applause to all of the contributors who submitted changes for this release:

- Ara Pulido
- Daniel Schep
- Dmitri Zimine
- Eoin Shanaghy
- Francisco Guimarães
- Gharsallah Mohamed
- Jacob Massey
- James Thomas
- Loren Gordon
- Mariusz Nowak
- Rafal Wilinski
- Sebastien Goasguen
- Seth
- Toby Hede
- Tommy Brunn
- Vlad Holubiev
- alokmandloi
- guyklainer
- mpuittinen
- patrickheeney

## Upcoming releases / contributions

In addition to the [1.22 milestone](https://github.com/serverless/serverless/milestone/37) and its Issues and PRs, we still have lots and lots of other [Issues](https://github.com/serverless/serverless/issues) and [PRs](https://github.com/serverless/serverless/pulls). We'd love to implement and introduce these in some of the upcoming releases.

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

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples, or learn more about the Serverless Framework and serverless architectures in general.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can use to further enhance the capabilities of the Framework. You can find the full list at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
