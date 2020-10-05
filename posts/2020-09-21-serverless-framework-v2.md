---
title: Serverless Framework V2
description: "Dropping support for older Node.js versions, to improve security and performance"
date: 2020-09-21
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-09-21-serverless-framework-v2/serverless-framework-v2.png"
authors:
  - AustenCollins
category:
  - news
---

We recently released our first (minimal) set of breaking changes in the [Serverless Framework](https://github.com/serverless/serverless), in over 4 years, prompted by deprecating support for old Node.js versions.  These breaking changes are included in the new [v2 release](https://github.com/serverless/serverless/releases/tag/v2.0.0).

Here is a quick article to detail the breaking changes and how they may impact you.

## Deprecating Support for Node.js Version 6 and 8

You will now need Node.js v10 or higher installed locally to use the Serverless Framework.  At the time of this release, AWS Lambda supports only Node.js v10 or higher as well.  Dropping old Node.js versions allows us to upgrade dependencies with potential security vulnerabilities, making the Serverless Framework more secure.

## Run the Locally Installed Version by Default

If you have the Serverless Framework CLI installed locally within your Service (i.e. project) folder, that version of the Framework will be run, instead of a globally installed version.

Otherwise, if the Framework is not installed loclly, but is installed globally, it will default to that.

## AWS HTTP API, Lambda Integration

Amazon's new API Gateway product, "HTTP API", has updated its initial payload format (v1.0) for its AWS Lambda integration.  We've decided to use the new payload format (v2.0) as the default format.

More info here: https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-develop-integrations-lambda.html

## AWS ALB Config Change

Support for `providers.alb.authorizers[].allowUnauthenticated` setting was removed. Please now rely on `providers.alb.authorizers[].onUnauthenticatedRequest` instead.

## Moving Forward

Generally, we have avoided breaking changes to avoid creating unnecessary churn.  We continue to feel this way.

At the same time, we have decided to adopt true [semantic versioning](https://semver.org/) for the Serverless Framework.  Again, we don't intend to make large, breaking changes in the future.  But we want to be more clear when that is the case.

As always, many thanks to our community for their continued support.  Continue making amazing serverless applications!

[Learn more about the V2 release here](https://github.com/serverless/serverless/releases/tag/v2.0.0)
