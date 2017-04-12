---
title: Separate Package and Deploy command, CloudWatch Log event support with Serverless v1.11
description: New package command, CloudWatch Log event support, and more in the Serverless Framework v1.11 release.
date: 2017-04-12
layout: Post
authors:
  - PhilippMuns
---

We're proud to announce that we've just released v1.11 of the Serverless Framework!

Let's take a look at all the new features.

## Highlights of 1.11.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Separate `package` and `deploy` command

It finally arrived! Serverless now has the separation between the packaging and deployment of your Serverless service!

This gives you more control over the build process which will also improve CI / CD usage in combination with the Serverless Framework.

Let's take a closer look how this feature works:

#### The `package` command

The `package` command gives you a way to just package the service artifacts.

Running the following command will build and save all the deployment artifacts in the services `.serverless` directory:

```bash
serverless package
```

However you can also add a path to the destination directory where you want Serverless to store your deployment artifacts:

```bash
serverless package --package my-artifacts
```

This way Serverless will store the deployment artifacts in the `my-artifacts` directory.

#### The updated `deploy` command

The simple deployment process was not changed. It still packages your artifacts and store them in the services `.serverless` directory:

```bash
serverless deploy
```

However you're now able to specify which package you want to use (if you've created different ones with the `package` command beforehand):

```bash
serverless deploy --package my-artifacts
```

Furthermore you can speficy the package you want to deploy in your `serverless.yml` file like this:

```yml
package:
  path: my-artiacts
```

Serverless will now use this path automatically if you run the `deploy` command **without** the `--package` option:

```bash
serverless deploy
```

### CloudWatch Log event source

https://github.com/serverless/serverless/issues/3399
https://github.com/serverless/serverless/pull/3407

### Mark functions to be packaged individually

https://github.com/serverless/serverless/pull/3433

### An important note for plugin authors

The separation of the `package` and `deploy` command was a tough one since our goal was to introduce this change in a non-breaking way.

[Frank Schmid](https://github.com/HyperBrain) worked really hard on new concepts around our core plugin system to help plugin authors deprecate and redirect lifecycle usages. This makes it possible to use both, old lifecycle events and new lifecycle events alongside each other.

This release includes the option to show a warning message if a plugin hooks into deprecated lifecycle events.

You need to enable this warning by setting the `SLS_DEBUG=*` system environment variable. After setting this you'll see a message in the console every time your plugin uses an old lifecycle event.

**We encourage all plugin authors to quickly enable the debugging information and check if their plugin uses old, deprecated lifecycle events.**

You can see all the deprecated lifecycle events Serverless introduces with v1.11 [here](https://github.com/serverless/serverless/blob/f5c7f2fa13975560746c0c40cda2077ab09c7353/lib/plugins/deploy/deploy.js#L11-L16).

This also shows how the redirection of deprecated lifecycle events works. So you can now use the same mechanism to deprecate your own plugin lifecycle events.

You can get more information why this was needed and how this works behind the scenes by reading [Franks gist](https://gist.github.com/pmuens/fb113cf21ee2d70696e4b7f31384404b) about the lifecycle changes.

### Enhancements & Bug Fixes

This release also includes bugfixes and introduces several enhancements.

> Thanks for reporting bugs and opening issues!

### Contributors

This release contains lots of hard work from our awesome community and wouldn't have been possible without passionate people who decided to spent their time to contributing and make Serverless better.

Here's a list of all the contributors who've submitted changes for this release:

- John Doe

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Want to help us build the best Serverless tooling out there?

Contributing isn't just about code! Chime in on [discussions](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback), help with [documentation updates](https://github.com/serverless/serverless/labels/kind%2Fdocs) or [review Pull Requests](https://github.com/serverless/serverless/pulls).

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

Furthermore we're always seeking feedback from our community to build the features in the best way possible. [Here's a list](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) with issues where we need your feedback and insights in your real world usage of Serverless.

### Using "Scope" to Contribute

We use our own Serverless open Source tool called ["Scope"](https://github.com/serverless/scope) to manage the Frameworks development process:

[Serverless Framework Status Board](https://serverless.com/framework/status/)

Here you can see all the current discussions, to-be-reviewed PRs and recently closed issues and PRs.

You can use this status board to see all the important things currently happening in the Framework development phase.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.12 milestone](https://github.com/serverless/serverless/milestone/27) to see what we've planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
