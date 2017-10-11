---
title: ServerlessConf 2017 Recap - NYC
description: Breakdowns of our favorite ServerlessConf talks, plus some high-level takeaways for the serverless community.
date: 2017-10-10
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf_nyc.jpg'
authors:
  - AndreaPasswater
---

# High level takeaways
If the last ServerlessConf was the conference of serverless projects, this one was the conference of serverless tooling.

Every presentation has been plugging what they use right now for debugging, monitoring and development ([AWS X-ray](https://aws.amazon.com/xray/), [IOpipe](https://www.iopipe.com/), [Auth0 extend](https://auth0.com/extend/)...)—while in the same breath highlighting areas where we still need more tools and more features in them.

In our opinion, it's a hugely positive shift. We've reached the point where everyone knows they can make cool stuff with serverless, and now they want an ecosystem to support serverless development. Nobody can build fast enough, but they're furiously building anyway.

There was also a strong theme of rejecting 'NoOps' in favor of #DiffOps (kudos to Ben Kehoe for that sweet hashtag). Point being, the specific role titles might change, but nobody gets to eliminate ops. If anything, you need developers who are capable of learning how to do smart ops for distributed systems.

We can already tell: ServerlessConf next year will already be a drastically different landscape.

Here are some notes from our favorite Day 1 talks. We'll update this tomorrow with more info from Day 2, so be sure to check back in.

# The gritty details

We're giving you the full notes from some of our favorite talks! If you were there, we hope they're a nice refresher. If you were home, we hope it's like you were there.

**Click to jump straight to your fave talk, or scroll down to read them all:**<br>
- [The State of Serverless Security](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#the-state-of-serverless-security)
- [10 tips for running a serverless business... number #6 will blow your mind!](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#10-tips-for-running-a-serverless-business-number-6-will-blow-your-mind)
- [Shipping Containers As Functions](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#shipping-containers-as-functions)
- [Harmonizing Serverless and Traditional Applications](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#harmonizing-serverless-and-traditional-applications)
- [Break-up with Your Server, but Don’t Commit to a Cloud Platform](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#break-up-with-your-server-but-dont-commit-to-a-cloud-platform)
- [Serverless Design Patterns](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#serverless-design-patterns)
- [Event-driven Architectures: are we ready for the paradigm shift?](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#event-driven-architectures-are-we-ready-for-the-paradigm-shift)

## The State of Serverless Security
by [Mark Nunnikhoven](https://twitter.com/marknca)<br>

How does security in the serverless world *really* shape up?

<img width="600" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/strong.jpg">

Let's first go back to basics—the 6 part Shared Responsibility Model:
- data
- application
- OS
- virtualization
- infrastructure
- physical

When cloud entered the scene, this list got cut in half:
- data
- application
- OS

And then containers whittled it away a bit more:
- data
- application

Until  under a serverless paradigm, we are left only with:
- data

So what, then, should be our new model? Mark proposes three components to serverless security:

**1. Functions**<br>
Code quality is a problem. Okay...it's *the* problem. If you look at the OWASP top 10 most common vulnerabilities, they've barely changed since 2010.

Dependencies are another factor. Their weakness is your weakness; dozens of dependencies mean dozens of possible threat points. And don't think that low-level threats are nothing to worry about—people can get root access by exploiting the right combination of grade 3 threats.

Still, we're doing pretty good overall here. Mark gives Serverless Fucntions security a **B+**.

**2. Services**<br>
How does the provider secure their service? Make sure to check their certifications. If they don't have certs (reasonably common in newer companies and smaller start-ups), then grill them. Make sure they are fully transparent with you.

Also keep in mind what kind of security controls do they have. Can you encrypt at rest, use your own keys?

Vendors have a lot to lose if there's a breach, and they tend to be pretty good about this stuff. Services get a solid **A**.

**3. Data flows**<br>
Spoiler alert: this is where we're losing.

We don't yet have enough tooling for assurance of protections, data flow visibility or code quality. Though these things seem to be in the works from several people in the space, so we'll see what the state of affairs is by next ServerlessConf.

For now though, we're at a **C-**.

**Then what's the state of serverless security overall?**<br>
Mark gives it a **B**. (Better, he notes, than containers)

## 10 tips for running a serverless business... number #6 will blow your mind!
by [Sam Kroonenburg](https://twitter.com/samkroon)

Sam started coding a learning platform 4 years ago. You might know it now as this little company called [A Cloud Guru](https://acloud.guru). He knew he'd need to include video lessons, a quiz engine, an online store and sign up / log in, while having something that scaled effortlessly and had low operational overhead.

Tl;dr: he cared about the fastest, cheapest way to build a company and get his MVP out there. So he went serverless (check out his non-existent EC2 for proof):

<img width="600" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/ec2.jpg">

His learning platform started as a serverless monolith, and Sam advocates that choice. It's a great way to launch fast, and as long as you're starting serverless, the transition to microservices later is pretty straightforward.

For all those serverless entrepreneurs out there, Sam has some guiding principles and advice:

- It's a myth that serverless means you don't need ops. Of course you need ops, but responsibility *does* shift to the dev team
- When you need to fill engineering positions, don’t look for serverless developers. They don’t exist yet. Instead, filter for a developer who cares about smooth running code in production.
- Encourage & reassure job candidates that it's okay if they don't know your stack; you're ready to teach, and it will be exciting for them. Otherwise, they'll be too intimidated to apply at all.
- Join the community. That's how Sam learned about Algolia back in the day, and began contributing to the Serverless Framework.
- Expect to pioneer. Serverless teams build more tools, all the time.
- It’s ok to build a serverless monolith. And when you decide to migrate to a microservices architecture, you can do it without thinking about infrastructure.
- Automation is not optional. You can’t deploy all these pieces manually once you have several.
- Test all the things. You can never fully emulate operating environments for development purposes.

## Shipping Containers As Functions

by [Amiram Shachar](https://twitter.com/amiramshachar)

Remember how, with every technological invention, the word on the street was that the 'old' would completely go away? Computers would kill paper, Microsoft would kill IBM, etc. In reality, this process takes way, way longer than we think.

So what does the future of serverless look like? Here's what Amiram thinks:

<img width="600" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/futuresls.jpg">

As you can see, containers and VMs are still in that chart. He also makes a case for shipping containers as serverless functions. You could, say, use a Docker image as a function. You wouldn't have to zip anything or add dependencies; just put it in a Docker file, package and ship.

## Harmonizing Serverless and Traditional Applications

by [Ryan Scott Brown](https://twitter.com/ryan_sb)

It's still pretty common that when we talk about serverless, we start off talking about a greenfield project. But that's not most people's reality. How do you plug serverless functions into an existing application, bit by bit?

The hardest part is changing the model of your app to integrate these new event streams, and breaking up coupling of all the jobs that are currently running. Ryan recommends a slow integration flow, from 'incidental glue' to backend tasks (which will be less likely to make users mad if something goes wrong) before finally moving on to end user features.

<img width="600" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/3phase.png">

Protip: beware of scaling, and not in the way you think. Lambda will scale just fine. *Too* fine. Fine enough to completely ruin every downstream service. Get good at prioritizing end-user events to customer impact is minimal. Use Kinesis to denormalize data into messages. Keep a monorepo. Watch everything: Cloudwatch, IOpipes, Honeycomb, ELK Stack...

Read his full notes over at [serverlesscode](https://serverlesscode.com/slides/serverlessconf-harmonizing-serverless-traditional-apps.pdf).

## Break-up with Your Server, but Don’t Commit to a Cloud Platform

by [Linda Nichols](https://twitter.com/lynnaloo)

How can you go serverless without vendor lock-in?

Linda proposes two possibilities:
1. containers
2. multi-provider frameworks

Both totally work, and it all depends on your preference. Linda personally prefers multi-provider frameworks and spent most of her talk focused on the Serverless Framework specifically.

Her argument was pretty straightforward: look, even if you know AWS really well, that knowledge doesn't transfer. GUIs highly vary and can be hard to navigate. If you don't use a multi-provider framework, you're essentially locking yourself in; there's too much friction to use that cool new Azure feature when you don't know Azure well.

The ideal multi-provider framework should abstract just enough to be useful, without completely abstracting away the native deployment frameworks for each cloud vendor. Otherwise, it's too much to keep up with and the ball will eventually drop.

As fabulous as her talk was, the twitter conversations around it have been even more fun to follow. [Check them out](https://twitter.com/Joab_Jackson/status/917808443297288192).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">No one wants to deal w/ <a href="https://twitter.com/hashtag/containers?src=hash&amp;ref_src=twsrc%5Etfw">#containers</a>— the <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> path forward is multi-provider frameworks (ie <a href="https://twitter.com/goserverless?ref_src=twsrc%5Etfw">@goserverless</a>)-<a href="https://twitter.com/lynnaloo?ref_src=twsrc%5Etfw">@lynnaloo</a> <a href="https://twitter.com/hashtag/serverlessconf?src=hash&amp;ref_src=twsrc%5Etfw">#serverlessconf</a> <a href="https://t.co/gQG9kUtUkK">pic.twitter.com/gQG9kUtUkK</a></p>&mdash; Joab Jackson (@Joab_Jackson) <a href="https://twitter.com/Joab_Jackson/status/917808443297288192?ref_src=twsrc%5Etfw">October 10, 2017</a></blockquote>

## Serverless Design Patterns

by Tim Wagner, Yochay Kiriaty & Peter Sbarski

Tim spoke about the need for design patterns for serverless and did a walkthrough of how to implement a map-reduce pattern with serverless. Then, he announced some exciting news—they're releasing a book!

It's called Serverless Design Patterns, and it's slated for release in 2018. *Yes* to more learning resources, best practices and standards.

The book will be vendor agnostic, and they welcome feedback on their curret list of patterns: [serverlessdesignpatterns.com](http://serverlessdesignpatterns.com)

## Event-driven Architectures: are we ready for the paradigm shift?

by [Ben Kehoe](https://twitter.com/ben11kehoe)

This talk was so good, we really just want you to hang tight for the video and watch it all. Ben had a sobering but uplifting message:

There are some really savvy companies, like Nordstrom, who are doing intricate event-driven design. But it's hard, and it's complicated. Serverless isn't quite there yet. Event-driven isn't quite there yet. So event-driven Serverless? Yeah...not there yet.

<img width="600" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/venn.jpg">

Serverless has many problems common to technologies that are still in their infancy. There isn't yet a good solution for service discovery or incremental deployments. Ben notes that he'd love to use VPCs for everything, but many services still don’t have VPC endpoints. The tooling and ecosystem support just isn't quite there.

But! Ben reminds us, "We're all here because we think it's worth it."

Improvements are happening incredibly fast. He's already anticipating that, with the current rate of change, his Venn diagram will be out of date by next ServerlessConf.

As a community, let's band together and make sure that happens.

# Stay tuned for day 2

ServerlessConf isn't nearly over—there's a whole other day of slides and [artful server destruction](https://twitter.com/goserverless/status/917837389560713218).

Check back with us tomorrow for the full day 2 download.
