---
title: Choosing a Database for Serverless Applications
description: Learn the factors to consider when choosing a database with Serverless applications and AWS Lambda
date: 2019-06-20
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/choosing-serverless-database/choosing-serverless-database-thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/choosing-serverless-database/choosing-serverless-database-header.png'
authors:
  - AlexDeBrie
category:
  - guides-and-tutorials
---

When designing and building an application, one of the key considerations is which database to use. A poor decision here can cost you severely, either by requiring costly ongoing maintenance of a database or by forcing a sensitive data migration to another solution.

In this post, we'll cover how to choose a database for your serverless application. With serverless applications, there are new elements to consider as compared to traditional, instance-based architectures.

This post will start with some key high-level factors that impact your choice of a serverless database. Then, we'll look at a few key categories of databases to see how well they fit with the key factors we've identified.

The table of contents of this post is as follows:

- [Key Factors for Serverless Databases](#key-factors-for-serverless-databases)
  - [Data model needs](#data-model-needs)
  - [Connection model](#connection-model)
  - [Infrastructure-as-code](#infrastructure-as-code)
  - [Fully managed](#fully-managed)
  - [Pricing model](#pricing-model)
- [Serverless Database Categories](#serverless-database-categories)
  - [Server-based, relational databases](#server-based-relational-databases)
  - [Server-based, NoSQL databases](#server-based-nosql-databases)
  - [DynamoDB](#dynamodb)
  - [Aurora Serverless](#aurora-serverless)

## Key Factors for Serverless Databases

Before we get too far, let's consider the different factors you should consider when evaluating databases for a serverless application.

I've listed five factors that I consider most important for choosing a database in a serverless world. The first factor, centered on your data model needs, applies to serverless and non-serverless applications alike. The remaining four factors are more focused on particular attributes of serverless architectures.

After we review the five factors generally, we'll look at a few classes of databases to see how they rate on the five factors.

### Data model needs

The first factor you should consider is the data model needs of your application and how well a database fits those needs.

Amazon has been pushing the notion of [purpose-built databases](https://www.allthingsdistributed.com/2018/06/purpose-built-databases-in-aws.html) for a bit now. The idea here is that in the past, most applications were forced to use a [relational database](https://en.wikipedia.org/wiki/Relational_database). Now, there are a variety of database types to choose from, and you should pick the one that fits your application best.

I'll oversimplify a bit, but I see database options as three main classes:

- **Relational / SQL / normalized**: Traditional RDBMS systems that allow for significant query flexibility at the cost of top-end performance. Examples include MySQL, PostgreSQL, 

- **NoSQL / denormalized**: More recent database options that optimize for read-time queries at the expense of denormalized data sets. Lots of variety here but include MongoDB, Cassandra, and DynamoDB.

- **Hyper-specific use cases**: Databases that are specialized for a specific purpose. This may include Elasticsearch for full-text search, Neo4J for modeling graphs, or Redis for in-memory operations.

I don't see this grouping a lot, but I think it's a fruitful way to think about it.

For some very specialized use cases, your choice is basically made for you. This is for anything in the third bucket -- you need graph traversal queries or full-text search and thus need to use a database specifically suited for that access pattern.

Most applications can model their data in either of the first two buckets and the choice is more about flexibility vs. performance. If your data access patterns may change and you need the flexiblity, then go with a relational database. If you need hyper-scale and high performance, then go with a NoSQL database.

### Connection model

The second factor to consider is the connection model of the database.

This factor is a bit different than traditional, non-serverless applications. Most databases were built for a pre-serverless world. In this world, database clients were long-running applications on servers. Most databases want you to set up a persistent TCP connection to the database server and reuse this connection across multiple requests.

There are some downsides to this persistent connection. First, setting up and tearing down the connection takes time. When you're using a long-running application, this doesn't matter as much. You can pay that upfront cost once and then get the benefits of a persistent connection across all of your subsequent requests.

A second issue with the persistent connection is that each connection uses up resources on the client. Having [too many open connections](https://wiki.postgresql.org/wiki/Number_Of_Database_Connections) can hurt your database performance. Again, in the old world this was acceptable. You generally had a small, static number of application instances that were connecting to your database.

In the serverless world, this has been turned upside down. We're in a world of *hyper-ephemeral compute*, where your compute instance can be created, used, and destroyed within moments. This makes it inefficient to create a persistent database connection with every request, as you're paying the connection cost for something that may not be used again.

Further, the autoscaling attributes of serverless compute means that your application can scale up to thousands of compute instances within seconds. With certain databases, this can be a problem as you quickly reach the database connection limits.

There are ways of working around these issues, but there are serious downsides. A more serverless-friendly connection model is a better option when available.

### Infrastructure-as-code

A third factor to consider is how well your database can be managed via [infrastructure-as-code](https://en.wikipedia.org/wiki/Infrastructure_as_code).

Infrastructure as code is becoming more and more of a best practice for applications. With infrastructure-as-code, you have fully defined your infrastructure in a way that it can be updated in a consistent, repeatable way.

These practices are particularly useful in serverless applications where your application and infrastructure are so intertwined. A serverless application contains not just compute but queues, streams, blob storage, and event triggers to wire them all together. If you're not using infrastructure as code in a serverless application, you're going to end up with a confusing, unmanageable mess.

### Fully managed

The fourth factor to consider with a serverless database is whether you can use it as a fully-managed service.

Serverless is about offloading the undifferentiated heavy-lifting that doesn't matter to your users. Nowhere is this more true than in low-level infrastructure management. Just like serverless compute has freed up developers to do more work without managing servers, you should aim to use fully-managed databases to avoid the maintenance associated with patching, upgrading, and scaling a database.

### Pricing model

The final factor to consider when choosing a serverless database is the pricing model.

Many serverless applications utilize pay-per-use components. Rather than paying hourly for a server, no matter how much traffic you get, you can pay for only the compute you use with AWS Lambda. Similarly, services like 
[Amazon SQS](https://aws.amazon.com/sqs/), [SNS](https://aws.amazon.com/sns/), and [API Gateway](https://aws.amazon.com/api-gateway/) use a pay-per-use pricing model.

Pay-per-use in the database world is a little different, as you need to pay for storage in addition to the compute necessary to access the stored data. However, remember that _storage is usage_, and that paying a storage price per GB is still pay-per-use pricing and much better than paying for the full EBS volume attached to your instance, regardless of the amount of data you have stored.

## Serverless Database Categories

Now that we've reviewed some key factors to consider when evaluating databases for your serverless applications, let's look at a few different options and see how they compare on the listed factors.

### Server-based, relational databases

The first big category that developers reach for is the traditional RDBMS. And for good reason! Relational data modeling is well-known, SQL is ubiquitous, and most applications can model their data in a relational way. Relational databases are the [top four databases on the DB-Engines rankings](https://db-engines.com/en/ranking), and they represent a huge portion of databases in use today.

So how do relational databases rank with our five factors? Honestly, not great. That said, they may still be the right choice in certain situations.

Let's start with the positive. Relational databases probably fit your data model needs pretty well. Relational databases have supremely flexible query patterns, allowing you to iterate on your application without slowing you down much. It's true that there is a tradeoff between flexibility and query performance, but it's at a level that won't matter to most people. You can scale relational databases up quite a ways before you'll really hit performance issues.

Relational databases also do pretty well on the fully-managed factor. There are a number of services that will run a relational database for you without requiring you to spin up an EC2 instance and `apt-get install` your way to success. If you're using AWS, [Amazon RDS](https://aws.amazon.com/rds/) is a clear option here but there are a number of other services out there. Whatever you do, don't run your own RDBMS instances unless you definitely know what you're doing.

The bigger problems with relational databases are with the other factors. And these downsides are pretty nasty.

First, the connection model is all wrong for ephemeral compute. A RDBMS wants you to spin up a persistent TCP connection, but this is all wrong for AWS Lambda and other serverless offerings. The overhead of creating these connections and making sure you don't trigger connection limits will add complexity to your serverless applications.

Further, the relational database model fits awkwardly in an infrastructure-as-code paradigm. It's true that you can create an [RDS Database in CloudFormation](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-properties-rds-database-instance.html). However, attempting to use another RDBMS provider will require you to write a [CloudFormation custom resource](https://www.alexdebrie.com/posts/cloudformation-custom-resources/) to bring it into your CloudFormation stack.

Even if you do provision your RDBMS via CloudFormation, you still need to figure out a way to create your tables and run migrations as part of your deploy step. It feels like a kludge to fit this into your CI/CD system or add a Lambda that's triggered after a deploy to run these administrative tasks. It's not impossible, but it doesn't fit cleanly.

Finally, the billing model for relational databases is based on old-school hourly billing based on instance size. No pay-per-use here.

All in all, RDBMS is an OK choice for serverless application in certain situations. If you like the relational data model and don't want to step out of your comfort zone, it can work for you. However, there are a number of factors that make it a less-than-ideal fit for serverless applications.

### Server-based, NoSQL databases

The second category of databases is server-based, NoSQL databases. In this category, you have options like [MongoDB](https://www.mongodb.com/) and [Cassandra](http://cassandra.apache.org/).

I'm pretty bearish about these databases in serverless applications. These databases bring a lot of the baggage of server-based relational databases with less of the upside.

First off, all the issues about the connection model, infrastructure-as-code, and pricing model with relational databases also apply here. You're paying for instances, running one-off scripts during deploys, and trying to reuse connection pools with these instances.

However, you don't really get the benefits of a serverless database either. The fully-managed options for these databases are improving, but they're still a bit sparse. Further, you often need to go outside the AWS ecosystem to use these, which adds additional overhead in orchestration.

Finally, these NoSQL solutions do offer better scalabilty than their SQL brethren. However, that scalability comes at a premium. You'll either need to run a giant cluster of your own instances (and have the team to maintain it!) or pay for the fully-managed options mentioned above.

Ultimately, I wouldn't recommend using server-based NoSQL databases in a serverless architecture unless you have strong experience with the data model and prefer it to a relational model. If you do use it, be sure to use a managed service so you're not dealing with failed upgrades or missing backups at the wrong time.

### DynamoDB

While the previous two sections were broad categories of databases, the next two are specific database technologies.

First up is [Amazon DynamoDB](https://serverless.com/dynamodb/). DynamoDB is a NoSQL database, like Mongo and Cassandra mentioned previously. There's a big difference between DynamoDB and the others. For lack of a better term, I'll say that DynamoDB is not 'server-based', while the others are.

What does this mean? When you're using MongoDB, Cassandra, or other NoSQL databases, even if in a managed capacity, you're still working within a server-focused paradigm. You specify the exact number and size of nodes that you want in your cluster. You connect to a certain IP address or hostname that goes directly to your cluster. You probably partition your cluster in a private network so that it's not exposed to the public internet.

With DynamoDB, none of these things are true. You have no idea how many servers AWS is using behind the scenes to service your table. You don't connect to a unique host; you make direct HTTP requests to the general DynamoDB endpoints. There's no fumbling around with security groups to make sure your applications have network access to your database. All you need is the proper IAM credentials to access your table.

Given the above, DynamoDB stands head and shoulders above other options in terms of the connection model for use in a serverless application. But how does it compare on the other factors?

DynamoDB shines in many other aspects of the serverless paradigm as well. It works well with infrastructure-as-code -- there's full CloudFormation and Terraform support. Further, there's no separate administrative tasks -- like creating database users or performing table migrations -- that happen outside the infrastructure-as-code process. Everything just works.

Further, DynamoDB is fully-managed. In fact, you don't have an option to run DynamoDB yourself (unless you want to run [DynamoDB Local](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBLocal.html) on an EC2 instance, in which case you are beyond saving). For a NoSQL database that scales to terabytes of data, this is exactly what you want. Don't spend your precious resources babysitting your database.

DynamoDB also has a great pricing model for serverless. You can do [pay-per-request pricing](https://serverless.com/blog/dynamodb-on-demand-serverless/) using the on-demand billing model, which gives you pay-per-use pricing just like Lambda, SNS, SQS, API Gateway, and more. If you do have a better sense of your traffic patterns, you can use the standard provisioned throughput billing model.

The last factor is the data model needs, and this is where it gets iffy with DynamoDB. There are two main issues with DynamoDB data modeling:

1. It's a significant learning curve and shift for those coming from a RDBMS background.
2. It's much less flexible if your access patterns change over time.

These are completely different types of problems. The first one is a temporary problem -- you and your fellow engineers will need to spend some time learning how to model data with DynamoDB. There's a cost here, but it's easily paid if you put in the time.

The second problem is more difficult. Many users that are building serverless applications are in the early stage of application development. They are expecting significant changes to their application over time as they iterate based on customer feedback. With an RDBMS, it's easy to change your access patterns. With DynamoDB, it's not -- you may find you need to perform a data migration to accommodate new use cases.

This is my only hesitation with recommending DynamoDB whole-heartedly. If you know your application access patterns and know they won't change, you should absolutely use DynamoDB. If you are expecting them to change over time, you need to make some harder choices.

### Aurora Serverless

The last category of database is [Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/). Aurora is a cloud-native implementation of RDBMS that AWS created. Aurora Serverless is a "serverless" implementation of Aurora.

There are two aspects to Aurora Serverless that are different than traditional RDBMS options:

1. There's a pay-per-use billing model.
2. There's a [Data API](https://aws.amazon.com/about-aws/whats-new/2018/11/aurora-serverless-data-api-beta/) which allows you to make database requests via HTTP.

Remember our initial qualms with using [server-based, relational databases](#server-based-relational-databases) in serverless applications: the connection model isn't a fit; the billing model is not based on usage, and it's a bit of an awkward fit with infrastructure-as-code.

The improvements in Aurora Serverless address two of these three issues. With a pay-per-use billing model, you get something that's more in line with the rest of your serverless architecture. And while this billing model update is interesting, it's the Data API that is the real game changer.

The Data API for Aurora Serverless allows you to make HTTP requests to your RDBMS database. No need for persistent TCP connections. Further, it will handle connection pooling for you, so you don't need to think about connection limits in your Lambda function.

Jeremy Daly has done an awesome [deep dive on the Aurora Serverless Data API](https://www.jeremydaly.com/aurora-serverless-data-api-a-first-look/) with great thoughts on the mechanics around using it and the performance characteristics.

Currently, the Data API is not as performant as a persistent TCP connection or as a DynamoDB request. However, the performance is getting better. I doubt we'll get full parity with a persistent connection, but something in the ballpark would be a gamechanger. I've [long been a fan of the potential of Aurora Serverless](https://serverless.com/blog/serverless-aurora-future-of-data/), and I'm bullish as ever on its future.

## Conclusion

There is no easy answer for which database you should choose in a serverless application. DynamoDB checks a lot of the boxes, but its steep learning curve and lack of flexibility have burned more than a few people. I still think it's the right choice in most situations, but you have to make a call based on your team and application needs.

In this post, we looked at the different factors you should consider in choosing a serverless database. Then we looked at a few categories of database you may consider in your application.

The serverless compute revolution is still new, and it is taking some time for databases to catch up. We'll see new, cloud-native database options that fit well within the serverless ecosystem. The future is bright, and we just need to make do until it arrives.
