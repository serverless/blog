---
title: Serverless v1.15 - CLI autocomplete & Cognito User Pool trigger events added
description: CLI autocomplete, Cognito User Pool Trigger event source, KMS Key support and more in the Serverless Framework v1.15 release.
date: 2017-06-09
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-v115.png
authors:
  - PhilippMuns
---

<img align="right" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-v115.png" width="210px" >

Today we're happy to announce the v1.15 release of the Serverless Framework!

This release includes lots of new features, improvements and bugfixes. Let's take a look at the full feature set v1.15 introduces.

## Highlights of 1.15.0

You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md) or watch the video below. Kudos to [ryanmurakami](https://twitter.com/ryanmurakami) for recording the video!

<iframe width="560" height="315" src="https://www.youtube.com/embed/o1-vyHJ9J8Y" frameborder="0" allowfullscreen></iframe>

### CLI autocomplete

Ever found yourself looking through the [docs](https://serverless.com/framework/docs/) or the CLI help menu to figure our what the exact command usage you're about to use looks like?

Serverless v1.15 introduces autocompletion which will assist you while working with the CLI tool.

Autocomplete is enabled automatically once you've updated to v1.15. You can make use of it by simply double tapping the Tabulator (tab) key while partially entering Serverless commands.

`serverless de<tab>` will expand to `serverless deploy`. All possible commands will be displayed if there is no exact match for the query you entered. This will also work for custom commands which are added via 3rd party Serverless plugins.

Autocomplete is also supported for options. So `serverless deploy --st<tab>` will expand to `serverless deploy --stage`.

This feature is another step towards are more user-friendly developer experience as it heavily decreases the cognitive load while working on your project.

Are you curious what other DX improvements are currently in the pipeline? Take a look at our [DX issues](https://github.com/serverless/serverless/issues?utf8=%E2%9C%93&q=is%3Aissue%20is%3Aopen%20DX%3A%20) and give a thumbs-up for your favorite feature or open up a new issue if you can't find what you're looking for.

### Cognito User Pool Trigger event

Serverless v1.15 adds support for the new `cognitoUserPool` event source which enables a way to react to Cognito User Pool triggers.

Let's take a look at an example where we configure our `greet` function to be called whenever the `PreSignUp` User Pool trigger is triggered:

```yml
service: my-service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  greet:
    handler: handler.greet
    events:
      - cognitoUserPool:
          pool: MyUserPool
          trigger: PreSignUp
```

The `cognitoUserPool` event source has lots of other configuration parameters. You can read more about them in [our docs](https://serverless.com/framework/docs/providers/aws/events/cognito-user-pool/).

### KMS Key support

Support to define your own KMS keys for encryption was a highly requested feature from our community.

The newly added `awsKmsKey` config parameter finally enables a way to specify your own custom KMS Key `arn` to e.g. encrypt your environment variables.

This parameter can be specified on a per-function or service-wide level.

Here's a simple example of what this looks like:

```yml
service:
  name: my-service
  awsKmsKeyArn: arn:aws:kms:us-east-1:XXXXX:key/service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  hello:
    handler: handler.hello
    awsKmsKeyArn: arn:aws:kms:us-east-1:XXXXX:key/function
    environment:
      KEY1: hello
  goodbye:
    handler: handler.goodbye
    environment:
      KEY2: goodbye
```

More information about this config can be found in [KMS key docs](https://serverless.com/framework/docs/providers/aws/guide/functions/#kms-keys).

### Validation of CloudFormation template

Serverless v1.15 ships with support to validate the CloudFormation template before kicking off the deployment phase.

This feature could heavily improve the feedback loop because developers don't have to wait for a failing deployment to see that their CloudFormation template might include some (trivial) errors such as cyclic dependencies.

This feature is enabled by default and is especially helpful when you `serverless deploy` your own deployment packages which might be generated or modified by another plugin / tool.

### `serverless.json` support

Usually you write your services definition in a `serverless.yml` or `serverless.yaml` file.

v1.15 finally adds support for `serverless.json`. This way you can write your service specification in plain JSON:

```yml
service: my-service

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
  "service": "my-service",
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

**Note:** You can only have one `serverless.*` file in your services directory. Serverless will try to load the YAML service definition first.

### `--aws-profile` option support

AWS profile support was one of the features which shipped with Serverless from the very beginning. However up until now it was not convenient to switch / use other profiles for deployment since you had to pre-define them in your `serverless.yml` file or use other workarounds to switch between them.

With v1.15 you're able to specify the profile which should be used for the operation you want to perform via the `--aws-profile` CLI option.

A deployment with the help of the `qa` profile would look like this:

```bash
serverless deploy --aws-profile qa
```

**Note:** `--aws-profile` support is not limited to the `deploy` command but can be used with every other command as well.

### Enhancements & Bug Fixes

This release also includes a bunch of bug fixes and several enhancements.

> Thanks for reporting bugs and opening issues!

### Contributors 

This release contains lots of hard work from our awesome community, and wouldn't have been possible without passionate people who decided to spend their time contributing to make Serverless better.

Thank You to all of the contributors who submitted changes for this release:

- Dan Root
- David Humphrey
- Frank Schmid
- Hassan Khan
- James Thomas
- RichardSlater
- Ryan Lewis
- Sam Marks
- Taylor Hurt
- Tom Saleeba
- Xancar
- depotjoe

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Want to help us build the best Serverless tooling out there?

Contributing isn't just about code! Chime in on [discussions](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback), help with [documentation updates](https://github.com/serverless/serverless/labels/kind%2Fdocs) or [review Pull Requests](https://github.com/serverless/serverless/pulls).

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

Furthermore, we're always seeking feedback from our community to build the features in the best way possible. [Here's a list](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) with issues where we need your feedback and insights in your real world usage of Serverless.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.16 milestone](https://github.com/serverless/serverless/milestone/31) to see what we have planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.

## Serverless Plugins

Serverless provides a completely customizable and pluggable codebase. Our community has written a vast amount of awesome plugins you can install and therefore enhance the capabilities of the Framework.

A list with all the different plugins can be found at our [Serverless Plugins Repository](https://github.com/serverless/plugins).

Don't hestitate to open up a PR over there if you've authored or found a new Serverless plugin!
