---
title: Promotion Pipelines
description: "Find out what deployment strategies Serverless Framework Pro's CI/CD feature gives us for managing
 deployments as a team"
date: 2020-02-07
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-01-announcement-cicd/Thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-01-announcement-cicd/Header.png"
authors:
  - GarethMcCumskey
category:
  - guides & tutorials
---

Serverless application development is geat for rapidly spinning up solutions to problems; you complete a little configuration in a serverless.yml file, add some Lambda code to glue it all together and hit `sls deploy`. However, this isn't really going to fly when you have multiple team members working on the same code. You can't have multiple developers deploying code at the same time to the same infrastructure, potentially overwriting what each is doing.
   
The first step to resolving this issue is to allow each developer access to their own AWS account, possibly using the AWS Organisations service that makes managing multiple child accounts to the organisations main account an easy to manage process. But what happens when this all needs to come together preferably in some kind of staging environment?
      
#### Use stages for environments

The Serverless Framework has a feature you may already be familiar with; stages. You can deploy a Serverless Framework to AWS by passing it a stage that can differentiate one stack from another and this means you have the means to have various environments to deploy to. 

`serverless deploy --stage staging`

Now if all services are deployed to the staging environment it means we have some way to do some quality assurance on an application and a collection of services before we deploy this to production. We can run our integration tests, perform some manual confirmation with stakeholders and customers, and then we just do a ... 

`serverless deploy --stage prod`

... right?

This in itself has problems. Its great we can break things up as far as environments are concerned, but we probably need more reliable ways to make sure that code gets pushed to the right environments just as a part of the development flow of your developers.

#### Lets tie in some branching strategies

In a more traditional development environment, the software development lifecycle will include a strategy of using branches to indicate the relative promotion of code to staging and development environments. And to that you would also have a CI/CD backend being triggered based off of these merges into specific branches. Merging into a develop branch deploys code into a staging environment. Merging into master ends up deploying into the production environment. And deployments could not be made in any other.

What if we can get these kinds of strategies to work for our Serverless applications? 
