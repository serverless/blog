---
title: "The Ultimate Guide to Serverless Announcements @ AWS re:Invent 2017"
description: "Your go-to resource for all Serverless announcements at AWS re:Invent."
date: 2017-11-27
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/awsreinvent.jpg'
category:
  - news
authors:
  - AlexDeBrie
---

**Last Updated:** 01/17/18 @ 4:59PM PST

It's that time of the year, the Christmas-comes-early for cloud developers. Are you ready for [AWS re:Invent](https://reinvent.awsevents.com/)?

This is where [AWS Lambda was introduced in 2014](https://www.youtube.com/watch?v=9eHoyUVo-yg), and we're expecting more huge announcements in the serverless realm this year. AWS has gone all-in on serverless, and we can't wait to see the improvements they're making.

This post is _the_ place to understand what is announced and why it affects you, the intrepid Serverless developer. We'll be updating throughout the week with all of the latest announcements.

If you're attending re:Invent, be sure to [check out the Serverless guide to re:Invent 2017](https://serverless.com/blog/serverless-guide-aws-reinvent-2017/).

# Overview:

### re:Invent announcements (newest to oldest):

- Latest
  - [CloudTrail Logging for Lambda Invocations](#cloudtrail-logging-for-lambda-invocations)
  - [Golang support 🙌](#golang-support)
  - [3GB memory](#3gb-memory)
  - [Concurrency controls](#concurrency-controls)
  - [VPC integration](#vpc-integration)
  - [Serverless App Repo](#serverless-app-repo)
  - [Cloud9](#cloud9)
- IoT
  - [AWS Greengrass](#aws-greengrass)
  - [IoT Device Defender](#iot-device-defender)
  - [IoT Device Management](#iot-device-management)
  - [IoT 1-Click](#iot-1-click)
- Managed services
  - [Kinesis Video Streams](#kinesis-video-streams)
  - [Rekognition Video](#rekognition-video)
  - [Amazon Transcribe](#amazon-transcribe)
  - [Amazon Translate](#amazon-translate)
  - [Amazon Comprehend](#amazon-comprehend)
  - [SageMaker](#sagemaker)
- Databases
  - [AWS Neptune](#aws-neptune)
  - [DynamoDB backup and restore](#dynamodb-backup-and-restore)
  - [DynamoDB global tables](#dynamodb-global-tables)
  - [Serverless Aurora](#serverless-aurora)
- Containers 😱
  - [AWS Fargate](#aws-fargate)
  - [AWS EKS (Kubernetes-as-a-service)](#aws-eks)
- [AWS AppSync](#aws-appsync) (Hosted GraphQL!)
- Lambda improvements
  - [Weighted aliases for Lambda](#weighted-alises-for-lambda)
  - [AWS CodeDeploy incremental deployment](#aws-codedeploy-incremental-deployment)
  - [Canary management for API Gateway](#canary-management-for-api-gateway)

### Pre-re:Invent announcements:

- [Lambda@Edge Improvements](#lambda-at-edge-improvements)
- [SNS Message Filtering](#sns-message-filtering)
- [API Gateway Access Logs](#api-gateway-access-logs)

# Announcements:

# [CloudTrail Logging for Lambda Invocations](https://aws.amazon.com/about-aws/whats-new/2017/11/aws-cloudtrail-adds-logging-of-execution-activity-for-aws-lambda-functions/)

**What:** Ability to send CloudTrail events for all Lambda function invocations

**Why this matters:** CloudTrail is a great tool for performing security auditing and compliance for your AWS resources. Previously, you could only create CloudTrail events for more management-like features of Lambda, such as creating or deleting a function. Now, you can get information on function invocations as well. This will enable you to record and react to invocations with much more detail.

# Golang support

**What:** You can now write your Lambda functions in Go.

**Why it matters:** Like concurrency but hate Node? A typed language without Java? Boom - Golang arrives on Lambda.

**Use it now!**: Here's a template and walkthrough for [using Golang with Lambda via the Serverless Framework](https://serverless.com/blog/framework-example-golang-lambda-support/).

# 3GB Memory

**What:** Lambda memory limits upped to 3GB.

**Why it matters:** More RAM! This can help for heavier processing tasks or anything that would benefit from more memory. As [Vlad](https://twitter.com/vladholubiev) points out, this also seems to apply to Lambda@Edge:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">This wasn&#39;t announced explicitly but Lambda@Edge has 3 GB of RAM as well<a href="https://t.co/r7AnmTD6hq">https://t.co/r7AnmTD6hq</a><a href="https://twitter.com/hashtag/aws?src=hash&amp;ref_src=twsrc%5Etfw">#aws</a> <a href="https://twitter.com/hashtag/lambda?src=hash&amp;ref_src=twsrc%5Etfw">#lambda</a> <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://twitter.com/goserverless?ref_src=twsrc%5Etfw">@goserverless</a> <a href="https://t.co/bHznN4sEIH">pic.twitter.com/bHznN4sEIH</a></p>&mdash; Vlad Holubiev (@vladholubiev) <a href="https://twitter.com/vladholubiev/status/936312517533622272?ref_src=twsrc%5Etfw">November 30, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


# Concurrency controls

**What:** Lets you manage invocation concurrency on a per-function basis.

**Why it matters:**  AWS has account-wide limits on how many concurrent Lambdas you can have running—1000 by default, though you can raise that. It could lead to some of your functions getting throttled if one of them got hammered with a bunch of requests. But now, you can set limits so that one function doesn't result in throttles for other functions.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">BREAKING: New <a href="https://twitter.com/hashtag/lambda?src=hash&amp;ref_src=twsrc%5Etfw">#lambda</a> features!!! 🙌 <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://twitter.com/hashtag/Serverless?src=hash&amp;ref_src=twsrc%5Etfw">#Serverless</a> <a href="https://t.co/P8ezbrFKWa">pic.twitter.com/P8ezbrFKWa</a></p>&mdash; Serverless (@goserverless) <a href="https://twitter.com/goserverless/status/936301335338631169?ref_src=twsrc%5Etfw">November 30, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


# VPC integration

**What:** VPC integration with API Gateway.

**Why it matters:** We'll let [Ajay](https://twitter.com/ajaynairthinks) describe why this is important, we couldn't have said it better:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">VPC integration for API Gateway is massive - front *any* application with API Gateway, Lambda or otherwise, and start using it to manage authN/AuthZ control, and traffic. Want modern APIs for those on prem deployments while you restructure that monolith? Go for it! <a href="https://twitter.com/hashtag/Reinvent2017?src=hash&amp;ref_src=twsrc%5Etfw">#Reinvent2017</a></p>&mdash; Ajay Nair (@ajaynairthinks) <a href="https://twitter.com/ajaynairthinks/status/936307752925720576?ref_src=twsrc%5Etfw">November 30, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


# [Serverless App Repo](https://aws.amazon.com/blogs/aws/aws-serverless-app-repo/)

**What:** A repository for discovering serverless applications. Preview available [here](https://pages.awscloud.com/serverlessrepo-preview.html).

# [Cloud9](https://aws.amazon.com/blogs/aws/aws-cloud9-cloud-developer-environments/)

**What:** IDE for writing, running, and debugging code. This is GA today!

**Why it matters:** A developer's editor is a sacred thing—from terminal junkies to full-fledged IDEs. For those less opinionated or that want to be less tethered to a particular development machine, the Cloud9 IDE is interesting. Develop directly in the cloud with an always-available environment. Pair programming is interesting, and something we've seen from VSCode and Atom in the last few weeks as well.


# [AWS Greengrass](https://aws.amazon.com/about-aws/whats-new/2017/11/aws-greengrass-adds-feature-for-machine-learning-inference/)

**What:** Lets you run machine learning at the edge.

**Why it matters:** It makes it easy to use your machine learning models at the edge, even without internet connectivity. You can do all your training in the cloud (maybe with SageMaker!), then push the model to your edge devices for inference.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Announcing the preview of Greengrass ML Inference. Run Machine Learning at the edge <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://t.co/08EpH4zX8Q">pic.twitter.com/08EpH4zX8Q</a></p>&mdash; AWS re:Invent (@AWSreInvent) <a href="https://twitter.com/AWSreInvent/status/935942065807966209?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>


# [IoT Device Defender](https://aws.amazon.com/blogs/aws/in-the-works-aws-sepio-secure-your-iot-fleet/)

**What:** Define and audit security policies across fleets of devices. Coming early 2018.


# [IoT Device Management](https://aws.amazon.com/blogs/aws/aws-iot-device-management/)

**What:** Improves security of IoT implementations. Lets you remotely onboard and manage new IoT devices at scale.


# [IoT 1-Click](https://aws.amazon.com/iot-1-click/)

**What:** Lets you set up a device to trigger a Lambda with a click.


# [Amazon Transcribe](https://aws.amazon.com/blogs/aws/amazon-transcribe-scalable-and-accurate-automatic-speech-recognition/)

**What:** Speech to text


# [Amazon Translate](https://aws.amazon.com/blogs/aws/introducing-amazon-translate-real-time-text-language-translation/)

**What:** Real-time language translation


# [Amazon Comprehend](https://aws.amazon.com/blogs/aws/amazon-comprehend-continuously-trained-natural-language-processing/)

**What:** Natural language processing


# [Rekognition Video](https://aws.amazon.com/blogs/aws/launch-welcoming-amazon-rekognition-video-service/)

**What:** Vision analysis on video streams


# [Kinesis Video Streams](https://aws.amazon.com/blogs/aws/amazon-kinesis-video-streams-serverless-video-ingestion-and-storage-for-vision-enabled-apps/)

**What:** Lets you ingest and store video streams.


# [SageMaker](https://aws.amazon.com/blogs/aws/sagemaker/)

**What:** Service that assist with the heavy-lifting of machine learning. Helps you author, train, and host your models.


# [AWS Neptune](https://aws.amazon.com/blogs/aws/amazon-neptune-a-fully-managed-graph-database-service/)

**What:** Fully-managed Graph database. Good for graph relations such as social networks, recommendations, routes, etc. Available in preview.

**Notes:** Probably not serverless-friendly to begin with (e.g. not auto-scaling or pay-per-usage), but it probably won't be too long.

Want in? Sign up for the preview [here](https://pages.awscloud.com/NeptunePreview.html).


# [DynamoDB backup and restore](https://aws.amazon.com/blogs/aws/new-for-amazon-dynamodb-global-tables-and-on-demand-backup/)

**What:** Much easier restore operations for DynamoDB. Includes the ability to backup to _any second_ in the last 35 days!


# [DynamoDB global tables](https://aws.amazon.com/blogs/aws/new-for-amazon-dynamodb-global-tables-and-on-demand-backup/)

**What:** Multi-region, multi-master tables for having your tables everywhere. For more on why this is important, might want to refresh your memory on [Jared Short's ServerlessConf talk](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#global-resiliency-when-going-serverless).


# [Serverless Aurora](https://aws.amazon.com/blogs/aws/in-the-works-amazon-aurora-serverless/)

**What:** Aurora is AWS's relational database in the cloud. It's cheaper and faster than MySQL or PostgreSQL databases. Serverless Aurora brings automatic scaling and per-second billing. MySQL available early 2018 and PostgreSQL later in 2018.

**Why this matters:** If done right, this is a dream come true. The data layer is an unsolved problem in the Serverless realm. If you want to use a traditional relational database, you're configuring a lot of network rules and VPC configuration -- just what you want to avoid with serverless architectures. You can avoid this pain by using DynamoDB, but the limited query patterns & hidden foot-guns can cause problems down the road.

Serverless Aurora could change all of that—a relational database that's accessible over HTTP, doesn't require complicated networking configuration, and uses IAM for authentication? Count me in.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Announcing Aurora Serverless. All the capabilities of Aurora, but pay only by the second when your database is being used <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://t.co/AP5R6jf7RB">pic.twitter.com/AP5R6jf7RB</a></p>&mdash; AWS re:Invent (@AWSreInvent) <a href="https://twitter.com/AWSreInvent/status/935913292903604224?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# AWS Fargate

**What:** Run your containers directly without a cluster. Just pay for your compute resources.

**Why this matters:** This drastically lowers the barrier for running containers. You don't need to set up and maintain a cluster for deploying your containers. It's not serverless -- you're still paying for resources even when they're not actively serving requests -- but it does have some of the similar benefits of serverless architectures.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">No longer any need to manage servers and clusters for your containers - AWS Fargate - Run ECS and EKS without managing servers <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://t.co/oPsXdvrSAL">https://t.co/oPsXdvrSAL</a> <a href="https://t.co/lZnS558CXV">pic.twitter.com/lZnS558CXV</a></p>&mdash; AWS re:Invent (@AWSreInvent) <a href="https://twitter.com/AWSreInvent/status/935910336212844544?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

# AWS EKS

**What:** Managed Kubernetes on AWS.

**Why this matters:** AWS will run your Kubernetes for you. It's not a serverless solution by any means, but many companies are interested in containers over straight serverless. For running functions-as-a-service on Kubernetes, check out the [Kubeless integration with the Serverless Framework](https://serverless.com/blog/serverless-and-kubernetes-via-kubeless/).

# [AWS AppSync](https://aws.amazon.com/blogs/aws/introducing-amazon-appsync/)

**What:** A platform for building data-rich apps with offline functionality.

**Why this matters:** This is an interesting, ambitious offering from AWS. Basically, it lets you set up a managed GraphQL endpoint over a variety of data sources. This endpoint can proxy to DynamoDB, ElasticSearch, or your custom Lambda functions. Further, it provides some nice functionality to keep your device synced when moving between online and offline modes.

I'd compare this to an AWS version of Firebase or Realm with the ability to have multiple different backing data sources. That's pretty powerful. One of the drawbacks to Firebase stems from the limitations of its data model. This offering sidesteps those issues.

The product page is live at [https://aws.amazon.com/appsync/](https://aws.amazon.com/appsync) and you can find docs [here](https://docs.aws.amazon.com/appsync/latest/devguide/welcome.html).

<p><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">We’re launching 🚀 AWS AppSync as a new service for preview later today! Here are some of its features! <a href="https://twitter.com/apatel72001?ref_src=twsrc%5Etfw">@apatel72001</a> <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://t.co/fG9thG6sAa">pic.twitter.com/fG9thG6sAa</a></p>&mdash; AWS re:Invent (@AWSreInvent) <a href="https://twitter.com/AWSreInvent/status/935573868260896768?ref_src=twsrc%5Etfw">November 28, 2017</a></blockquote></p>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

*credit: [AWSreInvent](https://twitter.com/AWSreInvent) main account.

# [Weighted aliases for Lambda](https://aws.amazon.com/about-aws/whats-new/2017/11/aws-lambda-supports-traffic-shifting-and-phased-deployments-with-aws-codedeploy/)

**What:** This will let you send some percentage of traffic to one version of a Lambda, the rest to another version. This is GA today, try it out!

**Why this matters:** This will make it easier to confidently push new changes to production.  When you push new versions, you can shift a small percentage of users to the new version and monitor for errors, performance metrics, etc. If you're happy with the results, you can gradually ramp up traffic so that all users see the new version.

# [AWS CodeDeploy incremental deployment](https://aws.amazon.com/about-aws/whats-new/2017/11/aws-lambda-supports-traffic-shifting-and-phased-deployments-with-aws-codedeploy/)

**What:** CodeDeploy support for incremental deployment of serverless applications. This is GA today, try it out!

**Why this matters:** This update fits well with the addition of [weighted aliases for Lambda](#weighted-aliases-for-lambda). In your CodeDeploy configuration, you can use phased rollouts of your applications. [For example](http://docs.aws.amazon.com/codedeploy/latest/userguide/deployment-configurations-create.html), you could have CodeDeploy make a deploy to 25% of your production traffic at first, then roll it out to the remaining 75% 45 minutes later. If you discover problems during that 45 minutes, you can rollback the deploy to limit problems to your users.

<p><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">New features coming to lambda <a href="https://twitter.com/hashtag/breaking?src=hash&amp;ref_src=twsrc%5Etfw">#breaking</a> <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> <a href="https://twitter.com/hashtag/reinvent?src=hash&amp;ref_src=twsrc%5Etfw">#reinvent</a> .cc <a href="https://twitter.com/Ninnir?ref_src=twsrc%5Etfw">@Ninnir</a> <a href="https://t.co/bNjL0I78ZU">pic.twitter.com/bNjL0I78ZU</a></p>&mdash; Julien Stanojevic (@GenuineM7) <a href="https://twitter.com/GenuineM7/status/935596271020130304?ref_src=twsrc%5Etfw">November 28, 2017</a></blockquote></p>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

*credit: [@GenuineM7](https://twitter.com/GenuineM7)

# [Canary management for API Gateway](https://aws.amazon.com/about-aws/whats-new/2017/11/amazon-api-gateway-supports-canary-release-deployments/)

**What:** This will allow you to send some percentage of API Gateway traffic to one source and the rest to another. This is GA today, try it out!

**Why this matters:** Same benefits as the [weighted aliases for Lambda](#weighted-aliases-for-lambda) above -- more fine-grained rollouts of new code to production. This change is at the API Gateway level, rather than for an individual Lambda function. [Canary deployments](https://martinfowler.com/bliki/CanaryRelease.html) are a way to safely roll out new changes to customers.


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
