---
title: "Serverless Framework v1.38 - Introducing Websockets Support"
description: "Check out the latest Serverless Framework v1.38 release."
date: 2019-02-07
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v137-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v137-header.png'
category:
  - news
authors:
  - EslamHefnawy
---

### Introducing Websockets Support
After years of waiting, [AWS has finally added support for websockets in API Gateway & Lambda](https://aws.amazon.com/blogs/compute/announcing-websocket-apis-in-amazon-api-gateway/), and because CloudFormation didn't have support for websockets at the time of the initial release, we've created an [external plugin](https://github.com/serverless/serverless-websockets-plugin) that lets you integrate websockets into you Serverless Framework projects.

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

And that's pretty much all you need to do to get started with websockets events. For more information, [please checkout our docs](THIS LINK SHOULD BE UPDATED ONCE DOCS ARE RELEASED)


### Other features of v1.38.0 (THIS SECTION NEEDS TO BE UPDATED)

Other than Websockets support, we added a lot of enhancements and bug fixes in this release. 10 bug fixes and 14 enhancements to be exact. Plus, a few updates to our docs!

#### Bug Fixes
- [#5839](https://github.com/serverless/serverless/pull/5839) Fix service name in template install message<a href="https://github.com/serverless/serverless/pull/4888/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+4</span>/<span style="color:#cb2431">-4</span></a> <a href="https://github.com/eeg3"> <img src='https://avatars2.githubusercontent.com/u/1928361?v=4' style="vertical-align: middle" alt='' height="20px"> eeg3</a>
- [#5710](https://github.com/serverless/serverless/pull/5710) Fix #5664 - Rollback fails due to a timestamp parsing error<a href="https://github.com/serverless/serverless/pull/5710/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+53</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/luanmuniz"> <img src='https://avatars0.githubusercontent.com/u/3428149?v=4' style="vertical-align: middle" alt='' height="20px"> luanmuniz</a>
- [#5714](https://github.com/serverless/serverless/pull/5714) AWS: Tell S3 bucket name and how to recover if deployment bucket does not exist<a href="https://github.com/serverless/serverless/pull/5714/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+28</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/exoego"> <img src='https://avatars2.githubusercontent.com/u/127635?v=4' style="vertical-align: middle" alt='' height="20px"> exoego</a>
- [#5728](https://github.com/serverless/serverless/pull/5728) Do not print logs if print command is used.<a href="https://github.com/serverless/serverless/pull/5728/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+105</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/exoego"> <img src='https://avatars2.githubusercontent.com/u/127635?v=4' style="vertical-align: middle" alt='' height="20px"> exoego</a>
- [#5739](https://github.com/serverless/serverless/pull/5739) Fix assuming a role with an AWS profile<a href="https://github.com/serverless/serverless/pull/5739/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+88</span>/<span style="color:#cb2431">-19</span></a> <a href="https://github.com/piohhmy"> <img src='https://avatars0.githubusercontent.com/u/1857656?v=4' style="vertical-align: middle" alt='' height="20px"> piohhmy</a>
- [#5744](https://github.com/serverless/serverless/pull/5744) Resolve profile before performing aws-sdk dependent actions<a href="https://github.com/serverless/serverless/pull/5744/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+11</span>/<span style="color:#cb2431">-5</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5760](https://github.com/serverless/serverless/pull/5760) don't check call tty on macs<a href="https://github.com/serverless/serverless/pull/5760/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5763](https://github.com/serverless/serverless/pull/5763) Require provider.credentials vars to be resolved before s3/ssm/cf vars<a href="https://github.com/serverless/serverless/pull/5763/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+45</span>/<span style="color:#cb2431">-4</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5775](https://github.com/serverless/serverless/pull/5775) Preserve whitespaces in single-quote literal fallback<a href="https://github.com/serverless/serverless/pull/5775/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+12</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/exoego"> <img src='https://avatars2.githubusercontent.com/u/127635?v=4' style="vertical-align: middle" alt='' height="20px"> exoego</a>
- [#5785](https://github.com/serverless/serverless/pull/5785) Fixes for AWS cors config issues<a href="https://github.com/serverless/serverless/pull/5785/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+14</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/pchynoweth"> <img src='https://avatars0.githubusercontent.com/u/24738364?v=4' style="vertical-align: middle" alt='' height="20px"> pchynoweth</a>

#### Enhancements
- [#4712](https://github.com/serverless/serverless/pull/4712) Enable tab completion for slss shortcut<a href="https://github.com/serverless/serverless/pull/4712/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+2</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/drexler"> <img src='https://avatars3.githubusercontent.com/u/1205434?v=4' style="vertical-align: middle" alt='' height="20px"> drexler</a>
- [#4794](https://github.com/serverless/serverless/pull/4794) Default to error code if message is non-existent<a href="https://github.com/serverless/serverless/pull/4794/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+77</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/drexler"> <img src='https://avatars3.githubusercontent.com/u/1205434?v=4' style="vertical-align: middle" alt='' height="20px"> drexler</a>
- [#4822](https://github.com/serverless/serverless/pull/4822) Add resource count and warning to info display<a href="https://github.com/serverless/serverless/pull/4822/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+182</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/alexdebrie"> <img src='https://avatars3.githubusercontent.com/u/6509926?v=4' style="vertical-align: middle" alt='' height="20px"> alexdebrie</a>
- [#5139](https://github.com/serverless/serverless/pull/5139) Allows Fn::GetAtt with Lambda DLQ-onError<a href="https://github.com/serverless/serverless/pull/5139/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+59</span>/<span style="color:#cb2431">-10</span></a> <a href="https://github.com/martinjlowm"> <img src='https://avatars0.githubusercontent.com/u/110860?v=4' style="vertical-align: middle" alt='' height="20px"> martinjlowm</a>
- [#5161](https://github.com/serverless/serverless/pull/5161) Updated aws provider to invoke .promise on methods that support it. Otherwise falls back to .send with a callback<a href="https://github.com/serverless/serverless/pull/5161/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+39</span>/<span style="color:#cb2431">-6</span></a> <a href="https://github.com/exocom"> <img src='https://avatars2.githubusercontent.com/u/2851652?v=4' style="vertical-align: middle" alt='' height="20px"> exocom</a>
- [#5311](https://github.com/serverless/serverless/pull/5311) Upgrade google-cloudfunctions to v2 and set defaults to node8 etc<a href="https://github.com/serverless/serverless/pull/5311/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+3</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/bodaz"> <img src='https://avatars0.githubusercontent.com/u/6238558?v=4' style="vertical-align: middle" alt='' height="20px"> bodaz</a>
- [#5495](https://github.com/serverless/serverless/pull/5495) Add uploaded file name to log while AWS deploy<a href="https://github.com/serverless/serverless/pull/5495/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+5</span>/<span style="color:#cb2431">-2</span></a> <a href="https://github.com/Enase"> <img src='https://avatars3.githubusercontent.com/u/2459495?v=4' style="vertical-align: middle" alt='' height="20px"> Enase</a>
- [#5577](https://github.com/serverless/serverless/pull/5577) Add template for provided runtime with the bash sample from AWS<a href="https://github.com/serverless/serverless/pull/5577/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+154</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5636](https://github.com/serverless/serverless/pull/5636) Throw an error if plugin is executed outside of a serverless directory<a href="https://github.com/serverless/serverless/pull/5636/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+48</span>/<span style="color:#cb2431">-45</span></a> <a href="https://github.com/shanehandley"> <img src='https://avatars2.githubusercontent.com/u/1322294?v=4' style="vertical-align: middle" alt='' height="20px"> shanehandley</a>
- [#5656](https://github.com/serverless/serverless/pull/5656) handle layers paths with trailing slash and leading ./ or just .<a href="https://github.com/serverless/serverless/pull/5656/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+56</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>
- [#5705](https://github.com/serverless/serverless/pull/5705) Convert reservedConcurrency to integer to allow use env var<a href="https://github.com/serverless/serverless/pull/5705/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+6</span>/<span style="color:#cb2431">-3</span></a> <a href="https://github.com/snurmine"> <img src='https://avatars0.githubusercontent.com/u/16050765?v=4' style="vertical-align: middle" alt='' height="20px"> snurmine</a>
- [#5740](https://github.com/serverless/serverless/pull/5740) Provide multi origin cors values<a href="https://github.com/serverless/serverless/pull/5740/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+85</span>/<span style="color:#cb2431">-11</span></a> <a href="https://github.com/richarddd"> <img src='https://avatars2.githubusercontent.com/u/1422927?v=4' style="vertical-align: middle" alt='' height="20px"> richarddd</a>
- [#5754](https://github.com/serverless/serverless/pull/5754) Add Hello World Ruby Example<a href="https://github.com/serverless/serverless/pull/5754/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+63</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/yuki3738"> <img src='https://avatars3.githubusercontent.com/u/6305192?v=4' style="vertical-align: middle" alt='' height="20px"> yuki3738</a>
- [#5758](https://github.com/serverless/serverless/pull/5758) AWS: Add fallback support in ${cf} and ${s3}<a href="https://github.com/serverless/serverless/pull/5758/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+137</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/exoego"> <img src='https://avatars2.githubusercontent.com/u/127635?v=4' style="vertical-align: middle" alt='' height="20px"> exoego</a>

#### Documentation
- [#5731](https://github.com/serverless/serverless/pull/5731) Fix link<a href="https://github.com/serverless/serverless/pull/5731/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+7</span>/<span style="color:#cb2431">-7</span></a> <a href="https://github.com/kazufumi-nishida-www"> <img src='https://avatars0.githubusercontent.com/u/40748597?v=4' style="vertical-align: middle" alt='' height="20px"> kazufumi-nishida-www</a>
- [#5751](https://github.com/serverless/serverless/pull/5751) Fix typo in Multiple Configuration Files example<a href="https://github.com/serverless/serverless/pull/5751/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+1</span>/<span style="color:#cb2431">-1</span></a> <a href="https://github.com/paflopes"> <img src='https://avatars0.githubusercontent.com/u/5330156?v=4' style="vertical-align: middle" alt='' height="20px"> paflopes</a>
- [#5788](https://github.com/serverless/serverless/pull/5788) Document how to use Secrets Manager<a href="https://github.com/serverless/serverless/pull/5788/files?utf8=✓&diff=split" style="text-decoration:none;"> <span style="color:#28a647">+18</span>/<span style="color:#cb2431">-0</span></a> <a href="https://github.com/dschep"> <img src='https://avatars0.githubusercontent.com/u/667763?v=4' style="vertical-align: middle" alt='' height="20px"> dschep</a>

#### Roadmap and focus

The next release plans to maintain our cadence and keep tackling our issue and PR backlog.

#### Contributor thanks

We had more than 20 contributors have their work go into this release and we can't thank each of them enough. You all make the community special.

Want to have your github avatar and name in the next release post? Check out these [issues we are looking for help on](https://github.com/serverless/serverless/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22)!

