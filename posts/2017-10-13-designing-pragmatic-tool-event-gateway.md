---
title: How (and why) we designed the Event Gateway
description: How do you design a tool that tows the line between 'exciting new ground' and 'real world practicality'? We asked a lot of those questions with the Event Gateway.
date: 2017-10-13
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/event-gateway-thumbnail.png
authors:
  - MaciejWinnicki
---

[The Event Gateway](https://serverless.com/blog/introducing-serverless-event-gateway/) is our most recent announcement—and honestly, it's a project born out of passion for the serverless movement as much as it is a practical tool motivated by an industry need.

Serverless development is still fresh, lacking in best practices and tooling. But people use it because the payoffs are worth the pain.

Our job at [Serverless.com](https://serverless.com/) is to remove that pain: fight for standardization, think from the top-down about what a serverless application should look like, make its development seamless. The biggest sticking point we see here is that serverless development is fundamentally event-driven development. Every function you deploy to your FaaS provider will remain idle until woken up by an event.

No one likes to hear that. Event-driven is a new paradigm, and new paradigms mean change. But to move serverless forward, we as a community have to embrace event-driven design. Our job at Serverless.com is to make it painless. As we can, at least.

The Event Gateway is a big step for us: a new piece of infrastructure that treats all data flows as events, and lets developers react to those flows with serverless functions.

See how we treaded the intersection of 'exciting new ground' and 'real world practicality'. Here, we lay out our design process from planning to execution to getting the tool in your hands.

# Design Considerations

We had two primary considerations: the developer experience when using the Event Gateway, and the developer experience when operating a cluster of Event Gateway instances.

To keep us on track, we decided to establish four core guiding principles. It doesn't mean that they won't change in the future—they surely will—but we wanted to have something that would give us a jump start during the implementation phase and carry throughout the project development.

Those guiding principles were:

- **Simplicity** - Keep the number of new concepts low. We didn't want to rename existing concepts just for the sake of it. There would be only events, functions, and subscriptions—as easy as possible. In terms of operational simplicity, our goal was to make it easy to run the event gateway locally during development, while also making it easy to run, manage and scale in production environments.
- **Cross-cloud** - Same as with the Serverless Framework, the event gateway had to provide a seamless user experience, no matter where the user deploys their functions or where they want to deploy the Event Gateway itself. In the latter case, we also needed to support on-premise deployments.
- **Event-driven** - We strongly believed that event-driven was the right approach for building software systems. The Event Gateway should not only enable developers to build them, but should also follow this paradigm internally.
- **Optimized for fast delivery** - The main goal of the project was event delivery. We wanted to make it instant.

# Architectural Choices

With those principles in mind we made a few explicit, architectural choices that drove the implementation.

## Stateless

The event gateway was designed to be a stateless service backed by an external key-value store. This was to make it easy to operate and reason about.

Assuming that we want to build a horizontally scalable system, making the event gateway a stateful service meant that we'd need to implement yet another distributed database. As that did not fit with our core values (remember: Simplicity and business value!), we decided to avoid it.

One important consequence of that choice is that events lack persistence. There are possible solutions to this, though—e.g., a plugin system that enables integration with existing storage systems (like AWS S3, Kafka).

## Configuration Store

Here, we relied on existing solutions. There are at least few battle-tested key-value stores out there already.

[Etcd](https://coreos.com/etcd/), [Consul](https://www.consul.io/), and [Zookeeper](https://zookeeper.apache.org/) are definitely the most popular for storing configuration in very successful, production-grade systems like Kubernetes or Kafka. But we decided to use the [libkv](https://github.com/docker/libkv) library for supporting all of them.

Libkv is an abstraction layer over popular key-value stores that provides a simple interface for common operations. It has some limitations (like lack of atomic operations on multiple keys), but it was a good start, and we might start contributing to it once our needs exceed its provided functionality.

Purely for demo/trial purposes, the Event Gateway can be started with a special flag which starts an embedded etcd instance. This allows users to test drive the system without starting up a key-value store cluster first.

## Eventual Consistency

Another choice that highly influenced our overall architecture was making the Event Gateway an [eventually consistent](https://en.wikipedia.org/wiki/Eventual_consistency) system.

When the user registers a function or subscribes a function to some event, the configuration is saved in the backing key-value store in a synchronous way. Then, the data is spread across all instances asynchronously, with an event-driven approach.

Thanks to libkv, all key-value stores that we support have an ability to watch for changes. Every instance fetches all configuration data during startup, and then watches for changes happening during the instance runtime. We use that to build the internal cache that our routing logic depends on.

It means that when the Event Gateway needs to decide which function to call for a specific event, it doesn't need to do any remote calls to the backing store. All configuration data used by routing logic is stored locally.

Without watches, we would have to continuously scan ranges of keys in the database until we find new data, which is enormously expensive, slow, and hard to scale.

## Language Choice

We needed a language with mature production environment. We also needed a strong static type system which supported concurrency well and generated binaries that were simple to distribute.

Go had it all—a rich standard library, a vast ecosystem (libraries, tools, write-ups) and an active community. Building an open source project also meant that we needed to provide a seamless experience for potential contributors. In the infrastructure software space, Go seems to be one of the most popular language choices.

As you can probably already tell, we built the Event Gateway in Go.

# What's next

The Event Gateway is still in an early phase. We count on you, our community, to provide feedback and give us frank opinions on project direction.

[The roadmap](https://github.com/serverless/event-gateway/projects/2) is publicly available. Feel free to [open an issue in the repo](https://github.com/serverless/event-gateway) or [join contributors’ Slack](https://join.slack.com/t/serverless-contrib/shared_invite/MjI5NzY1ODM2MTc3LTE1MDM0NDIyOTUtMDgxNTcxMTcxNg) and let us know what you think!

*This is the first blog post of a series on Event Gateway architecture. In the future blog posts I will focus more on internal architecture, cluster architecture and deployments strategies.*
