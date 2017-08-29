---
title: Serverless + Containers: Kubernetes-native functions available via Kubeless
description: Kubeless is a Kubernetes-native way to deploy and manage your serverless functions via the serverless framework.
date: 2017-08-30
layout: Post
thumbnail: https://raw.githubusercontent.com/kubernetes/kubernetes/master/logo/logo.png
authors:
  - DavidWells
---

One of the primary goals of the serverless framework is to provide a platform-agnostic experience to our users.

**Cloud freedom**. You write your code once and choose where it runs.

That's why we are so excited to announce the latest serverless provider integration: Kubeless

## What is Kubeless?

Made by the the fine team over at Binami, Kubeless is a Kubernetes-native way to deploy and manage your serverless functions via the serverless framework.

Kubeless lets you deploy small bits of code without having to worry about the underlying infrastructure. It leverages Kubernetes resources to provide auto-scaling, API routing, monitoring, troubleshooting and more.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ROA7Ig7tD5s" frameborder="0" allowfullscreen></iframe>

## What does it mean for Serverless framework users?

If you are running your stack on top of Kubernetes and want the power of functions at your fingertips, this is for you.

Kubeless also answers a pretty common user need we hear: "How can I run Lambda on-prem?"

Here are some other key features Kubeless adds to the Serverless Framework:

- HTTP and Events triggers
- Scheduled functions
- Support for Python, Nodejs and Ruby runtimes
- Baked in Monitoring via Prometheus

[Repo](https://github.com/kubeless/kubeless)
[Example](https://github.com/kubeless/kubeless/tree/master/examples)
[Documentation](https://serverless.com/framework/docs/providers/kubeless/)

## Getting Started

```
npm i serverless -g

...TBD
```


An example application

Setup steps

`serverless.yml`

`code`

## Resources: repo, examples, docs

Here’s what you need to get started with the Kubeless plug-in now:

- [GitHub repo](https://github.com/kubeless/kubeless)
- [Example](https://github.com/kubeless/kubeless/tree/master/examples)
- [Docs](https://serverless.com/framework/docs/providers/kubeless/)
