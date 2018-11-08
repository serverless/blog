---
title: 4 Ways to Secure & Prevent Vulnerabilities in Serverless Applications using Snyk
description: "The new Serverless Snyk plugin scans vulnerable open source packages and alerts of potential security risks."
date: 2016-11-03
thumbnail: 'https://res.cloudinary.com/snyk/image/upload/w_400/v1468845258/logo/snyk-avatar.png'
layout: Post
authors:
  - TimKadlec
---

<img align="right" width="150" height="150" src="https://res.cloudinary.com/snyk/image/upload/w_400/v1468845258/logo/snyk-avatar.png">Serverless is a powerful new approach that enables developers to focus on building features instead of having to focus on the underlying architecture.

From a security perspective, it greatly reduces the risk of security issues due to unpatched servers. But it doesn't totally eliminate the risk. In serverless architectures vulnerable open source packages become the primary security risk.

Open source software is increasingly consumed in the form of packaged code dependencies downloaded from repositories, such as npm, RubyGems, Maven, etc. The use of these packages continues to grow, and already the majority of code deployed in your app is most likey open source.

The Snyk team approached serverless security with the following premises: The security vulnerabilities in these open source packages are typically known, and logged as GitHub issues.

Many of these open source packages are downloaded millions of time each month, making exploits of their vulnerabilities highly reusable. Further, tracking these packages is difficult considering that any developer can add a dependency that includes lots of other indirect dependencies along with their security flaws.

The new [Serverless Snyk plugin](https://github.com/Snyk/serverless-snyk) was created to address these issues allowing you to ship securely and focus on building your app.

## The Serverless Snyk Plugin
![Screenshot of the Serverless Snyk plugin in action](https://res.cloudinary.com/snyk/image/upload/c_scale,w_900/v1478099693/serverless-snyk-screenshot.png)

The [Serverless Snyk plugin](https://github.com/snyk/serverless-snyk) helps to prevent vulnerable packages in your Serverless application, using [Snyk.io](https://snyk.io).

The plugin achieves this by focusing on four stages: **find, fix, prevent and respond.**

### 1. Find
With the Serverless Snyk plugin installed, each time you deploy the plugin will scan your dependencies and test them against Snyk's [open-source vulnerability database](http://snyk.io/vuln). Serverless Snyk can either stop the deploy at this point (the default behavior), enabling you to address the issues, or continue on, simply noting the vulnerabilities for you to return to.

### 2. Fix
With Snyk [GitHub integration](https://snyk.io/docs/github?utm_source=SLESSPOST) a PR can be submitted to your repository with any updates or patches needed to secure your application. You can also fix the issues by installing and running `snyk wizard` locally. In either case, Snyk will create a `.snyk` policy file to help guide future Snyk commands. If the Serverless Snyk plugin sees that you have a policy file in place before your application is deployed it will apply any of the updates and patches you have specified by [running `snyk protect`](https://snyk.io/docs/using-snyk?utm_source=SLESSPOST#protect).

### 3. Prevent
Security is a continous process. As your application continues to evolve the dependencies it uses may change. Snyk runs everytime you deploy to help identify and preemptively fix any new vulnerabilities.

### 4. Respond
You're given an API token when you sign up for Snyk. By including the API token in your Serverless project (using a `.env` file to ensure it's not mistakenly published), the Serverless Snyk plugin will take a snapshot of the current state of your dependencies and save it to your account. Whenever a new vulnerability is released that impacts your application, Snyk will notify you, and anyone else in your Snyk organization, by email or Slack so you can address the issue right away.

## Celebrate Security
With the Serverless Snyk plugin in place, you can now let everyone know about your newly improved level of security by including a badge in your repository. Here's what the badge looks like right now for the Serverless Snyk plugin itself:

[![Known Vulnerabilities in Serverless Snyk](https://snyk.io/test/github/snyk/serverless-snyk/badge.svg)](https://snyk.io/test/github/snyk/serverless-snyk)

You can find more information about how to include the badge for your GitHub repository in the Snyk [documentation](https://snyk.io/docs/badges?utm_source=SLESSPOST).

## Summary
Serverless is gaining momentum as an approach that enables developers to focus on building features instead of focusing on the underlying architecture.

From a security standpoint, it reduces security issues due to unpatched servers. When paired with the new Serverless Snyk plugin, you can ensure your dependencies will also be secure — automating security so that you can focus on building your application.

## What other methods is your team using for security in the serverless world?

## Let us know in the comments down below.
