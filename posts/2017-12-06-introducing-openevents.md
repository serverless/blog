---
title: Introducing OpenEvents
description: Announcing a specification for describing event data in a common way
date: 2017-12-06
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/openevents-logo-square.png
category:
  - news
authors:
  - AustenCollins
---

In the opening keynote of CloudNativeCon 2017, Dan Kohn, the executive director of the CNCF, announced a small but significant new effort titled [OpenEvents](https://openevents.io).

Our company (Serverless Inc.) has been leading the charge on this effort with others within the context of the CNCF.  It's early in its development, but its impact is potentially profound.

Here's why.

![OpenEvents CloudNativeCon 2017 Dan Kohn](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cncf-openevents.jpg)

When we talk about events, we are talking about facts. Something actionable. Events are notifications that report when something has happened—a new piece of code was committed, a user created an account, someone started a sentence with “Alexa”.

The world is currently generating more events than ever, largely due to the rise of distributed systems, microservices, platform integrations, IoT sensors and more.  Meanwhile, the growth of cloud services and serverless computing (which enable you to process events at any scale, cheaply) are enabling new possibilities for acting on events.

Events are powerful.  They can enable businesses to make smarter decisions, faster.  Think everything from developer benefits (like test automation on new commits) to customer-facing impacts on companies’ bottom lines (like collecting customer activity to create personalized experiences).

To convert events to actions, it is becoming common to transport events across environments: multiple services, cloud vendors, on-premise systems, SaaS products, etc.  However publishers of event data tend to describe events differently.

The lack of a common way of describing events means developers must constantly re-learn how to receive events.  This also limits the potential for libraries, tooling and infrastructure to aide the delivery of event data across environments, like SDKs, event routers or tracing systems.  The portability and productivity we can achieve from event data is hindered overall.

Enter **OpenEvents**, a specification for describing event data in a common way.  OpenEvents seeks to ease event declaration and delivery across services, platforms and beyond.  The current focus of the effort is to define a set of consistent metadata attributes, which can be included with event data to help developers and systems process events more easily.

![OpenEvents Logo](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/openevents-logo-black.png)

These attributes include information to help title and categorize events, version the event data so that it can evolve without breaking downstream subscribers, and describe where the event came from and where it might be going.  The attributes can be extended for experimental features, and much more.

A variety of traditional use-cases can be improved by this, like service communication, SaaS integrations, webhooks, cloud bursting, functions-as-a-service, and improvements to the overall developer experience.  We're also excited to see what new [use-cases emerge](https://serverless.com/event-gateway/) as a result of this.

OpenEvents is a new effort and it's still under active development.  However, its working group has received a surprising amount of industry interest ranging from major cloud providers to popular SaaS companies.

We're excited to keep fostering this effort and what it means to the serverless community.  To get involved, go to [openevents.io](https://openevents.io).

Serverless and event-driven architectures are on the rise.  Standardizing events will accelerate this trend and help us achieve our ultimate goal: **empowering developers**.
