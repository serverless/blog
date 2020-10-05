---
title: Serverless V1.0 Alpha 1
description: "Introducing the serverless service concept in the serverless framework v1 alpha"
date: 2016-06-28
layout: Post
thumbnail: https://avatars1.githubusercontent.com/u/13742415?v=3&s=200
authors:
  - PhilippMuns
---

![v1alpha1](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/06/v1alpha1-1.gif) **We've released Alpha-2 in the meantime, please check out the [corresponding post](http://blog.serverless.com/serverless-v1-0-alpha-release-2/) as there are changes to how things are presented in this blogpost.** After giving you a little more insight into our thoughts regarding the future of Serverless and event driven infrastructure in general in our [last blogpost](http://blog.serverless.com/building-serverless-framework-v1/) we’re happy to release the first alpha of Serverless V1.0 today. Serverless Framework V.1 features strong extensibility through a new [Plugin System](https://github.com/serverless/serverless/tree/v1.0/docs/using-plugins) and the ability to work with multiple providers from the start, though this release focuses purely on AWS.  We already have most of the functionality that was available in 0.x reimplemented with many optimizations to the developer experience going forward. With all those new plans coming we decided that this is our time to introduce breaking changes, so from V1.0 onwards we can improve incrementally. We will provide more information, documentation and direct help to our community going forward to transition from 0.X of Serverless to 1.x. The new system is very easy to set up and should be fast to reconfigure. We will release more alpha versions over the next weeks and months until we finally release the stable version of Serverless V1.0\. We want to include you early on in this process for feedback and you can see the direction and help us on the way. We already have most of the functionality that was available in 0.x reimplemented and will put a special focus on developer tooling and developer experience going forward. With all of that said let's dig into Setting up a new “serverless service”, a new and fundamental concept in V.1.

## Introducing The “Serverless Service”

A “serverless service” is one or multiple functions (FaaS, Lambda, etc.), grouped together, with their resource/infrastructure requirements.  Services should only contain functions that are related (e.g., functions for CRUD operations on a data resource, or functions for a workflow, like a data processing pipeline), or functions that all depend on the same infrastructure resource (e.g., DynamoDB table, S3 bucket).   By grouping these related functions together, they are easier to develop and deploy.  These services are also designed to be autonomous units, which helps teams involved in larger projects own and work on serverless services independently, without blocking each other.   In Serverless Framework V.1, there are only services, instead of projects or single functions.  The “serverless service” represents the optimal level of organization.

## Setting up Serverless Service

We will walk you through all the steps necessary to set up a service with AWS as the provider, invoke it, add events and custom resources and then remove it again. For more detailed documentation you can check out [our docs](http://v1.docs.serverless.com). At first we need to install serverless of course. You can do this by running the following command. It will automatically install the latest Alpha version of Serverless.

```sh
npm install -g serverless@alpha
```

To get an overview on the available commands and the plugins that are currently loaded you can check out the help:

```bash
serverless --help
```

![Screenshot 2016-06-24 15.05.29](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/06/Screenshot-2016-06-24-15.05.29.png)

## Create a new Service

Let's create a new service. You need to set the **nam****e** and **provider** for a specific service.

```bash
serverless create --name first-service --provider aws
```

This will create a subfolder **first-service** with the necessary files for your Node.js service. At the moment we only support Node.js in this alpha, but other languages will follow. ![Screenshot 2016-06-24 15.05.05](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/06/Screenshot-2016-06-24-15.05.05.png) This will create the following simple serverless.yml file for deployment, the file that declares and describes a serverless service:

```yaml
service: first-service
provider: aws
functions:
  hello:
    handler: handler.hello
```

## Deploy the Service

Now that we have created the new service lets deploy it to AWS. The new implementation of Serverless on AWS builds completely on CloudFormation. When we deploy a serverless service, a new CloudFormation stack gets created and functions get updated through that Stack. You can check out the details of the AWS Deployment [in our documentation](https://github.com/serverless/serverless/tree/v1.0/lib/plugins/aws/deploy).

```bash
serverless deploy
```

Following is the log output during the deployment. We’re also working on having a little nicer output during the deployment so we don’t repeat the same message: ![Screenshot 2016-06-24 16.03.09](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/06/Screenshot-2016-06-24-16.03.09.png)

## Invoke the function with test data

Now we can invoke the function with some test data and see the results. We’re going to use the following json file for that

```js
{"data": "Brent Spiner"}
```

```sh
serverless invoke --function hello --path testfile.json
```

![Screenshot 2016-06-24 16.08.38](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/06/Screenshot-2016-06-24-16.08.38.png)

## Add other Events and Custom Resources

The serverless.yml doesn’t just allow you to add your functions, but also add events and custom resources to your stack. Events will be automatically translated into CloudFormation Resources. The resources section lets you define a custom CloudFormation template that we will use and extend, so you have full control over the infrastructure that is deployed. In the following example we’ve added a schedule event that will run the function every 10 minutes and an S3 bucket as a custom resource. You can read all about the events we currently support in our [AWS Events documentation](https://github.com/serverless/serverless/blob/v1.0/docs/using-plugins/core-plugins.md)

```yml
service: first-service
provider: aws
functions:
  hello:
    handler: handler.hello
    events:
      - schedule: rate(10 minutes)
resources:
  Resources:
    MyBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName : "myserverlessbucket"
```

After redeploying the service the function will be called every 10 minutes and the bucket will be created.

## Remove A Service

Of course you can also remove a serverless service, which will remove the whole CloudFormation template, so nothing stays behind:

```sh
serverless remove
```

![Screenshot 2016-06-24 16.28.50](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/legacy/2016/06/Screenshot-2016-06-24-16.28.50.png)

## Next Steps for Serverless Framework V.1

Now that we’ve walked you through setting up a serverless service lets talk about the next steps we have planned.

### Multi Provider Support

We’re currently working with Google Cloud Functions, Microsoft Azure, IBM OpenWhisk and others to bring Serverless to many more providers. We believe the future of cloud infrastructure is cross provider and we want to make sure you have the same great experience with every one of them. Each provider has their own advantages and disadvantages and with the simplicity of Function as a Service and Serverless Architectures we’re getting to a place where it's possible to use all of them together.

### Local Developer Tooling

We want our community to have the best local developer experience possible. From working on services offline to easily and automatically deploying them into your functions while developing. With great insights into logs and metrics and good debugging support we will make sure you really know and understand your functions and your infrastructure while you’re developing it. Now that we have the first iteration of the serverless tooling out there this is one of the most important steps we want to take.

## How to Contribute

With that first release of Serverless V1.0 we want to get more feedback from the community. Please help us by testing it, playing around with it, breaking it and reporting back to us. Create new issues in our [Github repo issues](http://github.com/serverless/serverless/issues) and report any ideas that you have for V1.0. You can join our [Gitter chat](http://chat.serverless.com) to discuss with us and the community about Serverless, our next steps and get help and support. We are currently planning all the milestones until the V1 release so keep an eye on the next milestones that are coming up in the repository if you want to help out contributing code. We’d love to have you as as part of our project. If you have any further question you can also simply email me at [florian@serverless.com](mailto:florian@serverless.com). Happy to point you in the best direction to chat.

## Conclusions

We’re very excited for this first release. It's the start of a very exciting future we have in mind for Serverless and for our Community. We couldn’t do it without you and hope for your help in moving Serverless forward. And we will work hard to give you the best tools and services for building your infrastructure and products.
