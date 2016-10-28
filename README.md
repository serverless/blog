# [Serverless Blog](https://serverless.com/blog/)

Welcome to the serverless blog repo! [Contributions, typo fixes and pull requests are welcome](https://github.com/serverless/blog/new/master/post) :thumbsup:

- [Submitting content](#how-to-contribute-content)
- [Adding author details](#how-to-add-author-information)
- [Markdown resources](#markdown-resources)

## How to contribute content:

1. [Click here to add a post](https://github.com/serverless/blog/new/master/post) or submit a new pull request via the command line.

2. Write your content in markdown!

3. Name your post file name in this format `YYYY-MM-DD-blog-post-name.md` :point_right: `2016-01-27-post-title-here.md`

4. In your post, include the Required post information:

Include the post metadata at the top:
<pre>
---
title: My awesome post title
description: "This post is about awesome stuff!"
date: 2016-05-25
thumbnail: 'http://url-to-thumbnail.jpg'
layout: Post
authors:
  - FirstnameLastname # this references the FirstnameLastname.json file in ./authors folder
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

Once your post is ready to go, submit a PR to the repository and we will review and publish your post with our audience on [serverless.com](http://serverless.com/blog)!

## How to add Author Information

[Click here to add Author information](https://github.com/serverless/blog/new/master/authors)

The name of the file should be the same as the name field used in the blog post meta data.

Example `authors/DavidWells.json` and `DavidWells` in the `authors` field below are the same name and capitalization.

```yml
---
layout:  Post
title:  David's Amazing Post
authors:
 - DavidWells # references data in authors/DavidWells.json file
---
```

## Markdown Resources

Read more about how to write [Github flavored markdown](https://guides.github.com/features/mastering-markdown/) and see this handy guide for [how to write in markdown](https://blog.ghost.org/markdown/)

Need a markdown editor? Give [stackedit.io](https://stackedit.io/editor), [Byword](https://bywordapp.com/) or [typora](https://www.typora.io/) a spin.

Need to convert a google doc to markdown? [Install this chrome extension](https://chrome.google.com/webstore/detail/export-as-markdown/hbojhdcnbcondcdfpfocpkjkfkbnbdad)

Need to convert HTML to markdown? You can use [this handy html to markdown converter](https://domchristie.github.io/to-markdown/)

