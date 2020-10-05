---
title: "All the Serverless announcements at re:Invent 2018"
description: "Not at AWS re:Invent? That's ok; we're compiling all the most important serverless announcements and updates. Updating live all week."
date: 2018-11-27
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-header1.gif'
category:
  - news
authors: 
  - AlexDeBrie
---

*Last updated: Nov 27, 11:23 AM*

re:Invent 2018 has begun! But there is ever so much to track.

If last year is any indication, we expect AWS to have a long list of serverless-centered announcements and launches. If you want to keep up, you've come to the right place.

We're watching all the keynotes and announcements live as they happen, and compiling the "what it is" and the "why it matters" right here. Updating live all week!

Oh, and while you're here, you should [check out our re:Invent virtual hackathon](https://serverless.com/blog/no-server-november-reinvent-hackathon). You can participate from anywhere, even if you're not at the conference, and win prizes while helping non-profits along the way.

#### re:Invent 2018 announcements

**Latest:**

* [Websocket support for Lambda functions](#websocket-support-for-aws-lambda)
* [Bring your own runtime to AWS Lambda](#bring-your-own-runtime-to-aws-lambda)
* [AWS Lambda Layers](#aws-lambda-layers) - ready to [publish and use with the Serverless Framework](https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/) right now
* [AWS IDE Integrations](#aws-ide-integrations)
* [Better Step Function Integrations](#better-step-function-integrations)
* [ALB Support for Lambda](#lambda-alb-support)
* [AWS Lambda Ruby support](#lambda-ruby-support)
* [Amazon Managed Streaming for Kafka](#amazon-managed-streaming-for-kafka)

**Most Exciting:**

* [Websocket support for Lambda functions](#websocket-support-for-aws-lambda)
* [AWS Lambda Layers](#aws-lambda-layers) - ready to [publish and use with the Serverless Framework](https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/) right now
* [Bring your own runtime to AWS Lambda](#bring-your-own-runtime-to-aws-lambda)
* [Timestream timeseries database](#timestream-timeseries-database)
* [AWS open-sources Firecracker virtualization technology](#aws-open-sources-firecracker-virtualization-technology)
* [DynamoDB Transactions](#dynamodb-transactions)

**Lambda:**

* [Websocket support for Lambda functions](#websocket-support-for-aws-lambda)
* [Bring your own runtime to AWS Lambda](#bring-your-own-runtime-to-aws-lambda)
* [ALB Support for Lambda](#lambda-alb-support)
* [AWS Lambda Ruby support](#lambda-ruby-support)
* [AWS Lambda Layers](#aws-lambda-layers)
* [Lambda + Kinesis Data Streams Upgrades](#lambda--kinesis-data-streams-upgrades)
* [Python 3.7 for Lambda](#python-37-for-lambda)

**Compute:**

* [AWS open-sources Firecracker virtualization technology](#aws-open-sources-firecracker-virtualization-technology)

**Databases:**

* [Amazon Quantum Ledger Database](#quantum-ledger-database-qldb)
* [Timestream timeseries database](#timestream-timeseries-database)
* [DynamoDB per-request billing](#dynamodb-per-request-billing)
* [DynamoDB Transactions](#dynamodb-transactions)
* [Serverless Aurora Data API](#serverless-aurora-data-api)
* [Preview of Aurora Serverless (PostgreSQL)](#preview-of-aurora-serverless-postgresql)

**Storage:**

* [S3 Batch Operations (preview)](#s3-batch-operations-preview)
* [S3 Intelligent-Tiering](#s3-intelligent-tiering)

**Security:**

* [AWS Control Tower](#aws-control-tower)
* [AWS Security Hub](#aws-security-hub)

**Operations & Observability:**

* [AWS CloudMap](#aws-cloudmap)
* [CloudWatch Logs Insights](#cloudwatch-logs-insights)

**Machine Learning:**

* [Textract](#textract)
* [Amazon Personalize](#amazon-personalize)
* [AWS Sagemaker Ground Truth](#aws-sagemaker-ground-truth)
* [AWS Inferentia–custom-built chip for faster ML inference](#aws-inferentia)
* [Amazon Elastic Inference](#amazon-elastic-inference)

**Blockchain, what:**

* [Amazon Quantum Ledger Database](#quantum-ledger-database-qldb)
* [Amazon Managed Blockchain](#amazon-managed-blockchain)

#### Pre-re:Invent announcements

* [Amplify Console](#amplify-console)
* [AppSync Pipeline Resolvers](#appsync-pipeline-resolvers)
* [Lambda + Kinesis Data Streams Upgrades](#lambda--kinesis-data-streams-upgrades)
* [Python 3.7 for Lambda](#python-37-for-lambda)
* [AWS Transfer for SFTP](#aws-transfer-for-sftp)

#### Announcements:

#### Websocket support for AWS Lambda

**What it is:** Use websockets with your Lambda functions

**Why it matters:** This is awesome. Websockets enable bi-directional interaction between client and server, making it much easier to do real-time functionality like chat. Previously, you [could use AWS IoT to get Websockets with Lambda](https://serverless.com/blog/realtime-updates-using-lambda-websockets-iot/), but this is much cleaner.

This feature is not released yet but coming soon. For our full explainer on why WebSockets are cool and how they make real-time apps so much easier (with architecture diagrams!), [see here](https://serverless.com/blog/api-gateway-websockets-support/).

#### Bring your own runtime to AWS Lambda

**What it is:** A way to bring your own runtime to AWS Lambda

**Why it matters:** You don't need to wait for AWS to add your favorite language -- you can bring your own! This is a great add and a common ask from Serverless users. Fans of more obscure languages will be particularly happy.

**Taking it one step further:** At Serverless, we saw BYOR and decided to take it one step further. Check out [Serverless Open Runtime](https://serverless.com/blog/introducing-serverless-open-runtime/) on GitHub. Build and share common solutions to complex problems before they even get to your business logic.

#### AWS Lambda Layers

**What it is:** AMIs for Lambda—build base layers that can be used across multiple Lambda functions

**Why it matters:** Layers allow you to pack code or data into a base layer which is then packaged into your function packages. This can be used to handle difficult dependencies or to package common code across all of your Lambda functions.

The Serverless Framework has day-one support of Lambda Layers, so you can start using it today! Here's how to [publish and use Lambda Layers with the Serverless Framework](https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/).

#### AWS IDE integration

**What it is:** Deep AWS integrations with your favorite IDEs

**Why it matters:** If you're a PyCharm, IntelliJ, or VS Code user, this is for you. Handy shortcuts and **step-through debugging of Lambda functions**. Much easier to get your functions into production!

#### Better Step-Function Integrations

**What it is:** Use services like SNS, ECS, DynamoDB, SageMaker, and more in your Step Functions.

**Why it matters:** Huge step up for multi-step workflows. Rather than writing your own custom logic in Lambdas, you can interact with AWS services directly. Remember, the best code is the code you don't have to write.

Want to get started with Step Functions? Check out this [post on managing your AWS Step Functions with Serverless](https://serverless.com/blog/how-to-manage-your-aws-step-functions-with-serverless/).

#### Lambda Ruby Support

**What it is:** AWS Lambda now supports Ruby!

**Get started with Ruby:** The Serverless Framework already supports the Ruby runtime. Here's our guide on [deploying your first API with Ruby](https://serverless.com/blog/api-ruby-serverless-framework/).

#### Lambda ALB Support

**What it is:** Invoke Lambdas directly from ALB, without using API Gateway.

#### Amazon Managed Streaming for Kafka

**What it is:** A managed Kafka service for streaming data.

#### Nested Apps using SAR

**What it is:** The Serverless Application Model now supports nested applications via the Serverless Application Repository.

#### AWS CloudMap

**What it is:** A hosted service discovery system from AWS.

**Why it matters:** This looks pretty neat. Typically, service discovery systems are more server-full as you're trying to find the hosts where your services are moving around. CloudMap has support for IP address discovery, but it also allows you to register services generally within AWS. You can register services within CloudMap, and other services can reach out to grab the current configuration as needed. 

Previously, serverless developers would use things like AWS SSM to manage this service discovery, but CloudMap looks like an interesting solution.

#### Textract

**What it is:** OCR++ service to extract text and data from documents, no machine learning experience required

**Why it matters:** It builds on the capabilities of previous text-recognition services, correctly parsing tables and other tricky text formats. Also, it can be used by anyone, even those with no previous machine learning experience. This shows AWS's commitment to widening developer accessibility to cutting-edge tech.

#### Amazon Personalize

**What it is:** Real-time personalization and recommendation service

**Why it matters:** This is the same recommendation foundation Amazon.com uses for their own product recommendations, and now they're making it available to everyone. The best part: they claim no machine learning experience is required in order to use it.

#### Amazon Forecast

**What it is:** Time series forecasting

**Why it matters:** This is based on the same technology they use at Amazon.com, and no machine learning experience is required to use it.

#### [AWS Sagemaker Ground Truth](https://aws.amazon.com/blogs/aws/amazon-sagemaker-ground-truth-build-highly-accurate-datasets-and-reduce-labeling-costs-by-up-to-70/)

**What it is:** A way to label your data for machine learning training.

**Why it matters:** Machine learning relies on properly-labelled data to train your models, and this can be a manual, time-consuming process. Sagemaker Ground Truth helps with this with both automatic and manual labelling for your existing data sets.

#### [AWS Inferentia](https://aws.amazon.com/machine-learning/inferentia/)

**What it is:** A custom-built chip from AWS to improve machine-learning inference

**Why it matters:** Machine learning is all the rage, and it takes large amounts of computational power to train and inferj with machine learning. AWS is pushing the envelope, just like Google is with its [TPU chips](https://cloud.google.com/tpu/). Look for these to help the serverless crowd down the road.

#### [AWS Elastic Inference](https://aws.amazon.com/blogs/aws/amazon-elastic-inference-gpu-powered-deep-learning-inference-acceleration/)

**What it is:** Add elastic GPUs to your EC2 instance for faster machine learning training and inference.

**Why it matters:** There's a huge hunger for GPUs for machine learning, and AWS is making it easier to attach to your EC2 instances. You can get serious performance -- up to 32 TeraFLOPS of performance -- and you pay on a per-hour basis, just like EC2.

#### Quantum Ledger Database (QLDB)

**What it is:** A fully-managed ledger database

**Why it matters:** Track and verify history of data changes. QLDB has similar mechanics to a SQL database but without the ability to permanently overwrite or delete data. This can be very useful for times when you have strong audit requirements and need to ensure long-term integrity and completeness of your data. Also, obvious usage for blockchain technology, if that's your thing.

#### Amazon Managed Blockchain

**What it is:** Lets you create and manage blockchain networks. Essentially, blockchain-as-a-service.

**Why it matters:** It makes it much easier to set up a blockchain network on Ethereum. We're admittedly more instantly excited about the Quantum Ledger Database, but there are some potentially interesting applications for companies to get up and running with smart contracts more easily with the Managed Blockchain service.

#### Timestream timeseries database

**What it is:** A fully-managed timeseries database

**Why it matters:** AWS continues to innovate on purpose-built datastores and now adds a time series database. Time series databases have grown in popularity in recent years. Having a fully-managed solution is a great win for serverless fans!

#### DynamoDB per-request billing

**What it is:** You can know pay for DynamoDB on a per-request basis, rather than pre-provisioned read and write capacity.

**Why it matters:** DynamoDB continues to make huge progress. One issue with DynamoDB with serverless is that you had to determine your capacity ahead of time. No more. Like AWS Lambda, you can now pay per-request. This is great for coupling the cost to the value you're provided your users.

**Should you use it right now?** We wrote a full guide on when (and when not) to use DynamoDB on-demand, plus how to implement it in your existing serverless applications. [See the full DynamoDB on-demand guide here](https://serverless.com/blog/dynamodb-on-demand-serverless/).

#### AWS Control Tower

**What it is:** A centralized place to manage multiple accounts in AWS.

**Why it matters:** This is a great addition for Serverless users. We're seeing a lot of teams that have separate accounts for each stage. Or, a team might give an isolated account for each developer for quickly testing changes before moving into the official CI/CD pipeline. This makes it a lot easier to give your developers flexibility without having an Excel sheet of AWS accounts.

#### AWS Security Hub

**What it is:** A tool to centrally manage security and compliance across many AWS accounts.

**Why it matters:** Like the AWS Control Hub, this helps manage the growing number of AWS accounts under your purview. Security has long been a tough thing for fast-moving product teams, and a centrally managed tool like this will help you move fast and stay secure.

#### DynamoDB Transactions

**What it is:** DynamoDB now supports transactions. 🎉

**Why it matters:** The best database for Serverless gets better and better. Now you can read and/or write multiple items on a single table or across multiple tables and get ACID transactions. This is a great addition and removes a lot of complicated logic from client libraries.

#### [CloudWatch Logs Insights](https://aws.amazon.com/blogs/aws/new-amazon-cloudwatch-logs-insights-fast-interactive-log-analytics/)

**What it is:** A faster, better query language for CloudWatch logs.

**Why it matters:** CloudWatch Logs has been the default logging solution for AWS Lambda and all container-based services from AWS. However, it hasn't kept up with third-party logging solutions out there. This is a step in the right direction to make it easier to see what's happening in your serverless applications.

##### [Amplify Console](https://aws.amazon.com/about-aws/whats-new/2018/11/announcing-aws-amplify-console/)

**What it is:** Deployment and hosting platform for web applications with serverless backends. Easily build and deploy your static site using Gatsby, Hugo, Jekyll, or other static site generators, as well as your backend APIs.

**Why it matters:** JAMStack, here I come! This is a low-config way to manage your JAMStack. Think Netlify, but with backend functions as well. For many projects, this is a great way to get your code from dev to production quickly.

##### [AWS open-sources Firecracker virtualization technology](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/)

**What it is:** Firecracker is a virtual machine manager built by AWS that hosts Lambda functions and Fargate containers. It's extremely lightweight, able to create a microVM in as little as 125 milliseconds.

**Why it matters:** We have a [full explainer on Firecracker](https://serverless.com/blog/firecracker-what-means-serverless/), and what it means for serverless developers. In sum, this isn't something most serverless users should care about. Yes, #ServerlessHasServers, but you don't need to know about them! However, it's still really exciting to see the amazing tech that is underlying all of these services from AWS. Further, the fact that Firecracker is open source means that it could receive community contributions that continue to push the envelope on serverless performance. It's great to see AWS making core, original contributions to the open-source community.

##### [S3 Batch Operations (preview)](https://aws.amazon.com/about-aws/whats-new/2018/11/s3-batch-operations/)

**What it is:** Select batches of existing objects in S3 to run actions on -- add tags, copy to another bucket, or even send to Lambda functions.

**Why it matters:** This eliminates a ton of toil around operating on existing objects in S3. You would need to write a ton of custom logic to make sure you're hitting the right objects, handling errors, etc. Now you can easily manipulate a huge block of objects in a single go.

##### [Serverless Aurora Data API](https://aws.amazon.com/about-aws/whats-new/2018/11/aurora-serverless-data-api-beta/)

**What it is:** An HTTP endpoint for accessing your Serverless Aurora database.

**Why it matters:** This is a big deal. In our post last year on [why Serverless Aurora is the future of data](https://serverless.com/blog/serverless-aurora-future-of-data/), we noted that an HTTP-accessible relational database would be a huge step forward for the Serverless ecosystem. AWS is starting to deliver on this promise.

Friend-of-the-Framework and all-around awesome guy [Jeremy Daly](https://twitter.com/jeremy_daly) has done a great [review of the Serverless Aurora Data API](https://www.jeremydaly.com/aurora-serverless-data-api-a-first-look/). TL;DR: It's not quite ready for primetime. AWS often releases things early and rapidly improves them, so look for this to get a lot better in 2019.

##### [Preview of Aurora Serverless (PostgreSQL)](https://aws.amazon.com/about-aws/whats-new/2018/11/sign-up-for-the-preview-of-amazon-aurora-postgresql-serverless/)

**What it is:** A PostgreSQL-compatible version of the Aurora Serverless database is now available in preview.

**Why it matters:** We're very bullish on Serverless Aurora being an important tool in the Serverless ecosystem. The MySQL-compatible database was released earlier this year, and now the PostgreSQL version is getting closer. This is great news for Postgres fans.

##### [AppSync Pipeline Resolvers](https://aws.amazon.com/about-aws/whats-new/2018/11/aws-appsync-launches-pipeline-resolvers-delta-sync-aurora-serverless-support/)

**What it is:** Break up GraphQL resolvers into multiple steps when using AppSync.

**Why it matters:** [AppSync is a great way to build Serverless GraphQL applications](https://serverless.com/blog/building-chat-appliation-aws-appsync-serverless/), and this service continues to get more and more powerful. The pipeline resolvers are great for adding authorization to the front of your GraphQL api or for more complex flows. AppSync is definitely a service to watch in 2019.

##### [Lambda + Kinesis Data Streams Upgrades](https://aws.amazon.com/about-aws/whats-new/2018/11/aws-lambda-supports-kinesis-data-streams-enhanced-fan-out-and-http2/)

**What it is:** AWS Lambda can now use Kinesis Data Streams Enhanced Fan-Out, a faster implementation of consumers for [Amazon Kinesis](https://aws.amazon.com/kinesis/)

**Why it matters:** The Enhanced Fan-Out for Kinesis Data Streams greatly increases the performance of Kinesis Data Streams. You can read up to 2MB per second per shard on your Kinesis Data Stream. Further, you can have multiple, independent consumers with the Enhanced Fan-Out that helps you get around the limitations of previous Kinesis consumers.

This is a huge step forward for fans of stream-based processing with AWS Lambda.

#### [Python 3.7 for Lambda](https://aws.amazon.com/about-aws/whats-new/2018/11/aws-lambda-supports-python-37/)

**What it is:** AWS Lambda now supports the Python3.7 runtime.

**Why it matters:** You get all the latest Python features with your Lambdas! The most exciting addition to Python3.7 is likely [dataclasses](https://docs.python.org/3/library/dataclasses.html)–a much simpler way to define classes.

**How do I use it:** You can use Python3.7 in the Serverless Framework by setting `runtime: python3.7`. The built-in `aws-python3` template will use Python3.7 in the [next release of the Framework](https://github.com/serverless/serverless/pull/5505).

#### AWS Transfer for SFTP

**What it is:** A managed SFTP service for Amazon S3

**Why it matters:** Lock down your file transfers with SFTP, without modifications to your app, and without needing to manage any SFTP servers.

#### S3 Intelligent Tiering

**What it is:** A new storage class for S3 which intelligently moves your objects between Standard Storage and Infrequent Access based on the individual object's access patterns.

**Why it matters:** This is a great addition from AWS to help you save money on your bills. Choosing the right storage class for your S3 objects can be a chore. Doing it manually often results in subpar pricing decisions. This is another example of AWS managing the boring stuff so you can focus on what matters to your users.

