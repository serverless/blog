---
title: The State of Serverless Multi-cloud
description: To multi-cloud, or not to multi-cloud? A frank discussion on the pros, cons and considerations.
date: 2017-11-06
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/multicloud.jpg'
authors:
  - AndreaPasswater
---

# To multi-cloud, or not to multi-cloud

Vendor lock-in runs deep in serverless applications. “Cloud provider” used to mean “whoever hosts your servers”. In a serverless paradigm, it means “whoever runs your functions”.

And when the space doesn’t (yet) have standardization, developers must twirl those functions round and round in a whole vendor ecosystem of events and data storage. There’s no way to use Azure Functions and EC2 together.

“But,” you say, “[vendor-agnostic frameworks](https://serverless.com/framework/) let you easily deploy functions across providers, at least.” That they do! But then, there’s the small technicality of language choice. Write your application in Python and you’ll have a hard time moving that over to Google Cloud Functions.

Given all this, what do we make of the multi-cloud? Is it a pipe dream, or an attainable goal—and do we *actually* need it?

# Multi-cloud gives you wings

The biggest advantage to serverless multi-cloud we hear in the field is feature arbitrage. Imagine plucking all your favorite aspects of each cloud provider and placing them nicely together in your very own, custom-made bouquet.

It’s hard to commit to a single ecosystem, especially when serverless compute vendors are constantly adding new features that change the value equation. AWS Lambda is adding traffic shifting in Lambda aliases any day now; Microsoft Azure has their (still unique) Logic Apps, which lets you manage event-driven services much like you’re composing an IFTTT.

Pricing works out differently across vendors for different services. The same project could work better elsewhere in less than 6 months because of all this rapid feature launching. We fear lock-in because it removes our flexibility of choice.

And then, add failover into the mix.

With serverless compute, you don’t have to worry about redundancy quite as much—Lambda, for instance, automatically scales across multiple availability zones for you. But entire regions can (and do) go down.

While it’s a rare corner case, cloud outages can be devastating; we see larger companies caring more about this and moving to incorporate strategies for full cloud redundancy. 

# Multi-cloud gives you pause

As fun as dreamspace is, we do still have to wake up in the morning and ask ourselves: is a multi-cloud attainable and worth it?

Let’s say you want to actually try and instrument full cloud failover. The first thing you’ll have to do is write everything in the only language all four major cloud providers support. Aka: JavaScript.

Then, you’ll need to abandon your cloud databases for something like MySQL. You’ll need to constantly replicate that data from one cloud provider to another so that everything is up to date when failover occurs. You have to think, hard, about how each cloud handles logging? Secrets? Metrics?

The rule of the game is to make everything as generic as possible—which seems to go against the serverless ethos, in a way, and prevents you from utilizing those powerful features you were trying to get with multi-cloud in the first place.

It’s also worth mentioning that, for those who do choose to run an ecosystem across multiple providers, you’re paying for transfer. Not cheap.

Maybe the answer ends up being: yes, it would be cool to leverage any service I want, whenever I want, and still maintain that serverless flexibility, but things just aren’t there yet. We don’t have a Schroedinger’s cake.

# The multi-way forward

There are a series of things that could happen to make multi-cloud easier.

**Cross-cloud service compatibility**
Data management and storage, for instance, are ecosystem-dependent. Google has best machine learning right now; and while it’s *feasible* to use GC services on different cloud providers, it isn’t necessarily simple.

To make multi-cloud less work and less compromise, we need to be better ways to share data across cloud providers, and better ways react to any event source regardless of cloud provider.

**Add shims for polyglot language support**
That way, it wouldn’t matter whether or not you wrote your functions in Go. Doing this yourself could be cumbersome, but soon there will probably be tools that facilitate this for you.

**Smartly route your data**
This one’s on you, the spritely developer. Divide your application into two conceptual parts: ‘critical path’ and ‘specialized features that don’t need need to work 100% of the time’.

Anything in the critical path (things that serve your site, for instance) should be written in a cloud-agnostic way. That makes it easier to implement failover or port things over to another provider, should you need. Specialized services (e.g., image tagging) can be maintained separately for a time, or be made to process important data later in case of an outage.

# The...multi-verse?

Multi-cloud probably won’t ever be completely work-free, but we expect it’ll be easy enough—sooner more than later.

And then we’ll start to see the landscape shift. Cloud providers won’t be fighting for bigger chunks of your server space; they’ll be fighting for bigger chunks of your application, in the form of features and services.

This is frankly already happening. We stereotype giants like Microsoft and Amazon as being slow to innovate, yet they’ve been rushing to push feature after serverless feature for the past two years. They’re moving faster than most startups.

As an industry, we’re headed for a user-centric software reality. Businesses will increasingly differentiate themselves with highly customized software, and multi-cloud is how they’ll do it.
