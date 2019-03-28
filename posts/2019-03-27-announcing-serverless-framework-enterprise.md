---
title: "Announcing Serverless Framework Enterprise: The Total Serverless Solution"
description: "The end-to-end tool for building and managing serverless applications."
date: 2019-03-27
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-enterprise-release/serverless-framework-enterprise-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-enterprise-release/serverless-framework-enterprise-header.png"
dontShowHeroImageInBlog: "true"
category:
  - news
authors:
  - AustenCollins
---

Last year, we announced our **Serverless Platform Beta**. Today, we’re bringing it out of Beta, renaming it to [Serverless Framework Enterprise](https://serverless.com/enterprise/) and introducing a handful of new features that empower developer teams to build amazing serverless applications.

Check it out [here](https://serverless.com/enterprise/) to get access.

<video autoplay muted loop controls poster='https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-enterprise-release/FWE-video-start-image.png'>
    <source src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-enterprise-release/serverless-framework-enterprise-dashboard-overview-SMALL.mp4" type="video/mp4">
    Sorry, your browser doesn't support embedded videos.
</video>

The serverless movement was never supposed to be about needing multiple tools to build and operate your applications. Serverless is about doing more with less.

What Serverless Framework users appreciate most is that it provides everything a developer needs to build and deploy their serverless application, in one simple, rich experience.

Now, **Serverless Framework Enterprise** adds to that. It focuses on solving serverless operations problems for developer teams, with a richer experience, all while keeping it simple, so you can focus on results, not more tech complexity.

Once you turn on Serverless Framework Enterprise, here’s what you get out-of-the-box...

#### Serverless Insights

Serverless applications are comprised of many functions and cloud services, which means they must be monitored differently than traditional applications.

Serverless Framework Enterprise offers a solution for this by including a complete monitoring and alerting feature-set called **Serverless Insights**.

Automagically upon deployment, your Functions will be instrumented to generate performance information and alerts, which can be viewed in the Serverless Framework Enterprise console.

![Serverless Framework Enterprise Dashboard](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-enterprise-release/serverless-framework-enterprise-dashboard-overview.png)

The Enterprise console includes simple charts that you can click for low-level details. It also includes an Activity feed that will report alerts and events about your serverless application, like “Deployments,” “Unusual Invocation Rates,” and “New Error Detected”.

When a new error is detected in your code, we’ll tell you about it immediately. We’ll even tell you where the error is.

![Serverless Framework Enterprise Dashboard Error Alerts](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-enterprise-release/serverless-framework-enterprise-dashboard-error-alerts.png)

#### Serverless Secrets

As our users ship increasing amounts of functions and applications, it becomes more difficult for them to manage their sensitive information, like credentials.

Serverless Framework Enterprise ships with a solution for secrets management called **Serverless Secrets**, so your team can easily manage and delegate access to sensitive information your serverless applications require (e.g. access keys).

You can create secrets within the Enterprise console and easily reference them via the Serverless Framework’s variable system.

You can also create a special type of secret that gives the Serverless Framework temporary access to deploy to your Amazon Web Services account.

Using this, the developers on your team and your CI/CD system do not need access credentials to your cloud account. All that’s needed is to add the AWS Secret to the “credentials” property in “serverless.yml”.

![Serverless Framework Enterprise Secrets](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-enterprise-release/serverless-framework-enterprise-secrets.png)

#### Serverless Safeguards

Many organizations are seeking to standardize serverless development across their engineering teams. However, they need to ensure their developers are following best practices as well as organizational policies.

Serverless Framework Enterprise includes its own policy engine called Serverless Safeguards. Safeguards enable managers and operations teams to configure policies that must be complied with, like “restricted-deploy-times,” “required-stack-tags,” or “no-overly-generous-iam-role-statements,” in order for a Serverless Framework deployment to succeed.

Safeguards can be configured in the Enterprise console. There are over a dozen Safeguards that come out-of-the-box with Serverless Framework Enterprise, that will warn you if your application contains any well known architectural anti-patterns.
Think of it as a linter for serverless applications.

![Serverless Framework Enterprise Safeguards](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-framework-enterprise-release/serverless-framework-enterprise-safeguards.png)

#### Available Now

Serverless Framework Enterprise is available today. [Click here to get access](https://serverless.com/enterprise/)
