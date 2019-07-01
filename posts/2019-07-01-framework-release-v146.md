---
title: "Serverless Framework v1.46.0 - Extended ALB configurability, Support for external Websocket APIs, Local plugins via relative paths & More"
description: "Check out what’s included in Serverless Framework v1.46."
date: 2019-07-01
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v146-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v146-header.png"
category:
  - news
authors:
  - MariuszNowak
---
 
The Serverless Framework v1.46.0 release adds new ways to configure conditions for ALB events, support for externally managed Websocket APIs and local plugins which can be referenced via relative file paths. We’ve also addressed a number of enhancements and bug fixes. In total 5 bugs were fixed and 5 enhancements were merged and are now available through our v1.46.0 release.

Please ensure that you’re using an up to date Node version when working with the Serverless Framework.

#### Support for new ALB conditions

In our last [Serverless Framework v1.45.0 release](https://serverless.com/blog/framework-release-v145/) we introduced support for the ALB event source which is a compelling replacement for the sophisticated, but costly AWS API Gateway service. While API Gateway is still superior for complex API setups one can achieve quite a lot with the much cheaper ALB service offering.

This release extends the ALB event source capabilities by adding support for different conditions which need to be met in order for the ALB to route incoming requests to the connected Lambda function. ALB event sources can now be configured to accept different headers, IP addresses, methods, query strings and multiple paths.

The following shows a complex ALB setup in which we leverage the new config options:

```yaml
functions:
  test:
    handler: handler.hello
    events:
      - alb:
          listenerArn: { Ref: HTTPListener }
          priority: 1
          conditions:
            path:
              - /first-path
              - /second-path
            method:
              - POST
              - PATCH
            query:
              bar: true
            ip:
              - 192.168.0.1/0
            header:
              name: alb-event-source
            host:
              - example.com
```

Do you want to learn more about ALB and how it can save you money if you use it as an API Gateway replacement? You can read more about the ALB event source and its capabilities in our [v1.45.0 release blog post](https://serverless.com/blog/framework-release-v145/).

#### External Websocket APIs

Most Serverless Framework applications start with one `serverless.yml` file in which the whole application with all its infrastructure components is described. While this is sufficient in the beginning it’s recommended to split the whole application up into different services and use a separate `serverless.yml` file for every service.

Splitting up an application into different services makes it a requirement for certain resources to be shared between such services. One very common resource type which needs to be shared across services are APIs.

The Serverless Framework already supports an easy way to introduce an external REST API to a service, making it possible to re-use and extend that API within the service.

In our v1.46.0 release we’re extending the support for external APIs to include Websocket APIs. 

Introducing an existing Websocket API into an existing service is as easy as using the `websocketApiId` config parameter under the `provider.apiGateway` property.

```yaml
provider:
  name: aws
  apiGateway:
    websocketApiId: xxxxxxxxxx # Websocket API resource id
```

Do you want to learn more about best practices on how to split up your API-driven application into different services? Our [API Gateway documentation](https://serverless.com/framework/docs/providers/aws/events/apigateway/) provides some more insights into this.

#### Local plugins via relative paths

Our Serverless Framework [plugin architecture](https://serverless.com/framework/docs/providers/aws/guide/plugins/) provides an easy way to extend Serverless in various different ways to meet specific business needs.

The community has been working hard on [hundreds of plugins](https://serverless.com/plugins/) to help other Serverless developers achieve certain goals and make Serverless development easier than ever.

While one can easily distribute and consume plugins via `npm` it’s sometimes necessary to work with plugins which are project specific or maybe not yet distributed via `npm`. Perhaps you wish to maintain your own plugins itnernally?

Up until now there was a clear distinction between `npm` hosted plugins and local plugins. The only way to work with local plugins was to leverage the `plugin.localPath` configuration. Using that meant that only local plugins were supported for the whole service and `npm` hosted plugins were no longer an option..

Our v1.46.0 release finally makes it possible to mix `npm` hosted and local plugins in an easy way.

Here’s an example where we use the infamous [`serverless-offline` plugin](https://serverless.com/plugins/serverless-offline/) alongside a plugin which is project specific and stored in a separate directory of our service.

```yaml
plugins:
  - serverless-offline
  - ./plugins/acme/auditing
```

#### Bug Fixes
- [#4427](https://github.com/serverless/serverless/pull/4427) Split IAM Policy from IAM Role & Improve DependsOn for Streams<a href="https://github.com/serverless/serverless/pull/4427/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+120</span>/<span style="color:#cb2431">-51</span></a> <a href="https://github.com/alexcasalboni"> <img src='https://avatars1.githubusercontent.com/u/2457588?v=4' style="vertical-align: middle" alt='' height="20px"> alexcasalboni</a>
- [#6244](https://github.com/serverless/serverless/pull/6244) Fix duplicate packaging issue<a href="https://github.com/serverless/serverless/pull/6244/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+52</span>/<span style="color:#cb2431">-17</span></a> <a href="https://github.com/alexdebrie"> <img src='https://avatars3.githubusercontent.com/u/6509926?v=4' style="vertical-align: middle" alt='' height="20px"> alexdebrie</a>
- [#6255](https://github.com/serverless/serverless/pull/6255) Fix lambda integration timeout response template<a href="https://github.com/serverless/serverless/pull/6255/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+27</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/medikoo"> <img src='https://avatars3.githubusercontent.com/u/122434?v=4' style="vertical-align: middle" alt='' height="20px"> medikoo</a>
- [#6268](https://github.com/serverless/serverless/pull/6268) Fix #6267<a href="https://github.com/serverless/serverless/pull/6268/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/JonathanWilbur"> <img src='https://avatars0.githubusercontent.com/u/20342114?v=4' style="vertical-align: middle" alt='' height="20px"> JonathanWilbur</a>
- [#6281](https://github.com/serverless/serverless/pull/6281) Do not set tty on stdin if no tty available<a href="https://github.com/serverless/serverless/pull/6281/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/jpetitcolas"> <img src='https://avatars0.githubusercontent.com/u/688373?v=4' style="vertical-align: middle" alt='' height="20px"> jpetitcolas</a>
#### Enhancements
- [#6200](https://github.com/serverless/serverless/pull/6200) Remove default stage value in provider object<a href="https://github.com/serverless/serverless/pull/6200/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+109</span>/<span style="color:#cb2431">-111</span></a> <a href="https://github.com/mydiemho"> <img src='https://avatars2.githubusercontent.com/u/1634185?v=4' style="vertical-align: middle" alt='' height="20px"> mydiemho</a>
- [#6258](https://github.com/serverless/serverless/pull/6258) Fix: Update azure template<a href="https://github.com/serverless/serverless/pull/6258/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+6</span>/<span style="color:#cb2431">-138</span></a> <a href="https://github.com/tbarlow12"> <img src='https://avatars0.githubusercontent.com/u/10962815?v=4' style="vertical-align: middle" alt='' height="20px"> tbarlow12</a>
- [#6280](https://github.com/serverless/serverless/pull/6280) Remove package-lock.json and shrinkwrap scripts<a href="https://github.com/serverless/serverless/pull/6280/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+3</span>/<span style="color:#cb2431">-9384</span></a> <a href="https://github.com/medikoo"> <img src='https://avatars3.githubusercontent.com/u/122434?v=4' style="vertical-align: middle" alt='' height="20px"> medikoo</a>
- [#6285](https://github.com/serverless/serverless/pull/6285) Use naming to get stackName<a href="https://github.com/serverless/serverless/pull/6285/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/joetravis"> <img src='https://avatars1.githubusercontent.com/u/3687269?v=4' style="vertical-align: middle" alt='' height="20px"> joetravis</a>
- [#6293](https://github.com/serverless/serverless/pull/6293) Add ip, method, header and query conditions to ALB events<a href="https://github.com/serverless/serverless/pull/6293/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+270</span>/<span style="color:#cb2431">-11</span></a> <a href="https://github.com/cbm-egoubely"> <img src='https://avatars2.githubusercontent.com/u/39260821?v=4' style="vertical-align: middle" alt='' height="20px"> cbm-egoubely</a>
#### Documentation
- [#6225](https://github.com/serverless/serverless/pull/6225) Update docs | dont use provider.tags with shared API Gateway<a href="https://github.com/serverless/serverless/pull/6225/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/OskarKaminski"> <img src='https://avatars3.githubusercontent.com/u/7963279?v=4' style="vertical-align: middle" alt='' height="20px"> OskarKaminski</a>
- [#6228](https://github.com/serverless/serverless/pull/6228) Fix formatting issue with Markdown link<a href="https://github.com/serverless/serverless/pull/6228/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/awayken"> <img src='https://avatars1.githubusercontent.com/u/156215?v=4' style="vertical-align: middle" alt='' height="20px"> awayken</a>
- [#6275](https://github.com/serverless/serverless/pull/6275) fixed a typo 🖊<a href="https://github.com/serverless/serverless/pull/6275/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/floydnoel"> <img src='https://avatars3.githubusercontent.com/u/4154431?v=4' style="vertical-align: middle" alt='' height="20px"> floydnoel</a>
- [#6279](https://github.com/serverless/serverless/pull/6279) Update variables.md<a href="https://github.com/serverless/serverless/pull/6279/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/ElinksFr"> <img src='https://avatars1.githubusercontent.com/u/32840264?v=4' style="vertical-align: middle" alt='' height="20px"> ElinksFr</a>
- [#6286](https://github.com/serverless/serverless/pull/6286) Added correction based on community feedback<a href="https://github.com/serverless/serverless/pull/6286/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/garethmcc"> <img src='https://avatars1.githubusercontent.com/u/4112280?v=4' style="vertical-align: middle" alt='' height="20px"> garethmcc</a>
- [#6288](https://github.com/serverless/serverless/pull/6288) Remove README redundant link<a href="https://github.com/serverless/serverless/pull/6288/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+0</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/Hazlank"> <img src='https://avatars0.githubusercontent.com/u/15724316?v=4' style="vertical-align: middle" alt='' height="20px"> Hazlank</a>
- [#6292](https://github.com/serverless/serverless/pull/6292) Fix typo in link to ALB docs<a href="https://github.com/serverless/serverless/pull/6292/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/schellack"> <img src='https://avatars0.githubusercontent.com/u/70819?v=4' style="vertical-align: middle" alt='' height="20px"> schellack</a>
#### Features
- [#6261](https://github.com/serverless/serverless/pull/6261) #6017 Allow to load plugin from path<a href="https://github.com/serverless/serverless/pull/6261/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+18</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/mnapoli"> <img src='https://avatars3.githubusercontent.com/u/720328?v=4' style="vertical-align: middle" alt='' height="20px"> mnapoli</a>
- [#6272](https://github.com/serverless/serverless/pull/6272) Feature/support external websocket api<a href="https://github.com/serverless/serverless/pull/6272/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+193</span>/<span style="color:#cb2431">-103</span></a> <a href="https://github.com/christophgysin"> <img src='https://avatars0.githubusercontent.com/u/527924?v=4' style="vertical-align: middle" alt='' height="20px"> christophgysin</a>

### Contributor thanks

With 18 different contributors, thanks again to all community members that got involved with this release to make it a success.