---
title: "Things to consider before building a serverless data warehouse"
description: "Is it time for the rise of the serverless data warehouse? Read this post to find out, and for some serverless data warehousing pro-tips and considerations."
date: 2018-08-29
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-warehouse/serverless-data-warehouse-header.png'
category:
  - guides-and-tutorials
  - operations-and-observability
heroImage: ''
authors:
  - AshanFernando
---

We all know about data warehousing—the way organizations store and analyze data at scale. And we all know that data warehouses can be challenging to implement.

There is complexity, upfront costs and, of course, finding the expert to build and manage the infrastructure. These challenges have made data warehousing prohibitively expensive for all but large-scale organizations to implement.

But with serverless technologies, are those days over? Is it time for the rise of the serverless data warehouse, for organizations large and small alike?

In this post, we explore the benefits and downsides. Read on to see if serverless data warehouses are ready for prime time, and whether they would be a good fit for you.

## Some background

Let’s start by clarifying what ‘serverless data warehousing’ means.

A serverless data warehouse will get its functional building blocks via serverless third-party services, or a collection of services. These services are fully managed. They handle major complexities such as reliability, security, efficiency, and costs optimizations, and provide a consumption-based billing model for their usage.

**Note:** in reality, the internal complexities handled by a serverless data warehousing solution will be vendor-dependent, but they should all provide these baseline abstractions from above.

## Serverless building blocks

Although there are [various types of data warehouses](https://blog.panoply.io/i-choose-you-criteria-for-selecting-a-data-warehouse-platform) out there, they all rely on the same building blocks. Let's look at the common serverless tools and technologies you’ll need to use.

### 1. A centralized repository

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-warehouse/serverless-data-warehouse2.png">

The central repository is where the data is analyzed. Think [Amazon Redshift](https://aws.amazon.com/redshift/), [Azure SQL Data Warehouse](https://docs.microsoft.com/en-us/azure/sql-data-warehouse/sql-data-warehouse-overview-what-is), and [Google BigQuery](https://cloud.google.com/bigquery/).

Each of these solutions will support two important things:

1. storage
2. online analytical processing, where large aggregated queries can be run on the data

Which repository you use is up to you, but the most important thing you should consider is how it integrates with the other building blocks in your solution. Simply put, vendors make it easier to interface with other tools from within their own ecosystem.

If you decide to use AWS Redshift, for example, you’ll get lots of benefits if you stay within the AWS ecosystem for the rest of your warehousing solution:

S3 supports event triggers to connect with Lambda
Lambda loading data into Redshift is provided as open source code (See: [AWS Lambda Redshift Loader](https://github.com/awslabs/aws-lambda-redshift-loader))
Amazon QuickSight (a business intelligence tool) directly integrates with Redshift

Even when some of the integrations are not cloud-native (e.g, Lambda loading data into Redshift), the vendor provides additional code and support to make things simple to integrate.

### 2. Data pipeline (Serverless ETL)

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-warehouse/serverless-data-warehouse3.png">

Data will be coming from various sources, and you’ll have to preprocess it before moving the data to the central repository. This requires serverless tools for [ETL/ ELT](https://dzone.com/articles/etl-vs-elt-the-difference-is-in-the-how).

There are a lot of tools to choose from here, specializing in things like data extraction, loading and transformation, or different scenarios for loading data into the central repository.

On AWS for example, you can build your own solution using Lambda and its integrations (like our Redshift example above). Or, you can use specific solutions: AWS Glue, AWS Data Pipeline, AWS Data Migration Service, AWS Batch, AWS Kinesis Analytics, and so on.

Here are 4 questions you should ask yourself when selecting serverless ETL tools for your use case:

**1. What are the sources and destinations of data in the data warehousing solution?**

Can the tool load data and process within the cloud, on-prem to cloud, on-prem to cloud and back to on-prem?

**2. What is the frequency and size of the data being ingested?**

You’ll obviously need to find tools that support the scale of data ingestion. But you’ll also need to provide integrations with middleware to hold data before transforming it. If you’re handling a large amount of data, you can utilize scalable compute to process and transform it.

**3. What is the tool’s level of extensibility, configurability, and convenience?**

Does the tool let you do data transformations? Is it configurable for your specific use case? Does it allow your developers to manage it in a way that’s familiar to them (programming language, etc)?

**4. What is the pricing model?**

You should find out whether it’s cheaper to keep the ETL tools provisioned or running on demand. On-demand tools have a consumption-based cost model for usage, and until a certain tipping point, they will be more cost-effective than up front provisioning.

## Benefits and drawbacks of a serverless approach

When designing a data warehousing solution, you’ll need to optimize for these four key areas: security, reliability, performance, and efficiency.

Let’s see where serverless wins, and loses, in each of these areas.

### Where serverless wins

Here are the upsides to a serverless approach.

#### Simplicity in management

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-warehouse/serverless-data-warehouse1.png">

In a traditional data warehousing solution, architects have to have in-depth knowledge at both the hardware and software level in order to optimize reliability, performance and efficiency. They have to understand how to handle growing data volume, and how to design the solution to work efficiently based on the frequency of data loads, complexity of workloads, and supporting the query performance.

This will require a data warehouse that can easily scale out data storage, network, and processing capacity _without having any single points of failure_. With a traditional approach, your architect would have to implement each building block themselves.

With a serverless approach, every building block in your data warehouse will be fully-managed by definition, and individual services are usually covered by SLAs under the provider. Another bonus is that implementing new building blocks becomes a matter of simply choosing which service to use.

However, you'll still need expertise in a serverless solution to address how these individual serverless services are integrated, as well as non-functional requirements like reliability, performance and efficiency for the overall solution design.

#### No upfront commitment

The nature of serverless itself carries a cost advantage—it’s provisioned mostly in the cloud and scales on demand. You don’t have to provision a lot of resources up front, or pay for resources that go unused.

In a traditional data warehousing solution, the costs of setting up the environment include things like: implementing redundant servers for durability, availability, and fault-tolerance, having excess capacity for scalability needs, and software licensing. Even if you deploy in the cloud (in a non-serverless way), your overall cost will be higher as you implement your individual building blocks.

#### Reduced Operational Costs

With a serverless approach, most of the individual building blocks provide their own support for monitoring and automation. And with proper planning, you can further reduce cost by utilizing the on-demand and pay-per-use nature of serverless.

### Challenges and shortcomings

So does it means serverless data warehousing is a silver bullet to solve all the problems with traditional data warehousing?

The answer is maybe, but we’re not all the way yet:

- Though many serverless building blocks are fully managed, not _all_ of them are. If we consider Amazon Redshift, we need to choose the node type (e.g. compute optimized or storage optimized and selecting the node size from large and 8xlarge instance size. In addition, it will require to select the number of compute nodes for the cluster and manually do the sizing.
- There can be challenges in integrating different serverless building blocks. Sometimes, you’ll need to use a lower level of serverless units (e.g. serverless compute like Lambda), or even non-serverless blocks, to connect the entire solution.
- You lose the ability to have one big solution, and instead must integrate individual building blocks. While this makes your solution configurable, it also means added complexity.
- Costs are not _always_ on-demand and variable. Some serverless solutions, like Amazon Redshift, Azure SQL Data Warehouse have both upfront and variable cost components where an upfront cost is applied when provisioning the baseline compute infrastructure.
- They can require vendor-specific expertise for maximum efficiency while building the solution. Having a deeper understanding of whichever cloud provider you use will save a lot of time as you connect in other building blocks to create the entire solution.
- Vendor lock-in is a risk. Although this is not seen as a major problem today and it is possible to work around, it does require additional forethought and using the right abstractions within the design.

## The verdict?

Although challenges to serverless are there, we still see organizations increasingly adopting a serverless data warehousing approach, or using a partially-serverless approach. The main reasons are the advantages of serverless like auto-scaling and pay-per-execution pricing models.

So, is this the right time to move for a serverless data warehousing solution?

I would say, yes. It's the right time. Even if you are unable to build a fully-serverless solution, you can build the majority of the solution with serverless building blocks, and harness all the benefits discussed in this article.

I hope this list of considerations was helpful throughout your decision-making process, and I’m always available for questions or feedback below!
