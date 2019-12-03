---
title: "EventBridge Schema Registry -- what it is and why it matters for Serverless applications"
description: "The EventBridge Schema Registry helps document your event schemas and add discoverability to the event domain. See why it's useful here."
date: 2019-12-02
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/eventbridge-schema-registry/eventbridge-schema-registry-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/eventbridge-schema-registry/eventbridge-schema-registry-header.png"
category:
  - news
authors:
  - AlexDeBrie
---

With the Midnight Madness event, the #preInvent season is over and re:Invent has officially begun. AWS dropped a big announcement in the form of the [EventBridge schema registry](https://aws.amazon.com/blogs/compute/introducing-amazon-eventbridge-schema-registry-and-discovery-in-preview/). This handy tool helps to document your event schemas, making it easier to share knowledge across teams.

In this post, we'll look at:

- [Why you need a schema registry](#why-do-you-need-a-schema-registry)
- [What is the EventBridge schema registry and how does it work?](#what-is-the-eventbridge-schema-registry-and-how-does-it-work)
- [What are the remaining questions and issues with the schema registry](#what-are-the-remaining-questions-about-the-schema-registry)

Let's get started!

#### Why do you need a schema registry?

Before we get too far, let's understand why you would need a schema registry.

First off, serverless architectures often are *event-driven architectures*. In event-driven architectures, different aspects of your business logic is triggered by the occurrence of events.

Events can come from a variety of places. If you have a number of microservices in your application, you can use events to communicate across service boundaries, allowing for more loosely-coupled applications.

If you're working with managed service offerings, such as DynamoDB with [DynamoDB streams](https://serverless.com/framework/docs/providers/aws/events/streams/), you will receive an event whenever a record is updated. You can also use AWS services like [EventBridge](https://serverless.com/blog/eventbridge-use-cases-and-tutorial/) to receive status updates on things like ECS tasks starting or stopping or for [resource creation notifications](https://serverless.com/blog/serverless-cloudtrail-cloudwatch-events/).

Finally, you might receive third-party events such as webhooks from providers such as GitHub, Zendesk, or Stripe. These are similar to events from managed AWS services but a little less infrastructure-specific -- they may indicate a more application-centric event that occurred.

Whatever the event type you're acting upon, your application will need to know the basic structure of the event. In the past, I've found that the documentation of events can be poor -- maybe they get updated once but never again. Maybe only a few fields are listed but not all of them. Types and required fields are barely listed, as well as the semantic meaning of the fields.

This is a real problem! If these events are the main communication mechanisms across services and/or teams, you will need some understanding of what's available in there.

Enter, the EventBridge schema registry.

## What is the EventBridge schema registry and how does it work?

[Amazon EventBridge](https://aws.amazon.com/eventbridge/) is an event bus for shuttling events between systems and allowing reliable pub/sub functionality. You can send in your own application events, subscribe to AWS system events, or toss in third-party events.

The [EventBridge schema registry](https://aws.amazon.com/blogs/compute/introducing-amazon-eventbridge-schema-registry-and-discovery-in-preview/) is a new service for *automatically detecting and storing schemas* for your events. This is pretty powerful and can help overcome the internal inertia around documenting events.

There are two big features of the EventBridge schema registry that I find particularly powerful.

First, the schema detection is automatic. This is pretty big -- you don't have to count on developers writing their schemas.

Second, you can download code bindings for your discovered schemas. This is pretty huge, as you'll have an actual model that you can code against. For typed languages like Typescript or Java, you can get nice code completion in your IDE to help you work against that schema. That's a big win!

## What are the remaining questions about the schema registry?

While the EventBridge schema registry is a pretty cool feature, there are still a few questions and issues you should think about.

First, while the automation is useful, it probably won't be able to capture *everything* about your schemas. For example, even if you have a particular property defined as an integer, it may not be clear the meaning behind that number. If your OrderPlaced item has an "Amount" property, is that the amount before sales tax or after? Including discounts? With shipping? At some point, you have a responsibility as a developer to document this stuff beyond what can be automatically generated.

Similarly, the automated schema detection may have trouble handling optional fields. If I have a property that's optional, will that "detect" a new schema version when I publish an event without it? This isn't really a new schema -- it's just a different example of an event that conforms to the schema.

Second, schema detection can get expensive. It's currently priced at $0.10 per million events ingested for discovery. Depending on how 'event-happy' your application is, that can get expensive.

I think the AWS blog post announcing the schema registry has a good suggestion -- enable schema detection in testing environments but not in prod. I think this buys you a few wins:

1. Your test environment will have lower traffic, so it won't cost as much.

2. You can use the schema registry almost as an integration test to confirm that new events published conform to the schema.

Finally, I would recommend using the schema registry as a starting point but not an ending destination. Use the schema registry to bootstrap the initial definition of third-party events but pull them into your documentation somewhere and add additional context to the event. This can reduce some of the initial labor while still adhering to best practices.

## Conclusion

Event-driven architectures are growing in popularity, and we're still learning how to work with them. We don't have a tool like [Swagger / OpenAPI](https://swagger.io/) for events yet that describes the shape of events and how to handle version changes.

Tools like the EventBridge schema registry are definitely a step in the right direction. The sooner we can get developers thinking about events and schemas, the better they'll be in the long run as they work to integrate these events across their systems. I'm really excited to see how the schema registry and EventBridge evolve going forward.