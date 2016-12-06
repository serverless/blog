---
title: Building A Better Open Source Blog
description: stuff
date: 2016-11-30
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/blogging-thumb.jpg
layout: Post
authors:
  - DavidWells
---

<img align="right" width="250" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/blogging.jpg">
Content marketing has been growing in popularity for years, and for good reason, **it works**.

Creating blog content is a [proven source of sustainable organic traffic](https://research.hubspot.com/reports/compounding-blog-posts-what-they-are-and-why-they-matter) and a great way to drive qualified leads.

Most companies look to WordPress, SquareSpace, or Medium for their company blogs. While these sites work for hosting blog content, they come with a number of downsides, especially if your target audience is developers.

Problems with typically company blogs:

- Barriers to contribute
- Speed / security issues (cough cough WordPress)
- Traffic cannibalization (Medium)
- Limited ability to customize & reuse product UI
- Poor authoring experience for developer focused content

This post is going to talk about a different approach that, in my opinion, is better than traditional blog setup.

Lets explore the **100% Open Source, Markdown & React powered blog** that you are reading.

## The Serverless Blog

Serverless.com's blog 100% open source content driven by a [github repo](https://github.com/serverless/blog) and markdown files.

Blog content is fed into our site and is rendered with our static website generator of choice [Phenomic](http://phenomic.io).

"Sounds like over-engineering to me" you might be saying to yourself... But Nay!

Lets explore the benefits of our site and blog setup.

### 1. Easier to contribute and edit posts

Well for starters, anyone with a github account can submit blog post updates, typo fixes, and new content without needed a user account with our site.

<p align="center">
  <img src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/edit-this-post.jpg">
</p>

On every post, including this one, you will have a one click 'edit this post' link that lets anyone submit updates to posts.

<p align="center">
  <img src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/edit-github-view.jpg">
</p>

This is great for getting streamlined contributions to our blog.

P.S. we are always looking for fresh content. Drop us a line if you're interested in contributing.

### 2. Better Developer Focused posts

If you have ever had to write code focused blog posts in Wordpress, it's a rather painful experience. wysiwyg editors are extremly proficient at mangling code snippets.

On the flip side, writing in github flavored markdown makes writing and (more importantly) maintaining blog posts about code MUCH easier.

Side note: If you are stuck with Wordpress, I wrote a plugin to allow you to write in [github favored markdown](http://davidwells.io/easy-markdown/)

### 3. Unified product experience

We are using React for our [dashboard](http://github.com/serverless/dashboard) and other apps we are creating. This means if we when with WordPress, we would need to maintain 2 seperate style/component libraries because wordpress can't render react components serverside.

Keep styles in sync in multiple platforms is painful and evenvetabliy leads to inconsistant user experience issues.

Our site and blog are powered by phenomic so we can use all of the same react components we use in our products.

Code reuse and consistant brand experience FTW

### 4. Scale out of the box

Using a static site site gives us raw scale out of the box unlike dynamic blogging platforms like Wordpress.

If we get featured on the front page of the NYtimes, we are sitting pretty because our site is statically served from the netlify content delivery network.

### 5. Speed like Whoa 🔥

Because we are using [Phenomic](https://github.com/MoOx/phenomic) which uses react + react router under the hood, page fetching and transitions are lightning fast.

Instead of hard page reloads when navigating around the serverless.com site, you get a single page app like experience when navigating through site links, including the blog of course.

Phenomic is pretty awesome in the way that it only fetches the required data from a `.json` file, instead of a full HTML page like other static site generators.

Another benefits with phenomic is **optimistic page rendering**

This is an example of what the loading state of a blog post looks like while the posts lightweight `json` data is being fetched

![loading-state](https://cloud.githubusercontent.com/assets/532272/19630866/9793f07a-9947-11e6-919a-ba2d81ebcf68.gif)


##
