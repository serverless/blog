---
title: "All the Serverless announcements at re:Invent 2019"
description: "Not at AWS re:Invent? That's ok; we're compiling all the most important serverless announcements and updates. Updating live all week."
date: 2019-12-02
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-2019-announcements-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-2019-announcements-header.png'
category:
  - news
authors: 
  - GarethMcCumskey
---

re:Invent 2019 is about to begin! And there is ever so much to track.

If last year is any indication, we expect AWS to have a long list of serverless-centered announcements and launches. If you want to keep up, you've come to the right place.

We're watching all the keynotes and announcements live as they happen, and compiling the "what it is" and the "why it matters" right here. Updating live all week!

#### re:Invent 2019 announcements

**Latest:**
* [AWS API Gateway v2 for HTTP](#aws-api-gateway-v2-for-http)
 * [RDS Proxy](#rds-proxy)
 * [Provisioned Concurrency](#provisioned-concurrency)
 * [S3 Access Points](#s3-access-points)
 * [Amazon Managed Cassandra Service](#managed-cassandra)
 * [Pre-Invent Lambda Updates](#pre-invent-lambda-updates)
 * [Eventbridge Schema Registry](#eventbridge-schema-registry)


**Most Exciting:**
* [AWS API Gateway v2 for HTTP](#aws-api-gateway-v2-for-http)
* [RDS Proxy](#rds-proxy)
* [Provisioned Concurrency](#provisioned-concurrency)
* [Pre-Invent Lambda Updates](#pre-invent-lambda-updates)
 * [Eventbridge Schema Registry](#eventbridge-schema-registry)

#### AWS API Gateway v2 for HTTP
**What it is** Overall top down improvement of API Gateway in almost all aspects

**Why it matters** While API Gateway v1 has served us well it hasn't been perfect. v2 solves some of the issues users have had with v1 such as improved latency, reduced cost, better CORS integration and support for JWT's amongst others.

We have a detailed blogpost going through all the changes, so if you want to know more [go check that out](https://serverless.com/blog/api-gateway-v2-http-apis/)
#### RDS Proxy
**What it is** Moves connection handling from the Lambda layer to the RDS Proxy layer to help curb the issues around reaching connection maximums.

**Why it matters** RDS has been a difficult service to use with Serverless for a number of reasons, and AWS has made numerous changes lately to try and correct these issues. This is one of the last and solves the problem produced by each Lambda function instance creating its own connection to the database. When at high Lambda concurrency this means you cna easily overwhelm a database with too many connections and essentially make the database inaccessible.

Read on about the changes with RDS proxy in our very own [detailed dive...](https://serverless.com/blog/amazon-rds-proxy/)

#### Provisioned Concurrency
**What it is** You can now spin up a pre-defined number of warm Lambda instances to bypass the cold start issue if latency is an issue

**Why it matters** If you have workloads that are latency sensitive, then being able to have Lambda functions pre-warmed ahead of a certain known event that will invoked Lambda's means you can entirely bypass the cold start issue and make sure requests to Lambda will always begin execution as fast as possible.

Read more about this new feature and how the Serverless Framework will support it [at this blog post](https://serverless.com/blog/aws-lambda-provisioned-concurrency).

#### S3 Access Points

**What it is** An alternate method to specify access patterns to an S3 resource, whether thats a full bucket or just one key, as well as what that access is

**Why it matters** S3 can get very complex to manage permissions for when you have many potential clients attempting to access that data. Being able to have a more specialised, app level permissions system makes managing this a lot easier and means things are more secure in the end for you and your data.

#### Managed Cassandra

**What it is** Cassandra is a very popular free and open-source, distributed, wide column store, NoSQL database management system designed to handle large amounts of data now fully managed on AWS

**Why this matters** DynamoDB is great, but I have heard from many users already using Cassandra that don't want leave it behind. Now users can get the best of both worlds and communicate to a fully managed Cassandra backend from their Lambda functions and have it be managed for them just like a DynamoDB table with provisioned or on demand modes available and no need to manage clusters.

![Managed Cassandra Announcement](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent-2019/managed-cassandra-announcement-optimised.png)

#### Pre-Invent Lambda updates

There were a bunch of updates to Lambda released just before RE:Invent started. These include:

* AWS Lambda Destinations and Asynchronous Invocation Improvements
* SQS FIFO Queue trigger support
* Improved stream interaction; error handling and parallelization 

**What it is** AWS has made a few good changes to Lambdas right out of the gate by allowing for more flexibility in the Serverless architectures you build by tweaking the relationship between some of the event triggers and Lambda

**Why it matters** These seemingly small tweaks open up a much broader set of use cases that maye have previously not been possible. All three changes listed add the capabilties of managing the interactions of three very useful event triggers in additional ways to meet the needs of users, and help make existing workarounds unnecessary.

We have a dedicated blog post talking about these changes in detail, [so please go check that out](https://serverless.com/blog/november-2019-lambda-releases/) for the full skinny..

#### Eventbridge Schema Registry

**What it is** The schema registry will scan the structure of events you send and receive in Eventbridge and document their structure automatically for you

**Why it matters** Managing events and their structure is always a tricky business and traditionally relies on developers taking the time off of building things to document things. While Eventbridge is not a panacea its a good bootstrapped step. Check out the [full blog post](https://serverless.com/blog/eventbridge-schema-registry/) for all the details.

