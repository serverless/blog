---
title: "The Serverless Framework Knative Integration"
description: "A look at our Knative Integration and the context around it."
date: 2020-01-24
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-01-knative-tutorial/knative-integration_blog-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-01-knative-tutorial/knative-integration_blog.png"
category:
  - news
authors:
  - PhilippMuns
---

## Modern Microservices - Containers and Serverless

Over the last decade a lot has changed in the Cloud Computing landscape. While most of the application workloads were deployed as monolithic applications on dedicated servers or VMs in early 2009, we are now seeing a shift towards smaller and self-contained units of application logic which are deployed individually and together make up the whole application. This pattern of application development and deployment is often dubbed ["Microservice Architecture"](https://martinfowler.com/articles/microservices.html). Its adoption was greatly accelerated when Docker, a container creation and management software [was first released in early 2013](https://news.ycombinator.com/item?id=5445387) and Google decided to [Open Source Kubernetes](https://github.com/kubernetes/kubernetes/commit/2c4b3a562ce34cddc3f8218a2c4d11c7310e6d56), a container orchestration system.

Nowadays complex applications are split up into several services, each of which deals with a different aspect of the application such as "billing", "user management" or "invoicing". Usually different teams work on different services which are then containerized and deployed to container orchestration systems such as Kubernetes.

Given that such software containers are self-contained and include all the necessary libraries and dependencies to run the bundled application, AWS saw a potential to offer a hosted service based on such containerized environments where individual functions could be deployed and hooked-up to existing event sources such as storage buckets which in turn invoke the function whenever they emits a events. It announced their new service offering called [AWS Lambda in 2014](https://www.youtube.com/watch?v=9eHoyUVo-yg).

While initially invented to help with short-lived, data processing related tasks, AWS Lambda quickly turned into the serverless phenomenon where applications are now split up into different functions which are executed when infrastructure components such as API Gateways receive a request and emit an event. We at Serverless, Inc. invested heavily in this space and released the [Serverless Framework](https://github.com/serverless/serverless) CLI, our Open Source tooling which makes it easier than ever to deploy, manage and operate serverless applications.

Given the huge adoption of serverless technologies due to their properties such as cost-, management, and resource-efficiency, Google decided to [open source Knative](https://cloudplatform.googleblog.com/2018/07/bringing-the-best-of-serverless-to-you.html), a Serverless runtime environment which runs on top of Kubernetes in 2018. Since its inception several companies joined the [Knative](https://knative.dev/) effort in making it easier than ever to deploy and run serverless workloads on top of Kubernetes.

## Containers vs. Serverless

Given all those new technologies developers are often confused as to which technology they should pick to build their applications. Should they build their application stack in a microservice architecture and containerize their services to run them on top of Kubernetes? Or should they go full serverless and split their application up into different functions and connect them to the underlying infrastructure components which will invoke the functions when something happens inside the application?

This is a tough question to answer and the right answer is: "it depends". Some long-running workloads might be better suited to run in containers, while other, short-lived workloads might be better deployed as a serverless function which automatically scales up and down to 0 if not used anymore.

Thanks to Knative there doesn’t have to be the question of "either containers, or serverless". Knative makes it possible to use both, "container and serverless" workloads in one and the same Kubernetes cluster.

## Announcing the Serverless Knative provider integration

Today we’re excited to announce the [Serverless Framework](https://github.com/serverless/serverless) Knative provider integration!

Our [`serverless-knative`](https://github.com/serverless/serverless-knative) provider plugin makes it easy to create, deploy and manage Knative services and their event sources.

This first beta release comes with support to automatically build and deploy your functions as [Knative Serving](https://knative.dev/docs/serving/) components and to use them as event sources via the [Knative Eventing](https://knative.dev/docs/eventing/) component. All such workloads and configurations can be deployed on any Kubernetes cluster, whether it’s running in the cloud, on bare metal or your local machine.

While working on this integration we focused on ease of use and therefore abstracted some of the rather involved implementation details away into a cohesive developer experience our Serverless Framework users are already familiar with.

Are you excited and want to learn more? Take a look at [our tutorial](https://serverless.com/blog/deploy-your-first-knative-service-with-the-serverless-framework) to get started with your first service!
