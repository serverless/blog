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
 * [S3 Access Points](#s3-access-points)
 * [Amazon Managed Cassandra Service](#managed-cassandra)
 * [Pre-Invent Lambda Updates](#pre-invent-lambda-updates)
 * [Eventbridge Schema Registry](#eventbridge-schema-registry)


**Most Exciting:**

* [Pre-Invent Lambda Updates](#pre-invent-lambda-updates)
 * [Eventbridge Schema Registry](#eventbridge-schema-registry)

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

