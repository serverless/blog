---
layout: Post
title: 'Serverless Code Patterns'
date: 2016-09-15
description: "Learn the best ways to structure your Serverless applications by applying theses architectural patterns"
authors:
  - EslamHefnawy
---

Microservices and the Serverless Architecture have changed the way we think about web applications and partitioning logic.  In this post, we'll share the best ways to structure your Serverless applications by applying the patterns directly on a simple example app we’re building — A Serverless Social Network. This fictional social network could have many features, but we’ll focus on the _users_ and _comments_ features to keep things simple.

Following months of experimentation and feedback we’ve summarized our findings into four patterns that the Serverless Framework embraces perfectly:

**1\. Microservices Pattern**

**2\. Services Pattern**

**3\. Monolithic Pattern**

**4\. Graph Pattern**

Let’s explore how we can build our Serverless Social Network using each one of these patterns, while outlining the benefits and drawbacks of each along with the configuration required for each pattern.

## 1. Microservices Pattern

In the Microservices Pattern each job or functionality is isolated within a separate Lambda function. In the case of our example app, each Lambda function would also have a single http endpoint that serves as the entry point for that function.

```yaml
service: serverless-social-network
provider: aws
functions:
  usersCreate:
    handler: handlers.usersCreate
    events:
      - http: post users/create
  commentsCreate:
    handler: handlers.commentsCreate
    events:
      - http: post comments/create
```

**Benefits of Microservices Pattern:**

*   Total separation of concerns. Each job/operation is in a separate unit of deployment (i.e., a separate Lambda function), allowing you to modify your application’s components individually, without affecting the system as a whole. This is a very agile and safe pattern, especially in production.
*   Each Lambda function handles a single event making your functions easy to debug, since there is usually only one expected outcome.
*   This separation of concerns is also great for autonomous teams. They can push functionality into production independently.

**Drawbacks of Microservices Pattern:**

*   You will end up with a lot of functions, which is harder to manage and can result in a lot of cognitive overhead. Lambda functions tend to be more granular than traditional microservices, so be ready for a lot of them!
*   Performance could be slower. When functions handle a single job, they are called less, resulting in more cold starts.
*   Deployments will be slower, since multiple functions have to be provisioned.
*   You could reach the CloudFormation template file size limit quickly, especially if you’re using custom resources.

## 2. **Services Pattern**

In the Services Pattern, a single Lambda function can handle a few (~4) jobs that are usually related via a data model or a shared infrastructure dependency. In our example app, all operations on the Users data model are performed in a single Lambda function, and multiple HTTP endpoints are created for all CRUD operations.

```yaml
service: serverless-social-network
provider: aws
functions:
  users:
    handler: handler.users
      events:
        - http: post users
        - http: put users
        - http: get users
        - http: delete users
  comments:
    handler: handler.comments
      events:
        - http: post comments
        - http: put comments
        - http: get comments
        - http: delete comments
```

You can inspect the incoming HTTP request’s path and method by parsing the _event_ body in your code, and then perform the correct operation in response. It’s like having a small router in the beginning of your Lambda code.

**Benefits of Services Pattern:**

*   This will result in less Lambda functions that you need to manage.
*   Some separation of concerns still exists.
*   Teams can still work autonomously.
*   Faster deployments.
*   Theoretically better performance. When multiple jobs are within a Lambda function, there is a higher likelihood that Lambda function will be called more regularly, which means the Lambda will stay warm and users will run into less cold-starts.

**Drawbacks of Services Pattern:**

*   Debugging gets slightly more complicated, since the Lambda function is handling multiple jobs, and has different outcomes.
*   Requires creating a router to call the right logic based on the request method or endpoint.
*   Bigger function sizes due to putting multiple operations within the same Lambda function.

## 3. Monolithic Pattern

In the Monolithic Pattern your entire application is crammed into a single Lambda function. In our example app, our entire app is in a single Lambda function, all HTTP endpoints point to that Lambda function.

```yaml
service: serverless-social-network
provider: aws
functions:
  socialNetwork:
    handler: handler.socialNetwork
      events:
        - http: post users
        - http: put users
        - http: get users
        - http: delete users
        - http: post comments
        - http: put comments
        - http: get comments
        - http: delete comments
```

**Benefits of the Monolithic Pattern:**

*   A single Lambda function is much easier to comprehend and manage. It’s more of a traditional set-up.
*   Fast deployments, depending on the total code size.
*   Theoretically faster performance. Your single Lambda function will be called frequently and it is less likely that your users will run into cold-starts.

**Drawbacks of the Monolithic Pattern:**

*   Requires building a more complex router within your Lambda function and ensuring it always directs calls the appropriate logic.
*   It’s harder to understand performance. The Lambda function will run for a variety of durations.
*   You can easily hit the Lambda size limit in real world practical applications due to the larger function size.

## 4. The Graph Pattern

The Graph Pattern is similar to the Monolithic Pattern, but it allows you to take advantage of GraphQL to reduce your entire REST API and all of its endpoints into 1–2 endpoints. As a result, your entire application will be composed of a single function and a 1–2 endpoints that handle GraphQL queries. GraphQL will then fetch the correct data in any form you need.

```yaml
service: serverless-social-network
provider: aws
functions:
  socialNetwork:
    handler: handler.socialNetwork
      events:
        - http: get query
```

**Benefits of the Graph Pattern:**

*   Very easy to manage with a single Lambda function and a single endpoint for the entire application.
*   Theoretically faster performance. Your single Lambda function will be called frequently and it is less likely that your users will run into cold-starts.
*   Blazing fast to deploy since you only have a single function and a single endpoint
*   A pay-per-execution, zero-administration, Graph API!!! It doesn’t get more efficient than that!

**Drawbacks of the Graph Pattern:**

*   You can easily hit the Lambda size limit in real world practical applications due to the massive function size.
*   You have to learn GraphQL.

Our team is currently playing with the Graph pattern, except we’ve isolated each GraphQL query into a second tier of Lambda functions. This helps retain a microservices architecture w/ GraphQL. It is what we’re internally calling a **Graph Gateway** pattern. We’ll write more on this in the near future, as it’s still in the testing phase.

## Conclusion

We’ve explored four patterns that you can use to build your Serverless applications. Everyone has different requirements and preferences, so we’ve made sure the Serverless Framework can support all of the above patterns, easily. Enjoy, and good luck!


**_About the Author:_** _Eslam Hefnawy is a senior developer at Serverless Inc. He leads the team in charge of building and maintaining the Serverless Framework — an application framework for building web, mobile and IoT applications powered by AWS Lambda, AWS API Gateway and in the future other FaaS providers. Connect with Eslam at_[ _http://eahefnawy.com/_](http://eahefnawy.com/) _or on_ [_Github_](https://github.com/eahefnawy)_._
