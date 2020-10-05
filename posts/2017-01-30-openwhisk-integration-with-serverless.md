---
title: Announcing OpenWhisk Integration with the Serverless Framework
description: The new OpenWhisk provider plugin allows developers to build applications for the OpenWhisk cloud platform using the Serverless Framework.
date: 2017-01-30
thumbnail: https://cloud.githubusercontent.com/assets/20538501/22410455/110d1f36-e65e-11e6-8db8-87e834504e13.jpg
layout: Post
authors:
  - StefanieMonge
---
Today we're excited to announce [OpenWhisk](http://openwhisk.org/) integration with the Serverless Framework!

The official [OpenWhisk Provider Plugin](https://github.com/serverless/serverless-openwhisk) allows developers to build applications for the OpenWhisk cloud platform using the Serverless Framework.

Special shout out to [James Thomas (@thomasj)](https://twitter.com/thomasj) at IBM for his awesome contribution spearheading this effort.

![openwhisk serverless integration](https://cloud.githubusercontent.com/assets/20538501/22434123/748ae372-e6e0-11e6-86d0-38db9941552d.png)

## OpenWhisk + The Serverless Framework
The Serverless Framework enables developers to use a [simple manifest file](https://serverless.com/framework/docs/providers/openwhisk/guide/services#serverlessyml) to define [Serverless functions](https://serverless.com/framework/docs/providers/openwhisk/guide/functions/), connect them to [event sources](https://serverless.com/framework/docs/providers/openwhisk/guide/events/) and declare cloud services needed by their application.

The framework then [deploys these Serverless applications](https://serverless.com/framework/docs/providers/openwhisk/cli-reference/deploy/) to the cloud provider.

### Introducing OpenWhisk Support
Multi-provider support was a goal we laid out following [the Serverless Framework v1 release](https://serverless.com/blog/serverless-post-1.0/). With the OpenWhisk integration, developers using the framework can choose to deploy their Serverless apps to any OpenWhisk platform instance. Further, multi-provider support simplifies the process of moving applications between cloud providers and enables the development of multi-cloud Serverless apps.

The Serverless workflow and developer experience is consistent across all providers. You don't need to learn custom commands or syntax for each platform.

## Resources for Getting Started
*Check out these resources to help you get started with OpenWhisk integration.*

### Intro to the OpenWhisk Serverless Plugin Video
Learn more about how to use the Serverless Framework with the new OpenWhisk provider plugin in this [quick video](https://youtu.be/GJY10W98Itc).

### Serverless Docs
OpenWhisk is now included in the [Serverless Docs](https://serverless.com/framework/docs/). You'll find a guide to building Serverless applications, CLI command reference, platform event support and an example application.

### Serverless Examples Repository
Check out the [Serverless Examples repository](https://github.com/serverless/examples) to see more sample applications. OpenWhisk examples include: how to build HTTP APIs, cron-based schedulers, chaining functions and more.

## Let Us Know What You Think
For months we've been collaborating with the OpenWhisk team to ensure a great user experience and seamless integration. Let us know what you think. Community feedback is a driving force in the direction of the Serverless Framework.

You can report bugs or request features by opening an issue in the [Serverless-OpenWhisk repository](https://github.com/serverless/serverless-openwhisk). Join the conversation in the [Serverless forum](http://forum.serverless.com/), [chat room](https://gitter.im/serverless/serverless) or this [Slack channel for OpenWhisk](http://slack.openwhisk.org/).

We're excited to hear your feedback.

## What's Next for OpenWhisk
The roadmap includes support for non-Node.js runtimes, ensuring compatibility with popular third-party plugins and integrating new features from the platform.
