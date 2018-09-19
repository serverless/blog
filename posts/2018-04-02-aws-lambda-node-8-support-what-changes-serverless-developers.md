---
title: "AWS Lambda Node.js 8 support: what it changes for serverless developers"
description: "AWS Lambda just moved to support Node.js 8.10. This is what serverless developers need to know."
date: 2018-04-02
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/node8/nodejs8-full.jpg"
category:
  - news
  - guides-and-tutorials
heroImage: ''
authors:
  - DavidWells
---

Node 8 support for AWS Lambda is here!

If you're a serverless developer on Lambda, read on for what you need to know about Node 8. Namely: speed, Async/Await, object rest and spread, and NPX.

#### Speed

Node 8 is faster. (YES.)

Specifically: about 7% reduction in runtime and 23% reduction in render time (if you're doing server-side rendering in your Lambda function).

You can see the full performance benchmarks in [this great post by David Gilbertson](https://hackernoon.com/upgrading-from-node-6-to-node-8-a-real-world-performance-comparison-3dfe1fbc92a3).

(Though we must say, if you want maximum speed, [Go is still faster](https://serverless.com/blog/framework-example-golang-lambda-support/).)

#### Async/Await

With Node 6, if you wanted to execute asynchronous code, you were probably using promises. Honestly, we kind of like promises; they're just straightforward and readable.

*Except* when you hit a situation where you need to nest 15 rows of them together.

With Async/Await, those nested promises can be no more. Just use keyword `await` to await a function:

```js
async function wow(x) {
  const a = await meFirst();
  const b = await meSecond();
  const c = await meThird();
}
```

##### Simplify your build

If you are using webpack to build your functions to polyfill async/await, you can simply use the native functionality now and simplify your build.

Simplicity for the win!

It's native in Node 8:

```js
export const hello = async (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: `Go Serverless v1.0! ${(await message({ time: 1, copy: 'Your function executed successfully!'}))}`,
      input: event,
    }),
  };

  callback(null, response);
};
```

(Code snippet from the [`serverless-nodejs-starter` example](https://github.com/AnomalyInnovations/serverless-nodejs-starter).)

Big shoutout to the [serverless webpack plugin](https://github.com/serverless-heaven/serverless-webpack) for supporting this long before lambda runtime.

#### Object rest and spread

You can now spread in parameters into your function, and combine objects together more easily.

Spread can be used instead of `Object.assign` and/or lodash assign/extend. Both rest and spread help to create a more readable codebase.

**Object spread example:**

```js
const defaultOptions = {
  foo: true,
  bar: 10,
  zaz: 'hi'
};

const userLandOptions = {
  foo: false,
  bar: 200
};


const combinedOptionsObject = {
  ...defaultOptions,
  ...userLandOptions,
  yolo: true
};

console.log(combinedOptionsObject); // => { foo: false, bar: 200, zaz: 'hi', yolo: true }
```

👆 Remember yolo === `true`. Live it up!

For more on Object rest and spread, [checkout this post](https://dmitripavlutin.com/object-rest-spread-properties-javascript/)

#### NPX

If you're running node 8 locally, it comes shipped with NPM version 5.2, which includes NPX:

Npx allows you to run serverless without installing it globally:

`npx serverless deploy`

If this is your `package.json`:

```json
{
  "name": "my-serverless-app",
  "version": "0.1.0",
  "description": "blah blah",
  "main": "handler.js",
  "scripts": {
    "deploy": "npx serverless deploy"
  }
}
```

You can simply run `npm run deploy` to deploy the function to Lambda; no need to have anything installed globally on your machine.

[Check this video](https://www.youtube.com/watch?v=55WaAoZV_tQ) for a full rundown.

##### Further reading:

- [AWS Node 8.10 migration guide](https://forum.serverless.com/t/aws-node-8-10-runtime-for-lambdas-migration-guide/4141)
- [Deploy a REST API using Serverless, Express, and Node.js](https://serverless.com/blog/serverless-express-rest-api/)
