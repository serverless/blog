---
title: Easily Deploy GraphQL APIs with Serverless Components
description: "Introducing the AWS AppSync component that allows you to easily and quickly deploy GraphQL APIs on AWS, and integrate them with AWS Lambda, DynamoDB & others."
date: 2019-10-02
thumbnail: "https://s3.amazonaws.com/assets.general.serverless.com/component_appsync/blog-thumbnail-appsync-serverless-component.png"
heroImage: "https://s3.amazonaws.com/assets.general.serverless.com/component_appsync/blog-header-appsync-serverless-component.png"
authors:
  - EslamHefnawy
category:
  - news
---

Ever since we released [Serverless Components](https://github.com/serverless/components), we've seen huge demand for an AppSync component. Especially since it is not natively supported in the Serverless Framework. Today, we're thrilled to announce the [Serverless AppSync Component](https://github.com/serverless-components/aws-app-sync), which enables you to deploy GraphQL apps on AWS more easily and quickly than ever.

The [Serverless AppSync Component](https://github.com/serverless-components/aws-app-sync) does not rely on CloudFormation, making it a lot faster to deploy compared to CloudFormation and Amplify. It also ships with sane defaults that makes it a lot simpler and easier to use without having to scroll through multiple pages of AWS documentation and copy/paste code. We've done the research for you, and we've packaged it all in this easy-to-use component. It comes with the following set of features:

- [x] Fast Deployments (~10 seconds on average)
- [x] Create New APIs or Reuse Existing Ones
- [x] Supports Custom Domains with CDN & SSL Out of the Box
- [x] Supports Custom AppSync Service Role
- [x] Supports Lambda Data Source
- [x] Supports DynamoDB Data Source
- [x] Supports ElasticSearch Data Source
- [x] Supports Relational Database Data Source
- [x] Supports API Keys Authentication
- [x] Supports Cognito User Pools Authentication
- [x] Supports OpenID Connect Authentication
- [x] Supports AppSync Functions

In this article, we won't be able to cover all the features of this component. But we will take an example driven approach using the Lambda data source, where we will deploy a very simple blogging GraphQL API to show you how easy it is to use this new component. Future articles will focus on more specific features and use cases of the [aws-app-sync component](https://github.com/serverless-components/aws-app-sync)

### Credits

Before moving forward, we'd like to give a HUGE shoutout to [Eetu Tuomala](https://github.com/laardee) who's put a lot of effort contributing this component to the community and making sure it supports all of AppSync features. We'd also like to thank [Siddharth Gupta](https://github.com/sid88in) for building the original [Serverless Framework AppSync plugin](https://github.com/sid88in/serverless-appsync-plugin), which is the main inspiration for this component.

### Getting Started

If you're new to [Serverless Components](https://github.com/serverless/components), you'll need to first install the latest version of the Serverless Framework. This will give you access to [30+ Serverless Components](https://github.com/serverless-components).

```
npm i -g serverless
```

Awesome! Next up, we're gonna configure our simple blogging GraphQL API.

### Configuring Your GraphQL API

The [aws-app-sync component](https://github.com/serverless-components/aws-app-sync) supports 4 data sources. These are Lambda, DynamoDB, ElasticSearch & Relational Database. In this article, we'll focus on the Lambda data source since it is the most common, and offers the most flexability for all use cases. for more information on using other data sources, [please checkout the docs](https://github.com/serverless-components/aws-app-sync)

You'll need to have 4 files in the current working directory:

- **.env** - Your AWS credentials
- **schema.graphql** - Your GraphQL schema
- **index.js** - Your Lambda code.
- **serverless.yml** - Your components configuration.

#### .env

This is where you keep the AWS credentials that you'll use for this component. It looks something like this...

```
# .env
AWS_ACCESS_KEY_ID=XXX
AWS_SECRET_ACCESS_KEY=XXX
```

For more info regarding setting AWS keys, [checkout this guide](https://github.com/serverless/components#credentials).

#### schema.graphql

If you've worked with GraphQL before, you'll recognize this file. This is where you define your GraphQL schema. You could put any valid GraphQL schema in here. But for this example, we will use a very simple schema that looks like this...

```
schema {
  query: Query
}

type Query {
  getPost(id: ID!): Post
}

type Post {
  id: ID!
  author: String!
  title: String
  content: String
  url: String
}

```

#### index.js

This is where you put your Lambda code. This code should work with the schema defined above. So in our example, it should look like this...

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

  return posts[event.id];
};
```

**Note:** In a real world use case, you'd use a database to store your posts data. For for the sake of this example, we're hard-coding the data.

#### serverless.yml

The `serverless.yml` file is where you define all the components that you'd like to use. In our case, we only need two components. One is the new [aws-app-sync component](https://github.com/serverless-components/aws-app-sync), and the other is the [aws-lambda component](https://github.com/serverless-components/aws-lambda). We will pass the ARN output of the lambda component as an input to the app sync component. Basically we're just telling AppSync to use that Lambda as our data source.

Here's how this file looks...

```yml
myLambda:
  component: "@serverless/aws-lambda"
  inputs:
    handler: index.handler
    code: ./

myAppSyncApi:
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
        name: getPost
        config:
          lambdaFunctionArn: ${myLambda.arn}

    # mapping schema fields to the data source
    mappingTemplates:
      - dataSource: getPost
        type: Query
        field: getPost
```

#### Setting Up a Custom Domain

This step is not required, but if you'd like to setup a custom domain for your GraphQL API, just add a `domain` property to the app sync component inputs:

```yml
myAppSyncApi:
  component: "@serverless/aws-app-sync"
  inputs:
    domain: api.example.com # add your custom domain here
    name: Posts
    # ... rest of config here
```

Please note that your domain (`example.com` in this example) must have been purchased via AWS Route53 and available in your AWS account. For advanced users, you may also purchase it elsewhere, then configure the name servers to point to an AWS Route53 hosted zone. How you do that depends on your registrar.

### Deploying Your GraphQL API

Now we have everything we need to deploy. Make sure you're in the directory containing your `serverless.yml` file. Then run the following command:

```
serverless
```

The first deployment might take a little up to a minute (a little more if you've defined a custom domain), but most subsequent deployments should take no more than few seconds. Once the deployment is done, you should see an output like this.

```
  myAppSyncApi:
    apiId:   samrhyo7srbtvkpqnj4j6uq6gq
    arn:     arn:aws:appsync:us-east-1:552751238299:apis/samrhyo7srbtvkpqnj4j6uq6gq
    url:     "https://samrhyo7srbtvkpqnj4j6uq6gq.appsync-api.us-east-1.amazonaws.com/graphql"
    apiKeys:
      - da2-coeytoubhffnfastengavajsku
    domain:  "https://api.example.com/graphql"

  9s › myAppSyncApi › done

myApp (master)$
```

Amazing! Your GraphQL API has been deployed. Now let's query...

### Querying Your GraphQL API

Notice the returned API URL & API Key in the CLI after deployment. You can now query your new API using this data. Using [node-fetch](https://github.com/bitinn/node-fetch), you could do an HTTP request that looks something like this...

```js
const fetch = require("node-fetch");

// url of your GraphQL API. If you configured a custom domain, you could use that instead
const url =
  "https://samrhyo7srbtvkpqnj4j6uq6gq.appsync-api.us-east-1.amazonaws.com/graphql";

// api key of your GraphQL API
const apiKey = "da2-coeytoubhffnfastengavajsku";

// ID of the post you wanna query
const id = "1";

fetch(url, {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "x-api-key": apiKey
  },
  body: JSON.stringify({
    query: `query getPost { getPost(id: "${id}") { id author title content url}}`
  })
})
  .then(res => res.text())
  .then(post => console.log(post));
```

### Wrapping Up

And there you have it! A serverless GraphQL API, with a custom domain, deployed with just a handful of serverless components. In a real world application, you'd likely need more components for your app. For example, you would use the [aws-dynamodb component](https://github.com/serverless-components/aws-dynamodb) to store your posts. Take a look at our growing list of [serverless components](https://github.com/serverless-components) to see what else you could use for your application.

This is just the tip of the iceberg. The [aws-app-sync component](https://github.com/serverless-components/aws-app-sync) supports lots of other features and data sources. For more information, [please check out the docs](https://github.com/serverless-components/aws-app-sync).

We can't wait to see what you build with Serverless Components. If you have any questions or feedback, feel free to [reach out to me directly on Twitter](https://twitter.com/eahefnawy).
