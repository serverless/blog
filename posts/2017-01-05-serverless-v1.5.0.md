---
title: IoT event support, Cognito user pool authorizer & install service with a name in Serverless Framework v1.5
description: IoT event support, Cognito user pool authorizer and the ability to install your service with a name in the Serverless Framework v1.5 release.
date: 2017-01-05
layout: Post
authors:
  - PhilippMuns
---

Today we're happy to announce the release of the Serverless Framework v1.5.0.

Here are some of the release highlights!

## Highlights of 1.5.0

**Note:** You can find a complete list of all the updates in the [changelog](https://github.com/serverless/serverless/blob/master/CHANGELOG.md).

### IoT event support

v1.5 introduces the new `iot` event source.

Lambda functions can now be triggered by AWS IoT events. Here's a simple code snippet that demonstrates how this looks:

```yml
functions:
  weatherReporter:
    handler: handler.handler
    events:
      - iot:
          sql: "SELECT * FROM 'weather_data'"
```

In this example the `weatherReporter` function will be called every time an IoT event is sent to the `weather_data` topic.

As usual you can learn more about this new event source in [the docs](https://serverless.com/framework/docs/providers/aws/events/iot). You should also check out the IoT example in our [Serverless Examples repository](https://github.com/serverless/examples/tree/master/aws-node-iot-event) to see the code for a fully functional Serverless service using the `iot` event.

IoT devices and `iot` event support are a hot topic as it makes it possible to connect and interact with other hardware devices through Lambda functions. It's a great use case for a serverless architecture.

In fact, we have an upcoming guest blog post that will show you how an IoT device made it possible to see (from home) if the weather at the lake is nice enough to go hang out there. Stay tuned!

### Cognito user pool authorizer

Serverless supports the use of custom authorizers for your API Gateway endpoints (see [the docs](https://serverless.com/framework/docs/providers/aws/events/apigateway/#http-endpoints-with-custom-authorizers) for more information about it).

However up until now only custom authorizers were supported. What if you have a Cognito user pool you want to use to authorize your users?

Serverless has you covered! You can now specify the `arn` to your user pool so that it'll be used by the authorizer function to authorize incoming requests.

Here's a code snippet that shows what the setup looks like:

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

### Install service with a name

`serverless install` is a widely used command to download existing Serverless services from GitHub.

Often times you want to use and deploy the service you download under a different name. Serverless v1.5.0 makes it possible to rename services directly after they've been downloaded.

Just provide the `--name` flag and the service will be renamed after it was downloaded:

```bash
serverless install --url https://github.com/serverless/examples/tree/master/aws-node-iot-event --name iot
```

### Enhancement and bug fixes

With every release we also implement a bunch of enhancements and bug fixes (thanks for reporting!).

### Next Steps

We've already started filling in the next [milestones](https://github.com/serverless/serverless/milestones). Check out the [1.6 milestone](https://github.com/serverless/serverless/milestone/21) to see what we're working on for the next release.

We hope that you like the new release! Let us know if you have any questions or feedback in [our Forum](http://forum.serverless.com/) or [GitHub Issues](https://github.com/serverless/serverless/issues).

The [Serverless Examples Repository](https://github.com/serverless/examples) is an excellent resource if you want to explore some real world examples and learn more about what Serverless architectures look like.

### Using Semver

Note that we're using [strict Semver](http://semver.org/) for our Serverless Framework versioning. This way you'll know when we introduce major features or breaking changes.
