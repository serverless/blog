---
title: "Serverless Framework v1.45.0 -  ALB event source, API Gateway Websocket logs, S3 hosted deployment packages, Custom configuration file names & More"
description: "Check out what’s included in Serverless Framework v1.45."
date: 2019-06-17
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v145-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v145-header.png"
category:
  - news
authors:
  - PhilippMuns
---

The Serverless Framework v1.45.0 release adds the new ALB event source, support for API Gateway Websocket Logs, deployment packages hosted on S3 and custom configuration files. In addition to those features we’ve addressed a number of bug fixes and other enhancements. 3 bug fixes and 2 enhancements were merged and are now available through our v1.45.0 release.

**Important:** Due to the [Node.js release cycle](https://github.com/nodejs/Release/blob/master/README.md) we’ve dropped support for Node.js version 4 which is no longer in LTS. Going forward we’ll slowly phase out non LTS Node.js version in the future to ensure that we keep on innovating while keeping our users secure.

Please ensure that you’re using an up to date Node version when working with the Serverless Framework.

#### ALB event source

API backends are one of the top use cases for serverless architectures. In fact, serverless computing really took off once AWS introduced the integration between AWS Lambda and API Gateway, making it possible to create whole web applications which auto-scale, are easy to maintain and only generate expense when actually used.

Nowadays, API Gateway usually plays an integral part in such API backends. However, due to API Gateway being such a configurable and feature-rich service it can be costly if it’s only used to dispatch incoming data to Lambda functions.

At the last re:Invent Amazon announced the integration between Application Load Balancers and Lambda functions. Rather than using ALBs to dispatch traffic between different compute instances (usually EC2) it’s now possible to use an ALB as a gateway for incoming HTTP traffic which can then be forwarded to Lambda functions. The great news is that it’s usually an order of magnitude cheaper to use ALBs as API Gateways compared to the AWS API Gateway service.

The Serverless Framework v1.45.0 introduces the new `alb` event source which makes it easy to hook up a Lambda function with an ALB listener.

The following example shows how the `alb` event source is used to create a GET event at an ALB listener:

```yaml
functions:
  test:
    handler: handler.hello
    events:
      - alb:
          listenerArn: <listener-arn>
          priority: 1
          conditions:
            path: /hello
```

Note that you have to update your Lambda handler code slightly to adhere to the format the ALB expects:

```javascript
module.exports.hello = async () => ({
  isBase64Encoded: false,
  statusCode: 200,
  statusDescription: "200 OK",
  headers: { "Set-cookie": "cookies", "Content-Type": "application/json" },
  body: "Hello from a Lambda triggered via an ALB event"
});
```

If you want to learn more about ALBs and their usage in a serverless architecture feel free to read through the [excellent](https://serverless-training.com/articles/save-money-by-replacing-api-gateway-with-application-load-balancer/) [writeups](https://serverless-training.com/articles/how-to-set-up-application-load-balancer-with-lambda/) by [Jeremy Thomerson](https://twitter.com/jthomerson).

#### API Gateway Websocket logs

Back in [v1.42.0](https://serverless.com/blog/framework-release-v142/) we’ve introduced support for API Gateway REST API logs. Setting them up was as easy as adding the following lines of code to the `provider` property:

```yaml
provider:
  logs:
    restApi: true
```

With Serverless Framework v1.45.0 we complement this feature with support for API Gateway Websocket logs. Enabling logging for Websockets follows the same pattern as the REST API logs:

```yaml
provider:
  logs:
    websocket: true
```

Note that it’s also possible to combine a REST API with a Websocket API in one service and enable logging for both:

```yaml
provider:
  logs:
    restApi: true
    websocket: true
```

Do you have any wishes for further configurability or extra features? We’d love to hear your thoughts about Websocket logs in our [feedback issue](https://github.com/serverless/serverless/issues/6218).

#### S3 hosted deployment packages

The Serverless Framework makes it possible to separate the package and deployment process with the help of the `serverless package` and `serverless deploy --package` commands.

This feature is often used in CI / CD setups where one service creates the deployment artifact which is then consumed by another service and carried out via a deployment.

When using this kind of configuration, the inevitable question of where to store the deployment artifact comes up. With Serverless Framework v1.45.0 we introduce the possibility to pull down deployment artifacts which are stored in an S3 bucket.

Using this feature only requires you to set the `package` path to the corresponding `.zip` object in a S3 bucket:

```yaml
package:
  artifact: <s3-object-url>
```
Note that the packaging itself wasn’t changed. This means that it’s still possible to package functions individually when using S3 hosted deployment artifacts:

```yaml
functions:
  test:
    handler: handler.hello
    package:
      artifact: <s3-object-url>
    events:
      - http: GET hello

package:
  individually: true
```

We kept the implementation agnostic, meaning that we can extend it to pull `zip` files from any remote location. [Let us know](https://github.com/serverless/serverless/issues/new?template=feature_request.md) if that’s something you’re interested in.

#### Custom configuration files

It has been frequently requested to make possible to configure multiple services within the scope of a single project.

With a single serverless configuration (aimed to cover single service) it couldn’t be done easily, therefore we’ve enriched Serveless CLI with a `--config` option, that allows you yp pass a custom configuration filename to be used for given deploy or package command.

This results in the ability to pass individually crafted and specialised configuration files under different circumstances for the same service:

```bash
# Deploy API
serverless deploy --config serverless.api.yml


# Deploy Workflow A
serverless deploy --config serverless.workflow-a.yml
```

#### Bug Fixes
- [#6192](https://github.com/serverless/serverless/pull/6192) Adding a validation to validation.js script<a href="https://github.com/serverless/serverless/pull/6192/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+20</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/camilosampedro"> <img src='https://avatars1.githubusercontent.com/u/8657866?v=4' style="vertical-align: middle" alt='' height="20px"> camilosampedro</a>
- [#6212](https://github.com/serverless/serverless/pull/6212) Use common prefix for log groups permissions at Lambdas' execution roles<a href="https://github.com/serverless/serverless/pull/6212/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+30</span>/<span style="color:#cb2431">-114</span></a> <a href="https://github.com/rdsedmundo"> <img src='https://avatars2.githubusercontent.com/u/5482378?v=4' style="vertical-align: middle" alt='' height="20px"> rdsedmundo</a>
- [#6222](https://github.com/serverless/serverless/pull/6222)  Update Scala version to 2.13.0 for aws-scala-sbt template<a href="https://github.com/serverless/serverless/pull/6222/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+5</span>/<span style="color:#cb2431">-5</span></a> <a href="https://github.com/NomadBlacky"> <img src='https://avatars2.githubusercontent.com/u/3215961?v=4' style="vertical-align: middle" alt='' height="20px"> NomadBlacky</a>
#### Enhancements
- [#6196](https://github.com/serverless/serverless/pull/6196) Add support for S3 hosted package artifacts<a href="https://github.com/serverless/serverless/pull/6196/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+171</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#6216](https://github.com/serverless/serverless/pull/6216)  `--config` option<a href="https://github.com/serverless/serverless/pull/6216/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+158</span>/<span style="color:#cb2431">-86</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
#### Documentation
- [#6215](https://github.com/serverless/serverless/pull/6215) Remove root README generator<a href="https://github.com/serverless/serverless/pull/6215/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+13</span>/<span style="color:#cb2431">-844</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
#### Features
- [#6073](https://github.com/serverless/serverless/pull/6073) Add Application Load Balancer event source<a href="https://github.com/serverless/serverless/pull/6073/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+815</span>/<span style="color:#cb2431">-6</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#6088](https://github.com/serverless/serverless/pull/6088) Add support for Websocket Logs<a href="https://github.com/serverless/serverless/pull/6088/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+319</span>/<span style="color:#cb2431">-30</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>

### Contributor thanks

We had some community contributions included in this release and want to say thanks once again to those of you that help make the framework better. Its truly appreciated.
