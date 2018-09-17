---
title: "Google Cloud Functions goes GA: what it means for Serverless"
description: "Google Cloud Functions hits general availability. A big step forward for FaaS, vendor choice, and the serverless community."
date: 2018-07-25
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/gcf/serverless-google-cloud-functions-ga.jpg'
category:
  - news
  - guides-and-tutorials
  - operations-and-observability
heroImage:
authors:
  - NickGottlieb
---

Yesterday at Google Cloud Next, Google announced general availability for their serverless functions offering, Google Cloud Functions.

This is a solid step forward in making it easier for developers to use Google’s innovative services with minimal friction. It’s also a major step forward for FaaS—now all four major cloud providers offer FaaS compute.

Serverless, Inc. has a [Component available](https://github.com/serverless/components/tree/master/registry/google-cloud-function) to use for Google Cloud Functions _right now_. The Serverless Framework has supported Google Cloud Functions for over a year now, and we are already moving to release an update to work with Google’s new APIs.

Here’s everything you, as a serverless developer, need to know about GCF and its impact on serverless development.

## Why it matters for Google

Google is one of the big four public cloud providers, and while [they currently lag behind in cloud market share](https://www.forbes.com/sites/bobevans1/2018/02/05/why-microsoft-is-ruling-the-cloud-ibm-is-matching-amazon-and-google-is-15-billion-behind/#763f46e41dc1), they have some amazing technology and the potential to grow significantly.

For Google and their Cloud Platform, valuable technology has never been the challenge; they’ve innovated technologies like Kubernetes, TensorFlow, and BigTable. Their challenge, and often the challenge in offering a compelling cloud platform in general, is presenting developers with a unified platform of compelling and easy-to-adopt services.

Google Cloud Functions is a good step in that direction. Working with functions is something that is intuitive for developers, and offers a great onboarding story for to the wider Google Cloud community.

Want to take advantage of Google’s machine learning or networking services? Just write a function that taps into those services.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/gcf/gcf-serverless.svg">

While the integration story with Google Cloud Functions and the rest of their services is certainly not complete, this is good progress. If you’re a developer who wants to take advantage of more Google services, this announcement should mean you are very happy right now.

## Why it matters for the Serverless Movement

With the general availability of Google Cloud Functions, all four major public cloud providers now offer a serverless FaaS compute option. This helps solidify FaaS as a preferred building block for cloud applications, and is a hopeful step toward having interoperability between these different FaaS compute options (see: [CloudEvents](http://cloudevents.io/)).

## Why this matters for Serverless Framework users

The [Serverless Framework](https://serverless.com/framework/) is cloud-agnostic development framework that makes it easy for developers to build serverless applications on any FaaS provider. While the Framework has had an integration with Google Cloud Functions for over a year, we will soon be releasing an update to work with Google’s updated APIs.

We’ve also [authored a Serverless Component](https://github.com/serverless/components/tree/master/registry/google-cloud-function) that makes it simple and easy to deploy a Google Cloud Function.

**Note:** If you haven’t already checked out the [Serverless Components project](https://serverless.com/blog/what-are-serverless-components-how-use/), it’s aimed at offering and easy, open, and composable packaging mechanisms for serverless logic.

## In sum

If you’re a developer who likes Google’s innovative suite of managed services, you should be really happy about Google Cloud Functions. This will give you the power to utilize those services much more easily.

If you’re enthused about the serverless movement and/or a user of the Serverless Framework, you should be excited to see that all four major cloud providers are embracing FaaS and pushing serverless compute forward.

### Other posts about Google Cloud
- [Building an image recognition endpoint with Serverless and Google Cloud Functions](https://serverless.com/blog/google-cloud-functions-application/)
