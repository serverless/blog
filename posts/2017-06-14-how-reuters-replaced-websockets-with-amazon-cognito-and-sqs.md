---
title: How Reuters Replaced WebSockets with Amazon Cognito and SQS
description: How to implement long-polling via Amazon Cognito and SQS
date:  2017-06-14
thumbnail: https://user-images.githubusercontent.com/832852/26854484-5457a7e4-4ae4-11e7-8f71-fc51bc710a6b.jpg
category:
  - user-stories
authors:
 - KenEllis
---

The advantages of a serverless architecture are, at this point, not really a matter of debate.  The question for every application or component becomes, “How can I avoid having to manage servers?” Sometimes you come across a roadblock:  Perhaps you need a GPU; it takes 60 seconds just to load a machine learning model;  maybe your task takes longer than the 300 seconds Amazon gives you for a Lambda process and you can't figure out how to chop it up. The excuses never end.

Perhaps you want to push events into a browser or app through a WebSocket to create something similar to a chat or email application. You could use Nginx and Redis to create topics and have applications subscribe to them via a push stream; however, that means managing some long-running processes and servers.  You can fake it and pound your backend once a second, butBut Amazon SQS and Cognito offer an easier way.  Each user session can be paired with a Cognito identity and an SQS queue meaning applications can use SQS long-polling to receive events in real-time.  At Reuters, we use this in production to support messaging in event-driven web applications and have [open-sourced](https://github.com/ReutersMedia/sqs-browser-events) the underlying Serverless stack.

## Architecture

To push an event stream to a web browser, we need to tie each session to an SQS Queue URL.  The client creates a unique session ID, supplies credentials to the application, and receives: a dedicated SQS URL; Cognito access credentials that grant them permission to poll the queue; and an AES encryption key that allows them to decrypt messages received from the queue.  A diagram of the steps from the user's perspective is shown below.

<img src="https://user-images.githubusercontent.com/832852/26846637-59f8d00e-4ac8-11e7-9181-33076408f2ee.jpeg" width="600">

The first step is creation of a session.  In our case, this includes an Account ID identifying a collection of Users; a User ID identifying a particular person; and a Session ID identifying a particular application connection or browser session.  The client calls an application endpoint with their identity and session information; then, the application validates their credentials against the claimed identity.  In our case, authentication is handled by a separate single signon process, and we use an unauthenticated Cognito pool.  This could also be managed by [Cognito federated identities](http://docs.aws.amazon.com/cognito/latest/developerguide/cognito-identity.html) without needing an intermediate system; but, in our case the session creation endpoint requires IAM credentials only available to our application backend.  Using federated identities would allow authentication with Facebook, Google, or through a [custom developer-authenticated mechanism](http://docs.aws.amazon.com/cognito/latest/developerguide/developer-authenticated-identities.html).


Once the session is created, the browser client has: a set of Cognito AWS credentials that are good for around one hour; an SQS Queue URL uniquely associated with their session; and an AES private key.  The client then starts making requests to the SQS Queue using [long-polling](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-long-polling.html).

The messaging stack can receive events from Kinesis or from an API Gateway method.  The events can be directed at a specific session ID, at all sessions for a User, at all Users in an Account, or can be broadcast to all users.  A Lambda function handles insertion of the messages into all of the appropriate SQS Queues.  In our case, several systems can create events while access to the message dispatching endpoints is managed by IAM.  End-to-end message delivery time, from Kinesis to the Browser, is around 2 seconds, and with long-polling makes reasonably economical use of AWS resources.


## Messaging Demo

To demonstrate the solution, we'll implement a simple shell script to listen for messages and then discuss the internal workings of the stack.  First, we launch a version of the [SQS-Browser-Events serverless project](https://github.com/ReutersMedia/sqs-browser-events).  We also set a TTL on the session table to facilitate cleanup; which requires at least version 1.11.78 of the AWS CLI, as the feature was only released in February of 2017.  This setting can't yet be managed through CloudFormation templates.

```bash
$ curl -sSL https://github.com/ReutersMedia/sqs-browser-events/archive/master.tar.gz | tar xvz
$ cd sqs-browser-events-master
$ sls deploy --env demo --region us-east-2 --poolname sqs_browser_demo
$ aws dynamodb update-time-to-live --table-name demo-sqs-browser-sessions \
  --time-to-live-specification "Enabled=true, AttributeName=ttl"
```

An API Gateway method provides a session creation function that will return a set of Cognito AWS credentials an SQS Queue URL and an AES encryption key that will be needed to decrypt any messages.  The Cognito credentials can then be used to retrieve messages from the queue using [Long Polling](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-long-polling.html).  Generally, the session management API Gateway would be protected and users would not call it directly; but, instead be mediated by a component that provides authentication of the user.

The API Gateway uses IAM for authorization, which means any requests need to be signed.  To facilitate making authenticated API gateway calls, we use a script provided in the package, and it will use whatever credentials are provided by the environment.  To create a session for UserID 100, AccountID 200, with the given session ID:

```bash
./scripts/call_gw demo us-east-2 /create/100/200/cbbd5ab3-46e9-11e7-8d5e-f45c89b63a13
```

The response should be something similar to this:
```
{
    "session": {
        "sqsUrl": "https://us-east-2.queue.amazonaws.com/552185127352/cognito-sqs-demo-NSHo28H2GgEMsfOl_VMTiJNOzP8-149634",
        "sqsQueueName": "cognito-sqs-demo-NSHo28H2GgEMsfOl_VMTiJNOzP8-149634",
        "aesKey": "IpR6RqjQ8PgEGHdDdZC+zQ7Il/4n7QN9uWbwuMLlJ8U=",
        "accessKey": "ASIAJQGX3FT5YQDIQB2A",
        "expires": 1496348084,
        "userId": 200,
        "identityId": "us-east-2:8b24ff4e-61e4-4444-8d40-21e260a88902",
        "secretKey": "Jig2itF4/vNsQ1m1gO0NzIg4BfHTCw9beFOiqne2",
        "sessionId": "cbbd5ab3-46e9-11e7-8d5e-f45c89b63a13",
        "ttl": 1496351684,
        "sessionToken": "AgoGb3JpZ2luEFMaCXVzLWVhc3QtMiK...",
        "accountId": 100
    },
    "success": true
}
```

The *expires* field indicates the expiration time of the credentials.  You can open two shells and in one of them poll the SQS queue using the provided credentials.  In this case, we use the long-polling option and loop forever.  There's a long visibility timeout, as we aren't deleting the messages from the queue, so they'll otherwise pop back up quickly.  We also use a helper script [./scripts/decript-message](https://github.com/ReutersMedia/sqs-browser-events/blob/master/scripts/decrypt-message) to use the session's AES key to decript the message.

```bash
$ export AWS_ACCESS_KEY_ID=ASIAJQGX3FT5YQDIQB2A
$ export AWS_SECRET_ACCESS_KEY=Jig2itF4/vNsQ1m1gO0NzIg4BfHTCw9beFOiqne2
$ export AWS_SESSION_TOKEN=AgoGb3JpZ2luEFMaCXVzLWVhc3QtMiK...

$ while true; \
  do aws sqs receive-message --visibility-timeout 600 --wait-time-seconds 10 \
  --queue-url "https://us-east-2.queue.amazonaws.com/552185127352/cognito-sqs-demo-NSHo28H2GgEMsfOl_VMTiJNOzP8-149634” \
  | ./scripts/decrypt-message "IpR6RqjQ8PgEGHdDdZC+zQ7Il/4n7QN9uWbwuMLlJ8U=“ \
  ; done
```

In the other shell, you can generate messages for the user, to all users in the account, and broadcast a message to everyone:

```bash
$ ./scripts/call_gw demo us-east-2 /notify/user/200?message=Hello+User
$ ./scripts/call_gw demo us-east-2 /notify/account/100?message=Hello+Account
$ ./scripts/call_gw demo us-east-2 /notify?message=Hello+Everyone
```

In the first shell, you'll receive the following messages:

```json
{"message": "Hello User", "userId": 200, "messageId": "ypLM2huuI7tZXiUD1o_5wg9cQK8="}
{"message": "Hello Account", "accountId": "100", "messageId": "dZBMcHSPRlNkt9SUNUA4oADuEHk="}
{"message": "Hello Everyone", "messageId": "AlA2vIgiPmRVnBwZm25aRgXd2js="}
```

The stack offers a few other features, including retrieving the history of user messages, read-receipting messages, and posting read-receipts to SQS.  It also can accept messages from a Kinesis stream.

<img src="https://user-images.githubusercontent.com/832852/26846340-5e74dcc8-4ac7-11e7-8a9d-9439deccc03f.jpeg" width="800">


## Cognito Sessions and Message Security

The Cognito ID created for a user session only has access to SQS Queues.  Generally, one would restrict access to a specific resource through a policy that references the Cognito ID.  For example, the condition below, when added to a policy as a *Condition* element, would restrict access to a specific user pool and user ID.

```json
"StringEquals": {
    "cognito-identity.amazonaws.com:aud": "us-east-1:my-congito-pool-id",
    "cognito-identity.amazonaws.com:sub": "us-east-1:cognito-user-identity-id"
}
```

These are known as [policy condition keys](http://docs.aws.amazon.com/IAM/latest/UserGuide/reference_policies_condition-keys.html).  When you create an SQS queue, you can attach a [custom policy](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-creating-custom-policies.html) to the queue using the *Policy* queue attribute.  Theoretically one could create an SQS Queue and only grant access to a specific Cognito identity.  However, SQS currently supports a [very small set](http://docs.aws.amazon.com/AWSSimpleQueueService/latest/SQSDeveloperGuide/sqs-api-permissions-reference.html) of condition keys.  Unfortunately, the Cognito keys are not among them.  We've pointed out this deficiency to AWS, and explained its usefulness in helping craft serverless event-driven applications.  Since a little piece of me dies every time I have to manage another server, we decided to work around it.

The only solution that works at an arbitrarily high scale is to grant message read and delete access to all queues based on the name prefix of the queue.  The queue names are generated using a random 256 bit value generated by the Linux kernel using environmental entropy [/dev/urandom](https://linux.die.net/man/4/urandom), which is suitable for generating unguessable and secure Queue URLs.  Another 256 random bits are generated for an AES key that is used to encrypt and decrypt all messages.  This key is returned to the caller when creating a session and stored in the DynamoDB session table.  A random counter initialization value is used for the AES stream cipher and returned along with the encrypted message.  The *decrypt-message* script in the project provides an example Python implementation of decryption and a Javascript version is provided in the project's [documentation](https://github.com/ReutersMedia/sqs-browser-events).

Any set of Cognito credentials from the pool can be used to read and delete messages from any queue.  The Cognito [GetId method](http://docs.aws.amazon.com/cognitoidentity/latest/APIReference/API_GetId.html) is also public, so anyone with knowledge of the Cognito endpoint can generate ID's.  However, to access a Queue, one would need to know the random Queue name and URL. If they know the Queue URL, they can delete messages, but can't decrypt them without the private key.  Whether this provides sufficient security depends on the nature of the data being handled.  We hope however that AWS will at some point provide the tools necessary to secure a queue to a specific Cognito identity.

Access to the user message API Gateway endpoints is secured via IAM, meaning users can't directly call them.  In our case, access is mediated through a separate service that checks the user's credentials.

## Handling High Message Volumes

Dispatching messages to individual users is relatively easy to scale if they are injected through the API Gateway.  Messages that have to be broadcast to all users, or to accounts with a large number of users, can become more difficult.  Each message requires an AWS API call to SQS to insert into the queue, and a call to DynamoDB to add it to the user's message history.  Because these Lambda functions mostly wait on HTTPS requests to AWS and make light use of CPU resources, we use low memory allocations of 128MB or 256MB, making operation as economical as possible.  Multi-threading the operations, the [dispatcher Lambda](https://github.com/ReutersMedia/sqs-browser-events/blob/master/dispatcher.py) can only get off a few thousand API calls before timing out.  If you need to broadcast a breaking news event to 100,000 users, a single Lambda invocation will not suffice.

To achieve sufficient scale, the dispatcher only retrieves the list of recipients, and then splits the recipients into batches and dispatches these batches to separate Lambda functions that handle SQS message insertion and user history insertion, invoking them asynchronously.  We have tested this up to a few hundred thousand users.  This issue is unique to broadcast messages, and scaling beyond a few hundred thousand users is probably best done by splitting the broadcast message into account partitions.

For messages inserted through the API Gateway, scaling is relatively easy, as the API Gateway lambdas are unlimited in number, and the only element that needs to scale out is DynamoDB.  For messages inserted via Kinesis, processing the stream can be a bottleneck, as only one Lambda process will run for each shard.  We therefore have to clear the stream messages as quickly as possible, and it's advantageous to keep the Kinesis Lambda reader as light as possible and asynchronously dispatch the actual queue insertion operations to a separate Lambda which is not subject to scale limitations.

## Session Cleanup

All of the queues and Cognito identities need to be removed at some point.  The entries in the session table are all given a ttl, and DynamoDB will automatically delete them after some idle period.  Another Lambda function is connected to the table update stream, looks for queues and Cognito ID's that are no longer in use, and deletes them.

## Performance and Cost

In production we typically see a delivery delay for Kinesis injected messages of about 2 seconds before they appear in the user's browser or app.  This involves several serial operations: a Kinesis API call, delivery of the event to the dispatcher Lambda, a DynamoDB query to retrieve the recipient Queue list, invocation of the SQS queue insertion Lambda, a call to the SQS API to insert a message, and a call from the Browser to the SQS recieve-message endpoint using long-polling.  Periodically longer delivery delays can happen because of Lambda startup times.  A graph below shows the average event delay over a seven day period, for the 5th, 50th, and 95th percentiles in delivery time.  The average is just over 2 seconds and rarely will see 3 to 4 seconds.

![average message delivery times](https://cloud.githubusercontent.com/assets/832852/26739856/6fd67464-47a1-11e7-96d5-2766b291c64d.png)

Faster mechanisms can surely be implemented using fixed servers; however, so long as 2 seconds is an acceptable delay, the advantages in terms of scale and maintenance are significant.  As for cost, we roughly estimate each message consumes around 40 Megabyte-seconds of Lambda time (Lambda functions are billed in terms of Megabytes consumed and time taken, in 100ms chunks), which is the equivalent of around 300ms of a 128MB Lambda process.  Ignoring the cost of DynamoDB, which you'd have to pay for with any similar application, we can calculate the effective cost of the serverless stack.  We'll assume 1000 users, generating 1000 messages per day each, at 1,000,000 messages per day.  SQS costs are $0.00000040 per API call, with 1000 users polling every 10 seconds, and 3 API calls per message (adding, reading, deleting), so the cost per day is $0.0000004 * (1000*86400/10 + 1000*3) = $3.46/day.  For the Lambda functions, with an equivalent 300ms of a 128MB Lambda taken per message, at 1,000,000 messages per day, the cost is $0.000000208 * 1000000 * 3 = $0.624/day.  This gives a total cost of around $4 per day per 1000 users.

For 100,000 users and an aggregate 1200 messages per second, this comes to $400/day, or around $150k per year.  That sort of capacity you could probably handle with 2 or 4 well designed mid-range EC2 servers using Nginx and Redis, and only be out $5k or $10k per year.  So the operational costs are higher once you reach significant scale.  You probably over-provision fixed servers to accommodate load, even with auto-scaling.  Given the approximate 4x markup of Lambda functions over EC2 instances, if your servers are running at 25% load or less, you would probably save money going serverless.  In this example, the economics of serverless are a bit more expensive due to the high call volume to the SQS API coupled with the relatively short 10 second long-polling timeout, making cost increases closer to a factor of 20.  However, operational simplicity, time-to-market, and development costs can all make the choice favorable.  The low upfront costs are also beneficial.  The big bills don't come in until the product is successful, and once it's successful, it's easier to find the money.  Even once you do reach usage levels where economics might drive you to fixed servers, there are advantages to not worrying about provisioning.  Products are seldom static and new features and changes can impact capacity.  Not having to worry about the impact of new features on resource demands is liberating.

## Conclusion

Going completely serverless is still not a trivial task for all types of applications and support by Amazon is thin in areas.  In this case, we were able to expand the boundaries of serverless architectures by using SQS and Cognito to push events to a browser or app.  Using AWS to manage scaling, we eliminate the need for provisioning fixed servers.  Up to a certain point, in our case a few tens of thousands of users, it's also an economical solution. Even at larger scale, the benefits in operational and architectural simplicity may still outweigh the higher AWS bills.

There are still some gaps in features:  DynamoDB TTLs can't yet be managed via the serverless CloudFormation templates while SQS Queues don't support Cognito condition keys.  Amazon is constantly improving their offering and hopefully will expend more effort into supporting the serverless community.  Tooling is also improving rapidly.  Setting up connections between DynamoDB and Kinesis streams became much easier with the 1.9.0 Serverless release.  For some types of applications it requires rethinking the architecture, and there are some trade-offs.  That being said,we generally see a bright future for serverless architectures and have found advantages in them for applications that might at first glance not be a natural fit.
