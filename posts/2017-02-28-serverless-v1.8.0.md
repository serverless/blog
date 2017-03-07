---
title: Azure Functions Support with Serverless v1.8
description: Azure functions provider plugin, inline policies, bug fixes and improvements in the Serverless Framework v1.8 release.
date: 2017-02-28
layout: Post
authors:
  - PhilippMuns
---

Today we're proud to announce v1.8 of the Serverless Framework.

v1.8 is yet another special release since we're officially introducing support for Azure via the [Serverless Azure functions plugin](https://github.com/serverless/serverless-azure-functions)!

Let's take a deep dive into the highlights of this release.

## Highlights of 1.8.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Azure functions provider plugin

It finally arrived. The next provider support for the Serverless Framework is here!

We're proud to announce the official [Azure functions provider plugin](https://github.com/serverless/serverless-azure-functions) for the Serverless Framework!

You can read the [announcement blog post](https://serverless.com/blog/azure-functions-and-possibility/) for more information.

Now you're able to write and deploy Azure function applications with the help of the Serverless Framework. Curious what this looks like? Here are some resources to help you get started:

1. [Quickstart guide](https://serverless.com/framework/docs/providers/azure/guide/quickstart/)
2. [Serverless Azure Functions documentation](https://serverless.com/framework/docs/providers/azure/)
3. [HTTP example](https://github.com/serverless/examples/tree/master/azure-node-simple-http-endpoint)

Give it a spin and let us know what you think!

**Pro tip:** Sign up via the [free trial](https://azure.microsoft.com/en-us/free/) to get a whopping $200 of free credit.

### BREAKING - Introducing inline policies

Until now we've created a separate `IamPolicyLambdaExecution` resource so that your Lambda functions can interact and execute code appropriately.

[PR #2983](https://github.com/serverless/serverless/pull/2983) updates this behavior so that inline policies are used rather than a separate CloudFormation resource.

This change fixes a bunch of related issues with e.g. VPC setups.

**Note:** This is a breaking change which affects all users / plugin authors who reference the `IamPolicyLambdaExecution` resource since it's removed in v1.8.

### Fix file streams during zipping

Recently we've switched from a memory intensive `fs.readFileSync` implementation to a `fs.createReadStream` implementation for the code zipping (see [#3220](https://github.com/serverless/serverless/pull/3220/files)).

This change reduced the memory footprint by about ~40% which is important when Serverless is used on low power hardware like CI / CD systems or virtual machines.

Unfortunately this fix creates another problem. Old Node versions tend to keep too many files open which results in an error during the zipping process (see [#3249](https://github.com/serverless/serverless/issues/3249)).

We've tried different approaches to provide a quick fix for this issue. One was to use the [`graceful-fs`](https://github.com/isaacs/node-graceful-fs) npm package to wrap the `fs.createReadStream` usage. However, those solutions weren't sufficient enough to get into a stable state again.

For v1.8 we decided to switch back to `fs.readFileSync` (see [#3310](https://github.com/serverless/serverless/pull/3310)) and investigate further.

This is just a temporary fix. We'll work on a long term fix so that a read stream is used again to reduce the memory usage.

Have some ideas about how we can solve this and want to help? Here's the corresponding issue where we capture the progress: [#3311](https://github.com/serverless/serverless/issues/3311)!

### Fix monitorStack freezing bug

We were finally able to reproduce a nasty bug which caused Serverless deployments to freeze in the `Checking Stack update progress...` status.

This problem was introduced due to a clock drift where the time of your local machine is slightly in the future causing AWS server to report incorrect updates about your CloudFormation status.

Luckily we were able to [fix this](https://github.com/serverless/serverless/pull/3297) in a way where the status checking is not dependent on your local machines time anymore.

### BREAKING - Different displaying of function name in info command

New users coming to the Serverless Framework faced some issues with the different names the function is refered to on their local machine vs. AWS.

We decided to update the `info` plugin so that both names are shown. The functions name in `serverless.yml` and the name of the deployed function on AWS.

Here's an example output how this looks like:

```
Service Information
service: service
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  GET - https://foo.execute-api.us-east-1.amazonaws.com/dev/goodbye
functions:
  hello: service-dev-hello
  goodbye: service-dev-goodbye
```

### Enhancements & Bug Fixes

This release also fixes some other bugs and introduces some enhancements.

> Thanks for reporting bugs and opening issues!

### Upcoming Breaking Changes

Here's a list of all the breaking changes that will be introduced in Serverless v1.9.

**Note:** You'll see the same list in the CLI if you run a Serverless command (as long as you haven't disabled it).

There are currently no breaking changes planned for v1.9

*You'll always get the most recent list of breaking changes when you take a look at the [upcoming milestone](https://github.com/serverless/serverless/milestones) or in the Serverless CLI.*

### Contributors

This release contains lots of hard work from our awesome community and wouldn't have been possible without passionate people contributing to Serverless.

Here's a list of all the contributors who've PR'd changes for this release:

- Andrey Tserkus
- Ben Berman
- Bruno Belotti
- Christoph Gysin
- Christopher Anderson
- Colby M. White
- Danny Cohn
- Gert Jansen van Rensburg
- John Gossman
- Jonathan Goldwasser
- Nick den Engelsman

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Do you want to help us develop the best Serverless tooling out there?

Contributing isn't just about code! Chime in on discussion, help with documentation updates or review PRs.

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

### Using "Scope" to Contribute

We use our own Serverless Open Source tool called ["Scope"](https://github.com/serverless/scope) to manage the Frameworks development process:

https://serverless.com/framework/status/

Here you can see all the current discussions, to-be-reviewed PRs and recently closed issues and PRs.

You can use this status board to see all the important things currently happening in the Framework development phase.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.9 milestone](https://github.com/serverless/serverless/milestone/24) to see what we've planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
