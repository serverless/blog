---
title: "Serverless Framework example for Golang and Lambda"
description: "AWS Lambda Golang support is one of the most exciting announcements of 2018. Here's a quick template for using Go with the Serverless Framework!"
date: 2018-01-18
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Golang/golang-logo.png'
authors:
  - MaciejWinnicki
---

Everyone, the day has come.

AWS Lambda is finally. Compatible. With Golang. 🖖

Here's how you can start using Go with the Serverless Framework RIGHT NOW and deploy Lambdas to your heart's content.

# Get Started

First things first, you'll be needing the [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed, and an [AWS account](http://docs.aws.amazon.com/lambda/latest/dg/setting-up.html#setting-up-signup).

(If it's your first time using the Serverless Framework, our [first time deployment post](https://serverless.com/blog/anatomy-of-a-serverless-app/#setup) has a quick setup guide. Takes like 5 minutes, we promise.)

# Use the Go template

The Framework will configure AWS for Go on your behalf. Use this quick [serverless-golang template](https://github.com/serverless/serverless-golang) to deploy your first service.

Open up your terminal and let's create a new service with Go:
`serverless create -u https://github.com/serverless/serverless-golang/ -p myservice`

Compile the function:
`cd myservice
GOOS=linux go build -o bin/main`

...That's it! You can deploy now:
`serverless deploy`

# Why use Go for your Lambdas?

I just deployed a simple service with Go, and it is lightning fast: 0.76ms runtime.

This is really exciting; can't wait to see what the serverless community builds!
