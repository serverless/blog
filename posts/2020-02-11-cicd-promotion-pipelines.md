---
title: Promotion Pipelines
description: "Find out what deployment strategies Serverless Framework Pro's CI/CD feature gives us for managing deployments as a team"
date: 2020-02-11
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/promotion-pipelines/img-blog-feb10-pipelines.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/promotion-pipelines/img-thumb-feb10-pipelines.png"
authors:
  - GarethMcCumskey
category:
  - guides-and-tutorials
---

Serverless application development is great for rapidly spinning up solutions to problems; you complete a little configuration in a serverless.yml file, add some Lambda code to glue it all together and hit `sls deploy`. However, this isn't really going to fly when you have multiple team members working on the same code. You can't have multiple developers deploying code at the same time to the same infrastructure, potentially overwriting what each is doing.
   
The first step to resolving this issue is to allow each developer access to their own AWS account, possibly using the AWS Organisations service that makes managing multiple child accounts to the organisations main account an easy to manage process. But what happens when this all needs to come together preferably in some kind of staging environment?
      
#### Use stages for environments

The Serverless Framework has a feature you may already be familiar with; stages. You can deploy a Serverless Framework to AWS by passing it a stage that can differentiate one stack from another and this means you have the means to have various environments to deploy to. 

`serverless deploy --stage staging`

Now if all services are deployed to the staging environment it means we have some way to do some quality assurance on an application and a collection of services before we deploy this to production. We can run our integration tests, perform some manual confirmation with stakeholders and customers, and then we just do a ... 

`serverless deploy --stage prod`

... right?

This in itself has problems. Its great we can break things up as far as environments are concerned, but we probably need more reliable ways to make sure that code gets pushed to the right environments just as a part of the development flow of your developers.

#### Lets tie in some branching strategies

In a more traditional development environment, the software development lifecycle will include a strategy of using branches to indicate the relative promotion of code to staging and development environments. And to that you would also have a CI/CD backend being triggered off of merges into specific branches. Merging into a develop branch deploys code into a staging environment. Merging into master ends up deploying into the production environment. And deployments cannot be made in any other way.

What if we can get these kinds of strategies to work for our Serverless applications? It will help us solve some of these problems

#### Enter Serverless Framework Pro CI/CD

This is actually very simple to do with Serverless Framework Pro's CI/CD feature. There are just a couple of pre-requisites to get up and running:

1. Need service (at least an initial version) with a serverless.yml file and an `app` and `org` set within that serverless.yml
2. The service needs to already be pushed to a Github repo with all the branches you want to auto-deploy to different environments already created; if you want to deploy from the develop branch to a develop environment/stage, that needs to be created already.
3. Lastly we also need to deploy at least once to make sure the service is added to Serverless Framework Pro.

With that out of the way, lets go to our service in the Serverless Framework Pro Dashboard:

![Enable Service D Image](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/promotion-pipelines/EnableServiceD.png)

As we can see, there's a handy `enable` link we can click on.

![Enable Github](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/promotion-pipelines/ConnectToGithub.png)

Now we just need to connect Serverless Framework Pro to our Github account and follow the Github OAuth prompts to give the required permissions to enable Serverless Framework CI/CD to deploy our services for us. 

Once we are connected:

1. Choose the repository we want to deploy from.
2. Select the base directory the service sits ... yes we can do mono repo things ... more in a future blog post

And now comes what we have all been waiting for. Scroll down the the section labelled `branch deploys`:

![Branch Deploys UI](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/promotion-pipelines/BranchDeploys.png)

This is where we can now link the branches in our repository to stages in our application, and those stages are linked to profiles [that help us control how and to which AWS accounts we deploy to](https://serverless.com/blog/serverless-deployment-best-practices/).

And that's pretty much. I did say it was easy. Once we match our branch to the right stage, every merge into those branches will automatically begin deployment.. 

![Queued Deployment](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/promotion-pipelines/QueuedDeployment.png)   

To get started head to the [Serverless Framework Pro Dashboard](https://app.serverless.com) and sign up for free!!
