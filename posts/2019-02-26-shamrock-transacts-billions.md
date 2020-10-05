---
title: "How Shamrock transacts billions of dollars with Serverless Framework Enterprise"
description: "See how Shamrock’s serverless invoicing system handles billions of dollars of transactions with no active scaling required. Plus: their multi-cloud approach with AWS and Google."
date: 2019-02-26
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/shamrock-story/shamrock-serverless-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/shamrock-story/shamrock-serverless-header.png"
category:
  - user-stories
authors:
  - AndreaPasswater
---

See how Shamrock’s serverless invoicing system handles billions of dollars of transactions with no active scaling required. Plus: their multi-cloud approach with AWS and Google.

Shamrock Trading Corporation began in 1986 as a small freight brokerage that served agricultural and commodity shippers. But as their industry changed, they got bullish on new technologies and were unafraid to keep innovating.

Today, they are a high-tech shop with over 750 employees that manages software, financial services, and large-scale transportation logistics. They create the software that handles trucking fleets as well as the mobile applications that drivers use on the go to find nearby gas stations. They have a check depositing image upload/recognition app that handles billions of dollars in transactions a year.

And all those services are serverless.

Read on to see how Shamrock uses serverless to create massively scalable and performant software—at a tenth of their former Docker cost.

#### The invoicing app that handles billions

Shamrock has been running their invoice management software for four years, and it was originally built as a Docker container running in GKC. But as their usership increased, it got increasingly painful to manage, and would frequently go down during peak traffic on Fridays.

Two years ago, CTO Tim Bachta had been looking into serverless, and decided to give it a try. The team moved their Docker app over to a serverless workload using the Serverless Framework and AWS Lambda.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/shamrock-story/Shamrock-Serverless-Architecture.png">

A website running in S3 hits AWS API Gateway, all powered by a Lambda backend and deployed with the Serverless Framework. The software does image recognition (to e.g. detect duplicate checks, or adjust for size, shape, and color), scales them, bunches them into a PDF, and sends them to a commercial system for processing.

Their new architecture was recently put to the test when they got a 30% usage spike in a single day after Thanksgiving, setting an all-time record for traffic. The engineering team didn’t have to touch anything: no adding memory or provisioning more resources. The app just auto-scaled.

The engineering team is relieved to have a system that they don’t have to babysit every day. Their business team has been ecstatic about the new system, and how much happier customers are with its performance.

> We gained the respect of the business teams with this app, and now they want more. With serverless, we can turn around fast with good quality. If you do things right in serverless, it forces good quality and scales immensely.

_—Tim Bachta, CTO_

Their cost for all this? \$3,000 a month, 10x less than their previous Docker cost with less to manage and no active scaling required.

Because of its success, the Shamrock engineering team is actively converting more legacy applications over to serverless and building new internal tools to automate more of the business team’s workflow: an internal staff tool to audit paperwork, for example.

##### The migration process from Docker to Serverless

They took their old Node.js code from Docker and moved it over to the Serverless Framework over the course of six months. The migration was quick and straightforward, which CTO Tim Bachta attributes largely to the Serverless Framework.

> Devs were able to focus on developing out what was needed. They could just code.

_—Tim Bachta, CTO_

Their serverless invoicing application currently has about 100 services total, and is able to be managed by a 10-person engineering team.

For their migration, they leveraged Serverless Framework Enterprise to help streamline their serverless operations and scale development through training, additional tooling, our dashboard, and enterprise support.

#### Multi-cloud: AWS cloud + Google services

The Shamrock engineering team is doing something many engineering teams are beginning to do—leveraging the best-in-class services from all over the cloud, combining services from different providers together in a single application.

In order to build their invoicing application, they relied on AWS for infrastructure (Lambda, API Gateway), but wanted to use Google’s AI and image recognition services.

But that’s not the only advantage they see to a serverless multi-cloud approach. They have multi-region set up in AWS, but being on multiple providers gives them even more robust failover.

Plus, with the Serverless Framework, they can easily deploy to other clouds without having to learn new tooling. This function goes to AWS, this one goes to Google; it doesn’t matter because all the infrastructure is code.

#### DevOps, and the impact on engineering culture

CTO Tim Bachta admits that adopting a serverless and event-driven mindset can be a culture shift, but ultimately one that comes with a lot of upsides.

His teams have autonomy to work on things they feel will drive productivity or business value, and at the end of the day, whoever built it is responsible for it.

> You wanna solve it you build it. You build it you run it. You run it you own it. Everybody’s a builder.

_—Tim Bachta, CTO_

##### CI/CD with Serverless

The Shamrock team has 200 serverless functions in production, with a lot of shared components. Everything is run in a CD environment, meaning each piece of code, regardless of which team built it, is everybody’s code.

Can this introduce complications when someone makes a code change? Sure. So the engineering team places a lot of emphasis on code reviews across all teams. When new functionality gets built, teams do active demos to talk about how it works.

They run their CI with Jenkins (with plans to move over to GitHub actions soon), and ship everything as manually-managed blue/green deployments (with plans for canary deployments once there’s more control over them).

Overall, the engineering culture at Shamrock is one with a high level of ownership.

> I want everybody to test their code, and not just on their computer. I want them to support their code when something goes wrong. But we empower our developers through serverless. With empowerment comes responsibility.

_—Tim Bachta, CTO_

#### Challenges along the way

##### Thinking small, not monolithic

The Shamrock team, like many newly-serverless teams, took a bit to get used to thinking of everything in terms of events. In a serverless paradigm, developers have to learn to focus on building a function for each piece of functionality, instead of building out a monolithic piece of code.

It’s essentially a shift toward thinking in terms of specific, single units: microservices.

##### Data manipulation

Much of the data that the system needed to interact with was in databases tucked away in VPCs. So Shamrock’s developers had to run Lambda functions inside VPCs and against traditional databases, which came with some obstacles.

For example: dealing with VPC based cold-starts (an issue soon to improve according to AWS!), and understanding how to create and maintain database connections across invocations, as well as deal with traditional database connection limits without connection pooling type tools at their disposal like a traditional server-based environment.

#### Shamrock engineering: the future is serverless

Overall, CTO Tim Bachta is incredibly impressed with the way serverless, and the Serverless Framework, has empowered his team to take more ownership over their own projects, and ship new features at record speed and cost.

They’ve managed to migrate a legacy Docker application over to AWS Lambda using the Serverless Framework quickly and painlessly, and now have an active piece of infrastructure that handles billions of dollars in a transactions a year with no active management or scaling required. They’re in the process of migrating more and more legacy infrastructure over to serverless, while simultaneously feeling empowered to create tooling used across the organization that can increase everyone’s productivity, from the engineering teams to the business department.

Most of all, Bachta is floored with how easy Serverless makes it to ship software and keep innovating.

> I’ve been doing this for 20+ years, and I can think back to two years ago what it used to take to build a new feature. I need this VM, I need this provisioned, etc. And now, it’s as easy as—I need this Lambda to be connected to this API, go. The ability for developers to test and experiment and get stuff out there is huge.

_—Tim Bachta, CTO_

#### Try Serverless Framework Enterprise

If you are thinking of moving onto the cloud, we're here to help you with serverless-specific tooling and dedicated support.

[Talk to us about Serverless Framework Enterprise](https://serverless.com/enterprise/) to learn more!
