---
title: Announcing Support for AWS HTTP APIs
description: "The Serverless Framework now supports the AWS HTTP API - the v2 of API Gateway for HTTP APIs."
date: 2020-02-25
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-http-api-v2/thumbnail-support-http-apis.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-http-api-v2/hero-support-http-apis.png"
authors:
  - MariuszNowak
category:
  - news
---

## AWS HTTP API support just landed!

![Example serverless.yml HTTP API configuration](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-http-api-v2/http-api-example.png)

By introducing the [HTTP API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api.html) service (still in beta) last December, AWS offered us a lighter, [cheaper](https://aws.amazon.com/api-gateway/pricing/#HTTP_APIs_.28Preview.29), faster and in general better designed alternative to REST APIs. More importantly, HTTP API is way easier to configure and can also be created by [importing an Open API](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-import.html) definition file. What’s not to love?

## How HTTP APIs are different from REST APIs?

HTTP APIs truly embody the "less is more" ethos -- they have fewer configuration options but support catch-all routing (which is not possible with REST APIs), built in JWT authorization, global rules for CORS headers and automatic deployments which make the deployment of production APIs dead simple. 

At this point, we can direct endpoints to either trigger AWS Lambda or to another URL endpoint, but there’s no integration with other AWS services.

With that said, HTTP APIs are still in beta and have several limitations as highlighted below:

- No support for Usage plans and API Keys as with REST APIs.
- No wildcard subdomains
- Request and response transformation non existent
- No caching, validation etc. (have to be implemented in lambda logic)
- Cannot deploy edge-optimized or private API's. All deployments are regional and public
- While we can enable simple access logs and receive CloudWatch metrics, there is no AWS X-Ray support or ability to propagate logs to Kinesis Data Firehose 

For full outline of differences see [Choosing Between HTTP APIs and REST APIs](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) section in AWS documentation. However, the service is fast improving and as it moves towards GA, we expect a lot of these to be addressed.

## How to configure a Rest API backed by HTTP API with Serverless Framework?

As HTTP API differs from API Gateway in many parts, and only very basic Rest API configuration, can be easily translated from API Gateway to HTTP API, we decided to propose a new event (httpApi) for HTTP API case, which should be attached to functions in the traditional way:

```yaml
functions:
  someFunction:
    handler: someFunction.handler
      events:
        - httpApi: ....
```

### Configuring Routes

Configuring a basic route for a specific method is as simple as:

`httpApi: GET /get-something`

Your API Gateway path can also include parameters:

`httpApi: GET /get-something/{param}`

We can also configure a method catch-all route for a specific path:

`httpApi: * /get-something`

Or define one catch-all route, and handle all request from scope of single lambda function:

`httpApi: *`

*Note: When configuring catch-all route, you may still redirect requests for specific paths to different lambdas by configuring intended dedicated routes*

If there's a need to customize the `httpApi` event further (with configuration options mentioned below), then event configuration should be outlined in object form as below:

```yaml
httpApi:
  method: GET
  route: /get-something
```

### Configuring JWT authorizers

When configuring plain routes, we configure a publicly accessible API. If there’s a need to restrict access to whole API or some endpoint, we must rely on JWT authorizers, as currently it’s the only access restriction method currently supported by HTTP API. Fortunately, AWS Cognito User Pools are perfectly suited to this purpose. 

To add User Pools, we need to configure authorizers in the provider.httpApi.authorizers section, where we list JWT authorizers by name as follows:

```yaml
provider:
  httpApi:
    authorizers:
      someAuthorizer:
        # Point request header at which JWT token will be provided
        identitySource: $request.header.Authorization
        # Issuer url, in case of Cognito User Pools url will be like: 
        # https://cognito-idp.${region}.amazonaws.com/${cognitoPoolId}
        issuerUrl: <url>
        # Audience for which access is intended
        # In case of Cognito User Pools we need to list client ids
        audience:
          - <audience1>
          - <audience2>
```

Having that, we need to indicate endpoints for which we want to restrict access with configured authorizers:

```yaml
functions:
  someFunction:
    handler: someFunction.handler
    events:
     - httpApi:
          method: GET
          path: /some-function
          authorizer: someAuthorizer
```

If we need to provide authorization scopes, then endpoint configuration should be extended as:

```yaml
functions:
  someFunction:
    handler: someFunction.handler
    events:
      - httpApi:
          method: GET
          path: /some-function
          authorizer:
            name: someAuthorizer
            scopes:
              - user.id
              - user.email
```

### Configuring CORS

If you intend to consume API endpoints in a browser then most likely you need CORS headers. CORS headers can be configured just globally for all API endpoints, and in Serverless Framework you may configure them in two ways.

The first one is to set following and rely on Framework defaults:

```yaml
provider:
  httpApi:
    cors: true
```

It’ll ensure following headers:

- `Access-Control-Allow-Origin`: `*`
- `Access-Control-Allow-Headers`:
  - `Content-Type`, `X-Amz-Date`, `Authorization`, `X-Api-Key`, `X-Amz-Security-Token`, `X-Amz-User-Agent`
- `Access-Control-Allow-Methods`: 
  - `OPTIONS`, and all the methods defined in your routes (`GET`, `POST`, etc.)

If you need more fine grain customization you can configure each header individually with following setup:

```yaml
provider:
  httpApi:
    cors:
      allowedOrigins:
        - https://url1.com
        - https://url2.com
      allowedHeaders:
        - Content-Type
        - Authorization
      allowedMethods:
        - GET
      allowCredentials: true
      exposedResponseHeaders:
        - Special-Response-Header
      maxAge: 6000 # In seconds
```

*Note: Any not configured header will fallback to Framework default*

## What's Next?

HTTP APIs are subject for further extensions in the framework. Notably the ability to configure access logs and ability to share the same API across different services will be published soon. We are also planning to add an option to reference an Open API spec in your `serverless.yml` functions config.

Please follow [this GitHub issue](https://github.com/serverless/serverless/issues/7052) for updates. If you approach any issues or want to propose an improvement do not hesitate sharing that by either commenting under this issue or opening a new dedicated report.

Have fun! We hope that introducing support for AWS HTTP API in Serverless Framework will springboard your serverless development process and we can't wait to see what you build with it!
