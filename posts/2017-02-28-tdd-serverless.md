---
title: Test-Driven Serverless Application Development
description: Quick Start to Test-Driven Development with Serverless Framework.
date: 2017-02-28
thumbnail: https://cloud.githubusercontent.com/assets/4726921/23232988/fdabd3fa-f955-11e6-84bd-c8a939841360.png
layout: Post
authors:
 - EetuTuomala
---

# Quick Start to Test-Driven Development with Serverless Framework

If you don’t possess the [magic](http://www.commitstrip.com/en/2017/02/08/where-are-the-tests/) that keeps your code working, the following instructions will help you start test-driven Serverless application development.

What I like most about the Serverless Framework as a development tool is that it gathers together all of the cloud resources for a structured project. With the whole stack in the same project, it's convenient and easy to start writing tests. 

Usually for a new project I use the [SC5 Serverless boilerplate](https://github.com/sc5/sc5-serverless-boilerplate). It's a good setup to begin with. But in this tutorial, I start with an existing example [aws-node-simple-http-endpoint](https://github.com/serverless/examples/tree/master/aws-node-simple-http-endpoint) project, to show how easy it is to add Serverless testing plugin even to an existing project. 

Let’s start by installing the service, changing the directory to the one that `sls install` command creates, and installing dependencies that service requires to run.

```bash
sls install -u https://github.com/serverless/examples/tree/master/aws-node-simple-http-endpoint -n my-tdd-service
cd my-tdd-service
npm install
```

Then install the [Mocha plugin](https://github.com/sc5/serverless-mocha-plugin) with `npm install --save-dev serverless-mocha-plugin`. If you're more familiar with writing tests with Jest, you can use [Jest plugin](https://github.com/sc5/serverless-jest-plugin).

The next step is to add the installed plugin to serverless.yml. This project doesn't have any plugins yet installed so the `plugins` key is also added.

```yml
plugins:
  - serverless-mocha-plugin
```

Now, run `sls` and the output should include following new commands that the Mocha plugin adds to the Serverless Framework.

```
create test ................... Create mocha tests for service / function
create function ............... Create a function into the service
invoke test ................... Invoke test(s)
```

To create a test to an existing function, use the `create test` command with parameter `-f` or `--function`. In this example project, there is already a function called `currentTime`. To create a test stub for that, run `sls create test -f currentTime` and it should print out `Serverless: serverless-mocha-plugin: created test/currentTime.js` as a result.

Next, invoke the test by running `sls invoke test` and the output should be something like this:

```bash
  currentTime
    ✓ implement tests here


  1 passing (8ms)
```

Now for the fun part – implementing the actual tests. The tests that the Serverless Mocha plugin creates are in the `test` directory, which is the default directory for Mocha tests. If you prefer to use a different directory you can create tests using `-p` or `--path` parameter when creating and invoking tests. Open the `tests/currentTime.js` to your code editor.

There is a generated test that only tests that the response is not empty.

```js
it('implement tests here', () => {
  return wrapped.run({}).then((response) => {
    console.log(response);
    expect(response).to.not.be.empty;
  });
});
```

Replace that with the following one, which tests that statusCode is 200 and that the response body contains a message that has the time. In real life, you may want to fake the date with [Sinon.JS](http://sinonjs.org/) or similar so that you can test the response with predefined dates.

```js
it('should return current time', () => {
  return wrapped.run({}).then((response) => {
    const body = JSON.parse(response.body);
    expect(response.statusCode).to.be.equal(200);
    expect(body.message).to.match(/.*\s\d{2}:\d{2}:\d{2}\sGMT(\+|-){1}\d{4}\s\(.*\)\./);
  });
});
```

After invoking the tests again with `sls invoke test` command, the output should be:

```Bash
  currentTime
    ✓ should return current time


  1 passing (8ms)
```

The first test is now ready. Let's create some more! Now we have a function that returns time, so we need to know the date also. With `sls create function` command you are able to create a function and test case for it.

```Bash
sls create function -f currentDate --handler date/handler.endpoint
```

Then open `test/currentDate.js` to your editor and replace the default `implement tests here` test block with snippet:

```JavaScript
it('should return current date', () => {
  return wrapped.run({}).then((response) => {
    const body = JSON.parse(response.body);
    expect(response.statusCode).to.be.equal(200);
    expect(body.message).to.match(/.*\s(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-3]\d{1}\s\d{4}\./);
  });
});
```

When invoking tests with `sls invoke test` command, you should get the following error:

```bash
AssertionError: expected 'Go Serverless v1.0! Your function executed successfully!'
to match 
/.*\s(Sun|Mon|Tue|Wed|Thu|Fri|Sat)\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s[0-3]\d{1}\s\d{4}\./
```

Next fix the function to match the test, open `date/handler.js` and replace the code with one that returns the date.

```js
'use strict';

module.exports.endpoint = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Hello, the current date is ${new Date().toDateString()}.`,
    }),
  };

  callback(null, response);
};
```

Once again, run the `sls invoke test` command and the result should be successful.

In addition to test keeping your code functional, the benefit of using test instead of e.g. `sls invoke local` is that you can test the same handler function easily with different payloads.

If you'd like a working example, here's the [repository](https://github.com/laardee/my-tdd-service) I used while making this tutorial.
