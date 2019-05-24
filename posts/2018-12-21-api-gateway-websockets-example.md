---
title: "Using API Gateway WebSockets with the Serverless Framework"
description: "We built a plugin to let you use API Gateway WebSockets with the Serverless Framework, even in advance of CloudFormation support! Try it out."
date: 2018-12-21
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/websockets/api-gateway-websockets-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/websockets/api-gateway-websockets-header.svg'
category:
  - guides-and-tutorials
  - news
authors: 
  - JaredShort
---

**Update:** As of v1.38, the Serverless Framework supports WebSockets in core. No need for a plugin! [Read the announcement and how-to here.](https://serverless.com/blog/api-gateway-websockets-support)

As we approach the end of 2018, I’m incredibly excited to announce that we at Serverless have a small gift for you: You can work with Amazon API Gateway WebSockets in your Serverless Framework applications starting _right now_.

But before we dive into the how-to, there are some interesting caveats that I want you to be aware of.

First, this is _not_ supported in AWS CloudFormation just yet, though AWS has publicly stated it will be early next year! As such, we decided to implement our initial support as a plugin and keep it out of core until the official AWS CloudFormation support is added.

Second, the configuration syntax should be pretty close, but we make no promises that anything implemented with this will carry forward after core support. And once core support is added with AWS CloudFormation, you will need to recreate your API Gateway resources managed by CloudFormation. This means that any clients using your WebSocket application would need to be repointed, or other DNS would have needed to be in place, to facilitate the cutover.

I recommend you check out [my original post](https://serverless.com/blog/api-gateway-websockets-support/) for a basic understanding of how WebSockets works at a technical level via connections and callbacks to the Amazon API Gateway connections management API.

With all that out of the way, play with our new presents!

#### How it works—we kept it familiar

Integrating a WebSocket API in your serverless app will feel like second nature if you’re already using our `http` events.

A simple application might look something like the following `serverless.yml`:

```yaml
provider:
  name: aws
  stage: dev
  websocketApiRouteSelectionExpression: $request.body.action

plugins:
  - serverless-websockets-plugin

functions:
  connectionHandler:
    handler: src/handler.handler
    events:
      - websocket:
          routeKey: $connect
      - websocket:
          routeKey: $disconnect
  defaultHandler:
    events:
      - websocket:
          routeKey: $default
  actionHandler:
    events:
      - websocket:
          routeKey: myAction
```

To get started from scratch, you'll need to create your serverless project: `sls create --template aws-nodejs`. Go ahead and `npm install --save serverless-websockets-plugin`, and then add the plugin to your `serverless.yml` plugins listing:

```yaml
plugins:
  - serverless-websockets-plugin
```

Check the [plugin docs](https://github.com/serverless/serverless-websockets-plugin) for more about configuration of the plugin and related events.

#### The “hello world” of WebSocket apps

No release of anything using WebSockets would be complete without an example app, so we put one together. And it just so happens to be a massively scalable, serverless chat app.

We’re leveraging the usual suspects here: API Gateway WebSockets (of course), AWS Lambda, DynamoDB, and—perhaps the most interesting piece of this entire thing—we'll talk about DynamoDB streams.

##### Chat app architecture

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/websockets/connection-management.png" alt="connection management diagram">

As users connect and disconnect, we store their connection Id in the DynamoDB table, as well as register them into the "General" chat channel.

Users can then:

- Subscribe to a channel (the first subscription creates the channel)
- Unsubscribe from a channel
- Send a message to all users in a channel

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/websockets/send-message.png" alt="send channel a message diagram">

Each time any of these things occurs, we send out a broadcast to all subscribers of a channel what has happened. If someone joined the channel, left (or disconnected and left all channels), or a message was sent.

When a user disconnects, we use the "disconnect" message from API Gateway to delete all the connection subscriptions so we don't waste cycles trying to send messages to dead connections.

When a user sends a message via the WebSockets, we look up all the subscriptions and their connection Id's from the DynamoDB table, and send them a message over their corresponding WebSocket with the content and other information—straightforward behavior, and similar to what you would expect for WebSockets.

##### Why DynamoDB streams?

So, what are we leveraging DynamoDB streams for you ask?

We decided to think about things a bit differently to demonstrate the power of this architecture. When a user unsubscribes or subscribes to a channel, we don't _immediately_ notify everyone in the same Lambda invocation. Rather, we have AWS Lambda receive that stream and process it asynchronously.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/websockets/channel-subscriber.png" alt="channel subscriber flow diagram">

It still happens extremely fast, and to all WebSocket clients, it appears no different.

The real power of this approach is: say you have sub-services or systems running that want to send messages, or ban users. Those subsystems don't need to care about the implementation of the WebSocket system; they simply work with the DynamoDB table and can create, update and delete subscriptions, send bot messages, etc. Those changes flow through the exact same pattern as if they were issued via WebSocket clients themselves.

I think this is a pretty neat concept, and I am curious to see what folks build with it!

#### A couple notes about WebSockets and the ApiGatewayManagementApi

You cannot send messages back the typical way as an HTTP response payload you may be used to with API Gateway HTTP. Just return back a statusCode (ex: 200) property in your payload to tell API Gateway everything is good, but it will not send that to the client. If there are errors like a 500, those _will_ go to the client.

You cannot send a WebSocket message via the Management API in the `$connect` route, that needs to succeed before the socket connection will allow messages to flow. You will get a `410` code meaning the connection is "Gone" (or doesn't exist yet.).

For some psuedo-code, it would look something like this:

```javascript

const success = {
  statusCode: 200
}

async function connectionHandler(event, context){
  await saveConnectionInfoToDynamoDB(event.requestContext.connectionId);
  return success;

  // if we would try to post to the websocket management api here, we would get a 410
  // we must first "successfully" execute this connection handler to establish the WebSocket
}

// assume there is other logic and processes that save "channel" subscriptions for each
// subscriber, along with their connectionId information

async function messageHandler(event, context){
  const payload = JSON.parse(event.body);

  // fetch anyone subscribed to a channel defined in payload for a datastore
  const subscribers = await fetchSubscribersToChannel(payload.channelId);

  // for each subscriber to the channel, we have to send a message per connection
  // (no batch, one call to Api Gateway Management API per message)
  const messages = subscribers.map(async (subscriber) => {
    return sendMessageToSubscriber(subscriber.connectionId, payload)
  })
  
  // make sure they all send
  await Promise.all(messages)

  // still have to let api gateway know we were successful!
  return success;
}
```

`410` error codes mean the connection is gone (or isn't established yet). Depending on your use case, you may want to clean those up in your data store so you don't keep trying to send messages!

You can close connections from the "server" side via the ApiGatewayManagementApi. In addition, the `$disconnect` route invoke is a best attempt, and not a guarantee. (That said, I haven't seen it fail yet, so it seems like a small edge case.)

If you are using the AWS CLI to send messages, be sure to use the `--endpoint` parameter to override the default api used to your actual `wss` api endpoint. The [docs](https://docs.aws.amazon.com/cli/latest/reference/apigatewaymanagementapi/index.html?highlight=api%20gateway%20management) mention this in the top level description of the command, but not in the `post-to-connection` description.

Check out the docs for the ApiGatewayManagementApi for [AWS NodeJS SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/ApiGatewayManagementApi.html) and [Boto3](https://boto3.amazonaws.com/v1/documentation/api/latest/reference/services/apigatewaymanagementapi.html?highlight=apigatewaymanagementapi) to learn more.

#### Now, try it out!

You can [find all the code on GitHub](https://github.com/serverless/serverless-websockets-plugin/tree/master/example), and run this sample chat app in your own AWS account with a single `serverless deploy`.

Now get out there and build something great!

##### Resources

- [Full chat app example on GitHub](https://github.com/serverless/serverless-websockets-plugin/tree/master/example)
- [Explainer: Real-time applications with API Gateway WebSockets](https://serverless.com/blog/api-gateway-websockets-support/)
