---
title: "How to Create a multi-cloud REST API with Serverless Framework and the Serverless Multicloud SDK"
description: "Learn how to write a single Serverless REST API that can be deployed to multiple clouds including Azure and AWS"
date: 2019-10-01
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part1/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part1/header.png"
category:
  - guides-and-tutorials
authors:
  - WallaceBreza
---

#### Overview

Today - it is incredibly easy to deploy Serverless applications using the Serverless Framework.  What happens when your business is adopting a multi-cloud strategy?  There is no easy way to build a Serverless app that can be easily deployed across multiple cloud providers without using containers... until now.

Introducing the Serverless Multicloud SDK.  With the Serverless Multicloud SDK you can write your Serverless handlers once in a cloud agnostic format and continue to use the Serverless CLI to deploy your service to each of your targeted cloud providers.

In the initial release the Serverless Multicloud SDK supports NodeJS with both Microsoft Azure and Amazon Web Services.  The SDK has an Express-like feel.  It supports familiar concepts like `Middleware` to abstract away your service's cross-cutting concerns.

This guide assumes you have some working knowledge on how to build services with the Serverless Framework.  We will 