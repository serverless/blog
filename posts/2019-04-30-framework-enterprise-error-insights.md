---
title: "Serverless Framework Enterprise 0.9.0 - Error Insights"
description: "With today’s Serverless Framework Enterprise release, we are extending the capabilities of Serverless Error Insights to support invocation logs access along with stack traces & more."
date: 2019-05-01
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-enterprise-updates/error-insights/serverless-enterprise-error-insights-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-enterprise-updates/error-insights/serverless-enterprise-error-insights-header.png"
category:
  - news
authors:
  - MaciejSkierkowski
---

With today’s Serverless Framework Enterprise release we are extending the capabilities of Serverless Error Insights to support invocation logs. Developers can now easily access invocation logs along with stack traces from new error type alerts and error metrics to help developers discover, troubleshoot and easily resolve errors.

### New error type alert

Errors happen, and the sooner you know about them after they are introduced the better equipped you are to proactively mitigate their impact. Serverless Framework Enterprise will track all the unhandled exceptions in your application and notify you when a new error type is identified. In the Serverless Framework Enterprise dashboard you can see the “new error type identified” alert on the “activity & insights” list.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-enterprise-updates/error-insights/serverless-enterprise-activity-insights.png">

### Error metrics

We wish the world was bug free but we can’t fix every single one of them. To manage the errors over time we need to view the trends. The errors metrics chart shows error count trends for a service over time. Click into a point on the chart to see error counts and error types by function. Click on an error type to see an occurrence of an error.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-enterprise-updates/error-insights/serverless-enterprise-error-metrics.png">

### Error stack traces

Serverless Framework Enterprise shows your code stack trace right in the dashboard. You can navigate from a new error alert or the error metrics chart to view the stack trace of your service when the error occurred. If you use tools like Webpack or Typescript which generate the package code, you can also upload a source map to properly generate the stack trace.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-enterprise-updates/error-insights/serverless-enterprise-error-stacktrace.png">

### CloudWatch logs with stack traces \[new]

AWS Lambda automatically monitors and reports metrics on your lambda functions through AWS CloudWatch. AWS Lambda automatically tracks the requests, execution duration per request and a number of other metrics.

While CloudWatch captures a lot of critical information to help you identify and troubleshoot errors with your functions, it is also difficult to identify an individual invocation and log stream related to an error or unhandled exception.

To help navigate CloudWatch logs we’ve added the CloudWatch logs directly into the Serverless Framework Enterprise dashboard. When you receive a New Error Type alert, the CloudWatch logs for that error are made available with the alert and stack trace. Similarly, when you select an individual error from the errors chart, you will be presented with the stack trace and the AWS CloudWatch logs in the same dialog. You no longer need to fire up the AWS console to get the relevant CloudWatch logs.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-enterprise-updates/error-insights/serverless-enterprise-cloudwatch-logs.png">

### Getting Started with the new error insights

If you’re already developing your service using the Serverless Framework then integrating these new features is easy peasy. First, [register for a Serverless Framework Enterprise account](https://serverless.com/enterprise/#enterprise-contact-form), then just [update your existing service to use the enterprise plugin](https://github.com/serverless/enterprise/blob/master/docs/update.md).
