---
title: Serverless v1.17 - F# service template, skip deployment when files not changed added
description: F# service template, deployment skipping when files not changed and more in the Serverless Framework v1.17 release.
date: 2017-07-05
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-v117.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-v117.png" width="210px" >

Toaday we're happy to announce the new Serverless Frameowrk v1.17 release!

v1.17 provides new features, enhancements, and bugfixes. Let's take a deep dive into the new features v1.17 introduces.

## Highlights of 1.17.0

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

### F# service template

With Serverless v1.17 you can now create and deploy F# service templates to AWS.

You can bootstrap your new F# service with the help of the `serverless create --template` command:

```bash
serverless create --template aws-fsharp --path my-fsharp-service
```

Next up you need to build the project:

```bash
cd my-fsharp-service

./build.sh
```

After that you're ready to deploy and invoke your first F# function:

```bash
serverless deploy

serverless invoke --function hello
```

The F# service template supports all the configs and event sources you can find in [our AWS documentation](https://serverless.com/framework/docs/providers/aws/).

### Support for shared API Gateways

Serverless helps you encapsulated common business logic into dedicated services.

You could e.g. organize all your user-specific functionality into one `users` Serverless service and put all the comments related business logic into a `comments` service.

This so called microservice pattern helps you especially when you have a fairly large application.

In Serverless a very commonly used event source is the `http` event which enables you a way to invoke functions based on incoming HTTP requests. Your `users`service could e.g. handle incoming `signup` requests via `POST` whereas your `comments` service updates previously written comments with the help of `PUT` or `PATCH` requests.

When orchestrating and exposing your different Serverless services to the world you most likely want to expose one "umbrella" API Gateway which handles and dispatches all the incoming HTTP requests to the different Serverless services.

Serverless v1.17 adds an easy way to define shared API Gateway resources with the help of the `apiGatewayRestApiId` config parameter.

Here's an example how you could re-use an existing API Gateway in your current Serverless service:

```yml
service:
  name: test-service

provider:
  name: aws
  runtime: nodejs6.10
  apiGatewayRestApiId:
    Fn::ImportValue: MySharedApiGatewayRestApi

functions:
  hello:
    handler: handler.hello
    events:
      - http: GET hello
```

Serverless will now automatically replace all the existing API Gateway references for the service with the shared one.

You can read more about the different configuration options in our docs about the [API Gateway event source](https://serverless.com/framework/docs/providers/aws/events/apigateway/).

**Note:** Serverless can be used in a variety of different architectural flavors. You can read more about the different patterns in our blog post about [Serverless code patterns](https://serverless.com/blog/serverless-architecture-code-patterns/).

### Skip deployment if files not changed

Starting now, Serverless will automatically compare you current services files on disk to the remotely uploaded service files of your last deployment.

A re-deployment is only triggerend if at least one of the files are different.

This feature is enabled by default and works for the `serverless deploy` and the `serverless deploy function` command.

However you can still force a deployment by specifying the `--force` option like this:

```
serverless deploy --force
```

or

```
serverless deploy function --function func1 --force
```

### Enhancements & Bug Fixes

This release also includes tons of bug fixes and several other improvements.

> Thank you very much for reporting bugs, opening issues and joining the discussions!

### Contributors 

This release contains lots of hard work from our awesome community, and wouldn't have been possible without passionate people who decided to spend their time contributing to make Serverless better.

Thank You to all of the contributors who submitted changes for this release:

- John Doe

## The Road Ahead

Serverless has a really open, helpful, and vibrant community which helps building the best Serverless toolings out there.

We've already started to fill the next [1.18 milestone](https://github.com/serverless/serverless/milestone/33). Feel free to jump into the issue discussions or implementations for the upcoming features!

The current milestone is no the only way to find areas for contributions! We've got a couple of different issues and PRs which are just waiting for a feedback, implemenation or code review.

Just filter by [our labels](https://github.com/serverless/serverless/labels) to find areas where you can help!

**Aside:** Contributing isn't just about writing code! Feel free to chime in on [issue discussions](https://github.com/serverless/serverless/issues) or [review Pull Requests](https://github.com/serverless/serverless/pulls).

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or our [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can install and therefore enhance the capabilities of the Framework.

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
