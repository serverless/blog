---
title: "Introducing our first cohort of 2018 Serverless Champions"
description: Serverless Champions are leaders in the Serverless Community. Meet our 2018 community heroes.
date: 2018-04-10
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/images/champions/champions_banner.jpg'
category:
  - news
  - engineering-culture
authors:
  - RupakGanguly
---

Perhaps you remember, late last year, when we [announced the beginnings of the Serverless Champions program](https://serverless.com/blog/announcing-first-cohort-serverless-champions-2017/).

Well—we are back with the first round of winners for 2018!

## What is a Serverless Champion?

A Serverless Champion is a hero in the serverless community. They contribute to open-source serverless projects. They speak at serverless conferences and meetups. They help newcomers get excited. They crawl the forums just looking for questions to answer.

**Aside:** If you, too, want to contribute to open-source, [check out our handy guide](https://serverless.com/blog/how-contribute-to-serverless-open-source/).

## Announcing: Our first round of Serverless Champions for 2018

We conducted interviews with all three winners, and we’re including some of our favorite excerpts here. To see the interviews in their entirety (which you should!), head on over to our [Champions page](https://serverless.com/community/champions/).

### Alex Casalboni

<img align="left" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/images/champions/2018/alex-casalboni.jpg" width="210px">

Alex is the author of the [aws-lambda-power-tuning](https://github.com/alexcasalboni/aws-lambda-power-tuning) plugin. He co-organizes ServerlessDays (formerly JeffConf), frequently speaks and conferences, gives webinars, and has created many examples for the serverless community, including [this multi-region application with DynamoDB global tables](https://serverless.com/blog/build-multiregion-multimaster-application-dynamodb-global-tables/).

**Q: Alex, you have been a contributor and an evangelist for the Serverless Framework for a long time. When did you start using the Serverless Framework?**

AC: “I started using the Serverless Framework as soon as we realized that a system with more than a handful of Functions would never scale without proper tooling.

It was May 2016 and I wrote my first review of the framework v0.5. The project was still early stage (only 60 contributors, now there are almost 400!) and the serverless ecosystem was so immature that nobody could clearly define "serverless", at least not without making a few enemies (well, that still happens, especially on Twitter!).

Then I met Austen Collins at the first ServerlessConf in New York a few days later and I finally realized the scope of what the team was going to build in the upcoming months.”

[Read the full interview](https://serverless.com/community/champions/alex-casalboni/), and find Alex on:

[Twitter](https://twitter.com/alex_casalboni) | [GitHub](https://github.com/alexcasalboni) | [site](https://blog.alexcasalboni.com/)

### Frank Schmid

<img align="left" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/images/champions/2018/frank-schmid.jpg" width="210px">

Frank is a core maintainer of the Serverless Framework, is incredibly proactive about stepping in on GitHub issues, and joining discussions on the forums and in Serverless Slack channels. In addition to using the Serverless Framework daily for his job at Stashimi, he is the author & maintainer of the [serverless-webpack](https://github.com/serverless-heaven/serverless-webpack) plugin.

**Q: What are your thoughts on what is keeping serverless architectures to be adopted widely by organizations?**

FS: “There are some major key points that make a long-term transition inevitable.

There is the delegation of fixed administration and running costs to the provider—you pay as you go. The costs scale with the actual load of the system. Additionally the provider costs tend to decrease over time (at least from what I see).

Then, serverless based systems scale better and can cover load spikes more easily. Architecture-wise, the microservices nature of serverless architectures are modeled more cleanly. They stay extensible, separated and are maintainable in a much better way.

Also, new services are coming out all the time, things like AWS Lex and AWS Comprehend. Services like this take something that would be very hard for developers to maintain themselves, and offer a much better experience.

Of course, adopting serverless architectures is not an ad-hoc thing. It requires a change in people's minds, which can be a very slow process; you might even have to wait for a new generation of software engineers to occupy senior-level positions. It is also most likely no binary decision where you just state "now we will be serverless"—same as with someone who tries to introduce agile methodologies ad-hoc and for everything, even making coffee. ;-) That would obviously not work, and only be food for objectors who are against changes at any cost.

I'm sure that we'll continue to see a large shift towards serverless systems over time. Even present-day objectors will most likely follow as the serverless architecture in the end (IMO) leads to a market advantage for the implementers.”

[Read the full interview](https://serverless.com/community/champions/frank-schmid/), and find Frank on [GitHub](https://github.com/HyperBrain).

### Rowan Udell

<img align="left" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/images/champions/2018/rowan-udell.jpg" width="210px">

Rowan has been involved with the Serverless Framework since it was called [JAWS](https://vimeo.com/141138561). In addition to speaking on AWS and Serverless all across Sydney, he maintains a blog where he teaches others worldwide about serverless. He’s even created his own [serverless chatbot course](http://blog.rowanudell.com/the-serverless-framework-build-a-chatbot/).

**Q: Talk about a service or an application that satisfactorily made you believe that serverless architectures is the way to go. What did you learn from that experience, and what do you think is the biggest challenge in developing serverless applications today?**

RU: “I never really needed convincing. For me [building a] chatbot application was one of the best examples of a good fit for a serverless and event-driven application, which is why I chose it as the subject of the video course I made. Other than that, I've found serverless really suited to automating operational tasks, since it reduces the overhead for intermittent, but important, maintenance jobs.

I think the biggest challenges for developers new to serverless are in the management of state: You can no longer assume that the machine that executed the code last time will do it again this time. What makes it more confusing is that it might be the same machine! Understanding the value and implementation nuances of idempotent activities (which are key to a robust, distributed system) is another thing which has a steep learning curve for developers new to serverless.”

[Read the full interview](https://serverless.com/community/champions/rowan-udell/), and find Rowan on:

[Twitter](https://twitter.com/elrowan) | [GitHub](https://github.com/rowanu) | [site](http://blog.rowanudell.com/)
