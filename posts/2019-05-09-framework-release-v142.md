---
title: "Serverless Framework v1.42.0 -  API Gateway Logs, Binary Media Type Responses, Request Body Validations & More"
description: "Check out what’s included in Serverless Framework v1.42."
date: 2019-05-09
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v142-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v142-header.png"
category:
  - news
authors:
  - PhilippMuns
---

It is now easier to build even more robust APIs using the Serverless Framework. The Serverless Framework v1.42.0 release adds support for REST API access logs and API Gateway binary media type responses. Furthermore it’s now possible to set API Gateway request body validations and API key values. 
In addition to that we also addressed bug fixes and enhancements. 3 bug fixes and 7 enhancements were merged 
and are now available in our v1.42.0 release.

### API Gateway REST API logs

Operating a serverless REST service at scale requires access to logs in order to gain insights into the API 
usage and potential issues the current setup might run into.

With Serverless Framework v1.42.0 it’s easy to enable API access logs. Just set the corresponding value on the 
`provider` config level like so:

```yaml
provider:
  logs:
    restApi: true
```

After a redeploy you should see a dedicated log group where all your services API requests will be logged.

Note that we’re planning to roll out some more fine grained configurability for API Gateway access logs. 
Feel free to join our discussion about potential enhancements 
[in this issue](https://github.com/serverless/serverless/issues/6094).

### Binary Media Type responses

Sometimes it’s a product requirement to not just support text-based REST APIs. What if a customer should be able 
to download .pdf invoices, .xlsx spreadsheets or you want to be able to return images based on API requests.

With Serverless Framework v1.42.0 it’s now possible to support a range of different Binary Media Types.

Enabling support for API Gateway binary responses is as easy as configuring the corresponding property on the 
`provider` level:

```yaml
provider:
  apiGateway:
    binaryMediaTypes:
      - '*/*'
```

You could use the wildcard setup (as shown above) to allow all binary media types. Additionally you can 
specify which files you’ll return by using the following config:

```yaml
provider:
  apiGateway:
    binaryMediaTypes:
      - 'image/png'
      - ‘image/jpeg’
```

Note that you might also want to make sure to return the correct `Content-Type` header and (e.g. base64) encoded 
body in your Lambda response.

### Request body validation

Validations are useful to stop processing malformed requests early on. Having support for such checks on the API 
level is beneficial because it makes it possible to reject invalid requests at an early stage without the need to 
go all the way through until the request hits the Lamdba function which will reject it anyway.

Using the `http` event one can now configure request body validations which are JSON documents used by API Gateway 
to filter incoming API requests.

Setting request body validations is best done by creating a `.json` file with the definition of the validation:

```json
{
  "definitions": {},
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "title": "The Root Schema",
  "required": [
    "username"
  ],
  "properties": {
    "username": {
      "type": "string",
      "title": "The Foo Schema",
      "default": "",
      "pattern": "^[a-zA-Z0-9]+$"
    }
  }
}
```

After that you just need to point to that file in your `http` request schema configuration:

```yaml
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: users/create
          method: post
          request:
            schema:
              application/json: ${file(create_request.json)}
```

Note that you can also inline your JSON validation definition, however it’s often easier to just reference a 
file on your filesystem.

### API Key values

Controlling access to your API Gateway is best done by leveraging usage plans and API Keys. The Serverless Framework 
already supports both via the `apiKeys` and `usagePlan` configs.

When using such configurations API Gateway took care of the API Key value generation.

The Serverless Framework v1.42.0 adds support to control such values, making it easier and more deterministic to 
generate and hand out API keys to users.

Here’s an example that shows how API keys and usage plans can be used with the new Serverless Framework version:

#### API key value definitions without usage plans

```yaml
provider:
  apiKeys:
    - original # original format
    - name: new-key-and-value # name and value
      value: apikeyvalueapikeyvalue
    - name: only-name # only name
    - value: onlyvalueonlyvalueonlyvalue # only value
      description: description for the api key
```

#### API key value definitions with usage plans

```yaml
provider:
  apiKeys:
    - free:
      - original # original format
      - name: new-key-and-value # name and value
        value: apikeyvalueapikeyvalue
      - name: only-name # only name
      - value: onlyvalueonlyvalueonlyvalue # only value
        description: Api key for ${self:provider.stage} stage
    - paid:
      - original-paid
  usagePlan:
    - free:
        quota:
          limit: 1
          offset: 2
          period: MONTH
        throttle:
          burstLimit: 100
          rateLimit: 200
    - paid:
        quota:
          limit: 1
          offset: 2
          period: MONTH
        throttle:
          burstLimit: 100
          rateLimit: 200
```

#### Bug Fixes

- [#5952](https://github.com/serverless/serverless/pull/5952) Support setting both proxy and ca file for awsprovider AWS config agent<a href="https://github.com/serverless/serverless/pull/5952/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+20</span>/<span style="color:#cb2431">-4</span></a> <a href="https://github.com/snurmine"> <img src='https://avatars0.githubusercontent.com/u/16050765?v=4' style="vertical-align: middle" alt='' height="20px"> snurmine</a>
- [#6040](https://github.com/serverless/serverless/pull/6040) Remove safeguards when using API Gateway Stage resource settings<a href="https://github.com/serverless/serverless/pull/6040/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-194</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#6042](https://github.com/serverless/serverless/pull/6042) Merging v1.41.1 changes back into master<a href="https://github.com/serverless/serverless/pull/6042/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+12</span>/<span style="color:#cb2431">-200</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>

#### Enhancements

- [#6026](https://github.com/serverless/serverless/pull/6026) Use region pseudo parameter<a href="https://github.com/serverless/serverless/pull/6026/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+19</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/daaru00"> <img src='https://avatars1.githubusercontent.com/u/8782994?v=4' style="vertical-align: middle" alt='' height="20px"> daaru00</a>
- [#6038](https://github.com/serverless/serverless/pull/6038) Add more specific sub command error handling<a href="https://github.com/serverless/serverless/pull/6038/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+115</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/TylerSustare"> <img src='https://avatars1.githubusercontent.com/u/10850753?v=4' style="vertical-align: middle" alt='' height="20px"> TylerSustare</a>
- [#6043](https://github.com/serverless/serverless/pull/6043) Support wildcard in API Gateway cors domains<a href="https://github.com/serverless/serverless/pull/6043/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+23</span>/<span style="color:#cb2431">-5</span></a> <a href="https://github.com/tdmartino"> <img src='https://avatars0.githubusercontent.com/u/20191850?v=4' style="vertical-align: middle" alt='' height="20px"> tdmartino</a>
- [#6064](https://github.com/serverless/serverless/pull/6064) Allow Fn::Join in stream event arns<a href="https://github.com/serverless/serverless/pull/6064/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+93</span>/<span style="color:#cb2431">-33</span></a> <a href="https://github.com/Tybot204"> <img src='https://avatars3.githubusercontent.com/u/7002601?v=4' style="vertical-align: middle" alt='' height="20px"> Tybot204</a>
- [#6070](https://github.com/serverless/serverless/pull/6070) Highlight skipping of deployments<a href="https://github.com/serverless/serverless/pull/6070/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+72</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#6079](https://github.com/serverless/serverless/pull/6079) Improve integration test of aws-scala-sbt<a href="https://github.com/serverless/serverless/pull/6079/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/NomadBlacky"> <img src='https://avatars2.githubusercontent.com/u/3215961?v=4' style="vertical-align: middle" alt='' height="20px"> NomadBlacky</a>
- [#6084](https://github.com/serverless/serverless/pull/6084) SDK based API Gateway Stage updates<a href="https://github.com/serverless/serverless/pull/6084/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+565</span>/<span style="color:#cb2431">-73</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>

#### Documentation

- [#6027](https://github.com/serverless/serverless/pull/6027) Update cors.md<a href="https://github.com/serverless/serverless/pull/6027/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+3</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/fabiorogeriosj"> <img src='https://avatars3.githubusercontent.com/u/1442874?v=4' style="vertical-align: middle" alt='' height="20px"> fabiorogeriosj</a>
- [#6052](https://github.com/serverless/serverless/pull/6052) Fix doc: How to update serverless<a href="https://github.com/serverless/serverless/pull/6052/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/maplain"> <img src='https://avatars2.githubusercontent.com/u/2901728?v=4' style="vertical-align: middle" alt='' height="20px"> maplain</a>
- [#6061](https://github.com/serverless/serverless/pull/6061) Update event.md<a href="https://github.com/serverless/serverless/pull/6061/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/PatNeedham"> <img src='https://avatars0.githubusercontent.com/u/967811?v=4' style="vertical-align: middle" alt='' height="20px"> PatNeedham</a>
- [#6068](https://github.com/serverless/serverless/pull/6068) Fix markup error with Authentication value<a href="https://github.com/serverless/serverless/pull/6068/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/rakeshyoga"> <img src='https://avatars3.githubusercontent.com/u/6423647?v=4' style="vertical-align: middle" alt='' height="20px"> rakeshyoga</a>
- [#6075](https://github.com/serverless/serverless/pull/6075) Drop duplicate paragraph in aws/guide/credentials<a href="https://github.com/serverless/serverless/pull/6075/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+0</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/bfred-it"> <img src='https://avatars3.githubusercontent.com/u/1402241?v=4' style="vertical-align: middle" alt='' height="20px"> bfred-it</a>
- [#6085](https://github.com/serverless/serverless/pull/6085) Update serverless.yml.md<a href="https://github.com/serverless/serverless/pull/6085/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/marcinhou"> <img src='https://avatars2.githubusercontent.com/u/4211616?v=4' style="vertical-align: middle" alt='' height="20px"> marcinhou</a>
- [#6092](https://github.com/serverless/serverless/pull/6092) Fixed three small typos in doc<a href="https://github.com/serverless/serverless/pull/6092/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+4</span>/<span style="color:#cb2431">-4</span></a> <a href="https://github.com/0xflotus"> <img src='https://avatars3.githubusercontent.com/u/26602940?v=4' style="vertical-align: middle" alt='' height="20px"> 0xflotus</a>
- [#6093](https://github.com/serverless/serverless/pull/6093) fixed small errors in spotinst docs<a href="https://github.com/serverless/serverless/pull/6093/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+6</span>/<span style="color:#cb2431">-6</span></a> <a href="https://github.com/0xflotus"> <img src='https://avatars3.githubusercontent.com/u/26602940?v=4' style="vertical-align: middle" alt='' height="20px"> 0xflotus</a>

#### Features

- [#5956](https://github.com/serverless/serverless/pull/5956) AWS API Gateway request body validation<a href="https://github.com/serverless/serverless/pull/5956/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+157</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5982](https://github.com/serverless/serverless/pull/5982) Enable Setting Amazon API Gateway API Key Value<a href="https://github.com/serverless/serverless/pull/5982/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+306</span>/<span style="color:#cb2431">-465</span></a> <a href="https://github.com/laardee"> <img src='https://avatars1.githubusercontent.com/u/4726921?v=4' style="vertical-align: middle" alt='' height="20px"> laardee</a>
- [#6000](https://github.com/serverless/serverless/pull/6000) Add authorization scopes support for cognito user pool integration<a href="https://github.com/serverless/serverless/pull/6000/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+29</span>/<span style="color:#cb2431">-8</span></a> <a href="https://github.com/herebebogans"> <img src='https://avatars1.githubusercontent.com/u/17776689?v=4' style="vertical-align: middle" alt='' height="20px"> herebebogans</a>
- [#6057](https://github.com/serverless/serverless/pull/6057) Add support for API Gateway REST API Logs<a href="https://github.com/serverless/serverless/pull/6057/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+309</span>/<span style="color:#cb2431">-20</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#6063](https://github.com/serverless/serverless/pull/6063) Add support for API Gateway Binary Media Types<a href="https://github.com/serverless/serverless/pull/6063/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+101</span>/<span style="color:#cb2431">-63</span></a> <a href="https://github.com/pmuens"> <img src='https://avatars3.githubusercontent.com/u/1606004?v=4' style="vertical-align: middle" alt='' height="20px"> pmuens</a>
- [#6078](https://github.com/serverless/serverless/pull/6078) Implement logging with Log4j2 for aws-scala-sbt<a href="https://github.com/serverless/serverless/pull/6078/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+38</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/NomadBlacky"> <img src='https://avatars2.githubusercontent.com/u/3215961?v=4' style="vertical-align: middle" alt='' height="20px"> NomadBlacky</a>

### Contributor thanks

Once again, big thanks to all involved who contribute to the Framework to make these releases a success.


