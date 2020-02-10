---
title: A Guide to Preview Deployments with Serverless CI/CD
description: "A closer look at working with Preview Deployments in the Serverless CI/CD solution."
date: 2020-02-10
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/preview-deploy-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/preview-deploy-header.png"
authors:
  - FernandoMedinaCorey
category:
  - guides-and-tutorials
---

In this guide, I'll explain what Framework Pro preview deployments are, why you might want to take advantage of them and then show you how to enable these on your own applications. I'll use a version of a song vote counting service I created called Serverless Jams to help illustrate this and you can follow along with me step by step.

## So What Are Preview Deployments?

You might be familiar with the concept of preview deployments from frontend tooling like Netlify that allow you to create a preview of frontend builds before they are merged into a production website.

Well, we at Serverless thought - "Why don't we have that for our backends?"

In the past, the answer to this question has been simple - it costs too much. In the days of expensive, sprawling backend infrastructures it took far too much money and developer time to replicate these environments effectively for testing and staging - let alone for every PR. 

But with serverless applications, managed services, and microservice architectures that's no longer the case. Take a typical AWS microservice with the serverless framework. What resources are included? Probably some of these:

- Lambda Functions
- API Gateway Endpoints
- DynamoDB Tables
- SQS Queues
- SNS Topics
- S3 Buckets
- SSM Parameters

What characteristics do these resources share? They're virtually all pay-as-you-go or pay-per-use/invocation style services or can be configured very cheaply. This means, we can create an entire separate stack of our infrastructure for every feature branch without spending much at all. 

## Why Use Preview Deployments?

The preview deployments benefits for frontend code are clearly apparent - you get some preview URL of a deployment and you can see what changed and make sure it looks great. So what do we really get out of doing something similar for the backend? Let's take a look.

**Automated Tests and Serverless Safeguard**

When you create your Preview Deployment, the Framework Pro CI/CD system will still run any [Safeguards](https://serverless.com/framework/docs/dashboard/safeguards/) you have configured for the `default` profile. You'll also still have any automated [tests](https://serverless.com/framework/docs/dashboard/cicd/running-tests/) you have setup run against the deployment. This gives you all the same benefits you might otherwise have waited until a staging environment to check against.

**A Clean Environment for Code Review**

Because you're spinning up an entire set of infrastructure, it's open season for your code reviewers to play with the API endpoints and infrastructure resources.

They can run manual tests to confirm the deployment meets expectations, run API contract tests against the API endpoints that are created or integrate the feature branch into local frontends for a fuller test experience. This can be especially helpful when you want validation from a frontend team on the expected functionality for a new API. And because the preview branch is discrete from other environments they don't have to worry about stepping on any toes during the review.

After this, they can go straight back to the PR, and make sure that any issues and feedback they discover are addressed before the PR is even merged into a staging environment.

**Automated Spin Up and Spin Down**

Because these resources are all spun up automatically by opening the PR, there's no manual process for the developer or reviewers to create a full environment to test against. The best part is that when the PR is finally closed or merged you can configure your deployment to automatically remove the infrastructure resources that were created in AWS.

## How to Use Preview Deployments

So how do we configure all this? In this section, I'll take you through how to get started with preview deployments. You'll be able to follow along with every step by cloning my [Serverless Preview Deployments](https://github.com/fernando-mc/serverless-preview-deployments) project and using it in your own [Framework Pro](https://dashboard.serverless.com/) account.

### Prerequisites 

In order to get started with Preview Deployments, you'll need a Framework Pro account. You can get a free account for personal use [here](http://dashboard.serverless.com/) and configure it using [these steps](https://serverless.com/framework/docs/dashboard#enabling-the-dashboard-on-existing-serverless-framework-services).

As of this post, preview deployments require you to:

- Have your code in GitHub
- Be deploying services to AWS
- Be using either Node or Python
- Be using a recent version of the Serverless Framework (I'm using v1.62.0)

With all of these perquisites met, you should be able to configure your repository to use preview deployments.

### Setting Up Preview Deployments

First, you'll need to follow some steps to get any CI/CD working with your Framework Pro account. The steps are documented [here](https://serverless.com/framework/docs/dashboard/cicd/) but let's walk through them together.

**1. Link Your AWS Account to a Default Profile**

When using preview deployments, we'll be deploying to a stage name based on the feature branch name. This helps avoid conflicts with resource names because feature branch names should be unique. 

This also means we need to configure the "default" Framework Pro [deployment profile](https://serverless.com/framework/docs/dashboard/profiles/) with a role so it can deploy feature branches. You can do that by clicking the profiles menu and then clicking on the "default" profile. 

![Screenshot of profiles](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/01-profiles.png)

From here, you'll need to configure a "shared AWS account" to use when deploying your preview deployments:

![Screenshot of default profile](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/02-default-profile.png)

This setting will require you to create an AWS IAM Role if you haven't already and give it permissions to Framework Pro to deploy your services. Once you save the default profile, you can then move to deploying and configuring your service with preview deployments.

**2. Get Your GitHub Repo Setup**

For this example, I'll use a version of Serverless Jams - a vote counting system for different coding-related songs. We'll open a feature branch PR to add some functionality to Serverless Jams after we create it in our own GitHub repo.

Go ahead and sign in to GitHub and take a moment to [create a new GitHub Repository](https://github.com/new). You can make it public or private, just give it a memorable name because we'll have to find it later. I'll call mine `preview-deployments-test`:

![Screenshot of new repo creation page on GitHub](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/03-new-repo.png)

Then copy down the git URL for your repo for later. Mine is: `https://github.com/fernando-mc/preview-deployments-test.git`

We need to do this step because we'll need our own repository in our own GitHub account to push code to and then configure with Preview Deployments later on.

After you create that repo, you can clone the code we'll be using:

- Run `git clone https://github.com/fernando-mc/serverless-preview-deployments.git` to get the code
- Enter the project directory with `cd serverless-preview-deployments`
- Then change the git origin with `git remote set-url origin <YOUR_GIT_REPO_URL>`, for example, mine would be: `git remote set-url origin git@github.com:fernando-mc/preview-deployments-test.git`
- You can confirm that you've correctly updated the remote URL with `git remote -v`
- Then run `git push origin master` to push this code to your own repo.

I'm jumping through all these hoops to make sure this repo is yours and yours alone and not associated with mine in any way. That way I can make sure you don't inadvertently open feature requests against *my* repo, which will unfortunately fail for you!

With this repo setup, we now need to create and configure an App in Framework Pro.

**3. Configuring Your App in Framework Pro**

Navigate to the [Framework Pro dashboard](https://dashboard.serverless.com/) and click the "Add App" button. Add an app and make sure to update the name of the app and org values inside of `serverless.yml` in your newly pushed project.

One snazzy way to do this is to run `serverless --org orgname --app appname`. You can also just open the `serverless.yml` file and confirm you see something like this:

```yaml
org: fernandosdemos
app: preview-deployments
service: serverlessjams
```

Where `fernandosdemos` is your org name and `preview-deployments` is your app name. Then make sure to save the `serverless.yml` file and push this change to the GitHub repo with: `git add . && git commit -m "update app and org" && git push origin master`.

Now that you have the correct org and app values, you can connect GitHub. Click into your app, and visit the "ci/cd settings" tab. Then connect your GitHub account and install the Serverless GitHub application. 

![Screenshot of connecting GitHub](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/04-connect-github.png)

If you have multiple organizations associated with your account, you'll need to pick the one you put the repo in.

![Screenshot of selecting the Org or User account in GitHub](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/05-select-org-user.png)

After this, you will at least need to grant permissions to access the repo we just created.

![Screenshot of selecting repositories in GitHub](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/06-select-repositories.png)

At some point, you might also have another screen or two prompting you to install the Serverless Application in GitHub. After you're done with this process, you can head back to the Framework Pro dashboard and you should now see a repo dropdown to pick from:

![Screenshot of connecting the repo in the Framework Pro dashboard](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/07-connect-repo.png)

After you select the repo your using, preview deployments should be configured by default as shown below:

![Screenshot of the preview deployment settings](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/08-preview-deploy-settings.png)

You could also configure deployments for other branches (like whenever changes are made in master). But for now, just save the settings and continue.

### Testing Preview Deployments

In this example, we'll have a `master` branch in your GitHub repository. When a PR is made against the `master` branch from a feature branch, we'll want to create a Preview Deployment for that PR. To set this all up, go back to your code, and run `git checkout -b preview-test-feature` to create a new feature branch. Then, in the `backend/vote.py` file change the integer on line 44 from `1` to `4`. This will have us vote by 4 instead of by 1. Now, add and push the changes:

- Run `git add .` to add your changes
- Then commit the change `git commit -m "vote by 4"`
- And finally push them to the feature branch at the origin with `git push origin preview-test-feature`

The output of this should include something like this:

```
remote: Create a pull request for 'preview-test-feature' on GitHub by visiting:
remote:      https://github.com/fernando-mc/preview-deployments-test/pull/new/preview-test-feature
```

If you see that, you can click on the link to automatically open a PR. Otherwise, visit your repo in GitHub and open a PR manually:

![Screenshot of the open a pull request button](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/09-compare-pull-request.png)

Then, actually open the PR:

![Screenshot of pull request creation page](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/10-create-pull-request.png)

After you open the PR, you should see the GitHub checks running on your PR like this:

![Screenshot of the preview checks run in GitHub by Serverless](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/11-serverless-cicd-preview-checks.png)

If you see a failure like this click the "Details":

![Screenshot of a failed build in GitHub](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/12-serverless-cicd-preview-failed.png)

This should direct you to the deployments section of the Framework Pro dashboard. From there, you can review the log for your preview deployment to see what happened:

![Screenshot of a failed build log in Framework Pro](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/13-deployment-log-failure.png)

If you followed all the earlier steps above your build probably succeeded, but you might also see an error that will help you fix whatever failed in the build. In this case, we see an error related to our deployment profile: "AWS provider credentials not found. Learn how to set up AWS provider credentials in our docs here: <http://slss.io/aws-creds-setup>." 

If you saw this error, make sure to configure the deployment profile mentioned in step 1 above and then push an update to the preview branch to get it to rebuild. After you do this, (or if you didn't make this mistake in the first place) you should see this:

![Screenshot of successful preview deployment in GitHub](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/14-serverless-cicd-preview-success.png)

Clicking the "Details" link inside of the Serverless check should direct you to the Framework Pro dashboard where you can review the logs from the build:

![Screenshot of successful deployment log in Framework Pro](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/15-deployment-log-p1.png)

You should see any configured safeguards run against your deployment:

![Screenshot of Safeguards running in Framework Pro](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/16-deployment-log-p2-safeguards.png)

And the safeguards should also display any warnings that might apply to this preview deployment:

![Screenshot of safeguards warning in Framework Pro CICD log](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/17-deployment-log-p3-safeguards-warns.png)

Finally, after the deployment is completed, you'll see any API endpoints and other relevant resources that were created:

![Screenshot of API endpoints being output in Framework Pro logs](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/18-deployment-log-api-endpoints.png)

At this point, any reviewer could copy and paste those API endpoints and test them out. If I were reviewing, I could test out the new API using something like Postman or even copy the API endpoint directly into the frontend and test it out within the UI. Let's give that a shot now for fun.

Copy the base of the API endpoint from the log, in my case: 

`https://myj49ah5kk.execute-api.us-east-1.amazonaws.com/preview-test-feature/`

Then, paste it into the `frontend/app.js` file where the `REPLACE_ME` value currently is on line 10 so it becomes the new `endpoint_url_root`.

Then, change directories into the `frontend` repository and run `python3 -m http.server` to start a webserver for the frontend and open up [localhost:8000](http://localhost:8000/). It should look something like this:

![Screenshot of the frontend application](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-02-10-preview-deployments/19-frontend-test-1.png)

From there, you can try using the app! Make sure to enter your number in with the plus sign and the country code at the beginning. After you submit a vote you'll see that it is incremented by 4 instead of 1. From here, we could keep testing the API endpoints, go and comment on the PR and suggest any changes we needed made.

When we're done, we can either merge the PR or close it. At that point, It’s also self-cleaning. After your branch is merged or deleted Serverless CI/CD will automatically remove your service. Bear in mind, you will have to delete the branch, not just close the PR for the infrastructure to be removed.

## What Next?

So by now I hope I've convinced you of the utility and possibilities of preview deployments. Next, try taking a look at the [other features](https://serverless.com/framework/docs/dashboard/cicd/) of Serverless CI/CD like [branch deployments](https://serverless.com/framework/docs/dashboard/cicd/branch-deployments/), and [testing](https://serverless.com/framework/docs/dashboard/cicd/running-tests/).

If you have suggestions about what you want from Serverless CI/CD next let us know in the comments below!
