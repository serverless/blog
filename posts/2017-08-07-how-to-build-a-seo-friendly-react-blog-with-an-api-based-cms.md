# How to build a SEO-friendly React blog with an API-based CMS

![](https://cdn-images-1.medium.com/max/1600/1*H8j-yzyKCMjqzn2dRNBAVQ.png)

Have you ever wanted to build a server-rendered, SEO-friendly website using
React and Node.js? The typical solutions for achieving this are either using a
pre-rendering service like Prerender.io, or implementing server-side rendering
of React components.

A relatively new alternative is [Next.js](https://github.com/zeit/next.js/), a
framework for building universal React webapps. Next.js provides out-of-the-box
tools for server-side rendering including setting HTML tags for SEO and fetching
data before rendering components. Read more about the philosophy behind Next.js
[here](https://zeit.co/blog/next).

In this tutorial we are going to show you how to build a CMS-powered blog using
[React](https://facebook.github.io/react/),
[Next.js](https://github.com/zeit/next.js/), and
[ButterCMS](https://buttercms.com/). The finished code for this tutorial is
[available on Github](https://github.com/buttercms/react-cms-blog-with-next-js).

[ButterCMS](https://buttercms.com/) is an [API-based CMS and content
API](https://buttercms.com/cms). You can think of Butter as similar to WordPress
except that you build your website in your language of choice and then plug-in
the dynamic content using an API. You can try
[ButterCMS](https://buttercms.com/nodejs-cms/) for yourself by [signing in with
Github](https://buttercms.com/github/oauth).

### Getting Started

Create a new directory for your app and add a package.json file:
```
{
  "name": "react-blog"
}
```

Install Next.js and React. As of the time of this writing, we’ll want to install
the Next.js so we can setup dynamic routes later:

```
npm install next@beta react react-dom --save
```

Then add a script to your package.json:

```
{
  "scripts": {
    "start": "next"
  }
}
```

Next.js treats every js file in the `./pages` directory as a page. Let's setup a basic
homepage by creating a `./pages/index.js` inside your project:

```
export default () => (
  <div>My blog homepage</div>
)
```


And then just run `npm run start` and go to `http://localhost:3000`.

Finally, create a `./pages/post.js` and make sure it loads at `http://localhost:3000/post`:

```
export default () => (
  <div>A blog post</div>
)
```

### Fetching blog posts

Next we’ll integrate [ButterCMS](https://buttercms.com/react-cms/) so we can
fetch and render blog posts dynamically.

First install the [ButterCMS Node.js API
client](https://github.com/buttercms/buttercms-node) and restart your server:

`npm install buttercms --save`

We’ll update `index.js` to be a React component that fetches and displays posts using the
ButterCMS SDK:

```
import React from 'react'
import Link from 'next/link'
import Butter from 'buttercms'

const butter = Butter('de55d3f93789d4c5c26fb07445b680e8bca843bd')

export default class extends React.Component {
  static async getInitialProps({ query }) {
    let page = query.page || 1;

    const resp = await butter.post.list({page: page, page_size: 10})    
    return resp.data;
  }
  render() {
    const { next_page, previous_page } = this.props.meta;

    return (
      <div>
        {this.props.data.map((post) => {
          return (
            <div>
              <a href={`/post/${post.slug}`}>{post.title}</a>
            </div>
          )
        })}

        <br />

        <div>
          {previous_page && <Link href={`/?page=${previous_page}`}><a>Prev</a></Link>}

          {next_page && <Link href={`/?page=${next_page}`}><a>Next</a></Link>}
        </div>
      </div>
    )
  }
}
```


With Next.js `getInitialProps` will execute on the server on initial page loads, and then on the
client when navigating to a different routes using the built-in `<Link>` component. `getInitialProps`
also receives a context object with various properties – we access the `query` property
for handling pagination. We are fetching posts from a ButterCMS test account –
sign in with Github to setup your own posts.

In our `render()` method we use some clever syntax to only display pagination links only
when they're applicable. Our post links will take us to a 404 – we'll get these
working next.

### Displaying posts

To get our post links working we need to setup dynamic routing for our blog
posts. Create a custom server `./server.js` that routes all `/post/:slug` URLs to our post component:

```
const { createServer } = require('http')
const { parse } = require('url')
const next = require('next')

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

app.prepare().then(() => {
  createServer((req, res) => {
    // Be sure to pass `true` as the second argument to `url.parse`.
    // This tells it to parse the query portion of the URL.
    const parsedUrl = parse(req.url, true)
    const { pathname, query } = parsedUrl

    if (pathname.includes('/post/')) {
      const splitPath = pathname.split("/");

      // Add post slug to query object
      query.slug = splitPath[2];

      app.render(req, res, '/post', query)
    } else {
      handle(req, res, parsedUrl)
    }
  })
  .listen(3000, (err) => {
    if (err) throw err
    console.log('> Ready on http://localhost:3000')
  })
})
```

We’ll also update our post component to fetch blog posts via slug and render the
title and body:

```
import React from 'react'
import Butter from 'buttercms'

const butter = Butter('de55d3f93789d4c5c26fb07445b680e8bca843bd')

export default class extends React.Component {
  static async getInitialProps({ query }) {
    const resp = await butter.post.retrieve(query.slug);  
    return resp.data;
  }
  render() {
    const post = this.props.data;

    return (
      <div>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{__html: post.body}} />
      </div>
    )
  }
}
```

Finally, update our `package.json` start script to use our customer server and restart:

```
"scripts": {
  "start": "node server.js"
}
```

### SEO

Next.js provides a `<Head>` component for setting HTML titles and meta tags. Add `import Head from 'next/head'` to the
top of `./pages/post.js` and use the component in the `render()` method:

```
render() {
  const post = this.props.data;

  return (
    <div>
      <Head>
        <title>{post.seo_title}</title>
        <meta name="description" content={post.meta_description} />
        <meta name="og:image" content={post.featured_image} />
      </Head>

      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{__html: post.body}} />
    </div>
  )
}
```

Restart the server and inspect the HTML source of a post to verify that tags are
getting set correctly.

### Wrap Up

Next.js is a powerful framework that makes it easy to build universal React
apps. With ButterCMS you can quickly build serverless CMS-powered blogs and websites with
React.

Be sure to check out [ButterCMS](https://buttercms.com/), a [hosted API-based
CMS and content API](https://buttercms.com/cms/) and blog engine that lets you
build CMS-powered apps using any programming language including
[Ruby](https://buttercms.com/ruby-cms),
[Rails](https://buttercms.com/rails-cms),
[Node.js](https://buttercms.com/nodejs-cms),
[.NET](https://buttercms.com/asp-net-cms),
[Python](https://buttercms.com/python-cms),
[Phoenix](https://buttercms.com/phoenix-cms),
[Django](https://buttercms.com/django-cms),
[React](https://buttercms.com/react-cms),
[Angular](https://buttercms.com/angular-cms),
[Go](https://buttercms.com/golang-cms), [PHP](https://buttercms.com/php-cms),
[Laravel](https://buttercms.com/laravel-cms),
[Elixir](https://buttercms.com/elixir-cms), and
[Meteor](https://buttercms.com/meteor-cms).

We hope you enjoyed this tutorial. If you have any questions about setting up
your ButterCMS-powered Next.js/React app reach out to me at
[roger@buttercms.com](mailto:roger@buttercms.com) or [on
Twitter](https://twitter.com/buttercms).

### Roger Jin

Engineer [@ButterCMS](http://twitter.com/ButterCMS)
([https://buttercms.com](https://buttercms.com/))
