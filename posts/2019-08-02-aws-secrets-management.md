---
title: "Secrets Management for AWS Powered Serverless Applications"
description: "Storing application secrets in serverless applications is a hot topic that provokes many (often contradictory) opinions on how to manage them right."
date: 2019-08-02
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/secrets-management/thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/secrets-management/header.png'
category:
  - guides-and-tutorials
authors: 
  - GarethMcCumskey
---

Question: What’s the right way to manage secrets in serverless applications?

The crowd answers:
Secrets belong in environment variables! 
Secrets don’t belong in environment variables!
Secrets belong in parameter stores! 
That’s not what parameter stores are for!
Vault! AWS KMS! SSM!

Storing application secrets in serverless applications is a hot topic that provokes many (often contradictory) opinions on how to manage them right. By “secrets management” we mean the entire secrets lifecycle: from configuring, storing and accessing them to rotating them and enforcing secrets policies. Typical ways to configure secrets include hard-coding them in your application (not recommended!), using dedicated secrets files, storing them in environment variables, and using secrets stores like HashiCorp’s [Vault](https://www.vaultproject.io/).

If you’re running Serverless applications, most likely you are already using secrets to store data like database connection strings and API tokens for third party services, or you will start needing to use them soon. We want to help you make an informed choice about how to store and access your secrets with the Serverless Framework.

In this article we explore three approaches to secrets management for Serverless applications: using environment variables, using the AWS SSM parameter store, and using the Serverless Framework’s secrets management features, and we discuss the benefits and drawbacks of each option. Using code, we show you in detail what each approach looks like, allowing you to choose your favourite way to manage Serverless secrets.

Let’s dive right in.

#### Three ways to manage secrets for Serverless Framework applications

To illustrate each approach to secrets management in Serverless applications, we’re using [this sample](https://github.com/chief-wizard/serverless-secrets-management-weather-apis) [weather forecast](https://github.com/chief-wizard/serverless-secrets-management-weather-apis) [API](https://github.com/chief-wizard/serverless-secrets-management-weather-apis) [on GitHub](https://github.com/chief-wizard/serverless-secrets-management-weather-apis). It’s a simple Serverless API that gets a weather forecast for a given location from three different weather service providers:

```
    https://{our-endpoint-url}/{weather-provider-name}/{latitude}/{longitude}
```

We used [Dark](https://darksky.net/dev) [](https://darksky.net/dev)[Sky](https://darksky.net/dev), [OpenWeatherMap](https://openweathermap.org/), and the [HERE Destination Weather API](https://developer.here.com/documentation/weather/common/request-cit-environment-rest.html).
For each provider we’ve chosen a different way to store API secrets. Of course, you would rarely need to do anything like this in a real-life project, but this is a convenient way to illustrate the differences between the secrets management approaches.

To set the stage, let’s take a look at the overall structure of the project, and then we’ll dive into the implementation for each provider.

#### Overall structure of the project

We begin our [w](https://github.com/chief-wizard/serverless-secrets-management-weather-apis)[eather API example](https://github.com/chief-wizard/serverless-secrets-management-weather-apis) with a service definition in the [serverless.yml](https://github.com/chief-wizard/serverless-secrets-management-weather-apis/blob/master/serverless.yml) file. In the `provider` section, we specify that we want to use AWS in the `us-east-1` region, that our environment is Node.js, and that we require the Serverless Framework version to be newer than `1.43.0` (we cover the version part later).

We used the `serverless-offline` plugin for local testing, but this is optional.

```yml
    service: weather-forecast
    
    provider:
      name: aws
      runtime: nodejs8.10
      region: 'us-east-1'
      frameworkVersion: ">=1.43.0"
    
    plugins:
      - serverless-offline
```
The most interesting part of `serverless.yml` is the [functions section](https://github.com/chief-wizard/serverless-secrets-management-weather-apis/blob/master/serverless.yml#L17-L48) where we define our API handlers. We define one handler per provider, define the HTTP route for each handler, and add any secrets needed to get that provider working.

```yml
    functions:
      darksky:
        handler: handler.darksky
        environment: 
          DARKSKY_URL: 'https://api.darksky.net/forecast'
          DARKSKY_APIKEY: ${ssm:/darksky-api-key~true}
        events:
          - http:
              path: /darksky/{latitude}/{longitude}
              method: get
    ...
```
We go into more detail on each specific provider later in this article.
For more info on the `serverless.yml` format, please see the relevant [Serverless documentation](https://serverless.com/framework/docs/providers/aws/guide/intro/).

Our `handler.js` [file](https://github.com/chief-wizard/serverless-secrets-management-weather-apis/blob/master/handler.js) is quite simple, making reference to individual provider files:

```javascript
    exports.darksky = require("./external-api/darksky").darksky;
    exports.openweathermap = require("./external-api/openweathermap").openweathermap;
    exports.dest = require("./external-api/dest").dest;
```
The individual provider code is in the [external-api subdirectory](https://github.com/chief-wizard/serverless-secrets-management-weather-apis/tree/master/external-api).

Now that the structure is covered, let’s take a look at how we can implement secrets access for each of the weather API providers.

#### Approach #1: AWS SSM parameters

[AWS Systems Manager](https://aws.amazon.com/systems-manager/) is a simple configuration management solution that integrates with many AWS services. Parameter Store is the part of this solution most relevant here. It allows us to store plain-text and encrypted string parameters that can be accessed easily during run time.

Serverless Framework provides easy-to-use [integration](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store) with AWS SSM Parameter Store. We used this approach with the Dark Sky weather API.

To add a new secret in the AWS Systems Manager user interface, we specify the Secure String type and use the default KMS key to encrypt it.

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/secrets-management/s_468DC5A00535E640D1CD6F860B59D7ED1FD419F7F68475C6951254F0A0DFD405_1563915821845_20190723172855mbk6sxe5l8.png)


In our `serverless.yml` we [reference](https://github.com/chief-wizard/serverless-secrets-management-weather-apis/blob/master/serverless.yml#L23) our DarkSky API key via the `ssm:/` notation. Now that our key is encrypted in the Parameter Store, we add `~true` to the end of the key reference. This way, the Serverless Framework fetches the parameter from SSM, decrypts it, and places the decrypted value into an environment variable for us to use:

```yml
    functions:
      darksky:
        handler: handler.darksky
        environment: 
          DARKSKY_URL: 'https://api.darksky.net/forecast'
          DARKSKY_APIKEY: ${ssm:/darksky-api-key~true}
```
The provider code reads the API key from the environment variable and uses it directly; in a deployed function it will contain the decrypted value of the API key:

```javascript
    var apiUrl = process.env.DARKSKY_URL;
    var apiKey = process.env.DARKSKY_APIKEY;
```
We then use the token to fetch the weather data from the provider:

```javascript
    var callExternalApi = async function (latitude, longitude) {
        try {
            var response = await fetch(`${apiUrl}/${apiKey}/${latitude},${longitude}`);
            var json = await response.json();
    
            var body = { temperature: json.currently.temperature }
    
            var response = {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            };
            return response;
        } catch (error) {
            console.log(error);
        }
    }
```
The main benefits of this approach are that it’s secure but simple to implement, with built-in syntax for decryption in `serverless.yml`.

As far as downsides go, when using this option your team needs to have their AWS credentials handy and configured on their local machine whenever they deploy the Serverless function. You can lessen the negative impact of this by issuing your team members with AWS accounts whose permissions are configured to only give them access to the resources they need when deploying a new function.

Another downside here is that configuring encryption keys for your secrets separately from the secrets themselves can be error-prone if more than one encryption key is involved.

#### Approach #2: AWS Secrets Manager

For our second provider, we use [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/) to store the [OpenWeatherMap](https://openweathermap.org/) credentials. AWS Secrets Manager offers functionality that is more secrets-specific, such as audit logs and automated key rotation under certain conditions.

To add a new secret in AWS Secrets Manager we click the "Store New Secret" button in the Secrets Manager UI and set the secret type to "Other". Make sure you’re adding an encrypted secret rather than a plain-text field.


![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/secrets-management/s_468DC5A00535E640D1CD6F860B59D7ED1FD419F7F68475C6951254F0A0DFD405_1563915841147_20190723222746ja8eypdldo.png)


The AWS SSM system we covered in approach #1 would also allow us to access AWS Secrets Manager secrets [via the same SSM syntax](https://serverless.com/framework/docs/providers/aws/guide/variables#reference-variables-using-aws-secrets-manager). While this would be convenient, it has the same drawback as the previous solution: you need to redeploy the function for a change in secrets to take effect.

Instead of using the SSM syntax, this time we fetch the secret directly using the AWS API. This way, if we decide to change the secret’s value in AWS Secrets Manager, we won’t need to redeploy the function, and the function will read the updated value next time it is invoked. Let’s take a look at how this is implemented.

The function definition in the `serverless.yml` file is very similar to the previous solution, except for the environment variables:

```yml
      openweathermap:
        handler: handler.openweathermap
        environment: 
          OPENWEATHERMAP_URL: 'https://samples.openweathermap.org/data/2.5/weather'
          OPENWEATHERMAP_APPID: 'openweathermap-appid'
```
The OpenWeatherMap handler looks slightly more complicated than the previous solution, mostly because now we’re fetching the secrets via the AWS SDK. We start by defining all the variables we will need:

```javascript
    var AWS = require('aws-sdk'),
        region = process.env.AWS_REGION_ENV,
        secretName = process.env.OPENWEATHERMAP_APPID_LOCATION,
        accessKeyId = process.env.ACCESS_KEY_ID,
        secretAccessKey = process.env.SECRET_ACCESS_KEY,
        decodedBinarySecret;
    
    var client = new AWS.SecretsManager({
        region,
        accessKeyId,
        secretAccessKey
    });
```
The `decodedBinarySecret` variable will contain the decrypted secret in the next section, where we fetch the secret’s value via the AWS SDK:

```javascript
    exports.openweathermap = async (event, context, callback) => {
        await new Promise((resolve, reject) => {
            client.getSecretValue({ SecretId: secretName }, function (err, data) {
                if (err) {
                    console.log(err);
                    reject()
                }
                else {
                    if ('SecretString' in data) {
                        decodedBinarySecret = JSON.parse(data.SecretString)[secretName];
                    } else {
                        let buff = new Buffer(data.SecretBinary, 'base64');
                        decodedBinarySecret = buff.toString('ascii');
                    }
                    resolve()
                }
            });
        });
        return callExternalApi(event.pathParameters.latitude, event.pathParameters.longitude);
    }
```
Finally, we use the decoded secret to make an API call to the weather provider:

```javascript
    var callExternalApi = async function (latitude, longitude) {
        var apiUrl = process.env.OPENWEATHERMAP_URL;
        var appid = decodedBinarySecret
    
        try {
            var response = await fetch(`${apiUrl}/?lat=${latitude}&lon=${longitude}&appid=${appid}`);
            var json = await response.json();
    
            var body = { temperature: json.main.temp }
    
            var response = {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            };
            return response
        } catch (error) {
            console.log(error);
        }
    }
```
The main benefit of this approach is that the secrets are fetched dynamically. The fact that we are using the Secrets Manager directly also means that we can take advantage of features like automated key rotation.

On the other hand, this means more code on the application side for making calls to the Secrets Manager. In addition, now that we are fetching the secret dynamically, we need to perform an API call each time the function is invoked. This adds to the function run time and to the cost — AWS charges us for each secret that we store as well as for each API call to retrieve it in the function. If we are talking about tens of thousands of function calls per day, the cost can add up quickly.

Another downside to this option is that your team still need access to production AWS credentials in order to deploy the function.

#### Approach #3: Serverless Framework secrets

An alternative to the AWS SSM and Secrets Manager is the recently announced [secrets functionality](https://serverless.com/blog/serverless-now-full-lifecycle/) in the Serverless Framework. For API provider number three, the HERE Destination Weather API, we chose this approach.

After logging into the [Serverless Dashboard](https://dashboard.serverless.com/), we add the secret we want to store under the Secrets tab in the Profile section. (You’ll need to create a new profile if you don’t have one yet.)


![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/secrets-management/s_468DC5A00535E640D1CD6F860B59D7ED1FD419F7F68475C6951254F0A0DFD405_1563915863024_2019072322322346rlfjtpe3.png)


Next, we add a new secret and save it. Once we add the secrets in the Serverless Dashboard, they become available to functions we deploy from any machine where we’re logged into our Serverless account using the `sls login` command. The secrets are decrypted at deploy time.

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/secrets-management/s_468DC5A00535E640D1CD6F860B59D7ED1FD419F7F68475C6951254F0A0DFD405_1563915896609_20190723223247lvbtyh3g7d.png)


In the `serverless.yml` file we reference the secret stored in the Serverless Dashboard using the `${secrets:<secret-name>}` syntax:

```yml
      dest:
        handler: handler.dest
        environment: 
          DEST_URL: 'https://weather.cit.api.here.com/weather/1.0/report.json'
          DEST_APP_ID: ${file(./secrets.json):DestApiId}
          DEST_APP_CODE: ${secrets:dest-app-code}
```
[The Serverless Framework docs](https://serverless.com/framework/docs/dashboard/secrets/) offer more details about this syntax.

This solution’s handler is very simple, as the Serverless Framework takes care of fetching the secret and decrypting it for us:

```javascript
    const fetch = require("node-fetch");
    exports.dest = async (event, context, callback) => {
        return callExternalApi(event.pathParameters.latitude, event.pathParameters.longitude);
    }
    
    var callExternalApi = async function (latitude, longitude) {
        var appCode = process.env.DEST_APP_CODE
        var apiUrl = process.env.DEST_URL
        var apiId = process.env.DEST_APP_ID
    
        try {
            var response = await fetch(`${apiUrl}?product=observation&latitude=${latitude}&longitude=${longitude}&app_id=${apiId}&app_code=${appCode}`);
            var json = await response.json();
    
            var body = { temperature: json.observations.location[0].observation[0].temperature }
    
            var response = {
                statusCode: 200,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            };
            return response;
        } catch (error) {
            console.log(error);
        }
    }
```
The framework obviates any code required to use the AWS SDK, and there’s no need to configure granular AWS permissions or manage API keys. Serverless Framework will generate a pair of single-use credentials for each deploy to AWS, so your teammates won’t need direct AWS API access in order to deploy. The simplicity of these access controls and of the secrets system itself is the biggest benefit of this option.

However, if you want to store secrets that are not simple strings, or if you are looking to encrypt entire files, please note that Serverless Framework has not yet implemented that functionality for secrets.

#### Three tips for secrets management with Serverless

Regardless of the toolset you choose to manage secrets with Serverless applications, here are three principles that will help you keep your secrets safe.

##### Always use encryption

Make sure that your secrets are stored encrypted. Only decrypt the secrets where you need to use them, and don’t store the secret values in plain text, even on ephemeral machines or containers. While AWS services do allow you to store secrets in plain text, we strongly encourage you always to use encrypted options. Serverless Framework’s own secrets functionality allows only encrypted secrets.

##### Restrict access to secrets, but don’t inconvenience developers

We believe it’s important to keep the number of people who have direct access to your production secrets as small as possible. But sometimes companies go overboard creating security hurdles that end up impeding developers while they try to debug a production issue or address a security incident. We recommend striking a healthy balance between secure access settings and developer convenience — for example, by having one or two people on each team with access to production secrets and by creating team-specific namespaces in your secrets stores so that everyone has access only to the secrets they need.

##### Rotate secrets often

Regular secrets rotation is important for two reasons. First, it limits the exposure of a given leaked secret, as it will become invalid as soon as a new secret is in place. Second, it forces you to update your secrets management tooling to enable regular secrets rotation. 

Manual redeployment of all services will no longer cut it when you need to do it all over again every month. We recommend setting up a consistent secrets rotation plan and automating it as much as possible.

##### Summary

In this article, we walked through three secure and easy ways of implementing secrets access and management for Serverless applications. All three ways have benefits and drawbacks, and we encourage you to evaluate all the ways we’ve suggested. Pick the solution that’s right for your team.

You can find the example project we use in [this article](https://github.com/chief-wizard/serverless-secrets-management-weather-apis): please open an issue in the repository (or submit a pull request) if you have any suggestions on how to make the example better.

You can find the docs for the solutions we used here:

- AWS SSM Parameter Store - [AWS docs](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html), [Serverless docs](https://serverless.com/framework/docs/providers/aws/guide/variables#reference-variables-using-the-ssm-parameter-store).
- AWS Secrets Manager - [AWS docs](https://docs.aws.amazon.com/secretsmanager/latest/userguide/intro.html), [Serverless docs](https://serverless.com/framework/docs/providers/aws/guide/variables#reference-variables-using-aws-secrets-manager).
- Serverless Framework secrets - [Serverless docs](https://serverless.com/framework/docs/dashboard/secrets/).

If you’d like to give Serverless Framework a try, have a look at the [getting started guide](https://serverless.com/framework/docs/getting-started/).
