---
title: Stream event improvements and custom roles for CloudFormation deployments with Serverless v1.9
description: Serverless variable system and stream event enhancements, CloudFormation services roles in the Serverless Framework v1.9 release.
date: 2017-03-14
layout: Post
authors:
  - PhilippMuns
---

Today we're happy to announce v1.9 of the Serverless Framework.

Let's take a dive into the release highlights.

## Highlights of 1.9.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Allow DynamoDB and Kinesis streams to use GetAtt / ImportValue

Streams like Kinesis Streams or DynamoDB Streams are often used as event sources in serverless architectures. They make it easy to build awesome data pipelining architectures and process a huge amount of data in a serverless manner.

The Serverless Framework introduced support for the `stream` event a while back. Version 1.9 adds a nice new feature that makes it possible to reference stream sources with the help of `GetAtt` or `ImportValue`.

This way you could essentially define the stream as a CloudFormation resource in the `resources` section and reference it directly in your `serverless.yml` file.

Here's an example of what this looks like:

```yml
functions:
  hello:
    handler: handler.hello
    events:
      - stream:
          type: kinesis
          arn:
            Fn::GetAtt:
              - ResourcesKinesisStream
              - Arn
          batchSize: 1

resources:
  Resources:
    ResourcesKinesisStream:
      Type: AWS::Kinesis::Stream
      Properties:
        Name: ResourcesKinesisStream
        ShardCount: 1
```

### Top-Level references for Serverless variables

The [Serverless variable system](https://serverless.com/framework/docs/providers/aws/guide/variables/) is a flexible and powerful way to spice up your `serverless.yml` files.

Serverless Framework v1.9 makes this system even more powerful.

You're now able to reference the current `serverless.yml` file's root or options root parameters. This allows you to access all option parameters without needing to specify which option you want to access.

Curious how this looks? Here's a code example that illustrates how to use those enhancements:

```yml
service: self-reference

provider:
  name: aws
  runtime: nodejs4.3

custom:
  newService: ${self:}
  exportName: ${self:custom.newService.service}-export

functions:
  hello:
    handler: handler.hello

resources:
  Outputs:
    selfExport:
      Value: 'A Value To Export'
      Export:
        Name: ${self:custom.exportName}
    OptExport:
      Value: 'Exported option variable'
      Export:
        Name: ${opt:}
    EnvExport:
      Value: 'Exported env variable'
      Export:
        Name: ${env:}
```

### `virtualenv` support for invoke local

Most of the time developing in Python is done with the help of `virtualenvs` to encapsulate dependencies for Python projects. This is especially helpful when working on different Serverless Python services.

Oftentimes you want to quickly test your functions locally without the need to deploy them to AWS first. This is where the `invoke local` command comes in handy. However, in the past `invoke local` didn't support `virtualenv` setups.

Serverless v1.9 changes that by adding support for `virtualenv` setups in the `invoke local` command.

This way you can still encapsulate your Serverless Python services into their own environments, but also iterate quickly on your ideas by using `invoke local`.

### Support for CloudFormation service roles

You can now define a custom CloudFormation service role that should be used for the deployment of your stack.

To use this feature you simply need to add the `arn` of your CloudFormation service role in the `provider.cfnRole` property.

Here's an example of what this looks like:

```yml
provider:
  name: aws
  cfnRole: <ARN of CloudFormation service role>
```

### More features for invoke local

The feature set of the `invoke local` command was updated.

The following additions were introduced:

1. Support for JavaScript file that has export as a data input
2. Specifing the location of handlers, such as `/dist`
3. Support for `context.done(err, result)`
4. Show JSON.parse result if Content-Type = "application/json"

These enhancements should make local development more convenient and fun!

### Enhancements & Bug Fixes

This release also fixes some other bugs and introduces several enhancements.

> Thanks for reporting bugs and opening issues!

### Upcoming Breaking Changes

Here's a list of all the breaking changes that will be introduced in Serverless v1.10.

**Note:** You'll see the same list in the CLI if you run a Serverless command (as long as you haven't disabled it).

- [BREAKING - Separated Packaging and Deployment for CI/CD](https://github.com/serverless/serverless/pull/3344)

*You'll always get the most recent list of breaking changes in the [upcoming milestone](https://github.com/serverless/serverless/milestones) or in the Serverless CLI.*

### Contributors

This release contains lots of hard work from our awesome community and wouldn't have been possible without passionate people contributing to Serverless.

Here's a list of all the contributors who've submitted changes for this release:

- Daniel Schep
- Doug Moscrop
- Erik Erikson
- James Thomas
- Jonathan Carter
- Jonathan Goldwasser
- Kurt Lee
- Ludovic
- Marcus Molchany
- Nicholas Rakoto
- Ryan S. Brown
- Tanas Gjorgoski
- Tylor Shin
- Vlad Golubev
- Vlad Holubiev
- Yoriki Yamaguchi
- horike37

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

## Introducing the "Post Scheduler" project

Our latest open source effort, ["Post Scheduler"](https://github.com/serverless/post-scheduler), was recently announced! 

It's a handy tool that makes it possible to automate the scheduling of blog posts and content updates for static site generators (like Jekyll, Hugo, Phenomic, etc.) through simple GitHub comments.

It's (of course) made with the help of the Serverless Framework. You should definitely check out the [GitHub repository](https://github.com/serverless/post-scheduler) and the [introduction video](https://www.youtube.com/watch?v=YETxuhexZY4).

You can read the corresponding announcement blog post with more details [here](https://serverless.com/blog/static-site-post-scheduler/).

Happy scheduling!

## Serverless examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
