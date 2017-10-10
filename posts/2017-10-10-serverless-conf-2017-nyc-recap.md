---
title: ServerlessConf 2017 Recap - NYC
description: Breakdowns of our favorite ServerlessConf talks and high-level takeaways for the serverless community.
date: 2017-10-06
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf_nyc.jpg'
authors:
  - AndreaPasswater
---

If the last ServerlessConf was the conference of serverless projects, this one was the conference of serverless tooling.

In our opinion, it's a major shift. We're at the point now where everyone knows they can make cool stuff with serverless, and they want an ecosystem to support serverless development.

Here are some notes from our favorite Day 1 talks. We'll update this tomorrow with Day 2 talk summaries as well.

# The State of Serverless Security
by [Mark Nunnikhoven](https://twitter.com/marknca)<br>

How does security in the serverless world *really* shape up?

[IMAGE of strong]

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

**1. Functions**

Code quality is a problem. Okay...it's *the* problem. If you look at the OWASP top 10 most common vulnerabilities, they've barely changed since 2010.

Dependencies are another factor. Whatever issues they have become your issue; dozens of dependencies mean dozens of possible threat points. And don't think that low-level threats are nothing to worry about—people can get root access by exploiting the right combination of grade 3 threats.

Still, we're doing pretty good overall here. Mark gives Serverless Fucntions security a **B+**.

**2. Services**

How does the provider secure their service? Make sure to check their certifications, and if they don't have certs (reasonably common in newer companies or smaller start-ups), grill them. Make sure they are fully transparent with you.

Also, what kind of security controls do they have? Can you encrypt at rest, use your own keys?

Vendors have a lot to lose if there's a breach, and they tend to be pretty good about this stuff. Services get a solid **A**.

**3. Data flows**

Spoiler alert: this is where we're losing.

We don't yet have enough tooling for assurance of protections, data flow visibility or code quality. Though these things seem to be in the works from several people in the space, so we'll see what the state of affairs is by next ServerlessConf.

For now though, we're at a **C-**.

**Then what's the state of serverless security overall?**
Mark gives it a B. (Better, he notes, than containers)

# 10 tips for running a serverless business... number #6 will blow your mind!
by [Sam Kroonenburg](https://twitter.com/samkroon)

Sam got started coding a learning platform 4 years ago. He knew he'd need to include video lessons, a quiz engine, an online store and sign up / log in, while having something that scaled effortlessly and had low operational overhead.

He cared about the fastest, cheapest way to build a company and get his MVP out there. So he went serverless (check out his EC2 for proof):

[IMAGE EC2]

At first, it was a serverless monolith, and Sam still sticks behind that choice. He thinks it was great for getting everything off the ground, and as long as you're starting serverless, the transition to microservices later is pretty straightforward.

For all those serverless entrepreneurs out there, Sam has some guiding principles and advice:

- It's a myth that serverless means you don't need ops. Of course you need ops, but responsibility *does* shift to the dev team
- When you need to fill engineering positions, don’t look for serverless developers. They don’t exist yet. Instead, filter for a developer who cares about smooth running code in production.
- Encourage & reassure job candidates that it's okay if they don't know your stack; you're ready to teach, and it will be exciting for them. Otherwise, they'll be too intimidated to apply at all.
- Join the community. That's how Sam learned about Algolia back in the day, and began contributing to the Serverless Framework.
- Expect to pioneer. Serverless teams build more tools, all the time.
- It’s ok to build a serverless monolith. And when you decide to migrate to a microservices architecture, you can do it without thinking about infrastructure.
- Automation is not optional. You can’t deploy all these pieces manually once you have several.
- Test all the things. You can never fully emulate operating environments for development purposes.

# Break-up with Your Server, but Don’t Commit to a Cloud Platform
by [Linda Nichols](https://twitter.com/lynnaloo)

How can you go serverless without vendor lock-in?

Linda proposes two possibilities:
1. containers
2. multi-provider frameworks

Both totally work, and it all depends on your preference. Linda personally prefers multi-provider frameworks and spent most of her talk focused on the Serverless Framework specifically.

Her argument was pretty straightforward: look, even if you know AWS really well, that knowledge doesn't transfer. GUIs highly vary and can be hard to navigate. If you don't use a multi-provider framework, you're essentially locking yourself in because there's too much friction to use that cool new Azure feature when you don't know Azure well.

The ideal multi-provider framework should abstract just enough to be useful, without completely abstracting away the native deployment frameworks for each cloud vendor. Otherwise, it's too much to keep up with and the ball will eventually drop.

As fabulous as her talk was, the twitter conversations around it have been even more fun to follow. Check them out.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">No one wants to deal w/ <a href="https://twitter.com/hashtag/containers?src=hash&amp;ref_src=twsrc%5Etfw">#containers</a>— the <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> path forward is multi-provider frameworks (ie <a href="https://twitter.com/goserverless?ref_src=twsrc%5Etfw">@goserverless</a>)-<a href="https://twitter.com/lynnaloo?ref_src=twsrc%5Etfw">@lynnaloo</a> <a href="https://twitter.com/hashtag/serverlessconf?src=hash&amp;ref_src=twsrc%5Etfw">#serverlessconf</a> <a href="https://t.co/gQG9kUtUkK">pic.twitter.com/gQG9kUtUkK</a></p>&mdash; Joab Jackson (@Joab_Jackson) <a href="https://twitter.com/Joab_Jackson/status/917808443297288192?ref_src=twsrc%5Etfw">October 10, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script>
