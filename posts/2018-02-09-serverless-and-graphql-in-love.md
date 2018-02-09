---
title: Serverless and GraphQL in Love
description: This blog explores beautiful relationship between Serverless and GraphQL.
date: 2018-02-09
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/graphql.jpeg
authors:
  - SiddharthGupta
---

![alt text](https://user-images.githubusercontent.com/1587005/36030132-d45feefe-0d5a-11e8-986c-92dad62f3408.png "Serverless and GraphQL family")

## Introduction

Over the last couple of years, I have been exploring and learning about the world of Big Data (please don't roll eyes, I am allowed to use some buzz words in my first blog :). 
I have been mainly involved in building products with Serverless Architectures over the last couple of months, here at Glassdoor. Given below are some questions on everyone's mind - 

1) How can we build low latency API's to server these complex, high dimensional and big datasets which can scale on demand?
2) Is there a way for frontend and backend teams to collaborate more smoothly?
3) Can we fire single query which can construct a nested response with multiple resources?
4) Is there an easy way to secure the endpoint, paginate through the data, aggregate the results at scale and what not? 
5) Can we pay per query execution?

I’m going to start this off with a statement of truth, to all my fellow engineers: The way we currently do APIs, where all of them are split up and maintained separately, isn’t optimal.
Luckily for us, the tech horizon is ever-expanding. We have options. And we should use them.

“Engineers like to solve problems. If there are no problems handily available, they will create their own problems.” - Scott Adams

I am sure you have heard it before and in fact, might be unknowingly creating more problems than solutions.  

This blog aims to explore this beautiful relationship between Serverless and GraphQL and why they fit together. I’ll go over the advantages and disadvantages of both, which one would work best for your application, and what you should consider before making the switch.
Perhaps most importantly, I’ll also share some info about how you can get on board with your devious, streamlining plans.

## What is GraphQL ?

The answer to having fewer API endpoints to manage is to (drumroll!) ...have fewer API endpoints. GraphQL lets you shrink your multitude of APIs down into a single HTTP endpoint.
The concept isn’t new; GraphQL has been helping people do this for a while now. [Recommend reading](https://dev-blog.apollodata.com/graphql-vs-rest-5d425123e34b)

GraphQL provides a simple and elegant way of building mobile and web applications by providing a clean layer of abstraction between servers and clients. 

1. A single endpoint can be used to fetch data from multiple data sources resulting in reduced network costs and better query efficiency.
2. Know exactly what your response will look like. Ensure you're never sending more or less than the client needs.
3. Describe your API with types that map your schema to existing backend.

Thousands of companies are now using GraphQL in production with the help of open source frameworks built by Facebook, Apollo, and Graphcool.

![alt text](https://user-images.githubusercontent.com/1587005/36030260-52aa804e-0d5b-11e8-8bed-bd5ce9481075.png "Danielle slide from meetup- shoutout")

Now, very reasonably, you are probably thinking, “Yeah, okay, Facebook is one thing; they have a giant engineering team. But for me, having only one API endpoint is too risky. What if it goes down? How do I handle that much load? What about security?”
You are absolutely correct: with one HTTP endpoint, you need be entirely sure that endpoint never goes down and that it scales on demand.

That’s where serverless comes in.

## What is Serverless ?

Serverless has gained popularity over last few years by allowing developers the flexibility to quickly build highly available and scalable applications with reduced cost and latency.
With Serverless comes the following:

1. No server management — No need to manage any form of machines
2. Pay per use — Pay per execution, never pay for idle.
3. Authentication and Authorization at Scale
4. Function as a unit of application logic

**Note:** I’m going to focus on AWS Lambda below, but know that you can use any serverless provider (Microsoft Azure, Google Cloud Functions, etc) with GraphQL.

## Why Serverless and GraphQL are such a great fit ?

When moving to GraphQL, you suddenly rely on one HTTP endpoint to connect your clients to your backend services. Once you do decide to do that you want this one HTTP endpoint to be:

1. auto-scaling
2. reliable
3. fast
4. has a small attack vector regarding security

All these properties are full-filled by a single AWS Lambda function in combination with API Gateway. It’s just a great fit! 

In sum, powering your GraphQL endpoint with a serverless backend solves scaling and availability concerns outright, and it gives you a big leg up on security. It’s not even much code nor configuration. It takes only a few minutes to get to a production ready setup.

## Serverless-Graphql repository

It’s pretty straightforward to get your HTTP endpoint up and running.

I am happy to announce our Open Source Initiatives with @nikgraf in [Serverless and GraphQL Repository](https://github.com/serverless/serverless-graphql). There, I walk through all the steps in detail. Go check it out!

Repository comes in two flavor —

1. API Gateway and Lambda Backend where you manage GraphQL server in AWS Lambda using Apollo-Server-Lambda and connect with DynamoDB, wrapper around REST API  and RDS (MySQL, Aurora, and Postgres) and many more integrations coming.
2. AppSync Backend where you don’t manage any GraphQL Server and use built-in integrations with DynamoDB, Elastic Search and a wrapper around REST API using AWS Lambda. 

Overall, there isn’t much code nor configuration required. You can get this to a production-ready setup in a few minutes. In this blog, I am going to explore creating GraphQL endpoints using API Gateway and Lambda Backend.
I am going to talk about Appysnc in my next blog.

Step 1: Configure Serverless Template

You’ll specify in your `serverless.yml` that you are setting up a GraphQL HTTP endpoint:

```yml

functions:
  graphql:
    handler: handler.graphqlHandler
    events:
    - http:
        path: graphql
        method: post
        cors: true
```

Step 2: Configure Lambda Function (Apollo-Server-Lambda)


And then set up the callback to Lambda in your `handler.js` file:

```
import { graphqlLambda, graphiqlLambda } from 'apollo-server-lambda';
import { makeExecutableSchema } from 'graphql-tools';
import { schema } from './schema';
import { resolvers } from './resolvers';

const myGraphQLSchema = makeExecutableSchema({
  typeDefs: schema,
  resolvers,
});

exports.graphqlHandler = function graphqlHandler(event, context, callback) {
  function callbackWithHeaders(error, output) {
    // eslint-disable-next-line no-param-reassign
    output.headers['Access-Control-Allow-Origin'] = '*';
    callback(error, output);
  }

  const handler = graphqlLambda({ schema: myGraphQLSchema });
  return handler(event, context, callbackWithHeaders);
};
```

End result? A GraphQL endpoint that reliably scales!

The [example app](https://github.com/serverless/serverless-graphql) has the full walkthrough; give it a try and let me know what you think.

**Note:** We also have a previous post on [making a serverless GraphQL API](https://serverless.com/blog/make-serverless-graphql-api-using-lambda-dynamodb/), which covers the process in more detail.

## Serverless Template and Plugins

## GraphQL Endpoints with AWS Lambda and API Gateway

## Selling GraphQL in your Organization

Ready to switch everything over, but not sure about how to convince the backend team? Well, here’s how I’ve seen this play out several times, with success.

First, the frontend team would wrap their existing REST APIs in a serverless GraphQL endpoint. It added some latency, but they were able to experiment with product changes way faster and had the ability to fetch only what was needed.

Then, they would use this superior workflow to gain even more buy-in. They would back up this buy-in by showing the backend team that nothing had broken so far.

Now I’m not *saying* you should do that, but also, if you wanted to, there it is for your consideration. My lips are sealed.

## Query GraphQL Schema (Graphcool or GraphiQL)

## BackEnd Integration (DynamoDB, REST API and RDS)

## Client Integrations (Apollo ReactJS, Netlify and S3)

## Big Picture

## Performance Analysis (X-Ray)

## Special Thanks!

## Coming Soon


When using new tech, always a discussion of “do we want this, or not?”
Frontend devs are excited about graphql, but backend teams aren’t. They don’t like thinking about new systems to maintain.

What we’ve seen in the last two years is, that frontend teams build a graphql endpoint, demonstrate how this allows them to build product faster and more flexibly, and by using graphql and a lambda api gateway endpoint, you basically get this reliability and autoscaling out of the box without troubling your backend team.

This works by wrapping the existing REST endpoint.


Siddharth Gupta
*Lead Data Engineer, Glassdoor*

[Github](https://github.com/sid88in) | [LinkedIn](https://www.linkedin.com/in/sid88in/) | [Twitter](https://twitter.com/sidg_sid))
