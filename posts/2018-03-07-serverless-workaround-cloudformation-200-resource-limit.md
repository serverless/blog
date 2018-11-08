---
title: "Serverless Workarounds for CloudFormation's 200 Resource Limit"
description: How you can troubleshoot, and avoid hitting, CloudFormation's 200 resource limit
date: 2018-03-07
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless-square-icon-text.png'
category:
  - guides-and-tutorials
  - operations-and-observability
authors:
  - AlexDeBrie
---

Developing with Serverless is microservice friendly, but sometimes you don't want microservices. Perhaps you like the comfort of keeping all your application logic in one place.

That's great, until you hit the oh-so-common error:

```bash
Error --------------------------------------------------

The CloudFormation template is invalid: Template format error: Number of resources, 201, is greater than maximum allowed, 200
```

That's right—CloudFormation has a limit of 200 resources per stack.

In this post, I'll give you some background on the CloudFormation limit and why it's so easy to hit. Then, I'll follow up with a few tips on how to avoid hitting the limit, including:

- [Break your web API into microservices](#break-your-web-api-into-microservices)
- [Handle routing in your application logic](#handle-routing-in-your-application-logic)
- [Using plugins to split your service into multiple stacks or nested stacks](#split-your-stacks-with-plugins)
- [Pestering your AWS rep to get the CloudFormation limit increased](#bug-your-AWS-contacts)

Let's begin!

## Background on the 200 resource limit

Before we get too far, let's understand the background on this issue and why it's so easy to hit.

When you run `serverless deploy` on a Serverless service that's using AWS as a provider, a few things are happening under the hood:

1. The Serverless Framework packages your functions into zip files in the format expected by Lambda
2. The zip files are uploaded to S3
3. A CloudFormation stack is deployed that includes your Lambda function, [IAM permissions](https://serverless.com/blog/abcs-of-iam-permissions/), Cloudwatch log configuration, event source mappings, and a whole bunch of other undifferentiated heavy lifting that you shouldn't care about

The problem arises when you hit the aforementioned limit of 200 resources in a single CloudFormation stack. Unlike other service limits, this is a hard limit that AWS will not raise in a support request.

Now you may be saying "But I only have 35 functions in my service—how does this equal 200 resources?"

A single function requires more than one CloudFormation resource. For every function you add, there are at least three resources:

1. An [`AWS::Lambda::Function`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-function.html) resource, representing your actual function
2. An [`AWS::Lambda::Version`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-version.html) resource, representing a particular *version* of your function (this allows for fast & easy rollbacks)
3. An [`AWS::Logs::LogGroup`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-logs-loggroup.html) resource, allowing your function to log to CloudWatch logs

If you wire up an event source such as `http` for API Gateway, you'll be adding a few more resources:

1. [`AWS::Lambda::Permission`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-lambda-permission.html), allowing API Gateway to invoke your function;
2. [`AWS::ApiGateway::Resource`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-resource.html), configuring the resource path for your endpoint; and
3. [`AWS:ApiGateway::Method`](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-apigateway-method.html), configuring the HTTP method for your endpoint.

For each `http` event you configured, you end up creating **six** (!) CloudFormation resources, in addition to shared resources like `AWS::ApiGateway::RestApi` and `AWS::IAM::Role`.

Given this, you'll start to run into that limit around 30-35 HTTP functions. If this sounds like you, keep reading to see how you can avoid this problem.

## Break your Web API into microservices

The most common place we see people run into the 200 resource limit is with web APIs. This can be perfectly RESTful APIs, RPC-like endpoints, or something in between. Users often want to put a bunch of HTTP endpoints on the same domain.

By default, the Serverless Framework creates a new API Gateway domain for each service. However, there are two ways you can manage to put endpoints from different services in the same domain.

The first way, and my preferred way, is to map your API Gateway domains to a custom domain that you own. When you create an API Gateway in AWS, it will give you a nonsense domain such as `https://n0benf6jn4.execute-api.us-east-1.amazonaws.com`. However, you can [map over this domain using a custom domain that you own](https://serverless.com/blog/serverless-api-gateway-domain/), such as `https://api.mycompany.com`. This is much cleaner, plus it won't change if you remove and redeploy your service -- much more reliable for clients that you can't change.

Further, if you use a custom domain, you can also utilize *base path mappings* to segment your services and deploy multiple to the same domain. For example, if you have 30 routes, 15 of which are user-related and 15 of which are product-related, you can split them into two different services. The first, with all of your user-related routes, will have a base path mapping of "users", which will prefix all routes with `/users`. The second, with your product-related routes, will prefix your routes with `/products`.

**Aside:** Interested in using a custom domain with base path mapping? Check out our two posts on the subject: [How to set up a custom domain with Serverless](https://serverless.com/blog/serverless-api-gateway-domain/) and [How to deploy multiple micro-services under one domain](https://serverless.com/blog/api-gateway-multiple-services/).

A second approach is to use the `apiGateway` property object in your `serverless.yml`. This was added in the `v1.26` release of the Serverless Framework. It allows you to re-use an existing API Gateway REST API resource. You'll have the nonsense domain (`https://n0benf6jn4.execute-api.us-east-1.amazonaws.com`), but it won't require you to shell out the $12 for a custom domain of your own.

Check out the docs on the new `apiGateway` property [here](https://serverless.com/framework/docs/providers/aws/events/apigateway#share-api-gateway-and-api-resources).

## Handle routing in your application logic

Warning: The following advice is considered heresy in certain serverless circles. Use at your own risk.

If you don't want to split up your logic into multiple services, you can try an alternative route—stuffing all of your logic into a single function!

Here's how it works. Rather than setting up specific HTTP endpoints that map to specific function handlers, you set up a single route that catches _all_ HTTP paths. In your `serverless.yml`, it will look like this:

```yml

functions:
  app:
    handler: myHandler.main
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

The first event matches any method request on `/`, and the second event matches any method request on any other path. All requests will get sent to `myHandler.main`. From there, your logic should inspect the HTTP method and path to see what handler it needs to invoke, then forward the request to that handler within your function.

Conceptually, this is very similar to how it works with the web frameworks of old, such as Express for Nodejs and Flask for Python. API Gateway is similar to Nginx or Apache -- a reverse proxy that forwards HTTP events to your application. Then Express or Flask would take those events from Nginx or Apache, figure out the relevant route, and send it to the proper function.

It's very easy to use these existing web frameworks with Serverless. You can check our prior posts for [using Express with Serverless](https://serverless.com/blog/serverless-express-rest-api/) or [deploying a Flask REST API with Serverless](https://serverless.com/blog/flask-python-rest-api-serverless-lambda-dynamodb/).

Even if you don't want to use existing web frameworks, you can build your own routing layer inside your Lambda. Our good friends at Trek10 built a [`lambda-router`](https://github.com/trek10inc/lambda-router) package that you can look at, and there are a number of other options available as well.

If you're thinking of taking this route, I strongly suggest reading Yan Cui's (aka [theburningmonk](https://twitter.com/theburningmonk)) post on [monolithic vs multi-purpose functions](https://hackernoon.com/aws-lambda-should-you-have-few-monolithic-functions-or-many-single-purposed-functions-8c3872d4338f). As always, Yan has great insight on some deep serverless topics.

## Split your stacks with plugins

If you've gotten this far, you're a hold out. You don't want to split your services. You don't want a mono-function. But
you still have over 200 resources.

It's time to explore using multiple CloudFormation stacks.

There are a few ways we can do this. First, you can simply move certain parts of your application into a different CloudFormation stack, even if it's managed in the same service. Examples of this would be to put your slow-changing infrastructure, such as VPCs, Subnets, Security Groups, Databases, etc. in one stack, then have your more dynamic infrastructure like Lambda functions, event subscriptions, etc. in a different CloudFormation stack. For most deploys, you'll only be deploying the dynamic stack. Occasionally, you'll want to deploy the slow-changing stack.

If this sounds good to you, check out the [`serverless-plugin-additional-stacks`](https://github.com/SC5/serverless-plugin-additional-stacks) plugin by the folks at SC5.

The second approach is to use [Nested Stacks](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/using-cfn-nested-stacks.html) with CloudFormation. You can use Nested Stacks to create a hierarchy of stacks. The Stacks are linked together, but each one gets to use the full 200 resource limit.

Warning: Nested Stacks are a pretty advanced area of CloudFormation, and they're not for the faint of heart. Make sure you know what you're doing.

If Nested Stacks sound like the solution for you, check out these two plugins:

- [`serverless-nested-stack`](https://github.com/jagdish-176/serverless-nested-stack), which splits your LogGroups and Roles into one Stack, and all other resources into another, and
- [`serverless-plugin-split-stacks`](https://github.com/dougmoscrop/serverless-plugin-split-stacks), by the great Doug Moscrop, creator of the `serverless-http` plugin and many others.

## Bug your AWS contacts

You know what to do. Send out a tweet with `#awswishlist` or ping your AWS support rep and let them know you'd like the 200 resource limit raised.

## Conclusion

The 200 resource limit in CloudFormation can be an annoyance, but luckily there are a few workarounds. Let us know if you have other methods for getting around this limit.
