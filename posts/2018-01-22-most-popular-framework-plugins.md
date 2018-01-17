---
title: "Where to start: the most popular Framework plugins"
description: "Take your Serverless development to the next level. Check out our most popular community plugins."
date: 2018-01-22
layout: Post
thumbnail: 'https://cloud.githubusercontent.com/assets/20538501/21665215/e3c9aae6-d2b0-11e6-9865-498d91318e7a.png'
authors:
  - AndreaPasswater
---

"Don't build it again if someone else already open-sourced it for you," said every developer ever.

In other words, if you haven't yet checked out this [huge list of Serverless Framework plugins](https://github.com/serverless/plugins), you're missing out. Because they are *slick*. And *useful*. And *pre-made*.

Fortunately and unfortunately, there are also close to 150 of them. Yew! Where do you even begin?

HERE. That's where.

# The community's most-loved Framework plugins (by GitHub stars)

<img src="https://avatars3.githubusercontent.com/u/438848?s=400&v=4" align="left" height="100px">

**1. [Headless Chrome Plugin](https://github.com/adieuadieu/serverless-chrome/tree/master/packages/serverless-plugin)**, by [Marco Lüthy](https://github.com/adieuadieu)

The Headless Chrome Plugin bundles the [serverless-chrome/lambda](https://github.com/adieuadieu/serverless-chrome/tree/master/packages/lambda) package and ensures that Headless Chrome is running when your function handler is invoked.

Install with yarn:
```
yarn add --dev serverless-plugin-chrome
```

Install with npm (requires Node 6.10 runtime):
```
npm install --save-dev serverless-plugin-chrome
```

And then add it to your serverless.yml:
```
plugins:
  - serverless-plugin-chrome
```

[Click here for Serverless Chrome examples](https://github.com/adieuadieu/serverless-chrome/tree/master/examples/serverless-framework).

---

<img src="https://avatars2.githubusercontent.com/u/4154003?s=400&v=4" align="left" height="100px">

**2. [Serverless Offline](https://github.com/dherault/serverless-offline)**, by [David Héralt](https://github.com/dherault/)

The Serverless Offline plugin saves you tons of dev time by emulating AWS Lambda and API Gateway on your local machine. It works by starting an HTTP server that handles the request's lifecycle (like APIG does) and invoking your handlers.

Install with npm:
```
npm install --save-dev serverless-offline
```

And then add it to your serverless.yml:
```
plugins:
  - serverless-offline
```

A cool walkthrough that uses it:
- [Writing a Serverless app with full local development experience](https://serverless.com/blog/event-driven-serverless-app-local-dev-exp/)

---

<img src="https://avatars3.githubusercontent.com/u/30321405?s=200&v=4" align="left" height="100px">

**3. [Serverless Webpack](https://github.com/serverless-heaven/serverless-webpack)**, by [Serverless Heaven](https://github.com/serverless-heaven)

If you want to use the latest Javascript version with Babel, this plugin is for you! Use custom resource loaders, optimize your packaged functions individually, and more.

Install with npm:
```
npm install --save-dev serverless-webpack
```

And then add it to your serverless.yml:
```
plugins:
  - serverless-webpack
```

A cool walkthrough that uses it:
- [Creating a Serverless GraphQL gateway on top of a 3rd party REST API](https://serverless.com/blog/3rd-party-rest-api-to-graphql-serverless/)

---

<img src="https://avatars0.githubusercontent.com/u/1301012?s=400&v=4" align="left" height="100px">

**4. [Serverless Step Functions](https://github.com/horike37/serverless-step-functions)**, by [Takahiro Horike](https://github.com/horike37)

If serverless functions are stateless, how do you manage state? AWS Step Functions! This plugin lets you use Step Functions with the Serverless Framework.

Install with npm:
```
npm install --save-dev serverless-step-functions
```

And then add it to your serverless.yml:
```
plugins:
  - serverless-step-functions
```

[Click here for a full walkthrough with sample app.](https://serverless.com/blog/how-to-manage-your-aws-step-functions-with-serverless/)

---

<img src="https://avatars0.githubusercontent.com/u/19732939?s=200&v=4" align="left" height="100px">

**5. [Python Requirements Plugin](https://github.com/UnitedIncome/serverless-python-requirements)**, by [United Income](https://github.com/UnitedIncome)

Pythonistas, this one's for you. This plugin automatically bundles dependencies from `requirements.txt` and makes them available in your PYTHONPATH.

Install with npm:
```
npm install --save-dev serverless-python-requirements
```

And then add it to your serverless.yml:
```
plugins:
  - serverless-python-requirements
```

A cool walkthrough that uses it:
- [Build a Python REST API with Serverless, Lambda, and DynamoDB](https://serverless.com/blog/flask-python-rest-api-serverless-lambda-dynamodb/)

---

<img src="https://avatars2.githubusercontent.com/u/19850503?s=200&v=4" align="left" height="100px">

**6. [DynamoDB Local](https://github.com/99xt/serverless-dynamodb-local)**, by [99X Technology](https://github.com/99xt)

Pretty much what it says on the tin—run DynamoDB locally. You can start DynamoDB Local with all the parameters supported (e.g port, inMemory, sharedDb), create tables and more.

Install with npm:
```
npm install --save-dev serverless-dynamodb-local
```

And then add it to your serverless.yml:
```
plugins:
  - serverless-dynamodb-local
```

A cool walkthrough that uses it:
- [Deploy a REST API using Serverless, Express and Node.js](https://serverless.com/blog/serverless-express-rest-api/)

---

<img src="https://avatars1.githubusercontent.com/u/17219288?s=200&v=4" align="left" height="100px">

**7. [serverless-plugin-typescript](https://github.com/graphcool/serverless-plugin-typescript)**, by [Graphcool](https://github.com/graphcool)

Zero-config Typescript support—*yes* please. Don't need to install any other compiler or plugins; it just works right out of the box.

Install with yarn:
```
npm install --save-dev serverless-plugin-typescript
```

And then add it to your serverless.yml:
```
plugins:
  - serverless-plugin-typescript
```

[Click here for an example.](https://github.com/graphcool/serverless-plugin-typescript/tree/master/example)

---

<img src="https://avatars0.githubusercontent.com/u/10208412?s=200&v=4" align="left" height="100px">

[WarmUP Plugin](https://github.com/FidelLimited/serverless-plugin-warmup), by [Fidel](https://github.com/FidelLimited)

Are your Lambda starts feeling a little cold? Snuggle them in this WarmUP plugin and say goodbye to those cold starts. WarmUP invokes your Lambdas in a configured time interval, forcing your containers to stay alive.

Install with npm:
```
npm install --save-dev serverless-plugin-warmup
```

And then add it to your serverless.yml:
```
plugins:
  - serverless-plugin-warmup
```

[Here's an example on how to use WarmUP.](https://serverless.com/blog/keep-your-lambdas-warm/)

---

[serverless-wsgi](https://github.com/logandk/serverless-wsgi), by [Logan Raarup](https://github.com/logandk)

[serverless-domain-manager](https://github.com/amplify-education/serverless-domain-manager), by [Amplify](https://github.com/amplify-education)

[serverless-aws-documentation](https://github.com/9cookies/serverless-aws-documentation), by [9cookies](https://github.com/9cookies)

[serverless-kubeless](https://github.com/serverless/serverless-kubeless), by [Serverless](https://github.com/serverless)

[serverless-dynamodb-autoscaling](https://github.com/sbstjn/serverless-dynamodb-autoscaling), by [Sebastian Müller](https://github.com/sbstjn)

[serverless-mocha-plugin](https://github.com/nordcloud/serverless-mocha-plugin), by [Nordcloud](https://github.com/nordcloud)

[serverless-plugin-aws-alerts](https://github.com/ACloudGuru/serverless-plugin-aws-alerts), by [A Cloud Guru](https://github.com/ACloudGuru)
