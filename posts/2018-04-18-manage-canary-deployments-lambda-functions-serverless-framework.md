---
title: "How to manage canary deployments on Lambda via the Serverless Framework"
description: "Never again fear breaking your Serverless application due to integration issues."
date: 2018-04-18
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/canary-deployments.jpg'
category:
  - guides-and-tutorials
  - operations-and-observability
authors:
  - DavidGarcia
---

When we update Lambda functions in serverless applications, we take a lot of precautions.

We build tests to be confident that we are not introducing bugs or breaking anything. We publish the update in different stages to check how it behaves in the cloud.

And still, a tingling runs down our spines every time we release to production. We are never 100% sure that we won't bump into an integration error, or that we didn't overlook any edge cases.

If that sounds like you, then fear no more! The [Canary Deployments Plugin](https://github.com/davidgf/serverless-plugin-canary-deployments) is your safety net.

I built this plugin for the Serverless Framework to let you manage canary deployments with ease. Below, I'll dive into how the plugin works and show you an example of the Canary Deployments Plugin in action.

Ready? Awesome.

## Background: Lambda Weighted Aliases + CodeDeploy = Peace of mind

The AWS team recently introduced [traffic shifting for Lambda function aliases](https://docs.aws.amazon.com/lambda/latest/dg/lambda-traffic-shifting-using-aliases.html), which basically means that we can now split the traffic of our functions between two different versions. We just have to specify the percentage of incoming traffic we want to direct to the new release, and Lambda will automatically load balance requests between versions when we invoke the alias.

So, instead of completely replacing our function for another version, we could take a more conservative approach making the new code coexist with the old stable one and checking how it performs.

All this sounds great, but let's be honest, changing aliases weights and checking how new functions behave by ourselves is not going to make our lives easier. Fortunately, AWS has the service we need: CodeDeploy.

[CodeDeploy](https://docs.aws.amazon.com/codedeploy/latest/userguide/welcome.html) is capable of automatically updating our functions' aliases weights according to our preferences. Even better, it will also roll back automatically if it notices that something goes wrong.

Basically, our Lambda function deployments will be on autopilot.

### Canary deployments: before and after

Now let's say we wanted to implement all this Weighted Alias + CodeDeploy stuff into our serverless application. To do this, we'd need to create some AWS resources.

We'd need to first create a CodeDeploy application, a DeploymentGroup and an Alias for each function, plus some new permissions here and there, then replace all the event sources to trigger the aliases instead of `$Latest`...—yeah. Not actually that straightforward.

But that was then, and this is now.

Now, the [Canary Deployments Plugin](https://github.com/davidgf/serverless-plugin-canary-deployments) takes care of all those things for you! It makes gradual deployments simply a matter of configuration.

## Integrating canary deployments into your serverless app

In the next sections, we'll walk through the different options we can configure with the Canary Deployments Plugin.

### Setting up the environment

We'll create a simple Serverless service with one function exposed through API Gateway, making sure that we install the plugin.

Our `serverless.yml` should look like this:

```yaml
service: sls-canary-example

provider:
  name: aws
  runtime: nodejs6.10

plugins:
  - serverless-plugin-canary-deployments

functions:
  hello:
    handler: handler.hello
    events:
      - http: get hello
```

Our function will simply return a message:

```javascript
module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: 'Go Serverless v1.0! Your function executed successfully!'
  };

  callback(null, response);
};
```

Which we should get by calling the endpoint after deploying our service:

```shell
$ curl https://your-api-gateway-endpoint.com/dev/hello
Go Serverless v1.0! Your function executed successfully!
```

### Deploying the function gradually

This is where the fun starts. We'll tell the plugin to split the traffic between the last two versions of our function during the next deploy, and gradually shift more traffic to the new one until it receives all the load.

There are three different fashions of gradual deployments:

* **Canary**: a specific amount of traffic is shifted to the new version during a certain period of time. When that time elapses, all the traffic goes to the new version.
* **Linear**: traffic is shifted to the new version incrementally in intervals until it gets all of it.
* **All-at-once**: the least gradual of all of them, all the traffic is shifted to the new version straight away.

All we need now is to specify the parameters and type of deployment, by choosing any of the [CodeDeploy's deployment preference presets](https://docs.aws.amazon.com/lambda/latest/dg/automating-updates-to-serverless-apps.html): `Canary10Percent30Minutes`, `Canary10Percent5Minutes`, `Canary10Percent10Minutes`, `Canary10Percent15Minutes`, `Linear10PercentEvery10Minutes`, `Linear10PercentEvery1Minute`, `Linear10PercentEvery2Minutes`, `Linear10PercentEvery3Minutes` or `AllAtOnce`.

We'll pick `Linear10PercentEvery1Minute`, so that the new version of our function gets is incremented by 10% every minute, until it reaches 100%. For that, we only have to set `type` and `alias` (the name of the alias we want to create) under `deploymentSettings` in our function:

```yaml
service: sls-canary-example

provider:
  name: aws
  runtime: nodejs6.10

plugins:
  - serverless-plugin-canary-deployments

functions:
  hello:
    handler: handler.hello
    events:
      - http: get hello
    deploymentSettings:
      type: Linear10PercentEvery1Minute
      alias: Live
```

If we now update and deploy the function:

```javascript
module.exports.hello = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: 'Wait, it is Serverless v1.26.11!'
  };

  callback(null, response);
};
```

We'll notice that the requests are being load balanced between the two latest versions:

```shell
$ curl https://your-api-gateway-endpoint.com/dev/hello
Go Serverless v1.0! Your function executed successfully!
$ curl https://your-api-gateway-endpoint.com/dev/hello
Wait, it is Serverless v1.26.11!
```

### Making sure you don't break anything

Now our function is not deployed in a single flip, woohoo!

*But*, if we have to ensure that the whole system is behaving correctly by ourselves, we didn't really achieve anything impressive, did we? We can add another AWS service to the mix to avoid this: CloudWatch Alarms

**Note:** read more on this in our [CloudWatch alarms post](https://serverless.com/blog/serverless-ops-metrics/).

We can provide CodeDeploy with a list of alarms to track during the deployment process, then cancel it and shift all the traffic to the old version if any of them turns into the `ALARM` state.

In this example, we'll monitor that our function doesn't have any invocation error. We'll be using [A Cloud Guru's Alerts Plugin](https://github.com/ACloudGuru/serverless-plugin-aws-alerts) for this:

```yaml
service: sls-canary-example

provider:
  name: aws
  runtime: nodejs6.10

plugins:
  - serverless-plugin-aws-alerts
  - serverless-plugin-canary-deployments

custom:
  alerts:
    dashboards: true

functions:
  hello:
    handler: handler.hello
    events:
      - http: get hello
    alarms:
      - name: foo
        namespace: 'AWS/Lambda'
        metric: Errors
        threshold: 1
        statistic: Minimum
        period: 60
        evaluationPeriods: 1
        comparisonOperator: GreaterThanOrEqualToThreshold
    deploymentSettings:
      type: Linear10PercentEvery1Minute
      alias: Live
      alarms:
        - HelloFooAlarm
```

The Canary Deployments plugin expects the logical ID of the CloudWatch alarms, which the Alerts plugin builds by concatenating the function name, the alarm name and the string "Alarm" in Pascal case.

### End-to-end testing

By gradually deploying our function and being able to track CloudWatch metrics, we have all the tools we need to minimize the impact of a potential bug in our code. However, we could even avoid invoking a function version with errors by running CodeDeploy Hooks first.

Hooks are simply Lambda functions triggered by CodeDeploy before and after traffic shifting takes place. It expects to get notified about the success or failure of the hook, only continuing to the next step if it succeeded. They are perfect for running end-to-end or integration tests and checking that all the pieces fit together in the cloud, since it'll automatically roll back upon failure.

This is how we can configure hooks:

```yaml
service: sls-canary-example

provider:
  name: aws
  runtime: nodejs6.10
  iamRoleStatements:
    - Effect: Allow
      Action:
        - codedeploy:*
      Resource:
        - "*"

plugins:
  - serverless-plugin-aws-alerts
  - serverless-plugin-canary-deployments

custom:
  alerts:
    dashboards: true

functions:
  hello:
    handler: handler.hello
    events:
      - http: get hello
    alarms:
      - name: foo
        namespace: 'AWS/Lambda'
        metric: Errors
        threshold: 1
        statistic: Minimum
        period: 60
        evaluationPeriods: 1
        comparisonOperator: GreaterThanOrEqualToThreshold
    deploymentSettings:
      type: Linear10PercentEvery1Minute
      alias: Live
      preTrafficHook: preHook
      postTrafficHook: postHook
      alarms:
        - HelloFooAlarm
  preHook:
    handler: hooks.pre
  postHook:
    handler: hooks.post
```

Notice that we need to grant our functions access to CodeDeploy, so that we can use [its SDK](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CodeDeploy.html) in the hooks.

It should look something like this:

```javascript
const aws = require('aws-sdk');
const codedeploy = new aws.CodeDeploy({apiVersion: '2014-10-06'});

module.exports.pre = (event, context, callback) => {
  var deploymentId = event.DeploymentId;
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

  console.log('We are running some integration tests before we start shifting traffic...');

  var params = {
      deploymentId: deploymentId,
      lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
      status: 'Succeeded' // status can be 'Succeeded' or 'Failed'
  };

  return codedeploy.putLifecycleEventHookExecutionStatus(params).promise()
    .then(data => callback(null, 'Validation test succeeded'))
    .catch(err => callback('Validation test failed'));
};

module.exports.post = (event, context, callback) => {
  var deploymentId = event.DeploymentId;
  var lifecycleEventHookExecutionId = event.LifecycleEventHookExecutionId;

  console.log('Check some stuff after traffic has been shifted...');

  var params = {
      deploymentId: deploymentId,
      lifecycleEventHookExecutionId: lifecycleEventHookExecutionId,
      status: 'Succeeded' // status can be 'Succeeded' or 'Failed'
  };

  return codedeploy.putLifecycleEventHookExecutionStatus(params).promise()
    .then(data => callback(null, 'Validation test succeeded'))
    .catch(err => callback('Validation test failed'));
};
```

Hooks are well-suited for running tests, but we could actually execute whatever else we need to happen before or after our function deployment too. We only have to keep in mind that we must notify CodeDeploy about the result of the hook; otherwise, it'll assume that it failed if it doesn't get any response within one hour.

**Protip:** we don't really need to notify CodeDeploy in the Lambda function hook. We could trigger a background job that runs anywhere else and report the result from there.

## Conclusion

CodeDeploy and Lambda Weighted Aliases take the deployment process of our Serverless functions to the next level.

They significantly reduce the chances of releasing buggy code, and react automatically if anything goes wrong. Instead of publishing a new function version that gets all the invokations straight away, the deployment goes through different stages:

1. The before traffic hook is executed.
2. Traffic is shifted gradually to the new version and the provided CloudWatch alarms are monitored, canceling and rolling back if any of them is triggered.
3. The after hook is executed.

All those stages are executed in order. If any of them fails, the deployment will be considered as failed and the whole system will roll back to the previous state.

You can get the code in the above example [here](https://github.com/davidgf/sls-canary-example), and if you're interested in the details of the underliying technology, check out [this post](https://hackernoon.com/canary-deployments-in-serverless-applications-b0f47fa9b409).

Happy safe deployments!
