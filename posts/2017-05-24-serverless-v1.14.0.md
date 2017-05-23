---
title: Google Cloud Functions support added in Serverless v1.14 deploy your functions to the Google Cloud
description: Google Cloud Functions, Rollback function, DeadLetterConfig, Automatic stack splitting, Login command and more in the Serverless Framework v1.14 release.
date: 2017-05-24
layout: Post
authors:
  - PhilippMuns
---

We're thrilled to announce the v1.14 release of the Serverless Framework!

This release is yet another special one since we're officially announcing our Google Cloud Functions integration with the Serverless Framework.

But this isn't everything we've been working on. Let's take a look at the full feature set v1.14 introduces.

## Highlights of 1.14.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Google Cloud Functions support

We're proud to announce official support for deployment on the Google Cloud with the help of our [Google Cloud Functions Provider plugin](https://github.com/serverless/serverless-google-cloudfunctions).

Adding the `google` integration continues our multi-provider support story and gives you the 4th provider to choose from when you're about to build your next serverless project.

Curious how to get started? Let's take a look!

The easiest way to get started is to follow our [quickstart guide](https://serverless.com/framework/docs/providers/google/guide/quick-start/) in our docs.

You might also want to check out our [Google HTTP endpoint example](https://github.com/serverless/examples/tree/master/google-node-simple-http-endpoint) in our [Serverless Examples](https://github.com/serverless/examples) repository.

**Protip:** Google offers a free $300 credit if you create a Google Cloud account via their [Free Trial link](https://console.cloud.google.com/freetrial).

### Rollback function support

The Serverless Framework has offered the `rollback` command, which rolls your stack back to a specific state, since version `1.1.0`. This command has proven very popular as a way of rolling back infrastructure changes.

However shortly after we released this command it became apparent that it was not ideal for cases in which users only want to rollback code changes for a single function. Creating an entirely new stack is slow, inconvenient, and overkill for this simply rolling back a single function.

With Serverless v1.14 we're excited to add support for quickly and easily rolling back single functions to a specific version.

Let's take a look at an example to see how this works in practice.

Let's say we've accidentally ran a `serverless deploy` which updated our functions code and introduced a bug.

First we could take a look at all the functions and their available versions for the service that we're working on by running `deploy list functions`

```bash
serverless deploy list functions
```

We can see that our latest versions is `15` so we want to rollback our function to version `14`.

Next up we simply run:

```bash
serverless rollback function -f hello -v 14
```

This will roll back our function `hello` to version `14`.

**Important:** Rolling back a single function is an operation which should be used in an emergency situation as it might put the stack into a non atomic state. Serverless will directly push the function code into the function without going through a whole stack deployemnt through CloudFormation (which will be significantly slower).

It's recommended to issue a `serverless deploy` with the updated / fixed code some time after rolling back to put the service into a stable state again.

**Note:** Lambda versioning needs to be enabled to use this feature. Serverless automatically adds versioning support for your Lambda functions unless you've opted out. See [our docs](https://serverless.com/framework/docs/providers/aws/guide/functions#versioning-deployed-functions) for more information on Lambda versioning.

### DeadLetterConfig support

With Serverless v1.14 you can use `DeadLetterConfig` support natively in Serverless.

We've implemented the `onError` config parameter which you can sepcify on a function level. All you need to do is plug in your `SNS` topic `arn` and re-redploy your stack.

Once done you can react to failed Lambda calls with your `SNS` topic.

Here's an example configuration to showcase the usage:

```yml
service: service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello
     onError: arn:aws:sns:us-east-1:XXXXX:test
```

You can read more about this feature in [our docs](https://serverless.com/framework/docs/providers/aws/guide/functions/#deadletterconfig).

**Note:** Serverless currently only supports `sns` topic arns due to a race condition when using SQS queue arns and updating the permissions in the IAM role. We're currently looking into this so that we can add support for SQS topic arns soon!

### Automatic stack splitting to mitigate resource limitations (experimental)

Serverless uses [AWS CloudFormation](https://aws.amazon.com/cloudformation/) behind the scenes to help you manage and deploy your AWS resources.

CloudFormation resources will be removed, updated or added whenever you deploy configuration changes in your `serverless.yml` file.

One common problem with CloudFormation is that during development developers will create a lot of stacks and quickly run in to CloudFormation's strict [resource limitations](http://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cloudformation-limits.html).

Serverless v1.14 adds support to mitigate this problem!

You can use the `useStackSplitting` provider config variable to tell Serverless to automatically split your CloudFormation stack into different nested stacks on a per-function basis.

Serverless will anaylze your `serverless.yml` file and create a dedicated nested stack for each function and their related resources.

You won't notice any difference using this feature since Serverless will treat your `serverless.yml` the same way it always has. However behind the scenes the deployment process will be different since your whole service will be deployed with multiple stacks.

**Important:** This feature is still experimental. It was tested with different, really complex services throughout development. However there might be still some edge-cases where it could potentially uncover some bugs. Furthermore this feature is a one-way road. Once enabled it's pretty hard to go back to a single stack deployment. If you're looking for more control of the stack / service splitting process you might want to check out our support for ["Cross Service Communication"](https://serverless.com/framework/docs/providers/aws/guide/variables#reference-cloudformation-outputs) or the AWS intrinsic function `Fn::ImportValue`.

### Login command

- https://github.com/serverless/serverless/pull/3558

### Support for `s3` variables

Serverless v1.14 adds another Serverless Variable called `s3`. This enables  a way to reference values in a S3 bucket (e.g. stored credentials).

Here's how you can use this new Serverless Variable in your `serverless.yml` file:

```yml
service: service

provider:
  name: aws
  runtime: nodejs6.10
  environment:
    myKey: ${s3:my-bucket/my-key}

functions:
  hello:
    handler: handler.hello
```

You can read more about this feature in our [docs about Serverless Variables](https://serverless.com/framework/docs/providers/aws/guide/variables#referencing-s3-options).

### Support for `serverless.json`

Serverless v1.14 adds support for `serverless.json`. This allows you to write your service specification in plain JSON:

```yml
service: service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello
```

is the same as:

```json
{
  "service": "service",
  "provider": {
    "name": "aws",
    "runtime": "nodejs6.10"
  },
  "functions": {
    "hello": {
      "handler": "handler.hello"
    }
  }
}
```

**Note:** You can only have one `serverless.xyz` in your services directory. Serverless will try to load the YAML service at first.

### More API Gateway integration types and AWS_IAM auth support

The `http` event definition was updated and now supports the `HTTP`, `HTTP_PROXY` and `MOCK` integration types:

```yml
functions:
  create:
    handler: handler.create
    events:
      - http:
          path: test/create
          method: GET
          integration: mock
          request:
            headers:
              Content-Type: "'application/json'"
            template:
              application/json: '{ "statusCode": 200 }'
          response:
            headers:
              Content-Type: "'text/html'"
            template: "Hello World"
            statusCodes:
              200: # headers and templates defaults to the values defined above
                pattern: ''
```

Furthermore you can use the `aws_iam` authorization type:

```yml
functions:
  create:
    handler: handler.create
    events:
      - http:
          path: create
          method: POST
          authorizer: aws_iam
```

More information about all the new config parameters can be found in our [API Gateway docs](https://serverless.com/framework/docs/providers/aws/events/apigateway/).

### Access to `IS_LOCAL` environment variable during local invocation

Ever faced the situation where you've invoked your Lambda function locally with the `invoke local` command and accidentally triggered a request against a service which should only be used in production?

Serverless v1.14 has you covered and adds a `IS_LOCAL` environment variable which is available during local invocation.

Here's an example how you can use this feature:

```javascript
'use strict';

module.exports.hello = (event, context, callback) => {
  if (process.env.IS_LOCAL != 'true') {
    // send some analytics data to the tracking system used in production
    sendAnalytics({
      some: 'data',
    });
  }

  // ... normal processing
};
```

### Enhancements & Bug Fixes

This release also includes a bunch of bug fixes and several enhancements.

> Thanks for reporting bugs and opening issues!

### Contributors

This release contains lots of hard work from our awesome community, and wouldn't have been possible without passionate people who decided to spend their time contributing to make Serverless better.

Thank You to all of the contributors who submitted changes for this release:

- John Doe

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Want to help us build the best Serverless tooling out there?

Contributing isn't just about code! Chime in on [discussions](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback), help with [documentation updates](https://github.com/serverless/serverless/labels/kind%2Fdocs) or [review Pull Requests](https://github.com/serverless/serverless/pulls).

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

Furthermore, we're always seeking feedback from our community to build the features in the best way possible. [Here's a list](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) with issues where we need your feedback and insights in your real world usage of Serverless.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.15 milestone](https://github.com/serverless/serverless/milestone/30) to see what we have planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can install and therefore enhance the capabilities of the Framework.

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins)

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
