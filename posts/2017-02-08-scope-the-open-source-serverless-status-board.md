---
title: How to gain more visiblity into your Github Projects using Scope
description: Learn how you can get a quick bird's eye view of your project.
date: 2017-02-08
thumbnail: https://cloud.githubusercontent.com/assets/532272/22729200/9248f46e-ed96-11e6-8cb4-7e2e76ac7d72.jpg
layout: Post
authors:
  - DavidWells
---

Let's face it, large GitHub projects are **hard to follow**. 

They have tons of issues and PRs flooding your inbox and it's hard to sift through them on GitHub.

We face this on a pretty regular basis here at Serverless, so we needed a solution.

First, we tried [GitHub projects](https://help.github.com/articles/about-projects/), but the manual effort it took to keep the columns up to date was a bummer.

Next, we did what any good engineer would do... we built our own solution using Serverless technology.

## Introducing Scope

<img align="right" width="391" height="218" src="https://cloud.githubusercontent.com/assets/532272/22727459/cad63336-ed8d-11e6-8924-fce36f239a84.gif">

**Scope** is an open source status board driven by Serverless technology.

It gives a customizable bird's eye view of your open source project.

The application can be cloned down and deployed for your open source project in minutes. [See how](https://www.youtube.com/playlist?list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3)

Deploy it as a stand-alone application, or embed it directly into your project's site.

Run it for **[free](https://aws.amazon.com/free/)** under AWS's generous free tier.

<iframe width="560" height="315" src="https://www.youtube.com/embed/kTrPeKZ0JxI?list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3" frameborder="0" allowfullscreen></iframe>

## Why we built it

We built this tool for our community to help keep people up to speed with what's happening with the serverless project, and to highlight places where we actively want feedback + collaboration.

- Quickly sort and see high priority issues and pull requests
- Call out which issues need attention from your community
- Zoom into important aspects of your open source project

## Features

- Customize the labels/columns to fit your project
- Customizable styles 💁
- Driven by push based GitHub webhooks
- Run as stand-alone app or embed on your project's site
- Look mom! No servers!

Data automatically updates when activity happens in your repository. Your status board will reflect the latest state of your project.

## Documentation

### [Front End Documentation & Setup](https://github.com/serverless/scope/tree/master/frontend)

### [Back End Documentation & Setup](https://github.com/serverless/scope/tree/master/backend)

### [Video Tutorials](https://www.youtube.com/playlist?list=PLIIjEI2fYC-BtxWcDeTziRp7cIZVEepB3)

## Contributing

Want to contribute back to the project? Drop an issue or open up a PR.

## How it works

A Lamba function sits waiting for a github webhook `POST` and saves the relevant information to be called by the UI.

![cloudcraft - status board webhook listener 1](https://cloud.githubusercontent.com/assets/532272/22728277/ead7cb00-ed91-11e6-98b4-98fdb36c58c2.png)

The UI calls DynamoDB, avoiding heavy githubAPI calls/throttling issues and displays the issues based on your columns setup!

![cloudcraft - status board ui 2](https://cloud.githubusercontent.com/assets/532272/22728295/01f11e72-ed92-11e6-9db8-473874b3a713.png)

## Questions?

Ping me [@DavidWells](http://twitter.com/davidwells)
