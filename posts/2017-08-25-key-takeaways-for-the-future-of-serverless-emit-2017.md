---
title: Key takeaways for the future of serverless - Emit 2017 recap
description: Emit Conf 2017 has come and gone. Here are the key serverless takeaways you should know about. 
date: 2017-08-25
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Emit+Recap/Emit+logo.png
authors:
  - NickGottlieb
---

Last Thursday, we held [Emit Conf 2017](http://www.emitconference.com/) here in San Francisco. It was a tight-knit gathering of thought leaders and early pioneers in the serverless space.

We saw some killer presentations and had even better conversations, with topics ranging from theorizing about system limits to practical real-world use cases of serverless architectures.

In case you couldn’t make it out, we compiled some of the most important takeaways and themes.

## Event unification 

Serverless architectures provide a lot of incentives to go event-driven, so it’s not surprising that we got several talks on this topic.

In an event-driven world, all data are represented as events. Storing these events and making them useful is paramount.

**Rob Gruhl**, Senior Manager of the Serverless Platform Team at [Nordstrom](http://shop.nordstrom.com/), talked about the unified event log approach that Nordstrom takes to record all application state changes. This approach, often known as an event-sourced architecture, results in a lot of events, which can potentially be put to use by developers deploying serverless functions. Rob’s talk did a great job of surfacing the potential of event-sourced architecture, and also talked about some hard, unsolved problems within it that his team has been working on.
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Towards+a+serverless+event-sourced+Nordstrom.pdf)

**Austen Collins**, CEO of [Serverless Inc.](https://serverless.com/), unveiled a new open-source project that is also focused on event unification. The [Event Gateway](https://serverless.com/event-gateway/) is designed to be the central piece of a serverless architecture. It collects all events in a system and exposes them to developers so they can be easily routed to functions. While many developers currently use systems like Kafka to accomplish this, the Event Gateway includes additional features, such as an API gateway, specifically designed to make it play nicely with a serverless architecture. 
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/building+the+communication+fabric+for+serverless+architectures.pdf)

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Emit+Recap/Austen_Collens-Event_Gateway.png)

**Dave Copeland**, Director Engineering at [Stitch Fix](https://www.stitchfix.com), presented an approach to testing event-driven architectures called ‘contract based testing’. The idea is that a test suite contains contracts between events and their consumers; if this contract is broken then you know something is wrong. This is of course an oversimplification, but it’s really interesting to see people developing event-driven testing strategies and we’ll surely see more of this in the future.
[See the slides](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Imagining+Contract-Based+Testing+for+Event-driven+Architectures.pdf)

## Simplicity

Everyone was in agreement that Serverless architectures remove complexity and let developers focus on results.

**Bobby Calderwood**, a technology fellow at [Capital One](https://www.capitalone.com/), used a really interesting simile to compare event-driven systems. Systems that are hard to reason about are deathstars—a conglomeration of data. A better system to strive for is a river delta. Aka: event-driven systems should be linear and flowing.
[See the slides](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Toward+a+Functional+Programming+Analogy+for+Microservices.pdf)

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Emit+Recap/Bobby_Calderwood-River-Deltas.png)

**Shawn Burke**, who is building [Uber](https://www.uber.com/)’s serverless platform, Catalyst, talked a lot about how he focused on simplicity in design. A big part of the serverless simplicity story is developer experience. Shawn showed off how his platform can be run locally exactly the same way that it’s run in production, removing cognitive overhead for the developer.

**Matt Lancaster**, Global Lead of Lightweight Architectures at [Accenture](https://www.accenture.com/), talked about possibly the most complicated industry that exists: finance. Projects that take other industries months to execute take whole years in finance. To simplify architecture for one of their banking clients, Matt and his team implemented an event hub and exposed a reactive api to all the different clients. His team not only finished the project ahead of schedule, but began to remove old mainframe infrastructure that was expensive to maintain.
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Using+Event+Driven+Architecture+to+Transform+Core+Banking.pdf)

**Madhuri Yechuri**, Founder of [Elotl](https://angel.co/elotl), talked about simplifying Serverless in a different way; by reducing the footprint of a function to a unikernel and completely removing the OS from the runtime. The technology is still in its early stages, but Mandhuri’s presentation showed the potential for some serious performance gains by pairing serverless with unikernels.
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Unikernels+and+Event-driven+Serverless+Platforms.pdf)

## Definitions, standards and best practices

Everyone at Emit was aware: serverless and event-driven architectures are new, and in many ways they are still being defined. 

**Ajay Hair**, the Product Manager for [AWS Lambda](https://aws.amazon.com/lambda/), talked about the importance of being a good event-producer—something that is especially important for providers. When all data is represented as events, it’s imperative that we have some standards and best practices for how to expose these events. Otherwise, we risk ending up in an even more complicated software world than we live now.
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Being+a+good+citizen+in+an+event+driven+world.pdf)

**Cornelia Davis** of [Pivotal Cloud Foundry](https://pivotal.io/platform) called out that everyone is still trying out new things and theorizing about how things should work. The serverless community faces the challenge right now of coming up with shared definitions and solidifying best practices. This is imperative; we need this for serverless architectures to become mainstream and highly accessible.
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/RethinkingThinking+Emit.pdf)

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Emit+Recap/Cornelia-Davis_Client-Server.png)

## Stay tuned

We have more Emit tidbits coming soon, including speaker videos. Keep your eyes on [@EmitConf](https://twitter.com/emitconf) and [@goserverless](https://twitter.com/goserverless) to know as soon as they are released.
