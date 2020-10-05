---
title: Scaling Email Marketing to Infinity & Beyond by Going Serverless
description: Get a sneak peek at how MoonMail designed their serverless architecture for an infinitely scalable open source email marketing app in this guest post.
date: 2017-01-05
thumbnail: https://cloud.githubusercontent.com/assets/20538501/21700252/2890892e-d365-11e6-8f0c-96262c5a3027.png
layout: Post
authors:
  - CarlosCastellanos
---

One day we found ourselves in a predicament: We were really good at email marketing, but our software sucked. We were spending way too much time trying to "use" the tools we had, and it was painful.

At the same time, we were proud to say that we used AWS to create amazing platforms, products and services for others. Huge international companies relied on our NO-server concept and were extremely happy with the results.

Years spent building eCommerce apps led us to start thinking about how to create a new tool that could improve communication flow between companies and their subscribers. Thus, the idea for [MoonMail](https://moonmail.io/?utm_source=Serverless-Blog&utm_medium=Serverless-Blog) was born.

We were already using the best performing email marketing tools for Shopify (Automation + Recover Checkouts), but we wanted to go a step beyond. We wanted to present something different to the eCommerce community: an email marketing platform with superior performance, plus infinite scalability.

# Overcoming Limitations by Building a Serverless Architecture

We realized that just wasn't possible with the architecture we were using at the time since it relied too heavily on EC2 and Ruby on Rails. So, we decided to embark on a never-ending journey in perfecting the art and science of sending emails.

In the meantime, we were playing with something new, called Lambda, with small Shopify apps and integrations. We also went into digital payments solutions, which we aptly named [MONEI](https://monei.net/?utm_source=Serverless-Blog&utm_medium=Serverless-Blog).

The team was extremely fast in changing, deploying and updating the code. It was literally 1 click away. No servers, and there were only incurred costs when an action was triggered, meaning that if the user didn’t hit the function, there wouldn’t be a cost. We read some serverless books, got involved with the OSS project to see if the project had solid roots, and after 2 weeks our company went fully Serverless.

We looked into different serverless approaches, but in the end decided to use the Serverless Framework because it relies on AWS, the infrastructure we were already familiar with. With Serverless Framework on our minds, we took a bold step toward a new approach based on totally decoupled microservices - better project organization and cost when it should be (i.e., only if they are used). If the microservices get any traction, they are almost infinitely scalable.

How about that for creating and testing a minimum viable product?

# What Does This New Infrastructure Look Like?

Let's have a look:

## Top Secret Front End Preview

In the immortal words of wisdom: Simplify. Sometimes developers like to cram as many features as possible into an app. However, more often than not, we see that the most effective way is to have the right tools for the right job. No more, no less. With this in mind, we created MoonMail’s UI clean, simple and extremely easy to use.

### A Single Page Application

MoonMail’s front-end consists of a Single Page Application, built in React and Redux, which is hosted in an AWS S3 Bucket and served through CloudFront with Route53 as DNS. Cloudfront provides the fastest and most reliable way to gain access to our application. Content is replicated in different regions, which significantly reduces loading times and also allows us to handle as many requests as needed. It obtains temporary AWS credentials for each user with our IAM SAML auth provider. This allows them to access the S3 bucket directly, which we use for file uploads in the app.

The login is handled by Auth0, so the Sign Up / Sign Up process is virtually frictionless. You are just 2 clicks away from all the app awesomeness.

![Moonmail serverless architecture](https://camo.githubusercontent.com/af0f7857357ac2b5ef5512b1b34ca06f559c2f10/68747470733a2f2f63646e2e6d6963726f617070732e636f6d2f6173736574732f696d672f6d6d76322f6d6d76322d6172636869746563747572652e706e67)

*MoonMail Serverless Infrastructure*

## Back End Insights

### Event-Driven Architecture

When it comes to MoonMail’s back-end architecture, we can say that it’s fully event driven. It doesn’t use any traditional servers because it 100% relies on AWS Lambda, which handles the "no server part" for us. The Serverless Framework is the key to managing the lifecycle of the infrastructure. It covers us in the sense that we only have to worry about writing code and doing very little with operations. It’s worth mentioning that MoonMail is composed of more than 70 Lambda functions (and increasing) written in NodeJS with a microservices approach in mind.

### Functions & Microservices

MoonMail’s simplest processing units are its functions. Functions are composed to create microservices, which are composed to build functionalities. So how do we deal with their growing numbers? Vast knowledge of business logic, which translates into: good separation of concerns, well defined microservices and boundaries, and last but not least, a good and reliable tool to manage the whole process. That’s why Serverless Framework is in our stack.

### Serverless Decoupled Concept of Functions & Events

A Serverless decoupled concept of functions (the functional part) and events (what triggers the functions) is as good as it gets. We add REST Endpoints exposed by API Gateway or SNS/Kinesis integration with a simple configuration. This is very important to us since it’s easier to add or remove functions/services from our event driven "Choreographies." Every action, from an “Upload Recipient List” to a “Send Campaign” triggers a number of microservices interactions, and everything is done asynchronously to avoid maximum direct microservices communication with SNS, SQS, Kinesis integration and/or data replication in an eventually consistent way.

### DynamoDb

Since our data storage is DynamoDB, every record gets stored there. But we also store some “redundant” aggregated information in tables so reports can be created and presented to the user in near real time (with the help of Kinesis Streams and DynamoDB Streams). We even do some AI on the platform in the User Reputation System, which is handled in real time by our super complex “AI” program; we call it **_Miguel_**.

### The Serverless Framework

As a result of using serverless technologies along with the Serverless Framework, the engineering team has become confident in the developing-release cycle. This is because we truly understand our business model, as mentioned previously, but also due to the reliability and simplicity provided by Serverless in configuration management, stage management and ecosystem. This gives us 100% automation capabilities to build our Development Environments in the same way we built our Production one so it’s been much easier to implement our Deployment Pipeline and Continuous Delivery system. The result is less cash spent on resources compared to conventional architectures. We couldn’t ask for more. Totally in love.

## The Results

**What happened after developing this new infrastructure?**

SENDING BILLIONS OF EMAILS WITHOUT MAINTAINING SERVERS

Our users (high techy guys) can send 62,000 emails per month for - drumroll please - absolutely free. 0. Zilch. Nada. (If they come with their AWS/SES account under their shoulder).

Click here if you want to jump into the MoonMail jungle by using your own AWS/SES account: [https://moonmail.io/amazon-ses-email-marketing](https://moonmail.io/amazon-ses-email-marketing/?utm_source=Serverless-Blog&utm_medium=Serverless-Blog)

Need more? Many more? We have you covered. Our Professional Plan offers an unlimited number of sent emails per month.

For users in the "low tech" world, we offer a simple MoonMail account where we provision in real time SES endpoints for them. Our **_Miguel_** here is really strict. If he detects any "strange" behaviour, he locks the user for the eternity of his children.

Cick here if you want to check out this alternative MoonMail version: [https://moonmail.io/](https://moonmail.io/?utm_source=Serverless-Blog&utm_medium=Serverless-Blog)

Soon after releasing [MoonMail as an Open Source project](https://github.com/microapps/MoonMail) on GitHub, some developers approached us asking us to help them in installing/deploying MoonMail in their own AWS account. We monetize there, too. Sometimes companies feel more comfortable with storing some really sensitive data within their AWS accounts. That's possible, too.

# Contribute to MoonMail

MoonMail is the result of the combined efforts of many people. Thus, we would love for you to help us make MoonMail even better, greater, faster, and smarter!

Developer? Contribute here: [https://github.com/microapps/MoonMail](https://github.com/microapps/MoonMail)

User? Take it for a spin for FREE: [https://moonmail.io](https://moonmail.io)

Be sure to let us know what you think!
