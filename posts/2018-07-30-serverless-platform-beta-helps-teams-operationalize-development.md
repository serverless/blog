---
title: "The new Serverless Platform Beta: everything teams need to operationalize serverless development"
description: "The Serverless Platform Beta is everything teams need to operationalize serverless development. Build, operate, and integrate serverless applications in a single toolkit."
date: 2018-07-30
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-platform-release/1-Serverless_header-Platform+Beta.jpg'
category:
  - news
  - operations-and-observability
heroImage: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/featured-posts/03_The-new-Serverless-Platform-Beta.png
authors:
  - AustenCollins
---

Today, we’re excited to announce the [Serverless Platform Beta](https://dashboard.serverless.com/)—a single toolkit that provides everything teams need to operationalize serverless development. We plan to expand active development on the Serverless Platform with the $10M Series A funding we raised from Lightspeed Venture Partners and Trinity Ventures, which we are also announcing today.

Read on for a full feature breakdown, or watch the 2 minute video:

<iframe src="https://player.vimeo.com/video/282028201" width="640" height="360" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen="true"></iframe>

#### Serverless adoption is growing, and fast

In 2015, we created a project called the [Serverless Framework](https://serverless.com/framework/). Our mission was to make serverless development easy. By leveraging new cloud infrastructure that auto-scales and charges only when it’s used, we believed developers could build software with remarkably low overhead.

At that time, we had no idea what the Framework would become. A community rallied behind it and the broader serverless movement, contributing to the open source core, offering their opinions and insights, and sharing their passion.

By 2017, companies like Coca-Cola were uttering two simple words: "Serverless first". Every new greenfield project or innovation effort within their organization was to be built on a serverless architecture. Organizations that had never embraced the public cloud before saw serverless as their gateway in; they too began to adopt serverless. “Serverless” moved from a fringe buzzword to a mainstream business decision.

As the adoption of serverless has grown, so too have the needs of today’s serverless teams. In addition to tooling that simplifies the development of serverless applications, these teams need tools to simplify operations across their teams and entire organization.

They need logs, they need team collaboration, they need ways to integrate with legacy systems, and so much more.

This is exactly what we built the Serverless Platform we’re announcing today to do.

#### The Serverless Platform lets you build, operate & integrate

The Serverless Framework solves several problems in the build phase, and has soared in robustness thanks to a passionate open-source community.

Now, the [Serverless Platform](https://dashboard.serverless.com/) extends its focus to two other phases of serverless application lifecycle management: operating and integrating.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-platform-release/3-Serverless-Platform-unified-graphic.png">

##### Operating with the Serverless Dashboard

When you ask a serverless developer what their top three pain points are, they will tell you unequivocally: debugging, monitoring and testing. There are ways to build serverless applications, but no good way to operate them.

This is exactly what the Dashboard does. It gives you architectural views of your serverless applications, exposes logs for metrics, alarms and debugging, and lets you collaborate easily with teammates on development.

The Dashboard, just like our Framework, is vendor-agnostic. Use any provider you want, and use multiple providers at once. We’ll expose everything in a single place.

##### Consolidated view & oversight for your serverless applications

Instead of trying to hold all the pieces of your serverless application in your head, you can see them visually in the Dashboard. Teammates and executives can have oversight over all of your serverless applications.

View all of the functions, event subscriptions and resources your serverless application contains. Inspect the configuration of each function and subscription. Review all cloud infrastructure resources.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-platform-release/4-Serverless+Consolidated-view-and-oversight_animation.gif">

##### Check deployment history and collaborate on services with teammates

To date, working on a serverless service has put developers in a silo. There was no easy way to work on a service with others, check who deployed last and when, or to see exactly what changed.

Now, you can collaborate on Framework deployments and services by inviting team members to the project:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-platform-release/5-Serverless_invite+collaborator.png">

And you get easy access to the deployment history to see the deployment dates and changes:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-platform-release/6-Serverless_last+deploy.png">

##### Integrating with the Event Gateway

Also included in the Platform is a hosted version of the [Event Gateway](https://serverless.com/event-gateway/), a powerful event router, capable of routing event data to serverless functions and other services across clouds. It’s the answer to how organizations can integrate serverless into their existing services.

##### What is the Event Gateway?

The Event Gateway lets you react to _any_ event, from anywhere—any cloud provider or SaaS, containers and legacy infrastructure. With the Event Gateway, you can do things like: easily build FaaS-backed APIs, use configurable connectors to react to events from data stores like Kafka or Kinesis, and utilize multiple cloud providers in a single serverless application.

**Some real world examples:**

Kelsey Hightower from Google, in his recent CloudNativeCon keynote, ran the Event Gateway on Kubernetes, on Google Cloud; an S3 event on AWS was sent through the Event Gateway and routed to a Google Cloud Function:

<iframe width="560" height="315" src="https://www.youtube.com/embed/_1-5YFfJCqM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>


Austen Collins from Serverless, Inc., with the help of various Cloud Native Computing Foundation members, uses the Event Gateway to trigger 11 different cloud providers:

<iframe width="560" height="315" src="https://www.youtube.com/embed/TZPPjAv12KU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>


Use it to [build APIs](https://serverless.com/blog/how-use-event-gateway-use-cases-rest-api-custom-events/) or [react to custom events](https://serverless.com/blog/how-use-event-gateway-use-cases-rest-api-custom-events/).

##### Monitor events and function invocations with real-time logs

Once you publish events into the Event Gateway, you can see them in the Serverless Dashboard via real-time logs:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-platform-release/7-Serverless_logs.png">

You can self-host the Event Gateway in your own AWS account, or use our hosted (serverless) option, included in the Dashboard.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-platform-release/8-Serverless_Event+Gateway+logs.png">

#### Try the Serverless Platform Beta

If your goals are to deliver fast, increase innovation and reduce overhead, then there is no better option today than a serverless architecture.

With the Serverless Platform Beta, we want to help everyone build more and manage less through serveless technologies. With our Series A funding from Lightspeed Venture Partners and Trinity Ventures, we plan to double down on our efforts to expand the features of the Serverless Platform and continue actively contributing to our Framework, Components and Event Gateway open source projects.

We can’t wait to hear what you think about the Serverless Platform, and especially the new observability tools it adds to the Serverless Dashboard.

**[Try the Serverless Platform Beta here.](https://dashboard.serverless.com/)**
