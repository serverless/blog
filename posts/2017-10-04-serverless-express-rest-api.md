---
title: Deploy a REST API using Serverless, Express and Node.js
description: Learn how to use the popular Express.js framework to deploy a REST API with Serverless, DynamoDB and API Gateway.
date: 2017-10-04
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/serverless-express-rest-api.jpg'
authors:
  - AlexDeBrie
category:
  - guides-and-tutorials
featured: guides-and-tutorials
---

We're seeing more and more people using Serverless to deploy web applications. The benefits are huge—lightning-fast deployments, automatic scaling, and pay-per-execution pricing.

But moving to serverless has a learning curve as well. You need to learn the intricacies of the platform you're using, including low-level details like format of the request input and the required shape of the response output. This can get in the way and slow your development process.

Today, I come with good news: your existing web framework tooling will work seamlessly with Serverless. In this post, I'll show you how to use the popular Node web framework [Express.js](https://expressjs.com/) to deploy a Serverless REST API. This means you can use your existing code + the vast Express.js ecosystem while still getting all the benefits of Serverless 💥!

Below is a step-by-step walkthrough of creating a new Serverless service using Express.js. We will:

- Deploy a simple API endpoint
- Add a DynamoDB table and two endpoints to create and retrieve a User object
- Set up path-specific routing for more granular metrics and monitoring
- Configure your environment for local development for a faster development experience.

If you already have an Express application that you want to convert to Serverless, skip to the [Converting an existing Express application](#converting-an-existing-express-application) section below.

#### Getting Started

To get started, you'll need the [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed. You'll also need your environment configured with [AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

#### Creating and deploying a single endpoint

Let's start with something easy—deploying a single endpoint. First, create a new directory with a `package.json` file:

```bash
$ mkdir my-express-application && cd my-express-application
$ npm init -f
```

Then, let's install a few dependencies. We'll install the `express` framework, as well as the [`serverless-http`](https://github.com/dougmoscrop/serverless-http):

```bash
$ npm install --save express serverless-http
```

The `serverless-http` package is a handy piece of middleware that handles the interface between your Node.js application and the specifics of API Gateway. Huge thanks to [Doug Moscrop](https://github.com/dougmoscrop) for developing it.

With our libraries installed, let's create an `index.js` file that has our application code:

```javascript
// index.js

const serverless = require('serverless-http');
const express = require('express')
const app = express()

app.get('/', function (req, res) {
  res.send('Hello World!')
})

module.exports.handler = serverless(app);
```

This is a very simple application that returns `"Hello World!"` when a request comes in on the root path `/`.

It's straight out of the [Express documentation](https://expressjs.com/en/starter/hello-world.html) with two small additions. First, we imported the `serverless-http` package at the top. Second, we exported a `handler` function which is our application wrapped in the `serverless` package.

To get this application deployed, let's create a `serverless.yml` in our working directory:

```yml
# serverless.yml

service: my-express-application

provider:
  name: aws
  runtime: nodejs6.10
  stage: dev
  region: us-east-1

functions:
  app:
    handler: index.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

This is a pretty basic configuration. We've created one function, `app`, which uses the exported handler from our `index.js` file. Finally, it's configured with some HTTP triggers.

We've used a very broad path matching so that all requests on this domain are routed to this function. All of the HTTP routing logic will be done inside the Express application.

Now, deploy your function:

```bash
$ sls deploy
... snip ...
Service Information
service: my-express-application
stage: dev
region: us-east-1
stack: my-express-application-dev
api keys:
  None
endpoints:
  ANY - https://bl4r0gjjv5.execute-api.us-east-1.amazonaws.com/dev
  ANY - https://bl4r0gjjv5.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
functions:
  app: my-express-application-dev-app
```

After a minute, the console will show your `endpoints` in the `Service Information` section. Navigate to that route in your browser:

<img width="608" alt="Express Hello World" src="https://user-images.githubusercontent.com/6509926/31132443-6fe23b14-a822-11e7-9abf-ebd05ac72991.png">

Your application is live!

#### Adding a DynamoDB table with REST-like endpoints

It's fun to get a simple endpoint live, but it's not very valuable. Often, your application will need to persist some sort of state to be useful. Let's add a [DynamoDB table](https://aws.amazon.com/dynamodb/) as our backing store.

For this simple example, let's say we're storing Users in a database. We want to store them by `userId`, which is a unique identifier for a particular user.

First, we'll need to configure our `serverless.yml` to provision the table. This involves three parts:

1. Provisioning the table in the [`resources`](https://serverless.com/framework/docs/providers/aws/guide/resources/) section;
2. Adding the proper [IAM permissions](https://serverless.com/framework/docs/providers/aws/guide/iam/); and
3. Passing the table name as an [environment variable](https://serverless.com/framework/docs/providers/aws/guide/functions/#environment-variables) so our functions can use it.

Change your `serverless.yml` to look as follows:

```yml
# serverless.yml

service: my-express-application

custom:
  tableName: 'users-table-${self:provider.stage}'

provider:
  name: aws
  runtime: nodejs6.10
  stage: dev
  region: us-east-1
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
        - dynamodb:UpdateItem
        - dynamodb:DeleteItem
      Resource:
        - { "Fn::GetAtt": ["UsersDynamoDBTable", "Arn" ] }
  environment:
    USERS_TABLE: ${self:custom.tableName}

functions:
  app:
    handler: index.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'

resources:
  Resources:
    UsersDynamoDBTable:
      Type: 'AWS::DynamoDB::Table'
      Properties:
        AttributeDefinitions:
          -
            AttributeName: userId
            AttributeType: S
        KeySchema:
          -
            AttributeName: userId
            KeyType: HASH
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
        TableName: ${self:custom.tableName}
```

We provisioned the table in the `resources` section using CloudFormation syntax. We also added IAM permissions for our functions under the `iamRoleStatements` portion of the `provider` block. Finally, we passed the table name as the environment variable `USERS_TABLE` in the `environment` portion of the `provider` block.

Now, let's update our application to use the table. We'll implement two endpoints: `POST /user` to create a new user, and `GET /user/{userId}` to get information on a particular user.

First, install the `aws-sdk` and `body-parser`, which is used for parsing the body of HTTP requests:

```bash
$ npm install --save aws-sdk body-parser
```

Then update your `index.js` as follows:

```javascript
// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');


const USERS_TABLE = process.env.USERS_TABLE;
const dynamoDb = new AWS.DynamoDB.DocumentClient();

app.use(bodyParser.json({ strict: false }));

app.get('/', function (req, res) {
  res.send('Hello World!')
})

// Get User endpoint
app.get('/users/:userId', function (req, res) {
  const params = {
    TableName: USERS_TABLE,
    Key: {
      userId: req.params.userId,
    },
  }

  dynamoDb.get(params, (error, result) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not get user' });
    }
    if (result.Item) {
      const {userId, name} = result.Item;
      res.json({ userId, name });
    } else {
      res.status(404).json({ error: "User not found" });
    }
  });
})

// Create User endpoint
app.post('/users', function (req, res) {
  const { userId, name } = req.body;
  if (typeof userId !== 'string') {
    res.status(400).json({ error: '"userId" must be a string' });
  } else if (typeof name !== 'string') {
    res.status(400).json({ error: '"name" must be a string' });
  }

  const params = {
    TableName: USERS_TABLE,
    Item: {
      userId: userId,
      name: name,
    },
  };

  dynamoDb.put(params, (error) => {
    if (error) {
      console.log(error);
      res.status(400).json({ error: 'Could not create user' });
    }
    res.json({ userId, name });
  });
})

module.exports.handler = serverless(app);
```

In addition to base "Hello World" endpoint, we now have two new endpoints:

- `GET /users/:userId` for getting a User
- `POST /users` for creating a new User

Let's deploy the service and test it out!

```bash
$ sls deploy
```

We'll use `curl` for these examples. Set the `BASE_DOMAIN` variable to your unique domain and base path so it's easier to reuse:

```bash
export BASE_DOMAIN=https://bl4r0gjjv5.execute-api.us-east-1.amazonaws.com/dev
```

Then, let's create a user:

```bash
$ curl -H "Content-Type: application/json" -X POST ${BASE_DOMAIN}/users -d '{"userId": "alexdebrie1", "name": "Alex DeBrie"}'
{"userId":"alexdebrie1","name":"Alex DeBrie"}
```

Nice! We've created a new user! Now, let's retrieve the user with the GET /users/:userId` endpoint:

```bash
$ curl -H "Content-Type: application/json" -X GET ${BASE_DOMAIN}/users/alexdebrie1
{"userId":"alexdebrie1","name":"Alex DeBrie"}
```

Perfect!

This isn't a full-fledged REST API, and you'll want to add things like error handling, authentication, and additional business logic. This does give a framework in which you can work to set up those things.

#### Path-specific routing

Let's take another look at our function configuration in `serverless.yml`:

```
functions:
  app:
    handler: index.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

We're forwarding all traffic on the domain to our application and letting Express handle the entirety of the routing logic. There is a benefit to this—I don't have to manually string up all my routes and functions. I can also limit the impact of cold-starts on lightly-used routes.

However, we also lose some of the benefits of the serverless architecture. I can isolate my bits of logic into separate functions and get a decent look at my application from standard metrics. If each route is handled by a different Lambda function, then I can see:

- How many times each route is invoked
- How many errors I have for each route
- How long each route takes (and how much money I could save if I made that route faster)

Luckily, you can still get these things if you want them! You can configure your `serverless.yml` so that different routes are routed to different instances of your function.

Each function instance will have the same code, but they'll be segmented for metrics purposes:

```yml
# serverless.yml

functions:
  app:
    handler: index.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
  getUser:
    handler: index.handler
    events:
      - http: 'GET /users/{proxy+}'
  createUser:
    handler: index.handler
    events:
      - http: 'POST /users'
```

Now, all requests to `GET /users/:userId` will be handled by the `getUser` instance of your application, and all requests to `POST /users/` will be handled by the `createUser` instance. For any other requests, they'll be handled by the main `app` instance of your function.

Again, none of this is required, and it's a bit of an overweight solution since each specific endpoint will include the full application code for your other endpoints. However, it's a good balance between speed of development by using the tools you're used to along with the per-endpoint granularity that serverless application patterns provide.

#### Local development configuration with Serverless offline plugin

When developing an application, it's nice to rapidly iterate by developing and testing locally rather than doing a full deploy betwen changes. In this section, I'll show you how to configure your environment for local development.

First, let's use the [`serverless-offline`](https://github.com/dherault/serverless-offline) plugin. This plugin helps to emulate the API Gateway environment for local development.

Install the `serverless-offline` plugin:

```bash
$ npm install --save-dev serverless-offline
```

Then add the plugin to your `serverless.yml`:

```yml
# serverless.yml

plugins:
  - serverless-offline
```

Then, start the serverless-offline server:

```bash
$ sls offline start
Serverless: Starting Offline: dev/us-east-1.

Serverless: Routes for app:
Serverless: ANY /
Serverless: ANY /{proxy*}

Serverless: Routes for getUser:
Serverless: GET /users/{proxy*}

Serverless: Routes for createUser:
Serverless: POST /users

Serverless: Offline listening on http://localhost:3000
```

Then navigate to your root page on `localhost:3000` in your browser:

<img width="541" alt="Serverless Offline" src="https://user-images.githubusercontent.com/6509926/31183451-3d7c6a08-a8ec-11e7-9282-0e474b68caf6.png">

It works! If you make a change in your `index.js` file, it will be updated the next time you hit your endpoint. This rapidly improves development time.

While this works easily for a stateless endpoint like "Hello World!", it's a little trickier for our `/users` endpoints that interact with a database.

Luckily, there's a plugin for doing local development with a local DynamoDB emulator! We'll use the [`serverless-dynamodb-local`](https://github.com/99xt/serverless-dynamodb-local) plugin for this.

First, let's install the plugin:

```
$ npm install --save-dev serverless-dynamodb-local
```

Then, let's add the plugin to our `serverless.yml`. Note that it must come before the `serverless-offline` plugin. We'll also add some config in the `custom` block so that it locally creates our tables defined in the `resources` block:

```yml
# serverless.yml

plugins:
  - serverless-dynamodb-local
  - serverless-offline #serverless-offline needs to be last in the list

custom:
  tableName: 'users-table-${self:provider.stage}'
  dynamodb:
    start:
      migrate: true
```

Then, run a command to install DynamoDB local:

```bash
$ sls dynamodb install
```

Finally, we need to make some small changes to our application code. When instantiating our DynamoDB client, we'll add in some special configuration if we're in a local, offline environment. The `serverless-offline` plugin sets an environment variable of `IS_OFFLINE` to `true`, so we'll use that to handle our config. Change the beginning of `index.js` to the following:

```javascript
// index.js

const serverless = require('serverless-http');
const bodyParser = require('body-parser');
const express = require('express')
const app = express()
const AWS = require('aws-sdk');

const USERS_TABLE = process.env.USERS_TABLE;

const IS_OFFLINE = process.env.IS_OFFLINE;
let dynamoDb;
if (IS_OFFLINE === 'true') {
  dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: 'localhost',
    endpoint: 'http://localhost:8000'
  })
  console.log(dynamoDb);
} else {
  dynamoDb = new AWS.DynamoDB.DocumentClient();
};

app.use(bodyParser.json({ strict: false }));

... rest of application code ...
```

Now, our DocumentClient constructor is configured to use DynamoDB local if we're running locally or uses the default options if running in Lambda.

Let's see it if works. Start up your offline server again:

```bash
$ sls offline start
Dynamodb Local Started, Visit: http://localhost:8000/shell
Serverless: DynamoDB - created table users-table-dev
Serverless: Starting Offline: dev/us-east-1.

Serverless: Routes for app:
Serverless: ANY /
Serverless: ANY /{proxy*}

Serverless: Routes for getUser:
Serverless: GET /users/{proxy*}

Serverless: Routes for createUser:
Serverless: POST /users

Serverless: Offline listening on http://localhost:3000
```

Let's run our `curl` command from earlier to hit our local endpoint and create a user:

```bash
$ curl -H "Content-Type: application/json" -X POST http://localhost:3000/users -d '{"userId": "alexdebrie1", "name": "Alex DeBrie"}'
{"userId":"alexdebrie1","name":"Alex DeBrie"}
```

And then retrieve the user:

```bash
$ curl -H "Content-Type: application/json" -X GET http://localhost:3000/users/alexdebrie1
{"userId":"alexdebrie1","name":"Alex DeBrie"}
```

It works just like it did on Lambda!

This local setup can really speed up your workflow while still allowing you to emulate a close approximation of the Lambda environment.

#### Converting an existing Express application

If you already have an existing Express application, it's very easy to convert to a Serverless-friendly application. Do the following steps:

1. Install the `serverless-http` package -- `npm install --save serverless-http`

2. Add the `serverless-http` configuration to your Express application.

	You’ll need to import the serverless-http library at the top of your file:

	`const serverless = require('serverless-http');`

	then export your wrapped application:

	`module.exports.handler = serverless(app);.`

	For reference, an example application might look like this:

	```
	# app.js

	const serverless = require('serverless-http'); <-- Add this.
	const express = require('express')
	const app = express()


	... All your Express code ...


	module.exports.handler = serverless(app); <-- Add this.
	```

3. Set up your `serverless.yml` with a single function that captures all traffic:

	```yml
	# serverless.yml

	service: express-app

	provider:
	  name: aws
	  runtime: nodejs6.10
	  stage: dev
	  region: us-east-1

	functions:
	  app:
	    handler: app.handler
	    events:
	      - http: ANY /
	      - http: 'ANY {proxy+}'
	```

That's it! Run `sls deploy` and your app will deploy!

Note that if you use other resources (databases, credentials, etc.), you'll need to make sure those make it into your application, likely via [Environment Variables](https://serverless.com/framework/docs/providers/aws/guide/functions/#environment-variables).

#### Additional Resources

Here are a few other resources you might find useful while building Express applications with Serverless:

- [Adding a custom domain name to your API](https://serverless.com/blog/serverless-api-gateway-domain/)
- [3 Steps to Faster Serverless Development](https://serverless.com/blog/quick-tips-for-faster-serverless-development/)
- [Monitoring with Metrics and Alarms](https://serverless.com/blog/serverless-ops-metrics/)
- [Function introspection with logging](https://serverless.com/blog/serverless-ops-logs/)


#### Architectural Diagram
![Architectural Diagram](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Thom's+Posts/node.jpg)
