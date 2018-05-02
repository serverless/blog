---
title: "Fn Brings Containerized Cloud Agnostic Functions to a cloud near you"
description: The Fn project is an open-source container-native serverless platform that you can run anywhere -- any cloud or on-premise
date: 2018-05-02
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/fn-thumb.jpg
authors:
  - DavidWells
---

Back in October, Oracle first announced the open source [fn project](http://fnproject.io/) at the JavaOne conference. Since then, the team here at Serverless has kept a keen eye on the project.

More function providers means more freedom for FAAS users & less vendor lock in. This is one of our driving principles behind the [serverless framework](https://serverless.com/framework/docs/).

So it was only natural to bring the fn project into the growing list of [serverless function providers](https://serverless.com/framework/docs/providers/) 🎉.

## About Fn

The fn project uses a vendor agnostic approach leveraging containers to allow organizations run fn on premise or in their cloud of choice.

Another driving force behind the project is the idea that a clear separation of serverless & container orchestration is important. So, fn is also agnostic when it comes to your container orchestration of choice. Whether it's kubernetes or any of the other games in town.

Watch this 10 minute video for a quick overview on the project and a sweet demo of their FN flow component.

<iframe width="560" height="315" src="https://www.youtube.com/embed/7bUnlTK_WTo?start=125" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

The platform is container-native, enabling users to write functions in any programming language with excellent support for local development and testing. Fn even allows devs to “bring their own Dockerfile” such that ANY containerized code can be used as a function.

**The Fn Project consists of 4 major components:**

**Fn Server** is the Functions-as-a-Service system that allows developers to easily build, deploy, and scale their functions into a multi-cloud environment

The **Fn Load Balancer** (Fn LB) allows operators to deploy clusters of Fn servers and route traffic to them intelligently. Most importantly, it will route traffic to nodes where hot functions are running to ensure optimal performance, as well as distribute load if traffic to a specific function increases.

**Fn FDK’s** — Function Development Kits, aimed at quickly bootstrapping functions in all languages, providing a data binding model for function inputs, make testing your functions easier, as well as lay the foundation for building more complex serverless applications.

**Fn Flow** allows developers to build and orchestrate higher level workflows of functions all inside their programming language of choice. It makes it easy to use parallelism, sequencing/chaining, error handling, fan in/out, etc., without learning complicated external models built with long JSON or YAML templates.

For more information on the fn project and why they built it, I highly recommend checking out [this post](https://medium.com/fnproject/8-reasons-why-we-built-the-fn-project-bcfe45c5ae63).

## Fn + Serverless Framework

<img align="right" width="160" height="160" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/fn-thumb.jpg">

Starting today, you can now deploy your fn functions using the serverless framework & the familiar `serverless.yml` config we have all grown to know and love 🎉.

## Getting Started with Serverless & Fn

Make sure you have the serverless framework installed on your machine.

```bash
# Install serverless framework if you haven't already
npm i serverless -g
```

Then create a new service with the `sls create` command and supply the newly added `fn-nodejs` or `fn-go` templates.

```bash
# Create a new Serverless Service/Project
$ serverless create --template fn-nodejs --path new-fn-project
# Change into the newly created directory
$ cd new-fn-project
# Install fn provider dependency
$ npm install
# Install the function code dependencies
$ cd hello && npm install
```

Fn functions run in Docker containers, therefore you need a running fn service in order to run it.

See the guide on [installing Fn](https://serverless.com/framework/docs/providers/fn/guide/installation/) to finish setup.

### Project Structure

The Fn project structure is similar to all other serverless framework providers work with one tiny difference.

Instead of a `handler` property pointing to where the code lives, the function code location is driven by convention.

![fn-sls-code-ref-structure](https://user-images.githubusercontent.com/532272/39499387-620821c6-4d62-11e8-9be3-e09a2e9a61e9.jpg)

The function key will reference the folder path and inside of that folder path it will look for a `func.[Your Runtime]` a.k.a `func.js` or `func.go`.

So the below serverless.yml is looking for a `./hello/func.js` file when `sls deploy` is ran.

```yml
# The `service` block is the name of the service
service:
  name: hello-world

# The `provider` block defines where your service will be deployed
provider:
  name: fn

plugins:
  - serverless-fn

# The `functions` block defines what code to deploy
functions:
  hello: # <- hello references the ./hello folder and the func.js file inside
    name: hello
    version: 0.0.1
    format: json
    runtime: node
    events:
        - http:
            path: /hello-there
```

### Deployment

To deploy simply run the deploy command

```bash
serverless deploy
```

Use this method when you have updated your Function, Event or Resource configuration in `serverless.yml` and you want to deploy that change (or multiple changes at the same time) to your Fn cluster.

### How It Works

The Serverless Framework translates all syntax in `serverless.yml` to [Fn](https://github.com/fnproject/fn) calls to provision your Functions.

For each function in your `serverless.yml` file, Fn will create an Fn Function.

For example, let's take the following example `serverless.yml` file:

```yaml

service: hello-world

functions: # Your "Functions"
  hello:
    name: hi
    version: 0.0.1
    runtime: go
    events:
        - http:
            path: /hello

```

When deploying that file FN will provide you with one endpoint that you can hit at: `FN_API_URL/r/hello-world/hello`

## Links and Resources

Here’s what you need to get started with the fn plugin now:

- [GitHub repo](https://github.com/fnproject/serverless-integration/)
- [Serverless + Fn Docs](https://serverless.com/framework/docs/providers/fn/)
- [Fn Homepage](http://fnproject.io/)

If you have questions or comments about the integration, we'd love to hear from you in the comments below or over on the [serverless forums](https://forum.serverless.com/).

We can't wait to see what you build.
