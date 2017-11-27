---
title: "The Ultimate Guide to Serverless Announcements @ AWS re:Invent 2017"
description: "Your go-to resource for all Serverless announcements at AWS re:Invent."
date: 2017-11-27
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/awsreinvent.jpg'
authors:
  - AlexDeBrie
---

**Last Updated:** 11/27/17 @ 8:28AM PST

It's that time of the year.

That's right, [AWS re:Invent](https://reinvent.awsevents.com/). It's Christmas-comes-early for cloud developers. We get to hear about the biggest new products AWS is releasing. It's the place where [Lambda was introduced in 2014](https://www.youtube.com/watch?v=9eHoyUVo-yg). 

We're expecting amazing announcements in the serverless realm this year. AWS has gone all-in on serverless, and we can't wait to see the improvements they're making.

This post is _the_ place to understand what is announced and why it affects you, the intrepid Serverless developer. We'll be updating throughout the week with all of the latest announcements.

If you're attending re:Invent, be sure to [check out the Serverless guide to re:Invent 2017](https://serverless.com/blog/serverless-guide-aws-reinvent-2017/).

# Overview:

### Pre-re:Invent announcements:

- [Lambda@Edge Improvements](#lambda-at-edge-improvements)
- [SNS Message Filtering](#sns-message-filtering)
- [API Gateway Access Logs](#api-gateway-access-logs)

# Announcements:

# [Lambda at Edge Improvements](https://aws.amazon.com/about-aws/whats-new/2017/11/lambda-at-edge-now-supports-content-based-dynamic-origin-selection-network-calls-from-viewer-events-and-advanced-response-generation/)

**What:** Lambda@Edge increased memory limits, maximum package size, and function durations. It also allows for dynamic origin selection based on content and the ability to make remote calls in viewer-facing requests.

**Why this matters:** This is a big one. Previously, Lambda@Edge functions allowed you to run limited logic at the edge, such as rewriting headers or redirecting unauthenticated users to a login page. However, the functionality was limited, particularly if you wanted to integrate with other services in your architecture.

Now, you can run entire applications at the edge. You can make remote calls to your other services to get dynamic content. You can route requests to different origins based on the request path, making it easier to slowly [migrate to Serverless architectures using the strangler pattern](https://medium.com/@rmmeans/serverless-strangler-pattern-on-aws-31c88191268d). This is a huge deal. It's mind-blowing that this came out _before_ re:Invent -- they must have some other amazing announcements in store.

# [SNS Message Filtering](https://aws.amazon.com/about-aws/whats-new/2017/11/amazon-simple-notification-service-sns-introduces-message-filtering/)

**What:** SNS Subscriptions can add a filter policy where they only receive certain messages rather than all messages published to a topic.

**Why this matters:** This announcement may be underrated, but it makes it much easier to build pub/sub architectures. Previously, you might make a "fat" topic with all messages published to it and required annoying filtering logic within your Lambda functions that subscribed to a topic. This would result in wasted Lambda invocations to SNS messages that your function didn't care about. Alternatively, you could create multiple, smaller topics with specific messages types, but that required the complexity of multiple subscriptions for different Lambdas.

With this new filter policy, you can use the fat topic pattern while only invoking your function for messages it cares about. This could be based on an `event_type` (e.g., I care about `order_placed` but not `order_shipped`) or other attributes (if a new User is created, trigger me when the `user_type` is `admin`). This can simplify your Lambda logic and lower your costs.

# [API Gateway Access Logs](https://aws.amazon.com/about-aws/whats-new/2017/11/amazon-api-gateway-supports-access-logging/)

**What:** You can now enable detailed access logs from API Gateway, just like you could do with Apache, Nginx, or HAProxy.

**Why this matters:** This enables granular analytics on your web requests. You can feed these into your analytics systems or dump them into S3 to analyze with [Athena](https://aws.amazon.com/athena/).
 
