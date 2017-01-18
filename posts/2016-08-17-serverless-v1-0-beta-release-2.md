---
title: Serverless V1.0 Beta 2
description: "CORS support added for AWS API Gateway in the serverless framework"
date: 2016-08-17
layout: Post
authors:
  - PhilippMuns
---

Two weeks have passed since our first v1 beta.1 release. Today we’re proud to announce the second beta version of the Serverless framework which introduces lots of new features, improvements and bug fixes.

You can install it via:

```bash
npm install -g serverless@beta
```

Here's what’s changed...

## CORS support for API Gateway

See [#1596](https://github.com/serverless/serverless/issues/1596), [#1586](https://github.com/serverless/serverless/issues/1586), [#1703](https://github.com/serverless/serverless/pull/1703) and [#1820](https://github.com/serverless/serverless/pull/1820)

CORS support for API Gateway is finally here!

You can now enable CORS support with a simple cors: true in your http event definition:

```yaml
functions:
 foo:
   handler: handler.handler
   events:
     - http:
         path: foo
         method: get
         cors: true
```

More in-depth documentation on how to e.g. set custom headers or the origin can be found in the corresponding [CORS documentation](https://github.com/serverless/serverless/tree/master/lib/plugins/aws/deploy/compile/events/apiGateway#enabling-cors-for-your-endpoints).

A big thanks goes out to [Chris Paton (@patoncrispy)](https://github.com/patoncrispy) who worked hard to get this into place for the beta.2 release!

## Support for custom IAM role statements

See [#1535](https://github.com/serverless/serverless/issues/1535) and [#1749](https://github.com/serverless/serverless/pull/1749)

Once you start to build more complex serverless applications you need the ability to set IAM roles for services your serverless functions access (e.g. access to a DynamoDB through a Lambda function).

This is now possible by defining an iamRoleStatement inside the provider property:

```yaml
provider:
  iamRoleStatements:
    - Effect: Allow
      Resource: "*"
      Action:
        - dynamodb: *
```

This way Serverless will automatically add specified statements to service's IAM role.

You can read more about custom IAM role statements in the [documentation](https://github.com/serverless/serverless/blob/master/docs/guide/custom-provider-resources.md#adding-custom-iam-role-statements).

## New implementation for custom provider resource mergings

See [#1832](https://github.com/serverless/serverless/issues/1832), [#1783](https://github.com/serverless/serverless/pull/1783), [#1836](https://github.com/serverless/serverless/pull/1836) and [#1844](https://github.com/serverless/serverless/pull/1844)

We’ve updated the stack deployment and custom provider resource merging in this release so that your custom provider resources are merged once the initial stack is created.

This prevents the stack from being removed on initial stack creation when there’s an error with custom provider resource definitions.

Furthermore we’ll now support the merging / overwriting of everything with the help of the resources section in the `serverless.yml` file. This makes the whole system way more powerful and extendable (if e.g. n event source is yet not supported via a plugin).

Take a look at this example taken from a `serverless.yml` file which will add a DisplayName property to the `mySNSEvent` and a Description to the `ServerlessDeploymentBucketName` (this is the S3 bucket Serverless creates to store your deployment artifacts) output:

```yaml
resources:
 Resources:
   mySNSEvent:
     Properties:
       DisplayName: 'Description for SNS topic'
 Outputs:
   ServerlessDeploymentBucketName:
     Description: 'Description for Serverless deployment bucket'
```

A big thank you goes out to [@fridaystreet](https://github.com/fridaystreet) who was working on an initial prototype for this feature.

## Creating Deployment artifacts only

See [#1496](https://github.com/serverless/serverless/issues/1496) and [#1808](https://github.com/serverless/serverless/pull/1808)

Ever wanted to look into the CloudFormation template Serverless will create? Or just wanted to get the deployment artifacts without an actual deployment?

This is now possible. Just run `serverless deploy --noDeploy` to get the deployment artifacts inside the .serverless directory without an actual deployment (they’ll be removed when the next deployment is run).

Thank you [John McKim (@johncmkim)](https://github.com/johncmckim) for getting this up and running!

## New community plugin repository

See [#1722](https://github.com/serverless/serverless/issues/1722)

You can find the GitHub repository here: https://github.com/serverless/community-plugins

Plugins are the heart of the Serverless framework. We ship different [core plugins](https://github.com/serverless/serverless/tree/master/lib/plugins) right out of the box but there are many more use cases / functionality wishes where a plugin makes sense.

We’d like to introduce our new [official community plugin repository](https://github.com/serverless/community-plugins) in order to provide a way to explore great, high quality Serverless Plugins which are actively maintained by the contributors but also signed off by the Serverless team.

Feel free to contribute your Serverless plugin ideas / code there so that we can create a place where users can find great and useful Serverless plugins.

It's not a requirement everyone put plugins in here (absolutely keep them in your own repo if you want to,).  However, we help maintain the ones in the community repository.

## New integration test repository

See [#1723](https://github.com/serverless/serverless/issues/1723)

You can find the GitHub repository here: https://github.com/serverless/integration-test-suite

Serverless services and applications usually consist of different functions, events and maybe even more advanced custom resource definitions.

We’d like to ensure that the Serverless framework always meets the high quality standards you and your team has while developing modern, large scale serverless applications.

Our recently introduced [integration test suite](https://github.com/serverless/integration-test-suite) is used to test the Serverless framework autonomous in combination with complex services in real world scenarios.

We’ve just started the work on this one and would like to have your feedback / ideas regarding complex integration testing for the Serverless framework.

## Documentation for DynamoDB and Kinesis stream support

See [#1441](https://github.com/serverless/serverless/issues/1441), [#1608](https://github.com/serverless/serverless/issues/1608) and [#1751](https://github.com/serverless/serverless/pull/1751)

One of the feature requests we’ve heard over and over again is the setup of DynamoDB and Kinesis streams.

After some discussion with our awesome community we came to the conclusion that we don’t have enough feedback to build a complete plugin for those two event sources. That’s why we decided to add some documentation on how to setup those event sources with the help of custom provider resources.

Here’s an example how you can setup a Kinesis Stream:

```yaml
# this code should be added to the `serverless.yml` file
resources:
 Resources:
   mapping:
     Type: AWS::Lambda::EventSourceMapping
     Properties:
       BatchSize: 10
       EventSourceArn: "arn:aws:kinesis:<region>:<aws-account-id>:stream/<stream-name>"
       FunctionName:
         Fn::GetAtt:
           - "<function-name>"
           - "Arn"
       StartingPosition: "TRIM_HORIZON"
```

You can find the whole documentation for those event sources here:

- [DynamoDB stream event source](https://github.com/serverless/serverless/blob/master/docs/guide/overview-of-event-sources.md#dynamodb-streams)
- [Kinesis stream event source](https://github.com/serverless/serverless/blob/master/docs/guide/overview-of-event-sources.md#kinesis-streams)

Furthermore we’d love to have your feedback on how you think the plugin solution for those event sources might look like. So feel free to join the conversation for the DynamoDB stream event here and Kinesis stream event source here.

## Other new features, improvements and fixes

Those are just the features we’ve decided to highlight in this announcement blog post.

You can find every issue and pull request in our corresponding [Beta 2 Milestone](https://github.com/serverless/serverless/milestone/12?closed=1).

Here are other features, improvements and fixes which will be also introduced in our beta 2 release.

### API Gateway deployment fixes

See [#1551](https://github.com/serverless/serverless/issues/1551), [#1683](https://github.com/serverless/serverless/issues/1683), [#1702](https://github.com/serverless/serverless/pull/1702) and [#1761](https://github.com/serverless/serverless/pull/1761)

Unfortunately we had a bug which caused problems when deploying endpoints via API Gateway as old stages were not successfully updated and function order in `serverless.yml` caused trouble during deployment. While this has been resolved there is still an issue when functions get removed or renamed. API Methods are still deployed after a remove or rename and will only be fully removed on a following deployment. We're working with AWS to resolve this in the future.

This has been (partially) resolved thanks to the work from [Jamie Sutherland (@wedgybo)](https://github.com/wedgybo)

### Set SNS topic via ARN

See [#1607](https://github.com/serverless/serverless/issues/1607) and [#1770](https://github.com/serverless/serverless/pull/1770)

Pre-existing topic ARNs can now be used to hook to a function with the help of the SNS event.

Take a look at the documentation for the SNS event to see how this can be used.

### camelCase syntax for SNS event configuration (BREAKING CHANGE)

See [#1804](https://github.com/serverless/serverless/issues/1804) and [#1809](https://github.com/serverless/serverless/pull/1809)

We’ve switched the configuration syntax to camelCase so that it sticks to the overall defined coding convention.

After updating your SNS event definitions (e.g. from topic_name to topicName) everything should work again.

### New lifecycle event names for deploy plugin (BREAKING CHANGE)

See [#1577](https://github.com/serverless/serverless/issues/1577) and [#1824](https://github.com/serverless/serverless/pull/1824)

The deploy plugins lifecycle events are renamed so that the are more generalized and can be applied to more cloud providers.

We’ve not removed any lifecycle events but renamed them. You can see a list of the renaming [here](https://github.com/serverless/serverless/issues/1577#issuecomment-238226700).

Furthermore you can see all new lifecycle event names [here](https://github.com/serverless/serverless/tree/master/lib/plugins/deploy#provided-lifecycle-events).

### Set own variable syntax in defaults property

See [#1728](https://github.com/serverless/serverless/issues/1728) and [#1764](https://github.com/serverless/serverless/pull/1764)

The variableSyntax can be overwritten with the help of the defaults property in the `serverless.yml` file (You can see an example of a `serverless.yml` file which overwrites this variableSyntax here).

Thank you [John McKim (@johncmckim)](https://github.com/johncmckim) for your work on this one!

### Reduced verbosity while loading

See [#1446](https://github.com/serverless/serverless/issues/1446) and [#1755](https://github.com/serverless/serverless/pull/1755)

The Serverless CLI had a very verbose output while loading / waiting for operations. This has been updated so that less screen real estate is used during usage. ### Include stage variables in API Gateway request body template

See [#1849](https://github.com/serverless/serverless/issues/1849) and [#1850](https://github.com/serverless/serverless/pull/1850)

You can now access the stage variables with the help of the velocity request template. Take a look [here](https://github.com/serverless/serverless/tree/master/lib/plugins/aws/deploy/compile/events/apiGateway#universal-json-request-template) to see how you can access it. Thank you [Patrick Brandt (@patrickbrandt)](https://github.com/patrickbrandt) for your work on this functionality. Fix for populating boolean and 0 variables See [#1793](https://github.com/serverless/serverless/pull/1793) A bug caused problems with the population / usage of boolean and 0 variables. This has been resolved thanks to [Kengo Suzuki (@kengos)](https://github.com/kengos). ### Refactor for the API Gateway endpoints outputs See [#1794](https://github.com/serverless/serverless/pull/1794) CloudFormation has a limit for 60 outputs per stack which means that you should be cautious what you want to put inside this outputs section. [Nick den Engelsman (@nicka)](https://github.com/nicka) pointed that out and worked on an improvement for the API Gateway outputs of the info plugin! ### Switch from node-zip to jszip

See [#1621](https://github.com/serverless/serverless/issues/1621) and [#1759](https://github.com/serverless/serverless/pull/1759)

Zipping the service is one of our core functionalities. We’ve used the [node-zip package](https://github.com/daraosn/node-zip) for this task previously. However the package is a little bit dated so we’ve decided to move to the more maintained [JSZip](https://stuk.github.io/jszip/) (which node-zip uses under the hood). This transition is finally implemented thanks to [Chris Olszewski (@chris-olszewski)](https://github.com/chris-olszewski). ### Alphabetical plugin sorting when running help command

See [#1257](https://github.com/serverless/serverless/issues/1257) and [#1768](https://github.com/serverless/serverless/pull/1768)

Used plugins are displayed when you run the serverless --help command on your terminal. [Sander van de Graaf (@svdgraaf)](https://github.com/svdgraaf) submitted a fix which sorts those plugins by name which makes it way easier to grasp what plugins are in use. ### Removed individual lodash function requires

See [#1515](https://github.com/serverless/serverless/issues/1515) and [#1796](https://github.com/serverless/serverless/pull/1769)

Individual lodash function requires makes it tedious to work on code which uses the lodash library heavily. [Sander van de Graaf (@svdgraaf)](https://github.com/svdgraaf) took some time to refactor the code so that the individual requires are removed. ## Breaking changes Moving fast and evaluation new ideas means that introducing some breaking changes are unavoidable. Here’s the list of all the the breaking changes you need to be aware of for this release: - camelCase syntax for SNS event configuration - New lifecycle event names for deploy plugin ## A big “thank you” to our awesome community

We couldn’t have introduced such a large feature set for this release without the invaluable feedback and help from our incredible community who is always active on [GitHub](https://github.com/serverless/serverless), [Gitter](https://gitter.im/serverless/serverless), [our Serverless forum](http://forum.serverless.com) and everywhere else on the internet!

Thank you for making it a joy to work on Serverless everyday. # You want to contribute / give feedback? You want to contribute to the Serverless project? That’s awesome! We’ve recently introduced the following issue / pull request labels which makes it easy help us build a great Serverless framework:

*   [milestone-discussion](https://github.com/serverless/serverless/labels/milestone-discussion) – High level discussion about upcoming milestones
*   [discussion](https://github.com/serverless/serverless/labels/discussion) – Discussions about implementation details (feedback highly welcomed!)
*   [help-wanted-easy](https://github.com/serverless/serverless/labels/help-wanted-easy) – A feature which can be implemented quite easily
*   [help-wanted](https://github.com/serverless/serverless/labels/help-wanted) – A feature we need your help with

Additionally contributing is not limited to [GitHub](https://github.com/serverless/serverless)! Feel free to join the discussions on [Gitter](https://gitter.im/serverless/serverless) and [our Serverless forum](http://forum.serverless.com).
