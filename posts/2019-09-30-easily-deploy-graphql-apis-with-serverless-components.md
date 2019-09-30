---
title: Easily Deploy GraphQL APIs with Serverless Components
description: "Introducing the AWS AppSync componnet that allows you to easily and quickly deploy GraphQL APIs on AWS, and integrate them with AWS Lambda, DynamoDB & others."
date: 2019-09-17
thumbnail: "https://s3.amazonaws.com/assets.general.serverless.com/component_nextjs/serverless_nextjs_blog_thumbnail.png"
heroImage: "https://s3.amazonaws.com/assets.general.serverless.com/component_nextjs/serverless_nextjs_blog_header.png"
authors:
  - EslamHefnawy
category:
  - news
---

Ever since we released [Serverless Components](), we've seen a huge demand for an AppSync component. Especially that it is not natively supported in the Serverless Framework. Today,we're super thrilled to announce that [Serverless Components]() now supports deploying GraphQL apps natively on AWS using the [aws-app-sync serverless component](). It comes with the following set of features:

- Fast Deployments (~10 seconds on average)
- Create New APIs or Reuse Existing Ones
- Supports Lambda Data Source
- Supports DynamoDB Data Source
- Supports ElasticSearch Data Source
- Supports Relational Database Data Source
- Supports API Keys Authentication
- Supports Cognito User Pools Authentication
- Supports OpenID Connect Authentication
- Supports AppSync Functions
- Supports Custom AppSync Service Role

In this article, we won't be able to cover all the features of this component. But we will take an example driven approach using the Lambda data source, where we will deploy a simple blogging GraphQL API to show you how easy it is to use this new component. Future articles will focus on more specific features and use cases of the [aws-app-sync component]()

### Credits

Before moving forward, we'd like to give a HUGE shoutout to [Eetu Tuomala](https://github.com/laardee) who's put a lot of effort contributing this component to the community and making sure it supports all of AppSync features. We'd also like to thank [Siddharth Gupta](https://github.com/sid88in) for building the original Serverless Framework AppSync plugin, which is the main inspiration for this component.

### Getting Started

If you're new to [Serverless Components](), you'll need to first install the latest version of the Serverless Framework. This will give you access to [30+ Serverless Components]().

```
npm i -g serverless
```

Awesome! You're now ready to deploy our blogging GraphQL API powered by AppSync. So let's do that next!

### Deploying Your GraphQL API

The [aws-app-sync component]() supports 4 data sources. These are Lambda, DynamoDB, ElasticSearch & Relational Database. In this article, we'll focus on the Lambda data source since it is the most common, and offers the most flexability for all use cases. for more information on using other data sources, [please checkout the docs]()

You'll need to have 4 files in the current working directory:

- **.env** - Your AWS credentials
- **schema.graphql** - Your GraphQL schema
- **index.js** - Your Lambda code.
- **serverless.yml** - Your components configuration.

#### .env

This is where we keep the AWS credentials that you'll use for this component. It looks something like this...

```
# .env
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

For more info regarding setting AWS keys, [checkout this guide](https://github.com/serverless/components#credentials).

#### schema.graphql

If you've worked with GraphQL before, you'll recognize this file. This is where you define your GraphQL schema. You could put any valid GraphQL schema in here. But for this example, we should have a schema that looks like this...

```
schema {
    query: Query
    mutation: Mutation
}

type Query {
    getPost(id:ID!): Post
    allPosts: [Post]
}

type Mutation {
    addPost(id: ID!, author: String!, title: String, content: String, url: String): Post!
}

type Post {
    id: ID!
    author: String!
    title: String
    content: String
    url: String
    ups: Int
    downs: Int
}

```

#### index.js

This is where you put your Lambda code. This code should work with the schema defined above. So in our example, it should look like this...

**Note:** In a real world use case, you'd use a database to store your posts data. For for the sake of this example, we're hard-coding the data.

```js
exports.handler = async event => {
  var posts = {
    "1": {
      id: "1",
      title: "First Blog Post",
      author: "Eetu Tuomala",
      url: "https://serverless.com/",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
    },
    "2": {
      id: "2",
      title: "Second Blog Post",
      author: "Siddharth Gupta",
      url: "https://serverless.com",
      content:
        "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s."
    }
  };

  if (event.field === "getPost") {
    var id = event.arguments.id;
    return posts[id];
  } else if (event.field === "addPost") {
    // add to database here...
    return event.arguments;
  } else {
    throw new Error("Unknown Field");
  }
};
```

#### serverless.yml

The `serverless.yml` file is where you define all the componnets that you'd like to use. In our case, we only need two components. One is the new [aws-app-sync component](), and the other is the [aws-lambda component](). We will pass the ARN output of the lambda component as an input to the app sync componnet. Basically we're just telling AppSync to use that lambda as our data source.

Here's how this file looks like...

```yml
myLambda:
  component: "@serverless/aws-lambda"
  inputs:
    handler: index.handler
    code: ./

appsync:
  component: "@serverless/aws-app-sync"
  inputs:
    # creating the API and an API key
    name: Posts
    authenticationType: API_KEY
    apiKeys:
      - myApiKey

    # defining your lambda data source
    dataSources:
      - type: AWS_LAMBDA
        name: addPost
        config:
          lambdaFunctionArn: ${myLambda.arn}

    # mapping schema fields to the data source
    mappingTemplates:
      - dataSource: addPost
        type: Mutation
        field: addPost
      - dataSource: getPost
        type: Query
        field: getPost
```

#### Setting Up a Custom Domain

This step is not required, but if you'd like to setup a custom domain for your GraphQL API, just add the `domain` property to the app sync component inputs:

```yml
appsync:
  component: "@serverless/aws-app-sync"
  inputs:
    domain: api.example.com
    name: Posts
    authenticationType: API_KEY
    apiKeys:
      - myApiKey
    # ... rest of config here
```

Please note that your domain (`example.com` in this example) must have been purchased via AWS Route53 and available in your AWS account. For advanced users, you may also purchase it elsewhere, then configure the name servers to point to an AWS Route53 hosted zone. How you do that depends on your registrar.

Now we have everything we need to deploy. Make sure you're in the directory containing your `serverless.yml` file. Then run the following command:

```
serverless
```

The first deployment might take a little up to a minute (a little more if you've defined a custom domain), but most subsequent deployments should take no more than few seconds. Once the deployment is done, you should see an output like this.

```
outputs here
```

### Querying Your GraphQL API

Notice the returned API URL & API Key in the CLI. You can now query your new API using this data. Using fetch, you could do an HTTP request that looks something like this...

```
fetch code snippet here
```

#### Wrapping Up

And there you have it! A complete GraphQL API, with a custom domain, deployed with just a handful of serverless components. In a real world application, you'd likey need more components for your app. For example, you would use the [aws-dynamodb component]() to store your posts. Take a look at our growing list of [serverless components]() to see what else you could use for your application.

This is just the tip of the iceburg. The [aws-app-sync component]() supports lots of other features and data sources. For more information, [please checkout the docs]().
