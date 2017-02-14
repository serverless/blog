---
title: Trigger Lambda functions through CloudWatch Events with Serverless v1.7
description: CloudWatch Events support, CLI deprecation warnings, lower memory usage during zipping, bugfixes and improvements in the Serverless Framework v1.7 release.
date: 2017-02-14
layout: Post
authors:
  - PhilippMuns
---

We're happy to announce v1.7 of the Serverless Framework.

Let's take a look at the release highlights.

## Highlights of 1.7.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### CloudWatch Events support

Have you ever wanted to connect custom CloudWatch rules to fire your Lambda functions?

Serverless v1.7 has you covered and introduces the new `cloudwatchEvent` event source!

Here's an example how the new `cloudwatchEvent` can be used:

```yml
functions:
  notifier:
    handler: handler.notifier
    events:
      - cloudwatchEvent:
          event:
            source:
              - "aws.ec2"
            detail-type:
              - "EC2 Instance State-change Notification"
            detail:
               state:
                 - pending
```

You can find more about the new CloudWatch Event support in the [corresponding documentation](https://serverless.com/framework/docs/providers/aws/events/cloudwatch-event).

### Logging of upcoming deprecations

We heard you and we agree that introducing breaking changes can be pretty painful.

With this release we introduce logging messages which will show you what breaking changes will be introduced in the next release (v1.8 in this case).

You'll see them by default after upgrading to the new Serverless version but you can also disable them if you don't want to see them anymore.

The idea here is that we inform you about all the upcoming breaking changes we'll introduce in the next release.

This should give you enough time to update your codebase so that Serverless will run smoothly.

As usual we keep the breaking changes as minimal as possible so that updating from one version to the other shouldn't be too hard.

### Reduced memory footprint during zipping

Serverless is more and more used in CI / CD systems. Oftentimes the resources such as CPU or Memory of those system tend to be limited.

This release introduces a [one-line bugfix](https://github.com/serverless/serverless/pull/3220) which reduces the memory consumption during the zipping process by about ~40%.

This should e.g. make it easier for you to use Serverless on a less powerful machine (such as a CI / CD system).

### Enhancement and bug fixes

We've also fixed some nasty bugs and introduced some enhancements.

> Thanks for reporting bugs and opening issues to improve Serverless!

### Upcoming breaking changes

Here's a list of all the breaking changes which will be introduced in Serverless v1.8.

**Note:** You'll see the same list in the CLI if you run a Serverless command (and haven't disabled it).

- [BREAKING - Replace IamPolicyLambdaExecution with inline policies and added ManagedPolicyArns to fix VPC permissions](https://github.com/serverless/serverless/pull/2983)

*You'll always get the most recent list with breaking changes when you take a look at the [upcoming milestone](https://github.com/serverless/serverless/milestones) or in the Serverless CLI.*

### Contributors

This release contains lots of hard work from our awesome community and wouldn't have been possible without passionate people contributing to Serverless.

Here's a list of all the contributors who've PRed changes for this release:

- John Doe

### Get involved

Serverless has a really helpful, awesome and vibrant community. Do you want to help us develop the best Serverless toolings out there?

Congributing isn't just about code! Chime in on discussion, help with documentation updates or review PRs.

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

### Using "Scope" to contribute

Recently we've introduced our newest Open Source effort. It's called ["Scope"](https://github.com/serverless/scope) and is a tool that gives you a birdseye's view on your GitHub project.

We built this tool to scratch our own itch of maintaining and guiding through the development process of the Serverless Framework.

A deployed version for our Serverless Framework repository can be found here:

https://serverless.com/framework/status/

Here you can see all the current discussions, to-be-reviewed PRs and recently closed issues and PRs.

You can use this status board to see all the important stuff that's currently happening in the Framework development phase.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.8 milestone](https://github.com/serverless/serverless/milestone/23) to see what we've planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
