---
title: "Serverless + Containers: Kubernetes native functions available via Kubeless"
description: Kubeless is a Kubernetes-native way to deploy and manage your serverless functions via the serverless framework
date: 2017-08-30
layout: Post
thumbnail: https://raw.githubusercontent.com/kubernetes/kubernetes/master/logo/logo.png
authors:
  - DavidWells
---

One of the primary goals of the serverless is to provide a **platform-agnostic cloud experience** for developers.

You write your code once and you have the freedom to choose where it runs.

That's why we are super stoked to to announce the latest serverless provider integration: **Kubeless**

Made by the the fine folks over at [Binami](https://bitnami.com/), Kubeless is a Kubernetes-native way to deploy and manage your serverless functions via the serverless framework.

[Kubeless](https://github.com/kubeless/kubeless) lets you deploy small bits of code without having to worry about the underlying infrastructure. It leverages Kubernetes resources to provide auto-scaling, API routing, monitoring, troubleshooting and more.

## About Kubeless

<iframe width="560" height="315" src="https://www.youtube.com/embed/ROA7Ig7tD5s" frameborder="0" allowfullscreen></iframe>

This integrations brings **functions** and **events** into your Kubernetes cluster.

Let's explore those two main concepts and how they pertain to Kubeless.

### Functions

A Function is an Kubeless Function. It's an independent unit of deployment, like a microservice. It's merely code, deployed in the cloud, that is most often written to perform a single job such as:

- Saving a user to the database
- Processing a file in a database
- Performing a scheduled task (To be added in newer versions)

You can perform multiple jobs in your code, but we don't recommend doing that without good reason. Separation of concerns is best and the Framework is designed to help you easily develop and deploy Functions, as well as manage lots of them.

### Events

Anything that triggers an Kubeless Event to execute is regarded by the Framework as an Event. Events are platform events on Kubeless such as:

- An API Gateway HTTP endpoint (e.g., for a REST API)
- A Kafka queue message (e.g., a message)
- A scheduled timer (e.g., run every 5 minutes) (To be added in newer versions)

[See list of supported events](https://serverless.com/framework/docs/providers/kubeless/events/)

### Services

Functions and events are grouped together in services and configured with a `serverless.yml` file. `serverless.yml` is where you define your Functions and the Events that trigger them. Continue reading for an example at the end of this post.

**Note:** serverless services are not to be confused with [Kubernetes services](https://kubernetes.io/docs/concepts/services-networking/service/)

## Serverless + Kubeless for on-prem functions

Not a day goes by without a user of the framework shooting us an email asking about on-prem support.

It's a widely requested feature and Kubeless delivers on-premise to the enterprise.

We are very excited to see what people start building with it.

## Getting Started with Serverless & Kubeless

Make sure you have the serverless framework installed on your machine.

```bash
# Install serverless framework if you haven't already
npm i serverless -g
```

Then create a new service with the `sls create` command.

```bash
# Create a new Serverless Service/Project
$ serverless create --template kubeless-python --path new-project
# Change into the newly created directory
$ cd new-project
# Install npm dependencies
$ npm install
```

Kubeless runs on Kubernetes, therefor you need a working Kubernetes cluster in order to run it.

See the guide on [installing Kubeless in your Kubernetes cluster](/framework/docs/providers/kubeless/guide/installation/) to finish setup.

### Project Structure

Below is a quick overview of the `kubeless-python` template for an example hello world python service running on Kubeless. For an in-depth overview of kubeless, see the [provider docs](/framework/docs/providers/kubeless/).

```bash
|- handler.py # function code
|- package.json # function deps
|- serverless.yml # service configuration
```

The `serverless.yml` defines what functions will be deployed and what events they respond to.

```yaml
# The service name
service: hello-world

# Where the service lives
provider:
  name: kubeless
  runtime: python2.7

# Adding kubeless provider functionality
plugins:
  - serverless-kubeless

# Functions to be packaged and deployed
functions:
  hello:
    handler: handler.hello
```

The simple python code returns a simple JSON response.

```python
import json

def hello(request):
    body = {
        "message": "Go Serverless v1.0! Your function executed successfully!",
        "input": request.json
    }

    response = {
        "statusCode": 200,
        "body": json.dumps(body)
    }

    return response
```

### Deployment

After hooking up kubeless to your Kubernetes cluster you can deploy your functions with:

```bash
serverless deploy -v
```

The Serverless Framework translates all syntax in serverless.yml to the Function object API calls to provision your Functions and Events.

For each function in your serverless.yml file, Kubeless will create an Kubernetes Function object and for each HTTP event, it will create a [Kubernetes service](https://kubernetes.io/docs/concepts/services-networking/service/).

## Links and Resources

Here’s what you need to get started with the Kubeless plug-in now:

[Start here](/framework/docs/providers/kubeless/guide/quick-start/) in our docs.

#### [GitHub repo](https://github.com/kubeless/kubeless)

#### [Kubeless Example](https://github.com/kubeless/kubeless/tree/master/examples)

#### [Kubeless Docs](https://serverless.com/framework/docs/providers/kubeless/)

If you have questions or comments about the integration, we'd love to hear from you in the comments below or over on the [serverless forums](https://forum.serverless.com/).
