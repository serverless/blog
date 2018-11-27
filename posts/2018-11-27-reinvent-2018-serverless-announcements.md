---
title: "All the Serverless announcements at re:Invent 2018"
description: "Not at AWS re:Invent? That's ok; we're compiling all the most important serverless announcements and updates. Updating live all week."
date: 2018-11-27
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-header.gif'
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

##### Amplify Console

Amplify Console is a deployment & hosting platform for web apps with serverless backends.

##### Firecracker

Firecracker is a virtual machine manager that hosts Lambda and Fargate. Not directly relevant but interesting to see AWS open-sourcing some of the cool tech behind Lambda.

##### S3 Batch Operations (preview)

With S3 batch operations, you can operate on a bunch of existing S3 objects, including sending to Lambda.

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
