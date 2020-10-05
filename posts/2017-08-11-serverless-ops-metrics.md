---
title: Serverless Ops 101 - Using CloudWatch Metrics & Alarms with Serverless Functions
description: Level up your serverless ops game with a walkthrough on CloudWatch metrics and alarms
date: 2017-08-11
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudwatch+metrics.jpg
category:
  - operations-and-observability
authors:
  - AlexDeBrie
---

For many users, the biggest benefit of serverless is how _managed_ it is -- developers and designers don't need to waste their time updating system packages or monitoring CPU usage. They can work on what they do best while the cloud provider handles most of the operations work.

You can't avoid operations entirely though. In this post, we'll talk about the basics of monitoring your Lambda functions with CloudWatch metrics. This is the first post in a series of the basics of serverless operations.

# Basic CloudWatch metrics

CloudWatch helps you by monitoring certain metrics for all of your Lambda functions automatically. These metrics include:

- **Invocations:** The number of times your function is invoked;
- **Errors:** The number of times your function fails with an error, due to timeouts, memory issues, unhandled exceptions, or other issues;
- **Throttles:** The number of times your function is throttled. AWS [limits the concurrent number of executions](http://docs.aws.amazon.com/lambda/latest/dg/concurrent-executions.html) across all your functions. If you exceed that, your function will be throttled and won't be allowed to run.
- **Duration:** How long your function runs.

For every serverless service I run, I care about Errors and Throttles. I want to know if my code is failing for any reason, whether errors in my code or too many concurrent Lambda invocations in my account.

To monitor Errors and Throttles, I use the [serverless-plugin-aws-alerts](https://github.com/ACloudGuru/serverless-plugin-aws-alerts) plugin from the folks at A Cloud Guru. It makes it easy to set up alerts for your services.

To use it in your Serverless service, first install the plugin in your Serverless service:

```bash
$ npm install serverless-plugin-aws-alerts --save-dev
```

Then add it to your `serverless.yml`:

```yaml
# serverless.yml

plugins:
  - serverless-plugin-aws-alerts

custom:
  alerts:
    stages:
      - production
    topics:
      alarm:
        topic: ${self:service}-${opt:stage}-alerts-alarm
        notifications:
          - protocol: email
            endpoint: name@domain.com # Change this to your email address
    alarms:
      - functionErrors
      - functionThrottles
```

This setup adds alerts to all of our functions in our service when deployed to the `production` stage. For every one minute period where I have 1+ errors or throttles, I'll get at email to `name@domain.com`. (Make sure to change the email to your email.)

# Advanced Usage: Custom CloudWatch Metrics

In addition to Lambda's out-of-the-box CloudWatch metrics, you can also create your own custom metrics.

Imagine you have a Lambda function that is processing records from a Kinesis stream. Your Lambda function will receive a batch of multiple records. Because of this batch, your visibility into what is happening is limited in a few ways:

1. You can't tell by the Invocations metric how many records were processed; and
2. If there's a record with unexpected input, you may want to know about it without throwing a hard error. Throwing an exception in a batch of Kinesis records will end up retrying the entire batch of records.

We can handle both of these problems with CloudWatch custom metrics. Using the AWS SDK, you can make a `put_metric_data()` call with a CloudWatch client.

The example below is in Python, but the APIs are similar for other languages:

```python
# handler.py

import datetime

import boto3

# initialize our Cloudwatch client
CLOUDWATCH = boto3.client('cloudwatch')


def main(event, context):
    for record in event['Records']:
        # Processing logic here
        process_record(record)

    # After we've processed the records, emit metric
    # for the number of records we've seen.
    CLOUDWATCH.put_metric_data(
        Namespace='AWS/Lambda',
        MetricData=[
            {
                'MetricName':  'KinesisRecordsSeen',
                'Dimensions': [
                    {
                        'Name': 'FunctionName',
                        'Value': context.function_name
                    {
                ]
                'Timestamp': datetime.datetime.now(),
                'Value': len(event['Records'])
            }
        ]
    )
```

In this example, we're storing a metric named `KinesisRecordsSeen` that stores the number of Kinesis records in each Lambda invocation batch. We're storing the metric in the `AWS/Lambda` namespace with a `FunctionName` dimension to segregate metrics from one another, so I could have a `KinesisRecordsSeen` metric for each of my different functions.

I can easily set up alerts on my custom metrics as well. Let's say I want an email alert whenever I see more than 1000 Kinesis records in 5 minutes:

```yaml
# serverless.yml

plugins:
  - serverless-plugin-aws-alerts

custom:
  alerts:
    stages:
      - producton
    topics:
      alarm:
        topic: ${self:service}-${opt:stage}-alerts-alarm
        notifications:
          - protocol: email
            endpoint: name@domain.com
    definitions:
      tooManyRecordsAlarm:
        description: 'Record overflow'
        namespace: 'AWS/Lambda'
        metric: KinesisRecordsSeen
        threshold: 1000
        statistic: Sum
        period: 600
        evaluationPeriods: 1
        comparisonOperator: GreaterThanOrEqualToThreshold
    alarms:
      - tooManyRecordsAlarm
```

A caveat here is that this will add latency to your overall Lambda execution as you will be waiting on the API call to CloudWatch. If you'd like, you could avoid this by using CloudWatch log Metric Filters to create metrics from your logs instead -- more detail [here](http://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/MonitoringLogData.html).

As your Serverless application gets more serious, you will want to track metrics more closely using a tool like DataDog, IOPipe, or Honeycomb. But for quick and easy monitoring, it's hard to go wrong with CloudWatch and the [serverless-plugin-aws-alerts](https://github.com/ACloudGuru/serverless-plugin-aws-alerts) plugin.

## Next post in the Serverless Ops series:

- [Serverless Ops 102: CloudWatch Logs and Centralized Logging with AWS Lambda](https://serverless.com/blog/serverless-ops-logs/)
