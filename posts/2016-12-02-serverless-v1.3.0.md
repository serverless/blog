---
title: Function metrics, AWS credential setup, Lambda versioning and invoke local improvements - Serverless Framework v1.3
description: Function metrics, AWS credential setup, Lambda versioning and invoke local improvements available in Serverless v1.3
date: 2016-12-02
layout: Post
---

We're proud to release the Serverless Framework v1.3.0 today.

## Highlights of 1.3.0

Let's take a look at the highlights of this release. You can find a list with all the changes in the [release changelog](https://github.com/serverless/serverless/releases/tag/v1.3.0).

### Function Metrics

Ever wondered how your functions are performing? The new `serverless metrics` lets you see all the function metrics such as invocations, throttles, errors and duration at a glance.

Just type in

```bash
serverless metrics --function myFunction
```

to see the metrics of the last 24h for your function `myFunction`.

You can even specify the timeframe you want to see the metrics with the `startTime` and `endTime` options.

```bash
serverless metrics --function myFunction --startTime 2016-11-28 --endTime 2016-12-02
```

will show you all the metrics between November, 28th and December, 2nd.

You can read more about the new metrics functionality in [the documentaion](https://serverless.com/framework/docs/providers/aws/cli-reference/metrics/).

### AWS Credential Setup

Setting up credentials should be streamlined in the overall Serverless experience. v1.3 adds a new command called `serverless config credentials` which helps you setup your AWS crendentials on your local machine.

This example will setup the `default` AWS profile with the provided key and secret:

```bash
serverless config credentials --provider aws --key someKey --secret someSecret
```

No need to configure the `credentials` file through the `aws-cli` anymore.

### Lambda versioning

Keeping a history of all your deployed Lambda functions is an important feature if you e.g. want to rollback to a specific function. Serverless now supports automatic Lambda versioning with the help of the build in Lambda versions AWS provides.

You don't need to change anything. Just deploy your service as usual and Serverless will version your Lambda functions from now on.

### Refactorings and Bug Fixes

We've also fixed a bunch of bugs (thanks for bringing them up!) and also continued our process of [codebase refactorings](https://github.com/serverless/serverless/issues/2645) so that it's easier for new contributors to get aboard.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.4 milestone](https://github.com/serverless/serverless/milestone/18) to see what you can expect in two weeks.

We hope that you have fun with the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

### Using Semver

Note that we're using [strict Semver](http://semver.org/) for our Serverless Framework versioning. This way you'll know when we introduce major features or breaking changes.
