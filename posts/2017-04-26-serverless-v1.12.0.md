---
title: New in Serverless v1.12 - Package/Deploy Command Separation for Better CI/CD Support
description: New package command, Python 3.6 support, new OpenWhisk runtimes and more in the Serverless Framework v1.12 release.
date: 2017-04-26
layout: Post
authors:
  - PhilippMuns
---

It's time for the new Serverless Framework v1.12 release! Let's take a look at all the new features and improvements.

## Highlights of 1.12.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Separate `package` and `deploy` command

This long awaited feature has arrived! Serverless v1.12 introduces a way to separate the packaging step from the deployment of your service.

This gives you more control over the build process, which will also improve CI/CD usage in combination with the Serverless Framework.

Let's take a closer at look how we can use this new feature.

#### The `package` command

The `package` command enables you to package all of your service artifacts and store them on your disk.

Running the following command will build and save all of the deployment artifacts in the service's `.serverless` directory:

```bash
serverless package
```

However, you can also use the `--package` option to add a destination path and Serverless will store your deployment artifacts there (`./my-artifacts` in the following case):

```bash
serverless package --package my-artifacts
```

#### The updated `deploy` command

The "simple" deployment process via `serverless deploy` has not changed. It will still package all of your artifacts, store them in the `.serverless` directory and deploy your service after that:

```bash
serverless deploy
```

However, you're now able to use the `--package` option to specify which package you want to use for deployment:		

**Note:** This package needs to be created (e.g. with the `serverless package` command) and available beforehand.	

```bash
serverless deploy --package my-artifacts
```

Furthermore, you can set the path to the package directory in your `serverless.yml` file like this:

```yml
package:
  path: my-artiacts
```

Serverless will now use this path automatically if you run the `deploy` command **without** the `--package` option:

```bash
serverless deploy
```

### Python 3.6 support

AWS [recently announced](https://aws.amazon.com/de/about-aws/whats-new/2017/04/aws-lambda-supports-python-3-6/) support for Python 3.6 and added the corresponding runtime to their Lambda compute service.

Serverless has you covered and ships with a new `aws-python3` template you can use to deploy your Python 3 services to AWS.

Run the following command to generate a new Python 3 template:

```bash
serverless create --template aws-python3
```

You can also migrate an "old" Python 2 service so that it uses the new `python3.6` runtime:

```diff
provider:
  name: aws
- runtime: python2.7
+ runtime: python3.6
```

Just make sure that your code is compatible with Python 3 and run `serverless deploy` to update your service.

The `serverless invoke local` command was also updated so that you can emulate a Python 3 function invocation locally.

### New OpenWhisk runtimes

[James Thomas](https://github.com/jthomas) from the OpenWhisk team [recently announced v0.6](https://medium.com/openwhisk/serverless-framework-and-openwhisk-plugin-update-v0-6-1339cfdcd2d2) of the official Serverless [OpenWhisk provider plugin](https://github.com/serverless/serverless-openwhisk).

This update is a huge step forwards as it now supports Python, Swift, Docker and Binaries as runtimes.

Serverless Framework v1.12 adds the `openwhisk-python` and `openwhisk-swift` templates to streamline this process.

Just run the following command to create a new Python template:

```bash
serverless create --template openwhisk-python
```

This command will generate a new Swift service template for you:

```bash
serverless --create openwhisk-swift
```

Curious how to take it from there? Take a look at the docs to learn more:

- [Writing Functions with Python](https://github.com/serverless/serverless-openwhisk#writing-functions---python)
- [Writing Functions with Swift](https://github.com/serverless/serverless-openwhisk#writing-functions---swift)
- [Writing Functions with Docker](https://github.com/serverless/serverless-openwhisk#writing-functions---docker)
- [Writing Functions with Binaries](https://github.com/serverless/serverless-openwhisk#writing-functions---binary)

### Intrinsic function support for SNS events

The SNS event source is now updated so that it supports CloudFormation intrinsic functions such as `Fn::GetAtt`.

This way you can e.g. reference other resources in your `serverless.yml` `resources` section.

Here's an in-depth example of what this looks like in practice:

```yml
functions:
  ingestFn1:
    handler: handler.hello
    events:
      - sns:
          topicName: myTopic
          arn:
            Fn::Join:
              - ""
              - - "arn:aws:sns:"
                - Ref: "AWS::Region"
                - ":"
                - Ref: "AWS::AccountId"
                - ":myTopic"

resources:
  Resources:
    myTopic:
      Type: AWS::SNS::Topic
      Properties:
        TopicName: myTopic
        Subscription:
          -
            Endpoint:
              Fn::Join:
                - ""
                - - "arn:aws:sqs:"
                  - Ref: "AWS::Region"
                  - ":"
                  - Ref: "AWS::AccountId"
                  - ":mySqs"
            Protocol: sqs
```

Take a look at the [SNS documentation](https://serverless.com/framework/docs/providers/aws/events/sns/) for more information.

### An important note for plugin authors

The separation of the `package` and `deploy` command was a tough one since our goal was to introduce this change in a non-breaking way.

[Frank Schmid](https://github.com/HyperBrain) worked really hard on new concepts around our core plugin system to help plugin authors deprecate and redirect lifecycle usages. This makes it possible to use both old lifecycle events and new lifecycle events alongside each other.

A huge thanks goes out to Frank for all his ideas and help here since these additions made it possible to introduce the package and deploy separation in a non-breaking way! (As a day-to-day Framework user you might not even notice a difference altough the whole system behind the scenes works entirely differently)

This release includes the option to show a warning message if a plugin hooks into deprecated lifecycle events.		
		
Showing this warning message is disabled by default. You need to enable it by setting the `SLS_DEBUG=*` system environment variable.

After setting this you'll see a message in the console every time your plugin uses an old lifecycle event.		

**We encourage all plugin authors to enable the debugging information and check whether their plugin uses old, deprecated lifecycle events.**

You can see all the deprecated lifecycle events with the corresponding redirections Serverless introduces with v1.12 [here](https://github.com/serverless/serverless/blob/07f837ddb67a40cee3e0c6b238e165023b4b7725/lib/plugins/deploy/deploy.js#L14-L19).

Those lines of code also show how the redirection of deprecated lifecycle events works. So you can now use the same mechanism to deprecate your own plugin lifecycle events.

Want to know more about this topic? Read [Frank's gist](https://gist.github.com/HyperBrain/bba5c9698e92ac693bb461c99d6cfeec) to learn why this was needed and how it works behind the scenes.

### Enhancements & Bug Fixes

This release also includes bug fixes and introduces several enhancements.

> Thanks for reporting bugs and opening issues!

### Contributors

This release contains lots of hard work from our awesome community, and wouldn't have been possible without passionate people who decided to spend their time contributing to make Serverless better.

Thank You to all of the contributors who submitted changes for this release:

- Alex Oskotsky
- Daniel Schep
- Danny Varner
- Frank Schmid
- Hal Massey
- Huang Yunkun
- James Thomas
- Jeremy Thomerson
- Johannes Schickling
- Matt Hernandez
- Me OutPerformIt
- Rafal Wilinski
- Ryan Lewis
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

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.13 milestone](https://github.com/serverless/serverless/milestone/28) to see what we have planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
