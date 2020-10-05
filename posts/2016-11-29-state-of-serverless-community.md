---
title: State of the Serverless Community Survey Results
description: Results of the State of the Serverless Community survey and what we learned.
date: 2016-11-29
thumbnail: https://cloud.githubusercontent.com/assets/20538501/20676598/dfc90252-b555-11e6-84a7-ea320f6ca210.png
layout: Post
scripts:
  - https://www.gstatic.com/charts/loader.js
  - https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/scripts/state-of-serverless.js
authors:
  - NickGottlieb
---

About 2 months ago we shared a ‘State of the Serverless Community’ survey. We wanted to find out more about how and why our community is adopting serverless architectures, what problems they're encountering, and how they feel about the future of serverless.

## The Responses

We distributed the survey through our newsletter, on our <a href="https://github.com/serverless/serverless" target="new"> readme</a>, and on [Twitter](https://twitter.com/goserverless), and received a total of 137 responses. The majority of respondents were from North America and Europe (36% and 33% respectively), with the additional 30% spread across the rest of the world.

<div id="chart_div_role"></div>

Respondents' job titles varied considerably with about 60% identifying as developers (43% backend, 9% frontend, 10% full stack). 28% were either an engineering manager or executive, while the remaining 12% filled various roles such as product manager, architect, and DevOps. Serverless architectures are definitely being adopted most rapidly by startups, with about half of respondents reporting they work at a startup. However, serverless architectures appear to be picking up traction at larger companies, as well, with 29% and 15% of respondents coming from SMBs and enterprise companies respectively.

## Use Cases

Serverless architectures are still very much in the early days of their evolution, but we’ve seen indications that they’re already being utilized for mission-critical workloads and not just for hobby or side projects. 50% of respondents stated that they’re using serverless architectures for work, while 21% are using them for a side project, and 22% have experimented with them but aren’t actually using them on a project yet.

<div id="chart_div_use"></div>

The most common use case for serverless architecture was web server/API with 65% of respondents checking that box. Data processing came in at 34%, while internal tooling, IoT, and chatbots were all marked as use cases by over 20% of respondents. 33% mentioned a use case other than the ones we listed with the most common write-in being mobile backends.

## Providers & Tooling

AWS was by far the most widely used serverless provider with Lambda being used by 96% of respondents. Azure Functions came in at 6%, Google Cloud Functions at 4%, and Webtask and OpenWhisk each at less than 2%. The significant lead here for Lambda doesn’t come as a surprise since it's by far the most mature offering in the space. We expect this gap will narrow as other providers improve their products and more tools become available to support them.

<div id="chart_div_framework"></div>

The Serverless Framework was far and away the most widely used framework among our respondents with 76% saying they use it to develop their serverless architectures. Apex was the second most common at 10%, while 19% said they didn’t use any framework at all.

When asked about how they monitor their serverless architectures, 80% of respondents said they use AWS’s CloudWatch. Another 14% percent use New Relic, 12% use Data Dog, while Splunk, IOpipe, and Sumo Logic all had responses under 5%.

<div id="chart_div_monitor"></div>

Node.js was the most common operating language for serverless architectures (75%). That's to be expected since it’s the first language that Lambda supported. 15% of respondents use Python, and 8% use Java. These findings are very much in line with the numbers that we see from users of the Serverless Framework (82%/12%/6%). As providers start to support more languages and add more functionality to existing non-node.js languages, we expect to see more parity among languages.

## The Future

One of our survey questions asked respondents to rate their level of optimism about the "future of serverless architectures" on a scale of 1-5. The respondents were primarily early adopters, so bias could be an issue. But it’s also a group of users that understands serverless, and the advantages and disadvantages that come along with it. Overall the responses were very optimistic as you can see below.

<div id="chart_div_rate"></div>

As we continue on our mission to build tooling that makes it easy to develop and deploy serverless architectures we’re making an ongoing effort to learn all we can about the serverless community. We look forward to sharing more of those insights with you in the future!
