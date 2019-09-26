---
title: "How to Create a multi-cloud REST API with Serverless Framework and the Serverless Multicloud SDK"
description: "Learn how to write a single Serverless REST API that can be deployed to multiple clouds including Azure and AWS"
date: 2019-10-01
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part1/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part1/header.png"
category:
  - guides-and-tutorials
authors:
  - WallaceBreza
---

#### Overview

Today - it is incredibly easy to deploy Serverless applications using the Serverless Framework.  What happens when your business is adopting a multi-cloud strategy?  There is no easy way to write a single Serverless app that can be easily deployed across multiple cloud providers without using containers... until now.

Introducing the Serverless Multicloud SDK.  With the Serverless Multicloud SDK you can write your Serverless handlers once in a cloud agnostic format and continue to use the Serverless CLI to deploy your service to each of your targeted cloud providers.

This effort is a joint venture between Microsoft, 7-Eleven & Serverless, Inc

In the initial release the Serverless Multicloud SDK supports NodeJS with both Microsoft Azure and Amazon Web Services.  The SDK has an Express-like feel.  It supports familiar concepts like `Middleware` to abstract away your service's cross-cutting concerns like logging, exception handling, validation and authorization.  The framework supports creating your own middleware components that can be reused and plug seamlessly into your applications pipeline.

This guide assumes you have some working knowledge of NodeJS and how to build services with the Serverless Framework.  We will walk through the process of migrating a REST API to use the new Serverless Multicloud SDK.

#### Prerequisites
Install the Serverless CLI globally
```bash
npm install -g serverless
```

#### Reference Serverless Multicloud SDK
Install the Serverless Multicloud core package in additional to the packages for your targeted cloud providers.
```bash
npm install @multicloud/sls-core @multicloud/sls-azure @multicloud/sls-aws --save
```

#### Setup & Configuration
Next step is to configure the multicloud application utilizing the Serverless Multicloud SDK.  Create a new file `app.js` in the root of your application.

##### Application Instance
Start by importing the `App` from `@multicloud/sls-core` as well as the cloud provider specific modules that your application is targeting.
```javascript
const { App } = require("@multicloud/sls-core");
const { AzureModule } = require("@multicloud/sls-azure");
const { AwsModule } = require("@multicloud/sls-aws");

module.exports = new App(new AzureModule(), new AwsModule());
```

Instantiate a new instance of the Multicloud app referencing the imported the cloud provider specific modules.  In the future - as additional cloud providers become supported it will be as easy as update your targeted providers by modifying the modules that the application uses.

##### Middleware Configuration 
Next - Let's configure the middleware pipeline that will be run for each request.  Create a new `config.js` file in the root of your application.

> Important: Middleware components are executed in the order in which they are defined in your array


```javascript
const {
  LoggingServiceMiddleware,
  HTTPBindingMiddleware,
  PerformanceMiddleware,
  ExceptionMiddleware,
  ConsoleLogger,
  LogLevel,
} = require("@multicloud/sls-core");

const defaultLogger = new ConsoleLogger(LogLevel.VERBOSE);

module.exports = function config() {
  return [
    LoggingServiceMiddleware(defaultLogger),
    PerformanceMiddleware(),
    ExceptionMiddleware({ log: defaultLogger.error }),
    HTTPBindingMiddleware()
  ];
};
```

In this configuration we are going to use a few middleware components that ship within the Serverless Mulitcloud SDK.

- LoggingServiceMiddleware - Configures the default logger implementation for `context.logger.log(...)`, `context.logger.error(...)`, etc
- PerformanceMiddleware - Tracks executing time of your pipeline utilizing Node JS perf hooks
- ExceptionMiddleware - Sets a default strategy for handling  uncaught exceptions are handled within your application
- HTTPBindingMiddleware - Configures common properties including `req` and `res` required for HTTP scenarios

Additional custom middleware components can be injected into this pipeline as needed.

#### Migrating your handlers
In this next section we will migrate a handler from Microsoft Azure Functions syntax to Serverless Multicloud syntax

##### Original Azure Functions code
The following code for an Azure Function `getProductList` that retrieves a list of products from a datasource and returns those products in a JSON response
```javascript
const productService = require("../services/productService");

module.exports = {
  /**
   * Gets a list of products
   */
  getProductList: async (context) => {
    const products = productService.getList();

    context.res = {
      body: { values: products },
      statusCode: 200
    };
  }
};
```

##### New Serverless Multicloud Syntax
The following is the updated `getProductList` handler that utilizes the Serverless Multicloud SDK.
```javascript
const app = require("../app");
const middlewares = require("../config")();
const productService = require("../services/productService");

module.exports = {
  /**
   * Gets a list of products
   */
  getProductList: app.use(middlewares, (context) => {
    const products = productService.getList();
    context.send({ values: products }, 200);
  })
};
```

Notice how we are importing both our `app` and `middlewares` from the configuration we did in the previous steps.  The primary difference is that your handler function has now been replaced with a call to `app.use(middlewares, handler)`.  The result of this call returns a new function that the native Azure Functions runtime expects.

Sending a response back is now a simple call to `context.send(body, statusCode, [contentType])`.  You have full control over the response body, HTTP status code and optionally the content type of the response.  The content type will be inferred automatically based upon the type of the `body` parameter.

The Serverless Mulitcloud `App` instance handles the full pipeline, executing your middleware chain, followed by your handler dealing with all of the required translation and mapping required by the cloud provider that is servicing the request.

