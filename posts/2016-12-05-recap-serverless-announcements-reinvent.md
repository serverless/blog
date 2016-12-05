---
title: A Serverless re:Invent
description: Recap of serverless announcements for re:Invent 2017
date: 2016-12-05
layout: Post
---

**'Re:Invent 2017 and Serverless’**


Re:Invent tends to be what drives a majority of AWS’s big releases and 2016 was no exception. They announced tons of amazing stuff, especially in regards to serverless architectures. 

**Lambda@Edge**
*What is it?*
- allows JavaScript to be run inside a Lambda on any AWS edge location
- several options available that define which types of requests trigger your code to run
*Why it’s important?*
This allows for interesting use cases such as ‘intelligent’ HTTP processing and modifying HTTP headers on the fly. Also has some interesting potential use cases for IoT. 


**AWS X-Ray**
*What is it?*
- provides distributed tracing for distributed systems on AWS
- provides a visualization of your applications components and allows for an end-to-end view of requests 
- the final missing monitoring piece for AWS
*Why is it important?*
Getting a detailed view of performance as well debugging for micro-service architectures built on AWS has always been a difficult problem but X-Ray appears to be a tool that will make this a lot easier. It’s not available for Lambda yet, but when it is it will allow for a lot more peace-of-mind and encourage larger more complex systems to be built on top of it. 

**Step Functions**
*What is it?*
- visual workflow for designing and coordinating micro-service oriented applications 
- allows you to setup your functions as a series of ‘steps’, including automatic triggers, tracking, and retries
*Why is it important?*
We haven’t had a chance to dive in deep on the new service yet, but the focus seems to be on maintaining state across functions as well as providing a visual workflow tool. Tracking state across Lambdas has always been a problem and if this solves that problem it will allow much more complex serverless architectures to be built on AWs. 

**Greengrass**
*What is it?*
- embedded compute, messaging and data caching for connected devices
- allows for running Lambda functions on devices, online as well as offline 

- brings the Lambda ‘event driven’ story to devices
- makes the IoT story much more compelling 
- run online and offline
- makes device to device communication much easier and more interesting
*Why is it important?*
Greengrass is exciting because it brings Lambda’s ‘event driven’ compute power to devices, making the serverless story for IoT even more compelling. It promises to make offline compute as well as device-to-device communication much easier and more powerful.

**API Gateway in marketplace**
*What is it?*
- API Gateway endpoints can now be sold on the AWS Marketplace. 
*Why is it important?*
This is the first step towards allowing developers to sell their functions directly to customers. There aren’t a lot of examples to try out yet but it will be very interesting to see what type of activity unfolds here. 

**Dead Letter Queues  for Lambda**
*What is it?*
 - allows failed Lambda events to be automatically sent to an SQS queue to SNS topic
*Why is it important?*
By default if a Lambda is triggered and fails it will automatically retry twice before discarding the event. Dead letter queues for Lambda mean you will never miss an event again. Failed events can be sent to SQS or SNS where they can be processed and debugged further, so you can actually find the cause of the problem and fix it. This feature makes event processing on Lambda much more reliable and will likely result in a more widespread use. 

**C# for Lambda**
*What is it?*
- .NET Core 1.0 is now an officially supported runtime on Lambda
*Why it’s important?*
This announcement is especially interesting for organizations with a C# competency (mostly enterprises) and want to take advantage of all of the values that Lambda has to offer


<iframe src="https://docs.google.com/forms/d/e/1FAIpQLSc9-7zPxecAFMNLghatahtTPVpIH19Aypv6tPWxH9sxuyjcug/viewform?embedded=true" width="760" height="500" frameborder="0" marginheight="0" marginwidth="0">Loading...</iframe>a



