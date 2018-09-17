---
title: Using SQS with AWS Lambda and Serverless
description: Get started with Simple Queue Service (SQS) and Serverless, and learn some of the important configuration options.
date: 2018-07-11
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-sqs-events.jpg'
category:
  - guides-and-tutorials
  - operations-and-observability
heroImage: ''
authors:
  - AlexDeBrie
---

At long last, the wait is over. AWS recently announced that [Simple Queue Service (SQS) is available as a Lambda event source](https://aws.amazon.com/blogs/aws/aws-lambda-adds-amazon-simple-queue-service-to-supported-event-sources/). This has been a highly-requested feature for a while, and the AWS team took the time to make sure it was implemented correctly.

#### Why the fuss about SQS?

In my opinion, SQS is the third leg in a trifecta of core integrations for Lambda. The first leg was [API Gateway](https://serverless.com/framework/docs/providers/aws/events/apigateway/), which allowed developers to quickly deploy REST APIs and other HTTP-accessible business logic. The second leg was [S3 triggers](https://serverless.com/framework/docs/providers/aws/events/s3/), which let you asynchronously process data blobs, whether it be log file processing or the canonical example of creating image thumbnails. The third and final leg is message processing via SQS, allowing you to offload tasks that are time- or resource-intensive into a background process for a faster, more resilient system.

The SQS integration is also a great on-ramp for users looking to test the waters with Lambda and Serverless. If you manage a fleet of EC2 worker instances that are processing from SQS queues, porting that logic to Lambda should be pretty straight-forward. Quit thinking about auto-scaling, resource utilization, and reserved instances and get back to focusing on your business logic.

##### What we'll cover in this post

In this post, I'll cover a few practical notes about working with SQS and Lambda. In particular, this post discusses:

* [Using SQS with the Serverless Framework](#using-sqs-with-the-serverless-framework). Go here if you just want the TL;DR version.
* [Batch Size and Error Handling with the SQS integration](#batch-size-and-error-handling-with-the-sqs-integration).
* [Protecting your downstream services with concurrency control](#protecting-your-downstream-services-with-concurrency-control).

Let's dig in!

#### Using SQS with the Serverless Framework

As of the [v1.28 release of the Serverless Framework](https://serverless.com/blog/serverless-updates-framework-v128/), SQS is a supported event source! Using the SQS integration is pretty straightforward. You'll register an event of type `sqs` and provide the ARN of your SQS queue:

```yml
# serverless.yml

service: sqs

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello
    events:
    	# Provide the ARN of your queue
      - sqs: arn:aws:sqs:us-east-1:123456789012:queue1
```

Note that the queue must exist—the Framework will not create it for you. If you want to create the SQS queue within your service, you can do that in the [resources](https://serverless.com/framework/docs/providers/aws/guide/resources/) block of your `serverless.yml`. You can then reference that resource in your `sqs` event as follows:

```yml
# serverless.yml

service: sqs

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello
    events:
      - sqs:
          arn:
            Fn::GetAtt:
              - MyQueue
              - Arn

resources:
  Resources:
    MyQueue:
      Type: "AWS::SQS::Queue"
      Properties:
        QueueName: "MyQueue"
```

Here, we've created an SQS queue called "MyQueue", and we've referenced it in our `sqs` event for the `hello` function.

#### Batch Size and Error Handling with the SQS integration

When setting up the SQS event integration, you may configure a `batchSize` property. This specifies the _maximum_ number of SQS messages that AWS will send to your Lambda function on a single trigger. This is an interesting and powerful property, but you need to be careful to make sure it's properly tuned to fit your needs.

Sending batches of messages into a single invocation can reduce your costs and speed up your processing of messages. If your Lambda function needs to do a costly operation each time it spins up, such as initializing a database connection or downloading a dataset to enrich your messages, you can save time by processing multiple messages in a single batch. You're effectively amortizing that costly operation over a larger number of messages, rather than paying the cost for each message that comes through.

However, you need to understand how batches work with the SQS integration. SQS is a traditional messaging system. Messages are placed into a queue for processing. A worker will read a message off a queue and work it. If the work is successful, the worker will remove the message from the queue and retrieve a new message for processing.

With the SQS / Lambda integration, **a batch of messages succeeds or fails together**. This is an important point. Let's say you have your `batchSize` set to 10 messages, which is the default. If your function is invoked with 10 messages, and your function returns an error while processing the 7th message, *all 10 messages will remain in the queue to be processed by a different Lambda function*. AWS will only delete the messages from the queue if your function returned successfully without any errors.

If it's possible that one of your messages could fail with others succeed, you need to plan for resiliency in your architecture. You could handle this a few different ways, including:

* Using a `batchSize` of 1, so that messages succeed or fail on their own.
* Making sure your processing is [idempotent](https://en.wikipedia.org/wiki/Idempotence), so reprocessing a message isn't harmful, outside of the extra processing cost.
* Handle errors within your function code, perhaps by catching them and sending the message to a dead letter queue for further processing.
* Calling the DeleteMessage API manually within your function after successfully processing a message.

The approach you choose depends on the needs of your architecture.

#### Protecting your downstream services with concurrency control

One of the common architectural reasons for using a queue is to limit the pressure on a different part of your architecture. This could mean preventing overloading a database or avoiding rate-limits on a third-party API when processing a large batch of messages.

The combination of Lambda's auto-scaling nature plus a large volume of messages in your SQS queue could lead to some serious issues with your downstream services. This is where Lambda's [concurrency controls](https://aws.amazon.com/about-aws/whats-new/2017/11/set-concurrency-limits-on-individual-aws-lambda-functions/) are useful. With concurrency controls, you can specify the *maximum* number of instances of a function you have running at a particular time.

For example, imagine your SQS processing logic needs to connect to a database, and you want to limit your workers to have no more than 10 open connections to your database at a time. Without concurrency control, a large new batch of messages could easily overwhelm your database. With concurrency control, you can set proper limits to keep your architecture up.

With the Serverless Framework, you can set concurrency control with the `reservedConcurrency` property on a particular function. For our example above, we could limit our function to no more than 10 concurrent invocation as follows:

```yml
# serverless.yml

functions:
  hello:
    handler: handler.hello
    reservedConcurrency: 10 <-- Concurrency control
    events:
    	# Provide the ARN of your queue
      - sqs: arn:aws:sqs:us-east-1:123456789012:queue1
```

My guess is that concurrency controls were implemented in part to allow for the SQS integration. Without the controls, it's too easy to overwhelm your system when 1000 messages drop at one time.

#### Conclusion

SQS integration adds a huge missing piece to the Serverless story, and we're excited to see how you use it in your architecture. We expect this to be one of the more popular integrations in the Serverless ecosystem!
