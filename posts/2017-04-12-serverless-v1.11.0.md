---
title: New in Serverless v1.11 - Trigger Functions with CloudWatch Events
description: Trigger Lambdas through CloudWatch Logs, plus more new features in the Serverless Framework v1.11 release.
date: 2017-04-12
layout: Post
authors:
  - PhilippMuns
---

We're excited to announce that we've just released v1.11 of the Serverless Framework!

Here's an overview of the new features and improvements.

## Highlights of 1.11.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### CloudWatch Log event source

Have you ever wanted to call a Lambda function when something happens in one of your log groups? Serverless v1.11 introduces native support for `CloudWatch Log` events!

Here's an example configuration that will trigger the `alarm` Lambda function whenever something in the `/aws/lambda/alarms` log group happens:

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

Serverless has supported the ability to package functions individually for a while now. You could enable this feature by setting the `individually: true` configuration in the `package` service property:

```yml
package:
  individually: true
```

The drawback with this approach is that it's all-or-nothing. You can either let Serverless package your whole service as one large `.zip` file (the default behavior) or one `.zip` file per function (by using the `individually: true` config), but nothing in between.

Serverless v1.11 resolves this issue and let's you use the `individually: true` configuration on a function level.

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

### Description for Lambda versions

Lamdba versions will now pick up the function's description if you've provided one in your `serverless.yml` file.

This will make it easier to find specific versions if you want to e.g. rollback.

Here's a quick refresher on how you can use function descriptions:

```yml
service: service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello
    description: Prints out and logs a "Hello World"
```

### Enhancements & Bug Fixes

This release also includes bug fixes and introduces several enhancements.

> Thanks for reporting bugs and opening issues!

### Contributors

This release contains lots of hard work from our awesome community, and wouldn't have been possible without passionate people who decided to spend their time contributing to make Serverless better.

Thank You to all of the contributors who submitted changes for this release:

- Avindu
- Chris LeBlanc
- Ericbear
- Jérémy Benoist
- Kevin Rambaud
- horike37

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Want to help us build the best Serverless tooling out there?

Contributing isn't just about code! Chime in on [discussions](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback), help with [documentation updates](https://github.com/serverless/serverless/labels/kind%2Fdocs) or [review Pull Requests](https://github.com/serverless/serverless/pulls).

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

Furthermore, we're always seeking feedback from our community to build the features in the best way possible. [Here's a list](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) with issues where we need your feedback and insights in your real world usage of Serverless.

### Using "Scope" to Contribute

We use our own Serverless open source tool called ["Scope"](https://github.com/serverless/scope) to manage the Framework's development process:

[Serverless Framework Status Board](https://serverless.com/framework/status/)

Here you can see all the current discussions, to-be-reviewed PRs and recently closed issues and PRs.

You can use this status board to see all the important things currently happening in the Framework development phase.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.12 milestone](https://github.com/serverless/serverless/milestone/27) to see what we've planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
