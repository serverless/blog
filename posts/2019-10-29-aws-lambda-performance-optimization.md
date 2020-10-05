---
title: AWS Lambda Performance Optimization & Monitoring with Tracing & Spans (Serverless Framework Pro)
description: "To troubleshoot the performance of an AWS Lambda function, we need the transaction time of each dependency. Come see how we do that with Serverless Framework Pro"
date: 2019-10-29
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/tracing-and-spans/Thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/tracing-and-spans/header.png"
authors:
  - MaciejSkierkowski
category:
  - news
  - guides-and-tutorials
---

Serverless applications are highly distributed, where each function performs a focused task and depends on countless other services for the remainder. For example, a REST API endpoint with a lambda function will have relatively little code, but it will have dependencies on other services like:

* Invoking other functions which provide shared logic across your service
* Interacting with infrastructure services like SES, SNS and DynamoDB
* Calling services like Stripe or Twilio using client SDKs
* Querying a database like RDS using an ORM like Sequelize

If the REST API endpoint performance is degraded, it can be incredibly challenging to identify the root cause as it may be tied to the function code or to any one of the countless dependencies. As your applications grow, so do the service dependencies and the possible root causes of performance issues.

To troubleshoot the performance of a AWS Lambda function, we need traces and spans that show us the transaction time of each dependency.

Serverless Framework Pro provides both zero-config / zero-code automatic instrumentation and custom instrumentation to capture spans of the calls to dependent services. Your code is automatically instrumented for you and the Serverless Framework Dashboard provides a powerful invocation explorer to drill into and visualize span details.

Let’s have a look at how automatic AWS and HTTP instrumentation works, and how you can use custom spans for all other cases. While the examples are all node-js based, this is also automatically supported for Python, with other runtimes coming soon.
 
#### Automatic AWS Spans

One of the first challenges of troubleshooting performance issues is instrumentation. You have to identify all possible calls to dependent services and instrument the spans. In Serverless Framework services, the most common dependencies are AWS services like DynamoDB, SES, SQS, and S3.

In the example below, we use the AWS SDK to call the invoke method to invoke another lambda function. The call to `lambda.invoke`, is automatically instrumented to capture the AWS SDK method and the time span information. Without any modification to our usage of the AWS SDK, the calls are all automatically instrumented.

```javascript
module.exports.handler = async (event, context) => {
  context.span('some-label', () => {

  var params = { /* request details */ };
  lambda.invoke(params,(err, data) => {
   if (err) console.log(err, err.stack); // an error occurred
   else     console.log(data);           // successful response
 });
  });
};
```

#### Automatic HTTP Spans

In addition to automatically instrumenting spans in the AWS SDK, all HTTP spans are also automatically instrumented. For example, below we use the Stripe API to process a charge. Under the hood, the Stripe API key makes HTTPS API calls to Stripe. The Serverless Framework automatically instruments those API calls and captures the span details (start time / end time / duration), HTTP Status, HTTP method, response code, host name, and path. 

```javascript
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

module.exports.handler = (event, context) => {
  const requestBody = JSON.parse(event.body);

  return stripe.charges.create({ // Create Stripe charge with token
    requestBody.charge.amount,
    currency: 'usd',
    description: 'Serverless Stripe Test charge',
    source: requestBody.token.id,
  })
    .then((charge) => { 
      const response = { /* success response */ };
    })
    .catch((err) => { 
    const response = { /* error response */ }
    })
};
```

#### Custom Span Instrumentation

In the majority of the cases, when troubleshooting performance issues, the automatic AWS and HTTP instrumentation will be sufficient. However, to get full coverage of your serverless application, we may need to add custom instrumentation.

For example, if you use an ORM like Sequelize to call RDS, this will not use the AWS SDK or HTTP. In this case, we’ll add custom span instrumentation.

```javascript
module.exports.handler = async (event, context) => {
  await context.span('some-label', async () => {
    // The execution of this function is captured as a span.
    // It is automatically invoked with no arguments and awaited.
  });
};
```

The `context.span` method allows us to decorate an async call which we want to instrument.

#### Spans in the Dashboard

Now that you’ve instrumented your lambda functions to capture spans, let’s take a peek at what our data looks in the dashboard.

![Spans in dashboard](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/tracing-and-spans/spans-in-dashboard.png)

At Serverless, we love to dogfood - this is a screenshot of one of the services that powers the [Serverless Framework Dashboard](https://serverless.com/dashboard). You can see the duration, invocation details, and the span data in a single view. If your service was experiencing any kind of latency issues, you’d immediately see the dependency with the longest duration. 

#### Get Started

To get started, first make sure you are on the latest version of the Serverless Framework, which you can install with `npm install serverless --global`. Even though the framework itself is written in  Node, the dashboard supports Python too. If you don’t have a Serverless Framework account, register at https://app.serverless.com/, and if you haven’t yet logged in, run `sls login` on the CLI to login.

Now run `sls` in your working directory. If you are new to Serverless Framework, this will start a new project. If you are running it from within an existing Serverless Framework project, then this will update your `serverless.yml` to work with the Dashboard and enable monitoring and tracing spans.

Now deploy with `sls deploy` and you’ll immediately start seeing the invocations and spans in the dashboard as soon you invoke the functions.

No additional configuration or instrumentation is needed, Serverless Framework monitoring and spans work out of the box. If you want to add custom spans these [Node.js docs](https://serverless.com/framework/docs/dashboard/sdk/nodejs#span) and [Python docs](https://serverless.com/framework/docs/dashboard/sdk/python/) will help you out.
