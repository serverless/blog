---
title: The Ultimate Guide to AWS HTTP APIs
description: "There's a lot to learn about the new AWS HTTP APIs and the Serverless Framework so let's bring it all together in one place."
date: 2020-03-13
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-03-13-ultimate-guide-http-apis/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-03-13-ultimate-guide-http-apis/header.png"
authors:
  - FernandoMedinaCorey
category:
  - guides-and-tutorials
  - news
---

# AWS HTTP APIs

We've already discussed AWS HTTP APIs in the past few weeks, but there's a lot to learn. So we decided to do two things. 

First, we're working on "The Ultimate Guide to AWS HTTP APIs" - a comprehensive guide that we will keep updated with all the latest best practices and how to use it with the Serverless Framework. This guide will follow the same format as our existing guides like the ones on the [API Gateway](https://serverless.com/amazon-api-gateway/), [DynamoDB](https://serverless.com/dynamodb/), and [Lambda](https://serverless.com/aws-lambda/).

As we develop it, we want to hear from you! What examples and use cases do you want us to include? What remaining questions do you have for us given our previews guides and integration with the AWS HTTP APIs? What do you want to see us change? Let us know in the comments below! As soon as we launch, we'll update this post and send another announcement out on the blog.

Second, we're putting together all the latest news we know so far into this blog post. We'll review improvements, changes, and the current limitations of the new HTTP APIs. We'll also provide our most recent examples and tutorials on using some of the new features and workarounds for some of the present limitations. 

As things change, keep an eye out for the upcoming guide where we'll keep you appraised of the latest. But for now, let's look at all the latest news on the HTTP API.

# The New and Improved

There are some notable improvements when using the new HTTP APIs. Here's a quick bullet-point summary as I go into more detail below.

- A [cost reduction of ~71%](https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/) compared to API Gateway REST APIs.
- A [reduction of latency by 60%](https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/) compared to API Gateway REST APIs - this amounts to ~10ms latency or less added by the HTTP API. 
- A JSON Web Token integration that makes authentication and authorization easy (read about the Serverless Framework's integration for this [here](https://serverless.com/blog/serverless-auth-with-aws-http-apis/))
- Simplified route integrations and auto-deployed stages
- An integration to connect HTTP APIs to resources inside of a VPC
- The ability to add both HTTP APIs and REST APIs to custom domains
- An integration for adding CORS headers across your API
- Lambda payload and response changes

## Cost Reduction

AWS API Gateway, in the days of only REST APIs, [was criticized](https://news.ycombinator.com/item?id=13418332) fairly often for how expensive it was at scale. While it offered a massive set of features, the overall price was pretty steep when you started getting into more significant workloads.

100 Million REST API Gateway requests - $350
100 Million HTTP API Gateway requests - $100

Upfront, that's a 71% decrease for requests in the 100 Million range.

While REST APIs do have slightly better pricing as your usage scales up, the pricing still stalls at a minimum of $1.51/million requests in us-east-1. This means that the HTTP API will always outperform purely from a request-by-request standpoint. Even at volumes over 20 Billion invocations per month it's still roughly a 40% price reduction.

A few additional consideration here:

- REST APIs do have caching options which may complicate pricing calculations depending on the levels of caching used.
- You may use REST APIs and HTTP APIs differently with other services like AWS Lambda and CloudWatch. These usage differences can have implications for your final bill too.

For more details the [API Gateway pricing page](https://aws.amazon.com/api-gateway/pricing/) is updated with the latest.

## Reduction of Latency

Another fairly common criticism of API Gateway REST APIs was the additional latency of adding it to your applications. In the past, I haven't seen this as a large motivating factor for avoiding API Gateway. However, for organizations that run very latency-sensitive applications this may be a huge change. According to metrics recently released by AWS, the total p99 or [99th percentile](https://stackoverflow.com/questions/12808934/what-is-p99-latency) latency added by API Gateway HTTP APIs [is now 10ms total](https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/) - including both the incoming and outgoing request/response processing. 

In the past, API Gateway responses via REST APIs sometimes [added hundreds of milliseconds of latency](https://lumigo.io/blog/tackling-api-gateway-lambda-performance-issues/). Those numbers were gradually improved on but the criticism remained. It's likely that reductions of up to 60% of the API Gateway portion of the latency may be significant enough to draw interest from new latency-sensitive tech sectors.

This means you may see organizations with latency as a high-priority reconsidering using API Gateway. It also means that those organizations may now find Serverless Application development overall much more appealing as one of the largest challenges they faced before now cut down significantly. As the independent verifications of the new claims of 10ms total latency come in, ad-tech, market-trading or other sectors where latency is critical may start to become more interested in serverless workloads.

## JWT Authentication and Authorization

In the past, authentication and authorization were supported by AWS Lambda and API Gateway by using custom Lambda authorizers and JWT verification processes. This process involved managing your own Lambda function to process and verify incoming JWTs and then generate an IAM policy that granted it access to your API. 

Overall, this was a huge nuisance. You had to extract the JWT from headers, verify that it was formatted correctly and cryptographically validate it with a library like `jose` (Node.js) or `python-jose` (Python). After all that, you still had to generate an IAM policy granting access to the API endpoint, and make sure you did it properly to avoid inadvertently caching a policy that denied access to subsequent requests to different endpoints. Essentially, a huge hassle that AWS is offering to take care of for you.

If you're interested in doing with the Serverless Framework, you can read more about it [here](https://serverless.com/blog/serverless-auth-with-aws-http-apis/).

## Simplified Routes and Deployment Stages

With the new HTTP API, AWS added a [simpler method](https://aws.amazon.com/blogs/compute/announcing-http-apis-for-amazon-api-gateway/) of configuring and deploying API routes and stages.

Essentially, HTTP API routes have an HTTP Method like GET or POST or a catch-all route like ANY. They also have a route or path like `/some-path`. And they have an integration target such as Lambda or another URI. This makes the overall configuration much simpler. It also appears to be a way for AWS to add more integrations later on, possibly allowing you an easier way to hook into AWS services other than Lambda.

They've also done the same thing with built-in HTTP API stages making them a simpler concept that doesn't require a separate "deployment" resource. 

These changes are currently not as significant for Serverless Framework users, as many of these details are already abstracted away when using the Serverless Framework. 

## VPC Integrations for Private Resources

AWS also [recently added](https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/) the capability to integrate with Private VPC resources like ECS, EKS, and EC2. This means, that your HTTP API (or your old REST APIs), in addition to using Lambda, could hook into other services inside of VPC using an Application Load Balancer, Network Load Balancer, or AWS Cloud Map.

This will be especially useful for organizations that want to provide controlled HTTP access to protected VPC resources. If you already have existing backend resources serving requests, they can now link up with the HTTP or REST APIs as an alternative to something like a public-facing elastic load balancer.

## Sharing Custom Domains between REST and HTTP APIs

This addition, allows you to share custom domains between REST and HTTP APIs. This is especially great if you're like to start leveraging the new functionality of HTTP APIs but you're taking it slo moving existing endpoints over. It allows you to start adding new HTTP API endpoints into your current custom domains without having to tear all the old stuff out and move it over immediately.

Say you have an existing REST API running and configured to handle requests related to customer profiles and orders might look like this:

- `yourcoolapi.com/customer/{id}/profile`
- `yourcoolapi.com/customer/{id}/order`

Now, you can add in HTTP API endpoints using the same custom domain. So your new endpoints for adding customer subscriptions can still look like:

- `yourcoolapi.com/customer/{id}/subscription`

But it will be running on the faster, cheaper, HTTP API.

This is one of the most compelling developments in the announcement for organizations that want the cost savings for new development but aren't quite ready to replace existing APIs.

## CORS Headers and Lambda Payload and Response Changes

I've lumped global CORS headers support and Lambda Payload changes together because they each directly impact one another.

### CORS Headers 

Long story short, the new HTTP APIs allow you to easily configure CORS headers to be returned by the API Gateway for every single endpoint of your API instead of in your Lambda handler code. This is pretty snazzy as it lets you change parts of your Lambda code from something like this:

```python
return {        
    "statusCode": 200,
    "Headers": {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET",
    }
    "body": json.dumps(response)
}
```

To this:

```python
return {        
    "statusCode": 200,
    "body": json.dumps(response)
}
```

There is a subset of headers you can control in this way, and the Serverless Framework will help you with this by default. We cover this more in the [announcement post](https://serverless.com/blog/aws-http-api-support/) of our support for HTTP APIs.

### Lambda Payload v2.0

However, that's just half the story. In addition to the global CORS config, there is also a v2.0 Lambda payload coming from API Gateway. This payload is greatly simplified and cuts out a significant portion of the data that was previously available and restructures it. You can review the differences in the [AWS Blog post](https://aws.amazon.com/blogs/compute/building-better-apis-http-apis-now-generally-available/). 

This v2.0 payload is optional for HTTP APIs because it may be a breaking change for some existing Lambda functions that rely on data only in the v1.0 format, or that is formatted differently or in a different part of the event payload object. 

With the v2.0 payload that API Gateway provides to Lambda, is the option for Lambda to send back an even more simplified response to API Gateway. Previously, Lambda had to return an object with a `statusCode` and `body` along with any required `headers`. But with the addition of the global CORS configuration, the `headers` were no longer required:

```python
return {        
    "statusCode": 200,
    "body": json.dumps(response)
}
```

With the v2.0 integration, Lambda can keep sending data back in that format, or it can go a step further and omit a status code entirely and just return the body itself:

```python
return json.dumps(response)
```

This v2.0 integration simplifies the Lambda/API Gateway interaction dramatically and effectively abstracts away the API gateway entirely as you can just return whatever data you'd like and have that sent back via the API. Even better, the v2.0 integration will fall back to a 1.0 integration if it sees the 1.0 integration format (a body and headers).

# Key Differences, Limitations, and Workarounds

In addition to all the great new benefits, there's some key differences to keep in mind. Some of these differences may be irrelevant. Others might be something that prevent you from using the new HTTP APIs. AWS has several tables with different support or unsupported features of the HTTP APIs [here](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html). So let's take a look at some of the key changes and differences between the two. When looking at some of these differences I'll include potential workarounds or alternatives:

- No support for usage plans and API Keys
- No wildcard subdomains
- No request/response transformations 
- No caching
- No JSON schema validation
- Cannot deploy edge-optimized APIs
- No Amazon X-ray support and limited logging
- Support for catch-all routing
- Deployment, stage, route configuration differences

## Usage Plans and API Keys

Usage Plans and API Keys are a great feature of the API Gateway REST APIs. While AWS might add support for this in the future, your best bet is to stick with REST APIs right now and leverage HTTP APIs for any endpoints that don't require usage plans and API Keys.

## Wildcard Subdomains

This [feature](https://aws.amazon.com/about-aws/whats-new/2019/10/api-gateway-supports-wildcard-custom-domain-names/) was an excellent option for APIs that needed to provide customers with a branded API and potentially use it to isolate customers' usage.

The options for this now are more limited and would require you to create individual subdomains unless working with the REST APIs exclusively.

## No Request/Response Transformations

Using request/response transformations, you could process the incoming or outgoing API Gateway data given a pre-configured transformation template. Currently, your best option are to bring this processing into Lambda or to only use HTTP APIs for endpoints that don't require this transformation.

## No Caching

As far as I know, there's no great solution here yet beyond configuring your downstream services to implement their own caching. Because the HTTP APIs are significantly cheaper this might not be as important. 

## No JSON Schema Validation

One great option for API Gateway's REST APIs is that you could define the expected payload bodies coming into the API Gateway with JSON Schema Draft 04. We've had an [easy way](https://github.com/fernando-mc/schema-validation-demo) to configure this option in the Serverless Framework too. However, this isn't an option out of the box with HTTP APIs.

The best alternative, and one that many people may already be using is to validate the incoming body directly from the incoming event body when it gets to Lambda. You can use a variety of libraries to do this validation, many of which support JSON Schema already and will allow you to use your existing JSON Schema definitions.

## No Edge Optimized or Private APIs

At the moment, you [can't have](https://docs.aws.amazon.com/apigateway/latest/developerguide/http-api-vs-rest.html) edge optimized or private HTTP APIs. The best best here is to use REST APIs for those you need to be edge optimized or private and HTTP APIs for any others to save on cost.

# No Amazon X-ray Support and Limited Logging

For anyone currently relying on Amazon X-ray in their serverless applications, they will need to find an alternative solutions such as [Framework Pro](http://dashboard.serverless.com/) to monitor and debug their HTTP API applications. AWS may end up adding X-ray support for HTTP APIs eventually, but at the moment it isn't available.

The same goes for sending access logs to Amazon Kinesis Data Firehose or using API execution logs. At the moment, neither is supported by the HTTP API.

## Support for Catch-all Routing

One key difference between AWS HTTP and REST APIs is that HTTP APIs support catch-all routing. This allows you to configure a single endpoint that catches all requests and routes them to a single integration (e.g. a Lambda Function). Our [added support](https://serverless.com/blog/aws-http-api-support/) for the `httpApi` event in the Serverless Framework allows you to use this catch-all routing or to configure individual API endpoints how you would normally with the traditional REST API.

## Deployment, Stage, Route Configuration Differences

Overall, as we discussed in our [initial announcement](https://serverless.com/blog/aws-http-api-support/) about Serverless Framework support for HTTP APIs, the underlying API Gateway resources are significantly simplified. Thus far, we've made a few decisions about how to provide you the same Serverless Framework experience you're used to while we allow you to integrate with the HTTP API as a new event type.

The simplicity of discrete stages, easy deployments of those stages, and route/path configurations are still offered to you by the Serverless Framework - both in the REST API and HTTP world. If you see cases where we can add additional functionality or improve the experience in this new world of HTTP APIs please [open an issue](https://github.com/serverless/serverless/issues)!

# What Next?

We're collecting guides, tutorials and examples around the AWS HTTP API - and we'd love to feature yours! Don't hesitate to reach out to us if you think you've found or written a great one yourself so we can feature it here:

- [Serverless Framework Support for AWS HTTP APIs](https://serverless.com/blog/aws-http-api-support/) - Our announcement on our support for AWS HTTP APIs
- [Serverless Auth with AWS HTTP APIs](https://serverless.com/blog/serverless-auth-with-aws-http-apis/) - A guide to using the JWT integration with the Serverless Framework and new HTTP APIs  
- Ultimate Guide to AWS HTTP APIs (Coming soon!)

Hopefully this gives you a good overview on the significance of the changes and differences between AWS HTTP APIs and REST APIs. In the future, you can look out for our upcoming "Ultimate Guide to AWS HTTP APIs" where we'll take you through the process of developing with HTTP APIs. We'll also update that guide with any new developments that may arise in the coming months as AWS adds to the functionality of HTTP APIs.
