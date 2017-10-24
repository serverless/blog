---
title: How to Test Serverless Applications
description: "A brief reading on how to effectively test serverless applications"
date: 2017-10-24
thumbnail: 'http://url-to-thumbnail.jpg'
layout: Post
authors:
  - EslamHefnawy
---

# How to Test Serverless Applications

While the Serverless movement is still at its infancy, serverless applications are getting more and more complex, and developing them requires a special set of testing skills. I’ve been building the Serverless Framework for 2 years now, and during that time, I’ve focused my energy on making that testing and debugging experience as smooth as possible.

In this article, I’ll share some of the testing techniques that you could use with the Serverless Framework to test and debug your serverless application during development. Some might be obvious, while others might be hidden somewhere in the docs. I’ll be focusing on testing serverless functions, since this is where most of the development happen, and I’ll ignore other infrastructure tests (ie. AWS API Gateway)

## Unit Testing
You can’t talk about testing without starting off with unit tests. It goes without saying that unit testing is essential for any codebase, regardless of whether it’s serverless or not. This is where you should start testing your code. Forget about Lambda, the handlers and the events. Just organize your codebase in an easy to test structure following your language’s best practice.

Your handler should always be a thin layer that uses modules out of your code library. If those modules are well covered with unit tests, testing the serverless part of your application (ie. the handlers) would become easy during the integration tests discussed below. **Unit testing is the first step.**

## Integration Testing
Now that you’ve covered your codebase with unit tests, it’s time to test your handlers with overall integration tests. That means that you’ll be testing how all of those units you’ve been testing individually work together.

**Work With Stages**

Since you’ll be interacting with the actual infrastructure pieces that you’ve setup for your application, you need to make sure you probably stage your application during development. The default stage when using the Serverless Framework is the dev stage. So make sure you setup a dev stage for all your application infrastructure (databases, buckets..etc) that your codebase would use during the integration tests.


**Setup Event Mocks**

One other step that you’ll need to take before starting the tests is to have some event mocks prepared for all your handlers depending on one type of event the handler is expecting. For example, if your serverless function is subscribing to an S3 event source, make sure you have a JSON file that mocks that S3 event that AWS sends out. You can get that by trying it out yourself only once on AWS, and store it somewhere for future reference.

> **Note:** We know It’s an issue that each event source sends out a different event structure, and there’s no central place where you can know how this event looks like without actually trying it out yourself. We’re working behind the scenes on solving that problem! Stay tuned!

### Local Lambda Invocation
Alright, now you have your codebase well covered with unit tests. It’s now time to also test those thin handler layers you’ve left out and how they fit in within your codebase. You can do so simply by invoking your function locally using the *serverless invoke local* command. All you need to do is to provide it with the function that you’d like to invoke, and an accurate event mock (You’ve set that up already, right?!)

So for example, to test a function called *createThumbnail* that is subscribing to an S3 event source, put the S3 mocked event in a *createThumbnail.json* file and run *serverless invoke local -f createThumbnail -p createThumbnail.json*.

While invoke local doesn’t 100% emulates Lambda, you’ll still be able to find issues in your codebase quickly without having to wait for a deployment.

### Using the Event Gateway
We’ve recently announced a new project called the Event Gateway that helps manages all events happening in your serverless application. You can use the event gateway to locally and rapidly test your functions. To spin up the Event Gateway, just run *serverless run*. This will run the Event Gateway in the current terminal session. In another session, you can start emitting events with the *serverless emit* command to invoke any function that is subscribing to that event. You’ll be able to see the result of all function invocations in the *serverless run* session.

Using the Event Gateway is a great way to bulk-test your functions quickly to see how they react to the events they’re subscribing to. But of course, it only works for functions that are subscribing to at least one event. For other functions, you can invoke the function directly as shown above.

### Remote Lambda Invocation
After testing and debugging your serverless application locally, you now feel confident to deploy your application, at least to the dev stage. However, keep in mind that the local environment is a bit different than the actual deployment environment. For example, AWS Lambda limits don’t apply locally, so you need to make sure you’re not hitting any of those limits on deployment. This is where stages come in, as stages could act like exact replicas of the production environment, since they run on the same infrastructure.

Just like local testing, you can pass a mocked event to the *serverless invoke* command to test your deployed functions. However, now that your functions are deployed, you now also have the option to make your integration test more accurate by triggering the real event. So taking the *createThumbnail* example above, you can actually upload a photo to the S3 bucket in the dev stage and see how the *createThumbnail* Lambda is reacting to that event.

### Investigating Internal Server Errors
During deployment and development, you’ll almost always be hit by the unhelpful *internal server error* from Lambda. In order to figure out what’s actually going on inside your code, you’ll need to check the Lambda logs. You can do that by running *serverless logs -f createThumbnails --tail*. Notice the *--tail* option that will keep an open session in terminal and listen for log events as you invoke and test your functions. Just keep getting back to this terminal session whenever you get an *internal server error* as you test your function.

One small trick I like to do to avoid this *internal server error* and knowing exactly what’s going on on invocation response is wrapping my entire handler code into a *try/catch block* or a *.catch* block if it’s async, then instead of throwing an error directly, just pass the error in the handler callback. Something just like this:

```js
module.exports.createThumbnail = (event, context, callback) => {

 try {
   // your highest level code goes here...
 } catch (e) {
   callback(e)
 }
}
```

This doesn’t always work though as sometimes the *internal server error* is beyond an issue with the codebase. So checking the logs is always your last resort.

### Final Thoughts
This pretty much covers the entire cycle of developing and testing your serverless applications. After testing your application on the dev stage and making sure that everything is working as expected, you should feel safe to deploy your application to the next stage, probably qa or finally the production stage. 

It’s unlikely to face the same errors you faced in the dev stage if you’ve resolved them there, specially code specific errors. However you might still face some rare infrastructure errors (ie. maximum stack count exceeded...etc). Those are AWS specific errors that sometimes you can’t avoid, and unfortunately they’re outside the Serverless Framework scope. However, despite of this, your application should be ready for production pretty quickly!


