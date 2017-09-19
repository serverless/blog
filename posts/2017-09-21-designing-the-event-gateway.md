---
title: Designing The Event Gateway
description:
date: 2017-09-21
layout: Post
thumbnail: TODO
authors:
  - MaciejWinnicki

---

Recently [announced](https://serverless.com/blog/introducing-serverless-event-gateway/) Event Gateway is a new piece of infrastructure that lets developers react to data flows with serverless functions. Before starting the project we established core principles that we want to follow. It doesn't mean that they won't change in the future, they will surely do, but we wanted to have something that will guide us during the implementation phase and in general, during the project development.

## Design Considerations

We consider them in two dimensions. One is developer experience when using the event gateway. The second is developer experience when operating a cluster of event gateway instances. Those principles are:

- simplicity - first of all, we want to keep the number of new concepts low. We don't want to rename existing concepts for the sake of it. There are only events, functions, and subscriptions. As easy as possible. In terms of operational simplicity, our goal is to make it easy to run the event gateway locally, during development, at the same time making it easy to run, manage and scale in production environments.
- cross-cloud - same as with the Serverless Framework, the event gateway has to provide a seamless user experience no matter where user deploys its functions or where the user wants to deploy the event gateway itself. In the latter case, we also need to support on-premise deployments.
- event-driven - we strongly believe that event-driven is the right approach for building software systems. The event gateway not only enables developers to build them, but it also has to follow this paradigm internally.
- optimized for fast delivery - the main goal of the project is event delivery. We want to make it instant.

## Architectural Choices

Having all those principles in mind we’ve made a few explicit, architectural choices that drive the implementation.

### Stateless

The event gateway is designed to be a stateless service backed by an external key-value store. It makes it easy to operate and reason about. Assuming that we want to build a horizontally scalable system, making the event gateway stateful service means that we would start implementing yet another distributed database. As it's not the core value that we want to provide to the users, we avoided it. One important consequence of that choice is lack of events persistence. Having a plugin system that enables integrating with existing storage systems (e.g. AWS S3, Confluent Kafka) is a solution here.

### Configuration Store

In terms of storing configuration, we relied on existing solutions. There are at least few battle-tested key-value stores out there. [Etcd](https://coreos.com/etcd/), [Consul](https://www.consul.io/), and [Zookeeper](https://zookeeper.apache.org/) are definitely the most popular. They are used for storing configuration in very successful, production-grade systems like Kubernetes or Kafka. Instead of picking one of them as a backing store for the event gateway, we decided to use the [libkv](https://github.com/docker/libkv) library for supporting all of them. Libkv is an abstraction layer over popular key-value stores providing a simple interface for common operations. It has some limitations like lack of atomic operations on multiple keys, but its good for a start and we might start contributing to it once our needs will exceed provided functionality. Purely for demo and trial purposes, the event gateway can be started with a special flag which starts an embedded etcd instance. This allows users to test drive  the system without standing up a key-value store cluster first.

TODO - diagram here

### Eventual Consistency

Another choice that we’ve made, that highly influence overall architecture is making the event gateway an [eventually consistent](https://en.wikipedia.org/wiki/Eventual_consistency) system. When the user registers a function or subscribes a function to some event this configuration is saved in the backing key-value store in a synchronous way. In the next step, the data is spread across all instances in an asynchronous way using the event-driven approach. All key-value stores that we support, thanks to libkv, have an ability to watch for changes. During startup, every instance fetches all configuration data and then watches for changes happening during the instance runtime. We use that to build an internal cache that routing logic depends on. It means that when the event gateway needs to decide which function to call for a specific event it doesn't need to do any remote calls to the backing store. All configuration data used by routing logic is stored locally. Without watches, we would have to continuously scan ranges of keys in the database until we find new data, which is enormously expensive, slow, and hard to scale.

TODO - diagram here

### Language Choice

The event gateway is written in Go. We were looking for a mature, productive environment with a strong static type system which supports concurrency well and generate binaries that are simple to distribute. Go has it all, in addition to a rich standard library, a vast ecosystem (libraries, tools, write-ups) and an active community. Building an open source project also means that we need to provide a seamless experience for potential contributors. In the infrastructure software space, Go seems to be one of the most popular language choices.

—

The development of the event gateway is still in an early phase. We count on our community on providing feedback and influencing project direction. [The roadmap](https://github.com/serverless/event-gateway/projects/2) is publicly available. Feel free to [open an issue in the repo](https://github.com/serverless/event-gateway) or [join contributors’ Slack](https://join.slack.com/t/serverless-contrib/shared_invite/MjI5NzY1ODM2MTc3LTE1MDM0NDIyOTUtMDgxNTcxMTcxNg) and let us know what do you think!

*This is the first blog post of a series on Event Gateway architecture. In the future blog posts I will focus more on internal architecture, cluster architecture and deployments strategies.*