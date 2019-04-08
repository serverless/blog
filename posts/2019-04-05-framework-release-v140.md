---
title: "Serverless Framework v1.40"
description: "Check out what’s included in Serverless Framework v1.40 (and v1.39)."
date: 2019-04-xx
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v140-thumb.png’
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v140-header.png’
category:
  - news
authors:
  - PhilippMuns
---

With the v1.39 release we added support for Docker-based local invocation, which makes it possible to support any runtime and AWS Lambda Layer combination with the `invoke local` command, enhanced the Framework’s AWS websockets support to include websockets authorizers, added support for AWS X-Ray tracing, and addressed a number of additional bug fixes and enhancements. With the v1.40 release we addressed additional bug fixes and enhancements. xx bug fixes and xx enhancements to be exact, across both v1.39 and v1.40.

### Improved `invoke local` support

The v1.39.1 release of the Serverless Framework expanded `invoke local` support to include **ALL** supported AWS runtimes and layers.

Previously we provided support for local invocation on a per-runtime basis. We started with Node.js and extended this further to add Python and Java. In doing so we studied and implemented the AWS Lambda specific behavior for every runtime so that `invoke local` could be run from the Serverless CLI and return the exact same result as `invoke`.

While that works great for Node.js, Python and Java, AWS Lambda now supports [any runtime](https://aws.amazon.com/blogs/aws/new-for-aws-lambda-use-any-programming-language-and-share-common-components/), and [AWS Lambda Layers](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html) makes it possible to further customize the Lambda experience.

With v1.39.1 we now support Docker-based local invocation, which makes it possible for the Serverless Framework to support any runtime and AWS Lambda Layer combination. The implementation itself leverages the [`lambci/lambda`](https://hub.docker.com/r/lambci/lambda) [Docker](https://docker.com) images.

Docker-based local invocations are enabled by default for runtimes that weren't previously supported. It can also be enabled with the `--docker` flag for already supported Node.js / Python / Ruby and Java runtimes. Docker-based invoke local also includes support for Lambda Layers. Both local, as well as external Layers referenced via an ARN, are supported. You can learn more about using Docker-based local invocation with the Serverless Framework in our [documentation](https://serverless.com/framework/docs/providers/aws/cli-reference/invoke-local/).

### Authorizers Support for Websockets

In v1.39.1 we completed the websockets story by adding support for websockets authorizers. It works like http Authorizers. The only key difference is that AWS only supports websockets authorizers for the `$connect` route.

Here's an example yaml configuration that uses authorizers to protect connection requests:

```yml
functions:
  connect:
    handler: handler.connect
    events:
      - websocket:
          route: $connect
          authorizer: auth # you can also provide an arn if your function is not part of this service

  auth:
    handler: handler.auth
```

With this configuration, any connection request to the websockets URL **must** include the `Auth` header by default, otherwise connections will be rejected automatically. If it does include the header, your `auth` function will be invoked first. If this invocation succeeds by returning a valid policy statement, your `connect` function will be invoked, otherwise, the connection will be rejected. When using the `wscat` client, you can connect with the following command:

```
wscat -c <wss-rul> -H Auth:secret
```

You can change this header to any other value, or to be a query string by specifying the `identitySource` property:

```yml
functions:
  connect:
    handler: handler.connect
    events:
      - websocket:
          route: $connect
          authorizer:
            name: auth
            identitySource:
              - "route.request.querystring.Auth"

  auth:
    handler: handler.auth
```

With this configuration, you need to specify a querystring instead of a header:

```
wscat -c <wss-rul>?Auth=secret
```

For more information on websocket support [please check the docs](https://serverless.com/framework/docs/providers/aws/events/websocket/), and for a simple yet complete example using websockets authorizers, [check our websockets-authorizers example](https://github.com/serverless/examples/tree/master/aws-node-websockets-authorizers) in the examples repo.

### AWS X-Ray Tracing for Lambda

Mature serverless applications tend to utilize a large number of internal and external cloud services. The larger the application, the harder it becomes to get useful insights into an application’s overall performance. One way to get better end-to-end visibility into the performance of a serverless application, running on AWS, is to instrument it to use [AWS X-Ray](https://aws.amazon.com/xray/), which will trace requests as they flow through your serverless application and generate a [Service Map](https://aws.amazon.com/xray/features/#Service_map).

In Serverless Framework v1.39.1 we added AWS X-Ray tracing support for AWS Lambda. X-Ray tracing can be enabled service-wide or on a per-function level. To enable X-Ray tracing for all your Service’s Lambda functions you just need to set the corresponding tracing configuration on the `provider` level:

```yml
provider:
  tracing:
    lambda: true
```

If you want to setup tracing on a per-function level you can use the `tracing` config in your function definition:

```yml
functions:
  myFunction:
    handler: index.handler
    tracing: true
```

Setting `tracing` to `true` translates to the `Active` tracing configuration. You can overwrite this behavior by providing the desired configuration as a string:

```yml
functions:
  myFunction:
    handler: index.handler
    tracing: PassThrough
```

Also note that you can mix the `provider`- and `function`-level configurations. All functions will inherit the `provider`-level configuration which can then be overwritten on an individual function basis:

```yml
service:
  name: my-tracing-service

provider:
  name: aws
  stage: dev
  runtime: nodejs8.10
  tracing:
    lambda: true

functions:
  myFunc1: # this function will inherit the provider-level tracing configuration
    handler: index.func1
  myFunc2:
    handler: handler.func2
    tracing: PassThrough # here we're overwriting the provider-level configuration
```

It's recommended to setup X-Ray tracing for Lambda with the aforementioned `tracing` configuration since doing so will ensure that the X-Ray setup is managed by the Serverless Framework core via CloudFormation. You can learn more about X-Ray Tracing for AWS Lambda in our [documentation](https://serverless.com/framework/docs/providers/aws/guide/functions/#aws-x-ray-tracing).

#### Bug Fixes

- [#5868](https://github.com/serverless/serverless/issues/5868) WebSockets custom function roles crash<a href="https://github.com/serverless/serverless/issues/5868/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+undefined</span>/<span style="color:#cb2431">-undefined</span></a> <a href="https://github.com/chris-feist"> <img src='https://avatars3.githubusercontent.com/u/5295555?v=4' style="vertical-align: middle" alt='' height="20px"> chris-feist</a>

#### Enhancements

- [#2233](https://github.com/serverless/serverless/issues/2233) Not possible to create resources that depend on the ApiGateway::Deployment<a href="https://github.com/serverless/serverless/issues/2233/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+undefined</span>/<span style="color:#cb2431">-undefined</span></a> <a href="https://github.com/alexanderbh"> <img src='https://avatars2.githubusercontent.com/u/172970?v=4' style="vertical-align: middle" alt='' height="20px"> alexanderbh</a>
- [#5858](https://github.com/serverless/serverless/issues/5858) Allow non-alphanumeric characters for websocket routes<a href="https://github.com/serverless/serverless/issues/5858/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+undefined</span>/<span style="color:#cb2431">-undefined</span></a> <a href="https://github.com/conflagrator"> <img src='https://avatars3.githubusercontent.com/u/584514?v=4' style="vertical-align: middle" alt='' height="20px"> conflagrator</a>
- [#5865](https://github.com/serverless/serverless/pull/5865) Websockets: Support more route characters<a href="https://github.com/serverless/serverless/pull/5865/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+18</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/eahefnawy"> <img src='https://avatars1.githubusercontent.com/u/2312463?v=4' style="vertical-align: middle" alt='' height="20px"> eahefnawy</a>
- [#5874](https://github.com/serverless/serverless/issues/5874) Add option to set Websocket API name<a href="https://github.com/serverless/serverless/issues/5874/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+undefined</span>/<span style="color:#cb2431">-undefined</span></a> <a href="https://github.com/mekwall"> <img src='https://avatars2.githubusercontent.com/u/37091?v=4' style="vertical-align: middle" alt='' height="20px"> mekwall</a>
- [#5898](https://github.com/serverless/serverless/pull/5898) Support for asynchronous lambda invocation with integration type AWS<a href="https://github.com/serverless/serverless/pull/5898/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+89</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/snurmine"> <img src='https://avatars0.githubusercontent.com/u/16050765?v=4' style="vertical-align: middle" alt='' height="20px"> snurmine</a>

#### Documentation

- [#5909](https://github.com/serverless/serverless/pull/5909) Add links to the respective core concepts<a href="https://github.com/serverless/serverless/pull/5909/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/matheussilvasantos"> <img src='https://avatars3.githubusercontent.com/u/14128874?v=4' style="vertical-align: middle" alt='' height="20px"> matheussilvasantos</a>

#### Features

- [#3495](https://github.com/serverless/serverless/issues/3495) Add support for AWS x-ray on AWS Lambda<a href="https://github.com/serverless/serverless/issues/3495/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+undefined</span>/<span style="color:#cb2431">-undefined</span></a> <a href="https://github.com/Kosta-Github"> <img src='https://avatars0.githubusercontent.com/u/2526664?v=4' style="vertical-align: middle" alt='' height="20px"> Kosta-Github</a>
- [#5848](https://github.com/serverless/serverless/issues/5848) Investigate Docker usage for invoke local<a href="https://github.com/serverless/serverless/issues/5848/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+undefined</span>/<span style="color:#cb2431">-undefined</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#5857](https://github.com/serverless/serverless/issues/5857) Add support for Websockets Authorizers<a href="https://github.com/serverless/serverless/issues/5857/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+undefined</span>/<span style="color:#cb2431">-undefined</span></a> <a href="https://github.com/eahefnawy"> <img src='https://avatars1.githubusercontent.com/u/2312463?v=4' style="vertical-align: middle" alt='' height="20px"> eahefnawy</a>

### Contributor thanks

We had more than xx contributors have their work go into this release and we can't thank each of them enough. You all make the community special.

Want to have your github avatar and name in the next release post? Check out these [issues we are looking for help on](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)!
