---
title: "Fn Project Brings Containerized Function to your cloud of choise & on-prem"
description: The Fn project is an open-source container-native serverless platform that you can run anywhere -- any cloud or on-premise
date: 2018-05-02
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/fn-thumb.jpg
authors:
  - DavidWells
---

Intro here

## Introducing Fn

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
$ serverless create --template NAME-OF-TEMPLE --path new-project
# Change into the newly created directory
$ cd new-project
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
