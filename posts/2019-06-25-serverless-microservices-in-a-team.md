---
title: "Serverless Microservices in a Team"
description: "How do we build Serverless microservices as a team?"
date: 2019-06-25
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-microservices-in-a-team/2thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-microservices-in-a-team/2header.png'
category:
  - guides-and-tutorials
authors: 
  - GarethMcCumskey
---

In a [previous blog post](https://serverless.com/blog/serverless-local-development), we looked at how we would structure our new services to allow for developers to write and debug their functions locally as easily as possible. This included the setup of some unit testing frameworks and mocking tools so we didn't have to call out to AWS services over the Internet. 

But if you are a developer in a team, you probably need to find ways to work with your team when developing your Serverless microservices. 

#### Goals

To get started, just like the previous blog post, lets set some goals to meet for this blog post:

* Using VCS for our services
* Easy CI/CD setup
* Integration testing
* Going live

#### Using Version Control

Obviously, as with any software project, we need to use some form of version control and predominantly that's git. And while there are divided opinions on the matter, I prefer the idea of keeping each service in its own git repo. A lot of proponents prefer the monrepo approach, but let me provide reasons why I prefer to keep each service entirely seperate:

* Promotes re-usability of a service if you can include it into any serverless application (that being a collection of microservices).
* Since we should be building our services to be as decoupled as possible, we should not need to include other services just to have ours working as intended.
* Forces atomicity of our services, meaning that each service is built to contain everything it needs to function. All DynamoDB tables, all S3 buckets. And they are not shared across services.
* Since we are forced to keep services decoupled and atomic, synchronous communications are discouraged (since they add hard dependancies) and asynchronous communications are encouraged to pass data between services via PubSub or message queues.
* Each service can be super specialised in its architecture based on the need it fulfils. Even a different language runtime.
* Local development is lighter since you will only need to pull from the repo and run locally whichever microservice you are currently working on and not have to have a local version of all 100 or more services your team has developed.
* If each service is a git repo on its own that means that managing the collection of services is relatively easy when it comes to setting up deployment. No complicated setup to deploy each individual service that has been combined under a single repo. Each service is a mini application all on its own.

If we assume that your services are built as per the previous blog post about setting up a local development environment, then we also have a very easy method to have other developers get involved with maintaining any of our services. The process looks like so for a developer looking to work on an existing service:

* Fork the repo for the service to maintain.
* Clone the forked repo to your local
* Run `npm install` to setup all local dependancies.
* Create branch off of develop to do work in.
* Develop locally as normal using the unit testing and mocking environment to execute and debug.
* Deploy to personal AWS account for some final integration testing with AWS services.
* Push branch with new feature/bug fix to forked repo.
* Create pull request to the original repo.

Now its up to the team around the service to decide whether to accept the pull request after a code review. And the best part is that you can also do your own CI/CD setup at that point to run unit and integration tests as you wish. Since a developer will be creating a branch off of develop, their PR is back onto develop.

#### Continuous Integration and Deployment

I really love simple continuous integration setups. And I love portable setups. You don't get much more simple and portable than a single yml file in the service root. I'm a bit of a fan of Gitlab, and one of the biggest reasons is because of their integration of CI/CD by default even into private and free projects. Of course, you can use whatever flavour of VCS and CI tools you wish, but this example leverages off of Gitlab and their runners system. Similar types of configurations exist for a lot of the CI/CD tools that exist.

Gitlab allows you to create a `.gitlab-ci.yml` file that describes the CI/CD process for even multiple branches of your repository. Here is an example:

```yml
image: node:10-alpine #Choose which docker image to base your container on

before_script:
  - npm install #Make sure all local dependancies are installed

staging_deploy:
  cache:
    paths:
      - node_modules/ #Cache our node_modules folder so its quicker to run
  stage: deploy
  environment: staging
  script:
    - npm install -g mocha
    - mocha src/test/functions
    - node_modules/serverless/bin/serverless config credentials --key AWS_ACCESS_KEY --secret AWS_ACCESS_SECRET --stage staging
    - node_modules/serverless/bin/serverless deploy --stage staging
    #Run any other command that executes your integration tests across your entire application if you wish
  only:
    -  develop

production_deploy:
  cache:
    paths:
      - node_modules/
  stage: deploy
  environment: prod
  script:
    - node_modules/serverless/bin/serverless config credentials --key AWS_ACCESS_KEY --secret AWS_ACCESS_SECRET --stage prod
    - node_modules/serverless/bin/serverless deploy --stage prod
  only:
    -  master
```

> NOTE: If you use Serverless Framework Enterprise, there's no need for the `serverless config credentials` lines as credentials for deployment are provided via Serverless Framework Enterprise when you call `serverless deploy`. If you are interested in how to get started with Serverless Framework Enterprise then [check out the docs here](https://github.com/serverless/enterprise/blob/master/docs/getting-started.md)

Here's the quick rundown of the configuration above. It starts by you selecting which image from Dockerhub you wish your container to run on. You could also build your own image from scratch and store it on Gitlab itself and use that too so you have ultimate flexibility. Then `before_script` is executed before the rest of the file which just does an `npm install` to ensure all our dependancies are loaded.

After that we have two sections; our `staging_deploy` and `production_deploy`. Each one `only` executes on specific branches; develop for `staging_deploy` and master for `production_deploy`.

Its at this point that configurations can diverge. The staging configuration installs and run's mocha to ensure that all unit tests pass before getting to deployment. We then have to setup our access details into the AWS account we want our staging environment to deploy to. This is accomplished by setting `AWS_ACCESS_KEY` and `AWS_ACCESS_SECRET` values in Gitlab manually with the access details from AWS as environment variables made available to the script in our container on every CI run. Finally, we do a deploy to the staging stage. As noted by the comment, after this you can then kick off any integration test you wish or even look into Gitlab's sophisticated CI environment for more options; there's a lot more to it than just this example.

Regardless of which VCS and CI tool you use, you should be able to achieve similar results; Bitbucket has Pipelines that works similarly, Travis is popular with Github, Circle CI is a popular bet as well. Choose whatever floats your boat, the principles stay the same.

#### Integration testing

Integration testing is a funny beast, and can be tricky to master in ANY environment, not just a Serverless application environment. In the book "Building Microservices" by Sam Newman, the go to resource about building microservices, he describes how difficult it can be to accomplish a good integration testing strategy. Problems exist along the lines of keeping the correct versions of services in sync when running the test, resetting the test environment and for large applications, just the sheer amount of time it can take to get an environment setup and configured for each test before you even start running it, then waiting around for the results, spending all that time writing tests and tests becoming stale... Running a good integration testing strategy can be difficult and very time consuming. However, it doesn't mean you shouldn't try and wouldn't be useful in your situation.

Integration testing includes a LOT of possibilities. From simple API endpoint testing by just calling HTTP endpoints in sequence and assessing the results to full blown browser simulation by "clicking" on links and filling in forms. One thing all of these have in common is the need to do the testing in the cloud. And thankfully this gets easier to do when using stages with the Serverless Framework. Here is a sequence of steps I have seen used when attempting to provide integration tests to a code base on being taken live:

* A pull request submitted by a developer on the team gets merged into a services develop branch.
* A merge (potentially after peer review) triggers the start of the CI process (whether thats Gitlab CI/CD, Bitbucket Pipelines, CircleCI, Travis or any other CI/CD tool).
* Unit tests are executed on the service if they exist and if any fail, deployment fails.
* Altered service has a deployment occur by default to the `test` stage using `serverless deploy --stage test`.
* CI system waits for human intervention to decide if an integration test is required.
* If yes, an endpoint is called to a service dedicated for the purpose of resetting data on integration test stage to bootstrap for a new integration test run.
* Integration test (API endpoint or browser emulation) is executed.
* If successful (or if an integration was bypassed) develop gets merged into master and deployment occurs.

This is naturally very simplified, and is only one of many possible configurations. As for the actual integration testing tool? There are many options here, everything from rolling your own with `mocha` or `jest` and the `supertest` module, to tools such as [Cypress](https://www.cypress.io/) and [Puppeteer](https://github.com/GoogleChrome/puppeteer) for that emulated browser testing.

#### Production

Going into production can be a little scary. However, even here we can help ameliorate the concern somewhat. Canary deployments is a feature added by AWS not so long ago and shortly thereafter, [David García](https://github.com/davidgf) authored a great Serverless plugin, the [serverless-plugin-canary-deployments](https://github.com/davidgf/serverless-plugin-canary-deployments) plugin. 

For anyone who is not aware what canary deployment means, its a means by which you can have only some of your traffic shift over to a new version of your Lambda function after deployment. The function is monitored for errors, and if none are found, then more traffic is moved over and monitoring continues. This continues until all traffic is switched over to the new version.

However, if an error is detected, then the deployment is immediately rolled back to the known working previous version. 

There are a ton of options with this plugin, everything from setting up additional Lambda functions to execute prior to or after traffic shifting, custom alarms to trigger rollbacks besides just errors, etc. I highly recommend taking a good look at that plugin if you want to ensure that deployments into production go smoothly.

#### Conclusion

Serverless can and does work well in a team setting with features and options available to work together as a team (including [Serverless Framework Enterprise](https://serverless.com/enterprise/)). If you have any extra advice or tips to offer, please do so in the comments below or [drop by our forums](https://forum.serverless.com/) if you have any questions so the rest of the community can get involved.