---
title: "How to build a static Serverless site with Netlify"
description: "How Serverless.com manages their static, serverless website with Netlify and the Serverless Framework."
date: 2017-12-18
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/netlify/netlify-squarelogo.png'
category:
  - guides-and-tutorials
authors:
  - DavidWells
---

The Serverless.com site is (quite obviously, we hope) a serverless site.

The benefits to a serverless website should be pretty well-known in this crowd: cheap to run, scalable out of the box, hands-off administration. But our site isn’t just serverless—it’s a statically hosted serverless site.

Why make it static? WELL, let us count the ways:
- It’s ultra fast (everything served from a CDN)
- Provides a state-of-the-art UX
- Works offline (a la PWA standards)
- More secure
- Easier to reason about, maintain, & share code across teams

And people notice:
<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">The <a href="https://twitter.com/goserverless?ref_src=twsrc%5Etfw">@goserverless</a> docs are the slickest, smoothest-running SPA I&#39;ve ever used on the web, I think ever. <a href="https://t.co/UrOc34Oj9T">https://t.co/UrOc34Oj9T</a></p>&mdash; Jerome Leclanche (@Adys) <a href="https://twitter.com/Adys/status/938785908286947329?ref_src=twsrc%5Etfw">December 7, 2017</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

In sum, from one engineering team to another, we effing *love* this website. We want to tell you all about how we built it so that you, too, can have a website you effing love.

On we go.

# How do we statically host our site?
We (shocker) use the [Serverless Framework](https://serverless.com/framework/) for the serverless bit. But what about the static hosting?

There are two ways (as of this posting) to statically host a site:
1. Build a lot of custom stuff yourself
2. Use Netlify

We chose the latter. [Netlify](https://www.netlify.com/) has been getting tons of press and adoption, and it’s pretty clear why when you realize how powerful it is.

We use it for automating CI/CD & https setup, static site redirects (via `_redirects` file), proxied url handling, deployment notifications, and lots of other stuff we won’t go into right now because all great lists must come to an end somewhere.

## Deploying a new site with Netlify
For starters, you’ll need a static site generator. To help you choose one, here is a great list of [open-source static site generators](https://www.staticgen.com/).

We use [Phenomic](https://phenomic.io/). It isn’t at the top of that list, but it’s written in React and we really like it.

Once you’ve done that, here’s how easy it is to deploy a new site with Netlify.

First off, connect it to your GitHub repo:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/netlify/netlify-gitprovider.png">

In the Netlify console, click “Create a new site”:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/netlify/netlify-newsite.png">

Then “OAuth with Git”:

<img width="500" align="middle" src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/netlify/netlify-oauth.png">

Search for the repository you want to deploy:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/netlify/netlify-choosesite.png">

Build it with `npm run build`:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/netlify/netlify-sitedashboard.png">

AND! (jazz hands) Your site is deployed!

## Merging pull requests: builds and previews
As you submit new pull requests and update your site, Netlify can automatically trigger new builds on your behalf.

On the [Serverless.com](https://serverless.com) site, when we create a new branch, Netlify pings us with a GitHub comment on that branch to generate a build preview URL for us:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/netlify/deploy+preview+comment.png">

We use these build previews a lot to share in-progress designs and content across teams.

Once it’s good to go, we merge to master and Netlify triggers a new build.

## Setting up deployment notifications
We have a dedicated Slack channel for Netlify build notifications.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/netlify/netlify+slack+channel.png">

This way, we can quickly see when builds succeed or fail, and also access all our latest deploy previews in one spot:

# Now—build your own static serverless site!
Are you a true believer now? Do you want to build your own statically hosted serverless site?

Boy, do we have the resources for you!

We wrote a previous blog post about [why and how we built a fast, secure, scalable static site with React](https://serverless.com/blog/how-to-create-a-fast-secure-and-scalable-open-source-blog-with-react-markdown/), so you can check that out for more background.

We’ve also open-sourced everything for the Serverless.com site:
- Here’s our [frontend code](https://github.com/serverless/site/tree/master/src)
- Here’s our [backend code](https://github.com/serverless/site/tree/master/backend) (complete with a host of slick serverless functions you can peruse)

Maybe we’re biased, but we think static serverless sites are the best. Give em a try, and happy building!
