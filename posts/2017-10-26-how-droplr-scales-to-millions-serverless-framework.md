---
title: How Droplr Scales to Millions With The Serverless Framework
description: Droplr is used to share 1000s of screencasts and files every day. Here's how they empowered their growth with the Serverless Framework.
date: 2017-10-26
thumbnail: 'https://avatars2.githubusercontent.com/u/828077?s=400&v=4'
category:
  - user-stories
heroImage: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/featured-posts/05_How-Droplr-Scales.png
authors:
  - AntoniOrfin
---

I'm Antoni Orfin, a Solution Architect at [Droplr](https://droplr.com/?utm_source=serverlesscom&utm_medium=referral&utm_campaign=blogpost20171020). We're used by more than 500,000 users, who share thousands of screenshots, screencasts and files every day—so we're constantly looking for technologies that empower growth.

When we first heard about AWS Lambda, we were using a Docker-based microservices architecture. It carried some problems: rapid deployments, complexity of Docker-based microservices architecture and underutilized EC2. Lambda could help us eliminate some of that unneeded complexity.

We immediately knew we wanted to give Lambda a try. Our main goal was to make our development process even as streamlined as possible. Our main goals were to boost productivity and inspire innovation—make it super easy and fun for developers to deploy their own production-grade microservices.

So, we started doing some PoCs on the [Serverless Framework](https://serverless.com/framework/). Today we're leveraging several Lambda-hosted microservices on top of our existing architecture.

It's been quite a journey, but well worth setting off on! Read on for a deeper dive.

# Our Serverless architecture

From the very beginning, we knew we wanted to make a large portion of our infrastructure Serverless. For that reason we approached the process strategically.

First of all, we decided to migrate all of our workers that are processing background jobs:

- **Scheduled tasks** - things that should run periodically, CRON-like.
- **Functions invoked by events** - when a new drop (a file that is being shared) is created, multiple Lambda functions are invoked in parallel by AWS SNS notification.

Once we had this done, the fun part started. We needed to take care of all the public-facing microservices… :

- **REST APIs** - Node.js Express based APIs
- **Integrations’ microservices** - Droplr is richly integrated with other platforms like [Jira](https://droplr.com/blog/jira-droplr?utm_source=serverlesscom&utm_medium=referral&utm_campaign=blogpost20171020), Confluence and Trello. All of these integrations are running serverless.
- **Server Side Rendered web applications** - yep, we **do** SSR on Lambda :-)

[![Droplr's Serverless Architecture](https://d.pr/33vsN0.png)](https://d.pr/33vsN0?utm_source=serverlesscom&utm_medium=referral&utm_campaign=blogpost20171020)

We divide Lambda microservices by their business domain - like "Payments" or "Jira Integration". Single microservices may have Lambda handlers invoked by different types of events (e.g HTTP, SNS or Scheduled).

As we still use MongoDB and Redis, Lambda functions that need access to the database are running in our separated VPC that is peered with the databases’ private network. We didn’t see any spikes with MongoDB connections number, as Lambda containers are nicely reused and will use the same connection pool.

## The background jobs

The first part of our Serverless Proof of Concept was to migrate all of our background workers.

Prior to going serverless, we had Scala daemons that were constantly running in our ECS cluster and consumed Redis lists of events. We also had a couple of Ruby functions invoked by CRON. We found out that these were ideal components to rewrite with our serverless approach.

We decided to try AWS SNS as our primary “messaging” system. Each type of event had its own SNS channel. That way, we could easily set up separated Lambda functions that were  (e.g.) invoked only when new drop was created.

All of the functions run in parallel, so it’s very scalable approach. It’s also easy to monitor each of your SNS-consumers and spot anomalous rates of invocation failures.

Lambda’s native ability to schedule function invocations is a great drop-in replacement for CRON tasks. Just upload your Node.JS code, setup rate and you’re ready to go. You can also use standard “cron” syntax to make function run on a specific day or hour.

```yml
# serverless.yml - Sample function that deletes expired drops
functions:
  deleteExpiredDrops:
    handler: DeleteExpiredDropsHandler.handle
    events:
      - schedule: rate(10 minutes)    # Will run every 10 minutes
      - schedule: cron(0 5 ? * MON *) # ...and every Monday at 5:00PM (UTC)
```

## HTTP facing Lambda functions

After the trial period of Lambda-powered background jobs, we were sure that Serverless was ready for prime-time. We started to migrate our HTTP facing functions, one by one.

Most of the HTTP invoked Lambda functions are based on the Node.JS Express framework. We currently don’t divide them  strictly into separate functions but just rely on the Express router and the great [aws-serverless-express](https://github.com/awslabs/aws-serverless-express) middleware that automatically transforms requests/responses to the API Gateway format.

We soon realized that doing it this way is hugely beneficial:

- **Migration of existing Node.js is superbly straightforward.** Almost no code changes were required to run them on Lambda.
- **Cold-start effect is minimized**, especially when microservices are constantly monitored by Pingdom (more on that in the "Monitoring and Alerting" section).
- We can easily run and test microservices **locally** just by disabling the serverless middleware.

Still, even with this approach, it's very easy to separate certain endpoints to different functions, which may be necessary especially when some of them require higher memory limit or timeout.

We’ve superpowered our HTTP microservices, by setting **our own CloudFront distribution** in front of the AWS API Gateway. By doing that, we’re now able to:

- Set up a custom domain (currently also possible with native API Gateway)
- Have a real CDN caching when serving static files from API Gateway
- Save and analyze access logs of HTTP traffic
- Secure API endpoints by Web Application Firewall

We accomplished all this by simply creating a Serverless plugin, which we've released as an open-source project: [serverless-api-cloudfront](https://github.com/Droplr/serverless-api-cloudfront). The good news is that our performance tests didn't show any significant latency added by this solution.

# Securing all that Serverless
Serverless is quite a new technology, not (yet) widely adopted. and lacking in documented security best practices.

Security was one of our biggest concerns, and we spent hours figuring out how  to make everything work safely on all the layers of the stack.

## Blocking anomalous HTTP traffic with AWS WAF

The first layer of security is an **AWS Web Application Firewall** that we've attached in our CloudFront distribution.

[![AWS WAF - Blocked request](https://d.pr/Hzk1mb.png)](https://d.pr/Hzk1mb?utm_source=serverlesscom&utm_medium=referral&utm_campaign=blogpost20171020)

At first, AWS WAF checks a content of the HTTP request. It looks for string patterns that can be recognized as an XSS or SQL injection type attacks and automatically blocks matching, requests returning a "403 Forbidden" error code.

Next, client's IP is being checked in two types of blacklists. The first one is generated by gathering publicly accessible lists of IPs with “bad reputation” like Spamhaus. The second one includes IP addresses gathered by our log analysis Lambda functions that check for anomalies in HTTP traffic. For example, we automatically block clients that are generating abnormal number of failed requests per minute — so all kinds of automated web-crawlers that try brute-force or dictionary attacks.

## Running Lambda Safely in VPC

Internally, Lambda functions that need to communicate with our databases (MongoDB or Redis) run in an isolated VPC network, in a private subnets. We also use AWS NAT gateway to allow them to talk externally, with the internet.

Thanks to peering-connection between Lambda and our Databases’ private networks, we can use internal addressing for communication and security group rules. We also do use a Route53 private hosted zone for internal DNS resolution.

We use [Terraform](https://www.terraform.io/) to create all of that complex networking configuration, as it’s tied with the rest, non so-serverless parts of our AWS infrastructure.

## Securely passing configuration variables into Lambda functions

One of the trickiest parts we encountered when working with Lambda was how to properly pass configuration into our functions in a secure manner. Some of our functions need to communicate with external APIs (like Intercom), and we had to figure out how all of those credentials and other sensitive variables could be injected.

We tried different approaches, but finally we decided to use AWS Lambda environmental variables that are encrypted at-rest with our own AWS KMS keys. Until the function is deployed, we use our open-sourced [aws-env](https://github.com/Droplr/aws-env) that retrieves parameters from AWS Parameter Store and injects them using native Serverless Framework [ENV variables](https://serverless.com/framework/docs/providers/aws/guide/variables/#referencing-environment-variables).

```yml
# serverless.yml
provider:
  name: aws
  runtime: nodejs6.10
  environment:
    LOGGER_LEVEL: ${env:LOGGER_LEVEL} # That vars are being injected
    MONGODB_DB: ${env:MONGODB_DB}     # in deployment
```

That way, we control who can see decrypted, sensitive configuration, granting the access to it to the users with certain IAM policies only.  And we can audit the history of changes to parameters.

# Deployment

To deploy a whole Serverless microservice we use the standard ```$ serverless deploy``` command but invoked **in a Docker container**.

We build and deploy our code in a [Lambci](https://github.com/lambci/docker-lambda) Docker container that emulates a real Lambda environment. Thanks to that, we no longer have issues with npm packages that need to be pre-compiled. This approach also allows us to have very reproducible deployments, each time made in a clean environment and not polluted by any local files.

We currently use a self-hosted Jenkins as our primary Continuous Integration/Continuous Deployment server. We have it integrated with our Github organization, so each push to a master branch automatically invokes a code build, unit tests and finally—production deployment.

After every build, failed or successful, we instantly receive a notification on a dedicated Slack channel.

# Monitoring and Alerting

Monitoring and alerting is crucial for all production-grade services. It’s especially required when you work with a microservices architecture because it’s impossible to spot anomalies manually.

We use three SaaS tools for monitoring and alerting. At the moment, we don’t have any self-hosted monitoring software as we believe that, for the time being, it’s cheaper and more reliable for us to outsource it.

The most basic one is [Pingdom](https://www.pingdom.com/), which we use to quickly detect downtime of a specific microservice. It runs HTTP checks from multiple locations against selected URLs.

If a response returns a non 2XX status code, we're automatically alerted on our dedicated #monitoring Slack channel and by email. As some added bonuses, it **warms-up our Lambda functions** so we avoid cold starts,and collects response time so that we can spot some anomalies after deployment.

## Monitoring AWS Metrics

To see how our “infrastructure” behaves in the long run and in correlation with every independently running service, we use [DataDog](https://www.datadoghq.com/).

DataDog is richly integrated with AWS so it allows us to gather various metrics from “serverless” AWS services like Lambda, S3, CloudFront. The thing we liked the most is DataDog’s graphing feature. We can combine multiple metrics on a single graph and add mathematic functions to it.

For example, you can create a graph that represents the number of AWS Lambda errors divided by invocations to get the ratio of failed requests. Next, just set-up alerting with a condition of “ratio>50%” and you’re ready to go. DataDog will automatically send you an alert when the ratio of any specific function reaches 50% so you don’t have to create separate alerts for each function.

## Log Analysis

The last part of our monitoring stack is log analysis. That was the trickiest thing to chose but we ended up with [Logz.io](https://logz.io/).

It’s ELK-based and can automatically gather logs from S3 buckets (like ELB or CloudFront logs)—basically all we need. We can even set up alerting based on the logs condition. We mostly use it to analyze the CloudFront logs related to our file downloads to spot any anomalies or abusive users.

# #ServerlessForever

After having months of experience with the Serverless Framework, we consider it a backbone of modern Lambda deployments. The framework played a crucial role in making our [serverless journey successful](https://droplr.com/blog/going-serverless?utm_source=serverlesscom&utm_medium=referral&utm_campaign=blogpost20171020).

More than 50% of Droplr services are already migrated to Lambda. Every month, new APIs are moving there. For new microservices, it's our new standard to build them on top of Serverless Framework.
