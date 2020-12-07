---
title: Serverless is the ultimate place to experiment
description: "If all you want to do is play around and try stuff without worrying bills and costs, serverless is the place for you!"
date: 2020-07-06
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-express-thumbnail.png"
authors:
  - GarethMcCumskey
category:
  - guides-and-tutorials
---

As developers, we are used to being able to play around with dev stuff on our machines. Try a few things. Experiment
with new libraries and code. But when it comes to Serverless and things being deployed into the cloud, don't we need
to be more careful?

Nope! With just a few minor practices and a little knowledge, Serverless becomes an awesome playground so instead of
having to constantly read what others have done, we can instead just try something ourselves. And if we hit a road block,
or it doesn't go as intended, we can just start from scratch!

#### All hail the free tier

Due to the fact that AWS has the best performing Functions as a Service product, Lambda, as well as the most diverse
suite of managed services to use with your functions, it has become the defacto platform for building Serverless
applications. This has another advantage, however.

AWS provides a lot of permanent free tiers for many of the services that you would use when building a Serverless 
application. This means that you get a pretty generous amount of resources per month that last beyond the usual 1 year
limit. These include:
* Lambda: 1M free requests per month and 400,000 GB-seconds of compute time per month
* DynamoDB: 25 WCUs and 25 RCUs of provisioned capacity, 25 GB of data storage, 2.5 million stream read requests from 
DynamoDB Streams
* API Gateway: Only for 12 months but is so cheap after for development purposes may as well be free.

#### Stacks are ephemeral

One of the other advantages we have is that if correctly configured, our Serverless services we configure will deploy
into CloudFormation stacks that can be created and destroyed on a whim. If we build each service to be as autonomous as 
possible, it means we have no external dependencies we have to make sure are up and running first.

