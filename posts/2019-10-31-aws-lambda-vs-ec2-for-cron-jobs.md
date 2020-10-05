---
title: Running cron jobs in the cloud - Amazon EC2 vs AWS Lambda
description: "In this article, we compare Amazon EC2 and AWS Lambda for running cron jobs in AWS and offer guidance for when to choose which of the two."
date: 2019-10-31
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/aws-lambda-vs-ec2-for-cron-jobs/ec2-vs-lambda-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/aws-lambda-vs-ec2-for-cron-jobs/ec2-vs-lambda-header.png"
authors:
  - GarethMcCumskey
category:
  - guides-and-tutorials
---

Cron jobs are one of the things that have gotten harder, not easier, when moving to the cloud.

The motivation to automate recurring tasks is still strong in the software community, but while companies have been transitioning their infrastructure towards cloud environments, they’ve been falling behind on tooling for daily tasks. Previously, when companies hosted servers in their own data centers, scheduling a cron job to run on a spare machine was a 15-minute task. But with the move to the cloud, there are no longer any spare machines. Companies track infrastructure closely because the management of this infrastructure is now done automatically, and access to it is restricted, creating new barriers to automation in cloud environments.

The first solutions to general automation in the cloud ran on Amazon EC2: companies would spin up a machine and use it for cron jobs, or they’d install a layer of middleware on top of EC2, such as [Sidekiq](https://github.com/mperham/sidekiq). These solutions were unsustainable due to overspending on idle machines. Running cron jobs using Sidekiq and similar scheduling systems also meant that the software engineering teams had to maintain an application layer for scheduling the jobs, and this resulted in unnecessarily tight coupling of cron jobs to the business logic of the given applications.

AWS Lambda is taking its place as the new standard for task automation in AWS environments. When used with the [Serverless framework](https://serverless.com), AWS Lambda allows you to combine a great developer experience with the advantage of only paying for what you use, saving on compute costs. Of course, Lambda has its limitations, but in a large proportion of cases it can be a solution for recurring tasks and cron jobs in the cloud that is easier to develop for, more secure, and more [observable](https://en.wikipedia.org/wiki/Observability) than EC2.

In this article, we’ll compare Amazon EC2 and AWS Lambda for running cron jobs and offer guidance for when to choose which of the two.

### Amazon EC2 vs. AWS Lambda for running cron jobs

**Cost and resource utilization**
Under EC2, you must reserve an entire machine for your cron jobs at all times. Unless you have a very high and consistent number of cron jobs that you run, you’re likely underutilizing your EC2 machine.

With Lambda, AWS schedules your job once created and only charges you for the amount of time the job spends running. You pay for only what you use, and your costs are proportional to the number of cron jobs you run.

This pricing model for AWS Lambda can be both a positive and a negative. If you run a small number of cron jobs, fewer than would use up an entire EC2 machine, you’ll pay less overall using Lambda. But if you run many scheduled tasks, or if your tasks have long execution times, the AWS Lambda charges may be higher than the equivalent computing capacity on EC2. In this case it would be more economical to choose EC2, perhaps especially so when using EC2 [reserved instances](https://aws.amazon.com/ec2/pricing/reserved-instances/).

**Software available for cron jobs and machine maintenance**
Here are some of the regular maintenance tasks you’ll need to perform on any EC2 machines you use for cron jobs:

- Update the operating system.
- Install security updates.
- Clean up outdated temporary files.
- Reboot the machine whenever AWS needs to migrate it to a newer infrastructure.

In contrast, AWS Lambda is a fully managed service, so all these tasks are taken care of by AWS. You don’t need to spend any time on them when using Lambda. But with Lambda you give up any flexibility around pre-installed software, operating system versions and available programming language runtimes.

**Deployment**
To ensure that your cron jobs deliver maximum value, they must be easy to update and iterate on. The deployment process forms a key part of the iteration cycle. Repeatable, traceable deploys allow you to add value faster and with more confidence. Just as in the cases of microservices, web applications and legacy software, you need a robust deployment process for your cron jobs as well, and this is very much attainable when running on either Amazon EC2 or AWS Lambda.

On AWS Lambda, each function has a version identifier associated with it. Any change to the code creates a new version of the function—and this is the core of the deployment process. When using the Serverless Framework, running `serverless deploy` not only creates a new version of the function but makes all necessary changes to your AWS infrastructure to deploy a new version of your Lambda cron job. You can run the deployment manually as you see fit or, if you [use](https://nvie.com/posts/a-successful-git-branching-model/) [Git Flow](https://nvie.com/posts/a-successful-git-branching-model/) for your cron jobs, you can also run the deployment automatically via your CI environment whenever there is a merge to the default branch. This way you have a convenient and flexible deployment process for your cron job.

When using EC2 for your cron jobs, a consistent deployment process requires more work. You most likely don’t want your team members to have direct access to the production environment, so you’ll need a way to update the cron jobs on the EC2 machines remotely and automatically. One solution would be to use a configuration management system (like [Chef Infra](https://docs.chef.io/chef_overview.html)) to keep track of and update the cron jobs on your EC2 servers whenever developers make changes to the cron jobs’ code. Another option might be to create a versioned Docker container with your cron jobs and then set the EC2 machines to regularly pull the latest version of the container.

In short, using EC2 machines for your cron jobs means you need to build the deployment automation yourself, while with AWS Lambda you get it out of the box.

**Secrets management**
Your cron jobs very likely need to connect to your backend systems, which means you’ll need to make sensitive credentials available to the cron job when it runs. As it happens, many teams who pay plenty of attention to handling secrets for their microservices and applications lack a secrets management strategy for their cron jobs. In an ideal world, you’d be able to grant your developers all the flexibility they need to iterate on and test the cron jobs while creating zero security risks.

When running cron jobs on Amazon EC2, you can, for example, use a secrets store like [Vault](https://vaultproject.io). With Vault, your cron jobs can dynamically get the credentials they need. The secrets don’t get stored on the machine that’s running the cron jobs, and if you change a secret, the cron jobs will automatically receive that change. The downside of implementing a solution like Vault, however, is the overhead of managing the secrets store. You’ll need to set up the store itself, maintain the underlying server and see to getting the credentials from the store and into your cron job.

With AWS Lambda, you can use a number of off-the-shelf services to handle secrets management. You can choose between [AWS SSM](https://aws.amazon.com/systems-manager/) and [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/), or you can use the [Serverless Framework’s secrets management functionality](https://serverless.com/blog/serverless-now-full-lifecycle/) to take care of secrets without additional operational overhead. Check out [our article on secrets management for AWS Lambda](https://serverless.com/blog/aws-secrets-management/) for a comparison of these three options.

Overall, AWS Lambda has more options for secrets management that require less configuration and maintenance.

**Metrics and alerts**
When a cron job breaks, developers generally don’t notice until it overloads another system or goes out of service. To prevent service disruptions from cron jobs not running or running incorrectly, it can be very helpful to set up a reliable metrics feed and alerts based on those metrics. The metrics and alerts make you aware of problems so that you can resolve them before they have any downstream effects on your infrastructure.

Both EC2 and AWS Lambda allow you to export metrics to [CloudWatch](https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/WhatIsCloudWatch.html), and setting up alerts on those metrics is straightforward. On AWS Lambda, emitted CloudWatch events are generally tied to function executions and run times. CloudWatch’s default metrics may not be right for monitoring infrequently running functions (like cron jobs), so you may need to adjust the metrics coming from your cron-job Lambda functions. With EC2, however, the default CloudWatch metrics only monitor the machine itself, such the load average and the amount of memory used, offering essentially no visibility into the cron jobs running on the machine. If you use EC2 for cron jobs, you will certainly need to create and submit your own metrics to CloudWatch (or other metrics systems).

AWS Lambda has a built-in metrics system that’s more geared toward short-lived tasks like cron jobs. However, using CloudWatch can get expensive fast, and configuring the right alerts can be challenging for jobs that don’t run often. To address this, the Serverless Framework provides pre-configured alerts that kick in when there is an unusual level of activity in your function, or when it generates a new exception.

Independent of the metrics system you choose, getting visibility into how your cron jobs run and where they might have issues greatly reduces the risk of a job silently failing and impacting downstream services and infrastructure.

### EC2 vs Lambda: which one should you use for cron jobs?

We’ve covered all the ways in which AWS Lambda and EC2 differ in running cron jobs. Both of these services are cloud-native ways to automate tasks in your infrastructure.

Deciding which one is the right choice for your company and your team depends on your particular use case, and whether it fits well with what AWS Lambda can do. If AWS Lambda can run your cron jobs without problems, it is very likely to be a more cost-effective and more easily manageable solution. And if you use Serverless Framework with AWS Lambda, you also get an out-of-the-box solution for secrets management, a number of built-in alerts and metrics and a great developer experience.

There’s definitely still a place for EC2 in running cron jobs when the tasks have specific requirements that Lambda can’t support, such as long-running jobs, jobs that require access to special resources like GPUs, or jobs that are written in runtimes not supported by Lambda. For these use cases, you’ll need to create your own solutions in concert with other AWS services for deployment, secrets management and alerting.

### Links and references
- [A scheduled cron job example using AWS Lambda and Serverless Framework](https://serverless.com/examples/aws-node-scheduled-cron/).
- [Serverless Framework schedule event](https://serverless.com/framework/docs/providers/aws/events/schedule/).
- [Deployment best practices for Serverless applications](https://serverless.com/blog/serverless-deployment-best-practices/).
- [Secrets management for AWS powered Serverless applications](https://serverless.com/blog/aws-secrets-management/).
