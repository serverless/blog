---
title: Serverless Auth with AWS HTTP APIs
description: "Learn how to create an AWS HTTP API and set it up with a Cognito Authorizer."
date: 2020-02-27
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/serverless-http-api-auth-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/serverless-http-api-auth-hero.png"
authors:
  - FernandoMedinaCorey
category:
  - guides-and-tutorials
---

## New AWS HTTP APIs

Earlier this week, [we announced](http://serverless.com/blog/aws-http-api-support) support for AWS HTTP APIs and talked a bit about what is possible with them. If you'd like to learn more about the AWS HTTP API and the new event source we've added integrate with it check that post out. 

In this post, however we'll jump in to using the new AWS HTTP APIs with one of the new features they offer - the JSON Web Token integration. I'll show you how to use Amazon Cognito to add authentication and authorization to your AWS HTTP API endpoints. 

You can choose to follow along with examples in either Node.js or Python and towards the end, I'll show how you could modify the examples in order to work with a tool like Auth0 or Okta instead of Amazon Cognito.

Let's get started!

## Setup

In this guide, we will create an Amazon Cognito User Pool, App Client, and Domain all from scratch in the `resources` section of `serverless.yml`. You can choose to use either the Node.js or the Python version of the code. Run one of the following commands to get started:

- For Node.js - `git clone https://github.com/fernando-mc/aws-http-api-node-cognito.git`
- For Python - `git clone https://github.com/fernando-mc/aws-http-api-python-cognito.git`

After you have the code, make sure you've also [installed the Serverless Framework](https://serverless.com/framework/docs/getting-started/), setup and configured the [AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html), and (optionally) created a [Framework Pro](https://app.serverless.com/) account.

## Deploying the Project

With the repository cloned, change directories into the repository and make sure you're on the same level as the `serverless.yml` file. Then you can make a few changes to the demo code:

1. Either configure your own `org` and `app` name with [Framework Pro](https://app.serverless.com/) or remove the `org` and `app` from the top of `serverless.yml`.
2. Update the `DOMAIN_SUFFIX` value in the provider environment section to something unique. I recommend you use something like your name and favorite mythical animal. 
3. After that, save the file and run `serverless deploy`.

This should deploy all the Amazon Cognito resources required as well as all the parts of our new HTTP API.

After the deployment completes, you should see two API endpoints in the output:

```yaml
endpoints:
  GET - https://yea4h11vtb.execute-api.us-east-1.amazonaws.com/user/profile
  POST - https://yea4h11vtb.execute-api.us-east-1.amazonaws.com/user/profile
functions:
  getProfileInfo: http-api-node-dev-getProfileInfo
  createProfileInfo: http-api-node-dev-createProfileInfo
layers:
  None
```

Copy your endpoints down and then try using the GET endpoint by pasting it into your browser or a tool like Postman. You should see this result:

`{"message":"Unauthorized"}`

Similarly, if you try to send JSON data to the POST endpoint you should see the same result.

This means these endpoints are protected and will only work with a valid JSON Web Token! In order to get this, we'll need to generate one using the Cognito User Pool Hosted UI.

Log into the AWS Console and navigate to the [Cognito section](https://console.aws.amazon.com/cognito/home?region=us-east-1#) of the dashboard. Make sure you're in the same region you deployed your service to and click Manage User Pools:

![Image of the Amazon Cognito Dashboard entry page](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/main-cognito-page.png)

From there, click on the user pool you created:

![Image of the Amazon Cognito User Pools](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/user-pools.png)

And then navigate to the "App Client Settings" page:

![The Cognito App Client Settings](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/app-client-settings.png)

And then scroll down to find the "Launch Hosted UI" button.

![The Hosted UI Button](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/hosted-ui.png)

Then sign up for your own account on the hosted UI

![The Hosted UI Sign Up Modal](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/sign-up.png)

After you sign up, you should be redirected to a non-available localhost page. Copy the URL out of your browser. It should look something like this:

```
https://localhost:3000/#id_token=eyJraWQiOiJzR1c3aDZvcis5VDIrVnlxWU53NVBrbVhJdnFEWFVISVJpcmRBY1R5R3VvPSIsImFsZyI6IlJTMjU2In0.eyJhdF9oYXNoIjoiT1l2bTNlcFdpUHc3S0szXzZRenJ4USIsInN1YiI6IjM3MzMyNTZmLWVmZTgtNDJhMC1iZmE3LWFiMmY1MzAzNDAzMSIsImF1ZCI6IjJ2aTUybnFwdjA1cWpxZnZuOXU4Z2htOWY4IiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImV2ZW50X2lkIjoiZWNiMzhlNDItYWEwYy00ZDVmLWJlNjItY2Y1MDRkNWY5MTIzIiwidG9rZW5fdXNlIjoiaWQiLCJhdXRoX3RpbWUiOjE1ODI2NzkwOTUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0FaQ084elZJWCIsImNvZ25pdG86dXNlcm5hbWUiOiIzNzMzMjU2Zi1lZmU4LTQyYTAtYmZhNy1hYjJmNTMwMzQwMzEiLCJleHAiOjE1ODI2ODI2OTUsImlhdCI6MTU4MjY3OTA5NSwiZW1haWwiOiJmZXJuYW5kb0BzZXJ2ZXJsZXNzLmNvbSJ9.4ezu7ArGG3wpq7uBlh6L_GQMGHy5IoTZxD5H-ixOaA2pgL3AeRaz7aF7ZfOmJ6hV22D0AgdwA8k7VxiIXWWs79FddCEV8jlNkg6nVcH5711kVgDG3Rm9TjzTJgD343hIW7NGANlczZwm96yvamwkf7sad05kAjrhRTt3NaskWAMbfbS4PZwkQ1kaC47kSUISP6f7-Ol2iY3LM-1MjYTTlk27y5rmZiSWKIuCUK_-qBnvqEpL5qiqBZhqJY7rEaKzA7wcjd9lFpHjdKdr9jNpLeLxFVgGuG9qemBm_xQAYA71wEAXKRW4YZ542_MQyRZOj3w7TF5JhnRZw_Bj4nSkqw&access_token=eyJraWQiOiJiOUNUNHJydmxvcW8wSTBjM05DTEExaGxSbkJUNStOYjdtUHhrOVlNbTRRPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiIzNzMzMjU2Zi1lZmU4LTQyYTAtYmZhNy1hYjJmNTMwMzQwMzEiLCJldmVudF9pZCI6ImVjYjM4ZTQyLWFhMGMtNGQ1Zi1iZTYyLWNmNTA0ZDVmOTEyMyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4gcGhvbmUgb3BlbmlkIHByb2ZpbGUgZW1haWwiLCJhdXRoX3RpbWUiOjE1ODI2NzkwOTUsImlzcyI6Imh0dHBzOlwvXC9jb2duaXRvLWlkcC51cy1lYXN0LTEuYW1hem9uYXdzLmNvbVwvdXMtZWFzdC0xX0FaQ084elZJWCIsImV4cCI6MTU4MjY4MjY5NSwiaWF0IjoxNTgyNjc5MDk1LCJ2ZXJzaW9uIjoyLCJqdGkiOiI5ODZlNzJkYi01ZmQyLTQxNjMtYjVhYS1mN2QzNWIxNzBhOWUiLCJjbGllbnRfaWQiOiIydmk1Mm5xcHYwNXFqcWZ2bjl1OGdobTlmOCIsInVzZXJuYW1lIjoiMzczMzI1NmYtZWZlOC00MmEwLWJmYTctYWIyZjUzMDM0MDMxIn0.XthMHJwEi9Q6S9CI-JEA3NOrCL_pVoe3p5UUHgyLy0ABRkUc55CK9l8aIHrYaOxYp_xMOwkugtLGRF7wlW7mZ2-zhJW1okxblvGajZHi0M0rqjmE1GRygOyeT__RdYbsyq0H-KuE-j4Aa50W7BBvgnvRyzSlE7tP0a7hZtknIZaxmKfqLmPjQRvd965wkxJUqXlBJkjYF4uHor2GalTjzsR4vqm8rPoMfTcOhRRiBE8THp83Z7_eA8KH0DcGTdcFSkmH4Mrjrbu7zO3MMM36PsrRQ5tKo-nVdOAsPS5td1pTqouKhBM4jC5dQqgIivZIldnXBMHsjb2aUxerRxo9Og&expires_in=3600&token_type=Bearer
```

That URL contains two JSON web tokens, an `id_token` and an `access_token`. They each serve different purposes, but either can be used in this case to verify against the API. 

Grab the `id_token` by copying everything after the `id_token=` and before the `&access_token`. You can inspect the JSON web token on a site like [jwt.io](https://jwt.io/). Just paste the token in the debugger as shown below:

![Decoding the JWT in jwt.io](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/jwt-io.png)

From here, you can open up something like Postman and set the Authorization section of the request as shown below before testing the GET endpoint:

![Postman example sending a request with authorization](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-27-aws-http-api-guide/postman-get.png)

You'll need to select the Type of Bearer Token and paste your token into the text box. Keep in mind that you'll need to copy it exactly! You can't have extra spaces, new lines, or a trailing `&` character that you might have copied accidentally.

It should return a nice juicy response containing all the fun information you might want about the token's owner in the `message.requestContext.authorizer.claims`. 

**Importantly** if you try again with the `access_token` you'll get a different set of information in the response. These two tokens are designed for different purposes and as such they contain different sets of information.

## Cognito Alternatives

I included Cognito in this service to make it easier to demonstrate without including third party services. However, you could also easily replace Cognito with something like Auth0 by removing the `resources` section from `serverless.yml` and then replacing the values in the `provider` section under the `httpApi` and `authorizers`. 

The updated `httpAPi` section would look something like this:

```yaml
  httpApi:
    authorizers:
      serviceAuthorizer:
        identitySource: $request.header.Authorization
        issuerUrl: https://YOUR_AUTH0_DOMAIN.auth0.com
        audience: YOUR_API_ID
```

This JWT integration simply requires that you send either an `id_token` or `access_token` in via the `Authorization` header with the value of `Bearer <token>`. AWS will then take care of validating the token against the provided `issuerUrl` and `audience`.

Here are two examples that have a more simplistic configuration like this:

1. [HTTP API with Node.js](https://github.com/fernando-mc/simple-aws-http-api-jwt-node.git)
2. [HTTP API with Python](https://github.com/fernando-mc/simple-aws-http-api-jwt-python.git) 

Simply clone either repository and follow most of the same steps shown in the earlier section. You'll be able to skip setting the `DOMAIN_SUFFIX` environment variable as you'll already have configured and created your own resources to replace the User Pool Domain.

You will also need to figure out how to generate the `id_token` or `access_token` on your own using the other provider in order to test the integration.

## Now What?

Congratulations! At this point, you deployed and tested your AWS HTTP API and it's ability to authenticate users who want to access an endpoint! 

In the future, you may want to learn how to manage scopes and permissions with the `access_token`. But for now, you can start to use this new tool to shave hundreds of lines of JWT verification code out of your AWS HTTP API projects! 

You can also start to evaluate the limitations of the AWS HTTP API to see if it is ready to support your existing API Gateway workloads.

Have questions about the guide? [Get in touch](https://twitter.com/fmc_sea) or leave a comment below!
