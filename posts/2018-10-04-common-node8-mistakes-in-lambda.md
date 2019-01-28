---
title: "Common Node8 mistakes in Lambda"
description: "Here are some common mistakes people make when authoring Lambda functions with Node.js 8.10."
date: 2018-10-04
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/node8-lambda/node8-lambda-serverless.jpg"
category:
  - guides-and-tutorials
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/node8-lambda/node8-lambda-serverless.jpg"
authors:
  - YanCui
---

It’s been 6 months since AWS Lambda added support Node.js 8.10. I’m super happy that I can finally use `async/await` to [simplify my Lambda functions](https://serverless.com/blog/aws-lambda-node-8-support-what-changes-serverless-developers/). 

In the meantime, I have helped a few clients with their Node8 serverless projects. In doing so I have seen some recurring mistakes around `async/await`.

#### Still using callbacks

Many people are still using the callbacks in their `async` handler functions:

```javascript
module.exports.handler = async (event, context, cb) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' })
  }

  cb(null, response)
}
```

instead of the simpler alternative:

```javascript
module.exports.handler = async (event, context) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({ message: 'hello world' })
  }

  return response
}
```

#### Not using promisify

Before Node8, [bluebird](http://bluebirdjs.com/docs/getting-started.html) filled a massive gap. It provided the utility to convert callback-based functions to promise-based. But Node8's built-in `util` module has filled that gap with the `promisify` function.

For example, we can now transform the `readFile` function from the `fs` module like this:

```javascript
const fs = require('fs')
const { promisify } = require('util')
const readFile = promisify(fs.readFile)
```

No need to use bluebird anymore. That's one less dependency, which helps reduce the cold start time for our functions.

#### Too sequential

`async/await` lets you write asynchronous code as if they're synchronous, which is awesome. No more dealing with callback hell!

On the flip side, we can also miss a trick and not perform tasks concurrently where appropriate.

Take the following code as example:

```javascript
async function getFixturesAndTeam(teamId) {
  const fixtures = await fixtureModel.fetchAll()
  const team = await teamModel.fetch(teamId)
  return {
    team,
    fixtures: fixtures.filter(x => x.teamId === teamId)
  }
}
```

This function is easy to follow, but it's hardly optimal. `teamModel.fetch` doesn't depend on the result of `fixtureModel.fetchAll`, so they should run concurrently. 

Here is how you can improve it:

```javascript
async function getFixturesAndTeam(teamId) {
  const fixturesPromise = fixtureModel.fetchAll()
  const teamPromise = teamModel.fetch(teamId)

  const fixtures = await fixturesPromise
  const team = await teamPromise

  return {
    team,
    fixtures: fixtures.filter(x => x.teamId === teamId)
  }
}
```

In this version, both `fixtureModel.fetchAll` and `teamModel.fetch` are started concurrently.

You also need to watch out when using `map` with `async/await`. The following will call `teamModel.fetch` one after another:

```javascript
async function getTeams(teamIds) {
  const teams = _.map(teamIds, id => await teamModel.fetch(id))
  return teams
}
```

Instead, you should write it as the following:

```javascript
async function getTeams(teamIds) {
  const promises = _.map(teamIds, id => teamModel.fetch(id))
  const teams = await Promise.all(promises)
  return teams
}
```

In this version we map `teamIds` to an array of `Promise`. We can then use [`Promise.all`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all) to turn this array into a single `Promise` that returns an array of teams. 

In this case, `teamModel.fetch` is called concurrently and can significantly improve execution time.

#### async/await inside forEach()

This is a tricky one, and can sometimes catch out even experienced Node.js developers.

The problem is that code like this doesn't behave the way you'd expect it to:

```javascript
[ 1, 2, 3 ].forEach(async (x) => {
  await sleep(x)
  console.log(x)
})

console.log('all done.')
```

When you run this you'll get the following output:

```
all done.
```

See [this post](https://codeburst.io/javascript-async-await-with-foreach-b6ba62bbf404) for a longer explanation about why this doesn't work. For now, just remember to **avoid using `async/await` inside a `forEach`**!

#### Not using AWSSDK’s .promise()

Did you know that the AWS SDK clients support both callbacks and promises? To use `async/await` with the AWS SDK, add `.promise()` to client methods like this:

```javascript
const AWS = require('aws-sdk')
const Lambda = new AWS.Lambda()

async function invokeLambda(functionName) {
  const req = {
    FunctionName: functionName,
    Payload: JSON.stringify({ message: 'hello world' })
  }
  await Lambda.invoke(req).promise()
}
```

No more callback functions, yay!

#### Wrap-up

That's it, 5 common mistakes to avoid when working with Node.js 8.10 in Lambda. For more tips on building production-ready serverless applications and operational best practices, check out my [video course](https://bit.ly/production-ready-serverless). ;-)

##### Further reading:

* [AWS Lambda Node8 support: what it changes for serverless developers](https://serverless.com/blog/aws-lambda-node-8-support-what-changes-serverless-developers/)
