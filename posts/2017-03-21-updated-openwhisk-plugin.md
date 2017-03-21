---
title: New Event Sources and Other Updates in v0.5.0 of the OpenWhisk Plugin for the Serverless Framework
description: The official OpenWhisk plugin for Serverless now includes support for Cloudant DB and IBM Message Hub events, exporting Web Actions and more.
date: 2017-03-21
thumbnail: https://cloud.githubusercontent.com/assets/20538501/22410455/110d1f36-e65e-11e6-8db8-87e834504e13.jpg
layout: Post
authors:
  - StefanieMonge
---
Multi-provider support was a goal we laid out following the [Serverless Framework v1 release](https://serverless.com/blog/serverless-post-1.0/). Since then we've been working towards simplifying the process of moving applications between cloud providers to enable the development of multi-cloud Serverless apps. All while keeping the Serverless workflow and developer experience consistent across providers so you don't need to learn custom commands or syntax for each platform.

OpenWhisk integration [launched ealier this year](https://serverless.com/blog/openwhisk-integration-with-serverless/). The official OpenWhisk provider plugin allows developers to build, deploy and manage apps running on the OpenWhisk platform using the Serverless Framework. 

***Special shout out to [James Thomas (@thomasj)](https://twitter.com/thomasj) at IBM for his awesome contribution spearheading this effort!***

OpenWhisk recently released [v0.5.0 of the plugin](https://github.com/serverless/serverless-openwhisk/releases/tag/v0.5.0), adding support for [Cloudant DB](https://cloudant.com/) and [IBM Message Hub](https://developer.ibm.com/messaging/message-hub/) events, [exporting Web Actions](https://github.com/openwhisk/openwhisk/blob/master/docs/webactions.md) and local OpenWhisk deployments.

<img width="1028" alt="openwhisk banner" src="https://cloud.githubusercontent.com/assets/20538501/24154626/b86ad64a-0e1f-11e7-8e12-979b8d194430.png">

### Use the following command to upgrade the provider plugin to the latest version.

```
npm update -g serverless-openwhisk
```

*Due to an [outstanding issue](https://github.com/serverless/serverless/issues/2895) with provider plugins, the [OpenWhisk provider](https://github.com/serverless/serverless-openwhisk) must be installed as a global module.*

### New Features Supported in v0.5.0

- **IBM Message Hub Events** - Functions can be bound to events from IBM Message Hub (“Apache Kafka”-as-a-Service) using a new event type (*message_hub*). Functions will be fired with the batch of messages received since the last invocation. Service credentials can be automatically read from an OpenWhisk package. Learn more [in the docs](https://serverless.com/framework/docs/providers/openwhisk/events/messagehub/).
- **IBM Cloudant DB Events** - Functions can be bound to events from IBM Cloudant (“CouchDB”-as-a-Service) using a new event type (*cloudant*). Functions are invoked for each database modification surfaced through the CouchDB *_changes* feed. Service credentials can be automatically read from an OpenWhisk package. Learn more [in the docs](https://serverless.com/framework/docs/providers/openwhisk/events/cloudant/).
- **Export Web Actions** - Functions can be turned into [“*web actions*”] which return HTTP content without use of an API Gateway. This feature is enabled by setting an annotation (`web-export`) in the configuration file. Learn more [in the docs](https://serverless.com/framework/docs/providers/openwhisk/guide/web-actions/).
- **Support Local OpenWhisk Deployments** - This plugin now supports targeting OpenWhisk instances without valid SSL certificates. Developers running personal instances of the platform often do not have a custom SSL certificate set up for their domain.

See the milestone [release on GitHub](https://github.com/serverless/serverless-openwhisk/milestone/1?closed=1) or the [OpenWhisk blog](https://medium.com/openwhisk/updated-openwhisk-support-in-the-serverless-framework-62d1c3d7c112#.s6pivymqo) for full details on the new features and bug fixes. Items planned for the next release are shown in the [0.6 milestone](https://github.com/serverless/serverless-openwhisk/milestone/2).

### Getting Started with OpenWhisk & Serverless

***Resources to help you get started developing apps with OpenWhisk and the Serverless Framework.***

- [Getting Started with the Serverless Framework and OpenWhisk Video Tutorial](https://www.youtube.com/watch?v=GJY10W98Itc)
- [Serverless Apache OpenWhisk Provider Docs](https://serverless.com/framework/docs/providers/openwhisk/)
- [OpenWhisk Examples in the Serverless Examples Repository](https://github.com/serverless/examples)

Let us know if you have feature requests (or find bugs) by opening issues in the [GitHub repository](https://github.com/serverless/serverless-openwhisk/milestone/2).
