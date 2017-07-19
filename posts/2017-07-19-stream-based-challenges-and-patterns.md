---
title: Challenges and patterns for building event-driven architectures
description: Learn some tips and tricks as you move to an event-driven architecture
date: 2017-07-19
layout: Post
thumbnail: https://user-images.githubusercontent.com/6509926/27362413-f40e4968-55f3-11e7-9c68-65dc1b06f335.jpg
authors:
  - AlexDeBrie
---


### Challenges with the Event-Driven Architecture

In my [previous post](https://serverless.com/blog/event-driven-architecture-dynamodb/), I talked about how you can use DynamoDB Streams to power an event-driven architecture. While this architecture has a number of benefits, it also has some "gotchas" to look out for. As you go down this road, you need to be aware of a few challenges with these patterns.

#### Changing Event Schemas

In our user creation example from the last post, we've been saving the user's first name and last name together in a single `fullname` field. Perhaps our developers later decide they'd rather have those as two separate fields, `firstname` and `lastname`. They update the user creation function and deploy. Everything is fine -- for them. But downstream, everything is breaking. Look at the code for the Algolia indexing function -- it implicitly assumes that the incoming Item will have a `fullname` field. When it goes to grab that field on a new Item, it will get a `KeyError` exception.

How do we handle these issues? There's no real silver bullet, but there are a few ways to address this both from the producer and consumer sides. As a producer, focus on being a polite producer. Treat your event schemas just like you would treat your REST API responses. See if you can make your events backward-compatible, in the sense of not removing or redefining existing fields. In the example above, perhaps the new event would write `firstname`, `lastname`, and `fullname`. This could give your downstream consumers time to switch to the new event format. If this is impossible or infeasible, you could notify your downstream consumers. The AWS CLI has a command for [listing event source mappings](http://docs.aws.amazon.com/cli/latest/reference/lambda/list-event-source-mappings.html), which shows which Lambda functions are triggered by a given DynamoDB stream. If you're a producer that's changing your Item structure, give a heads up to the owners of consuming functions.

As a consumer of streams, focus on being a resilient consumer. Consider the assumptions you're making in your function and how you should respond if those assumptions aren't satisfied. We'll discuss different failure handling strategies below, but you shouldn't just rely on producers to handle this for you. 

#### How to handle failure

Failure handing is a second challenge to consider with Lambda functions that are triggered by DynamoDB streams. Before we talk about this, we should dig a little deeper into how Lambda functions are invoked by DynamoDB streams.

When you create an event source mapping from a DynamoDB stream to a Lambda function, AWS has a process that occasionally polls the stream for new records. If there are new records, AWS will invoke your subscribed function with those records. The AWS process will keep track of your function's position in the DynamoDB stream. If your Lambda function returns successfully, the process will retain that information and update your position in the stream when polling for new records. If your Lambda function does not return successfully, it will not update your position and will re-poll the stream from your previous position. There are a few key takeaways here:

- You receive records in batches. There can be as few as 1 or as many as 10000 records in a batch.
- You may not alter or delete a record in the stream. You may only react to the information in the record.
- Each subscriber maintains its own position in the stream. Thus, a slower subscriber may be reading older records than a faster subscriber.

The batch notion is worth highlighting separately. Your Lambda function can only fail or succeed on an entire batch of records, rather than on an individual message. If you raise a failure on a batch of records because of an issue with a single record, know that you will reprocess that same batch. Take care to implement your record handler in an idempotent way -- you wouldn't want to send a user multiple "Welcome!" emails due to the failure of a different user.

With this background, let's think about how we should address failure. Let's start with something simple, like a Lambda function that posts data about new user signups to Slack. This isn't a mission-critical operation, so you can afford to be more lax about errors. When processing a batch of records, you could wrap it in a simple try/catch block that catches any errors, logs them to Cloudwatch, and returns successfully. For the occasional error that happens, that user isn't posted to Slack, but it's not a big deal. This function will likely stay up to date with the most recent records in the DynamoDB stream because of this strategy.

With our Algolia indexing function, we want to be less cavalier. If we're failing to index users as they sign up or modify their details, our search index will be stale and provide a poor experience for users. There are two ways you can handle this. First, you can simply raise an exception and fail loudly if _any_ record in the batch fails. This will cause your Lambda to be invoked again with the same batch of records. If this is a transient error, such as a temporary blip in service from Algolia, this should be fixed on the next invocation of your Lambda and processing will continue as normal. It's more complicated if this is _not_ a transient error, such as in the previous section where the event contract was changed. In that case, your Lambda will continue to be invoked with the same batch of messages. Each failure will indicate that your position in the DynamoDB stream should not be updated, and you will be stuck at that position until you either update your code to handle the failure case or the record is purged from the stream 24 hours after it was added.

This hard error pattern can be a good one, particularly for critical applications where you don't want to gloss over unexpected errors. You can set up a Cloudwatch Alarm to notify you if the number of errors for your function is too high over a given time period or if the Iterator Age of your DynamoDB stream is too high, indicating that you're falling behind in processing. You can investigate the cause of the error, make the necessary fix, and redeploy your function to handle the new record schema and continue your indexing as usual.

Between the "soft failure" mode of logging and moving on, and the "hard failure" mode of stopping everything on an error, I like a third option that allows us to retain the structured record in a programmatically-accessible way, while still continuing to process events. To do this, we create an SQS queue for storing failed messages. When an unexpected exception is raised, we capture the failure message and store it in the SQS queue along with the record. An example implementation looks like:

```python
# main.py

from service import handle_record, handle_failed_record


def lambda_handler(event, context):
    for record in event.get('Records'):
        try:
            handle_record(record)
        except Exception as e:
            handle_failed_record(record=record, exception=e)
```

Our main handler function is very short and simple. Each record is passed through a `handle_record` function, which contains our actual business logic. If any unexpected exception is raised, the record and exception are passed to a `handle_failed_record` function, which is shown below:

```python		
# service.py

import json
import os

import boto3


def handle_failed_record(record, exception):
    queue_url = os.environ['DEAD_LETTER_QUEUE']
    message_body = {
        'record': record,
        'exception': str(e)
    }
    client = boto3.client('sqs')
    client.send_message(
        QueueUrl=queue_url,
        MessageBody=json.dumps(body)
    )
...
```

Pretty straightforward -- it takes in the failed record and the exception and writes them in a message to an SQS queue.

When using this pattern, it helps to think of operating on individual records, rather than a batch of records. All of your business logic is contained on `handle_record`, which operates on a single record. This is useful when reprocessing failed records, as you can reuse the same logic. Imagine the unexpected error in your function was due to a bug in your logic that only affected a subset of records. You can fix the logic and redeploy, but you still need to process the records that failed in the interim. Since your `handle_record` function operates on a single record, you can just read records from the queue and send them through that same entry point:

```python
# reprocess.py

import json
import os

import boto3

from log import logger
from service import handle_record

queue_url = os.environ['DEAD_LETTER_QUEUE']
client = boto3.client('sqs')

while True:
    resp = client.receive_messages(QueueUrl=queue_name)

    messages = resp.get('Messages')

    # If we didn't receive any messages, the queue is empty and we can stop.
    if not messages:
        break

    for message in messages:
        body = json.loads(message['Body'])
        record = body['record']

        try:
            handle_record(record)
            client.delete_message(
                QueueUrl=queue_name,
                ReceiptHandle=message.get('ReceiptHandle')
            )
        except Exception as e:
            logger.error(e)		
```

This is a simple reprocessing script that you can run locally or invoke with a reprocessing Lambda. It reads messages from the SQS queue and parses out the `record` object, which is the same as the `record` input from a batch of records from the DynamoDB stream. This record is passed into the updated `handle_record` function and the queue message is deleted if the operation is successful. This pattern isn't perfect, but I've found it to be a nice compromise between the two extremes of the failure spectrum when processing streams with Lambda.

#### Concurrency Limits

Finally, let's talk about concurrency limits with DynamoDB streams. The big benefit of streams is the _independence_ of the consumers -- the Algolia indexing operations are completely separate from the process that updates the marketing team's CRM. The development team that manages the user search index doesn't even need to know about the marketing team's needs or existence, and vice versa.

However, it's not quite accurate to say that consumers are completely independent. DynamoDB streams are similar to [Kinesis streams](https://aws.amazon.com/kinesis/streams/) under the hood. These streams throttle reads in two ways: throughput and read requests. For throughput, you may read 2 MB per second from a single shard. For read requests, Kinesis streams have a limit of 5 read requests per second on a single shard. For DynamoDB streams, these limits are even more strict -- [AWS recommends](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html#Streams.Processing) to have no more than 2 consumers reading from a DynamoDB stream shard. If you had more than 2 consumers, as in our example from Part I of this blog post, you'll experience throttling.

To me, the read request limits are a defect of the Kinesis and DynamoDB streams. If you are hitting throughput limits on your streams, you can increase the number of shards as the MB limit is on a per-shard basis. However, there's no similar scaling mechanism if you want to increase the number of read requests. Every consumer needs to read from every shard, so increasing the number of shards does not help you scale out consumers. The entire notion of an immutable log like Kinesis or Kafka is to allow for multiple independent consumers (check out Jay Krep's excellent book, [I Heart Logs](http://shop.oreilly.com/product/0636920034339.do), for a better understanding of immutable logs). With the current read request limits in Kinesis and DynamoDB streams, the number of consumers is severely constrained.

#### Conclusion

In this post, we discussed some implementation details and some gotchas to watch out for when using stream-based Lambda invocations. Now it's your turn -- tell us what you build with event-driven architectures!
