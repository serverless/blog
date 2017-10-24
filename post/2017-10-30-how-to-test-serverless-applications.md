---
title: How to Test Serverless Applications
description: "A brief reading on how to effectively test serverless applications"
date: 2017-10-30
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/testing-apps.jpg'
layout: Post
authors:
  - EslamHefnawy
---

Serverless applications are quickly gaining in complexity. Testing is key.

I’ve been building the Serverless Framework for 2 years now, and during that time it's been my focus to create as smooth a testing and debugging experience as possible. In this article, I’ll share some techniques that you can use with the [Serverless Framework](https://www.serverless.com/framework) to test and debug your serverless application during development. 

We'll focus on testing serverless functions, since this is where most of the development happens.

# Unit testing

This one is a gimme. You should always start with unit tests, whether or not your codebase is serverless. Forget about Lambda, the handlers, the events—just organize your codebase in an easy-to-test structure that follows your language’s best practice.

Your handler should always be a thin layer that uses modules out of your code library. If those modules are well-covered with unit tests, then testing the serverless part of your application (i.e., the handlers) will be easy during the integration tests discussed below.

# Integration testing

Now that you’ve covered your codebase, it’s time to move on to your handlers with overall integration tests. Let's see how all of those units you’ve been testing individually work together.

**Work with stages**<br>
Since you’ll be interacting with the actual infrastructure pieces in your application, you'll need to make sure you stage your application during development. Set up a dev stage—the default when using the Serverless Framework—for all application infrastructure (databases, buckets, etc.) that your codebase will use during the integration tests.

**Set up event mocks**<br>
One other step that you’ll need to take before starting the tests is to have some event mocks prepared for all your handlers depending on one type of event the handler is expecting. For example, if your serverless function is subscribing to an S3 event source, make sure you have a JSON file that mocks that S3 event that AWS sends out. You can get that by trying it out yourself only once on AWS, and store it somewhere for future reference.

> **Note:** It’s a known issue that each event source sends out a different event structure, and there’s no central place to see what events look like without actually trying them out yourself. We’re working behind the scenes on solving that problem. Stay tuned!

## Local Lambda invocation

Let's test those thin handler layers and how they fit in within your codebase. You can do so by invoking your function locally using the `serverless invoke local` command. Just provide it with the function you’d like to invoke, and an accurate event mock. (...Which you’ve totally set up already, right?!)

For example, let's test a function called `createThumbnail` that is subscribing to an S3 event source. We'll do this by putting the S3 mocked event in a `createThumbnail.json` file, and then we'll run:

`serverless invoke local -f createThumbnail -p createThumbnail.json`

While `invoke local` doesn’t emulate Lambda 100%, you’ll still be able to find issues in your codebase quickly without having to wait for a deployment.

## Using the Event Gateway

We’ve recently announced a new project called the [Event Gateway](https://www.serverless.com/event-gateway) that helps manage all events happening in your serverless application. You can use the Event Gateway to locally and rapidly test your functions. 

We'll need two terminal sessions for this. First, spin up the Event Gateway in your current terminal session with `serverless run`. Then, open another session and emit events with the `serverless emit` command. This will invoke any function that is subscribing to that event, and you’ll be able to see the result of all function invocations in the `serverless run` session.

> **Note:** this only works for functions that are subscribed to one or more events. For other functions, you'll need to invoke the function directly, as shown above in the Local Lambda invocation section.

## Remote Lambda invocation

After testing and debugging your serverless application locally, you probably feel confident enough to deploy your application—at least to the dev stage. 

Keep in mind that the local environment is a bit different than the actual deployment environment: e.g., AWS Lambda limits don’t apply locally, so you'll need to make sure you’re not hitting any of those limits on deployment. This is where stages come in; they can act like exact replicas of the production environment, since they run on the same infrastructure.

Just like local testing, you can pass a mocked event to the `serverless invoke` command to test your deployed functions. But even better, now that your functions are deployed, you have the additional option of triggering the real event. In our `createThumbnail` example above, you can actually upload a photo to the S3 bucket in the dev stage and see how the `createThumbnail` Lambda reacts to that event.

## Investigating Internal Server Errors

During deployment and development, you’ll almost always be hit by the unhelpful `internal server error` from Lambda.

To figure out what’s actually going on inside your code, you’ll need to check the Lambda logs. Open your terminal and run:

`serverless logs -f createThumbnails --tail`

Notice the `--tail` option. That will keep an open terminal session and listen for log events as you invoke and test your functions. Just keep going back to this terminal session whenever you get an `internal server error` as you test your function.

One small trick I like to do to avoid this `internal server error`, and know exactly what’s happening on invocation response, is to wrap my entire handler code into a `try/catch block`, or a `.catch` block if it’s async).

Then, instead of throwing an error directly, you can pass it in the handler callback:

```
js
module.exports.createThumbnail = (event, context, callback) => {

 try {
   // your highest level code goes here...
 } catch (e) {
   callback(e)
 }
}
```

> **Note:** this doesn’t *always* work. Sometimes, the `internal server error` is beyond an issue with the codebase. Checking the logs is always your last resort.

# Recap

Test your application in the dev stage and make sure that everything is working as expected. Then, you should feel safe to deploy your application to QA or production. 

If you’ve resolved all the code-specific errors you find in the dev stage, it's unlikely they'll crop up again later. But you might still face some rare infrastructure errors (e.g., 'maximum stack count exceeded'). Those are AWS-specific errors that sometimes you can’t avoid, and unfortunately they’re outside the Serverless Framework scope.

Happy bug hunting!
