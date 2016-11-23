---
title: 'State of the Serverless Community'
date: '2016-11-29'
layout: Post
gitLink: /2016-11-29-state-of-serverless-community.md
scripts:
  - https://www.gstatic.com/charts/loader.js
  - https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/scripts/state-of-serverless.js
---

About 2 months ago we shared a ‘State of the Serverless Community’ survey within our community. The goals were to find out more about how and why people are adopting serverless architectures, what problems they are encountering, and how they feel about the future of serverless. 

**The responses**

We distributed the survey through our newsletter, on our <a href="https://github.com/serverless/serverless" target="new"> readme</a>, and on our Twitter feed and received a total of 137 responses. The majority of respondents were from North America and Europe (36% and 33% respectively) with the additional 30% spread around the rest of the world. 

<div id="chart_div_role"></div>

The roles of the respondents varied considerably with about 60% identifying as developers (43% backend, 9% frontend, and 10% full stack). 28% were either an engineering manager or executive while the remaining 12% filled various roles such as product manager, architect, and DevOps. Serverless architectures are definitely being adopted most rapidly by startups, with about half of respondents reporting they work at a startup, though they appear to be picking up traction at larger companies as well with 29% and 15% from SMBs and enterprise companies respectively. 



**Use Cases**

Serverless architectures are still very much in the early days of their evolution but we’ve seen signs that they’re already being utilized for mission critical workloads and not just for hobby and side project. 50% of our respondents said that they’re using serverless architectures for work while 21% are using them for a side project and 22% have experimented with them but aren’t actually using them on a project yet. 

<div id="chart_div_use"></div>

The most common use case for serverless architectures was web server/API with 65% of respondents checking that box.  Data processing came in at 34% while internal tooling, IoT, and chat bots were all marked as use cases by over 20% of respondents. 33% mentioned a use case other than the ones we listed with the most common write-in being mobile backends. 

**Providers and Tooling**

AWS was by far the most widely used serverless provider with Lambda being used by 96% of the respondents. Azure Functions came in at 6%, Google Cloud Functions at 4% and Webtask and OpenWhisk each at less than 2%. The huge gap here for Lambda doesn’t come as a huge surprise since Lambda is by far the most mature offering in the space, though we expect this gap to narrow as the other providers improve their products and more tools begin to support them.

<div id="chart_div_framework"></div>

The Serverless Framework was far and away the most widely used framework among our respondents with 76% saying they use it to develop their serverless architectures. Apex was the second most common at 10% while 19% said they didn’t use any framework at all. 

When asked about how they monitor their serverless architectures 80% of our respondents said they use AWS’s CloudWatch. Another 14% percent use New Relic, 12% use Data Dog, while Splunk, IOpipe, and Sumo Logic all had responses under 5%.

<div id="chart_div_monitor"></div>

Node.js was the most common operating language for serverless architectures (75%), which is to be expected since it’s the first language that Lambda supported, while 15% use of respondents use Python and 8% use Java. These are very much in line with the numbers that we see from users of the Serverless Framework (82%/12%/6%). As providers begin to support more languages, and add more functionality to existing non-node.js languages, we expect to see more parity among languages. 

**The Future**

One of the questions on our survey asked respondents was, on a scale of 1-5, how optimistic they are about the ‘future of serverless architectures’. The audience that responded was mostly early adopters, so it most likley biased, but it’s also an audience that understands serverless and the advantages and disadvantages that come along with it. Overall the responses were emphatically optimistic as you can see below. 

<div id="chart_div_rate"></div>

As we continue to in our mission to build tooling that makes it easy to develop and deploy serverless architectures we’re also going to continually be doing our best to learn more about the serverless community. We hope for more opportunities to share those learnings with you in the future! 

