---
title: Tracking API Gateway metrics in Serverless applications
description: Monitoring web APIs in Serverless applications can be difficult. See how to do it with the Serverless Framework.
date: 2019-08-15
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/monitoring-api-gateway-metrics/thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/monitoring-api-gateway-metrics/header.png'
authors:
  - AlexDeBrie
category:
  - guides-and-tutorials
---

Thousands of developers are using serverless technologies to build web APIs. Tools like the Serverless Framework make it easy to build with foundational infrastructure like AWS Lambda, API Gateway and DynamoDB to build [REST APIs](https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/) and [GraphQL APIs](https://serverless.com/blog/running-scalable-reliable-graphql-endpoint-with-serverless/).

But monitoring these APIs is still a bit of a black box. The out-of-the-box monitoring systems provided by AWS don't provide the granularity you need for inspecting your APIs, particularly when the failure could span multiple systems.

In this post, I'll show you an easier way to monitor your Serverless web APIs using the new full lifecycle capabilities of the Serverless Framework.

First, we'll cover three reasons why understanding your API performance is so hard using the native AWS tooling:

- [Lambda errors don't map to HTTP errors](#problem-1-lambda-errors-dont-map-to-http-errors)
- [There are many places your request can fail outside of Lambda](#problem-2-there-are-many-places-your-request-can-fail-outside-of-lambda)
- [API Gateway metrics don't let you drill to the root issue](#problem-3api-gateway-metrics-dont-let-you-drill-to-the-root-issue)

After we review the problems, I'll show you how we're solving this problem with the Serverless Framework and some additional features we have planned going forward.

Let's get started!

#### Problem 1: Lambda Errors don't map to HTTP Errors

If you have experience building services with AWS Lambda, you're probably familiar with CloudWatch Logs and CloudWatch Metrics. The great thing about CloudWatch is that it's integrated automatically with your Lambda functions. You don't have to do any instrumentation to get the logs flowing.

That said, CloudWatch is a bit behind other monitoring tools in the space. And even if you are a CloudWatch expert, there are some gaps between Lambda and API Gateway that make it difficult to understand your application behavior.

The first problem with traditional Lambda monitoring is that **Lambda errors don't always map to HTTP errors.**

To see what I mean, look at the example code below.

![Lambda handler](https://user-images.githubusercontent.com/6509926/62462411-f823bd00-b74c-11e9-9c75-fc43602a820f.png)

This is a `getUser` endpoint in my application, where I use the `id` parameter in the HTTP path to fetch a User object and return it to the client.

Note that on lines 9-15 I have an `catch` block that captures any errors and returns an error with a `500` status code. By catching this error, I'm making it easier for the client of my API as I return a status code and a potentially meaningful error message. 

However, I've also lost some visibility into my application health. If my DynamoDB table went down and I couldn't read any User records, every single user would be receiving an error and seeing a `500` status code. But from the perspective of my Lambda application, it would appear that everything is fine -- no errors!

As a developer, I'm interested in more than just whether my Lambda function successfully handled all errors before returning to the client. I also care about the user-facing result of the invocation -- was the client able to perform the action it wanted?

#### Problem 2: There are many places your request can fail outside of Lambda

The second area where traditional Lambda monitoring falls down is that **there are many areas where API Gateway can fail aside from your Lambda function.** Your users can be experiencing errors before a request makes it to your Lambda function or even after your function completes successfully.

[API Gateway has a ton of features](https://www.alexdebrie.com/posts/api-gateway-elements/) for super-powering your API processing. If you're taking advantage of these features, you may not see the errors your users are seeing.

For example, you can add [request schema validation](https://serverless.com/framework/docs/providers/aws/events/apigateway/#request-schema-validators) on your API endpoints to reject any requests that don't match the required schema.

Similarly, you can add [custom authorizers](https://www.alexdebrie.com/posts/lambda-custom-authorizers/) to your endpoints to require authorization before hitting your Lambda function.

In each of these cases, users may be seeing errors without you even seeing a Lambda invocation in your dashboard. In the former, they'll receive a `400 Bad Request` error while in the latter they'll receive a `401 Unauthorized` error.

Further, even if your request makes it to your Lambda function and completes successfully, you may mess up the shape of the response format. As a result, your users will see a broken app due to `500 Internal Server Error` responses.

In each of these situations, the basic Lambda metrics and logs won't help you realize that your users are facing errors.

##### Problem 3: API Gateway metrics don't let you drill to the root issue

Let's switch over to the API Gateway side of the house. You can look at API Gateway-level metrics using CloudWatch Metrics. These will show you the number of 2XX, 3XX, 4XX, and 5XX status codes by resource and method in your application.

The difficulty lies in debugging your requests to find a root cause.

When you deploy some bad configuration which results in a spike in 400 errors for an overly-restrictive request schema, how do you drill into the applicable requests to find the problem?

When your database goes down and results in a number of 500 errors, how do you find the stacktrace that indicates the issue?

In the first case, you'll likely need API Gateway access logs enabled and some sort of system to process these logs as they come in. In the second case, you'll either need to instrument your code with some kind of application error platform, or you'll need to process your Lambda logs into an external system.

#### How we're solving this problem

In the sections above, we noted a few problems with the current, separated approach of CloudWatch Metrics. 

To solve this, you need a more holistic view of your application. While you may think of your Serverless application on a function-by-function basis, there are more pieces involved than just the function.

You need a way to look at your endpoints on a results-basis -- what is the end result to my users? -- while still being able to drill in to specific invocations to see the error.

If my `createUser` endpoint has a rash of 500 errors, what's the reason? Is it because I couldn't access a critical service inside my Lambda function, or is it because I formatted my response incorrectly?

If my `getOrder` endpoint has a `401 Unauthorized` error, is it because the request has no authorization header and thus fails the custom authorizer, or is it because the authenticated user does not have access to the specific Order being requested?

The Serverless Framework provides the solution to this, letting you see your endpoint at a 30,000 foot view and drill into the details.

First, you can see endpoint errors right next to your function invocation errors. Remember what we discussed above -- it's possible for your Lambda function to return successfully but your endpoint to show an error to the user. This view allows you to see both sources of errors.

![API Gateway and function errors](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/monitoring-api-gateway-metrics/APIErrors.png)

If you want to dig deeper on a particular error, click in to see the full story. You get API Gateway metrics, function metrics, logs, and even a stacktrace. In one place, you can see everything that happened with a single request, making it much easier to debug.

We've got a lot planned for this functionality moving forward. We'll be adding a chart explorer where you can build graphs for all requests that meet certain parameters. Want to see the status code distribution of all requests to your `getUser` endpoint between noon and 1PM today? No problem!

Once you've used the filters to discover the problem with graphs, use those same filters in our invocation explorer to find problematic invocations. Find the exact invocations that are causing you problems and look to the logs and API Gateway metrics to debug the root cause.

This is what's needed -- a unified way to identify and diagnose issues in your application, rather than cobbling together a bunch of disparate resources and copy-pasting IDs through sub-par search interfaces.
