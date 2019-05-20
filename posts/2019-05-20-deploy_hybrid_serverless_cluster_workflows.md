---
title: "Using the Serverless framework to deploy hybrid serverless/cluster workflows"
description: "We’ll cover how to use Serverless Framework, AWS Lambda, AWS Step Functions, AWS Fargate and AWS Batch to deploy hybrid serverless/cluster workflows."
date: 2019-05-20
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-05-10-deploy_hybrid_serverless_cluster_workflows/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-05-10-deploy_hybrid_serverless_cluster_workflows/header.png"
category:
  - guides-and-tutorials
authors:
  - RustemFeyzkhanov
---

Serverless infrastructure is becoming ever more popular and a lot of organisations want to benefit from the advantages it provides, such as on demand pricing and scalability. Having said that, it may be hard for an organisation to switch completely from VM and container based workflows to serverless based workflows.

That is why, from my perspective, orchestrators allow us to take the best from both and benefit from the advantages serverless and cluster workflows.

In this post, I’ll cover a method to build a serverless workflow using AWS Lambda as a Serverless processing node, AWS Fargate and AWS Batch as cluster processing nodes and AWS Step Functions as the orchestrator between them.

We will cover the following:

- AWS Batch and AWS Fargate: why they are beneficial and what their differences are.
- AWS Step Functions: how it is different from other ways of connecting services and what the advantages are.
- What are some specific cases where hybrid infrastructure could be beneficial
- Example code which allows us to deploy an AWS Lambda and AWS Fargate solution.
- Example code which allows us to deploy an AWS Lambda and AWS Batch solution.

### AWS Batch and AWS Fargate

AWS Batch and AWS Fargate implement a Container-as-a-Service approach: you just need to define a docker image, some CPU/memory resources and you are good to go.

AWS Batch provides a way to have an on demand ECS cluster which scales according to what you are trying to process. You can use any instance (including GPU) as well as Spot instances, which can save you up to 90% of the cost of on demand instances. The process works in the following way: you send jobs to the jobs queue of AWS Batch and based on the number of jobs it scales the number of instances in the cluster. If the queue is empty it will eventually clear the cluster.

AWS Fargate, on the other hand, is closer to AWS Lambda in terms of organisation. Every job is executed on a single instance which is created just for this job. So while on one hand Fargate scales a lot faster than Batch (10s of seconds vs minutes), it is limited in terms of types of instances. You can only use CPU instances, but you can customize the amount of memory and vCPU available which can help to reduce the cost.

So while both Fargate and Batch provide an on-demand cluster experience, they are very different in terms of how it is organised. If you need specific instances (let's say with GPU), then you will need to use AWS Batch. If you need to have low latency and better scaling, then you will be better off with AWS Fargate.

While both AWS Batch and AWS Fargate are very convenient services for on demand processing, the real game changer came during Re:Invent 2018 when AWS announced native integration to AWS Step Functions.

### AWS Step Functions

One of the challenges of a microservices architecture is communication between different services. There are three broad methods by which services can communicate:
- through synchronous API requests (for example API Gateway)
- through asynchronous messaging between services (for example SQS and SNS)
- through a state machine orchestrator

API requests are great for requests that finish quickly with a limited need for parallelism and asynchronous messaging excels in dealing with longer running processes and a large amount of parallelism. But the biggest advantage of an orchestrator is that it enables the complete specification of every step of a workflow, how it is processed, the state of data between each step (making it a state machine), custom error handling and monitoring jobs processing at scale. The biggest disadvantage of an orchestrator is usually either price or the need to deploy it separately as another piece of infrastructure. Which is where Step Functions comes in.

AWS Step Functions enables us to construct a state machine graph with custom logic, where each processing node can be either AWS Lambda, AWS Batch or AWS Fargate. The Step Function service tracks the completion of the task as well as if an exception occured. It enables us to branch out logic in case of error (with the ability to customize the handling of an error), execute jobs in parallel and implement retry logic.

In summary, AWS Step Functions enables us to combine Serverless processing with container based cluster processing via Batch and Fargate, expanding our capabilities and the options available to us.

### Use cases

#### Machine learning training pipeline

For a machine learning pipeline, we can benefit from the large amount of parallelization AWS Batch or Fargate gives us on our various hyperparameters while still benefitting from storing and comparing results via Serverless Lambda functions

![Machine learning training pipeline](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-05-10-deploy_hybrid_serverless_cluster_workflows/Serverless_Graph-machine+learning+training.png)

#### Machine learning deployment pipeline

A hybrid infrastructure enables to solve a number of issues which occur during the implementation of a machine learning deployment pipeline:

- A modular approach which enables to combine multiple models and frameworks into one pipeline.
- A/B testing which allows us to compare model performance, to ensure the best model goes into production.
- Scalable inference allows us to run batches in parallel which increases the speed of processing.

![Machine learning deployment pipeline](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-05-10-deploy_hybrid_serverless_cluster_workflows/Serverless_Graph-Machine+learning+deployment.png)

#### Data pipeline

A data pipeline can utilize hybrid infrastructure to modularize the processing parts into several types of modules. Modules which can be easily parallelized can be processed through AWS Lambdas, modules which need to be processed through GPU instances can use AWS Batch and modules which require long processing times can utilize AWS Fargate.

![Data pipeline](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-05-10-deploy_hybrid_serverless_cluster_workflows/Serverless_Graph-data+pipeline.png)

### Pushing Docker container image to ECR

Let's start with downloading code from the repo. We will create an example docker image and publish it to ECR.

**Prerequisites:** You will need to have docker and AWS CLI installed

```bash
git clone https://github.com/ryfeus/stepfunctions2processing.git

cd docker

docker build -t stepfunctiontest .

$(aws ecr get-login --no-include-email --region us-east-1)

aws ecr create-repository --repository-name stepfunctiontest

docker tag stepfunctiontest:latest <accountid>.dkr.ecr.us-east-1.amazonaws.com/stepfunctiontest:latest

docker push <accountid>.dkr.ecr.us-east-1.amazonaws.com/stepfunctiontest:latest
```

### Example code for AWS Fargate

#### 4 line example
Let’s get started with an AWS Fargate example. We’ll use the following stack:
- AWS Lambda and AWS Fargate for processing
- Serverless framework for handling deployment and configuration

To get started, you’ll need to [have the Serverless Framework installed](https://serverless.com/framework/docs/providers/aws/guide/installation/). 

Run the following commands from the root folder of the cloned repository.

```bash
cd aws-fargate

npm install

serverless deploy

```

You’ll receive the following response:

```
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service StepFunctionFargate.zip file to S3 (32.58 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
......................................................................................................
Serverless: Stack update finished...
Service Information
service: StepFunctionFargate
stage: dev
region: us-east-1
stack: StepFunctionFargate-dev
resources: 34
api keys:
  None
endpoints:
functions:
  branch: StepFunctionFargate-dev-branch
  map: StepFunctionFargate-dev-map
  reduce: StepFunctionFargate-dev-reduce
layers:
  None
Serverless StepFunctions OutPuts
endpoints:
  GET - https://<api-prefix>.execute-api.us-east-1.amazonaws.com/dev/startFunction
```

Visit the console to confirm your new Step Functions state machine was created (https://console.aws.amazon.com/states/home) and you can invoke it using output endpoint.

#### Code decomposition

The configuration file consists of the following parts:

- `functions` which contain information about the Lambdas which are used
- `stepFunctions` which contains description of the state machine graph
- `resources` where AWS Fargate is defined. You can adjust the parameters section to adapt the config to your needs.

### Example code for AWS Batch


#### 4 line example
Let’s get started with AWS Batch example. We’ll use the following stack:
- AWS Lambda and AWS Batch for processing
- Serverless framework for handling deployment and configuration

To get started, you’ll need to [have the Serverless Framework installed](https://serverless.com/framework/docs/providers/aws/guide/installation/). 

Run the following commands from the root folder of the cloned repository.

```bash
cd aws-batch

npm install

serverless deploy
```

You’ll receive the following response:

```
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service StepFuncBatch.zip file to S3 (33.21 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.......................................................................................
Serverless: Stack update finished...
Service Information
service: StepFuncBatch
stage: dev
region: us-east-1
stack: StepFuncBatch-dev
resources: 29
api keys:
  None
endpoints:
functions:
  branch: StepFuncBatch-dev-branch
  map: StepFuncBatch-dev-map
  reduce: StepFuncBatch-dev-reduce
layers:
  None
Serverless StepFunctions OutPuts
endpoints:
  GET - https://<api-prefix>.execute-api.us-east-1.amazonaws.com/dev/startFunction
```

Visit the console to confirm your new Step Functions state machine was created (https://console.aws.amazon.com/states/home) and you can invoke it using output endpoint.

#### Code decomposition

Configuration file consists of the following parts:

- `functions` which contains information about Lambdas which are used
- `stepFunctions` which contains description of the execution graph
- `resources` where AWS Batch is defined. You can adjust the parameters section to adapt the config to your needs.

### Conclusion

We’ve created two processing workflows with AWS Step functions, AWS Batch, AWS Fargate and AWS Lambda via the Serverless Framework. Setting everything up was extremely easy, and saved us a lot of time. By modifying the serverless YAML file, you can change configuration of state machine graph to accomplish whichever task you need.

Feel free to check the project repository at https://github.com/ryfeus/stepfunctions2processing.

I’m excited to see how others are using Serverless to empower their development. Feel free to drop me a line in the comments, and happy developing!
