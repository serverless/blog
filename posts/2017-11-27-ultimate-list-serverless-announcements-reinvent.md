---
title: "The Ultimate Guide to Serverless Announcements @ AWS re:Invent 2017"
description: "Your go-to resource for all Serverless announcements at AWS re:Invent."
date: 2017-11-27
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/awsreinvent.jpg'
authors:
  - AlexDeBrie
---

**Last Updated:** 11/28/17 @ 1:34AM PST

It's that time of the year, the Christmas-comes-early for cloud developers. Are you ready for [AWS re:Invent](https://reinvent.awsevents.com/)?

This is where [AWS Lambda was introduced in 2014](https://www.youtube.com/watch?v=9eHoyUVo-yg), and we're expecting more huge announcements in the serverless realm this year. AWS has gone all-in on serverless, and we can't wait to see the improvements they're making.

This post is _the_ place to understand what is announced and why it affects you, the intrepid Serverless developer. We'll be updating throughout the week with all of the latest announcements.

If you're attending re:Invent, be sure to [check out the Serverless guide to re:Invent 2017](https://serverless.com/blog/serverless-guide-aws-reinvent-2017/).

# Overview:

### re:Invent announcements (newest to oldest):
- [AWS CodeDeploy incremental deployment](#aws-codedeploy-incremental-deployment)
- [Weighted aliases for Lambda](#weighted-alises-for-lambda)
- [Canary management for API Gateway](#canary-management-for-api-gateway)
- [Serverless Aurora coming soon](#serverless-aurora-coming-soon)

### Pre-re:Invent announcements:

- [Lambda@Edge Improvements](#lambda-at-edge-improvements)
- [SNS Message Filtering](#sns-message-filtering)
- [API Gateway Access Logs](#api-gateway-access-logs)

# Announcements:

# AWS CodeDeploy incremental deployment

**What:** CodeDeploy support for incremental deployment of serverless applications.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">New features coming to lambda <a href="https://twitter.com/hashtag/breaking?src=hash&amp;ref_src=twsrc%5Etfw">#breaking</a> <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> <a href="https://twitter.com/hashtag/reinvent?src=hash&amp;ref_src=twsrc%5Etfw">#reinvent</a> .cc <a href="https://twitter.com/Ninnir?ref_src=twsrc%5Etfw">@Ninnir</a> <a href="https://t.co/bNjL0I78ZU">pic.twitter.com/bNjL0I78ZU</a></p>&mdash; Julien Stanojevic (@GenuineM7) <a href="https://twitter.com/GenuineM7/status/935596271020130304?ref_src=twsrc%5Etfw">November 28, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

*credit: [@GenuineM7](https://twitter.com/GenuineM7)

# Weighted aliases for Lambda

**What:** This will let you send some percentage of traffic to one version of a Lambda, the rest to another version.

*Announced by Chris Munns on the Launchpad

# Canary management for API Gateway

**What:** This will allow you to send some percentage of API Gateway traffic to one source and the rest to another.

*Announced by Chris Munns on the Launchpad

# [Serverless Aurora coming soon](https://twitter.com/sandy_carter/status/935550646995927040)

**What:** Aurora is AWS's relational database in the cloud. It's cheaper and faster than MySQL or PostgreSQL databases.

**Why this matters:** If done right, this is a dream come true. The data layer is an unsolved problem in the Serverless realm. If you want to use a traditional relational database, you're configuring a lot of network rules and VPC configuration -- just what you want to avoid with serverless architectures. You can avoid this pain by using DynamoDB, but the limited query patterns & hidden foot-guns can cause problems down the road.

Serverless Aurora could change all of that—a relational database that's accessible over HTTP, doesn't require complicated networking configuration, and uses IAM for authentication? Count me in.

<blockquote class="center twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Serverless and micro-services are where it’s at!! <a href="https://twitter.com/hashtag/reinvent?src=hash&amp;ref_src=twsrc%5Etfw">#reinvent</a> <a href="https://twitter.com/hashtag/cloud?src=hash&amp;ref_src=twsrc%5Etfw">#cloud</a> <a href="https://twitter.com/hashtag/soa?src=hash&amp;ref_src=twsrc%5Etfw">#soa</a> <a href="https://twitter.com/hashtag/Microservices?src=hash&amp;ref_src=twsrc%5Etfw">#Microservices</a> <a href="https://t.co/pSyCUK4ENZ">pic.twitter.com/pSyCUK4ENZ</a></p>&mdash; sandy carter (@sandy_carter) <a href="https://twitter.com/sandy_carter/status/935550646995927040?ref_src=twsrc%5Etfw">November 28, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

*credit: [@sandy_carter](https://twitter.com/sandy_carter) for the tweet about this news

# [Lambda at Edge Improvements](https://aws.amazon.com/about-aws/whats-new/2017/11/lambda-at-edge-now-supports-content-based-dynamic-origin-selection-network-calls-from-viewer-events-and-advanced-response-generation/)

**What:** Lambda@Edge increased memory limits, maximum package size, and function durations. It also allows for dynamic origin selection based on content and the ability to make remote calls in viewer-facing requests.

**Why this matters:** This is a big one. Previously, Lambda@Edge functions allowed you to run limited logic at the edge, such as rewriting headers or redirecting unauthenticated users to a login page. However, the functionality was limited, particularly if you wanted to integrate with other services in your architecture.

Now, you can run entire applications at the edge. You can make remote calls to your other services to get dynamic content. You can route requests to different origins based on the request path, making it easier to slowly [migrate to Serverless architectures using the strangler pattern](https://medium.com/@rmmeans/serverless-strangler-pattern-on-aws-31c88191268d). This is a huge deal. It's mind-blowing that this came out _before_ re:Invent—they must have some other amazing announcements in store.

# [SNS Message Filtering](https://aws.amazon.com/about-aws/whats-new/2017/11/amazon-simple-notification-service-sns-introduces-message-filtering/)

**What:** SNS Subscriptions can add a filter policy where they only receive certain messages rather than all messages published to a topic.

**Why this matters:** This announcement may be underrated, but it makes it much easier to build pub/sub architectures. Previously, you might make a "fat" topic with all messages published to it and required annoying filtering logic within your Lambda functions that subscribed to a topic. This would result in wasted Lambda invocations to SNS messages that your function didn't care about. Alternatively, you could create multiple, smaller topics with specific messages types, but that required the complexity of multiple subscriptions for different Lambdas.

With this new filter policy, you can use the fat topic pattern while only invoking your function for messages it cares about. This could be based on an `event_type` (e.g., I care about `order_placed` but not `order_shipped`) or other attributes (if a new User is created, trigger me when the `user_type` is `admin`). This can simplify your Lambda logic and lower your costs.

# [API Gateway Access Logs](https://aws.amazon.com/about-aws/whats-new/2017/11/amazon-api-gateway-supports-access-logging/)

**What:** You can now enable detailed access logs from API Gateway, just like you could do with Apache, Nginx, or HAProxy.

**Why this matters:** This enables granular analytics on your web requests. You can feed these into your analytics systems or dump them into S3 to analyze with [Athena](https://aws.amazon.com/athena/).
