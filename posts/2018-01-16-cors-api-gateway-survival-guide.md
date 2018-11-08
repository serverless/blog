---
title: "Your CORS and API Gateway survival guide"
description: "Get the basics on Cross-Origin Resource Sharing (CORS) and how to avoid problems with your Serverless web APIs on Lambda."
date: 2018-01-16
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless-square-icon-text.png'
category:
  - guides-and-tutorials
  - operations-and-observability
heroImage: ''
authors:
  - AlexDeBrie
---

Building web API backends is one of the most popular use cases for Serverless applications. You get the benefit of a simple, scalable backend without the operations overhead.

However, if you have a web page that's making calls to a backend API, you'll have to deal with the dreaded [Cross-Origin Resource Sharing](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS), or CORS. If your web page makes an HTTP request to a _different domain_ than you're currently on, it needs to be CORS-friendly.

If you've ever found yourself with the following error:

> No 'Access-Control-Allow-Origin' header is present on the requested resource

then this page is for you!

In this post, we'll cover all you need to know about Serverless + CORS. If you don't care about the specifics, hit the [TL;DR](#tldr) section below. Otherwise, we'll cover:

- [Preflight requests](#cors-preflight-requests)
- [Response headers](#cors-response-headers)
- [CORS with custom authorizers](#cors-with-custom-authorizers)
- [CORS with cookie credentials](#cors-with-cookie-credentials)

Let's get started!

#### TL;DR

If you want the quick and dirty way to solve CORS in your Serverless application, do this.

1. To handle [preflight requests](#cors-preflight-requests), add the `cors: true` flag to _each HTTP endpoint_ in your `serverless.yml`:

   ```yml
   # serverless.yml

   service: products-service

   provider:
     name: aws
     runtime: nodejs6.10

   functions:
     getProduct:
       handler: handler.getProduct
       events:
         - http:
             path: product/{id}
             method: get
             cors: true # <-- CORS!
     createProduct:
       handler: handler.createProduct
       events:
         - http:
             path: product
             method: post
             cors: true # <-- CORS!
   ```

2. To handle the [CORS headers](#cors-response-headers), return the CORS headers in your response. The main headers are `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials`.

   You can use the example below, or check out the middleware libraries discussed below to help with this:

    ```javascript
    'use strict';

    module.exports.getProduct = (event, context, callback) => {

      // Do work to retrieve Product
      const product = retrieveProduct(event);

      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          product: product
        }),
      };

      callback(null, response);
    };

    module.exports.createProduct = (event, context, callback) => {

      // Do work to create Product
      const product = createProduct(event);

      const response = {
        statusCode: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true,
        },
        body: JSON.stringify({
          product: product
        }),
      };

      callback(null, response);
    };
    ```

3. If you're using a custom authorizer, you'll need to add the following CloudFormation in your `resources` block of `serverless.yml`:

   ```yml
   # serverless.yml

   ...

	resources:
	  Resources:
	    GatewayResponseDefault4XX:
	      Type: 'AWS::ApiGateway::GatewayResponse'
	      Properties:
	        ResponseParameters:
              gatewayresponse.header.Access-Control-Allow-Origin: "'*'"
              gatewayresponse.header.Access-Control-Allow-Headers: "'*'"
	        ResponseType: DEFAULT_4XX
	        RestApiId:
	          Ref: 'ApiGatewayRestApi'
	```

#### CORS Preflight Requests

If you're not making a "simple request", your browser will send a **preflight request** to the resource using the `OPTIONS` method. The resource you're requesting will return with methods that are safe to send to the resource and may optionally return the headers that are valid to send across.

Let's break that down.

##### When does my browser send a preflight request?

Your browser will send a preflight request on almost all cross-origin requests. (The exceptions are "simple requests", but it's a pretty narrow subset of requests.)

Basically, a simple request is only a `GET` request or a `POST` request with form data that has _no authentication_. If you're outside of that, it will need a preflight.

If you use a `PUT` or `DELETE` request, it will send a preflight. If you use a `Content-Type` header outside of `application/x-www-form-urlencoded`, `multipart/form-data`, or `text/plain`, it will send a preflight. If you include any headers outside some very basic ones, such as Authentication headers, it will send a preflight.

##### What's in the response to the preflight request?

The response to a preflight request includes the domains it allows to access the resources and the methods it allows at that resource, such as `GET`, `POST`, `PUT`, etc. It may also include headers that are allowed at that resource, such as `Authentication`.

##### How do I handle preflight requests with Serverless?

To set up the preflight response, you'll need to configure an `OPTIONS` method handler at your endpoint in API Gateway. Fortunately, this is very simple with the Serverless Framework.

Simply add `cors: true` to _each endpoint_ in your `serverless.yml`:

```yml
# serverless.yml

service: products-service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  getProduct:
    handler: handler.getProduct
    events:
      - http:
          path: product/{id}
          method: get
          cors: true # <-- CORS!
  createProduct:
    handler: handler.createProduct
    events:
      - http:
          path: product
          method: post
          cors: true # <-- CORS!
```

This configures API Gateway to allow any domain to access, and it includes a basic set of allowed headers. If you want additional customization (advanced usage only), it will look like this:

```yml
# serverless.yml

service: products-service

provider:
  name: aws
  runtime: nodejs6.10

functions:
  getProduct:
    handler: handler.getProduct
    events:
      - http:
          path: product/{id}
          method: get
          cors:
            origin: '*' # <-- Specify allowed origin
            headers: # <-- Specify allowed headers
              - Content-Type
              - X-Amz-Date
              - Authorization
              - X-Api-Key
              - X-Amz-Security-Token
              - X-Amz-User-Agent
            allowCredentials: false
```

#### CORS Response Headers

While the preflight request only applies to some cross-origin requests, the CORS response headers must be present in _every_ cross-origin request. This means you must add the `Access-Control-Allow-Origin` header to your responses in your handlers.

If you're using cookies or other authentication, you'll also need to add the `Access-Control-Allow-Credentials` header to your response.

To match the `serverless.yml` in the section above, your `handler.js` file should look like:

```javascript
// handler.js

'use strict';

module.exports.getProduct = (event, context, callback) => {

  // Do work to retrieve Product
  const product = retrieveProduct(event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product: product
    }),
  };

  callback(null, response);
};

module.exports.createProduct = (event, context, callback) => {

  // Do work to create Product
  const product = createProduct(event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product: product
    }),
  };

  callback(null, response);
};
```

Note how the `response` object has a `headers` property, which contains an object with `Access-Control-Allow-Origin` and `Access-Control-Allow-Credentials`.

It can be a real pain to add these headers everywhere in your function, particularly if you have multiple logical paths. Luckily, there are some nice tools to help with this!

If you use Javascript, check out the [Middy](https://middy.js.org/) middleware engine for use with Lambda. It has a lot of nice middlewares that handle the boring boilerplate of your Lambda functions. One is the `cors` middleware, which automatically adds CORS headers to your functions.

A basic example looks like this:

```javascript
// handler.js

const middy = require('middy')
const { cors } = require('middy/middlewares')

// This is your common handler, no way different than what you are used to do every day
// in AWS Lambda
const hello = (event, context, callback) => {

  const response = {
    statusCode: 200,
    body: "Hello, world!"
  }

  return callback(null, response)
}

// Let's "middyfy" our handler, then we will be able to attach middlewares to it
const handler = middy(hello)
  .use(cors()) // Adds CORS headers to responses

module.exports = { handler }
```

Perfect—automatic CORS headers! Check out the whole Middy library for lots of other nice utilities.

If you're a Pythonista, [Daniel Schep](https://twitter.com/schep_) has made a nice [`lambda-decorators`](https://github.com/dschep/lambda-decorators) library with the same goals as Middy—replacing Lambda boilerplate.

Here's an example of using it in your Python functions:

```python
# handler.py

from lambda_decorators import cors_headers

@cors_headers
def hello(event, context):
	return {
		'statusCode': 200,
		'body': "Hello, world!"
	}
```

**Note:** Daniel is the creator of the [`serverless-python-requirements`](https://github.com/UnitedIncome/serverless-python-requirements) package, which you should absolutely be using if you're writing Lambda functions in Python. Check out our previous [blog post on Python packaging](https://serverless.com/blog/serverless-python-packaging/).

#### CORS with custom authorizers

[Custom authorizers](https://serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-custom-authorizers) allow you to protect your Lambda endpoints with a function that is responsible for handling authorization.

If the authorization is successful, it will forward the request onto the Lambda handler. If it's unsuccessful, it will reject the request and return to the user.

The CORS difficulty lies in the second scenario—if you reject an authorization request, you don't have the ability to specify the CORS headers in your response. This can make it difficult for the client browser to understand the response.

To handle this, you'll need to add a custom GatewayResponse to your API Gateway. You'll add this in the `resources` block of your `serverless.yml`:

```yml

functions:
   ...

resources:
  Resources:
    GatewayResponseDefault4XX:
      Type: 'AWS::ApiGateway::GatewayResponse'
      Properties:
        ResponseParameters:
          gatewayresponse.header.Access-Control-Allow-Origin: "'*'"
          gatewayresponse.header.Access-Control-Allow-Headers: "'*'"
        ResponseType: DEFAULT_4XX
        RestApiId:
          Ref: 'ApiGatewayRestApi'
```

This will ensure that the proper response headers are returned from your custom authorizer rejecting an authorization request.

#### CORS with Cookie credentials

_Note: This section was added on January 29, 2018 thanks to a request from [Alex Rudenko](https://twitter.com/orKoN). Hat tip to Martin Splitt for [a great article](http://50linesofco.de/post/2017-03-06-cors-a-guided-tour#credentials-and-cors) on this issue._

In the examples above, we've given a wildcard "*" as the value for the `Access-Control-Allow-Origin` header. However, if you're making a [request using credentials](https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS#Requests_with_credentials), the wildcard value is not allowed. For your browser to make use of the response, the `Access-Control-Allow-Origin` response headers _must_ include the specific origin that made the request.

There are two ways you can handle this. First, if you only have one origin website that's making the request, you can just hardcode that into your Lambda function's response:

```javascript
// handler.js

'use strict';

module.exports.getProduct = (event, context, callback) => {

  // Do work to retrieve Product
  const product = retrieveProduct(event);

  const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': 'https://myorigin.com', // <-- Add your specific origin here
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({
      product: product
    }),
  };

  callback(null, response);
};
```

If you have multiple origin websites that may be hitting your API, then you'll need to do a more dynamic approach. You can inspect the `origin` header to see if its in your list of approved origins. If it is, return the origin value in your `Access-Control-Allow-Origin` header:

```javascript
// handler.js

'use strict';

const ALLOWED_ORIGINS = [
	'https://myfirstorigin.com',
	'https://mysecondorigin.com'
];

module.exports.getProduct = (event, context, callback) => {

  const origin = event.headers.origin;
  let headers;

  if (ALLOWED_ORIGINS.includes(origin) {
    headers: {
      'Access-Control-Allow-Origin': origin,
      'Access-Control-Allow-Credentials': true,
    },
  } else {
      headers: {
      'Access-Control-Allow-Origin': '*',
    },
  }

  // Do work to retrieve Product
  const product = retrieveProduct(event);

  const response = {
    statusCode: 200,
    headers
    body: JSON.stringify({
      product: product
    }),
  };

  callback(null, response);
};
```

In this example, we check if the `origin` header matches one of our allowed headers. If so, we include the specific origin in our `Access-Control-Allow-Origin` header, and we state that `Access-Control-Allow-Credentials` are allowed. If the `origin` is not one of our allowed origins, we include the standard headers which will be rejected if the origin attempts a credentialed request.

#### Conclusion

CORS can be a pain, but there are a few straightforward steps you can take to make it much easier to deal with.

You know what that means. Goodbye forever, inexplicable `No 'Access-Control-Allow-Origin' header is present on the requested resource` error. 👋
