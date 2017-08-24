---
title: Key takeaways for the future of serverless - Emit 2017 recap
description: Emit Conf 2017 has come and gone. Here are the key serverless takeaways you should know about. 
date: 2017-08-25
layout: Post
thumbnail: 
authors:
  - NickGottlieb
---

Last Thursday, we held [Emit Conf 2017](http://www.emitconference.com/) here in San Francisco. It was a relatively intimate gathering of about 100 people, all of them thought leaders and early pioneers in the serverless space.

We saw some killer presentations and had even better conversations, with topics ranging from theorizing about system limits to practical real-world use cases of serverless architectures.

In case you couldn’t make it out, we compiled some of the most important takeaways and themes.

## Event unification 

Serverless architectures provide a lot of incentives to go event-driven, so it’s not surprising that we got several talks on this topic.

In an event-driven world, all data are represented as events. Storing these events and making them useful is paramount.

**Rob Gruhl**, Senior Manager of the Serverless Platform Team at Nordstrom, talked about the unified event log approach that Nordstrom takes to record all application state changes. This approach, often known as an event-sourced architecture, results in a lot of events, which can potentially be put to use by developers deploying serverless functions. Rob’s talk did a great job of surfacing the potential of event-sourced architecture, and also talked about some hard, unsolved problems within it that his team has been working on.
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Towards+a+serverless+event-sourced+Nordstrom.pdf)

**Austen Collins**, CEO of Serverless Inc., unveiled a new open-source project that is also focused on event unification. The [Event Gateway](https://serverless.com/event-gateway/) was designed to be the central piece of a serverless architecture. It collects all events in a system and exposes them to developers so they can be easily routed to functions. While many developers currently use systems like Kafka to accomplish this, the Event Gateway includes additional features, such as an API gateway, specifically designed to make it play nicely with a serverless architecture. 
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/building+the+communication+fabric+for+serverless+architectures.pdf)

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Emit+Recap/Austen_Collens-Event_Gateway.png)

## Simplicity

Everyone was in agreement that Serverless architectures remove complexity and let developers focus on results.

**Bobby Calderwood**, a technology fellow at Capital One, used a really interesting simile to compare event-driven systems. Systems that are hard to reason about are deathstars—a conglomeration of data. A better system to strive for is a river delta. Aka: event-driven systems should be linear and flowing.
[See the slides](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Toward+a+Functional+Programming+Analogy+for+Microservices.pdf)

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Emit+Recap/Bobby_Calderwood-River-Deltas.png)

**Shawn Burke**, who is building Uber’s serverless platform, Catalyst, talked a lot about how he focused on simplicity in design. A big part of the serverless simplicity story is developer experience. Shawn showed off how his platform can be run locally exactly the same way that it’s run in production, removing cognitive overhead for the developer.

**Matt Lancaster**, Global Lead of Lightweight Architectures at Accenture, talked about possibly the most complicated industry that exists: finance. Projects that often take other industries months to execute take whole years in finance. Matt shared a particular use case where he and his team were able dramatically simplify the architecture for a banking client by implementing an event-hub and exposing a reactive-api to []
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Using+Event+Driven+Architecture+to+Transform+Core+Banking.pdf)

## Definitions, standards and best practices

Everyone at Emit was aware: serverless and event-driven architectures are new, and in many ways they are still being defined. 

**Ajay Hair**, the Product Manager for AWS Lambda, talked about the importance of being a good event-producer—something that is especially important for providers. When all data is represented as events, it’s imperative that we have some standards and best practices for how to expose these events. Otherwise, we risk ending up in an even more complicated software world than we live now.
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/Being+a+good+citizen+in+an+event+driven+world.pdf)

**Cornelia Davis** of Pivotal Cloud Foundry called out that everyone is still trying out new things and theorizing about how things should work. The serverless community faces the challenge right now of coming up with shared definitions and solidifying best practices. This is imperative; we need this for serverless architectures to become mainstream and highly accessible.
[See the slides.](https://s3-us-west-2.amazonaws.com/emit-website/2017-slides/RethinkingThinking+Emit.pdf)

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Emit+Recap/Cornelia-Davis_Client-Server.png)
