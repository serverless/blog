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

The [serverless framework](https://serverless.com/) makes it easy to develop and deploy cloud functions. In a project I'm working in, we're using the [AWS](https://serverless.com/framework/docs/providers/aws/) provider. The framework itself has matured enough to facilitate development processes - it's worth spending time writing testing!

There is a good document with guidelines for [writing tests in serverless](https://serverless.com/framework/docs/providers/aws/guide/testing/) already. Also, there is another [blog post about the basics](https://serverless.com/blog/tdd-serverless/). In our project, however, we use [Jest](https://facebook.github.io/jest/), which seems to be a trend for others as well. So I decided to complement to the existing community know-how about testing with another framework.

By the end of this article, you will:

- have a working development environment with modern JavaScript
- be able to use Jest effectively
- know how to test your library code - the helpers used by lambda functions
- be able to test lambda functions without killing yourself with abstractions
- learn how to use test doubles for AWS services

## Project setup

Before going into the testing framework and the details about the testing itself, it's worth spending some time configuring your environment so that you work effectively.

Here's an overview of the file structure for the tutorial:

```
├── config.example.json --> Copy and configure as config.json
├── package.json
├── README.md
├── serverless.yml --> Check if you want to tweak it
├── src --> You store your functions here, 1 file per each
│   └── upload.js --> the lambda function
├── test
│   └── upload.spec.js --> the test for the lambda function
├── webpack.config.js
└── yarn.lock
```

### Tools

Here's a list of the package used in this tutorial:

- `serverless` with `webpack` and `serverless-webpack`
- `babel` with some add-ons, mainly `babel-preset-env`
- `eslint` with more add-ons, and `prettier`
- `aws-sdk` and `aws-sdk-mock`
- `jest`

### Optimizations

Although this topic is not directly related to writing tests, it's always good to consider any possible optimizations you can have in your stack.

`babel-preset-env` with its `babel-*` related packages. By using the `env` [preset](http://babeljs.io/env) you both gain in less configurations, but also in the amount of code necessary after transpilations for a given target runtime platform. For example, as for the moment of writing this article, [v6](http://docs.aws.amazon.com/lambda/latest/dg/programming-model.html) is the highest version, configuring the preset to target v6 as well makes the resulting bundle far lighter because of the less need to legacy support features already given natively.

- `serverless-webpack` with its webpack settings can further optimize functions when they are [bundled individually](https://github.com/serverless-heaven/serverless-webpack#optimization--individual-packaging-per-function).

### Configurations

In the example project linked to this article you can have a look at the configurations necessary to have modern JavaScript running with serverless and Jest.

## Jest

To learn about the test framework, read the official [documentation site](https://facebook.github.io/jest/).

If I have to give my high-level impressions in few words:
- Working with promises is natural.
- There's the watch mode anyone would expect.
- There's also an integrated code coverage reporting.
- Snapshot testing is a feature I hadn't used before.

In general, it feels like a full-fledged framework with many built-in features for testing modern JavaScript. It is very easy to learn and use. Like, I had briefly used mocha before and the transition to learning Jest and being effective with it is 0 :)

## Unit testing

- organize the code in a [testable way](https://claudiajs.com/tutorials/designing-testable-lambdas.html)
- the library code serving as helpers
- lambda function assertions

## Testing AWS services

- `aws-sdk-mock`

Might not be the perfect way, however.

## Snapshot testing

## Further resources

https://read.acloud.guru/testing-and-the-serverless-approach-495cef7495ea
http://theburningmonk.com/2017/02/yubls-road-to-serverless-architecture-part-2/
