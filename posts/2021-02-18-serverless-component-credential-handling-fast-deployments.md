---
title: Components - Improved Credential Handling & Faster Deployments
description: "Serverless Framework Components now features more secure credential handling and 80% faster deployments"
date: 2021-02-18
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components-credentials-deployments/components-credentials-deployments.png"
authors:
  - AustenCollins
category:
  - news
---

[Serverless Framework Components](https://www.github.com/serverless/components) enable developers to deploy popular serverless use-cases onto AWS Lambda more easily—and now more securely and quickly.

Components are an optional feature in [Serverless Framework](https://github.com/serverless/serverless), and they use an innovative cloud engine, hosted by our company.  If you log in to use Components, you can take advantage of a handful of compelling features.  

## Improved Credential Handling

Since the model of Components is different from how Serverless Framework has worked traditionally, and it involves passing your source code and AWS account credentials through our hosted engine, we've improved how we handle and protect your credentials, if you choose to use Components.  

These improvements involve **requiring** use of our new [Providers](https://www.serverless.com/framework/docs/guides/providers) feature.  Providers allow you to give us access to an AWS IAM Role in your AWS account, which we can assume to generate temporary credentials to perform deployments with.  You control the AWS IAM Role, so you can revoke our access to your AWS accounts at any time.

You can easily set a default Provider for your entire Organization in our [Dashboard](https://app.serverless.com), or set specific Providers to use with each Service or Stage.  This makes it easy for teams to assign which AWS accounts their applications and application stages deploy to.

By requiring use of Providers for Components, we hope to make it easier and safer for us to deploy serverless applications into your AWS accounts, and enable use of Components' great features like the upload caching described below.

* **[Check out the Components documentation to learn more about how they handle source code and credentials.](https://github.com/serverless/components)**

* **[Check out the Providers documentation to learn more about them.](https://www.serverless.com/framework/docs/guides/providers)**

## 80% Faster Deployments Through Upload Caching

One of our big missions at Serverless Inc., is to help developers develop directly on the cloud, so they face no surprises when they deploy to production.

A big obstacle to this is that deploying changes to the cloud is simply too slow.  Current infrastructure-as-code-tooling can cause developers to wait 1-3 minutes until their infrastructure and minor code changes are live on the cloud.

Additionally, depending on your internet connection speed, a lot more time is required to merely upload a lot of code to services like AWS Lambda.  Due to the pandemic, more developers are working from home, and working with slower internet connection speeds as a result.

Our cloud engine changes this.  It's capable of performing infrastructure modifications within seconds, and it now comes with built-in upload caching which dramatically reduces the amount of code uploaded upon each deployment.

Now, when you deploy any Serverless Component use-case that involves source code, only the files you have modified are uploaded, and the rest is cached.  In our tests, this reduces deployment speeds for commmonly-sized projects by 80%.

As a benchmark, when using the [Serverless Express.js Component](https://github.com/serverless-components/express), with an application source code size of 66MB, a 1.5MB/s internet connection upload speed, deployment speed typically takes around 48 seconds.  With upload caching, and modifying a couple of files (which is the majority of deployments), **deployment speed is reduced to 8 seconds.**

If a developer is making 120 code changes to their Express.js application a day, **this saves them over an hour of deployment time.**

Components are free to use for single developers making infinite projects.  

**[Check out the Components documentation to get started.](https://github.com/serverless/components)**








