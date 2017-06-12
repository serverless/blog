---
title: 4 Tools For Building Production Serverless Architectures with Lambda 
description: Working with serverless is great when you find the right tools that work for you. Check out these tools to take your lambdas to the next level!
date: 2017-06-12
layout: Post
authors:
  - TaaviRehemagi
---

The Serverless Framework offers one of the fastest and cheapest ways to produce scalable and modern backend applications.
However, building these event based systems differs quite a lot from traditional applications both by development workflow and production infrastructure.

The main difficulty of developing these systems is the inability to test code locally and also the difficulty of orchestrating large number of functions to work together.
It is also complicated to monitor the functions and have an overview of how each service is operating.

**Here are some of the tools that help to maintain function based services and improve the development worflow.**

## 1. Dashbird

[Dashbird](https://dashbird.io) is a service made to **monitor, debug and improve lambda functions**. 

It gives developers a real-time overview of all lambda executions and detects errored invocations in them.
This allows users to easily to monitor traffic and ensure service quality.

![Main dashboard](https://cloud.githubusercontent.com/assets/2154171/26646577/d3fe81b0-4644-11e7-9e2a-0c99aaaa19e3.png)
_Overview dashboard_

The service also stores details and logs about every code execution which is perfect for later debugging.
![Lambda dashboard](https://cloud.githubusercontent.com/assets/2154171/26646626/ff05d80e-4644-11e7-94f1-42e82ffe5029.png)
_Lambda dashboard_

In addition Dashbird offers powerful tools to process function logs, like **searching and live tailing.**

### Setup

Setting up Dashbird takes about 5 minutes and **requires no code changes.**
[You can read more about setup here](https://dashbird.io/setup).

**Dashbird is currently free of charge!**

### TL;DR
- instant overview
- error detection
- duration and memory statistics
- 5 minute setup with no code changes
- **[Dashbird is currently free of charge](https://dashbird.io)**

## 2. SumoLogic

[SumoLogic](https://sumologic.com) is a machine data analytics service for **log management and time series metrics.**

With SumoLogic, developers can construct meaningful dashboards to monitor specific parts of the system that are especially important. SumoLogic is also lightning-fast for searching over large amounts of data.

![Custom dashboard for monitoring integrations](https://cloud.githubusercontent.com/assets/2154171/26598202/32bb89f0-457d-11e7-9f2d-9b2167a6e940.png)
_SumoLogic dashboard to monitor integrations_

### Setup
To set up SumoLogic, you have to subscribe a lambda to CloudWatch log groups posts data to SumoLogic via a HTTP endpoint.

**A more detailed instruction can be found [here](https://github.com/SumoLogic/sumologic-aws-lambda/tree/master/cloudwatchlogs).**

_Be mindful that CloudWatch currently allows only one subscription per log group, meaning that no room if left for other subscriptions._

### TL;DR
- custom dashboards
- log search
- subscription to CloudWatch required
- $108/mo for professional, has freemium

## 3. Sentry

[Sentry](https://sentry.io) is a **real-time error tracking** service.

With Sentry, developers get notified instantly when errors occur in live environments. This is crucial for reacting quickly and ensuring customer satisfaction.
Along with every report, sentry gathers stack-traces for faster and better debugging.

Sentry also analyzes the impact of each release, so it's easy to later see which release introduced which bugs.

### TL;DR
- real-time error reporting
- version statistics
- implementation required
- event based pricing, has freemium

## 4. Offline Serverless plugins
Serverless has a lot of useful plugins to test code locally before deploying to a remote environment. This helps developers save time of unnecessary deploys.

Here are some of the plugins to use:

- [Emulate AWS Lambdas and API Gateway locally](https://github.com/dherault/serverless-offline)

- [Emulate DynamoDB locally](https://www.npmjs.com/package/serverless-dynamodb-local)

- [Fetch logs to terminal](https://serverless.com/framework/docs/providers/aws/cli-reference/logs/)


## Conlusion
Working with serverless systems is great when you find the right tools that work for you. With these tools, you can fix errors faster and be more connected to your serverless applications.

_PS! Write in the comments if you think anything is missing!_
