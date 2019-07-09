---
title: "How BuildCenter and Serverless Guru Streamlined Their Serverless Development Cycle"
description: "BuildCenter makes digital tools for builders. Learn how Serverless Guru helped them streamline their operations using Serverless Framework."
date: 2019-07-09
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-header.png"
category:
  - user-stories
authors:
  - NickGottlieb
---

BuildCenter makes smart and easy to use digital tools for builders to streamline their operations.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-1.png">

#### Why Serverless?

BuildCenter chose to use serverless over more traditional options because they wanted the ability to scale easily as well as not pay for resources that are not being used. They are also a small team and wanted something that would be easy to maintain in a central location as the demand scaled.

#### Where did Serverless Guru come in?

After the decision was made to move towards serverless, BuildCenter reached out to [Serverless Guru](https://serverlessguru.com/), to discuss the best path forward. Over the following days, the Serverless Guru team began evaluating the BuildCenter’s requirements and what the scope of the project would entail.

BuildCenter evaluated Serverless Guru’s proposal and decided that this team was the best fit for the project. Serverless Guru brought in a wealth of experience around serverless, cloud development, automation, and application development which allowed BuildCenter to augment their entire backend development and DevOps needs to the Serverless Guru team.

#### Green lights

Serverless Guru began transitioning the BuildCenter’s existing Terraform infrastructure to use the Serverless Framework. The project was at such an early stage that the transition away from Terraform only required a simple re-write. 

Even this quick change achieved a large reduction in infrastructure size and complexity by allowing Serverless Framework to automatically generate much of the code in the background, meaning once again less time was being devoted to anything other than the product.  

When Serverless Guru finished transitioning the existing Terraform pieces into Serverless Framework the team began extending the BuildCenter backend and frontend infrastructure.

The frontend was a SPA (Single page application) written using AngularJS. The supporting frontend infrastructure that served the frontend application was a combination of the following services:

* AWS S3 for static hosting
* AWS Cloudfront for caching 
* AWS ACM for HTTPS 
* AWS Route53 for DNS 

Each one of these services, above, was automated via the Serverless Framework and all of it was able to be deployed and connected with a single terminal command.

The backend was written using NodeJS and was broken apart into a microservice architecture where each microservice was a single AWS Lambda function. The supporting backend infrastructure required the following services:

* AWS Lambda for the business logic
* Amazon Aurora Serverless for the MySQL database 
* AWS Cognito for adding an authentication layer to the REST API 
* Amazon API Gateway for hosting the REST API 
* AWS SES for sending emails to users

#### The beauty of automation

While building the frontend and backend infrastructure, Serverless Guru was able to hit automation levels as high as 100%. At some points, the Serverless Framework or the underlying AWS Cloudformation did not support the functionality required for these high levels of automation which led Serverless Guru to seek out third-party Serverless Framework plugins and leverage the AWS CLI.

Whenever the AWS Cloudformation functionality simply didn’t exist yet Serverless Guru wrapped the edge case into deployment scripts which would kick off a series of events. The chain of events would pull in values, write out files, pass those files into the Serverless Framework, and finally make a deployment to AWS. The result of that work gave BuildCenter confidence that if anything ever goes down or is accidentally deleted it could easily be brought back up in less than a couple of minutes without any manual intervention.

#### Multi-stage deployments

The Serverless Guru team spent a lot of time ensuring that every piece of infrastructure BuildCenter relies on for production could be redeployed in an exact mirror environment. This was achieved by using the built-in [Serverless Framework](https://serverless.com/framework/docs/providers/aws/guide/variables/) flags provided. Let’s take a look:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-2.png">

This command would deploy to a stage called test. By replacing that single word we can easily spin up every detail that is being used in production, including the database, authentication, etc. to a whole new environment. In the background the Serverless Framework takes that stage name and sets it as a variable.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-3.png">

Then to reference that variable Serverless Guru would do this:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-guru-case-study/serverless-guru-case-study-4.png">

Serverless Guru writes about topics like this on their [training site](https://training.serverlessguru.com) and their [blog](https://medium.com/serverlessguru). If you’re interested in diving deeper than this basic example you should give them a look.

#### Separating Serverless stacks: stateless vs. stateful

When it comes to organizing projects using the Serverless Framework Serverless Guru has found a lot of success by defining Serverless stacks around the question, “Are these AWS resources stateless or stateful?”.

#### How to identify if a component is stateful or stateless

Stateless resources can easily be torn down (e.g. an AWS Lambda function) and recreated. As between AWS Lambda invocations, there is no shared data. Stateful resources, if torn down, could result in a serious impact on your business (e.g. databases, AWS S3 buckets, AWS Cognito User Pools) and require more careful attention.

If you’re not careful the automation you’ve built to streamline deployments can just as easily be flipped to cause a huge outage and data loss. This is due to the fact that when a Serverless stack is deleted all the resources contained in that stack are deleted as well.

To ensure BuildCenter didn’t have that problem, Serverless Guru implemented safeguards to avoid juggling knives.

The first way Serverless Guru did this was through resource isolation. They separated BuildCenter’s Serverless stacks based on how critical the contents were to help prevent developer mistakes from bleeding over to core components of the application. For example, one Serverless stack could be a few AWS Lambda functions and an API definition: this stack would be considered stateless and could be destroyed and redeployed without impact. Another stack could hold our database or user file storage: this stack would be considered stateful and any tampering would cause a major outage.

The second way to protect stateful resources is by using [Termination Protection](https://aws.amazon.com/about-aws/whats-new/2017/09/aws-cloudformation-provides-stack-termination-protection/) to block any developers from accidentally running `serverless remove --stage prod` and tearing down the production stack. Since this is a common fear, Serverless Guru created a Serverless Framework plugin to help companies enable termination protection on Serverless stacks based on specific stages. If you’re interested in learning more about their plugin you can check it out [here](https://www.npmjs.com/package/serverless-termination-protection). The termination protection plugin was recently released on npm and it’s being used in the BuildCenter project!

The third safeguard is the use of resource level protection via an AWS Cloudformation property called DeletionPolicy. It allows Serverless Guru to tell AWS Cloudformation that if the BuildCenter stack is deleted, don’t delete this specific resource. Here is a snippet of what this looks like, `“DeletionPolicy" : "Retain”`.

These safeguards add an important layer of development protection but what happens when someone deletes the AWS resource itself? For these instances Serverless Guru makes sure they have backup strategies for all stateful resources. For some scenarios, AWS Cloudformation has built-in solutions for this which can easily be used while for others Serverless Guru rolls out custom solutions to achieve the level of reliability that BuildCenter requires.

#### Important takeaways

When it comes to edge cases where AWS Cloudformation doesn’t support certain functionality it’s critical to take the additional time to find a way to work these gaps into your automation. Serverless Guru will typically leverage a Serverless Framework plugin or the AWS CLI to handle unsupported functionality that AWS Cloudformation is missing. This ensures that if anything ever happens where you need to completely recreate your production application, you can do so through a single terminal command.

This proactive approach also simplifies training new team members as you keep everything in source control and avoid black box development.

Another key area is having a solid local testing workflow. When working with AWS Lambda functions and Amazon API Gateway it’s important to find and fix bugs locally before ever deploying to the cloud.

BuildCenter uses a lightweight ExpressJS server with hot reloading which will point to the different AWS Lambda function files based on the path in the URL. For example, when a developer sends a POST request to `localhost:3000/register` the ExpressJS server would take the body of the request and pass it into an event object, then point the request to the register.js file, and everything would function the same as if it was deployed on AWS.

By focusing energy on solid local testing you are increasing developer velocity and when your developers are moving faster and debugging more efficiently you save time and money.

#### What has your experience been working with Serverless Guru?

“Everything has been great. Having Serverless Guru develop the back end and automate the deployment of both the back and front ends has really helped streamline our development cycles. As we build more applications and get into more automation with things like testing and CI/CD, we are excited by the potential we can achieve with our current team, as well as how easy it would be to grow the team with our current tool set.” - Jason Alcaraz, Project Manager at BuildCenter.
