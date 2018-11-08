---
title: How to build a serverless notification system on AWS
description: Guest author Diego Zanon writes about building a serverless notification system for browsers using the Serverless Framework and AWS IoT.
date: 2016-11-30
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/serverless-notifications-on-aws.jpg'
category:
  - guides-and-tutorials
authors:
  - DiegoZanon
---

Real-time notifications are an important use case for modern apps. For example, you may need to notify your user that another post is available in their social feed or that someone else added a comment on one of their photos.

But how do you do this serverless-ly?

Typically, you would use WebSockets and have a dedicated server. You'd make a permanent link between the user and the server, and use the publish-subscribe pattern to share messages. The browser would subscribe to automatically receive new messages without needing a polling mechanism to constantly check for updates.

But if you're going serverless, you don't *have* a dedicated server.

Instead, you'll need a cloud service that will solve this problem for you providing scalability, high availability, and charging per messages and not per hour.

## The solution: AWS + the Serverless Framework

In this post, I'm going to describe how I implemented a notification system for unauthenticated users with the Serverless Framework and AWS IoT for *browsers*.

I know that "Internet of Things" sounds strange to be used in a website, but it supports WebSockets, is very easy to use, and unlike Amazon SNS (Simple Notification Service) it supports WebSockets. Win!

### Why IoT?

I used IoT due to its simple messaging system. You create a "topic" and make users to subscribe to it. A message sent to this topic will be automatically shared with all subscribed users. A common use case for this is a chat system.

If you want private messages, you just need to create private topics and restrict the access. Only one user will be subscribed to this topic and you can make your system (Lambda functions) to send updates to this topic to notify this specific user.

## Demo

You can find the code on [GitHub](https://github.com/zanon-io/serverless-notifications).

Try it here: https://serverless-notifications.zanon.io (open two browser tabs)

<p align="center">
  <a href="https://serverless-notifications.zanon.io">
    <img src="https://zanon.io/images/posts/2016-11-05-test.png" alt="demo">
  </a>
</p>

## Architecture

I've used the following architecture in this demo.

<p align="center">
  <img src="https://zanon.io/images/posts/2016-11-05-architecture.png" alt="architecture">
</p>

1. User makes a request to Route 53 that is configured to reference a S3 bucket.

2. S3 bucket provides the frontend code (HTML / CSS / JavaScript / images) and the IoT client code.

3. After loading the frontend code, an Ajax request is done to the API Gateway to retrieve temporary keys.

4. The API Gateway redirects the request to be handled by a Lambda function.

5. The Lambda function connects to IAM to assume a role and create temporary AWS keys.

6. Frontend code subscribe to IoT events using the temporary keys.

## Frontend

This demo runs in a static site hosted on Amazon S3. As I've used a Node.js module to connect with IoT, the **index.html** file adds a **bundle.js** that was processed with [Browserify](http://browserify.org/). I'll explain how it was done in the following sections.

### AWS IoT

In this project I used the Node module [AWS IoT SDK](https://github.com/aws/aws-iot-device-sdk-js) to connect to the IoT service.

First, you need to create a "device" (client browser) by providing access keys and setting the IoT endpoint that is specific to your AWS account. I'll show later how you find those data. After providing those values, it will try to connect.

The next step is to set callback functions to handle incoming events. You need to hook at least with **message** (receive messages) and **connect** (subscribe to a topic after successfully connected to IoT), but you can also handle the following events: **reconnect**, **error**, **offline** and **close**.

To send messages, you use: `client.publish(iotTopic, message)`

```javascript
const awsIot = require('aws-iot-device-sdk');

let client, iotTopic;
const IoT = {

    connect: (topic, iotEndpoint, region, accessKey, secretKey, sessionToken) => {

        iotTopic = topic;

        // connect
        client = awsIot.device({
            region: region,
            protocol: 'wss',
            accessKeyId: accessKey,
            secretKey: secretKey,
            sessionToken: sessionToken,
            port: 443,
            host: iotEndpoint
        });

        client.on('connect', onConnect);
        client.on('message', onMessage);
        client.on('close', onClose);
    },

    send: (message) => {
        client.publish(iotTopic, message); // send messages
    }
};

const onConnect = () => {
    client.subscribe(iotTopic); // subscribe to a topic
    console.log('Connected');
};

const onMessage = (topic, message) => {
    console.log(message); // receive messages
};

const onClose = () => {
    console.log('Connection failed');
};
```

In the project's folder you can find a folder named **iot**. Open it and run `npm install`, followed by `node make-bundle` to execute Browserify and export the **bundle.js** dependency that can run in the browser.

### Client-side code

The client-side will use the IoT object that you've just created. It will be responsible by:

1) Request Access Keys and the IoT endpoint address

This request will be sent to API Gateway and handled by a Lambda function that will be configured later.

```javascript
$('#btn-keys').on('click', () => {
    $.ajax({
        url: apiGatewayEndpoint,
        success: (res) => {
            addLog(`Endpoint: ${res.iotEndpoint},
                    Region: ${res.region},
                    AccessKey: ${res.accessKey},
                    SecretKey: ${res.secretKey},
                    SessionToken: ${res.sessionToken}`);

            iotKeys = res; // save the keys
        }
    });
});
```

2) Connect with IoT and subscribe for future messages

```javascript
$('#btn-connect').on('click', () => {
    const iotTopic = '/serverless/pubsub';

    IoT.connect(iotTopic,
                iotKeys.iotEndpoint,
                iotKeys.region,
                iotKeys.accessKey,
                iotKeys.secretKey,
                iotKeys.sessionToken);
});
```

3) Send messages

```javascript
$('#btn-send').on('click', () => {
    const msg = $('#message').val();
    IoT.send(msg);
    $('#message').val('');
});
```

## Backend

Now you need to create your backend. Using the Serverless Framework will make this task easier by deploying the API Gateway endpoint and your Lambda Function. The function will be responsible by creating temporary AWS keys. However, it needs a role to define what access those keys will provide.

### Create an IoT Role

You can create this role using the IAM console or execute the **index.js** file that is inside the **create-role** folder to create one for you. This package uses the AWS SDK and requires a `npm install` before executing it.

This role needs the following "Trust Relationship":

```json
{
    "Version":"2012-10-17",
    "Statement":[{
        "Effect": "Allow",
        "Principal": {
            "AWS": "arn:aws:iam::AWS_ACCOUNT:root"
        },
        "Action": "sts:AssumeRole"
    }]
}
```

Note that you need to replace the string **AWS_ACCOUNT** with your account number. If you're using the code that I've provided it will automatically retrieve your account number using the STS service.

The permissions will be set for IoT functions and for all resources, which means that the client will be able to subscribe to any IoT topic. You can restrict this access if you want.

```json
{
    "Version": "2012-10-17",
    "Statement": [{
        "Action": ["iot:Connect", "iot:Subscribe", "iot:Publish", "iot:Receive"],
        "Resource": "*",
        "Effect": "Allow"
    }]
}
```

### Serverless Framework

Now you'll create a Lambda function that will generate temporary keys (valid for 1 hour) to connect to the IoT service. You're going to use the Serverless Framework to help here. If you don't have it installed yet, do so using:

```bash
npm install serverless -g
```

The **serverless.yml** must add Lambda permissions for `iot:DescribeEndpoint` (to find your account endpoint) and `sts:AssumeRole` (to create temporary keys). I'm also creating a simple function named **auth** and excluding other folders that are inside of this project to avoid zipping them with my Lambda.

```yaml
service: serverless-notifications

provider:
  name: aws
  runtime: nodejs4.3
  stage: dev
  region: us-east-1
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - 'iot:DescribeEndpoint'
      Resource: "*"
    - Effect: "Allow"
      Action:
        - 'sts:AssumeRole'
      Resource: "*"

functions:
  auth:
    handler: handler.auth
    events:
      - http: GET iot/keys
    memorySize: 128
    timeout: 10

package:
  exclude:
    - .git/**
    - create-role/**
    - frontend/**
    - iot/**
```

The Lambda function is pretty simple. I'm using the AWS SDK and making 3 requests:

1. **iot.describeEndpoint()**: find your account's IoT endpoint (you can hardcode this result, if you prefer)
2. **sts.getCallerIdentity()**: get your AWS account ID that is needed to find the Role (you can also hardcode this)
3. **sts.assumeRole()**: create temporary AWS keys that are allowed only to access the IoT service

```javascript
'use strict';

const AWS = require('aws-sdk');
const iot = new AWS.Iot();
const sts = new AWS.STS();
const roleName = 'serverless-notifications';

module.exports.auth = (event, context, callback) => {

    // get the endpoint address
    iot.describeEndpoint({}, (err, data) => {
        if (err) return callback(err);

        const iotEndpoint = data.endpointAddress;
        const region = 'us-east-1';

        // get the account id which will be used to assume a role
        sts.getCallerIdentity({}, (err, data) => {
            if (err) return callback(err);

            const params = {
                RoleArn: `arn:aws:iam::${data.Account}:role/${roleName}`,
                RoleSessionName: getRandomInt().toString()
            };

            // assume role returns temporary keys
            sts.assumeRole(params, (err, data) => {
                if (err) return callback(err);

                const res = {
                    statusCode: 200,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({
                        iotEndpoint: iotEndpoint,
                        region: region,
                        accessKey: data.Credentials.AccessKeyId,
                        secretKey: data.Credentials.SecretAccessKey,
                        sessionToken: data.Credentials.SessionToken
                   })
                }

                callback(null, res);
            });
        });
    });
};
```

Now, deploy using the command `serverless deploy` and copy the API Gateway endpoint that the Serverless Framework you output in the command line. This address will be used in our frontend code.

## Pricing

How much does it cost? Only $5 per million messages (USA). It can be pretty cheap depending on your scale and traffic because you don't need to pay for a dedicated server.

Official pricing page for IoT: https://aws.amazon.com/iot/pricing/

## Improving this demo

This sample considers that there is only one topic. It's ok if everyone is subscribed to the same channel. However, if you want to send private notifications to a specific user, you need to create a new topic per user.

You can modify the Lambda function to achieve this restriction. When it calls **assumeRole**, add a **Policy** parameter that restricts the access to this specific user for a specific topic name. More about this parameter [here](http://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/STS.html#assumeRole-property).

If you need to provide temporary keys for *authenticated* users (logged with Facebook, Twitter, OpenID, Custom, etc.), I suggest that you try Cognito directly instead of using API Gateway + Lambda.

## What more?

I tried another experiment with this and created a demo for a serverless multiplayer game. If you want to develop an HTML5 game in a serverless architecture, you can use IoT to exchange messages between players and implement a cheap multiplayer game. The performance is good enough for dynamic games.

You can see the demo [here](https://bombermon.zanon.io) and the code on [GitHub](https://github.com/zanon-io/serverless-multiplayer-game). You can try it using your desktop and phone to test the multiplayer feature.

## Conclusion

IoT can also be used for real-time notifications in the browser. Notifications are a common use case in modern apps, and it's one more problem that you can solve using with Serverless.
