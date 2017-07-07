---
title: Building a REST API in Node.js with AWS Lambda, API Gateway, DynamoDB, and Serverless Framework
description: A hands-on tutorial on building a REST API in Node.js using AWS Lambda, API Gateway, DynamoDB, and the Serverless Framework .
date: 2017-03-31
thumbnail: https://cloud.githubusercontent.com/assets/20538501/24562572/cc34ee56-1610-11e7-9b5b-3127a08296df.png
layout: Post
authors:
  - ShekharGulati
---

Serverless means different things depending on the context. It could mean using third party managed services like Firebase, or it could mean an event-driven architecture style. It could mean next generation compute service offered by cloud providers, or it could mean a framework to build Serverless applications.

In this tutorial, you'll learn how to build a REST API following the Serverless approach using AWS Lambda, API Gateway, DynamoDB, and the Serverless Framework. AWS Lambda is the third compute service from Amazon. It's very different from the existing two compute services EC2 (Elastic Compute Cloud) and ECS (Elastic Container Service). AWS Lambda is an event-driven, serverless computing platform that executes your code in response to events. It manages the underlying infrastructure scaling it up or down to meet the event rate. You're only charged for the time your code is executed. AWS Lambda currently supports Java, Python, and Node.js language runtimes. 

> This tutorial is part of my [open-source hands-on guide to build real world Serverless applications](https://github.com/shekhargulati/hands-on-serverless-guide/tree/master/01-aws-lambda-serverless-framework) by Shekhar Gulati, senior technologist at Xebia. You can refer to the [guide for in-depth coverage on building Serverless applications](https://github.com/shekhargulati/hands-on-serverless-guide/tree/master/01-aws-lambda-serverless-framework).

## Application: Lambda Coding Round Evaluator

In my current organization, one of the interview rounds is a coding round. The candidate is emailed an assignment that he/she has to submit in a week's time. The assignment is then evaluated by an existing employee who makes the decision on whether the candidate passed or failed the round. I wanted to automate this process so that we can filter out unsuitable candidates without any human intervention. A task that can be automated should be automated. This is how the flow will work:

1. Recruitment team submits candidate details to the system.
2. System sends an email with assignment zip to the candidate based on candidate skills and experience. The zip contains the problem as well as a Gradle or Maven project.
3. Candidate writes the code and submits the assignment using Maven or Gradle task like `gradle submitAssignment`. The task zips the source code of the candidate and submits it to the system.
4. On receiving assignment, systems builds the project and run all test cases. 
   1. If the build fails, then candidate status is updated to failed in the system and recruitment team is notified. 
   2. If the build succeeds, then we find the test code coverage and if it's less than a certain threshold we mark the candidate status to failed and recruitment team is notified.
5. If build succeeds and code coverage is above a certain threshold, then we run static analysis on the code to calculate the code quality score. If code quality score is below a specified threshold then candidate is marked failed and notification is sent to the recruitment team. Otherwise, the candidate passes the round and a human interviewer will now evaluate candidate assignment.

In this tutorial, we will only build a REST API to store candidate details. Please refer to the [guide](https://github.com/shekhargulati/hands-on-serverless-guide/tree/master/01-aws-lambda-serverless-framework) to learn how to build the full application from scratch. Also, source code for the application is available on [Github](https://github.com/xebiaww/lambda-coding-round-evaluator). 

## Prerequisite

To go through this tutorial you will need following:

1. AWS account
2. Node.js
3. AWS CLI and configure it

## What is the Serverless Framework?

The Serverless Framework makes it easy to build applications using AWS Lambda. It is multi-provider framework, which means you can use it to build Serverless applications using other providers as well. For AWS, Serverless relies on CloudFormation to do the provisioning. It also scaffolds the project structure and takes care of deploying functions.

## Getting Started with the Serverless Framework

To install Serverless on your machine, run the below mentioned npm command.

```shell
$ npm install serverless -g
```

This will install Serverless command-line on your machine. You can use `sls` alias instead of typing `serverless` as well.

Now, we will build the application in a step by step manner.

## Step 1: Create a Node.js Serverless Project

Navigate to a convenient location on your filesystem and create a directory `coding-round-evaluator`.

```shell
$ mkdir coding-round-evaluator && cd coding-round-evaluator
```

Once inside the `coding-round-evaluator` directory, we'll scaffold our first microservice for working with candidates. This will be responsible for saving candidate details, listing candidates, and fetching a single candidate details.

```shell
$ serverless create --template aws-nodejs --path candidate-service --name candidate
```

This will create a directory `candidate-service` with the following structure.

```bash
.
├── .npmignore
├── handler.js
└── serverless.yml
```

Let's look at each of these three files one by one.

1. **.npmignore**: This file is used to tell npm which files should be kept outside of the package. 
2. **handler.js**: This declares your Lambda function. The created Lambda function returns a body with `Go Serverless v1.0! Your function executed successfully!` message. 
3. **serverless.yml**: This file declares configuration that Serverless Framework uses to create your service. serverless.yml file has three sections — provider, functions, and resources.
   1. provider: This section declares configuration specific to a cloud provider. You can use it to specify name of the cloud provider, region, runtime etc.
   2. functions: This section is used to specify all the functions that your service is composed off. A service can be composed of one or more functions.
   3. resources: This section declares all the resources that your functions use. Resources are declared using AWS CloudFormation.

## Step 2: Create a REST Resource for Submitting Candidates

Next, we'll update serverless.yml as shown below. 

```yaml
service: candidate-service

frameworkVersion: ">=1.1.0 <2.0.0"

provider:
  name: aws
  runtime: nodejs4.3
  stage: dev
  region: us-east-1

functions:
  candidateSubmission:
    handler: api/candidate.submit
    memorySize: 128
    description: Submit candidate information and starts interview process.
    events:
      - http: 
          path: candidates
          method: post
```
Let's go over the YAML configuration:

1. We defined name of the service -- `candidate-service`. Service name has to be unique for your account.
2. Next, we defined framework version range supported by this service.
3. Next, we defined configuration of the cloud provider. As we are using AWS so we defined AWS corresponding configuration.
4. Finally, we defined `candidateSubmission` function. In the configuration shown above, we declared that when the HTTP POST request is made to `/candidates` then `api/candidate.submit` handler should be invoked. We also specified memory we want to allocate to the function.

Now, create a new directory `api` inside the `candidate-service` directory. Move the `handler.js` to the `api` directory. Rename `handler.js` to `candidate.js` and rename `handle` to `submit`.

```javascript
'use strict';

module.exports.submit = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };

  callback(null, response);

};
```

To deploy the function, execute `serverless deploy` command. 

```shell
$ sls deploy
```

```bash
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading service .zip file to S3 (524 B)...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
....................................
Serverless: Stack update finished...
Service Information
service: candidate
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  POST - https://05ccffiraa.execute-api.us-east-1.amazonaws.com/dev/candidates
functions:
  candidate-dev-candidateSubmission
```

Now, POST operation of your service is available. You can use tools like cURL to make a POST request.

```shell
$ curl -X POST https://05ccffiraa.execute-api.us-east-1.amazonaws.com/dev/candidates
```

```
{"message":"Go Serverless v1.0! Your function executed successfully!", "input":{...}}
```

## Step 3: Saving Data to DynamoDB

Now that we are able to make HTTP POST request to our API let's update the code so that data can be saved to DynamoDB. We'll start by adding `iamRoleStatemements` to `serverless.yml`. This defines which actions are permissible.

```yaml
provider:
  name: aws
  runtime: nodejs4.3
  stage: dev
  region: us-east-1
  environment:
    CANDIDATE_TABLE: ${self:service}-${opt:stage, self:provider.stage}
    CANDIDATE_EMAIL_TABLE: "candidate-email-${opt:stage, self:provider.stage}"
  iamRoleStatements:
    - Effect: Allow
      Action:
        - dynamodb:Query
        - dynamodb:Scan
        - dynamodb:GetItem
        - dynamodb:PutItem
      Resource: "*"
```

Next, we'll create a resource that will create DynamoDB table as shown below.

```yaml
resources:
  Resources:
    CandidatesDynamoDbTable:
      Type: 'AWS::DynamoDB::Table'
      DeletionPolicy: Retain
      Properties:
        AttributeDefinitions:
          -
            AttributeName: "id"
            AttributeType: "S"   
        KeySchema:
          -
            AttributeName: "id"
            KeyType: "HASH"
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
        StreamSpecification:
          StreamViewType: "NEW_AND_OLD_IMAGES"
        TableName: ${self:provider.environment.CANDIDATE_TABLE}
```

Now, install a couple of node dependencies. These will be required by our code. 

```Shell
$ npm install --save bluebird
$ npm install --save uuid
```

Update the `api/candidate.js` as shown below.

```javascript
'use strict';

const uuid = require('uuid');
const AWS = require('aws-sdk'); 

AWS.config.setPromisesDependency(require('bluebird'));

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports.submit = (event, context, callback) => {
  const requestBody = JSON.parse(event.body);
  const fullname = requestBody.fullname;
  const email = requestBody.email;
  const experience = requestBody.experience;

  if (typeof fullname !== 'string' || typeof email !== 'string' || typeof experience !== 'number') {
    console.error('Validation Failed');
    callback(new Error('Couldn\'t submit candidate because of validation errors.'));
    return;
  }

  submitCandidateP(candidateInfo(fullname, email, experience))
    .then(res => {
      callback(null, {
        statusCode: 200,
        body: JSON.stringify({
          message: `Sucessfully submitted candidate with email ${email}`,
          candidateId: res.id
        })
      });
    })
    .catch(err => {
      console.log(err);
      callback(null, {
        statusCode: 500,
        body: JSON.stringify({
          message: `Unable to submit candidate with email ${email}`
        })
      })
    });
};


const submitCandidateP = candidate => {
  console.log('Submitting candidate');
  const candidateInfo = {
    TableName: process.env.CANDIDATE_TABLE,
    Item: candidate,
  };
  return dynamoDb.put(candidateInfo).promise()
    .then(res => candidate);
};

const candidateInfo = (fullname, email, experience) => {
  const timestamp = new Date().getTime();
  return {
    id: uuid.v1(),
    fullname: fullname,
    email: email,
    experience: experience,
    submittedAt: timestamp,
    updatedAt: timestamp,
  };
};
```

Now, you can deploy the function as shown below.

```shell
$ serverless deploy -v
```

This will create the DynamoDB table.

To test the API, you can use cURL again.

```bash
$ curl -H "Content-Type: application/json" -X POST -d '{"fullname":"Shekhar Gulati","email": "shekhargulati84@gmail.com", "experience":12}' https://05ccffiraa.execute-api.us-east-1.amazonaws.com/dev/candidates
```

The response you'll receive from the API is shown below.

```json
{
  "message":"Sucessfully submitted candidate with email shekhargulati84@gmail.com",
 "candidateId":"5343f0c0-f773-11e6-84ed-7bf29f824f23"
}
```

## Step 4: Get All Candidates

Define a new function in the serverless.yml as shown below.

```yaml
  listCandidates:
    handler: api/candidate.list
    memorySize: 128
    description: List all candidates
    events:
      - http: 
          path: candidates
          method: get  
```

Create new function in the `api/candidate.js` as shown below.

```javascript
module.exports.list = (event, context, callback) => {
    var params = {
        TableName: process.env.CANDIDATE_TABLE,
        ProjectionExpression: "id, fullname, email"
    };

    console.log("Scanning Candidate table.");
    const onScan = (err, data) => {

        if (err) {
            console.log('Scan failed to load data. Error JSON:', JSON.stringify(err, null, 2));
            callback(err);
        } else {
            console.log("Scan succeeded.");
            return callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    candidates: data.Items
                })
            });
        }

    };

    dynamoDb.scan(params, onScan);

};
```

Deploy the function again.

```
$ sls deploy
```

Once deployed you will be able to test the API using cURL.

## Step 5: Get Candidate Details by ID

Define a new function in serverless.yml as shown below.

```Yaml
  candidateDetails:
    handler: api/candidate.get
    events:
      - http:
          path: candidates/{id}
          method: get
```

Define a new function in `api/candidate.js`

```javascript
module.exports.get = (event, context, callback) => {
  const params = {
    TableName: process.env.CANDIDATE_TABLE,
    Key: {
      id: event.pathParameters.id,
    },
  };

  dynamoDb.get(params).promise()
    .then(result => {
      const response = {
        statusCode: 200,
        body: JSON.stringify(result.Item),
      };
      callback(null, response);
    })
    .catch(error => {
      console.error(error);
      callback(new Error('Couldn\'t fetch candidate.'));
      return;
    });
};
```

Now, you can test the API using cURL.

```bash
curl https://05ccffiraa.execute-api.us-east-1.amazonaws.com/dev/candidates/5343f0c0-f773-11e6-84ed-7bf29f824f23
{"experience":12,"id":"5343f0c0-f773-11e6-84ed-7bf29f824f23","email":"shekhargulati84@gmail.com","fullname":"Shekhar Gulati","submittedAt":1487598537164,"updatedAt":1487598537164}
```


## Working with Local DynamoDB

Download the jar and run locally.

## Invoking Functions Locally and Remotely

```
sls invoke local -f function-name -p event.json
```

## Tailing the Logs

```
sls logs -f candidateDetails -t
```

## Conclusion

In this part, you learned how to create a REST API with the Serverless Framework. To learn more read the [guide](https://github.com/shekhargulati/hands-on-serverless-guide/blob/master/01-aws-lambda-serverless-framework/01-introduction-to-serverless.md).
