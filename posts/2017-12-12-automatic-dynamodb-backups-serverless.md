---
title: "Automate your DynamoDB backups with Serverless in less than 5 minutes"
description: "Using the Serverless Framework, you can set up automatic backups of your DynamoDB table."
date: 2017-12-12
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sls-usergroup.png'
authors:
  - AlexDeBrie
---

The good news: AWS announced [DynamoDB backups](https://aws.amazon.com/blogs/aws/new-for-amazon-dynamodb-global-tables-and-on-demand-backup/) at re:Invent 2017. This will save a lot of unnecessary ops burden.

The bad news? You can't schedule and automate your backups. You need to manually click in the console to create your backup.

**Have no fear, an automated solution is here.** 

Use the power of [Serverless](https://serverless.com) to automatically backup your DynamoDB tables on a schedule! 

Follow the steps below to use our project to backup your DynamoDB tables.

# Serverless DynamoDB Backups

We've created a [Serverless project on GitHub](https://github.com/alexdebrie/serverless-dynamodb-backups) to create DynamoDB backups on a schedule. Usage of the project is simple.

**First, [install the Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/quick-start/):**

```bash
$ npm install -g serverless
```

You'll need AWS credentials configured in your terminal. Want help with these? [Check out our walkthrough](https://serverless.com/provider-setup/#get-started).

**Then, use the Framework's install command to install a project template from a GitHub repo:**

```bash
$ sls install --url https://github.com/alexdebrie/serverless-dynamodb-backups && cd serverless-dynamodb-backups
```

Edit the configuration in the `custom` block of `serverless.yml` to match your configuration. This includes setting the `tableName` of your DynamoDB table, the `backupRate` at which you want to create backups, the AWS region where your table is located, and optionally a `slackWebhook` to send Slack notifications. 

> Want help setting up a Slack webhook? Check out [this section](#setting-up-a-slack-webhook).

**Finally, deploy your Serverless service:**

```bash
$ sls deploy
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (62.98 KB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.....................
Serverless: Stack update finished...
Service Information
service: serverless-dynamodb-backups
stage: dev
region: us-west-2
stack: serverless-dynamodb-backups-dev
api keys:
  None
endpoints:
  None
functions:
  createBackup: serverless-dynamodb-backups-dev-createBackup
```


# Setting up a Slack Webhook

If you want fancy Slack notifications when a backup succeeds or fails, follow the steps below. 

In the end, you'll receive notifications like:

<img width="671" alt="Backup Notification" src="https://user-images.githubusercontent.com/6509926/33861700-e0c37f24-dea4-11e7-9661-c86cb9fe7eb4.png">

First, go to the channel you want to send notifications to and click **Add an app:**

<img width="840" alt="Add an app" src="https://user-images.githubusercontent.com/6509926/33861382-31047fa8-dea3-11e7-8175-3d4e859ad023.png">

In the page that opens, search for `Incoming Webhooks` and click on it. Then click `Add Configuration`. It should show your selected channel in the box. Then click `Add Incoming WebHooks Integration`.

Once you've created it, the page will show your Webhook URL: 

<img width="1000" alt="Webhook URL" src="https://user-images.githubusercontent.com/6509926/33862256-6bc2b624-dea7-11e7-9fe0-b993e8692494.png">

**Copy and save this, as you'll need it in your Serverless service.**