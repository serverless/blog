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

Today - it is incredibly easy to deploy Serverless applications using the Serverless Framework.  But, what happens when your business is adopting a multi-cloud strategy? Or you want to limit vendor lock-in so you can easily switch cloud providers.  There is no easy way to write a single Serverless app that can be deployed across multiple cloud providers without using containers... until now.

Introducing the Serverless Multicloud SDK.  With the Serverless Multicloud SDK you can write your Serverless handlers once in a cloud agnostic format and continue to use the Serverless CLI to deploy your service to each of your targeted cloud providers.

The initial creation of the Serverless Multicloud SDK is a joint venture between Microsoft, 7-Eleven & Serverless, Inc.

In the initial release the Serverless Multicloud SDK supports NodeJS with both Microsoft Azure and Amazon Web Services.  The SDK has an Express-like feel.  It supports familiar concepts like `Middleware` to abstract away your service's cross-cutting concerns like logging, exception handling, validation and authorization.  The framework supports creating your own middleware components that can be reused and plug seamlessly into your applications pipeline.

This guide assumes you have some working knowledge of NodeJS and how to build services with the Serverless Framework.  We will walk through the process of migrating a REST API to use the new Serverless Multicloud SDK.

#### Prerequisites
Ensure you already have the Serverless CLI installed on your machine.  If needed install the Serverless CLI globally using the following:
```bash
npm install -g serverless
```

#### Reference Serverless Multicloud SDK
Witin your existing Serverless application install the Serverless Multicloud core package in additional to the packages for your targeted cloud providers.
```bash
npm install @multicloud/sls-core @multicloud/sls-azure @multicloud/sls-aws --save
```

#### Setup & Configuration
Next step is to configure the multicloud application utilizing the Serverless Multicloud SDK.  Create a new file `app.js` in the root of your application.

##### Application Instance
Start by importing the `App` from `@multicloud/sls-core` as well as the cloud provider specific modules that your application is targeting.
```javascript
// src/app.js

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
// src/config.js

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
// src/handlers/products.js

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
// src/handlers/products.js

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

#### Creating a custom middleware
A middleware component is a JavaScript function that accepts 2 arguments:
- context - The `CloudContext` instance of the request (This is the same context available in the handler)
- next - A JavaScript `function` that signals the application pipeline to continue to the next step

A middleware component can execute business logic before and after a handler is called.

```javascript
const customMiddleware = async (context, next) => {
  // Execute any logic before the handler

  await next(); // Continue processing of the pipeline

  // Execute any logic after handler
};
```

A middleware component can also choose to short-circuit a request.  For example - if you are developing a custom authorization middleware and the middleware finds that the incoming request is from an unauthorized user the middleware can return without calling `next()` which will short-circuit the application pipeline and not execute the handler or any other middlewares referenced later in the pipline.  In this use case the middleware would be responsible for setting a response for the reqeust (ex. 401 unauthorized request)

To build upon our REST API, let's create a custom middleware that will validate a given product ID and confirm that product exists within our datastore.

```javascript
// src/middleware/productValidationMiddleware.js

const productService = require("../services/productService");

module.exports = () => async (context, next) => {
  // Execute any logic before the handler
  if (!context.req.pathParams.has("productId")) {
    return context.send({ message: "Product ID is required" }, 400);
  }

  const product = productService.get(context.req.pathParams.get("productId"));
  if (!product) {
    return context.send({ message: "Product not found" }, 404);
  }

  context.product = product;

  // Continue processing the pipeline
  await next();
}
```

In the above example we are validating the following:
- That the `productId` path parameter has been set
- That the `productId` parameter matches a known product in the datasource

If either of these validations fail we are short circuiting the pipeline and returning a `4xx` HTTP status code.

If the product does exist - then we are assigning a new property `product` onto the context object that can then be used directly by the handler code.

#### Using new custom middleware in request pipeline
Let's take the custom product validation middleware that we created previously and use it within our new Serverless Multicloud handler.

```javascript
// src/handlers/products.js

const app = require("../app");
const middlewares = require("../config")();
const productValidation = require("../middleware/productValidationMiddleware");
const productMiddlewares = middlewares.concat(productValidation());
const productService = require("../services/productService");

module.exports = {
  /**
   * Gets the metadata for the specified product id
   */
  getProduct: app.use(productMiddlewares, (context) => {
    context.send({ value: context.product }, 200);
  }),
};
```

Each Multicloud handler can specify the list of middleware that are invoked as part of the full request pipeline.  In the above use case we are taking the default middleware list defined within our `config.js` and appending our new `productValidationMiddleware`.  Finally, we are invoking `app.use(...)` referencing our new full list of middleware components.

Notice the direct usage of `context.product` within the handler.  Since our `productValidationMiddleware` handles the validation concerns we can ensure that at the point where our handler is executed `context.product` has already been defined and ensured to be a valid product.

#### Deploying a Serverless Multicloud application
Deploying a Multicloud application is as easy as deploying any application written for the Serverless Framework.  If you are only deploying to a single cloud provider you can continue to do exactly what you are doing today.

When developing a Serverless Multicloud application targeting multiple cloud providers it is requried to author a seperate `serverless.yml` file for each cloud provider.  A common convention would be to name your serverless config files with a cloud provider suffix.  For more information regarding the configuration elements of each cloud provider see the Azure & AWS quick start guides.

When deploying a Serverless Multicloud application to multiple providers you can take advantage of the new Serverless CLI `--config` argument.  This argument has been recenlty introduced which allows you to override the config file to use while using the CLI.  This allows you deployments to be accomplished using the command below.

##### Deploy to Microsoft Azure
```bash
sls deploy --config serverless-azure.yml
```

##### Deploy to AWS
```bash
sls deploy --config serverless-aws.yml
```

### Wrap up
We are super excited to offer this new Multicloud SDK in the hopes of offering the first step in adopting a truly serverless experience without worrying about vendor lock-in or dealing with the complexities and differences of each cloud provider.

#### What's next?
Check back soon for more updates on using the new Serverless Multicloud SDK including usage of non-http events, calling out into cloud agnostic SDK's and more.

#### Samples
##### [Serverless MultiCloud Demo](https://github.com/wbreza/multicloud-demo)
A sample that utilizes the Serverless Multicloud SDK to deploy a REST API across Microsoft Azure and AWS.  The full example of the **finished** code used in this guide exists within this repo.

##### [Serverless Azure Demo](https://github.com/wbreza/serverless-azure-demo)
A Serverless Framework Azure REST API sample.  The full example of the **original** code used in this guide exists in this repo.