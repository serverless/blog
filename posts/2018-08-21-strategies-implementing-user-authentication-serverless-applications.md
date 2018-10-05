---
title: "Strategies for implementing user authentication in serverless applications"
description: "Implementing user authentication in serverless applications: storing user info with sessions & JWT, token validity with Lambda Custom Authorizers, user management & more."
date: 2018-08-21
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/authentication/auth-serverless-header.png'
category:
  - guides-and-tutorials
heroImage: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/featured-posts/04_user-authentication-.png
authors:
  - JeremyCoffield
---

Searching for a way to do user authentication in your serverless project?

Look no further. In this post I’ll be covering robust approaches to storing authentication-related data in serverless applications!

We’ll talk about storing user information with sessions and JWT, token validity with Lambda Custom Authorizers, user management from scratch vs hosted services, and so much more. (Spoiler alert: there is no one perfect solution.)

I’ll cover a few examples of implementing both authentication and user management, and give my thoughts on the future of authentication mechanisms for the Serverless architecture.

I’ll be mentioning the following examples in this post; feel free to check them out beforehand if you’d like:

* [API Gateway + Custom Authorizer + Auth0](https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api)
* [Serverless Authentication + Authorization](https://github.com/adnanrahic/a-crash-course-on-serverless-auth)

#### Where to store user information

When implementing authentication in your Serverless project, there are two steps: (1) give your users the ability to identify themselves, (2) retrieve their identity in your Serverless functions.

The most common ways to accomplish this are storing user sessions, and writing user information inside JSON Web Tokens.

##### Sessions - standard approach

Sessions are a standard for storing authentication-related information.

Upon authentication, the user gets a token. The token is then sent to the server on every request, and used to look up user information in the database—the status of the session, expiration time, and authentication scopes.

Typically, you would store session data in either Redis or Memcached. But for Serverless projects, it makes sense to use hosted datastores instead—Amazon ElastiCache or DynamoDB, Google Cloud Datastore, etc.

The down side is, hitting DynamoDB or another datastore to retrieve session information can be a challenge. With a high enough load on your application, retrieving sessions might add a significant amount to the datastore costs and increase page load times for users. Not so optimal.

##### JWT - convenient for serverless

Enter JSON Web Tokens (JWT), a growing favorite for serverless projects.

The authentication mechanism here is similar to sessions, in that the user gets a token upon logging in, and then sends that token back to the endpoint on every request. But JWT has a key advantage; it makes it easy to store additional user information directly in the token, not just the access credentials.

On every request, the user will send the whole token to the endpoint. If you store their username or access scopes in the JWT token, it will be very easy to access that information in every HTTP request you receive.

##### The good

This has a number of benefits for serverless projects compared to sessions:
- you don’t have to access the datastore for getting user information, which can decrease operational costs significantly
- changing the shape of the data stored in JWT tokens during development is faster, and that enables easier experiments
- implementing JWT can be just plain easier than reading and writing sessions

##### The bad

Unfortunately, JWT isn’t a holy grail:
- JWT tokens are larger than average session keys, so your clients may be sending more data to your endpoints overall
- All issued tokens are encrypted with a single keypair. If a leak occurs, the keypair-affected applications would need to invalidate all existing JWT tokens. Clients are allowed to choose the encryption method used on the JWT token issued to them, which could potentially expose additional attack vectors. (This [whitepaper](https://www.nds.rub.de/media/ei/veroeffentlichungen/2017/10/17/main.pdf) on the topic is quite thought-provoking.)
- Implementing authentication via JWT in a production app certainly requires spending extra time on ensuring that the tokens are used correctly, that you only store the most necessary information in the tokens, and that you are keeping your encryption keys safe.

#### Where to check session or token validity?

So when and where should you check the user’s credentials inside your app?

One solution would be to check the JWT or session content on every call to any of your functions. This gives you the most control over the authentication flow, but it is complicated to implement; you have to do everything yourself. It’s also not optimal from the database access standpoint.

Another solution that improves on some of these issues is using Custom Authorizers supported by API Gateway.

##### Lambda Custom Authorizers

AWS Lambda offers a convenient way to perform authentication outside of your core functions. With API Gateway’s Custom Authorizers, you can specify a separate Lambda function that is _only_ going to take care of authenticating your users.

In `serverless.yml`, you can specify custom authorizers as follows:

```yml
functions:
  create:
    handler: posts.create
    events:
      - http:
          path: posts/create
          method: post
          authorizer: authorizerFunc # execute this before posts.create!
  authorizerFunc:
    handler: handler.authorizerFunc
```

Custom Authorizers are currently only supported in joint use of Amazon API Gateway + Lambda. The Authorizer function has to return a policy of  a specific shape. It’s a little inconvenient at first, but gets you access to a lot of flexibility.

Amazon provides a blueprint for implementing authorizer functions, which you can find [right
here](https://github.com/awslabs/aws-apigateway-lambda-authorizer-blueprints/blob/master/blueprints/nodejs/index.js).

You can also find a working implementation of an Authorizer function [here in the Serverless Examples repo](https://github.com/serverless/examples/tree/master/aws-node-auth0-custom-authorizers-api).

The best part: API Gateway will cache the resulting policy that gets returned by the Authorizer function for up to one hour. If the Custom Authorizer gets user information from, say, DynamoDB, this caching is going to reduce DynamoDB traffic significantly and improve the load times of your Serverless app’s endpoints. Nice.

Check out our documentation on [using the Custom Authorizers with the Serverless Framework](https://serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-custom-authorizers).

#### User management from scratch vs hosted services

To manage users, you’ll need to create and delete them, as well as log them in and out. So the the big question is: should you manage users entirely yourself, or use a hosted service?

##### Implementing it yourself

This basically requires a CRUD interface for your Users database, plus a `login` method to generate a new JWT token or to create a session. Those can be implemented as separate functions.

I found [this example](https://github.com/adnanrahic/a-crash-course-on-serverless-auth/blob/master/auth/AuthHandler.js) to be very useful. The Register User function is simply:

```javascript
// https://github.com/adnanrahic/a-crash-course-on-serverless-auth/blob/master/auth/AuthHandler.js

function register(eventBody) {
  return checkIfInputIsValid(eventBody) // validate input
    .then(() =>
      User.findOne({ email: eventBody.email }) // check if user exists
    )
    .then(user =>
      user
        ? Promise.reject(new Error('User with that email exists.'))
        : bcrypt.hash(eventBody.password, 8) // hash the pass
    )
    .then(hash =>
      User.create({ name: eventBody.name, email: eventBody.email, password: hash }) // create the new user
    )
    .then(user => ({ auth: true, token: signToken(user._id) })); // sign the token and send it back
}
```

Which then gets wrapped in a handler:

```javascript
// https://github.com/adnanrahic/a-crash-course-on-serverless-auth/blob/master/auth/AuthHandler.js

module.exports.register = (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;
  return connectToDatabase()
    .then(() =>
      register(JSON.parse(event.body))
    )
    .then(session => ({
      statusCode: 200,
      body: JSON.stringify(session)
    }))
    .catch(err => ({
      statusCode: err.statusCode || 500,
      headers: { 'Content-Type': 'text/plain' },
      body: err.message
    }));
};
```

And specified in the `serverless.yml`:

```yml
# https://github.com/adnanrahic/a-crash-course-on-serverless-auth/blob/master/serverless.yml
...
  register:
    handler: auth/AuthHandler.register
    events:
      - http:
          path: register
          method: post
          cors: true
...
```

You can find the full example in [this GitHub repo](https://github.com/adnanrahic/a-crash-course-on-serverless-auth).

##### Using hosted services

Services like Auth0 and Amazon Cognito handle creating users, logging them in, and storing sessions. If your goal is to allow users to log in with their social accounts or their corporate SAML identities, this is especially useful.

With Auth0, your app's frontend gets a JS element via the Auth0 SDK that displays a nice-looking login window, as in [the example here](https://github.com/serverless/examples/blob/master/aws-node-auth0-custom-authorizers-api/frontend/app.js):

```javascript
// https://github.com/serverless/examples/blob/master/aws-node-auth0-custom-authorizers-api/frontend/app.js

const lock = new Auth0Lock(AUTH0_CLIENT_ID, AUTH0_DOMAIN, {
  auth: {
    params: {
      scope: 'openid email',
    },
    responseType: 'token id_token',
  },
});
```

And then your Authorizer function will check the user's token using the Auth0 public key:

```javascript
// https://github.com/serverless/examples/blob/master/aws-node-auth0-custom-authorizers-api/handler.js
...
  try {
    jwt.verify(tokenValue, AUTH0_CLIENT_PUBLIC_KEY, options, (verifyError, decoded) => {
      if (verifyError) {
        // 401 Unauthorized
        return callback('Unauthorized');
      }
      return callback(null, generatePolicy(decoded.sub, 'Allow', event.methodArn));
    });
...
```

All without a need for you to maintain the Users database. Pretty slick.

#### Conclusion

We’re unfortunately still in the early stages of authentication for serverless.

While API Gateway provides a convenient way to implement authorization for Lambda functions (with, logically, more Lambda functions), other serverless compute providers don’t offer ways to conveniently authenticate users.

And even authorizer functions in Lambda have their issues, with fairly complex policies and caching limitations.

We are eager to see what solutions for authentication the serverless compute providers offer going forward, and are always happy to hear from you about how you’re handling authentication. Feel free to drop a comment, post [in our forum](https://forum.serverless.com/), or [hit us up on Twitter](https://twitter.com/goserverless).
