---
title: "How to Troubleshoot Serverless API’s"
description: "Find out how we go about debugging and troubleshooting our Serverless APIs with Serverless Framework Pro"
date: 2020-01-24
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/webinar-troubleshooting-apis_1200x627.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/blog-hero_troubleshooting-serverless-apis.png"
category:
  - operations-and-observability
  - guides-and-tutorials
authors:
  - GarethMcCumskey
---

Building API’s is an order of magnitude the most common use case we see for Serverless architectures. And why not? It’s so easy to combine API Gateway and AWS Lambda to create API endpoints that have all the disaster recovery and load management infrastructure you need by default. Combine that with the Serverless Framework and creating them is as easy as:

```yml
functions:
  myfunction:
    handler: myhandlerfile.myhandlerfunction
      events:
        - http:
          path: myendpoint
          method: get
```

But how do we go about debugging and troubleshooting our APIs? CloudWatch within AWS does (sort of) give us easy access to our Lambda logs, and we can turn on API Gateway logging. But this doesn’t provide us all the info we need if our API begins to have trouble.

This is pretty much the entire reason why we created Serverless Framework Pro, as a way to help users of the Serverless Framework to monitor and debug their Serverless services; APIs being chief among them.

And if this is the first time you are hearing about this, let me introduce you to the the Serverless Framework Pro dashboard with a [2 minute Youtube video](https://youtu.be/Wbj7J1ziGyY) to get you up to speed.

If you would like to know how to connect one of your services to the dashboard, make sure you have the most recent version of Serverless installed (`npm i -g serverless` or if you use the binary version `serverless upgrade`) and then run the command `serverless` in the same folder as your service. You will be walked through setting everything up.

#### Log to CloudWatch

When you are trying to debug you need to have data in order to help you determine what may have caused any problems. The easiest way to do that is to make sure you use your runtime's logging method when you need to. For example, in a NodeJS Lambda, we can capture any errors that come up when we make calls to other AWS resources such as DynamoDB, for example. Writing code that logs out the appropriate error data in this case may look something like this:

```javascript
const query = {
  TableName: process.env.DYNAMODB_USER_TABLE,
  KeyConditionExpression: '#id' = ':id',
  ExpressionAttributeNames: {
    '#id': id
  },
  ExpressionAttributeValues: {
    ':id':'someid'
  }
}
let result = {}
try {
  const dynamodb = new AWS.DynamoDB.DocumentClient()
  result = await dynamodb.query(userQuery).promise()
} catch (queryError) {
  console.log('There was an error attempting to retrieve the data')
  console.log('queryError', queryError)
  console.log('query', query)
  return new Error('There was an error retrieving the data: ' + queryError.message)
}
```
With this arrangement, it means if for some reason our query to DynamoDB errored out, looking at the logs would indicate exactly why. And the same pattern can be applied to almost all types of code that has the possibility of erroring out while executing. 

#### Aggregate monitoring

Before we can troubleshoot any specific errors, often it can be hard to tell if any errors are happening in the first place! Especially when you are dealing with a busy production system, it can be hard to tell if your users are experiencing any errors and this is where Serverless Framework Pro comes into its own with the service overview screen. 

By just glancing at the charts provided here, you can immediately see if any API requests or Lambda invocations have returned as errors and in some way affected your users, even if they themselves are not aware of it.

![Image showing error bars](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/Error+Visible.png)

With the image above, I don’t need to wait for a user to complain or report an error, I can instantly see that some errors start happening around 7pm. But it doesn’t end there. It would be even better if I am not required to be watching these charts and I just get notified if something happens.

This is where the Serverless Framework Pro notifications come into it. By going into my app settings, and choosing notifications in the menu, I can configure to have notifications sent to an email address or several, a Slack channel, call a webhook or even send the notification to SNS so I can have own Lambda function, for example, process those notifications as I want.

![Notifications options](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/NotificationsScreen.png)

You can configure these per service and per stage and have as many notification configurations as you wish; perhaps dev stages report via email since they aren’t critical but errors in production always go to a Slack channel for the whole team.

#### Retrieving error details

Since I am now able to see and be alerted to errors, I need some way to help me figure out what the error is and how to fix it. This becomes relatively easy with Serverless Framework Pro again. 

![Overview showing errors](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/SeeSomeErrors.png)

You start off with an overview screen such as this and I see some errors. Let me click on that…

![Errors List](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/ErrorsList.png)

Now I can see some summary information about the errors within that time frame. Let me select one to drill down further

![Stack trace and logs](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/StackTraceAndLogs.png)

Scrolling down a bit on the next view I can see that Serverless Framework Pro is giving me a stack trace of the line of code in my handler that threw the error so I know exactly where to look. And because of my detailed `console.log` lines, my CloudWatch log shows me the data related to the error. (Obviously I deliberately generated an error for demo purposes here, but the same applies for actual errors as well).

**NOTE**: CloudWatch logs are pulled in from your AWS account. They are not stored anywhere within Serverless Framework Pro, so when I open this detailed view, Serverless Framework Pro makes a request to your AWS account to retrieve the logs. If you delete the CloudWatch log from your account it won’t be visible here either.

<!-- #### API Only Errors

So far we have been able to troubleshoot errors related to our own code. But what if there is an issue happening with our API requests before it even hits a Lambda function? Errors such as an authorizer failing an authorization request would not show up as a Lambda error. In the same way if you had a request syntax schema applied to your endpoint, and a request errored out, Lambda monitoring would not show you that. However, take a look here:

[[IMAGE OF API ERRORS VS LAMBDA ERRORS SHOWING FEWER LAMBDA ERRORS THAN API ERRORS]]

As you can see, the API chart shows more errors than the Lambda chart, and this is because it makes it visible that we had errors that didn’t hit a Lambda. Clicking through to the Explorer again and we see:

[[IMAGE OF EXPLORER SHOWING API ONLY ERRORS]]

Now we can immediately see the cause of these errors are authorization related.
-->
#### Prevention is better than cure

Up till now we’ve been looking at how to react to errors. But we can even take it one step further and keep our eyes out for issues that may cause a problem later. For example, if we have Lambda functions that generally run for a certain amount of time, say between 50 and 100 ms, and suddenly there is a spike where our Lambdas are running for over 200ms, this could indicate a potential problem brewing; perhaps some downstream provider is having issues and if we could get some warning ahead of time we could perhaps head that off at the pass. The same thing could apply for invocation count. Maybe we usually get a very steady flow of activity on our Lambda invocations and any sudden spike in invocations is something we need to know about.

Serverless Framework Pro already creates these alerts for you automatically and you can choose to have notifications of these alerts sent to you using the notifications system shown before.

#### Performance tweaking

Troubleshooting doesn’t have to be all about errors. We may need to meet certain performance criteria, and Serverless Framework Pro gives us ways to assess this too.

##### Assessing execution time

Every Lambda function can have a memory size value set. But this setting is not just for memory and also affects CPU and network allocation as well in a linear way; if you double memory you double effective CPU and network. By clicking through to the functions section on the menu on the left, and then selecting a specific function, you can see duration statistics with dashed vertical lines for deployment. Now you can immediately see how a change you makes affects the average execution time of your invocations after a deployment.

![Function Duration Change](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/RequestDurationDropped.png)

And you can do exactly the same for memory usage...

##### SDK and HTTP requests 
Often in a Lambda we need to make requests to other AWS services via the AWS SDK or even HTTP requests out to other 3rd party services, and these can have definite impact on the performance of our endpoints. So being able to gauge this impact would be really useful.

Again, Serverless Framework Pro makes it possible to investigate this. Within the detailed view of a Lambda, we can see the spans section that will indicate to us if our outgoing requests are slower than they should be. Remember the issue with third party services mentioned above? Well, with spans we can see how long requests can take and then take appropriate action.

![Spans for AWS SDK](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/SpansDynamoDB.png)

#### Pushing data at runtime

However, not all the data we want to look at is as vanilla and easy to capture as we have seen so far. Sometimes we need to be able to analyse metrics and data that is only available at runtime. Which is why the Serverless Framework Pro SDK incorporates a number of features to help track this data a little easier. By default, Serverless Framework Pro overloads the context object at runtime, and provides some additional functions to use for runtime data capture.

All these options are documented [on the Serverless website](https://serverless.com/framework/docs/dashboard/sdk/) and include options for Node and Python runtimes.

##### Capture Error

There may be cases where we would like to know about a potential error without actually returning an error to the end user making the request. So instead we can use the captureError method:

```javascript
if (context.hasOwnProperty('serverlessSdk')) {
  context.serverlessSdk.captureError('Could not put the user')
}
return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Headers': 'Authorization'
    }
  }
```
As you can see from the above, we just push an error message out but ultimately return a 200 response. And our monitoring will show it as an error.

![Captured Errors](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/CapturedErrorsOnly.png)

##### Capture Span

And we can do the same for capturing any code that may take time to execute. We can wrap that code in our own custom span and see the performance data made available to us:

```javascript
if(context.hasOwnProperty(‘serverlessSdk’)) {
  await context.serverlessSdk.span('HASH', async () => {
    return new Promise((resolve, reject) => {
      bcrypt.hash("ARANDMOMSTRING", 13, () => {
        resolve()
      })
    })
  })
}
```

The above produces the following span:

![Custom Span of the Hash](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/troubleshoot-serverless-apis/HashCustomSpan.png)

You can immediately tell, just looking at that, that your focus for any optimisation needs to be on that HASH span. Trying to optimise anything else wouldn’t make sense.

##### Capture Tag

Lastly, there exists a way to capture key-value pairs from invocations at run time that can be filtered for in the explorer view. Maybe an example will make this a little easier to grasp.

You have built a checkout process that captures a users credit card details and then passes those details onto a third party payment provider. A lot of us will have built such functionality in the past. And usually what happens is that the response, after passing those details, will indicate success or failure and actually even explain why it failed; lack of funds, expired card, declined by bank, etc. We can tag these various states to make it possible for us to search through these easier. It basically lets you pass a key, a value and additional context data if you need it:

```javascript
if (paymentProvider.status === ‘success’) {
  context.serverlessSdk.tagEvent('checkout-status', event.body.customerId, paymentProvider.response
  });
}
```

This allows you to find all invocations that relate to a specific customer ID so if we ever needed to find the very specific logs from the payment provider processing the card details we can easily filter by that customer ID.

--------------------

Serverless Framework Pro has a generous free tier for anyone building a Serverless application to use. It requires
 nothing more than [signing up here](https://app.serverless.com).

If you would like to see these features in action, then feel free to [sign up for our webinar)[https://serverless.zoom.us/webinar/register/WN_7GpfDR5sT-qsUmovARuvrg] on 6 February.
