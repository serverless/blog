---
layout: Post
title: 'Writing Serverless Framework Plugins'
date: 2016-12-12
description: "In this tutorial, you’ll learn by examples how to write your own plugins. We’ll start from very simple examples and build up on them to get all the way to writing useful plugins that coul help you with your everyday deployments."
tags:
- serverless
---

If you’ve opened this article, you probably know some basics of the Serverless Framework such as deploying lambdas and creating API endpoints. While using it, you might have hit a block where doing something with the framework is either difficult, impossible, or simply too repetitive. You can ease your pain by using plugins. Some are already built for the most common problems but there are always some project-specific issues that plugins can help you resolve. Fortunately, writing a plugin for the Serverless Framework is easier than you might think.

In this tutorial, you’ll learn by examples how to write your own plugins. We’ll start from very simple examples and build up on them to get all the way to writing useful plugins that coul help you with your everyday deployments.

##Lesson 1 – Create First Plugin

The Serverless Framework is an incredibly well-built open source platform. It is nearly indefinitely extensible and allows you to add new features with surprising ease. Let’s see how you can do that in the simplest way possible.

Somewhere in a new directory run:

```
serverless create --template plugin
```

This command will create an `index.js`. When you open this file, you'll see a class with a constructor and a few simple functions. Let's have a look at it step by step.

```js
class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    // ...
  }
  // ...
}
```

Every serverless plugin is a class. This class gets instantiated with a `serverless` object and a bunch of `options`.
