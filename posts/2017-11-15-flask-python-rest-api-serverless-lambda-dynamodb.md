---
title: "Build a Python REST API with Serverless, Lambda, and DynamoDB"
description: "Deploy a Serverless REST API in minutes using the popular Flask web framework"
date: 2017-11-16
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/serverless-python-flask-api.jpg'
category:
  - guides-and-tutorials
heroImage: ''
authors:
  - AlexDeBrie
---

Your existing web framework tooling can work seamlessly with the [Serverless Framework](https://serverless.com/framework/). Let’s go over how to use the Python web framework [Flask](http://flask.pocoo.org/) to deploy a Serverless REST API.

In this walk-through, we will:

- Deploy a simple API endpoint
- Add a DynamoDB table and two endpoints to create and retrieve a User object
- Set up path-specific routing for more granular metrics and monitoring
- Configure your environment for local development for a faster development experience.

If you already have a Flask application that you want to convert to Serverless, skip to the [Converting an existing Flask application](#converting-an-existing-flask-application) section below.

If you want to skip the walkthrough and just get started with a fully-configured template, check out the [Using the Quick Start Template](#using-the-quick-start-template) section below.

#### Getting Started

To get started, you'll need the [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed. You'll also need your environment configured with [AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

#### Creating and deploying a single endpoint

Let's start by deploying a single endpoint.

First, create a new directory with a `package.json` file:

```bash
$ mkdir my-flask-application && cd my-flask-application
$ npm init -f
```

Then, install a few dependencies. We're going to use the [`serverless-wsgi`](https://github.com/logandk/serverless-wsgi) plugin for negotiating the API Gateway event type into the WSGI format that Flask expects. We'll also use the [`serverless-python-requirements`](https://github.com/UnitedIncome/serverless-python-requirements) plugin for handling our Python packages on deployment.

```bash
$ npm install --save-dev serverless-wsgi serverless-python-requirements
```

> If you want a deeper dive on the `serverless-python-requirements` plugin, check out our previous post on [handling Python packaging with Serverless](https://serverless.com/blog/serverless-python-packaging/).

With our libraries installed, let's write our Flask application. Create a file `app.py` with the following contents:

```python
# app.py

from flask import Flask
app = Flask(__name__)

@app.route("/")
def hello():
    return "Hello World!"
```

This is a very simple application that returns `"Hello World!"` when a request comes in on the root path `/`. It's the [example application shown on Flask's landing page](http://flask.pocoo.org/) with no modifications.

To get this application deployed, create a `serverless.yml` in the working directory:

```yml
# serverless.yml

service: serverless-flask

plugins:
  - serverless-python-requirements
  - serverless-wsgi

custom:
  wsgi:
    app: app.app
    packRequirements: false
  pythonRequirements:
    dockerizePip: non-linux

provider:
  name: aws
  runtime: python3.6
  stage: dev
  region: us-east-1

functions:
  app:
    handler: wsgi.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

_Note: a previous version of this post set `dockerizePip: true` instead of `dockerizePip: non-linux`. You'll need `serverless-python-requirements` v3.0.5 or higher for this option._

This is a pretty basic configuration. We've created one function, `app`. The handler is `handler` function from the `wsgi` module. Note that this module will be added to our deployment package by the `serverless-wsgi` plugin. We configure our application's entry point in the `custom` block under the `wsgi` section. We declare that our app's entrypoint is `app.app`, which means the `app` object in the `app.py` module.

For our function's `events` configuration, we've used a very broad path matching so that all requests on this domain are routed to this function. All of the HTTP routing logic will be done inside the Flask application.

The last thing we need to do is handle our Python packages. The `serverless-python-requirements` plugin looks for a `requirements.txt` file in our working directory and installs them into our deployment package. Let's build that `requirements.txt` file.

First, create a virtual environment and activate it. I'm using Python3 in my `serverless.yml`, so I'm specifying that here as well:

```bash
$ virtualenv venv --python=python3
$ source venv/bin/activate
```

> If you need a walkthrough on using Python virtual environments, check out [Kenneth Reitz's walkthrough](http://docs.python-guide.org/en/latest/dev/virtualenvs/#lower-level-virtualenv).

Then, install the `Flask` package with `pip`, and save your dependencies in `requirements.txt`:

```bash
(venv) $ pip install flask
(venv) $ pip freeze > requirements.txt
```

Now, deploy your function:

```bash
$ sls deploy
... snip ...
Service Information
service: serverless-flask
stage: dev
region: us-east-1
stack: serverless-flask-dev
api keys:
  None
endpoints:
  ANY - https://bl4r0gjjv5.execute-api.us-east-1.amazonaws.com/dev
  ANY - https://bl4r0gjjv5.execute-api.us-east-1.amazonaws.com/dev/{proxy+}
functions:
  app: serverless-flask-dev-app
```

After a minute, the console will show your `endpoints` in the `Service Information` section. Navigate to that route in your browser:

<img width="783" alt="Flask Hello World" src="https://user-images.githubusercontent.com/6509926/32240372-2ccf439c-be3b-11e7-99ee-00e5b78b1e7d.png">

You did it—a real, live application on the Internet!

#### Adding a DynamoDB table with REST-like endpoints

Doing a "Hello World!" is fun, but your application will need to persist some sort of state to be useful. Let's add a [DynamoDB table](https://aws.amazon.com/dynamodb/) as our backing store.

For this simple example, let's say we're storing Users in a database. We want to store them by `userId`, which is a unique identifier for a particular user.

First, we'll need to configure our `serverless.yml` to provision the table. This involves three parts:

1. Provisioning the table in the [`resources`](https://serverless.com/framework/docs/providers/aws/guide/resources/) section;
2. Adding the proper [IAM permissions](https://serverless.com/framework/docs/providers/aws/guide/iam/); and
3. Passing the table name as an [environment variable](https://serverless.com/framework/docs/providers/aws/guide/functions/#environment-variables) so our functions can use it.

Change your `serverless.yml` to look as follows:

```yml
# serverless.yml

service: serverless-flask

plugins:
  - serverless-python-requirements
  - serverless-wsgi

custom:
  tableName: 'users-table-${self:provider.stage}'
  wsgi:
    app: app.app
    packRequirements: false
  pythonRequirements:
    dockerizePip: non-linux

provider:
  name: aws
  runtime: python3.6
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
    handler: wsgi.handler
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

Now, let's update our application to use the table. We'll implement two endpoints: `POST /users` to create a new user, and `GET /users/{userId}` to get information on a particular user.

Update your `app.py` as follows:

```python
# app.py

import os

import boto3

from flask import Flask, jsonify, request
app = Flask(__name__)

USERS_TABLE = os.environ['USERS_TABLE']
client = boto3.client('dynamodb')


@app.route("/")
def hello():
    return "Hello World!"


@app.route("/users/<string:user_id>")
def get_user(user_id):
    resp = client.get_item(
        TableName=USERS_TABLE,
        Key={
            'userId': { 'S': user_id }
        }
    )
    item = resp.get('Item')
    if not item:
        return jsonify({'error': 'User does not exist'}), 404

    return jsonify({
        'userId': item.get('userId').get('S'),
        'name': item.get('name').get('S')
    })


@app.route("/users", methods=["POST"])
def create_user():
    user_id = request.json.get('userId')
    name = request.json.get('name')
    if not user_id or not name:
        return jsonify({'error': 'Please provide userId and name'}), 400

    resp = client.put_item(
        TableName=USERS_TABLE,
        Item={
            'userId': {'S': user_id },
            'name': {'S': name }
        }
    )

    return jsonify({
        'userId': user_id,
        'name': name
    })
```

In addition to base "Hello World" endpoint, we now have two new endpoints:

- `GET /users/:userId` for getting a User
- `POST /users` for creating a new User

We've added a `boto3` dependency, so let's install that into our virtual environment and update our requirements in `requirements.txt`:

```bash
$ pip install boto3
$ pip freeze > requirements.txt
```

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
{
  "name": "Alex DeBrie",
  "userId": "alexdebrie1"
}
```

Nice—we've created a new user! Now, let's retrieve the user with the GET /users/:userId` endpoint:

```bash
$ curl -H "Content-Type: application/json" -X GET ${BASE_DOMAIN}/users/alexdebrie1
{
  "name": "Alex DeBrie",
  "userId": "alexdebrie1"
}
```

This isn't a full-fledged REST API, and you'll want to add things like error handling, authentication, and additional business logic. This does give a framework in which you can work to set up those things.

#### Path-specific routing

Let's take another look at our function configuration in `serverless.yml`:

```
functions:
  app:
    handler: wsgi.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

We're forwarding all traffic on the domain to our application and letting Flask handle the entirety of the routing logic. There is a benefit to this—you don't have to manually string up all my routes and functions. You can also limit the impact of cold-starts on lightly-used routes.

However, we also lose some of the benefits of the serverless architecture. You can isolate your bits of logic into separate functions and get a decent look at your application from standard metrics.

If each route is handled by a different Lambda function, then you can see:

- How many times each route is invoked
- How many errors you have for each route
- How long each route takes (and how much money you could save if you made that route faster)

Luckily, you can still get these things if you want them! You can configure your `serverless.yml` so that different routes are routed to different instances of your function.

Each function instance will have the same code, but they'll be segmented for metrics purposes:

```yml
# serverless.yml

functions:
  app:
    handler: wsgi.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
  getUser:
    handler: wsgi.handler
    events:
      - http: 'GET /users/{proxy+}'
  createUser:
    handler: wsgi.handler
    events:
      - http: 'POST /users'
```

Now, all requests to `GET /users/:userId` will be handled by the `getUser` instance of your application, and all requests to `POST /users/` will be handled by the `createUser` instance. For any other requests, they'll be handled by the main `app` instance of your function.

Again, none of this is required, and it's a bit of an overweight solution; each specific endpoint will include the full application code for your other endpoints. However, it's a good balance between speed of development by using the tools you're used to, along with the per-endpoint granularity that serverless application patterns provide.

#### Local development configuration with Serverless offline plugin

When developing an application, it's nice to rapidly iterate by developing and testing locally rather than doing a full deploy between changes. In this section, we’ll cover how to configure your environment for local development.

The great thing about the `serverless-wsgi` plugin is that it includes a built-in solution for local development. To start the local server, just run `sls wsgi serve`:

```bash
$ sls wsgi serve
 * Running on http://localhost:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 109-942-480
```

Then navigate to your root page on `localhost:5000` in your browser:

<img width="985" alt="Serverless WSGI Serve" src="https://user-images.githubusercontent.com/6509926/32271253-07ba02e0-bec7-11e7-8ef7-4cc9e276d087.png">

It works! If you make a change in your `app.py` file, it will be updated the next time you hit your endpoint. This rapidly improves development time.

While this works easily for a stateless endpoint like "Hello World!", it's a little trickier for our `/users` endpoints that interact with a database.

Luckily, there's a plugin for doing local development with a local DynamoDB emulator. We'll use the [`serverless-dynamodb-local`](https://github.com/99xt/serverless-dynamodb-local) plugin for this.

First, let's install the plugin:

```
$ npm install --save-dev serverless-dynamodb-local
```

Then, let's add the plugin to our `serverless.yml`. We'll also add some config in the `custom` block so that it locally creates our tables defined in the `resources` block:

```yml
# serverless.yml

plugins:
  - serverless-python-requirements
  - serverless-wsgi
  - serverless-dynamodb-local

custom:
  tableName: 'users-table-${self:provider.stage}'
  wsgi:
    app: app.app
    packRequirements: false
  pythonRequirements:
    dockerizePip: non-linux
  dynamodb:
    start:
      migrate: true
```

Then, run a command to install DynamoDB local:

```bash
$ sls dynamodb install
```

Finally, we need to make some small changes to our application code. When instantiating our DynamoDB client, we'll add in some special configuration if we're in a local, offline environment.

When developing locally, the `serverless-wsgi` plugin sets an environment variable of `IS_OFFLINE` to `true`, so we'll use that to handle our config. Change the beginning of `app.py` to the following:

```python
# app.py

import os

import boto3

from flask import Flask, jsonify, request
app = Flask(__name__)

USERS_TABLE = os.environ['USERS_TABLE']
IS_OFFLINE = os.environ.get('IS_OFFLINE')

if IS_OFFLINE:
    client = boto3.client(
        'dynamodb',
        region_name='localhost',
        endpoint_url='http://localhost:8000'
    )
else:
    client = boto3.client('dynamodb')


@app.route("/")
def hello():
    return jsonify(os.environ)
... rest of application code ...
```

Now, our DynamoDB client is configured to use DynamoDB local if we're running locally, or use the default options if running in Lambda.

Let's see it if works. You'll need two different terminal windows now. In your first window, start up DynamoDB local:

```bash
$ sls dynamodb start
Dynamodb Local Started, Visit: http://localhost:8000/shell
Serverless: DynamoDB - created table users-table-dev
```

In the second window, start up your local WSGI server:

```bash
sls wsgi serve
 * Running on http://localhost:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 109-942-480
```

Let's run our `curl` command from earlier to hit our local endpoint and create a user:

```bash
$ curl -H "Content-Type: application/json" -X POST http://localhost:5000/users -d '{"userId": "alexdebrie1", "name": "Alex DeBrie"}'
{
  "name": "Alex DeBrie",
  "userId": "alexdebrie1"
}
```

And then retrieve the user:

```bash
$ curl -H "Content-Type: application/json" -X GET http://localhost:5000/users/alexdebrie1
{
  "name": "Alex DeBrie",
  "userId": "alexdebrie1"
}
```

Yep, it works just like it did on Lambda.

This local setup can really speed up your workflow while still allowing you to emulate a close approximation of the Lambda environment.

#### Converting an existing Flask application

If you already have an existing Flask application, it's very easy to convert to a Serverless-friendly application. Do the following steps:

1. Install the `serverless-wsgi` and `serverless-python-requirements` packages -- `npm install --save serverless-wsgi serverless-python-requirements`

2. Configure your `serverless.yml`:

	You should have a `serverless.yml` that looks like the following:

	```yml
	# serverless.yml

	service: serverless-flask

	plugins:
	  - serverless-python-requirements
	  - serverless-wsgi

	custom:
	  wsgi:
	    app: app.app
	    packRequirements: false
	  pythonRequirements:
	    dockerizePip: non-linux

	provider:
	  name: aws
	  runtime: python3.6
	  stage: dev
	  region: us-east-1

	functions:
	  app:
	    handler: wsgi.handler
	    events:
	      - http: ANY /
	      - http: 'ANY {proxy+}'
	```

Make sure that the value for `app` under the `custom.wsgi` block is configured for your application. It should be `<module.instance>`, where `module` is the name of the Python file with your Flask instance and `instance` is the name of the variable with your Flask application.

3. Deploy your function with `sls deploy`!

**Note:** if you use other resources (databases, credentials, etc.), you'll need to make sure those make it into your application. Check out our other material on [managing secrets & API keys with Serverless](https://serverless.com/blog/serverless-secrets-api-keys/).

#### Using the Quick Start Template

If you don't have an existing Flask application to convert, but you want a well-structured starting point for an application, you can check out our [serverless-flask](https://github.com/alexdebrie/serverless-flask) application template.

To use it, you'll need the [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed. You'll also need your environment configured with [AWS credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/).

With the Framework installed, use the `sls install` command to clone the template project. Then, change into the directory and run a postsetup script to configure it as desired:

```bash
$ serverless install --url https://github.com/alexdebrie/serverless-flask --name my-flask-app
$ cd my-flask-app && npm run setup
```

Then run `sls deploy` and hit the main web page to see your starter application:

<img width="992" alt="Serverless Flask landing page" src="https://user-images.githubusercontent.com/6509926/32280095-b690a726-bee8-11e7-9a66-f92b40b4aaba.png">

You're off and running! What will you build? ⚡️
