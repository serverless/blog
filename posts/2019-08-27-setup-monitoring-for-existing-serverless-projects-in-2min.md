---
title: "Setup monitoring for existing Serverless projects in 2 minutes"
description: "Learn how to setup monitoring for your existing existing Serverless projects in 2 minutes."
date: 2019-08-27
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/setup-monitoring-existing-project/setup-monitoring-existing-serverless-project-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/setup-monitoring-existing-project/setup-monitoring-existing-serverless-project-header.gif"
category:
  - guides-and-tutorials
  - news
authors:
  - DanielSchep
---

One of the challenges when working with the Serverless Framework and lambda is how to monitor your software. There exist various solutions for this, but nearly all of them require time and work to instrument your codebase. Today I will show you how in 2 minutes, with zero instrumentation, you can add monitoring to your existing Serverless project.

First, make sure you have your terminal open in the directory containing your Serverless project. Then run the `serverless` command without any arguments. You will then be presented with an interactive set of prompts to configure your service for monitoring! Create an account and it will handle the rest for you.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/setup-monitoring-existing-project/sls-monitoring.gif" alt="screen recording of the interactive serverless setup flow">

Then run `serverless deploy` to redeploy your project with monitoring enabled. After that, you can open the monitoring dashboard for your service by running `serverless dashboard`.
