---
title: "What Firecracker open-source means for the serverless community"
description: "AWS open-sourced Firecracker, the Lambda and Fargate core. Here’s what it means for the serverless community."
date: 2018-11-28
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-header1.gif'
category:
  - news
authors: 
  - JaredShort
---

At this year's re:Invent ([see here for live recap](https://serverless.com/blog/reinvent-2018-serverless-announcements/)), AWS announced that it was open sourcing Firecracker. If you’ve never heard of Firecracker, it’s the technology that powers innovative serverless compute from AWS, like Lambda and Fargate.

In a nutshell, Firecracker is a virtual machine manager—responsible for launching, managing, and killing tons of tiny virtual machines on a server. It’s ideally suited for serverless because it marries the capabilities of virtual machines (security, isolation) with the capabilities of small and agile functions (speed, resource efficiency).

It is insanely performant.

AWS did a live demo of Firecracker after announcing it, during which they spun up 4000 micro-VMs at once. The longest one took a mere 219 ms; on average the VMs take 125 ms to spin up.

And now, this powerful technology is open-source. What does this mean for serverless at large?

#### Firecracker open source: implications for Lambda or Fargate users

If you’re consuming serverless services like Lambda or Fargte right now, then honestly, you shouldn’t care that much about Firecracker. This is the magic of serverless—you get all of AWS’ improvements for free, without needing to migrate instances or run upgrade scripts.

Firecracker being open-sourced *does* mean that there are more opportunities to improve upon Lambda’s core—to make it more performant, etc—but overall, you probably won’t (and shouldn’t) personally use Firecracker.

#### Who Firecracker does matter for

Firecracker could be pretty useful to you if you’re building container orchestration platforms or running loads of containers, and need to do so with sub-second latency. For instance, Kubernetes can use Firecracker to start micro-VMs. Firecracker could also be extremely useful to you if you’re running on-premises at massive scale.

However, we’d be remiss not to mention that managing low-level infrastructure, especially all the way down to managing micro-VMs, is a bit against the serverless ethos.

#### In sum

Yes, Firecracker powers serverless compute like Lambda. But should you worry about it as a serverless developer? Probably not too much.

Things you can possibly expect from Firecracker going open source are future improvements to Lambda functionality and performance, via contributions from the open source community. 

But it is kind of cool to see AWS initiating an open source project like this.

A few years ago, AWS barely contributed to open source at all. Then, they started contributing to popular projects like Kubernetes in ways that made it easier to run on AWS. Now, we’re seeing them originate and open source foundational projects.

##### More re:Invent news

* [How to publish and use Lambda Layers with the Serverless Framework](https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/)
* [Join the Serverless virtual hackathon at re:Invent!](https://serverless.com/blog/no-server-november-reinvent-hackathon/)(ends Sunday at 11:00 PM PT)
* [All the Serverless announcements at re:Invent 2018](https://serverless.com/blog/reinvent-2018-serverless-announcements/)
