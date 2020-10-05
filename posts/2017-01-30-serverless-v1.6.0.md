---
title: Introducing OpenWhisk support, Python for invoke local in Serverless Framework v1.6
description: Launching multi-provider support with the OpenWhisk provider plugin, Python for invoke local in the Serverless Framework v1.6 release.
date: 2017-01-30
layout: Post
authors:
  - PhilippMuns
---

Today we're thrilled to announce the release of the Serverless Framework v1.6.0.

This release is a special one as it's the first version to include official support for a new provider: [OpenWhisk](http://openwhisk.org).

Furthermore, we've added a bunch of new features and enhancement you'll enjoy! Let's take a look at the highlights of this release.

## Highlights of 1.6.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### OpenWhisk support

Serverless v1.6 is the first version that officially supports a different provider besides AWS!

From now on you can also write Serverless applications for [OpenWhisk](http://openwhisk.org)!

The only thing you need to do is to install the [Serverless OpenWhisk plugin](https://github.com/serverless/serverless-openwhisk):

```bash
serverless install -g serverless-openwhisk
```

And create a new service based upon the OpenWhisk template:

```bash
serverless create --template openwhisk-nodejs
```

We recommend checking out the [OpenWhisk documentation](https://serverless.com/framework/docs/providers/openwhisk/guide/) and the ["Hello World" example](https://github.com/serverless/serverless/tree/master/docs/providers/openwhisk/examples/hello-world) to get started!

There's also an [example application](https://github.com/serverless/examples/tree/master/openwhisk-node-simple) in the [Serverless examples](https://github.com/serverless/examples) repository.

### Python support for invoke local command

Back in v1.1 we introduced the "invoke local" plugin so that you can invoke your Serverless functions locally.

We started with support for the Node.js runtime, but got immediate feedback that Python should be supported as well.

Today we're happy to announce that "invoke local" now supports the Python runtime!

Next up is Java!

Do you have expertise with Java? Great! Please chime in on the discussion about [local Java invocation](https://github.com/serverless/serverless/issues/2864) so that we can add support for this runtime in one of the next releases!

### Optional Lambda versioning

Versioning your Lambda function has been an often requested feature for production environments. In 1.3 we added this feature and introduced Lambda versioning on every deplot. Lambda versioning is turned on by default.

However, sometimes you don't want to version your Lambdas. v1.6 introduces a simple way to disable Lambda versioning.

Simply add the `versionFunctions` property to the provider section and set it to `false`:

```yml
provider:
  versionFunctions: false
```

This will turn off Lambda versioning upon the next deployment.

### Significant reduction of CloudFormation Outputs

In the past Serverless added a bunch of different `Outputs` to the CloudFormation template. This caused some problems with large services since limts for CloudFormation Outputs were reached frequently.

The possibility to opt out of Lambda versioning (which creates an output for your Lambda version) and the removal of the functions `arn` displaying in the "info" plugin will reduce the `Output` count significantly.

These changes, available in v1.6, should make it possible to write and deploy larger Serverless services.

### Reduce memory consumption on deploy by ~50%

Deployments had a huge memory footprint when uploading the artifacts to the S3 bucket. This memory consumption was reduced by ~50%.

Take a look at the [Pull Request](https://github.com/serverless/serverless/pull/3145/files) to see how changing one line of code can make a huge difference in performance.

### Support for SNS subscriptions to existing topics

Until now you needed to sign into the AWS console and add a permission manually so that your Lambda function can be called with the help of your existing SNS topic.

A Pull Request which was merged in v1.6 makes it possible to specify just the ARN to the SNS topic and Serverless will create the permission automatically.

### Enhancement and bug fixes

This time we've fixes lots of nasty bugs and reworked some functionalities behind the scenes.

As usual:

> Thanks for reporting the bugs and opening issues to improve Serverless!

### Breaking changes

We're making a slight change and won't follow strict semver anymore.

Starting today, there may be breaking changes in every release. However, we keep the breaking changes as minimal and as painless as possible.

Furthermore, we'll include guides to show you how to migrate your current codebase in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md). Take a look [here](https://github.com/serverless/serverless/blob/master/CHANGELOG.md#160-30012017) for the v1.6 migration guides.

Here's a list of all the breaking changes in this release:

- [BREAKING - Remove getStackName() method](https://github.com/serverless/serverless/pull/3128)
- [BREAKING - Create Log Group Resources By Default](https://github.com/serverless/serverless/pull/3155)
- [BREAKING - Refactor function arn generation for info plugin](https://github.com/serverless/serverless/pull/3125)
- [BREAKING - Remove defaults service property](https://github.com/serverless/serverless/pull/3130)

### Contributors

This release contains lots of work from our awesome community and wouldn't have been possible without passionate people contributing to Serverless.

Here's a list of all the contributors who submitted changes to the codebase in this release:

- Alasdair Nicol
- Andrew Sprouse
- Chris Anderson
- Daniel Schep
- Dave Townsend
- Doug Moscrop
- Eetu Tuomala
- Erik Erikson
- Fabien Ruffin
- James Thomas
- Luke Childs
- Rasmus Faddersbøll
- Ryan S. Brown
- Ryan Stelly
- Sergey Semyonov
- Vlad Golubev
- domharrington
- horike37
- payoub

### Get involved

Serverless has an awesome and vibrant community. Do you want to help us develop the best Serverless tools out there?

Congributing isn't just writing code! Chime in on discussion, help with documentation updates or review PRs.

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.7 milestone](https://github.com/serverless/serverless/milestone/22) to see what we're working on for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
