---
title: Announcing HTTP API Troubleshooting
description: "Framework Pro now supports automatic troubleshooting of HTTP APIs!"
date: 2020-04-21
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-04-http-api-monitoring/http-api-troubleshooting.png"
authors:
  - FernandoMedinaCorey
category:
  - news
---

# Troubleshooting HTTP APIs

After we [announced support](https://serverless.com/blog/aws-http-api-support/) for HTTP APIs in the Serverless Framework we saw a lot of enthusiasm around the benefits of the new HTTP APIs. People were excited about the possibility for significant cost reduction and performance improvement. But, there was still the question of effectively troubleshooting your Lambda infrastructure in combination with the new HTTP API.

Because of this, we're excited to announce newly released monitoring and debugging support for HTTP APIs. Now you can get automatically instrumented monitoring and debugging tools on top of your HTTP APIs right out of the box. Let's see how with a simple service.

# Setting up Troubleshooting

First, make sure you've already done a few things:

- Installed the Serverless Framework `npm install -g serverless`
- Created a free [Framework Pro](https://app.serverless.com/) account

After this, you should be able to create an HTTP API pretty easily.

First, let's create a new project directory and create a `serverless.yml` file in it:

- `mkdir http-api-project`
- `cd http-api-project`
- `touch serverless.yml`

Then, add this to your `serverless.yml` file:

```yml
org: yourorg
app: http-api-example
service: http-api-example-python

provider:
  name: aws
  runtime: python3.8
  
functions:
  getProfileInfo:
    handler: handler.hello
    events:
      - httpApi:
            method: GET
            path: /hello
```

Make sure to replace the `org` and `app` values with the ones for your Framework Pro account. From there, you can create a new `handler.py` file:

- `touch handler.py`

And then add this Python code inside the file:

```py
import json


def hello(event, context):
    body = event['body']
    print(body)
    response = {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Hello friends!"
        })
    }
    return response
```

After you make sure to save both `serverless.yml` and `handler.py` you can run `serverless deploy` to deploy your HTTP API.

From here, just open up the URL in a browser and refresh the page a few times. The URL should look something like this: `https://44whsmxq8l.execute-api.us-east-1.amazonaws.com/hello`

When you load it up in the browser you should see this:

![Text saying hello friends, in a web browser](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-04-http-api-monitoring/hello-friends.png)

After you refresh the page a few times, open up your [Framework Pro Dashboard](http://app.serverless.com/) and navigate to your app and service. You should now see the recent logs:

![The Framework Pro Overview section](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-04-http-api-monitoring/hello-explorer.png)

And that's it! You've just setup your HTTP API with monitoring and alerting capabilities.

# What Next?

Now that you know how to setup a basic HTTP API with monitoring you're ready to continue developing your HTTP APIs. As you dive into it, you might be interested in some of our other guides on HTTP APIs:

- Our [Official Guide to AWS HTTP APIs](https://serverless.com/blog/official-guide-aws-http-apis/) covers important essentials and context around the newer HTTP APIs
- [Serverless Auth with HTTP APIs](https://serverless.com/blog/serverless-auth-with-aws-http-apis/) is an introductory tutorial to getting started with HTTP API authorizers
- Also check out [this example](https://github.com/fernando-mc/http-api-surveys-service) of a more complex multi-entity "Surveys service" using DynamoDB and Python
- Or, if you prefer Node, [this example](https://github.com/fernando-mc/http-api-surveys-service-node) of the same multi-entity "Surveys service" using DynamoDB and Node.js
