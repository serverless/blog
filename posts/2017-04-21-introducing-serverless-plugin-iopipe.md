---
title: Enhanced Analytics & Monitoring for your Serverless Apps with the IOpipe Serverless Plugin - Now in Beta
description: Activate analytics and alerts quickly by automatically wrapping your Serverless functions with IOpipe.
date: 2017-04-21
thumbnail: https://s3-us-west-2.amazonaws.com/iopipe-public/iopipe-serverless-logo.png
layout: Post
authors:
  - CoreyLight
---

At [IOpipe](https://iopipe.com), we enable users of AWS Lambda to monitor, analyze, and tune their serverless architectures. Getting started is a breeze with the [iopipe wrapper library](https://github.com/iopipe/iopipe).

[The Serverless Framework](https://serverless.com/) is an indispensable tool for Lambda, OpenWhisk, and Azure functions-as-service development and deployment. Once you get the hang of launching functions with it, the sky's the limit. But when you have 10 or 100 functions, you might want to abstract your build pipeline further to include your favorite tooling + processes. There are [plenty of powerful plugins already](https://github.com/serverless/plugins).

So to enable even _easier_ integration with IOpipe, [we made a plugin too](https://github.com/iopipe/serverless-plugin-iopipe).

## How Does it Work?

The task of code modification shouldn't be taken lightly - and luckily we don't have to reinvent the wheel here. We can use an [AST parser](https://en.wikipedia.org/wiki/Abstract_syntax_tree) and builder to do the hard work for us. With the rise of varied JS build tools, AST libraries are certainly _en vogue_ and we have plenty of options. For this project we use [jscodeshift](https://github.com/facebook/jscodeshift) that provides some nice sugar on top of [recast](https://github.com/benjamn/recast).

### What are we trying to accomplish?

Here's a super-simple function that outputs a message with a UUID.

```js
const uuid = require('uuid');

exports.handler = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Your uuid is: ' + uuid.v4(),
      input: event
    })
  };
  callback(null, response);
};
```

Now say we need some extra metrics for our little function - how often it runs, when it errors, [why it was slow](https://read.iopipe.com/detecting-cold-starts-with-iopipe-9fe96425e859). It's time for IOpipe.

Here's the new code:

```js
const uuid = require('uuid');
const iopipe = require('iopipe')({clientId: 'TOKEN'});

exports.handler = iopipe((event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Your uuid is: ' + uuid.v4(),
      input: event
    })
  };
  callback(null, response);
});
```

Nice and straightforward. The IOpipe library automatically records stats about the invocation and makes it ready for inspection in near real-time. How can we go from A => B automatically though?

### Putting Code In Your Code

Let's fire up jscodeshift and parse that 🌴. First, we need to find the AST "node" that we want to wrap.

```js
const shift = require('jscodeshift');
const code = 'The string literal of the code to transform (from above)';

const searchObject = {
  left: {
    type: 'MemberExpression',
    object: {
      type: 'Identifier',
      name: 'exports'
    },
    property: {
      type: 'Identifier',
      name: 'handler'
    }
  }
};

const found = shift(code).find(shift.AssignmentExpression, searchObject);
```

This simply looks for the statement

```js
exports.handler = //anything here
```

With our code represented as a tree, the original formatting won't make a lick of difference. As long as it runs the same, we will still find the statement we need.

```js
exports
  .handler = // 😎 this will work too
```

Within the Serverless plugin lifecycle, we know the functions defined in the `serverless.yml` and what the handlers are named. With this info, we can be fairly confident that the right side of the statement will be a function. This is the function we need to wrap.

We create a new AST node from raw text and insert the original function node into that.

```js
  const wrapper = "require('iopipe')({clientId: 'TOKEN'})(REPLACE)";
  shift(wrapper)
    .find(shift.Identifier, {
      name: 'REPLACE'
    })
    .replaceWith(found);
```

Not bad! You can see the [real thing here](https://github.com/iopipe/serverless-plugin-iopipe/blob/master/src/transform.js).

### Uploading the Result

Serverless provides some great _hooks_ to work with and the ones we are after here are
`before:deploy:createDeploymentArtifacts`

`after:deploy:createDeploymentArtifacts`

The plugin creates a temporary `.iopipe` folder, copies the source code, applies transformations, and tells Serverless to use the transformed code instead of the source code. After it's done deploying the `.iopipe` folder is deleted and we go on with our day. Thanks to [Jonathan Goldwasser](https://github.com/jogold) for inspiration from the [Serverless Webpack Plugin](https://github.com/jogold/serverless-webpack-plugin).

## What Else?

While we're at it, why not keep your IOpipe npm package up to date? Upgrading automatically provides the latest speed, developer experience, and feature enhancements.

While the process of auto-upgrading the package could be a separate post, the main idea is to fire off a [child process](https://nodejs.org/api/child_process.html) to run some npm commands. We ❤️ [yarn](https://yarnpkg.com) at IOpipe, so we also support that.

A simplified example:

```bash
  npm outdated && yarn add iopipe@latest
```

And [check out the real stuff](https://github.com/iopipe/serverless-plugin-iopipe/blob/master/src/index.js#L148).

## Final Thoughts

The [IOpipe Serverless Plugin](https://github.com/iopipe/serverless-plugin-iopipe) is now available in Beta for you to try out. Let us know what you think!
