# [Serverless Blog](https://serverless.com/blog/)

<a href="https://www.youtube.com/watch?v=ps1oQeg-0ss"><img align="right" width="550" height="285" src="https://cloud.githubusercontent.com/assets/532272/23035035/bb26026c-f432-11e6-9338-a603b8cb32b4.png"></a>

Welcome to the serverless blog repo! [Contributions, typo fixes and pull requests are welcome](https://github.com/serverless/blog/new/master/post) :thumbsup:

- [Submitting content](#how-to-contribute-content)
- [Adding author details](#how-to-add-author-information)
- [Markdown resources](#markdown-resources)

## How to contribute content:

[Video Guide on how to contribute](https://www.youtube.com/watch?v=ps1oQeg-0ss)

1. [Click here to add a post](https://github.com/serverless/blog/new/master/post) or submit a new pull request via the command line.

2. Write your content in markdown!

3. Name your post file name in this format `YYYY-MM-DD-blog-post-name.md` :point_right: `2016-01-27-post-title-here.md` [handy tool for this](https://blog.tersmitten.nl/slugify/)

4. In your post, include the **required post information:**

Include the post metadata at the top:
<pre>
---
title: My awesome post title
description: "This post is about awesome stuff!"
date: 2016-05-25
thumbnail: 'http://url-to-thumbnail.jpg'
layout: Post
authors:
  - FirstnameLastname
---
</pre>

Then write your post :arrow_down: [Github flavored markdown](https://guides.github.com/features/mastering-markdown/) is supported!
<pre>
# Post Heading

This is an awesome paragraph!

## Post SubSection

[Link example](http://my-full-url-with-http-at-the-front.com)

* List item 1
* List item 2
* List item 3

```js
// code snippet example with javascript (js) syntax highlighting
console.log('JS code')
```
</pre>

Questions about formatting? [See a complete post example](https://raw.githubusercontent.com/serverless/blog/master/posts/2016-10-25-building-a-serverless-garden.md)

## Aligning images

### `left` alignment

<img align="left" width="100" height="100" src="http://www.fillmurray.com/100/100">

This is the code you need to align images to the left:
```
<img align="left" width="100" height="100" src="http://www.fillmurray.com/100/100">
```

---

### `right` alignment

<img align="right" width="100" height="100" src="http://www.fillmurray.com/100/100">

This is the code you need to align images to the right:
```
<img align="right" width="100" height="100" src="http://www.fillmurray.com/100/100">
```

---

### `center` alignment example

<p align="center">
  <img width="460" height="300" src="http://www.fillmurray.com/460/300">
</p>

```
<p align="center">
  <img width="460" height="300" src="http://www.fillmurray.com/460/300">
</p>
```

---

Once your post is ready to go, [add your author info](#how-to-add-author-information), submit a PR to the repository.

We will review and publish your post with our audience on [serverless.com](http://serverless.com/blog) and share it all around the web!

Ping us with any questions on [Twitter](http://twitter.com/goserverless) or [post an issue](https://github.com/serverless/blog/issues/new) and we will get back with you shortly.

Curious about what your post will look like on the live site? You can preview your post by [cloning down the site repo](https://github.com/serverless/site#quick-start), installing the dependencies and running `npm start`.

## How to add Author Information

[Click here to add Author information](https://github.com/serverless/blog/new/master/authors)

The name of the file should be the same as the name field used in the blog post meta data. Format: `FirstnameLastname` (note the caps and no space!)

Example `authors/DavidWells.json` and `DavidWells` in the `authors` field below are the same name and capitalization.

```yml
---
layout: Post
title: David's Amazing Post
authors:
 - DavidWells # references data in authors/DavidWells.json file
---
```

## Including Custom Scripts

**Note:** For security purposes, all scripts referenced are vetted and hosted via our s3 bucket.

If you need to include a custom script for demo purposes, you will need to send the script over to us for review.

```yml
# blog post frontmatter
layout: Post
title: David's Amazing Post
scripts:
  - https://link-to-custom-js-in-s3-bucket.js
  - http://link-to-custom-js-two-in-s3-bucket.js
inlineJS: |
  console.log('hi')
  console.log('this is a multiline inline JS that will run in the post')
```

## Markdown Resources

Our blog posts are written in markdown and support standard [Github flavored markdown](https://guides.github.com/features/mastering-markdown/). If you are new to markdown, don't fret, check out this handy [how to guide on writing in markdown](https://blog.ghost.org/markdown/)

Need a markdown editor? Give [stackedit.io](https://stackedit.io/editor), [Byword](https://bywordapp.com/) or [typora](https://www.typora.io/) a spin.

Need to convert a Google doc to markdown? [Install this chrome extension](https://chrome.google.com/webstore/detail/export-as-markdown/hbojhdcnbcondcdfpfocpkjkfkbnbdad)

Need to convert HTML to markdown? You can use [this handy html to markdown converter](https://domchristie.github.io/to-markdown/)

Need to convert Word to markdown? You can use [this handy Word to Markdown Converter](https://word-to-markdown.herokuapp.com/)

## Recommended Writing Apps

[hemingwayapp](http://www.hemingwayapp.com/desktop.html) - Hemingway helps you write with power and clarity by highlighting adverbs, passive voice, and dull, complicated words.
