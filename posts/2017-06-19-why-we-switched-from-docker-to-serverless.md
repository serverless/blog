---
title: Why we switched from docker to serverless
description: Why we decided to migrate our services running on docker containers to serverless stack using aws lambda functions and aws api gateway
date: 2017-06-19
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/docker-vs-serverless.jpg'
category:
  - guides-and-tutorials
  - user-stories
authors:
  - AsankaNissanka
---

Here at [ShoutOUT](https://getshoutout.com), we've been happily operating on Amazon Web Services for years. But there is always room for improvement. Luckily, we have the kind of team that doesn’t hesitate to embrace new technologies that will improve the platform—and that’s the very reason why we decided to try serverless architecture.

#### Background

Before I move into explaining our own serverless architecture, I'd like to share some info on the services and infrastructure we previously had, and why we decided to switch to serverless.

##### Originally using Docker + ECS

Previously, we ran a couple of services built with Node.js on top of the Express Framework. This served our ShoutOUT dashboard and integrations with several third party services. These services were deployed on Docker containers inside Amazon's Elastic Container Service (ECS).

The reason for using Docker, was the level of support and overall convenience it provided for running microservices. We could self-contain the services and handle scaling individually. Additionally, Docker helped ensure that features and fixes would seamlessly ship between our development and production teams. In short, AWS + ECS = a solid platform from which to run and manage docker containers. Within these processes, services ran smoothly with high availability and resiliency.

##### But then the number of services increased

However, when the number of services and complexity of each service increased, it became obvious that we needed a way to expand the computational capacity.

The interesting (or not so interesting) fact is that the traffic we get for these services is very unpredictable. For example, during the Holiday season, we get *much* more traffic than normal through the dashboard. If an integrated third party application starts sending more traffic for some reason, or if a customer runs a Facebook campaign integrated with their ShoutOUT account, we also experience traffic spikes. So there is no defined pattern for spikes and idle times.

But when it happens, the service should be available and capable of handling the increasing workload—especially for third party integrations in which data is being synchronized.

We could have scaled our ECS environment by adding more container instances and multiple service containers. And we did try that at first, but there was a hurdle. We were running a SaaS business, making cost a critical factor. This solution was not appealing.

The following diagram shows an overview of our previous deployment setup.

<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*qpPXgoLcZCpVUNDUF-E_XA.png">
</p>

#### Making the switch to a serverless architecture

Around this time, we started to hear more and more serverless success stories that illustrated exactly what we had been looking for as a SaaS solutions provider.

Being able to remove all the scaling concerns was a big relief, especially when combined with the added advantage of paying only for what we use. So, without any further ado, we started migrating our services to the serverless stack.

Luckily, we had built our services with Node.js (which was was fully supported by AWS Lambda), making it a small effort to combine them with Lambda functions. By this time, the Serverless Framework was in a very early stage and we had no clue that it even existed.

Prior to integration with the Serverless Framework, we had to do a lot of manual configuration on API Gateway and Lambda; deploying multiple services this way was really painful. Thankfully, shortly after this, we found this awesome Framework! The Serverless Framework saved us a lot of time, and streamlined the development to deploy process. We fully embraced it and it  solved a big pain for us.

The Serverless Framework has a great mechanism to provision and update resources required to run serverless apps. It's command line interface makes it super easy to deploy new versions to production, with the option to easily roll back if anything goes wrong. This eliminated all the manual configurations we had to do within our AWS account.

The added advantage is that we can deploy the same services to different regions or different AWS accounts via a single command in CLI.

#### The Results

Around 80% of the backend services we had were successfully migrated to a serverless stack, and we were able to reduce a considerable amount of cost this way. The following diagram shows an overview our current setup after successful integration with the Serverless Framework:

<p align="center">
  <img align="center" src="https://cdn-images-1.medium.com/max/1600/1*rp4PZBrhEX5_dCjIkmrEww.png">
</p>

Apart from cost reduction, we were also able to gain a lot of other advantages through this migration.

* No need to worry about scaling since Amazon takes care of it nicely
* High availability of our backend services
* Resiliency since each execution is contained and isolated, and thus has no impact on other executions
* Easily accessible logs from cloud watch ensures traceability

Since integration, we've taken a serverless first approach; all new services are built in a serverless fashion unless there is an obvious reason not to go serverless. This has helped us dramatically shorten our release cycles, which, as a startup and a SaaS provider, has been hugely beneficial.

##### One last note

Finally, I would like to point out one other thing.

Cloud technologies and platforms, especially serverless architectures, evolve and improve at a very fast pace. As solutions providers, we need to have our systems prepared to embrace and cope with these new technologies. We should always adapt our systems to them, or we will end up with legacy systems that don’t reap the benefits discussed above.

I suggest you go back and look at how far you are lagging behind new technologies to see whether you can improve what you are doing to ensure you can keep up in an ever-changing industry.

