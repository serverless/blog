---
title: Serverless v1.14 - Deploy to Google Cloud Functions & rollback function support added
description: Google Cloud Functions, Rollback function, DeadLetterConfig, Login command and more in the Serverless Framework v1.14 release.
date: 2017-05-24
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-google-cloudfunctions-square.jpg
authors:
  - PhilippMuns
---

We're thrilled to announce the v1.14 release of the Serverless Framework!

This release is yet another special one since we're officially announcing our Google Cloud Functions integration with the Serverless Framework.

But this isn't the only thing we've been working on. Let's take a look at the full feature set v1.14 introduces.

## Highlights of 1.14.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Google Cloud Functions support
<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-google-cloudfunctions.png">

We're proud to announce official support for deployment the the Google Cloud Platform with the help of our [Google Cloud Functions Provider plugin](https://github.com/serverless/serverless-google-cloudfunctions).

Adding the `google` integration strengthens the multi-provider support of the framework and gives you a 4th provider to choose from when building your next serverless project.

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

We've implemented the `onError` config parameter which you can specify at the function level. All you need to do is plug in your `SNS` topic `arn` and re-deploy your stack.

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

### Login command

We're excited to introduce the `serverless login` & `serverless logout` commands for the Serverless CLI.

We are adding these commands in preparation of our upcoming platform release.

Run `serverless login` to create your account.

```bash
serverless login
```

If you already signed up for a beta account, you can connect the CLI with your beta account with the `sls login` command.

The login functionality also will give us the power to personalize & improve the framework onboarding experience. Our mission is to help users learn and adopt the serverless ecosytem as fast as possible!

We are investing heavily on improving the overall developer experience of the framework and would love to hear [your thoughts on other UX/DX initiatives](https://github.com/serverless/serverless/issues?utf8=%E2%9C%93&q=dx%20)

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

- Alex Oskotsky
- Andre Rabold
- Doug Moscrop
- Frank Schmid
- Helen Yau
- Mark Chance
- Tom Saleeba

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

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
