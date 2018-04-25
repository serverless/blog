---
title: "What are Serverless Components, and how do I use them?"
description: "Serverless Components gives you a way to compose and share parts of a cloud application. Serverless development just got even easier."
date: 2018-04-25
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Serverless_logo.png'
authors:
  - BrianNeisler
---

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components.gif">

## So, what’s the goal with Serverless Components?

We want to make it easier for you, our developer community, to assemble cloud applications. Plain and simple.

Composing a modern application means you’re plucking bits of SaaS and managed services from all over, and stringing them together. You can create anything this way: a REST API, a static website, an SMS app, an IoT app. But with all this choice comes added complexity.

There’s a lot of wiring you have to do to assemble these pieces together, and not a lot of tooling.

## Enter: Serverless Components

Serverless Components aims to change all of that.

Components presents a single experience where you can provision infrastructure and code across all cloud and SaaS vendors. Think of them like composable, reusable building blocks, which you can use to build applications more easily.

Serverless Components will also form an ecosystem driven by community contributions, which you can browse through and utilize. The net result is that you save development time. Don’t build your own image processing API from scratch—use the existing component and tweak it.

## How Serverless Components works

Let’s take a look at how you can compose multiple Components into an entire application.

### A standardized configuration

Say you want to write a serverless image processing API. To do so, you might write a Lambda function, tie it into API Gateway, and back it by DynamoDB. 

Any cloud service can be a Serverless Component:

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/individual-components.png">

Serverless Components will wrap around all three of the smaller parts you need to build your API (Lambda, API Gateway, and DynamoDB). It will then expose configurable inputs and turn them into building blocks which you can easily compose together.

<image src=”https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/lambda-endpoints.png”>

### Combining smaller components into larger components

These three small components have now been combined into a larger, reusable Image Processing API Component.

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/image-api.png">

Here’s why this is important. When you compose this image processing API, you will do a lot of initial configuration. You’ll hook it up to DynamoDB, expose the endpoints, determine how to store the images, tell the API to resize everything to 400x600 px, etc.

But once the component is made, you can reuse this exact component somewhere else. Or, another developer can use it in their own application, and tweak some aspects of the configuration—for instance, maybe they want their images to resize to 600x1200 px.

Components essentially become use cases, which can be instantly used and reused by anyone.

### Several components combine to form an application

You can take these larger building blocks, and compose them together into *even larger* blocks. 

Let’s zoom out from our image processing API. When you think about building an application, it has needs across the board. You need to save users and their credentials, you need to authenticate users via password, SMS, or Google Auth.

With Serverless Components, you can package all of that up into an authentication API that plugs into a users API. You can tie all of these Components together to get a full user system. 

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/photo-app.png">

If I’m building an image application, behind all that auth my application could be powered by a combination of image processing blocks (such as the image processing API we designed earlier).

Like so, entire applications can be built by using various combinations of Serverless Components.

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/full-tower.png">

## Ready to try Serverless Components?

Great! We have a full working example ready to go.

Head on over to the [Serverless Components repo](https://github.com/serverless/components) on GitHub and check out our [example retail app](https://github.com/serverless/components/tree/master/examples/retail-app).

We’d love to hear any and all feedback from you, our developer community. So try it out and tell us what you think!

## Answering some general questions

### What’s next for Serverless Components?

We believe that Components represents the ideal developer experience for the future of serverless development.

Eventually, once the design has matured, it may be integrated into the Serverless Framework. But there’s a lot of dependency on the Framework itself to be very stable and dependable, and Components is not yet ready for production usage. As such, we didn’t want to immediately integrate it into the Framework.

Instead, we want to work hard to identify the right implementation patterns. By leaving this out of the core Framework for now, we have the freedom to do that work and get it just right before we integrate it in.

### Why didn’t you build this on top of an existing infrastructure as code tool, like CloudFormation or Terraform?

CloudFormation is aimed specifically at infrastructure only for AWS, and the same is true for any other infrastructure as code tool built by a cloud provider. The reality is, we believe that the way applications are being built (and will continue to be built) is that they span multiple clouds and multiple services.

The reason we’re not using Terraform goes back to the specifics around keeping focused on systems with serverless qualities. We risk opening up the door for things to be built that do not adhere to those serverless qualities—in which case we go back to the exact same problems we outlined earlier.

To build a real community-driven ecosystem, you have to be able to rely on each part to be scalable, low and predictable in cost, and light on administrative overhead.
