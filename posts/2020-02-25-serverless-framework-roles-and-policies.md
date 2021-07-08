---
title: Avoiding IAM Role Creation by the Serverless Framework
description: "A guide to manual IAM creation with the Serverless Framework for organizations requiring restrictive permissions."
date: 2020-02-25
thumbnail: ""
heroImage: ""
authors:
  - FernandoMedinaCorey
category:
  - guides-and-tutorials
---

Imagine that you work at a large enterprise with a heavy AWS footprint or in a heavily regulated industry with stringent security requirements. You probably have an individual (or an entire team) dedicated to maintaining appropriate permissions for AWS users and their applications. Because of this, you might lock your AWS down to only allow human users to create and assign IAM roles, rather than allowing applications themselves to do this.

This is a completely understandable approach, especially for cases like the ones I just mentioned. However, because the Serverless Framework helps to automate hard parts of using AWS (like IAM Role generation) you'll need to learn how to use the framework without it creating any IAM roles on your behalf.

Let's look at how we can do this. 

## When Would I Need This Guide?

This guide is meant to help people working with the Serverless Framework in locked down AWS environments. Specifically, environments in which allowing the Serverless Framework to create a role of ambiguous permissions is not allowable or acceptable from a security perspective.

## Reviewing IAM Role Creation in the Serverless Framework

There are several roles that may be used and created by the Serverless Framework, but they differ depending on how the framework is used. Here are a few that will appear in a basic implementation when creating a new service and using [Serverless Pro](https://dashboard.serverless.com/):

1. **IamRoleLambdaExecution** - This is the role used by your service's Lambda functions
2. **EnterpriseLogAccessIamRole** - This role allows dashboard log subscription filters which allow [Framework Pro](https://dashboard.serverless.com/) to fetch log data about your Lambda Functions and display it to you in something like the Invocation Explorer
3. **IamRoleCustomResourcesLambdaExecution** - This role is used in some cases when we create a Custom Resource Lambda Function in order to do something like:
  - Creating EventBridge integrations
  - Creating Cognito User Pools
  - Enabling API Gateway Logging to CloudWatch (See #4)
4. **serverlessApiGatewayCloudWatchRole** - This role allows API Gateway to send data to CloudWatch.

Let’s look at how to prevent these from being created by CloudFormation when the Serverless Framework deploys a service to AWS.


## #1 - IamRoleLambdaExecution

There are several ways to resolve this role being created for you. You can:

- Provide your own premade service-wide role to apply to the Lambda Functions
- Provide a function-specific role to each Lambda Function

To provide your own premade role to all functions in the service you would create the role in AWS and then add the Role ARN as the provider.role configuration value like this:

```yaml
provider:
  role: arn:aws:iam::XXXXXX:role/role
```

You would need to make sure this role had the appropriate trust policies set up to be used by AWS Lambda.

Alternatively, you can specify a role specific to each function in the function configuration:

```yaml
functions:
  someFunction:
    handler: handler.handler
    role: arn:aws:iam::XXXXXX:role/role
```

Either of these methods should remove the IamRoleLambdaExecution role from the created CloudFormation resources.

## #2 EnterpriseLogAccessIamRole

This role is created for the Serverless Dashboard to receive log data from CloudWatch Log Subscription Filters. To avoid creating this role you can create a role and a trust policy that allows it to be assumed by the Serverless Dashboard AWS account. You then reference the role in serverless.yml:

```
custom:
  enterprise:
    logAccessIamRole: arn:aws:iam::XXXXXX:role/role
```

The simplest way to do this across services would be to use an IAM role with a permission policy that grants access to all relevant log groups under `/aws/lambda/` on your account. For example:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "logs:FilterLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:<account-id>:log-group:/aws/lambda/*"
            ],
            "Effect": "Allow"
        }
    ]
}
```

If you feel this is too broad, you could also create scoped IAM roles for every service. Here is an example of the required permissions using a very scoped role:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Action": [
                "logs:FilterLogEvents"
            ],
            "Resource": [
                "arn:aws:logs:us-east-1:<account-id>:log-group:/aws/lambda/<log-group-name>:*"
            ],
            "Effect": "Allow"
        }
    ]
}
```

If you opt for this route, you’ll need to make sure `<log-group-name>` above is replaced with the name of the log group that will be created. Be default, this will match this structure:

`<service-name>-<stage>-<function-name>`

For example a service with a service name of "users-service" and function name of "demoFunction" deploying to dev would be: `users-service-dev-demoFunction`.

The `<account-id>` will be your numeric AWS account ID.

Either way you setup the role, it will also require a trust permission policy that authorizes your Organization and the Serverless Dashboard AWS account to use this role:
 
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "arn:aws:iam::802587217904:root"
      },
      "Action": "sts:AssumeRole",
      "Condition": {
        "StringEquals": {
          "sts:ExternalId": "ServerlessEnterprise-<org-Uid>"
        }
      }
    }
  ]
}
```

In order to get your `org-Uid`, you can submit a support request to us and we'll grab it for you. It is not the same as your `org` value in serverless.yml. 

## #3 IamRoleCustomResourcesLambdaExecution

This role is not always created. When it is, it is used by CloudFormation Lambda Custom Resources in order to create some resources that CloudFormation does not natively support. You can avoid creating this role by setting the provider.cfnRole. 

```yaml
provider:
  cfnRole: arn:aws:iam::XXXXXX:role/role
```

The role you select will need to have a variety of permissions depending on the custom resources you need to deploy. For example, if you deploy EventBridge events or Cognito User Pools we require permissions for various API actions on those services to integrate with them. Because we use the Custom Lambda function to create those additional resources, the role will need a trust policy that includes the AWS Lambda service. You may also need to add a trust policy for CloudFormation to use this role.

In some cases, we also use the Custom Resource Lambda function itself to configure a role that will allow API Gateway to send Logs to CloudWatch. This happens when you enable logs in your Serverless.yml file:

```yaml
provider: 
  logs:
    restApi: true
```

If you do not want this IAM role to be created by the custom resource you can specify the provider.logs.restApi.role config value to an existing role instead like this:

```yaml
provider: 
  logs:
    restApi:
      role: arn:aws:iam::XXXXXX:role/role
```

When creating this role you will need to attach an IAM policy to it that allows API Gateway to send logs to CloudWatch. You can do this by:

1. Creating a new role in IAM
2. Attaching the `AmazonAPIGatewayPushToCloudWatchLogs` policy (this is an AWS-created service policy)
3. Adding a trust policy that allows API Gateway to use this policy/role
4. Updating the provider.logs.restApi.role config shown above to the ARN of the role you created.

Then when you deploy, you should be able to have API Gateway logs without any roles created from the CloudFormation stack or the custom resources inside of it. 

## #4 serverlessApiGatewayCloudWatchRole

By default, when you want to use Framework Pro API Gateway monitoring, we will try to create an entire account-wide Role that can be used by API Gateway to push logs to CloudWatch. Creating it yourself can spare you from having to specify the provider.logs.restApi.role for every service as we will look for it in your account first before we try to create it ourselves. 

Essentially, you need to create a role called `serverlessApiGatewayCloudWatchRole`. You then need to configure that role as specified in steps one through four at the bottom of section #3 above. This will involve adding the `AmazonAPIGatewayPushToCloudWatchLogs` policy to the role and configuring the trust policy for that role.

## What Next?

Well, now you should have a better understanding of some of the common policies and roles created by the Framework on your behalf. This should allow you to determine which, if any, you're comfortable with it managing for you. It should also give you the context you need to fix CloudFormation issues associated with an inability to deploy those roles or allow you to review the policies used by the framework more closely as you like.
