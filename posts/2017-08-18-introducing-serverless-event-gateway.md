---
title: Event Gateway - The Missing Piece of Serverless Architectures
description: Event Gateway is the backbone of your serverless architectures. React to any event, with any function, on any cloud.
date: 2017-08-18
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Event_gateway_blog_image.jpg
authors:
  - AustenCollins
---

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event_gateway_repo.png">

## Background

The innovation of serverless compute (FaaS) was huge. It dramatically decreased operational complexity and allowed developers to perform compute more easily than ever.

Then entered the Serverless Framework, which offered an application experience of functions and events around serverless computing. This is now widely known as *serverless architecture*.

Despite being relatively new, serverless architectures have proven themselves well. Serverless teams consistently exhibit shortened time to market, increased developer productivity and reduced operational overhead.

But there has been a missing piece. Developers have been locked into a single cloud provider, unable to perform service communication between various services. They have been left without a good way to perform service discovery across different teams and applications.

That is exactly why we made Event Gateway.

## Introducing: The Serverless Event Gateway

The Event Gateway is an open-source communication fabric for serverless architectures. It combines both API gateway and pub/sub functionality into a single experience.

Inside the Event Gateway, all data is considered to be an event. This lets developers react to data flows of all their applications in a centralized way, with serverless compute.

This is powerful; when developers can manage those data flows from a single place, they can take events from one provider and trigger functions on another provider. Serverless architectures become truly cross-cloud.

## Features

The Serverless Event Gateway is the missing piece of serverless architectures.

### Cross-cloud

Businesses do not want to be limited by where they can access their data. With Event Gateway, any of your events can have multiple subscribers from any other cloud service. Lambda can talk to Azure can talk to OpenWhisk.

This makes businesses completely flexible. Building an events-first experience that exists cross-cloud and on-premise protects you from lock-in, while also keeping you open for whatever else the future may bring.

### Open Source

The Event Gateway is open-source and platform agnostic. Use it to create the cohesive nervous system of your digital business.

Run it on all the major cloud providers, on-premise or in a hybrid architecture. Unify events from all over your system. Even teams who are working on separate applications can easily share resources that shave time and overhead.

### Tightly integrates with Serverless Framework

The Event Gateway ties right into the Serverless Framework and is available for developers to use locally today.

## Get started

Use the Event Gateway to start taking full advantage of the serverless cloud. Serverless architectures just got their missing backbone.

The Event Gateway is currently in beta, and is available to use locally via the Serverless Framework. To check out the code, [see the repo here](https://github.com/serverless/event-gateway) and [walk through the example app](https://github.com/serverless/event-gateway-example).
