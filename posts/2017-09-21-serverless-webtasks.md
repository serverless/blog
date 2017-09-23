---
title: Webtasks brings node 8, no cold starts, and streamlined on-boarding to Serverless
description: Eliminate cold starts and get from zero to deploy in under 3 minutes with the Auth0 Webtasks provider integration
date: 2017-09-21
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/webtasks-icon.png
authors:
  - DavidWells
---

When we set out to build the Serverless Framework, we wanted to streamline how developers build things and how they interact with cloud providers.

We strive to get developers to the "aha" 💡 moment of the serverless experience as soon a possible. This moment where their eyes light up & they see the world of possibilities that functions-as-a-service world opens to them.

We work day and night (thanks team Europe), towards streamlining the developer experience but still one of biggest hurdles we have is getting new developers setup with a functions provider.

It's not impossible but it sure ain't easy. **Until now.**

Welcome [Auth0 Webtasks](https://webtask.io/) as a the newest deployment targets and [functions provider](https://serverless.com/framework/docs/providers/) to the Serverless Framework 🎉.

<a href="https://webtask.io/">
  <img src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/webtasks-logo.png">
</a>

## Auth0 Webtasks

[Born out of Auth0 rules](https://www.youtube.com/watch?v=a7FnBNzUj70), Webtasks allows users to write & deploy nodeJS code without having to think about the underlying server.

<iframe width="560" height="315" src="https://www.youtube.com/embed/vy4aUajDShQ" frameborder="0" allowfullscreen></iframe>

Using the [serverless webtasks integration](https://github.com/auth0/serverless-Webtasks/) allows framework users to write their serverless services using the standard `serverless.yml` configuration and deploy functions into Auth0 Webtasks.

## How is Webtasks different?

### 1. Setup takes about a minute and 30 seconds

Setup takes about a minute and 30 seconds. Watch the video above.

### 2. Node 8 support

Node 8 runtime support. This allows users to use the latest and greatest JS today without needing to transpile their code. 🎉

### 3. Persistent storage

There is also small [persisted state](https://webtask.io/docs/storage) that you can re-use within functions. This is currently limited to a 500k json doc.

### 4. No cold starts

That's right, **no cold starts** (*drops mic*). If you have something that needs to be super snappy, say a backend API, I'd suggest running that through a Webtasks function to avoid cold start latency.

One thing to note: There is a soft limit of 1 request per second on the Auth0 Webtasks free tier.

## Some Webtasks Use Cases

Inside your Webtask functions you have full access to the [npm ecosystem](https://www.npmjs.com/) to pull in your favorite modules to get the job done.

Here are some common use cases for Webtask functions:

- setting up webhook listeners
- running chat bots & slack automation
- glue code & data transformation
- backend apis for static sites
- handling site forms
- github automation
- payment processing with stripe
- ...(use your imagination)

## Getting Started

It's incredibly easy to get started with Webtasks. You can be up and running in 1 minute (or 2:30 minutes) as seen here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/zHp4OO8xfkY" frameborder="0" allowfullscreen></iframe>

We will be setting up Webtasks with the `sls create` service command. You can also install the [serverless-webtasks plugin](https://github.com/auth0/serverless-Webtasks/) in an existing service to deploy your functions to Webtasks.

### Pre-requisites

Make sure you have nodeJS installed on your machine and also the Serverless Framework

```bash
# install serverless globally
npm install serverless -g
```

### Create Your Webtask service

```bash
# generate a webtasks starter template
serverless create --template webtasks-nodejs --path my-new-webtask-service
```

### Install the Webtask plugin

Inside the `my-new-webtask-service` directory run:

```bash
npm install
```

### Config your Webtasks account

```bash
serverless config credentials --provider webtasks
```

Then enter your email or phone number and verify the code.

Thats it. You are setup and ready to deploy live code.

### Deploy your Webtasks service

Inside the `my-new-webtask-service` directory run:

```bash
serverless deploy
```

This will package your code and deploy it into the Webtasks cloud.

The CLI will return your live function endpoint for you to use in your app.

```bash
Serverless: Packaging service...
Serverless: Packaging disabled for function: "main"
Serverless: Deploying function: main...
Serverless: Successfully deployed function: main
Service Information
service: webtasks-nodejs
stage: dev
endpoints:
  * - https://wt-31e332423432391d99fb-0.sandbox.auth0-extend.com/Webtasks-nodejs-dev-main
functions:
  main: webtasks-nodejs-dev-main
```

## Resources and links

- [Serverless + Webtasks Docs](https://serverless.com/framework/docs/providers/Webtasks/)
- [serverless-webtasks plugin repo](https://github.com/auth0/serverless-Webtasks/)
- [Webtasks Main Docs](https://webtask.io/docs/101)
