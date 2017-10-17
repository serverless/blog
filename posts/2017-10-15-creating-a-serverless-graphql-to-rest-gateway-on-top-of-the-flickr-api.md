---
title: Creating a Serverless GraphQL to REST Gateway on top of the Flickr API
description: A collection of insights gained from building a microservice to interface with the Flickr API using Serverless, GraphQL and Hapi.js.
date: 2017-10-15
layout: Post
thumbnail: <needs article thumbnail>
authors:
  - DrakeCosta
---
# Introduction

I've spent a huge chunk of the last year learning how to write GraphQL servers. It took a lot of manual sifting through dozens of blog posts, videos and source code.

I wanted to consolidate all this info into a single walk-through. People—this post is *thorough*. If I've done my job, it's the only post you'll need to get up and running with your own project.

We're going step-by-step through the setup of my most recent project, [Flickr-Wormhole](https://github.com/Saeris/Flickr-Wormhole): a GraphQL to REST API Gateway built on top of Serverless and AWS Lambda, using [Apollo-Server-Hapi](https://github.com/apollographql/apollo-server#hapi) (to provide a modern interface to that aging Flickr API).

Let's do this.

# Background

As a web developer, I relish the challenge of building my personal website from scratch. It's a great opportunity to spend way too much time on creative solutions to weird problems.

My most recent challenge? Adding a gallery to showcase my photography. I decided to piggyback off Flickr for this. It already had most of what I needed: free, support for various sizes, public API and Adobe Lightroom integration for single-button-press uploads.

That just left me with one "little" problem: having to use Flickr's horribly outdated REST API.

So you fully feel my pain, here's a quick look at what that process was like.

# The Old Way - aka can we please not

Remember, I wanted to minimize my number of requests.

Here's the *bare* minimum with Flickr's REST:
1. Get the `userId` of the Flickr User whose 'photosets' I wanted to grab Photos from
2. Use `flickr.photosets.getList` with our `userId` to get a list of `photosetId`s for that user
3. Use `flickr.photosets.getPhotos` using those two ids to get a list of `photoId`s for that Album
4. Use `flickr.photos.getSizes` for each of those `photoId`s for a list of URLs linking to automatically generated images for those photos (or use the `id`, `secret` and `server` fields from the previous response to construct the URLs manually)

I, however, would need to make even more: a call to `flickr.photosets.getInfo` to get info about the album (title, description, number of views, comments...), a call *per photo* to `flickr.photos.getInfo` to get its title, caption, views, comments & tags, and another call per photo to `flickr.photos.getExif` to get the EXIF metadata, a call to `flickr.photos.getSizes` to build out a response `img` element for each photo in the gallery...

For a 100 photo album, I'd need 303 network requests. Can I get a collective 'nope'?

And it got worse. The response data was a mess to handle. `photos` count was represented as a `string`, `views` was a `number`, the `title` and `description` were nested in an unnecessary object under a `_content` key, and the dates were in a UNIX timestamp format wrapped in a `string`.

I could do so much better.

# The New Way - GraphQL

Why GraphQL? So glad you asked. Let's go back to those 300+ requests from earlier. I can now grab all of that data in **one** request using a query that looks a bit like this:

```graphql
query User {
  user(id: "146688070@N05") {
    albums(filter: { slug: "fanime-2017" }) {
      title
      description
      views
      photos(first: 5, orderBy: { field: taken sort: desc}) {
        title
        caption
        views
        tags {
          text
        }
        images(filter: { size: [Small, Medium, Large] }) {
          source
          width
          height
        }
        exif {
          camera
          exposure
          aperture
          iso
          whiteBalance
          meteringMode
        }
      }
    }
  }
}
```
Try it out yourself here: https://flickr.saeris.io/graphiql

Not only did I grab all the data I needed to build out the UI in one request, I also got only the specific fields I asked for in exactly the same shape I requested it in. AND I was able to apply some powerful filtering techniques to boot.

Suck it, REST!

Since the Flickr API didn't have a GraphQL endpoint, I had to create an API Gateway on top of it in order to make GraphQL queries to their API.

## GraphQL Setup

I needed to choose a GraphQL server. I ended up going with [Apollo](http://dev.apollodata.com/) because it had [automatic request caching](https://dev-blog.apollodata.com/the-concepts-of-graphql-bc68bd819be3).

Apollo does have a [solution specifically for AWS Lambda](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-lambda). But we'll be using Hapi.js instead for its custom logging, monitoring and caching.

To build the application, we'll need:

- An endpoint request handler. I'll be using the [Hapi Node.js server framework](https://hapijs.com/) with [Apollo-Server-Hapi plugin](https://github.com/apollographql/apollo-server#hapi).
- A GraphQL Schema of queries mapped to Type definitions that describe our different data structures. I'm using the [graphql.js reference implementation](https://github.com/graphql/graphql-js) to build these out in JavaScript.
- A REST request handler abstraction and method handler functions to programmatically build requests.
- Resolver functions. I'll need to transform the results from the method handlers into the required Type system shape.

### Building the Endpoint Request Handler

**note:** the setup outlined below was derived from [this article](http://www.carbonatethis.com/hosting-a-serverless-hapi-js-api-with-aws-lambda/).

#### Building the GraphQL Server

Let's take a look at our `serverless/yml` file, our app `index.js`, `server.js`, and our `webpack.config.js`:

**serverless.yml**
```yml
service: flickr-wormhole

frameworkVersion: ">=1.21.0 <2.0.0"

provider:
  name: aws
  runtime: nodejs6.10
  stage: dev
  region: us-west-2

plugins:
  - serverless-webpack
  - serverless-offline

custom:
  serverless-offline:
    port: 1337
  webpackIncludeModules: true

functions:
  api:
    handler: src/index.handler
    events:
      - http:
          path: "{proxy+}"
          method: any
          cors: true
```

Pretty basic setup here, except for the handler path being set to `"{proxy+}"`, which will pass our route to our request handler.

In this case, we'll have two routes: `/graphql` and `/graphiql`:

**index.js**
```javascript
import server from "./server"

exports.handler = (event, context, callback) => {
  const { path, queryStringParameters: params, httpMethod: method, body: payload, headers } = event
  server.makeReady(err => {
    if (err) throw err

    let url = path
    if (params) {
      const qs = Object.keys(params).map(key => `${key}=${params[key]}`)
      if (qs.length > 0) url = `${url}?${qs.join(`&`)}`
    }

    server.inject({ method, url, payload, headers, validate: false }, ({ statusCode, headers, result: body }) => {
      delete headers[`content-encoding`]
      delete headers[`transfer-encoding`]
      callback(null, { statusCode, headers, body })
    })
  })
}
```
**server.js**
```javascript
import hapi from "hapi"
import api from "./api"
import graphiql from "./graphiql"

const server = new hapi.Server()
server.connection({ routes: { cors: true } })

const plugins = [
  api,
  graphiql
]

let loaded = false
server.makeReady = (onServerReady) => {
  if (!loaded) {
    server.register(plugins, onServerReady)
    loaded = true
  }
  onServerReady(null)
}

export default server
```

In `server.js` we're defining a custom method, `makeReady`, on our new Hapi server instance to register our plugins. Normally, you'd want to call `server.start()` in the callback for `server.register()`, but instead we're using `server.inject()` to inject the HTTP request event from Lambda, because we're not using Hapi to listen to HTTP events.

If we called `server.register()` on every invocation of our Serverless event handler, Hapi would throw an error complaining that we've already registered the given plugins. Our function only executes on invocation, but on first invocation the newly-created `server` instance is kept frozen until 'thawed' by a new request, or else it is destroyed after a long enough period with no requests.

#### Creating the GraphQL Endpoint

Now let's take a look at our main GraphQL specific files used to create our endpoint: `api.js`, `graphiql.js`, and `schema.js`:

`api.js`
```javascript
import { graphqlHapi } from "apollo-server-hapi"
import depthLimit from 'graphql-depth-limit'
import queryComplexity from "graphql-query-complexity"
import * as loaders from "@/loaders"
import { formatError } from "@/utilities"
import { schema } from "./schema"
import { Flickr } from "./flickr"

export default {
  register: graphqlHapi,
  options: {
    path: `/graphql`,
    graphqlOptions: (request) => {
       // Create a new instance of our Flickr connector for each new GraphQL request
      const flickr = new Flickr(FLICKR_API_KEY)
      return {
        schema: schema,
        context: {
           // pass the connector instance to our resolvers and to the loaders which will cache per request
          flickr,
          album: loaders.loadAlbum(flickr),
          albumPhotos: loaders.loadAlbumPhotos(flickr),
          brands: loaders.loadBrands(),
          cameras: loaders.loadCamerasByBrand(),
          photo: loaders.loadPhoto(flickr),
          images: loaders.loadImages(flickr),
          licenses: loaders.loadLicenses(),
          user: loaders.loadUser(flickr),
          userAlbums: loaders.loadUserAlbums(flickr),
          userPhotos: loaders.loadUserPhotos(flickr)
        },
        root_value: schema,
        formatError: formatError,
        validationRules: [
          depthLimit(4), // Limits our queries to 4 levels of nesting.
          queryComplexity({
            maximumComplexity: 2000,
            variables: {},
            onComplete: (complexity) => { info(`Determined query complexity: ${complexity}`) },
            createError: (max, actual) =>
              new GqlError(`Query is too complex: ${actual}. Maximum allowed complexity: ${max}`)
          })
        ],
        tracing: true,
        debug: true
      }
    },
    route: { cors: true }
  }
}
```
Okay, so there are a few things going on here:

1. The object we're exporting is a Hapi plugin configuration, which we'll pass along as part of an array to our `server.register()` method on startup.
2. Our path, `/graphql`, will be prefixed by our deployment stage on AWS, i.e., `/dev/graphql`. This can result in some complications with some plugins, so be aware that passing `/` here will cause issues with the graphiql IDE.
3. In our context object, we're providing variables that will be available to all of our resolver functions, such as our Flickr connector and our Dataloader instances for caching.
4. Because we're running on Lambda, it's important to perform some [Query Complexity Analysis](https://www.howtographql.com/advanced/4-security/) to ensure incoming queries won't max out our execution times. To accomplish this we're going to use two libraries: [`graphql-depth-limit`](https://github.com/stems/graphql-depth-limit) and [`graphql-query-complexity`](https://github.com/ivome/graphql-query-complexity).
5. You'll notice that we have tracing enabled, which will append performance data to our responses. Check out [Apollo Tracing](https://github.com/apollographql/apollo-tracing) and [Apollo Engine](https://dev-blog.apollodata.com/apollo-engine-and-graphql-error-tracking-e7dd3ce8b99d) for more information on how you can use this to enable performance monitoring on your GraphQL endpoint.

`graphiql.js`
```javascript
import { graphiqlHapi } from "apollo-server-hapi"

export default {
  register: graphiqlHapi,
  options: {
    path: `/graphiql`,
    graphiqlOptions: {
      endpointURL: `/graphql`
    }
  }
}
```

Not a whole lot out of the ordinary here for configuring our graphiql IDE endpoint. Just a few things to note concerning AWS Lambda:

- If you're not using a custom domain for your function, you'll need to change your `endpointURL` to add the stage prefix on deployment, otherwise graphiql won't be able to find your API when running on AWS. This can be confusing because it will run just fine locally. Had me scratching my head over this one for a little while!
- If you do want to use a custom domain, I used [this Serverless article](https://serverless.com/blog/serverless-api-gateway-domain/?rd=true) and [this part of the AWS documentation](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html) to help get mine configured.

`schema.js`
```javascript
import Types from './types'

export const schema = new GqlSchema({
  types:  Object.values(Types).filter(type => !!type.Definition).map(type => type.Definition ),
  query: new GqlObject({
    name: `Query`,
    description: `The root query for implementing GraphQL queries.`,
    fields: () => Object.assign({}, ...Object.values(Types).filter(type => !!type.Queries).map(type => type.Queries))
  })
})
```
Also pretty straightforward. In each of our Type Definition files, we're going to have a default export, which will include our Type Definition and Queries associated with it (we'll see what those look like soon). We'll wrap all of those up in an `index.js` file as a default export, which we'll iterate over to generate pieces of our Schema.

If you want to include Mutations in the same manner, simply copy the `query` key and follow its format to import a Mutations object from each of your Type Definitions. I like to do things this way to keep code tidy and co-located.

#### Webpack

Here is [the webpack configuration](https://github.com/Saeris/Flickr-Wormhole/blob/develop/webpack.config.js) we're using. There are three important things to note:

1. I specifically include the webpack config for this project highlight webpack's [provide plugin](https://webpack.js.org/plugins/provide-plugin/). It allows you to call exports from node modules without having to explicitly import them in the files in which you use them.
2. We're using `babel-plugin-transform-optional-chaining`, which adds support for the TC39 syntax proposal: [Optional Chaining](https://github.com/tc39/proposal-optional-chaining), aka the Existential Operator. You'll see this in the code base in the following format: `obj?.property` which is equivalent to `!!object.property ? object.property : undefined`. Using this syntax requires using [babel 7](https://babeljs.io/blog/2017/03/01/upgrade-to-babel-7), so keep that in mind before attempting to use the plugin in your own projects.
3. We're using a resolve alias, specifying `@` as the project root directory. This lets us do project root relative imports, such as `import { invariant } from "@/utilities"`. I really like the way this webpack helps with code organization and managing relative imports across refactors.

Now we've built our GraphQL server and endpoint. It's time to fetch data from the Flickr API.

### Fetching Data from the Flickr API

When I started this project, the first thing I actually put together was the Flickr connector. I probably refactored it about a dozen times before I got things organized in a way that I liked.

It's now designed such that you can use it completely independently from GraphQL as a standalone library to interact with the Flickr API. It's also broken up into multiple parts, such that you can import only what you need to keep the bundle size down.

Here is the [Flickr connector source code](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/flickr.js). The connector is fairly simple: on instantiation it creates a new Dataloader instance to cache the results of each REST call.

This is basically a hash-map of the request parameters and the result of the fetch request. The `fetch` method is where the actual request is dispatched if a cached result isn't already found.

`fetchResource`, on the other hand, is the method we'll invoke in our method handlers. It has two required arguments, `method` and an `args` object, which represent the Flickr REST API method string and a hash of the required arguments for that method respectively.

The default export will be a singleton instance of the connector, which the method handlers will use as a fallback if another instance isn't provided when they are invoked. In both cases, we'll grab the API Key from our environment variables, which are provided to use via webpack.

`getPhotos.js`
```javascript
import Flickr from "@/flickr"

export default function getPhotos(
  { flickr = Flickr, photosetId = ``, userId = `` } = {},
  { privacyFilter = 0, media = `all`, extras = ``, page = 1, perPage = 500 } = {}
) {
  return flickr.fetchResource(
    `flickr.photosets.getPhotos`,
    { photosetId, userId },
    { privacyFilter, media, extras, page, perPage }
  )
}
```
Method handlers are also quite simple. Each is an async function with up to two hash maps for required and optional arguments.

You'll notice that defaults are set for many of the values, matching the defaults in the Flickr API documentation. This also serves as a type reference, which will later be updated to use Flow typings. I did things this way to minimize the occurrence of typos and referral to the API documentation that would arise from having to invoke `fetchResource` manually.

That it for the Flickr API library! Back to the GraphQL side of things.

### GraphQL Type Definitions

Let's take a look at a Type Definition, a Resolver, and some utilities for both.

`album.js`
```javascript
import {
  fetchAlbumPhotos,
  fetchAlbumComments,
  fetchAlbumByID,
  applyFilters,
  createFilter,
  createOrderBy,
  pagination,
  Range
} from "@/resolvers"
import { User } from "./user"
import { Photo, PhotoFilter, PhotoOrder } from "./photo"
import { Comment, CommentFilter, CommentOrder } from "./comment"

export const Album = new GqlObject({
  name: `Album`,
  fields: disabled => ({
    id: globalId(`Album`),
    albumId: { type: new GqlNonNull(GqlID) },
    title: {
      type: GqlString,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    description: { type: GqlString },
    owner: {
      type: !disabled && new GqlNonNull(User),
      complexity: (args, childScore) => childScore * 5,
      resolve: ({ owner: userId }, args, { user }) => user.load(userId)
    },
    slug: {
      type: GqlString,
      sortable: true,
      filter: { type: new GqlList(GqlString) }
    },
    primary: {
      type: Photo,
      complexity: (args, childScore) => childScore * 5,
      resolve: ({ primary: photoId }, args, { photo }) => photo.load(photoId)
    },
    url: { type: GqlURL },
    photoCount: {
      type: GqlInt,
      sortable: true,
      filter: { type: Range }
    },
    videoCount: {
      type: GqlInt,
      sortable: true,
      filter: { type: Range }
    },
    commentCount: {
      type: GqlInt,
      sortable: true,
      filter: { type: Range }
    },
    views: {
      type: GqlInt,
      sortable: true,
      filter: { type: Range }
    },
    photos: {
      type: !disabled && new GqlList(Photo),
      args: {
        first: { type: GqlInt },
        last: { type: GqlInt },
        count: { type: GqlInt },
        offset: { type: GqlInt },
        filter: { type: PhotoFilter },
        orderBy: { type: PhotoOrder }
      },
      complexity: ({ count }, childScore) => childScore * count,
      resolve: async({ owner: userId, albumId: photosetId, photoCount, videoCount }, args, { flickr, photo }) =>
        applyFilters(await photo.loadMany(
          await fetchAlbumPhotos({
            flickr, userId, photosetId, ...pagination({ ...args, total: photoCount + videoCount })
          })
        ), args)
    },
    comments: {
      type: !disabled && new GqlList(Comment),
      args: {
        first: { type: GqlInt },
        count: { type: GqlInt },
        offset: { type: GqlInt },
        filter: { type: CommentFilter },
        orderBy: { type: CommentOrder }
      },
      complexity: (args, childScore) => childScore * 5,
      resolve: async({ albumId: photosetId }, args, { flickr }) =>
        applyFilters(await fetchAlbumComments({ flickr, photosetId, ...pagination(args) }), args)
    },
    created: {
      type: new GqlNonNull(GqlDateTime),
      sortable: true
    },
    updated: {
      type: new GqlNonNull(GqlDateTime),
      sortable: true
    }
  })
})

export const AlbumFilter = createFilter(Album)
export const AlbumOrder = createOrderBy(Album)

export const Queries = {
  album: {
    type: Album,
    args: {
      user: { type: new GqlNonNull(GqlID) },
      album: { type: new GqlNonNull(GqlID) }
    },
    resolve: (parent, { user: userId, album: photosetId }, { flickr }) => fetchAlbumByID({ flickr, userId, photosetId })
  }
}

export const Definition = Album

export default { Definition, Queries }
```

For most of our Type Definitions, we're going to have two ID fields:
  - The first one, `id`, will be a programmatically generated ID that's a hash of the type name along with some other unique identifier sourced from the Flickr API. This field will be used by our client for [cache normalization](http://dev.apollodata.com/react/cache-updates.html#normalization).
  - The second will be the ID of the data type in the Flickr API, which we'll need to make REST calls, and typically won't be needed by our client.

Let's go over a few important bits about the organization of this file (and those like it), how it differs from the [reference implementation](http://graphql.org/graphql-js/type/#examples) of a GraphQL Type Definition, and how we're structuring resolvers in this project.

> Note: I've removed all the description fields from all the GraphQL Objects shown here for brevity. Always document your GraphQL API with useful descriptions!

#### Organization

If you're interested, I like to organize my type definition files as follows:
  - Import any resolver functions and utilities, followed by dependent types.
  - Create the actual type definition, and name the export the same as the type. This makes it easy to reference when using it in other type definitions.
  - Create any number of relevant Queries for this type; these will be the graph 'entry points'. Typically, you'll only need about one per type definition.
  - Create any number of relevant Mutations for this type. This basically follows the same format as Queries. Because the project doesn't have any mutations and the time of this writing, there is no Mutations export shown here.
  - Create a Definition alias for the type definition and export the Definition, Queries and Mutations as a default export. This default export will be used by `schema.js` to build our Schema definition.

This is my method, but feel free to do whatever works best for you.

#### Differences

You might be confused by a few of the properties on our fields; `complexity`, `sortable`, and `filter` are all custom properties that are not part of the `graphql.js` reference implementation:

  - `complexity`: This property is used by the `graphql-query-complexity` library to calculate the complexity score of a field. You provide it with a function that returns an integer value. That function is automatically given your field's query arguments and the computed complexity score of the child type you're fetching. The further we nest our queries, these scores will get exponentially bigger. Requesting too many of these fields will deplete our complexity budget faster.
  - `sortable`: If set to true, this field will be included in our list of sortable fields in the OrderBy input for this type, which is used in query arguments elsewhere in our schema.
  - `filter`: When set with an object with at least a `type` property, this field will be included in a list of filterable fields in the Filter input for this type. `type` should be a list of whatever the field's `type` is, or it could be a custom input, such as the `Range` and `DateRange` inputs we've imported.

You'll notice we're using a `disabled` argument in our Fields thunk. This is to prevent type errors from popping up when we're generating our `filter` and `orderBy` inputs for this type.

### Resolvers, Loaders & Data Models

While the Flickr connector is concerned with making REST API calls and returning the raw JSON response, our **resolvers** determine how many requests need to be made from the query arguments with some help from our `pagination` utility. The resolvers pass the results off to our models, which will transform the raw data into a shape that can be consumed by our schema.

**Loaders** are simple factory functions that return a new instance of [Dataloader](https://github.com/facebook/dataloader). They create a class with a hash map to [memoize](https://www.sitepoint.com/implementing-memoization-in-javascript/) the results of the value (or array of values) we pass to it using the `.load()` and `.loadMany()` methods.

Loaders will be our first line of defense in ensuring we don't re-fetch data we've already retrieved. If a cached result is not found in the hash map, it will execute one of our resolvers to fetch the value for that input.

### Applying Filters, Sorting Results & Pagination

Let's take a look at some of the utilities we've been using in our resolvers.

To keep things as [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) as possible, I created a few abstractions to help with filtering, sorting and pagination in my resolvers.

First, I made a [filter utility](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/resolvers/utilities/createFilter.js) to iterate over the fields in that type definition and search for fields with a `filter` property set on them. For each one it finds, it will create a hash of the field names and filter values which the returned input object will use as it's fields property.

This will allow us to create query arguments such as the following:

```GraphQL
images(filter: { size: [Small, Medium, Large] }) {
  size
}
```
This will filter a list of Image results to only include images with a `size` value of either `Small`, `Medium`, or `Large`.

You can also apply as many filters as you want. Each field you supply a value for will be applied in the order you define them.

I also made an [`orderby` utility](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/resolvers/utilities/createOrder.js). It takes two inputs, `field` and `sort`, where `field` is an enumerable list of all the sortable field names, and `sort` will be the sorting direction, defaulting to ascending.

Here's an example of it's use in a query:

```GraphQL
photos(orderBy: { field: taken sort: desc }) {
  taken
}
```
This will sort the photo results by their taken date in descending order (latest to oldest).

Next we have a [filter utility](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/resolvers/utilities/createFilter.js). Here's an example of how it's used in a query:

```graphql
photos(filter: { views: { value: 500 operator: gte } }) {
  views
}
```
This will filter the list of returned photos to those with a view count greater than or equal to 500.

[Pagination](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/resolvers/utilities/pagination.js) is the last utility I made. This function will take in query arguments plus a total value, and use those to calculate a `start`, `perPage`, and `skip` value to pass along to the resolver.

It's used as part of the resolver's arguments in the following manner:

```javascript
//...
fetchUserPhotos({ flickr, userId, ...pagination({...args, total}) })
//...
```

Pagination only works in one of three ways at present: by the `first` number of results, the `last` number of results from the total, or a `count` that is a subsection of the results offset by a given number from the start of the result set.

### And That's It!

That about covers all the basic project components.

There are some other utility functions I didn't cover here, mostly error handling and validation related. You'll have to dig through the [source code](https://github.com/Saeris/Flickr-Wormhole) if you want to learn how they work. ;)

## Room for Improvement

There are a few things this project is still missing. You may have even picked up on them already.

Here's a short list:
  - Right now the gateway only supports queries. There's no way to mutate data, meaning you can't do things like add comments or upload new photos to Flickr using the gateway. I didn't build out that functionality because I don't need it for my website as of yet.
  - Because of the above, requests that require authentication are also unsupported at this time. These include certain read methods (e.g. fetching a user's galleries or a private list of favorites).
  - I would like to add a shared cache between gateway instances using Amazon's Elasticache service. That way it could be possible to implement cursor based pagination and temporary caching of more sensitive data, which would require token based authentication and session tracking.
  - Pagination sucks, a lot. It's got the most room for improvement.
  - I'm working on adding more logging and monitoring tools, such as additional transports for [Winston](https://github.com/winstonjs/winston) to services like [Loggly](https://www.loggly.com/) or [Sentry](https://sentry.io/), and [Apollo Optic](https://www.apollodata.com/optics/)'s new [Engine](https://dev-blog.apollodata.com/apollo-engine-and-graphql-error-tracking-e7dd3ce8b99d) platform, which requires a Docker Container running on something like [Amazon's EC2 Container Service](https://aws.amazon.com/ecs/). These would help in tuning the performance of the gateway and monitoring for errors.
  - There are currently no tests, so eventually some should be written. Test writing isn't one of my strengths as a developer, unfortunately.
  - I would also like to add typings to the project as well using Flow. That would help to catch some bugs early as I continue development.

# Final Thoughts

Overall this has been a great learning experience for me! Most of my development experience is in the front-end side of things, so working on more of a back-end project was a rapid-fire learning experience.

GraphQL has been a fantastic technology to work with and I firmly believe that it adds value to every project it's integrated into. It's more powerful and much more of a pleasure to use than traditional RESTful APIs, and I'm convinced that it's on trajectory to become the future standard for web APIs.

I hope this breakdown has been useful to you as an example of how to build a GraphQL server in JavaScript and encourages you to build that server on top of the Serverless platform!

Drake Costa
Full-Stack JavaScript Engineer and Photographer

[Github](https://github.com/Saeris)
[LinkedIn](https://www.linkedin.com/in/saeris/)
[Twitter](https://twitter.com/Saeris)
[Instagram](https://www.instagram.com/saeris.io/)
