---
title: IBM OpenWhisk support, CloudWatch events, Python for invoke local, F# service template in Serverless Framework v1.6
description: IBM OpenWhisk support, CloudWatch events, Python for invoke local, F# service template in the Serverless Framework v1.6 release.
date: 2017-01-30
layout: Post
authors:
  - PhilippMuns
---

Today we're thrilled to announce the release of the Serverless Framework v1.6.0.

This release is a special one as it includes the first official support for a new provider: [IBM OpenWhisk](https://developer.ibm.com/openwhisk/).

Furthermore we've added a bunch of new features and enhancement you'll enjoy! Let's look at the highlights of this release.

## Highlights of 1.6.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### IBM OpenWhisk support

### CloudWatch event support

### Python support for invoke local command

### F# service template

### Optional Lambda versioning

### Reduce memory consumption on deploy by ~50%

### Support for SNS subscriptions to existing topics

### Customize stack names

### Enhancement and bug fixes

This time we've fixes lots of nasty bugs and reworked some functionalities behind the scenes.

As usual:

> Thanks for reporting the bugs and opening issues to improve Serverless!

### Breaking changes

We're making a slight change and won't follow strict semver anymore.

Stating today we might include breaking changes in every release. However we keep the breaking changes as low and as painless as possible.

Furthermore we'll include guides how you can migrate your current codebase in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

Here's a list of all the breaking changes in this release:

- BREAKING - Remove getStackName() method
- BREAKING - Create Log Group Resources By Default
- BREAKING - Remove on-the-fly arn generation for displayed functions
- BREAKING - Remove defaults service property
- BREAKING - Replace IamPolicyLambdaExecution with inline policies and added ManagedPolicyArns to fix VPC permissions
- BREAKING - Patch DynamoDB and kinesis stream detection to allow use of GetAtt/Importvalue

### Contributors

This release contains lots of work from our awesome community and couldn't have been possible with passionate people contributing to Serverless.

Here's a list of all the contributors who have submitted changes to the codebase in this release:

- John Doe

### Call for participation

Serverless has an awesome and vibrant community. Do you want to help us develop the best Serverless tools out there?

Congributing isn't just writing code! Chime in into discussion, help with documentation updates or review PRs.

Here's a list of issues and Pull Requests we're currently focusing on. Feel free to take a look and help us:

- [BEGINNER - Some Issue]()
- [Some PR]()

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.7 milestone](https://github.com/serverless/serverless/milestone/22) to see what we're working on for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.
