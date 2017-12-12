---
title: "Automate your DynamoDB backups with Serverless in less than 5 minutes"
description: "Using the Serverless Framework, you can set up automatic backups of your DynamoDB table."
date: 2017-12-12
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/dynamodb.png'
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

> Want help setting up a Slack webhook? Check out [the walkthrough](#setting-up-a-slack-webhook).

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

That's it - your service will create DynamoDB backups on your desired schedule! You're an Ops superhero.

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

By default, it uses a boring `incoming-webhook` display name and a boring image. I like to customize it a bit:

<img width="996" alt="Webhook display" src="https://user-images.githubusercontent.com/6509926/33862690-9e465f04-dea9-11e7-94ba-cace749d0a75.png">

Paste your Webhook URL into the `serverless.yml` as the `slackWebhook`, deploy your service, and you'll start receiving notifications!

# Additional Notes

For the curious, I'll pass along some extra details and troubleshooting tips.

### Not all DynamoDB tables have backup enabled.

For some reason, not all DynamoDB tables are eligible to take a backup. I've found it's my older tables that don't allow backups.

If backups aren't enabled for your table, attempting a backup will throw a `ContinuousBackupsUnavailableException`.

### Backup Names are finicky

When creating a backup, you need to specify a backup name. I was using the name of the table plus the ISO 8601 format. I kept getting an opaque error of:

```
Error: An error occurred (InternalServerError) when calling the CreateBackup operation (reached max retries: 9): Internal server error
```

I finally discovered that AWS doesn't allow colons in backup names. 🤔 Cryptic errors aside, I just changed my timestamp to be `YYYYMMDDHHMMSS`.

### Outdated Botocore

To make the API call to create a backup, I'm using the [boto3](http://boto3.readthedocs.io/en/latest/) library for making AWS API calls in Python. It uses a second library called [botocore](https://github.com/boto/botocore) for understanding the shape of the AWS API.

Botocore uses a bunch of JSON files to describe the methods, inputs, outputs, and more of its various services. You can see the [whole list here](https://github.com/boto/botocore/tree/develop/botocore/data). To use a new operation, such as `create_backup()` for DynamoDB, you need to make sure you have a version of `botocore` with the proper models.

`Boto3` and `botocore` are packaged into the AWS Lambda environment, which is nice most of the time. It means you don't have to package your own AWS API packages into your Lambda zip files. It's annoying in times like these, right after re:Invent, when the outdated `botocore` dependency means you can use the newest methods.

Fortunately, you can upload your own `botocore` data files without packaging your own version of `botocore`! All you need to do is copy the data files for your desired models into your deployment package. You can see I've [included the DynamoDB files here](https://github.com/alexdebrie/serverless-dynamodb-backups/tree/master/dynamodb/2012-08-10). Then, set the `AWS_DATA_PATH` [environment variable](http://boto3.readthedocs.io/en/latest/guide/configuration.html#environment-variable-configuration) to the path where your data files are stored. I do it [directly in my function handler](https://github.com/alexdebrie/serverless-dynamodb-backups/blob/master/handler.py#L4-L8) before importing `boto3`:

```python
import os

# To get updated botocore data files
os.environ['AWS_DATA_PATH'] = '.'

import boto3
import botocore
...
```

![The More You Know](https://media.giphy.com/media/83QtfwKWdmSEo/giphy.gif)