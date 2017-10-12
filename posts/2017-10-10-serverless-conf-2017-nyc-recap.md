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

In our opinion, it's a hugely positive shift. We've reached the point where everyone knows they can make cool stuff with serverless, and now they want an ecosystem to support serverless development. We can already tell: ServerlessConf next year will already be a drastically different landscape.

There was also a strong theme of rejecting 'NoOps' in favor of #DiffOps (kudos to Ben Kehoe for that sweet hashtag). Point being, the specific role titles might change, but nobody gets to eliminate ops. If anything, you need developers who are capable of learning how to do smart ops for distributed systems.

# The gritty details

We're giving you the full notes from some of our favorite talks! If you were there, we hope they're a nice refresher. If you were home, we hope it's like you were there.

**Click to jump straight to your fave talk, or scroll down to read them all:**<br>
**Day 1**<br>
- [The State of Serverless Security](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#the-state-of-serverless-security)
- [10 tips for running a serverless business... number #6 will blow your mind!](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#10-tips-for-running-a-serverless-business-number-6-will-blow-your-mind)
- [Shipping Containers As Functions](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#shipping-containers-as-functions)
- [Harmonizing Serverless and Traditional Applications](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#harmonizing-serverless-and-traditional-applications)
- [Break-up with Your Server, but Don’t Commit to a Cloud Platform](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#break-up-with-your-server-but-dont-commit-to-a-cloud-platform)
- [Serverless Design Patterns](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#serverless-design-patterns)
- [Event-driven Architectures: are we ready for the paradigm shift?](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#event-driven-architectures-are-we-ready-for-the-paradigm-shift)

**Day 2**<br>
- [Why the Fuss about Serverless?](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#why-the-fuss-about-serverless)
- [Serverless and Software Craftsmanship](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#serverless-and-software-craftsmanship)
- [Global Resiliency when going Serverless](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#global-resiliency-when-going-serverless)
- [The CNCF (Cloud Native Computing Foundation) point of view on Serverless](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#the-cncf-cloud-native-computing-foundation-point-of-view-on-serverless)
- [Data Layer in the Serverless World](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#data-layer-in-a-serverless-world)

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

Both totally work, and it all depends on your preference. Linda personally prefers multi-provider frameworks and spent most of her talk focused on the [Serverless Framework](https://serverless.com/framework/) specifically.

Her argument was pretty straightforward: look, even if you know AWS really well, that knowledge doesn't transfer. GUIs highly vary and can be hard to navigate. If you don't use a multi-provider framework, you're essentially locking yourself in; there's too much friction to use that cool new Azure feature when you don't know Azure well.

The ideal multi-provider framework should abstract just enough to be useful, without completely abstracting away the native deployment frameworks for each cloud vendor. Otherwise, it's too much to keep up with and the ball will eventually drop.

As fabulous as her talk was, the twitter conversations around it have been even more fun to follow. [Check them out](https://twitter.com/Joab_Jackson/status/917808443297288192).

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">No one wants to deal w/ <a href="https://twitter.com/hashtag/containers?src=hash&amp;ref_src=twsrc%5Etfw">#containers</a>— the <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> path forward is multi-provider frameworks (ie <a href="https://twitter.com/goserverless?ref_src=twsrc%5Etfw">@goserverless</a>)-<a href="https://twitter.com/lynnaloo?ref_src=twsrc%5Etfw">@lynnaloo</a> <a href="https://twitter.com/hashtag/serverlessconf?src=hash&amp;ref_src=twsrc%5Etfw">#serverlessconf</a> <a href="https://t.co/gQG9kUtUkK">pic.twitter.com/gQG9kUtUkK</a></p>&mdash; Joab Jackson (@Joab_Jackson) <a href="https://twitter.com/Joab_Jackson/status/917808443297288192?ref_src=twsrc%5Etfw">October 10, 2017</a></blockquote>

## Serverless Design Patterns

by Tim Wagner, Yochay Kiriaty & Peter Sbarski

Tim spoke about the need for design patterns for serverless and did a walkthrough of how to implement a map-reduce pattern with serverless. Then, he announced some exciting news—they're releasing a book!

It's called Serverless Design Patterns, and it's slated for release in 2018. *Yes* to more vendor-agnostic learning resources, best practices and standards.

## Event-driven Architectures: are we ready for the paradigm shift?

by [Ben Kehoe](https://twitter.com/ben11kehoe)

This talk was so good, we really just want you to hang tight for the video and watch it all. Ben had a sobering but uplifting message:

There are some really savvy companies, like Nordstrom, who are doing intricate event-driven design. But it's hard, and it's complicated. Serverless isn't quite there yet. Event-driven isn't quite there yet. So event-driven Serverless? Yeah...not there yet.

<img width="600" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/venn.jpg">

Serverless has many problems common to technologies that are still in their infancy. There isn't yet a good solution for service discovery or incremental deployments. Ben notes that he'd love to use VPCs for everything, but many services still don’t have VPC endpoints. The tooling and ecosystem support just isn't quite there.

But! Ben reminds us, "We're all here because we think it's worth it."

Improvements are happening incredibly fast. He's already anticipating that, with the current rate of change, his Venn diagram will be out of date by next ServerlessConf.

As a community, let's band together and make sure that happens.

## Why the Fuss About Serverless?
by [Simon Wardley](https://twitter.com/swardley)

Simon regaled the crowd with a thoughtful appraisal of how we think about systems—and what this all means for serverless. Here are some of his key points: 

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

## Serverless and Software Craftsmanship
by [Florian Motlik](https://twitter.com/flomotlik)

Serverless can get pretty conceptually complex once you have several functions in production. So why are we doing it?

Productivity, plain and simple. But what we need to remember about productivity is that it isn't only about code, it's about pushing things for the end user. Bad code doesn't help *anyone*, and firefighting isn't productive work.

When your infrastructure is an extension of your code code (as it is with Serverless), that means you have to treat your infrastructure as well as your code. This responsibility falls to developers.

<img width="600" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/infra-as-code.jpg">                                                                        
We need to cultivate a culture of focus on Insight, Resource Management and Operations. If you can't answer questions about your deployed resources in less than 3 seconds, it's a problem. If you don't have resource management automated, it might as well not exist because it's not repeatable.

The Cloud has made our infrastructure standardized, but needs aren't uniform; in that case, customize your tools. It's easier now than it's ever been.

## Global Resiliency when going Serverless
by [Jared Short](https://twitter.com/shortjared)

Jared came at us with some very practical advice. So you're serverless? Be resilient about it. You need failover, and here are some ways he's explored doing it. 

He breaks down resiliency into **active + passive** and **active + active**. 

**Active + passive resiliency**<br>
The easiest possible scenario, if your business case allows it, is read-only failover. Using AWS CloudFront, you can swap one APIG to another APIG; takes about 3 minutes to fully roll out and is completely invisible to clients.

<img width="600" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf+2017+recap/readonly.jpg">

**Active + active resiliency**<br>
Active + active is way more interesting, but also way more difficult, and a lot of the solutions (gasp) use servers.

As for data, how do you manage conflicting edits? There are two bad options: (1) last write wins, (2) write your own painful-to-maintain resolver before giving up and crying.

Or! (drumroll...) You could try Conflict-free Replicated Data Types (CRDTs).

These are pretty mathematically complex, but make it so that it's always possible to resolve changes. If you need advice, Jared is already pumped for [a twitter conversation](https://twitter.com/shortjared).

If you want to go multi-provider, then you will give up some ecosystem benefits of staying within a single provider. But if you are going to do it, then abstract events and context early on in the call. He recommends checking out the [Event Gateway](https://serverless.com/event-gateway/) for a peek at a tool that makes multi-provider much easier.

## The CNCF (Cloud Native Computing Foundation) point of view on Serverless
by [Daniel Krook](https://twitter.com/DanielKrook)

The CNCF established a serverless working group 4 months ago. Their very first initiatives are to finalize [a serverless whitepaper](https://docs.google.com/document/d/1UjW8bt5O8QBgQRILJVKZJej_IuNnxl20AJu9wA8wcdI/edit#heading=h.yiaul8is1ki) and advocate a common model for event data.

They're also collecting and publishing community resources—e.g. a matrix of existing serverless providers and tools—and are moving their next focus into examples, patterns and possibly collaborating on packaging specifications.

Even if you're not a CNCF member, you can still attend meetings. So get involved and stay updated! Their [GitHub repo](https://github.com/cncf/wg-serverless) is here.

## Data Layer in the Serverless World
by [Alex Debrie](https://twitter.com/alexbdebrie)

Our very own Alex DeBrie gave a great overview of the data layer of serverless architectures. He broke them down into two segments: server*ful* and server*less*.

**Serverfull databases**<br>
These are the more traditional databases including Postgres, MySQL, and MongoDB, where you have a defined number of instances running and scaling them up and down is more of a challenge.

Some of the benefits of serverfull databases:
- They have mature ecosystems
- Many cloud providers offer them as managed services
- there is less vendor lock in

Some of the downsides of serverfull databases include:
- More maintenance, issues with uptime and scaling difficulties up and down
- Networking concerns in the FAAS space, where cold starts can be an issue when running in VPCs
- Connection limits and the lack of pooling due to the nature of functions spinning up and down

**Serverless Databases**<br>
With serverless databases, you don't know how many instances are running; that is abstracted away from the developers. Some examples would include DynamoDB, Fauna, Google firebase or firestore.

They typically will auto scale for you and maintenance is less of a burden.

**Serverless Database Benefits:**
- auto scales up and down for you
- less maintenance, provider takes care of this for you
- faster time to market. Spin up instances very quickly

**Downsides:**
- Less developer familiarity 
- Can be harder to query if data models aren't setup correctly
- vendor lock-in and harder migrations to other non proprietary database engines

# In sum

It's not NoOps but #DiffOps. We need more tools. Serverless truly is here to stay, and we're all excited about the increases in productivity. It's no longer 'what can we build in a serverless way?' but '*why* can't we make this serverless yet, hurry up already'.
