---
title: Serverless v1.18 - Request parameter support for Lambda Proxy, default value for plugin options added
description: Support for request parameters when using Lambda Proxy integration and more added in the Serverless Framework v1.18 release.
date: 2017-07-20
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-release-1.18.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-release-1.18.png" width="210px" >

Today we're excited to announce Serverless Framework v1.18!

The v1.18 release mostly focuses on enhancements and bug fixes. Let's take a look at some of the changes v1.18 introduces.

## Noteable changes v1.18 introduces

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file or watch the video below.

Kudos to Ryan H. Lewis [(@ryanmurakami)](https://twitter.com/ryanmurakami) for taking the time to record this video!

<iframe width="560" height="315" src="https://www.youtube.com/embed/0DHT1evCtls" frameborder="0" allowfullscreen></iframe>.

### Request parameter support for Lambda Proxy integration

The `LAMBDA-PROXY` integration type now supports request parameters you can define in your `http` event definition:

```yml
service: my-service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  helloWorld:
    handler: handlers/handler.hello
    events:
      - http:
          path: /{name}
          method: GET
          request:
            parameters:
              querystrings:
                foo: true
              paths:
                bar: true
```

### Add default value for plugin options

Plugins now support default values for options. If specified the default value is used if the user does not provide a value when using the option via the CLI.

Here's an example how a plugin developer can use this feature:

```javascript
'use strict';

class MyPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      deploy: {
        lifecycleEvents: [
          'functions'
        ],
        options: {
          function: {
            usage: 'Specify the function you want to deploy (e.g. "--function myFunction")',
            shortcut: 'f',
            required: true
          },
          stage: {
            usage: 'Specify the stage you want to deploy to. (e.g. "--stage prod")',
            shortcut: 's',
            default: 'dev' // the stage will default to dev if no option is provided
          }
        }
      },
    };

    this.hooks = {
      'deploy:functions': this.deployFunction.bind(this)
    }
  }

  deployFunction() {
    console.log('Deploying function: ', this.options.function);
  }
}

module.exports = MyPlugin;
```

### Add support to use JavaScript files via Serverless Variables

JavaScript files which e.g. export objects can now be referenced without defining the exported function which should be executed:

```yml
service:
  name: my-service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello

custom: ${file(./unnamedExport.js)}
```

This comes in handy if you'd like to use traditional config tools such as [node-config](https://github.com/lorenwest/node-config) to configure your Serverless service.

### Other enhancements & bug fixes

This release also includes tons of other improvements and bug fixes.

> Thank you very much for reporting bugs, opening issues and joining the discussions!

We hope that you enjoy this release! Feel free to provide some feedback in our [Forum](https://forum.serverless.com), via [Twitter](https://twitter.com/goserverless) or on [GitHub](https://github.com/serverless/serverless).

### Contributors 

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make the Serverless Framework better.

Thank you to all of the contributors who submitted changes for this release:

- Alfred Nutile
- Anish Karandikar
- Daniel Schep
- Filipe Azevedo
- Greg Thornton
- Jaik Dean
- Joe Niland
- Luke Herrington
- Oskar Cieslik
- Ralph Dugue
- Rob Ribeiro
- Ryan Lewis
- Ryan S. Brown
- Sunny
- Travis Dimmig
- horike37

## Upcoming releases / contributions

The Serverless Team is currently working on exciting new projects we'll announce at the [Emit conference](http://www.emitconference.com/) in August!

That's why upcoming Serverless releases will likely focus on bug fixes and minor enhancements.

However we could still include major features with the help of our community!

In addition to the [1.19 milestone](https://github.com/serverless/serverless/milestone/34) and its Issues and PRs we still have lots and lots of other [Issues](https://github.com/serverless/serverless/issues) and [PRs](https://github.com/serverless/serverless/pulls) we'd love to implement and introduce in some of the upcoming releases!

> Do you want to help out and improve the Serverless Framework?

Great! We've compiled a list with some of the most wished features to make it easier for you to find areas where help is greatly appreciated!

### Deploy many micro/nano services to one API Gateway

[Issue #3078](https://github.com/serverless/serverless/issues/3078)

We already started a WIP implementation with the following [PR](https://github.com/serverless/serverless/pull/3934). However for now it only provides a partial solution. Do you have any ideas how we can improve the support for this feature?

### Unable to create services with a high resource count

[Issue #2387](https://github.com/serverless/serverless/issues/2387)

Services can grow significantly in size. We've worked on different solutions for this problem (see [this PR](https://github.com/serverless/serverless/pull/3504)) but we're still not 100% there yet.

Could you imagine how we can resolve this problem in a reliable way?

### Support for AWS API Gateway Basic Request Validation

[Issue #3464](https://github.com/serverless/serverless/issues/3464)

We're currently looking for a way to implement basic request validation via raw CloudFormation.

### Let resources depend on the ApiGateway::Deployment

[Issue #2233](https://github.com/serverless/serverless/issues/2233)

The `ApiGateway::Deployment` resource has a random string in its name so that deployments are re-triggered on AWS end.

This makes it hard to create other CloudFormation resources which dependend on it.

### Skip resource if already exists

[Issue #3183](https://github.com/serverless/serverless/issues/3183)

It would be nice to skip resource delpoyments if the corresponding resource already exists (e.g. when using DynamoDB tables). Could you think of a reliable, production ready way which will detect which resources deployments could be skipped?

### Global arn parser with intrinsic functions (Ref, Fn::GetAtt, Fn::ImportValue, ...) support

[Issue #3212](https://github.com/serverless/serverless/issues/3212)

`arns` are used everywhere in CloudFormation. However some of our event sources don't support all the different types of intrinsic functions which can be used to reference `arns`.

It would be great to have a global `arn` parser which can be re-used throughout the whole codebase. Futhermore this parser could be exposed to the framework user e.g. via `this.provider.findAllCfReferences()` so that plugin authors can benefit from this functionality as well.

### Other issues and PRs

This list is just a gist with some of the most wished features from our community!

We have lots of other [issues](https://github.com/serverless/serverless/issues) where you could leave some feedback or jump directly into the implementation.

Additionally [PR reviews](https://github.com/serverless/serverless/pulls) are also highly welcomed as they greatly speed up the "time-to-merge".

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about the Serverless Framework and serverless architectures in general.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can install and therefore enhance the capabilities of the Framework.

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
