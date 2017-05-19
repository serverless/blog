---
title: Google Cloud Functions support added in Serverless v1.14 deploy your functions to the Google Cloud
description: Google Cloud Functions, Rollback function, DeadLetterConfig, Automatic stack splitting, Login command and more in the Serverless Framework v1.14 release.
date: 2017-05-24
layout: Post
authors:
  - PhilippMuns
---

We're thrilled to announce the v1.14 release of the Serverless Framework!

This release is yet another special one since we're officially announcing our Google Cloud Functions integration with the Serverless Framework.

But this isn't everything we've been working on. Let's take a look at the full feature set v1.14 introduces.

## Highlights of 1.14.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Google Cloud Functions support

- https://github.com/serverless/serverless/pull/3365
- https://github.com/serverless/serverless-google-cloudfunctions

### Rollback function support

- https://github.com/serverless/serverless/pull/3571

### DeadLetterConfig support

- https://github.com/serverless/serverless/pull/3609

### Automatic stack splitting to mitigate resource limitations (experimental)

- https://github.com/serverless/serverless/pull/3504

### Login command

- https://github.com/serverless/serverless/pull/3558

### Support for `s3` variables

- https://github.com/serverless/serverless/pull/3592

### More API Gateway integration types and AWS_IAM auth support

- https://github.com/serverless/serverless/pull/3534

### Access to `IS_LOCAL` environment variable during local invocation

- https://github.com/serverless/serverless/pull/3642

### Enhancements & Bug Fixes

This release also includes a bunch of bug fixes and several enhancements.

> Thanks for reporting bugs and opening issues!

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

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.15 milestone](https://github.com/serverless/serverless/milestone/30) to see what we have planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can install and therefore enhance the capabilities of the Framework.

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins)

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
