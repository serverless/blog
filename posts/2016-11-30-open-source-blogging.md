---
title: Open Source Blogging
description: stuff
date: 2016-11-30
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/blogging-thumb.jpg
layout: Post
authors:
  - DavidWells
---

# Open Source Blogging

<img align="right" width="250" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/blogging.jpg">

Blogging has been around for ages and is a proven source of sustainable organic traffic into your companies site.

Content marketing has been growing in popularity for years, and for good reason, **it works**.

Most companies look to WordPress, squarespace, or medium for their company blogs. While these sites work for hosting blog content, they come with a number of downsides namely:

- Barriers to contribute
- Speed / security issues (cough cough WordPress)
- Traffic cannibalization (medium)
- Limited ability to customize & reuse product UI elements
- Poor author experience for developer focused posts

This post is going to talk about a different approach that, in my opinion, is better than traditional blog setups.

# The 100% Open Source, Markdown & React powered blogging setup

Serverless.com's blog 100% open source content driven by a github repo and markdown files.

The content is fed into our site's build process and is rendered with our static site generator of choice [Phenomic](http://phenomic.io)

# What benefits does this bring?

## Easier to contribute and edit posts

Well for starters, anyone with a github account can submit blog post updates, typo fixes, and new content without needed a user account with our site.

<p align="center">
  <img src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/edit-this-post.jpg">
</p>

On every post, including this one, you will have a one click 'edit this post' link that lets anyone submit updates to posts.

<p align="center">
  <img width="100%" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/edit-github-view.jpg">
</p>

## Better Developer Focused posts

If you have ever had to write code focused blog posts in Wordpress, it's a rather painful experience.

On the flip side, writing in github flavored markdown makes writing and (more importantly) maintaining blog posts about code MUCH easier.

Side note: If you are stuck with Wordpress, I wrote a plugin to allow you to write in [github favored markdown](http://davidwells.io/easy-markdown/)

## Unified product experience

We are using React for our [dashboard](http://github.com/serverless/dashboard) and other apps we are creating. This means if we when with WordPress, we would need to maintain 2 seperate style/component libraries because wordpress can't render react components serverside.

Keep styles in sync in multiple platforms is painful and evenvetabliy leads to inconsistant user experience issues.

Our site and blog are powered by phenomic so we can use all of the same react components we use in our products.

Code reuse and consistant brand experience FTW

## Scale out of the box

Using a static site site gives us raw scale out of the box unlike dynamic blogging platforms like Wordpress.

If we get featured on the front page of the NYtimes, we are sitting pretty because our site is statically served from the netlify content delivery network.

## Speed like woah

Because we are using [Phenomic](https://github.com/MoOx/phenomic) which uses react + react router under the hood, page fetching and transitions are lightning fast.

Instead of hard page reloads when navigating around the serverless.com site, you get a single page app like experience when navigating through site links, including the blog of course.

Phenomic is pretty awesome in the way that it only fetches the required data from a `.json` file, instead of a full HTML page like other static site generators.

Another benefits with phenomic is **optimistic page rendering**

This is an example of what the loading state of a blog post looks like while the posts lightweight `json` data is being fetched

![loading-state](https://cloud.githubusercontent.com/assets/532272/19630866/9793f07a-9947-11e6-919a-ba2d81ebcf68.gif)

