---
title: "How Whatif shortened time-to-market and lowered production costs with Serverless"
description: ""
date: 2018-12-12
thumbnail: ''
heroImage: ''
category:
  - user-stories
authors: 
  - ThomCrowe
---

[Whatif](https://www.worktool.cloud/) is a risk analysis platform used worldwide. The only problem with it is: it’s a web-based application with a customer base that’s increasingly mobile.

They realized they needed to branch into iOS and Android, and decided to build a mobile app: CoverYa, a real-time checklist management tool for mobile. Their top priorities were building a highly-performant, scalable application.

To do this, they partnered with [99X Technology](https://www.99xtechnology.com/).

#### The Challenge

Approaching the 99X team, Whatif knew they needed to move as quickly as possible to seize market traction. They wanted to launch Coverya in only 3 months.

It was a very tight timeline, and the last thing either 99X or Whatif wanted to do was to rush a product out the door that would fail to provide a premier user experience. They needed a stable solution that would work seamlessly in production.
Whatif’s original thought was to accelerate the development process by re-utilizing their old API (based on Ruby). However, their legacy API had performance issues, and they were not excited about reusing it.

They decided to consider a serverless approach instead.

#### Why Serverless?

A serverless application would not only provide Whatif a way to meet their rigorous 3-month deadline, but it would give them a way to:

- Leave their underperformant legacy API behind
- Save money on infrastructure costs
- Create an application that would be easier to update and iterate on going forward

Whatif appreciated that a serverless application would be much easier to maintain post-deployment, and would simplify their day-to-day devops tasks.

The migration from their legacy APIs to a serverless application was designed to be executed in small iterations to ensure that the overall Coverya platform continued to run while the web app communicated with both APIs.

Development stayed on schedule. 99X utilized the Serverless Frameworks’ [Offline Plugin](https://github.com/dherault/serverless-offline) and [Meta Sync Plugin](https://github.com/serverless/serverless-meta-sync) to develop, test and deploy offline. This increased developer productivity throughout the project and helped make it possible to complete the product on time. 

The team further used [Serverless Dynamodb Local](https://github.com/99xt/serverless-dynamodb-local), [Serverless Dependency Install](https://github.com/99xt/serverless-dependency-install) plugins and the boilerplate code for running the Serverless Development locally. These were released as Open Source assets, which you can find [here](https://github.com/99xt).

#### The Results

The rapid delivery from concept to market was overwhelmingly quick. The team was able to launch CoverYa within the 3-month timeline, and post-launch, developer productivity skyrocketed.

99X summarized the benefits of Serverless as follows:
- Straightforward DevOps setup DevOps with Serverless Framework API and CLI
- Independent and parallel development and deployment
- High testability due to the independence of the services and well-defined contracts via AWS API Gateway
- Independent and fully-managed scalability and security on serverless compute services

It was not just the speed and developer productivity which brought in the “wow” factor for Whatif at this point; using the Serverless Framework lowered CoverYa’s production environment costs by a staggering 75% of the initially-anticipated cost. This was no small deal. 

> Using Serverless enabled us to build a highly reliable and secure environment for Coverya, with significantly lower total cost of ownership.
*-Kjetil Odin Johnsen, CEO and Founder of Whatif AS and Coverya AS*

> Using the Serverless Framework allowed us not only to fulfill customer expectations much faster for Coverya, but also allowed us to provide more cost effective, scalable infrastructure where we could focus on our core competency of product engineering.
*-Hasith Yaggahavita, CTO at 99X Technology*

With Serverless, the team at 99X exceeded the expected performance standard of the client while still providing the lowest possible total cost of ownership. After seeing the results, Serverless architectures went on become an important reference architecture for 99X technology in many upcoming projects. 
