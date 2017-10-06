---
title: Test-Driven Development for AWS Lambda functions with the Serverless framework and Jest
description: Practical tutorial about TDD for your AWS cloud functions with the Serverless framework, Jest and aws-sdk-mock for building unit and integration tests.
date: 2017-10-10
thumbnail: https://cloud.githubusercontent.com/assets/4726921/23232988/fdabd3fa-f955-11e6-84bd-c8a939841360.png
layout: Post
authors:
 - KalinChernev
---

# Introduction

The [serverless framework](https://serverless.com/) makes it easy to develop and deploy cloud functions. In a project I'm working in, we're using the [AWS](https://serverless.com/framework/docs/providers/aws/) provider. The framework itself has matured enough to facilitate development processes - it's worth spending time testing!

There is a good document with guidelines for [writing tests in serverless](https://serverless.com/framework/docs/providers/aws/guide/testing/) already. Also, there is another [blog post about the basics](https://serverless.com/blog/tdd-serverless/). In our project, however, we use [Jest](https://facebook.github.io/jest/) which seems to be a trend. And because there are several questions about it in the comment section of the mentioned article, it'll worth having this follow-up one answering some of the questions.

By the end of this article, you will:

- be able to use Jest more effectively
- know how to test your library code - the helpers used by lambda functions
- be able to test lambda functions without killing yourself with abstractions
- learn how to use test doubles for AWS services

## Project setup

Before going into the testing framework and the details about the testing itself, it's worth spending some time configuring your environment so that you work effectively.

Here's an overview of the file structure for the tutorial:

```
.
└── package.json

0 directories, 1 file
```

### Tools

Here's a list of the package used in this tutorial:

- `serverless` with `webpack` and `serverless-webpack`
- `babel` with some add-ons, mainly `babel-preset-env`
- `eslint` with more add-ons, and `prettier`
- `aws-sdk` and `aws-sdk-mock`
- `jest`

### Optimizations

- The webpack plugin
- The env babel preset

### Configurations

- babel
- jest
- serverless
- test tasks

## Jest

- works well with promises
- import handler and promisify it
- use the watch mode from the root

## Unit testing

- organize the code in a [testable way](https://claudiajs.com/tutorials/designing-testable-lambdas.html)
- the library code serving as helpers
- lambda function assertions

## Testing AWS services

- `aws-sdk-mock`
