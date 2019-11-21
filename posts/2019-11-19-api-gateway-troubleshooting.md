---
title: "Take the legwork out of API Gateway troubleshooting"
description: "Tag your Lambdas to track errors and debug serverless applications. If you’re using NodeJS or Python, we’ll help you find even the trickiest serverless application errors faster."
date: 2019-11-20
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/gateway-troubleshooting/exp+thumb%402x.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/gateway-troubleshooting/explorer+header-2%402x.png"
authors:
  - VerneLindner
category:
  - news
  - operations-and-observability
---

#### Troubleshooting API Gateway Errors
Debugging serverless applications requires a mind shift: in a traditional application stack, the entire request-response cycle exists in your application logs. With serverless applications, that’s not the case. You have to connect the dots between API calls and AWS Lambda functions yourself, and that can involve a lot of thankless legwork.

In this post, we’ll show you how the Serverless Framework dashboard’s latest troubleshooting feature can eliminate the legwork, whether you’re new to serverless application development, or an old hand.

#### Misconfigured API Gateway
Let’s start with a common scenario: say you want to check the performance of a function you’ve written. You open your Serverless Framework dashboard, but you don’t see an invocation for that function was invoked. You hit the API endpoint that should trigger it, and it responds with a 503 status code: service unavailable.

Now, 503 errors can be hard to diagnose. Often, 503s are due to misconfigured API Gateways.  
That can be caused by an incorrect indentation in your Serverless.yml file, typos or spacing errors, or referencing a function that no longer exists. With multiple possible causes, you need the request and invocation logs to determine what actually happened. 

Getting the logs may not be a straightforward operation. To begin with, APIGW logs and Lambda function logs are not stored together. Remember that mindshift? You have to go into CloudWatch, where all your AWS logs are collected, and look for the logs separately. It’s an annoying inconvenience if you have one API endpoint and one Lambda function in your application, but if you’re using an API Gateway, and  it’s being hit with a few hundred requests per second, it’s a real problem.

You can search by request ID, but customers don’t always include a request ID when they report an issue. Finding a log without a request ID is when the thankless legwork begins.

With the Serverless Framework dashboard’s new requests explorer, you can sidestep that painful process and go straight to the logs and stacktraces you need. The explorer lets you locate requests by endpoint, method, status code and time range. Each request opens a detailed report, where you’ll find the log, and a link to the relevant function invocation report. You can skip the searching and focus all your time on the fun part: solving the problem.

![Serverless Insights](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/gateway-troubleshooting/blogpost-img-exp+(1).png)

#### Malformed Response 
If you’ve been developing serverless applications for a while, and you’re good at avoiding the common mistakes that can trigger misconfigured API Gateways, you can still find yourself chasing down APIGW errors. Here’s an example:

Say that you log out a Lambda error so you can track it, but you forget that you have to respond to the APIGW. Again, that mind shift you need to make - your Lambdas have to be properly linked to your APIGW and you have to connect those dots yourself when you make a change to your Lamdba: the returned object needs a statusCode, body and headers attribute. If you leave one out, or format it incorrectly, the APIGW will return an “Internal server error” when you hit it.

Using the requests explorer, you just ask for requests to this endpoint with 502 status codes, and in seconds, you’ll be inside the log, you’ll see the ‘malformed lambda proxy response’ message, and you’ll be refactoring your Serverless.yml.

Without the requests explorer, you’ll still arrive at resolution, but if you’re working at scale, and with an APIGW, you’ll be taking the long road to get there. 

Try the Serverless Framework’s [requests explorer](https://serverless.com/debugging/) today, and take the legwork out of debugging your serverless applications!
