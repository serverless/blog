---
title: Serverless Framework Release - 1.1.0
description: Today we're releasing 1.1.0 of the Serverless Framework
date: 2016-10-27
layout: Post
authors:
  - PhilippMuns
---

With the release of 1.0 a few weeks ago we're now settling into our bi-weekly release cycle and can announce our next release today with 1.1.0.

We decided to go with a bi-weekly release cycle to force us to release new features and bug fixes quickly and to really focus on shipping for our community. At the same time we're investing heavily in unit tests, integration tests, code review and really making sure that our stability is high.

## Using Semver

From now on we're going to use [strict Semver](http://semver.org/) for Serverless. So if we jump to 2.0 or 3.0 don't be surprised.

## Highlights of 1.1.0

Following are a few highlights, you can check out all the details of the release [in the Changelog](https://github.com/serverless/serverless/releases/tag/v1.1.0).

### Invoke functions locally

You can run `serverless invoke local -f FUNCTION_NAME` to run functions on your system. You can even set event data. Take a look at the [invoke documentation](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke/) for more details. This is currently only available for Node.js functions.

### Rollback

You can now get a list of releases stored in your S3 deployment bucket with `serverless deploy list` and use the timestamps of those deployments for rollback with `serverless rollback -t TIMESTAMP`.

### Version Pinning

To make sure we can release new updates quickly and you don't accidentally deploy with a wrong version of Serverless we implemented [version pinning](https://serverless.com/framework/docs/providers/aws/guide/version/).

Simply set `frameworkVersion: "1.0.3"` in your `serverless.yml` file and Serverless will refuse any commands if the version doesn't match. We use Semver for this match as well, so you're able to define ranges or any other Semver config.

### Service local plugins
You can now create plugins in a `.serverless_plugins` folder and they can be committed to your repository, making it extremely easy to extend different commands for specific services. Check out [the plugin documentation](https://serverless.com/framework/docs/providers/aws/guide/plugins#service-local-plugin) to learn more.

There are many many more features and fixes we released. Check them out to learn more.

### Next steps

We're currently filling up the next Milestones for Serverless. You can check out the [1.2 milestone](https://github.com/serverless/serverless/milestone/16) and keep up with the milestones in general in our Github repository.

Have fun with the new release and let us know if you have any feedback or questions in [our Forum](http://forum.serverless.com/) or [Github Issues](https://github.com/serverless/serverless/issues)
