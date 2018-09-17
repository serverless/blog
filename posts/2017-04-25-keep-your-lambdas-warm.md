---
title: Keeping Functions Warm - How To Fix AWS Lambda Cold Start Issues
description: Learn how to prevent cold start in your Lambda functions with the Serverless WarmUp plugin.
date: 2017-04-25
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/keep-your-lambdas-warm.jpg'
category:
  - guides-and-tutorials
  - operations-and-observability
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/keep-your-lambdas-warm.jpg'
authors:
  - GoncaloNeves
---

Cold starts in AWS Lambda got you down? You've come to the right place.

In this post, I'll briefly cover what cold starts are, and then show you some ways to reduce your cold start times. Read on!

#### First: what is a cold start? ❄️

When running a serverless function, it will stay active (a.k.a., hot) as long as you're running it. Your container stays alive, ready and waiting for execution.

After a period of inactivity, your cloud provider will drop the container, and your function will become inactive, (a.k.a., cold).

A cold start happens when you execute an inactive function. The delay comes from your cloud provider provisioning your selected runtime container and then running your function.

In a nutshell, this process will considerably increase your execution time.

##### Understanding AWS cold starts

When using AWS Lambda, provisioning of your function's container can take >5 seconds. That makes it impossible to guarantee <1 second responses to events such as API Gateway, DynamoDB, CloudWatch, S3, etc.

[This analysis of AWS Lambda + private VPC container initialization times](https://robertvojta.com/aws-journey-api-gateway-lambda-vpc-performance-452c6932093b) concluded:
- Run-times and memory size don't affect container initialization time
- Lambda within a private VPC increases container initialization time
- Containers are not reused after ~15 minutes of inactivity

#### How to make them warm ♨

Ready to combat those cold starts? Here's how you do it.

##### Find out: where are the bottlenecks, and when?

To fix cold start problems, knowing your service performance bottleneck is essential. From small to big services, it's common to find one function that slows down your service logic because it doesn't run often enough to keep its container alive.

For example, one of my own cold functions was a reset email service during off-peak hours. From UTC+1 23:00 to UTC+1 06:00 (London), it took more than *double* the amount of time to get a reset password email.

##### Then: use the cold starts plug-in for the Serverless Framework

I got sick of cold starts on my Lambdas at [@Fidel](https://fidel.uk), so I wrote a plugin called [serverless-plugin-warmup](https://github.com/FidelLimited/serverless-plugin-warmup) that allows you to keep all your Lambdas hot. (YES.)

WarmUP does this by creating a scheduled event Lambda that invokes all the Lambdas you select in a configured time interval (default: 5 minutes) or a specific time, forcing your containers to stay alive.

##### Installing the WarmUP plugin

Install via npm in the root of your Serverless service:
```
npm install serverless-plugin-warmup --save-dev
```

Add the plugin to the `plugins` array in your Serverless `serverless.yml`:

```yml
plugins:
  - serverless-plugin-warmup
```

Add `warmup: true` property to all functions you want to be warm:

```yml
functions:
  hello:
    warmup: true
```

In order for WarmUP to be able to `invoke` lambdas, you'll also need to set the following Policy Statement in `iamRoleStatements`:

```yaml
iamRoleStatements:
  - Effect: 'Allow'
    Action:
      - 'lambda:InvokeFunction'
    Resource: "*"
```

Add an early callback call when the event source is `serverless-plugin-warmup`. You should do this early exit before running your code logic, it will save your execution duration and cost.

```javascript
module.exports.lambdaToWarm = function(event, context, callback) {
  /** Immediate response for WarmUP plugin */
  if (event.source === 'serverless-plugin-warmup') {
    console.log('WarmUP - Lambda is warm!')
    return callback(null, 'Lambda is warm!')
  }

  ... add lambda logic after
}
```

Perfect! Now all of your Lambdas are hot, and you have less to worry about.

You can find more info [here](https://github.com/FidelLimited/serverless-plugin-warmup#options) about options, event source and estimated cost.

#### Additional provider support?

I only work with AWS, so adding support for other providers is a welcome contribution!

For more on how to contribute to the Serverless Framework open source project, check this post:
- [How to contribute to Serverless open source projects](https://serverless.com/blog/how-contribute-to-serverless-open-source/)
