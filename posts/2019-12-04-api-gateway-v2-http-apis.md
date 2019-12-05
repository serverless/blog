---
title: "re:Invent 2019 - AWS API Gateway v2 for HTTP"
description: "AWS just announced support for HTTP APIs in AWS API Gateway v2."
date: 2019-12-04
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-12-http-v2-api-gateway/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-12-http-v2-api-gateway/header.png"
category:
  - news
authors:
  - FernandoMedinaCorey
---

AWS just announced support for HTTP APIs using API Gateway v2. While API Gateway v2 has technically been around for a little while, until today we've only been able to use it create Websocket APIs. Included in this announcement are a variety of new features and performance improvements over the existing HTTP Gateway functionality. Let's take a look at some of the details.

#### What Are the Changes in V2?

##### Price Changes

First up, there are some very impressive pricing and performance numbers coming in with this new release. Off the top, AWS says that the general cost of using v2 will be 70% cheaper and have 50% lower latency than v1. 

Because current pricing for v1 is about $3.50 per million requests it seems v2 should be about $1 per million requests, a pretty substantial change. That means that API Gateway, previously one of the larger cost sticking points for serverless applications just got a serious upgrade in how likely people are to be able to adopt it cost-effectively.

##### Resource Changes

In addition to the general performance improvements, it looks like the sheer number of AWS resources that you need for an API is changing dramatically. 

**The Single-Resource API**

API Gateway V1 is notoriously verbose for the number of resources you need to correctly configure even a simple HTTP API and apparently AWS knows it. In v2, you have the option to create a simple, single-resource API endpoint with minimal configuration. 

This single-resource API can route all requests in and pass them along to a backend to handle itself. This sort of feature seems to indicate that AWS wants to make it easier to enable different **kinds** of serverless architectures beyond the microservice-style approach. The change opens up more use cases like Express.js, Flask, and other similar frameworks and tools that may prefer to setup routes themselves in the application code and not in the API Gateway configuration.

**Other HTTP APIs**

While this single-resource option exists, you do also still have the option to dive into new AWS Resources within v2 to setup configuration for things like JWT authorizers, API stages, and Open API (formerly known as Swagger) specifications for more complex APIs.

##### Authorizers and JWT Configuration

Yes, I just said JWT authorizers in more custom v2 APIs! When adding authentication to APIs created with API Gateway v1 you have a few different options ranging from API Keys to configuring things like Lambda authorizers. With v2, HTTP APIs should have some direct support for JSON Web Tokens (JWTs). If you're familiar with JWTs, they are essentially encoded tokens with scope metadata that are signed cryptographically to verify and authenticate a user and the scope of access they should be granted. They're typically generated through a client-side process that is then verified by the backend of your service.

With HTTP APIs through API Gateway v1 there was support for this through AWS Lambda Authorizers which took that incoming JWT, manually decoded it with a JWT library, verified it with the JWT provider and then passed through the Lambda Function ARN that the requesting function could then pass the request to.

Now, at first glance, it looks with v2 we'll have the ability to use some AWS configuration to handle parts of this process for us without having to write these custom authorizers. AWS will then return the scopes to our application for us to determine how to allow the user to act. This means we don't have to write all the custom code in our Lambda authorizers ourselves!

##### Cross-Origin Resource Sharing (CORS)

One of the other features added in API Gateway V2 is more support for HTTP APIs returning CORS headers. This is essential when returning data in order to enable the requests to be returned to frontend applications on domains that don't share a domain name. 

What this new feature appears poised to do is to allow us to stop writing things like this in or Lambda functions:

```javascript
const response = {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true,
    },
    body: JSON.stringify({ message: 'form submission received' }),
}
```

And instead just return the body and have the Access-Control-Allow-Origin header taken care of for us for example.

#### What Do the Changes Mean?

AWS is investing heavily into enabling serverless applications that leverage API Gateway by making it cheaper, more performant, enabling more use cases, and reducing the amount of code we have to write to get common use cases taken care. What do you think of the announcement? Are there use cases that you see being enabled from it? [Let us know](https://twitter.com/goserverless) or [give me your thoughts directly](https://twitter.com/fmc_sea)!