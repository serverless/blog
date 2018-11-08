---
title: How to Create a Fast, Secure, and Scalable Open Source Blog with React + Markdown
description: How serverless used phenomic.io to create a fast, secure, and scalable open source blog powered by React & Markdown
date: 2016-12-07
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/blogging-thumb.jpg
category:
  - guides-and-tutorials
authors:
  - DavidWells
---

<img align="right" width="250" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/blogging.jpg">
Content marketing has been growing in popularity for years, and for good reason, **it works**.

Creating blog content is a [proven source of sustainable organic traffic](https://research.hubspot.com/reports/compounding-blog-posts-what-they-are-and-why-they-matter), and a great way to drive qualified leads.

Most companies look to WordPress, SquareSpace, or Medium for their company blogs. While these sites work for hosting blog content, they come with a number of downsides, especially if your target audience is developers.

**Problems with the typical company blog setup:**

- Barriers to contribute
- Speed & security issues (cough cough WordPress)
- Traffic cannibalization (Medium)
- Limited ability to customize & reuse product UI
- Poor authoring experience for developer-focused content

This post talks about a different approach that, in my opinion, is better than the traditional blog setup.

Let's explore the **100% Open Source, Markdown & React-powered blog** that you're reading.

## The Serverless Blog

Serverless.com's blog is 100% open source content driven by a [GitHub repo](https://github.com/serverless/blog) and Markdown files.

Blog content is fed into our site and rendered with our static website generator of choice [Phenomic](http://phenomic.io).

Let's explore the benefits of our blog setup and how they address the problems outlined above.

### 1. Easier to contribute and edit posts

Well for starters, anyone with a GitHub account can submit blog post updates, typo fixes, and new content without needing a user account with our site.

<p align="center">
  <img src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/edit-this-post.jpg">
</p>

On every post, including this one, users have a one-click 'Edit this post' link that lets anyone submit updates to posts.

<p align="center">
  <img src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/edit-github-view.jpg">
</p>

This is great for getting streamlined contributions to our blog.

P.S. We're always looking for fresh content. [Drop us a line if you're interested in contributing](https://serverless.com/blog/contribute/).

### 2. Better developer-focused posts

If you've ever had to write a code heavy developer-focused blog post in WordPress, it's a **rather painful** experience. WYSIWYG editors are extremely proficient at mangling code snippets.

On the flip side, writing in GitHub flavored Markdown makes writing and (more importantly) maintaining blog posts about code MUCH easier.

**Markdown** FTW! 🎉

Side note: If you're stuck with WordPress, I wrote a plugin to allow you to write in [GitHub favored Markdown](http://davidwells.io/easy-markdown/).

### 3. Unified product experience

We're using React as our frontend framework of choice for creating our serverless applications (like [dashboard](http://github.com/serverless/dashboard)). This is a no-go with other blogging setups.

If we decided to blog with WordPress, we'd need to maintain 2 separate style/component libraries because WordPress can't render React components server-side. Keeping styles in sync in multiple platforms is painful and will eventually leads to an inconsistent user experience.

Luckily, our site and blog are powered by [Phenomic](http://phenomic.io), so we can use all of the same React components we use in our products.

**Code reuse and brand consistency FTW**! 🎉

### 4. Scale out of the box

Using a static site gives us raw scale out of the box unlike dynamic blogging platforms like WordPress.

**How our static site is built:**

1. `npm run build` uses React's server-side rendering capabilities to build all the static HTML files for the site
2. That's it. The site is pre-rendered for all visitors 🔥

If we get featured on the front page of the *New York Times* or Justin Bieber tweets about Serverless, we're sitting pretty because our site is statically served from the [Netlify](https://www.netlify.com/) content delivery network.

### 5. Speed like Whoa 🔥

Because we're using [Phenomic](https://github.com/MoOx/phenomic), which uses React + React Router under the hood, page fetching and transitions are lightning fast.

Instead of hard page reloads when navigating around the serverless.com site, you get a single page app experience when navigating through site links.

Each link clicked only fetches the required data from a `.json` file, instead of a full HTML page like other static site generators.

Another out-of-the-box benefit with phenomic is **optimistic page rendering**.

This is an example of how the loading state of a blog post looks while the post's lightweight `json` data is being fetched.

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/532272/19630866/9793f07a-9947-11e6-919a-ba2d81ebcf68.gif"/>
</p>

As you can see, when navigating to any given page, the visitor gets instant feedback, so the perceived site performance feels snappy.

## React + Phenomic + Static Websites are the future

Ultra scalable, fast, dynamic static websites are the future of frontend sites and I highly recommend checking out our site repo for how it's all hooked up!

You can run our site locally by:

1. `git clone git@github.com:serverless/site.git`
2. `npm install`
3. `npm start`

If I haven't convinced you yet. Tweet at me [@DavidWells](http://twitter.com/davidwells) and I will yell at you.

I'm planning a series of posts illustrating how the site is built.

For now, [checkout the github repo](https://github.com/serverless/site).
