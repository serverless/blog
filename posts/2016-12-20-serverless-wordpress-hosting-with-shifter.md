---
title: How Shifter Introduced Serverless Hosting to WordPress Using AWS, DynamoDB & the Serverless Framework
description: Learn how Shifter transforms WordPress blogs and websites into static sites to make them faster, more secure and scalable in this guest post. 
date: 2016-12-20
thumbnail: 'https://s3.amazonaws.com/shifter-serverless-blog/shifter-square.png'
layout: Post
authors:
  - Shifter
---

<img align="right" width="250" height="250" src="https://s3.amazonaws.com/shifter-serverless-blog/shifter-square.png">

[Shifter](https://getshifter.io) is a SaaS hosting product that turns any type of WordPress website or blog into a static site. In one click your site can be converted into static HTML files, moved to S3 and delivered through CloudFront. In this post the Shifter team will share more about our motivation for building this project along with a sneak peek at the backend. 

## Introducing Microservices to WordPress

WordPress currently serves about 25% of all sites on the web. People use it in many different ways - ranging from beginner blogs to big media websites to web applications. In our experience, WordPress is favored by many because it’s simple and powerful.

The Shifter team consists of WordPress pros who contribute to the project actively. As AWS Advanced Technology Partners, we're also AWS experts. Through repeatedly creating hosting solutions for large-scale, high traffic websites, we realized an opportunity to introduce the concept of microservices into the context of WordPress.

## Solving the Scalability Issue

Maintaining WordPress sites demands significantly more time and attention as the website gains popularity (and more traffic) or the number of websites you manage increases. In some cases, the amount of time spent maintaining the backend can exceed the work put into new content. This can cause major problems for WordPress users as their websites grow. 

Shifter addresses these issues by converting a dynamic WordPress site into static files. 

What if you want to make changes to your site? WordPress is there when you need it, on demand, running from a Docker container that only you can see. After you’ve made your changes Shifter goes to work generating those updates, delivering them across a global CDN, and the Docker container and WordPress backend will vanish again. Shifter brings the simplicity and benefits of serverless architecture to WordPress. 

Now, we'll share some of the architecture of the Shifter backend and a few lessons learned.

## A Glimpse of the Shifter Backend

Shifter is built according to the microservices concept. The backend relies on highly available and durable services like S3, Lambda, DynamoDB and API Gateway.

![The overall outlook of Shifter Service](https://s3.amazonaws.com/shifter-serverless-blog/sitegenerator.png "The overall outlook of Shifter Service")

**Here’s the architecture of the user console:**

![How the console architecture look like](https://s3.amazonaws.com/shifter-serverless-blog/dashboard.png "How the console architecture look like")

We chose to set up the console architecture with the Serverless Framework. It's a Single-Page Application. Here are some highlights:

- HTML, CSS, Javascript files are hosted on S3
- User registration data is stored with Cognito User Pool
- Dynamic process is handled by API Gateway, Lambda & DynamoDB

The biggest advantage of using this architecture is that you don’t need to maintain servers or manage user credentials, so you can concentrate on the code.

Here’s a snippet of the code what runs on Lambda:

```js
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

Lambda functions are allocated to APIs one by one. The process is divided according to what HTTP method the API will be taken through. There are multiple APIs, which the Serverless Framework allows us to deploy at once. It's crucial (and awesome!) that we can deploy multiple APIs with one tool.

## Lessons Learned & Next Milestones

### Integration Testing

Through this development process we've learned that it's vital to have automated tests in the Serverless Framework - not only unit tests, but also automated integration tests. For the microservices approach to work well, everything needs to talk to each other. We're currently trying to automate integration tests among the multiple different microservices.

### Powering Dynamic Features with Static Files

Our next goal is to give Shifter the same capabilities as WordPress blogs, websites, and apps in traditional settings. Bringing new features such as SFTP, WP-Cron, and the ability to re-generate a single page are up next. We expect to face some obstacles here, and potentially solving them will be more difficult than solving them in traditional setups, such as LAMP. But we're up for the challenge and eager to share our learnings as we go. We'd love your feedback along the way. [Try Shifter for free](https://getshifter.io/blog/shifter-launching-campaign/) through the end of January and let us know what you think.

## Taking It to the Next Level with the Shifter Kickstarter

The Shifter team recently launched a [Kickstarter](https://www.kickstarter.com/projects/225627578/shifter-serverless-hosting-for-wordpress/updates) to help us reach our next development milestones. Check it out if you're interested in supporting our mission!
