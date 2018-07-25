---
title: "Google Cloud Functions goes GA: what it means for Serverless"
description: "Google Cloud Functions hits general availability. A big step forward for FaaS, vendor choice, and the serverless community."
date: 2018-07-25
layout: Post
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/gcf/google-cloud-functions-serverless.png"
authors:
  - NickGottlieb
---

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/gcf/serverless-google-cloud-functions.png">

Today at Google Cloud Next, Google announced general availability for their serverless functions offering, Google Cloud Functions.

This is a solid step forward in making it easier for developers to use Google’s innovative services with minimal friction. It’s also a major step forward for FaaS—now all four major cloud providers offer FaaS compute.

We have a Component available for Google Cloud Functions now, and are already moving to integrate Google’s new APIs.

Here’s everything you, as a serverless developer, need to know.

## Why it matters for Google

Google is one of the big four public cloud providers, and while [they lag AWS, Microsoft and even IBM in market share](), they have some amazing technology and potential to grow significantly. 

For Google and their Cloud Platform, valuable technology has never been the challenge. They’ve innovated technologies like Kubernetes, TensorFlow, and BigTable. Their challenge, and often the challenge in offering a compelling cloud platform in general, is presenting developers with a unified platform of compelling and easy-to-adopt services. 

Google Cloud Functions is a good step in that direction. Working with functions is something that is intuitive for developers, and offers a great onboarding story for to the wider Google Cloud Function. Want to take advantage of Google’s machine learning or networking services? Just write a function that taps in those services.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/gcf/gcf-serverless.svg">

While the integration story with Google Cloud Functions and the rest of their services is certainly not complete, this is good progress. If you’re a developer who wants to take advantage of these more Google services, this announcement should mean you are very happy right now.

## Why it matters for the Serverless Movement

With the general availability of Google Cloud Functions, all four major public cloud providers now offer a serverless FaaS compute option. This helps solidify FaaS as a preferred building block for cloud applications, and is a hopeful step toward having interoperability between these different FaaS compute options (see: [CloudEvents](http://cloudevents.io/)). 

## Why this matters for Serverless Framework users

The Serverless Framework is cloud-agnostic development framework that makes it easy for developers to build serverelss applications on any FaaS provider. While the framework has had an integration with Google Cloud Functions for over a year, we will soon be releasing an update to work with Google’s updated APIs. 

We’ve also [authored a Serverless Component]() that makes it simple and easy to deploy a Google Cloud Function.

**Note:** If you haven’t already checked out the [Components project](https://serverless.com/blog/what-are-serverless-components-how-use/), it’s aimed at offering and easy, open, and composable packaging mechanisms for serverless logic.

## In sum

If you’re a developer who likes Google’s innovative suite of managed services, you should be really happy about Google Cloud Functions. This will give you the power to utilize those services much more easily.

If you’re enthused about the serverless movement and/or a user of the Serverless Framework, you should be excited to see that all four major cloud providers are embracing FaaS and pushing serverless compute forward. 
