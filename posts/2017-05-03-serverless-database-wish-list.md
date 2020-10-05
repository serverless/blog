---
title: Serverless Database Wish List - What's Missing Today
description: A wish list for bringing databases up to speed in the era of serverless application development.
date: 2017-05-03
thumbnail: https://cloud.githubusercontent.com/assets/20538501/25672643/253110f4-2ffa-11e7-8e26-65643382f15b.png
layout: Post
authors:
  - MaciejWinnicki
---

The rise of serverless infrastructure hugely simplified the process of deploying code into production. It's no longer necessary to worry about scaling, capacity planning or maintenance.

Furthermore, serverless enables developers to build globally distributed services with ease. You can now deploy code to numerous data centers around the world, providing low-latency access to your services for many customers with just a few commands. There's a problem though. Existing cloud databases just aren't a good fit for serverless applications.

The number of cloud database offerings continues to grow - from hosted open source databases ([Compose](https://www.compose.com/), [Amazon RDS](https://aws.amazon.com/rds/), [Google SQL](https://cloud.google.com/sql/docs/) to proprietary NoSQL solutions from major cloud vendors ([DynamoDB](https://aws.amazon.com/dynamodb/), [DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/), [Datastore](https://cloud.google.com/appengine/docs/standard/java/datastore/)). 

But these solutions were created for applications that are largely:
 - Running continuously for many days
 - Running from a single geographic location
 - Running from a fixed set of servers

> These restrictions are why we need a new database for the serverless age. This next generation of database should share the same principles as serverless - global distribution, pay-per-execution pricing, zero maintenance.

### Going Global

Cloud providers are launching new regions at an incredible pace. This is attracting customers from different parts of the world. In 2016, AWS launched 5 new regions. In 2017, Google Cloud plans to launch 8 regions. Microsoft Azure has 34 regions in total. So why does most of the software we build still run from a single location?

*First and foremost, cost.* Having the same set of hosts, load balancers and other stateless cloud resources in multiple regions is expensive. It also adds a significant layer of operational complexity. Function-as-a-Service (FaaS) providers, like AWS Lambda, are trying to solve this issue. Through FaaS providers, you deploy an application and only pay for the resources that are needed to run your business.

The challenge of data replication and synchronization is another reason for the prevalence of single region applications. Distributing database across geographic regions is a challenging technical task. It requires knowledge and expertise in distributed consensus algorithms and [CAP theorem](https://en.wikipedia.org/wiki/CAP_theorem). Many of the [most popular open-source DB engines](https://db-engines.com/en/ranking) weren't built with that in mind. The remaining solutions - even if capable of geographic distribution (like Cassandra) - require significant operational overhead.

Consistency is another factor. Ideally, the serverless database should guarantee strong consistency which might be required by some, if not most, of the use cases. It’s worth mentioning that companies like Twitter or Google have built such databases for their internal use.

The landscape looks more promising for databases from cloud vendors. Google’s [Datastore](https://cloud.google.com/appengine/docs/standard/java/datastore/) supports multi-regional active-active replication which isn't limited to nearby geographic areas on the same continent. Azure [DocumentDB](https://azure.microsoft.com/en-us/services/documentdb/) provides decent global distribution features with configurable different consistency levels. But like other cloud NoSQL solutions, it comes up short in other aspects.

### Pricing

The micro-billing pricing model is one of the main attractions to serverless application development. This model means you don't pay for unused resources because infrastructure automatically scales to meet current demand. And, it’s super cheap.

> One invocation of an AWS Lambda function costs $0.0000002.

AWS Lambda charges per single function invocation. Databases, on the other hand, don’t provide the same level of granularity when it comes to pricing. You still have to pick an instance type for your database, pay for all unused resources and manage capacity planning. In the best case scenario, you pay for read/write units (per hundred) and separately for storage (per GB). The pay-per-request pricing model doesn't fit in the case of a database since the storage always generates costs.

*Costs should scale with usage.* This setup would charge per operation, plus per storage with the highest possible level of granularity (e.g.: total costs = ops * single op cost + records * record cost). This pricing model makes calculating operational costs a no-brainer.

### No Maintenance

Manual intervention for operations like data replication and synchronization, adding a new region, removing a region, scaling underlying resources should be abstracted. And it shouldn't cause downtime. Maintenance windows need to become a blast from the past.

Eventually developers might not even be responsible for selecting geographic regions manually. Databases could provide low-latency access from different parts of the world - either by replicating data to all possible datacenters by default, or by detecting where requests come from and automatically replicating data to the closest data center. (Kind of like how CDN works)

### Relational model is useful. SQL not so much.

There are tons of use cases for columnar, document-oriented or graph databases, but the truth is that most consumer-facing applications use the [relational model (with transactions and joins)](https://en.wikipedia.org/wiki/Relational_model) because it prevents you from having inconsistent and duplicated data. Also, it's generally simpler for developers to manage.

We got used to query relational databases with SQL, a language with some flaws. It doesn’t fit the [object-oriented programming model](https://en.wikipedia.org/wiki/Object-oriented_programming). It’s too low level and doesn’t have first-class support for hierarchical data (other than JOIN statement). There is definitely room for improvement in this area and GraphQL looks like a viable option that might be used as a query language in modern database systems.

### So what's available now?

Recently launched [FaunaDB](https://fauna.com/) seems to be the most ideal database for serverless. It’s a cloud, globally distributed database with strong consistency guarantees. It’s definitely worth checking out, especially because of their pricing model and query language. I’m planning to write a review on FaunaDB from FaaS perspective. Stay tuned!

Shout out to [Nik Graf](https://twitter.com/nikgraf) and [David Wells](https://twitter.com/DavidWells) for their review and feedback!
