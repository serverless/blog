---
title: Using Serverless Authentication Boilerplate with FaunaDB
description: Use FaunaDB's secure database features with AWS API Gateway to run Lambdas with the capabilities of the authenticated user.
date: 2017-03-15
thumbnail: https://cloud.githubusercontent.com/assets/20538501/23813615/4b53e4fc-05a5-11e7-8214-e34c2c02b949.png
layout: Post
authors:
 - ChrisAnderson
---

*Three cheers to our friends at Fauna as they announce [FaunaDB Serverless Cloud](https://fauna.com/product), a globally consistent distributed database. This is a guest post from Chris Anderson, Director of Developer Experience at Fauna.*

A common serverless application architecture is to run an authentication service, which knows how to connect with OAuth identity providers like Facebook and Github, and exposes an authorizer Lambda that can control access to your functions. This makes authentication code reusable and cleanly separates it from your other functions.

FaunaDB offers instance-level security, so you can model your application’s data sharing patterns in the database. In this example we use the popular [`serverless-authentication-boilerplate`](https://github.com/laardee/serverless-authentication-boilerplate) to connect a FaunaDB app to Facebook login. Thanks to [Eetu Tuomala](https://www.linkedin.com/in/eetutuomala/) for the help with API Gateway details!

In the Serverless model, the authorizer supplies functions contained in the application with a FaunaDB connection secret that corresponds to the currently logged-in user. This way, there's no possibility of bugs at the application level impacting data integrity and security.

There's no limit to the data security patterns you can model in FaunaDB. See our tutorials for [social graph examples](https://fauna.com/tutorials/social), or follow this space for a multi-user TodoMVC example. For now, the content service just looks up the current user in the database.

These instructions for launching the Serverless Authentication Boilerplate with FaunaDB are based on the [`serverless-authentication-boilerplate` README](https://github.com/laardee/serverless-authentication-boilerplate/blob/master/README.md).

This is not simplified example code, rather more like the first steps you'd take when creating a new real world application. The final result is not a cool demo, it's a useful auth service you can rely on. If you're looking for more basic usage of FaunaDB and Serverless, see our [blog post about the FaunaDB Serverless CRUD example.](https://fauna.com/blog/serverless-cloud-database) There is also a [Python version available](https://serverless.com/blog/serverless-fauna-python-example/).

## Installing Serverless Authentication

The boilerplate ships with code for a few different identity backends. These steps walk you through installing the service and running it with FaunaDB. The FaunaDB example also integrates with the `test-token` example content service. So once you have it running you can [look at that code](https://github.com/laardee/serverless-authentication-boilerplate/blob/37e4006870c708fa3ef8b64d451a13e2ed93e6f3/test-token/handler.js#L20) to see how your application would use the database.

0. If you haven't yet, `npm install -g serverless` and make sure your [AWS environment variables](https://serverless.com/framework/docs/providers/aws/guide/credentials/) are set.
1. Run `serverless install --url https://github.com/laardee/serverless-authentication-boilerplate`, or clone or download the repository.
2. Rename `authentication/example.env.yml` to `authentication/env.yml` and set environmental variables. Delete the `CacheTable` entry to avoid provisioning DynamoDB tables you won't be using.
3. Sign up instantly and [create a database in the FaunaDB dashboard](https://fauna.com/serverless-cloud-sign-up).
4. Configure `FAUNADB_SECRET` in `authentication/env.yml` with a [server secret](https://fauna.com/documentation#authentication) for your database.
5. Uncomment `return faunaUser.saveUser(profile);` from `authentication/lib/storage/usersStorage.js`.
6. Change the last line of `authentication/lib/storage/cacheStorage.js` to `exports = module.exports = faunaCache;`
7. Change directory to `authentication` and run `npm install`.
8. Run `STAGE=dev npm run setup:fauna` to create your FaunaDB schema.
9. (optional) Change directory to `test-token` and run `serverless deploy` to deploy test-token service.

Look here for the code to the [test-token service](https://github.com/laardee/serverless-authentication-boilerplate/blob/37e4006870c708fa3ef8b64d451a13e2ed93e6f3/test-token/handler.js#L20) and here for [the code that uses FaunaDB as an authentication cache and user store.](https://github.com/laardee/serverless-authentication-boilerplate/tree/master/authentication/lib/storage/fauna)

There's no need to configure the `test-token` service with database access, as the `authorize` function provides a database access secret that matches the current user. Each function invocation runs only with the privileges of the current user. In a future post we'll show how to model ownership of data instances, read and update control, and delegation of capabilities to other users.

With FaunaDB you get multi-region cross-cloud replication of your data, with the option to run on-premise, avoiding vendor lock-in. You also get a functional relational query language and the ability to define complex indexes. There are [temporal support for sync, audit and snapshot queries.](https://fauna.com/blog/time-traveling-databases) And you never have to pre-provision, so you only pay for the database you use. [Launch FaunaDB and you'll be storing data in moments.](https://fauna.com/serverless-cloud-sign-up)
