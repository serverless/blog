---
title: "AO.com: the path to Serverless First"
description: "The SCV team at AO.com started with one serverless service. They were so impressed with the turnaround time and low maintenance overhead that the entire team went Serverless First."
date: 2019-04-24
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ao-com-story/ao-serverless-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ao-com-story/ao-serverless-header.png"
category:
  - user-stories
authors:
  - NickGottlieb
---

AO.com is one of the UK’s leading online electrical retailers, that is dedicated to giving its customers an exceptional experience, throughout the purchasing journey. From choosing the right item for their needs, ordering on its website to delivery of the item at a time that suits them, AO.com is passionate about creating happy customers..

One of their ways of achieving this was to spawn their Single Customer View (SCV) team. They play a key role in helping the company stay compliant with user privacy and GDPR legislation. Until recently, their tech stack was made up of everything you’d expect: containers, EC2, Kafka, SQL Server.

Upcoming GDPR legislation gave them the opportunity to try something new.

#### GDPR compliance pushes them toward serverless

At pace, the SCV team needed to build an entirely new feature to help make sure AO.com were compliant with new GDPR legislation due to come into force.

The SCV team thought about what this would mean for them. They’d have to set up the containers, provision the server resources, they needed to consider load balancing and security concerns (like patching), and ship a fail-proof feature in less than two weeks, with a relatively small team. The team knew they could have a far bigger impact by trying something new.

So they started looking at more time-efficient options. Some people on the team had already played around with AWS Lambda and the Serverless Framework, and it seemed promising.

So the AO.com team committed. They decided to build a new GDPR feature in a serverless way. It was the team’s first production serverless application—and such a resounding success, the team has never looked back. 

They’ve gone all-in on serverless for every new feature since, truly adopting the Serverless First mindset.

##### The process: building the first serverless feature

Lambda + the Serverless Framework empowered the AO.com team to complete their new feature in only three days.

After the feature was launched, they did not have to think about constantly monitoring the feature to make sure it wouldn’t go down, since Lambda scales automatically with demand.

> In 3 days, we had something running in production. This was so successful for the business that we started to build even more features with Serverless.

--Jon Vines, AO.com Software Development Team Lead

They kept building new API-based services with Serverless. They built a subject access request feature (another aspect of GDPR compliance), then right to be forgotten requests, and a whole suite of other user-facing features.

The architecture for these APIs is pretty straightforward: the Serverless Framework defines their Lambda functions, which then interfaces with SNS and S3 buckets.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ao-com-story/Serverless-Architecture-AO1.png">

They were able to ship each successive feature in only a few days as well. And their Lambda cost for all this?

Less than $15 a month.

#### From APIs to full serverless data pipelines

One of the AO.com team’s core competencies was building data pipelines and getting that data to the right teams. Their initial architecture used Kafka on EC2 instances, with services deployed in containers in ECS.

The team were happy with the robustness of this solution and they now had the opportunity to make it more efficient. The nature of the architecture meant that any time they wanted to deploy changes, they had to redeploy the entire functionality for the whole pipeline. It also meant scaling of functionality was across the whole service, and not the individual features.

##### Moving their data pipelines to Lambda with the Serverless Framework

The AO team decided to integrate Lambda into their data pipeline. This would give them the ability to easily make incremental deployments, and the pipeline would scale automatically as needed.

They kept Kafka in place, but now interface with Kafka using Lambda and S3 buckets. So their current serverless data pipeline architecture looks like this:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ao-com-story/Serverless-Architecture-AO2.png">

> “We went from managing servers, containers and scaling policies, to pointing to Lambda using S3 buckets and triggers. No need to manage or scale, and it’s so much less of a burden. It’s been a massive win for us.”

_-Jon Vines, AO.com Software Development Team Lead_

#### Challenges along the way

The AO.com team was most familiar with .NET, and decided to continue developing in .NET even after moving to serverless and Lambda.

The serverless ecosystem is primarily [focused on languages such as JavaScript, and Python](https://serverless.com/blog/serverless-by-the-numbers-2018-data-report/#top-languages). This meant it was more challenging to find .NET examples, however, the team contributed back with posts [on their learnings](https://medium.com/@jonvines/lessons-learned-in-serverless-6a4acc489d55). In other areas, the tooling for .NET in observability and monitoring weren’t as advanced, but this is improving all the time.

Most impactfully, when dealing with Lambda functions, developers will have to work around cold starts. Cold starts are fairly minor in languages like JavaScript or Python, but in .NET could be as much as 3-5 seconds. The AO.com team is working around this by tweaking their Lambda provisioning.

Overall, Jon Vines, Team Lead at AO.com, said he’d still choose .NET again. “We’re more familiar with it, and it’s just easier for us. The gains we see from Serverless are worth the trade-off.”

#### Company-wide change

The SCV team at AO.com is just one of many. After seeing the huge impact serverless has made in the SCV team, other teams at AO.com are beginning to experiment with and adopt serverless as well.

>”We’re still pretty early in our Serverless journey here at AO. I can’t wait to see what things shape up like in the next year.”

_-Jon Vines, AO.com Software Development Team Lead_
