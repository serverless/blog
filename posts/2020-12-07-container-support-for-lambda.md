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

AWS Lambda is easy to use and manage; the execution environment has a specific runtime on a known environment and you can just send code to it and it runs. Nice! This has served us well over the years. The biggest problem with that status quo, however, is when you want to achieve a use case outside these predetermined environments. Perhaps you want to perform some form of processing using a library that is not included by default into the lambda environment? Or even use your own runtime that is not provided?

AWS tried to help solve some of these issues with the introduction of Lambda layers which was useful but still quite limited. The real problem was that, while Lambda by default is great for pick up and run with little to no maintenance, flexibility was sacrificed to achieve that simplicity.

In December, 2020, we released some basic Docker container support and recently we have expanded on that to make it a lot easier for users to make use of this new feature. The container entirely encapsulates your Lambda function (libraries, handler code, OS, runtime, etc) so that all you need to do after that is point an event at it to trigger it.

And the Serverless Framework makes this incredibly easy to do:

```yml
service: example-service

provider:
  name: aws
  ecr:
    # In this section you can define images that will be built locally and uploaded to ECR
    images:
      appimage:
        path: ./

functions:
  hello:
    image:
      name: appimage
```
Because we are pointing at an existing container definition that contains everything the Lambda needs to execute, including the handler code, the entire packaging process now occurs in the context of the container. AWS uses your docker configuration to build, optimise and prepare your container for use in Lambda. Bear in mind, this isn’t just “Proprietary K8s” in the background. This is still very much the Lambda micro-VM architecture and your container, while wholly custom, is packaged in a way to prepare and optimise it for use in that environment just like a regular Lambda.

AWS claims that cold start times should see no significant impact, but I think it’s safe to assume that it is possible to configure things in such a way as to make cold starts longer, so taking care and testing thoroughly may be needed. Especially since container images can be up to 10 GB in size; we have seen that package sizes can affect cold start times in the past.
And this brings about the biggest downside of using your own docker containers. While this new feature is definitely needed and will provide a great amount of flexibility to the platform and Serverless development in general, it really should be seen as a last resort. Why?

One of the great selling points of Serverless development is that you can spit out a solution, and the underlying managed services manage everything for you; from infrastructure to networks, OS’s to runtimes. Now with docker support, you can ratchet that back a notch and take back management of the OS and runtimes, which may be required in some situations. But if you can use the pre-built, prepared environments, it's still advisable to do so to reduce the amount of work you may need to do in managing these environments; it's one of the reasons most of us started building applications with Serverless to begin with!

#### Let the framework do all the heavy lifting

If you would like to make use of the docker support but still allow the framework to do a lot of the work for you, we have you covered. We recently added the ability for you to define a Dockerfile, point at it in your serverless.yml and have the Serverless Framework do all the work of making sure the container was available in ECR and that it was all setup and configured as needed with Lambda. 

One pre-requisite before we get started is that we need to make sure we have docker CLI installed on our local machine. You can grab the instructions to do this for your own environment on [Docker's own documentation](https://docs.docker.com/get-docker/).

To get the ball rolling lets use the added starter template to make things a little easier:

`serverless create --template aws-nodejs-docker --path aws-nodejs-docker-demo`

This will generate a boilerplate with some basic setup already configured for us in our serverless.yml. Let's go take a look at some key sections. In the provider section you should see something new here:

```yaml
provider:
  name: aws
  ecr:
    # In this section you can define images that will be built locally and uploaded to ECR
    images:
      appimage:
        path: ./
```
What this does is tell the framework what the image reference name is (`appimage`) that we can use elsewhere in our configuration, and where the content of the docker image resides with the `path` property; a Dockerfile of some type should reside in the specified folder. Our Dockerfile now does the work of specifying where the executable code is for our function. 

```dockerfile
FROM public.ecr.aws/lambda/nodejs:12

COPY app.js ./

# You can overwrite command in `serverless.yml` template
CMD ["app.handler"]
```

The `CMD` property defines a file called `app.js` with a function called `handler`. If you look at the contents of our service's directory, we have a file called app.js and inside it has that exact function name. All good so far. However, we still need to configure the function itself that will be created in Lambda, and the event that will trigger it.

```yaml
functions:
  hello:
    image:
      name: appimage
```

Note we use the same value for `image.name` above as we do for the image when we defined it; `appimage`. It can be anything you want as long as you use the same value to reference it. You can also attach any event you need to this container-based version, and it will work just like the non-container version. Tada!

##### Re-using the same container for multiple functions

Sometimes you may actually want to use the same function container for multiple functions defined in your serverless.yml. You can store all your function handlers in a single container and then reference them individually within the serverless.yml, effectively overwriting the `CMD` property as you need:

```yaml
functions:
  greeter:
    image:
      name: appimage
      command:
        - app.greeter
      entryPoint:
        - '/lambda-entrypoint.sh'
```
By adding the `command` property, we are telling the framework that for this specific function, the code is still in the `app.js` file, but the function name is `greeter`. We also have the `entryPoint` property. This is related to the base image we reference in our Dockerfile. Taking a look once again at the first line of our Dockerfile:

```dockerfile
FROM public.ecr.aws/lambda/nodejs:12
```

Our base image that our container is built from is one from AWS. If we use this as our base image then we will always have

```yaml
      entryPoint:
        - '/lambda-entrypoint.sh'
```
If you use a different base image for your own dockerfile then be sure to use the correct `entryPoint` value.

Other than that, that's it! We are now able to generate our containers, deploy them to ECR and execute functions. However, if you want to centralise creation of docker images outside of the Serverless Framework and just reference them in the serverless.yml, that capability is available too!

#### Building our docker container manually for Lambda

We can build our docker container ahead of time specifically for Lambda and just reference it in our serverless.yml. To start, let's get a small list of requirements out of the way:

1. Ensure Docker CLI is installed: [https://docs.docker.com/get-docker/](https://docs.docker.com/get-docker/)

2. Ensure AWS CLI is installed: [https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-install.html)

We need to use Docker itself to prepare the docker container and then the AWS CLI to push our newly minted container to AWS’s ECR service for use in Lambda. It's just a case of following the steps below.

##### Login Docker to AWS ECR

```
$ aws ecr get-login-password --region <region> | docker login --username AWS --password-stdin <account>.dkr.ecr.<region>.amazonaws.com
```

Just substitute the right region and account ID as needed, and you should see the message "Login Succeeded".

##### Setup a lambda ready Docker image

The easiest way is to rely on base images as provided by AWS. Check AWS ECR Gallery for a list of all available images.

You can pull the chosen image via:
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
Now we can build our image.

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

And that’s it. Pretty easy to get docker containers up and running in the Lambda environment. If there are any questions around using this new feature please make sure to drop by our [Community Slack Workspace](https://serverless.com/slack) or our [forums](https://forum.serverless.com). If you spot any issues then also please drop by the project on GitHub to create an issue.


