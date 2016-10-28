# Serverless Blog

Welcome to the serverless blog repo!

Contributions and pull requests are welcome.

# [Click here to add a post](https://github.com/serverless/blog/new/master/post)

## How to publish content:

1. Write your content in markdown!

2. Name your post file name in this format `YYYY-MM-DD-blog-post-name.md`

3. **Required post information**

At the top of your blog post:
<pre><code class="yaml">
---
title: My awesome post
description: "This post is about awesome stuff!"
date: 2016-05-25
thumbnail: 'http://url-to-thumbnail.jpg'
layout: Post
authors:
  - FirstnameLastname # references the FirstnameLastname.json file in ./authors folder
---
</code></pre>


Then write your post:
<pre><code class="markdown">
# Post Heading

Post Content

## Post SubSection

[Link example](http://my-full-url-with-http-at-the-front.com)

* List item 1
* List item 2
* List item 3

```js
console.log('JS code')
```

</code></pre>

Note: Use fully qualified URL as links. No relative links.


3. Submit a PR to the repository.


## Other handy markdown links/resources

See [how to write in markdown](https://blog.ghost.org/markdown/) for how to write markdown. You can also use [https://stackedit.io/editor](https://stackedit.io/editor)

* [Convert HTML to markdown](https://domchristie.github.io/to-markdown/)

## Popular Markdown Editors
* [Byword](https://bywordapp.com/)
* [typora](https://www.typora.io/)

- Add to scripts https://www.npmjs.com/package/s3-uploader

## Publishing to medium

You can [import posts into medium](https://medium.com/p/import)

## How to add Author Information

[Click here to add Author information](https://github.com/serverless/blog/new/master/authors)

The name of the file should be the same as the name field used in the blog post meta data.

Example `authors/JohnMcKim.json` and `JohnMcKim` in the `authors` field below are the same name and capitalization.

---
layout:  Post
title:  Building A Serverless Garden Monitoring System with Lambda
authors:
 - JohnMcKim
---
