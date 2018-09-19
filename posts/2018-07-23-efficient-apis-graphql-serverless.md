---
title: Efficient APIs with GraphQL and Serverless
description: 'When to use GraphQL, why it simplifies APIs, and how to do it Serverless-ly.'
date: 2018-07-23
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/graphql.jpeg
category:
  - guides-and-tutorials
heroImage: ''
authors:
  - JeremyCoffield
---

GraphQL can be a tool for building enlightened APIs, but it can also be a source of mystery for developers accustomed to REST.

In this post, I'll talk about the motivations that might lead you to choose GraphQL, and how to serve a GraphQL API that will let you really take advantage of its benefits.

Here's what we'll be covering:
- [REST API design](#rest-api-design)
- [A GraphQL approach](#enter-graphql)
- [Making your GraphQL endpoint serverless](#making-your-graphql-endpoint-serverless)

## REST API design
First, let’s talk about some situations that arise in REST APIs; this directly segues into when and why you would want to use GraphQL.

Let's say you have a REST resource to represent the products that your business offers:

```
GET /products/123
{
  "id": "123",
  "name": "Widget",
  "price": "$10.00"
}
```

And also a resource for orders by customers:

```
GET /orders/445566
{
  "id": "445566",
  "customerName": "John Q. Public"
  "deliveryAddress": "1234 Elm St.",
  "productId": "123",
  "quantity": 5
}
```

The order refers to the product by its ID. If the client needs to display the product information in the context of the order, it makes two requests: one to get the order record, and one to get the details for the product specified on the order.

You might try to improve this API in a couple ways. One would be to offer a way to retrieve the product details directly from the order number, so that you can make the two requests in parallel.

```
GET /orders/445566/product
{
  "id": "123",
  "name": "Widget",
  "price": "$10.00"
}
```

If you consistently need all the product information with the order, you might just decide to include the product information in the order resource:
```
GET /orders/445566
{
  "id": "445566",
  "customerName": "John Q. Public"
  "deliveryAddress": "1234 Elm St.",
  "productId": "123",
  "productName": "Widget",
  "productPrice": "$10.00"
  "quantity": 5
}
```

Now you’ve solved the issue of having to make multiple requests, but you’ve polluted the order object with properties from another resource, which makes it harder to use and evolve. You can fix this by keeping all product information under a single property:

```
GET /orders/445566
{
  "id": "445566",
  "customerName": "John Q. Public"
  "deliveryAddress": "1234 Elm St.",
  "product": {
    "id": "123",
    "name": "Widget",
    "price": "$10.00"
  }
  "quantity": 5
}
```

That looks pretty good! It has the benefit that any code that was written to work with the `/products` response will also work with "product" property from `/orders`.


The drawback of including the product information on the order is how it affects the backend. This may require a more expensive multi-table query with SQL, or a second query under NoSQL, or else a denormalized table that records product information with the order. It also increases the size of the response body, which can become a real problem as the REST API gets more mature and the response includes more information for different purposes.

A slightly inelegant solution is to allow the request to flag whether it wants the product information:

```
GET /orders/445566?omitProduct=true
{
  "id": "445566",
  "customerName": "John Q. Public"
  "deliveryAddress": "1234 Elm St.",
  "quantity": 5
}
```

This is not very clean, but it does allow the backend to avoid doing the extra work when product information isn’t necessary, at the cost of increased code complexity. If you repeat this design struggle many times over the lifetime of your API, you may end up with a lot of flags for different properties.

If you reach this point in your API design, then congratulations! You have partially re-invented GraphQL.

## Enter GraphQL

Let’s see how a GraphQL API answers the same questions.

You’d begin by creating types for products and orders. You don’t start the API by tying things together with foreign keys, as you did with REST. Instead, the order type contains a product field as we eventually decided on in the above example:

```gql
type Product {
  id: String!
  name: String!
  price: String!
}

type Order {
  id: String!
  customerName: String!
  deliveryAddress: String!
  product: Product!
  quantity: Int!
}
```

You create query fields to get orders and products:

```gql
type Query {
  product(id: String!): Product
  order(id: String!): Order
}
```

If the client needs to get an order and the relevant product details, you only need a single query.

Since the query contains an exact statement of all the properties that it expects, the service knows by design whether it needs to fetch product information. This allows you to write a backend that minimizes database and compute time.

For example, suppose you want to know the customer name, delivery address, order quantity, product name, and product price:

```gql
{
  order(id: "445566") {
    customerName
    deliveryAddress
    quantity
    product {
      name
      price
    }
  }
}
```

This query would return only the requested properties:

```js
{
  "customerName": "John Q. Public",
  "deliveryAddress": "1234 Elm St.",
  "quantity": 5,
  "product": {
    "name": "Widget",
    "price": "$10.00"
  }
}
```

## Making your GraphQL endpoint serverless

There are even deeper advantages to having a serverless GraphQL endpoint, which you can [read more about here](https://serverless.com/blog/running-scalable-reliable-graphql-endpoint-with-serverless/).

The tl;dr is that when you use GraphQL, you are relying on only one HTTP endpoint; and when you have one HTTP endpoint to connect all your clients to your backend services, you want that endpoint to be performant, reliable, and auto-scaling.

### Building a GraphQL endpoint with the Serverless Framework

So, how do we build this with the [Serverless Framework](https://serverless.com/framework/)?

We’re going to target AWS Lambda with Node 8 in this example, and the code should be easily adaptable to other FaaS providers. You can download the code for this example [here](https://s3.amazonaws.com/blog.serverless.com/graphql-blog.zip).

Using the GraphQL reference implementation in JS, we can easily create our GraphQL schema from the type declarations.

First import the utilities we need from the `graphql` library:

```js
const {
  graphql,
  buildSchema
} = require('graphql')
```

Now you can use GraphQL schema language to specify the schema:

```js
const schema = buildSchema(`
  type Product {
    id: String!
    name: String!
    price: String!
  }

  type Order {
    id: String!
    customerName: String!
    deliveryAddress: String!
    product: Product!
    quantity: Int!
  }

  type Query {
    product(id: String!): Product
    order(id: String!): Order
  }
`)
```

Next, we create resolvers so that queries can access our data. This is also where we make sure the resolver isn’t doing any more work than necessary. The `graphql` library is very flexible. Resolvers can exist for individual fields, and a resolver can either be a constant value, a function, a promise, or an asynchronous function. Functions have access to any arguments for the field via a single object parameter.

We want the database record for the product information to be retrieved only when requested, so we make the resolver for that field a function:

```js
const database = require('./database')
const resolvers = {
  product: ({ id }) => database.products.get(id),
  order: async ({ id }) => {
    const order = await database.orders.get(id)
    if(!order) return null

    return {
      ...order,
      product: () => database.products.get(order.productId)
    }
  }
}
```

The methods `database.products.get()` and `database.orders.get()` are both asynchronous functions, returning promises. The resolver for product simply calls through to the database. You do not need to worry about manually removing extraneous fields, since graphql-js does that for you.

The resolver for order is more complex. It uses async/await syntax to fetch the order record before returning. This allows us to get the productId for use in the resolver for the product field. Since the resolver for the product field is a function, it won’t be invoked unless the product field is actually included in the query.

All that remains is to create a handler for Lambda. Using the newer asynchronous syntax introduced by Node 8 for Lambda, this is very simple.

```js
module.exports.query = async (event) => {
  const result = await graphql(schema, event.body, resolvers)
  return { statusCode: 200, body: JSON.stringify(result.data, null, 2) }
}
```

Since all of the set-up logic for the GraphQL schema is outside of the handler, this will only be executed when Lambda needs to spin up a new instance to serve requests. To enable us to query by POST request, we have to include the following in `serverless.yml`:

```yml
service: my-api

provider:
  name: aws
  runtime: nodejs8.10

functions:
  hello:
    handler: handler.query
    events:
      - http:
          path: /
          method: POST
```

That’s it. After a quick `sls deploy`, we can curl our new GraphQL endpoint to test the query:

```sh
curl https://lsqgfkvs2i.execute-api.us-east-1.amazonaws.com/dev/ -d '{
  order(id: "778899") {
    customerName
    deliveryAddress
    quantity
    product {
      name
      price
    }
  }
}
'
```
```js
{
  "order": {
    "customerName": "Stacey L. Civic",
    "deliveryAddress": "4321 Oak St.",
    "quantity": 32,
    "product": {
      "name": "Gadget",
      "price": "$8.50"
    }
  }
}
```

## Conclusion

You’ve now got a working GraphQL endpoint built with Serverless that scales automatically with increased traffic!

In this example, we went with a single-Lambda approach. If you want infrastructural microservices, you can also use the flexibility of resolvers to have a primary Lambda that invokes other lambdas to resolve different query fields. If you want a more in-depth solution that uses GraphQL from top to bottom, you can use [schema stitching](https://www.apollographql.com/docs/graphql-tools/schema-stitching.html) to combine multiple GraphQL APIs into one.

### Other Serverless + GraphQL resources
- [How to make a Serverless GraphQL API using Lambda and DynamoDB](https://serverless.com/blog/make-serverless-graphql-api-using-lambda-dynamodb/)
- [Running a scalable & reliable GraphQL endpoint with Serverless](https://serverless.com/blog/running-scalable-reliable-graphql-endpoint-with-serverless/)
