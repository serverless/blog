---
title: "Serverless Aurora: What it means and why it's the future of data"
description: "Learn what Serverless Aurora is, what it means for serverless developers, and why we think it's the future of data. Solving the serverless data layer."
date: 2017-12-04
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/awsreinvent.jpg'
category:
  - operations-and-observability
  - guides-and-tutorials
  - news
authors:
  - AlexDeBrie
---

AWS had their annual re:Invent conference last week (missed it? [Check out our full recap](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/)).

AWS Lambda started the Serverless movement by releasing Lambda at re:Invent 2014. But the Lambda releases this year were run-of-the-mill incremental improvements—[higher memory limits](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/#3gb-memory), [concurrency controls](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/#concurrency-controls), and of course, [Golang support (coming soon!)](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/#golang-support).

All this to say, there was nothing game-changing in the functions-as-a-service (FaaS) world itself.

Well then. Does this mean that AWS is slowing down on serverless?

Hardly.

We saw AWS asserting that serverless is more than just functions:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">serverless != functions, FaaS == functions, serverless == on-demand scaling and pricing characteristics (not limited to functions)</p>&mdash; TJ Holowaychuk 🐥 (@tjholowaychuk) <a href="https://twitter.com/tjholowaychuk/status/902999008674594816?ref_src=twsrc%5Etfw">August 30, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

> For a deeper explanation of this, check out Ben Kehoe's excellent post on [The Serverless Spectrum](https://read.acloud.guru/the-serverless-spectrum-147b02cb2292).

In five years when we look back at re:Invent 2017, we won't be talking about the different [managed](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/#aws-eks) [container](https://serverless.com/blog/ultimate-list-serverless-announcements-reinvent/#aws-fargate) offerings. We'll be talking about this:

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Announcing Aurora Serverless. All the capabilities of Aurora, but pay only by the second when your database is being used <a href="https://twitter.com/hashtag/reInvent?src=hash&amp;ref_src=twsrc%5Etfw">#reInvent</a> <a href="https://t.co/AP5R6jf7RB">pic.twitter.com/AP5R6jf7RB</a></p>&mdash; AWS re:Invent (@AWSreInvent) <a href="https://twitter.com/AWSreInvent/status/935913292903604224?ref_src=twsrc%5Etfw">November 29, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

That's right. **Serverless Aurora.**

Why is Serverless Aurora so important? We first need to understand two things: the technology-driven changes in software architectures in the cloud era, and the current state of the data layer in serverless architectures.

# The Architectural Evolution

Earlier this year, Adrian Cockcroft wrote a piece on the [Evolution of Business Logic from Monoliths through Microservices, to Functions](https://read.acloud.guru/evolution-of-business-logic-from-monoliths-through-microservices-to-functions-ff464b95a44d) that blew my mind. It showed how changes in technology are driving changes in development patterns and processes. Adrian has had a front row seat for these changes over the years from his work at eBay, Netflix, and now AWS.

A bunch of unrelated technologies combined to drive these changes. Faster networks and better serialization protocols enabled compute that was distributed rather than centralized. This enabled API-driven architecture patterns that used managed services from SaaS providers and broke monoliths into microservices.

Chef, Puppet, EC2 and Docker and eventually Lambda combined to enable and promote ephemeral compute environments that reduced time to value and increased utilization. These tools were combined with the necessary process improvements from the DevOps movement to increase velocity. We're seeing smaller teams deliver features faster with lower costs.

These changes have been huge, but the data layer has been lagging. Adrian touched on database improvements, but they aren't as mind-blowing. They have explicit tradeoffs of simple query patterns:

> Compared to relational databases, NoSQL databases provide simple but extremely cost effective, highly available and scalable databases with very low latency.

The lagging data layer is particularly problematic in Serverless architectures.

# The Problem of the Serverless Data Layer

I [spoke on this problem](https://serverless.com/blog/serverless-conf-2017-nyc-recap/#data-layer-in-the-serverless-world) at ServerlessConf NYC in October. In short, there are two approaches you can take with databases with serverless compute: _server-full_ or _serverless_.

### Server-full databases

A server-full approach uses instance-based solutions such as MySQL, Postgres, or MongoDB. I classify them as instance-based when you can tell me how many instances you have running and what their hostnames are.

I like Postgres + Mongo because of [their popularity](https://db-engines.com/en/ranking), which means data design patterns are well-known and language libraries are mature.

However, these instance-based solutions were designed for a pre-serverless world with long-running compute instances. This leads to the following problems:

_Connection Limits_

Postgres and MySQL have limits of the number of active connections (e.g. 100) you can have at any one time. This can cause problems if you get a spike in traffic which causes a large number of Lambda to fire.

_Networking issues_

Your database instances will often have strict firewall rules about which IP addresses can access them. This can be problematic with ephemeral compute -- adding custom network interfaces will add latency to your compute's initialization.

_Provisioning issues_

Serverless architectures fit well with defining Infrastructure as Code. This is harder with something like Postgres roles (users). These aren't easily scriptable in your CloudFormation or Terraform, which spreads your configuration out across multiple tools.

_Scaling issues_

This is one of the most important problems. Instance-based databases aren't designed to scale up and down quickly. If you have variable traffic during the week, you're likely paying for the database you need at peak rather than adjusting throughout the week.

### Serverless databases

In contrast to server-full, instance-based databases, there is a class of serverless databases. Serverless databases are different in that you're usually paying for _throughput_ rather than a particular number and size of instances.

There are a few options for serverless databases, including [Firebase](https://firebase.google.com/) and [FaunaDB](https://fauna.com/). However, the most common of these databases is [DynamoDB](https://aws.amazon.com/dynamodb/) from AWS.

DynamoDB addresses most of the problems listed above with server-full databases. There are no connection limits, just the general throughput limits from your provisioned capacity. Further, DynamoDB is _mostly_ easy to scale up and down with [some caveats](https://read.acloud.guru/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you-aefc52ea9476#5aa1). Also, the networking and provisioning issues are mitigated as well. All access is over HTTP and authentication / authorization is done with [IAM permissons](https://serverless.com/blog/abcs-of-iam-permissions/). This makes it much easier to use in a world with ephemeral compute.

However, DynamoDB isn't perfect as a database. You should really read Forrest Brazeal's excellent piece on [Why Amazon DynamoDB isn't for everyone](https://read.acloud.guru/why-amazon-dynamodb-isnt-for-everyone-and-how-to-decide-when-it-s-for-you-aefc52ea9476). In particular, the query patterns can be very difficult to get correct. DynamoDB is essentially a key-value store, when means you need to configure your data design very closely to your expected query patterns.

To me, the biggest problem is the loss of flexibility in moving from a relational database to DynamoDB. With a relational model, it's usually easy to query the data in a new way for a new use case. There isn't that same flexibility for DynamoDB.

Developer agility is one of the key benefits of serverless architectures. Having to migrate and rewrite data is a major blocker to this agility.

# The Future of Data

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Transition to the <a href="https://twitter.com/hashtag/cloud?src=hash&amp;ref_src=twsrc%5Etfw">#cloud</a>: treat servers like cattle, not pets. Transition to <a href="https://twitter.com/hashtag/serverless?src=hash&amp;ref_src=twsrc%5Etfw">#serverless</a> cloud architecture: treat servers like roaches</p>&mdash; Ben Kehoe (@ben11kehoe) <a href="https://twitter.com/ben11kehoe/status/713322946891227136?ref_src=twsrc%5Etfw">March 25, 2016</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Ben Kehoe loves to hammer the point that to be truly serverless, your compute should not exist when it's not handling data. This hyper-ephemeral compute requires a new type of database. Highly-scalable, automation-friendly, global, with a flexible data model to boot.

Distributed databases are hard. The NoSQL movement, including the [Dynamo paper](http://www.allthingsdistributed.com/files/amazon-dynamo-sosp2007.pdf) that describes the principles of DynamoDB and influenced its cousins (Apache Cassandra, Riak, etc.), was a first step in the database revolution.

The second step is in motion now.  AWS announced [multi-master Aurora](https://aws.amazon.com/about-aws/whats-new/2017/11/sign-up-for-the-preview-of-amazon-aurora-multi-master/), allowing for your Aurora instances to have masters that accept writes in different Availability Zones. Similarly, they announced [DynamoDB Global Tables](https://aws.amazon.com/dynamodb/global-tables/) which syncs data from DynamoDB tables _across different regions_ (!). Writes in São Paulo  will be replicated to your copies in Ohio, Dublin, and Tokyo, seamlessly. These manage the difficulty of multi-master global databases.

The next step is Serverless Aurora, due sometime in 2018. It checks all the boxes for a serverless database:

✔︎ Easy scaling.

✔︎ Pay-per-use.

✔︎ Accessible over HTTP.

✔︎ Authentication & authorization over tightly-scoped IAM roles rather than database roles.

✔︎ A flexible relational data model that most developers know.

This is a big deal.

We've seen the hints that Amazon recognizes the issues with existing relational solutions in the cloud-native paradigm. They've implemented [IAM authentication](http://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/UsingWithRDS.IAMDBAuth.html) for MySQL and Aurora MySQL databases already. Further, the [Aurora design paper](https://media.amazonwebservices.com/blog/2017/aurora-design-considerations-paper.pdf) notes how they have changed the relational database for a cloud-native world.

I believe this is only the first step in Amazon's plan to push the database further. With the rise of social networks and recommendation engines, graph databases have become more popular. Amazon's new [Neptune graph database](https://aws.amazon.com/neptune/) is an foray into another data area. Graph databases are [notoriously hard to shard](http://jimwebber.org/2011/02/on-sharding-graph-databases/), so it may be a while before we see a Serverless Neptune. I wouldn't bet against it coming eventually.

re:Invent is about the future, and that's why it's my favorite conference of the year. When we look back on re:Invent 2017, I have a feeling the data layer improvements will be the most important of all.
