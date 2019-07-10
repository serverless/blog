---
title: "Basic Integration Testing with Serverless Framework"
description: "With the latest Serverless Framework release, we made it easier to test APIs built with the Serverless Framework."
date: 2019-07-10
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sfe-test-framework/thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sfe-test-framework/header.png'
category:
  - news
authors: 
  - MaciejSkierkowski
---

With the latest Serverless Framework release, we made it easier to test APIs built with the Serverless Framework.

Testing is important! We do it all the time when getting started developing a new service with the Serverless Framework. We might not have unit tests or a CI/CD in place yet, but at a minimum we will run `serverless invoke` or `curl` a few times with various inputs to make sure our APIs don’t return 500s. After hitting `[up]` & `[enter]` in the terminal once too many times we begin to wonder if there is a better way.

Yes, you should probably write some unit tests. When you are ready for that, here is an in depth guide on [writing unit tests for Node.js Serverless projects with Jest](https://serverless.com/blog/unit-testing-nodejs-serverless-jest/). Once you have the coverage and maturity you need, you’ll also need some integration tests. However, integration tests can be complicated and time consuming to implement. So if you need some basic integration tests in the meantime but you are not ready to commit to writing integration tests, then let me introduce you to a new testing tool in Serverless Framework to add to your testing arsenal.

Serverless Framework provides a new way to define basic integration tests for functions with HTTP endpoints. It’s goal is to enable you to test your serverless applications without having to manually write a lot of code to do so.  Tests are defined in a new file, `serverless.test.yml` and they are tested using the `serverless test` command.  The [testing documentation](https://github.com/serverless/enterprise/blob/master/docs/testing.md) goes into detail about writing tests but here is a quick preview.

As an example let's look at this `handler.js` and `serverless.yml` file.

**handler.js**
```bash
module.exports.hello = async (event, context) => {
  let body = {};
  if (event.body) {
    body = JSON.parse(event.body)
  }

  const name = body.name || 'world'

  return {
    statusCode: 200,
    body: `Hello, ${name}`,
  };
};
```

This function will return `hello, <name>` if a name was provided in the JSON request body, and `hello, world` if the name wasn’t set.

Here is the `serverless.yml` for this function with an HTTP POST endpoint.

**serverless.yml**
```yaml
tenant: skierkowski
app: greeter
service: hello

frameworkVersion: ">=1.46.1"

provider:
  name: aws
  runtime: nodejs8.10

functions:
  hello:
    handler: handler.hello
    
    events:
      - http:
          path: hello
          method: post
```

Go ahead and deploy the service using `sls deploy`. Now let's write some basic integration tests in a new `serverless.test.yml` file. 

**serverless.test.yml**
```yaml
- name: says hello to the world by default
  endpoint: {function: hello}
  response:
    body: "Hello, world"
- name: says hello to alice
  endpoint: {function: hello}
  request:
    body:
      name: alice
  response:
    body: "Hello, alice"
```

Once the service is deployed run `sls test` and you can expect output like this:

```
Serverless Enterprise: Test Results:

   Summary --------------------------------------------------

   passed - POST hello - says hello to the world by default
   passed - POST hello - says hello to alice

Serverless Enterprise: Test Summary: 2 passed, 0 failed
```

As you can see, this light-weight test framework enables us to write some basic integration tests and run them on the live service. The [docs](https://github.com/serverless/enterprise/blob/master/docs/testing.md#serverlesstestyml-specification) show you how to send HTTP headers, JSON bodies, string bodies, and submit forms. You can also test the responses for HTTP response codes, string bodies, or JSON content.
