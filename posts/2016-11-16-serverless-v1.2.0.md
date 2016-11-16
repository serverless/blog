---
title:  Serverless Framework Release - 1.2.0
description:  Better Packaging, Permission & Configuration features for AWS Lambda - Serverless Framework V1.2
date:  2016-11-16
layout:  Post
---

It has been two weeks since we started with our bi-weekly release cycle. Today we're proud to announce the new version 1.2.0 of the Serverless Framework.

Serverless 1.2.0 comes with many great enhancements and additions. Let's take a quick look at what's changed.

## Using Semver

Note that we're using [strict Semver](http://semver.org/) for our Serverless Framework versioning. This way you know when we introduce major features or breaking changes.

## Highlights of 1.2.0

Let's take a look at a the highlights. You can find all the changes in the [release changelog](https://github.com/serverless/serverless/releases/tag/v1.2.0).

### JavaScript support for Serverless Variables

Serverless Variables now suppot raw JavaScript so that you can generate dynamic data easily. This makes the Serverless Variables even more powerful.

Here's a quick example which shows you how this looks like:

```yml
# serverless.yml

provider:
  stage: ${file(./confg.js):dynamicData}
```

```javascript
// config.js

module.exports.dynamicData = function() {
  // Synchronous logic is executed here
  return 'dev';
}
```

Some uses cases for this might be the fetching of data from a REST API (e.g. secrets) or the generation of random variable data (e.g. for testing).

### Include and exclude for packaging

Serverless recently introduced `globs` support for the `exclude` configuration.

Negated `glob` patterns (e.g. `!some-file` or `!some-directory/**`) can be used to include files and directories back again.

However having the `include` configuration for this was way more convenient. 1.2.0 brings back `include` with `globs` support.

**Note:** Negated globs are still supported in both, `include` and `exclude`.

### Limited Lambda permissions

Lambda permissions for event sources (S3, SNS, etc.) are now bound to the resource which should trigger the Lambda function rather than enabling all event sources of a type to call the Lambda function.

This update tightens the security and avoids unexpected behavior.

It's a change which will happen once you (re)deploy your service with Serverless 1.2 and will introduce no breaking changes.

### Refactorings and bugfixes

We've fixed a bunch of bugs (thanks for bringing them up!) and also started our process of [codebase refactorings](https://github.com/serverless/serverless/issues/2645) which will make the whole onboarding process for new contributors even easier.

### Next steps

We've already started to fill up the next [milestones](https://github.com/serverless/serverless/milestones) for Serverless. Check out the [1.3 milestone](https://github.com/serverless/serverless/milestone/17) to see what to expect in two weeks.

We hope that you have fun with the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [Github Issues](https://github.com/serverless/serverless/issues).
