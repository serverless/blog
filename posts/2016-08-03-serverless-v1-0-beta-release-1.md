---
title: Serverless V1.0 Beta 1
description: "Multi language support added to the serverless framework"
date: 2016-08-03
layout: Post
thumbnail: https://avatars1.githubusercontent.com/u/13742415?v=3&s=200
authors:
  - PhilippMuns
---

![announcement_v1beta1](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/08/announcement_v1beta1.gif) It’s been two weeks since our [Serverless V1.0-alpha.2](http://blog.serverless.com/serverless-v1-0-alpha-release-2/) release. Lots of valuable feedback and suggestions were [submitted and discussed](https://github.com/serverless/serverless/milestone/11?closed=1) since then. Thanks to the help of our great community we’re proud to announce our first beta release today: **Serverless V1.0-beta.1** Let’s take a closer look what has changed / is new.

*   [Features Overview Video](https://www.youtube.com/watch?v=bYDmaD1UUsc)
*   [Getting Started Video](https://www.youtube.com/watch?v=weOsx5rLWX0)

## Multi language support

Up until now Serverless only supported Node.js as a runtime and JavaScript as the corresponding programming language. In Serverless v1.0-Beta.1 you’ll be able to use Node.js, Python 2.7 or Java (via Gradle or Maven) as a runtime for your projects. Using these new runtimes is easy and you’re already familiar with how to create a service through the new runtimes. Just use the **create** command with the **aws-java-maven** template parameter to e.g. create a new Java (via Maven) based service on AWS:

```bash
serverless create --template aws-java-maven
```

To see a list of available templates and options for creating a new service run

```bash
serverless create --help
```

You can also change the runtime of existing services by updating the **provider runtime** attribute in **serverless.yml** like this:

```yaml
provider:
  name: aws
  runtime: java8
```

Take a look at the [service templates docs](https://github.com/serverless/serverless/tree/master/docs/service-templates) to see how you can use the other templates. A big “Thank you!” goes out to [Ilya Shindyapin (@license2e)](https://github.com/license2e) who took the time to get Java support into Serverless. _See [#1247](https://github.com/serverless/serverless/issues/1247), [#1552](https://github.com/serverless/serverless/issues/1552) and [#1554](https://github.com/serverless/serverless/pull/1554) (Python support), [#1246](https://github.com/serverless/serverless/issues/1246), [#1553](https://github.com/serverless/serverless/issues/1553) and [#1672](https://github.com/serverless/serverless/pull/1672) (Java support)_

## API Gateway updates

The API Gateway event source is one of the most used and most complex event sources out there. There are many things one can configure. Take a look at the [API Gateway documentation](https://github.com/serverless/serverless/tree/master/lib/plugins/aws/deploy/compile/events/apiGateway) to see how you can use all those new settings. _See [#1594](https://github.com/serverless/serverless/issues/1594) and [#1620](https://github.com/serverless/serverless/pull/1620) (Custom Authorizers), [#1598](https://github.com/serverless/serverless/issues/1598), [#1603](https://github.com/serverless/serverless/issues/1603) and [#1666](https://github.com/serverless/serverless/pull/1666) (Proxy settings), [#1595](https://github.com/serverless/serverless/issues/1595) and [#1636](https://github.com/serverless/serverless/pull/1636) (API keys)_

## VPC support

Sometimes you want to configure your lambda functions so that they can be operated in a VPC environment. This feature was also added to the beta 1 release! Take a look at [the documentation](https://github.com/serverless/serverless/blob/v1.0/docs/guide/deploying-a-service.md#deploying-vpc-configuration-for-lambda) to see how you can setup the corresponding configuration parameters so that your lambda function can be operated in a VPC environment. _See [#1489](https://github.com/serverless/serverless/issues/1489) and [#1705](https://github.com/serverless/serverless/pull/1705)_

## Developer plugins / tooling

Our mission for the Serverless framework is to provide an easy to use, yet powerful tool which helps you as a developer while working on your Serverless services and projects. Tedious tasks / configurations should be abstracted away so that you can focus on your code and be more productive. A feature rich toolset which supports you in your day to day development is vital here. Because of that we’ve [started the discussion](https://github.com/serverless/serverless/issues/1582) with the community what kind of developer tooling plugins are of interest and needed to be more productive while working with Serverless. V1.0-Beta.1 includes the following plugins which will help you develop your Serverless services:

1.  [Info plugin ](https://github.com/serverless/serverless/tree/master/lib/plugins/aws/info)Prints out what resources are deployed to AWS
2.  [Logs plugin ](https://github.com/serverless/serverless/tree/master/lib/plugins/aws/logs)See all your functions logs and browse through them on your console (supports tailing as well)
3.  [Single function deployment ](https://github.com/serverless/serverless/tree/master/lib/plugins/aws/deployFunction)Blazing fast way to deploy a single function of your service (e.g. to test recent changes on a cloud provider infrastructure)

Big thank you to [Benny Bauer (@bennybauer)](https://github.com/bennybauer) who implemented the whole info plugin! What plugins do you need for your daily work? Any ideas or thoughts? Please let us know and jump into the discussion [here](https://github.com/serverless/serverless/issues/1582). _See [#1582](https://github.com/serverless/serverless/issues/1582) (main discussion), [#1468](https://github.com/serverless/serverless/issues/1468), [#1590](https://github.com/serverless/serverless/pull/1590) and [#1708](https://github.com/serverless/serverless/pull/1708) (info plugin), [#1654](https://github.com/serverless/serverless/issues/1654) and [#1691](https://github.com/serverless/serverless/pull/1691) (logs plugin), [#1652](https://github.com/serverless/serverless/issues/1652) and [#1696](https://github.com/serverless/serverless/pull/1696) (single function deployment plugin)_

## .yaml and .yml support

YAMLs [official file extension](http://www.yaml.org/faq.html) is .yaml which we’ve supported right from the beginning. However .yml is used often due to its brevity. Serverless V1.0-Beta.1 will now support both file extensions (.yaml and .yml). The default Serverless will choose (e.g. upon service creation) is .yml and we recommend that you switch to this file extension. _See [#1168](https://github.com/serverless/serverless/issues/1186), [#1342](https://github.com/serverless/serverless/issues/1342) and [#1681](https://github.com/serverless/serverless/pull/1681)_

## Documentation updates, bug fixes and v1 as the main version

[The documentation](https://serverless.com/framework/docs/) is a key piece for every software project. Without it (or with poor documentation) developers won’t be able to use the product and can’t work with it. In this beta 1 release we’ve updated our documentation with new examples, sections for new functionality and many different minor fixes. We would like to hear your feedback on our docs. What do you think is missing? Should we consider another structure? Please chime in on [this issue](https://github.com/serverless/serverless/issues/1522) and let us know what you think! Additional to the documentation updates we’ve also fixed a bunch of nasty bugs so that Serverless is way more stable and reliable. That’s why we’ve decided to merge the v1.0 branch into the master branch and mark v0 as deprecated. Serverless v1 is now the go to version when you’re about to work on a new project or want to get started with Serverless.

## A big thanks to our contributors!

We’ve seen a dramatic increase in contributions the past months and would like to use this blog post to say **thank you** to the community for all the work they’ve done to make Serverless great! Contributing to Serverless is not hard at all! We’ve just introduced the “[easy-pick](https://github.com/serverless/serverless/issues?q=is%3Aissue+is%3Aopen+label%3Aeasy-pick)” label which shows what issues are easy for a first time contribution. Other than that we’re always happy if you discuss with us in the issues or pull requests. [This blog post](https://realworldcoding.io/how-to-fork-a-taco-small-step-to-open-source-contributions-4e850f3a621b#.xq0m7fkc5) might also be interesting for you as it shows you what the usual workflow for open source contributions looks like. Here’s a list of all people who have contributed code for the beta 1 release (in no particular order):

*   [Ilya Shindyapin (@license2e)](https://github.com/license2e)
*   [Sander van de Graaf (@svdgraaf)](https://github.com/svdgraaf)
*   [Benny Bauer (@bennybauer)](https://github.com/bennybauer)
*   [Jamie Sutherland (@wedgybo)](https://github.com/wedgybo)
*   [Sergio Arcos (@mt-sergio)](https://github.com/mt-sergio)
*   [Toby Hede (@tobyhede)](https://github.com/tobyhede)

There are way more awesome people who have helped by jumping in on issue discussions, pull requests, discussions on Gitter or the [Serverless forum](http://forum.serverless.com). Thanks everyone!

## Changelog

Take a look at our [v1.0.0-beta.1 milestone](https://github.com/serverless/serverless/milestone/11?closed=1) to get an overview of all changes in Beta 1.

## What’s next

The next release will be the second beta release and is scheduled for mid of August. It will include the following:

*   Improved stage / region / env variable and secrets support
*   Better documentation and onboarding for new users
*   Integration with Lambda versions / aliases
*   Event integration test repository (to test all the event sources)
*   Community plugin repository (a repository for community plugins)

We would like to hear your feedback about this and have created [an issue](https://github.com/serverless/serverless/issues/1714) where we’ll discuss this milestone goals (you can find all milestone discussion issues with the help of the recently introduced “[milestone-discussion](https://github.com/serverless/serverless/labels/milestone-discussion)” label). We’ve already created [the beta 2 milestone](https://github.com/serverless/serverless/milestone/12) and added corresponding issues and pull requests. It would be great if you could give us some feedback on the things we’re about to implement so feel free to comment on the issues or open up new ones! Only a few weeks are left when we’ll finally release Serverless v1 in fall 2016

## Join the discussion in our Serverless forum

GitHub is a great place to talk and discuss technical topics. For all other, more general topics about the Serverless framework, the serverless architecture, support questions, etc. you might want to look into our Serverless forum which is available at: [http://forum.serverless.com](http://forum.serverless.com) Create your account today and join the discussion. That’s it for now. We hope that you’re as excited as we are and like the first beta release. We would like to hear your feedback and future features you want to see in the Framework. You can find us on [Twitter](https://twitter.com/goserverless), [GitHub](https://github.com/serverless/serverless/issues) and our [Forum](http://forum.serverless.com).
