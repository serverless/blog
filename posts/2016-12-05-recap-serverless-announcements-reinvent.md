---
title: 2016 AWS re:Invent Recap - Serverless Christmas came early
description: "A recap of serverless news from AWS re:Invent 2016 & why it matters."
date: 2016-12-05
thumbnail: https://cloud.githubusercontent.com/assets/20538501/20940035/de826f34-bbb6-11e6-8f32-ac70c9ec3a66.png
category:
  - news
authors:
  - NickGottlieb
---

Many of AWS' biggest releases tend to happen around their annual re:Invent conference, and 2016 was no exception. AWS announced lots of amazing stuff last week in Vegas. Here are some highlights of what we're most excited about as it relates to serverless architectures.

## Lambda@Edge

**What is it?**
- Allows JavaScript to be run inside a Lambda on any AWS edge location
- Several options available that define which types of requests trigger your code to run

**Why it’s important?**

This allows for interesting use cases such as ‘intelligent’ HTTP processing and modifying HTTP headers on the fly. Also has some interesting potential use cases for IoT.

## AWS X-Ray

**What is it?**
- Provides distributed tracing for distributed systems on AWS
- Provides a visualization of your applications' components and allows for an end-to-end view of requests
- The final missing monitoring piece for AWS

**Why is it important?**

Getting a detailed view of performance as well as debugging for microservice architectures built on AWS has always been a difficult problem. X-Ray appears to be a tool that will make this a lot easier. It’s not available for Lambda yet, but when it is it will allow for a lot more peace-of-mind and encourage larger, more complex systems to be built on top of it.

## Step Functions

**What is it?**
- Visual workflow for designing and coordinating microservice oriented applications
- Allows you to setup your functions as a series of ‘steps’, including automatic triggers, tracking, and retries

**Why is it important?**

We haven’t had a chance to dive in deep on the new service yet, but the focus seems to be on maintaining state across functions, as well as providing a visual workflow tool. Tracking state across Lambdas has always been a problem and if this solves that problem it will allow much more complex serverless architectures to be built on AWs.

## Greengrass
**What is it?**
- Embedded compute, messaging and data caching for connected devices
- Allows for running Lambda functions on devices, online as well as offline
- Brings the Lambda ‘event driven’ story to devices
- Makes the IoT story much more compelling
- Runs online and offline
- Makes device to device communication much easier and more interesting

**Why is it important?**

Greengrass is exciting because it brings Lambda’s ‘event driven’ compute power to devices, making the serverless story for IoT even more compelling. It promises to make offline compute as well as device-to-device communication much easier and more powerful.

## API Gateway in Marketplace
**What is it?**
- API Gateway endpoints can now be sold on the AWS Marketplace

**Why is it important?**

This is the first step towards allowing developers to sell their functions directly to customers. There aren’t a lot of examples to try out yet, but it will be very interesting to see what type of activity unfolds here.

## Dead Letter Queues for Lambda
**What is it?**
 - Allows failed Lambda events to be automatically sent to an SQS queue or to SNS topic

**Why is it important?**

By default if a Lambda is triggered and fails it will automatically retry twice before discarding the event. Dead letter queues for Lambda mean you will never miss an event again. Failed events can be sent to SQS or SNS where they can be processed and debugged further, so you can actually find the cause of the problem and fix it. This feature makes event processing on Lambda much more reliable and will likely result in a more widespread use.

## C# for Lambda

**What is it?**
- .NET Core 1.0 is now an officially supported runtime on Lambda

**Why it’s important?**

This announcement is especially interesting for organizations with a C# competency (mostly enterprises) that want to take advantage of all of the value that Lambda has to offer.


<a href="https://docs.google.com/forms/d/e/1FAIpQLSc9-7zPxecAFMNLghatahtTPVpIH19Aypv6tPWxH9sxuyjcug/viewform" target="_new"><strong>Take our survey on which announcements are the most exciting</strong><a/>


## More re:Invent Lambda discussions in Serverless Office Hours
Tune in for <a href="https://www.youtube.com/watch?v=IoW_IcvRTGM" target="_new">Serverless Office Hours</a>, Thursday, Dec. 8, 10-11AM PST, for a live discussion of the Lambda announcements at re:Invent and how they relate to the Serverless Framework. We'll also answer questions about the latest framework release - v1.3.
