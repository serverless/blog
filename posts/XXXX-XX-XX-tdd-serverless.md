---
layout:  Post
title:  Test-Driven Serverless Application Development
description:  Quick Start to Test-Driven Development with Serverless Framework.
date:  XXXX-XX-XX
thumbnail: https://.jpg
authors:
 - EetuTuomala
---

# Quick Start to Test-Driven Development with Serverless Framework

If you don’t have the [magic](http://www.commitstrip.com/en/2017/02/08/where-are-the-tests/) which keeps your code working, the following instructions will help you start test-driven Serverless applications development.

What I like in Serverless Framework the most, is that it is a development tool which gathers together all the cloud resources which are used in a structured project. With the whole stack in the same project, it is also easy to start writing tests. 

Usually, for a new project I use [SC5 Serverless boilerplate](https://github.com/sc5/sc5-serverless-boilerplate), which is a good setup, to begin with. But in this tutorial, I start with an existing example [aws-node-simple-http-endpoint](https://github.com/serverless/examples/tree/master/aws-node-simple-http-endpoint) project, just to demonstrate how easy it is to add Serverless testing plugin even to an existing project. 

Let’s start by installing the service, changing the directory to the one that `sls install` command creates and installing dependencies what service requires to run.

```Bash
sls install -u https://github.com/serverless/examples/tree/master/aws-node-simple-http-endpoint -n my-tdd-service
cd my-tdd-service
npm install
```

Then install the [Mocha plugin](https://github.com/sc5/serverless-mocha-plugin) with `npm install --save-dev serverless-mocha-plugin`. If you are more familiar writing tests with Jest, you can use [Jest plugin](https://github.com/sc5/serverless-jest-plugin).

Next step is to add the installed plugin to serverless.yml. This project doesn't have any plugins yet installed so the plugin block is also added.

```Yaml
plugins:
  - serverless-mocha-plugin
```

Now, run `sls` and the output should include following new commands that are included in the Mocha plugin.

```
create test ................... Create mocha tests for service / function
create function ............... Create a function into the service
invoke test ................... Invoke test(s)
```

To create a test to existing function, use `create test` command with parameter `-f` or `--function`. In this example project, there is already a function called `currentTime`. To create test stub for that, run `sls create test -f currentTime` and it should print out `Serverless: serverless-mocha-plugin: created test/currentTime.js`.

Next, invoke the test by running `sls invoke test` and to output should be something like this:

```Bash
  currentTime
    ✓ implement tests here


  1 passing (8ms)
```

Now to the fun part – implementing the actual tests. The tests that Serverless Mocha plugin creates are located in `test` directory, which is default directory for mocha tests. If you prefer to use different directory you can create tests using `-p` or `--path` parameter when creating and invoking tests. Open the `tests/currentTime.js` to your code editor.

There is a generated test which just tests that response is not empty.

```JavaScript
it('implement tests here', () => {
  return wrapped.run({}).then((response) => {
    console.log(response);
    expect(response).to.not.be.empty;
  });
});
```

Replace that with following one, which tests that statusCode is 200 and response body contains a message that has the time. In the real world scenario, you may like to fake the date with [Sinon.JS](http://sinonjs.org/) or similar.

```JavaScript
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

The first test is now ready, let's create some more! Now we have a function that returns time, so we need to know the date also. With `sls create function` command you are able to create a function and test for it.

```Bash
sls create function -f currentDate --handler date/handler.endpoint
```

Then open `test/currentDate.js` to your editor and replace the default `implement tests here` test block with the following snippet.

```JavaScript
it('should return current date', () => {
  return wrapped.run({}).then((response) => {
    const body = JSON.parse(response.body);
    expect(response.statusCode).to.be.equal(200);
    expect(body.message).to.match(/.*\s(Sun|Mon|Tue|Web|Thu|Fri|Sat)\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Nov|Dec)\s[0-3]\d{1}\s\d{4}\./);
  });
});
```

When invoking tests with `sls invoke test` command, you should get following error:

```
AssertionError: expected 'Go Serverless v1.0! Your function executed successfully!' to match /.*\s(Sun|Mon|Tue|Web|Thu|Fri|Sat)\s(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Nov|Dec)\s[0-3]\d{1}\s\d{4}\./
```

Next fix the function to match test, open `date/handler.js` and replace the code with one that returns date.

```JavaScript
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

One more time, run the `sls invoke test` command and result should be successful.

Beside that the tests keep your code functional, the benefit of using test instead of e.g. `sls invoke local` is that you can test the same handler function easily with different payloads.

If you need a working example here is the repository I used while making this tutorial [my-tdd-service](https://github.com/laardee/my-tdd-service).
