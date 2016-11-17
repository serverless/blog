# MoonMail Serverless Framework powered Architecture

One day we found ourselves in a peculiar situation: We were really good at email marketing, but our software sucked. We were spending way too much time trying to "use" the tools we had, and it was truly horrible. At the same time, we were proud to say that we used *Amazon Online* super tech tools to create amazing platform for others.

Then it hit us. Wait. What are we doing? That is how the idea of [MoonMail](https://goo.gl/t4Etqm) was born.

We wanted to present something different to the eCommerce community: a platform with superior performance and infinite scalability. The only problem was that it was not possible with our previous architecture, as it was relying too much on EC2 and Ruby on Rails. So, we embarked on a never-ending journey in perfecting the art and science of sending emails.

In the meantime, we were playing with something new, called Lambda, with small and, at that moment, rather obscure Shopify apps. We also went into digital payments solutions, which we aptly named [MONEI](https://goo.gl/xBm6Bn). The team was extremely fast in changing, deploying and updating the code. It was literally 1 click away. No servers, and there were only incurred costs when an action was triggered, meaning that if the user didn’t hit the function, there wouldn’t be a cost. We read some serverless books, got involved with the OSS project to see if the project had solid roots, and, after 2 weeks, our company went fully Serverless.

We have looked into different serverless approaches, but in the end decided to use the Serverless Framework because it relies on AWS, the infrastructure we’re already familiar with. With Serverless Framework on our minds, we took a bold step toward a new approach based on totally decoupled microservices, and they only cost us when they are used. If they get any traction, they are almost infinitely scaleable. How is that for creating and testing a minimally viable product?

## What does this New Infrastructure Look Like?

### Top Secret Front End

In the immortal words of wisdom: Simplify. Sometimes developers like to cram as many features as possible into an app. However, more often than not, we see that the most effective way is to have the right tools for the right job. No more, no less. With this in mind, we created MoonMail’s UI clean, simple and extremely easy to use.

MoonMail’s front-end consists of a Single Page Application, built in React and Redux, which is hosted in an AWS S3 Bucket and served through CloudFront with Route53 as DNS. Cloudfront provides the fastest and most reliable way to gain access to our application. Content is replicated in different regions, which significantly reduces loading times and also allows us to handle as many requests as needed. It obtains temporary AWS credentials for each user with our IAM SAML auth provider. This allows them to access the S3 bucket directly, which we use for file uploads in the app.

The login is handled by Auth0, so the Sign Up / Sign Up process is virtually frictionless. You are just 2 clicks away from all the app awesomeness.

![Moonmail serverless architecture](https://camo.githubusercontent.com/af0f7857357ac2b5ef5512b1b34ca06f559c2f10/68747470733a2f2f63646e2e6d6963726f617070732e636f6d2f6173736574732f696d672f6d6d76322f6d6d76322d6172636869746563747572652e706e67)

*MoonMail Serverless Infrastructure*

### The Obscure Mystery of "The Back End"

When it comes to MoonMail’s back-end architecture, we can say that it’s fully event driven. It doesn’t use any traditional servers because it relies on AWS Lambda, which handles the server part for us. Serverless framework is the key to managing the lifecycle of the infrastructure. It covers us in the sense that we only have to worry about writing code and do very little with operations. It’s worth mentioning that MoonMail is composed of more than 70 Lambda functions (and increasing) written in NodeJS with a microservices approach in mind.

Moonmail’s simplest processing units are its functions. Functions are composed to create microservices, which are composed to build functionalities. So how do we deal with their growing numbers? Vast knowledge of business logic, which translates into: good separation of concerns, well defined microservices and boundaries, and, last but not least, a good and reliable tool to manage the whole process. That’s why Serverless framework is in our stack.

A Serverless decoupled concept of functions (the functional part) and events (what triggers the functions) is as good as it gets. We add Rest Endpoints exposed by API Gateway or SNS/Kinesis integration with a simple configuration. This is very important to us since it’s easier to add or remove functions/services from our event driven "Choreographies." Every action, from an “Upload Recipient List” to a “Send Campaign,” triggers a number of microservices interactions, and everything is done asynchronously to avoid maximum direct microservices communication with SNS, SQS, Kinesis integration and/or data replication in an eventually consistent way. Since our data storage is DynamoDB, every record gets stored there. But we also store some “redundant” aggregated information in tables so reports can be created and presented to the user in near realtime (with the help of Kinesis Streams and DynamoDB Streams). We even do some AI on the platform in the User Reputation System, which is handled in real time by our little “AI” program; we call it **_Miguel_**.

As result of using serverless technologies along with the Serverless Framework, the engineering team has become confident enough in the developing-release cycle. This is mainly because we truly understand our business model, as mentioned previously, but also due to the reliability and simplicity provided by Serverless in configuration management, stage management and ecosystem. This gives us 100% automation capabilities to build our Development Environments in the same way we built our Production one, it’s been much easier to implement our Deployment Pipeline and Continuous Delivery system, and hey! Along all of that, you get Infrastructure as a Code that we actually love, in all spending much less money than conventional architectures; you couldn’t ask for more.


**What magic did we experience after developing this complex infrastructure?**

SENDING BILLIONS OF EMAILS WITHOUT MAINTAINING SERVERS

Our users can send 62,000 emails per month for - drumroll - absolutely free. 0. Zilch. Nada.

They need more? Many more? We have them covered. Our Professional Plan offers an unlimited number of sent emails per month.

Soonafter releasing [MoonMail Open Source projects](https://github.com/microapps/MoonMail) on GitHub, we got a call from developers asking us to help them in installing MoonMail in their own AWS account.

MoonMail is the result of the combined efforts of many people. Thus, we would love to see how you can contribute to make MoonMail even better, greater, faster, and smarter.

Developer? Contribute here: [https://github.com/microapps/MoonMail](https://github.com/microapps/MoonMail)

User? Take it for a spin for free: [https://moonmail.io](https://goo.gl/xBm6Bn)

How are you going to use MoonMail to help your infrastructure reach new heights?

