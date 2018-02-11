---
title: Serverless and GraphQL in Love  
description: This blog explores a beautiful relationship between Serverless and GraphQL.  
date: 2018-02-09  
layout: Post  
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/graphql.jpeg  
authors:  
  - SiddharthGupta
---

![alt text](https://user-images.githubusercontent.com/1587005/36030132-d45feefe-0d5a-11e8-986c-92dad62f3408.png "Serverless and GraphQL family")

## Introduction

Over the last four years, I have been exploring and learning about the world of big data to build real-time and batch systems at scale (please don't roll eyes, I am allowed to use some buzz words in my first blog :). 
I have been mainly involved in building products with serverless architectures for the last couple of months, here at Glassdoor. Here are few questions on everyone's mind - 

1) How can we build low latency APIs to server these complex, high dimensional and big datasets which can scale on demand?
3) Can we fire single query which can construct a nested response from multiple data sources?
4) Is there an easy way to secure the endpoint, paginate through the data, aggregate the results at scale and what not? 
5) Can we pay per query execution rather than running fleet of servers?

I’m going to start this off with a statement of truth, to all my fellow engineers: The way we currently build APIs, where all of them are split up and maintained separately, isn’t optimal.
Luckily for us, the tech horizon is ever-expanding. We have options. And we should use them.

> “Engineers like to solve problems. If there are no problems handily available, they will create their own problems.” - Scott Adams

I am sure you have heard it before and in fact, might be unknowingly creating more problems than solutions.  

This blog aims to explore a beautiful relationship between Serverless and GraphQL and why they fit together. I’ll go over steps to create Serverless GraphQL endpoints using DynamoDB, RDS and wrap it around REST API.

## What is GraphQL?

[2017 was the year of GraphQL](https://dev-blog.apollodata.com/2017-the-year-in-graphql-124a050d04c6).

The answer to having fewer API endpoints to manage is to (drumroll!) ...have fewer API endpoints. GraphQL lets you shrink your multitude of APIs down into a single HTTP endpoint.
The concept isn’t new; GraphQL has been helping people do this for a while now. If you want to explore more differences between GraphQL and REST, you can read [Sashko's](https://twitter.com/stubailo) blog post on [GraphQL vs. REST](https://dev-blog.apollodata.com/graphql-vs-rest-5d425123e34b).

GraphQL provides a simple and elegant way of building mobile and web applications by providing a clean layer of abstraction between servers and clients. 

1. A single endpoint can be used to fetch data from multiple data sources resulting in reduced network costs and better query efficiency.
2. Know exactly what your response will look like. Ensure you're never sending more or less than the client needs.
3. Describe your API with types that map your schema to existing backend.

Thousands of companies are now using GraphQL in production with the help of open source frameworks built by [Facebook](http://graphql.org/), [Apollo](https://github.com/apollographql), and [Graphcool](https://blog.graph.cool/introducing-prisma-1ff423fd629e). In fact, Starbucks [announcement](https://twitter.com/davidbrunelle/status/960946257643454464) last week is going to make my morning coffee taste even better :D 

![alt text](https://user-images.githubusercontent.com/1587005/36067514-503a05b4-0e73-11e8-9b40-946c5398f4b5.png "Danielle's slide from Serverless and GraphQL meetup at Glassdoor, Jan 29, 2018")

Now, very reasonably, you are probably thinking, “Yeah, okay, Facebook is one thing; they have a giant engineering team. But for me, having only one API endpoint is too risky. What if it goes down? How do I handle that much load? What about security?”
You are absolutely correct: with one HTTP endpoint, you need be entirely sure that endpoint never goes down and that it scales on demand.

That’s where serverless comes in.

## What is Serverless?

Serverless has gained popularity over last few years by allowing developers the flexibility to quickly build highly available and scalable applications with reduced cost and latency.
With Serverless comes the following:

1. No server management — No need to manage any form of machines
2. Pay per use — Pay per execution, never pay for idle.
3. Authentication and Authorization at Scale
4. Function as a unit of application logic

> **Note:** I’m going to focus on AWS Lambda below, but know that you can use any serverless provider (Microsoft Azure, Google Cloud Functions, etc) with GraphQL.

## Why Serverless and GraphQL are such a great fit?

When moving to GraphQL, you suddenly rely on one HTTP endpoint to connect your clients to your backend services. Once you do decide to do that you want this one HTTP endpoint to be:

1. auto-scaling
2. reliable
3. fast
4. has a small attack vector regarding security

> All these properties are full-filled by a single AWS Lambda function in combination with API Gateway. It’s just a great fit! 

In sum, powering your GraphQL endpoint with a serverless backend solves scaling and availability concerns outright, and it gives you a big leg up on security. It’s not even much code nor configuration. It takes only a few minutes to get to a production ready setup.

I will recommend you to read [Jared's](https://twitter.com/ShortJared) [post](https://www.trek10.com/blog/a-look-at-serverless-graphql/) to get a better understanding of this relationship ;)

## Serverless-GraphQL repository

It’s pretty straightforward to get your HTTP endpoint up and running.

I am happy to announce our Open Source Initiatives with [nikgraf](https://twitter.com/nikgraf) in [Serverless and GraphQL Repository](https://github.com/serverless/serverless-graphql). There, I walk through all the steps in detail. Go check it out!

![alt text](https://user-images.githubusercontent.com/1587005/36035218-1c06763c-0d6b-11e8-996b-996243b0975f.png "Serverless and GraphQL Architecture")

Repository comes in two flavor —

1. API Gateway and Lambda Backend 

 - API Gateway handles HTTP requests and responses and invokes the Lambda function in response to HTTP requests. 
 - You manage GraphQL server in AWS Lambda using [apollo-server-lambda](https://www.npmjs.com/package/apollo-server-lambda) 
 - Lambda function retrieves data from DynamoDB, [REST backend](https://developer.twitter.com/en/docs), or RDS and returns it to the client via API Gateway.

**Note:** We are currently working on adding more backend integrations including GraphCool Prisma, Druid, MongoDB, AWS Neptune, etc.

2. AppSync Backend 

 - AppSync GraphQL Proxy server handles HTTP requests and responses fully managed by AWS.
 - It uses [VTL](http://velocity.apache.org/engine/1.7/vtl-reference.html) under the hood to transform GraphQL request and response.
 - Built-in integrations with DynamoDB, Elastic Search, and AWS Lambda. 

> Overall, there isn’t much code nor configuration required. You can get this to a production-ready setup in a few minutes. 

**Note:** In this blog, I am going to explore creating GraphQL endpoints using API Gateway and Lambda Backend. I will dedicate my next blog to build the same endpoints using AWS Appsync.

## Let's create a Serverless GraphQL Endpoint

The [serverless-graphql](https://github.com/serverless/serverless-graphql) repo has the full walkthrough; give it a try and let me know what you think.

*Step 1: Configure Serverless Template*

At this point, I am going to introduce you to [Serverless Framework](https://serverless.com/) to quickly build and deploy your API resources. You’ll specify in your `serverless.yml` that you are setting up a GraphQL HTTP endpoint ([sample](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/serverless.yml#L34)).

```yml
functions:
  graphql:
    handler: handler.graphqlHandler
    events:
    - http:
        path: graphql
        method: post
```
Now any http post event on path `/graphql` will trigger `graphql` lambda function and will be handled by `graphqlHandler`.

*Step 2: Configure Lambda Function (Apollo-Server-Lambda)*

And then set up the callback to Lambda in your `handler.js` file ([sample](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/handler.js#L14))

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

Now, in your lambda function, GraphQL Schema and Resolvers will be imported ( as explained in next steps). Once API Gateway triggers an event, graphqlLambda function will then handled it, and the response is sent back to the client.

*Step 3: Create GraphQL Schema*

Checkout out the complete [sample schema](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/schema.js) to build a Mini Twitter App. For this blog, I am going to focus on a subset of the schema to keep things simple.

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
    topTweet: Tweet
    tweets(limit: Int!, nextToken: String): TweetConnection
}

schema {
    query: Query
}
```

*Step 4: Create GraphQL Resolvers*

Now let's dive deep into how lambda retrieves data from DynamoDB, RDS and REST backend. We will take an example of `getUserInfo` field which takes twitter handle as an input and returns user's personal and tweet info.

DynamoDB backend: 
-----------------

1. Data Modeling and Table Creation

We will create two tables (Users and Tweets) to store user and tweet info respectively and GSI on Tweets table to sort user tweets by timestamp. These resources will be created using `serverless.yml` [here](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/serverless.yml)

**Table**: _User_  
**HashKey**: _handle_  
**Attributes**: _name_, _description_, _followers_count_  

**Table**: _Tweets_  
**HashKey**: _tweet_id_  
**Attributes**: _tweet_, _handle_, _created_at_  
**Index**: _tweet-index_ _(hashKey: handle, sortKey: created_at)_

2. Mock fake data using [Faker](https://www.npmjs.com/package/faker). You can find the scripts [here](https://github.com/serverless/serverless-graphql/tree/master/app-backend/dynamodb/seed-data)

3. Make sure your [IAM Roles](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/serverless.yml#L130) are set properly in `serverless.yml` for Lambda to access DynamoDB.

4. Create GraphQL Resolver for `getUserInfo` to retrieve data from DynamoDB. Let's break down the code you see [here](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/resolvers.js)

First of all, I am going to define how `getUserInfo` and `tweets` fields will fetch the data.

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

Now, we will [query](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Query.html#Query.Pagination) DynamoDB table index `tweet-index`
to retrieve paginated tweets for a given user handle. Passing nextToken param implies paginating through the resultset (passed as ExclusiveStartKey).
If the result contains LastEvaluatedKey as shown [here](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/resolvers.js#L67) 
then return it as nextToken.

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
Similarily, for `getUserInfo` field you can retrieve the results as shown [here](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/resolvers.js#L78)

5. End result? **GraphQL endpoint** that reliably scales! Let's test it out on local and then deploy it on production.

*Clone Git Repo and Install Dependencies*

```
git clone https://github.com/serverless/serverless-graphql.git

cd app-backend/dynamodb
yarn install
```

To test GraphQL endpoint locally on your machine, we use [Serverless Offline](https://github.com/dherault/serverless-offline), [Serverless Webpack](https://github.com/serverless-heaven/serverless-webpack) and [Serverless DynamoDB Local](https://github.com/99xt/serverless-dynamodb-local). The plugins make it
super easy to run the entire solution E2E locally without any infrastructure. As a result, we save time and debug issues faster.

Make sure your `serverless.yml` is configured to setup DynamoDB on local as shown [here](https://github.com/serverless/serverless-graphql/blob/master/app-backend/dynamodb/serverless.yml#L16)

```
cd app-backend/dynamodb
yarn start
```

DynamoDB is now available and running on your local machine at `http://localhost:8000/shell`

![!Live Example](https://user-images.githubusercontent.com/1587005/36065162-b4ad3c14-0e4b-11e8-8776-e19596546ce1.gif)

**Note:** We also have a previous post on [making a serverless GraphQL API](https://serverless.com/blog/make-serverless-graphql-api-using-lambda-dynamodb/), which covers the process in more detail.

RDS backend: 
------------

DynamoDB is a great use case for fetching data by a set of keys, but relational database provides flexibility to model complex relationships and provides aggregation mechanisms at runtime. The [serverless-graphql](https://github.com/serverless/serverless-graphql) repo has full support of connecting to SQLite3, MySQL, Aurora or Postgres using
[Knex](http://knexjs.org/), a powerful query builder for SQL DB's and Node.js

Now, let's look at the process of connecting your lambda to RDS. We have explained requirements to set up RDS in production in [readme](https://github.com/serverless/serverless-graphql#setup-for-production-deploy-resources-to-aws), but you can test your GraphQL endpoint locally using SQLite3 (without any AWS infrastructure). Boom!

1. Data Modeling and Table Creation

We will create two tables (Users and Tweets) to store user and tweet info respectively as described [here](https://github.com/serverless/serverless-graphql/blob/master/app-backend/rds/migrations/20171204204927_setup.js)

**Table**: _User_  
**Primary Key**: _autoId_  
**Attributes**: _name_, _description_, _followers_count_  

**Table**: _Tweets_  
**Primary Key**: _tweet_id_  
**Attributes**: _tweet_, _handle_, _created_at_  

2. Mock fake data using [Faker](https://www.npmjs.com/package/faker). You can find the scripts [here](https://github.com/serverless/serverless-graphql/tree/master/app-backend/rds/seed-data)

3. Set your lambda in the same VPC as RDS for connectivity.

4. Configure knexfile for database configuration.

```yml
const pg = require('pg');
const mysql = require('mysql');

module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './dev.db',
    },
  },
  production: {
    client: process.env.DATABASE_TYPE === 'pg' ? 'pg' : 'mysql',
    connection: process.env.DATABASE_URL,
  },
};
```

5. Now, let's write our resolver functions. In this case, we can use knex ORM layer to query `User` table using SQL `where` clause and pass that `user` to fetch tweets from `Tweets` table. And it just works !!!

```
export const resolvers = {
  Query: {
    getUserInfo: (root, args) =>
      knex('Users')
        .where('handle', args.handle)
        .then(users => {
          const user = users[0];
          if (!user) {
            throw new Error('User not found');
          }
          return user;
        })
        .then(user =>
          knex('Tweets')
            .where('handle', user.handle)
            .then(posts => {
              // eslint-disable-next-line no-param-reassign
              user.tweets = { items: posts };
              return user;
            })
        ),
  },
};
```

For the `topTweet`; you can use knex ORM `orderBy` function: 

```yml
  User: {
    topTweet: obj =>
      knex('Tweets')
        .where('handle', obj.handle)
        .orderBy('retweet_count', 'desc')
        .limit(1)
        .then(tweet => {
          if (!tweet) {
            throw new Error('User not found');
          }
          return tweet[0];
        }),
  },
```

6. Run it locally on your machine (RDS instance not required)

*Kickstart on local using SQLite*

```
cd app-backend/rds
yarn install
yarn start
```

7. Deploy to production

```
cd app-backend/rds
yarn deploy-prod
```

**Note**: Please make sure your database endpoint is configured correctly in `config/security.env.prod`

REST Wrapper: 
------------

Last, but not the least - REST API backend. This use case is the most common, where you have pre-existing microservices, and you want to wrap them around GraphQL. It's easier than you think, let's look at it. For this tutorial, we will fetch data from Twitter's [REST API](https://developer.twitter.com/en/docs), but it can very well be your REST API. You will need to create OAuth tokens [here](https://apps.twitter.com/). We provide [test account tokens](https://github.com/serverless/serverless-graphql/blob/master/config/security.env.local) for you to get fast setup.

In this case, we don't need to create tables or mock data because we will be querying real data. The consumerKey, consumerSecret and handle are passed as an input to the `friends/list` API.

Let's look at how to get people a given user if following:

```yml
import { OAuth2 } from 'oauth';
const Twitter = require('twitter');

async function getFollowing(handle, consumerKey, consumerSecret) {
  const url = 'friends/list';

  const oauth2 = new OAuth2(
    consumerKey,
    consumerSecret,
    'https://api.twitter.com/',
    null,
    'oauth2/token',
    null
  );

  return new Promise(resolve => {
    oauth2.getOAuthAccessToken(
      '',
      {
        grant_type: 'client_credentials',
      },
      (error, accessToken) => {
        resolve(accessToken);
      }
    );
  })
    .then(accessToken => {
      const client = new Twitter({
        consumer_key: consumerKey,
        consumer_secret: consumerSecret,
        bearer_token: accessToken,
      });

      const params = { screen_name: handle };

      return client
        .get(url, params)
      //then parse the result
}
```

> Complete example is given [here](https://raw.githubusercontent.com/serverless/serverless-graphql/master/app-backend/rest-api/resolvers.js). You can also look at Saeri's blog post on [Serverless GraphQL Gateway on top of a 3rd Party REST API](https://serverless.com/blog/3rd-party-rest-api-to-graphql-serverless/)

6. Run it locally on your machine

```
cd app-backend/rest-api
yarn install
yarn start
```

7. Deploy to production

```
cd app-backend/rest-api
yarn deploy-prod
``` 
 
## Client Integrations (Apollo ReactJS, Netlify, and S3)

This repository comes in two client implementations

1. [Apollo Client 2.0](https://dev-blog.apollodata.com/apollo-client-2-0-beyond-graphql-apis-888807b53afe)
2. [AppSync Client](https://dev-blog.apollodata.com/aws-appsync-powered-by-apollo-df61eb706183)

If you are new to ReactJs + Apollo Integration, I would recommend going through [these tutorials](https://www.learnapollo.com/tutorial-react/react-01/)

The code for apollo-client in [serverless-graphql](https://github.com/serverless/serverless-graphql) repo is [here](https://github.com/serverless/serverless-graphql/tree/master/app-client/apollo-client)

To start the client on local, follow these steps:

1. Start any backend service on local. For example:

```
cd app-backend/rest-api
yarn install
yarn start
```

2. Now, make sure `http://localhost:4000/graphiql` is working

3. Kickstart Apollo Client as shown below and you will have a react server running on your local machine. The setup is created using [create react app](https://github.com/facebook/create-react-app)

```
cd app-client/apollo-client
yarn install
yarn start
```

![!Live Example](https://user-images.githubusercontent.com/1587005/36068493-de82620e-0e8b-11e8-887b-e1593cd3c8cc.gif)

In production, you can also deploy the client on Netlify or AWS S3. Please follow the instructions [here](https://github.com/serverless/serverless-graphql#setup-for-production-deploy-resources-to-aws)

**Note** I will go in more details about AppSync client in my next blog.

## Performance Analysis (X-Ray)

## Special Thanks!

First of all, I would like to thank [Nik Graf](https://twitter.com/nikgraf), [Philipp Müns](https://twitter.com/pmmuens) and [Austen Collins](https://twitter.com/austencollins) for kickstarting open source initiatives to help people build GraphQL endpoints easily on Serverless palatforms. I have personally learned a lot during my work with you guys! 

I would also like to give a shout to our open source committers - [Jon](https://twitter.com/superpatell), [Léo Pradel](@leopradel), [Tim](https://github.com/timsuchanek), [Justin](https://github.com/JstnEdr),  [Dan Kreiger](https://github.com/serpentblade) and [others](https://github.com/serverless/serverless-graphql/graphs/contributors) who I have not personally worked with.

Last but not the least, I would like to thank [Steven](https://twitter.com/kruken), Director of Data Engineering at Glassdoor for introducing me to GraphQL.

## Selling GraphQL in your Organization

> When using new tech, always a discussion of “do we want this, or not?” 

Ready to switch everything over, but not sure about how to convince the backend team? Well, here’s how I’ve seen this play out several times, with success.

First, the frontend team would wrap their existing REST APIs in a serverless GraphQL endpoint. It added some latency, but they were able to experiment with product changes way faster and could fetch only what was needed.

Then, they would use this superior workflow to gain even more buy-in. They would back up this buy-in by showing the backend team that nothing had broken so far.

Now I’m not *saying* you should do that, but also, if you wanted to, there it is for your consideration. My lips are sealed.

## What next?

> Part II: AppSync: AWS Managed GraphQL Service
> Announcements on Serverless AppSync Plugin

Siddharth Gupta
*Lead Data Engineer, Glassdoor*

[Github](https://github.com/sid88in) | [LinkedIn](https://www.linkedin.com/in/sid88in/) | [Twitter](https://twitter.com/sidg_sid))
