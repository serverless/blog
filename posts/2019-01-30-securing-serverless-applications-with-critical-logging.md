---
title: "Securing Serverless Applications with Critical Logging"
description: "How important logs are to secure a serverless app, what and how 
to log information."
date: 2019-01-30
thumbnail: "http://d72jhcab42lw7.cloudfront.net/images/critical-logs-thumbnail-min.png"
heroImage: "http://d72jhcab42lw7.cloudfront.net/images/critical-logs-hero-min.png"
category:
  - operations-and-observability
  - guides-and-tutorials
authors: 
  - RenatoByrro
---

FaaS services such as AWS Lambda take care of many security aspects - networking, firewall, OS updates, etc. Make no mistake, though: application-level security is still fully on our hands! Do we have all the information needed to secure our serverless apps? Enters critical logging!

We surely put in place a lot of proactive measures to secure our applications. We want to **prevent** attacks, not **remedy** them, of course. Take a look at John Demian's great introductory article about [Securing serverless applications](https://dashbird.io/blog/security-in-serverless/). In the present article, our goal is to address one of the topics pointed out by him: "**insufficient logging**".

### How does logging help securing an app in the first place?

<img src="http://d72jhcab42lw7.cloudfront.net/images/critical-logs-coding-min.png" alt="Logging helps secure an application">

*Credits: Photo by [Kevin Ku](https://unsplash.com/photos/w7ZyuGYNpRQ?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on Unsplash*

Some types of information are critical to log so that they are available when it comes the time to act on security breaches. Having critical logs will help us, for example, understand which security flaws attackers explored and how to fix them, or build a blacklist of IP addresses, or identify compromised customer accounts. Even though we can help ourselves without logs in some cases, they'll buy us precious time and provide valuable insights that may save our business a lot of money - and most importantly our hard earned reputation!

Remember: we are always in disadvantage against an attacker. They planned everything ahead and have been studying our app for some time. We receive no warning and know nothing about who we're fighting against. Every bit of information helps us level the playing field.

Below are some examples of information we could classify as critical for logging in a serverless app. It's not an exhaustive list but will give us a good head start.

## Invocation/Event Inputs

A serverless journey starts with... a function invocation, of course! And every function invocation comes with... an event input!

When analyzing or acting on a possible security breach, it would be helpful to retrace the attacker's steps. I mean, since the very start, which means we've got to log the inputs received by every function. You will lean towards logging only inputs coming from external sources, but logging every function invocation event would be beneficial.

Say you receive a request from an external source, which triggers a chain of processing steps involving multiple internal functions (not publicly facing). Even though you may have input validations on the publicly exposed function, at least parts of the input will probably make their way to the internal functions, and it may be able to trigger unexpected behavior or unwanted side effects. In this case, it would be interesting to know what exactly reached the internal functions and what were the results in order to act accordingly in securing your app.

## Response Payload

Similarly to Invocation Inputs, logging response payloads could also be helpful to analyze and mitigate security breaches. First of all, in the worst case scenario of not being able to stop an attack, we will at least want to know what information is now in possession of the attackers. These logs will answer just that.

A positive side effect of having these logs is to identify possible bugs or unexpected behavior in our application by comparing expected and actual responses.

## Performance Levels

<img src="http://d72jhcab42lw7.cloudfront.net/images/critical-logs-performance-min.png" alt="Use logs to monitor application performance">

*Credits: photo by [Michal Mrozek](https://unsplash.com/photos/0aqJNZ5tVBc?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on Unsplash*

In a traditional server infrastructure, if our app starts suffering from bad performance, our users might get mad, but we won't be surprised by scary bills. In a serverless stack, though, costs are usually variable: the more we use, the more we pay. If we plan that a function would run on average for 3 seconds and it starts taking 30, that's a big deal and we need to act quickly so that it doesn't burn our precious resources for nothing.

Logging a multitude of indicators would be helpful when we find ourselves in this situation. Knowing in which cases our app performs badly will help us improve our code and avoid financial headaches. What exactly you should be logging for this purpose will depend heavily on the use case and context, but in any case, it's important to have this in mind when planning the application critical logs.

Services like Dashbird not only makes logging and debugging a breeze but also monitors your functions' performance. Having every bit of information in one place will certainly save you time and money. A service like that can easily pay for itself, it's really worth checking it out.

## Authentication Requests

In case our app has some sort of login protected area, it's paramount to log authentication requests, especially the failed ones. Make sure you also log everything you possibly can from the requester, such as the IP address obviously.

Look for odd requests or patterns. For example, you might see a spike in failed requests and find out that many of the usernames or email addresses aren't even in your customer base. That could be someone scanning a list of leaked credentials to check potentially vulnerable accounts in your app. Since it's fairly common for people to reuse passwords, it's likely they will find honey in our beehive.

Take care of your bees, you've grown them with hard work. Authentication logging can alert that someone is scouting our app, looking for weak spots. It will allow us to take proactive measures to prevent unauthorized account access. Sources like [Have I Been Pwned](https://haveibeenpwned.com/) could be very helpful. In our example, knowing the usernames/emails in possession of the attacker would help to identify which leaked credentials list(s) they're scanning. We can then search which of our customers had credentials exposed and preventively block their accounts, asking for a password reset.

Despite the little hassle, our customers will love to receive a preventive security alert. Much better than "*We're sorry, but your account has - already - been violated and we couldn't do a thing to prevent it*"!

By the way, Dashbird has a cool feature: it provides us with the number of occurrences of a given error over time. And it can alert by email and/or Slack. Imagine receiving a proactive alert: “34,985 authentication errors”. It can't smell good and deserves attention, right? Let's skip the security paranoia and focus on growing our business, letting Dashbird take care of our back for logging and reporting suspicious activity.

## Service Usage Indicators

In the scenario of an app with paid services, possibly exposed through an API, it's a good idea to log indicators of service usage.

Consider we carefully planned our costs and pricing structures so that our business has a fair chance of financial success. Customers start doing the so much expected, magical thing: entering credit cards and using our app! Cheers! Sometime later we get an invoice from our cloud provider and the number isn't actually what we expected… How could we be spending so much if we had half of it in revenue during the same period?

Did we make a mistake dimensioning our costs and pricing? Or maybe someone found a way to bypass our access authorization logic and is free riding on our backs? What happened exactly?

- In a scenario like that, it would be very good to have detailed logs so that we can:
- Narrow down to which services contributed most to our losses;
- Who was actually using these services and when?
- Were these users actually supposed to be using those services?
- Was anyone abusing the service in a way we didn't expect?

## The 4 W's

Based on the [OWASP Logging Cheat Sheet](https://www.owasp.org/index.php/Logging_Cheat_Sheet) recommendations, we should be logging: When, Where, Who and What in every function invocation. That's applicable to all items we discussed above and any other logging scenario in our serverless app. It's also good to have in mind.

## Careful: what is critical NOT to log

<img src="http://d72jhcab42lw7.cloudfront.net/images/critical-logs-private-min.png" src="Careful with sensitive/personal data in logs">

*Credits: photo by [Dayne Topkin](https://unsplash.com/photos/u5Zt-HoocrM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on Unsplash*

We discussed only what we should be including in our logs, but we also need to think what should be excluded.

> Hey, hey, not so fast logging the entire user object, buddy!

User-related information in many cases will contain personal or sensitive data that should never go into our logs. Make sure you filter this data out, otherwise we might have problems with the European data privacy lords or worse! Wait, are there worse? Well, you get the point...

- - -

I hope this article made the case for the importance of critical logs to secure your serverless apps. Please leave your thoughts in the comments below.

If you want to secure your serverless apps right now, I strongly suggest to visit [Dashbird.io](https://dashbird.io). They're kind of the Jedis for serverless logging and monitoring. You won't want them to be far away when Darth Vader knocks your application's back door, right? Well, actually, he won't even knock… but Dashbird can tell he's around and how to strike him by following good practices and implementing your critical logs appropriately.

Further reading: this article had a bit of inspiration from [The 6 Categories of Critical Log Information](https://www.sans.edu/cyber-research/security-laboratory/article/6toplogs), you might want to check it out as well.
