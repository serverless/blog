---
title: "Serverless by the numbers: 2018 report"
description: "Serverless usage stats: event sources, service structures, runtimes, and more."
date: 2018-03-09
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/graph-thumb.png"
category:
  - news
  - engineering-culture
authors:
  - AndreaPasswater
---

When it comes to how people use serverless, there are plenty of anecdotes out there.

“I consolidated all my APIs down into a single serverless GraphQL endpoint.” “I used serverless to power my machine learning instance.” “What is a server, again? No idea what that is. I know what Lambda is though, is it like Lambda?”

(Disclaimer: I made that last one up.)

But the point is, those are just anecdotes. What do the cold hard numbers have to say about it?

Eternal questions, my friend. Which this post will dare to answer. With *charts*.

## Event sources

To address the biggest question of the day: just what are developers putting inside all these services they’re deploying?

### APIs dominate

The answer: http.

So, a bit of useful background before we dig in. Services with only one event type make up 79% of all services. 16% of all services utilize exactly two event types, and 4% of all services contain three or more.

To make the data a bit easier to ingest, we’re going to break this out a few different ways. First, here’s a chart showing only the single event-source services (remember, this is 79% of the whole):

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-single-event-type1.jpg">

*All services with a single event type, broken out by event type*

The majority of services with *two* event types (16% of all services) have http as one of them—http + cron, http + sns, you get the idea. There’s a pretty big ‘other’ bucket, but that’s mostly because there were a lot of permutations to represent and we kept it to the most popular:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-2-types1.jpg">

*All services with exactly two event types, broken out by event type*

It gets a little ridiculous to break out all the permutations of services with 3+ event sources, but those make up a little over 4% of all deployed services.

### How many functions per service?

Let’s take a look at how many functions developers are cramming into each service. Note that this chart only includes services that have seen development activity on 3 distinct days, as an attempt to exclude "Hello, World" apps.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/functions-per-service1.jpg">

*Services, bucketed by number of functions*

## Top languages

Which runtimes are serverless developers gravitating to?

### Overall

Node.js is the clear front-runner, followed by Python.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-deployed-pie1.jpg">

*Percentage of services deployed, by language.*

### Fastest-growing

Let’s look at all language prevalence over time (excluding Node 6.10, which otherwise completely dominates):

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-by-language-line1.jpg">

*Languages used on AWS (minus Node 6.10), in percentage of services*

Python 3.6 is the most steadily-growing language overall in the past eight months, with an especially big breakout this year.

However, the relatively long time scale on the chart above reduces Go to a blip in the lower right corner. This is because Go has only been supported by Lambda since January (or about 2 months, at the time of writing).

### Golang adoption curve

[Golang support](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/#golang-support) was one of the most-talked about re:Invent 2017 announcements (that, and [Serverless Aurora](https://serverless.com/blog/serverless-aurora-future-of-data/)). But it didn’t become GA until January 2018.

So, how quickly has Go picked up speed?

Here’s a breakout of each language (versions combined), directly comparing August 2017 to February 2018:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/services-by-language-full1.jpg">

*Languages used on AWS, in percentage of services*

In a mere six weeks, Go is already at about half of Java usage. Also worth noting that Node.js prevalence fell three percentage points from August to February.

Just for fun, let’s see what the experimentation curve looks like. For that, we’re going to take a week over week look at the number of deployments for services written in Go since January 15th. (Note that this isn’t number of *services*, but number of deployments; in other words, how often are people playing around with Go.)

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/go-deployments1.jpg">

*Golang usage on AWS, in percentage of all deployments*

Yeah. It has tripled already. That’s some steady growth.

It’ll be *really* interesting to see what the services chart looks like next year.

## When do devs do their deployments?

At 7:00am! Ok not really.

Peak service deployment hours, it turns out, are between lunch time and get-off-work time:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/data-report-2018/deploy-times1.jpg">

## Tl;dr

- Python 3.6 is growing fast, but Go isn’t doing bad either
- APIs are dominating serverless use cases
- Developers hate mornings
