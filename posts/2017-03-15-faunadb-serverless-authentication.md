---
title: Using Serverless Authentication Boilerplate with FaunaDB
description: FaunaDB is a security aware database, so we pass user-specific access tokens to it via a custom authorizer.
date: 2017-03-07
thumbnail: 
layout: Post
authors:
 - jchris
---

We are proud to support our friends at Fauna as they announce [FaunaDB Serverless Cloud](https://fauna.com/product), a globally consistent distributed database. This is a guest post from Chris Anderson, Director of Developer Experience, showing how to connect FaunaDB's access control model with Serverless platform best practices.

> Forget the cloud — go Serverless with FaunaDB and let your pre-provisioned capacity woes become a thing of the past.
> - **Chris Anderson, Fauna**

A common serverless application architecture is to run an authentication service, which knows how to connect with OAuth identity providers like Facebook and Github, and exposes an authorizer lambda which can control access to your content functions. This makes authentication code reusable and cleanly separates it from your other functions.

FaunaDB offers instance level security, so you can model your application’s data sharing patterns in the database. In this example we use the popular [`serverless-authentication-boilerplate`](https://github.com/laardee/serverless-authentication-boilerplate) to connect a FaunaDB app to Facebook login. Thanks to [Eetu Tuomala](https://www.linkedin.com/in/eetutuomala/) for the help with API Gateway details.

In the spirit of the Serverless model, the authorizer supplies application content functions with a FaunaDB connection secret that corresponds to the currently logged-in user. This way, there is no possibility of application level bugs impacting data integrity and security.

There is no limit to the data security patterns you can model in FaunaDB. See the tutorials for social graph examples, or follow this space for a multi-user TodoMVC example. For now, the content service just looks up the current user in the database.

These instructions for launching the Serverless Authentication Boilerplate with FaunaDB are based on the `serverless-authentication-boilerplate` README.

## Installing Serverless Authentication

The boilerplate ships with code for a few different identity backends. These steps walk you through installing the service and running it with FaunaDB. The FaunaDB example also integrates with the `test-token` example content service. So once you have it running you can [look at that code](https://github.com/laardee/serverless-authentication-boilerplate/blob/37e4006870c708fa3ef8b64d451a13e2ed93e6f3/test-token/handler.js#L20) to see how your application would use the database.

0. If you haven't yet, `npm install -g serverless` and make sure the standard AWS environment variables are set.
1. Run `serverless install --url https://github.com/laardee/serverless-authentication-boilerplate`, or clone or download the repository.
2. Rename `authentication/example.env.yml` to `authentication/env.yml` and set environmental variables. Delete the `CacheTable` entry to avoid provisioning DynamoDB tables you won't be using.
3. Sign up instantly and [create a database in the FaunaDB dashboard](https://fauna.com/serverless-cloud-sign-up).
4. Configure `FAUNADB_SECRET` in `authentication/env.yml` with a [server secret](https://fauna.com/documentation#authentication) for your database.
5. Uncomment `return faunaUser.saveUser(profile);` from `authentication/lib/storage/usersStorage.js`.
6. Change the last line of `authentication/lib/storage/cacheStorage.js` to `exports = module.exports = faunaCache;`
7. Change directory to `authentication` and run `npm install`.
8. Run `serverless deploy` in the authentication folder to deploy authentication service to AWS. Notice the arn of the `authorize` function.
9. Run `serverless invoke -f schema` to create your FaunaDB schema.
10. (optional) Change directory to `test-token` and insert the arn of the authorize function to `authorizer/arn` in `serverless.yml`. Then run `serverless deploy` to deploy test-token service.

There is no need to configure the `test-token` service with database access, as the `authorize` function provides a database access secret which matches the current user. Each function invocation runs only with the privileges of the current user. In a future post we'll show how to model ownership of data instances, read and update control, and delegation of capabilities to other users.

When you choose FaunaDB you get multi-region cross-cloud replication of your data, with the option to run on-premise, avoiding vendor lock-in. You get a functional relational query language and the ability to define complex indexes. You get built in [temporal support for sync, audit and snapshot queries.](https://fauna.com/blog/time-traveling-databases)  And you never have to pre-provision, you only pay for the database you use. [Launch FaunaDB and you'll be storing data in moments.](https://fauna.com/serverless-cloud-sign-up)

For more basic usage of FaunaDB and Serverless, see our [blog post about the FaunaDB Serverless CRUD example.](https://fauna.com/blog/serverless-cloud-database)
