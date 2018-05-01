---
title: "Fn Project Brings Containerized Function to your cloud of choise & on-prem"
description: The Fn project is an open-source container-native serverless platform that you can run anywhere -- any cloud or on-premise
date: 2018-05-02
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/fn-thumb.jpg
authors:
  - DavidWells
---

On October 2nd 2017, Oracle first announced the open source [fn project](http://fnproject.io/) at the JavaOne conference. Since then the team here at Serverless has kept a keen eye on the project.

More function providers means more freedom for FAAS users & less vendor lock in. This is one of our driving principles behind the [serverless framework](https://serverless.com/framework/docs/).

So it was more than natural to bring the fn project into the growing list of [serverless function providers](https://serverless.com/framework/docs/providers/) 🎉.

## About Fn

The fn project uses a vendor agnostic approach leveraging containers to allow organizations run fn on premise or in their cloud of choice.

Another driving force behind the project is the idea that a clear separation of serverless & container orchestration is important. So, fn is also agnostic when it comes to your container orchestration of choice. Whether it's kubernetes or any of the other games in town.

Watch this 10 minute video for a quick overview on the project and a sweet demo of their FN flow component.

<iframe width="560" height="315" src="https://www.youtube.com/embed/7bUnlTK_WTo?start=125" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

**The Fn Project consists of 4 major components:**

**Fn Server** is the Functions-as-a-Service system that allows developers to easily build, deploy, and scale their functions into a multi-cloud environment

The **Fn Load Balancer** (Fn LB) allows operators to deploy clusters of Fn servers and route traffic to them intelligently. Most importantly, it will route traffic to nodes where hot functions are running to ensure optimal performance, as well as distribute load if traffic to a specific function increases.

**Fn FDK’s** — Function Development Kits, aimed at quickly bootstrapping functions in all languages, providing a data binding model for function inputs, make testing your functions easier, as well as lay the foundation for building more complex serverless applications.

**Fn Flow** allows developers to build and orchestrate higher level workflows of functions all inside their programming language of choice. It makes it easy to use parallelism, sequencing/chaining, error handling, fan in/out, etc., without learning complicated external models built with long JSON or YAML templates.

## Fn + Serverless Framework

Starting today, you can now use fn and the serverless framework together.

<a href="http://fnproject.io/" target="_blank">
  <img width="360" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/fn-thumb.jpg" />
</a>

[Checkout the Fn Docs](https://serverless.com/framework/docs/providers/fn/)

## Getting Started with Serverless & Fn

Make sure you have the serverless framework installed on your machine.

```bash
# Install serverless framework if you haven't already
npm i serverless -g
```

Then create a new service with the `sls create` command.

```bash
# Create a new Serverless Service/Project
$ serverless create --template fn-nodejs --path new-fn-project
# Change into the newly created directory
$ cd new-fn-project
# Install npm dependencies
$ npm install
```

Fn functions run in Docker containers, therefore you need a running fn service in order to run it.

See the guide on [installing Fn](/framework/docs/providers/fn/guide/installation/) to finish setup.

### Project Structure

Project Structure here

### Deployment

How to deploy here

## Links and Resources

Here’s what you need to get started with the Fn plug-in now:

[Start here](/framework/docs/providers/fn/guide/quick-start/) in our docs.

- [GitHub repo](https://github.com/fnproject/serverless-integration/)
- [Fn Docs](https://serverless.com/framework/docs/providers/fn/)
- [Fn Homepage](http://fnproject.io/)

If you have questions or comments about the integration, we'd love to hear from you in the comments below or over on the [serverless forums](https://forum.serverless.com/).
