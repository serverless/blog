---
title: "Migrating Monitoring from IOpipe to Serverless Pro"
description: "Learn how to migrate your serverless application monitoring to Serverless Pro from IOpipe."
date: 2019-11-07
thumbnail: ""
heroImage: ""
category:
  - guides-and-tutorials
authors:
  - FernandoMedinaCorey
---

### Overview

You may have seen recent news that IOpipe was acquired by New Relic. As part of that process, IOpipe customers have to make changes in the next 30 days to get any form of monitoring on their applications before New Relic sunsets the old product. 

So what better time to try [Serverless Enterprise](http://dashboard.serverless.com) for free? You'll get automatically-instrumented monitoring that requires no changes to your current function code along with CI/CD, deployment safeguards and more. 

With a quick account sign up and a two line change to your existing `serverless.yml` file you can setup monitoring (and other features!) for all your Serverless Framework services written in Node or Python for AWS.

Interested? Let's see how to do it.

## Step 0 - Prerequisites and Assumptions

I'm going to assume that:

1. You're using the Serverless Framework CLI version 1.48.0 or later to create and deploy your applications.
2. You have AWS keys configured locally that you use to deploy your services


## Step 1 - Signing Up for Serverless Pro (For Free!)

Serverless Enterprise is free to use for up to a million monthly Lambda function invocations. Just create a dashboard account [here](http://dashboard.serverless.com).

During the account creation process all you need to do is create an `app` and call it something related to the services you're trying to instrument. As part of this process you'll also create an `org` but more on that in a moment.

## Step 2 - Configuring Your Service

After you've created the account successfully, you can navigate into your service directory and open up your `serverless.yml`. At the top of the file add these two lines:

```yaml
org: theorgname
app: myappname
```

An `org` is an organization that your applications and services are contained within. You can have multiple `org`s or just one. You can also use organizations to help manage different teams with different levels of access to different services.

The `app` is the applications that your services will be contained within. This might be a particular new product, or services that are somewhat related to each other. But think of this as an easy way to group Serverless Framework services together in a logical way. 

You will need to replace `theorgname` above with the name of your organization. To get that value you can click the upper right dropdown menu in the [Serverless Dashboard](https://dashboard.serverless.com/) and look for the value listed under "Current Org". You can also check the URL bar when signed into the dashboard and you should see the organization name right after `/tenants/` in the URL.

To get the app name, you can either use the name of the application you just created in Step 1 or you can create a new one with a name to match whatever application you're about to deploy.

## Step 3 - Deploy Your Service

After finishing Step 2, go ahead and try running the `serverless login` command. This should prompt you to login to the Serverless Dashboard and then automatically configure some access keys locally on your machine to deploy using the Dashboard. If you have any trouble with this make sure to upgrade your version of the Serverless Framework and feel free to take a look at the [Getting Started](https://serverless.com/framework/docs/getting-started/) guide.

When this command completes you should be all set to run `serverless deploy` in your service directory and deploy your new service to AWS along with all the [monitoring and debugging tools](https://serverless.com/monitoring/) already baked into Serverless Enterprise.

Then just test your function and review the results inside of the [Serverless Dashboard](http://dashboard.serverless.com).



If you'd like to take a look at the 

## Step 4 - Cleaning Up

If you feel comfortable migrating over to Serverless Enterprise for your serverless monitoring needs you'll want to remove the IOpipe dependencies and any references to it in your Functions
