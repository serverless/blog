---
title: "Serverless (Cron)icle #3 - News from the Serverless Community"
description: A roundup of links and videos from the serverless ecosystem that caught our attention this week.
date: 2017-06-23
thumbnail: https://cloud.githubusercontent.com/assets/20538501/25759320/8bb86c20-3197-11e7-8d3d-5479c197c049.png
layout: Post
authors:
  - RupakGanguly
---

*The open source [Serverless Framework](https://github.com/serverless/serverless) is backed by a super smart and extensive community of developers (we've passed 17,000 stars on GitHub). Besides contributing code, our community is passionate about sharing their knowledge and expertise. Here's a roundup of some of these articles, videos, and posts to help you keep up with the news in the serverless ecosystem.*

### [The evolution of scalable microservices](https://www.oreilly.com/ideas/the-evolution-of-scalable-microservices)
A look at microservices, not as a tool to scale the organization, development and release process (even though it's one of the main reasons for adopting microservices), but from an architecture and design perspective, and put it in its true context: distributed systems. In particular, we will discuss how to leverage Events-first Domain Driven Design and Reactive principles to build scalable microservices, working our way through the evolution of a scalable microservices-based system. - *By [Jonas Bonér](https://www.oreilly.com/people/e0b57-jonas-boner)*

### [Kicking The Tires On This Serverless Thing](http://rob.conery.io/2017/06/05/serverless-is-a-thing/)
I ended up with a mess that cost more money than I wanted it to. It wasn't easy to figure out ...
I had better luck with Firebase. I had a fun time and built something interesting. At least I think it is. I had to approach the development process in a completely different way than what I was used to... but I like that kind of thing. I know others don't. The big thing to me, however, is that I was able to build something that I would truly use. In fact I'm using parts of it now in production (more on that in a future post). - *By [Rob Conery](http://rob.conery.io/about/)*

### [Serving 39 Million Requests for $370/Month, or: How We Reduced Our Hosting Costs by Two Orders of Magnitude](https://trackchanges.postlight.com/serving-39-million-requests-for-370-month-or-how-we-reduced-our-hosting-costs-by-two-orders-of-edc30a9a88cd)
When I joined Postlight as an engineer last year, my first task was a big one: Rewrite the Readability Parser API ...
... Finally, we focused on cost, and the answer here was simple. To drastically reduce our costs, we chose a serverless architecture running on AWS Lambda and API Gateway, built and deployed using the Serverless framework. - *By [Adam Pash](https://trackchanges.postlight.com/@adampash)*

### [Service Discovery as a Service is the missing serverless lynchpin](https://read.acloud.guru/service-discovery-as-a-service-the-missing-serverless-lynchpin-541d001466f4)
Changing a functions dependent resources after deployment is a critical step towards feature parity with traditional architectures.
When we talk about serverless architectures, we often talk about the natural fit between serverless and microservices. We’re already partitioning code into individually-deployed functions — and the current focus on RPC-based microservices will eventually change into event-driven microservices as serverless-native architectures become more mature. - *By [Ben Kehoe](https://read.acloud.guru/@ben11kehoe)*

### [Writing IAM Policies CAREfully](https://serverlesscode.com/post/iam-policies-like-you-care/)
This isn’t a tutorial, just a conceptual framework that’s helped me write better IAM policies. It’s extra useful when an app needs a group of services like DynamoDB, S3, and Kinesis. The method is called “CARE,” and it’s an acronym based on the four parts of an IAM policy statement. - *By [Ryan Scott Brown](https://twitter.com/ryan_sb)*
