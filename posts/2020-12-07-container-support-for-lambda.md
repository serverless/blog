---
title: Container Image Support for AWS Lambda
description: "Container Image Support for AWS Lambda has now been added. Read up on why you may (or may not) want to use it and how easy it is to use with the framework"
date: 2020-12-27
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/lambda-docker-support/serverless-framework-docker.png"
authors:
  - GarethMcCumskey
category:
  - guides-and-tutorials
---

AWS Lambda is easy to use and manage; the execution environment has a specific runtime on a known environment and you can just send code to it and it runs. Nice! And this has served us well over the years. The biggest problem with that status quo, however, is when you want to achieve a use case outside of these predetermined environments. Perhaps you want to perform some form of processing using a library that is not included by default into the execution environment? Or even use your own runtime that is not provided?

AWS tried to help solve some of these issues with the introduction of Lambda layers which was useful but still quite limited. The real problem was that, while Lambda by default is great for pick up and run with little to no maintenance, flexibility was sacrificed to achieve that.

Introducing the just announced container image support by AWS which now allows you to use any docker container of your choosing as the environment for your Lambda function. The container entirely encapsulates your Lambda function (libraries, handler code, OS, runtime, etc) so that all you need to do after that is point an event at it to trigger it.

And the Serverless Framework makes this incredibly easy to do:


```yml
service: example-service

provider:
  name: aws

functions:
  someFunction:
    image: <account>.dkr.ecr.<region>.amazonaws.com/<repository>@<digest>
```
Because we are pointing at an existing container definition that contains everything the Lambda needs to execute, including the handler code, the entire packaging process now occurs in the context of the container. AWS uses your docker configuration to build, optimise and prepare your container for use in Lambda. Bear in mind, this isn’t just “Proprietary K8s” in the background. This is still very much the Lambda micro-VM architecture and your container, while wholly custom, is packaged in a way to prepare and optimise it for use in that environment.

AWS claims that cold start times should see no significant impact, but I think it’s safe to assume that it is possible to configure things in such a way as to make cold starts longer so taking care and testing thoroughly may be needed. Especially since container images can be up to 10GB in size; we have seen that package sizes can affect cold start times in the past.
And this brings about the biggest downside of using your own docker containers. While this new feature is definitely needed and will provide a great amount of flexibility to the platform and Serverless development in general, it really should be seen as a last resort. Why?

One of the great selling points of Serverless development is that you can spit out a solution and the underlying managed services manage everything for you; from infrastructure to networks, OS’s to runtimes. Now with docker support, you can ratchet that back a notch and take back management of the OS and runtimes. Which may be required in some situations. But if you can use the pre-built, prepared environments, it still advisable to do so to reduce the amount of work you may need to do in managing these environments; it's one of the reasons most of us started building applications with Serverless to begin with!

#### Building our docker container for Lambda

Now with all the caveats and background out of the way, let's get down to the nuts and bolts of actually building our container solution. And to start, let's get a small list of requirements out of the way:

1. Ensure Docker CLI is installed: (https://docs.docker.com/get-docker/)[https://docs.docker.com/get-docker/]

2. Ensure AWS CLI is installed: (https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)[https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html]

We need to use Docker itself to prepare the docker container and then the AWS CLI to push our newly minted container to AWS’s ECR service for use in Lambda, Then it's just a case of following the steps below.

##### Login Docker to AWS ECR

```
$ aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
```

You should see the message "Login Succeeded".

##### Setup a lambda ready Docker image

Easiest way is to rely on base images as provided by AWS. Check AWS ECR Gallery for list of all available images.

You can pull chosen image via:
```
$ docker pull <image-url>
```

e. g. Node.js image (at the time of writing this post)  can be pulled as:

```
$ docker pull public.ecr.aws/lambda/nodejs:12
```

The basic configuration for that image is as follows:

```
FROM <image-url>
ARG FUNCTION_DIR="/var/task"

# Create function directory
RUN mkdir -p ${FUNCTION_DIR}

# Copy handler function and package.json
COPY index.js ${FUNCTION_DIR}
COPY package.json ${FUNCTION_DIR}

# Install NPM dependencies for function
RUN npm install

# Set the CMD to your handler
CMD [ "index.handler" ]
```
Now we build our image.

> NOTE: For images to be referenced by Serverless we suggest the following image naming convention: `<service>-<stage>-<functionName>`

```
$ docker build -t <image-name>
```

##### Create a repository for corresponding lambda image in AWS ECR service

The create repository command is image specific and will store all its versions. We suggest naming the repository the same as the image

```
$ aws ecr create-repository --repository-name <repository-name> --image-scanning-configuration scanOnPush=true
```

##### Link local image to AWS ECR repository and push it
```
$ docker tag <image-name>:latest <account>.dkr.ecr.<region>.amazonaws.com/<repository-name>:latest
$ docker push <account>.dkr.ecr.<region>.amazonaws.com/<repository-name>:latest
```
Here note the returned image digest. We will need to reference the image in our service configuration

##### Point lambda to AWS ECR image

And finally, in our serverless.yml we point the lambda to the pushed image by referencing it’s uri and digest as returned by the last docker push command

```yml
functions:
  someFunction:
    image: <account>.dkr.ecr.<region>.amazonaws.com/<repository>@<digest>
```

And that’s it. Pretty easy to get docker containers up and running in the Lambda environment. If there are any questions around using this new feature please make sure to drop by our Community Slack Worspace or our forums. If you spot any issues then also please drop by the project on GitHub to create an issue.


