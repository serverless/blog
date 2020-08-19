---
title: The Serverless Framework Knative Component
description: "Deploy containerized applications on serverless Knative infrastructure easily, cheaply and scale massively, all via the Serverless Framework"
date: 2020-08-19
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-08-19-serverless-framework-knative-component/serverless-knative.png"
authors:
  - AustenCollins
category:
  - news
---

Serverless is an architectural pattern with the underlying goal of delivering software that has radically low operational cost.  It achieves this by prioritizing building applications on next-generation cloud services that auto-scale and never charge for idle time.

While every organization wants to reduce operational cost, many are unable to use all of the cloud services that have “serverless” qualities.  The main reasons are that those services are unable to support an organizations’ use-case, or those services may not offer the level of control an organization may need over their environment.

To solve this, many have been innovating open-source serverless platforms since 2016, as an alternative option.  Some of these are Apache OpenWhisk, Kubeless, and more recently Knative.  These platforms offer similar auto-scaling characteristics, different functionality and make self-hosting their environment possible.  Additionally, they all run on Kubernetes and are a great fit for organizations that leverage Kubernetes already.

The Serverless Framework has integrated with almost all open-source serverless platforms, since their beginning, to offer developers a single, easy way to build serverless apps, regardless of whether they are hosted on self-hosted or hosted serverless services.

![Serverless Framework Knative Component](
https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-08-19-serverless-framework-knative-component/serverless-knative.png)

Today, the Serverless Framework is improving its support for Knative with the first official Knative Serverless Framework Component.  This Component, developed in collaboration with Red Hat, can deploy and manage containerized applications on serverless Knative infrastructure easily, cheaply and scale massively, all via the Serverless Framework.

You can use the [Serverless Framework Knative Component](https://github.com/serverless-components/knative) to deploy applications written in any language, framework, or idiom you’re familiar with.  The Quick-Start guide features multiple templates you can run to deploy Express.js, Go and Java-based applications, easily.  

To get started, try these commands via NPM:

* `npx serverless init knative-express-starter`
* `npx serverless init knative-go-starter`
* `npx serverless init knative-quarkus-starter`

This Component supports two ways of building container images out of your source code:

1. The Kubernetes mode will use Kaniko for building a container image from your source code and user Docker Hub as a registry for handing over the container image to Knative. The credentials for a Docker Hub account need to be added to the configuration. This mode requires a Kubernetes cluster on which you are allowed to run Pods in privileged mode.
2. The OpenShift mode builds the container image with OpenShift's S2I mechanism and uses the OpenShift internal registry for image hand-over, which does not require any extra security setup. This mode works only on OpenShift with OpenShift Serverless installed for running Knative services.

The mode is autodetected from the connected cluster. OpenShift mode is used by default when you have configured a connection URL to an OpenShift cluster; otherwise, Kubernetes mode is used.

[Red Hat’s OpenShift Serverless Platform](http://openshift.com/serverless), based on Knative, comes with extra benefits, focusing on enterprise use cases. These benefits include extensive testing covering the platforms supported by OpenShift, from on-premises installations on bare-metal systems to AWS, Azure, GCP, Openstack, VMWare, and soon even Mainframes, supporting hybrid cloud deployments and providing customers flexibility and portability for serverless workloads.  Combined with Red Hat's extensive experience building Kubernetes Operators, OpenShift Serverless is distributed as an operator, available to every OpenShift customer, and can be installed using the Operator Lifecycle Management (OLM) and the built-in OperatorHub available in OpenShift.  For developers, a consolidated web console provides an intuitive experience and a general solution for connecting several event sources to your serverless applications, all via OpenShift.

Check out the [Serverless Framework Knative Component](https://github.com/serverless-components/knative) to get started.

* [Learn more on the RedHat Blog](https://www.openshift.com/blog/openshift-serverless-serverless-framework-component)
