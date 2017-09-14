---
title: How to use multiple runtimes in a single serverless microservice
description: 'How to build an application using multiple runtimes to supported mixed-language development with the Serverless Framework'
date: 2017-09-15
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/runtimes-man.jpg
authors:
  - JeremyCoffield
---

As a developer on the cloud, there are many tools at your disposal. The Serverless Framework supports an array of runtimes to enable you to use different languages in your Serverless application.

To manage these related codebases, you might choose to divide your application’s functions into a number of different services. However, if you prefer to deploy a single service for all your functions, regardless of what language they are written in, the Serverless Framework empowers you to do just that.

Let’s consider a small application that uses two runtimes and provides two functions. This example will use Python and Node targeting AWS, but the concepts will be broadly applicable in other circumstances. The full the project files can be [found here](https://github.com/serverless/examples/tree/master/aws-multiple-runtime) 

We’ll create an application that has an endpoint that reports the current system timestamp, and a web controller that displays the time in the browser. The configuration will look largely similar to a single-runtime application. We specify the name of the service and the target provider in our `serverless.yml`:

```yml
service: hellotime-app
provider:
  name: aws
```

Note that I omitted the usual declaration of runtime inside the provider section. If you specify it here, it will serve as a fallback for any functions that do not have a runtime specified individually.

Here I specify a function that will render the webpage markup:
```yml
functions:
  hello:
    runtime: python3.6
    events:
      - http:
          method: get
          path: greet
    handler: web/handler.hello
```

This web controller is a Python module, so I specify the `python3.6` runtime. The handler field points to the module located in my project at `web/handler.py` and names the function `hello` as the handler for received events.

Here’s what the implementation looks like:

```python
# web/handler.py

from datetime import datetime
import http.client

def hello(event, context):
    rc = event["requestContext"]
    servicePath = rc["path"][:-len(rc["resourcePath"])] # path minus the resource path '/greet'

    # GET from the /time endpoint
    connection = http.client.HTTPSConnection(event["headers"]["Host"])
    connection.request("GET", "{0}/time".format(servicePath))
    timestamp = connection.getresponse().read().decode()
    time_str = datetime.fromtimestamp(int(timestamp)).strftime("%B %d, %Y")

    return {
        "statusCode": 200,
        "body": "<html><body><p>Hello! It is now {0}.</p></body></html>".format(time_str),
        "headers": {
            "Content-Type": "text/html"
        }
    }
```

The other function is a Node-backed endpoint that reports a timestamp:

```yml
  time:
    runtime: nodejs6.10
    events:
      - http:
          method: get
          path: time
    handler: api/handler.timestamp
```


Again, this looks the same as in a single-runtime service, with the exception that it specifies the runtime `nodejs6.10` alongside the function declaration. The module for this function is located at `api/handler.js`, and exports a function named `timestamp`. It is not necessary to move files of different languages to separate folders, but depending on complexity and build procedure, you may find it useful.

The function responds with the millisecond timestamp:

```javascript
/* api/handler.js */

module.exports.timestamp = (event, context, callback) => {
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "text/plain"
    },
    body: parseInt(Date.now() / 1000)
  }

  callback(null, response)
}
```

Deploying the service with `serverless deploy` tells us the URL of the page at `/greet`. 

```bash
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (1017 B)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
................................................
Serverless: Stack update finished...

Service Information
service: hellotime-app
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  GET - https://y4ps89psjb.execute-api.us-east-1.amazonaws.com/dev/greet
  GET - https://y4ps89psjb.execute-api.us-east-1.amazonaws.com/dev/time
functions:
  hello: hellotime-app-dev-hello
  time: hellotime-app-dev-time
Serverless: Publish service to Serverless Platform...
Service successfully published! Your service details are available at:
https://platform.serverless.com/services/FavsagaSaban/hellotime-app
```

Accessing the page shows the greeting message and tells us the date.

![Browser view](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/multi-language-serivce.png)

To try it out, download [the project files](https://github.com/serverless/examples/tree/master/aws-multiple-runtime) and run serverless deploy from the directory that contains `serverless.yml`.

