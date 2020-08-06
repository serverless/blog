---
title: Announcing Troubleshooting Monolambdas with Express.js and Flask
description: "You can now automatically monitor and troubleshoot monolambdas like Express.js and Flask with the Serverless Framework Pro!"
date: 2020-03-31
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/announcement_thumbnail.png"
authors:
  - FernandoMedinaCorey
category:
  - news
---

# Troubleshooting Serverless APIs

While it might feel like Express.js or Flask are more "Monolithic" approaches to serverless, it's actually a very common pattern for many different applications. And we're excited to announce that you can now deploy your Express.js and Flask microservices with the same automatic monitoring and debugging features as traditional Serverless Framework microservices.

While Serverless [Framework Pro](http://app.serverless.com/) previously had [automatic monitoring and troubleshooting](https://serverless.com/blog/troubleshoot-serverless-apis/) tools integrated out of the box, we lacked support for monolambda microservices. Developers using Express.js, Flask, Lambda API, or other development frameworks were unable to take advantage of many of the tools we offer to help review function invocations, sort invocations by API endpoint and more. That changes today.

There's a lot of information on the [Serverless Blog](https://serverless.com/blog/) and in our [dashboard documentation](https://serverless.com/framework/docs/dashboard/) about how you can leverage [Framework Pro](http://app.serverless.com/) if you haven't already had a chance to use it. But for now, let's take a look at some of the features you now have access to with monolambda applications.

# What's New for Monolambdas?

Because monolambda applications output lots to the same Amazon CloudWatch log stream, debugging monolambda applications has historically been a huge nuisance. In order to find the single API request you were looking for you'd have to dig through hundreds of unrelated logs from other API requests just to find the invocation and API endpoint you were trying to debug. With our automatic monolambda monitoring and troubleshooting tools that's no longer an issue.

You can review the API requests for all the endpoints across your monolambda application:

![Errors Overview](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/errors.png)

This starting point gives you an at-a-glance view into the successful and failed requests across your API endpoints. If you want a deeper look at particular endpoints, you can sort them by the API route in question:

![Endpoint Overview](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/endpoint_explorer.png)

The best part about this? For Express.js, Flask, and Lambda API, all these API routes are automatically sorted out for you. You don't have to instrument a single endpoint yourself. For frameworks outside of this list that want the same experience, you can leverage the Serverless SDK's [setEndpoint](https://serverless.com/framework/docs/dashboard/sdk/nodejs#setendpoint) functionality to get a similar experience.

When you find the invocation you're looking for, you'll get the same information you're used to seeing from the Framework Pro explorer monitoring:

![Endpoint Overview](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/invocation_example.png)

# Configuring Your Existing Serverless Monolambda

## Prerequisites 

So how do you get started with these new features? First, [update](https://serverless.com/framework/docs/getting-started/) your version of the Framework to the latest version. If you installed it with NPM you can use `npm update -g serverless`. You'll need v1.67.0 or greater of the Framework and v3.6.1 or greater of the Framework Pro plugin.

Next, in order to add the automated troubleshooting, you'll need to have already created a [Framework Pro](http://app.serverless.com/) account and add the `org` and `app` values inside of your `serverless.yml` file. You may need to create a new `app` for your service.

## Existing Express.js and Flask apps

If you've already created your own Express.js or Flask app and deployed it previously with the Serverless Framework, all you need to do now is run `serverless deploy` again and test out some of your endpoints. 

In the [Framework Pro Dashboard](http://app.serverless.com/) for that service you should see all your logs and troubleshooting capabilities for each route you test in your monolambda. Keep in mind, that the routes will only start to appear after you run requests against them. 

The two line configuration change and *zero changes* to your application code should trigger a new deployment with the automatic Monolambda troubleshooting and monitoring instrumentation.

## Creating a simple monolambda app

If it's your first time deploying a monolambda application with the Serverless Framework you can follow the steps below for an Express.js or Flask app before deploying and testing the new functionality.

**Express.js**

Assuming you've already installed the latest version of the Serverless Framework globally you can start your new Express.js project by installing a few dependencies.

```
npm install serverless-http --save
npm install express --save
```

Then, you can create an `index.js` file that contains your Express.js app code:

```js
// index.js
const serverless = require('serverless-http')
const express = require('express')
const app = express()

app.get('/hello/:name', function (req, res) {
  const name = req.params.name
  res.send(`Hello ${name}!`)
})

module.exports.handler = serverless(app)
```

Next, you'll have a `serverless.yml` file:

```yml
org: myorg
app: helloapp
service: express-api

provider:
  name: aws
  runtime: nodejs12.x

functions:
  app:
    handler: index.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
```

This will setup an Amazon API Gateway proxy endpoint for the `app` function which will allow any custom routes to be handled by your Express.js application. You can do this by creating a single function `app` with a handler of `index.handler` pointing towards the `handler` function we just created inside of the `index.js` file.

You'll also need to make sure that the `org` and `app` values are included in the file and reference your Framework Pro account.

From there, just run `serverless deploy` and you should get a new endpoint to test out:

![New Endpoint](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/new_endpoint.png)

From there, just load up the endpoint in to your browser and test out the `hello/name` route:

![New Endpoint](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/hello_fernando.png)

After you test the endpoint out, you should see it appear in the [Framework Pro](http://app.serverless.com/) Dashboard under the explorer for that service:

![New Endpoint](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/hello_name_explorer.png)

From there, you can add new routes, test them, and monitor and troubleshoot the rest of your application!

**Flask**

Let's try the same thing with a simple Flask application. To start, I'll assume you have Python 3 installed, along with the updated Serverless Framework version from earlier and Node/NPM.

First, run `echo Flask > requirements.txt` to create a `requirements.txt` file that you can use to install Flask and other dependencies when deploying to AWS. 

Then, create an `app.py` file that contains your Flask routes:

```py
# app.py

from flask import Flask
app = Flask(__name__)

@app.route('/hello/<name>')
def hello(name):
    return 'Hello ' + name + '!'
```

Next, create a `serverless.yml` file that you can use to deploy the app. It will have a single function that is configured using `wsgi_handler.handler` as the handler because we will be using the `serverless-wsgi` plugin to deploy our Flask application. It will also need the same HTTP events we configured earlier.

```yml
org: myorg
app: helloapp
service: flask-api

provider:
  name: aws
  runtime: python3.7

functions:
  app:
    handler: wsgi_handler.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'

custom:
  wsgi:
    app: app.app
    pythonBin: python3 # Some systems with Python3 may require this
    packRequirements: false
  pythonRequirements:
    dockerizePip: non-linux

plugins:
  - serverless-wsgi
  - serverless-python-requirements
```

If you compare to the Express.js application, you'll also notice that we have an additional `custom` and `plugins` section. These are to allow us to configure the plugins we need to deploy Python dependencies with `serverless-python-requirements` and to deploy Python monolambda apps with `serverless-wsgi`. 

Make sure to update the `app` and `org` names with your own [Framework Pro](http://app.serverless.com/) configuration.

From there, we'll need to install these plugins with:

```
npm install serverless-wsgi --save 
npm install serverless-python-requirements --save
```

After we install these plugins, we can deploy our application with `serverless deploy`! You may also need to install Docker in order to use `serverless-python-requirements`.

After your service has deployed, you should see a new endpoint to use:


![New Endpoint Flask](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/new_endpoint_flask.png)

Then, you can test the endpoint in to your browser and see how the `hello/name` route works:

![New Endpoint Flask Test](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/hello_fernando_flask.png)

Then, you will see the new endpoint appear in the [Framework Pro](http://app.serverless.com/) Dashboard with the route you used:

![Explorer Flask](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshooting-monolambdas/hello_name_explorer_flask.png)

Now, you can add new Flask routes, test them all out and continue to monitor and troubleshoot your applications!

# What Next?

Well, if you are just starting with Flask or Express.js or you're not sure how to get it working with the Serverless Framework on AWS Lambda, you can look at these guides on creating your own applications with them:

- [Deploy a REST API using Serverless, Express and Node.js](https://serverless.com/blog/serverless-express-rest-api/)
- [Build a Python REST API with Serverless, Lambda, and DynamoDB](https://serverless.com/blog/flask-python-rest-api-serverless-lambda-dynamodb/)

If you'd like a more full-fledged example application to review, you can look at an example "Survey Service" that contains a handful of entities like customers, surveys and responses to surveys. It then takes these entities, stores them in DynamoDB and makes them accessible via different API routes. I've created the service with both [Express.js and Node.js](https://github.com/fernando-mc/serverless-express) and [Python3 and Flask](https://github.com/fernando-mc/serverless-flask).
