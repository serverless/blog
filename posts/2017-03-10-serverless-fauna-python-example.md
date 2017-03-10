---
title: Build A Serverless Python Application with AWS + FaunaDB - The First Serverless Database
description: "Learn how to build a Serverless Python app with serverless database FaunaDB."
date: 2017-03-10
thumbnail: https://cloud.githubusercontent.com/assets/20538501/23813615/4b53e4fc-05a5-11e7-8214-e34c2c02b949.png
layout: Post
authors:
  - ChrisAnderson
---

*Join members of the Serverless team, and the author of this post, at [the next Serverless Meetup at Fauna in San Francisco, March 23rd](https://www.meetup.com/Serverless/events/238118916/).*

## Introduction to FaunaDB

[FaunaDB](https://fauna.com/) is the first truly serverless database. In this post, I'll demonstrate how to use the Serverless Framework to connect an AWS Lambda Python application with FaunaDB Serverless Cloud. (If you're interested in seeing the same for [JavaScript, check out the companion post on FaunaDB's blog](https://fauna.com/blog/serverless-cloud-database).)

When I say *serverless*, I mean the Function-as-a-Service pattern. A serverless system scales dynamically by request and doesn't require any provisioning or capacity planning. For example, you can [subscribe to FaunaDB in moments](https://fauna.com/serverless-cloud-signup), and smoothly scale from prototype to runaway success.

> A serverless system must be scaled dynamically by request.

[FaunaDB Serverless Cloud](https://fauna.com/serverless-cloud-signup) is a globally distributed database that doesn't require any provisioning. Capacity is metered and available on demand, so you only pay for what you use. Plus, you can always port your app to FaunaDB On-Premises in your own datacenter or private cloud, so there's no cloud infrastructure lock-in.

## Using the Serverless Framework

[Serverless](https://serverless.com/) offers a clean system for configuring, writing, and deploying serverless application code to different cloud infrastructure providers. Porting one of their storage examples from DynamoDB to FaunaDB was incredibly easy to accomplish. Looking through this code will show us how simple it is to set up a Serverless application with storage that's available in every region.

The [Python CRUD service](https://github.com/fauna/examples/tree/aws-python-rest-api-with-faunadb/aws-python-rest-api-with-faunadb) is a simple REST API that allows the creation, updating and deletion of todo items as well as the list of all items. After we look through the code, I’ll describe how you’d go about adding a shared-list multi-user data model, where users can invite other members to read and update todo lists.

The README file contains [installation and setup instructions](https://github.com/fauna/examples/tree/aws-python-rest-api-with-faunadb/aws-python-rest-api-with-faunadb#setup), and you can [go here](https://fauna.com/serverless-cloud-sign-up) to gain instant access to FaunaDB.

*Once this configuration is running, you can play with deeper features of FaunaDB, such as querying a social graph. Take a look at this [social graph tutorial](https://fauna.com/tutorials/social).*

## Defining Functions

The first file to start reading any application that uses the Serverless Framework is [serverless.yml](https://github.com/fauna/examples/blob/aws-python-rest-api-with-faunadb/aws-python-rest-api-with-faunadb/serverless.yml). It defines the service functions and links to event handlers.

### readAll example

Here we can see one of the function definitions:

```yml
list:
  handler: todos/list.list
  events:
    - http:
        path: todos
        method: get
        cors: true
```

This configuration means the [`list` function in `todos/list.py`](https://github.com/fauna/examples/blob/aws-python-rest-api-with-faunadb/aws-python-rest-api-with-faunadb/todos/list.py) will be called when an HTTP GET is received at the `todos` path. If you look through the configuration you’ll see all the functions are linked to files in the todos directory, so we'll look at the implementation of `list.py`.

```python
import json

from todos.makeresult import make_result
from todos import client, ALL_TODOS

from faunadb import query

def list(event, context):
    # fetch all todos from the database
    results = client.query(
        query.map_expr(lambda ref: query.get(ref),
                       query.paginate(query.match(ALL_TODOS))))

    # create a response
    response = {
        "statusCode": 200,
        "body": json.dumps(map(make_result, results['data']))
    }

    return response
```

Most of `list.py` is concerned with managing HTTP, or module imports. Let's zoom in on the query.

```python
results = client.query(
    query.map_expr(lambda ref: query.get(ref),
                   query.paginate(query.match(query.index('all_todos')))))
```

In this case we run a query for all todos, using a FaunaDB secret passed via configuration in `serverless.yml`. FaunaDB uses HTTP for queries so you don’t need to worry about sharing connections between modules or invocations.

## Your Turn

Follow the README instructions to launch and run the service, then create a few todo items.

Now you’re ready to explore your data and experiment with queries in the FaunaDB dashboard. Open the dashboard [via this sign up form](https://fauna.com/serverless-cloud-sign-up). It will look something like this:

![FaunaDB Dashboard Screenshot](https://fauna.com/blog/fauna-dashboard-serverless.png)

If you look closely at the screenshot you get a hint at FaunaDB’s temporal capabilities which can power everything from social activity feeds, to auditing, to mobile sync.

## Taking It A Step Further

In a production-worthy version of this application, the request would contain a list ID, and our query would validate that the list is visible to the user, before returning just the matching items. This security model is similar to collaboration apps you may be familiar with, and it’s supported natively by FaunaDB.

Watch the [Fauna blog](https://fauna.com/blog) for an updated Serverless application with a more mature multi-user data model using FaunaDB’s security features.
