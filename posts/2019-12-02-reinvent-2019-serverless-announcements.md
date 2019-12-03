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
 * [Pre-Invent Lambda Updates](#pre-invent-lambda-updates)
 * [Eventbridge Schema Registry](#eventbridge-schema-registry)

**Most Exciting:**

As the announcements are made, we will be adding ones with the most Serverless impact here in order of excitement.

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