---
title: How To Schedule Posts for Static Site Generators (Jekyll, Hugo, Phenomic etc.)
description: Open source static site scheduler tool built with serverless
date: 2017-03-07
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/post-scheduler-icon-clear.png
layout: Post
authors:
 - DavidWells
---

<img align="right" width="250" height="123" src="https://cloud.githubusercontent.com/assets/532272/23386639/779ce26c-fd0c-11e6-9e54-f33281e17719.jpg">

Like many static sites we use Markdown + GitHub for all of our [blog content](https://github.com/serverless/blog/).

Having content under version control comes with some great benefits:

- **It's open** - Anyone can submit/update content and fix typos via pull requests
- **Version control** - Roll back & see the history of any given post
- **No CMS lock in** - We can easily port to any static site generator
- **It's just simple** - No user accounts to manage, no CMS software to upgrade, no plugins to install.

All that said, there are some *missing features* when it comes to running your site or blog via a static site generator.

Lacking the ability to **schedule posts** to publish at a specific time is a pain. Publishing content to our [static site](https://github.com/serverless/site) and [blog](https://github.com/serverless/blog/) has been a manual process.

We had to physically be at our keyboards and click the "merge" button in GitHub.

How antiquated...

So I thought to myself:

> There has got to be a better way... a better **serverless** way.
> - **David's brain**

## Introducing the Post Scheduler for Static Websites

The [post scheduler](https://github.com/serverless/post-scheduler/) is a Serverless project that gives static site owners the ability to schedule posts (or other site content).

It works with any static site setup (Jekyll, Hugo, Phenomic, Gatsby etc.)

**How much does it cost?:**

It's **free** and open source project. You can easily run under this under the generous free tier of AWS.

Just clone it down, add in your repo details and `sls deploy` it into your AWS account.

**Before:**

Late night manual merges **🙈**

**After:**

Sipping margaritas on the beach while posts are being published automatically. **🎉**

## Show Me The 💸 (Demo)

<iframe width="560" height="315" src="https://www.youtube.com/embed/YETxuhexZY4?list=PLIIjEI2fYC-BubklemD4D51vrXHOcUOpc" frameborder="0" allowfullscreen></iframe>

[Watch the rest of the playlist on youtube](https://www.youtube.com/watch?v=YETxuhexZY4&index=1&list=PLIIjEI2fYC-BubklemD4D51vrXHOcUOpc)

## How It Works

<iframe width="560" height="315" src="https://www.youtube.com/embed/RaJw_6s5nWc?list=PLIIjEI2fYC-BubklemD4D51vrXHOcUOpc" frameborder="0" allowfullscreen></iframe>

1. A GitHub webhook fires when a pull request (aka new posts or site content) is updated.

2. If the pull request comment has a comment matching `schedule(MM/DD/YYYY H:MM pm)` & the person is a collaborator on the project, the post/content gets scheduled for you.

3. A serverless cron job runs every hour to check if a post is ready to be published.

4. When the post is ready to be published, the cron function automatically merges the branch into `master` and your site, if you have CI/CD built in, will redeploy itself.

To cancel scheduled posts, delete the scheduled comment and it will unschedule the branch.

### Github Webhook Architecture

![cloudcraft - post scheduler webhook](https://cloud.githubusercontent.com/assets/532272/23387076/2e7960b2-fd0f-11e6-88da-49517b27d8ae.png)

### Cron Job Architecture

![cloudcraft - post scheduler cron setup](https://cloud.githubusercontent.com/assets/532272/23388042/e129772e-fd14-11e6-96ca-ff23a019a51e.png)

## How to Install

<iframe width="560" height="315" src="https://www.youtube.com/embed/rfZPQX-PQkQ" frameborder="0" allowfullscreen></iframe>

### 1. Clone down the [repository](https://github.com/serverless/post-scheduler/) and run `npm install` to install the dependencies

### 2. Duplicate `config.prod.example.json` into a new file called `config.prod.json` and insert your Github username, API token, and webhook secret

  ```json
  // config.prod.json
  {
    "serviceName": "blog-scheduler",
    "region": "us-west-2",
    "TIMEZONE": "America/Los_Angeles",
    "CRON": "cron(0 * * * ? *)",
    "GITHUB_REPO": "serverless/blog",
    "GITHUB_WEBHOOK_SECRET": "YOUR_GITHUB_WEBHOOK_SECRET_HERE",
    "GITHUB_API_TOKEN": "YOUR_GITHUB_API_TOKEN_HERE",
    "GITHUB_USERNAME": "YOUR_GITHUB_USERNAME_HERE"
  }
  ```

  - `serviceName` - name of the service that will appear in your AWS account
  - `region` - AWS region to deploy the functions and database in
  - `TIMEZONE` - Timezone the cron runs on. See `timezone.json` for available options
  - `CRON` - How often you want to check for scheduled posts? See the [AWS cron docs](http://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) or [serverless `schedule` docs](https://serverless.com/framework/docs/providers/aws/events/schedule/) for more information. **Default:** every hour on the hour
  - `GITHUB_REPO` - The `owner/repoName` of your repository
  - `GITHUB_WEBHOOK_SECRET` - Any string you want. This gets plugged into your webhook settings
  - `GITHUB_API_TOKEN` - Personal access token. See below for additonal info
  - `GITHUB_USERNAME` - Your github username. Used for requests to github

### 3. Deploy the service with `serverless deploy`. If you need to setup Serverless, please see [these install instructions](https://github.com/serverless/serverless#quick-start).

### 4. Take the POST endpoint returned from deploy and plug it into your [repositories settings in github](https://youtu.be/b_DVXgiByec?t=1m9s)

![image](https://cloud.githubusercontent.com/assets/532272/23144203/e0dada50-f77a-11e6-8da3-7bdbcaf8f2a0.png)

1. Add your GitHub webhook listener URL into the `Payload URL` and choose type `application/json`

2. Plugin your `GITHUB_WEBHOOK_SECRET` defined in your config file

3. Select which GitHub events will trigger your webhook

4. Select Issue comments, these will be where you insert `schedule(MM/DD/YYYY H:MM pm)` comments in a given PR

### 5. Submit a PR and give it a go!

## Contributions Welcome

Have an idea on how we can improve the static site post scheduler?

Leave us a comment below, [submit a PR](https://github.com/serverless/post-scheduler/), or tweet [@DavidWells](https://twitter.com/davidwells)

## Was this post scheduled?

How did you guess it?

[This post was scheduled!](https://github.com/serverless/blog/pull/94)
