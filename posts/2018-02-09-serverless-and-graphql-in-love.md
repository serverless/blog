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

Over the last four years, I have been exploring and learning about the world of Big Data to build real time and batch systems at scale (please don't roll eyes, I am allowed to use some buzz words in my first blog :). 
I have been mainly involved in building products with serverless architectures for the last couple of months, here at Glassdoor. Here are few questions on everyone's mind - 

1) How can we build low latency APIs to server these complex, high dimensional and big datasets which can scale on demand?
2) Is there a way for frontend and backend teams to collaborate more smoothly?
3) Can we fire single query which can construct a nested response from multiple resources?
4) Is there an easy way to secure the endpoint, paginate through the data, aggregate the results at scale and what not? 
5) Can we pay per query execution rather than running fleet of servers?

I’m going to start this off with a statement of truth, to all my fellow engineers: The way we currently build APIs, where all of them are split up and maintained separately, isn’t optimal.
Luckily for us, the tech horizon is ever-expanding. We have options. And we should use them.

> “Engineers like to solve problems. If there are no problems handily available, they will create their own problems.” - Scott Adams

I am sure you have heard it before and in fact, might be unknowingly creating more problems than solutions.  

This blog aims to explore a beautiful relationship between Serverless and GraphQL and why they fit together. I’ll go over the advantages and disadvantages of both, which one would work best for your application, and what you should consider before making the switch.
Perhaps most importantly, I’ll also share some info about how you can get on board with your devious, streamlining plans.

## What is GraphQL ?

[2017 was the year of GraphQL](https://dev-blog.apollodata.com/2017-the-year-in-graphql-124a050d04c6).

The answer to having fewer API endpoints to manage is to (drumroll!) ...have fewer API endpoints. GraphQL lets you shrink your multitude of APIs down into a single HTTP endpoint.
The concept isn’t new; GraphQL has been helping people do this for a while now. If you want to explore differences between GraphQL and REST, I will recommend reading [Sashko's](https://twitter.com/stubailo) blogpost on [GraphQL vs REST](https://dev-blog.apollodata.com/graphql-vs-rest-5d425123e34b)

GraphQL provides a simple and elegant way of building mobile and web applications by providing a clean layer of abstraction between servers and clients. 

1. A single endpoint can be used to fetch data from multiple data sources resulting in reduced network costs and better query efficiency.
2. Know exactly what your response will look like. Ensure you're never sending more or less than the client needs.
3. Describe your API with types that map your schema to existing backend.

Thousands of companies are now using GraphQL in production with the help of open source frameworks built by [Facebook](http://graphql.org/), [Apollo](https://github.com/apollographql), and [Graphcool](https://blog.graph.cool/introducing-prisma-1ff423fd629e). In fact, Starbucks [announcement](https://twitter.com/davidbrunelle/status/960946257643454464) last week is going to make my morning coffee taste even better :D 

![alt text](https://user-images.githubusercontent.com/1587005/36030260-52aa804e-0d5b-11e8-8bed-bd5ce9481075.png "Danielle's slide from Serverless and GraphQL meetup at Glassdoor, Jan 29 2018")

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

> **Note:** I’m going to focus on AWS Lambda below, but know that you can use any serverless provider (Microsoft Azure, Google Cloud Functions, etc) with GraphQL.

## Why Serverless and GraphQL are such a great fit ?

When moving to GraphQL, you suddenly rely on one HTTP endpoint to connect your clients to your backend services. Once you do decide to do that you want this one HTTP endpoint to be:

1. auto-scaling
2. reliable
3. fast
4. has a small attack vector regarding security

> All these properties are full-filled by a single AWS Lambda function in combination with API Gateway. It’s just a great fit! 

In sum, powering your GraphQL endpoint with a serverless backend solves scaling and availability concerns outright, and it gives you a big leg up on security. It’s not even much code nor configuration. It takes only a few minutes to get to a production ready setup.

I will recommend you to read [Jared's](https://twitter.com/ShortJared) [post](https://www.trek10.com/blog/a-look-at-serverless-graphql/) to get a better understanding of this relationship ;)

## Serverless-Graphql repository

It’s pretty straightforward to get your HTTP endpoint up and running.

I am happy to announce our Open Source Initiatives with [nikgraf](https://twitter.com/nikgraf) in [Serverless and GraphQL Repository](https://github.com/serverless/serverless-graphql). There, I walk through all the steps in detail. Go check it out!

![alt text](https://user-images.githubusercontent.com/1587005/36035218-1c06763c-0d6b-11e8-996b-996243b0975f.png)

Repository comes in two flavor —

1. API Gateway and Lambda Backend 

 - API Gateway handles HTTP requests and responses and invokes the Lambda function in response to HTTP requests. 
 - You manage GraphQL server in AWS Lambda using [apollo-server-lambda](https://www.npmjs.com/package/apollo-server-lambda) 
 - Lambda function retrieves data from DynamoDB, [REST backend](https://developer.twitter.com/en/docs), or RDS and returns it to the client via API Gateway.

**Note:** We are currently working on adding more backend integrations including GraphCool Prisma, Druid, MongoDB, AWS Nepture etc.

2. AppSync Backend 

 - AppSync GraphQL Proxy server handles HTTP requests and responses fully managed by AWS.
 - It uses [VTL](http://velocity.apache.org/engine/1.7/vtl-reference.html) under the hood to transform GraphQL request and response.
 - Built-in integrations with DynamoDB, Elastic Search and AWS Lambda. 

> Overall, there isn’t much code nor configuration required. You can get this to a production-ready setup in a few minutes. 

**Note:** In this blog, I am going to explore creating GraphQL endpoints using API Gateway and Lambda Backend. Next blog will be dedicated to creating the same endpoints using AWS Appsync.

*Step 1: Configure Serverless Template*

At this point, I am going to introduce you to [Serverless Framework](https://serverless.com/) to make your life easy by providing configurations. You’ll specify in your `serverless.yml` that you are setting up a GraphQL HTTP endpoint:

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

*Step 2: Configure Lambda Function (Apollo-Server-Lambda)*


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

**Note:**: Please import GraphQL Schema and Resolvers after Step 3 and 4.

*Step 3: Create GraphQL Schema*

Checkout out the complete [sample schema](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/schema.js) to build a Mini Twitter App. For this blog, I am going to focus on subset of the schema to keep things simple.

```yml
type Query {
	getUserInfo(handle: String!): User!
}

type Tweet {
	tweet_id: String!
	tweet: String!
	handle: String!
	created_at: String!
}

type TweetConnection {
	items: [Tweet!]!
	nextToken: String
}

type User {
	name: String!
	description: String!
	followers_count: Int!
	tweets(limit: Int!, nextToken: String): TweetConnection
}

schema {
	query: Query
}
```

*Step 4: Create GraphQL Resolvers*

Now lets dive deep into how lambda retrieves data from DynamoDB, RDS and Rest Backend. We will take an example of getUserInfo which takes user twitter handle as an input and returns user info and list of tweets.

DynamoDB backend: 
-----------------

1. Data Modeling and Table Creation

We will create two tables (Users and Tweets) to store user and tweet info respectively and GSI on Tweets table.

**Table**: _User_  
**HashKey**: _handle_  
**Attributes**: _name_, _description_, _followers_count_  

**Table**: _Tweets_  
**HashKey**: _tweet_id_  
**Attributes**: _tweet_, _handle_, _created_at_  
**Index**: _tweet-index_ _(hashKey: handle, sortKey: created_at)_

Please find the complete schema [here](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/serverless.yml)

2. Mock Fake Data using [Faker](https://www.npmjs.com/package/faker). You can find the scripts [here](https://github.com/serverless/serverless-graphql/tree/master/app-backend/dynamodb/seed-data)

3. Make sure your IAM Roles are set properly in `serverless.yml` for Lambda to access DynamoDB.

```yml
iamRoleStatements:
- Effect: Allow
  Action:
    - dynamodb:Query
    - dynamodb:Scan
    - dynamodb:GetItem
    - dynamodb:BatchGetItem
    - dynamodb:PutItem
    - dynamodb:UpdateItem
    - dynamodb:DeleteItem
  Resource: "arn:aws:dynamodb:<awsRegion>:*:table/<tableName>"
```

4. Create GraphQL Resolver for `getUserInfo` to retrieve data from DynamoDB. Let's break down the code you see [here](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/resolvers.js)

First of all, I am going to tell my resolvers how to resolve `getUserInfo` and `tweets`

```
export const resolvers = {
  Query: {
    getUserInfo: (root, args) => getUserInfo(args),
  },
  User: {
    tweets: (obj, args) => getPaginatedTweets(obj.handle, args),
  },
};
```
```
  getPaginatedTweets(handle, args) {
    return promisify(callback => {
      const params = {
        TableName: 'Tweets',
        KeyConditionExpression: 'handle = :v1',
        ExpressionAttributeValues: {
          ':v1': handle,
        },
        IndexName: 'tweet-index',
        Limit: args.limit,
        ScanIndexForward: false,
      };

      if (args.nextToken) {
        params.ExclusiveStartKey = {
          tweet_id: args.nextToken.tweet_id,
          created_at: args.nextToken.created_at,
          handle: handle,
        };
      }

      docClient.query(params, callback);
    })       
    //then parse the result  
  },
```  
  ```
  getUserInfo(args) {
    return promisify(callback =>
      const params = {
        TableName: 'Users',
        KeyConditionExpression: 'handle = :v1',
        ExpressionAttributeValues: {
          ':v1': args.handle,
        },
      };
          
      docClient.query(params, callback);
    })       
    //then parse the result  
  },
```

5. What is the end result? GraphQL Endpoint. Let's test it out.

*Clone Git Repo and Install Dependencies*

```
git clone https://github.com/serverless/serverless-graphql.git

cd app-backend/dynamodb
yarn install
```

To test GraphQL locally on your system, you can use [Serverless Offline](https://github.com/dherault/serverless-offline), [Serverless Webpack](https://github.com/serverless-heaven/serverless-webpack) and [Serverless DynamoDB Local](https://github.com/99xt/serverless-dynamodb-local)

Make sure your `serverless.yml` is configured to setup dynamodb on local
```yml
custom:
  serverless-offline:
    port: 4000
  webpackIncludeModules: true
  dynamodb:
    start:
      port: 8000
      inMemory: true
      migrate: true
      seed: true
    seed:
      test:
        sources:
          - table: Users
            sources: [seed-data/Users.json]
          - table: Tweets
            sources: [seed-data/Tweets.json]
```

```
cd app-backend/dynamodb
yarn start
```

DynamoDB is now available on local `http://localhost:8000/shell`

![!test](https://user-images.githubusercontent.com/1587005/36065162-b4ad3c14-0e4b-11e8-8776-e19596546ce1.gif)


**Note:** We also have a previous post on [making a serverless GraphQL API](https://serverless.com/blog/make-serverless-graphql-api-using-lambda-dynamodb/), which covers the process in more detail.

End result? A GraphQL endpoint that reliably scales!

The [example app](https://github.com/serverless/serverless-graphql) has the full walkthrough; give it a try and let me know what you think.

## Client Integrations (Apollo ReactJS, Netlify and S3)

```yml
const client = new ApolloClient({
  link: new HttpLink({ uri: process.env.REACT_APP_GRAPHQL_ENDPOINT }),
  cache: new InMemoryCache(),
});

```
## Performance Analysis (X-Ray)

## Special Thanks!

## Selling GraphQL in your Organization

> When using new tech, always a discussion of “do we want this, or not?” 

Ready to switch everything over, but not sure about how to convince the backend team? Well, here’s how I’ve seen this play out several times, with success.

First, the frontend team would wrap their existing REST APIs in a serverless GraphQL endpoint. It added some latency, but they were able to experiment with product changes way faster and could fetch only what was needed.

Then, they would use this superior workflow to gain even more buy-in. They would back up this buy-in by showing the backend team that nothing had broken so far.

Now I’m not *saying* you should do that, but also, if you wanted to, there it is for your consideration. My lips are sealed.

## What next?

Siddharth Gupta
*Lead Data Engineer, Glassdoor*

[Github](https://github.com/sid88in) | [LinkedIn](https://www.linkedin.com/in/sid88in/) | [Twitter](https://twitter.com/sidg_sid))
