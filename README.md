# [Serverless Blog](https://serverless.com/blog/)

Welcome to the serverless blog repo! [Contributions and pull requests are welcome.](https://github.com/serverless/blog/new/master/post)

## How to contribute content:

1. [Click here to add a post](https://github.com/serverless/blog/new/master/post) or submit a new pull request via the command line.

2. Write your content in markdown!

3. Name your post file name in this format `YYYY-MM-DD-blog-post-name.md`

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

Then write your post. [Github flavored markdown](https://guides.github.com/features/mastering-markdown/) is supported!
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


4. Submit a PR to the repository and we will review and publish your post!


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

## New to markdown? Read this:

See [how to write in markdown](https://blog.ghost.org/markdown/) for how to write markdown. You can also use [https://stackedit.io/editor](https://stackedit.io/editor)

* [Convert HTML to markdown](https://domchristie.github.io/to-markdown/)

## Popular Markdown Editors
* [Byword](https://bywordapp.com/)
* [typora](https://www.typora.io/)

