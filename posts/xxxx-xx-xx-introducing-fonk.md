---
title: "Introducing FONK - A Serverless LAMP Stack for K8S"
description: "How do you compare the five FaaS on K8S runtimes with 3,000 or more GitHub stars?  Write the same webapp design pattern on all of them."
date: 2018-10-05
thumbnail: 'http://fonk-apps.io/FaaSonK8S-393x200.jpg'
category:
  - guides-and-tutorials
authors:
  - PeteJohnson
---
“Serverless is a solution looking for a problem,” is a statement I’ve heard more than once and perhaps you have too.  It’s the kind of statement that somebody makes defensively when a new technology comes along to disrupt what they know and work with day to day.  But it’s also the kind of statement that reveals how steep the learning curve can be for a new technology because if you understood whatever the new thing is you wouldn’t say something so broadly negative.

So, how can we shave some of the steepness off the Serverless learning curve?

That’s the question I asked myself last spring when I heard that opening quote for about the fourth time and I turned the question around a little bit by asking, “What’s the simplest thing you can build with Serverless that someone can relate to something they already know?”  The idea there is that you can show someone the value of Serverless by demonstrating to them how they can accomplish some task more simply compared to what they are using now.

The answer I came up with: a web application.  Specifically, Guestbook.

## Using Web Apps to Lower the Serverless Learning Curve
Just about everybody understands the LAMP stack.

![LAMP Logo](http://fonk-apps.io/LAMP.jpg)

It’s both simple and provides choice among its components, which are among the reasons it has been so popular over the last 20+ years.  We see its influence even in the Kubernetes (K8S) learning curve:

![Guestbook Traditional Architecture](http://fonk-apps.io/Guestbook-Traditional.jpg)

[The Guestbook](https://github.com/kubernetes/examples/tree/master/guestbook) is among the first applications that most people deploy when first learning K8S and although it uses a NoSQL server in place of MySQL, the same basic LAMP structure exists.  With that in mind, a way to lower the learning curve for Serverless would be to show people how to build similarly complex web applications with far less code and configuration.

Using AWS constructs, that web application would look like this:

![Guestbook AWS Architecture](http://fonk-apps.io/Guestbook-AWS.jpg)

And while that requires about half as much code and configuration, it also locks you into AWS.  What if you could create a design pattern similar to LAMP but that used Serverless concepts on top of K8S to insure portability?

![LAMP Serverless K8S](http://fonk-apps.io/LAMP-Serverless-K8S.jpg)

## Introducing FONK - A Serverless LAMP Stack for K8S
The components of that AWS architecture are a Functions-as-a-Service (FaaS) runtime, an object store, and a NoSQL server.  If you used one of the five FaaS runtimes on GitHub that has more than 3,000 stars and other popular open source components, the entire stack is installable on top of K8S as follows:

![Guestbook FONK Architecture](http://fonk-apps.io/Guestbook-FONK.jpg)

Put all that together and you get a tidy acronym for a Serverless design pattern:

![FONK Logo](http://fonk-apps.io/FONK-logo.jpg)

Where I owe the animal icon to my daughter who said, “FONK sounds like something a goose would say.”

## Implementing Guestbook on FONK
In September, some friends and I soft-launched [fonk-apps.io](http://fonk-apps.io/), an open source project whose goal is to lower the Serverless learning curve for people by providing simple web app examples in every possible language.  In an attempt to make the transition from native K8S easier for people, the first of these web app examples is the Guestbook and here’s our early progress:

![FONK Guestbook Progress](https://raw.githubusercontent.com/fonk-apps/fonk-examples/master/guestbook/FONK-Guestbook-Status.jpg)

While Guestbook, which has only Create and List functions, was a natural first choice the plan is to get more sophisticated with the applications with things like ToDos (full CRUDL operations), a blog (authenticated CUD, public RL), and a forum (authenticated CRUDL).  Longer term, it would be cool to build in some CI/CD with some test automation down the columns or performance benchmarking across the rows as well.

In the process of building out these first set of examples, we’ve learned a great deal about comparing and contrasting the FaaS runtimes with one another.  From a developer experience perspective, here are some early findings:

![FaaS on K8S Landscape](http://fonk-apps.io/FaaSonK8Slandscape.jpg)

The development experience on some of the FaaS on K8S runtimes is closer to native K8S development that expose some of the innards of the image upon which the function will run. Others are closer to the AWS Lambda model that obscures image details.  The 800-pound gorilla in this space is Knative from Google, which hasn’t yet reached the 3,000 GitHub star threshold that would warrant a Guestbook example, but we’re keeping our eye on its progress as it will likely get there at some point.

## Come Join In the Fun!
Once this idea got going, the thought was it would be much better with a community of people around it so we’ve tried to make the whole thing an inviting place.  While not all of the FaaS on K8S runtimes support the Serverless Framework, Kubeless and OpenWhisk do very nicely.  An easy way for you to get started would be for you walk through a completed example:

* [FONK Guestbook/OpenWhisk/Node.js](https://github.com/fonk-apps/fonk-examples/tree/master/guestbook/faas/openwhisk/nodejs)
*	[FONK Guestbook/Kubeless/Node.js](https://github.com/fonk-apps/fonk-examples/tree/master/guestbook/faas/kubeless/nodejs)

We’d be appreciative of a GitHub star from you, but we’d love a PR of a new FaaS runtime/language combination even more 8).  Come check us out at:

https://github.com/fonk-apps/fonk-examples

and try some of the examples yourself or feel free to call dibs on a FaaS/language combination as we build out all the Guestbook examples possible.
