---
title: Azure Functions Support & Possibility
description: Announcing Azure Functions support with the Serverless Framework
date: 2017-02-23
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/azure-functions-thumbnail.png
layout: Post
authors:
  - AustenCollins
---
To the engineers and business leaders ducking out of political protests, excusing themselves from heated dinner table debates, rolling up their sleeves and getting back to work:  Ready to actually take on the insurmountable challenges all around you?  First you'll need courage.  After that, you'll need really good *tools*.

Fortunately,  tools couldn't be better right now.  The cloud providers are competing for your business and doubling down on investment in their platforms.  The number of high-value services in database, storage, artifical intelligence technology and more is growing rapidly.  Innovation in IaaS is now a daily occurrence.

Meanwhile, getting started is easier than ever.  If you want to adopt a cloud provider and utilize these new services immediately, put some code there, in the form of a *Serverless Function*.

No doubt the cloud providers have recognized this, given there are now serverless compute offerings from AWS, Google, Azure, IBM and more.  Serverless functions are a gateway drug into their platforms.  However, a side effect has our attention... 

> Serverless Functions don't only break down the barriers between adopting a cloud.  Serverless Functions break down the barriers between adopting all clouds, simultaneously.

Stateless, zero-administration, pay-per-execution functions can exist in a single region, multiple regions as well as multiple providers, with minimal administration and no cost for idle.  Developers can stash serverless functions across providers, enabling them to use more cloud services to solve more problems.  This resulting possibility is what excites us at Serverless, Inc.

It's a bit early to tell what the serverless multi-cloud architecture will look like, how it will work and whether it can solve the timeless concern of vendor lock-in (which is a complex problem).  However, it's a concept we are heavily focused on and we'll be introducing more products this year to reduce lock-in and capitalize on all of the providers, together.

That said, we're pleased to announce support for Azure Functions within the Serverless Framework.  Our goal is to offer a uniform experience across serverless compute providers.  So you can develop and deploy functions in a single fashion, regardless of their host.

![https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/azure-functions.png](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/azure-functions.png)

The Azure Functions integration exists as a [Serverless Framework plugin](https://github.com/serverless/serverless-azure-functions).  Check out the [README](https://github.com/serverless/serverless-azure-functions) or the [documentation](https://serverless.com/framework/docs/providers/azure/guide/quickstart/) to learn how to install and use it.  [Azure Functions](https://azure.microsoft.com/en-us/services/functions/) offers a lot of great functionality, like binding directly to SaaS events (e.g., Github!).  We hope you take advantage of all they have to offer.

Sit tight.  A lot more to come...
