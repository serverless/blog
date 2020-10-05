---
title: "Introducing: the Serverless Open Runtime"
description: "AWS has just announced “Bring Your Own Runtime” to AWS Lambda. We’re launching the Serverless Open Runtime to take it to the next level."
date: 2018-11-30
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/reinvent-updates-header1.gif'
category:
  - news
authors: 
  - JaredShort
---

It’s time to get excited: AWS has just announced “Bring Your Own Runtime” (BYOR) for AWS Lambda.

While running your own languages has some pretty obvious benefits, we at [Serverless, Inc](https://serverless.com/) want to take things to the next level. We see this as an opportunity to unlock more flexibility, organization and customization within your serverless runtimes and use cases—not just for AWS, but for *any* event-driven compute platform.

That is why we are releasing the Serverless Open Runtime!

[Check it out now on GitHub](https://github.com/serverless/open-runtime-poc), or keep reading for all the details.

#### The Serverless Open Runtime

The Serverless Open Runtime makes it simple to build and share common solutions to complex problems. Better yet, it makes it possible to solve these problems before they even get to your business logic.

This could mean capabilities like:

* more graceful timeouts
* the ability to transform AWS (or other provider-specific) events to [CloudEvent spec](https://cloudevents.io) or HTTP requests
* more detailed tracing and debugging
* middleware implementations in any language, compatible with your service regardless of the language you chose to use
* prepackaging of common libraries
* better local development experience and emulation
* security implementations
* or perhaps even running a sidecar for service discovery, managed by the runtime

What a list. And I’m sure there are many interesting and powerful use cases yet to be thought of.

#### How it works

This is all possible with the concept of middlewares and pluggable architecture to the Serverless Open Runtime.

With a pipelined approach to the event request/response lifecycle, it’s straightforward to build and integrate new capabilities. And if middleware is written as simple binaries, in many cases the middleware could be language-independent to increase reusability.

Here’s an example of a constructed runtime that leverages some request and response middleware examples (explanation below):

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/reinvent/serverless-open-runtime1.png" alt="Serverless open runtime" style='width:461px; margin:0 auto'>

The Open Runtime gets started when Lambda first receives a lambda execution request. It then actually fetches a request from the AWS Runtime API. This request is then processed by middlewares, by invoking them as executables and passing the event in via STDIN and reading the processed event back via STDOUT. It is then passed to the language specific runtime which invokes your handler code. The response is then processed by middlewares similarly to how they were invoked for the event.

These are just examples, and the capabilities of middleware extend well beyond them.

The important thing to note, is that the only thing you would have to worry about is **Your Business Logic**. The Serverless Open Runtime and it’s middlewares get out of you, the developer’s, way; you continue to focus on producing value for the business.

#### Why Serverless Open Runtime?

We see this initiative as joining the layerability and flexibility of containers, with the serverless promises of on-demand, event-driven compute. In sum: this is containers as they should be.

Of course, your environment and requirements are going to have many similarities with others. The Serverless Open Runtime will enable you to customize your serverless experience within your organization, while still remaining standardized.

#### Contribute to Serverless Open Runtime

The opportunity to do something great is here, and we are excited about what will be built on the Open Runtime concepts!

You can [check out the github repository](https://github.com/serverless/open-runtime-poc) to learn more, and peep the initial drafts of source code. As always, the Serverless community is relentlessly innovative, and we are always open to your thoughts as we push forward on this new initiative.

##### More re:Invent news

* [All the Serverless announcements at re:Invent 2018](https://serverless.com/blog/reinvent-2018-serverless-announcements/)
* [How to publish and use Lambda Layers with the Serverless Framework](https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework)
* [What Firecracker open-source means for the serverless community](https://serverless.com/blog/firecracker-what-means-serverless/)
* [Join the Serverless virtual hackathon at re:Invent; participate from anywhere, win prizes!](https://serverless.com/blog/no-server-november-reinvent-hackathon/)(ends Sunday at 11:00 PM PT)
