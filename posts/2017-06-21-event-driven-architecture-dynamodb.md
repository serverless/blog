---
title: Event-driven processing with Serverless and DynamoDB streams
description: Learn how to use DynamoDB streams and AWS Lambda to keep your search indexes and CRM tools up to date.
date: 2017-06-21
layout: Post
thumbnail: https://user-images.githubusercontent.com/6509926/27362413-f40e4968-55f3-11e7-9c68-65dc1b06f335.jpg
authors:
  - AlexDeBrie
---

In the last few years, we've seen an explosion in developers using event streams to power interesting applications. Many companies are turning to Kafka, a persistent, distributed log developed at LinkedIn that is now a top-level Apache project. But Kafka operations aren't free -- you'll need to manage a cluster of brokers as well as a highly-available Zookeeper ensemble. Configuring, monitoring, and repairing this infrastructure can distract you from the value you want to deliver to your customers. In this post, I'll show you how you can use DynamoDB streams to decouple your application, giving you the benefits of an event stream without the maintenance burden. I'll walk though why you might want to use an event-based architecture. In a follow-up post, I'll talk about the challenges of an event-driven architecture and some patterns you can use to build event-driven services.

## User Signup with DynamoDB

You have a great idea for an application. Like many apps, you need a way for users to sign up. An [increasingly popular architecture](https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/) is to create a REST API using API Gateway, Lambda, and DynamoDB. With the Serverless Framework, your create user function might look like:

```python
import json

from log import logger
from models import User, UserCreationException


def create_user(event, context):
    email = event.get('email')
    fullname = event.get('fullname')
    date_of_birth = event.get('date_of_birth')

    try:
        user = User.create(
            email=email,
            fullname=fullname,
            date_of_birth=date_of_birth
        )
    except UserCreationException as e:
        logger.error(str(e)
        return {
            'statusCode': 400,
            'body': json.dumps({
                'error': str(e)
            })
        }

    return {
        'statusCode': 200,
        'body': json.dumps({
            'id': user.id
        })
    }
```

For brevity, I've left out the logic to actually save the user to DynamoDB. In the sample above, the function parses the user data from the request body and attempts to save it to the database. If it fails, it returns an 400 to the user, while a success returns a 200. Pretty basic.

## Adding in User Search with Algolia

So now you've implemented user signup, and your app is growing like crazy. Many of your users are requesting the ability to search for other users so they can connect with their friends that are also using your app. DynamoDB is a poor fit for implementing search, so you look to other options. The classic choices are Solr or Elasticsearch, but these both require setting up and managing your own infrastructure. In keeping with the serverless theme, you decide to try [Algolia](https://www.algolia.com/), a fully-managed search SAAS offering.

To make your users available to be searched in Algolia, you'll need to index your users as they are created. We can add this into our prior user creation Lambda function as follows:

```python
import json

from log import logger
from models import User, UserCreationException
from search import index_user, UserIndexException


def create_user(event, context):
    email = event.get('email')
    fullname = event.get('fullname')
    date_of_birth = event.get('date_of_birth')

    # Create your user
    try:
        user = User.create(
            email=email,
            fullname=fullname,
            date_of_birth=date_of_birth
        )
    except UserCreationException as e:
        logger.error(str(e)
        return {
            'statusCode': 400,
            'body': json.dumps({
                'error': str(e)
            })
        }

    # User indexing section
    try:
        index_user(
            id=user.id,
            email=email,
            fullname=fullname
            date_of_birth=date_of_birth
        )
    except UserIndexException as e:
        # While index errors are important, we don't want to stop
        # users from signing up if Algolia is down or we've forgotten
        # to pay our bill. We'll just log the error and still return
        # a successful response.
        logger.error(str(e)

    return {
        'statusCode': 200,
        'body': json.dumps({
            'id': user.id
        })
    }
```

Great! Now users are indexed in Algolia and can be searched from the frontend.

However, there are some problems with this approach:

- **Added Latency**: A user signing up for the first time now needs to wait for two separate calls on the backend before receiving a response.
- **Partial Failures**: How should the function react in the event of a partial failure -- the write to DynamoDB succeeds, but the index call to Algolia fails? Right now, we're logging the failed index call and moving along, but that creates drift between our source-of-truth user data and our search index.
- **Poor separation of concerns**: We're now doing two things that could be separate within the same function. If a change is needed to either part, a redeploy of the user creation function is needed, which could introduce regressions in the other part. Further, we'll need to add index-related functionality to other user endpoints as well, such as update user and delete user endpoints.

## A Better Way: Event-driven functions with DynamoDB Streams

To overcome these issues, we're going to use the [Streams](http://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Streams.html) feature of DynamoDB. A DynamoDB Stream is like a changelog of your DynamoDB table -- every time an Item is created, updated, or deleted, a record is written to the DynamoDB stream. The stream has two interesting features. First, it is ordered by time, so older records appear before newer records. Second, it is persistent, as it retains the last 24 hours of changes to your DynamoDB table. This is a useful attribute compared to an ephemeral pub-sub mechanism like SNS, as you can reprocess records that occurred in the recent past.

DynamoDB streams are charged based on the number of read requests, so there's no cost to setting them up when you set up a DynamoDB table. When you set up a DynamoDB stream, you'll need to set the Stream View Type. This specifies what data about the changed Item will be included with each Record in the stream. The Stream View Types are:

- **KEYS_ONLY:** The record includes _only_ the partition key and sort key (if applicable) for a changed Item. If you use this, you would need to make a query to DynamoDB with the keys if you needed additional, non-key attributes about the Item.
- **NEW\_AND\_OLD_IMAGES:** This record will include both the full Item as it looks after the operation and the full Item as it looked before the operation. While this includes the most information, it comes at a cost. You're charged for DynamoDB streams based on read requests, and each read request can return a max of 1 MB of data. If you're sending the full old and new Items, you may have to make more requests. This is particularly true when you have Items with lots of fields or with a very large field, such as a set with many elements or a binary representation of an image.
- **NEW_IMAGE:** This record shows the full Item after it was modified by the operation.
- **OLD_IMAGE:**: This record shows the full Item before it was modified.

Choose the option that best fits your use case, but I find the `NEW_IMAGE` view type is often the most useful as I'm usually concerned with the Item as it currently exists.

## Event-driven Indexing

The real power from DynamoDB Streams comes when you integrate them with Lambda. You can set Streams to trigger Lambda functions, which can then act on records in the Stream.

Let's return to our example to see why this is a powerful pattern. Recall that we had set up a user creation endpoint that both saved the user to DynamoDB and indexed the user in Algolia for searching. However, this introduced problems such as increased latency, partial failures, and poor separation of concerns. Let's separate these two operations to help reduce these issues.

First, we rollback our user creation function to the original version  under the `User Signup with DynamoDB` heading. Second, we create a new function that will be triggered by the stream from our DynamoDB table. The `event` argument that is passed to our Lambda handler function will be a dictionary with roughly the following shape:

```json
{
  "Records": [
    {
      "eventID": "1",
      "eventVersion": "1.0",
      "dynamodb": {
        "Keys": {
          "userId": {
            "N": "101"
          }
        },
        "NewImage": {
          "emailAddress": {
            "S": "first@user.com"
          },
          "fullname": {
            "S": "Bob Smith"
          },
          "date_of_birth": {
            "S": "1988-05-26"
          },
          "userId": {
            "N": "101"
          }
        },
        "StreamViewType": "NEW_IMAGE",
        "SequenceNumber": "111",
        "SizeBytes": 128
      },
      "awsRegion": "us-west-2",
      "eventName": "INSERT",
      "eventSourceARN": "event:source:ARN",
      "eventSource": "aws:dynamodb"
    },
    {
      "eventID": "2",
      "eventVersion": "1.0",
      "dynamodb": {
        "Keys": {
          "userId": {
            "N": "101"
          }
        },
        "NewImage": {
          "emailAddress": {
            "S": "first@user.com"
          },
          "fullname": {
            "S": "Robert Smith"
          },
          "date_of_birth": {
            "S": "1988-05-26"
          },
          "userId": {
            "N": "101"
          }
        },
        "SequenceNumber": "222",
        "SizeBytes": 59,
        "StreamViewType": "NEW_IMAGE"
      },
      "awsRegion": "us-west-2",
      "eventName": "MODIFY",
      "eventSourceARN": "event:source:ARN",
      "eventSource": "aws:dynamodb"
    }
  ]
}
```

In the example above, there are two records from a stream. The first shows the creation of an Item whose partition key `userId` had a value of `101`. We can tell this Item was created from the record as the `eventName` is `INSERT`. In the second record, the same Item is affected but with an `eventName` of `MODIFY`. If you examine the two `NewImage` objects closely, you'll see that the second one changes the `fullname` attribute from `Bob Smith` to `Robert Smith`. Because I've chosen the `NEW_IMAGE` view type, I received the full Item as it exists after the given operation.

Now that I have the DynamoDB stream set up, I can set up an Algolia indexing function that will be triggered from the stream. The example code below shows how we would handle the stream records in a Lambda function:

```python
import json

from log import logger
from search import index_user, remove_user_from_index

def index_users(event, context):

    for record in event.get('Records'):
        if record.get('eventName') in ('INSERT', 'MODIFY'):
            user_id = record['NewImage']['userId']['N']
            email = record['NewImage']['emailAddress']['S']
            fullname = record['NewImage']['fullname']['S']
            date_of_birth = record['NewImage']['date_of_birth']['S']

            index_user(
                user_id=user_id,
                email=email,
                fullname=fullname,
                date_of_birth=date_of_birth
            )
			
            logger.info('Indexed user Id {}'.format(user_id)
        elif record.get('eventName') == 'DELETE':
            user_id = record['Keys']['userId']['N']
            remove_user_from_index(user_id=user_id)

            logger.info('Removed user Id {} from index'.format(user_id)

```

This function iterates over the records from the stream. If the record is inserting a new Item or modifying an existing item, it pulls out the relevant attributes and makes a call to index the user. If the record is deleting a user, it makes a call to delete the user from the index.

Think about how this helps with our problems before. This indexing operation is outside the request-response cycle of the user creation endpoint, so we aren't adding latency to the user sign up experience. Further, we don't have to think about how to handle a partial failure in the user creation endpoint where the user was created but we couldn't index in Algolia. Now our two functions can fail independently and handle them in ways specific to their use case. Finally, we've better separated our actions so that a change to our indexing strategy doesn't need to require a redeploy of all user creation and modification functions.

## Multiple Reactions to the same event: Adding users to your CRM

Let's look at one more reason this pattern is so powerful. Imagine your Marketing team is hungry for user information so they can target them with special promotions or other marketing material. They are begging you to copy new users into their customer relationship management (CRM) platform as they sign up. Without an event-driven architecture, you might be leery of this -- the API request to the CRM would need to happen within the user creation flow. This use case is even further separated from production than the user search index example and is unlikely to be allowed. The Marketing crew will likely need to ask for a developer to write a batch job to run at off hours to extract users from the production database and pump them into the CRM.

It doesn't need to be this way. Thanks to the DynamoDB stream you previously set up, your Marketing team could hook into the same stream of user events in a safe way that doesn't impact production. They can even enrich the users by calling an identification API like Clearbit or FullContact without worrying about latency to the end user. This function might look like:

```python
import json

from crm import save_user, mark_user_as_deleted
from fullcontact import enrich_user
from log import logger

def index_users(event, context):

    for record in event.get('Records'):
        email = record['NewImage']['emailAddress']['S']

        try:
            if record.get('eventName') in ('INSERT', 'MODIFY'):
                # Add additional user info from FullContact
                enriched_user = enrich_user(email=email)

                # Save to our CRM
                save_user(enriched_user)

                logger.info('Added {} to CRM'.format(email)
            elif record.get('eventName') == 'DELETE':
                mark_user_as_deleted(email=email)

                logger.info('Marked {} as deleted in CRM'.format(email)
		
    except Exception as e:
        logger.error("Failed to update {email} in CRM. Error: {error}".format(email=email, error=str(e))

```

This is completely separate from production and from the other Lambda functions triggered by your stream. If your Marketing team decides to change their CRM, they can update this function and redeploy without worrying about its effect elsewhere. Further, by removing the need to hook up the internal plumbing to get access to what's happening in production, you've reduced the time to create something of value from these user events. If someone on your team wants to drop a message in a Slack room every time you get a new user, the event stream is already hooked up and waiting for them -- she just needs to write the code to pipe the users into Slack. You could send welcome emails to new users or store counts of these events in a database for internal analytics. The possibilities are endless.

## Conclusion

In this post, we've seen how an event-driven system with DynamoDB streams and Lambda functions are a powerful pattern for reacting to what's happening in your application. In a follow-up post, I'll cover some patterns you can use when working with DynamoDB streams.
