---
title: Serverless (FaaS) vs. Containers (CaaS) - When should you pick which technology?
description: Docker, Kubernetes, Serverless? Let's discuss the different technologies and discover their up- and downsides. 
date: 2017-09-14
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-vs-containers.png
authors:
  - PhilippMuns
---

Serverless computing and containerization are clearly the hottest topics in the Cloud Computing world right now.

Both technologies enable you a way to build a modern and future-proof architecture while leveraging the latest learnings in distributed systems and large-scale application development. You might have read success stories or even toyed around with both technologies, but which one is the best choice for your use-case?

In this blog post we’ll take a deeper dive into both technologies. We’ll learn the commonalities and distinctions between the technologies. What are the advantages and disadvantages of both? After reading this article you should have a decent understanding and be able to pick the technology which will power your next project.

# How did we got here?

Before we jump right into the details about containers and serverless architectures let’s take a step back and analyze how we got here.

[INSERT IMAGE OF THE EVOLUTION HERE?!]

## 1. Physical servers

In the beginning we started by building our own Infrastructure in the form of physical servers. After that we deployed our code on those machines. All those processes were very slow and manual.

## 2. Server clusters and VMs

Using one physical Server for one application is a waste of resources. That’s why the next evolutionary step was to combine multiple physical servers into a cluster and use so-called virtual machines to run multiple applications in isolation on top of this infrastructure. Deployment and management got way faster and easier. However most of the server administration was necessary and very manual.

## 3. Entering the cloud (IaaS)

Setting up and operating an own datacenter comes with new operational challenges. Cloud computing was the answer to tackle those issues. Why not renting servers and the operational services individually for a monthly fee? This approach made it way easier to scale up and down and move faster.

## 4. PaaS, CaaS, Faas, XaaS

While renting servers and operational services in a cloud environment is a convenient way to build large-scale applications it still comes with the downsides of manual administration. „Are the latest security fixes installed?“, „When should we scale down / up?“, „How many more servers do we need?“. Wouldn’t it be great if all those administrative hassles were taken off of us and we can simply focus on our application and the business value we provide?

# FaaS / Serverless

The most basic definition of a FaaS / serverless setup is that the whole application / business logic is implemented as „Functions“ and „Events“. The monolithic application is split up into different functionalities which are in return triggered by events. Simply upload your function code and attach an event source to it. That’s it. The cloud provider will take care of the rest and ensures that your functions will always be available and usable, no matter what.

FaaS (Functions-as-a-Service) gained massive attention when the Lambda computer service was introduced by AWS in TK. While still young and immature, first businesses embraced the new technology and built the first event-driven / serverless applications.

In the beginning the workloads were pretty limited and focused around smaller jobs such as image / data manipulation. However the introduction of API Gateway as an event source for Lambda functions changed everything. From now on it was possible to create whole APIs which were powered by serverless computing. Over the course of the years more and more AWS services introduced integrations with the AWS Lambda compute offering which made it possible to build even larger, more complex applications which were fully powered by a serverless architecture.

While AWS was one of the first cloud providers which decided to take a first stab at serverless computing they’re not the only choice you have nowadays. Other providers such as Google Cloud Functions, Microsoft Azure or IBM Cloud Functions have similar compute offerings in their portfolio.

A serverless architectures key-characteristics are the following:
- Event-driven workflow („If X then Y“)
- pay-per-execution
- Zero administration
- Auto-scale
- Short-lived, stateless functions

## Advantages

Serverless architectures come with lots of benefits compared to traditional application architectures. Such advantages are:

- Zero administration
- Pay per execution
- Never pay for idle
- Auto scale
- Microservice nature —> Clear codebase separation
- Faster time-to-market

## Disadvantages

While reducing the administration and maintenance burden, serverless applications come with disadvantages of their own:

- No standardization (the CNCF is working on this)
- Black box
- Vendor lock-in
- Cold starts
- Really complex apps are hard to build

# CaaS / Containers

Wouldn’t it be nice if one could pack the application with all its dependencies into a dedicated box and run int anywhere? No matter what software dependencies the host system has installed or where and what the host system actually is? That’s the idea of containerization. Simply create a container which has all the required dependencies pre-installed, put your application code inside of it and run it everywhere where the container runtime is installed.

Containerization gained lots of attention when Google shed some light into their usage of such technologies to power their Google services such as Gmail or Maps in their massive datacenters. However using this technology was still cumbersome and required lots of deep knowledge about Linux kernel internals and the setup of some home-grown scripts to put an application in a container and run it on a host machine.

Everything changed when dotcloud (a then PaaS startup from San Francisco) announced their tooling called Docker at [Pycon US 2013](https://www.youtube.com/watch?v=wW9CAH9nSLs). Docker was an easy to user CLI tool which made it possible to manage software container easily. The startup dotcloud pivoted to become Docker and Google worked on an OpenSource implementation of the „Borg“ container orchestration service which is called Kubernetes.

More and more enterprises adopted containers which made it necessary to define standards around this new technology. Nowadays nearly each-and-every cloud provider offers a way to host containerized applications on their infrastructure.

## Advantages

Containers come with great advantages such as:

- Control and Flexibility
- Vendor-agnostic
- Easier migration path
- Portability

## Disadvantages

However having more flexibility als means more manual intervention and other downsides:

- Administrative work (e.g. apply security fixes for containers)
- Scaling is slower
- Running costs
- Hard to get started
- Too many choices for container runtimes and tooling

# When to choose what?!

TBD
