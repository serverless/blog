---
title: Serverless V1.0 Alpha 2
description: "Serverless templates added to the serverless framework"
date: 2016-07-19
layout: Post
authors:
  - PhilippMuns
---

![img](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/07/005adf42-d269-43ee-9998-9502487bb99b.gif) Today we’re proud to announce the release of Serverless V1.0-alpha2\. Two weeks have passed since the very [first release](http://blog.serverless.com/serverless-v1-0-alpha1-announcement/) of our [scheduled rolling release roadmap](https://github.com/serverless/serverless/milestones). Thanks to our great community we were able to [jump into discussions](https://github.com/serverless/serverless/issues) around different topics regarding the vision for Serverless v1\. With that help we were able to finish and release this second alpha of Serverless v1. To install the new version of Serverless run the following:

```bash
npm install -g serverless@alpha
```

Let’s take a quick look at what’s changed.

## New packaging mechanism

See [#1486](https://github.com/serverless/serverless/issues/1486) and [#1494](https://github.com/serverless/serverless/pull/1494) Cloud applications have underdone a shift over the past several years toward service orientation (e.g. “[Microservices](https://en.wikipedia.org/wiki/Microservices)” or even “Nanoservices”). Starting with Serverless v1 we’ll also think in terms of services rather than a project (take a look [here](http://blog.serverless.com/building-serverless-framework-v1/) to read about services in Serverless v1). This is now also reflected in the way we package your project for the deployment to your cloud provider. Starting with alpha 2 your whole service will be zipped (instead of each function inside your service) and uploaded as a whole to your cloud provider.  This approach has different upsides:

1.  Faster deployment as only one file needs to be uploaded
2.  Less brittle code parts which might break during packaging
3.  Easier sharing of code between functions
4.  Better integration for CI / CD systems
5.  Fundamental for multi langauge and provider support as you don’t have to deal with the different special cases they might need when zipping is done on a “per function” basis

We’re also working on functionality to upload independent functions as well. If you have thoughts regarding that join the discussion [here](https://github.com/serverless/serverless/issues/1486)!

## Templates to kick-start your Serverless service

See [#1470](https://github.com/serverless/serverless/issues/1470), [#1537](https://github.com/serverless/serverless/pull/1537) and [#1452](https://github.com/serverless/serverless/issues/1452) With alpha 1 you would create a new service by running e.g.

```bash
serverless create --name my-new-service --provider aws
```

This is an easy and simple way to create a basic scaffold for your new Serverless service. However we’ve discussed this way of creating a Serverless service with our community and saw a problem which arises when dealing with some of our core concepts for v1 which are

*   Multi provider support
*   Multi language support

Starting with this release we’ll provide different templates for different use cases. For example, you can now generate a scaffold for your Node.js 4.3 service which runs on AWS by using our aws-nodejs template:

```sh
serverless create --template aws-nodejs
```

We’ve put together some basic templates [here](https://github.com/serverless/serverless/tree/v1.0/lib/plugins/create/templates). More provider and language specific templates will follow soon.

## Better UI / UX and improved error reporting

See [#1406](https://github.com/serverless/serverless/issues/1406) and [#1453](https://github.com/serverless/serverless/pull/1453) Dealing with errors/problems in your application is always painful. We’ve overhauled our error reporting system to provide you with more detail on what went wrong and how you can resolve the problem. Additionally we’ve improved the overall UX to provide you a even better experience when working with our CLI.

## SNS event integration

See [#1476](https://github.com/serverless/serverless/issues/1476) and [#1499](https://github.com/serverless/serverless/pull/1499) SNS events have finally arrived. You can now add a SNS topic as your event source to your function like this:

```yaml
functions:
 function1:
   handler: handler.handler
   events:
     - sns: topic
```

Take a look at the [plugin code](https://github.com/serverless/serverless/tree/v1.0/lib/plugins/aws/deploy/compile/events/sns) to get more in-depth information on how it works.

## Anonymized tracking of framework usage

See [#1599](https://github.com/serverless/serverless/issues/1559) and [#1568](https://github.com/serverless/serverless/pull/1568) Our mission is to provide you the best tools and user experience when developing and dealing with Serverless infrastructures. Starting with the alpha 2 release we’ll gather anonymized usage data in order to determine where we can improve the user experience of the framework. We will always transparently communicate what data we collect and how we collect it. Additionally, we will NEVER collect any sensitive or private information. Please consult [our documentation](https://github.com/serverless/serverless/tree/v1.0/docs/usage-tracking) to get an always up to date reference regarding the tracking implementation. Keep in mind that this data is always anonymized and that you [can always opt out](https://github.com/serverless/serverless/tree/v1.0/lib/plugins/tracking) of tracking if you wish!

## Workflow for contributing

We love our community! We’ve updated our [CONTRIBUTING.md](https://github.com/serverless/serverless/tree/v1.0/CONTRIBUTING.md) file to provide you with a better understand how you can get involved and contribute to Serverless.

## What's next?

Take a look at our upcoming [beta release milestone](https://github.com/serverless/serverless/milestone/11) to get an overview of what we're working on next. It will include:

*   Multi provider support
*   Multi programming language support
*   Better local developer experience
*   More guides and a new, improved documentation

We always appreciate feedback so feel free to comment on the issues or open up new ones!

## Introducing our new Serverless forum

We’ve successfully used [Gitter](https://gitter.im/serverless/serverless) in the past as a way to connect and interact with Serverless users from all over the world. In addition to that we’re also releasing our new [Serverless forum](http://forum.serverless.com) alongside the alpha 2 release and would like everyone to join this platform to discuss the future of the Serverless framework and serverless application development in general! [Create your account today and join the discussion](http://forum.serverless.com/). That’s it for now. We hope that you’ll like the alpha 2 and would love to hear your feedback about it!
