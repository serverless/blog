---
title: Writing an Event-driven Serverless Application with Full Local Development Experience
description: Learn how to write an event-driven serverless application with full local development experience using the Serverless Application Platform.
date: 2017-09-12
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/thumbnail_domino.jpg
authors:
  - RupakGanguly
---

In my previous post on [Anatomy of a Serverless Application](https://serverless.com/blog/anatomy-of-a-serverless-app/), I lay the foundation for building a very simple application with an email service using the Serverless Framework, deployed to AWS Lambda. 

In this post, we will build `mailman`, an event-driven serverless application. The application has a simple frontend using `curl` that calls into a couple of backend services: a users service and an email service. The post will highlight event-driven application development with focus on full local development experience. We will look at services emitting, subscribing and reacting to events in a seamless manner using the Serverless Application Platform.

You will learn how to:

- Setup the development environment
- Create an application project
- Create a users service
- Create an email service
- Write an event-driven application
- Run the serverless services locally
- Run the full application locally

## Getting Started

We will look at an important aspect of writing serverless applications, i.e. local development support. We touched upon the fact that [Serverless Framework](https://serverless.com/framework/) helps with local testing of a serverless service by using `sls invoke`. But, the real productivity gain is the ability to write a serverless, event-driven application with full local development support, with provider emulation and running it without the need to deploy it to a cloud provider.

My choices:

- **Programming language**: [NodeJS](https://nodejs.org/en/)
- **The Serverless Application Platform**: It consists of
    - [Serverless Framework](https://serverless.com/framework/) (**v1.20.0 or higher**)
    - [Serverless Event Gateway](https://serverless.com/event-gateway/), the central hub of event communication
    - [Serverless Emulator](https://github.com/serverless/emulator), the local serverless provider emulator
    - [Serverless Functions Development Kit (FDK)](https://github.com/serverless/fdk), to enhance developer experience for writing severless applications 

## Setup

Let's install and setup the toolsets required for development.

1. Install NodeJS (**v6.10.3**): [download](https://nodejs.org/en/download/) or [using package manager](https://nodejs.org/en/download/package-manager/#osx)
1. Install the Serverless Framework (**v1.20.0 or higher**): `npm install -g serverless`
1. **No need** for setting up any cloud provider account. YEAH! 

> Without the step (read hurdle) of setting up a cloud provider account you have already saved so much time and hassle.

**Note**: You might wonder what happened to the **Event Gateway** and the **Emulator** setup. That's where the Serverless Framework makes it all come together. Keep reading.

With Serverless Framework already installed, we will see how to use the Event Gateway and the Emulator in order to provide a centralized event hub and a much needed local development environment. The newly added `serverless run` command downloads and runs the necessary components. 

Before we use the `serverless run` command, we need to first login to the Serverless Application Platform using the `serverless login` command:

```bash
$ sls login

Serverless: The Serverless login will open in your default browser...
Serverless: Opening browser...
Please enter the verification code here: xxxxxxxxxxxxx
Serverless: You are now logged in
```

## Event-driven Serverless Application

Let's look at three core capabilities that we need to write, test and run a serverless event-driven application: an event-driven workflow, programmatic access, and full local development experience.

### Event-driven Workflow

The tenet of an event-driven application is that the components interact with each other asynchronously via events. The components are not aware of each other and rely on a central event communication hub for relaying events across the application.  

The Event Gateway serves as the central event communication fabric for serverless applications. It acts as the broker for all event communication and allows services to publish and subscribe to events. Additionally, it acts as an API Gateway for all HTTP communication. 

The Event Gateway uses a special `http` event-type to recognize standard HTTP requests. It standardizes both pub/sub and HTTP communication to be represented as events, combining them into a single experience. Services can send custom events and the Event Gateway wraps them up in a standard event envelope passing the payload along as-is. Events from well-known SaaS providers will be recognized as first-class event-types in the near future. **"Everything as events" is the mantra.**

> Read [Event Gateway - The Missing Piece of Serverless Architectures](https://serverless.com/blog/introducing-serverless-event-gateway) for more details.
 
### Programmatic Access

To write event-driven serverless applications, its individual services need to programmatically take advantage of all the goodness of the Event Gateway features. The Serverless SDK hands that capability to the developers. The developers have access to the Event Gateway API via code for registering & invoking functions, subscribing to and emitting events, and configuration.

> Checkout the [SDK source](https://github.com/serverless/fdk) for more details.

### Local Development Support

One of the biggest challenges with developing serverless applications is to run and test the application locally. Since serverless applications are hosted on the cloud, it makes it very tedious to debug, test and develop code in an iterative manner. Although all cloud providers and the Serverless Framework allows invoking one function at a time locally, the developer wishes to run the full application locally on their machine.

The Serverless Emulator emulates different cloud provider FaaS offerings (currently AWS Lambda or Google Cloud Functions) on your local machine in an offline-focused manner. It provides that missing piece of tooling that makes application development with serverless so productive and exciting. It enables deploying and invoking serverless functions without the requirement of setting up and deploying your serverless application to the cloud provider.

> Check out the [Emulator source](https://github.com/serverless/emulator) for more details. 

### Seamless Developer Experience

To empower the developer with a great development experience, the Serverless Framework brings it all together in a very simple and intuitive interface: the `serverless run` command.

The `serverless run` command detects and installs or spins up the latest version of the Event Gateway and the Emulator. It provides a unified visual interface for the event-driven workflow for the application as they happen. It provides an intuitive and decoupled interface for the services of an application to communicate with.

In the sections that follow, we will use the example application to demonstrate these killer features.

## Creating the Application

A basic project structure shown below will work:

```bash
|-- mailman
  |-- README.md
  |-- frontend
  `-- services
```
where,

- `frontend` folder holds the frontend
- `services` folder holds the serverless service(s)

> With `sls invoke` you could test one single function at a time. But with the Serverless Application Platform, you can run the full event-driven serverless application, with events interacting across the application, locally on your machine, without signup up for any cloud provider. YEAH!
 
Let's create a couple of the backend services and then we will explore the local experience when we run the application. The way the non-serverless frontend portion of the application is written is totally your choice. In this post, I will primarily focus on the serverless portion of the application inside the `services` folder, and use a basic `curl` script to simulate the frontend.

### Goals

The application has a few business goals:

- register a user via an HTTP POST API call from the frontend
- on registration, send a welcome email to the user

The application has a few technical goals as well:

- run and test the application locally without deploying to the cloud
- have loosely-coupled services interact with the application
- visualize the event-driven workflow as it happens

## Building the Services

We will not get into the details of creating the services, but we will explore the code and dig deep into the functionality that is offered. Also, the guts of the services are mocked up, but the intention of the example is to showcase the event-driven nature of the services, so we will just focus on that.

### Building the Users Service

The workflow of the `users` service is:

- expose an HTTP endpoint for user registration,
- register a user, and finally
- **emit** an event `user.registered`

Let's look at the functions section of the `serverless.yml`:

```yaml
# users-api crud service

...
...
functions:
  register:
    handler: handler.register
    events:
      - http:
          path: /users
          method: POST
...
...          
```
Nothing different than what you are used to. 

> The important aspect to note is that the Serverless Application Platform with all its new products and enhancements is still compatible with existing serverless applications that you have built. 

**Behind the scenes**
 
Actually, there are a couple of things that the Serverless Application Platform does behind the scenes. The `serverless.yml` is parsed, and the `register` function from the `users` service is registered with the Event Gateway. Next, a subscription is created for the `http` event and the `register` function.

We will visualize this when we run the service and talk about it in the next section.

Now, let's look at the handler code:

```js
'use strict';

const fdk = require('@serverless/fdk');
const users = require('./lib/users.js');

// set event gateway urls
const EVENT_GATEWAY_URL = 'http://localhost:4000';
const EVENT_GATEWAY_CONFIG_URL = 'http://localhost:4001';

// initialize event gateway
const eventGateway = fdk.eventGateway({
  url: EVENT_GATEWAY_URL,
  configurationUrl: EVENT_GATEWAY_CONFIG_URL
});
```
In this portion of the code, we use the Serverless FDK to initialize the Event Gateway.

```js
// register function
module.exports.register = (event, context, callback) => {

  // Validation
  if (!event.data || !event.data.body || !event.data.body.email) {
    return callback(null, {
      statusCode: 400,
      body: JSON.stringify({message: 'Email is required'})
    })
  }

  // Register user
  users.register({
    email: event.data.body.email,
    name: event.data.body.name
  }, function(data) {

    // Emit event
    eventGateway
      .emit({
        event: 'user.registered',
        data: data
      })
      .then(() => {
        return callback(null, data);
      })
      .catch(err => {
        return callback({ error: err }, null);
      });
  });
};
```
This portion shows the `register` function, that first checks if an email was passed in the event body, and then registers the user. Next, on successful registration of the user, it **emits** an event `user.registered` using the FDK, passing in the user data.

### Building the Email Service

The workflow of the `email` service is:

- send a welcome email to the registered user, and
- **emit** an event `email.sent`

Let's look at the functions section of the `serverless.yml`:

```yaml
...
functions:
  sendWelcomeEmail:
    handler: handler.sendWelcomeEmail
    events:
      - user.registered
```

**Behind the scenes**
 
There are a couple of things that the Serverless Application Platform does behind the scenes. The `serverless.yml` is parsed, and the `sendWelcomeEmail` function from the `email` service is registered with the Event Gateway. Next, a subscription is created for the `user.registered` event and the `sendWelcomeEmail` function.

We will visualize this when we run the service and talk about it in the next section.

Now, let's look at the handler code, specifically the `sendWelcomeEmail` function:

```js
...
...
module.exports.sendWelcomeEmail = (event, context, callback) => {

  // TODO: Send email here...

  // Emit event 'email.sent'
  eventGateway
    .emit({
      event: 'email.sent',
      data: {
        "id": event.data.id,
        "name": event.data.name,
        "email": event.data.email
      }
    })
    .then(() => {
      return callback(null, {
        statusCode: 200,
        body: JSON.stringify({message: 'Email sent.'})
      })

    })
    .catch(err => {
      return callback({ error: err }, null);
    });
};
```
This portion shows the `sendWelcomeEmail` function, that would send out a welcome email to the user that is passed in via the event data. Next, it **emits** an event `email.sent` using the FDK, passing in the event data.

## Running the Application

Now that we understand what the application is meant to do, and having looked at the code, let's run the application. Everything will run locally on our machine. We will [run](https://github.com/serverless/serverless/pull/4034) one service at a time, [emit](https://github.com/serverless/serverless/pull/4038) and respond to events, visualize the workflow and then call the services via `curl` simulating an application user interface.

> Two new awesome commands: `serverless run` and `serverless emit` implemented as core plugins to the Serverless Framework were [released](https://github.com/serverless/serverless/blob/master/CHANGELOG.md#1200-16082017) recently.

### The Local Development Experience

The first time you **run** any service using `serverless run`, you will get a slightly different experience. Let's run the users service, and look at the visualization on the terminal:

```bash
 $ cd mailman/services/users
 $ sls run
 Serverless     Installing Event Gateway
 Serverless     Emulator initializing...
 Serverless     Emulator listening on: http://localhost:4002
 ...
 Serverless     Event Gateway initializing...
 Event Gateway  Event API listening on: http://localhost:4000
 Event Gateway  Config API listening on: http://localhost:4001
 Serverless     Event Gateway initialized
 ...
```
The required components of the Serverless Application Platform, namely the Event Gateway and the Emulator, are downloaded and installed locally on your machine unless already installed. Also, note that the individual components advertise their API endpoints. Then, these components stay in the background listening for events and ready for action.

I want to point out that this is how the **local development experience** starts for a developer. It is all inclusive, seamless and is just there for you.

### Running the Users Service

With the local development setup done, we are ready to run our `users` service.

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/blog_app_sls_run_users.gif)

There are a couple of things that are happening here:

```bash
 Serverless     Function 'users-register' loaded
 Event Gateway  Function 'users-register' registered
 Event Gateway  Subscription created for event 'http' and function 'users-register'
```

Here the Serverless Framework detects the `register` function in the `users` service and deploys it to the local Emulator.

Then the `register` function from the `users` service is registered with the Event Gateway. And, a subscription is created for the `http` event and the `register` function.

### Running the Email Service

Let's run the `email` service now.

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/blog_app_sls_run_email.gif)

There are a couple of things that are happening here:

```bash
 Serverless     Function 'email-service-sendWelcomeEmail' loaded
 Event Gateway  Function 'email-service-sendWelcomeEmail' registered
 Event Gateway  Subscription created for event 'user.registered' and function 'email-service-sendWelcomeEmail'
```

Here the Serverless Framework detects the `sendWelcomeEmail` function in the `email` service and deploys it to the local Emulator.

Then the `sendWelcomeEmail` function from the `email` service is registered with the Event Gateway. Further, a subscription is created for the `user.registered` event and the `sendWelcomeEmail` function.

### Calling the Services

To simulate an application user interface, we will use `curl` to call the user service API for registering a user. We have the current `serverless run` session running on one pane and we will run the frontend curl commands in another pane.

Run the following `curl` command on the other pane:

```bash
$ cd mailman/frontend 
$ curl -X POST \
  http://localhost:4000/users \
  -H 'content-type: application/json' \
  -d '{"name":"Rupak Ganguly", "email":"yourname@mail.com"}'

{"id":26,"session":"e40e0d06ed05f17385dee72a56cfda48","email":"yourname@mail.com","name":"Rupak Ganguly"}%
```

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/blog_app_sls_run_curl.gif)

Let's break it up and discuss what just happened.

1. Event Gateway receives the `http` event `POST http://localhost:4000/users`

    ```bash
     Event Gateway  Event 'http' received:
    
      {
        "event": "http",
        "id": "825e723f-dc75-4368-bd43-abf26b28d46d",
        "receivedAt": 1505103914033,
        "data": {
          "headers": {
            "Accept": [
              "*/*"
            ],
            "Content-Length": [
              "52"
            ],
            "Content-Type": [
              "application/json"
            ],
            "User-Agent": [
              "curl/7.54.0"
            ]
          },
          "query": {},
          "body": {
            "email": "yourname@mail.com",
            "name": "Rupak Ganguly"
          },
          "path": "/users",
          "method": "POST"
        },
        "dataType": "application/json"
      }
    ```
2. The `http` event triggered the `register` function from the `users` service. The `register` function emitted an `user.registered` event, which was received by the Event Gateway. You can see the data payload for the event as well.

    ```bash
     Serverless     Function 'users-register' triggered by event 'http'
    
     Event Gateway  Event 'user.registered' received:
    
      {
        "event": "user.registered",
        "id": "77071ceb-459e-4eb6-a8ba-813a75d39567",
        "receivedAt": 1505103914805,
        "data": {
          "email": "yourname@mail.com",
          "id": 79,
          "name": "Rupak Ganguly",
          "session": "e40e0d06ed05f17385dee72a56cfda48"
        },
        "dataType": "application/json"
      }
    ```
3. The `user.registered` event triggered the `sendWelcomeEmail` function from the `email` service. Then, the `register` function which had started async in Step 2, finishes.

    ```bash
     Serverless     Function 'email-service-sendWelcomeEmail' triggered by event 'user.registered'
    
     Serverless     Function 'users-register' finished:
    
      {
        "id": 79,
        "session": "e40e0d06ed05f17385dee72a56cfda48",
        "email": "yourname@mail.com",
        "name": "Rupak Ganguly"
      }
    ```
4. Then the `email.sent` event emitted by `sendWelcomeEmail` function is received by the Event Gateway. Then, the `sendWelcomeEmail` function which had started async in Step 3, finishes.

    ```bash
     Event Gateway  Event 'email.sent' received:
    
      {
        "event": "email.sent",
        "id": "227979c0-667e-4b0f-a9e8-dae8d750fa85",
        "receivedAt": 1505103915082,
        "data": {
          "email": "yourname@mail.com",
          "id": 79,
          "name": "Rupak Ganguly"
        },
        "dataType": "application/json"
      }
    
     Serverless     Function 'email-service-sendWelcomeEmail' finished:
    
      {
        "statusCode": 200,
        "body": "{\"message\":\"Email sent.\"}"
      }
    ```  

That concludes the discussion about the application. 

Hopefully, you followed the workflow I laid out and can see how easy it is to write an event-driven serverless application that can be tested and run locally.

The terminal visualization during development is crucial to debugging and tracing async event-driven applications, and can greatly help speed up application development cycles. 

> Code: Get the [full source code](https://github.com/rupakg/mailman) to the `mailman` application project on Github.

## Summary

The serverless event-driven application that we created was limited to a couple of services to keep it simple and easy to follow. We have a [reference example application](https://github.com/serverless/event-gateway-example) that showcases many other event-driven use cases utilizing a variety of services, spanning multiple cloud providers.
