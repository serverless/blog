---
layout: Post
title: 'Defining Serverless and Why It Matters to Developers'
date: 2016-09-01
description: "You’ve probably heard the term serverless. But what does it actually mean? And more importantly, as a developer, why should you care?"
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/sls.png
authors:
  - StefanieMonge
tags:
- serverless
---

You’ve probably heard the term _serverless._ But what does it actually mean? And more importantly, as a developer, why should you care?

Serverless refers to a cloud architectural design pattern that abstracts servers away to the point that developers have little to no direct interaction with them. Of course technically there are still servers behind the scenes, but you don’t have to worry about managing them.

Serverless providers (e.g. AWS Lambda), also known as function-as-a-service (Faas) providers, remove servers from the equation by providing an event-driven, pay-per-execution compute service.

In practice this means you write a function — a small fragment of code — and upload it to the service provider. You can then execute that function based on any event. For example, a user clicking a signup button or a new record being stored in your database. When that event occurs a machine spins up, runs your function, then shuts down. You only pay for the exact time it took to execute your function.

In the serverless world your cloud provider is the one responsible for managing, provisioning and scaling servers — so you don’t have to. This makes scaling your serverless apps much more efficient. Additionally, you no longer need to pay for servers when you’re not using them. This makes going serverless dramatically cheaper than any previous compute service.

**We’re excited about the possibilities of serverless compute services for a few reasons:**

1\. They allow developers to focus more time on building functionality and less time managing servers.

2\. They significantly reduce the cost of cloud hosting.

3\. They allow for new and interesting event based workflows.

At Serverless Inc. we want to help developers take full advantage of these possibilities. Our goal is to build tools that empower developers to create the next generation of event-driven architectures. We believe this will allow you to produce higher levels of output while lowering your total cost of ownership, and in general make your work and life just a little bit happier.

* * *

_Also published on [Medium](https://medium.com/@serverlessinc/defining-serverless-and-why-it-matters-to-developers-2a972aacbbe4)._
