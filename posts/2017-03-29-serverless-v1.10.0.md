---
title: Faster Deployment for Large Services, Support for Node.js 6.10 Runtime with Serverless v1.10
description: Faster deploy times for large services, support for Node.js 6.10 runtime, Groovy service template and more in the Serverless Framework v1.10 release.
date: 2017-03-29
layout: Post
authors:
  - PhilippMuns
---

We've just released v1.10 of the Serverless Framework! Let's take a look at all the new features.

## Highlights of 1.10.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### Support for Node.js 6.10 Runtime

AWS recently announced that Lambda [now supports Node.js 6.10](https://aws.amazon.com/about-aws/whats-new/2017/03/aws-lambda-supports-node-js-6-10/).

Serverless has got you covered. All the new Node.js services you create with the help of the `serverless create --template aws-nodejs` command ship with the new Node.js 6.10 runtime out of the box.

However, if you've got an old service and want to use the new runtime you simply need to update the `runtime` property in your `serverless.yml` file:

```diff
provider:
  name: aws
- runtime: nodejs4.3
+ runtime: nodejs6.10
```

**Note:** Please make sure to check the breaking changes an update to `nodejs6.10` introduces so that your service still works flawlessly.

[Breaking changes between v4 and v5](https://github.com/nodejs/node/wiki/Breaking-changes-between-v4-and-v5)
[Breaking changes between v5 and v6](https://github.com/nodejs/node/wiki/Breaking-changes-between-v5-and-v6)

### AWS Groovy Gradle Template

You can now use the `aws-groovy-gradle` template option when creating a new service:

```bash
serverless create --template aws-groovy-gradle
```

This creates a basic Serverless service for Groovy on the JVM which uses the `gradle` build tool.

### Faster Deploy Times for Large Services

The Serverless Framework relies on CloudFormation to deploy the service with its infrastructure in a consistent and reliable way.

CloudFormation itself uses a graph representation to identify how and in which order the infrastructure components should be deployed.

v1.10 of the Serverless Framework includes an improvement where resources are defined in a way which helps CloudFormation to deploy them in parallel rather than sequentially. Making the deployment process faster.

Especially large Serverless services will be deployed in significantly less time.

### Entrypoints for Plugins

Plugin authors can now specify `entrypoints` for their plugins which makes it possible for other plugins to hook into those specific lifecycle events.

Here's a simple plugin definition which utilizes the new `entrypoint` property:

```javascript
this.commands = {
  package: {
    // uppermost command is an entrypoint other plugins can use
    type: 'entrypoint',
    commands: {
      build: {
        lifecycleEvents: [
          'prepare',
        ],
      },
      deploy: {
        lifecycleEvents: [
          'upload',
        ],
      },
    },
  },
};
```

This makes something like the following hook usage possible:

```javascript
'package:build:prepare': () => BbPromise.bind(this)
  .then(this.validate)
  .then(this.mergeCustomProviderResources),
```

If you're interested in the motivation of this plugin enhancement then you should definitely read the blog post about [extending the core lifecycle events](https://serverless.com/blog/advanced-plugin-development-extending-the-core-lifecycle/) by [Frank Schmid](https://github.com/HyperBrain) who PRed this change.

**Note:** This change will make it possible to introduce the [`package` and `deploy` commands](https://github.com/serverless/serverless/pull/3344) in a non-breaking way!

### Enhancements & Bug Fixes

This release also fixes some other bugs and introduces several enhancements.

> Thanks for reporting bugs and opening issues!

### Upcoming Breaking Changes

Here's a list of all the breaking changes that will be introduced in Serverless v1.11.

There are currently no breaking changes planned for v1.11

*You'll always get the most recent list of breaking changes in the [upcoming milestone](https://github.com/serverless/serverless/milestones).*

### Contributors

This release contains lots of hard work from our awesome community and wouldn't have been possible without passionate people contributing to Serverless.

Here's a list of all the contributors who've submitted changes for this release:

- Assaf Lavie
- Doug Moscrop
- Frank Schmid
- James Manners
- Rowell Belen
- Ryan S. Brown
- horike37
- marcusmolchany

### Get Involved

Serverless has a really helpful, vibrant and awesome community. Want to help us develop the best Serverless tooling out there?

Contributing isn't just about code! Chime in on discussion, help with documentation updates or review PRs.

Just filter by [our labels](https://github.com/serverless/serverless/labels) such as [easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Feasy-pick), [help-wanted](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3Astatus%2Fhelp-wanted) or [needs-feedback](https://github.com/serverless/serverless/labels/stage%2Fneeds-feedback) to find areas where you can help us!

### Using "Scope" to Contribute

We use our own Serverless open Source tool called ["Scope"](https://github.com/serverless/scope) to manage the Frameworks development process:

[Serverless Framework Status Board](https://serverless.com/framework/status/)

Here you can see all the current discussions, to-be-reviewed PRs and recently closed issues and PRs.

You can use this status board to see all the important things currently happening in the Framework development phase.

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.11 milestone](https://github.com/serverless/serverless/milestone/26) to see what we've planned for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

## Serverless Examples

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
