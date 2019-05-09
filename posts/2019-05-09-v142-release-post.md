---
title: "Serverless Framework v1.42.0 -  API Gateway Logs, Binary Media Type Responses, Request Body Validations & More"
description: "Check out what’s included in Serverless Framework v1.42."
date: 2019-04-23
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v141-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v141-header.png"
category:
  - news
authors:
  - PhilippMuns
---

The Serverless Framework v1.42.0 release adds support for REST API access logs and API Gateway binary media type responses. Furthermore it’s now possible to set API Gateway request body validations and API key values. 
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




