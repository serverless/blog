---
title: "The Serverless guide to AWS re:Invent 2017"
description: "Going to re:Invent 2017? Here's our suggested track for getting the most info on serverless and Lambda."
date: 2017-11-09
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/awsreinvent.jpg'
authors:
  - AndreaPasswater
---

What to expect and which sessions to sign up for.

# General re:Invent protips

Never been to re:Invent before? Here's what you're in for.

The venues are pretty spread out, so getting from one to the other can be time-consuming. Try to plan your day such that you stay in the same building if you can.

It's tempting to be ambitious and keep your days jam packed, but really, don't wear yourself out. Aim to hit 3-4 sessions a day. If you're familiar with serverless already, stick with the 300+ level classes. The 200s tend to be more basic. 

Remember that the biggest value you'll get out of re:Invent are the conversations you'll have there. So during the breaks, meet people! We really can't emphasize this one enough.

**Go to the keynotes.** This one's in bold for emphasis. All the cool announcements and launches at re:Invent are going to happen during the keynotes. You probably don't want to miss these.

We're predicting AWS will have some surprise Lambda updates to talk about. Perhaps more event sources? New language runtimes? Longer time-outs?!

# Serverless.com's re:Invent Happy Hour

Did we mention we're having our own happy hour? November 29th at the Rhumbar.

Drinks! Swag! Serverless! [RSVP to snag a spot](https://www.eventbrite.com/e/serverless-happy-hour-tickets-39623766753).

# Your recommended serverless track

Feel free to peruse a whole list of [serverless-forward re:Invent sessions](https://www.portal.reinvent.awsevents.com/connect/search.ww#loadSearch-searchPhrase=lambda&searchType=session&tc=0&sortBy=abbreviationSort&p=&i(10042)=10482&i(10042)=16545) in those handy search results.

Or! Our curated list is below.

## Advanced (300-400 level)

**ARC401 - Serverless Architectural Patterns and Best Practices** | Venetian<br>
Security best practices, operations, and nuances of serverless architectures. The session will also cover how to migrate server-full workloads over to serverless.

Includes: X-Ray, step functions, security automation using AWS Config, and CI/CD development pipelines.

**ARC316 - Getting from Here to There: A Journey from On-premises to Serverless Architecture** | Venetian<br>
How do you get from on-premise to cloud-native environments? They'll present migration strategies for different types of workloads.

Includes: API Gateway, Lambda, Cognito, SQS, SNS

**SRV302 - Building CI/CD Pipelines for Serverless Applications** | Aria<br>
Automate serverless application deployment! We get asked about CI/CD pipelines a lot, so here's your chance to learn 'em. This session is run by Chris Munns and Ben Kehoe—both big names in serverless. 

Includes: CodePipeline, CodeBuild, CodeStar, best practices straight from iRobot

**SRV330 - Workshop: Serverless DevOps to the Rescue** | Aria<br>
As was said over and over at ServerlessConf, it's not #NoOps, but rather #DiffOps. Learn what that means in this workshop. 

You'll join the DevOps team for a popular ride-sharing application. Build, test and deploy changes to their serverless app.

Includes: X-Ray, CodePipeline, CodeBuild, CI/CD pipelines

**SRV310 - Designing Microservices with Serverless** | Aria<br>
How do you deploy and manage microservices in a serverless paradigm? Here are some things to consider around code structure, how they communicate with their dependencies, and more.

Includes: National Geographic presenting on their own serverless microservices architecture

**SRV313 - Building Resilient, Multi-Region Serverless Applications** | Aria<br>
While serverless is already high availability, you can go one step further with multi-region. Here are some different options for active/active and active/passive setups.

Includes: API Gateway, Lambda

**SRV331 - Workshop: Build a Multi-Region Serverless Application for Resilience and High Availability** | Aria<br>
Or try the workshop version! You'll become a developer at a ridesharing company, and work to design a highly-available user reporting feature.

Includes: API Gateway, DynamoDB, Route 53, CloudFront, S3

**SRV306 - State Machines in the Wild! How Customers use AWS Step Functions** | Aria<br>
Shameless plug: Coca-cola uses the [Serverless Framework](https://serverless.com/framework/). Patrick Brandt will go over how they created a customer loyalty program with Step Functions. The session explores all kinds of neat things that you can do with state machines.

Includes: Step Functions, operations automation, state management

**SRV425 - Serverless OAuth: Authorizing 3rd-party Applications to your Serverless API** | Aria<br>
Build a serverless web app with a heavy focus on security controls and best practices. The session will further help you integrate social media sign-in to create a universal user directory. Learn more about identity management, role-based access, and more.

Includes: API Gateway, Lambda, DynamoDB

## Introductory (200 level)

**SRV212 - Build a Scalable Serverless Web Application on AWS That Can Span Millions of Concurrent Users** | Aria<br>
This session is clearly based off the [Australian census problem](https://serverless.com/blog/building-a-better-australian-census-site/). 😉 You'll learn how to build a highly-available, low latency website that can handle a country-wide public poll.

Includes: Lambda, API Gateway, S3, DynamoDB

**SRV213 - Thirty Serverless Architectures in 30 Minutes** | Aria<br>
Use Lambda to build slack bots, automate testing, and more. They'll cover basics on deploying, monitoring and profiling serverless applications.

Includes: Lambda, API Gateway, fun serverless projects

**SRV210 - Improving Microservice and Serverless Observability with Monitoring Data** | Aria<br>
Synthesize best practices around metrics, logs, and observability. Learn how to troubleshoot applications and serverless infrastructure.

**CMP211 - Getting Started with Serverless Architectures** | Venetian<br>
Curious about what serverless can do for you? Learn about their benefits in handling APIs, data processing, and website backends.

Includes: Lambda, API Gateway, Step Functions

**CTD201 - Introduction to Amazon CloudFront and AWS Lambda@Edge** | Venetian<br>
Learn how to accelerate delivery of websites, APIs, and streamed media content. Lambda@Edge is a serverless service that lets you customize content delivery through CloudFront.

Includes: Lambda@Edge, CloudFront, CDN strategy

# And finally...

Don't forget to keep your eye on those afterparties and happy hours.

Here's a [pretty good unofficial list of re:Invent happenings](http://reinventparties.com/).

Have fun out there. ⚡️
