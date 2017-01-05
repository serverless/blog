---
title: IoT event support, Cognito user pool authorizer, service installation with a name in Serverless Framework v1.5
description: IoT event support, Cognito user pool authorizer, service installation with a name in Serverless Framework v1.5
date: 2017-01-05
layout: Post
---

Today we're happy to announce the release of the Serverless Framework v1.5.0.

Let's take a look at the release highlights!

## Highlights of 1.5.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### IoT event support

v1.5 introduces the new `iot` event source.

Lambda functions can now be triggered by AWS IoT events. Here's a simple code snippet which shows you how this looks like:

```yml
functions:
  weatherReporter:
    handler: handler.handler
    events:
      - iot:
          sql: "SELECT * FROM 'weather_data'"
```

In this example the `weatherReporter` function will be called every time an IoT event is sent to the `weather_data` topic.

As usual you can learn more about this new event source in [the docs](https://serverless.com/framework/docs/providers/aws/events/iot). You should also check out the IoT example in our [Serverless Examples repository](https://github.com/serverless/examples/tree/master/aws-node-iot-event) to see a the code of a full functional Serverless service which uses the `iot` event.

IoT devices and `iot` event support are a hot topic as it makes it possible to connect and interact with other hardware devices through Lambda functions. Furthermore it's a great use case for a serverless architecture.

We have a dedicated blog post which will show you how an IoT device made it possible to see if the wheater at the lake is good enough to hang out there. This blog post will be released soon, so stay tuned!

### Cognito user pool authorizer

Serverless supports the use of custom authorizers for your API Gateway endpoints (see [the docs](https://serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-custom-authorizers) for more information about it).

However up until now only custom authorizers were supported. What if you have a Cognito user pool you want to use to authroize your users?

Serverless has you covered! You can now specify the `arn` to your user pool so that it'll be used by the authorizer function to authorize incoming requests.

Here's a code snippet which shows how the setup looks like:

```yml
functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: get
          integration: lambda
          authorizer:
            name: authorizer
            arn: arn:aws:cognito-idp:us-east-1:123456789:userpool/us-east-1_XXXXXX
            claims:
              - email
```

Want to see a more in-depth example? The following Serverless example service shows everything in detail:

https://github.com/johnf/serverless-cognito-demo

### Service installation with a name

`serverless install` is a widely used command to download existing Serverless services from GitHub.

Oftentimes you want to use and deploy the service you download under a different name. Serverless v1.5.0 makes it possible to rename services directly after they've been downloaded.

Just provide the `--name` flag and the service will be renamed after it was downloaded:

```bash
serverless install --url https://github.com/serverless/examples/tree/master/aws-node-iot-event --name iot
```

### Enhancement and bug fixes

With every release we also implement a bunch of enhacements and bug fixes (thanks for reporting!).

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.6 milestone](https://github.com/serverless/serverless/milestone/21) to see what we're working on for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.

### Using Semver

Note that we're using [strict Semver](http://semver.org/) for our Serverless Framework versioning. This way you'll know when we introduce major features or breaking changes.
