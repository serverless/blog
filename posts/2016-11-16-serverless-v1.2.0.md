---
title:  Better Packaging, Permission & Configuration features for AWS Lambda - Serverless Framework V1.2
description:  Serverless Framework Release - 1.2.0
date:  2016-11-16
layout:  Post
---

It has been two weeks since we started with our bi-weekly release cycle. Today we're proud to announce the new version 1.2.0 of the Serverless Framework.

## Using Semver

Note that we're using [strict Semver](http://semver.org/) for our Serverless Framework versioning. This way you know when we introduce major features or breaking changes.

## Highlights of 1.2.0

Let's take a look at a the highlights. You can find all the changes in the [release changelog](https://github.com/serverless/serverless/releases/tag/v1.2.0).

### JavaScript support for Serverless Variables

Serverless Variables now suppot raw JavaScript so that you can generate dynamic data easily. This makes the Serverless Variables even more powerful.

Here's a quick example which shows you how this looks like:

```yml
# serverless.yml

functions:
  myFunction:
    role: ${(./config.js):fetchRoleARN}
```

```javascript
// config.js

module.exports.fetchRoleARN = () => {
   // create / fetch dynamic data here (e.g. call an API)
   return roleARN;
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

## Serverless examples

We've created a new repository called ["examples"](https://github.com/serverless/examples) which is a dedicated place for Serverless service examples. The goal is to showcase different scenarios where the serverless architecture and the Serverless Framework can be used.

Feel free to contribute and add your example!

## Serverless Dashboard

The [Serverless Dashboard](https://github.com/serverless/dashboard) desktop application is our experiment to enable an even more convenient way to work with the Serverless Framework.

It helps you e.g. to deploy your service, invoke a function or view the function logs with a single click.

You should definitely give it a spin! Please let us know what you think.

## Serverless LA Meetup

On December 7th we'll kick-off the [Serverless LA Meetup](https://www.meetup.com/Serverless-LA) series with interesting talks from Nick Gottlieb (Head of Customer Development at [Serverless, Inc.](http://serverless.com)) and Marc Campbell (CTO of [Replicated](https://www.replicated.com/)) about the Serverless Framework and serverless architectures.

## Serverless Survey

Your feedback is an important way for us to guide the direction of the framework. Please take a few minutes and fill out [our survey](https://docs.google.com/a/serverless.com/forms/d/1F7rRx01NMDmmLiDiEzc0iKGTlyEx1RrzItRvvoe6a4A/edit?usp=drive_web) so that we can understand how you use the Serverless Framework and what your needs are.
