---
title: "Amazon RDS Proxy makes it easier to use SQL in Serverless"
description: "The release of the Amazon RDS Proxy at re:Invent removes one of the main objections to using relational databases in serverless applications. Read this post to understand why."
date: 2019-12-03
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/amazon-rds-proxy/amazon-rds-proxy-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/amazon-rds-proxy/amazon-rds-proxy-header.png"
category:
  - news
authors:
  - AlexDeBrie
---

For Serverless users, preInvent and re:Invent has been like Christmas. We're getting a ton of new tools to help build Serverless applications, from [Lambda Destinations](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-destinations/) to async invocations, to the [EventBridge schema registry](https://serverless.com/blog/eventbridge-schema-registry/), to a ton of different ways to [manage stream processing in Lambda](https://aws.amazon.com/blogs/compute/new-aws-lambda-controls-for-stream-processing-and-asynchronous-invocations/).

All of these are great, but the most impactful announcement for many users may be the [Amazon RDS Proxy](https://aws.amazon.com/about-aws/whats-new/2019/12/amazon-rds-proxy-available-in-preview/). This service, combined with some other recent improvements from AWS, makes it much easier to use relational databases in AWS.

In this post, you'll learn the what and why about the Amazon RDS Proxy. We'll cover:

- [Why relational databases have been hard in Serverless](#why-relational-databases-have-been-hard-in-serverless)
- [How Amazon RDS Proxy and other improvements are making relational databases work in Serverless](#how-amazon-rds-proxy-and-other-improvements-are-making-relational-databases-work-in-serverless)
- [How to think about choosing a database in Serverless](#how-to-think-about-choosing-a-database-in-serverless)

Let's get started!

## Why relational databases have been hard in Serverless

The database question has been one of the bigger issues in Serverless for a few years. We've written on that numerous times, including posts on [the data layer in Serverless](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#data-layer-in-the-serverless-world), [choosing a database in serverless](https://serverless.com/blog/choosing-a-database-with-serverless), and [why we were so excited about Aurora Serverless](https://serverless.com/blog/serverless-aurora-future-of-data/).

Two years ago, there were a few major problems with using relational databases in Serverless applications:

- **Pricing model**: Relational databases were priced hourly by instance size, whether you're using it or not.

- **VPC cold-starts**: Relational databases should be network-partitioned in a private subnet of your VPC where it cannot be accessed from the public internet. However, this means that your Lambda functions need to be in a VPC, which meant occasional cold-starts of up to 10 seconds.

- **Connection limits**: Relational databases were built for an era of a lower number of long-running compute instances. They don't fit this world of a high number of hyper-ephermal compute instances. AWS Lambda users may run into connection limits when trying to connect to their relational databases.

Fortunately, AWS has been listening, and each of these issues has been addressed.

## How Amazon RDS Proxy and other improvements are making relational databases work in Serverless

In the past two years, AWS has worked hard to make relational databases work better in Serverless applications.

First, AWS released [Amazon Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/). This is a serverless version of the proprietary Amazon Aurora database that can automatically scale up and down according to your usage. This release helped with the pricing model issues around using a relational database.

Second, AWS announced [improved VPC networking for AWS Lambda functions](https://aws.amazon.com/blogs/compute/announcing-improved-vpc-networking-for-aws-lambda-functions/). This update greatly decreased the coldstart latency for Lambda functions that use a VPC. This makes it more acceptable to use VPC Lambda functions in user-facing applications.

Finally, the [Amazon RDS Proxy](https://aws.amazon.com/blogs/compute/using-amazon-rds-proxy-with-aws-lambda/) announced today handles the connection limits. Rather than managing connections in your Lambda functions, you can offload that to the Amazon RDS Proxy. All pooling will happen in the proxy so that you can handle a large number of connections in a manageable way.

## How to think about choosing a database in Serverless

Given the updates in the last few years, how should Serverless developers go about choosing a database for their application?

I don't think there's a clear answer, and these recent updates have made the decision more difficult.

Lots of folks will reach for a relational database due to its familiarity, and that's fine! Making the shift to Serverless is a big change in itself, and using familiar tools like a relational database can ease the journey.

That said, there are still a few issues with relational databases in Serverless applications. The pricing model is _better_, but it's still not perfect. Amazon Aurora Serverless scaling isn't as quick as it needs to be, and you're still not getting anything like the [DynamoDB On-Demand pricing](https://aws.amazon.com/blogs/aws/amazon-dynamodb-on-demand-no-capacity-planning-and-pay-per-request-pricing/). Additionally, the Amazon RDS Proxy is priced on an hourly basis.

Taking it a step further -- I'm increasingly convinced that you give up a lot of agility as soon as you add *a single element* to your architecture that is not pay-per-use. When all of your architectural components are pay-per-use, it makes it seamless to spin up temporary environments for development or testing. As soon as you add slower-moving, hourly-billed components to your infrastructure, it increases the cost and reduces the speed in which you can deploy test environments.

For some, this is a totally reasonable tradeoff to make. The learning curve of understanding DynamoDB data modeling may not be worth the increased agility for development environments. Just be sure you're aware of the tradeoffs you're making as you're choosing your database.