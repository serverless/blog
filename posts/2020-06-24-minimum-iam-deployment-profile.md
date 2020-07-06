---
title: Minimum IAM permissions needed for my deployment profile
description: "You may have a need internally to restrict the permissions for the IAM role that makes deployments into your AWS account. This blog post is meant to be a guide as to how to go about doing just that"
date: 2020-05-26
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-express-thumbnail.png"
authors:
  - GarethMcCumskey
category:
  - guides-and-tutorials
---

Let's start with a nice caveat. Not everyone needs to or should concern themselves with the process of building a custom IAM role with restricted permissions. Why not? Because the permissions applied to the deployment profile are not the roles applied to the resources actually deployed. The role is exclusively used for deployment by CloudFormation and is not made avaialble to any other process so its impact onm security is almost negligible; the permissions available for deployment are not exposed as a part of your application which means even if your Lambda functions, for example, are compromised, they have their own set of permissions you control seperately.

Be that as it may, some organisations will have a policy in that requires all roles in production environments be as restricted as possible for various reasons. If you find yourself in that situation, then this is the blog post for you!

#### While in Development
If you are about to begin development of a new Serverless service, or are busy with one, it makes no sense to deploy a restricted role at this time. Why? Because you are probably going to be adding and removing new services constantly as is the nature of Serverless development. Not only would you need to spend a lot of time constantly adding new permissions to allow you to deploy the configuration of a new resource, the previous permissions you added need to be removed and it is a lot harder to keep tabs on that than you might think.

So how do you mitigate having roles for development when production requires deployment roles to be restricted? The answer is to dev work in an entirely different AWS account from where production runs. The risks that resstricted deployment roles is really trying to prevent is some attack on production data. If all development is done in an AWS account that never has production data in it, then that risk is entirely removed.

And the good news is, this is not as hard to do as it sounds. AWS provides a service called [Organizations](https://aws.amazon.com/organizations/) that allows you to add subaccounts under a parent AWS account and this is a very common pattern these days, even in outside of Serverless development. 

#### Ready for production

You have developed your application in a dev AWS account with a super broad set of permissions. You've tested and everyone is happy. Time to spin up the production AWS account, set up our deployment profile and CI/CD (we even have a hand dandy [CI/CD guide](https://www.serverless.com/learn/guides/cicd/) that describes some really awesome software development lifecycle ideas), and now we want to restrict that role that was created by connecting our new deployment profile.
