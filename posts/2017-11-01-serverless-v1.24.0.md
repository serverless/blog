---
title: Serverless v1.24 - Alexa Smart Home event source, Print content of resolved serverless config file
description: Alexa Smart Home event source, update checker, enhancements, bug fixes and more added in the Serverless Framework v1.24 release.
date: 2017-11-01
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework_v1.24.jpg
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework_v1.24.jpg" width="210px" >

Today we're proud to announce Serverless Framework v1.24.

v1.24 is a special release — it's the first one which was entirely run by our recently-onboarded Serverless Framework v1 maintainers!

## Meet our Serverless Framework maintainers

### Frank Schmid

<img align="left" src="https://avatars0.githubusercontent.com/u/5524702?s=400&v=4" width="180px">

Frank is an early serverless enthusiast. He got started when the [Serverless Framework](https://serverless.com/framework/) was in its v0.x infancy. Frank has contributed tons of great enhancements to the different codebases of the Framework.

His speciality is the v1 plugin system, where he managed to introduce the separation of the `package` and `deploy` steps in a non-breaking way with the help of a lifecycle deprecation and redirection mechanism.

[GitHub](https://github.com/HyperBrain)

### Rafal Wilinski

<img align="left" src="https://avatars3.githubusercontent.com/u/3391616?s=400&v=4" width="180px">

Rafal has a deep background in Node.js and loves to play around with new technologies. When he stumbled upon the Serverless Framework a while back, he and immediately jumped in to provide new features and lend a hand in issue discussions.

Rafal loves to push Serverless technolgoies to its limits. That's why he's also playing around with different project ideas such as a 100% serverless [Medium Text-To-Speech](https://github.com/RafalWilinski/serverless-medium-text-to-speech) application. Make sure to give it a try [here](http://medium-speech.s3.amazonaws.com/index.html).

[GitHub](https://github.com/RafalWilinski) | [Twitter](https://twitter.com/rafalwilinski)

### Takahiro Horike

<img align="left" src="https://avatars0.githubusercontent.com/u/1301012?s=400&v=4" width="180px">

Takahiro loves to get his hands dirty. He's fearless in testing the latest services in the serverless landscape to see how they can be introduced to the Serverless Framework! Many of the AWS event source plugins Serverless provides were introduced by him.

Make sure to check out his serverless experiments on his [GitHub profile](https://github.com/horike37?utf8=%E2%9C%93&tab=repositories&q=serverless&type=&language=)

In addition to that you can find him hanging around in GitHub comments or PRs. Takahiro is always working on bug fixes and enhancements that make Serverless development life even more productive and enjoyable.

[GitHub](https://github.com/horike37) | [Twitter](https://twitter.com/horike37)

---

We're proud and super happy that our community is so welcoming and engaged. Thank you everyone for being a part of it!

## Changes v1.24 introduces

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

### Alexa smartHome events

AWS recently added support for Alexa Smart Home events. This means Lambda functions can be invoked whenever, for example, certain Alexa Smart Home peripherals are used.

This opens the door for feature-rich, Alexa-based IoT applications!

Serverless Framework v1.24 adds support for this new event source. Using it is as easy as obtaining the Alexa Smart Home Skill application ID and adding the `alexaSmartHome` event as en event source to your function.

Here's an example setup of what this will look like:

```yml
functions:
  lightbulb:
    handler: lightbulb.handler
    events:
      - alexaSmartHome: amzn1.ask.skill.xx-xx-xx-xx
```

You can utilize additional configuration like this:

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

### Create services with templates from an external repository

The `serverless create` command makes it easy to generate projects based on pre-defined templates, which ship with every Serverless release.

Creating a new AWS project which is powered by the `nodejs` runtime is as easy as entering:

```bash
serverless create --template aws-nodejs --path my-new-project
```

Serverless v1.24 extends the functionality of this command so that you can now create services based on a template via Git.

In this example we install the `aws-node-rest-api-mongodb` template from our [Serverless Examples](https://github.com/serverless/examples) Git repository.

```bash
serverless create --template-url https://github.com/serverless/examples/tree/master/aws-node-rest-api-mongodb
```

**Note:** the `template-url` can be a simple Git repository link, as well as a nested directory structure within a Git repository (as we see above).

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

This configuration ensures that the Authorizer function receives all of the parameters passed to the main function through the `lamba-proxy` integration type.

**Note:** The `type` will default to `TOKEN` if no value is provided.

### Print message when an update is available

Consistently updating the Serverless Framework lets you benefit from the most recent bug fixes, features, and enhancements.

Since Serverless is distributed via `npm`, one could run `npm outdated` to get a list of all the packages on the machine which are ready for an update. But this step is manual and cumbersome.

v1.24 ships with an automated, built-in functionality which ensures that you'll receive a CLI message whenever a newer version of the Serverless Framework is available to download.

This way you'll never miss critical bug fixes (or new feature goodies).

### Conceal API Gateway key values from the output

The Serverless Info plugin ensure that you'll get a short summary of your currently deployed service setup in your console.

It's automatically invoked after each deployment but could also be triggered by running `serverless info`.

While it's nice to get a quick overview of the whole service setup, it could also introduce potential security issues. One such issue is that the API Keys are automatically shown in the summary.

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

- Alessio Coser
- Andres
- Andrew Oh
- Basile Trujilllo
- Ben Burhans
- Boaz de Jong
- Daniel Schep
- Daron Yondem
- Frank Schmid
- James Thomas
- Jeffrey Noehren
- Jonathan Spies
- Kostas Bariotis
- Mariusz Nowak
- Matt McCormick
- Michael Standen
- Mike Moss
- Preston Tighe
- Rafal Wilinski
- Remon Oldenbeuving
- Simon Males
- Takahiro Horike
- Timothy Stott
- Ulili
- Wouter92
- daviskoh
- guyklainer
- jeffnoehren
- leoybkim
- sharathm

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
