---
title: "All the Serverless announcements at re:Invent 2018"
description: "Not at AWS re:Invent? That's ok; we're compiling all the most important serverless announcements and updates. Updating live all week."
date: 2018-11-27
thumbnail: ''
heroImage: ''
category:
  - news
authors: 
  - AndreaPasswater
---

*Last updated: Nov 27, 8:49 AM*

re:Invent 2018 has begun! But there is ever so much to track.

If last year is any indication, we expect AWS to have a long list of serverless-centered announcements and launches. If you want to keep up, you've come to the right place.

We're watching all the keynotes and announcements live as they happen, and compiling the "what it is" and the "why it matters" right here. Updating live all week!

Oh, and while you're here, you should [check out our re:Invent virtual hackathon](https://serverless.com/blog/no-server-november-reinvent-hackathon). You can participate from anywhere, even if you're not at the conference, and win prizes while helping non-profits along the way.

#### re:Invent 2018 announcements

*Coming soon!*

##### [Amplify Console](https://aws.amazon.com/about-aws/whats-new/2018/11/announcing-aws-amplify-console/)

**What it is:** Deployment and hosting platform for web applications with serverless backends. Easily build and deploy your static site using Gatsby, Hugo, Jekyll, or other static site generators, as well as your backend APIs.

**Why it matters:** JAMStack, here I come! This is a low-config way to manage your JAMStack. Think Netlify, but with backend functions as well. For many projects, this is a great way to get your code from dev to production quickly.

##### [AWS open-sources Firecracker virtualization technology](https://aws.amazon.com/blogs/aws/firecracker-lightweight-virtualization-for-serverless-computing/)

**What it is:** Firecracker is a virtual machine manager built by AWS that hosts Lambda functions and Fargate containers. It's extremely lightweight, able to create a microVM in as little as 125 milliseconds.

**Why it matters:** For most Serverless users, this isn't something you need to care about. Yes, #ServerlessHasServers, but you don't need to know about them! However, it's still really exciting to see the amazing tech that is underlying all of these services from AWS. Further, the fact that Firecracker is open source means that it could receive community contributions that continue to push the envelope on serverless performance. It's great to see AWS making core, original contributions to the open-source community.

##### [S3 Batch Operations (preview)](https://aws.amazon.com/about-aws/whats-new/2018/11/s3-batch-operations/)

**What it is:** Select batches of existing objects in S3 to run actions on -- add tags, copy to another bucket, or even send to Lambda functions.

**Why it matters:** This eliminates a ton of toil around operating on existing objects in S3. You would need to write a ton of custom logic to make sure you're hitting the right objects, handling errors, etc. Now you can easily manipulate a huge block of objects in a single go.

##### Serverless Data API

##### Preview of Aurora Serverless (PostgreSQL)

##### AppSync Pipeline Resolvers

##### [Lambda + Kinesis Data Streams Upgrades](https://aws.amazon.com/about-aws/whats-new/2018/11/aws-lambda-supports-kinesis-data-streams-enhanced-fan-out-and-http2/)

**What it is:** AWS Lambda can now use Kinesis Data Streams Enhanced Fan-Out, a faster implementation of consumers for [Amazon Kinesis](https://aws.amazon.com/kinesis/)

**Why it matters:** The Enhanced Fan-Out for Kinesis Data Streams greatly increases the performance of Kinesis Data Streams. You can read up to 2MB per second per shard on your Kinesis Data Stream. Further, you can have multiple, independent consumers with the Enhanced Fan-Out that helps you get around the limitations of previous Kinesis consumers.

This is a huge step forward for fans of stream-based processing with AWS Lambda.

#### [Python 3.7 for Lambda](https://aws.amazon.com/about-aws/whats-new/2018/11/aws-lambda-supports-python-37/)

**What it is:** AWS Lambda now supports the Python3.7 runtime.

**Why it matters:** You get all the latest Python features with your Lambdas! The most exciting addition to Python3.7 is likely [dataclasses](https://docs.python.org/3/library/dataclasses.html) -- a much simpler way to define classes.

**How do I use it:** You can use Python3.7 in the Serverless Framework by setting `runtime: python3.7`. The built-in `aws-python3` template will use Python3.7 in the [next release of the Framework](https://github.com/serverless/serverless/pull/5505).
