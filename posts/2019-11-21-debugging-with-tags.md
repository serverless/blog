---
title: "Resolve Serverless Errors the Easy Way- with Tags"
description: "Tag your Lambdas to track errors and debug serverless applications. If you’re using NodeJS or Python, we’ll help you find even the trickiest serverless application errors faster."
date: 2019-11-21
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/debugging-tags/thumb+tags%402x.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/debugging-tags/tags+header%402x+(1).png"
authors:
  - VerneLindner
category:
  - news
  - operations-and-observability
---

#### Debugging Serverless Application Errors
When a customer reports an issue that you can’t replicate, but you still need to solve, what do you do? You can release a change with a log statement, then start monitoring logs to try and catch the customer’s function, and hope you see the error again. That can be a long and fruitless task.

We’ve been there ourselves! That’s why we’ve added tags to the Serverless Framework dashboard’s debugging tool, the explorer. 

![Tags in dashboard](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/debugging-tags/tags-img-01.png)


Our new tag filters can do the tracking for you. Now, when you’re trying to debug an issue that’s hard to track or hard to replicate, try this: log when you’re in the error state, tag that log line, and output a JSON object that represents some state of your application. Open the explorer, filter on that tag and view the invocations the explorer finds for you. 

![Tags in dashboard](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/debugging-tags/tags-img-2.png)


Here’s an example of how we’ve used it; the API that powers the Serverless Framework dashboard is monitored within the dashboard (yes, we eat our own dogfood). One of our customers reported a query error, but no actual errors were being raised. We created a tag, and used it to find their invocation logs, so we could study the state of our application during the time their functions were invoked.

Instead of trying to track their invocations ourselves, we let the explorer do it. The time we spent was entirely focused on understanding the issue, not hunting for logs. 

If you want to try tags in the explorer, you’ll first need to add some to your Serverless.yml file.

#### Tagging with NodeJS

If you’re using NodeJS, update serverless with npm update -g  serverless

Add this code to your Serverless.yml file: 

```javascript
module.exports.hello = async event, context => {
 context.serverlessSdk.tagEvent('customerId', 5, { newCustomer: true, isDemo: true, demoExpire: '2019-12-01' })
 tagEvent('200 OK')
 return {
   statusCode: 200,
   body: JSON.stringify(
     {
       message: 'Go Serverless v1.0! Your function executed successfully!',
       input: event,
     },
     null,
     2
   ),
 };
};
```

#### Tagging with Python
If you’re using Python, add this:
```javascript
def hello(event, context):
   context.serverless_sdk.tag_event('customerId', 5, { 'newCustomer': True, 'isDemo': True})
   body = {
       "message": "Go Serverless v1.0! Your function executed successfully!",
       "input": event
   }

   response = {
       "statusCode": 200,
       "body": json.dumps(body)
   }
```

If you’d like to learn more about tagging Lambda functions, check out Jeremy Daly’s blog post, “[How to tag your Lambdas for smarter serverless applications](https://www.jeremydaly.com/how-to-tag-your-lambda-functions-for-smarter-serverless-applications/)". 

Learn more about [debugging with the explorer](https://serverless.com/debugging/), and open up your Serverless Framework Dashboard and explore tags for yourself!



