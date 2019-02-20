---
title: "Serverless Framework v1.38 - Introducing Websockets Support"
description: "Check out the latest Serverless Framework v1.38 release."
date: 2019-02-20
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v137-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v137-header.png'
category:
  - news
authors:
  - EslamHefnawy
---

### Introducing Websockets Support
After years of waiting, [AWS has finally added support for websockets in API Gateway & Lambda](https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/), and because CloudFormation didn't have support for websockets at the time of the initial release, we've created an [official plugin](https://github.com/serverless/serverless-websockets-plugin) that lets you integrate websockets into you Serverless Framework projects.

Fast forward couple of weeks, [CloudFormation now has official support for Websockets](https://aws.amazon.com/about-aws/whats-new/2019/02/automate-websocket-api-creation-in-api-gateway-with-cloudformation/). With that in place, we immediately started adding support for Websockets in the framework core. We're now excited to announce that this 1.38.0 release includes support for Websockets.

**Note:** Now that we have official support for websockets in core, the [serverless-websockets-plugin](https://github.com/serverless/serverless-websockets-plugin) is officially deprecated, and we will no longer maintain it.

#### Getting Started with Websockets
To start using websockets in your serverless projects, subscribe your functions to the new `websocket` event by specifying the desired routes that would invoke your function: 

```yml
functions:
  default:
    handler: handler.default
    events:
      - websocket: $default
```

This would create a `$default` route that would forward all websocket events (including `$connect` and `$disconnect`) to your `default` function.

You can also specify your event as an object and add more routes:


```yml
functions:
  connect:
    handler: handler.connect
    events:
        - websocket:
            route: $connect
  disconnect:
    handler: handler.disconnect
    events:
      - websocket:
          route: $disconnect
  default:
    handler: handler.default
    events:
      - websocket:
          route: $default
  echo:
    handler: handler.echo
    events:
      - websocket:
          route: $echo

```

The object notation will be useful when you want to add more configuration to your websocket events, for example when we add support for authorizers in an upcoming release.

Once you deploy this service, you'll see the endpoint of your websocket backend in your terminal. Using this endpoint, you can connect to your websocket backend using any websocket client.

You could also have another function with `http` event, so your service would expose to endpoints, one for websockets, the other for http.

##### Specifying Route Selection Expression
By default, the route selection expression is set to `$request.body.action`. This property tells API Gateway how to parse the data coming into your websocket endpoint. So with this default behavior, and using the service above, you can invoke the `echo` function by using the following JSON object as your websocket event body: 

```json
{
  "action": "echo",
  "data":  "hello"
}
```
 
You can overwrite the route expression by specifying the `websocketsApiRouteSelectionExpression` key in the `provider` object:

```yml
provider:
  name: aws
  runtime: nodejs8.10
  websocketsApiRouteSelectionExpression: "$request.body.route"
```

In that case, your websocket body should be:

```json
{
  "route": "echo",
  "data":  "hello"
}
```

Remember that any other body/data coming to your websocket back would invoke the default function.

##### Communicating with clients
The framework also takes care of setting the permissions required for your lambda function to communicate to the connected clients. So you'll be able to send data to any client right away by using the new `ApiGatewayManagementApi` Service, without having to worry about IAM policies.

```js
  const client = new AWS.ApiGatewayManagementApi({
    apiVersion: '2018-11-29',
    endpoint: `https://${event.requestContext.domainName}/${event.requestContext.stage}`
  });

  await client
    .postToConnection({
      ConnectionId: event.requestContext.connectionId,
      Data: `echo route received: ${event.body}`
    })
    .promise();
```

**Note:** At the time of this writing, the Lambda runtime does not include the latest version of the AWS SDK that includes this new `ApiGatewayManagementApi` service. So you'll have to deploy your own by adding it to your `package.json`.

And that's pretty much all you need to do to get started with websockets events. For more information, [please checkout our docs](https://serverless.com/framework/docs/providers/aws/events/websocket/)


### Changelog

Other than Websockets support, we added a lot of enhancements and bug fixes in this release. Here's our changelog, with some links to the corresponding PRs!

 - [Set timout & others on context in python invoke local](https://github.com/serverless/serverless/pull/5796)
 - [Append in Custom Syntax](https://github.com/serverless/serverless/pull/5799)
 - [Don't load config for `config`](https://github.com/serverless/serverless/pull/5798)
 - [Replace blocking fs.readFileSync with non blocking fs.readFile in checkForChanges.js](https://github.com/serverless/serverless/pull/5791)
 - [Added layer option for deploy function update-config](https://github.com/serverless/serverless/pull/5787)
 - [fix makeDeepVariable replacement](https://github.com/serverless/serverless/pull/5809)
 - [Make local ruby pry work](https://github.com/serverless/serverless/pull/5718)
 - [Replace \ with / in paths on windows before passing to nanomatch](https://github.com/serverless/serverless/pull/5808)
 - [Support deploying GoLang to AWS from Windows!](https://github.com/serverless/serverless/pull/5813)
 - [Fix windows go rework](https://github.com/serverless/serverless/pull/5816)
 - [Make use of join operator first argument in sns docs](https://github.com/serverless/serverless/pull/5826)
 - [add support for command type='container'](https://github.com/serverless/serverless/pull/5821)
 - [Add Google Python function template](https://github.com/serverless/serverless/pull/5819)
 - [Update config-credentials.md](https://github.com/serverless/serverless/pull/5827)
 - [Update bucket conf to default AES256 encryption.](https://github.com/serverless/serverless/pull/5800)
 - [Fix: override wildcard glob pattern (**) in resolveFilePathsFromPatterns](https://github.com/serverless/serverless/pull/5825)
 - [Indicate unused context in aws-nodejs-typescipt](https://github.com/serverless/serverless/pull/5832)
 - [Add stack trace to aws/invokeLocal errors](https://github.com/serverless/serverless/pull/5835)
 - [Missing underscore](https://github.com/serverless/serverless/pull/5836)
 - [Updating cloudformation resource reference url](https://github.com/serverless/serverless/pull/5690)
 - [Docs: Replacing "runtimes" with "templates"](https://github.com/serverless/serverless/pull/5843)
 - [Add support for websockets event](https://github.com/serverless/serverless/pull/5824)
 - [AWS: ${ssm} resolve vairbale as JSON if it is stored as JSON in Secrets Manager](https://github.com/serverless/serverless/pull/5842)
 - [Fix service name in template install message](https://github.com/serverless/serverless/pull/5839)

#### Roadmap and focus

Over the next few releases, we'll be enhancing websocket support with more features like authorizers and request responses. We're also focusing on improving the local development experience. Keep an eye on the upcoming milestones to stay up to date with what's coming:

- [v1.39.0 Milestone](https://github.com/serverless/serverless/milestone/61)
- [v1.40.0 Milestone](https://github.com/serverless/serverless/milestone/62)

#### Contributor thanks

We had more than 20 contributors have their work go into this release and we can't thank each of them enough. You all make the community special.

Want to have your github avatar and name in the next release post? Check out these [issues we are looking for help on](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)!

