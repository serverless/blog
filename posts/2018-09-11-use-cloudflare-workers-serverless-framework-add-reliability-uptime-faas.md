---
title: "Use Cloudflare Workers + Serverless Framework to add reliability and uptime to your FaaS"
description: "Cloudflare Workers integrates with the Serverless Framework. Use Cloudflare Workers to add reliability and uptime to your existing FaaS!"
date: 2018-09-11
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudflare-workers/serverless-cloudflare-workers-header.png'
category:
  - news
  - guides-and-tutorials
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudflare-workers/serverless-cloudflare-workers-header.png'
authors:
  - RaeesBhatti
---

If you haven’t heard of Cloudflare Workers, [serverless developers are already using them](https://www.troyhunt.com/serverless-to-the-max-doing-big-things-for-small-dollars-with-cloudflare-workers-and-azure-functions/) to cut costs, and add uptime and reliability to their Functions-as-a-Service. And now, you can deploy Cloudflare Workers from the Serverless Framework CLI as easily as you deploy to Lambda, Azure, or Google Cloud Functions!

Read more on how Cloudflare Workers can add even more robustness to your existing FaaS applications, and how to integrate it with the Serverless Framework.

#### What are Cloudflare Workers?

Cloudflare offers a suite of products which add performance, security, and reliability for your website.

They accelerate applications through their CDN, scan for malicious traffic patterns to proactively block DDoS attacks, provide DNS and free SSL, and load balance against origin servers to ensure application availability.

But most importantly for the serverless world, the Cloudflare team recently announced Cloudflare Workers—edge programmable bits of logic based on W3C Service Workers spec.

Cloudflare Workers ultimately function similarly to a FaaS provider (like Lambda or Azure Functions).

#### Why use Cloudflare Workers with Serverless?

FaaS providers like Lambda can provide your core business logic, doing things like connecting your application with existing infrastructure.

Cloudflare Workers are there to _enhance_ your business logic: you can enforce geo-based access policies, for example, or perform A/B testing with a Cloudflare workers script (instead of integrating that into your core business logic).

With the Cache API in Cloudflare Workers, you can also implement a custom caching logic to help reduce the operational and network costs.

##### Adding reliability and uptime

Using Cloudflare Workers can significantly enhance your existing FaaS implementations, adding reliability and uptime. Here’s an example:

Say you misconfigure your AWS API Gateway, and all the requests going to your domain are failing. If you have a worker in Cloudflare, it can check whether the endpoint is working correctly. If it isn’t, Cloudflare can redirect them to a custom page, or send your users to a different region and issue an operational alert to notify the developer.

That’s the beauty of using the Serverless Framework for your public cloud development—developers can deploy to multiple cloud providers from the same toolkit, easily taking advantage of the best features from each.

#### Get started with Cloudflare using the Serverless Framework

If you don’t already have Serverless installed, you’ll need to do that:

`npm install serverless@latest -g`

You’ll also need to [create a Cloudflare account](https://dash.cloudflare.com/sign-up), and then [grab your Cloudflare account and zone](https://developers.cloudflare.com/workers/api/).

##### Deploying your first Cloudflare Worker on the Serverless Framework

First, let’s create a template for Cloudflare workers:

 `serverless create --template cloudflare-workers --path new-project`

The `--path` should be set to whatever you would like to call your project. `cd` into your new project folder and
run `npm install`.

In order to be able to deploy any Cloudflare Workers, You will need to set your Global API key from Cloudflare as an environmental variable named `CLOUDFLARE_AUTH_KEY`, and your Cloudflare account email as an environmental variable named `CLOUDFLARE_AUTH_EMAIL`. You can get your Global API key from your [Cloudflare profile](https://dash.cloudflare.com/profile) page. You will also need to set `accountId` and `zoneId` in `serverless.yml` under `service.config`. The first part of the path when you open [Cloudflare dashboard](https://dash.cloudflare.com/) as a logged in user is your `accountId` (e.g. `dash.cloudflare.com/{accountId}`). And the `zoneId` can be found from the overview tab after selecting the desired zone from the [Cloudflare dashboard](https://dash.cloudflare.com/).

Next, we can deploy a simple hello world:

`serverless deploy`

And test it to make sure it worked:

```
serverless invoke --function helloWorld

Hello world
```

If we choose to, we can then remove the service with `serverless remove`.

#### Check out the docs

- [See the full Quick Start guide here](https://github.com/serverless/serverless/blob/d119d406057c89d215c85848a24ded9ee739b246/docs/providers/cloudflare-workers/guide/quick-start.md)
