---
title: "New Lambda Features - Pre-re:Invent - Nov. 2019"
description: "AWS recently announced several new features for Lambda that you might want to take advantage of."
date: 2019-11-26
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-11-lambda-releases/lambda-updates-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-11-lambda-releases/lambda-updates-header.png"
category:
  - news
authors:
  - FernandoMedinaCorey
---

## Lambda Updates Galore!

The AWS Lambda team has been busy sneaking in a bunch of updates before re:Invent this year. White I [recently wrote](https://serverless.com/blog/aws-lambda-supported-languages-and-runtimes/) about all the new runtimes that Lambda now supports, they've also added several substantial new features that allow sending asynchronous Lambda results along to a destination, having SQS FIFO queues as a Lambda event trigger, and providing greater control over how we interact with DynamoDB and Kinesis streams. Let's take a look at the pre-re:Invent Lambda feature announcements as of Nov 26, 2019.

## AWS Lambda Destinations and Asynchronous Invocation Improvements

AWS [just recently](https://aws.amazon.com/blogs/compute/introducing-aws-lambda-destinations/) announced the ability to have destinations for asynchronous invocations. This feature allows asynchronous Lambda functions to have their execution results sent to other AWS services like SNS, SQS, EventBridge and other Lambda Functions without having to wait around for the result to finish. So how exactly would this work and why does it matter?

Imagine you want to be able to submit some tasks or jobs without having to wait to see if they succeed or fail, but you still want to be able to have some logic around what happens depending on how they go. Well, previously your best bet was either to orchestrate all that logic together in a single Lambda function or to use something like [Step Functions](https://aws.amazon.com/step-functions/). But now, AWS Lambda Event Destinations give you an arguably cleaner way to pull this off.

When you invoke a function asynchronously you will rapidly retrieve a success or failure result to the caller. That *initial* success or failure indicates if the AWS Lambda function was successfully queued up and will almost always be a success. However, the actual *result* of that function might be something you want to handle and do something with. This is where event destinations come in:

On success, you could send the results from an asynchronous Lambda to a downstream Lambda function to start another process, queue the results in SQS for some other worker, use SNS to create a fan-out style architecture, or send the results to EventBridge. All of these destinations add significant flexibility to how data flows through your architecture. 

On failure, destinations are also designed as a "more preferred solution" to SQS Dead Letter Queues (DLQs) because they offer additional function execution information like stack traces and can send to other destinations outside of SQS. In combination with [newly released features](https://aws.amazon.com/about-aws/whats-new/2019/11/aws-lambda-supports-max-retry-attempts-event-age-asynchronous-invocations/) that offer control over the maximum number of retries and the maximum event age for asynchronous Lambda functions this adds a lot of flexibility for error handling.

**So Why Does This Matter?**

Considering the relative expensiveness of services like Step Functions, Event Destinations seems to be an excellent way to reduce both the complexity and cost of your serverless applications. It should allow you to nuanced workflows that were previously reserved for folks who were either willing to write that nuance into custom Lambda Functions, or who were willing to pay for and create Step Function workflows. That's not to say Step Functions has no place, it is still a great tool to visualize and manage complex workflows, but for more simple architectural needs Event Destinations seem like a great fit.

## SQS First-In-First-Out (FIFO) Queues

AWS has supported SQS standard queues as Lambda event sources for some time now, but they recently [added support](https://aws.amazon.com/about-aws/whats-new/2019/11/aws-lambda-supports-amazon-sqs-fifo-event-source/) for First-in-first-out or FIFO queues. This means you can now have your SQS FIFO queues process data inside them in the same order that it went into those queues. 

**So Why Does This Matter?**

In combination with the AWS Lambda Destinations, and the new support for configuring maximum retries and maximum event age this should start to provide powerful new ways to process data in or out of sequence with effective retry and failure logic. This can be critical in applications like auctions or ticket sales applications that need to review queued tasks sequentially in order to ensure that the system doesn't inadvertently produce some sort of conflict like overselling tickets or incorrectly processing bids.

## Improvements to Lambda Stream Interactions

A very common Lambda use case is to process DynamoDB Streams or Amazon Kinesis Streams. Because of this, they've recently added more support for different ways of handling how Lambda functions processes these event sources.

### Stream Failure Handling

AWS has just released new ways to handle failures when processing a stream. Previously, Lambda would try to process all the records in a batch and if it failed it would stop processing the data, return an error, and retry the entire batch of records until they are successfully proceed or they expire. Now, AWS is offering us several new methods of dealing with streams.

1. Bisect on Function Error - When enabled, you can break the failed batch of records into two chunks and retry them separately. This will allow you to isolate where the bad data is and process the rest of the data successfully.
2. Maximum Record Age - You can have your Lambda Function skip processing data records that are too old by using a a Maximum Record Age property between 60 seconds and 7 days.
3. Maximum Retry Attempts - You can set another configuration property to specify how many times you actual want to retry processing - anywhere from 0 to 10,000 retries. I will admit, I am very curious about the application that succeeds only on the 9,999th attempt. 

### Parallelization Factors

Additionally, for both DynamoDB and Kinesis Streams you can use a new "parallelization factor" that allows you to process DynamoDB and Kinesis shards with more than one concurrent Lambda function at a time. This can be very useful when data volumes are larger or processing records takes time. The parallelization factor can be set from 1 to 10 and is used to calculate the number of concurrent Lambda invocations allowed by multiplying the number of data shards. So, for a Kinesis stream with 50 shards and a parallelization factor of 4 you can use (50 * 4) or 200 concurrent Lambda invocations to process the data.

**So Why Does This Matter?**

Instead of writing your own complex error handling and retry logic to process common Lambda stream sources, you can start to incorporate AWS's new provided settings to do many of the same things. When combined with the new Event Destinations and improvements to handling asynchronous Lambda invocations results this will offer you a lot more flexibility in your Lambda workflows without having to write a bunch of custom data processing logic. Additionally, the new support for the parallelization factor means that you can significantly scale up the processing power for your streams without having to do something expensive like dramatically increasing the number of Kinesis Streams Shards.

### What's Next?

With all these announcements happening before re:Invent, I can't wait to see what happens during the conference itself! Keep your eyes out for these AWS Lambda features making their way into the Serverless Framework soon!

Are you attending re:Invent 2019? Want to get in touch with us? Sign up for our [Happy Hour](https://www.eventbrite.com/e/serverless-happy-hour-at-reinvent-2019-tickets-78086612159)!