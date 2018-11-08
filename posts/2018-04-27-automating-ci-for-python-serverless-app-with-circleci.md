---
title: Automating a CI workflow for a Python serverless app with CircleCI
description: An end-to-end look at continuous integration with Python, Serverless and CircleCI.
date: 2018-04-27
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd/circleci-post.png
category:
  - operations-and-observability
  - guides-and-tutorials
heroImage: ''
authors:
  - RupakGanguly
---

I had previously written [a post that defined the CI/CD process](https://serverless.com/blog/ci-cd-workflow-serverless-apps-with-circleci/), discussed various deployment patterns, created a NodeJS app, and automated the end-to-end CI flow.

In this post, I will be doing that same thing for Python. We'll build a Python app and go over the end-to-end process for automating the CI flow.

We will cover:

* Creating a Python app
* Writing testable code
* Preparing for CI automation
* Implementing the CI workflow

But first, I'll do a quick overview of the CI/CD process. If you already know some CI/CD basics, then you'll probably want to skip straight to [creating the app](#creating-the-app).

# CI/CD Overview

In an agile development environment, small teams work autonomously and add a lot of churn to the code base. Each developer works on different aspects of the project and frequently commits code.

This is a healthy practice, but it comes with some challenges. Without close watch and proper communication about changes, the updates can cause existing code to break. To minimize manual scrutiny and redundant communication across teams, we need to invest in automating CI/CD processes.

![The CI/CD Process Flow](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd/cicd-process.gif)

*The CI/CD Process Flow*

## Continuous Integration

The CI process starts with the developer checking code into a code repository. The developer makes their code changes in a local branch, then adds units tests and integration tests. They ensure that the tests don't lower the overall code coverage. It's possible to automate this process by having a common script that can run the unit tests, integration tests, and code coverage.

Once the code is tested in the context of the local branch, the developer needs to merge the master branch into their local branch, and then run the tests/code coverage again. The above process happens repeatedly for every code commit, and thereby continuously integrates the new code changes into the existing codebase.

# Creating the app

Now that we've gone over some basics, let's get started!

**Note:** We won't be covering the basics of creating a serverless Python app, but you can get an idea by reading [this post about ETL job processing](https://serverless.com/blog/etl-job-processing-with-serverless-lambda-and-redshift/).

Let's cut to the chase and install the sample app from the [source repo](https://github.com/rupakg/python-ci) using the Serverless Framework like so:

```bash
$ sls install --url https://github.com/rupakg/python-ci
$ cd python-ci
```

Having proper tests in place safeguards against subsequent code updates. We'd like to run tests and code coverage against our code. If the tests pass, we'll deploy our app.

It's this—running tests against our code whenever new code is committed—that allows for continuous integration.

# Testable Code

[We have some tests](https://github.com/rupakg/python-ci/blob/master/tests/test_helloworld.py) that we'll run as part of the testing phase. Notice that we have a test that tests if our function is being called.

We are also separating out the actual testable logic of our function into a class:

```python
# hw/helloworld.py

class HelloWorld:
    def say_hello(self, event):
        return {
            "message": "Go Serverless v1.0! Your function executed successfully!",
            "input": event
        }
```

The `handler.py` code is refactored to use the above `say_hello` method from the `HelloWorld` class:

```python
# handler.py

from hw.helloworld import HelloWorld
import json

def hello_world(event, context):
    world = HelloWorld()

    response = {
        "statusCode": 200,
        "body": json.dumps(world.say_hello(event))
    }

    return response
```

This makes testing the core logic of the app easy, and also decouples it from the provider-specific function signature.

## Running Tests

Now that our tests are written up, let's run them locally before we include them as part of our CI/CD process.

For running tests we will use [nose](https://nose.readthedocs.io/en/latest/). We add the `--with-coverage` flag to run the test with code coverage. (Remember, you will need [coverage.js](https://coverage.readthedocs.io/en/coverage-4.5.1/) installed to use coverage.)

```bash
$ nosetests --with-coverage
```

The tests results look like this in the terminal:

```bash
..
Name               Stmts   Miss  Cover
--------------------------------------
handler.py             6      0   100%
hw/__init__.py         0      0   100%
hw/helloworld.py       3      0   100%
_bootlocale.py        17     17     0%
--------------------------------------
TOTAL                 26     17    35%
----------------------------------------------------------------------
Ran 2 tests in 0.061s

OK
```

Alternatively, you could also run code coverage with the `--cover-html` flag to get a nice visual chart of the code coverage as shown below:

```bash
$ nosetests --with-coverage --cover-html
```

The above command creates an html representation of the coverage metrics in the default folder `cover`, and looks like so:

![Coverage](https://user-images.githubusercontent.com/8188/39218547-48cb51b6-47f3-11e8-9186-c828b75df567.png)

## Excluding Testing Artifacts

After running the tests, you should see that a `.coverage` folder has been created. If you run the visual code coverage command, the `cover` folder will be created as well. You'll also have a `.circleci` folder—that one is required to enable build automation with CircleCI.

When we deploy our serverless app via the Serverless Framework, all the files in your current folder will be zipped up and be part of the deployment to AWS.

Since the `coverage`, `cover`, and `.circleci` files are not necessary for running our app, let's exclude them from our final deployment by excluding them in our `serverless.yml` file:

```yaml
# exclude the code coverage files and circle ci files
package:
  exclude:
  - .coverage
  - cover/**
  - .circleci/**
```
**Note:** See more details on [packaging options](https://serverless.com/framework/docs/providers/aws/guide/packaging) with the Serverless Framework.

# Preparing for CI Automation

We'll be using [CircleCI](https://circleci.com) for automating the CI/CD pipeline for our `python-ci` app.

Let's get everything ready to go.

## Setting up a CircleCI Account

[Sign up](https://circleci.com/docs/2.0/first-steps/) for a CircleCI account if you don't already have one. As part of the sign-up process, we'll authorize CircleCI to access our public Github repo so that it can run builds.

## Creating an AWS IAM User

It is a good practice to have a separate IAM user just for the CI build process. We'll create a new IAM user called `circleci` in the AWS console. Give the user programmatic access and save the AWS credentials, which we'll use later to configure our project in CircleCI.

**Note:** More on [setting up IAM users here](https://serverless.com/blog/abcs-of-iam-permissions/).

## Configuring CircleCI with AWS Credentials

We have to configure AWS credentials with CircleCI in order to deploy our app to AWS.

Go to your project `python-ci` -> Project Settings -> AWS Permissions, and add your AWS credentials for the `circleci` IAM user we created earlier.

![Adding AWS credentials](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd/circleci-aws-perms.png)

# End-to-End Automation

Now that we've completed our CircleCI setup, let's work on implementing the CI/CD workflow for our project.

## Configuration
We'll configure CircleCI via a config file named `config.yml` and keep it in the `.circleci` directory. Explanation of how CircleCI works is out of scope for this article, but we'll look at the steps needed to automate our deployments.

**Note:** If you want some further reading, CircleCI introduces concepts of [Jobs](https://circleci.com/docs/2.0/sample-config/#jobs-overview), [Steps](https://circleci.com/docs/2.0/sample-config/#steps-overview) and [Workflows](https://circleci.com/docs/2.0/workflows/).

CircleCI allows for multiple jobs with multiple steps, all orchestrated via a workflow. But to keep things simple, we're going to keep everything within one job and one step.

Here is a snippet of the config file that we'll use:

```yaml
# Javascript Node CircleCI 2.0 configuration file

version: 2
jobs:
  build:
    working_directory: ~/python-ci

    docker:
      # specify the version you desire here
      - image: circleci/python:3.6.1

    steps:
      - checkout

      # Download and cache dependencies
      - restore_cache:
          keys:
            - dependencies-node-{{ checksum "package.json" }}
            # fallback to using the latest cache if no exact match is found
            - dependencies-node

      - run:
          name: Install python test dependencies
          command: |
            sudo pip install nose
            sudo pip install coverage

      # this is slow. build a custom docker image and use that
      - run:
          name: Install node and npm
          command: |
            curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
            sudo apt-get install -y nodejs
            node --version && npm -v

      - run:
          name: Install Serverless CLI and dependencies
          command: |
            sudo npm i -g serverless
            npm install

      - save_cache:
          paths:
            - node_modules
          key: dependencies-node-{{ checksum "package.json" }}

      # run tests
      - run:
          name: Run tests with code coverage
          command: |
            nosetests --with-coverage

      # deploy app
      - run:
          name: Deploy application
          command: sls deploy -v
```

We have a `job` named `build`, and we have a few `steps`. The `checkout` step will check out the files from the attached source repo. We also have a few `run` steps that just execute bash commands.

We'll install the serverless CLI and the project dependencies, run our tests with code coverage enabled, and finally deploy the application.

**Note 1**: The `save_cache` and `restore_cache` sections in the above config file allow for caching the `node_modules` between builds, as long as the `package.json` file has not changed. It significantly reduces build times.

**Note 2**: You can review the [full config file](https://github.com/rupakg/python-ci/blob/master/.circleci/config.yml) for our app. And you can review a [full CircleCI sample configuration](https://circleci.com/docs/2.0/sample-config/) file with more options as well.

# Implementing the Workflow

To add our app project to CircleCI, do the following:

* Push the local app from your machine to your Github account, or fork the [sample project](https://github.com/rupakg/python-ci) on your Github account.
* Go to Projects -> Add Projects, and click the 'Setup project' button next to your project. Make sure the 'Show forks' checkbox is checked.
* Since we have our CircleCI config file already placed at the root of our project, some of the configuration is picked up automatically:
    * Pick 'Linux' as the Operating System.
    * Pick '2.0' as the Platform.
    * Pick 'Node' as the Language.
* Skip steps 1-4. Click on 'Start building'.

You'll see the system running the build for your project:

![Build running on CircleCI](https://user-images.githubusercontent.com/8188/39228988-c70201a2-482e-11e8-8a83-895eb5d421e7.png)

You can drill down to see the steps on the UI that matches our steps in the config file. While it is executing each step, you can see the activity:

![Build steps for the project](https://user-images.githubusercontent.com/8188/39228726-8b7bb6c4-482d-11e8-9127-b7e18ce61d9b.png)

You can see the tests running as part of the 'Run tests with code coverage' step:

![Running tests for the project](https://user-images.githubusercontent.com/8188/39228801-e282d06a-482d-11e8-9f10-14c7e26f0860.png)

And finally, you see that our app has been deployed under the 'Deploy application' step:

![Deploying the project](https://user-images.githubusercontent.com/8188/39229393-9f357bca-4830-11e8-81c1-4249cc0d4806.png)
![Deploying the project](https://user-images.githubusercontent.com/8188/39229433-c7be2146-4830-11e8-8dcb-eee0284125ec.png)

Last but not least, we can copy the endpoint shown in the output onto a browser and see the app run!

![Running the app](https://user-images.githubusercontent.com/8188/39229232-dc4b6502-482f-11e8-88f4-085ce5bfd832.png)

Hopefully, the full rundown of the process and its implementation on a CI/CD platform such as CircleCI gives you a better understanding of automating your own applications.

# Summary

In this post, we looked at the overall CI/CD process flow, and created a serverless application in Python.

We refactored the code to be testable, then ran the tests and code coverage locally to make sure our code was working. Once we had our app running locally, we set up an automated CI workflow for our app on CircleCI.

Any comments or questions? Drop them below!
