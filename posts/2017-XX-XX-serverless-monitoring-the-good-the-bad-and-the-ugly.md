---
title:  Serverless monitoring, the good, the bad and the ugly
description:  How to re-wire your brain to learn Serverless monitoring.
date:  2017-09-18
thumbnail: https://media.giphy.com/media/VtR7L2GCNQB56/giphy.gif
layout:  Post 
authors:
 - AdnanRahic
---

<p>
<img src='https://media.giphy.com/media/VtR7L2GCNQB56/giphy.gif' width="100%">
</p>

Not so long ago, a job requirement pushed me into the world of FaaS. I was thrilled to the notion of abstracting away even more of the tedious work we developers should not need to know. "We are not operations engineers!" I exclaimed proudly. "We should not need to dabble in the dark arts of the Linux Shell."

Little did I know how wrong I was. The Linux Shell is a tool that will never be replaced. Learning it today will mean you'll use it in years to come. Having a "real" server (it's not real, it's VM, I know) where you interact with the Operating System, install what you please and run applications how you see fit is a walk in the park.

We humans are creatures of habit. Managing your own server with the tools you like and are used to, scaling it as you wish, is convenient, but only a habit. Monitoring your software is easy because everything is in one place. You will know if something is wrong because you use adequate tools provided by respected companies. As an AWS user I can find whatever I need regarding my servers in the AWS Console. Now comes the difficult question. How does this all add up when using AWS Lambda and Serverless?

## Monitoring 101
How to define what monitoring is for the average developer? 

> Application Performance Management (APM) is the monitoring and management of performance and availability of software applications.

Okay, that sounds complicated. Let's break it down. All applications have metrics we as developers can monitor. Meaning we have insight in how the software we created behaves. This is crucial in creating healthy user satisfaction. Downtime and slow apps can create some pretty grumpy customers. Trust me, I know. I get angry phone calls and rage mail every once in a while.

How to avoid getting yelled at by customers? Track your errors and monitor your software! Implement a good notification system that lets you know when and where an error occurred. Make sure to have good and easy to view logs of all errors, warnings and other crucial data your application creates. Be responsible for the software you write. Because it is our legacy as developers. We have made an oath, to be creators of awesome stuff!

But user experience is only one side of the performance metrics. The second crucial metric is the measure of computational resources. How much resources is the app consuming. If it is too much you need to scale down your servers, otherwise if the app is capping all resources you may consider larger servers or more of them.

_**Note**: I recently came across an [awesome article](https://hackernoon.com/node-js-monitoring-done-right-70418ecbbff9) on this topic by none other than the CTO of RisingStack, Peter Marton. He explained in detail how to do monitoring right. I urge you to take a peek, it will change your view on monitoring forever._

### Overhead?
Excuse me...? Can I have some monitoring please? But, without being a burden on my application.

We're lucky that, in 2017, this is a given. Monitoring software has become so advanced that in today's world of programming the overhead is minimal. The sun was not shining so bright back in the day. Monitoring applications was followed by a known fact that it would impact your apps performance significantly.

### How does this translate to Serverless?
The Serverless revolution has been gaining strength for the past few years. I see no reason for it to stop. The hype is real. Developers are starting to view the **F**unction as a **S**ervice architecture as a savior. Making it possible to scale applications automatically serving only as many users as needed. The pay as you go method has cut costs drastically, making it possible for start ups to create awesome software for the fraction of the cost it would "normally" cost.

But, wait a minute. What else was needed to be cut, for it to become a possibility? A couple of things come to mind. The overview of your code performance, and tracking errors are first. Silent failures as well. How do you monitor the performance of a server that is not a server? Schrödinger's server? Okay, now my head hurts.

This paradox needs a new perspective. Monitoring Serverless is a new beast in itself. Traditional methods will not work. A new mindset is in order.

```js
server != functions
```

Instead of telling our functions to send along additional data with every invocation, why not just collect their residual data? This is a cool idea! It's a known fact all AWS Lambda functions send their logs to AWS CloudWatch.


## Serverless is unforgiving
Unlike in traditional applications, you don't have full overview of every part of your system. Not to mention how hard it is to test Serverless. You have to push code to AWS to see if it's working or spend an eternity on setting up emulators on your local machine. The process is incredibly tedious. Not to start with adding third party services to your app. It creates overhead and additional costs. Try attaching monitoring services to every single Lambda function. That's never going to scale well!

Let's imagine a scenario of monitoring a simple function on AWS Lambda. The purpose is to test the function and check the verbosity of the logs on CloudWatch.

After hitting the endpoint with Postman a couple of times I'm assured it works fine.

![postman](https://github.com/adnanrahic/cdn/raw/master/serverless-good-bad-ugly/Postman_038.png)

Opening up CloudWatch I can see the logs clearly. All the function invocations are listed.

![cloudwatch](https://github.com/adnanrahic/cdn/raw/master/serverless-good-bad-ugly/Selection_036.png)

The logs are extensive, the only issue is I can't seem to make any sense of them. I can see the functions we're invoked, but not much else. Error messages for failing functions are not verbose enough, so they often go unnoticed. I'm also having a hard time finding functions that timed out. 

I also tried logging through the command line. It shows possible errors a bit better, but still, not good enough to have peace of mind.

```
serverless logs -f my-function
```

![](https://github.com/adnanrahic/cdn/raw/master/serverless-good-bad-ugly/Selection_041.png)

Not to mention the tiresome nature of having to push code to AWS every time you'd want to try out something new. Thankfully, all is not lost.

## Making my life less miserable
What if I didn't need to push code to AWS every time I wanted to test something? All heroes don't wear capes. Like a knight in shining armor, [Serverless Offline](https://github.com/dherault/serverless-offline) comes barging in to save the day! At least now I can test all my code locally before pushing it to AWS. That's a relief.

Setting it up is surprisingly easy. Installing one npm module and adding a few lines to the serverless service's **serverless.yml** and voila, API Gateway emulated locally to run Lambda functions.

Switching to the directory where I created the sample function and service, I just ran the following command in a terminal:
```bash
npm install serverless-offline --save-dev
```

After installing serverless offline I just referenced it in the **serverless.yml** configuration:

```yaml
##############
...
functions:
  hello:
    handler: handler.hello
    ...
    ...
##############
# Added these two lines!
plugins: 
  - serverless-offline
```

Back in my terminal running Serverless offline is as easy as just typing:
```bash
serverless offline start
```

That's it, a local development simulation of API Gateway and Lambda is up and running!

## The logs are still bad though...
I still can't get over the fact how bland the logs are. Not to mention the lack of error reporting. I took me a good while to find failing functions in the logs. Imagine the nightmare of tracking them in a large scale production application. This issue is what bothers me to most. The lack of overview. It's like swimming in the dark. I don't have the slightest clue what's down there.

What did I do? I went hunting. There has to be something out there on the web that can help me out. I was looking for a way to simulate the monitoring and logging of a server. I thought maybe there's a way to create a broader perspective over the whole serverless system. What I found blew me away, in a good way. A bunch of tools exist that parse and analyse logs from all functions in a system on the account level. Now that's cool.

I decided to try our [Dashbird]() because it's free and seems promising. They're not asking for a credit card either, making it a "why not try it out" situation. Allegedly it only takes 5 minutes to hook up with your AWS account, and be ready to go. I'm sceptic. I timed myself.

The onboarding process was very straight forward. You just add a new policy and role on your AWS account, hook it to your Dashbird account and that's it. They even have a great [getting started tutorial](https://dashbird.io/help/getting-started/setting-up-dashbird/).

If you want to know, the timer stopped at 4 minutes. I'm impressed.

However, I'm much more impressed with Dashbird. I can finally see what's going on.

![dashbird dashboard](https://github.com/adnanrahic/cdn/raw/master/serverless-good-bad-ugly/dahbird-dashboard.png)

Errors are highlighted, and I can see the overall health of my system. I feel great all of a sudden. It also tracks the cost so I don't blow the budget. Even function tailing in real-time is included. Now that's just cool. 

![dashbird per function errors](https://github.com/adnanrahic/cdn/raw/master/serverless-good-bad-ugly/dashbird-per-function-errors.png)

With this watching my back I'd be comfortable with using Serverless for any large scale application. The world relief comes to mind.

## Final thoughts
Whoa... This has been an emotional roller-coaster. Starting out as a sceptic about the ability to monitor and track large scale Serverless apps, I've turned into a believer. It all boils down to the developer mindset. It takes a while to switch from the mental image of a server to FaaS. With much reason indeed. Serverless is an incredible piece of technology, and I can only see a bright future if we keep pushing the borders with awesome tools like Serverless Offline, Dashbird, CloudWatch, and many others.

I urge you to check out the tools I used above, as they have been of great help to me.

Hope you guys and girls enjoyed reading this as much as I enjoyed writing it. Until next time, be curious and have fun.

*Do you think this tutorial will be of help to someone? Do not hesitate to share. If you liked it, let me know in the comments below.*

Tools:
 - [Serverless offline](https://github.com/dherault/serverless-offline)
 - [Dashbird](https://www.dashbird.io/)
 - [CloudWatch](https://aws.amazon.com/cloudwatch/)

Resources:
 - https://hackernoon.com/node-js-monitoring-done-right-70418ecbbff9
 - https://blog.risingstack.com/monitoring-nodejs-applications-nodejs-at-scale/
 - https://en.wikipedia.org/wiki/Application_performance_management
 - https://medium.com/dashbird/is-your-serverless-as-good-as-you-think-it-is-2baa3d36b1de