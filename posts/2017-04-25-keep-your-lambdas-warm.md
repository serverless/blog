---
title: Keeping Functions Warm - How To Fix AWS Lambda Cold Start Issues
description: Learn how to prevent cold start in your Lambda functions with the Serverless WarmUp plugin.
date: 2017-04-25
thumbnail: https://cloud.githubusercontent.com/assets/20538501/25389822/3defba8c-2997-11e7-983a-f45c257ac59b.png
layout: Post
authors:
  - GoncaloNeves
---

# Introduction

*Cold start in computing = duration of time it takes to boot a system* 

In this blog post we'll tackle this issue with AWS Lambda + Serverless.

## Cold Start in Serverless ❄️ *- problem*

The *Function-as-a-Servive (FaaS)* paradigm allows developers to do more than ever with less resources. Unfortunately, cold start can be an issue.

**What is cold start in Serverless?**

Cold start happens when you execute an inactive *(cold)* function for the first time. It occurs while your cloud provider provisions your selected runtime container and then runs your function. This process, referred to as *cold start*, will increase your execution time considerably.

While you're actually running your function it will stay active *(hot)*, meaning your container stays alive - ready and waiting for execution. But eventually after a period of inactivity, your cloud provider will drop the container and your function will become *cold* again. 

**Where are the bottlenecks and when?**

Knowing your service performance bottleneck is essential. Which functions are slowing down and when? From small to big services, it's common to find one function that slows down your service logic because it doesn't run as often as needed to keep its container alive.

One of our cold functions was the reset email service during off-peak hours. It took on average more than double the amount of time to get the reset password email from UTC+1 23:00 to UTC+1 06:00 (London).

**Understanding AWS cold starts:**

When using AWS Lambda, provisioning of your function's container can take >5 seconds. That makes it impossible to guarantee <1 second responses to events such as API Gateway, DynamoDB, CloudWatch, S3, etc.

[This analysis of AWS Lambda + private VPC container initialization times](https://robertvojta.com/aws-journey-api-gateway-lambda-vpc-performance-452c6932093b) concluded:
- Run-times and memory size don't affect container initialization time
- Lambda within a private VPC increases container initialization time
- Containers are not reused after ~15 minutes of inactivity

## Make them warm ♨ *- solution*

To solve this problem in a couple of *cold* Lambdas [@Fidel](https://fidel.uk) I wrote a plugin called [serverless-plugin-warmup](https://github.com/FidelLimited/serverless-plugin-warmup) that allows you to keep all your Lambdas hot.

WarmUP does this by creating one scheduled event Lambda that invokes all the Lambdas you select in a configured time interval (default: 5 minutes) or a specific time, forcing your containers to stay alive. 

## WarmUP Plugin *- installation*

 Install via npm in the root of your Serverless service:
```
npm install serverless-plugin-warmup --save-dev
```

* Add the plugin to the `plugins` array in your Serverless `serverless.yml`:

```yml
plugins:
  - serverless-plugin-warmup
```

* Add `warmup: true` property to all functions you want to be warm:

```yml
functions:
  hello:
    warmup: true
```

* WarmUP to be able to `invoke` lambdas requires the following Policy Statement in `iamRoleStatements`:

```yaml
iamRoleStatements:
  - Effect: 'Allow'
    Action:
      - 'lambda:InvokeFunction'
    Resource: "*"
```

* Add an early callback call when the event source is `serverless-plugin-warmup`. You should do this early exit before running your code logic, it will save your execution duration and cost.

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

## Provider support *- future*

I only work with AWS, so adding support for other providers is a welcome contribution! 
