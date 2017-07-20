---
title: Serverless v1.17 - F# service template, deployment skipping when files not changed added
description: F# service template, deployment skipping when files not changed and more in the Serverless Framework v1.17 release.
date: 2017-07-06
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-release-1.17.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-release-1.17.png" width="210px" >

Today we're happy to announce the new Serverless Framework v1.17 release!

v1.17 provides new features, enhancements, and bugfixes. Let's take a deep dive into the new features v1.17 introduces.

## Highlights of 1.17.0

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file or watch the video below.

Kudos to Ryan H. Lewis ([@ryanmurakami](https://twitter.com/ryanmurakami)) for taking the time to record this video!

<iframe width="560" height="315" src="https://www.youtube.com/embed/rmNJCRPzegs" frameborder="0" allowfullscreen></iframe>

### F# service template

With Serverless v1.17 you can now create and deploy F# service templates to AWS.

You can bootstrap your new F# service with the help of the `serverless create --template` command:

```bash
serverless create --template aws-fsharp --path my-fsharp-service
```

Next up you need to build the project:

```bash
cd my-fsharp-service

./build.sh
```

After that you're ready to deploy and invoke your first F# function:

```bash
serverless deploy

serverless invoke --function hello
```

The F# service template supports all the configs and event sources you can find in [our AWS documentation](https://serverless.com/framework/docs/providers/aws/).

### Skip deployment if files not changed

Starting now, Serverless will automatically compare your current service files on disk to the remotely uploaded service files of your last deployment.

A re-deployment is only triggered if at least one of the files are different.

This feature is enabled by default and works for the `serverless deploy` and the `serverless deploy function` commands.

However you can still force a deployment by specifying the `--force` option like this:

```
serverless deploy --force
```

or

```
serverless deploy function --function func1 --force
```

### Enhancements & Bug Fixes

This release also includes tons of bug fixes and several other improvements.

> Thank you very much for reporting bugs, opening issues and joining the discussions!

### Contributors 

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make Serverless better.

Thank you to all of the contributors who submitted changes for this release:

- Christopher "Chief" Najewicz
- Hassan Khan
- James Thomas
- John Ferlito
- Linda Nichols
- Mike Hostetler
- Ryan Lewis
- Scott Willeke
- Simon Dittlmann
- Stuart Lang
- Sunny
- gorankl
- k1LoW

## The Road Ahead

Serverless has a really open, helpful, and vibrant community which joins forces to build the best Serverless toolings out there.

We've already started to fill the next [1.18 milestone](https://github.com/serverless/serverless/milestone/33) with issues and Pull Requests. Feel free to jump into the issue discussions or implementations for the upcoming features!

The current milestone is not the only way to find areas for contributions! We've got a couple of different issues and PRs which are just waiting for feedback, implementation or code review.

Just filter by [our labels](https://github.com/serverless/serverless/labels) to find areas where you can help!

**Aside:** Contributing isn't just about writing code! Feel free to chime in on [issue discussions](https://github.com/serverless/serverless/issues) or [review Pull Requests](https://github.com/serverless/serverless/pulls).

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or our [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about the Serverless Framework and serverless architectures in general.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can install and therefore enhance the capabilities of the Framework.

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hesitate to open up a PR over there if you've authored or found a new Serverless plugin!
