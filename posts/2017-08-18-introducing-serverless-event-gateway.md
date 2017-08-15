---
title: The Missing Piece of Serverless Architectures - Event Gateway
description: Serverless launches Event Gateway is a new tool for operating serverless architectures. React to any event, with any function, on any cloud.
date: 2017-08-18
layout: Post
thumbnail:
authors:
  - AndreaPasswater
---

## Introduction

Before we can talk about the future of serverless, we have to touch on the past.

You know the story: In the beginning, there were monolithic architectures. Then the monoliths got broken up into individual microservices—which provided more flexibility, but were painful enough to set up and manage that most people didn’t bother.

And *then* came serverless computing.

So here we are. In a serverless world, microservices are easier to implement. But there are still management pain points. For example, How can developers perform service discovery across different teams and applications? What about service communication between various services and cloud providers?

That is exactly why we made Event Gateway.

## What it is

The Event Gateway combines both API gateway and pub/sub functionality into a single experience.

Inside the Event Gateway, all data is considered to be an event. This lets developers react to data flows of all their applications in a centralized way.

This is powerful; when developers can manage those data flows from a single place, they can take events from one provider and trigger functions on another provider. Serverless architectures become truly cross-cloud.

## What it isn’t

The Event Gateway is *not* a FaaS platform. It integrates with existing FaaS providers (like AWS Lambda, Google Cloud Functions and OpenWhisk Actions) so developers can build large serverless architectures in a unified way.

## Features

The Serverless Event Gateway has been the missing piece of serverless architectures.

Here’s what it allows you to do-

### Collect events from anywhere

The serverless possibility space has historically been smaller than it needed to be. The only events you could react to were locked into a single provider.

But in the Event Gateway, all the data flowing through your system becomes an event, and you can see and react to those events regardless of which cloud they are deployed on. Application events, deployment events, IoT events, everything is game.

### Subscribe any function to those events

Any one of your actionable events can have multiple subscribers from any other cloud service. Lambda can talk to Azure can talk to OpenWhisk.

In practical terms: when a new user account gets created, you can trigger a welcome e-mail and also prompt them to share an invite with their friends, regardless of where those services are hosted or where the event comes from.

Any event in your system can set off a series of cross-cloud reactions. 

### Expose events and functions to your team

Unify events from all over your system. Need a function for a service you’re building? There might be one in deployment already that you can use.

Even teams who are working on separate applications can easily share resources that shave time and overhead.

## Conclusion

In the development environment, things have been getting smaller and more fragmented without a good way to centralize them. Each integration is a siloed service, which is configured separately. This fractured setup creates a lot of friction in the creative process and inhibits productivity.

The Event Gateway is the first step in bringing back the single development experience. Consolidate your integrations, manage everything in one place, and start taking full advantage of the serverless cloud.

This is the way cloud should be.

The Event Gateway is currently in beta, and some functionality is available via the Serverless Framework. To learn more, check out our write-up in GitHub on the [challenges of SOA](https://github.com/serverless/event-gateway#background), and the [Event Gateway Product page](https://github.com/serverless/product#event-gateway).
