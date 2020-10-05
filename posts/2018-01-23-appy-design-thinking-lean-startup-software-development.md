---
title: "How to apply design thinking to lean startup software development"
description: "Our foray into mixing design thinking with agile development—what worked, and what didn't."
date: 2018-01-24
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/design-thinking/dt-circle.png'
category:
  - engineering-culture
authors:
  - BrianNeisler
---

When we say ‘Design Thinking’, we’re talking about the capital-D capital-T Design Thinking—the one evangelized by Tim Brown at IDEO and changing organizations across the globe.

More productivity (!) it promises, better connection to your users, higher rates of innovation!

Tl;dr seems legit, right? So we tried it.

Oh there were strides…and pain, and pitfalls. Plus some things you might want to repeat, and other things you won’t.
If you’re thinking of adopting Design Thinking, or just thinking about your product process in general, read on for a peek into ours.

# What does Design Thinking look like in a tech company?

In a nutshell, Design Thinking is a process not for how you execute, but for how you determine what you should be building in the first place.

It focuses on a tight, user-driven feedback loop that, in theory, allows you to validate new feature ideas as quickly as possible before writing a single line of production code:

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/design-thinking/designthinking101-sm.png)

For a tech company like us, it means this:
1. **Empathize:** the product team takes in user feedback
2. **Define:** they put the feedback into problem buckets
3. **Ideate:** the product team and the engineering team together generate a lot of ideas about how these problems might be solved
4. **Prototype:** product & engineering takes their best ideas and throws one or a number of prototypes together. We aren’t keeping this code; it’s purely for validation.
5. **Test:** they put that shit in front of users and ask them if it solves their problem
6. **Implement:** if yes, the engineering team builds that shit for real

The result is that new features are built in small pieces, which are then validated by users before any serious development work is done on them.

And the other key point here is this—everyone in the company is communicating. Sales doesn’t tell engineering what to build based on a few conversations. Product doesn’t tell sales what to sell because this is what they wanted to make.

Everyone talks to the user and works together to come up with a product strategy.

# Our process: how we rocked Design Thinking with agile engineering

The benefit of being agile is that it lets you break things up into smaller pieces so you can prioritize better. Design Thinking can be used to feed that agile implementation machine at both a micro and a macro level.

On the micro level, it serves to validate individual features. Right in line with the agile framework, it helps us make sure we’re always focusing on the highest priority projects when we do our sprint planning.

On the macro level, it ties everything back in to our company vision, and reminds us to constantly re-evaluate what we’re doing to serve our users better long-term.

Seemed like a natural enough fit to us.

## The nitty gritty: our full internal process

So here we go—the six Design Thinking steps, and how we’re carrying those out internally at Serverless.

**Empathize**
We have a Triage product board on Confluence (Atlassian) where anyone at the company can submit a user problem. These problems can come from direct user interviews, articles, forum topics, bug reports, personal experience…really anywhere you might discover true user problems.

**Ideate**
Anyone can also submit ideas for ways to solve established user problems. Our submission guidelines clearly state that all solutions should be told as a story from the perspective of the user. How will this help, what is the action performed, and what outcome is desired?

**Define**
The product team reviews the triage bucket every week, commenting on what needs further validation or more discovery work.
Based on this review, we assign one of three priorities to each item:
- Product backlog (high priority)
- icebox (low priority)
- rejection (flat-out ‘no’)

**Prototype:**
The product team goes through the backlog and divvies up the prototypes we want to focus on next. The engineering team takes them and puts them into their agile planning pipeline.

**Test**
If everything checks out, and it’s a great idea that’s solving a real user problem, we convert it to an initiative that is slotted into our medium term roadmap/

**Implement**
These initiatives lay out our best guess for what we’ll actually be building in production over the next 3-6 months. We also go ahead and define KPIs around each initiative so we can measure success continually over time.

# How it’s working for us so far

Well, it does have its positives: we are working to focus on smaller parts of the whole, versus taking on large projects that we try to execute all at once; we pretty constantly talk to our users, be it through forums, on Slack, or in interviews, which keeps us honest; and we do our best to use Design Thinking to keep a validated pipeline of features ready for implementation.

Old habits are still creeping back in and we haven’t implemented everything perfectly yet, though we’re pretty optimistic and have certainly made strides.

But there are also some drawbacks we’ve found, at least for our team:
1. We’re a pretty small company and, despite its focus on tight iteration loops, Design Thinking is pretty structured and (frankly) time-consuming. Perhaps even too structured for a small startup like ours. Design Thinking has its roots in the consulting world, and sometimes it shows.
2. It ends up taking us a while to wade through all of the submitted ideas. This means that instead of making people feel like they’re actively contributing, it can feel a bit like there’s just a lot of red tape. Plus, any good product team will end up rejecting 90% of all the ideas they receive, and it can be pretty hard for people to hear, 9/10 times, that their idea was rejected.
3. Our team is heavily remote and spans 18 time zones. It’s tough to keep a tight, structured feedback loop when not everyone can be in the same meetings due to time zone coordination.

Also, now and then you see an argument that [Design Thinking kills creativity](https://www.slideshare.net/designsojourn/design-thinking-is-killing-creativity) and you can’t help but doubt the whole endeavor. We’ll let you decide that one for yourself. 😉

## Alternatives?

So Design Thinking isn’t perfect. But honestly, it’s hard to imagine what we’d do instead.

We could have essentially no process, gather everyone in a room together once a month and let everyone shout ideas. We could do the polar opposite of this and have a single VP of engineering who tells all the developers what to do all the time, and make it so that very few people have input on the product process.

We could pull a Google-esque move and have everyone on the team allocate 10% of their time to doing user research and tinkering with new ideas (actually, this idea doesn’t sound half bad!).

It’s a classic problem—no system is without its flaws. But at least we have a system.

# In sum

We like Design Thinking and will probably keep using it, with some additional experiments and tweaks.

What about all of you? Have you found any edits to Design Thinking that make it work a little better for startups? We’d love to see how others are using it!
