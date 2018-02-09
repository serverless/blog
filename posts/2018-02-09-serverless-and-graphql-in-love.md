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
I have been particularly involved in building Serverless Architectures over the last couple of months, here at Glassdoor. Few questions on everyone's mind  - 

1) How can we build low latency API's to server these complex, high dimensional and big datasets which can scale on demand?
2) Is there a way for frontend and backend teams to collaborate more smoothly?
3) Can we fire single query which can construct a nested response with multiple resources?
4) Is there an easy way to secure the endpoint, paginate through the data, aggregate the results at scale and what not? 
5) Can we pay per query execution?

I’m going to start this off with a statement of truth, to all my fellow engineers: The way we currently do APIs, where all of them are split up and maintained separately, isn’t optimal.
Luckily for us, the tech horizon is ever-expanding. We have options. And we should use them.

“Engineers like to solve problems. If there are no problems handily available, they will create their own problems.” - Scott Adams

I am sure you have heard it before and in fact creating more problems than solutions.  

This blog aims to explore this beautiful relationship between Serverless and GraphQL and why they fit together. I’ll go over the advantages and disadvantages of both, which one would work best for your application, and what you should consider before making the switch.
Perhaps most importantly, I’ll also share some info about how you can get on board with your devious, streamlining plans.

## What is GraphQL ?

The answer to having fewer API endpoints to manage is to (drumroll!) ...have fewer API endpoints. GraphQL lets you shrink your multitude of APIs down into a single HTTP endpoint.
The concept isn’t new; GraphQL has been helping people do this for a while now. [Recommend reading](https://dev-blog.apollodata.com/graphql-vs-rest-5d425123e34b)

GraphQL provides a simple and elegant way of building mobile and web applications by providing a clean layer of abstraction between servers and clients. 

1. A single endpoint can be used to fetch data from multiple data sources resulting in reduced network costs and better query efficiency.
2. Know exactly what your response will look like. Ensure you're never sending more or less than the client needs.
3. Describe your api with types that map your schema to existing backend.

Thousands of companies are now using GraphQL in production with the help of open source frameworks built by Facebook, Apollo, and Graphcool.

![alt text](https://user-images.githubusercontent.com/1587005/36030260-52aa804e-0d5b-11e8-8bed-bd5ce9481075.png "Danielle slide from meetup- shoutout")

Now, very reasonably, you are probably thinking, “Yeah, okay, Facebook is one thing; they have a giant engineering team. But for me, having only one API endpoint is too risky. What if it goes down? How do I handle that much load? What about security?”
You are absolutely correct: with one HTTP endpoint, you need be completely sure that endpoint never goes down. You need to be completely sure that it scales.
That’s where serverless comes in.

## What is Serverless ?

**Note:** I’m going to focus on AWS Lambda below, but know that you can use any serverless provider (Microsoft Azure, Google Cloud Functions, etc) with GraphQL.

## Why Serverless and GraphQL are such a great fit ?

With Lambda and API Gateway, you can set up a GraphQL HTTP endpoint that is:
- auto-scaling
- reliable
- fast
- has a small attack vector in terms of security

In sum, powering your GraphQL endpoint with a serverless backend solves scaling and availability concerns outright, and it gives you a big leg up on security.

## Serverless-Graphql repository

It’s actually pretty straightforward to get your HTTP endpoint up and running.

To illustrate how you would do this, I put a [GraphQL example app and starter kit](https://github.com/serverless/serverless-graphql) in the Serverless Framework example repo. There, I walk through all the steps in detail. Go check it out!

Overall, there really isn’t much code nor configuration required. You can get this to a production-ready setup in a few minutes.

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
