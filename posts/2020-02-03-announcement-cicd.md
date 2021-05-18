---
title: Announcing Serverless CI/CD
description: "Announcing the general availability of Serverless CI/CD in Serverless Framework Pro, a continuous integration and deployment service you can use for free."
date: 2020-02-03
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-01-announcement-cicd/Thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-01-announcement-cicd/Header.png"
authors:
  - MaciejSkierkowski
category:
  - news
---

# Announcing Serverless CI/CD

Today we are excited to announce the general availability of Serverless CI/CD in Serverless Framework Pro. Serverless CI/CD is a continuous integration and deployment service you can use for free by [signing up for a Serverless Framework Pro account](https://app.serverless.com) and following the [getting started guide](https://serverless.com/framework/docs/dashboard/cicd#getting-started-in-3-steps).

We built Serverless CI/CD because serverless developers need a CI/CD service optimized for serverless workflows. As developers, we want to focus on developing and deploying often, but too much time is spent on managing the CI/CD pipeline.

Here are some of the highlights.

## Stages & Environments

When we deploy a service we don’t just deploy to production directly every time. More often, we’ll have multiple environments setup for each stage of our deployment pipeline. While we deploy the same service to each stage, each stage will be deployed to different AWS Accounts and use different configurations.

Serverless CI/CD heavily leverages existing Serverless Framework Pro features like [outputs](https://serverless.com/framework/docs/dashboard/output-variables/) to share variables across services, [parameters](https://serverless.com/framework/docs/dashboard/parameters/) to set secrets/variables, and [providers](https://www.serverless.com/framework/docs/guides/providers/) to connect to your AWS account. Whether you are deploying from the CLI or from Serverless CI/CD the right environment and configurations are used depending on the stage submitted.

## Preview deployments from pull requests

![Pull Request Status](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-01-announcement-cicd/pull-request.png)

Preview deployments enable you to automatically test and deploy a preview version of your service for every pull request. So now you can get a live preview to test the live code and test integrations.

It’s also self-cleaning. After your branch is merged and deleted, Serverless CI/CD will automatically un-deploy your service. Now your environment can stay lean and clean.

## Branch deployments

![Branch deployment status](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-01-announcement-cicd/BranchDeploymentStatusEdit.png)

Branch deployments enable you to deploy all commits from a branch to a specific stage. For example, you can deploy everything from the master branch to a “staging” stage, and everything from the “prod” branch to the “prod” stage. This enables you to leverage your existing git flow to review and promote changes from stage to stage.

## Mono-repo support

![Mono repo trigger directories](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-01-announcement-cicd/MonorepoTriggerDirectories.png)

In a microservices architecture we end up with many serverless.yml files in a single repo, but we don’t want to redeploy all services just because one file changed. With the mono-repo support, you can specify trigger directories, so you can deploy services only if specific files change.

## Getting Started in 3 Steps

You’ll need a Serverless Framework Pro account, so sign-up for a free account now.

[Sign-up for free Serverless Framework Pro account](https://app.serverless.com/)

Before you get started, you’ll need an AWS Account, Github repo with an existing Serverless Framework project, and permissions on your Github organization to install the Serverless Framework Pro app.

[https://serverless.com/framework/docs/dashboard/cicd/](https://serverless.com/framework/docs/dashboard/cicd/)

The Free tier of Serverless Framework Pro includes one concurrent build and you can test and deploy as often as you would like. It also comes with simple & powerful monitoring and troubleshooting features too. If you need more concurrent builds you can upgrade to the Team tier and buy additional concurrent builds a la carte.
