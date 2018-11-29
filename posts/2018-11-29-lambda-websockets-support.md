---
title: "Why we're so excited about API Gateway websockets support"
description: "AWS just announced API Gateway websockets support, and the serverless community got pretty excited. Here's why."
date: 2018-11-30
thumbnail: TODO
heroImage: TODO
category:
  - news
authors: 
  - JaredShort
---

AWS just announced the launch of a widely-requested feature: websockets for Amazon API Gateway. This means Framework users around the world finally have a straightforward way to create client-driven, real-time applications via websockets.

Read on for more info on how this changes the game for real-time development, and the Serverless Framework plans to support websockets in API Gateway!

#### Life before websockets support

Sure, there were hack-y ways to do real-time applications before.

You could, for instance, use [AWS IoT topics with MQTT over websockets](https://serverless.com/blog/realtime-updates-using-lambda-websockets-iot), or [via AWS AppSync](https://serverless.com/blog/building-chat-appliation-aws-appsync-serverless), a great management layer with GraphQL wrapped over AWS IoT behind the scenes.

They worked, but they weren’t ideal.

#### Websockets support makes real-time so much easier

The websockets support that was announced today means developers have much more control over the websocket layer itself, delivering payloads directly to lambda functions and shuttling results back.

There are other classes of services out there, like Ably or PubNub, which offer solutions in this space. But staying closely integrated to your platform provider for core services can make a lot of sense for many organizations. Security teams and billing departments appreciate working with a known vendor.

To understand the power of this new feature, let’s look for example architecture building the canonical “chat” example for real-time websocket driven applications.

[EXAMPLE ARCHITECTURE]

#### Serverless Framework support

Websockets for API Gateway is unfortunately not GA yet. We are working to bring this new feature to the Serverless Framework ASAP so you can leverage it as it becomes available!
