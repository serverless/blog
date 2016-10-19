---
title: Future of Serverless after 1.0
date: 2016-10-18
layout: Post
---

# Important Points:
* Get the community and contributors excited about next steps
* Start the discussion about Serverless post 1.0
* Throw out ideas around composition, discovery, communication and security
* Guide them towards specific Github issues they can work on and discuss in
* Make it clear that we're going towards helping them with more complex syntax
* Send a message to enterprises that we're a large platform to build on

# Text

Last week we finally released 1.0 of Serverless. With that release done we want to share our thoughts about the future of Serverless. This is also an invitation to everyone to share your ideas with us so we know that we're building exactly what you need to build complex infrastructure.

We see Serverless as the main tool for you to build large scale serverless event driven micro-services. With 1.0 we've built the foundation to easily build and deploy services. You can create custom resources, define events and deploy to separate accounts and stages.

While discussing their needs with users over the last months we've identified five main areas as the next goal of Serverless. Of course we will implement many other features and improvements, but those five will be our main focus as they will provide the biggest benefits.

* Service Composition
* Service Discovery
* Service Communication
* Security Controls
* Multi Provider Support

### Service Composition

Building a large micro-service infrastructure with Serverless requires many decision what services to build, how they should work together, how to split functionality into different parts, how to deploy them alone or together, how to determine dependencies between them, ...

We'll introduce more features and documentation to help you build large micro-service infrastructure, understand it, keep it in sync between different services.

### Service Discovery

When building many different services with lots of resources used in them there needs to be an easy way to find other services to communicate with. Those other services should not be hardcoded though, as this would make deployment into different environments impossible. So basically we'll give you a way to expose services, make them easily discoverable by other services including all security configuration that needs to be in place for those services to talk to each other.

AWS recently launched [Cloud Formation cross-stack referencing] which will help us with implementing discovery and we're working on different ways to provide information to services for discovery during deployment within environment variables. DNS is another technology that we want to support for Service discovery so your endpoints can get a public DNS record easily.

### Service Communication

Once you build a large micro-service infrastructure communication between those services can become complicated. You might not want every service to be able to talk to any other service, you might want to invoke specific services whenever one finishes or simply send out an event and have other services react to that event automatically and asynchronously.

The following example would be an option how to listen to functions starting or failing as an event, so you can easily subscribe to these events in different services.

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

These are just a few ideas (and we have more) on how communication between functions in the same or different services can work.

### Security Controls

Serverless has to work great for any kind of team, from small ones to large enterprises. One very important part of an infrastructure across those different organisations is being able to lock down and have tight control over the security of your system. By default it should be closed down well, but you should have full control over which part will be opened up. In future releases we're going to add more security controls into Serverless to give you even more ability to tighten your system.

The `calling` example from before is a good case of additional security restrictions by making sure your resources are locked down by default and only get opened up where necessary.

### Multi Provider support

We regularly talk to different providers about their FaaS infrastructure services and we're very excited because Serverless is a huge topic for all cloud providers and many other tooling providers. We're working with them to provide a great Serverless experience for all the different services that are already anounced or in the making. Stay tuned for more info in the future.

## Conclusions

Now that we have the basic platform in place that allows you to build and deploy services easily our next goal is to help you go from a few services to dozens of services with hundreds of functions. This requires a lot of features to make that scale of infrastructure still understandable and we're looking forward to hear what other features you have in mind to make sure Serverless can deliver on helpoing you build large and complex infrastructure.
