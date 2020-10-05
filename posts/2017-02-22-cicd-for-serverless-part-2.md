---
title: CICD for Serverless Part 2 - AWS CodePipeline Integration
description: Part 2 of 2 on how to implement a CICD workflow for a Serverless project
date: 2017-02-22
thumbnail: https://cloud.githubusercontent.com/assets/20538501/23097096/d7ff7a34-f5f0-11e6-9416-6aefd5f3dbe0.png
category:
  - operations-and-observability
authors:
  - PeteJohnson
---
[My last post](https://serverless.com/blog/cicd-for-serverless-part-1/) showed you how to use Mocha to automate endpoint testing for a service with multiple methods created and deployed using the Serverless Framework. It's possible for Test-Driven Development (TDD) to be practiced in the serverless world from a command line on a developer's local machine. But what if you have a team of developers that are constantly merging branches back into master and you want to set up automated testing and deployment using a Continuous Integration/Continuous Deployment (CICD) toolchain? Keep reading and you'll find out!

Here we're still using the same [Todo list example the folks at the Serverless Framework created](https://github.com/serverless/examples) as our codebase. But with some variations so that it more cleanly supports automated testing and the CICD toolchain used - [AWS CodePipeline](https://aws.amazon.com/codepipeline/).

**At a high level the whole thing looks like this:**

![Serverless CICD Diagram](https://s3.amazonaws.com/analyzer.fmlnerd.com/img/ServerlessCICDmed.png)

## Code Differences From The Original Todo
In Part 1, I neglected to get into the details of what I had to change for the original Todo codebase to get it to function more cleanly for automated testing. Let's explore that here.

First, two of the five methods in our service perform writes.  Specifically [create.js](https://github.com/nerdguru/serverlessTodos/blob/master/src/todos/create.js) and [update.js](https://github.com/nerdguru/serverlessTodos/blob/master/src/todos/update.js). The issue with automating the testing, especially for the create, is that the original version wasn't returning the UUID for the newly created Todo. That meant in order to verify that the write occurred correctly, testing code would have to do a list and scan for matching Todo content.

The first change, then, is to return the entire JSON of the newly created Todo. For clarity, I kept the old code commented out, so the new lines 38-44 look like this:

```js
// create a response
const response = {
    statusCode: 200,
    // PCJ: Minor change from original, return full item inserted instead of empty result
    // body: JSON.stringify(result.Item),
    body: JSON.stringify(params.Item),
};
```

For consistency's sake, the same was done for the update.

Next, the original code hard-coded the DynamoDB table name in every method handler and again in `serverless.yml` for the creation of that table. It's possible to deploy multiple versions of your service on different branches with the same AWS account where one is your working copy if you use the local execution method on one while the other is based on a master branch that is executing in AWS CodePipeline. You just need to be a little more creative with the table naming mechanic.

In the method handlers, in the constant set up to pass parameters to DynamoDB, you'll see a change similar to this one found in the create handler:

```js
const params = {
    // PCJ: Minor change from original, use environment variable for stage sensitive table name
    TableName: process.env.TABLE_NAME,
    Item: {
        id: uuid.v1(),
        text: data.text,
        checked: false,
        createdAt: timestamp,
        updatedAt: timestamp,
    },
};
```

So now, the database table name gets pulled from the `TABLE_NAME` environment variable, which is getting set in the `serverless.yml` file based on the stage defined for the deployment:


```yml
provider:
  name: aws
  runtime: nodejs4.3
  environment:
    TABLE_NAME: todos-${opt:stage, self:provider.stage}
```

I'm really liking the relatively new syntax for multiple `serverless.yml` variable references for a single evaluation, BTW.

## Creating the CodePipeline and Explaining the AWS CodeBuild buildspec.yml file
I chose to use AWS CodePipeline since it was newly announced at AWS re:Invent in December. The [CodePipeline Execution readme](https://github.com/nerdguru/serverlessTodos/blob/master/docs/codePipeline.md) in my repo describes how you can set that up step-by-step. Future versions will automate this set up, but CodePipeline is new enough and the oAuth integration with GitHub wasn't straight forward to script. So for now I've got a lot of screenshots for a manual process instead.

At the center of the automation is AWS CodeBuild and its `buildspec.yml` file. In our example, that file looks like this:

```yml
version: 0.1
phases:
  install:
    commands:
      - npm install
      - npm install -g mocha
      - npm install -g serverless
  build:
    commands:
      - serverless deploy --stage cicd | tee deploy.out
  post_build:
    commands:
      - . ./test.sh
```

Here we've defined three of the standard phases that CodeBuild supports: *install, build,* and *post_build*. From steps performed in the Local Execution from last time, the commands for each phase should look familiar. The various dependencies are set up during *install*.

During *build*, the Serverless Framework command line is used to deploy our service with a stage called "cicd" that shouldn't name clash with the default "dev" most likely used during Local Execution. The results are piped to deploy.out so that the endpoint name can be picked up by the *post_build* testing script that then runs the same Mocha tests as before.

## Results and Gotchas

After you complete all the steps, you should be greeted with something similar to:

![CodePipeline Goodness](https://s3.amazonaws.com/analyzer.fmlnerd.com/img/completedPipeline.jpg)

If you aren't, CodeBuild provides excellent detailed logging via CloudWatch - although it takes a couple of clicks to get there. The most likely causes of failure have to do with CloudFormation failing for one reason or another. I found that when that happens, an unfortunate side effect is that you have to manually delete the CloudFormation stack and possibly the DynamoDB table.

Once over that hump, though, you can simply check changes into the branch you associated with your CodePipeline and all the automation kicks in to test and deploy your service!
