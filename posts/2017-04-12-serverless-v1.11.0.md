---
title: Improved CI / CD support with new package command, CloudWatch Log event support with Serverless v1.11
description: New package command, CloudWatch Log event support, and more in the Serverless Framework v1.11 release.
date: 2017-04-12
layout: Post
authors:
  - PhilippMuns
---

We're proud to announce that we've just released v1.11 of the Serverless Framework!

Let's take a look at all the new features and improvements.

## Highlights of 1.11.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Separate `package` and `deploy` command

It finally arrived! Serverless v1.11 introduces a way to separate the packaging step from the deployment of your service!

This gives you more control over the build process which will also improve CI / CD usage in combination with the Serverless Framework.

Let's take a closer look how we can make use of this new feature.

#### The `package` command

The `package` command enables you a way to package all your service artifacts and store the on your disk.

Running the following command will build and save all the deployment artifacts in the services `.serverless` directory:

```bash
serverless package
```

However you can also use the `--package` option to add a destination path and Serverless will store your deployment artifacts there (`./my-artifacts` in the following case):

```bash
serverless package --package my-artifacts
```

#### The updated `deploy` command

The "simple" deployment process via `serverless deploy` was not changed. It will still package all your artifacts, store them in the `.serverless` directory and deploy your service after that:

```bash
serverless deploy
```

However you're now able to use the `--package` option to specify which package you want to use for deployment:

**Note:** This package needs to be created (e.g. with the `serverless package` command) and therefore available beforehand.

```bash
serverless deploy --package my-artifacts
```

Furthermore you can set the path to the package directory in your `serverless.yml` file like this:

```yml
package:
  path: my-artiacts
```

Serverless will now use this path automatically if you run the `deploy` command **without** the `--package` option:

```bash
serverless deploy
```

### CloudWatch Log event source

Ever wanted to call a Lambda function when something happens in one of your log groups? Serverless v1.11 introduces native support for `CloudWatch Log` events!

Here's an example configuration which will trigger the `alarm` Lambda function whenever something in the `/aws/lambda/alarms` log group happens:

```yml
functions:
  alarm:
    handler: handler.alarm
    events:
      - cloudwatchLog: '/aws/lambda/alarms'
```

You can also add a `filter` configuration so that the Lambda function is only triggered when the appended log in your log group matches the `filter`:

```yml
functions:
  notify:
    handler: handler.user
    events:
      - cloudwatchLog:
          logGroup: '/aws/lambda/users'
          filter: '{$.userIdentity.type = Root}'
```

You can read more about this new event source in the [`cloudwatchLog` docs](https://serverless.com/framework/docs/providers/aws/events/cloudwatch-log/).

### Mark functions to be packaged individually

Serverless supports the ability to package functions individually for a long time. You could enable this feature by setting the `individually: true` configuration in the `package` service property:

```yml
package:
  individually: true
```

The problem with this approach is that it's "all-or-nothing" which means that you can either let Serverless package your whole service as one large `.zip` file (the default behavior) or one `.zip` file per function (by using the `individually: true` config), but nothing in between.

Serverless v1.11 solves this problem and let's you use the `individually: true` configuration on a function level.

The following example will create one service-wide `service.zip` file, but also one `world.zip` file for the `world` function:

```yml
service: service

functions:
  hello:
    handler: handler.hello
  world:
    handler: handler.hello
    package:
      individually: true
```

### An important note for plugin authors

The separation of the `package` and `deploy` command was a tough one since our goal was to introduce this change in a non-breaking way.

[Frank Schmid](https://github.com/HyperBrain) worked really hard on new concepts around our core plugin system to help plugin authors deprecate and redirect lifecycle usages. This makes it possible to use both old lifecycle events and new lifecycle events alongside each other.

This release includes the option to show a warning message if a plugin hooks into deprecated lifecycle events.

Showing this warning message is disabled bu default. You need to enable it by setting the `SLS_DEBUG=*` system environment variable.

After setting this you'll see a message in the console every time your plugin uses an old lifecycle event.

**We encourage all plugin authors to enable the debugging information and check if their plugin uses old, deprecated lifecycle events.**

You can see all the deprecated lifecycle events with their corresponding redirections Serverless introduces with v1.11 [here](https://github.com/serverless/serverless/blob/f5c7f2fa13975560746c0c40cda2077ab09c7353/lib/plugins/deploy/deploy.js#L11-L16).

Those lines of code also show how the redirection of deprecated lifecycle events works. So you can now use the same mechanism to deprecate your own plugin lifecycle events.

Interested in more about this topic? Read [Franks gist](https://gist.github.com/pmuens/fb113cf21ee2d70696e4b7f31384404b) to learn why this was needed and how this works behind the scenes.

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
