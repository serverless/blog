---
title: C# service template, Alexa event support, service-wide metrics in Serverless Framework v1.4
description: Introducing C# service template, Alexa event support, service-wide metrics & more in Serverless Framework v1.4
date: 2016-12-15
layout: Post
authors:
  - PhilippMuns
---

We're happy to release v1.4.0 of the Serverless Framework today!

This release is packed with lots of great new features. Let's take a look at the highlights!

## Highlights of 1.4.0

Here are the highlights of this release. You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Alexa event support

v1.4 introduces a new event `alexaSkill` event source.

You can now hook up your Lambdas with `alexaSkill` events like this:

```yml
functions:
  hello:
    handler: handler.hello
    events:
      - alexaSkill
```

You can learn more about this new event source in [the docs](https://serverless.com/framework/docs/providers/aws/events/alexa-skill). You can also check out examples for setting up your own Alexa skill for [Node.js](https://github.com/serverless/examples/tree/master/aws-node-alexa-skill) or [Python](https://github.com/serverless/examples/tree/master/aws-python-alexa-skill) in the Serverless Examples Repository.

### C# service template

AWS introduced .NET core support for Lambda at re:Invent.

Serverless has you covered and ships with the new `aws-csharp` template. You can use it to create C# services on AWS Lambda.

Simply run:

```bash
serverless create --template aws-csharp
```

to create a new C# service.

The [C# "hello world" example](https://serverless.com/framework/docs/providers/aws/examples/hello-world/csharp/) will show you how you can setup and deploy your C# service.

**Note:** Serverless supports all [AWS Lambda runtimes](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html) out of the box. You can change the runtime with the help of the `runtime` property in [`serverless.yml` file](https://serverless.com/framework/docs/providers/aws/guide/serverless.yml/).

### Directory support for service installation via GitHub URL

The `serverless install` command makes it possible for you to download services based on GitHub repository URLs. The downside was that only full repositories could be downloaded.

Until now! A recent enhancement makes it possible to download specific directories from a GitHub URL.

Want to play around with the REST API example which connects to a DynamoDB?

Just install the service with the following command:

```bash
serverless install --url https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb
```

### Service-wide metrics

v1.3 introduced service metrics support allowing you to get function metrics by running:

```bash
serverless metrics --function hello
```

v1.4 enhances this command so that you can get service-wide metrics (all functions combined) when you run:

```bash
serverless metrics
```

### Stdin support for invoke

`serverless invoke` and its local equivalent `serverless invoke local` are a great way to invoke your function to test its behavior.

v1.4 now supports **stdin** so that you can pipe data directly into the `serverless invoke` call like this:

```bash
echo "hello world!" | serverless invoke --function hello --stage dev --region us-east-1
```

This provides way more flexibility to invoke a function with different data. Here's an example of how a `dataGenerator.js` file could be used to generate data for your function:

```bash
node dataGenerator.js | serverless invoke local --function hello
```

### Enhancements, refactorings and bug fixes

As usual we've also pushed a bunch of enhacements, refactorings and bug fixes (thanks for reporting!) in this release.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.5 milestone](https://github.com/serverless/serverless/milestone/20) to see what you can expect in two weeks.

We hope that you have fun with the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.

### Using Semver

Note that we're using [strict Semver](http://semver.org/) for our Serverless Framework versioning. This way you'll know when we introduce major features or breaking changes.
