---
title: "Serverless Framework v1.41 - X-Ray for API Gateway, Invoke Local with Docker Improvements & More"
description: "Check out what’s included in Serverless Framework v1.41."
date: 2019-04-23
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v141-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v141-header.png"
category:
  - news
authors:
  - PhilippMuns
---

With the Serverless Framework v1.41.0 release, we’re adding AWS X-Ray Tracing support for API Gateway, which complements the AWS tracing story and makes it possible to trace incoming events from API Gateway all the way through your Lambda functions. Our new version also adds support for multiple API Gateway usage plan and key definitions as well as lots of enhancements for local function invocations via Docker. In addition to that, we also addressed a couple of bug fixes and enhancements. 1 bug fix and 7 enhancements were merged and are now available in our v1.41.0 release.

### X-Ray support for AWS API Gateway

AWS API Gateway is one of the central services used in many serverless applications. Interactions with an API Gateway-driven serverless backend start with an event which is triggered via an HTTP request and then re-routed to the corresponding AWS Lambda function.

It would be great to monitor and trace requests through the service-stack to better understand how requests are processed and where they spend most of their lifetime.

In one of our [previous Serverless Framework releases](https://serverless.com/blog/framework-release-v140/) we introduced AWS X-Ray Tracing for AWS Lambda. With this post, we now complete the picture by adding [AWS X-Ray](https://docs.aws.amazon.com/xray/index.html) Tracing support for API Gateway.

Enabling tracing for API Gateway is as easy as enabling the corresponding config on the `provider` property:

```yaml
provider:
  tracing:
    apiGateway: true
```

X-Ray tracing works best when it’s used across multiple AWS services. If you’re using X-Ray Tracing for API Gateway you might want to enable it for your Lambda functions as well:

```yaml
provider:
  tracing:
    apiGateway: true
    lambda: true
```

This way you can get more insights into your API Gateway → Lambda setup when using the [X-Ray Tracing Service Map](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-using-xray-maps.html?shortFooter=true#apigateway-using-xray-maps-active)

**IMPORTANT:**
Due to CloudFormation limitations it's not possible to enable AWS X-Ray Tracing on existing deployments which don’t use tracing right now.

Please remove the old API Gateway and re-deploy it with tracing enabled if you want to use AWS X-Ray Tracing for API Gateway.

### Support for multiple usage plans

Sometimes it’s useful to limit access to your API Gateway when exposing it to the public. In previous versions of the Serverless Framework this could be easily done via [API Keys and usage plans](https://serverless.com/framework/docs/providers/aws/events/apigateway/#setting-api-keys-for-your-rest-api):

```yaml
provider:
 name: aws
 apiKeys:
   - keyOne
   - keyTwo
 usagePlan:
   quota:
     limit: 5000
     offset: 2
     period: MONTH
   throttle:
     burstLimit: 200
     rateLimit: 100
```

The initial implementation which supported one usage plan and multiple API Keys was usually enough for simple API Gateway setups.

However in production setups one usually needs more flexibility. It’s very common to have different types of usage plans for different user types, such as “free” plan users and “paid” plan users.

The Serverless Framework v1.41.0 adds support for multiple usage plans. Multiple API Keys can be assigned to each usage plan:

```yaml
provider:
  name: aws
  apiKeys:
    - free:
      - freeKeyOne
      - freeKeyTwo
    - paid:
      - paidKeyOne
      - paidKeyTwo
  usagePlan:
    - free:
        quota:
          limit: 5000
          offset: 2
          period: MONTH
        throttle:
          burstLimit: 200
          rateLimit: 100
    - paid:
        quota:
          limit: 50000
          offset: 1
          period: MONTH
        throttle:
          burstLimit: 2000
          rateLimit: 1000
```

### Docker Invoke Local improvements

Serverless Framework [recently added support](https://serverless.com/blog/framework-release-v140/) for local function invocation via Docker, meaning that every AWS Lambda runtime can now be invoked locally in a Docker container.

Serverless Framework v1.41.0 adds support for:
[function environment variables](https://github.com/serverless/serverless/pull/5988); 
[access to function dependencies](https://github.com/serverless/serverless/pull/5977); 
[lambda layer download caching](https://github.com/serverless/serverless/pull/5992); and 
[Docker argument passing](https://github.com/serverless/serverless/pull/5994).

#### Bug Fixes

- [#5988](https://github.com/serverless/serverless/pull/5988) #5945: Invoke local docker to pass env vars to lambda container<a href="https://github.com/serverless/serverless/pull/5988/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+80</span>/<span style="color:#cb2431">-4</span></a> <a href="https://github.com/endeepak"> <img src='https://avatars0.githubusercontent.com/u/310608?v=4' style="vertical-align: middle" alt='' height="20px"> endeepak</a>

#### Enhancements

- [#5964](https://github.com/serverless/serverless/pull/5964) Add error message when provider does not exist<a href="https://github.com/serverless/serverless/pull/5964/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+15</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/Xenonym"> <img src='https://avatars0.githubusercontent.com/u/1782590?v=4' style="vertical-align: middle" alt='' height="20px"> Xenonym</a>
- [#5973](https://github.com/serverless/serverless/pull/5973) The code for removing comments is easy to read<a href="https://github.com/serverless/serverless/pull/5973/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+0</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/xichengliudui"> <img src='https://avatars3.githubusercontent.com/u/40875627?v=4' style="vertical-align: middle" alt='' height="20px"> xichengliudui</a>
- [#5977](https://github.com/serverless/serverless/pull/5977) #5947: Ensure invoke local docker runs lambda with the dependencies<a href="https://github.com/serverless/serverless/pull/5977/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+32</span>/<span style="color:#cb2431">-22</span></a> <a href="https://github.com/endeepak"> <img src='https://avatars0.githubusercontent.com/u/310608?v=4' style="vertical-align: middle" alt='' height="20px"> endeepak</a>
- [#5997](https://github.com/serverless/serverless/pull/5997) Add additional Capability when Transform is detected<a href="https://github.com/serverless/serverless/pull/5997/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+54</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/pofallon"> <img src='https://avatars0.githubusercontent.com/u/505519?v=4' style="vertical-align: middle" alt='' height="20px"> pofallon</a>
- [#6010](https://github.com/serverless/serverless/pull/6010) Allow specifying a retention policy for lambda layers<a href="https://github.com/serverless/serverless/pull/6010/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+63</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#6011](https://github.com/serverless/serverless/pull/6011) Updating Node.js runtime version<a href="https://github.com/serverless/serverless/pull/6011/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/ffxsam"> <img src='https://avatars2.githubusercontent.com/u/12532733?v=4' style="vertical-align: middle" alt='' height="20px"> ffxsam</a>
- [#6013](https://github.com/serverless/serverless/pull/6013) Make it easier on the eyes of serverless newcomers<a href="https://github.com/serverless/serverless/pull/6013/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+3</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/guerrerocarlos"> <img src='https://avatars2.githubusercontent.com/u/82532?v=4' style="vertical-align: middle" alt='' height="20px"> guerrerocarlos</a>

#### Documentation

- [#6018](https://github.com/serverless/serverless/pull/6018) Update quick-start.md<a href="https://github.com/serverless/serverless/pull/6018/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/allanchua101"> <img src='https://avatars1.githubusercontent.com/u/26626798?v=4' style="vertical-align: middle" alt='' height="20px"> allanchua101</a>
- [#6023](https://github.com/serverless/serverless/pull/6023) Update newsletter + enterprise link in readme<a href="https://github.com/serverless/serverless/pull/6023/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/pdaryani"> <img src='https://avatars1.githubusercontent.com/u/43791027?v=4' style="vertical-align: middle" alt='' height="20px"> pdaryani</a>

#### Features

- [#5692](https://github.com/serverless/serverless/pull/5692) Add AWS x-ray support for API Gateway<a href="https://github.com/serverless/serverless/pull/5692/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+368</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/softprops"> <img src='https://avatars3.githubusercontent.com/u/2242?v=4' style="vertical-align: middle" alt='' height="20px"> softprops</a>
- [#5954](https://github.com/serverless/serverless/pull/5954) #4750 Java invoke local support for handlers that implement RequestStreamHandler<a href="https://github.com/serverless/serverless/pull/5954/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+138</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/XaeroDegreaz"> <img src='https://avatars3.githubusercontent.com/u/312459?v=4' style="vertical-align: middle" alt='' height="20px"> XaeroDegreaz</a>
- [#5970](https://github.com/serverless/serverless/pull/5970) Add support for multiple usage plans<a href="https://github.com/serverless/serverless/pull/5970/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+875</span>/<span style="color:#cb2431">-173</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#5971](https://github.com/serverless/serverless/pull/5971) Added rust template for Cloudflare WASM<a href="https://github.com/serverless/serverless/pull/5971/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+151</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/jspies"> <img src='https://avatars1.githubusercontent.com/u/13679?v=4' style="vertical-align: middle" alt='' height="20px"> jspies</a>
- [#5994](https://github.com/serverless/serverless/pull/5994) #5993: Ability to pass args for docker run command during invoke local docker<a href="https://github.com/serverless/serverless/pull/5994/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+56</span>/<span style="color:#cb2431">-4</span></a> <a href="https://github.com/endeepak"> <img src='https://avatars0.githubusercontent.com/u/310608?v=4' style="vertical-align: middle" alt='' height="20px"> endeepak</a>

### Contributor thanks

As always, we appreciate each and every one of you that use and contribute to the Framework and Serverless ecosystem!
