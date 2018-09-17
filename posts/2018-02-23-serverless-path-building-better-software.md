---
title: The serverless path to building better software
description: Nick Gottlieb shares his ServerlessConf Tokyo talk on serverless, the state of software, and ways to accelerate productivity.
date: 2018-02-23
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/better+software/devs-thumb.jpeg
category:
  - engineering-culture
authors:
  - NickGottlieb
---

We, as the software tooling industry, are failing to empower developers to build better software.

Don’t get me wrong, the way we develop software has changed dramatically over the last 30 years. We’ve made tremendous progress in terms of the technologies and tools available to us.

But what have these developments actually done for our productivity as software developers and creators? Have they made it easier to build software? Cheaper? Faster?

I’ve spent the last 6 years of my career building tools aimed at making developers more productive (first with my own startup, then CircleCI, and now Serverless), and in searching for the answers to these questions I’ve mostly found them to be *no*.

While there have certainly been tools developed that have helped us to build much more powerful software, they have only incrementally contributed to our productivity. As an industry, we’re still faced with the same underlying problem: building software is extremely difficult and expensive.

## The proof is in the cloud

Let’s take a look at ‘the cloud’ as a very macro example. The cloud lets somebody else manage our servers, letting us (the developers) spend more time focusing on code.

This is an incredible value proposition. This is the value proposition that has resulted in an explosion of cloud services over the past 10 years as well the healthy $650 billion market capitalization that Amazon enjoys as I’m writing this.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/better+software/amazon-market-cap2.png">

But while the cloud has delivered on its promise of freeing software developers from having to deal with physical servers, it has failed to eliminate a lot of the complexity that made dealing with servers a pain in the first place: provisioning, scaling, maintaining, debugging, etc.

This same paradox holds true for a lot of the technologies that we as an industry (myself included) have helped create.

CI/CD platforms help make testing and deploying software easier, especially among teams, but they still require writing tests, configuring the environment, and dealing with faulty build containers. GitHub provides us with a much better user experience for collaborating on software, but it hasn’t fundamentally eliminated the problems teams face when they  collaborate on a complex code base.

**In general, most of the progress we’ve made as an industry has been incremental.** We’ve failed to make software significantly easier, cheaper, and faster to develop, which is the end state that we all want.

## The path to building better software

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/better+software/path.jpeg">

My short answer: serverless. Or rather, continuing to invest in the robustness of serverless technology.

Serverless, which is a movement to abstract infrastructure away from application development as much as possible, is currently manifested mostly in the form of function-as-a-service (FaaS) offerings, such as AWS Lambda.

These offerings, and the wider serverless movement itself, are interesting because they have the potential to manifest dramatic increases in productivity.

Namely: democratizing the ability to create heavily customized tooling, eliminating work redundancy by letting us reuse code, and making it much easier for us to access data.

### Making it easy to customize tooling
When it comes to software development tooling, we face the same issues any potential consumer of SaaS faces. Build or buy?

Invest in building a tool to exactly meet our needs, and then get stuck maintaining it? Or adopt a third-party offering, which inevitably comes with some baked-in opinions and workflows that won’t work the way we need? Neither are ideal; both result in tool stacks that are often brittle, expensive, error-prone, and don’t help us efficiently produce high-quality software.

Ideally, we’d be able to adopt a tool that has a strong open-source community and/or commercial company behind it—but is easily, and drastically, customizable.

This answer might seem obvious, but we just aren’t there. The growing proliferation of open APIs did some of this groundwork, but it’s still far from easy to customize most tooling.

Serverless, though, has the potential to make this ideal state a reality.

If your source management, CI/CD, and project management system all exposed events in a uniform fashion, which you could easily react to with a serverless function deployed to any platform of your choice—well, I’d say that’s pretty ideal.

We have a ways to go to achieve this, but projects like [Auth0’s Extend](https://auth0.com/extend/), [CNCF’s CloudEvents](https://openevents.io/), and many more are making progress towards this goal.

### Making it easy to reuse code
As developers, there’s nothing more disheartening than writing code that we’ve written a hundred times.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/better+software/reuse-code.jpeg">

How amazing would it be if we could compose the bulk of our applications out of pieces of code we’ve already written, and then focus our coding time on the business logic that delivers unique value?

Serverless architectures today are essentially microservice architectures: groups of functions that have common functionality. They are deployed together, and share infrastructure resources such as an API gateway.

I believe that as serverless tooling evolves, these services will become much smaller, much more specific, and will cover a much wider set of use cases (e.g. a function that deploys and configures a specific piece of infrastructure, or performs a load-test). As these services become smaller and more specific, they also become more easily shared, configured, and consumed by people other than the original developer.

This will eventually take us to a future in which micro-services can be easily shared, deployed, and reused—both publicly, and privately within an organization.

This would dramatically reduce the amount of time we spend re-inventing the wheel and allow us to focus more on unique functionality and business value. 

There are currently efforts along these lines underway, such as [Standard Lib](https://stdlib.com/). It’ll be really exciting to see where these go in the future.  

### Making it easy to access data
All digital businesses today generate and collect massive amounts of data. This data is a resource that could be extremely valuable. Notably, we could use it to build even more powerful features for our users.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/better+software/data2.jpeg">

The problem that comes along with this massive amount of data is that it tends to live in a lot of different places in a lot of different formats, making it difficult to utilize.

Event-driven architectures, which serverless architecture are typically built upon, have the ability to expose all data in the form of events. These events are then directly utilizable with serverless functions.  

While this general architectural pattern is still young, if we could reach a state where all data exists in the form of events, and can be reacted to with functions hosted anywhere, we could solve a lot of data portability and access challenges we face today.

The result: far more productive development.

## In sum
This is an exciting time to be a developer. We’re likely to see radical and unprecedented improvements in the tools we have available.

It’s up to each of us to continue to demand and drive that change.
