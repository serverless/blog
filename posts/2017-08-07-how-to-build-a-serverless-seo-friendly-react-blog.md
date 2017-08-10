# How to Build a Serverless, SEO-friendly React blog 

Serverless application architectures are gaining in popularity and it's no mystery why. Developers are able to build and iterate on products faster when they have less infrastructure to maintain and don't need to worry about server maintenance, outages, and scaling bottlenecks, 

In this tutorial we are going to show you how to build a serverless, CMS-powered blog using React, ButterCMS, and built-in prerendering through Netlify. The finished code for this tutorial is available on Github.

[ButterCMS](https://buttercms.com) is a hosted API-based CMS and content API that lets you build CMS-powered apps using any programming language including [Ruby](https://buttercms.com/ruby-cms), [Rails](https://buttercms.com/rails-cms), [Node.js](https://buttercms.com/nodejs-cms), [.NET](https://buttercms.com/asp-net-cms), [Python](https://buttercms.com/python-cms), [Phoenix](https://buttercms.com/phoenix-cms), [Django](https://buttercms.com/django-cms), [Flask](https://buttercms.com/flask-cms), [React](https://buttercms.com/react-cms), [Angular](https://buttercms.com/angular-cms), [Go](https://buttercms.com/golang-cms), [PHP](https://buttercms.com/php-cms), [Laravel](https://buttercms.com/laravel-cms), [Elixir](https://buttercms.com/elixir-cms), and [Meteor](https://buttercms.com/meteor-cms). Butter lets you manage content using their dashboard and integrate it into your front-end of choice with our API – you can think of Butter as similar to WordPress except that you build your website in your language of choice and then plug-in the dynamic content using an API.

[Netlify](https://netlify.com) is a static website hosting service that handles integration with prerenering services like Prerender.io, SEO.js, and Brombone.

### Getting Started

We'll use the [Create React App](https://github.com/facebookincubator/create-react-app) starter kit.

Install Create React App:
```
npm install -g create-react-app
```

Then create the boilerplate for our app:

```
create-react-app react-serverless-blog
cd react-serverless-blog
npm start
```

### Adding Routing

Our blog needs two pages: one for listing all posts and another for displaying individual posts. Create `BlogHome.js` and `BlogPost.js` components in the `src` directory:

```
import React, { Component } from 'react';

class BlogHome extends Component {
  render() {
    return (
      <div>
        Home
      </div>
    );
  }
}

export default BlogHome;
```

```
import React, { Component } from 'react';

class BlogPost extends Component {
  render() {
    return (
      <div>
        Post
      </div>
    );
  }
}

export default BlogPost;
```

Create React App doesn't offer routing out-of-the-box so we'll add react-router:
```
npm install react-router@3.0.3 --save
```

In the source folder, create a new file called `routes.js`. We'll create routes for the blog home page with and without page parameters, as well as the individual post page:

```javascript
import React from 'react';
import { Router, IndexRoute, Route } from 'react-router';

import App from './App';
import BlogHome from './BlogHome';
import BlogPost from './BlogPost';

const Routes = (props) => (
  <Router {...props}>
    <Route path="/" component={App}>
      <IndexRoute component={BlogHome} />
      <Route path="/p/:page" component={BlogHome} />
      <Route path="/post/:slug" component={BlogPost} />
    </Route>
  </Router>
);

export default Routes;
```

Next, we'll update `index.js` so it uses our routes when initializing the application:

```javascript
import React from 'react';
import ReactDOM from 'react-dom';
import { browserHistory } from 'react-router';

import Routes from './routes';

ReactDOM.render(
 <Routes history={browserHistory} />,
 document.getElementById('root')
);
```

And finally, we'll update `App.js` so it nests child components specified in our routes:

```javascript
import React, { Component } from 'react';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h2>My blog</h2>
        </div>
        <div>
          {this.props.children}
        </div>
      </div>
    );
  }
}

export default App;
```

### Building the blog

We’ll use [ButterCMS](https://buttercms.com) to build our blog. ButterCMS provides [content APIs](https://buttercms.com/docs/api) for blog posts, categories, tags, and authors.

First we'll install the [ButterCMS Node.js API client](https://github.com/buttercms/buttercms-node):

```
npm install buttercms --save
```

We'll then update 'BlogHome' to fetch posts from ButterCMS and render them. Use the API token in the example below or get your own by [signing into ButterCMS with Github](https://buttercms.com).

```javascript
import React, { Component } from 'react';
import { Link } from 'react-router'
import Butter from 'buttercms'

const butter = Butter('de55d3f93789d4c5c26fb07445b680e8bca843bd');

class BlogHome extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  fetchPosts(page) {
    butter.post.list({page: page, page_size: 10}).then((resp) => {
      this.setState({
        loaded: true,
        resp: resp.data
      })
    });
  }

  componentWillMount() {
    let page = this.props.params.page || 1;

    this.fetchPosts(page)
  }

  componentWillReceiveProps(nextProps) {
    this.setState({loaded: false});

    let page = nextProps.params.page || 1;

    this.fetchPosts(page)
  }

  render() {
    if (this.state.loaded) {
      const { next_page, previous_page } = this.state.resp.meta;
 
      return (
        <div>
          {this.state.resp.data.map((post) => {
            return (
              <div key={post.slug}>
                <Link to={`/post/${post.slug}`}>{post.title}</Link>
              </div>
            )
          })}

          <br />

          <div>
            {previous_page && <Link to={`/p/${previous_page}`}>Prev</Link>}

            {next_page && <Link to={`/p/${next_page}`}>Next</Link>}
          </div>
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      )
    }
  }
}

export default BlogHome;
```

Next we'll update `BlogPost.js` to fetch and display posts based on the route:

```javascript
import React, { Component } from 'react';
import Butter from 'buttercms'

const butter = Butter('de55d3f93789d4c5c26fb07445b680e8bca843bd');

class BlogPost extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    let slug = this.props.params.slug;

    butter.post.retrieve(slug).then((resp) => {
      this.setState({
        loaded: true,
        post: resp.data.data
      })
    });
  }

  render() {
    if (this.state.loaded) {
      const post = this.state.post;

      return (
        <div>
          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{__html: post.body}} />
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}

export default BlogPost;
```

### Head Elements

Our blog is working but our post pages don't have properly set HTML titles or meta tags. To fix this, we'll use [React Helmet](https://github.com/nfl/react-helmet).

First, install the package:
```
npm install --save react-helmet
```

Import the `Helmet` module in our `BlogPost` and use it in our `render()` method to set HTML tags that should be in the `<head`>.

```javascript
  <Helmet>
    <title>{post.seo_title}</title>
    <meta name="description" content={post.meta_description} />
    <meta name="og:image" content={post.featured_image} />
  </Helmet>
```

Here's what the complete code for the component looks like. Inspect the DOM to verify that tags are getting set correctly.

```javascript
import React, { Component } from 'react';
import Butter from 'buttercms'
import { Helmet } from "react-helmet";

const butter = Butter('de55d3f93789d4c5c26fb07445b680e8bca843bd');

class BlogPost extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loaded: false
    };
  }

  componentWillMount() {
    let slug = this.props.params.slug;

    butter.post.retrieve(slug).then((resp) => {
      this.setState({
        loaded: true,
        post: resp.data.data
      })
    });
  }

  render() {
    if (this.state.loaded) {
      const post = this.state.post;

      return (
        <div>
          <Helmet>
            <title>{post.seo_title}</title>
            <meta name="description" content={post.meta_description} />
            <meta name="og:image" content={post.featured_image} />
          </Helmet>

          <h1>{post.title}</h1>
          <div dangerouslySetInnerHTML={{__html: post.body}} />
        </div>
      );
    } else {
      return (
        <div>
          Loading...
        </div>
      );
    }
  }
}

export default BlogPost;

```

### Prerendering

Our blog is setup, but crawlers from search engines and social networks do not execute Javascript so our blog has terrible SEO.

There are a number of ways to address this, including setting up server-side rendering and pre-rendering services like Prerender.io and SEO.js. But these options all require setting up a Node.js server, and in this tutorial we want our app to be serverless. The solution we'll use is hosting the app on [Netlify](https://netlify.com), which offers a built-in prerendering service for their paid plans.

To do this, first we'll create a production build of our app (you'll need [Yarn](https://yarnpkg.com/en/docs/install) installed first):

```
yarn install
yarn run build
```

Check your `build` directory to verify that the production build was created successfully. All you have to do to host the app is drag the `build` folder onto Netlify's dashboard. Prerendering can be enabled from the app settings. Check out our [live example](https://react-serverless-blog.netlify.com).

## Wrap Up

That's it! We've built a SEO-friendly serverless blog using React and two third-party services. With our serverless approach we can now get back to building software without having to ever worry about server maintenance, outages, or scaling bottlenecks.

I hope you enjoyed this tutorial. If you have any questions about setting up your ButterCMS-powered React app reach out to me at roger@buttercms.com and I'll definitely reply!
