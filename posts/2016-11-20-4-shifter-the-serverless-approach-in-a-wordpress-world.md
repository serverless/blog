---
title: Shifter. The Serverless approach in a WordPress world.
description: "Just another Serverless solution to rearrange the game of hosting WordPress. Shifter makes WordPress blogs and websites into static files on Amazon S3 and delivers them through CFn."
date: 2016-11-20
thumbnail: 'https://s3.amazonaws.com/shifter-serverless-blog/shifter-square.png'
layout: Post
authors:
  - Shifter
---

<img align="right" width="250" height="250" src="https://s3.amazonaws.com/shifter-serverless-blog/shifter-square.png">

A conceptual hosting service that I am working on, currently in beta, is about to be released. At its core is the Serverless Framework, a project that one of our team members, Takahiro Horike, contributes to. This service is called Shifter.

Shifter is a SaaS hosting product, which turns any type of WordPress website or blog into a static site. With Shifter, users can import existing projects or stand up new ones. With the click of a button, a site can be converted into static files, moved to S3, and delivered through CloudFront CDN. All of this happens seamlessly, and with minimal effort from the user. 

## Beloved software on the modern architecture

WordPress is now serving about 25% of the web and it has become quite powerful. People use it in many different ways. WordPress usage ranges from blogs written by beginners to big media websites to web applications. It is loved because it’s simple and powerful.

We are a team consisting of WordPress professionals, who contribute to the project actively, and AWS experts. We are listed as and AWS Advanced Technology Partner. In our history of creating hosting for large-scale, high traffic websites, we started to realize that WordPress could take advantage of Serverless architecture, and that we could do this by bringing the concept of micro services into the context of WordPress.

## A solution to be free from security risk, maintenance work, and 500 errors

Our focus is to help customers ease the worry of maintaining their websites.

We think that the time of our users is best spent working on the content of their website, not the hassle of maintenance and updates. Their business is what is most important, so we want to help them get back to that. Worrying about security, servers crashing from high traffic, and maintaining the backend infrastructure is not, and should not, be their business.

Web developers and agencies want to focus on consultation, designing, and creating websites. They don’t want their time to be consumed security and bug fixes. But when the popularity of a website grows, or the number of the websites they manage increases, maintaining WordPress websites becomes a burden. 

In some cases, the amount of time spent on the maintaining the backend can exceed the work put into new content. This is the biggest problem WordPress users face when their websites grow.

With Shifter, these issues are mitigated by converting a dynamic WordPress site into static files. 

What if you want to make changes to your site? WordPress is there when you need it, on demand, running from a Docker container that only you can see. After you’ve made your changes, Shifter goes to work generating those updates, delivering them across a global CDN, and the docker container and WordPress backend will vanish again. 

Any Shifter user can now enjoy the comfort and benefits of serverless architecture. As developers, we can utilize the best part of the cloud and build things in a serverless way. The service itself is built with the microservices concept. In this post, I want to show you the architecture of the service backend and share some lessons I’ve learned.


## I can concentrate on coding my code than ever before

The most compelling point of the Serverless Architecture is that, as a developer who is not familiar with server construction or running it continuously. I do not need deal servers or maintaining them. Shifter is built on services such as S3, Lambda, DynamoDB, and the API Gateway. They are highly available and durable. I can concentrate on what I’m good at, and start enjoying my beer on weekends.

## Here’re some parts of our code

![The overall outlook of Shifter Service](https://s3.amazonaws.com/shifter-serverless-blog/sitegenerator.png "The overall outlook of Shifter Service")

This is the service overall. With this view, my part is building a user console. Here’s the architecture of the console.

![How the console architecture look like](https://s3.amazonaws.com/shifter-serverless-blog/dashboard.png "How the console architecture look like")

I chose to set up this console architecture with the Serverless Framework. It is a Single Page Application, and here’re some points I want to emphasize.

- HTML, CSS, Javascript files are hosted on S3.
- User registration data are stored with Cognito Userpool.
- Dynamic process is handled by API Gateway, Lambda, and DynamoDB.

The biggest merit you get from this architecture is that you don’t need to maintain servers, nor keep the personal information credentials. We can concentrate on our work, which is just the code.

Here’s a part of the code which works on Lambda.

```
exports.handler = (event, context, cb) => {
  const projects = new Projects(event);

  switch (event.method) {
    case 'POST':
      Promise.resolve()
      .then(() => projects.postCheckInput())
      .then(() => projects.checkMaxUse())
      .then(() => projects.post())
      .then((data) => cb(null, data))
      .catch((error) => errorHandle(error, cb));
      break;
    case 'GET':
      Promise.resolve()
      .then(() => projects.get())
      .then((data) => cb(null, data))
      .catch((error) => errorHandle(error, cb));     
      break;
    case 'DELETE':
      Promise.resolve()
      .then(() => projects.checkOwnSite())
      .then(() => projects.delete())
      .then((data) => cb(null, data))
      .catch((error) => errorHandle(error, cb));
      break;
    case 'PUT':
      Promise.resolve()
      .then(() => projects.checkOwnSite())
      .then(() => projects.updateProjectName())
      .then((data) => cb(null, data))
      .catch((error) => errorHandle(error, cb));
      break;
  }
};
```

Lambda functions are allocated to APIs one by one. The process is divided according to what HTTP method the API will be taken through. There are multiple APIs that the Serverless Framework let us deploy at once. It is crucial, and it feels excellent that we can deploy multiple APIs with one tool.

## Lessons learned and my next goal

### Integration testing

What I’ve gained from the development process is that it is vital to have automated tests in the Serverless Framework, not only unit tests but also automated integration tests. For the microservices approach to work well, everything needs to talk to each other. What we currently are trying is to automate integration tests among the different multiple microservices.

### Powering dynamic features with static files

What the project aims next is to give the service the ability to do the same things as WordPress blogs, websites, and apps in traditional settings. Bringing new features such as SFTP, WP-Cron, and the ability to re-generate a single page. Currently, there still are a few things that Shifter can’t do, compared to the traditional WordPress websites. We know that we are going to face problems, and solving them can be harder than solving them in traditional setups, such as LAMP. But, we will work hard to make improvements every day. We are ready to share our learnings in many ways in the future. Happy to be joining this Serverless Framework community!

## What are your thought on the project and the architecture?

## Let us know in the comments down below.
