---
title: "Serverless Platform updates - TODO"
description: "TODO"
date: 2017-05-17
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless-square-icon-text.png
authors:
  - PhilippMuns
  - BrianNeisler
---

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/serverless-platform-updates.jpg">

Well everyone, we now have a few different product updates to give. We're welcoming Serverless Components and Event Gateway into the product updates family!

We are combining all of these into Serverless Platform updates.

Jump straight into the section you want to read about:

- [Framework v1.27](#changes-in-framework-v1.27): [what's new]
- [Components v0.3](#changes-in-components-v0.3): Install components from url, core version locking, Node 10 support
- [Event Gateway vX](#changes-in-event-gateway): [what's new]

## Changes in Framework v1.27

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

### TODO

## Contributors

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make the Serverless Framework better.

Huge round of applause to all of the contributors who submitted changes for this release:

[TODO]

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

We've added methods for using the components package programmatically. The documentation for these new methods can be found [here](https://github.com/serverless/components)

### Support for Node 4 - 10
We've moved to using babel compilation for components, so the components package now supports version node 4 and greater.

## Changes in Event Gateway

### TODO

## Upcoming releases & contributions

If there's something you want to change about the Serverless Framework, Event Gateway or Components, open an Issue! We even have a [quick & easy guide](https://serverless.com/blog/how-contribute-to-serverless-open-source/) on contributing to Severless open source projects.

[PR reviews](https://github.com/serverless/serverless/pulls) are also highly welcomed, as they greatly speed up the time-to-merge.

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples, or learn more about the Serverless Framework and serverless architectures in general.

We have examples for [Components](https://github.com/serverless/components/tree/master/examples) and [Event Gateway](https://github.com/serverless/event-gateway/tree/master/examples), too.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can use to further enhance the capabilities of the Framework. You can find the full list at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you have a new Framework plugin to submit!
