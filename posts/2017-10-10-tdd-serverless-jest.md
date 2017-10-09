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

Here's a high-level overview of the file structure for the tutorial:

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

The full code for the tutorial can be seen in [this repository](https://github.com/kalinchernev/aws-node-signed-uploads).

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

- `serverless-webpack` with its webpack settings can further optimize functions when they are [bundled individually](https://github.com/serverless-heaven/serverless-webpack#optimization--individual-packaging-per-function). Also, a configuration for external resources make the bundled upload lighter, excluding dependencies to [`aws-sdk` already available](http://docs.aws.amazon.com/lambda/latest/dg/current-supported-versions.html) on AWS premises.

### Configurations

In the example project linked to this article you can have a look at the configurations necessary to have modern JavaScript running with serverless and Jest.

## Jest

To learn about the test framework, read the official [documentation site](https://facebook.github.io/jest/).

If I have to give my high-level impressions in few words:
- Working with promises is natural.
- There's the watch mode.
- There's also an integrated code coverage reporting.
- Snapshot testing for comparing and asserting differences in structures.

In general, Jest is a full-fledged framework with all necessary features for testing built-in. It's easy to learn and has good documentation.

## Unit testing

Organizing code in [testable chunks](https://claudiajs.com/tutorials/designing-testable-lambdas.html) is the the most challenging and important step before anything else.

In the context of lambda functions and the serverless framework, unit testing is useful for covering mainly 2 types of code: library (helper) functions and the lambda functions in a given service. If you're using the serverless framework only with `serverless.yml` file in order to make your Cloud Formation templates more manageable, you don't need unit testing. It's only uesful when there is logic in the service.

## Testing a library used by a lambda function

Let's imagine that our lambda function signature and beginning is the following:

```javascript
export const handler = (event, context, callback) => {
  const bucket = process.env.BUCKET;
  const region = process.env.REGION;

  ...

}

```

Because we will most probably need to make checks about the input arguments of environment variables several times, we can make a [simple helper](https://github.com/kalinchernev/aws-node-signed-uploads/blob/master/src/lib/envVarsChecker.js) which takes an object of the `process.env` and returns a list of required keys for the function to work.

This scenario is easy, we can assert for various of useful edge cases like:

```javascript

import checker from '../../src/lib/envVarsChecker';

describe(`Utility library envVarsChecker`, () => {
  test(`The helper exists`, () => {
    expect(checker).toBeTruthy();
  });

  test(`Asks for both BUCKET and REGION environment variables`, () => {
    const input = {};
    const result = checker(input);
    expect(result).toEqual(['BUCKET', 'REGION']);
  });

  test(`Asks for a missing BUCKET environment variables`, () => {
    const input = {
      REGION: 'foo',
    };
    const result = checker(input);
    expect(result).toEqual(['BUCKET']);
  });

  test(`Asks for a missing REGION environment variables`, () => {
    const input = {
      BUCKET: 'foo',
    };
    const result = checker(input);
    expect(result).toEqual(['REGION']);
  });
});

```

When functions are simple, but yet reusable for several lambda functions, we can test these helpers in a conventional way.

## Testing a lambda function

The lambda functions can be considered as a more complex piece of code to test.

Initially, I started by spawning processes and running the serverless CLI and asserting for results. This didn't work efficiently because every unresolved promise in the serverless framework abstraction is impossible to handle in a convenient way in the test suite.

Since the original process of the lambda function was not easy to get done with, I also tried the `serverless-jest-plugin` which was mentioned in the beginners article about TDD in serverless. As I already knew it's ineffective to test against cli processes, I used the plugin programmatically to wrap the original lambda functions invocation. This also didn't work well enough.

In the end of a long day I finally decided to treat lambda functions as normal functions and just wrap them in promises in order to make them more convenient for the Jest runner.

Like this:

```javascript

import { promisify } from "util";
import lambda from "../src/upload";
const handler = promisify(lambda);

describe(`Service aws-node-singned-uploads`, () => {
  test(`Require environment variables`, () => {
    const event = {};
    const context = {};

    const result = handler(event, context);
    result
      .then(data => {
        expect(data).toBeFalsy();
      })
      .catch(e => {
        expect(e).toBe(
          `Missing required environment variables: BUCKET, REGION`
        );
      });
  });
});

```

This approach works well and keeps things relatively simple. It handles the lambda handler as a normal exported function which takes the arguments as described in the official signature of the function, and wraps it all in a promise, for Jest.

The [syntax of promise assertions](https://facebook.github.io/jest/docs/en/asynchronous.html#resolves-rejects) can be prettier, by the way.

## Mocking AWS services

Testing lambda functions with the assumption that they are just functions can take you long way if the logic inside these functions is relatively simple. However, the real reason for lambda functions to be, is that they are the glue between AWS services.

So, sooner or later you will have to find a way to mock AWS services in your tests :)

For us, the `aws-sdk-mock` package works well so far. It supports mocking constructors and nested methods, it can restore originals. [Documentation](https://www.npmjs.com/package/aws-sdk-mock) and support seem mature.

Together with mocking AWS services, we also take [examples for events from the official AWS documentation](http://docs.aws.amazon.com/lambda/latest/dg/eventsources.html). These can serve as a fast-track to creating stubs for the `event` argument of a lambda function.

```javascript

import AWS from "aws-sdk-mock";
import { promisify } from "util";
import lambda from "../src/upload";
import eventStub from "./stubs/eventHttpApiGateway.json";

const handler = promisify(lambda);

describe(`Service aws-node-singned-uploads: S3 mock for successful operations`, () => {
  beforeAll(() => {
    AWS.mock("S3", "getSignedUrl", (method, _, callback) => {
      callback(null, {
        data: "https://example.com"
      });
    });
  });

  afterEach(() => {
    delete process.env.BUCKET;
    delete process.env.REGION;
  });

  afterAll(() => {
    AWS.restore("S3");
  });

  test(`Replies back with a JSON for a signed upload on success`, () => {
    process.env.BUCKET = "foo";
    process.env.REGION = "bar";

    const event = eventStub;
    const context = {};

    const result = handler(event, context);
    expect(result).resolves.toMatchSnapshot();
  });
});

```

As you can see, the `beforeAll` life cycle setups the AWS S3 mock for the `getSignedUrl` method. `afterEach` environment variables are reset and `afterAll` the original S3 service is restored so that it operates to the AWS API after the test suite has finished.

## Snapshot testing

Maybe you've noticed this line already `expect(result).resolves.toMatchSnapshot();`.
This is how you use the Jest snapshot feature:

<iframe width="853" height="480" src="https://www.youtube.com/embed/HAuXJVI_bUs?rel=0" frameborder="0" allowfullscreen></iframe>

This feature helps you test structures in a simple way.

### Further resources

This tutorial covers mostly techniques with Jest on making unit tests. As you can see, to an extend we can say that testing lambda functions can be seen as a relatively [simple](https://read.acloud.guru/testing-and-the-serverless-approach-495cef7495ea) process.

However, mocking AWS services can get tricky and there are vocal opinions [against](http://theburningmonk.com/2017/02/yubls-road-to-serverless-architecture-part-2/) this practice for a reason.

More specifically, take the [aws-node-signed-uploads](https://github.com/kalinchernev/aws-node-signed-uploads) package as an example. The unit tests and the mocks are showing 100% test coverage for the code which gets executed by Jest and this is really encouraging.

Do the following for me as an exercise after this tutorial:

- Clone the repository
- Install the dependencies
- Reconfigure the serverless settings
- Make a deployment to your AWS account
- Run `yarn start`

You will see a server running and waiting for your requests. You can make an example request with [Postman](https://www.getpostman.com/) which will show you the same issues as tested in the unit tests :)
And if you manage to get your header key correctly, you'll be even able to upload a large file to an S3 bucket.

Now make the same test on the deployed service. You will get an error message for access denied because there is a specific configuration on the upload endpoint:

```yml
functions:
  upsert-objects:
    handler: src/upload.handler
    name: ${self:provider.stage}-${self:service}-upload
    memorySize: 128
    events:
      - http:
          path: upload
          method: put
          private: true
          cors: true
```

Which is `private: true`. When deployed on real AWS premises, the endpoint will require an API key in the header, which neither `serverless` nor `serverless-offline`, nor tests will warn you about.

Mocking AWS services however, will give you the basic safely net that your lambda functions are handling positive and negative scenarios and invoke the correct callbacks in the correct scenarios.

Also, using Jest for testing the independent logic and making snapshot make an excellent addition to secure the very vital behaviors of your cloud functions even when working independently from the AWS service.
