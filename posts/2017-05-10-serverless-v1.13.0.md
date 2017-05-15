---
title: Async variable support added in Serverless v1.13 for enhanced configuration & secret management
description: Async Serverless variables, Cross-Service communication, Lambda tags and more in the Serverless Framework v1.13 release.
date: 2017-05-10
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-v1.13.jpg
authors:
  - PhilippMuns
---

<img align="right" width="210" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-v1.13.jpg">

Today we're proud to release v1.13 of the Serverless Framework!

There's some really exciting new features in this release, let's look into them below.

## Highlights of 1.13.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Async value support for Serverless variables

The widely requested support for async serverless variables landed!

Serverless Variables can now refer to functions which return a promise, making the variable population super powerful.

**Example use cases**

- Fetch and include secrets from a remote database
- Connect variables to your team's secret management solution
- Pull data from internal resources/APIs
- Read config data from your CI/CD server
- ...

The possibilities are endless!

Let's take at a simple example how this looks like:

```yml
service: serverless-async-vars

provider:
  name: aws
  runtime: nodejs6.10

custom:
  secret: ${file(./vars.js):fetchSecret} # JS file running async / promised
```

```javascript
// vars.js

module.exports.fetchSecret = () => {
  // async code
  return Promise.resolve('SomeSecretKey');
}
```

You can read more about this new feature in the [Serverless Variables docs](https://serverless.com/framework/docs/providers/aws/guide/variables).

### Cross-service communication

One feature request which received lots of feedback and community-wide attention is the ability to do cross-service communication.

Building complex serverless apps oftentimes requires the application to be split up into separate services / stacks which are then managed and deployed in a microservice fashion.

However those services need to communicate with each other and e.g. share configuration.

Serverless v1.13 adds support for the new Serverless Variable type `${cf:}` with the signature `${cf:stack.output-property}`.

This variable type enables you a way to reference arbitray `Outputs` from CloudFormation stacks in your account.

Let's take a look at an example to see the how this feature can be used in a Serverless service.

In the `serverless.yml` file of "Service A" we add the `memorySize` to the `Outputs` section of our CloudFormation template and deploy the service as usual through `serverless deploy`.

```yml
service: service-a

provider:
  name: aws
  memorySize: 512

functions:
  hello:
      handler: handler.hello

resources:
  Outputs:
    memorySize:
      Value: ${self:provider.memorySize}
      Export:
        Name: memorySize
```

Next up we have "Service B" in which we're importing the `memorySize` config of our previously deployed "Service A":

```yml
service: service-b

provider:
  name: aws
  memorySize: ${cf:service-a-dev.memorySize}

functions:
  hello:
      handler: handler.hello
```

**Note:** The `cf` Serverless Variable can reference arbitrary `Outputs` from any CloudFormation stack in your account. It doesn't need to be a Serverless service stack.

Interested in more information about this feature? Make sure the check out the [Servereless Variables docs](https://serverless.com/framework/docs/providers/aws/guide/variables/)!.

### Lambda tags

AWS recently announced  support for [tagging Lambda functions](https://aws.amazon.com/de/about-aws/whats-new/2017/04/aws-lambda-supports-tagging-and-cost-allocations/).

Serverless v1.13 adds native support for this nifty feature.

Tags can be added with the help of the `tags` property on the function level. Tags are always defined as key-value pairs.

Here's an example showing how to add the `stage: production` tag to the `hello` function.

```yml
service: service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello
    tags:
      stage: production
```

Tagging Lambda functions opens a wide variety of different use cases.

The most popular use cases seem to be around billing, for example analyzing overall costs based on Lambda tags (`production` vs. `development`). Tagging is also helpful to track Lambdas that use soon to be deprecated runtimes or code or need to be specifically tracked for some other purpose.

More about Lambda tagging can be found in the [function docs](https://serverless.com/framework/docs/providers/aws/guide/functions/).

### Extensible `info` plugin

The AWS implementation of the `info` command now defines more fine-grained lifecycle events you can hook into.

Each information group that is returned when the results are gathered exposes it's own lifecycle event:

```
-> info:info
  -> aws:info:validate
  -> aws:info:gatherData
  -> aws:info:displayServiceInfo
  -> aws:info:displayApiKeys
  -> aws:info:displayEndpoints
  -> aws:info:displayFunctions
  -> aws:info:displayStackOutputs
```

This makes the `info` plugin far more extensible.

Plugin authors can now hook into the lifecycle event before functions are displayed and modify the data accordingly.

### `hello-world` starter template

Serverless v1.13 adds a new, beginner friendly `hello-world` template.

This template is used to streamline the onboarding process.

Just create the new service with `serverless create --template hello-world` and run `serverless deploy` and you're off to the races.

The `hello-world` template includes one function which is hooked up to a CORS enabled API Gateway endpoint.

It uses `nodejs6.10` as the runtime and `aws` as the provider of choice.

Create the hello-world service with these terminal commands

```bash
# Make the directory
mkdir my-new-service

# change into the directory
cd my-new-service

# Create serverless hello world
serverless create --template hello-world

# Deploy it
serverless deploy
```

### Enhancements & Bug Fixes

This release also includes a bunch of bug fixes and several enhancements.

> Thanks for reporting bugs and opening issues!

### Contributors

This release contains lots of hard work from our awesome community, and wouldn't have been possible without passionate people who decided to spend their time contributing to make Serverless better.

Thank You to all of the contributors who submitted changes for this release:

- Ben New
- Christos Matskas
- Frank Schmid
- Hyunsoo Daniel Kim
- Jonathan Goldwasser
- Ken Sykora
- Ryan Lewis
- Stewart Lord
- jarrett jordaan

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Want to help us build the best Serverless tooling out there?

Contributing isn't just about code! Chime in on [discussions](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback), help with [documentation updates](https://github.com/serverless/serverless/labels/kind%2Fdocs) or [review Pull Requests](https://github.com/serverless/serverless/pulls).

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

Furthermore, we're always seeking feedback from our community to build the features in the best way possible. [Here's a list](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) with issues where we need your feedback and insights in your real world usage of Serverless.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.14 milestone](https://github.com/serverless/serverless/milestone/29) to see what we have planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
