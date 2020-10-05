---
title: How to Test Serverless Applications
description: "Tips from the Serverless team - how we test serverless applications."
date: 2017-11-02
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/testing-apps.jpg'
category:
  - guides-and-tutorials
  - operations-and-observability
heroImage: ''
authors:
  - EslamHefnawy
---

Serverless applications are quickly gaining in complexity—testing is key.

I’ve been building the Serverless Framework for 2 years now, and during that time it's been my focus to create as smooth a testing and debugging experience as possible. In this article, I’ll share some techniques that you can use with the [Serverless Framework](https://serverless.com/framework/) to test and debug your serverless application during development.

I'll focus on testing serverless functions, since this is where most of the development happens.

#### Unit testing

This one is a gimme. You should always start with unit tests, whether or not your codebase is serverless. Forget about Lambda, the handlers, the events—just organize your codebase in an easy-to-test structure that follows your language’s best practice.

Your handler should always be a thin layer that uses modules out of your code library. If those modules are well-covered with unit tests, then testing the serverless part of your application (i.e., the handlers) will be easy during the integration tests discussed below.

To demonstrate this, here's what your handler should look like:

```js
const utils = require('../utils');

const createUser = (event, context, callback) => {
  const user = utils.CreateUser(event.user)
  const avatarUrl = utils.updateAvatar(user)

  callback(null, {
    statusCode: 200,
    body: 'User Created!'
  })
}
```

As you can see, the handler itself doesn't contain any core logic; it just uses modules that should be unit tested independently.

Read here for our much more [in-depth guide to unit testing](https://serverless.com/blog/unit-testing-nodejs-serverless-jest/).

#### Integration testing

Now that you’ve covered your codebase, it’s time to move on to your handlers with overall integration tests. Let's see how all of those units you’ve been testing individually work together.

**Work with stages**<br>
Since you’ll be interacting with the actual infrastructure pieces in your application, you'll need to make sure you stage your application during development.

Set up a dev stage—the default when using the Serverless Framework—for all application infrastructure (databases, buckets, etc.) that your codebase will use during the integration tests.

**Set up event mocks**<br>
You'll also need to have some event mocks prepared for all your handlers, depending on the type of event the handler is expecting.

For example, if your serverless function is subscribing to an S3 event source, make sure you have a JSON file that mocks the S3 event that AWS sends out. You can get that by trying it out yourself only once on AWS, and store it somewhere for future reference.

A super simple handler would look something like this:

```js
const utils = require('../utils');

const resizeImage = (event, context, callback) => {
  console.log(event)
  callback(null, event)
}
```

Deploy that, and upload a file to the bucket that this function is subscribing to. This will invoke the function with the S3 event.

You can then take a peek at event shape by looking in the logs with `serverless logs -f resizeImage`. Copy the logged event object into a `mock.json` file.

During development, you don't need to go back and forth to S3 for debugging anymore, you can just invoke the function directly with that mock event using `serverless invoke -f resizeImage -p mock.json`. Your development cycle will be much faster this way.

> **Note:** It’s a known issue that each event source sends out a different event structure, and there’s no central place to see what events look like without trying them out yourself. We’re working behind the scenes on solving that problem. Stay tuned!

##### Local Lambda invocation

Let's test those thin handler layers and how they fit in within your codebase. You can do so by invoking your function locally, using the `serverless invoke local` command.

Provide it with the function you’d like to invoke, and an accurate event mock. (...Which you’ve totally set up already, right?!)

For example, let's test a function called `createThumbnail` that is subscribing to an S3 event source. We'll do this by putting the S3 mocked event in a `createThumbnail.json` file, and then we'll run:

`serverless invoke local -f createThumbnail -p createThumbnail.json`

While `invoke local` doesn’t emulate Lambda 100%, you’ll still be able to find issues in your codebase quickly without having to wait for a deployment.

##### Using the Event Gateway

We’ve recently announced a new project called the [Event Gateway](https://serverless.com/event-gateway/) that helps manage all events happening in your serverless application. You can use the Event Gateway to locally and rapidly test your functions.

We'll need two terminal sessions for this. First, spin up the Event Gateway in your current terminal session with `serverless run`. Then, open another session and emit events with the `serverless emit` command. This will invoke any function that is subscribing to that event, and you’ll be able to see the result of all function invocations in the `serverless run` session.

> **Note:** this only works for functions that are subscribed to one or more events. For other functions, you'll need to invoke the function directly, as shown above in the Local Lambda invocation section.

##### Remote Lambda invocation

After testing and debugging your serverless application locally, you probably feel confident enough to deploy your application—at least to the dev stage.

Keep in mind that the local environment is a bit different than the actual deployment environment: e.g., AWS Lambda limits don’t apply locally, so you'll need to be careful to make sure you won't hitting any of those limits on deployment.

Using multiple stages is a great way to have more confidence about your tests. You can have a QA environment that is an exact replica of your production environment, since they're running on the same infrastructure. This can ferret out hidden bugs you might miss when developing locally, such as issues with your function's IAM permissions or limitations around Lambda.

Just like local testing, you can pass a mocked event to the `serverless invoke` command to test your deployed functions. But even better, now that your functions are deployed, you have the additional option of triggering the real event.

In our `createThumbnail` example above, you can actually upload a photo to the S3 bucket in the dev stage and see how the `createThumbnail` Lambda reacts to that event.

##### Investigating Internal Server Errors

During deployment and development, you’ll almost always be hit by the unhelpful `internal server error` from Lambda.

To figure out what’s actually going on inside your code, you’ll need to check the Lambda logs. Open your terminal and run:

`serverless logs -f createThumbnails --tail`

Notice the `--tail` option. That will keep an open terminal session and listen for log events as you invoke and test your functions. Just keep going back to this terminal session whenever you get an `internal server error` as you test your function.

One small trick I like to do to avoid this `internal server error`, and know exactly what’s happening on invocation response, is to wrap my entire handler code into a `try/catch block`, or a `.catch` block if it’s async).

Then, instead of throwing an error directly, you can pass it in the handler callback:

```js
module.exports.createThumbnail = (event, context, callback) => {

 try {
   // your highest level code goes here...
 } catch (e) {
   callback(e)
 }
}
```

> **Note:** this doesn’t *always* work. Sometimes, the `internal server error` is beyond an issue with the codebase. Checking the logs is always your last resort.

#### Recap

Test your application in the dev stage and make sure that everything is working as expected. Then, you should feel safe to deploy your application to QA or production.

If you’ve resolved all the code-specific errors you find in the dev stage, it's unlikely they'll crop up again later. But you might still face some rare infrastructure errors (e.g., 'maximum stack count exceeded'). Those are AWS-specific errors that sometimes you can’t avoid, and unfortunately they’re outside the Serverless Framework scope.

Happy bug hunting!
