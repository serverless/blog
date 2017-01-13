---
title: 'How To Write Your First Plugin For The Serverless Framework - Part 2'
description: "Learn how to write a Serverless Plugin in this guest post from Anna Doubkova. Start with the basics of creating a plugin in Part 1 of this tutorial. Then stay tuned for the follow-up post with more on implementation and different approaches to writing Serverless plugins."
date: 2017-01-30
thumbnail: https://cloud.githubusercontent.com/assets/20538501/21665215/e3c9aae6-d2b0-11e6-9865-498d91318e7a.png
layout: Post
authors:
  - AnnaDoubkova
---
Hi, I'm [Anna Doubkova](https://github.com/lithin), a software engineer at [Red Badger](https://red-badger.com/) in London. In my previous article (link link), you learnt what Serverless plugins are and how you can hook into the Serverless Framework yourself. In this follow-up article, you’ll see how to write an implementation of an actually useful plugin. To do that, we’ll be following the main ways of extending the framework:

1.	Writing a new command
2.	Extending an existing command to implement additional functionality
3.	Writing your own implementation of an existing command from scratch

##Writing a new command
In the previous article, we used a Serverless Framework template to create a new command and hook into its lifecycle events. We’ll be doing something similar this time but using a real-world, useful example that will show you the ropes of how Serverless plugin implementation works.

Imagine you have a microservice defined in your `serverless.yml` that also contains a DynamoDB table. You can deploy the functions, add API gateway endpoints, and create the table automatically by running `serverless deploy`. Now you want to backup/download backup/download data from the table. If you do such a thing frequently, it'd be very tedious to repeat aws-cli commands over and over. Instead, let's write a plugin for it.
