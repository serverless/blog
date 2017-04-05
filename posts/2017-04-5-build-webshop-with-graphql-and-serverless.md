---
title: Building a Web Store with GraphQL, Stripe, Mailgun and the Serverless Framework
description: Get familiar with GraphQL in this 30-minute tutorial on building an online store with Stripe, Mailgun and Serverless.
date: 2017-04-05
thumbnail: https://cloud.githubusercontent.com/assets/20538501/24682287/88250a60-195e-11e7-9c71-0b3241911641.png
layout: Post
authors:
  - SorenBramer
---

The Serverless Framework has made it extremely easy to deploy business logic to scalable cloud infrastructure. The recent post [Building a REST API](https://serverless.com/blog/node-rest-api-with-serverless-lambda-and-dynamodb/) by Shekhar Gulati goes into detail on how to expose business logic through a REST API. In this post we'll explore the benefits of GraphQL over REST, and build a feature rich webshop using [Graphcool](https://www.graph.cool/) and the Serverless Framework.

## So, Why GraphQL?

If you're already sold on GraphQL, you can skip this section. ⤵️

RESTful APIs is a well-understood architecture for web and app backends. In a RESTful API, you expose domain models at individual URLs and enable the client to traverse the data model either by following links in the response, or by adhering to a pre-defined URL structure. The benefits of this approach are:

 - Separation of concerns
 - Browser + network caching
 - Mature tooling

Because `Users` and `Posts` are separate entities, they're availabe under different URLs. The code responsible for returning users doesn't have to know anything about posts and vice versa. In fact, as the application grows it's common to move the code to separate microservices, and even separate development teams. The fact that resources are exposed on a canonical URL makes it really easy to use standard HTTP headers to enable caching in the browser and network layer.

This is great in theory, but unfortunately this model is no longer a great fit for the rich web and mobile apps we are building today. Consider the canonical Facebook Feed. In a RESTful paradigm we would have at least 4 endpoints: `/users`, `/feed`, `/posts`, and `/comments`. To fully render the first screen the app would have to: 

1. Query the `/feed` endpoint to retrieve the top 5 items for the current user
2. For each item, query `/posts` to retrieve the actual post
3. For each post, query `/users` and `/comments` to retrieve more data required for the UI

This pattern results in a waterfall of network requests where the response from one request leads to additional requests. Because of network latency - which is especially bad on mobile networks - the fully RESTful approach leads to poor user experience.

To work around this, developers have had to break away from the clean RESTful architecture and allow multiple resource types to be returned in a single request. Many patterns have emerged for how to implement this, but they all sacrifice one or more of the original benefits of RESTful APIs. 

The innovation of GraphQL is to embrace the fact that a RESTful architecture no longer works while acknowledging that the three benefits listed below are worth striving for:

 - GraphQL enables strong separation of concerns in the backend by introducing the concept of independent resolvers and a batching DataLoader
 - Clients such as Relay and Apollo enable flexible and super fine grained client side caching
 - GraphQL is an open standard, allowing the community to build advanced tooling such as clients, editor plugins, code generators as well as the awesome in-browser [GraphiQL query editor](https://github.com/graphql/graphiql)  

Nik Graf went into more detail in his recent webinar [Serverless & GraphQL: A Love Story](https://cloudacademy.com/webinars/serverless-graphql-love-story-46/)

## Anatomy of a Serverless Webshop

Let's get to it!

 > If you want to follow along, now is the time to head over to [Graphcool](https://www.graph.cool/) and create a free account.

Our webshop example will have three types of data:

<img src="https://s3-eu-west-1.amazonaws.com/serverless-blogpost/webshop-datamodel.png">

A `Customer` can have many `Baskets` and a `Basket` can have many `Items`.

In GraphQL a data model is described using IDL ([Interface Definition Language](https://www.graph.cool/docs/faq/graphql-idl-schema-definition-language-kr84dktnp0/)):

```graphql
type Basket {
  id: ID!
  isDelivered: Boolean!
  isPaid: Boolean!
  items: [Item!]! @relation(name: "BasketOnItem")
  stripeToken: String
  user: User @relation(name: "BasketOnUser")
}

type Item {
  baskets: [Basket!]! @relation(name: "BasketOnItem")
  id: ID!
  name: String!
  price: Int!
}

type User {
  baskets: [Basket!]! @relation(name: "BasketOnUser")
  email: String
  id: ID!
  name: String!
}
```

Setting this up in the Graphcool schema editor will take less than 5 minutes.

Now that we have the data model nailed down, let's start implementing the core functionality of a webshop.

## Adding Items to Basket

The first feature we want to implement is adding items to the basket. To write your first mutation, go to the Playground in the Graphcool Console. If you have not yet created an account you can perform the queries directly [in this in-browser IDE](https://api.graph.cool/simple/v1/serverless-webshop?query=%7B%0A%20%20allItems%7B%0A%20%20%20%20name%0A%20%20%7D%0A%7D).

First, list all existing items:

```graphql
query {
  allItems {
    name
  }
}
```

This should return an empty list, so let's go ahead and add some items:

```graphql
mutation {
  createItem(
    name: "Mackbook Pro 2016"
    price: 250000
  ) {
    id
  }
}
```

When you run the query again, you should get a response like this:

<img src="https://s3-eu-west-1.amazonaws.com/serverless-blogpost/add-item-playground.png">

To create a user with a basket containing the Mackbook Pro, you can write a [nested mutation](https://www.graph.cool/docs/reference/simple-api/nested-mutations-ubohch8quo/):

```graphql
mutation {
  createUser(
    email: "user@gmail.com"
    name: "Carl Johan"
    baskets: [{ itemsIds: ["cj11yp6q0fb5c0145fnviqho3"] }]
  ) {
    id
  }
}
```

By now you should have a solid understanding of GraphQL queries and mutations. If this still feels a little foreign to you, I would recommend you spend some time trying out different queries in the playground before continuing. You can find more examples in [the reference docs](https://www.graph.cool/docs/reference/simple-api/queries-nia9nushae/).

## Pay for Items in Basket

So far we have only implemented pure data manipulation. Now it's time to add a serverless function to integrate with Stripe. Head over to [stripe.com](https://stripe.com/) and create a free account. Make sure the account is in test mode, then go to the API menu and locate your `Test Secret Key`. You will need this when calling the Stripe API from your serverless function.

In a real application you will use one of the Stripe native SDKs or checkout.js for websites to collect a customers credit card information and securely exchange it for a one-time token. During development you can use the test card number `4242 4242 4242 4242` to generate a one-time token directly on the [Stripe documentation page](https://stripe.com/docs/checkout). Click Pay with Card to generate a token like this: `tok_1A4WB5AM0MAtIPOjm2b1uhze`

<img src="https://s3-eu-west-1.amazonaws.com/serverless-blogpost/stripe-documentation.png">

When the front-end app has retrieved a one-time token from Stripe it can be associated to the basket using a GraphQL mutation:

```graphql
mutation {
  updateBasket(
    id: "cj11ytlwgje2u0112jfl30zoe"
    stripeToken: "tok_1A4WB5AM0MAtIPOjm2b1uhze"
  ) {
    id
  }
}
```

Graphcool is an event-based platform that allows you to attach custom serverless functions at different stages of the request processing. To charge the customers credit card we will add a mutation callback for updates to the `Basket` type. In the UI it looks like this:

<img src="https://s3-eu-west-1.amazonaws.com/serverless-blogpost/webhook-stripe.png">

When setting up the webhook we use a GraphQL query to specify the data requirements for our function. We retrieve information about the `Basket`, but also name and price of all `Items` as well as information about the `Customer`.

When we've deployed our AWS Lambda function, we can return and enter the webhook URL.

> Error handling is omitted below. Full source code is available in the [Graphcool Examples](https://github.com/graphcool-examples/serverless-webshop) GitHub repository.

```javascript
const stripe = require('stripe')('STRIPE_SECRET_KEY')
const Lokka = require('lokka').Lokka
const Transport = require('lokka-transport-http').Transport

const client = new Lokka({
  transport: new Transport('https://api.graph.cool/simple/v1/PROJECT_ID'),
})

module.exports.handler = function(event, lambdaContext, callback) {

  const basket = JSON.parse(event.body).updatedNode

  stripe.charges.create({
    amount: basket.items.reduce((a, b) => a.price + b.price),
    currency: 'eur',
    description: 'Purchased: ' + basket.items.reduce((a,b) => `${a.name}, ${b.name}`),
    source: basket.stripeToken,
  }, (err, charge) => {

      console.log('Charge went through!')

      client.mutate(`{
        updateBasket(id: "${basket.id}" isPaid: true) {
          id
        }
      }`).then(() => callback(null, {
        statusCode: 200,
        body: 'success'
      }))
    }
  })
}
```

Managing secure payments with Stripe is quite simple. Stripe has a rich set of features to deal with everything from international transactions to recurrent payments and more.

We can now use Serverless to deploy a lambda function and expose an HTTP endpoint with API Gateway:

```yml
service: serverless-webshop
provider:
  name: aws
  runtime: nodejs6.10
  stage: dev
  region: eu-west-1
functions:
  stripeTokenAddedToBasketCallback:
    handler: functions/stripeTokenAddedToBasketCallback.handler
    events:
      - http:
          path: serverless-webshop/stripeTokenAddedToBasketCallback
          method: post
```

Running `serverless deploy` will start the deployment process and eventually return the URL where your function can be accessed:

```bash
❯ serverless deploy

Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading service .zip file to S3 (4.53 MB)...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...........................
Serverless: Stack update finished...
Serverless: Removing old service versions...
Service Information
service: serverless-webshop
stage: dev
region: eu-west-1
api keys:
  None
endpoints:
  POST - https://4gix95vh56.execute-api.eu-west-1.amazonaws.com/dev/serverless-webshop/stripeTokenAddedToBasketCallback
functions:
  stripeTokenAddedToBasketCallback: serverless-webshop-dev-stripeTokenAddedToBasketCallback
```

> Before implementing payment in a production app you have to consider how you set up the proper permission rules. This  [webinar](https://youtu.be/wu253F_WEso) goes into more detail about this.


## Subscribe to Payments

The next part of the webshop is a bit contrived, but it's a nice demonstration of how GraphQL subscriptions work. ✌️

Subscriptions are currently in the process of being incorporated into the official GraphQL spec, so this is all quite new. You can think of subscriptions as being notified of somebody else's mutation. For example you can subscribe to all changes to `Items` like this:

```graphql
subscription {
  Item {
    node {
      name
    }
  }
}
```

Go ahead and run this in the Playground. Then run a mutation in a different tab to create a few `Items`.

If you only care about a subset of events, you can use the sophisticated [filter API](https://www.graph.cool/docs/reference/simple-api/filtering-by-field-xookaexai0/) to narrow down the events that result in subscription triggers. For the Serverless Webshop we want to be notified only when a `Customer`'s credit card has been successfully charged:

```graphql
subscription {
  Basket(filter:{
    mutation_in: UPDATED
    updatedFields_contains: "isPaid"
  }) {
    node {
      items {
        id
        name
        price
      }
      user {
        name
        email
      }
    }
  }
}
```

## Send Shipping Email to Customer

The last feature is to send an email to the customer when her order has been shipped. Again we set up a mutation callback with the following payload:

```graphql
{
  updatedNode {
    id
    isDelivered
    user {
      email
    }
    items {
      name
    }
  }
}
```

[Mailgun](https://www.mailgun.com/) is a developer friendly mail provider that allows you to send 10.000 mails a month for free. Setting up an account takes just a few minutes, but be aware that you have to validate a credit card before you can start sending emails.

The function for this integrations is simple as well:

```javascript
const mailgun = require('mailgun-js')({
  apiKey: 'MAILGIN_API_KEY',
  domain: 'MAILGUN_DOMAIN',
})

module.exports.handler = function(event, lambdaContext, callback) {

  const basket = JSON.parse(event.body).updatedNode

  const mailData = {
    from: 'Serverless Webshop <FROM_EMAIL>',
    to: basket.user.email,
    subject: 'Your order is being delivered',
    text: 'Purchased: ' + basket.items.reduce((a,b) => `${a.name}, ${b.name}`),
  }

  mailgun.messages().send(mailData, (error, body) => {
    callback(null, {
      statusCode: 200,
      body: 'Mail sent to customer',
    })
  })
}
```

## Wrapping Up

As we've seen, GraphQL provides a compelling solution to the challenges faced when developing a RESTful API. By letting the application developer specify the exact data requirements for a front-end component you can avoid the two most frequent offenders when it comes to app performance - overfetching and multiple roundtrips. In combination with AWS Lambda and the Serverless Framework, GraphQL is a great way to deploy scalable backends. [Graphcool](https://www.graph.cool) is the fastest way to get started and makes it really easy to integrate external services into your API.
