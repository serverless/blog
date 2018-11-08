---
title: "React to any cloud event with hosted Event Gateway"
description: Event Gateway as a hosted service, configurable connectors, and a plugin for the Serverless Framework.
date: 2018-05-03
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway-announcement/event-gateway-readme-header1.png'
category:
  - news
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway-announcement/event-gateway-readme-header1.png'
authors:
  - AlexDeBrie
featured: all
---

Last year, we released the [Event Gateway](https://serverless.com/event-gateway/) project: an open source serverless communication fabric that allowed developers to react to any event, with *any* function, on any provider.

When we did that, we were looking to solve a lot of common problems serverless developers experience.

We wanted to make it easier to build decoupled APIs backed by FaaS. We wanted to enable an event-driven future, make it easier to share events across teams and services, and give teams the ability to build a reactive, *truly* pay-per-use infrastructure.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The Serverless Event Gateway is pretty dope. React to any event, with any function, on any provider. <a href="https://t.co/TMtPoXWUja">https://t.co/TMtPoXWUja</a></p>&mdash; Kelsey Hightower (@kelseyhightower) <a href="https://twitter.com/kelseyhightower/status/921114988269379585?ref_src=twsrc%5Etfw">October 19, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

But that was only step 1.

This post talks about some exciting updates for Event Gateway, and also where we’re going next.

**Note:** If you just want to get straight to seeing Event Gateway in action, you can watch Austen Collins demo it at CloudNativeCon below:

<iframe width="560" height="315" src="https://www.youtube.com/embed/TZPPjAv12KU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Now, on to the news!

## Event Gateway as a hosted service

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway-announcement/event-gateway-integrations1.png">

In its initial iteration at launch, Event Gateway was a piece of software that you had to start up and run. You needed servers to interact with it. And while a lot of people loved Event Gateway and all the problems it solved, they (shocker!) didn’t love that it forced them to deal with infrastructure.

So today, we’re [releasing a public beta of Event Gateway as a hosted service](https://serverless.com/event-gateway/)!

In other words, Event Gateway goes serverless! You can get up and running with it *right now*, no infrastructure required.

<a href="https://dashboard.serverless.com"><img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway-announcement/event-gateway-dashboard.png"></a>

[Sign up here](https://dashboard.serverless.com), and then check out our [getting started guide](https://github.com/serverless/event-gateway-getting-started) to hit the ground running. The getting started example takes only a few minutes.

## Configurable connectors

Lots of FaaS usage is essentially glue code between two systems.

A frontend client sends a data payload to an endpoint that’s sent to another system for analytics processing. Or, you catch an emitted event and put it in SQS for integrating with legacy infrastructure.

But part of the serverless mantra is: Write Less Code. Don’t write boilerplate code where you don’t need it, and configuration is better than code wherever possible. Focus on your business logic, and outsource code to others.

**That’s why we’ve added the notion of connectors into Event Gateway.** These are bits of logic which take your event and send it to another system—Firehose, Kinesis, or SQS for instance—without having to write the boilerplate integration code into a Lambda function.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway-announcement/event-gateway-connector-medium.png">

These connectors are configurable. You specify the end system you want to send your event to (such as a Kinesis stream or SQS queue), and the Event Gateway will handle forwarding the event to that system.

No more glue code in Lambda just to pipe data from one system into another. Write configuration, not code.

## Plugin for the Serverless Framework

We made [a plugin for the Serverless Framework](https://github.com/serverless/serverless-event-gateway-plugin) that makes it really easy to deploy your Lambda functions with Event Gateway.

The plugin enables you to:
- register API endpoints
- put endpoints from different services on the same domain very easily, even if those services are in different AWS accounts
- hook up custom events, so that if one of your services emits an event, another function in a different service can subscribe to it
- set up connectors in the Event Gateway to route events to external systems.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway-announcement/event-gateway-plugin-full.png">

We have a [getting started example](https://github.com/serverless/event-gateway-getting-started) for using the Event Gateway plugin with our hosted Event Gateway. Check back next week for an in-depth walkthrough tutorial on using the different features of Event Gateway with the plugin.

## CloudEvents integration

The Cloud Native Computing Foundation (CNCF) has been working on [CloudEvents](http://cloudevents.io/), a specification for describing event data in a common way across providers. We at Serverless have taken a leading role in this effort, as we believe strongly in the importance of standards and interoperability in this new event-driven world. That's why we have made the Event Gateway CloudEvents-compatible. All functions receive a CloudEvents payload describing the event received.

The [CloudEvents spec](https://github.com/cloudevents/spec) recently hit an 0.1 release, and the CNCF Serverless Working Group is pushing hard toward the 1.0 milestone.

## The future of Event Gateway: where we’re going

Our path here is threefold: we want to continue adding more functionality into the user experience, integrate a wider range of available function types, and make it even easier to pull in different events.

### User experience and diagnostics

An event-driven system is inherently harder to debug than a more synchronous, request-response setup. You have to be careful to understand that your function didn’t trigger on a given event and then debug the reason.

Was the event emitted? Was the subscription configured incorrectly? Did the function fail?

We’re working to add better diagnosability so that you know that your system is working as it should and how to debug it when it’s not.

### Function Types

We want to increase the range of function types you can use to include additional FaaS providers, such as Azure Functions, Kubeless, OpenFaaS, and others.

We also want to include more built-in, configurable functions to handle boilerplate logic: authorization, validation, transformation, enrichment, and connecting other systems.

### Feeding events into the Event Gateway

We want to make it easier for serverless application developers to integrate diverse event types, from a variety of cloud sources and SaaS applications, into Event Gateway. For instance, pulling data from event stores like Kafka and Kinesis, so that developers can seamlessly react to those events with functions in a unified way.

This, we believe, is how developers will finally realize the true power of events combined with FaaS.

## Get started!

For a really nice example that takes you through API Gateway usage and custom event usage in only a few minutes, go straight to the [getting started guide](https://github.com/serverless/event-gateway-getting-started).

If you want to sign up for the hosted version, [here’s where you can make an account](https://dashboard.serverless.com).

You can also check out the [open source Event Gateway project](https://github.com/serverless/event-gateway) on GitHub.

### More examples and resources

- Kelsey Hightower used Event Gateway to power his demo at KubeCon. [See his Github repo here](https://github.com/kelseyhightower/event-gateway-on-kubernetes), or [watch the live demo](https://www.youtube.com/watch?time_continue=2&v=_1-5YFfJCqM).
- Austen Collins [demos Event Gateway triggering 11 different cloud providers](https://www.youtube.com/watch?v=TZPPjAv12KU) in his CloudNativeCon talk.
- You can find a couple more in-depth examples in the [Event Gateway examples repo](https://github.com/serverless/event-gateway/tree/master/examples).
