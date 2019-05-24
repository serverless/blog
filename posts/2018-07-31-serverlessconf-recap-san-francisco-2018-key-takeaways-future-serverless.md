---
title: "ServerlessConf 2018 San Francisco: key takeaways for the future of serverless"
description: "Missed ServerlessConf in San Francisco this week? No worries, we got you. Here are the key takeaways you'll want to know about."
date: 2018-07-31
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf_nyc.jpg"
category:
  - news
heroImage: ''
authors:
  - AndreaPasswater
---

*Last updated: Aug 1 @ 5:00pm PT*

It's been amazing to see the lightning fast transformation happening in the serverless space. ServerlessConf 2016 was the conference of serverless projects. By the 2017 conference in NYC, the community had already been building a lot of projects. The new problem was tooling, and [tooling discussions dominated the stage last year](https://serverless.com/blog/serverless-conf-2017-nyc-recap/).

So what about ServerlessConf 2018 in SF? It's been the conference of two things: (1) big@$$ companies talking about their large-scale, production serverless architectures; and (2) (from a drastically different perspective) non-engineers talking about how serverless technologies empowered them to begin developing their own apps, without a coding background.

We'll be updating this live all day during day 2, so stay tuned!

## Serverless adoption and architecture in large-scale organizations

The talks in this category had three main types:

### 1. Serverless as the basis for rapid development

Developers looking to minimize time to value will automatically gravitate toward serverless.

Leslie Pajuelo from Walmart just ran a POC in which she rebuilt their high performance orchestration layer. It's a use case we hear about all the time—a developer goes, "we want to try this serverless thing," and they build it out with a 1 or 2 person team. It does so well that the organization then moves to expand usage.

### 2. Testing, debugging and monitoring of production serverless apps

This has been an undercurrent of serverless adoption discussions for a long time, and it's been dominating the table discussions here. Every presentation starts to touch on the ways teams at Verizon, CapitalOne and Nordstrom are handling all of their operations with a smattering of tool sets.

We'd be remiss if we didn't mention that this is something we've been passionate about here at Serverless, Inc, and as such we [just launched a new Serverless Platform Beta](https://serverless.com/blog/serverless-platform-beta-helps-teams-operationalize-development/) to help teams operationalize serverless across their entire organization.

### 3. Structured models and practices to design and analyze Serverless architecture

Rob Gruhl from Nordstrom talked about the best ways to scale serverless:

1. Partition for horizontal scalability
2. Embrace eventual consistency
3. Idempotency throughput
4. Stateless(ish) compute
5. Understand your bottlenecks

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-serverlessconf-sf/nordstrom-serverless-all-things.jpg">

And it's easy to see why this matters. Verizon is here at ServerlessConf talking about serverless in the enterprise. There was a case study from Box. Capital One and Netflix presented on their own serverless architecture. Fender Digital (yeah, the guitar company) is all-in on serverless right now. And? They're transitioning everything to Go.

And speaking of which—

#### Wow, Go was everywhere

Our [community survey](https://serverless.com/blog/2018-serverless-community-survey-huge-growth-usage/) showed that Go usage was increasing, and had already edged past Java. But even the ServerlessConf stage had several mentions of companies who were using Go, and cloud providers who were moving to adopt it.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">.<a href="https://twitter.com/AzureFunctions?ref_src=twsrc%5Etfw">@AzureFunctions</a> moving to support <a href="https://twitter.com/hashtag/Golang?src=hash&amp;ref_src=twsrc%5Etfw">#Golang</a>? <a href="https://twitter.com/hashtag/ServerlessConf?src=hash&amp;ref_src=twsrc%5Etfw">#ServerlessConf</a> <a href="https://t.co/KT8mnlldJZ">pic.twitter.com/KT8mnlldJZ</a></p>&mdash; Serverless (@goserverless) <a href="https://twitter.com/goserverless/status/1024419241766707200?ref_src=twsrc%5Etfw">July 31, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### People are really thinking about security

One thing we noticed in every "here's how we're using serverless" presentation this year, which was largely missing in previous years, was the security component. How are serverless organizations handling security, what are their best practices?

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2018-serverlessconf-sf/fender-digital-serverless-security.jpg">

Mark Nunnikhoven insisted—you're better off out of the gate with serverless security. You can't dig into a single function running on, say, Lambda, and poke into other parts of the system. And ultimately, security is about the _people_. It isn't about just securing the functions, you need to have a robust system that does what it's intended to do, and only what it's intended to do.

Chris Munns built on what others had been saying to offer insight into securing Lambdas specifically. Do not use `*` in your IAM policies. Dependency management is key; keep track of package dependencies and apply security updates. Don't use a VPC; putting your functions inside of a VPC provides little extra security benefit. Stop doing stupid stuff with secrets.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Really great pragmatic guidance and tips from <a href="https://twitter.com/chrismunns?ref_src=twsrc%5Etfw">@chrismunns</a> on writing secure <a href="https://twitter.com/hashtag/lambda?src=hash&amp;ref_src=twsrc%5Etfw">#lambda</a> functions for <a href="https://twitter.com/awscloud?ref_src=twsrc%5Etfw">@awscloud</a>. <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> <a href="https://twitter.com/hashtag/serverlessconf?src=hash&amp;ref_src=twsrc%5Etfw">#serverlessconf</a> <a href="https://t.co/TXdooEvYig">pic.twitter.com/TXdooEvYig</a></p>&mdash; Tony Pujals (@tonypujals) <a href="https://twitter.com/tonypujals/status/1024710919371218945?ref_src=twsrc%5Etfw">August 1, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

### #DiffOps

(Credit to [Ben Kehoe](https://twitter.com/ben11kehoe) for the 'DiffOps' term.)

When the serverless movement was gaining momentum, there was a lot of buzz about how it would remove the need for DevOps. Not so, says everybody at ServerlessConf 2018. With all of these companies giving presentations about how they're running serverless at scale, a big undercurrent has been, "this is how we do our serverless operations."

There are still ops. And we're all still defining and discovering what those ops are.

Sam Kroonenberg was adamant that Serverless amplifies the need for good development practices. For example, you have to automate. And you need robust unit testing.

Ben Kehoe from iRobot, for the record, had a fantastic in-depth talk on gaps in the serverless mesh, covering cross-service blue/green deployments. It's hard to distill in a single recap post, but everyone should watch the video when it goes live on [serverlessconf.io](https://sf.serverlessconf.io/home.html). We'll link to it here also.

### Best practices all around

Yochay Kiriaty of Microsoft Azure provided a great "don't do this" bucket list for anyone who's getting started with serverless:

- Functions logic should be stateless
- Functions should be idempotent
- One task per function ("do one thing")
- Functions should finish as quickly as possible
- Avoid recursions
- Concurrency limitations and rate limits

Erica Windisch of IOpipes talked about serverless observability cornerstones. The serverless culture is about not building when you can buy, building as little as possible in general, and doing it with minimal complexity. Meaning: in a serverless world, business performance and metrics are more important than infrastructure metrics. Know your KPIs.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Infrastructure performance? BORING. Great talk on observability by <a href="https://twitter.com/ewindisch?ref_src=twsrc%5Etfw">@ewindisch</a>. <a href="https://twitter.com/hashtag/ServerlessConf?src=hash&amp;ref_src=twsrc%5Etfw">#ServerlessConf</a> <a href="https://t.co/7nyr49NoH7">pic.twitter.com/7nyr49NoH7</a></p>&mdash; Linda Nichols (@lynnaloo) <a href="https://twitter.com/lynnaloo/status/1024763983029358592?ref_src=twsrc%5Etfw">August 1, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Jared Short and Forrest Brazeal had some advice of another type: how to successfully go home from ServerlessConf and successfully convince all your co-workers that it's a _great_ idea.

- Leaders want to hear that it significantly reduces compute costs, they will be far from alone when it comes to adoption, and you can get started with few development resources
- Architects want to hear that cloud lock-in is an acceptable risk (and a bit of a myth), they can trust but verify with load testing tools, serverless is "getting more and more boring" (read: safe) by the day
- SysAdmin want to hear that they still have knobs to turn, they can partner with developers, and they can still monitor code if not infra. There are opportunities for them to start taking on more and more serverless DevOps.
- Other developers want to hear that it's even faster to test in the cloud anyway, there are all kinds of cool new frameworks they can use, and they can start focusing more on writing code that matters

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Persona #4: the disrupted developer has a lot of questions &amp; might be intimidated <a href="https://t.co/4zGy3MZIin">pic.twitter.com/4zGy3MZIin</a></p>&mdash; Serverless (@goserverless) <a href="https://twitter.com/goserverless/status/1024776947874717696?ref_src=twsrc%5Etfw">August 1, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Bringing software development to the non-developer developers

What does that even mean? It appears there is a trend among people with non-engineering backgrounds using serverless. With a lot of the tricky administration cut out of the mix, a vast ecosystem of beginner-oriented tutorials, and pre-existing code repositories like NPM, it's never been easier for inexperienced newbies to get started with their own coding projects.

Our own Andrea Passwater does Growth at Serverless, Inc, and has started to deploy her own marketing-based automation tooling. In her own words: "Serverless significantly lowers the barrier to entry for anyone who wants to automate parts of their workflow. And if I could automate away the boring things in my life, then why wouldn’t I?!"

Her first serverless app was [Serverless Ipsum](https://medium.freecodecamp.org/i-just-deployed-a-serverless-app-and-i-cant-code-here-s-how-i-did-it-94983d7b43bd), but she has since moved on to other things, like a Slack bot that pings her coworkers about their blog post deadlines.

And she's not the only person preaching about the newfound accessibility of coding. Keith Horwood is speaking on Stdlib, an API platform that could make developing APIs more like using Zapier. There are more engineers having open discussions about how to make coding more accessible to everyone, and more people at ServerlessConf from non-engineering backgrounds who are here to learn.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">.<a href="https://twitter.com/goserverless?ref_src=twsrc%5Etfw">@goserverless</a> <a href="https://twitter.com/sogrady?ref_src=twsrc%5Etfw">@sogrady</a> <a href="https://twitter.com/monkchips?ref_src=twsrc%5Etfw">@monkchips</a> theme from <a href="https://twitter.com/Serverlessconf?ref_src=twsrc%5Etfw">@Serverlessconf</a> seems to be &quot;Knowledge workers and other non-developers are the newest Kingmakers&quot; 😉 <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a></p>&mdash; Val Bercovici 🇻 (@valb00) <a href="https://twitter.com/valb00/status/1024364019241472000?ref_src=twsrc%5Etfw">July 31, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## That's a wrap

See you all at ServerlessConf 2019!
