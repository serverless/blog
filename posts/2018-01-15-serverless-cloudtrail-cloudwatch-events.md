---
title: How to monitor AWS account activity with Cloudtrail, Cloudwatch Events and Serverless
description: Level up your AWS automation by reacting to events from AWS services.
date: 2018-01-15
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless-square-icon-text.png'
category:
  - operations-and-observability
authors:
  - AlexDeBrie
---

CloudTrail and CloudWatch Events are two powerful services from AWS that allow you to monitor and react to activity in your account—including changes in resources or attempted API calls.

This can be useful for audit logging or real-time notifications of suspicious or undesirable activity.

In this tutorial, we'll set up two examples to work with CloudWatch Events and CloudTrail. The first will use standard CloudWatch Events to watch for changes in Parameter Store (SSM) and send notifications to a Slack channel. The second will use custom CloudWatch Events via CloudTrail to monitor for actions to create DynamoDB tables and send notifications.

## Setting up

Before we begin, you'll need the [Serverless Framework installed](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) with an AWS account set up.

The examples below will be in Python, but the logic is pretty straightforward. You can rewrite in any language you prefer.

If you want to trigger on custom events using CloudTrail, you'll need to set up a CloudTrail. In the AWS console, navigate to the [CloudTrail service](https://console.aws.amazon.com/cloudtrail/home).

Click "Create trail" and configure a trail for "write-only" management events:

![CloudTrail write-only events](https://user-images.githubusercontent.com/6509926/34655410-17f8ac5c-f3be-11e7-8d58-06ce4170b428.png)

Have your trail write to a Cloudwatch Logs log group so you can subscribe to notifications:

<img width="987" alt="CloudWatch Logs from CloudTrail" src="https://user-images.githubusercontent.com/6509926/34655530-171b38a2-f3c0-11e7-8dbe-054b8df0418b.png">

Both examples above post notifications to Slack via the Incoming Webhook app. You'll need to set up an Incoming Webhook app if you want this to work.

First, create or navigate to the Slack channel where you want to post messages. Click "Add an app":

<img width="941" alt="Slack - Add an app" src="https://user-images.githubusercontent.com/6509926/34655579-c7901d10-f3c0-11e7-9a09-602a0fbe1c28.png">

In the app search page, search for "Incoming Webhook" and choose to add one. Make sure it's the room you want.

After you click "Add Incoming Webhooks Integration", it will show your Webhook URL. This is what you will use in your `serverless.yml` files for the `SLACK_URL` variable.

If you want to, you can customize the name and icon of your webhook to make the messages look nicer. Below, I've used the "rotating-light" emoji and named my webhook "AWS Alerts":

<img width="1008" alt="Slack app customize name & icon" src="https://user-images.githubusercontent.com/6509926/34655596-135b1b78-f3c1-11e7-9ce3-5213e42330a3.png">

With that all set up, let's build our first integration!

## Monitoring Parameter Store Changes

The first example we'll do will post notifications of from AWS Parameter Store into our Slack channel. Big shout-out to [Eric Hammond](https://twitter.com/esh) for inspiring this idea; he's an AWS expert and a great follow on Twitter:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr"><a href="https://twitter.com/hashtag/awswishlist?src=hash&amp;ref_src=twsrc%5Etfw">#awswishlist</a> Ability to trigger AWS Lambda function when an SSM Parameter Store value changes.<br><br>That could then run CloudFormation update for stacks that use the parameter</p>&mdash; Eric Hammond (@esh) <a href="https://twitter.com/esh/status/946824737585373184?ref_src=twsrc%5Etfw">December 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Parameter Store (also called SSM, for Simple Systems Manager) is a way to centrally store configuration, such as API keys, resource identifiers, or other config.

(Check out our [previous post](https://serverless.com/blog/serverless-secrets-api-keys/) on using Parameter Store in your Serverless applications.)

SSM integrates directly with CloudWatch Events to expose certain events when they occur. You can see the full list of CloudWatch Events [here](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html). In this example, we are interested in the `SSM Parameter Store Change` event, which is fired whenever an SSM parameter is changed.

CloudWatch Event subscriptions work by providing a filter pattern to match certain events. If the pattern matches, your subscription will send the matched event to your target.

In this case, our target will be a Lambda function.

Here's an [example SSM Parameter Store Event](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/EventTypes.html#SSM-Parameter-Store-event-types):

```json
{
  "version": "0",
  "id": "6a7e4feb-b491-4cf7-a9f1-bf3703497718",
  "detail-type": "Parameter Store Change",
  "source": "aws.ssm",
  "account": "123456789012",
  "time": "2017-05-22T16:43:48Z",
  "region": "us-east-1",
  "resources": [
    "arn:aws:ssm:us-east-1:123456789012:parameter/foo"
  ],
  "detail": {
    "operation": "Create",
    "name": "foo",
    "type": "String",
    "description": "Sample Parameter"
  }
}
```

We need to specify which elements of the Event are important to match for our subscription.

There are two elements important here. First, we want the `source` to equal `aws.ssm`. Second, we want the `detail-type` to equal `Parameter Store Change`. This is narrow enough to exclude events we don't care about, while still capturing all of the events by not specifying filters on the other fields.

The Serverless Framework makes it really easy to [subscribe to CloudWatch Events](https://serverless.com/framework/docs/providers/aws/events/cloudwatch-event/). For the function we want to trigger, we create a `cloudWatchEvent` event type with a mapping of our filter requirements.

Here's an example of our `serverless.yml`:

```yml
service: cloudwatch-ssm

provider:
  name: aws
  runtime: python3.6
  stage: dev
  region: us-east-1
  iamRoleStatements:
    - Effect: "Allow"
      Action:
        - "ssm:DescribeParameters"
      Resource: "*"
  environment:
    SLACK_URL: 'INSERT SLACK URL'

functions:
  parameter:
    handler: handler.parameter
    events:
      - cloudwatchEvent:
          event:
            source:
              - "aws.ssm"
            detail-type:
              - "Parameter Store Change"
```

Notice that the `functions` block includes our filter from above. There are two other items to note:

1. We injected our Slack webhook URL into our environment as `SLACK_URL`. Make sure you update this with your actual webhook URL if you're following along.

2. We added an [IAM statement](https://serverless.com/blog/abcs-of-iam-permissions/) that gives us access to run the DescribeParameters command in SSM. This will let us enrich the changed parameter event by showing what version of the parameter we're on and who changed it mostly recently. It _does not_ provide permissions to read the parameter value, so it's safe to give access to parameters with sensitive keys.

Our `serverless.yml` says that our function is defined in a `handler.py` module with a function name of parameter. Let's implement that now.

Put this into your `handler.py` file:

```python
# handler.py

import json
import os

from botocore.vendored import requests
import boto3

SLACK_URL = os.environ.get('SLACK_URL')
CLIENT = boto3.client('ssm')


def parameter(event, context):
    formatted = format_message(event)

    send_to_slack(formatted)


def format_message(parameter_event):
    name = parameter_event.get('detail').get('name')
    operation = parameter_event.get('detail').get('operation')
    resp = CLIENT.describe_parameters(
        Filters=[
            {
                "Key": "Name",
                "Values": [name]
            }
        ]
    )
    last_modified_user = resp['Parameters'][0]['LastModifiedUser']
    version = resp['Parameters'][0]['Version']

    text = '\n'.join([
        "Paramater changed in SSM!",
        "A *{}* operation was performed on parameter *{}*".format(operation.upper(), name),
        "Change made by {}".format(last_modified_user),
        "Parameter now on version {}".format(version)
    ])

    return {
        "text": text
    }


def send_to_slack(message, url=SLACK_URL):
    resp = requests.post(url, json=message)

    resp.raise_for_status()
```

This function takes the incoming event and assembles it into a format [expected by Slack](https://api.slack.com/docs/message-formatting) for its webhook. Then, it posts the message to Slack.

Let's deploy our service:

```bash
$ sls deploy
Serverless: Packaging service...
... <snip> ...
Serverless: Stack update finished...
Service Information
service: cloudwatch-ssm
stage: dev
region: us-east-1
stack: cloudwatch-ssm-dev
api keys:
  None
endpoints:
  None
functions:
  parameter: cloudwatch-ssm-dev-parameter
```

Then, let's alter a parameter in SSM to trigger the event:

```bash
$ aws ssm put-parameter \
  --name "/Test/my-parameter" \
  --value "Secret" \
  --type "String"
```

**Note:** Make sure you're running the `put-parameter` command in the same region that your service is deployed in.

After a few minutes, you should get a notification in your Slack channel:

![SSM Create Slack alert](https://user-images.githubusercontent.com/6509926/34956556-41b964dc-f9ef-11e7-9015-adc119ca8c25.png)

💥 Awesome!

## Monitoring new DynamoDB tables with CloudTrail

In the previous example, we subscribed to SSM Parameter Store events. These events are already provided directly by CloudWatch Events.

However, not all AWS API events are provided by CloudWatch Events. To get access to a broader range of AWS events, we can use [CloudTrail](https://aws.amazon.com/cloudtrail/).

Before you can use CloudTrail events in CloudWatch Event subscriptions, you'll need to set up CloudTrail to write a CloudWatch log group. If you need help with this, it's covered above in the [setting up](#setting-up) section.

Once you're set up, you can see the [huge list of events](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/view-cloudtrail-events-supported-services.html) supported by CloudTrail event history.

Generally, an event will be supported if it meets both of the following requirements:

1. It is a _state-changing_ event, rather than a read-only event. Think `CreateTable` or `DeleteTable` for DynamoDB, but not `DescribeTable`.
2. It is a _management-level_ event, rather than a data-level event. For S3, this means `CreateBucket` or `PutBucketPolicy` but not `PutObject` or `DeleteObject`.

**Note:** You can enable data-level events for S3 and Lambda in your CloudTrail configuration if desired. This will trigger many more events, so use carefully.

When configuring a CloudWatch Events subscription for an AWS API call, your pattern will always look something like this:

```yml
      - cloudwatchEvent:
          event:
            source:
              - "aws.dynamodb"
            detail-type:
              - "AWS API Call via CloudTrail"
            detail:
              eventName:
                - "CreateTable"
```

There will be a `source` key that will match the particular AWS service you're tracking. The `detail-type` will be `AWS API Call via CloudTrail`. Finally, there will be an array of `eventName` in the `detail` key that lists 1 or more event names you want to match.

Pro-tip: Use the [CloudWatch Rules console](https://console.aws.amazon.com/cloudwatch/home#rules:action=create) to help configure your items the first few times. You can point and click different options and it will show the subscription pattern:

<img width="774" alt="CloudWatch Events console" src="https://user-images.githubusercontent.com/6509926/34832861-a40942fe-f6b3-11e7-8d7a-04ebcbb433d2.png">

Let's insert our DynamoDB CreateTable pattern into our `serverless.yml`:

```yml
# serverless.yml

service: cloudtrail-dynamodb

provider:
  name: aws
  runtime: python3.6
  stage: dev
  region: us-east-1
  environment:
    SLACK_URL: 'INSERT SLACK URL'

functions:
  createTable:
    handler: handler.create_table
    events:
      - cloudwatchEvent:
          event:
            source:
              - "aws.dynamodb"
            detail-type:
              - "AWS API Call via CloudTrail"
            detail:
              eventName:
                - "CreateTable"
```

Very similar to the previous example—we're setting up our CloudWatch Event subscription and passing in our Slack webhook URL to be used by our function.

Then, implement our function logic in `handler.py`:

```python
# handler.py

import json
import os

from botocore.vendored import requests

SLACK_URL = os.environ.get('SLACK_URL')


def create_table(event, context):
    formatted = format_message(event)

    send_to_slack(formatted)


def format_message(event):
    detail = event.get('detail')
    parameters = detail.get('requestParameters')
    identity = detail.get('userIdentity')

    table_name = parameters.get('tableName')
    region = detail.get('awsRegion')
    username = identity.get('userName')
    user_type = identity.get('type')


    text = '\n'.join([
        "New DynamoDB table created!",
        "Table *{}* created in region *{}*".format(table_name, region),
        "Request made by username *{}*, a *{}*.".format(username, user_type)
    ])

    return {
        "text": text
    }


def send_to_slack(message, url=SLACK_URL):
    resp = requests.post(url, json=message)

    resp.raise_for_status()
```

Again, pretty similar to the last example—we're taking the event, assembling it into a format for Slack messages, then posting to Slack.

Let's deploy this one:

```bash
$ sls deploy
```

And then trigger an event by creating a DynamoDB table via the AWS CLI:

```bash
$ aws dynamodb create-table \
  --table-name TestTable \
  --attribute-definitions '[
    {
        "AttributeName": "key",
        "AttributeType": "S"
    }
  ]' \
  --key-schema '[
    {
        "AttributeName": "key",
        "KeyType": "HASH"
    }
  ]' \
  --provisioned-throughput '{
    "ReadCapacityUnits": 1,
    "WriteCapacityUnits": 1
  }'
```

Wait a few moments, and you should get a notification in Slack:

![Slack DynamoDB CreateTable alert](https://user-images.githubusercontent.com/6509926/34838059-5222f41c-f6c2-11e7-9693-6db8dc866f05.png)

Aw yeah.

You could implement some really cool functionality around this, including calculating and displaying the monthly price of the table based on the provisioned throughput, or making sure all infrastructure provisioning is handled through a particular IAM user (e.g. the credentials used with your CI/CD workflows).

Also, make sure you delete the table so you don't get charged for it:

```bash
$ aws dynamodb delete-table \
    --table-name TestTable
```

## Conclusion

There's a ton of potential for CloudWatch Events, from triggering notifications on suspicious events to performing maintenance work when a new resource is created.

In a future post, I'd like to explore saving all of this CloudTrail events to S3 to allow for efficient querying on historical data—"Who spun up EC2 instance i-afkj49812jfk?" or "Who allowed 0.0.0.0/0 ingress in our database security group?"

If you use this tutorial to do something cool, drop it in the comments!
