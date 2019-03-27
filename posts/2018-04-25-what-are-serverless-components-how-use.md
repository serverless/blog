---
title: "What are Serverless Components, and how do I use them?"
description: "Serverless Components gives you a way to compose and share parts of a cloud application. Serverless development just got even easier."
date: 2018-04-25
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components.gif'
category:
  - news
  - guides-and-tutorials
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components.gif'
authors:
  - BrianNeisler
---

#### So, what’s the goal with Serverless Components?

We want to make it easier for you, our developer community, to assemble cloud applications. Plain and simple.

Composing a modern application means you’re plucking SaaS and managed (i.e. serverless) services from all over and combining them to create solutions. This is great, because it's faster and has lower overhead.

But it's also highly complex. There’s a lot of manual work you have to do to assemble these pieces into an outcome, and not a lot of tooling to help you build and manage that outcome.

#### Enter: Serverless Components

[Serverless Components](https://github.com/serverless/components) aims to change all of that.

Components presents a single experience for you to provision infrastructure and code across all cloud and SaaS vendors. Think of them like building blocks which you can use to build applications more easily.

Serverless Components will also form an ecosystem driven by community contributions, which you can browse through and utilize. The net result is that you save development time. Don’t build your own image processing API from scratch—use the existing component and tweak it.

#### How Serverless Components work

Let’s take a look at how you can use Serverless Components to create an entire serverless application.

##### A uniform experience

Any cloud service can be packaged as a Serverless Component.

Within each Component is the provisioning, rollback, and removal functionality for that service, which you can run via the [Serverless Components CLI](https://github.com/serverless/components).

Components expose minimal configuration with sane defaults so that you can configure the resource it contains more easily.  To do this, add the Component you wish to provision in a “components” property within a serverless.yml file.

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components-s3-config.png">

Run `components deploy` to provision the resource.

##### Composing components into higher-order components

Say you want to write a serverless image processing API that pulls images from S3 and modifies them. To do so, you might create an AWS API Gateway endpoint to call an AWS Lambda function, which then pulls an image from the AWS S3 bucket and modifies it.

[We currently offer Components for all of these services](https://github.com/serverless/components/tree/master/registry).  Each with simple configuration inputs so that you can configure their underlying resources easily and deploy them quickly.

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-component-s3.png">

All Serverless Components can be composed together and nested in a larger Component.

We’ll combine these three infrastructure-level Components to create our serverless image processing API, which will become its own, higher-order Component. Again, all of this is declared in your `serverless.yml` file.

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-component-image-processor.png">

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components-nesting.png">

Here’s why this is important.  When you create this image processing API, you will do a lot of initial work to configure everything. You’ll configure the Lambda function, the REST API endpoint, the S3 bucket, etc.

But you can abstract a lot of that away by nesting those infrastructure-level Components in a higher-order Component.  That higher-order Component can use sane defaults and expose simpler configuration.

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components-combined.png">

Now, you can reuse this higher-order Serverless Component somewhere else. Or, another developer can use it in their own application by simply tweaking some aspects of the configuration—for instance, maybe they just want to specify their own S3 bucket which contains images.

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components-processor-consumer.png">

These higher-order Components essentially become use-cases, which can be easily used and reused by anyone.

##### Composing components to form an entire application

Let’s zoom out from our image processing API. When you think about building an entire application, it has needs across the board. You need to have user management, plus lots of other data models and API endpoints to work with them.

Fortunately, you can continue to nest Serverless Components. Simply take the higher-order Component in the previous example and compose them together into *even higher* Components.

Like so, entire applications can be built by continuing to nest Serverless Components.

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components-photo-app-nesting.png">

Like all Components, people can easily reuse your application Component if it exposes simple configuration.

Most importantly: Serverless is about outcomes, not infrastructure. We believe we’ve made a solution that makes infrastructure more invisible, enhances developers’ ability to focus on outcomes, and fosters a community to share and reuse outcomes.

#### Ready to try Serverless Components?

Great! We have a full working example ready to go.

Head on over to the [Serverless Components repo](https://github.com/serverless/components) on GitHub and check out our [templates](https://github.com/serverless/components/tree/master/templates).

We’ve authored several infrastructure-level Components you can use to create higher-order outcomes [in our temporary registry](https://github.com/serverless/components/tree/master/registry.json).

If you'd like a really comprehensive walkthrough, here's how to [set up a landing page using the Serverless Netlify and Lambda Components](https://serverless.com/blog/how-to-create-landing-page-with-serverless-components/).

We’d love to hear any and all feedback from you, our developer community. So try it out and tell us what you think!

##### What’s next for Serverless Components?

We believe that Components represents the ideal developer experience for the future of serverless development, and we plan to integrate it into the [Serverless Framework](https://github.com/serverless/serverless). However, the implementation is not yet mature so we have decided to incubate it as a standalone project for now.

We have plans for a public registry, but for the time being we’re keeping all of the Components [in the Github repo](https://github.com/serverless/components/tree/master/registry).
