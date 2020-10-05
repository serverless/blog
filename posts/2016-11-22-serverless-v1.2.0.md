---
title: Flexible Environment Variable Support for AWS Lambda - Serverless Framework V1.2
description: Environment variable support, optimized function packaging, per function IAM permissions, and new configuration options available in Serverless v1.2
date: 2016-11-22
layout: Post
authors:
  - PhilippMuns
---

Today we're proud to announce the new version 1.2.0 of the Serverless Framework.

## Highlights of 1.2.0

Let's take a look at the release highlights. You can find a list of all the changes in the [release changelog](https://github.com/serverless/serverless/releases/tag/v1.2.0).

### Environment variables

AWS just added native support for environment variables inside of Lambda functions a few days ago.

We're proud to announce that Serverless v1.2 ships with support for native environment variables as well! You can define environment variables on a service- or function level.

Here's an example of what this looks like:

```yml
# serverless.yml

provider:
  name: aws
  runtime: nodejs4.3
  environment:
    envOne: 12345678

functions:
  myFunction:
    environment:
      envTwo: 87654321
```

Environment variables can be even more useful if you use them together with Serverless Variables to reference dynamic values:

```yml
# serverless.yml

functions:
  myFunction:
    environment:
      apiKey: ${file(../keys.yml):apiKey}
```

### JavaScript Support for Serverless Variables

Serverless Variables now support raw JavaScript so that you can easily generate dynamic data. This makes the Serverless Variables even more powerful.

Here's a quick example that shows what this looks like:

```yml
# serverless.yml

functions:
  myFunction:
    environment:
      apiKey: ${file(./config.js):fetchApiKey}
```

```javascript
// config.js

module.exports.fetchApiKey = () => {
   // create / fetch dynamic data here (e.g. call an API)
   return someApiKey;
}
```

Possible use cases for this could be the fetching of data from a REST API (e.g. secrets) or the generation of random variable data (e.g. for testing).

### Include and Exclude for Packaging

Serverless recently introduced `globs` support for the `exclude` configuration.

Negated `glob` patterns (e.g. `!some-file` or `!some-directory/**`) can be used to include files and directories back again.

However, having the `include` configuration for this was way more convenient. 1.2.0 brings back `include` with `globs` support.

**Note:** Negated globs are still supported in both, `include` and `exclude`.

### Limited Lambda Permissions

Lambda permissions for event sources (S3, SNS, etc.) are now bound to the resource, which should trigger the Lambda function rather than enabling all event sources of a certain type to call the Lambda function.

This update tightens security and avoids unexpected behavior.

It's a change that will happen once you (re)deploy your service with Serverless 1.2 and will not introduce any breaking changes.

### Refactorings and Bug Fixes

We've fixed a bunch of bugs (thanks for bringing them up!) and also started our process of [codebase refactorings](https://github.com/serverless/serverless/issues/2645) which will improve the whole onboarding process for new contributors.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones) for Serverless. Check out the [1.3 milestone](https://github.com/serverless/serverless/milestone/17) to preview what you can expect in two weeks.

We hope that you have fun with the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [Github Issues](https://github.com/serverless/serverless/issues).

### Using Semver

Note that we're using [strict Semver](http://semver.org/) for our Serverless Framework versioning. This way you'll know when we introduce major features or breaking changes.

## Serverless Examples

We've created a new repository called ["examples"](https://github.com/serverless/examples) which is a dedicated place for Serverless service examples. The goal is to showcase different scenarios using serverless architecture and the Serverless Framework.

Feel free to contribute and add your example!

## Serverless Dashboard

The [Serverless Dashboard](https://github.com/serverless/dashboard) desktop application is a project we're working on to provide a user-friendly layer on top of the Serverless CLI.

The goal of the dashboard is to help enhance the user experience for the Serverless Framework. The new dashboard allows you to deploy your service, invoke a function or view the function logs with a single click.

You should definitely give it a spin! Please let us know what you think.

## Serverless LA Meetup

On December 7th we'll kick-off the [Serverless LA Meetup](https://www.meetup.com/Serverless-LA) series with interesting talks from Nick Gottlieb (Head of Customer Development at [Serverless, Inc.](https://serverless.com)) and Marc Campbell (CTO of [Replicated](https://www.replicated.com/)) about the Serverless Framework and serverless architectures. Join us if you're in LA!

## Serverless Survey

Your feedback is important in guiding the direction of the framework. Please take a few minutes and fill out [our survey](https://docs.google.com/a/serverless.com/forms/d/1F7rRx01NMDmmLiDiEzc0iKGTlyEx1RrzItRvvoe6a4A/edit?usp=drive_web) so that we can understand how you use the Serverless Framework and what your needs are.
