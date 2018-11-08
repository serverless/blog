---
title: Unit testing for Node.js Serverless projects with Jest
description: Create unit tests for Node.js using the Serverless Framework, run tests on CI, and check off our list of serverless testing best practices.
date: 2018-07-17
thumbnail: 'https://s3-eu-west-1.amazonaws.com/wizardondemand/serverless/serverless-1-with-technology-names.png'
category:
  - guides-and-tutorials
  - operations-and-observability
heroImage: 'https://s3-eu-west-1.amazonaws.com/wizardondemand/serverless/serverless-1-with-technology-names.png'
authors:
  - EslamHefnawy
---

Have you recently found yourself wondering how to write unit tests for your Serverless project? Well, good news. I'm here to talk about just that.

As the size and complexity of your Serverless project grows, automated testing becomes the key to creating clean abstractions, getting fast feedback, and maintaining the sanity of your team.

In this post, we will cover the basics of creating unit tests for Node.js projects using the [Serverless Framework](https://serverless.com/framework/). We will also show you how to run those tests on CI and provide some tips on writing good unit tests for your Serverless project.

**Note:** The example project is available on GitHub [here](https://github.com/chief-wizard/serverless-jest-example). We'll also cover some resources to check out for next steps at the [bottom of the post](#resources).

Ready? Let's go.

## Choosing your test framework

I'm a huge Jest fan when it comes to testing frameworks. Why?

1) there's zero configuration needed to get started
2) it includes a good test runner
3) has built-in functionality for mocks, stubs, and spies
4) and has built-in code coverage reporting

To add Jest to your project, run `yarn add --dev jest`, and you should be good to go.

## Setting up the project

We decided to start with a fresh copy of the [`aws-node-simple-http-endpoint`](https://github.com/serverless/examples/tree/master/aws-node-simple-http-endpoint) example in this section:

```
sls install -u https://github.com/serverless/examples/tree/master/aws-node-simple-http-endpoint
```

The default endpoint in that example is quite simple, which is great for our case:

```
# handler.js
'use strict';

module.exports.endpoint = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, the current time is ${new Date().toTimeString()}.`,
    }),
  };

  callback(null, response);
};
```

We decided that we want it to say hello to the requester in a different language every time, so we added two functions that would generate a localized greeting:

```
# handler.js
function getLocalGreeting(language) {
  switch(language) {
    case "en":
      return "Hello!";
    case "es":
      return "¡Hola!";
    case "ru":
      return "Привет!";
    default:
      return "👋";
  }
}

function pickLocale() {
  const languages = ["en", "es", "cn", "fr", "ru"];
  # We miss Python's random.choice
  return languages [Math.floor(Math.random() * languages.length)];
}
```

We then changed the main handler slightly to make use of these two functions:

```
# handler.js
module.exports.endpoint = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: getLocalGreeting(pickLocale()),
    }),
  };

  callback(null, response);
};
```

And then tested the function locally:

```
$ sls invoke local -f localGreeting
{
    "statusCode": 200,
    "body": "{\"message\":\"Привет!\"}"
}
```

## Creating tests

To make sure that our local greeting generation is working as expected, we decided to create a Jest unit test for the `getLocalGreeting` function.

For your tests to be picked up by Jest automatically, they either need to be placed in the `__tests__` directory of your project, or include the word `test` or `spec` in the filename. This [can be configured easily](http://jestjs.io/docs/en/configuration#testregex-string) in Jest options if you prefer a different layout.

Let's go ahead and creat the `__tests__` directory and add a `handler.test.js` file in it. The overall structure looks like this:

```
.
├── README.md
├── __tests__
│   └── handler.test.js
├── handler.js
├── node_modules
├── package-lock.json
├── package.json
├── serverless.yml
└── yarn.lock
```

To be able to reference functions from `handler.js` in the test file, we need to export the function we're about to test:

```
# handler.js
function getLocalGreeting(language) {
...
}
module.exports.getLocalGreeting = getLocalGreeting;
```

In the handler test file, we load the `handler.js` file and add two assertions for the local greeting function. One of those assertions is explicitly incorrect, so that we check if errors actually display correctly:

```
# __tests__/handler.test.js
const handler = require('../handler');

test('correct greeting is generated', () => {
  expect(handler.getLocalGreeting("en")).toBe("Hello!");
  expect(handler.getLocalGreeting("fr")).toBe("🌊");
});
```

## Running tests

We can run tests for the first time by running `yarn run jest` in the root directory of the project with no parameters supplied. We should get the expected failure back:

```
$ yarn run jest
FAIL  __tests__/handler.test.js
  ✕ correct greeting is generated (13ms)

  ● correct greeting is generated

    expect(received).toBe(expected) // Object.is equality

    Expected: "🌊"
    Received: "👋"

      3 | test('correct greeting is generated', () => {
      4 |   expect(handler.getLocalGreeting("en")).toBe("Hello!");
    > 5 |   expect(handler.getLocalGreeting("fr")).toBe("🌊");
        |                                          ^
      6 | });
      7 |

      at Object.<anonymous>.test (__tests__/handler.test.js:5:42)

Test Suites: 1 failed, 1 total
Tests:       1 failed, 1 total
Snapshots:   0 total
Time:        1.488s
Ran all test suites.
```

After replacing `🌊` with `👋` in the test’s assertion, all the tests pass:

```
$ yarn run jest
 PASS  __tests__/handler.test.js
  ✓ correct greeting is generated (4ms)

Test Suites: 1 passed, 1 total
Tests:       1 passed, 1 total
Snapshots:   0 total
Time:        1.168s
Ran all test suites.
```

Nice!

## Running unit tests on CI

Getting the tests running on CI is straightforward—just invoke `jest` the same way you would in development. On CI services, you also generally need to add extra configuration for things like installing and caching of dependencies, and execution controls.

We tested our function on [CircleCI](https://circleci.com/) with the following config:

```
# .circleci/config.yml
version: 2
jobs:
  test:
    working_directory: ~/nodejs-serverless-jest
    docker:
      - image: circleci/node:10
    steps:
      - checkout
      - restore_cache:
          key: yarn-v1-{{ checksum "yarn.lock" }}-{{ arch }}
      - restore_cache:
          key: node-v1-{{ checksum "package.json" }}-{{ arch }}
      - run: yarn install
      - save_cache:
          key: yarn-v1-{{ checksum "yarn.lock" }}-{{ arch }}
          paths:
            - ~/.cache/yarn
      - save_cache:
          key: node-v1-{{ checksum "package.json" }}-{{ arch }}
          paths:
            - node_modules
      - run:
          name: Jest
          command: |
            mkdir -p test-results/jest
            yarn run jest
          environment:
            JEST_JUNIT_OUTPUT: test-results/jest/junit.xml
      - store_test_results:
          path: test-results

workflows:
  version: 2
  unit-tests:
    jobs:
      - test
```

## Test folder layout

As more test cases get added to the project, it is important to keep a consistent file and folder structure within our `__tests__` folder. I advocate keeping the structure in the test directory as close as possible to the application file layout.

If we were to extract the `getLocalGreeting` function into its own `greeting.js` file, we would also extract the tests for it into `__tests__/greeting.test.js`. Had we decided to add folders in our project specific to models, views, or controllers, we would also make sure to place the tests accordingly:

```
.
├── README.md
├── __tests__
│   └── controllers
│   |   └── localization.test.js
│   └── models
│   |   └── greeting.test.js
│   └── views
├── controllers
│   └── localization.js
├── handler.js
├── models
│   └── greeting.js
├── node_modules
├── package-lock.json
├── package.json
├── serverless.yml
├── views
└── yarn.lock
```

## Unit test recommendations for Serverless projects

To make sure that the unit tests for your Serverless project are adding value to your development process and not being an annoyance for your team, I recommend following the unit testing best practices.

### Keep the unit tests fast and constrained

The best unit tests are the ones that cover a specific component of the system. This ensures that each individual test runs fast enough to be executed on developer machines during the development process and on CI.

### Use mocking where necessary

Mocking is a powerful tool (which Jest [provides](http://jestjs.io/docs/en/mock-functions) good functionality for). For parts of your Serverless project that interact with external databases like DynamoDB or third-party systems like Stripe, I recommend mocking out the external requests to ensure that your test suite does not depend on the third-party services being available and to reduce the latency of the test runs.

Keep in mind that mocking out an external API might hide the changes in that external API. Make sure to regularly validate the mocks against the recent third-party APIs if you decide to mock out important parts of the project in tests.

### Unit tests are not a full test suite by themselves

Unit tests are best used as guidelines for adequate component design and to validate the correctness of individual components. In your Serverless project, however, you will likely need to check whether different components of your project work correctly together via integration tests. I'd recommend using Jest for integration testing as well.

## Conclusion

Unit tests are only one part of a successful testing strategy. In addition to unit tests, writing integration tests, end-to-end tests, and performing manual validation will help you ensure the quality of your Serverless applications.

In this post, we talked about why pick Jest as the unit testing framework for your Serverless projects, how to write tests, how to structure the test files and how to execute tests on CI. I hope this will help you get started with testing your Serverless projects!

I'd also highly encourage you to check out the resources below, in order to learn more about Jest and other JavaScript testing frameworks. And while you're at it, share your own testing tips [with the community](https://forum.serverless.com/)!

Please drop a comment with any feedback—I'd love to hear from you!

## Resources

- [Serverless HTTP endpoint example with the Jest test](https://github.com/chief-wizard/serverless-jest-example)
- [Jest documentation](http://jestjs.io/docs/en/getting-started)
- [CircleCI documentation reference](https://circleci.com/docs/2.0/configuration-reference/)
