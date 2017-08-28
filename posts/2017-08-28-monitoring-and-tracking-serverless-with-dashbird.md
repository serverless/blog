---
title: Monitoring Serverless - Metrics and Error-tracking With Dashbird
description: Monitoring and error-tracking for Lambda functions requires a different approach from traditional. Check out the ins and outs of how Dashbird does it.
date: 2017-08-26
layout: Post
authors:
  - TaaviRehemagi
---

![Monitoring and error-tracking](https://user-images.githubusercontent.com/2154171/29753927-fc7359ca-8b83-11e7-99bc-90c594bff225.png)

Traditionally, error-tracking and application monitoring is done by attaching an agent to the server. Before doing the same for function based systems, you may want to take a step back and re-evaluate this approach.

**Here's why:**

**1. Functions behave differently from servers.**

Containers are started on-demand, live a short period and can have large amounts of instances running in parallel. To get insights into your system, it's good to look at executions from the top-down. Tracking trends and metrics before focusing on the details of individual executions can help detect problems and will also make you understand the scale of them.

**2. Attaching third-party libraries to all functions is a performance, cost and development overhead.**

Agents collect data by making network requests against remote APIs. This can have a negative effect on execution durations and on a over time will accumulate extra billable time and increase the cost of your system. Even worse, attaching agents to all functions is a development overhead, and not doing so for any function will create a blind-spot in monitoring.

**3. Account level metrics are important.**

In addition to function-level monitoring, you want to keep a broader eye on your system. For instance, to prevent running into AWS concurrent executions limit or to monitor the overall health of the system or accumulated billable time. This cannot be done without tracking every invocation of every function.

### You can do all this just by collecting Lambda execution outputs from CloudWatch.
**[Dashbird](https://dashbird.io) is a metrics and error-tracking service that works by collecting your AWS CloudWatch logs.** No matter how much functions you have or how much load your system is under, Dashbird will track it all in nearly real-time. Furthermore, the service takes 5 minutes to plug in and will not affect your systems performance or cost in any way.

## Monitoring
![Invocations](https://user-images.githubusercontent.com/2154171/29753904-6bdf18b8-8b83-11e7-99f4-4909024de263.png)

**Activity.** Dashbird tracks all executions in real-time and detects performance metrics along with errors in all of them. This gives you an helicopter view of everything going on in your system. From this, you can instantly learn if some part of your infrastructure is failing or acting in an unusual way. For instance, you can see a spike in errored invocations, indicating that some services have started failing. Or you can pick up that the invocation numbers have shot up, indicating a higher load to your system.

**Cost and health tracking.** Calculations of total billed durations for each day, week and running month. The service also evaluates the overall health along with accumulated invocation and error counts. All of that opens up visibility and predictability into your Lambda costs and visualizes the current quality of your system.

**Function tailing.** Sometimes what's necessary to debug is to observe functions in real-time. Dashbird brings live function tailing along with the ability to filter incoming log events to catch only the relevant information.

![Tailing](https://user-images.githubusercontent.com/2154171/29753910-8aab9b5e-8b83-11e7-8539-8f00ae6c7d33.png)

**Search invocation history.** The service provides searching through past log events in case you need to find or debug something specific that might have happened in the past but don't know when exactly.


## Error tracking
![Found errors](https://user-images.githubusercontent.com/2154171/29753923-d57eaa22-8b83-11e7-9b61-925ce6a88b89.png)
**Lambda, Node.js and Python error tracking.** Functions produce a different log output for every type of failure. Doesn't matter if it's a timeout, a configuration mistake or a runtime error, Dashbird finds it and reports it just like any other error-tracking service would. However, the service also gets the full context - all the logs, stack-traces and references to similar occurrences. Debugging and solving errors from this is easier and more time effective.

![Single error](https://user-images.githubusercontent.com/2154171/29753917-bade1da6-8b83-11e7-83ec-618f6fab9605.png)

## Setting up
**AWS Delegation.** Dashbird is a plug-and-play solution, meaning that all you need to do is sign up and grant access to your AWS account via a delegation. You can set it up without any code changes and it only takes about 5 minutes.

The service requires the following policy:

```
{
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": "logs:FilterLogEvents",
              "Resource": "*"
          },
          {
              "Effect": "Allow",
              "Action": "logs:describeLogStreams",
              "Resource": "*"
          },
          {
              "Effect": "Allow",
              "Action": "lambda:listFunctions",
              "Resource": "*"
          }
      ]
  }
```
_Note that using the `CloudWatch.FilterLogEvents` (nor other endpoints listed above) will not add any cost to your AWS billing._

[Check out setup details here.](https://dashbird.io/help/getting-started/setting-up-dashbird/)

## Conlusion
**With function-based systems, we have a unique opportunity to monitor and track errors without producin any overhead.** If you're developing a system using AWS Lambdas, check Dashbird out today! If you have a small to medium size system, [Dashbird is free](https://dashbird.io). For a more serious applications, you can try it out [for free for 14-days](https://dashbird.io).
