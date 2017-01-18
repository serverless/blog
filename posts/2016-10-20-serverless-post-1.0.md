---
title: Future of Serverless after 1.0
description: "The future of Serverless and more on Service Composition Discovery, & Communication, Security Controls, plus Multi Provider Support"
date: 2016-10-20
layout: Post
authors:
  - NickGottlieb
---

Last week we released [1.0 of Serverless](https://serverless.com/blog/releasing-serverless-framework-v1-and-fundraising/). With that release done we feel it's important to share our thoughts about the future. This is also an open invitation to our community to share your ideas with us so we know that we're building exactly what you need to help you build complex infrastructure. You can follow what we're working on in [our Milestones](https://github.com/serverless/serverless/milestones).

We see Serverless as the main tool to allow you to build large-scale serverless, event-driven microservices. With 1.0 we've built the foundation to easily build and deploy services. You can create custom resources, define events and deploy to separate accounts and stages.

Over months spent engaging users in a discussion about their needs, we've identified five main areas as the focal point of our next round of goals for Serverless. Of course we'll implement many other features and improvements, but these five will be our main focus as they will provide the most benefits.

* Service Composition
* Service Discovery
* Service Communication
* Security Controls
* Multi Provider Support

### Service Composition

Building a large event-driven microservice infrastructure with Serverless requires many decisions on how to compose your infrastructure. How do you want to split up services? Do you deploy them individually or as one larger deployment? How should they talk to each other, and how are dependencies between them defined?

We'll introduce more features, documentation and best practices to help you build and understand a large Serverless infrastructure. You can jump into the discussion and share your thoughts about features, documentation and best practices in our [Service Composition Issue](https://github.com/serverless/serverless/issues/2481)

### Service Discovery
One of the fundamental problems you have to solve when you build a large microservice infrastructure is service discovery. How do you make it easy for services to find each other, get the appropriate rights to talk to each other and make this possible across different stages? Maybe during development you want a few services to be shared by everyone, but other services should be deployed independently for each developer so they can easily iterate on it. Of course service discovery should never be hardcoded into the application as deployment would become a nightmare in that case.

To solve this issue we're working with AWS on making it easy to configure your services to find each other. We'll implement a simple syntax to define dependencies and through our upcoming SDK allow you to easily communicate between services, use Resources defined in other services and even include your preexisting infrastructure in your Serverless services.

AWS recently launched [Cloud Formation cross-stack referencing](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/walkthrough-crossstackref.html) which will help us with implementing discovery and we're working on different ways to provide information to services for discovery during deployment within environment variables. DNS is another technology that we want to support for service discovery so that your endpoints can get a public DNS record easily. You can provide your views and jump into the discussion in our [Service Discovery Issue](https://github.com/serverless/serverless/issues/2483)

### Service Communication

Once you build a large microservice infrastructure, communication between those services can become complicated. You might not want every service to be able to talk to every other service. You might want to invoke specific services whenever one finishes, or simply send out an event and have other services react to that event automatically and asynchronously.

We've thought about this for quite a while now, and the following are examples of how this could potentially look in the future. These examples are in no way a finished proposal and will most likely change in some way. But they should give you an idea of what should be possible in the future in Serverless.

The following example would be an option for how to listen to functions starting or failing as an event, so you can easily subscribe to these events in different services.

```yaml
service: subscriberService
functions:
  createUser:
  sendWelcomeEmail:
    events:
      - function:
          name: createUser # This is in the same service, so easy to subscribe to
          type: start
       - function:
          name: publicFunction
          service: testService # this is in another service so we need to be explicit about which function in which service
          type: failed # only runs when that function fails
```

```yaml
service: testService
functions:
 publicFunction:
    handler: hello.Handler
    subscribable: true # We could have this subscribable setting so we only create an SNS topic (or whatever the tech behind it that listens is) when this is set to true so other services can subscribe without having to be in the same service.
```

The following example allows the hello service to call someFunction in otherService synchronously. This needs to be configured so the AWS Roles get the rights to call this other function.

```yaml
function:
  hello:
    handler: something.js
    calling:
      - “otherService:someFunction”
```

Now through an SDK that we can provide you can simply call that other function across different stages easily:

```js
sdk.invoke(‘otherserivice:someFunction’, parameters, function (result) {

})
```

Depending on how many `calling` functions you define we can also be smarter about it and allow you to use only the function name in `invoke`, or even use no name at all in case you defined only one function.

These are just a few ideas (and we have more) on how communication between functions in the same or different services can work. Jump into the discussion in the [Service Communication Issue](https://github.com/serverless/serverless/issues/2484) to share your ideas about potential or necessary features.

### Security Controls

Serverless has to work well for all types of teams, ranging from small startups to large enterprises. One very important component of an infrastructure spanning across those different organizations is the ability to lock down and have tight control over the security of your system. By default it should be secure, but you should have full control over which part will be opened up. In future releases we're going to add more security controls into Serverless to give you even more ability to tighten your system.

The `calling` example from before is a good case of adding additional security restrictions by making sure your resources are locked down by default and only get opened up where necessary. Security controls will be implemented across various issues and pull requests in the future, so it's best to follow our Milestones and releases to see our updates on that part of Serverless.

### Multi Provider support

We regularly talk to different providers about their FaaS infrastructure services. We're excited that Serverless is a huge topic for all cloud providers and many other tooling providers. We're working with them to create a great Serverless experience for all the different services that are already announced, or in the making. Stay tuned for more info in the future.

## Conclusions

Now that we have the basic platform in place that allows you to build and deploy services easily, our next goal is to help you grow from a few services to dozens of services with hundreds of functions. It will require a lot of features to make that scale of infrastructure still understandable. We look forward to hearing what other features you have in mind to make sure Serverless can deliver on helping you build large and complex infrastructure.
