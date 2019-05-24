---
title: "Real-time applications with API Gateway WebSockets and AWS Lambda"
description: "AWS just announced API Gateway WebSockets support, and the serverless community got pretty excited. Here's why."
date: 2018-11-29
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-header1.gif'
category:
  - news
authors: 
  - JaredShort
---

AWS just announced the launch of a widely-requested feature: WebSockets for Amazon API Gateway. This means Framework users around the world finally have a straightforward way to create client-driven, real-time applications via WebSockets.

Read on for more info on how this changes the game for real-time development, and the Serverless Framework plans to support WebSockets in API Gateway!

#### Life before WebSockets support

Sure, there were hack-y ways to do real-time applications before.

You could, for instance, use [AWS IoT topics with MQTT over WebSockets](https://serverless.com/blog/realtime-updates-using-lambda-websockets-iot), and I have even heard of folks running containers or cluster to broker WebSocket connections even though the rest of their systems are serverless.

There is also fantastic WebSocket support [in AWS AppSync](https://serverless.com/blog/building-chat-appliation-aws-appsync-serverless), but this introduces some complexities with a GraphQL layer and you give up a bit of control in exchange for simplicity. Undoubtedly a great solution if it can meet your needs.

#### WebSockets support makes real-time so much easier

The WebSockets support that was announced today means developers have much more control over the WebSocket layer itself, delivering payloads directly to lambda functions and shuttling results back.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/WebSocket?src=hash&amp;ref_src=twsrc%5Etfw">#WebSocket</a> APIs enable you to support a WS connection to <a href="https://twitter.com/hashtag/APIGateway?src=hash&amp;ref_src=twsrc%5Etfw">#APIGateway</a>, which can then invoke Lambda when a message is received (also on connect/disconnect). You can send a message by making a request to a callback URL with the connectionId.</p>&mdash; Dougal Ballantyne @ re:Invent (@dsballantyne) <a href="https://twitter.com/dsballantyne/status/1068211212280750080?ref_src=twsrc%5Etfw">November 29, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

There are other classes of services out there, like Ably or PubNub, which offer solutions in this space. But staying closely integrated to your platform provider for core services can make a lot of sense for many organizations. Security teams and billing departments appreciate working with a known vendor.

#### A real-time WebSockets example

To understand the power of this new feature, let’s look for example architecture building the canonical “chat” example for real-time WebSocket driven applications.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/websockets-chat-app.png" alt="WebSockets chat app" style='width:751px; margin:0 auto'>

With these native WebSockets in API Gateway, you establish a single WebSocket connection to API Gateway from the device. AWS Lambda is notified of the connection in your normal event-driven compute method. You get some metadata, the payload and a connectionId that you use later.

It's probably a good idea for you to store this connectionId and information the device sent you (perhaps topics or channels they are subscribed to) in a datastore such as DynamoDB, so you can reference it later when needed.

Next, say someone wants to send a new message out to the channel. They would send it over their established WebSocket to API Gateway, to a waiting AWS Lambda function. On invoke, the business logic would check your datastore for the connections subscribed to that channel, and callback to API Gateway with the connectionId and your payload.

API Gateway will take it from there and send your payload through on the established WebSocket connection.

You Lambda function would be invoked on disconnects as well, allowing you to clean things up in your data store so you don't waste cycles trying to send messages to non-existent connections.

In sum: this is simple, event-driven, and real time. This single feature makes a whole new class of applications first class citizens in the serverless ecosystem!

#### Serverless Framework support

WebSockets for API Gateway is unfortunately not GA yet.

We are working to bring this new feature to the Serverless Framework ASAP so you can leverage it as it becomes available, so stay tuned!
