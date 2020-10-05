---
title:  Fantastic Serverless security risks, and where to find them
description: A breakdown of the top serverless security risks, and steps you can take to secure your serverless applications.
date:  2018-02-12
thumbnail: 'https://raw.githubusercontent.com/adnanrahic/cdn/master/covers/catridingunicorn2.jpg'
category:
  - operations-and-observability
  - guides-and-tutorials
authors:
 - AdnanRahic
---

With the rising hype around all things Serverless, I’ve been getting regularly asked one simple question:

> But, how can I guarantee my serverless application is secure?

My response is always the same. How can you guarantee anything? I’m just as scared about my EC2 instance getting breached as I am about my Lambdas.

Most server vulnerabilities are due to programmer error. That one line of code that does a tiny bit more than it should. That one app secret you misplaced. Those files you forgot to encrypt.

There are numerous things we, the developers, can do to write better software.

That said, the distributed nature of Serverless Architectures gives a malicious attacker more room to maneuver. The greatest asset of serverless is also its most dangerous foe; it gives attackers significantly more points of entry.

This had me genuinely worried, so I started digging for answers. That's when I came across Puresec's study, *[The Top Ten Most Critical Security Risks in Serverless Architectures](https://www.puresec.io/hubfs/SAS-Top10-2018/PureSec%20-%20SAS%20Top%2010%20-%202018.pdf?t=1517837443549)*.

I read it without lifting my eyes from my screen. So many things became crystal clear.

## The path to better Serverless Security

Sadly, there’s still a common bad practice among developers: we focus on security once the software we’re building is already up and running.

> “I'm just going to deploy this app and hope I don’t get hacked...” — The average developer

In a nutshell, the *“getting around to security...eventually”* mentality is what kills us. The top serverless vulnerabilities are remarkably similar to the top vulnerabilities, period.

Read on for the takeaways from the Puresec security study, and for measures you can take right now to strengthen the security of your application.

### TL;DR

*__Note__: I strongly suggest you [read the whole Puresec study](https://www.puresec.io/blog/serverless-top-10-released). It’s freaking awesome. If you want a quick recap of the risks take a look at the TL;DR below. Or just jump to the section you are interested in.*

- **Event injection** — Solved with input validation and predefined database layer logic, such as an ORM or stored procedures.
- **Broken authentication** — Solved with built-in authentication/authorization solutions and avoiding dangerous deployment settings.
- **Insecure deployment settings** — Solved with never using public read ACLs and keeping files encrypted.
- **Misuse of permissions and roles** — Solved with the “least privilege principle.”
- **Insufficient logging** — Solved with 3rd party tools such as [Dashbird](https://www.dashbird.io/) or becoming well versed in using [CloudWatch](https://aws.amazon.com/cloudwatch/).
- **Insecure storing of app secrets** — Solved by using AWS KMS to encrypt your application secrets.
- **DoS attacks and financial exhaustion** — Solved with writing efficient code, using timeouts and throttling.
- **Improper exception handling** — Solved by logging stack traces **only** to the console or dedicated log files. Never send stack traces back to the end user.

# Getting risky with it
This is probably obvious to most of you—several steps in improving security lie in the quality of our application structure as a whole. The way we architect our software, and our level of attention to detail, will ultimately lead to a robust and secure software product.

That’s enough of my yapping. Let’s get started with the risks!

## 1. Event injection
It's common sense to always validate input. So why am I even talking about this? Because we often forget about the edge cases.

Do you regularly make sure the input is of the data type you are expecting? I tend to forget from time to time, so I imagine most people do. How about the several different event types that can trigger a serverless function? The events don’t necessarily need to be HTTP requests. You may only have checked to make sure the input from an HTTP event is validated. Don’t forget to check for the case when the event is not what you expect it to be.

And please, use a firewall. It’s easy to set up and makes a huge difference.

Moving on from the actual events, try to use predefined logic for database interaction. This will reduce the risk of injections. Especially if you make sure to run all the code with the minimum OS privileges required to get the job done.

## 2. Broken authentication
Use built-in solutions for authenticating users and authorizing their access to resources. This is pretty straightforward with [authorizers](https://docs.aws.amazon.com/apigateway/latest/developerguide/use-custom-authorizer.html) or [AWS Cognito](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-integrate-with-cognito.html). Using them is a no-brainer.

**Related:** We have a post on [setting up robust IAM permissions](https://serverless.com/blog/abcs-of-iam-permissions/), check it out.

You can rest assured using stateless authentication with Auth0 or JWT is perfectly fine. The real issue is not the actual authentication method, but instead **insecure deployment settings** containing **components with public read access**. We’ll talk more about this in the next section.

Some of you maybe don’t like stateless authentication, and that’s okay. You can use **sessions** just fine, but not running on the Lambdas themselves. Every serverless function is stateless by nature, so we can’t store persistent data on them. Hence, for sessions, we can use a dedicated Redis server.

AWS has [Elasticache](https://aws.amazon.com/elasticache/), which is a great Redis and Memcached service. You only have to make sure to have the Lambda and Elasticache running in the same VPC. ([Here’s](https://docs.aws.amazon.com/lambda/latest/dg/vpc-ec.html) a quick tutorial for getting that set up.) Once you’ve done that you can add the `AWSLambdaVPCAccessExecutionRole` to your Lambda’s IAM statements and be good to go.

With all the talk about actual authentication principles, that’s not the real issue here. Your application layer authentication may work flawlessly, but that doesn’t stop a malicious attacker from accessing S3 buckets with public read access. Please, **never enable public read access**, unless you are using a bucket for storing images or a static website. In which case, you only keep those files in that bucket, nothing else!

## 3. Insecure deployment settings
If you’re even the slightest bit worried about the privacy of your files, enable all the encryption methods you possibly can.

Luckily AWS has both [client-side encryption](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/KMS.html) for encrypting a file before it’s sent through the wire, as well as [server-side encryption](https://docs.aws.amazon.com/AmazonS3/latest/dev/serv-side-encryption.html) once it’s added to an S3 bucket. But, none of this makes any sense if your buckets have public read access enabled.

Keep track of your S3 ACLs and make sure the access levels are not littered with unnecessary permissions. You can enable server-side encryption (SSE) for protecting data in your buckets with both [SSE-S3](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingServerSideEncryption.html) and [SSE-KMS](https://docs.aws.amazon.com/AmazonS3/latest/dev/UsingKMSEncryption.html). Pick whichever you feel will work best with your use case.

I’d also encourage you to use client-side encryption with the AWS SDK. [Here’s](https://docs.aws.amazon.com/kms/latest/developerguide/services-s3.html) a nice explanation for you to check out.

## 4. Over-privileged function permissions and roles
Developers are lazy most of the time (and I’m no exception)—we set a single permission level for a whole service containing tons of functions.

Even though this maybe makes sense at first, it can be very dangerous. Functions should only have those permissions that they need to fulfill their purpose.

A function that fetches some data from DynamoDB should not have permission to add data to DynamoDB, for instance. The same logic applies to adding images and retrieving them from S3. It doesn’t make sense for a function doing the GetObject operation to have permission to do a PutObject operation, now does it?

If you’re used to working with the [Serverless Framework](https://serverless.com/framework/), you can easily configure the IAM Role Statements on a per-function basis (or just use [this plugin](https://github.com/functionalone/serverless-iam-roles-per-function)).

Make sure to always follow the least privilege principle. One function, one use case, one permission model.

## 5. Insufficient logging and monitoring
Here comes the difficult bit! Crappy logs equal missed error reports. If you miss critical errors, your users will suffer from greater downtime just because you weren’t notified properly in order to fix them.

But it’s just as dangerous the other way around. Make sure never to log out info containing sensitive data. To get a grip on this, you either need to become a master parser of [CloudWatch](https://aws.amazon.com/cloudwatch/) logs, or use a 3rd party tool such as [Dashbird](https://www.dashbird.io/).

From my experience with Dashbird, I’ve enjoyed that they have live monitoring and error reporting, timeout monitoring, live tailing, price calculations and many other features I’ve still not had the need to use. It gives you a bird’s eye perspective on your Serverless app, pretty much simulating what a regular old-school server application would look like. It can also send error reports to a Slack channel. (We all know how much developers love Slack.)

Dashbird has a [free plan](https://www.dashbird.io/pricing/), so you can go ahead and try it out if you think it'll be useful for you.

## 6. Keep application secrets encrypted
Even though you don’t push environment variables to GitHub, malicious attackers can still access the values if they gain access to the system where your code is running.

Hence, the need to use [KMS to encrypt environment variables](https://docs.aws.amazon.com/lambda/latest/dg/tutorial-env_console.html). There’s a [plugin for the Serverless Framework](https://github.com/trek10inc/serverless-secrets) that makes it easy.

## 7. DoS and financial exhaustion
I love the principle of Lambda, where you pay for the amount of time your code is running. This pushes the developer to write efficient code. Efficient code is less error prone and you can anticipate it will not run for ridiculously long periods.

This makes it much easier to **add timeouts**.

The default timeout for a function when using the Serverless Framework is 6 seconds. It’s more than enough for pretty much any production-level HTTP request. The default memory usage is set at 1024 MB and that’s often more than enough.

If you ever worry about DoS or some hacker invoking your Lambdas for a stupid large about of time, you can always throttle incoming API calls. This goes through [API Gateway](https://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-request-throttling.html), and it’s as simple as setting a few fields to limit the amount of requests per second.

Using the Serverless Framework is also helpful here, because it enables setting a [monthly cap](https://serverless.com/framework/docs/providers/aws/events/apigateway/#setting-api-keys-for-your-rest-api) on the number of invocations a particular API can have. *Incredibly* convenient.

## 8. Improper exception handling and verbose error messages
Debugging serverless architectures is still an issue.

Handling this is best done with sound programming practices. Write unit tests. Write readable code. [Emulate the AWS environment locally](https://github.com/dherault/serverless-offline), so you can run all the code locally before deploying to the cloud.

Stack traces should only ever be logged to the console or log files; never send stack traces to back to the client. Make sure to only send vague messages in error responses.

# Risk-vana...?
Many of the issues I mentioned here apply to general coding practices, regardless of whether you're using traditional servers and Serverless Architectures. Writing clean code, keeping secrets safe, doing input validation and error handling, are universal concepts we as developers [swear an oath](http://blog.cleancoder.com/uncle-bob/2015/11/18/TheProgrammersOath.html) to uphold.

The real issues come with deployment settings, per-function permissions, bad logging, insufficient error reporting, and financial exhaustion. These issues are still manageable, you’re just not used to solving them yet. Serverless is still a young paradigm that we need time to get used to.

The decentralized nature of using serverless pushes us to look for ways of grouping resources into logical groups. Its biggest advantage is also the largest drawback.

# Wrapping up
This article has showed you the basics of Serverless security, what to watch out for, and how you can patch as many vulnerabilities as possible. Hopefully, this has helped you gain more insight of the inner workings of Serverless Architectures.

If you want to take a look at Puresec’s guide, check it out [here](https://www.puresec.io/hubfs/SAS-Top10-2018/PureSec%20-%20SAS%20Top%2010%20-%202018.pdf?t=1517837443549). If you want to read my latest articles, head over [here](https://medium.com/@adnanrahic/latest), or you can always hit me up on [Twitter](https://twitter.com/adnanrahic).

Until next time, be curious, have fun, and feel free to utilize the comments below.
