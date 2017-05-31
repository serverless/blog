@: Untitled


---
title: Why we switched from dockers to serverless
description: Why we decided to migrate our services running on docker containers to serverless stack using aws lambda functions and aws api gateway
date: 2017-05-14
thumbnail: https://cdn-images-1.medium.com/max/1600/1*nCdI-0OU8GI6KZ2BwTvfDQ.png
layout: Post
authors:
  - AsankaNissanka
---
## Background

Here at [ShoutOUT](https://getshoutout.com) we've been happily operating on Amazon Web Services for years and are constantly amazed at the services that AWS introduces everyday. We had the luxury of starting our journey with AWS and we’ve continuously been able to make our customers happy. However, there is always room for improvement. And luckily, [ShoutOUT](https://getshoutout.com) has got a great team who doesn’t hesitate to embrace new technologies to improve the platform and that’s the very reason why we decided to try serverless architecture.

However, before I move into explaining our serverless architecture, I would like to share some info on the services and infrastructure we previously had, and why we decided to switch to a serverless architecture.

Previously we ran a couple of services built with Node.js on top of the Express Framework which served our ShoutOUT dashboard and integrations with several third party services. These were deployed on docker containers inside amazon elastic container service. They ran pretty smoothly and we had ensured availability by running multiple containers and serving through elastic load balancer. However, when the number of services and complexity of each service increased, the obvious need to expand the compute capacity arose. The interesting (or not so interesting) fact is that the traffic we get for these services is very unpredictable. For example, during the Holliday season, we get much more traffic than normal through the dashboard. If an integrated third party application starts sending more traffic for some reason, or if a customer runs a Facebook campaign integrated with their ShoutOUT account, we also experience traffic spikes. So there is no defined pattern for spikes and idle times. However, when it happens, the service should be available and capable of handling the increasing workload, especially for third party integrations in which data is being synchronized. Of course we could have scaled our ECS environment, adding more container instances and multiple service containers. However we’re running SaaS business and cost is a critical factor, making this solution unappealing. 
The diagram below shows an overview of the deployment setup we had previously.

<p align="center">
  <img src="https://cdn-images-1.medium.com/max/1600/1*qpPXgoLcZCpVUNDUF-E_XA.png">
</p>

## The Switch 
It around this time that we started to hear more and more serverless success stories. They illustrated exactly what we had been looking for as a SaaS solutions provider. Being able to get rid of all the scaling concerns was a big relief, with the added advantage of paying only for what we use. So, without any further due we started migrating our services to the serverless stack. Luckily we had built our services with nodejs and it was fully supported by lambda. So it was only a small effort to wrap them up with lambda functions. By this time, the Serverless Framework was in a very early stage and we had no clue that it even existed. Therefore, we had to do a lot of manual configuration on API Gateway and Lambda, and when it came to deploying multiple services, it was really painful. However, shortly after this, we found this awesome framework which was exactly what we were looking for. The Serverless Framework saved us a lot of time and streamlined the development to deploy process. We fully embraced it and it indeed solved a big pain for us :)

## The Results 
Around 80% of the backend services we had were successfully migrated to a serverless stack and we were able to reduce a considerable amount of cost this way. The diagram below shows an overview of the current setup we have.

<p align="center">
  <img align="center" src="https://cdn-images-1.medium.com/max/1600/1*rp4PZBrhEX5_dCjIkmrEww.png">
</p>

Apart from cost reduction, we were able to gain a lot of other advantages through this migration. 

* No need to worry on scaling since Amazon takes care of it pretty much nicely
* High availability of our backend services
* Resiliency since each execution is contained and isolated, and thus have no impact on other executions
* Easily accessible logs from cloud watch ensures traceability 

Since then we've taken a serverless first approach; all new services are built in a serverless fashion unless there is an obvious reason not to. This has helped us dramatically shorten our release cycles, which, as a startup and a SaaS provider, has been hugely beneficial.

Finally, I would like to point out one other thing. Cloud technologies and platforms, especially serverless architectures, evolve and improve at a very fast pace. As solutions providers, we need to have our systems prepared to embrace and cope with these new technologies. And we should always adapt our systems to them, or we will end up with legacy systems that don’t reap the benefits discussed above. I suggest you go back and look at how far you are lagging behind new technologies, and see whether you can improve what you are doing, in order to keep up with the fast advancing industry. 

