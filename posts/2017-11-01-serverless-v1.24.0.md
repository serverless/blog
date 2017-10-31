---
title: Serverless v1.24 - Alexa Smart Home event source, Print content of resolved serverless config file
description: Alexa Smart Home event source, update checker, enhancements, bug fixes and more added in the Serverless Framework v1.24 release.
date: 2017-11-01
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-v1.24.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-v1.24.png" width="210px" >

Today we're proud to announce Serverless Framework v1.24.

This release is another one which is packed with a lot of great features and enhancements! Let's take a closer look at all
the changes v1.24 introduces.

## Changes v1.24 introduces

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

### Alexa smartHome event

AWS recently added support for Alexa Smart Home events which means that Lambda functions can be invoked whenever e.g. certain Alexa Smart Home peripherals are used. This way feature-rich Alexa based IoT applications can be built!

Serverless Framework v1.24 adds support for this new event source. Using it is as easy as obtaining the Alexa Smart Home Skill application ID and adding the `alexaSmartHome` event as en event source to your function.

Here's an example setup which shows how this will look like:

```yml
functions:
  lightbulb:
    handler: lightbulb.handler
    events:
      - alexaSmartHome: amzn1.ask.skill.xx-xx-xx-xx
```

You can use additional configuration like this:

```yml
functions:
  thermostat:
    handler: thermostat.handler
    events:
      - alexaSmartHome: 
           appId: amzn1.ask.skill.xx-xx-xx-xx
           enabled: false
```

Take a look at the [Alexa Smart Home documentation](https://serverless.com/framework/docs/providers/aws/events/alexa-smart-home/) for more information.

### Create service using template from an external repository

The `serverless create` command makes it easy to generate a project based on pre-defined templates which ship with every Serverless release.

Creating a new AWS project which is powered by the `nodejs` runtime is as easy as entering:

```bash
serverless create --template aws-nodejs --path my-new-project
```

Serverless v1.24 extends the functionality of this command so that you can now create services based on a template which is via Git at e.g. GitHub.

In this example we install the `aws-node-rest-api-mongodb` template from our [Serverless Examples](https://github.com/serverless/examples) Git repository.

```bash
serverless create --template-url https://github.com/serverless/examples/tree/master/aws-node-rest-api-mongodb
```

**Note:** the `template-url` can be both: A simple Git repository link, as well as a nested directory structure within a Git repository (like we've seen above).

### Print command to generate output of computed serverless.yml file

Ever wondered what the computed values of your Serverless Variables look like?

The new `serverless print` command makes it possible to inspect the computed `serverless.yml` file to see the completely resolved configuration file.

This makes it easier to find bugs during Serverless Variables usage or plugin development.

You can read more about it in our [CLI documentation](https://serverless.com/framework/docs/providers/aws/cli-reference/print/) for the `print` command.

### Configurable Authorizer Type

Serverless v1.24 introduces a way to configure custom authorizers with the help of the the `type` property.

In this example we're configuring the custom authorizer to be of `type` request.

```yaml
functions:
  create:
    handler: posts.create
    events:
      - http:
          path: posts/create
          method: post
          authorizer:
            arn: xxx:xxx:Lambda-Name
            resultTtlInSeconds: 0
            identitySource: method.request.header.Authorization, context.identity.sourceIp
            identityValidationExpression: someRegex
            type: request
```

This configuration ensure that the Authorizer function receives all of the parameters passed to the main function through the `lamba-proxy` integration type.

**Note:** The `type` will default to `TOKEN` if no value is provided.

### Print message when an update is available

It's important to constantly update the Serverless Framework to benefit from the most recent bug fixes, newly added features and enhancements.

Since Serverless is distributed via `npm` one could run `npm outdated` to get a list of all the packages on the machine which are ready for an update. However this step is manual and cumbersome.

v1.24 ships with an automated, built-in functionality which ensures that you'll receive a CLI message whenever a newer version of the Serverless Framework is available to download.

This way you'll never miss critical bug fixes or all the new goodies which were added to the Framework.

### Conceal API Gateway key values from the output

The Serverless Info plugin ensure that you'll get a short summary of your currently deployed service setup in your console.

It's automatically invoked after each deployment but could also be triggered by running `serverless info`.

While it's nice to get a quick overview of the whole service setup it could also introduce potential security issues. One such issue is that the API Keys are automatically shown in the summary.

In Serverless Framework v1.24 it's now possible to use the `--conceal` option during deployment to hide sensitive information in the deployment summary.

Here's an example deployment call which uses the `--conceal` option:

```bash
serverless deploy --conceal
```

### Other enhancements & bug fixes

This release also includes tons of other improvements and bug fixes.

> Thank you very much for reporting bugs, opening issues and joining the discussions!

We hope that you enjoy this release! Feel free to provide some feedback in our [Forum](https://forum.serverless.com), via [Twitter](https://twitter.com/goserverless) or on [GitHub](https://github.com/serverless/serverless).

### Contributors 

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make the Serverless Framework better.

Huge round of applause to all of the contributors who submitted changes for this release:

- John Doe

## Upcoming releases / contributions

In addition to the [1.25 milestone](https://github.com/serverless/serverless/milestone/40) and its Issues and PRs, we still have lots and lots of other [Issues](https://github.com/serverless/serverless/issues) and [PRs](https://github.com/serverless/serverless/pulls). We'd love to implement and introduce these in some of the upcoming releases.

> Do you want to help out and improve the Serverless Framework?

Great! We have lots of [issues](https://github.com/serverless/serverless/issues) where you could leave some feedback or jump directly into the implementation.

Additionally [PR reviews](https://github.com/serverless/serverless/pulls) are also highly welcomed as they greatly speed up the time-to-merge.

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples, or learn more about the Serverless Framework and serverless architectures in general.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can use to further enhance the capabilities of the Framework. You can find the full list at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
