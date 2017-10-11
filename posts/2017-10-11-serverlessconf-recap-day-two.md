---
title: ServerlessConf 2017 Recap - NYC
description: Breakdowns of our favorite ServerlessConf talks, plus some high-level takeaways for the serverless community.
date: 2017-10-10
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf_nyc.jpg'
authors:
  - AndreaPasswater
---

## Why the Fuss About Serverless?
by [Simon Wardley](https://twitter.com/swardley)

Simon regaled the crowd with a thoughtful appraisal of how we think about systems—and what this all means for serverless. It was densely packed and every slide was good, so information was kind of flying at our heads. But here are some of his key points: 

**Maps don’t equal Diagrams**<br>
Maps help us better conceptualize problem spaces; we should all be making them. But what most developers call 'maps' (systems maps, anyone?), aren't actually maps.

Maps are more than just a visual; they also need to take into account anchor, position and movement. Imagine if you were to take Australia and plop it down beside Peru. Instantly different globe.

So back to our systems 'map'. It doesn’t have any of those characteristics. Move CRM over to the right? Nothing about the relationship between components change (as there’s no anchor).

<img width="500" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/crm-diagram.jpg">

We've been doing it wrong. These diagrams aren't painting a picture of the market landscape.

Simon's prefers to start with a User as his anchor, and flow down from that user on to what they want and need, then what those needs would require, and so on, until he ends up at the technology that supports those needs.

<img width="500" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/usermap2.jpg">

**We're still following the same patterns**<br>
With every new technology we say: "It'll reduce the budget! It'll eliminate such-and-such role!"

But look. Serverless won’t reduce your IT budget; you’ll just make more stuff. Just like Cloud didn't reduce your IT budget. You made more stuff.

As technology grows towards the commodity end of the spectrum, more market players build it into their status quo. This is a cyclical process. Each new process begets another, which in turn is supplanted by yet another. Commoditized approaches gather inertia, leaving new technology adoption spotty and often from the bottom-up.

<img width="500" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/tribe.png">

But, when the technology merits, it’s just a case of “when, not if”. The same is certainly true for Serverless.

**Adoption is what it is**<br>
Hold tight. Serverless is a great wave, and it's coming. But adoption of new technology usually takes 10-15 years.

So here's the adoption curve we can we expect going in to 2025:
- Increase in efficiency
- Rapid acceleration in speed of development
- Explosion of higher order systems of value
- No reduction in IT spend
- No choice over adoption (if not when)
- Non linear, > 50% of all new IT spend

## Different Serverless Patterns & Arch. At Expedia
by [Kuldeep Chowhan](https://twitter.com/this_is_kuldeep)

The following architectural patterns are used in Expedia:

* CI/CD Pipeline, managing their code builds
* Kinesis Firehose Data Transformation - processing about 130 million events
* Control System for AWS Infrastructure (used internally)
  * 2500 people in org.
  * Uses 1 big account in AWS across stages
* Test & Learn Dashboard Aggregation
  * A/B testing 
* Using Lambda to scale up the Autoscaling group
  * Spins new EC2 instances which pulls data and refreshes it.

**Benefits**: Cost, Operations, Scale, Opportunity, Time to Market
**Security**: IAM Roles, integration with Active Directory
