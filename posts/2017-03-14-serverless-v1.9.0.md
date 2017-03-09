---
title: Google Cloud Functions support with Serverless v1.9
description: Google Cloud Functions provider plugin, Separate package and deploy commands, bug fixes and improvements in the Serverless Framework v1.9 release.
date: 2017-03-14
layout: Post
authors:
  - PhilippMuns
---

We're proud to announce v1.9 of the Serverless Framework.

In v1.9 we're finally adding support for the recently announced Google Cloud Functions! Simply use our official [Serverless Google Cloud Functions plugin](https://github.com/serverless/serverless-google-cloudfunctions) to deploy to the Google Cloud with the Serverless Framework!

Let's take a dive into the release highlights.

## Highlights of 1.9.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Google Cloud Functions provider plugin

It's here! Google Cloud Functions support was added to the Serverless Framework!

Read our [announcement blog post](https://serverless.com/blog/google/) for more information.

You can finally use our official [Google Cloud Functions provider plugin](https://github.com/serverless/serverless-google-cloudfunctions) for the Serverless Framework to deploy your code into the Google Cloud!

Curious how this looks like? Here's a list with resources to help you get started:

1. [Quickstart guide](https://serverless.com/framework/docs/providers/google/guide/quickstart/)
2. [Serverless Google Cloud Functions documentation](https://serverless.com/framework/docs/providers/google/)
3. [HTTP example](https://github.com/serverless/examples/tree/master/google-node-simple-http-endpoint)

Let us know what you think!

**Pro tip:** Google Cloud offers a [free trial](https://console.cloud.google.com/freetrial) where you'll get a $300 credit.

### Top-Level References

https://github.com/serverless/serverless/pull/3208

### Allow DynamoDB and Kinesis streams to use GetAtt / ImportValue

https://github.com/serverless/serverless/pull/3111

### Package and deploy as single commands

### Enhancements & Bug Fixes

This release also fixes some other bugs and introduces some enhancements.

> Thanks for reporting bugs and opening issues!

### Upcoming Breaking Changes

Here's a list of all the breaking changes that will be introduced in Serverless v1.10.

**Note:** You'll see the same list in the CLI if you run a Serverless command (as long as you haven't disabled it).

There are currently no breaking changes planned for v1.10

*You'll always get the most recent list of breaking changes when you take a look at the [upcoming milestone](https://github.com/serverless/serverless/milestones) or in the Serverless CLI.*

### Contributors

This release contains lots of hard work from our awesome community and wouldn't have been possible without passionate people contributing to Serverless.

Here's a list of all the contributors who've submitted changes for this release:

- John Doe

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Do you want to help us develop the best Serverless tooling out there?

Contributing isn't just about code! Chime in on discussion, help with documentation updates or review PRs.

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

### Using "Scope" to Contribute

We use our own Serverless Open Source tool called ["Scope"](https://github.com/serverless/scope) to manage the Frameworks development process:

[Serverless Framework Status Board](https://serverless.com/framework/status/)

Here you can see all the current discussions, to-be-reviewed PRs and recently closed issues and PRs.

You can use this status board to see all the important things currently happening in the Framework development phase.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.10 milestone](https://github.com/serverless/serverless/milestone/25) to see what we've planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
