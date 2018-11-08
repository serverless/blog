---
title: Beginning Serverless Framework V.1
description: 'How startups to large enterprises, are using serverless to develop and deploy serverless, event-driven architectures on AWS Lambda'
date: 2016-05-25
layout: Post
category:
  - user-stories
authors:
  - PhilippMuns
---

![building_version_1](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/05/building_version_1.gif) The goal of the [Serverless Framework](https://www.github.com/serverless/serverless) (formerly “JAWS”) is to help developers build and operate serverless architectures. In less than a year it has garnered almost 9,000 Github stars and hundreds of companies, from startups to large enterprises, are using it to develop and deploy serverless, event-driven architectures on AWS Lambda and AWS API Gateway.  Overall, it’s been an extraordinary ride. Meanwhile, the landscape is changing. AWS Lambda is improving and evolving. Other IaaS providers are introducing their own serverless offerings. As a result, best practices and the underlying definition of the “serverless architecture” is shifting. It’s time to recap our observations, acknowledge our key learnings, and begin work on a better, bolder Serverless Framework V.1.

## Functions Can Be Too Small

In the serverless architecture, functions are the unit of scale.  This provides useful isolation of your logic, leaving you in a very agile position when you are in production and you want to modify your application components individually, without affecting the entire system. The downside is when functions are also treated as the unit of development.  Every function requires its own scaffolding and code dependencies, which is a pain to manage.  Who wants to do `npm install yada-yada --save` or `npm update` 40 different times?  The focus on individual Lambdas has been the recommended practice.  We implemented it in V.0 of the Framework, but it hasn’t made our users as happy as they could be, and will be, in Version 1...

## Functions Hang Out In Groups

A common pattern we see is functions often appear in small groups.To group functions, people rely on the Framework’s ability to put related functions in subfolders and have them share one common set of code dependencies.  Functions often appear in groups because they have a common theme and as a result they may share resources, configuration, or code.  For example, functions that each perform a CRUD operation on a common resource (e.g., Users CRUD) or functions that are part of a workflow (e.g., save data, process data after save).  We’d like to make this experience better in Version 1, since this is natural behavior with clear usability gains.

## Flexible Code

The recommended practice for writing Lambda functions is to write your function code to perform a single job.  For example, creating a data record or resizing an image.  This allows for easy debugging since there is one expected result. But we often see people putting more logic in a Lambda function, and for valid reasons.  The first reason is they simply don’t want to manage several Lambda functions.  The second reason is they want to optimize the response time of their Lambda functions.  Lambda has a well-known cold-start issue and the more tasks a Lambda performs, the higher the likelihood that it will always be “warm” and execute more quickly. How people choose to containerize their code via Lambda is something we’d like to keep flexible in Version 1.

## Application/Project-level Thinking Is Broken

The serverless architecture on AWS Lambda is very much a Service/Microservice architecture, and we try to adhere to their principles and best practices.  However, by addressing our functions together as a “project” or “application” we fall into patterns that break the most important SOA/Microservices principle… service independence. What’s great about service independence is it means independence for the teams working on those services.  Whenever teams become reliant on each other, their progress can be blocked.  If we want to build complex serverless systems, and build them quickly, teams must remain independent. In the serverless architecture and the Framework, creating a single stack of resources (e.g., S3, DynamoDB, API Gateway REST APIs), at the project or application level, which all of the functions depend on, is the main blocking issue.  Whenever one team must wait for another team to update a CloudFormation stack, before their Lambda functions can have the resources they need, they can’t move forward. We got into this pattern largely because AWS API Gateway demands it.  A single API Gateway REST API is designed to sit in front of all Lambda functions in your application, forcing a single shared resource.  On top of that, API Gateway requires you create “deployments” of your REST API, to push your changes into production.  As an unintended consequence, a deployment blocks teams from pushing their own endpoints and potentially code to production. Generally, we’d like to move away from the concepts “project” and “application”.  In the serverless architecture, everything is a “service”, that is all.  With this new way of thinking, we're going to enable a lot of new interesting features and usability improvements in Version 1, which we'll write about soon.

## New Serverless Compute Services

Since the release of AWS Lambda other major IaaS providers have introduced similar services (Google CloudFunctions, Azure Functions, IBM OpenWhisk, etc.). All of them look interesting and similar to Lambda, but underneath the surface, they are quite different in very interesting ways. We’ve met all of the technical leaders of those respective services, and they each have a unique take as to how best to build a great Functions-as-a-Service platform. It’s our goal to provide a great developer experience, regardless of the infrastructure provider, so multi-provider support will be a central feature of Serverless Framework V.1.

## Doubling Down On Lambda

The new serverless offerings look incredible.  But, we absolutely cannot forget Lambda, the most mature and robust FaaS product around, and our original inspiration.  The majority of our anticipated changes in Version 1 are inspired by Lambda-based architectures first and foremote.  Lambda and its related services (e.g., CloudFormation) have been progressing wonderfully.  We will be incorporating all of that progress into the Lambda workflow for Version 1, offering a much better AWS Lambda experience.

## Wrapping Up

Serverless Framework Version 1 is currently being built [in the v.1 branch](https://github.com/serverless/serverless/tree/v1.0).  Above, are some hints as to the direction we're taking.  Progress is rapid and we expect to release an alpha in a few weeks.  If you'd like to contribute, [please check out our issues](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+milestone%3Av1.0).  If you have questions, [please email Flo](mailto:florian@severless.com), our CTO :)  The Serverless Team
