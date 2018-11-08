---
title: How to manage your AWS Step Functions with Serverless
description: Managing complex workflows with Serverless and AWS Step Functions.
date: 2017-09-18
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/step-functions.png
authors:
  - TakahiroHorike
---

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/step-functions.jpg">

When diving into the Functions as a Service (FaaS) world, a question that often pops up is:

> If serverless functions are stateless, how do I manage state?

There are a number of ways to manage state with backend data stores, `tmp` directories & building this logic into your existing lambda functions but there is a simpler alternative provided by AWS: **Step Functions**.

[Step Functions](https://aws.amazon.com/step-functions/) allows you to control complex workflows using Lambda functions without the underlying application managing and orchestrating the state. In essence, it's a state machine to help with complex workflows and aims at keeping your lambda functions free of this additional logic.

## Serverless + Step Functions

A couple months ago, I created the [Serverless Step Functions](https://github.com/horike37/serverless-step-functions) plugin to deploy and manage Step Functions and a bunch of composed Lambda functions via the Serverless Framework.

In this post, I will share the functionality and usage of the plugin, and a workflow for your development.

So let's get down to business!

## Install

Before getting started, you need to install the plugin. This is hosted on the [Serverless Plugins registry](https://github.com/serverless/plugins), so you can install this via the plugin install command which is introduced since v1.22.0.

Please run the following command in your service, then the plugin will be added automatically in plugins array in your `serverless.yml` file.

```
$ serverless plugin install --name serverless-step-functions
```

If you run `serverless --help` command and you can see an explanation of subcommands for the plugin like `serverless invoke stepf, installing is successful.

## Getting Started

### Define AWS state language

To define a workflow with Step Functions, you need write a structured language called [Amazon States Language](http://docs.aws.amazon.com/step-functions/latest/dg/concepts-amazon-states-language.html), which can be defined within `definition` section with yaml format in your `serverless.yml`.

I recommend using in combination with [Serverless AWS Pseudo Parameters](https://www.npmjs.com/package/serverless-pseudo-parameters) since it makes it easy to set up in `Resource` section in serverless.yml.

The following is an example which is a simplest state machine definition, which is composed of a single lambda function.

```yaml
stepFunctions:
  stateMachines:
    hellostepfunc1:
      definition:
        Comment: "A Hello World example of the Amazon States Language using an AWS Lambda Function"
        StartAt: HelloWorld1
        States:
          HelloWorld1:
            Type: Task
            Resource: "arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:${self:service}-${opt:stage}-foobar-baz"
            End: true

plugins:
  - serverless-step-functions
  - serverless-pseudo-parameters
```

### Event

You can define events to invoke your Step Functions. Currently, `http` and `scheduled` events have been supported.
The configuration syntax is similar to the Lambda events provided by the framework core.

Here’s how to define those events:

```yaml
stepFunctions:
  stateMachines:
    hello:
      events:
        - http:
            path: hello
            method: GET
        - schedule: rate(2 hours)
      definition:
```

### Use triggered Lambda events

If you want to use events other than `http` and `scheduled`, you can create a Lambda function which only run your statemachine

Using the AWS SDK, you can trigger your step functions like:

```javascript
'use strict';
const AWS = require('aws-sdk');
const stepfunctions = new AWS.StepFunctions();

module.exports.start = (event, context, callback) => {
  const stateMachineArn = process.env.statemachine_arn;
  const params = {
    stateMachineArn
  }

  return stepfunctions.startExecution(params).promise().then(() => {
    callback(null, `Your statemachine ${stateMachineArn} executed successfully`);
  }).catch(error => {
    callback(error.message);
  });
};
```

Then, you set up the Lambda will be triggered by events what you want. `startExecution` API requires a statemachine ARN so you can pass that via environment variables system.

Here’s serverless.yml sample which a triggered statemachine by S3 event.

```yaml
service: example-stepf-nodejs

provider:
  name: aws
  runtime: nodejs6.10
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "states:StartExecution"
      Resource:
        - "*"

functions:
  startExecution:
    handler: handler.start
    events:
      - s3: photos
    environment:
      statemachine_arn: ${self:resources.Outputs.MyStateMachine.Value}

stepFunctions:
  stateMachines:
    hellostepfunc1:
      name: MyStateMachine
      definition:
        Comment: "A Hello World example of the Amazon States Language using an AWS Lambda Function"
        StartAt: HelloWorld1
        States:
          HelloWorld1:
            Type: Task
            Resource: "arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:${self:service}-${opt:stage}-hello"
            End: true
resources:
  Outputs:
    MyStateMachine:
      Description: The ARN of the example state machine
      Value:
        Ref: MyStateMachine

plugins:
  - serverless-step-functions
  - serverless-pseudo-parameters

```

## Create a sample application

Let’s consider a small 2 step application that starts EC2 and write the result on S3 bucket.

First, we will create a Lambda function that only starts an EC2 instance, to which will be passed instanceId via API Body request parameter.

```javascript
'use strict';
const AWS = require('aws-sdk');

module.exports.startEC2 = (event, context, callback) => {
  const ec2 = new AWS.EC2();
  const params = {
    InstanceIds: [
      event.instanceId
    ]
  }

  return ec2.startInstances(params).promise().then(() => {
    callback(null, `Your ${event.instanceId} instance started successfully`);
  }).catch(error => {
    callback(error.message);
  });
};
```

Then, here is another Lambda function which writes a log to S3 Bucket.

```javascript
'use strict';
const AWS = require('aws-sdk');

module.exports.writeS3 = (event, context, callback) => {
  const s3 = new AWS.S3();
  const params = {
    Bucket: 'sls-logs-bukect',
    Key: 'success!!'
 }

  return s3.putObject(params).promise().then(() => {
    callback(null, `a log writed successfully`);
  }).catch(error => {
    callback(error.message);
  });
};
```

In the end, describe your serverless.yml looks like, and deploy with `serverless deploy`.

```yaml
service: example-stepf-nodejs

provider:
  name: aws
  runtime: nodejs6.10
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "ec2:*"
        - "s3:*"
      Resource:
        - "*"

functions:
  startEC2:
    handler: handler.startEC2
  writeS3:
    handler: handler.writeS3

stepFunctions:
  stateMachines:
    hellostepfunc1:
      events:
        - http:
            path: startEC2
            method: post
      definition:
        Comment: "A sample application"
        StartAt: StartEC2
        States:
          StartEC2:
            Type: Task
            Resource: "arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:${self:service}-${opt:stage}-startEC2"
            Next: WriteS3
          WriteS3:
            Type: Task
            Resource: "arn:aws:lambda:#{AWS::Region}:#{AWS::AccountId}:function:${self:service}-${opt:stage}-writeS3"
            End: true

plugins:
  - serverless-step-functions
  - serverless-pseudo-parameters

```

If you can see the API Gateway endpoint on your console, it means to deploy successfully。

```
Serverless StepFunctions OutPuts
endpoints:
  POST - https://ae0dyh8676.execute-api.us-east-1.amazonaws.com/dev/startEC2

```

Send a CURL request to your live endpoint:

```bash
curl -XPOST https://ae0dyh8676.execute-api.us-east-1.amazonaws.com/dev/startEC2 -d '{"instanceId":"<your instance ID>"}'
```

You should see that specified EC2 will be started and a log will be written to S3 Bucket.

## Summary

The Serverless Step Functions plugin makes it easier to manage and deploy your Step Functions.

If you have any comments or feedback, please create a new [issue](https://github.com/horike37/serverless-step-functions/issues/new) or send a Pull Request. I always welcome them!!

One more thing, tutorial on how to use the plugin has been coverd on [FOOBAR](https://www.youtube.com/channel/UCSLIvjWJwLRQze9Pn4cectQ) youtube channel. You can also learn it there. Thanks [@mavi888uy](https://twitter.com/mavi888uy) for making the great video!

<iframe width="560" height="315" src="https://www.youtube.com/embed/bEB0zDHXXG4" frameborder="0" allowfullscreen></iframe>
