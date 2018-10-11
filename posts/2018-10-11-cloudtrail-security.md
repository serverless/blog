---
title: "Using AWS CloudTrail to enhance your serverless application security"
description: "Learn how to harness AWS CloudTrail to enhance your serverless application security posture."
date: 2018-10-11
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudtrail-security/cloudtrail-security-serverless.jpg'
category:
  - operations-and-observability
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudtrail-security/cloudtrail-security-serverless.jpg'
authors:
  - OrySegal
---

CloudTrail is one of those AWS services that folks usually take for granted. It’s been there doing it’s thing for a while, but unless you really had a good reason to use it, you wouldn’t.

Tracking events in your serverless functions is a start on the path to rock solid security, but there are a wealth of activities in any serverless platform that can have an unexpected effect on your application’s security.

In this post, we’ll talk about [AWS CloudTrail](https://aws.amazon.com/cloudtrail/) audit trail logging. Specifically, how it can help enhance your AWS Lambda security, and in general increase your control over what’s going on in your cloud environment. 

#### CloudTrail & AWS Lambda: brief overview

CloudTrail is enabled by default on every AWS account once the account is created. When a supported event activity occurs in AWS Lambda, that activity is stored in a CloudTrail event, along with other AWS service events in the “Event History” console.

#### Event History: misconceptions best practices

Many people mistakenly get the impression the “Event History” is everything there is in CloudTrail, but there’s much more you can actually do with it. 

##### Creating a trail

In order to maintain an ongoing record of events in an AWS account, users must first create a “trail”.

A trail enables CloudTrail to deliver log files to an Amazon S3 bucket. Once logs are stored in S3, they can be queried using SQL queries on the trails through [AWS Athena](https://docs.aws.amazon.com/athena/latest/ug/cloudtrail-logs.html). This is by far more efficient than “grepping” through JSON log dumps.

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudtrail-security/cloudtrail-create.png "Enabling CloudTrail on AWS Lambda")

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cloudtrail-security/cloudtrail-athena.png "Querying CloudTrail Logs With AWS Athena")

By default, when you create a trail in the AWS management console, the trail applies to all AWS regions. It logs events from all regions in AWS and delivers the log files to the Amazon S3 bucket that you specify.

##### CloudTrail logs

You can also configure other AWS services to further analyze and act upon the event data collected in CloudTrail logs.

Note that not all AWS Lambda actions and data are available. At the time of writing, the following AWS Lambda actions are logged in CloudTrail:

* AddPermission
* reateEventSourceMapping
* CreateFunction
* DeleteEventSourceMapping
* DeleteFunction
* GetEventSourceMapping
* GetFunction
* GetFunctionConfiguration
* GetPolicy
* ListEventSourceMappings
* ListFunctions
* RemovePermission
* UpdateEventSourceMapping
* UpdateFunctionCode
* UpdateFunctionConfiguration
 
##### Data event logging

If you turn on _data event_ logging, CloudTrail will also log function invocations, so you can see which identities are invoking the functions and the frequency of their invocations.

One thing I wish it had is the ability to store actual event (payload) data, or at least some samples of it. But that’s not currently available, unfortunately. Put it on your #AWSwishlist. ;)

Here’s an example of an AWS Lambda function invocation, triggered by an S3 `PUT` event. As you can see, this gives us easy access to the identity of the invoker, the source of the invocation, the AWS Lambda function ARN, the ARN of the invoking S3 bucket, etc:

key|value
---|-----
eventversion|1.06
useridentity|{type=AWSService, principalid=null, arn=null, accountid=null, invokedby=s3.amazonaws.com, accesskeyid=null, username=null, sessioncontext=null}
eventtime|2018-09-25T07:08:06Z
eventsource|lambda.amazonaws.com
eventname|Invoke
awsregion|us-east-1
sourceipaddress|s3.amazonaws.com
useragent|s3.amazonaws.com
errorcode|
errormessage|
requestparameters|{"sourceAccount":"617****84847","invocationType":"Event","functionName":"arn:aws:lambda:us-east-1:617****84847:function:test-s3-change-dev-hello","sourceArn":"arn:aws:s3:::www.sls-hacker.xyz","contentType":""}
responseelements|null
additionaleventdata|{"functionVersion":"arn:aws:lambda:us-east-1:617****84847:function:test-s3-change-dev-hello:$LATEST"}
requestid|c0223c9a-c091-11e8-ac5e-a14b38a845af
eventid|b7ed9fda-09af-49d7-9bcc-6d27669e36ae
resources|[{arn=arn:aws:lambda:us-east-1:617033284847:function:test-s3-change-dev-hello, accountid=617033284847, type=AWS::Lambda::Function}]
eventtype|AwsApiCall
apiversion|
readonly|FALSE
recipientaccountid|617****84847
serviceeventdetails|
sharedeventid|b4bf3003-bb3d-4b88-8511-2ba2e5265904
vpcendpointid|

#### Verifying request formats? Not without some help.

Let’s back up and talk serverless security basics for a minute.

Unlike a traditional web application, which has well-defined call paths that can be traced for every request, a serverless function can have multiple triggers. Serverless security should start with simply verifying that a call to a serverless function is legitimate.

To do this, you’ll first need to verify that the source and structure of the call are legitimate.

##### Verifying legitimacy with CloudTrail, vs other security platforms

Each Lambda invocation is logged in CloudTrail as it occurs. The event payload, however, is not logged. So verifying the source caller might be possible, but verifying event structure is not. Boooo.

If you feel adventurous, you can try to code such a security verification directly into your serverless function. I.e., examine the call parameters in a validation function to ensure they meet the expected execution requirements. By marrying in-function verification with CloudTrail external monitoring, you can validate that your serverless functions are being called by the intended invocation source and with the right event format.

Is this really possible? Maybe. Is it easy? Definitely not.

If you don't want to go the path of building out your own in-depth function validations, you can use a serverless security platform like [PureSec](https://www.puresec.io/product).

#### Audit Logs Using CloudTrail

So we’ve covered the unclear request path. Now let’s talk about serverless application configuration, which can also be a sticking point.

Compliance requirements for various government data protection regulations (GDPR, SOC2, etc.) stipulate that an application must be able to provide logs of application behavior. And AWS CloudTrail was designed with this case in mind.

Here’s a sample log value, demonstrating a configuration change done on a Lambda function (taken from AWS’ excellent [documentation](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-event-reference.html)):

```
{
    "eventVersion": "1.05",
    "userIdentity": {
        "type": "IAMUser",
        "principalId": "AIDAJ*******JPU7I2",
        "arn": "arn:aws:iam::61*******47:user/someuser",
        "accountId": "61*******47",
        "accessKeyId": "ASIAY7******XV7FOV",
        "userName": "someuser",
        "sessionContext": {
            "attributes": {
                "mfaAuthenticated": "false",
                "creationDate": "2018-09-25T06:57:35Z"
            }
        },
        "invokedBy": "signin.amazonaws.com"
    },
    "eventTime": "2018-09-25T07:05:47Z",
    "eventSource": "s3.amazonaws.com",
    "eventName": "PutBucketNotification",
    "awsRegion": "us-east-1",
    "sourceIPAddress": "10.162.29.212",
    "userAgent": "signin.amazonaws.com",
    "requestParameters": {
        "notification": [
            ""
        ],
        "bucketName": "www.some-bucket.xyz",
        "NotificationConfiguration": {
            "xmlns": "http://s3.amazonaws.com/doc/2006-03-01/",
            "CloudFunctionConfiguration": {
                "CloudFunction": "arn:aws:lambda:us-east-1:61*******47:function:test-s3-change-dev-hello",
                "Event": "s3:ObjectCreated:*",
                "Id": "cbf21635-380e-4a26-92e9-de9e32f4fe7d"
            }
        }
    },
    "responseElements": null,
    "additionalEventData": {
        "vpcEndpointId": "vpce-6d72a204"
    },
    "requestID": "C5092625A5414B89",
    "eventID": "41a7b514-4d6f-41bb-974c-2864dede35eb",
    "eventType": "AwsApiCall",
    "recipientAccountId": "61*******47",
    "vpcEndpointId": "vpce-6d72a204"
}
```

We can see the details of the user who performed the change, as well as the nature of the change. In this case, the user configured the Lambda function `test-s3-change-dev-hello` to receive notifications from the s3 bucket named ‘www.some-bucket.xyz'.

CloudTrail can also track changes throughout your AWS account, allowing you to trace any infrastructure modification back to its source. This includes details on the login that initiated the configuration change, timestamps, and other associated data that will allow you to fully track your application’s environment configuration. 

#### CloudTrail & Automation

One of the most significant benefits of enabling CloudTrail for your AWS Lambda serverless functions comes from the built-in automation functionality.

CloudTrail lets you set up notifications, messages, and alerts that trigger off of configuration events in your AWS ecosystem. This means you can react to configuration errors and potential security risks as they are introduced. [For example](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudwatch-alarms-for-cloudtrail.html), trigger a CloudWatch Alert when there is a specific type of activity being done on an S3 bucket. 

Automation is pretty critical in serverless development as a whole, and that’s no less true for serverless security. With strict use of automated verification and validation, you can test and document your serverless execution environment, creating a robust and predictable application that has all the benefits of a serverless application while enjoying the security of a more traditional architecture.

#### Summary

Serverless development has a security challenge: how do developers meet existing regulatory schemes and requirements that were designed for a more traditional application architecture?

The answer: with infrastructure and application audit logs, call paths, and code side effects. 

When your infrastructure is decentralized in a cloud-native environment, this becomes more difficult, yes. But it is far from impossible. You just need a little additional configuration and attention.

By enabling CloudTrail for AWS Lambda, you can gain audit trail logging easily, including both application functionality logs as well as application environment configuration logs.

If you’ve got any questions about serverless security, hit me up in the comments!

##### Further reading

- [Fantastic Serverless security risks, and where to find them](https://serverless.com/blog/fantastic-serverless-security-risks-and-where-to-find-them)
- [How to monitor AWS account activity with CloudTrail, CloudWatch events and Serverless](https://serverless.com/blog/serverless-cloudtrail-cloudwatch-events)
