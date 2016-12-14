---
title: C# service template, CLI based plugin discovery and management, Alexa event support, service wide metrics in Serverless Framework v1.4
description: C# service template, CLI based plugin discovery and management, Alexa event support, service wide metrics in Serverless Framework v1.4
date: 2016-12-15
layout: Post
---

We're happy to release v1.4.0 of the Serverless Framework today!

This release is packed with a lot of great, new feature. Let's take a look at the highlights!

## Highlights of 1.4.0

Here are the highlights of this release. You can find a list with all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### CLI based plugin discovery and management

Plugins are a nice way to extend Serverless with 3rd party functionality.

Do you need `webpack` support? There's [a plugin](https://github.com/elastic-coders/serverless-webpack) for that!

Do you want offline support? There's [a plugin](https://github.com/dherault/serverless-offline) for that!

Recently we've introduced the [Serverless plugin registry](https://github.com/serverless/plugins) which is a GitHub repository containg a list of all the available Serverless plugins.

Serverless now integrates with this repository so you can discover, install and uninstall plugins in your service!

Here's what it looks like:

#### List all available plugins:

```bash
serverless plugin list
```

#### Search for a plugin

```
serverless plugin search --query webpack
```

#### Install a plugin

```bash
serverless plugin install --name serverless-webpack
```

#### Uninstall a plugin

```bash
serverless plugin uninstall --name serverless-webpack
```

This makes it a lot easier to find and manage Serverless plugins for your service

**Note:** You're a plugin author or found a Serverless plugin which is misisng? Feel free to submit a PR to the [Serverless plugin registry](https://github.com/serverless/plugins/edit/master/plugins.json)!

### Alexa event support

v1.4 also introduces a new event `alexaSkill` event source.

You can now hook up your Lambdas with `alexaSkill` events like this:

```yml
functions:
  hello:
    handler: handler.hello
    events:
      - alexaSkill
```

You can read more in [the docs](https://serverless.com/framework/docs/providers/aws/events/alexa-skill) about this new event source.

### C# service template

AWS introduced Dotnet core support for Lambdas at re:Invent.

Serverless has you covered and ships with the new `aws-csharp` template you can use to create C# services on AWS Lambda.

Simply run

```bash
serverless create --template aws-csharp
```

to create a new C# service.

The [C# "hello world" example](https://serverless.com/framework/docs/providers/aws/examples/hello-world/csharp/) will show you how you can setup and deploy your C# service.

**Note:** Serverless supports all [AWS Lambda runtimes](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html) out of the box. You can change the runtime with the help of the `runtime` property in [`serverless.yml` file](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/).

### Directory support for service installation via git

The [Serverless examples repository](https://github.com/serverless/examples) is the go to point if you want to see some real world examples and learn how Serverless architectures can look like.

The `serverless install` command makes it possible for you to download services based on git repository URLs. The downside was that only full repositories could be downloaded.

Until now! A recent enhancement makes it possible to download specific directories from a git URL.

Want to play around with the REST API example which connects to a DynamoDB?

Just install the service with the following command:

```bash
serverless install --url https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb
```

### Service wide metrics

v1.3 introduced metrics support which means that you could get function metrics by running:

```bash
serverless metrics --function hello
```

v1.4 enhances this command so that you can get service wide metrics (all functions combined) when you run:

```
serverless metrics
```

### Stdin support for invoke

`serverless invoke` and it's local equivalent `serverless invoke local` are a great way to invoke your function to test it's behavior.

v1.4 now supports stdin so that you can pipe data directly into the `serverless invoke` call like this:

```bash
echo "hello world!" | serverless invoke --function hello --stage dev --region us-east-1
```

This gives you way more flexibility to invoke a function with different data. Here's an example how a `dataGenerator.js` file could be used to generate data for your function:

```bash
node dataGenerator.js | serverless invoke local --function hello
```

### Enhancements, refactorings and bug fixes

As usual we've also pushed a bunch of enhacements, refacotrings and bug fixes (thanks for reporting!) in this release!

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.5 milestone](https://github.com/serverless/serverless/milestone/20) to see what you can expect in two weeks.

We hope that you have fun with the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

### Using Semver

Note that we're using [strict Semver](http://semver.org/) for our Serverless Framework versioning. This way you'll know when we introduce major features or breaking changes.
