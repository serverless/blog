---
title: "SQQUID: a 100% serverless startup"
description: "Sqquid uses AWS Lambda and the Serverless Framework for their core product and marketing website. See what it’s like to be a fully serverless startup."
date: 2018-12-17
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sqquid/sqquid-serverless-thumb.jpg"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sqquid/sqquid-serverless-header.jpeg"
category:
  - user-stories
authors: 
  - RonPeled
---

My name is Ron Peled and I’m the CEO and founder of [SQQUID](https://sqquid.com/)—a platform that automates merchandising and fulfillment for retailers. We help small- and medium-sized retailers automate their web order processing and shipping from brick-and-mortar stores, lowering their costs to enable them to compete against the likes of Walmart and Amazon Prime. 

It’s a mission that we really stand behind, and it puts us on a path of disrupting a gigantic industry that has tons of old, legacy infrastructure supporting it. The only way to break new ground is to move fast and run lean.

When we launched, our CTO and I made a bet on Serverless. We were early movers on AWS Lambda and the Serverless Framework. From the beginning, SQQUID has been a near 100% serverless shop. This was one of the best decisions we’ve made, and because of it the tech stack at SQQUID is a fun and exciting environment to build upon. 

If you want to learn all about what it means to go fully serverless—what our architecture affords us, what new design patterns we’ve built, and how this environment allows our small team to iterate faster—then read on! 

#### Before Serverless: Docker

SQQUID isn’t my first company. I was previously CTO and cofounder of Educents, a YC-backed education startup.

At Educents, we relied on Docker. It was super scalable, but from a CTO and budgeting perspective, it was a nightmare. This was before AWS supported Kubernetes, so our infrastructure costs were sky high and we were in constant maintenance mode to keep everything running smoothly.

I knew when I built my next startup, on the top of my priority list would be finding a way to move off a fully-managed Docker environment.

#### The Serverless way forward

When I started SQQUID, FaaS systems were just starting to gain popularity. After reading up on serverless for a couple months, we decided to go all in on AWS Lambda, the larger AWS ecosystem, and the [Serverless Framework](https://serverless.com/framework/).

It was a risky, but ultimately fantastic, decision. Because we’re serverless, we’re fast and agile. We consistently launch robust features with a relatively small team. 

We have so much power at our fingertips, it’s unbelievable.

##### Serial Governor: feature architecture

At SQQUID, one of our main jobs is to manage a multitude of integrations across platforms and across customers.

As any business working with many external APIs understands, handling integration differences, like throttling or error management, can be very different from API to API (such as Magento, to BigCommerce, or Shopify.) On top of that, within each specific integration, there are individual account challenges from specific throttling limitations to custom field management. 

To manage all this, we've developed a design pattern we call our ‘serial governor’. The serial governor works to watch over a suite of concurrent Lambda executions for each integration (e.g., product and order imports), but run independently from customer to customer.

During function execution, the system needs to manage the amount of concurrency per account (not just per function), and deal with API limitations and errors on both the customer level and overall integration level. This is important since our system is connecting to multiple channels with multiple accounts 24/7. 

But error management is half the battle. The serial governor's error management system and dead man switch helps us manage issues arising from specific accounts and overall integrations.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/sqquid/sqquid-serial-governor.png" alt="SQQUID serial governor">

What happens when an integration has a system-wide hiccup or a particular customer's account has been declined? With Lambdas, it's easy to to just keep hitting the servers over and over again, though it's not very helpful to strong arm the situation. Maybe a particular server is having issues with load or networking issues. This is why our system includes logic to automatically back off a customer's integration.

The more errors we get, the longer we wait to try the API again. When a successful connection is established, we get back up to speed ASAP. 

##### What did we gain from this new architecture?

The combination of serverless environment, our serial governor design pattern, plus our error handling algorithms affords us tremendous flexibility and capabilities. We are now able to maximize throughput for each integration and for each customer account—something that would have been too resource-heavy for a startup to focus on in older devops paradigms. 

This architecture allows us more time to focus on new features and business logic because our systems are rarely down. Since we have some level of automatic healing, there’s very little we need to do when an API isn’t responding as it should or is down.

In many cases, our customers rely on us to understand which ones of their other systems were unavailable and for how long. 

#### What we learned along the way: the serverless learning curve

I won’t lie—the serverless (or FaaS infrastructure) learning curve can be steep, especially when you’re used to monolithic architectures. That said, the benefits of serverless far outweigh any drawbacks.

My team and I would only recommend FaaS architectures for any new projects.

If you’re thinking of going serverless, here are some things to know in advance.

##### Think FaaS, not Monolithic

Due to the nature of FaaS and Serverless architecture, you should think in terms of this new paradigm. Don't try to make old techniques or paradigms fit.

Once you understand what this means, development can move so much faster and you start seeing the benefits of using function-based architecture. 

##### Protect your downstream systems

Lambda is auto-scaling. Most APIs out there are not. We were reminded of this the hard way when we accidentally brought down another company’s API, one with substantial data center infrastructure, by hitting their APIs too hard.

Out of the box, Lambda errors will automatically launch a series of retries. A tsunami effect can start from there if you are not careful. On the bright side, our Lambda cost for this ‘incident’ was only $2.

Ultimately, as a former CTO myself, it’s a mind-altering change to know that from the first line of code, your product is scalable. The challenge then becomes interfacing with these outside systems all of which have different throttling and requirements.  

##### Observability isn’t great, but it’s getting better

We also ended up building our own custom tooling for error handling and alerts because what was out there didn’t fit our business needs. That said, we have seen improvements in Cloudwatch over the past year, and we expect this will get a lot better.

#### In sum: serverless, or not?

At SQQUID, we pride ourselves in providing top tier channel management, merchandising tools, and order fulfillment automation for retailers. Choosing serverless as our architecture enables us to best serve our customers.

We are launching large-scale, robust features at significantly shorter intervals than we were able to at my previous startup. And we are doing it using a tenth of the workforce with incredibly low infrastructure costs. As a startup, this is a critical advantage.

We are incredibly happy with our decision to go serverless. 

Best of luck on your serverless journey, and feel free to drop a comment if you have any questions!
