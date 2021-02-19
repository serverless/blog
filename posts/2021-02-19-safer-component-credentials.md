---
title: Safer Credential Handling In Serverless Components
description: "We have removed local AWS profile access from the Serverless Components service completely"
date: 2021-02-19
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components-aws-profiles/blog-thumbnail-safer-components.png"
authors:
  - AustenCollins
category:
  - news
---


In January, concerns were raised regarding how our [Serverless Components](https://github.com/serverless/components) service used AWS credentials stored in a user’s default profile. These concerns were valid and caused additional confusion about how [Serverless Framework](https://github.com/serverless/serverless) handles credentials.

In response, we immediately updated our documentation and added clearer CLI prompts for Components users.  Now, after working with customers to ensure a successful migration path, we have removed local AWS profile access from our Components service completely.

Ultimately, we could have designed this feature better.  We’re truly sorry about that.  Here’s what happened, and how we’ve fixed it.

## What We Did Wrong

Since 2015, the Serverless Framework's model has been to deploy serverless applications from your machine directly to your own cloud infrastructure account using your locally stored credentials—and in no way has that open-source functionality ever changed.

However, we launched a new service last year called Serverless Components.  It’s an optional, premium service, which requires creating an account on serverless.com and logging in from the CLI in order to deploy your applications.

Components use a cloud engine for deployment, which our company hosts within our own secure AWS accounts.  This enables rapid deployments for Component users through innovations like source code caching to help developers get changes to the cloud, fast.

To perform deployments, the Components engine requires access to users' source code and Amazon Web Services account credentials. Many users requested that we automatically import AWS credentials stored in their “default” AWS Profile, which is a convention supported by AWS tools, the Serverless Framework, and others.  But the Components service is different from those tools because it introduced an intermediary into the deployment process. This is where we stumbled.

Users who didn’t explicitly specify credentials with Components could have passed credentials from their default profile through our cloud engine unknowingly. The Components service is also built into the Serverless Framework CLI, adding additional confusion as to how credentials were being handled by the Framework itself. We documented how using the Components service differs, but ultimately we should have scrutinized these design decisions more thoroughly.

![Serverless](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components-aws-profiles/components-screenshot-1.png)

## How We Fixed It

Every service and feature we build at Serverless, Inc. must empower developers to move fast safely, securely, and with full confidence in the tools they’re using. That means, no surprises... ever.

To remove the risk of any further confusion, we have removed all local credential handling from the Components service.

Now, Components require assuming an AWS IAM Role, which Components can use to generate temporary access credentials to perform deployments.  Further, Component users must explicitly set up their IAM Roles in the Serverless Dashboard, via the new [Providers feature](https://www.serverless.com/framework/docs/guides/providers/).

![Serverless](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components-aws-profiles/components-screenshot-2.png)

Lastly, we’re working to remove the Components service from the Serverless Framework CLI, to better separate concerns and make credentials handling more explicit.

If you have any questions, concerns, or feedback, please reach out to us at support@serverless.com.
