---
title: "Serverless Framework example for Golang and Lambda"
description: "AWS Lambda Golang support is one of the most exciting announcements of 2018. Here's a quick template for using Go with the Serverless Framework!"
date: 2018-01-18
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/golang-support.jpg'
category:
  - guides-and-tutorials
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/golang-support.jpg'
authors:
  - MaciejWinnicki
---

Everyone, the day has come.

AWS Lambda is finally. Compatible. With Golang. 🖖

Here's how you can start using Go with the Serverless Framework RIGHT NOW and deploy Lambdas to your heart's content.

#### Get Started

First things first, you'll be needing the [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) installed, and an [AWS account](http://docs.aws.amazon.com/lambda/latest/dg/setting-up.html#setting-up-signup).

(If it's your first time using the Serverless Framework, our [first time deployment post](https://serverless.com/blog/anatomy-of-a-serverless-app/#setup) has a quick setup guide. Takes like 5 minutes, we promise.)

# Use the Go template

The Framework will configure AWS for Go on your behalf.

There are a couple Go templates already included with the Framework as of v1.26—`aws-go` for a basic service with two functions, and `aws-go-dep` for the basic service using the [`dep`](https://github.com/golang/dep) dependency management tool. Let's try the `aws-go-dep` template. **You will need [`dep`](https://github.com/golang/dep) installed.**

Make sure you're in your [`${GOPATH}/src`](https://github.com/golang/go/wiki/GOPATH) directory, then run:

```bash
$ serverless create -t aws-go-dep -p myservice
```

Change into your new service directory and compile the function:

```bash
$ cd myservice
$ make
```

The default command in the included Makefile will gather your dependencies and build the proper binaries for your functions.  You can deploy now:

```bash
$ serverless deploy
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (4.43 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
........................
Serverless: Stack update finished...
Service Information
service: myservice
stage: dev
region: us-east-1
stack: myservice-dev
api keys:
  None
endpoints:
  None
functions:
  hello: myservice-dev-hello
  world: myservice-dev-world
```

Finally, invoke your function:

```bash
$ serverless invoke -f hello
{
    "message": "Go Serverless v1.0! Your function executed successfully!"
}
```

Nice!

#### Building a Web API with Go + Lambda

The basic example is nice, but let's try something a little more useful.

Lambda + API Gateway is awesome for quickly spinning up endpoints to retrieve or ingest data. So we're going to build an example endpoint.

For our friends coming from interpreted, dynamically-typed languages (looking at you, Pythonistas & Javascript-lovers!), the Golang approach is a little different. You have to be a more intentional about the input & output of your functions. Don't worry, we'll take it slow. 😉

We're going to make an HTTP endpoint that accepts a POST request at the path `/echo`, logs the POST body, and echoes the body back to the client.

First, let's fix our `serverless.yml` to attach an HTTP event:

```yml
# serverless.yml

service: myservice

provider:
  name: aws
  runtime: go1.x

package:
 exclude:
   - ./**
 include:
   - ./bin/**

functions:
  hello:
    handler: bin/hello
    events:
      - http:
          path: hello
          method: post
```

We'll need to update our function in `hello/main.go`.

Remember, Golang is a compiled, statically-typed language, so we need to define the `event` object that's coming into our function. Fortunately, AWS has [provided a number of event types](https://github.com/aws/aws-lambda-go/tree/master/events) in a Github repo. 💥 We can just use those.

Update your `hello/main.go` to have the following code:

```golang
# hello/main.go

package main

import (
    "fmt"

    "github.com/aws/aws-lambda-go/events"
    "github.com/aws/aws-lambda-go/lambda"
)


func Handler(request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Println("Received body: ", request.Body)

	return events.APIGatewayProxyResponse{Body: request.Body, StatusCode: 200}, nil
}

func main() {
	lambda.Start(Handler)
}
```

Our `Handler()` function now takes an `APIGatewayProxyRequest` object and returns a `APIGatewayProxyResponse` object. In our function code, we're printing the request body, then returning a response with the request body.

Recompile & deploy again:

```bash
$ make
dep ensure
env GOOS=linux go build -ldflags="-s -w" -o bin/hello hello/main.go
env GOOS=linux go build -ldflags="-s -w" -o bin/world world/main.go
$ sls deploy

Serverless: Packaging service...
... <snip> ...
...............................
Serverless: Stack update finished...
Service Information
service: myservice
stage: dev
region: us-east-1
stack: myservice-dev
api keys:
  None
endpoints:
  POST - https://24k8pql1le.execute-api.us-east-1.amazonaws.com/dev/hello
functions:
  hello: myservice-dev-hello
  world: myservice-dev-world
```

Notice that you now have an `endpoint` listed in your Service Information output.

Let's use `curl` to hit your endpoint and get a response:

```bash
$ curl -X POST https://24k8pql1le.execute-api.us-east-1.amazonaws.com/dev/hello -d 'Hello, world!'
Hello, world!
```

Great! This should get you started on a web API. Feel free to check out the [other Lambda events in Golang](https://github.com/aws/aws-lambda-go/tree/master/events).

#### Why use Go for your Lambdas?

Golang support for Lambda has been one of the most anticipated releases. The crowd at re:Invent was ecstatic when Werner announced Golang support was coming soon.

Why do people care about Golang so much? Simple: the combination of safety + speed.

As we saw above, Golang is a compiled, statically-typed language. This can help catch simple errors and maintain correctness as your application grows. This safety is really useful for production environments.

However, we've had Java and C# support in Lambda for years. These are both compiled, static languages as well. What's the difference?

Java and C# both have notoriously slow cold-start time, in terms of multiple seconds. **With Go, the cold-start time is much lower.** In my haphazard testing, I was seeing cold-starts in the 200-400ms range, which is much closer to Python and Javascript.

Speed _and_ safety. A pretty nice combo.

#### A Gateway to all the runtimes

There's one final note about the Golang implementation on Lambda that's really interesting.

The `main()` function which is the entrypoint to our Golang binary _isn't_ our Lambda handler function. It's a little RPC server that wraps our handler function:

```golang
func main() {
	lambda.Start(Handler)
}
```

[Under the covers](https://github.com/aws/aws-lambda-go/blob/master/lambda/entry.go#L37-L49), it looks like Lambda starts up your executable on a coldstart. The executable listens on a given port, receives input via JSON, and sends a response via JSON.

This opens up a lot of possibilities to bring other runtimes into Lambda. You just need to pull in an executable that implements the desired RPC interface.

[Erica Windisch](https://twitter.com/ewindisch), CTO at IOpipes, is already making progress on this by pulling NodeJS 8 into Lambda:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">NodeJS 8 running natively on AWS Lambda... 🛠️⚙️🏗️</p>&mdash; Erica Windisch (@ewindisch) <a href="https://twitter.com/ewindisch/status/953303103289417728?ref_src=twsrc%5Etfw">January 16, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This is really exciting; can't wait to see what the serverless community builds!
