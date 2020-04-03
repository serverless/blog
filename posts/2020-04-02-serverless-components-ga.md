---
title: Announcing Serverless Components GA
description: "We're bringing Serverless Components out of beta and introducing several new features to deliver a dramatically improved serverless development experience."
date: 2020-04-02
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-04-02-serverless-components-ga/blog-serverless-components-ga.png"
authors:
  - AustenCollins
category:
  - news
---

Today, we're bringing [Serverless Framework Components](https://github.com/serverless/components) out of beta, and introducing several new features, including a **"serverless dev mode"** that enables you to develop on the cloud, via an experience that looks and feels local...

Check out the video overview and register for our [Serverless Components Webinar](https://serverless.zoom.us/webinar/register/WN_ghGrf0R1TG29a74ElKYPLQ), if you would like to join us.

<iframe width="560" height="315" src="https://www.youtube.com/embed/3ndGjkuqyyc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

Serverless Components are a Serverless Framework feature that enables you to deploy applications and use-cases on auto-scaling, pay-per-request, serverless cloud infrastructure—without a lot of infrastructure knowledge.

An example is [Serverless Express](https://github.com/serverless-components/express), one of a handful of Components that are part of today's release.  You can use it to rapidly build Express.js applications on AWS Lambda and AWS HTTP API, to deliver an API that auto-scales massively, and only charges you when it runs ($0.0000002 and $0.0000009 per request).

Here are the new features of the GA release, which you can use with Serverless Express and other Components, like [Serverless Website](https://github.com/serverless-components/website), [AWS DynamoDB](https://github.com/serverless-components/aws-dynamodb), and [more](https://github.com/serverless-components)...

## Fast Deployments

When it comes to development, speed is a killer feature.

Serverless Components is now powered by our innovative Components Engine, which performs all deployments, and reduces deployment time to under 8 seconds.

![Serverless Components Fast Deployments](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-04-02-serverless-components-ga/artwork-serverless-components-ga-1.png)

With fast deployments, it becomes much easier to develop directly on real cloud services, rather than maintain a local emulation of those services.

Now, you can develop on the same cloud infrastructure your application will use in production, without compromising on development velocity.

## Dev Mode

Getting logs from cloud services while developing on them has previously been slow and difficult.

Serverless Components features a new "Dev Mode", which speeds up the feedback cycle during development, just run `serverless dev` in your Component.

First, "Dev Mode" watches your code, detects changes and auto-deploys it rapidly using our Components Engine.

Second, when you interact with your application using "Dev Mode", transactions, logs and errors stream from your application to your CLI in real-time.  

![Serverless Dev Mode](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-04-02-serverless-components-ga/artwork-serverless-components-ga-2.png)

It looks and feels as fast as if your application is running locally.

## Advanced Functionality

Every Component is rich in advanced functionality.

For example, the Express Component can set up a custom domain for you, as well as a free AWS ACM SSL certificate.

This Component also ships with canary deployment support, so you can roll out code changes that affect a subset of your HTTP requests.  Just merge in your new experimental code, and set the percentage of requests you wish for it to receive.

Every Component now stores its state automatically in the cloud, so you can easily collaborate on them and run them in CI/CD.

Components also feature better support for staging. Pass in a `--stage` flag to deploy a separate instance of your Component.

Lastly, Components export outputs, which are saved in the cloud and therefore easy to reference as inputs for other Components.  You can even use outputs from Components in different stages.

Components are free to use with the Serverless Framework.  Check them out at [https://github.com/serverless/components](https://github.com/serverless/components).
