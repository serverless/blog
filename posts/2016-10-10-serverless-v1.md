---
title: Serverless V1 release
date: 2016-05-25
layout: Post
---
Goals of the Blogpost:

* Proud to release this new version
* Lot of work over the last months to reimplement Serverless with goal of
  * Easier onboarding
  * Full Cloudformation Support
  * Easier time for users to contribute
  * Tight control over the whole infrastructure you're deploying
  * Preparation for more complex features for a more complex infrastructure
* Set out to understand what small, medium and large teams want to use Serverless for
* Build a stronger Contributor community
* Build basic platform to manage large serverless infrastructure
* Prepare for multi-provider Support in the future
* Key features
  * Easy event support for many different AWS resources
  * Full Cloudformation support so you can define custom resources
  * Better APIG Support
  * easily extensible plugin System
  * Powerful variable system
  * Lots of convenience functions to build your infrastructure
  * Better documentation to find things easier
  * Improved Code quality and test coverage so we can move much faster in the future
* Call to Action to contribute
* Future of Serverless Framework
  * Serverless wants to be the Platform to build large scale event driven micro-service applications
  * Serverless V1 is first step there
    * Allows to easily build, configure,
  * Service Discovery
  * Service Composition
  * Service Communication


# Serverless 1.0 Release

Very happy to announce final release of Serverless 1.0. We worked very hard on making Serverless an amazing tool over the last year and this is the culmination of many conversations with many teams.

Serverless should be best tool to manage FaaS infrastructure for any team. From small to large to enterprise we see so many jump on FaaS and Serverless. They all get the advantage of focusing fully on their business code and not having to do operations for many things in their infrastructure.

To get started all you really need to do is run the following commands (or watch this video):

```
COMMANDS TO DEPLOY FIRST SERVICE
```

We also have an [in-depth guide] to walk you through setting up a project.

## Goals with 1.0
We think a Serverless event driven micro-service architecture will be a large part of how we're going to build infrastructure in the future. To help with that Serverless is aiming to give users an easy onboarding experience into this kind of architecture, while giving total control over the whole infrastructure in the future once you grow into a complex architecture. Getting started fast with good defaults, but scaling with the needs of a team is very important for us.

An easy setup for events is a key to event driven architecture we built many different event sources into Serverless (e.g. S3, SNS, API Gateway) so you can get started very quickly on building Serverless infrastructure. Following are a few key features we've released with V1, but you can also check out our [DOCS AND EXAMPLES](INSERT LINK HERE) and past blogposts that go through the different features.

### Key features of Serverless 1.0

* Easy event support for many different AWS resources
* Based on Cloudformation for full control over your resources
* Deep integration with API Gateway
* Easily extensible plugin System
* Powerful variable system
* Lots of convenience functions to build your infrastructure
* Better documentation to find things easier
* Improved Code quality and test coverage so we can move much faster in the future

## Saying thanks

We could not have achieved this release without the awesome help of our community and everyone who contributed to Serverless. If you're interested in helping out check out our [Contribution Guide](), jump into the [Issues]() or join the discussion in our [Forum]()

## The future of Serverless

We have large plans going forward with Serverless. This first release represents only the first step for us to really help you build and operate your large and complex applications.

We've had many conversation over the last weeks with many of our contributors or users and think this are most important features:

* Service Discovery
* Service Composition
* Service Communication
* Security Controls
* Multi Provider support

### Service Discovery

When building many different services with lots of resources used in them there needs to be an easy way to find other services to communicate with. Those other services should not be hardcoded though, as this would make deployment into different environments impossible. So basically we'll give you a way to expose services, make them easily discoverable by other services including all security configuration that needs to be in place for those services to talk to each other.

AWS recently launched [Cloud Formation cross-stack referencing] which will help us with implementing discovery and we're working on different ways to provide information to services for discovery during deployment within environment variables.

### Service Composition

Building a large micro-service infrastructure with Serverless requires many decision what services to build, how they should work together, how to split functionality into different parts, how to deploy them alone or together, how to determine dependencies between them, ...

We'll introduce more features and documentation to help you build large micro-service infrastructure and understand it.

### Service Communication

Once you build a large micro-service infrastructure communication between those services can become complicated. You might not want every service to be able to talk to any other service, you might want to invoke specific services whenever one finishes or simply send out an event and have other services react to that event automatically.

### Security Controls

Serverless has to work great for any kind of team, from small ones to large enterprises. One very important part of an infrastructure across those different organisations is being able to lock down and have tight control over the security of your system. By default it should be closed down well, but you should have full control over which part will be opened up. In future releases we're going to add more security controls into Serverless to give you even more ability to tighten your system.

### Multi Provider support

We regularly talk to different providers about their FaaS infrastructure services and we're very excited because Serverless is a huge topic for all cloud providers and many other tooling providers. We're working with them to provide a great Serverless experience for all the different services that are already anounced or in the making. Stay tuned for more info in the future.

## Conclusions

Serverless has seen adoption from individual developers up to some of the largest enterprises, which makes us very proud. There is a clear need for having tooling and services for building Function as a Service infrastructure.

With this 1.0 release we've set the foundation to give you good tooling to build services and deploy them. Now we're focusing on how all of those services communicate with each other, how to set up more complex system that go beyond a few systems and how they work together. With our recent fundraising we're in a great place to build more tooling and services for you in the future.

We're very excited about sharing this with you and would love if you could give us feedback, open issues, take part in our forum or help through contributing code.

## Frequently asked Questions
* [Aren't there still Servers with Serverless?]
* [Where can I get started]
* [How can I contribute]
* [Will you be around for a while]
