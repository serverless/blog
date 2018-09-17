---
title: "The ABCs of IAM: Managing permissions with Serverless"
description: Learn the basics of IAM permissions with your Serverless projects.
date: 2017-11-14
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/abcs-of-iam-permissions.jpg
category:
  - guides-and-tutorials
  - operations-and-observability
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/abcs-of-iam-permissions.jpg'
authors:
  - AlexDeBrie
---

When getting started with Serverless, one of the hardest things to grok is IAM—[AWS Identity and Access Management](https://aws.amazon.com/iam/).

IAM is how you manage access to resources in your AWS account. Who is allowed to create a Lambda function? To _delete_ a function?

This isn't the only IAM guide you'll ever need, but you should understand how IAM works with Lambda and the Serverless Framework. We'll cover the basics of IAM to get you on your way.

In this guide, we'll go over:

- Basic IAM concepts
- The two kinds of IAM entities with the Serverless Framework
- Managing permissions for the Serverless Framework user
- Managing permissions with your Lambda functions

Let's get started!

#### Basic IAM concepts

There are three basic concepts you should understand in the world of IAM: users, roles, and permissions.

An **IAM user** is pretty close to what it sounds like—a user that is created to interact with AWS. Usually, this is an actual person within your organization who will use the credentials to log into the AWS console.

This person often has _access keys_ to programmatically interact with AWS resources. Access keys consist of an "access key ID" and a "secret access key". Together, they can authenticate a particular user to AWS to access certain resources.

You might use them with the [AWS CLI](https://aws.amazon.com/cli/) or a particular language's SDK, like [Boto3](http://boto3.readthedocs.io/en/latest/) for Python.

An **IAM role** is similar to an IAM user, but is meant to be assumed by anyone or anything that needs to use it.

An IAM user could assume an IAM role for a time, in order to access certain resources. An IAM role could also be assumed by another AWS service, such as an EC2 instance or a Lambda function.

Your Lambda function assuming an IAM role will be important later when we discuss [managing permissions with your Lambda functions](#managing-permissions-for-your-lambda-functions).

Finally, an **IAM permission** is a statement that grants/blocks an action(s) on a resource or set of resources. An IAM permission contains three elements: _Effect_, _Action_, and _Resource_. (It may optionally include a _Condition_ element, but that's outside the scope of this article.)

* **Effect** tells what effect the IAM permission statement has—whether to Allow or Deny access. Generally, an IAM user does not have access to AWS resources. Most IAM permissions have an Effect of "Allow" to grant access to a particular resource. Occasionally, you might have an Effect of "Deny" to override any other "Allow" permissions.

* **Action** tells what action an IAM user or role can take as a result of the IAM permission statement. An Action has two parts: a service namespace and the action in that namespace. For example, the Action of `s3:GetObject` affects the GetObject action in the s3 service namespace. You can use wildcards in the Action, such as `ec2:*` to allow all actions in the EC2 namespace, or simply `*` to allow all actions anywhere. (Hint: Don't do this).

* **Resource** tells what resources the permission statement affects. The value is an [ARN](http://docs.aws.amazon.com/general/latest/gr/aws-arns-and-namespaces.html) or list of ARNs to which the statement applies. This lets you give permissions on a more granular basis, such as limiting the ability to query a particular DynamoDB table rather than granting the ability to query _all_ DynamoDB tables in your account. Like the Action element, you can use the wildcard `*` to apply the statement to _all_ resources in your account.

To make this more concrete, let's see one of these statements in action.

Imagine you've created a DynamoDB table named "my-new-table", and it has the ARN of `arn:aws:dynamodb:us-west-2:111110002222:table/my-new-table`. Now, you want to create a policy that allows your application to do read & write commands against your table.

You would have a policy like:

```json
{
  "Version": "2012-10-17",
  "Statement": {
    "Effect": "Allow",
    "Action": [
    	"dynamodb:Query",
    	"dynamodb:Scan",
    	"dynamodb:GetItem",
    	"dynamodb:PutItem",
    	"dynamodb:UpdateItem",
    	"dynamodb:DeleteItem"
    ],
    "Resource": "arn:aws:dynamodb:us-west-2:111110002222:table/my-new-table"
  }
}
```

We see the three permission elements noted above. The Effect is "Allow", which grants the listed actions on the listed resources.

The Action block contains a list of needed DynamoDB actions, such as GetItem, PutItem, and Query. Notice that it does not include CreateTable and DeleteTable—that is more of an administrative role that your application wouldn't need.

Finally, the Resource block has our table's ARN. This limits the scope of the permissions to our table only, so our application wouldn't have the ability to query other tables in our AWS account.

**IAM permissions** can be attached to **users** or **roles** (or other things that we won't cover here). This means you can create an AWS user and give it the permission to create DynamoDB tables, view CloudWatch logs, or any of the many other things you can do with AWS.

#### The Two Types of IAM entities with the Serverless Framework

When talking about IAM permissions with the Serverless Framework, there are two different entities (users or roles) that you need to worry about:

- The IAM user used _by the Framework_ to deploy your Serverless service (the **Framework user**)
- The IAM role used _by a Lambda function_ when it's executed (a **function role**).

To see the distinction, consider the example application in our [Express REST API walkthrough](https://serverless.com/blog/serverless-express-rest-api/). In that example, we deploy an Express application with a DynamoDB table backing it.

When we run `sls deploy` to deploy the application, we need to be concerned about the IAM user used by the Framework. This is the user referenced to by the `profile` property in the `provider` block of your `serverless.yml`, or the "default" profile if you don't set it. The Framework will look in `~/.aws/credentials` for your access keys, then deploy your application.

In deploying your application, your IAM user will need permissions to:

- Create an S3 bucket for your function deployments
- Upload your function zip files to that S3 bucket
- Submit a CloudFormation template
- Create the log groups for your Lambda functions
- Create a REST API in API Gateway
- Create a DynamoDB table

Once your service is deployed, you have a different set of IAM issues to worry about. The functions handling your HTTP requests have permissions issues of their own—they need the ability to query the DynamoDB tables and send log messages to CloudWatch.

With this understanding in mind, let's walk through how we configure and manage the **Framework user** and how we manage the IAM permissions for our **function roles**.

#### Managing permissions for the Serverless Framework user

Let's talk about IAM permissions for the Serverless Framework user. This is any permissions that are required when you run a command with the Serverless Framework, such as `sls deploy` or `sls logs`.

The Framework is making its calls to AWS using the Node [aws-sdk](https://aws.amazon.com/sdk-for-node-js/). This means credentials are generally loaded from a file in `~/.aws/credentials` (for Mac/Linux users) or `C:\Users\USERNAME\.aws\credentials` for Windows users.

If you haven't set up permissions before, you'll need to create an IAM user with access keys and the required permissions. There are basically two ways you can approach this:

- **Fast but risky (aka [YOLO](https://www.youtube.com/watch?v=z5Otla5157c)):** The fastest way to get started with Serverless is to create an IAM user with Administrator Access. This IAM user will have full access to your AWS account and **should not** be used for your company's production AWS account. The best approach here is to create a new AWS account or a new [AWS organization](https://aws.amazon.com/organizations/) with limited ability to affect other resources. This will give you the widest latitude to experiment with Serverless without getting tangled in a web of IAM permissions.

> Check out a video to create a user with Administrator Access [here](https://www.youtube.com/watch?v=KngM5bfpttA).

- **Slow but safe:** If you're using Serverless in production, you'll want more tightly-scoped permissions. With security, you generally want to follow the [principle of least privilege](https://en.wikipedia.org/wiki/Principle_of_least_privilege). For AWS, this means your Serverless IAM user shouldn't have the ability to alter the Lambda functions and resources of other services in your AWS account. This can be quite difficult but is worth the added security, particularly in a production account.

One of our community members has contributed a [Yeoman generator template](https://github.com/dancrumb/generator-serverless-policy). This generator makes it much easier to create a narrow IAM policy template that will cover many Serverless use cases.

To use it, first install Yeoman and the `serverless-policy` generator:

```bash
$ npm install -g yo generator-serverless-policy
```

Then run the generator and answer the prompts:

```bash
$ yo serverless-policy
? Your Serverless service name test-service
? You can specify a specific stage, if you like: dev
? You can specify a specific region, if you like: us-west-1
? Does your service rely on DynamoDB? Yes
? Is your service going to be using S3 buckets? Yes
app name test-service
app stage dev
app region us-west-1
Writing to test-service-dev-us-west-1-policy.json
```

This will create a JSON file in your working directory with permissions scoped to your service. It's not perfect, but it will get you closer.

Create an IAM user with that policy file—or ship it to the person in charge of IAM security at your company—and you should be on your way.

#### Managing permissions for your Lambda Functions

The second aspect of IAM with Serverless is the permissions for your Lambda functions themselves. If your functions read from a DynamoDB table, write to an SQS queue, or use a KMS key to decrypt a string, they'll need to be given specific permission to do that.

You can add these additional permission statements directly in your `serverless.yml`. To add these permissions, use the `iamRoleStatements` section of the `provider` block.

Let's use our DynamoDB example from the first section:

```yml
provider:
  name: aws
  runtime: nodejs6.10
  iamRoleStatements:
    - Effect: "Allow"
      Action:
       - dynamodb:Query
       - dynamodb:Scan
       - dynamodb:GetItem
       - dynamodb:PutItem
       - dynamodb:UpdateItem
       - dynamodb:DeleteItem
      Resource: "arn:aws:dynamodb:us-west-2:111110002222:table/my-new-table"
```

This block gives our functions the ability to query, scan, and manipulate items on a particular DynamoDB table.

**Pro-tip**: You can use [CloudFormation Intrinsic Functions](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/intrinsic-function-reference.html) to make it easier to refer to specific resources. For example, if you've created your DynamoDB table in the `resources` section of your `serverless.yml`, you can use the `Fn::GetAtt` intrinsic function to get the ARN:

```yml
# serverless.yml

resources:
  Resources:
    MyDynamoTable:
      ... Rest of CloudFormation defining the table ...

provider:
  name: aws
  runtime: nodejs6.10
  iamRoleStatements:
    - Effect: "Allow"
      Action:
       - dynamodb:Query
       - dynamodb:Scan
      Resource:
        Fn::GetAtt:
          - MyDynamoTable
          - Arn
```

Here, we dynamically grab the DynamoDB table ARN by using `Fn::GetAtt`, and pass in the logical Id of the resource `MyDynamoTable` from the `resources` block. Then we request the `Arn` property.

You can see which attributes are available for a particular CloudFormation resources by checking the `Return Values` section of the CloudFormation reference—see [here for a DynamoDB example](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-dynamodb-table.html#w2ab2c21c10d328c13).

You can also craft [custom IAM roles](https://serverless.com/framework/docs/providers/aws/guide/iam#custom-iam-roles) for each function in your `serverless.yml`, but be advised this is an advanced feature. You'll need to make sure to specify _all_ permissions of your functions, including some that Serverless usually handles for you, such as the ability to write to CloudWatch logs.

There's a [`serverless-puresec-cli`](https://github.com/puresec/serverless-puresec-cli) plugin that assists in this process. Puresec scans your functions to see which AWS resources they're accessing and how to automatically create least-privilege roles. It doesn't cover all resources yet, but it is a good start if you're interested.

#### Conclusion

IAM permissions are complex, and there's a lot more to learn than what is covered in this article. But this should be a great starting point.

Live long and permission. 🖖
