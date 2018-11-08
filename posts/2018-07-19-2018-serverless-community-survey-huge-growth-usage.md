---
title: "2018 Serverless Community Survey: huge growth in serverless usage"
description: "We asked you, our dev community, how you’re using serverless. And even we were surprised by how much things have grown. Ready for the data?"
date: 2018-07-19
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/serverless-survey-header.jpg'
category:
  - news
  - engineering-culture
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/serverless-survey-header.jpg'
authors:
  - AndreaPasswater
---

We at Serverless Inc ran an open-to-all serverless community survey. Our goal was to tease out some cool insights that we could then share back with the community.

We’re pretty beside ourselves with how the space has grown since our first survey in 2017. Key takeaways: *wow* at that spike in mission critical serverless workloads, multi-cloud usage is on the rise, and the biggest cha—

Well, we won’t give it all away. ;) The full report is below; check it out!

**Quick disclaimer:**

This survey was created and (primarily) distributed by us at Serverless Inc. While we tried to cast the net as widely as we could, the majority of people who answered the survey were probably Serverless Framework users, and as such you can expect some bias in the results. Just want to make that clear!

We will also reference our [2017 survey results](https://serverless.com/blog/state-of-serverless-community/) in this report, and the same caveat applies there.

Now, on to the data.

## Serverless is moving from fringe to critical workloads

In 2017, 45% of respondents said they were using serverless at work in some capacity.

In 2018, 82% of respondents answered that they used it at work (nearly double!), and over half said that serverless was *critical* for the work they did at their jobs:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/level-serverless-usage.jpg">

We hear a lot that companies who had never used public cloud before got their start with serverless. And indeed, almost a quarter of respondents said that they had limited to zero public cloud experience before serverless:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/public-cloud-experience.jpg">

Even more significant—65% of the people who had limited/no cloud experience prior to serverless now say that serverless is either ‘critical’ or ‘important’ to the job that they do. That’s huge, and goes to show how serverless is rapidly changing the ways people develop software today:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/serverless-public-cloud.jpg">

## Multi-cloud is growing

We asked respondents which cloud providers they were using, and left it open-ended so they could list as many as they wanted. What we found was that multi-cloud scenarios are on the rise:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/number-serverless-providers.jpg">

About 26% of survey-takers were using 2 or more cloud providers; nearly double the number from last year.

## More people are facing challenges around operations

We asked people what the biggest roadblocks were for them when they considered using serverless architectures. Three of the top four answers had to do with operationalizing serverless—managing and enforcing best practices, lack of tooling, & lack of knowledge on their team:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/concerns-serverless3.jpg">

When we asked people a subtly different question about the biggest challenges they faced with serverless, the answers followed right in step with adoption roadblocks.

Notably, the top three pain points were debugging, monitoring, & testing; all things that clearly point back to a lack of tooling:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/challenges-serverless1.jpg">

## The serverless enterprise is growing

This year, just over 20% of respondents said they worked in a company with more than 1000 people. That’s a 34% increase in a *single year*, in a sector of companies not typically known to embrace rapid change:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/serverless-company-size.jpg">

What’s more, 67% of enterprise respondents said that serverless was either ‘critical’ or ‘important’ for the work they did at their jobs. These aren’t just light workloads or side projects.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/enterprise-serverless-critical-job.jpg">

## That daily serverless development life

Go has officially edged past Java in terms of usage:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/serverless-languages-go.jpg">

Though, fun fact: while Node.js is the most popular runtime overall, it has a bit less sway in the enterprise, and 15% of respondents (3x the overall number) in 1000+ employee companies are using Java:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/serverless-enterprise-java.jpg">

As for what people are using serverless to do:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/serverless-use-case.jpg">

## Things people have built with serverless tech

We got some great answers to this, and it’s hard to publish them all individually, so we made a nice little word cloud:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-community-survey/serverless-use-case-wordcloud.jpg">

Those instances of ‘company’ you see are people telling us they built their companies on serverless. The ‘fly’ is people saying ‘on the fly’, as in, they built an app that would let them (e.g.) process images on the fly. And a surprising number of people are generating or manipulating PDFs?

Here is just a sample of some great answers we got here, covering everything from critical workflows to fun side projects:

“A complete data pipeline from MongoDB to Redshift that also handles data transformations”

“High-availability alerting platform”

“ETL tool extracting and translating exif data from photos into a heat map”

“Member management system using facial-recognition” (*and then similarly*) “A serverless front-door controller to allow access into a building from a Slack slash command”

“Customer authentication and purchasing system, Dynamics CRM integration”

“Fermentation temperature monitoring with a Raspberry Pi”

“Content publishing pipeline. I'm also currently working on an IoT platform which automates car parks using machine learning.” (*Wow, we applaud your breadth!*)

“A developer portal for third-party components for our ETL platform”

“Media transcoding service integrated with automated transcription, translation, and captioning services”

“A todo app that lets me procrastinate better” (*Thanks for speaking the truth for all of us, anonymous survey-taker.*)

## Key takeaways from the data

- Serverless is growing, and fast. Several key adoption metrics are 2x what they were last year. And not just with smaller companies; the enterprise is adopting serverless technologies for critical workloads just as rapidly.
- Operationalizing serverless is the biggest obstacle to wider serverless adoption right now.
- Many more people are using multiple cloud providers than there were last year, which only increases the importance of projects such as [CloudEvents](https://cloudevents.io/) and other initiatives that enable vendor choice.
- For a lot of people, serverless is their first exposure to the public cloud. Meaning: serverless is already shifting the ways developers work and improving accessibility to the cloud.
