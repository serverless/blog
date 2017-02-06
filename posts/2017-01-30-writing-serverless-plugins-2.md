---
title: 'How To Write Your First Plugin For The Serverless Framework - Part 2'
description: "Learn how to write a Serverless Plugin in this guest post from Anna Doubkova. Start with the basics of creating a plugin in Part 1 of this tutorial. Then stay tuned for the follow-up post with more on implementation and different approaches to writing Serverless plugins."
date: 2017-01-30
thumbnail: https://cloud.githubusercontent.com/assets/20538501/21665215/e3c9aae6-d2b0-11e6-9865-498d91318e7a.png
layout: Post
authors:
  - AnnaDoubkova
---
Hi, I'm [Anna Doubkova](https://github.com/lithin), a software engineer at [Red Badger](https://red-badger.com/) in London. In my previous article (link link), you learnt what Serverless plugins are and how you can hook into the Serverless Framework yourself. In this follow-up article, you’ll see how to write implementation of a plugin that could be used in real life.

##Extending Serverless Framework
Plugins extend functionality of the framework to make it tailored for your use-case. The framework is very flexible and allows you to take different strategies to implementing your logic. The main ways are:

1.	Writing a new command
2.	Extending an existing command to implement additional functionality
3.	Writing your own implementation of an existing command from scratch

##Writing a new command
Let's have a look at a practical example that will illustrate why we'd want to write a new command for the Serverless Framework.

Imagine you have a microservice defined in your `serverless.yml` that contains a DynamoDB table. You can deploy the functions, add API gateway endpoints, and create the table automatically by running `serverless deploy`. Easy!

What if you want to copy data from production to dev table so that you can test your application with real data? You could export and import data from one table to another but that'd be very tedious if done frequently. Instead, we'll write a plugin for it.



console.log('aws', serverless.providers.aws);
console.log('utils', serverless.utils);
console.log('variables', serverless.variables);
console.log('config', serverless.config);
