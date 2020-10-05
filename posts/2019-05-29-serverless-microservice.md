---
title: Deploy a scalable API and Backend with Serverless, Express, and Node.js
description: Learn how to structure a microservice application in multiple serverless.yml files for infinite scalability.
date: 2019-05-29
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sls-microservice/thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sls-microservice/header.png'
authors:
  - BryanKillian
category:
  - guides-and-tutorials
featured: guides-and-tutorials
---

As more people begin deploying production web applications with Serverless it comes into question how exactly to structure an application repository that has multiple components with Serverless.  Imagine you're building an e-commerce website where you expect users to register, and those users can create an order.  These front end transactions can be handled in this example.  Lets say as part of that order, you have a backend system for fulfillment of the order such as an API request to another system. In this example, when an order is created it will trigger a message sent to a backend function to process the order.

In this post, I have come armed with a repository help get you started with your Serverless application development.  With this example you get two DynamoDB tables representing a place to store your application's data, an API Gateway that you can hook into a front end, or back end process to interface with your application and 3 separate endpoint Lambda functions, a SQS queue to simulate a message being sent to the acting backend, and the backend which is one Lambda function that is triggered from the previously mentioned SQS queue.

As well as demonstrating a functioning example, this will also go over some __best practices__ for using multiple environments, custom variables per environment, how to package functions individually, how to use IAM roles per function individually, import yaml template fragments, and exporting API Gateway RestApiId to use in other `serverless.yml` files.

As well as getting you started with an application template, this design will also help you circumvent around a the [well known 200 resource limit with AWS Cloudformation.](https://serverless.com/blog/serverless-workaround-cloudformation-200-resource-limit/)

Another benefit of this design is you are able to deploy your API endpoints separately from your backend infrastructure, while still having them loosely dependent on each other.  Not only can you deploy the infrastructure together, but you can decouple the infrastructure and deploy individual API endpoints for development and deployment agility.

## Getting Started
To get started you'll need your environment configured with AWS credentials.
Next, lets pull down the example repository and jump into it:
```bash
git clone https://github.com/trilom/sls-microservice.git
cd sls-microservice/backend
```

## How to use `make buildAll` and `make deployAll`
Getting started is simple, after cloning the repository all you need to do is build the project with `make buildAll` and then deploy the project with `make deployAll`.  
`make buildAll` will run `yarn install` in the `./backend` directory, then it will look at each directory in the `./backend/src` directory and run `yarn install` for each, then it will run `make buildAll` from the `./api` directory.  This will look at each directory in the `./api/src` directory and run `yarn install` for each.  
`make deployAll` will run `serverless deploy --stage dev` in the `./backend` directory and then it will run `make deployAll --STAGE='dev'` from the `./api` directory.  This will look at each directory in the `./api/src` directory and run `serverless deploy --stage dev` for each.  

## What does this build
<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sls-microservice/sls-microservice.jpg">
This will define an example Serverless infrastructure stack containing:

1. **an API Gateway**
The API has 6 endpoints.  One to create a user, one to get a user information, one to get a list of users, one to get a list of orders for a user, one to get order information for that user, and one to create an order.

2. **two DynamoDB tables**
One is the user table and one is the order table.

3. **a SQS queue**
An SQS queue that looks out for orders and moves them to fulfillment.

4. **one backend lambda function, and three api lambda functions**
The backend function will look for messages in the Order queue, then move them to fulfillment.
The API functions are split into 3 endpoints where you can implement different packages scope.

## Dev Environment
One benefit that Serverless has out of the box is support for multiple stages.  This example takes advantage of using multiple stages in order to define __custom stage variables__.  In the `./backend/serverless.yml` you can see the following:
```yaml
custom:
  prod:
    Stack: ExampleSite
    LogLevel: info
    OrdersTableRCU: 1
    OrdersTableWCU: 1
    UsersTableRCU: 1
    UsersTableWCU: 1
  dev:
    Stack: ExampleSite
    LogLevel: debug
    OrdersTableRCU: 1
    OrdersTableWCU: 1
    UsersTableRCU: 1
    UsersTableWCU: 1
```
This allows us to define specific parameters for different environments of our site.  In our example, we are setting a specific logging level, as well as specifically defining our table capacity.
To utilize this feature, lets take a look at the `provider` section:
```yaml
provider:
  name: aws
  runtime: nodejs10.x
  memorySize: 128
  timeout: 10
  region: us-east-1
  stage: ${opt:stage, 'dev'}
  logRetentionInDays: 14
  environment:
    logLevel: ${self:custom.${self:provider.stage}.LogLevel}
```
Here we are taking in the option `stage` from the command line, and setting the default to `dev` with the `stage` parameter.  In the _environment.logLevel_ parameter, we are importing a __custom stage variable__ from our defined variables previously.

## Package functions individually and reducing dependencies
Dependencies are something that might be challenging to manage.  I like to keep my functions below [_3 MB_ whenever possible](https://docs.aws.amazon.com/lambda/latest/dg/limits.html) to preserve console editing ability.  Some tools I use to accomplish this include packaging my functions individually, and using `serverless-plugin-reducer` to ensure I'm not uploading unnecessary dependencies.  This plugin will look at your `requires` from your code, and resolve dependencies from that and ensure only _lambda_ dependencies get packaged.  Using this plugin is simple, first include it in your plugin, and ensure package individually is set to true:
```yaml
package:
  individually: true

plugins:
  - serverless-plugin-reducer
```

## Use IAM Roles individually w/ serverless-iam-roles-per-function
Serverless by default allows you to specify an iam role per `serverless.yml`, we are using the `serverless-iam-roles-per-function` plugin to add the _functions.iamRoleStatements_ parameter.  With this we are able to define specific iam statements per function giving you precise security controls.
```yaml
functions:
  Orders:
    handler: src/orders/index.handler
    iamRoleStatements:
      - Effect: Allow
        Action:
          - dynamodb:UpdateItem
        Resource:
          - arn:aws:dynamodb:#{AWS::Region}:#{AWS::AccountId}:table/${self:custom.${self:provider.stage}.Stack}-Orders-${self:provider.stage}
      - Effect: Allow
        Action:
          - sqs:ReceiveMessage
          - sqs:DeleteMessage
          - sqs:GetQueueAttributes
        Resource:
          - arn:aws:sqs:#{AWS::Region}:#{AWS::AccountId}:${self:custom.${self:provider.stage}.Stack}-OrdersQueue-${self:provider.stage}
plugins:
  - serverless-plugin-reducer
```

## Export API Gateway RestApi
In Serverless, when you define a function with a http event this will create an API Gateway.  In this example our `./backend/serverless.yml` defines a `root` endpoint, this endpoint is a simple health check.  We then export this API Gateway's _RestApiId_ and _RootResourceId_ in order to reuse in our separate API Gateway endpoints defined in `./api/src`.
1. To demonstrate, in our `./backend/serverless.yml` we export _RestApiId_ and _RootResourceId_.
```yaml
resources:
  ...
  - Outputs:
      ApiGWRestApiId:
        Value:
          Ref: ApiGatewayRestApi
        Export:
          Name: ${self:custom.${self:provider.stage}.Stack}-restApiId-${self:provider.stage}
      ApiGWRootResourceId:
        Value:
          Fn::GetAtt:
            - ApiGatewayRestApi
            - RootResourceId
        Export:
          Name: ${self:custom.${self:provider.stage}.Stack}-rootResourceId-${self:provider.stage}
```
2. We then import these __export variables__ into for example `./api/src/order/serverless.yml` into _provider.apiGateway_.
```yaml
provider:
...
  apiGateway:
    restApiId:
      'Fn::ImportValue': ${self:custom.${self:provider.stage}.Stack}-restApiId-${self:provider.stage}
    restApiRootResourceId:
      'Fn::ImportValue': ${self:custom.${self:provider.stage}.Stack}-rootResourceId-${self:provider.stage}
...
```
This will tell the API Gateway what _RestApiId_ to use, and what the _RootResourceId_ is so that it can build child endpoints from the Root Resource.
3. When you are nesting a route within a route, you will need to export the parent route's _ResourceId_.  For example, in `./api/src/user/serverless.yml` we export the parent _ResourceId_ that our nested endpoint of `/user/{userid}/order` will use, which is `/user/{userid}`.
```yaml
resources:
  Outputs:
    ApiRootUserUseridVar:
      Value:
        Ref: ApiGatewayResourceUserUseridVar
      Export:
        Name: ${self:custom.${self:provider.stage}.Stack}-ApiRootUserUseridVar-${self:provider.stage}
```
4. And import the _ResourceId_ into the child route defined in `./api/src/user/order/serverless.yml` as a _provider.apiGateway.restApiResources_ parameter for the route.
```yaml
provider:
  ...
  apiGateway:
    restApiId:
      'Fn::ImportValue': ${self:custom.${self:provider.stage}.Stack}-restApiId-${self:provider.stage}
    restApiResources:
      /user/{userid}:
        'Fn::ImportValue': ${self:custom.${self:provider.stage}.Stack}-ApiRootUserUseridVar-${self:provider.stage}
```

## Reference pseudo parameters w/ serverless-pseudo-parameters
When implementing iam best practices, you need to specify specific __Resource__ statements and this often requires utilizing [Cloudformation Psuedo Parameters](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/pseudo-parameter-reference.html) to reference _AccountId_ or _Region_.  Using the plugin `serverless-pseudo-parameters` you are able to use Cloudformation pseudo parameters nearly the same as you would in Cloudformation.  Consider the following example:
```yaml
- Effect: Allow
  Action:
    - dynamodb:Query
  Resource:
    - arn:aws:dynamodb:#{AWS::Region}:#{AWS::AccountId}:table/${self:custom.${self:provider.stage}.Stack}-Orders-${self:provider.stage}
```
Here we are defining a DynamoDB table and specifying the _Region_ and _AccountId_ using `#{AWS::Region}` and `#{AWS::AccountId}` respectively.

## What to do from here?
* In more complicated examples you would be able to use AWS Cognito in the `/user` endpoint to set up authentication.  This endpoint would be scoped for user functions around Cognito and will likely have similar imports.
* You could also import Stripe in a `/billing` endpoint to facilitate collection of payment information.
* Within the `/orders` endpoint, you can set up your DynamoDB queries for managing your order collection.
* You could set up CI/CD simply by adding a CodePipeline resource, and utilizing CodeBuild to pull down this repository, and run the make files.
* Use the `serverless-domain-manager` plug-in to enable domain functionality.  Most of this structure is laid out, you just need to provide a valid `ApiHostedZone`, `ApiSite`, and `ApiCert`.  This can be created in the AWS Console for Route53 and ACM and provided here as variables.
