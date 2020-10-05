---
title: Serverless v1.22 - CLI-based plugin discovery, encrypted variables support and new provider SpotInst
description: CLI based plugin management, SSM via Serverless Variables, Spotinst Functions support, enhancements, bug fixes and more added in the Serverless Framework v1.22 release.
date: 2017-09-14
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-v1.22.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-v1.22.png" width="130px" >

Today we're proud to announce Serverless Framework v1.22.

This release is another one which is packed with a lot of great features and enhancements! Let's take a closer look at all
the changes v1.22 introduces.

## Whats new

<iframe width="560" height="315" src="https://www.youtube.com/embed/ykkeliDAs-c" frameborder="0" allowfullscreen></iframe>

## Noteable changes v1.22 introduces

You can find a complete list of all the updates in the [CHANGELOG.md](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) file.

### Spotinst Functions provider support

After releasing the [Kubeless provider integration](https://serverless.com/blog/serverless-v1.21.0/) with v1.21 we're doing it again.

This time we're proud to announce the official "Spotinst Functions" provider integration. Spotinst will help you dramatically reduce your FaaS costs by leveraging spot instances. You could save between 50% and 80% compared to standard serverless FaaS pricing.

Eager to give it a try?

Just follow the ["Quick Start"](https://serverless.com/framework/docs/providers/spotinst/guide/quick-start/) instructions in our docs!

Also make sure to read the [announcement blog post](https://serverless.com/blog/running-multi-cloud-functions-at-spot-instance-prices/) to learn more about [Spotinst Functions](https://spotinst.com/products/spotinst-functions/).

### CLI based plugin management with the `serverless plugin` command

It's finally here! Serverless supports a way to browse, install and uninstall Serverless plugins from within the CLI.

No need to add the plugin of your choice manually to `serverless.yml` or run `npm` side-by-side with the Serverless CLI.

Let's assume we want to install a `Webpack` plugin for our Serverless service.

We can run `serverless plugin search --query webpack` to search for all the available Serverless plugins which add Webpack support to the Serverless Framework:

```bash
root@64d555c6e40a:/app# serverless plugin search --query webpack
2 plugin(s) found for your search query "webpack"

serverless-plugin-webpack - A serverless plugin to automatically bundle your functions individually with webpack
serverless-webpack - Serverless plugin to bundle your lambdas with Webpac

To install a plugin run 'serverless plugin install --name plugin-name-here'

It will be automatically downloaded and added to your package.json and serverless.yml file
```

After deciding which plugin to use we simply run `serverless plugin install --name serverless-webpack`:

```bash
root@64d555c6e40a:/app# serverless plugin install --name serverless-webpack
Serverless: Creating an empty package.json file in your service directory
Serverless: Installing plugin "serverless-webpack@latest" (this might take a few seconds...)
Serverless: Successfully installed "serverless-webpack@latest"
```

That's it. Serverless will do all the heavy lifting behind the scenes (creating an empty `package.json` file (if not yet present), installing the plugin with its peer dependencies, adding the plugin to the `serverless.yml` file, ...). After doing that we're off the races.

If we want to remove a plugin from our service we simply run the `serverless plugin uninstall` command:

```bash
root@64d555c6e40a:/app# serverless plugin uninstall --name serverless-webpack
Serverless: Uninstalling plugin "serverless-webpack" (this might take a few seconds...)
Serverless: Successfully uninstalled "serverless-webpack"
```

**Note:** Serverless pulls plugin information from the official [`serverless/plugins` repository](https://github.com/serverless/plugins). Make sure to add yours if you want your plugin to be installable via the CLI as well.

**Aside:** The old way of using `npm` to install / uninstall plugins will continue to work as well!

### SSM Parameters in Serverless Variables

AWS SSM Parameters are a great and recommended way to share encrypted variables between and within services.

Serverless v1.22 introduces support for SSM Parameters via the Serverless Variables system.

Let's assume that we've set the following SSM Parameters:

```bash
aws ssm put-parameter --name foo --value bar --type SecureString
aws ssm put-parameter --name bar --value foo --type String
aws ssm put-parameter --name /foo/bar --value bar --type SecureString
aws ssm put-parameter --name /bar/foo --value foo --type String
```

We could access those values in your `serverless.yml` file as follows (where `~true` means that the value will be decrypted):

```yml
service:
  name: my-service

provider:
  name: aws
  runtime: nodejs6.10

custom:
  foo: ${ssm:foo}
  bar: ${ssm:bar~true}
  fooBar: ${ssm:/foo/bar}
  barFoo: ${ssm:/bar/foo~true}
  
# ...snip...
```

You can read more about the AWS SSM Parameter support in Serverless Variables in the [corresponding documentation](https://serverless.com/framework/docs/providers/aws/guide/variables#reference-variables-using-the-ssm-parameter-store).

### Update function config when running `deploy function`

The `deploy function` command is an easy and fast way to update the functions code without the need to go through a full `serverless deploy`. `deploy function` will push a function's code directly into the Lamdba function making it way faster than a CloudFormation stack update.

From now on `deploy function` will also update the function's configuration. So making quick changes to your function's settings is even easier.

**Note:** Remember that doing a `deploy function` will put your Stack into an inconsistent state since the function and its configuration is different than the one which is described via CloudFormation. A subsequent `serverless deploy` will overwrite this state completely.

`deploy function` should only be used for faster development cycles. Production deployments should always be done via `deploy` (and therefore through CloudFormation).

### New `aws-kotlin-jvm-maven` service template

[Kotlin](https://kotlinlang.org/) is a new programming language which gained significant traction when Google announced the partnership for their Android project.

Since Kotlin can run on different platforms such as the JVM it's theoretically possible to run it on AWS Lambda as well.

Serverless v1.22 ships with the new `aws-kotlin-jvm-maven` template which makes it possible to create Kotlin-based Serverless services!

Creating a new Kotlin service is as easy as:

```bash
serverless create --template aws-kotlin-jvm-maven
```

**Aside:** There's already a [WIP PR](https://github.com/serverless/serverless/pull/4239) which adds support for a Kotlin service template which utilizes the Node.js runtime.

### Other enhancements & bug fixes

This release also includes tons of other improvements and bug fixes.

> Thank you very much for reporting bugs, opening issues and joining the discussions!

We hope that you enjoy this release! Feel free to provide some feedback in our [Forum](https://forum.serverless.com), via [Twitter](https://twitter.com/goserverless) or on [GitHub](https://github.com/serverless/serverless).

### Contributors 

This release contains lots of hard work from our beloved community, and wouldn't have been possible without passionate people who decided to spend their time contributing back to make the Serverless Framework better.

Huge round of applause to all of the contributors who submitted changes for this release:

- Daniel Schep
- Frank Schmid
- Iddar Olivares
- Javier Arellano
- Loren Gordon
- Marc Sluiter
- Mariusz Nowak
- Mislav Cimperšak
- Rafal Wilinski
- Takahiro Horike
- Toby Hede
- forevermatt

## Upcoming releases / contributions

In addition to the [1.23 milestone](https://github.com/serverless/serverless/milestone/38) and its Issues and PRs, we still have lots and lots of other [Issues](https://github.com/serverless/serverless/issues) and [PRs](https://github.com/serverless/serverless/pulls). We'd love to implement and introduce these in some of the upcoming releases.

> Do you want to help out and improve the Serverless Framework?

Great! We've compiled a list with some of the most wished features to make it easier for you to find areas where we could most use a hand.

### Deploy many micro/nano services to one API Gateway

[Issue #3078](https://github.com/serverless/serverless/issues/3078)

We already started a WIP implementation with the following [PR](https://github.com/serverless/serverless/pull/3934), but for now it only provides a partial solution. Do you have any ideas how we can improve the support for this feature?

### Unable to create services with a high resource count

[Issue #2387](https://github.com/serverless/serverless/issues/2387)

Services can grow significantly in size. We've worked on different solutions for this problem (see [this PR](https://github.com/serverless/serverless/pull/3504)) but we're still not 100% there yet.

### Support for AWS API Gateway Basic Request Validation

[Issue #3464](https://github.com/serverless/serverless/issues/3464)

We're currently looking for a way to implement basic request validation via raw CloudFormation.

### Let resources depend on the ApiGateway::Deployment

[Issue #2233](https://github.com/serverless/serverless/issues/2233)

The `ApiGateway::Deployment` resource has a random string in its name so that deployments are re-triggered on AWS end.

This makes it hard to create other CloudFormation resources which dependend on it.

### Skip resource if already exists

[Issue #3183](https://github.com/serverless/serverless/issues/3183)

It would be nice to skip resource delpoyments if the corresponding resource already exists (e.g. when using DynamoDB tables). Could you think of a reliable, production ready way that will detect which resources deployments could be skipped?

### Global arn parser with intrinsic functions (Ref, Fn::GetAtt, Fn::ImportValue, ...) support

[Issue #3212](https://github.com/serverless/serverless/issues/3212)

`arns` are used everywhere in CloudFormation. However some of our event sources don't support all the different types of intrinsic functions which can be used to reference `arns`.

It would be great to have a global `arn` parser which can be re-used throughout the whole codebase. This parser could also be exposed to the framework user e.g. via `this.provider.findAllCfReferences()`, so that plugin authors can benefit from this functionality as well.

### Other issues and PRs

This list is just a gist with some of the most wished features from our community.

We have lots of other [issues](https://github.com/serverless/serverless/issues) where you could leave some feedback or jump directly into the implementation.

Additionally [PR reviews](https://github.com/serverless/serverless/pulls) are also highly welcomed as they greatly speed up the time-to-merge.

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples, or learn more about the Serverless Framework and serverless architectures in general.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can use to further enhance the capabilities of the Framework. You can find the full list at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
