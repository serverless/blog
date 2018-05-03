---
title: "Serverless Components - REST API tutorial"
description: "How to create a fully-fledged REST API application using the Serverless Components project and its pre-written components."
date: 2017-xx-xx
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/to-be-defined.jpg
authors:
  - PhilippMuns
---

## Introduction

You might have already heard about our new ["Serverless Components"](https://github.com/serverless/components) concept which is our latest project to make it easier to encapsulate common functionality in so-called "components" which can then be easily re-used, extended and shared with other developers and other serverless applications.

For a more general introduction to the "Serverless Components" project check out [this blog post](https://serverless.com/blog/what-are-serverless-components-how-use/) by Brian Neisler.

In todays blog post we'll take a deeper dive into Serverless Components and re-use several components from the [component registry](https://github.com/serverless/components/tree/master/registry) to build a fully-fledged REST API powered application.

At first we'll give a quick refresher on the components concept and the Serverless Components project. After that we'll take a closer look at all the different components and their functionalities we'll use today before we jump straight into the code to use those components to build our REST API powered example application.

Excited? Let's go!

## Refresher: "What are components?"

Let's refresh our knowledge about components real quick. In essence components are logical units which encapsulate code to perform certain actions. Components expose an interface so that they can be re-used easily by others without them having to know the inner-workings. Components can be orchestrated and nested in order to build higher-order functionalities.

Let's take a look at a simple example to get a better understanding what the component concept is all about.

Let's imagine that we want to deploy multiple AWS Lambda functions to AWS. Taking a deeper look into AWS Lambdas internals we see that every Lambda function needs an IAM role. Furthermore we need to configure parameters such as "Memory size" or "Timeout". In addition to that we need to provide the zipped source code and ship it alongside our AWS Lambda function.

We could accomplish the task of deploying multiple AWS Lambda functions to AWS by manually creating an IAM role, configuring the parameters such as "Memory size" and "Timeout" and zipping and uploading the code. However doing this manually is cumbersome and error-prone. Furthermore there's no way to re-use a common logic to create other AWS Lambda functions in the future.

Enter components! The components concept provides an easy way to abstract common functionality away making it easier to re-use functionalities in multiple places.

In our case we would componetize the AWS IAM role into a separate component, which takes a `name` and the `service` as inputs, creates an IAM Role and returns the `arn` as an output. Similarily we could componetize the AWS Lambda function into an own component, which takes the `name`, `memorySize`, `timeout`, `code` and `iamRole` as inputs, creates the AWS Lambda function and returns the `arn` as an output.

Now we could simple re-use our two components to create dozens of AWS Lambda functions and their corresponding roles, without the need to manually create Lambda functions or IAM roles ever again.

Write once, use everywhere.

## Installing Serverless Components

In order to use components we need to have ["Serverless Components"](https://github.com/serverless/components) installed on our machine.

"Serverless Components" is a CLI tool written in JavaScript which can be installed via `npm`. It helps use deploying, testing and removing our component-based applications.

Installing it is as easy as running `npm install --global serverless-components`.

**Note:** Right now "Serverless Componets" needs Node.js 8 or greater. Compatibility with older Node.js versions is [already in the making](https://github.com/serverless/components/pull/188).

## Components we'll use

Before we jump straight into code let's take a quick look at the different components we'll use throughout this tutorial to build our REST API powered application.

### `aws-lambda`

The [`aws-lambda`](https://github.com/serverless/components/tree/master/registry/aws-lambda) component gives us a convenient way to deploy Lambda functions to AWS.

When using we need to supply a `memory`, `timeout` and `handler` property. All other configurations (such as the functions `name`) are optional.

The Lambda component will even auto-generate and automatically manage an IAM role for us if we don't specify one.

You can find the documentation and some examples in the components [registry entry](https://github.com/serverless/components/tree/master/registry/aws-lambda).

### `aws-dynamodb`

The [`aws-dynamodb`](https://github.com/serverless/components/tree/master/registry/aws-dynamodb) component makes it possible to create and manage DynamoDB tables.

The only configurations necessary for this component are the `region` in which the table should be created and an array called `tables` which includes the different DynamoDB specific table definitions.

The [components documentation](https://github.com/serverless/components/tree/master/registry/aws-dynamodb) shows some example usages.

### `rest-api`

The [`rest-api`](https://github.com/serverless/components/tree/master/registry/rest-api) component creates a REST API according to a config consisting of a `gateway` and `routes` property.

#### `gateway` config

The `gateway` config property determines where the REST API should be created. The component currently supports `aws-apigateway` to setup a REST API on AWS using the API Gateway and `eventgateway` to setup a REST API using the hosted version of the [Event Gateway](https://serverless.com/event-gateway/).

In this blog post we'll be using the `aws-apigateway` configuration to tell the Framework that we want to setup our REST API on AWS using the API Gateway service.

#### `routes` config

The `routes` config property is used to specify the routes with its paths and methods and maps them to the Lambda functions which should be invoked when accessing those routes.

If for example, you want to implement a "Products" API you'd create routes like this:

| Method   | Path             | Description                                |
| -------- | ---------------- | ------------------------------------------ |
| `GET`    | `/products`      | List all products                          |
| `GET`    | `/products/{id}` | Get the product with id `{id}`             |
| `POST`   | `/products`      | Take product data and create a new product |
| `DELETE` | `/products/{id}` | Delete the product with the id `{id}`      |

That's it. When deploying the component to AWS the Framework will automatically create a REST API using the API Gateway service and returns the URLs we can use to perform the above operations.

You can find the documentation and some examples in the components [registry entry](https://github.com/serverless/components/tree/master/registry/rest-api).

## Building our application

Enough theory. Let's dive right into the code and build an application which uses the `rest-api` component.

### Creating a component project

Let's start by creating a new components project. A components project is simply a directory containing a `serverless.yml` file.

Let's create a new directory called `products-rest-api` by running `mkdir products-rest-api`. After `cd`ing into it we need to create an empty `serverless.yml` file by running `touch serverless.yml`. Next up we can open this directory with our favorite code editor.

In order to tell Serverless that we have a components project we need to add the following lines of code to our `serverless.yml` file:

```yml
type: rest-api-app
```

The `type` property tells the Framework that our application is called `rest-api-app`.

If you compare this information with `serverless.yml` files from components in the [`registry`](https://github.com/serverless/components/tree/master/registry) you might see that they too have a `type` property at the root level. The reason for that is that our `rest-api-app` application itself is a component which could be re-used by other components / projects. There's no distinction between an application or a component. Both are components at the end of the day.

### Adding a `products` DB table

Since our REST API is used to store and retrieve Product data we need to have a database backend to persist such products.

We've already explored the `aws-dynamodb` component which makes it easy for us to use and manage AWS DynamoDB tables. Let's add this component to our application.

Add the following code into your projects `serverless.yml` file:

```yml
# ... snip

components:
  productsDb:
    type: aws-dynamodb
    inputs:
      region: us-east-1
      tables:
        - name: products
          hashKey: id
          indexes:
            - name: ProductIdIndex
              type: global
              hashKey: id
          schema:
            id: number
            name: string
            description: string
            price: number
          options:
            timestamps: true
```

With this code snippet we're adding our fist component to our project.

Components can be added and configured in the `components` section. In our example we've added a component we called `productsDb` with the `type` `aws-dynamodb`. We can configure components via `inputs`. In our case we're creating a new DynamoDB table called `products` in the `us-east-1` region.

Our database schema is defined with the `schema` property and defines the products properties `id`, `name`, `description` and `price`.

### Adding our Lambda functions

The next thing we need to do is adding our AWS Lambda functions which will help us creating and listing our products.

We'll store our Lambda code in a file called `products.js` which is located in a directory called `code` in the projects root directory (`code/products.js`).

Let's start with the `createProduct` function which will insert a new product into the database.

#### `createProduct`

Paste the following code into the `products.js` file:

```js
const AWS = require('aws-sdk')
const dynamo = new AWS.DynamoDB.DocumentClient({ region: 'us-east-1' })

const tableName = process.env.productTableName

function create(evt, ctx, cb) {
  const item = JSON.parse(evt.body)
  dynamo.put({
    Item: item,
    TableName: tableName
  }, (err, resp) => {
    if (err) {
      cb(err)
    } else {
      cb(null, {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(resp)
      })
    }
  })
}

module.exports = {
  create
}
```

The code should be pretty easy to understand. At first we import the AWS SDK which is required to make AWS SDK calls. Next up we create a new DynamoDB instance called `dynamo`.

After that we fetch the `table` name from the functions environment variables and define our `create` function which includes the logic to insert a new product record into the database.

Note that we're already using an event shape which corresponds to the AWS API Gateway event definitions.

Next up we need to add an AWS Lambda component to our `serverless.yml` file.

```yml
# ... snip

components:
  # ... snip
  createProduct:
    type: aws-lambda
    inputs:
      memory: 512
      timeout: 10
      handler: products.create
      root: ./code
      env:
        productTableName: products
```

Here we're adding our `createProcuct` component which is of `type` `aws-lambda`.

We define the functions configuration with the help of the components `inputs`. Note that we're e.g. specifing the path to our functions code with the help of the `root` property and the functions environment variables via `env`.

#### `getProduct` and `listProducts`

Let's add the functionality to fetch a single product (`getProduct`) as well as all products (`listProducts`) from the database.

Add the following JavaScript code to the `products.js` file.

```js
// ... snip

function get(evt, ctx, cb) {
  const vId = parseInt(evt.pathParameters.id, 10)
  dynamo.get({
    Key: {
      id: vId
    },
    TableName: tableName
  }, (err, data) => {
    if (err) {
      cb(err)
    } else {
      const product = data.Item
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(product)
      })
    }
  })
}

function list(evt, ctx, cb) {
  dynamo.scan({
    TableName: tableName
  }, (err, data) => {
    if (err) {
      cb(err)
    } else {
      const products = data.Items
      cb(null, {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify(products)
      })
    }
  })
}

module.exports = {
  // ... snip
  get,
  list
}
```

With this code we simply define and export two functions called `get` and `list` which will query our DynamoDB database and return the result formatted in a way the API Gateway (which we'll introduce in a few minutes) understands.

Next up we need to add two new AWS Lambda components to our projects `serverless.yml` file. One component for the `get` function and one for the `list` function.

```yml
# ... snip

components:
  # ... snip
  getProduct:
    type: aws-lambda
    inputs:
      memory: 512
      timeout: 10
      handler: products.get
      root: ./code
      env:
        productTableName: products
  listProducts:
    type: aws-lambda
    inputs:
      memory: 512
      timeout: 10
      handler: products.list
      root: ./code
      env:
        productTableName: products
```

Here we're declaring two function components called `getProduct` and `listProducts` which are of `type` `aws-lambda`. Both functions are configured via `inputs` and refer to the same code location as our `createProcuct` function. We're also passing in the corresponding environment variables via `env` to ensure that our Lamdba functions have access to our DynamoDB table name.

That's it from an AWS Lamdba functions perspective.

### Adding the `rest-api` components

The last missing piece is the `rest-api` component which ties everything together and makes it possible to interact with our mini Products application end-to-end.

Adding and configuring our REST API is as easy as adding the corresponding component configuration to our `serverless.yml` file.

```yml
# ... snip

components:
  # ...snip
  productsApi:
    type: rest-api
    inputs:
      gateway: aws-apigateway
      routes:
        /products:
          post:
            function: ${createProduct}
            cors: true
          get:
            function: ${listProducts}
            cors: true
          /{id}:
            get:
              function: ${getProduct}
              cors: true
```

Here we're creating our `productsApi` REST API using the component with the `type` `rest-api`. Via `inputs` we're configuring the component to use the `aws-apigateway` component under the hood as our `gateway` of choice.

Next up we define our `routes`. Generally speakig we're defining 3 routes. One route for each function. We make `/products` accessible via `GET` and `POST` (`get` / `post`). A specific product is accessible at `/products/{id}` via `GET` (`get`).

A speciality in this component definition is the use of Serverless Variables via `${}`. Serverless variables makes it easy for us to reference different values from different sources such as Environment variables, component outputs or the `serverless.yml` file itself. In our case we're referencing the AWS Lambda components by name and pass those functions into our `rest-api` component. This way the component knows how to configure the REST API so that the corresponding function is called when a request is send to the endpoint.

Enabling `cors` for our endpoints is as easy as adding the `cors: true` configuration to our route.

### Deploy and testing

That's it! We wrote all the necessary code to setup and configure our fully-fledged REST API!

We now have a REST API which is accesible via 3 different API endpoints. This REST API will trigger our AWS Lambda functions which in turn reach out to DynamoDB to query our products.

Let's Deploy and test our application!

Deploying is as easy as running `components deploy`.

We can see our API Gateway endpoints at the end of the deployment logs. It should look something like this:

```
REST API resources:
  POST - https://3412ssa.execute-api.us-east-1.amazonaws.com/dev/products
  GET - https://3412ssa.execute-api.us-east-1.amazonaws.com/dev/producst
  GET - https://3412ssa.execute-api.us-east-1.amazonaws.com/dev/products/{id}
```

Let's insert a new product.

We can `curl` our `/products` endpoint via `POST`:


```
curl --request POST \
  --url https://3412ssa.execute-api.us-east-1.amazonaws.com/dev/products \
  --header 'content-type: application/json' \
  --data '{
      "id": 1,
      "name": "Learning Serverless Components",
      "description": "A tutorial to learn the new Serverless Components concept.",
      "price": 15
    }'
```

Great! Now we should be able to get our inserted product via the following `GET` request:

```
curl https://3412ssa.execute-api.us-east-1.amazonaws.com/dev/products/1
```

A list of all products can be requested like this:

```
curl https://3412ssa.execute-api.us-east-1.amazonaws.com/dev/products
```

Nice! Feel free to continue playing around with your REST API.

Once done you can remove the application via `components remove`.

## Conclusion

That's it! We've just created our very first REST API which is capable to store and manage Products. In this process we've re-used three different components (`aws-lambda`, `aws-dynamodb` and `rest-api`).

Setting everything up was as easy as adding the function logic and the corresponding component configurations in our `serverless.yml` file.

I hope that you've enjoyed this tutorial and got a feeling of the power Serverless Components enable.

You could enhance this project futher by adding a static website interface with the help of the [`static-website` component](https://github.com/serverless/components/tree/master/registry/static-website).

The [`examples`](https://github.com/serverless/components/tree/master/examples) section in our Serverless Components repository is another great resource to get some inspiration what else you can build with the Serverless Components framework.
