---
title: CI/CD for monorepos
description: "How do we deploy services all collected under a single monorepo in git?"
date: 2020-03-06
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd-monorepo/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd-monorepo/hero.png"
authors:
  - GarethMcCumskey
category:
  - guides-and-tutorials
---

When building serverless applications as a collection of Serverless services, we need to decide whether we are going to push each service individually to our version control system, or bundle them all together as a single repo. This article is not going to go into the details about which is better or not, but all our posts so far seem to show examples of services all stored in individual repositories. 

What this article **is** going to demonstrate, however, is that deploying services from within a single monorepo is easily doable within Serverless Framework Pro's CI/CD solution.

#### Getting started

It would be great if you could follow along, even if you do not have your very own monorepo to play with. So [here is one](https://github.com/garethmcc/monrepotest) you can use. It's a little demonstration repo you can clone from Github and use in your own Serverless Framework Pro account, just change the `org` and `app` values in each of the four services to match one of your own.

> **NOTE:** Serverless Framework Pro has a generous free tier so you don't need to worry about not having a paid account just to try this feature out for yourself.

Once you've cloned the repo, made the requisite `org` and `app` edit, you just need to push that back into a repo of your own for us to continue.

The last step before we walk through setting up the monorepo deployment is to ensure that we have our connection to our AWS account all squared away, especially if you have a [brand new dashboard account](https://dashboard.serverless.com). This is done by going to profiles on the top menu, selecting the profile we will be using and making sure an AWS account is connected.

With that out of the way, lets get cracking!

#### Connecting to Github

Make sure you create the app withing the org, using the same names you added to the services `serverless.yml` file as well; I have one I called `monorepotest` ... super original I know. But once I have done that, I open the app and I should have a handy dandy `add service` button to click on. Doing that gives me two option. I want to choose `Deploy from Github`. You should then see a button to `connect to Github`. Click it and go through Github's OAuth process to authorise Serverless Framework Pro to access the monorepo you are configuring. Once done and returned, you may or may not need to just refresh the page. When you see the image below we can move on:

![Deploy from github](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd-monorepo/DeployFromGithub.png)

#### Deploying our first service

Once we have that connection, we can use the `Select a repo` dropdown to choose our monorepo, and the `base directory` drop down now becomes available after a second or so. In this list we should see all the services we may want to deploy that are a part of this monorepo. If you are using the Github repo I linked to before, you can select `servicea`, and now we get even more options to choose from. 

We have covered preview deploys in [a previous blog post](https://serverless.com/blog/preview-deployments), so I wont go into detail here on them; we are going to skip configuring that for now.

Moving down to the branch deploys section, if you have not yet configured any kind of stage, you will be prompted to do that now. Just click through to create the stage and return to the deployment config when done.

In `branch deploys`, we point our specific git branch to the stage we want to deploy to. If you only have a master branch and one stage this will automatically be selected and you just need to confirm. At this point you can just save the configuration and you are all set up. Merge into the master branch or deploy directly from the `deploy now` button and a deployment to your AWS account should begin! 

If you go ahead and do the same for all the other services in the monorepo, you will be fully setup with monorepo deployments to AWS; if code is pushed all services in the monorepo will redeploy. If you don't want all of them to redeploy every time ... read on.

#### More advanced configuration

##### Selective deployments

By default, if you have multiple services of a monorepo configured and you merge a change anywhere in that repo, all services will redeploy, just in case. There's no way for the system to know if there are any dependencies between the services so it cannot assume that only that one service that had a change should be redeployed.

However, you can configure it differently.  If you open the CI/CD settings for one of the services and scroll down to expand the `advanced settings` section, you should see numerous options to help you maximise the efficiency of your CI/CD pipeline for a monorepo.

![Advanced settings expanded](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd-monorepo/advancedsettings.png)

By default, the `Always trigger a deployment` option is selected and means that this service will **always** be redeployed with any change to the git repository, even if there were no changes to the code of this service. If you only want this service redeployed when its own code is edited, uncheck the box and you should see something like:

![Trigger directories configuration](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd-monorepo/TriggerDirectories.png)

Automatically, the directory of the current service is selected and you can just click `save settings`. From this point on, `servicea` will only be re-deployed when its own code is edited.

##### Dependancy deployment

But what if you actually did have services that had dependencies on each other. So in the example with `servicea`, we could in fact link it to `serviceb` and configure it so that `servicea` will always be re-deployed when `serviceb` is also edited. Just by adding a reference to the correct service directory, I can ensure this will happen:

![Service B added](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd-monorepo/ServiceBAdded.png)

I could of course do this for any number of services that `servicea` depends on and vice versa. But what if I have some kind of shared folder that `servicea` uses. Because we reference a directory structure in our configuration, you can point to any path in your monorepo to be watched for changes. In the example repo, we have a directory called `shared` that stores a number of classes and functions (or at least it could) that are re-used by multiple services. If I change anything in `shared`, multiple services need to redeploy.

I can accomplish this just by adding the path to `shared`:

![Shared directory added](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cicd-monorepo/SharedAdded.png)

In the image above, `servicea` will be deployed on merges to Github if changes are detected in directories `servicea`, `serviceb` or `shared`. And I can configure any service with any specific arrangement of dependencies I need, providing me a ton of great flexibility to deploy what I need under the right circumstances.

Monorepo deployments are much simpler to manage using Serverless Framework Pro CI/CD. But if you do have any feedback for us or want to just share, please hop into our [Slack channels](https://serverless.com/slack) or [Forums](https://forum.serverless.com) and let us know. Or you can even [DM me on Twitter](https://twitter.com/garethmcc) if you have any questions.
