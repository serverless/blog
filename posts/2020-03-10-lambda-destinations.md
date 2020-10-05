---
title: AWS Lambda Destination Support
description: "The Serverless Framework now supports the recently released Lambda Event Destinations."
date: 2020-03-10
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-03-10-lambda-destinations/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-03-10-lambda-destinations/header.png"
authors:
  - FernandoMedinaCorey
category:
  - guides-and-tutorials
  - news
---

# What Are Lambda Destinations?

We first [wrote about](https://serverless.com/blog/november-2019-lambda-releases/) Lambda Destinations when AWS announced support for them right before re:Invent 2019.

Essentially, destinations are the ability for asynchronous Lambda invocations to have their execution results sent to other AWS services without needing to wait for the Lambda execution to finish. Previously, you would have to wait for a Lambda success or failure or need to leverage something like Step Functions. Now, you can invoke functions asynchronously, and send the results of the invocations to different places depending on success or failure.

Today, we're excited to announce support for Lambda Destinations in the Serverless Framework! Make sure you've [upgraded to](https://serverless.com/framework/docs/getting-started/) `v1.66.0` or higher and let's look at how to add them.

You can watch the video below for an abbreviated version or work through the entire guide!

<iframe width="560" height="315" src="https://www.youtube.com/embed/8KBLzRi76Tc" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# Adding Lambda Destinations

The first step to adding Lambda destinations is to decide what resources you would like to use as a destination on a success or failure. Currently, event destinations can be configured as another Lambda function, an SNS topic, SQS queue, or Amazon EventBridge. You can either create these resources in your `serverless.yml` file or you can reference already-existing resource ARNs. 

Inside of `serverless.yml`, you'll add a `destinations` section to a function that you want to configure Event destinations with:

```yaml
functions:
  helloStarting:
    handler: handler.starting
    destinations:
      onSuccess: someOtherFunction
      onFailure: arn:of:some:existing:resource
```

Inside of the `destinations` configuration you can add either an `onSuccess` or `onFailure` or both. The value for those bits of configuration can either be another function defined in the same `serverless.yml` file or an ARN of the destination resource.

Now let's look at a few configuration examples. You can find full-fledged example services of the below snippets on [GitHub here](https://github.com/fernando-mc/serverless-event-destinations).

## Function Event Destinations from the Same Service

One of the easiest ways to configure event destinations with your Lambda functions is to refer to other Lambda functions that you're already creating in your service in the same `serverless.yml` file. For example, in the below snippet, the functions section creates a `helloStarting` function that then uses the `helloSuccess` and `helloFailure` functions as destinations:

```yaml
functions:
  helloStarting:
    handler: handler.starting
    destinations:
      onSuccess: helloSuccess
      onFailure: helloFailure
  helloSuccess:
    handler: success.handler
  helloFailure:
    handler: failure.handler
```

This configuration has the benefit of creating a per-stage destination automatically as you deploy your service across stages like `dev` and `prod`. 

## ARN-based Destinations

If you already have existing resources for your event destinations, you can also reference them using the ARN value of those destinations. For example:

```yaml
functions:
  helloStarting:
    handler: handler.starting
    destinations:
      onSuccess: arn:aws:sqs:us-east-1:444455556666:successQueue
      onFailure: arn:aws:lambda:us-east-1:444455556666:function:failureFunction
```

In the above example, we've already created an SQS queue called `successQueue` and a Lambda Function called `failureFunction` and we've configured our function to deliver success and failure event to each of them, respectively. 

There is one potential issue with this sort of configuration though. You may not want to send success and failure notifications for every application stage to the same place. Let's take a look at at least one way of fixing this.

## Stage-based Destinations

If you want separate destinations depending on the stage of your service you can use a few different methods to accomplish this. 

### Framework Pro Parameters

One of the simplest ways to accomplish this would be to leverage [Framework Pro Parameters](https://serverless.com/framework/docs/dashboard/parameters/) and load them in at deployment time:

```yaml
org: fernando
app: destinations
service: stage-based-destinations-framework-pro

provider:
  name: aws
  runtime: python3.8

functions:
  helloStarting:
    handler: handler.starting
    destinations:
      onSuccess: ${params:SUCCESS_ARN}
      onFailure: ${params:FAILURE_ARN}
```

This way, the framework will load the relevant parameter at deployment time from [Framework Pro](https://app.serverless.com/).

### Stage Variables in Event Destinations

You can also forego Framework Pro and create destinations resources with the stage as part of their name. For example, a destination queue for success messages in the `dev` stage might become `successQueue-dev` and in prod `successQueue-prod`. Then, you can create the final ARN at deployment time based on the stage:

```yaml
provider:
  name: aws
  runtime: python3.8
  stage: ${opt:stage, 'dev'}

functions:
  helloStarting:
    handler: handler.starting
    destinations:
      onSuccess: arn:aws:sqs:us-east-1:444455556666:successQueue-${self:provider.stage}
      onFailure: arn:aws:sns:us-east-1:444455556666:failureTopic-${self:provider.stage}
```

This sort of configuration assumes you've already created all the resources required to configure with the destinations.

## Testing the Destinations

So how would we test one of these examples? 

First, clone the examples repo from GitHub [here](https://github.com/fernando-mc/serverless-event-destinations). There are several examples in that repo, but change directories into the `arn-based-event-destinations` and we'll go from there.

First, we can create a single SQS queue for failure and success events to end up in.

1. Run `aws sqs create-queue --queue-name destinationQueue` to create a queue
2. Then, copy the output queue url into the following command to get the QueueArn:
    ```
    aws sqs get-queue-attributes \
    --queue-url <the-queue-url> \
    --attribute-names QueueArn```
    ```

Now that we have the ARN value, replace the existing `onSuccess` and `onFailure` ARNs inside of the `serverless.yml` file. You should end up with something like this:

```yaml
service: arn-based-destinations

provider:
  name: aws
  runtime: python3.8

functions:
  helloStarting:
    handler: handler.starting
    destinations:
      onSuccess: arn:aws:sqs:us-east-1:123456777888:successQueueDemo
      onFailure: arn:aws:sqs:us-east-1:123456777888:successQueueDemo
```

From here, we can run `serverless deploy` to set everything up. When the deployment is finished, we can invoke our function with events that will cause the function to succeed and fail and then review the results in the SQS queue.

Run this a few times to create a few successful events:

```bash
aws lambda invoke --function-name arn-based-destinations-dev-helloStarting --invocation-type Event --payload '{ "Success": true }' response.json
```

Then, you can run this one a few times to cause some failures:

```bash
aws lambda invoke --function-name arn-based-destinations-dev-helloStarting --invocation-type Event --payload '{ "Success": false }' response.json
```

If you've changed the service or the function name before you deployed you'll need to make sure to update the `--function-name` value in the commands.

When you're done, you can review the results in the queue you created.You'll need to replace `<queueUrl>` with your queue URL in the following command:

```bash
aws sqs receive-message --queue-url <queueUrl> --attribute-names All --message-attribute-names All --max-number-of-messages 10
```

If you need the url, you can always run the `aws sqs list-queues` command. 
It might take a moment for the messages to make their way to the SQS queue, but when they are there you should see something like this:

```
{
    "Messages": [
        {
            "MessageId": "169e1a5a-7200-4df9-9cf2-46fbde04af79",
            "ReceiptHandle": "AQEBFnz9cRqIrl2XGFilWVyBXSUlA3mHYvwzsk5Yi1781G9txOpxLTpadribqYKs3DBi0DBL3skv5wRfVJKCQxVCoZ6Lh7Bd/qBBjyg359qc5910HPy07wbWhAYbaE6S2ZhHAsIjmiBf9cfk7/yu8IhFvstVlycYCZ0BM7Ca6DN29O0mN5PHBSdEsA4dLZ172irtzAM9jOc8n9vS3lBfvfCbRjpMJylPTMoMdlE/uvB8RpJC4FkXtLwxHRP+d0WvbO0VsMt+z/dgJk5z0ORfmZlu94RpIHZ4+PoyLja35e43eAGGjHyqRQCpCIROrI2c3tvjRkUknFHTFtYqvGFs4Jj7OVHJ2D9riDHDLBhVjvGDCzMbSHWdnyOqVeojIyarh6nFKJb/iXE6hrTX3zNslE/kDQ==",
            "MD5OfBody": "332ed48526ab22a68a161b100f83a4bc",
            "Body": "{\"version\":\"1.0\",\"timestamp\":\"2020-03-09T22:01:53.075Z\",\"requestContext\":{\"requestId\":\"cabbfbd0-e266-42a9-a52e-6e96eb16c695\",\"functionArn\":\"arn:aws:lambda:us-east-1:757370802528:function:arn-based-destinations-dev-helloStarting:$LATEST\",\"condition\":\"RetriesExhausted\",\"approximateInvokeCount\":3},\"requestPayload\":{ \"Success\": true },\"responseContext\":{\"statusCode\":200,\"executedVersion\":\"$LATEST\",\"functionError\":\"Unhandled\"},\"responsePayload\":{\"errorMessage\": \"name 'body' is not defined\", \"errorType\": \"NameError\", \"stackTrace\": [\"  File \\\"/var/task/handler.py\\\", line 8, in starting\\n    \\\"body\\\": json.dumps(body)\\n\"]}}",
            "Attributes": {
                "SenderId": "AROA3AVWRKFQPTOBYHBI4:awslambda_212_20200309184354940",
                "ApproximateFirstReceiveTimestamp": "1583791332207",
                "ApproximateReceiveCount": "1",
                "SentTimestamp": "1583791313178"
            }
        }
    ]
}
```

And that's it! You've successfully configured and tested your Event Destinations.

## Now What?

Now that you've configured your first event destination you can use them to save yourself from architectures that have to wait for Lambda Functions to finish their invocation and then return a response. This means you can avoid situations where one function is doing nothing, and waiting for the service or function it called to respond. Instead, you can use Event Destinations to process any successes or failures appropriately once the Lambda Function has done it's job.

If you didn't have enough fun with the example above, or the [other examples in GitHub](https://github.com/fernando-mc/serverless-event-destinations), there are also plenty of other ways to configure Event Destination resources! You can:

1. Store ARN values in SSM and pull them in with the SSM variable syntax: `${ssm:paramName}`
2. Reference ARN outputs from other services with [Framework Pro Outputs](https://serverless.com/framework/docs/dashboard/output-variables/) and the outputs variable syntax: `${output:my-service.myOutputKey}`

We hope this helps you get started with Event Destinations in the Serverless Framework! Have questions about Event Destinations? [Get in touch](https://twitter.com/fmc_sea) or leave a comment below!
