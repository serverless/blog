---
title: "New Serverless Plugin for IOpipe Monitoring and Observability via AWS Lambda Layers"
description: "IOpipe just released a new Serverless plugin to add monitoring and observability to your Lambda functions without requiring code changes."
date: 2019-03-26
thumbnail: ''
category:
  - news
  - guides-and-tutorials
heroImage: ''
authors:
  - kolanos
---

---

IOpipe just released a new [Serverless plugin](https://github.com/iopipe/serverless-iopipe-layers) to add monitoring and observability to your Lambda functions without requiring code changes.

If you’re using the [Serverless Framework](https://serverless.com/framework/) to build, deploy, and operate your applications on AWS Lambda, we built our new plugin to make it simple for developers to get realtime high-resolution invocation metrics and intuitive debugging for their serverless applications.

Through [AWS Lambda Layers](https://read.iopipe.com/cutting-through-the-layers-aws-lamba-layers-explained-28e8a8d7bda8), this new release bundles all of IOpipe’s plugins in a single layer to instantly provide intuitive observability and realtime high-resolution invocation metrics so developers spend less time configuring and more time building.

Whether you’re trying to instantly identify individual functions slowing down the performance of your applications or automatically trace an HTTP/S call, the Serverless IOpipe Layers plugin includes the following features:


+ Supports Node.js and Python runtimes (more runtimes to come)
+ No code change required to enable IOpipe
+ Bundles all of IOpipe's observability plugins in a single layer including:
  + Auto-tracing
  + Intuitive debugging
  + Realtime high-resolution invocation metrics
  + Error Aggregation Alerts (with PagerDuty integration)
  + Function Profiling

## What exactly are Layers, though?
A layer is a ZIP archive that contains libraries, a custom runtime, or other dependencies. With layers, you can use libraries in your function without needing to include them in your deployment package.

Layers let you keep your deployment package smaller and helpsavoid errors that can occur when you install and package dependencies with your function code. 

To learn more about how to publish and use AWS Lambda Layers with the Serverless Framework, check out this [tutorial](https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/).

To get a full introduction to AWS Lambda Layers, read our recent blog post, [“Cutting through the layers: Lambda Layers explained.”](https://read.iopipe.com/cutting-through-the-layers-aws-lamba-layers-explained-28e8a8d7bda8) 

## Installing the Serverless IOpipe Layers Plugin:

With NPM:

```
npm install --save-dev serverless-iopipe-layers
```

With yarn:

```
yarn add --dev serverless-iopipe-layers
```

Add the plugin to your `serverless.yml:`

```
plugins:
  - serverless-iopipe-layers
```

Get a free IOpipe token and plug it into your `serverless.yml:`

```
custom:
 iopipe:
      token: your-iopipe-token-here
```

Deploy and you're all set.

## Try it out
To sign up for a free observability and monitoring up to a million invocations per month, visit [iopipe.com](https://dashboard.iopipe.com/signup/). If you have any questions or feature requests, join our [IOpipe Community on Slack](https://iopipe.now.sh/).


