---
title: "Serverless Framework v1.40"
description: "Check out what’s included in Serverless Framework v1.40 (and v1.39)."
date: 2019-04-05
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v140-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v140-header.png"
category:
  - news
authors:
  - PhilippMuns
---

With the v1.39 release we added support for Docker-based local invocation, which makes it possible to support any runtime and AWS Lambda Layer combination with the `invoke local` command, enhanced the Framework’s AWS websockets support to include websockets authorizers, added support for AWS X-Ray tracing, and addressed a number of additional bug fixes and enhancements. With the v1.40 release we addressed additional bug fixes and enhancements. 4 bug fixes and 14 enhancements to be exact, across both v1.39 and v1.40.

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

- [#5880](https://github.com/serverless/serverless/pull/5880) Fix bug when using websocket events with functions with custom roles<a href="https://github.com/serverless/serverless/pull/5880/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+32</span>/<span style="color:#cb2431">-14</span></a> <a href="https://github.com/eahefnawy"> <img src='https://avatars1.githubusercontent.com/u/2312463?v=4' style="vertical-align: middle" alt='' height="20px"> eahefnawy</a>
- [#5883](https://github.com/serverless/serverless/pull/5883) Print customized function names correctly in sls info output<a href="https://github.com/serverless/serverless/pull/5883/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+4</span>/<span style="color:#cb2431">-5</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5899](https://github.com/serverless/serverless/pull/5899) [SLS-6891] fix regression with golang check on windows<a href="https://github.com/serverless/serverless/pull/5899/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+27</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5937](https://github.com/serverless/serverless/pull/5937) Align error logging<a href="https://github.com/serverless/serverless/pull/5937/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/dnicolson"> <img src='https://avatars3.githubusercontent.com/u/2276355?v=4' style="vertical-align: middle" alt='' height="20px"> dnicolson</a>

#### Enhancements

- [#5351](https://github.com/serverless/serverless/pull/5351) Allow Fn::Join in SQS arn builder<a href="https://github.com/serverless/serverless/pull/5351/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+77</span>/<span style="color:#cb2431">-8</span></a> <a href="https://github.com/alexdebrie"> <img src='https://avatars3.githubusercontent.com/u/6509926?v=4' style="vertical-align: middle" alt='' height="20px"> alexdebrie</a>
- [#5509](https://github.com/serverless/serverless/pull/5509) Support API Gateway stage deployment description<a href="https://github.com/serverless/serverless/pull/5509/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+46</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/vkkis93"> <img src='https://avatars3.githubusercontent.com/u/10267860?v=4' style="vertical-align: middle" alt='' height="20px"> vkkis93</a>
- [#5743](https://github.com/serverless/serverless/pull/5743) Allow individual packaging with TypeScript source maps<a href="https://github.com/serverless/serverless/pull/5743/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+17</span>/<span style="color:#cb2431">-29</span></a> <a href="https://github.com/therockstorm"> <img src='https://avatars0.githubusercontent.com/u/1085683?v=4' style="vertical-align: middle" alt='' height="20px"> therockstorm</a>
- [#5840](https://github.com/serverless/serverless/pull/5840) Packaging exclude only config file being used<a href="https://github.com/serverless/serverless/pull/5840/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+165</span>/<span style="color:#cb2431">-72</span></a> <a href="https://github.com/danielcondemarin"> <img src='https://avatars3.githubusercontent.com/u/1122442?v=4' style="vertical-align: middle" alt='' height="20px"> danielcondemarin</a>
- [#5860](https://github.com/serverless/serverless/pull/5860) Add AWS x-ray support for Lambda<a href="https://github.com/serverless/serverless/pull/5860/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+335</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#5862](https://github.com/serverless/serverless/pull/5862) Put `Custom Response Headers` into `[Responses]`<a href="https://github.com/serverless/serverless/pull/5862/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+18</span>/<span style="color:#cb2431">-18</span></a> <a href="https://github.com/etc-tiago"> <img src='https://avatars1.githubusercontent.com/u/33164463?v=4' style="vertical-align: middle" alt='' height="20px"> etc-tiago</a>
- [#5863](https://github.com/serverless/serverless/pull/5863) Invoke local docker<a href="https://github.com/serverless/serverless/pull/5863/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+295</span>/<span style="color:#cb2431">-32</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5865](https://github.com/serverless/serverless/pull/5865) Websockets: Support more route characters<a href="https://github.com/serverless/serverless/pull/5865/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+18</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/eahefnawy"> <img src='https://avatars1.githubusercontent.com/u/2312463?v=4' style="vertical-align: middle" alt='' height="20px"> eahefnawy</a>
- [#5867](https://github.com/serverless/serverless/pull/5867) Added websockets authorizer support<a href="https://github.com/serverless/serverless/pull/5867/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+688</span>/<span style="color:#cb2431">-28</span></a> <a href="https://github.com/eahefnawy"> <img src='https://avatars1.githubusercontent.com/u/2312463?v=4' style="vertical-align: middle" alt='' height="20px"> eahefnawy</a>
- [#5872](https://github.com/serverless/serverless/pull/5872) Enchancement/kotlin jvm maven updates<a href="https://github.com/serverless/serverless/pull/5872/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+64</span>/<span style="color:#cb2431">-14</span></a> <a href="https://github.com/paul-nelson-baker"> <img src='https://avatars1.githubusercontent.com/u/1402178?v=4' style="vertical-align: middle" alt='' height="20px"> paul-nelson-baker</a>
- [#5885](https://github.com/serverless/serverless/pull/5885) Fix CloudFormation template normalization<a href="https://github.com/serverless/serverless/pull/5885/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+63</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/bokan"> <img src='https://avatars3.githubusercontent.com/u/1370880?v=4' style="vertical-align: middle" alt='' height="20px"> bokan</a>
- [#5898](https://github.com/serverless/serverless/pull/5898) Support for asynchronous lambda invocation with integration type AWS<a href="https://github.com/serverless/serverless/pull/5898/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+89</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/snurmine"> <img src='https://avatars0.githubusercontent.com/u/16050765?v=4' style="vertical-align: middle" alt='' height="20px"> snurmine</a>
- [#5912](https://github.com/serverless/serverless/pull/5912) Support for Cloudwatch Event InputTransformer<a href="https://github.com/serverless/serverless/pull/5912/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+258</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/fivepapertigers"> <img src='https://avatars1.githubusercontent.com/u/14054011?v=4' style="vertical-align: middle" alt='' height="20px"> fivepapertigers</a>
- [#5926](https://github.com/serverless/serverless/pull/5926) Add Serverless instanceId concept<a href="https://github.com/serverless/serverless/pull/5926/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+151</span>/<span style="color:#cb2431">-81</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>

#### Documentation

- [#5909](https://github.com/serverless/serverless/pull/5909) Add links to the respective core concepts<a href="https://github.com/serverless/serverless/pull/5909/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/matheussilvasantos"> <img src='https://avatars3.githubusercontent.com/u/14128874?v=4' style="vertical-align: middle" alt='' height="20px"> matheussilvasantos</a>
- [#5943](https://github.com/serverless/serverless/pull/5943) Fixing minor typo<a href="https://github.com/serverless/serverless/pull/5943/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/trevorallred"> <img src='https://avatars0.githubusercontent.com/u/340379?v=4' style="vertical-align: middle" alt='' height="20px"> trevorallred</a>
- [#5944](https://github.com/serverless/serverless/pull/5944) Documentation tweak around shared authorizers<a href="https://github.com/serverless/serverless/pull/5944/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/stuartsan"> <img src='https://avatars3.githubusercontent.com/u/1724544?v=4' style="vertical-align: middle" alt='' height="20px"> stuartsan</a>
- [#5949](https://github.com/serverless/serverless/pull/5949) Document changes from #4951<a href="https://github.com/serverless/serverless/pull/5949/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/luclement"> <img src='https://avatars3.githubusercontent.com/u/7321309?v=4' style="vertical-align: middle" alt='' height="20px"> luclement</a>
- [#5957](https://github.com/serverless/serverless/pull/5957) Doc: Include that APIGateway status code of async events<a href="https://github.com/serverless/serverless/pull/5957/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/sime"> <img src='https://avatars0.githubusercontent.com/u/216917?v=4' style="vertical-align: middle" alt='' height="20px"> sime</a>

### Contributor thanks

We had more than 18 contributors have their work go into this release and we can't thank each of them enough. You all make the community special.

Want to have your github avatar and name in the next release post? Check out these [issues we are looking for help on](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)!
