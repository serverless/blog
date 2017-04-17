---
title: Get your Lambdas Warm
description: How to make your cold lambdas hot with WarmUP plugin
date: 2017-04-17
layout: Post
authors:
  - GoncaloNeves
---

# Let's make your lambdas warm

*Cold start in computing = duration of time that takes to boot a system*

In this blog post we tackle this issue with AWS Lambda + Serverless.

## Cold start in Serverless ❄️ *- problem*

Now more than ever with *Function as a Service (FaaS)* cold start is an issue that is detrimental to this huge step forward in the developer world.

From small to big services, it is common to find one function that slows down your service logic because it doesn't run as often needed to keep its container alive. When using AWS Lambda, provisioning of your function container can take >5 seconds. Making it impossible to guarantee <1 second responses to events such as API Gateway, DynamoDB, CloudWatch, S3, etc. [Benchmarks](https://robertvojta.com/aws-journey-api-gateway-lambda-vpc-performance-452c6932093b) have been done to analyse in more detail AWS Lambda + VPC container initialisation times. Benchmark conclusion:
- Run-times and memory size size don't affect container initialisation time
- Lambda with VPC increase container initialisation time
- Containers are not reused after ~15minutes of inactivity

## Make them warm ♨ *- solution*

To solve this problem in a couple of *cold* functions [@Fidel](https://fidel.uk) I wrote a plugin called [serverless-plugin-warmup](https://github.com/FidelLimited/serverless-plugin-warmup) that allows us to keep all our lambdas hot.

WarmUP does this by creating one schedule event lambda that invokes all the lambdas you select in a configured time interval (default: 5 mins), forcing your containers to stay alive. 

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

* Add an early response to warm lambdas to quickly respond to WarmUP. This avoids errors, reduces duration and cost:

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

Perfect! Now you will have all your lambdas hot and less to worry about. 

You can read more information [here](https://github.com/FidelLimited/serverless-plugin-warmup#options) about options, event source and cost. 

## Provider support *- future*

I only work with AWS so adding support to other providers it is a welcome contribution.  
