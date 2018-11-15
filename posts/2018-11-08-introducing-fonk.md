---
title: "Introducing FONK: a serverless LAMP stack for K8S"
description: "How do you compare the top five FaaS on K8S runtimes? Write the same web app design pattern on all of them. Read more on FONK, a Serverless LAMP stack for K8S."
date: 2018-11-09
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-lamp-stack-fonk-k8s.jpg'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/lamp-stack-k8s-serverless.jpg'
category:
  - guides-and-tutorials
authors:
  - PeteJohnson
---

There's a statement about serverless I've heard too many times: "Serverless is a solution looking for a problem."

It's the kind of statement somebody makes defensively, when a new technology comes along to disrupt the workflow they're used to. It’s also the kind of statement that should reveal to all of us in the serverless community how steep the learning curve can be.

If people understood serverless, they wouldn’t say something so broadly negative. So I pose the question: How can we tame the Serverless learning curve?

The answer I came up with? A web application. 

Let me explain.

#### Guestbook: a serverless web app example

Last spring, I heard that opening quote for the fourth time. So I asked myself, “What’s the simplest thing you can build with Serverless that someone can relate to a thing they already know?”

I thought I could show the value of Serverless by demonstrating to someone how they can do something they're doing now, just more simply.

So I built an example web app, and called it Guestbook.

#### Using web apps to lower the serverless learning curve

Just about everybody understands the LAMP stack.

![LAMP Logo](http://fonk-apps.io/LAMP.jpg)

It’s simple and provides choice among its components, which explains why it's been so popular over the last 20+ years. We see its influence even in the Kubernetes (K8S) learning curve:

![Guestbook Traditional Architecture](http://fonk-apps.io/Guestbook-Traditional.jpg)

[The Guestbook](https://github.com/kubernetes/examples/tree/master/guestbook) is among the first applications that most people deploy when first learning Kubernetes, and although it uses a NoSQL server in place of MySQL, the same basic LAMP structure exists.

##### What does this mean for serverless?

With that in mind, one way to lower the serverless learning curve is to show people how to build similarly complex web applications with far less code and configuration.

Using AWS constructs, that web application would look like this:

![Guestbook AWS Architecture](http://fonk-apps.io/Guestbook-AWS.jpg)

And while that requires about half as much code and configuration, it also locks you into AWS.

What if you could create a design pattern similar to LAMP but that used Serverless concepts on top of K8S to insure portability?

![LAMP Serverless K8S](http://fonk-apps.io/LAMP-Serverless-K8S.jpg)

#### Introducing FONK: a serverless LAMP stack for K8S

The components of that AWS architecture are a Functions-as-a-Service (FaaS) runtime, an object store, and a NoSQL server. 

If you used one of the five FaaS runtimes on any GitHub project that has more than 3,000 stars or other popular open source components, the entire stack is installable on top of K8S as follows:

![Guestbook FONK Architecture](http://fonk-apps.io/Guestbook-FONK.jpg)

Put all that together, and you get a tidy acronym for a serverless design pattern:

![FONK Logo](http://fonk-apps.io/FONK-logo.jpg)

(I owe the animal icon to my daughter who said, “FONK sounds like something a goose would say.”)

#### Implementing Guestbook on FONK

In September, some friends and I soft-launched [fonk-apps.io](http://fonk-apps.io/), an open source project with the goal of lowering the Serverless learning curve for people. It does this by providing simple web app examples in every possible language.

In an attempt to make the transition from native K8S easier for people, the first of these web app examples is the Guestbook. Here’s our early progress:

![FONK Guestbook Progress](https://raw.githubusercontent.com/fonk-apps/fonk-examples/master/guestbook/FONK-Guestbook-Status.jpg)

While Guestbook, which has only Create and List functions, was a natural first choice, the plan was to get more sophisticated with the applications. We wanted to add things like ToDos (full CRUDL operations), a blog (authenticated CUD, public RL), and a forum (authenticated CRUDL).

Longer term, it would be cool to build in some CI/CD with some test automation down the columns or performance benchmarking across the rows as well.

#### FaaS runtimes compared

In the process of building out this first set of examples, we’ve learned a great deal about comparing and contrasting the FaaS runtimes with one another.

From a developer experience perspective, here are some early findings:

![FaaS on K8S Landscape](http://fonk-apps.io/FaaSonK8Slandscape.jpg)

The development experience on some of the FaaS on K8S runtimes is closer to native K8S development; it exposes some of the innards of the image upon which the function will run. Others are closer to the AWS Lambda model that obscures image details.  
The 800-pound gorilla in this space is Knative from Google, which hasn’t yet reached the 3,000 GitHub star threshold that would warrant a Guestbook example. But we’re keeping our eye on its progress, as it will likely get there.

## Come join the fun!

Once this idea got going, we thought it would be much better with a community of people around it. So, we’ve tried to make the whole thing an inviting place.

While not all of the FaaS on K8S runtimes support the Serverless Framework, Kubeless and OpenWhisk do very nicely. An easy way for you to get started would be for you walk through a completed example:

* [FONK Guestbook/OpenWhisk/Node.js](https://github.com/fonk-apps/fonk-examples/tree/master/guestbook/faas/openwhisk/nodejs)
*	[FONK Guestbook/Kubeless/Node.js](https://github.com/fonk-apps/fonk-examples/tree/master/guestbook/faas/kubeless/nodejs)

We’d be appreciative of a GitHub star from you, but we’d love a PR of a new FaaS runtime/language combination even more. 😉  

Come check us out at [the FONK project on GitHub](https://github.com/fonk-apps/fonk-examples), and try some of the examples yourself. Or feel free to call dibs on a FaaS/language combination as we build out all the Guestbook examples possible!
