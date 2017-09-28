---
title: Serverless (FaaS) vs. Containers (CaaS) - when to pick which?
description: Docker, Kubernetes, Serverless? Let's discuss the different technologies and discover their up- and downsides. 
date: 2017-10-02
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-vs-containers.png
authors:
  - PhilippMuns
---

Contrary to popular thought, Functions-as-a-Service (FaaS) and Containers-as-a-Service (CaaS) have some pretty important things in common.

You want a modern, future-proof architecture? They both have it. You want to build that slick architecture while also leveraging the latest innovations in distributed systems and large-scale application development? Yep, they both have that too.

It makes it hard to decide which one is best for *you*. But friend, you deserve to know. So we're taking off the gloves and laying it all on the line.

What are the commonalities and distinctions? What are the advantages and disadvantages of each?

It's serverless computing vs containerization, right now. Read on.

## How did we get here?

Before we jump right into the details, let’s cover some very important history.

[INSERT IMAGE OF THE EVOLUTION HERE?!]

### 1. Physical servers

We used to build our own infrastructure in the form of physical servers. We set up those machines, deployed our code on them, scaled them and maintained them. The whole thing was a manual process, and pretty slow to boot.

### 2. Server clusters and VMs

Using a single physical server for one application was a waste of resources. So, we evolved our infrastructure thinking and combined multiple physical servers into a cluster.

We used those so-called 'virtual machines' to run multiple applications in isolation on top of this infrastructure. Deployment and management got way faster and easier. However, server administration was still necessary and largely very manual.

### 3. Entering the cloud (IaaS)

Setting up and operating your own datacenter came with new operational challenges; cloud computing began to tackle those issues.

Why not rent your servers and operational services individually, for a monthly fee? This approach made it way easier to scale up or down, and let teams move faster.

### 4. PaaS, FaaS, XaaS

While cloud environments made it convenient to build large-scale applications, they still came saddled with the downsides of manual administration:

*"Are the latest security fixes installed?"*

*"When should we scale down/up?"*

*"How many more servers do we need?"*

Wouldn’t it be great if all those administrative hassles were taken off of our plates, and we could simply focus on applications and business value?

Yep! That's what some other folks started thinking, too.

## In corner 1: Containers (CaaS)

Wouldn’t it be nice if one could pack the application, with alllllll its dependencies, into a dedicated box and run it anywhere? No matter what software dependencies the host system has installed, or where and what the host system actually is?

That’s the idea of containerization. Create a container which has all the required dependencies pre-installed, put your application code inside of it and run it everywhere the container runtime is installed.

Containerization gained attention when it came to light that Google used such technologies to power some of their services (such as Gmail or Maps). Using containers was initially pretty cumbersome, however; it required deep knowledge about Linux kernel internals and making home-grown scripts to put an application in a container and run it on a host machine.

Then Dotcloud (a PaaS startup from San Francisco) announced a new tool called Docker at [Pycon US 2013](https://www.youtube.com/watch?v=wW9CAH9nSLs). Docker was an easy to use CLI tool which made it possible to manage software containers easily.

Dotcloud then pivoted to become Docker, and Google worked on an OpenSource implementation of the "Borg" container orchestration service, which is called Kubernetes.

More and more enterprises adopted containers, and standards around this new technology got defined. Nowadays, nearly every cloud provider offers a way to host containerized applications on their infrastructure.

### Advantages of containers

- Control and Flexibility
- Vendor-agnostic
- Easier migration path
- Portability

### Disadvantages of containers

- Administrative work (e.g. apply security fixes for containers)
- Scaling is slower
- Running costs
- Hard to get started
- More manual intervention

## In corner 2: Serverless compute (FaaS)

About a year later, AWS introduced the first serverless compute service ever: AWS Lambda.

The most basic premise of a serverless setup is that the whole application--all its business logic--is implemented as _functions_ and _events_.

Here's the full break-down. Applications get split up into different functionalities (or services), which are in turn triggered by events. You upload your function code and attach an event source to it.

That’s basically it. The cloud provider takes care of the rest and ensures that your functions will always be available and usable, no matter what.

When serverless compute was first introduced in 2014, the workloads were pretty limited and focused around smaller jobs such as image/data manipulation. But then AWS introduced the API Gateway as an event source for Lambda functions.

That changed everything. It became possible to create whole APIs that were powered by serverless compute. More and more AWS services integrated with the Lambda compute offering, making it possible to build even larger, more complex, fully serverless applications.

But what is a serverless application, exactly? In sum, an architecture is serverless if it has these characteristics:

- Event-driven workflow ("If X then Y")
- Pay-per-execution
- Zero administration
- Auto-scaling
- Short-lived, stateless functions

### Advantages of serverless

- Zero administration
- Pay-per-execution
- Zero cost for idle time
- Auto-scaling
- Faster time-to-market
- Microservice nature —> Clear codebase separation
- Significantly reduced administration and maintenance burden

### Disadvantages of serverless

- No standardization (though the CNCF is working on this)
- Black box
- Vendor lock-in
- Cold starts
- Complex apps can be hard to build

## When to choose what?!

Now that we've learned more about those two exciting new technologies it's time to ask ourselves:

> "Which technology should I pick for my next project"?

As with most technology-related choices the answer is: "It depends..."

Containers are great if one needs the full flexibility to install and use software with specific version requirements.
This flexibility ranges from the choice of the underlying operating system up to the full control of the installed
programming language and runtime version.

It's even possible to operate containers with different software stacks throughout a large container fleet. This makes it 
especially interesting if an old, legacy system should be migrated into a containerized environment.

Container scheduling and management systems such as [Kubernetes](https://kubernetes.io/) are the de-facto standard to manage
large-scale container setups. It's one of the most active projects on GitHub and was started by Google employees who
were heavily involved with the first iterations of Googles own homebrew container platform called "Bord". This means that
best-practices are already built-in.

However this flexibility comes with a price tag. To fully benefit from containers one needs to split up the monolithic
application into separate microservices which in turn need to be rolled-out as individual groups of containers. Those
containers need to communicate with each other which involves more tooling to be setup and operated. Other than that it's
important to keep the containers and their operating systems up-to-date. This means that security fixes and other updates
need to be installed.

A containerized application can be configured to be self-healing and auto-scaling. Therefore traffic increases or
decreases are automatically handled by the container orchestration platform. However detecting changes in traffic patterns
and spinning up / down the containers takes some time to take effect.

A complete shutdown where no container-related infrastructure is running at all (e.g. when there's no traffic) is not
possible which means that there are always running-costs involved when operating a such a container-based setup.

On the other hand serverless applications are great if changes in traffic patterns should be automatically detected and
handled in a blazing fast fashion. It's even possible to completely "shutdown" the application if there's no traffic at all.
With serverless applications one only pays for the resources he needs and uses. No usage equals no costs.

As a serverless developer one doesn't have to care about the tedious task to administrate the underlying infrastructure the 
serverless application runs on (given this abstracted behavior it's even "a mystery" how the underlying infrastructure looks
like). A serverless developer just needs to care about the code which means that it's way faster to provide real business
value to end-users.

Having this clear separation between managed infrastructure and the solely focus on code results in a less flexible cloud
setup. The programming languages and runtimes are limited to the ones the provider supports (however there are 
workarounds / "shims" available to overcome those restrictions). The event sources which will trigger the functions are
usually services the cloud provider offers. Reasoning about all those individual pieces of the application stack becomes
harder.

We here at Serverless, inc. are tackling those problems and missing pieces to make it more convenient and easier than ever
to build and run large-scale serverless applications.
