---
title: Better DevOps with AWS Lambda + API Gateway and the Serverless Framework
description: Guest author Nick den Engelsman writes about streamlining DevOps and why he and his team at BandLab decided on AWS Lambda + API Gateway and the Serverless Framework.
date: 2016-11-24
thumbnail: https://cloud.githubusercontent.com/assets/195404/19552825/d3b728ee-96b1-11e6-85e2-5fd4b8714514.png
category:
  - user-stories
authors:
  - NickDenEngelsman
---

Hi, I'm [Nick den Engelsman](https://twitter.com/nickengelsman). I’m a Full Stack Developer at [BandLab](https://www.bandlab.com) who specializes in orchestrating and automating highly available infrastructures.

In this post I'll share some lessons learned from optimizing DevOps and how that led my team and I to the Serverless Framework.

At the start of 2016, and for the previous five years, I worked as a Cloud Systems Engineer at a certified AWS Managed Service Program Partner in The Netherlands. Most of my tasks were to educate clients and migrate them to the AWS cloud. Their environments and applications needed to be highly available, scalable and fault tolerant.

In that role automation was key. Clients only needed to worry about pushing code and in return we would worry about keeping their infrastructure up-to-date, secure, patched, autoscaled, and in general meeting SLA’s. If you think about it, **that’s a lot of work!**

So streamlining our process was key.

#### Optimizing DevOps
--------

**Phase 1:**
--------

In order to stay [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) we adopted [AWS CloudFormation](https://aws.amazon.com/cloudformation/) early on. This worked for a while, but we were copying CloudFormation JSON templates and other resources back-and-forth between projects (Not DRY).

**Phase 2:**
--------

Since myself and a few others within the company had solid Ruby knowledge, we came up with the idea to create Ruby modules that would compile to CloudFormation JSON resources (similar to Python’s [Troposphere](https://github.com/cloudtools/troposphere)). Again this worked for a while but also ended up not being as DRY as we would’ve liked!

**Phase 3:**
--------

As time progressed, the company built-out the group of Ruby experts and we started an [R&D](https://en.wikipedia.org/wiki/Research_and_development) team whose only focus was the automation and building of components that could be re-used between clients and projects. We matured our Ruby modules and made them more and more intelligent in order do most of the configuration for us. It became its own “framework”!

#### Soooo, where does serverless come into play?

While still at the Dutch company we managed to set up a solid framework to automatically deploy/update/patch highly available infrastructures, which left us with only one thing we couldn’t change: Client applications!

There was only one thing we couldn’t change: **Client applications!**

Every new client needed to be educated. And migrating them to AWS in general was a long process. For the most part, the refactoring of their application code was needed in order to become [12-factor-ready](https://12factor.net/).

[AWS Lambda](https://aws.amazon.com/lambda/details/) lets you run code without provisioning or managing servers. You pay only for the compute time you consume — there is no charge when your code is not running.

When AWS first [introduced](https://www.youtube.com/watch?v=9eHoyUVo-yg) Lambda at re:Invent in 2014, I was a bit skeptical. Their example used S3 events. The triggering of image resizing with Lambda was awesome, but I didn’t see our clients adopting this anytime soon.

Internally we started sprinkling in custom [Lambda-Backed Custom Resources](https://aws.amazon.com/blogs/aws/aws-cloudformation-update-lambda-backed-custom-resources-more/) within CloudFormation stacks to fill-up missing gaps. This was when I started to realize how powerful Lambda actually is. We were able to automate a lot of use-cases and 3rd party applications/providers with the use of AWS Lambda.

![new_33b](https://cloud.githubusercontent.com/assets/20538501/20609535/82b4bbe2-b253-11e6-87b2-0cc4ac9cab6c.jpg)

#### Fast forward

I had begun to work on a passion-project of my own known as [Composr](https://www.composrapp.com) (later acquired by BandLab) which was fully EC2 - Ruby on Rails. I decided whilst funding my own project that it didn’t make sense to spend money on resources which could only be used occasionally, such as for testing and staging purposes.

As [AWS API Gateway](https://aws.amazon.com/api-gateway/) and AWS Lambda were maturing, I decided to invest my time in using these newer styles of computing, and prove that it is entirely possible to design complete applications without having to manage any servers.

The Serverless Framework seemed like the perfect fit to accomplish this goal! Noticing that it used CloudFormation from the start also gave me the assurance that deployments would be straight-forward and battle tested.

#### Today

>A creative, collaborative, global community of Musicians

[BandLab](https://www.bandlab.com) is where musicians and music fans from all over the world can come together to make, collaborate and share Music. The platform works on both iOS and Android. Everything users create is hosted in the cloud, so they can capture musical ideas wherever they are, then further develop them using BandLab’s web-based, MIDI-enabled app.

The Serverless Framework was easy to pick up within our team, even for developers without prior AWS knowledge.

After migrating the first few existing microservices towards a serverless setup, we were able to handle more events and background tasks in less time, which in return led to happier users on our platform (oh yeah, and less costs). We came to the conclusion that we wanted to push even further with this technology, to try and go serverless first.

The Serverless Framework has now become a core component within our organization. It allows us to define a standardized way of developing/deploying microservices, to release to market faster, and to keep our cost of ownership low.

In general, the Serverless Framework makes our work and life just a little bit happier :)

Today, [BandLab](https://www.bandlab.com) is running most if its AWS infrastructure without any self-managed servers (just a few EC2 instances left). Since we run less servers, we have less people to worry about maintenance, monitoring, patching, scaling alarms and the like (happy developers).

#### What's next

Curious where the [BandLab](https://www.bandlab.com) project is heading? Checkout our [blog](https://blog.bandlab.com/) or follow us on [Twitter](https://twitter.com/bandlab).
