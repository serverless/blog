---
title: "Serverless Platform updates - Install Components from url, Fn Project support, CloudEvents"
description: "See what's new in Serverless Components, Framework, and Event Gatway. Install Components from url, Fn Project support, and more."
date: 2018-05-17
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/serverless-platform-updates.jpg'
category:
  - news
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/serverless-platform-updates.jpg'
authors:
  - BrianNeisler
---

Well everyone, we now have a few different product updates to give. We're welcoming Serverless Components and Event Gateway into the product updates family!

We are combining all of these into Serverless Platform updates.

Jump straight into the section you want to read about:

- [Components v0.3](#changes-in-components-v0.3): Install components from url, core version locking, Node 10 support
- [Framework v1.27](#changes-in-framework-v1.27): Fn Project support, fixes for the variables system, support for AWS GovCloud and China regions
- [Event Gateway](#changes-in-event-gateway): Hosted beta is ready to use, Serverless Framework plugin, CloudEvents support

## Changes in Components v0.3

The new components release contains a bunch of goodies.

### Install components from URL

In version 0.3, you can now reference a component type using a url as a source. This allows for reusable components by uploading them to a URL first, giving teams a way to share components.

![component type url](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/updates/feature-component-type-url.png)

### Package command

Alongside the ability to use Components from a url, we have also added a package command. This command will pack up a component directory into a zip for reuse.

![component package command](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/updates/feature-components-package-command.png)

### Core version locking

This feature gives developers a way of declaring which version of Components core their component is compatible with. If a component is included that is incompatible with the current version of core, an error is thrown.

![core version locking](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/updates/feature-components-core-version-locking.png)

![core version locking error](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/updates/feature-components-core-version-locking-error.png)

### Programmatic Usage API

We've added methods for using the components package programmatically. The documentation for these new methods can be found [here](https://github.com/serverless/components).

### Support for Node 4 - 10
We've moved to using babel compilation for components, so the components package now supports version node 4 and greater.

## Changes in Framework v1.27

Framework v1.27 introduces Fn support, fixes for the variables system, and support for AWS GovCloud and China regions.

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

### Fn support

The Fn Project is an open-source, container-native serverless platform that runs on any cloud or on-prem. And now there is an integration with the Serverless Framework.

[Read here](https://serverless.com/blog/fn-project-serverless/) for more details and some examples.

### Fixes for the variables system

We introduced several improvements and fixes, including pre-population of service and region values, a "PromiseTracker" class, and more.

Read up on [the whole list of changes](https://github.com/serverless/serverless/pull/4713)!

### Support for AWS GovCloud and China regions

Just what it says on the tin. [Check it out here](https://github.com/serverless/serverless/pull/4665)!

## Contributors

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make the Serverless Framework better.

Huge round of applause to all of the contributors who submitted changes for this release! 👏

## Changes in Event Gateway

[As we recently announced](https://serverless.com/blog/react-to-any-cloud-event-hosted-event-gateway/), the open-source [Event Gateway](https://serverless.com/event-gateway/) project now also exists as a hosted (read: fully serverless) service.

### Plugin for the Serverless Framework

The Event Gateway plugin for the Serverless Framework makes it dead simple to deploy your Lambda functions with Event Gateway.

The plugin enables you to:

- register API endpoints
- put endpoints from different services on the same domain very easily, even if those services are in different AWS accounts
- hook up custom events, so that if one of your services emits an event, another function in a different service can subscribe to it
- set up connectors in the Event Gateway to route events to external systems.

[Check out the plugin here](https://github.com/serverless/serverless-event-gateway-plugin) or try the [get started example](https://github.com/serverless/event-gateway-getting-started).

### CloudEvents support

The Cloud Native Computing Foundation (CNCF) has been working on [CloudEvents](https://www.cncf.io/blog/2018/02/14/cncf-takes-first-step-towards-serverless-computing/), a specification for describing event data in a common way across providers. At Serverless, we've taken a leading role in this effort; we believe strongly in the importance of standards and interoperability in this new event-driven world.

As such, Event Gateway CloudEvents-compatible. All functions receive a CloudEvents payload describing the event received.

### Configurable connectors

Connectors let you *Write Less Code* in the true serverless way. Configuration is better than code wherever possible.

In that spirit, Connectors in Event Gateway are bits of logic which take your event and send it to another system—Firehose, Kinesis, or SQS for instance—without having to write the boilerplate integration code into a Lambda function.

[Try an example here](https://github.com/serverless/event-gateway-getting-started).

## Upcoming releases & contributions

If there's something you want to change about the Serverless Framework, Event Gateway or Components, open an Issue! We even have a [quick & easy guide](https://serverless.com/blog/how-contribute-to-serverless-open-source/) on contributing to Serverless open source projects.

[PR reviews](https://github.com/serverless/serverless/pulls) are also highly welcomed, as they greatly speed up the time-to-merge.

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples, or learn more about the Serverless Framework and serverless architectures in general.

We have examples for [Components](https://github.com/serverless/components/tree/master/examples) and [Event Gateway](https://github.com/serverless/event-gateway/tree/master/examples), too.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can use to further enhance the capabilities of the Framework. You can find the full list at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you have a new Framework plugin to submit!
