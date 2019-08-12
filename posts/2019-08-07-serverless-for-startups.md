---
title: "Serverless: The Ideal Choice For Startups? (CloudForecast Case Study)"
description: "CloudForecast is a bootstrapped startup that launched in 2018. This is their story of why they decided to go serverless."
date: 2019-08-07
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/header.png'
category:
  - user-stories
authors: 
  - FrancoisLagier
---

When we decided to launch and bootstrap [CloudForecast](https://www.cloudforecast.io/?utm_source=serverless.com&utm_medium=blog&utm_campaign=serverless) in 2018, we faced questions that every startup face including "What’s the right way to build this product with our resources without creating technical debts for the future?"

#### The "$100 Startup" concept

Around the time we started [CloudForecast](https://www.cloudforecast.io/?utm_source=serverless.com&utm_medium=blog&utm_campaign=serverless), I was reading "$100 Startup" by Chris Guillebeau. In his book, Chris advises his readers to get their product out fast while being cost-effective to limit the damage if your idea fails (definitely possible, unfortunately!). We try to apply this advice on every side of our business including our technical decisions.

#### Our goals/requirements

With the "$100 Startup" concept in mind, we started by listing the requirements that were important to us while building CloudForecast:

* Ship it out fast: We were excited to build CloudForecast to help companies save $$$ on AWS. We wanted to put it in front of our clients ASAP to keep our excitement going. Spending time debugging config, deploy process, etc. will not make the end product better. We were looking for an out of the box solution that we can grow with and allowed us to focus on our MVP the right away
* Cost-effective: As an early startup, we wanted to avoid fixed costs by building a system that will scale seamlessly based on our client base.

**AWS Lambda + Serverless = Easy + Focus + Cost-Effective**

We brainstormed on how we could achieve our goals and requirements. We discussed managing our own instances, using containers and half a dozen other ideas but we wanted something simple so we decided to use a Serverless solution (or FaaS). While there are a few downsides (e.g cold starts, …), we believed going serverless better suited our use case (nearly zero administration, pay-per-execution with no idle cost and auto-scaling). Cold starts is a known downside for Lambda but as we are mostly transforming and loading data from S3 in an offline fashion we decided that cold starts weren't a major concern for us. 

For the dev setup and deploy process, we decided to use Serverless Framework with AWS Lambdas for the following reasons:

* We can focus on writing our product and let Serverless manage the rest (permission, event management)
* Easy to configure and easy to deploy
* Serverless supports multiple platforms (GCP, AWS, … ) which could prevent headaches in the future. We picked AWS Lambdas to start with since our clients' data will be stored in S3. It was a logical decision in order to reduce the network cost
* The Serverless framework offers a long list of plugins (see [https://serverless.com/plugins/](https://serverless.com/plugins/))
* Last but not least: Great documentation and community ([Github](https://github.com/serverless/serverless), [Gitter](https://gitter.im/serverless/serverless), [Slack](https://serverless.com/slack) and [Forums](https://forum.serverless.com))

Our original requirements were fairly simple: We needed 4 AWS lambda functions each on their own cron job, and each lambda would need to talk to various AWS products (RDS, DynamoDb, SQS et al.). All that with an easy way to manage multiple environments (dev vs prod)  and an easy/effective way to manage resource permissions.

Here is how we do it:

* We used 4 functions:

![Functions](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/CloudForecastFunctions.png)

* Used the iamRoleStatements to configure all the permissions:

![IAM](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudforecast/CloudforecastIam.png)
  
With these two code snippets, we were able to set up most of our architecture. 4 functions that will interact with each other through SNS. Two functions will run check on a cron schedule (via the ‘schedule.rate’ params) to check a file need to be reprocessed and trigger another function via an SNS. This configuration will be able to scale effortlessly while keeping our costs under control. We are able to fully silo our environments using iamRoleStatements to configure the permissions.

We originally used a simple YAML file to control our environment variables but we quickly switched to a `DotEnv` file using the [DotEnv](https://serverless.com/plugins/serverless-dotenv-plugin/) plugin.

We considered running a couple of small instances to do the job which would cost us at least $1k for the year. However, the AWS Lambda cost is effectively $0  since we are only running a couple of functions a day which could easily be covered by the AWS free tiers.

#### Looking back!

Like every new startup, we made (and are probably still making) some mistakes along the way but picking AWS Lambda and the serverless framework wasn’t one of them. Here are a few reasons why it was the right choice for us: 

* **CloudForecast was able to grow effortlessly with AWS Lambda:** As we onboard clients, we will automatically run more functions and the cost will grow linearly with revenue.
* **The Serverless framework is always improving and it’s keeping up with AWS Lambda.** The recent [Full Lifecycle](https://serverless.com/blog/serverless-now-full-lifecycle/) feature announcement is a perfect example of how the Serverless framework is always evolving.

Over time, our product evolved and so did our functions but Serverless and Lambda were always able to deliver.

If you have any questions related to this post or what we do at [CloudForecast.io](https://www.cloudforecast.io/?utm_source=serverless.com&utm_medium=blog&utm_campaign=serverless), feel free to reach out to me at francois@cloudforecast.io. We would love to hear from you!
