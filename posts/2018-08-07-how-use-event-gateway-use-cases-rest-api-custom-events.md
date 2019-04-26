---
title: 'How to use the Serverless Event Gateway: build a REST API and react to custom events'
description: 'How to use the Serverless Event Gateway (part of the Serverless Platform) to build REST APIs and react to custom events.'
date: 2018-08-07
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway/event-gateway-thumb1.png'
authors:
  - AlexDeBrie
---

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway/event-gateway-use-cases.png">

Last week, we announced the [Serverless Platform Beta](https://serverless.com/blog/serverless-platform-beta-helps-teams-operationalize-development/), a single toolkit that provides everything teams need to operationalize serverless development. The Serverless Platform is made of three components—the Serverless Framework for deploying applications, the Serverless Dashboard for visualizing your application, and the Event Gateway for routing events to compute.

I'm going to focus on the Event Gateway for this post. We'll learn about two use cases of the Event Gateway:

* Building REST APIs
* Reacting to custom events

Let's get started!

## Event Gateway: when you should use it

We built the [Event Gateway](https://serverless.com/event-gateway/) to be the centralized event hub for the serverless ecosystem. Rather than scattered point-to-point integrations across your infrastructure, all events will flow into a single Event Gateway.

You can then configure the Event Gateway to react to these events as you want, in multiple different ways. For example, if a new user signs up and a `user.created` event is emitted into the Event Gateway, your marketing team may have a subscribed function that sends them a welcome email, while your development team may have a function that inserts the new user into Elasticsearch to power search functionality in your application.

## Getting set up with the Serverless Platform

The [Event Gateway is an open-source project](https://github.com/serverless/event-gateway) that you can run yourself on your own infrastructure. We also provide a hosted version of the Event Gateway with the Serverless Platform Beta for quickly getting started with the Event Gateway.

**Note:** This section assumes you have already installed the Serverless Framework and have configured your terminal with AWS credentials. If this is not true for you, check out our longer [guide to getting started with the Serverless Platform](https://github.com/serverless/platform/blob/master/docs/getting-started.md).

You will need to sign up for a Serverless Platform account. If you already have the [Serverless Framework](https://github.com/serverless/serverless) installed, you can create a Serverless Platform account by entering the following command into your terminal:

```bash
serverless login
```

This will open a browser window to create a Serverless Platform account. Once your account is created, the proper credentials will be returned to your terminal for easy command-line deploys.

Once you've signed up for an account, create a new application in the [Dashboard](https://dashboard.serverless.com). You can do this by clicking the red `+ App` button. When you create a new application, you will get an application URL in the form of `<tenant>-<app>.slsgateway.com`. This is the URL to which you will emit your Event Gateway events.

Make sure you have your tenant name, app name, and application URL available as you will need them in the following sections.

## Creating and deploying your first service

We will be using the code in the [Event Gateway Getting Started repo](https://github.com/serverless/event-gateway-getting-started). You can clone this service into your terminal with the following command:

```bash
serverless create --template-url https://github.com/serverless/event-gateway-getting-started/tree/master/ --path event-gateway-getting-started
```

Then change into your service directory and install the dependencies:

```bash
cd event-gateway-getting-started
npm i
```

Open the `serverless.yml` file and edit the `tenant` and `app` values to be your Tenant and App name from the Serverless Platform:

```yml
# serverless.yml

tenant: <your-tenant-here>
app: <your-app-here>
```

Then, deploy your application:

```bash
serverless deploy
```

With your application deployed, it's time to interact with your service.

## Using Event Gateway for a REST API

One of the more popular use cases for the Event Gateway is to create a REST API. REST APIs have grown in popularity recently with the advent of single-page apps and microservices. 

Functions-as-a-service (FaaS) providers like AWS Lambda, Google Cloud Functions, and Azure Function have made it easier than ever to deploy compute to production. With the Event Gateway, you can connect an HTTP path and method to a serverless function for your REST API.

To see how this is done, look at your `serverless.yml`. There is a `functions` block that describes the functions your service will deploy to AWS Lambda. Look at the top two functions in particular, as shown below:

```
functions:
  getUser:
    handler: handler.getUser
    events:
      - eventgateway:
          type: sync
          eventType: http.request
          path: /users/:id
          method: GET
  createUser:
    handler: handler.createUser
    events:
      - eventgateway:
          type: sync
          eventType: http.request
          path: /users
          method: POST
```

For both `getUser` and `createUser`, the function's handler is defined. Then, the _events_ to which we want these functions described are listed. You can think of it like "If this, then that"—"If an HTTP POST request arrives on the `/users` path, then call the createUser function in the Event Gateway."

You can test that your REST API works by issuing an HTTP request with `curl` in your terminal. The `curl` request should go to your application URL that you configured in your terminal, in the format of `https://<tenant>-<app>.slsgateway.com`.

Run the following command to issue a POST request to `/users` to create a new user:

```bash
$ APP="https://<tenant>-<app>.slsgateway.com"
$ curl -X POST -H "Content-Type: application/json" ${APP}/users \
    --data '{
    	"id": "10",
    	"firstName": "Donald",
    	"lastName": "Duck",
    	"email": "donald.duck@disney.com"
    }'

# {"id":10,"firstName":"Donald","lastName":"Duck","email":"donald.duck@disney.com"}
```

You should get a response returning the user that was created.

Your AWS Lambda function will receive an event object in [CloudEvents format](https://github.com/cloudevents/spec). CloudEvents is a CNCF hosted project for describing event data in a common way. In our request above, the `event` received by our Lambda function will look similar to the following:

```json
{ "eventType": "http.request",
  "cloudEventsVersion": "0.1",
  "source": "https://serverless.com/event-gateway/#transformationVersion=0.1",
  "eventID": "f2f6b58d-b20a-4d23-bc41-4c3388057752",
  "eventTime": "2018-08-04T17:50:05.573211588Z",
  "extensions":
   { "eventgateway": { "transformation-version": "0.1", "transformed": "true" } },
  "contentType": "application/json",
  "data":
   { "headers":
      { "Accept": "*/*",
        "Content-Length": "128",
        "Content-Type": "application/json",
        "User-Agent": "curl/7.54.0",
        "X-Amzn-Trace-Id": "Root=1-5b65e74d-5248534899080846fc9ac954",
        "X-Forwarded-For": "97.119.150.102",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https" },
     "query": {},
     "body":
      { "email": "donald.duck@disney.com",
        "firstName": "Donald",
        "id": "10",
        "lastName": "Duck" },
     "host": "mytenant-myapp.slsgateway.com",
     "path": "/users",
     "method": "POST",
     "params": {} 
   }
}
```

In the `data` object, you can see all the parameters of our HTTP request, including the `headers`, `body`, and `path`. You can use this information in the business logic of your Lambda function.

You can then retrieve that user by issuing a GET request to the `/users/10` path:

```bash
$ APP="<appURL>"
$ curl -X GET ${APP}/users/10

# {"id":"10","email":"donald.duck@disney.com","firstName":"Donald","lastName":"Duck"}
```

As you can see, the Event Gateway can easily be used to handle REST API workloads with pay-per-use, infinitely scalable serverless functions.

## Using the Event Gateway with custom events

The REST API use case is a pattern with which most developers are familiar, and it's a great way to get started with the Event Gateway. However, my favorite part of the Event Gateway is using custom events to asynchronously react to events that are happening across my application architecture.

First, let's see an example in action. Then we'll talk about why it's so important.

In the previous section, we created a new user by making a POST request to our `/users` endpoint. If you look at the `createUser` function in the `handler.js`, you'll see the following snippet of code after the user is saved to the database:

```js
eventGateway
  .emit({
    eventID: '1',
    eventType: 'user.created',
    cloudEventsVersion: '0.1',
    source: '/services/users',
    contentType: 'application/json',
    data: params.Item
  })
  .then(() => console.log('Emitted user.created event'))
```

In this snippet, the function is using the `emit()` function in the [Event Gateway SDK](https://github.com/serverless/event-gateway-sdk) to emit a `user.created` event into our Event Gateway. This event contains the details of the user that was created.

Now take a look at the `functions` block of your `serverless.yml` again. The third function listed looks as follows:

```yml
functions:
  ...
  emailUser:
    handler: handler.emailUser
    events:
      - eventgateway:
          type: async
          eventType: user.created
```

The `emailUser` function is subscribed to the `user.created` event type and reacts in an `async` manner. In this simple example, this could be your on-boarding team sending a "Welcome!" email to your application's new user.

This is a powerful pattern. One portion of your application emits events indicating that something happened—a new user was created, an IoT light went on, or a video was viewed—and other parts of your application can receive those events and react as needed, by sending an email, storing to an analytics database, or alerting an on-call engineer.

### Event Gateway use cases

We're seeing more and more of this reactive, event-driven pattern using asynchronous communication. Microservices have allowed for teams to independently develop and scale their application components, while tools like Kafka help with asynchronous communication between microservices. For those of you that are front-end engineers, you might see Event Gateway custom events as similar to Redux actions and reducers but used in your application backend.

While the `user.created` event only has one subscription in this example, you can add any number of additional subscriptions. Do you want to insert this newly-created user into Elasticsearch to power discoverability in your application? Does your sales team want to get notified if the new user works for an enterprise company? You can add additional subscriptions without affecting existing subscriptions and without updating code for the original producer.

The Event Gateway is designed to democratize the accessibility of these events by connecting them to serverless functions. Just like FaaS democratized compute, the Event Gateway democratizes events.

### How you can contribute

The Event Gateway is in active development, and we're looking to make it easier to import events from your existing infrastructure, such as Kafka, Kinesis, RabbitMQ, and more. If you're interested, check out the [Event Gateway repository](https://github.com/serverless/event-gateway) and get involved!
