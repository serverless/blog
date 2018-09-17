---
title: "Where to start: the most popular Framework plugins"
description: "Take your Serverless development to the next level. Check out our most popular community plugins."
date: 2018-01-22
thumbnail: 'https://cloud.githubusercontent.com/assets/20538501/21665215/e3c9aae6-d2b0-11e6-9865-498d91318e7a.png'
category:
  - guides-and-tutorials
  - engineering-culture
authors:
  - AndreaPasswater
---

"Don't build it again if someone else already open-sourced it for you." Signed, every developer ever.

In other words, if you haven't yet checked out this [huge list of Serverless Framework plugins](https://github.com/serverless/plugins), you're missing out. Because they are *slick*. And *useful*. And *ready to use right now*.

Fortunately and unfortunately, there are also close to 150 of them. Yew! Where do you even begin?

HERE. That's where.

We hereby present the most popular plugins for the Serverless Framework (plus a goodie bag of our own team's favorites).

# The community's most-loved Framework plugins (by GitHub stars)

<img src="https://avatars3.githubusercontent.com/u/438848?s=400&v=4" align="left" height="100px">

**1. [Headless Chrome Plugin](https://github.com/adieuadieu/serverless-chrome/tree/master/packages/serverless-plugin)**, by [Marco Lüthy](https://github.com/adieuadieu)

The Headless Chrome Plugin bundles the [serverless-chrome/lambda](https://github.com/adieuadieu/serverless-chrome/tree/master/packages/lambda) package and ensures that Headless Chrome is running when your function handler is invoked.

Install:
```
serverless plugin install -n serverless-plugin-chrome
```

[Click here for Serverless Chrome examples](https://github.com/adieuadieu/serverless-chrome/tree/master/examples/serverless-framework).

---

<img src="https://avatars2.githubusercontent.com/u/4154003?s=400&v=4" align="left" height="100px">

**2. [Serverless Offline](https://github.com/dherault/serverless-offline)**, by [David Héralt](https://github.com/dherault/)

The Serverless Offline plugin saves you tons of dev time by emulating AWS Lambda and API Gateway on your local machine. It works by starting an HTTP server that handles the request's lifecycle (like APIG does) and invoking your handlers.

Install:
```
serverless plugin install -n serverless-offline
```

A cool walkthrough that uses it:
- [Writing a Serverless app with full local development experience](https://serverless.com/blog/event-driven-serverless-app-local-dev-exp/)

---

<img src="https://avatars3.githubusercontent.com/u/30321405?s=200&v=4" align="left" height="100px">

**3. [Serverless Webpack](https://github.com/serverless-heaven/serverless-webpack)**, by [Serverless Heaven](https://github.com/serverless-heaven)

If you want to use the latest Javascript, TypeScript, Elm, CoffeeScript (and more!) with Babel, then Serverless Webpack is for you. The plugin offers enhanced dependency management, and packages only the external libraries that are really used by your code.

Install:
```
serverless plugin install -n serverless-webpack
```

A cool walkthrough that uses it:
- [Creating a Serverless GraphQL gateway on top of a 3rd party REST API](https://serverless.com/blog/3rd-party-rest-api-to-graphql-serverless/)

Plus: [click here for an Elm demo.](https://github.com/ktonon/elm-serverless-demo)

---

<img src="https://avatars0.githubusercontent.com/u/1301012?s=400&v=4" align="left" height="100px">

**4. [Serverless Step Functions](https://github.com/horike37/serverless-step-functions)**, by [Takahiro Horike](https://github.com/horike37)

If serverless functions are stateless, how do you manage state? AWS Step Functions! This plugin lets you use Step Functions with the Serverless Framework.

Install:
```
serverless plugin install -n serverless-step-functions
```

[Click here for a full walkthrough with sample app.](https://serverless.com/blog/how-to-manage-your-aws-step-functions-with-serverless/)

---

<img src="https://avatars0.githubusercontent.com/u/19732939?s=200&v=4" align="left" height="100px">

**5. [Python Requirements Plugin](https://github.com/UnitedIncome/serverless-python-requirements)**, by [United Income](https://github.com/UnitedIncome)

Pythonistas, this one's for you. This plugin automatically bundles dependencies from `requirements.txt` and makes them available in your PYTHONPATH.

Install:
```
serverless plugin install -n serverless-python-requirements
```

A cool walkthrough that uses it:
- [Build a Python REST API with Serverless, Lambda, and DynamoDB](https://serverless.com/blog/flask-python-rest-api-serverless-lambda-dynamodb/)

---

<img src="https://avatars2.githubusercontent.com/u/19850503?s=200&v=4" align="left" height="100px">

**6. [DynamoDB Local](https://github.com/99xt/serverless-dynamodb-local)**, by [99X Technology](https://github.com/99xt)

Pretty much what it says on the tin—run DynamoDB locally. You can start DynamoDB Local with all the parameters supported (e.g port, inMemory, sharedDb), create tables and more.

Install:
```
serverless plugin install -n serverless-dynamodb-local
```

A cool walkthrough that uses it:
- [Deploy a REST API using Serverless, Express and Node.js](https://serverless.com/blog/serverless-express-rest-api/)

---

<img src="https://avatars1.githubusercontent.com/u/17219288?s=200&v=4" align="left" height="100px">

**7. [Typescript Plugin](https://github.com/graphcool/serverless-plugin-typescript)**, by [Graphcool](https://github.com/graphcool)

Zero-config Typescript support—*yes* please. Don't need to install any other compiler or plugins; it just works right out of the box.

Install:
```
serverless plugin install -n serverless-plugin-typescript
```

[Click here for an example.](https://github.com/graphcool/serverless-plugin-typescript/tree/master/example)

---

<img src="https://avatars0.githubusercontent.com/u/10208412?s=200&v=4" align="left" height="100px">

**8. [WarmUP Plugin](https://github.com/FidelLimited/serverless-plugin-warmup)**, by [Fidel](https://github.com/FidelLimited)

Are your Lambda starts feeling a little cold? Snuggle them in this WarmUP plugin and say goodbye to those cold starts. WarmUP invokes your Lambdas in a configured time interval, forcing your containers to stay alive.

Install:
```
serverless plugin install -n serverless-plugin-warmup
```

[Here's an example on how to use WarmUP.](https://serverless.com/blog/keep-your-lambdas-warm/)

---

# Top plugin for Alexa development

<img src="https://avatars3.githubusercontent.com/u/20362367?s=200&v=4" align="left" height="100px">

**[Bespoken Plugin](https://github.com/bespoken/serverless-plugin-bespoken)**, by [Bespoken](https://github.com/bespoken)

Test your Lambdas during development without having to deploy. The plugin generates a local server that is a attached to a proxy online so you can use that url to access the functionality from your laptop.

A cool walkthrough that uses it:
- [Building & testing an Alexa skill with the Serverless Bespoken plugin](https://serverless.com/blog/building-testing-alexa-skill-bespoken-plugin/)

---

# Serverless team favorites

<img src="https://avatars3.githubusercontent.com/u/19777?s=400&v=4" align="left" height="100px">

**1. [AWS Pseudo Parameters](https://github.com/svdgraaf/serverless-pseudo-parameters)**, by [Sander van de Graaf](https://github.com/svdgraaf)

This plugin makes it so, so much easier to use CloudFormation Pseudo Parameters in your serverless.yml. Use #{AWS::AccountId}, #{AWS::Region}, etc. in any of your config strings; this plugin replaces those values with the proper pseudo parameter Fn::Sub CloudFormation function.

Here's a cool walkthrough that uses it:
- [How to use AWS Fargate and Lambda for long-running processes in a Serverless app](https://serverless.com/blog/serverless-application-for-long-running-process-fargate-lambda/)

---

<img src="https://avatars2.githubusercontent.com/u/107699?s=200&v=4" align="left" height="100px">

**2. [Domain Manager](https://github.com/amplify-education/serverless-domain-manager)**, by [Amplify](https://github.com/amplify-education)

Manage custom domains with API Gateway. Use this plugin to create custom domain names that your Lambda can deploy to. Domain Manager also supports base path mapping for deploys and domain name deletion.

TWO cool walkthroughs that use it:
- [How to set up a custom domain name for Lambda & API Gateway with Serverless](https://serverless.com/blog/serverless-api-gateway-domain/)
- [How to deploy multiple micro-services under one API domain with Serverless](https://serverless.com/blog/api-gateway-multiple-services/)

---

<img src="https://avatars0.githubusercontent.com/u/11278370?s=200&v=4" align="left" height="100px">

**3. [CloudFormation Parameter Setter](https://github.com/trek10inc/serverless-cloudformation-parameter-setter)**, by [Trek10](https://github.com/trek10inc)

This is a big one for security. Set your CloudFormation Parameters when deploying with the Serverless Framework.

---

<img src="https://avatars3.githubusercontent.com/u/20273?s=400&v=4" align="left" height="100px">

**4. [Serverless WSGI](https://github.com/logandk/serverless-wsgi)**, by [Logan Raarup](https://github.com/logandk)

Build your deploy Python WSGI apps using Serverless—compatible with Flask, Django, Pyramid and more. Also has a `wsgi serve` command that serves your application locally during development.

---

<img src="https://avatars1.githubusercontent.com/u/12712530?s=200&v=4" align="left" height="100px">

**5. [AWS Alerts](https://github.com/ACloudGuru/serverless-plugin-aws-alerts)**, by [A Cloud Guru](https://github.com/ACloudGuru)

Use this plugin to add CloudWatch alarms to functions. Piece of cake. 🍰

Cool walkthroughs that use it:
- [Serverless Ops 101 - Using CloudWatch Metrics & Alarms with Serverless Functions](https://serverless.com/blog/serverless-ops-metrics/)

---

<img src="https://avatars0.githubusercontent.com/u/5524702?s=400&v=4" align="left" height="100px">

**6. [AWS Alias](https://github.com/hyperbrain/serverless-aws-alias)**, by [Frank Schmid](https://github.com/HyperBrain)

This plugin lets you use AWS aliases on Lambda functions. Each alias creates a CloudFormation stack that is dependent on the stage stack; this approach makes for easy removal of any alias deployment, and protects the aliased function versions.

---

# Have a plugin that's missing from our repo?

Add it! Just submit it to the [Community-contributed plugins repo](https://github.com/serverless/plugins#community-contributed-plugins).

# Want to make your own plugin?

Please do. Every plugin is a glimmering gem in our heart-est of hearts.

Here are some resources to get you started:
- [How To Write Your First Plugin For The Serverless Framework - Part 1](https://serverless.com/blog/writing-serverless-plugins/)
- [How To Write Your First Plugin For The Serverless Framework - Part 2](https://serverless.com/blog/writing-serverless-plugins-2/)
- [Advanced Plugin Development - Extending The Serverless Core Lifecycle](https://serverless.com/blog/advanced-plugin-development-extending-the-core-lifecycle/)
- [Advanced Plugin Development Part 2 - Command Alises & Delegates, Enhanced Logging](https://serverless.com/blog/plugin-system-extensions/)
