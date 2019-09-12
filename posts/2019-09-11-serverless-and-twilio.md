---
title: "How to use Serverless and Twilio to automate your communication channels"
description: "We’re happy to announce that you can now deploy Twilio Functions using the Serverless Framework. Here's how!"
date: 2019-09-11
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-and-twilio/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-and-twilio/header.png"
category:
  - guides-and-tutorials
  - news
authors:
  - StefanJudis
---

The way people communicate has changed over the last few years. When was the last time you called a service-number because you had a problem? For me, this is already years ago, and I most often use chat interfaces when they’re available. 

These new interfaces are usually automated to a certain extent – it’s hard to tell if a human or a machine is replying to your question. Developers have the power to build interfaces that go beyond what we’re used to. Alexa, Whatsapp, emails, SMS – you can automate all these channels.

[Twilio is a communications API](https://www.twilio.com) that enables you to tailor the experience to your needs. Want to do an SMS poll? No problem! Need a custom chatbot on your landing pages? Sure thing! Want to bring all your friends into a group phone call? Easy peasy!

#### Webhooks – the foundation of future interfaces

As a developer, you probably won’t build the infrastructure to send SMS or make phone calls. You’ll use SDKs and APIs for that. The way it works is that you can use Twilio’s RESTful API to initiate outbound communications. Phone calls, SMS, WhatsApp messages are only one HTTP call away.

The other way around is a little bit trickier. How do you react to incoming messages or phone calls when you’re not controlling the infrastructure receiving these events? [Webhooks](https://www.twilio.com/docs/glossary/what-is-a-webhook) build the foundation for that.

If someone sends a message, makes a phone call, or uses any other channel a webhook is sent to a URL you define. The response of the webhook controls what happens next.

![SMS, Twilio, App](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-and-twilio/image3.png)

In the above example, you see the flow for an incoming SMS. A user sends an SMS, Twilio handles this event and makes an HTTP request to your app to find out what to do next. 

**But do you want to build a whole app to respond to an HTTP request? Or could a serverless function do the job?**

#### The Serverless Framework now supports deploying Twilio Functions

Serverless functions are a perfect fit for responding to HTTP calls. [The Twilio Runtime](https://www.twilio.com/docs/runtime) gives you a way to write serverless functions today. **We’re happy to announce that you can now deploy Twilio Functions using the Serverless Framework.**

![SMS, Twilio, Serverless](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-and-twilio/image4.png)

If you’re used to working with the Serverless Framework, there is no need to learn a new API. You can continue using the Serverless Framework to control your Twilio communications!

#### Deploy Twilio serverless functions in two minutes

Starting with the Serverless CLI `v1.50.0`, you can bootstrap a Twilio Runtime project with a single command. In this post you’ll learn how to do that.

Make sure you have the [Serverless CLI](https://www.npmjs.com/package/serverless) installed globally and run `serverless create` with the Twilio Node.js template.

```
serverless create -t twilio-nodejs -p my-twilio-project
```

Navigate into the new directory `my-twilio-project` and run `npm install`. Before you deploy a new serverless service, you need to authenticate. Head over to your [Twilio Console](https://twilio.com/console) and copy your account credentials (the Account SID and Auth token).

Define the two authentication values as environment variables and deploy the new project using `serverless deploy`.

```
cd my-twilio-project
npm install
TWILIO_ACCOUNT_SID=AC... TWILIO_AUTH_TOKEN=a4... serverless deploy
```

The command output should look as follows.

```
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: twilio-runtime: Creating Service
Serverless: twilio-runtime: Configuring "dev" environment
Serverless: twilio-runtime: Creating 1 Functions
Serverless: twilio-runtime: Uploading 1 Functions
Serverless: twilio-runtime: Creating 1 Assets
Serverless: twilio-runtime: Uploading 1 Assets
Serverless: twilio-runtime: Waiting for deployment.
Serverless: twilio-runtime: Waiting for deployment. Current status: building
Serverless: twilio-runtime: Waiting for deployment. Current status: building
Serverless: twilio-runtime: Waiting for deployment. Current status: building
Serverless: twilio-runtime: Waiting for deployment. Current status: building
Serverless: twilio-runtime: Setting environment variables
Serverless: twilio-runtime: Activating deployment
Serverless: twilio-runtime: Function available at: my-twilio-project-7724-dev.twil.io/hello/world
Serverless: twilio-runtime: Asset available at: my-twilio-project-7724-dev.twil.io/assets/foo/example.jpg
```

Congratulations! 🎉 You just deployed your first Twilio Runtime service that is able to serve functions and assets using the Serverless CLI. The URLs displayed in the deploy log are now publicly available.

![Twilio runtime page](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-and-twilio/image2.png)

How does that work? And how can you tweak Twilio functions to your needs? Let’s find out!

##### The file structure of a Serverless Twilio project

The `create` command created all the files you need – ready-to-deploy. It includes the following:

```
.rw-r--r--   .gitignore
.rw-r--r--   example.jpg
.rw-r--r--   handler.js
drwxr-xr-x   node_modules
.rw-r--r--   package-lock.json
.rw-r--r--   package.json
.rw-r--r--   serverless.yml
```

You see the familiar `serverless.yml` configuration file, a `package.json` and `package-lock.json`, and a function (`handler.js`) and asset file (`example.jpg`).

The project has only one npm dependency defined inside of the `package.json`: [@twilio-labs/serverless-twilio-runtime](https://www.npmjs.com/package/@twilio-labs/serverless-twilio-runtime). You installed this dependency already, and if you now have a look at the `serverless.yml`, you’ll see that it defines `@twilio-labs/serverless-twilio-runtime` as a plugin.

```yml
# serverless.yml
plugins:
  - '@twilio-labs/serverless-twilio-runtime'
```

This plugin definition makes it possible to deploy to the Twilio Runtime.

The `serverless.yml` holds more configuration than the plugin definition, though. It also configures the runtime and provides a quick way to define and deploy serverless functions and assets.

#### General configuration

The main configuration for your serverless service happens inside of the `provider` property. Twilio is the provider in this case. 

You have the following configuration options:

* Authentication (required)
* Dependencies
* Name of the deployed environment
* Environment variables accessible inside of your functions

Let’s go over these options one-by-one.

##### Authenticate your serverless services with Twilio

To deploy functions to the Twilio Runtime, you have to define your `accountSid` and an `authToken`. You could potentially hardcode these values in your `serverless.yml` but it is recommended to pass these values via environment variables (`${env:TWILIO_ACCOUNT_SID}` and `${env:TWILIO_AUTH_TOKEN}`). This way, you don’t risk to push your sensible credentials to GitHub.

```yml
# serverless.yml
provider:
  name: twilio
  # Auth credentials which you'll find at twilio.com/console
  config:
    accountSid: ${env:TWILIO_ACCOUNT_SID}
    authToken: ${env:TWILIO_AUTH_TOKEN}
```

The above configuration is the reason why the command `TWILIO_ACCOUNT_SID=AC… TWILIO_AUTH_TOKEN=a8… serverless deploy` works. The `serverless` command picks up the environment variables and passes them to the Twilio Runtime plugin.

##### Define needed npm dependencies

If you have experience using the Serverless Framework, you may be used to the process of packaging dependencies into a single bundle. The Twilio Runtime handles dependencies differently.

The `deploy` command does not need to pack all your local dependencies into a single package to upload. The Twilio Runtime allows you to define your dependencies, and you only need to upload your function and asset files. The rest just works!

Having a look at the `serverless.yml`, you’ll see that the bootstrap project has one dependency – `asciiart-logo`. The definition of dependencies is similar to `package.json` dependency definitions.

```yml
# serverless.yml
provider:
  # Twilio runtime as your preferred provider
  name: twilio

  # Dependency definitions similar
  # to dependencies in a package.json
  # -> these dependencies will be available in the
  #    Twilio Node.js runtime
  dependencies:
    asciiart-logo: '*'
```
You can now include `const logo = require('asciiart-logo');` in your function files and the dependency will be available.

##### Define your environment

If you’re heavily relying on serverless functions, you’ll find yourself facing increased complexity quickly. To tackle this complexity, you can safely deploy QA and staging environments to test your functions before they go into production.

The `environment` property lets you deploy different environments to the Twilio Runtime. 

```yml
provider:
  # Twilio runtime as your preferred provider
  name: twilio

  # Twilio runtime supports several domains
  # your functions and assets will be available under
  # -> defaulting to 'dev'
  environment: ${env:TWILIO_RUNTIME_ENV, 'dev'}
```

The `environment` property is also defaulting to `dev` and you can change it via the environment variable `TWILIO_RUNTIME_ENV`. 

A deployed Twilio function URL consists of the service name, a random hash, and the defined environment. The endpoint URL `my-twilio-project-7724-dev.twil.io/hello/world` tells you that you’re looking at a function in the `dev` environment included in the `my-twilio-project` service.

##### Define accessible environment variables

When deploying functions to the Twilio Runtime, you may also need a way to define variables that will be available in the function context. These environment variables can be handy to store authentication tokens for other services, to define used endpoints or any dynamic values.

The `environmentVars` property lets you define these values. They will be available in the `context` property when your functions are executed.

```yml
# serverless.yml
provider:
  # Twilio runtime as your preferred provider
  name: twilio

  # Environment variables passed to your functions
  # available via process.env
  environmentVars:
    MY_MESSAGE: 'This is cool stuff'
```

The above `provider` properties are all the configurations you need to tailor your functions deployment to your use case! But where are the function definitions and how come there was an asset deployed?

##### Define your functions

You can define and configure functions by editing the `functions` property in your `serverless.yml`. When you look at it, there is already one function defined. 

Every function definition has to export a `handler` as follows:

```javascript
exports.handler = function(context, event, callback) { /* … */ };
```

The `function` property tells Serverless to use `handlers.js`, make it available at `/hello/world` and make it publicly accessible.

```yaml
# serverless.yml
functions:
  hello-world:
    # Path to the JS handler function in the project (without file extension '.js')
    handler: handler
    # URL path of the function after deployment
    path: /hello/world
    # visibility of the function (can be "public" or "protected")
    access: public
```
You can read more about Twilio functions [in the docs](https://www.twilio.com/docs/runtime/functions-assets-api/api/function-version).

##### Define your assets

The Twilio Runtime allows you to upload assets via the `assets` property. You can access these assets then inside of your deployed functions. The combination of assets and functions can become handy if you want to play an audio file or want to respond to a message with a specific image.

```yml
resources:
  assets:
    # Asset name
    example-image:
      # path to the asset in the project
      filePath: example.jpg
      # URL path to the asset after deployment
      path: /assets/foo/example.jpg
      # visibility of the asset
      access: public
```
To learn more about how to use assets in your functions have a look [at the docs](https://www.twilio.com/docs/runtime/client#runtime-client-methods).

With these function and asset definitions, you are able to deploy a new service in just a few minutes. 🎉

#### Other included Serverless commands

The Serverless Twilio integration supports two other commands – `invoke` and `info`.

##### Invoke

`invoke` is a command that you can use to call a deployed function to see if the response is what you expect.

```
TWILIO_ACCOUNT_SID=AC... TWILIO_AUTH_TOKEN=a4... serverless invoke -f hello-world

  ,--------------------------------------------------------------------------.
  |                                                                          |
  |    _____          _ _ _         ____              _   _                  |
  |   |_   _|_      _(_) (_) ___   |  _ \ _   _ _ __ | |_(_)_ __ ___   ___   |
  |     | | \ \ /\ / / | | |/ _ \  | |_) | | | | '_ \| __| | '_ ` _ \ / _ \  |
  |     | |  \ V  V /| | | | (_) | |  _ <| |_| | | | | |_| | | | | | |  __/  |
  |     |_|   \_/\_/ |_|_|_|\___/  |_| \_\\__,_|_| |_|\__|_|_| |_| |_|\___|  |
  |                                                                          |
  |                                                                          |
  |                                                           version 1.0.0  |
  |                                                                          |
  |                                                                          |
  `--------------------------------------------------------------------------'
```

##### Info

The `info` command gives you information about your deployed service.
```
TWILIO_ACCOUNT_SID=AC... TWILIO_AUTH_TOKEN=a4... serverless info

Service information
*******

Service: tutorial-try-out
Service Sid: ZSd5030028ddd5b0714f3981865c80b90d

Environment: dev
Environment unique name: dev-environment
Environment Sid: ZEf282491f28a513bb310f4f1c167a55d3
Environment domain name: tutorial-try-out-7724-dev.twil.io
Environment variables:
  MY_MESSAGE: THIS IS cool stuff

Assets:
  access: public
  creation date: 2019-09-03T09:51:08Z
  path: /assets/foo/example.jpg
  sid: ZN60c9751befba796c9190cd789f400568
  url: https://tutorial-try-out-7724-dev.twil.io/assets/foo/example.jpg

Functions:
  access: public
  creation date: 2019-09-03T09:51:07Z
  path: /hello/world
  sid: ZN06e8bd0c672045dbc1134de22ebe7fda
  url: https://tutorial-try-out-7724-dev.twil.io/hello/world
```

Using the `info` command, you can quickly get information about deployed functions, assets and service configuration.

#### Twilio serverless functions – the environment tailored to power your communication flows

After the first deployment, the new function endpoint only returns a string with ASCII art. How can you change it to respond to webhooks for incoming SMS the correct way?

A Twilio function provides you with a global `Twilio` variable that includes a `twiml` object to build the correct response. [TwiML](https://www.youtube.com/watch?v=fb0rKmGGyq8) is Twilio’s configuration language to control communication flows. Go into the `handler.js` file, drop the ASCII art, and change it to respond to incoming HTTP calls with some [TwiML](https://www.twilio.com/docs/glossary/what-is-twilio-markup-language-twiml). 

If you [define the function URL as a webhook for a phone number](https://www.twilio.com/docs/sms/tutorials/how-to-receive-and-reply-python), sent-in messages would get the combination of “Hello!” and the defined environment variable as a response.

```javascript
// handler.js
exports.handler = function(context, event, callback) {
  let twiml = new Twilio.twiml.MessagingResponse();
  twiml.message(`Hello! ${context.MY_MESSAGE}`);

  callback(null, twiml);
};
```

Rerun the `deploy` command, and you’re ready to handle incoming messages with Twilio.

```
TWILIO_ACCOUNT_SID=AC... TWILIO_AUTH_TOKEN=a4... serverless deploy
```

**Twilio functions are built to answer Twilio webhooks and glue services together quickly**

![Twilio XML](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-and-twilio/image1.jpg)

##### Additional resources

We’re very excited about the Serverless integration. It’s still pretty new, and we’re working on getting more docs onto serverless.com and adding more commands to the CLI. What functionality are you missing? We’d love to get some feedback on it!

If you want to read more about Twilio functions, you can have a look here:

* [The documentation for Twilio functions](https://www.twilio.com/docs/runtime/functions-assets-api)
* [The Serverless Twilio integration](https://github.com/twilio-labs/serverless-framework-integration/)
