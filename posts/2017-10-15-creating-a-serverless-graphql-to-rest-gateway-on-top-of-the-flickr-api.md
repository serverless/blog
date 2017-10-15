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

In this article I'm going to break down in detail one of my recent projects: [Flickr-Wormhole](https://github.com/Saeris/Flickr-Wormhole), which is a GraphQL to REST API Gateway built on top of Serverless and AWS Lambda using [Apollo-Server-Hapi](https://github.com/apollographql/apollo-server#hapi) to provide a modern interface to the aging Flickr API.

# Background

To set the stage for we're going to cover today, let's start with a little background on the solution we'll be digging into.

If you're a web developer like me, you probably take pride in and enjoy the challenge of building your personal website from scratch. I like to look at it as an opportunity to test-drive new technologies and explore creative solutions to complicated problems. Recently I've been working on adding a gallery to showcase my photography to my website. There are a few requirements that I have for this feature that present some non-trivial problems that need to be solved:

- The site is a statically generated and hosted on [Netlify](https://www.netlify.com/), so there is no admin console or upload form to add or manage photos.
- Because it's being built from a GitHub repo, I don't want to upload my photos along with the rest of the site. That would require me to write scripts to generate different image sizes for mobile.
- The gallery should display additional information such as titles, descriptions, EXIF metadata, geolocation, tags, comments, etc..
- Uploading and managing photos should fit into my existing photo editing workflow. Having yet another site to upload to would make the process of sharing the photos even more tedious.
- Whatever image hosting solution I go with needs to be dirt cheap, as in as close to free as possible.
- Most importantly, the site is designed to be a Progressive Web App, so however I'm retrieving this data, it has to be done in as few network requests as possible.

As you can see, this sets a pretty high bar to reach! How could I begin to accomplish all of those goals without having to write a mountain of code? Well the solution is actually pretty simple: leverage existing services! Flickr already provides us with most of what we need:

- You can upload high resolution photos for absolutely free.
- Uploaded photos automatically get converted to various image sizes.
- They have a free to use public API for non-commercial uses.
- Using the API I can get all the metadata needed for the gallery.
- Conveniently, Adobe Lightroom ships with a Flickr plugin, making it easy for me to upload all of my photos with metadata straight from the application all in one button press!

Awesome! That just leaves me with a smaller problem: having to use Flickr's horribly outdated REST API. Let's take a quick look at what that process is like.

# The Old Way

In order to build out a gallery using data from the Flickr API, we need to make a number of different requests:

1. Get the `userId` of the Flickr User who's Albums (or as Flickr refers to them, photosets) we want to grab Photos from. Our app can just keep this id in a configuration file, so we don't have the request it.
2. Use `flickr.photosets.getList` with our `userId` to get a list of `photosetId`s for that user.
3. Use `flickr.photosets.getPhotos` using those two ids to get a list of `photoId`s for that Album.
4. Use either `flickr.photos.getSizes` for each of those `photoId`s to get a list of URLs linking to the different automatically generated images for those Photos, or we can use the `id`, `secret` and `server` fields from the previous response to construct the URLs ourselves manually.

This is the bare minimum requests you need to make just to display a list of images on a page. Along with only having a little metadata about the Album and each Photo, this requires at least three network requests. Not good...

Our requirements specify needing more data than that, so in order to get it we'd need to make a few extra requests. One call to `flickr.photosets.getInfo` to get info about the Album such as title and description, number of views, comments, etc. For each Photo, a call to `flickr.photos.getInfo` to get the title, caption, views, comments, tags, etc. And also for each, a call to `flickr.photos.getExif` to get the EXIF metadata for each photo. To build out a response `img` element for each photo in our gallery, we'd also need the width for each image. While we can infer this from Flickr's standard generated image sizes, if we wanted to know the width of the original Photo, or we needed the width and height to generate our layout, we'd need to make that call to `flickr.photos.getSizes` too.

Geeze, for an album with 100 photos in it, that would require 303 network requests! That's insane!

Not only that, let's take a look at the a sample of the response data we're getting from those calls:

`flickr.photosets.getList` with `146688070@N05` as the `userId` required argument:
```json
{
  "photosets": {
  "page": 1,
  "pages": 1,
  "perpage": 5,
  "total": 5,
  "photoset": [{
    "id": "72157684545100496",
    "primary": "34700924810",
    "secret": "d4e1b19455",
    "server": "4217",
    "farm": 5,
    "photos": "110",
    "videos": 0,
    "title": { "_content": "Fanime 2017" },
    "description": { "_content": "" },
    "needs_interstitial": 0,
    "visibility_can_see_set": 1,
    "count_views": 45,
    "count_comments": 0,
    "can_comment": 0,
    "date_create": "1496572176",
    "date_update": "1496574938"
  }] },
  "stat": "ok"
}
```
Ick... The `photos` count is represented as a `string`, `views` is a `number`, the `title` and `description` are nested in an unnecessary object under a `_content` key, and the dates are in a UNIX timestamp format wrapped in a `string`. What a mess! If you're curious why it's formatted this way, I suspect it's due to the fact that originally the Flickr API was built to return XML. JSON seems to have been added as a response format after the fact.

Okay, so what does an HTTP request for that data look like?

`https://api.flickr.com/services/rest/?method=flickr.photosets.getList&api_key=f1887b8db506370a7d08e77aedd1b931&user_id=146688070%40N05&format=json&nojsoncallback=1`

Also not that great. At least it can be broken down into a few parts:

1. The base URL: `https://api.flickr.com/services/rest/`
2. A request method sting: `?method=${<method>}`
3. A list of required arguments: `&${<arg_name>}=${<arg_value>}`
4. A list of optional arguments, same format as above.
5. Our API Key: `&api_key=${<api_key>}`
6. If we need to sign the request: `&api_sig=${<api_signature>}`
7. If we need authorization to make the request: `&auth_token=${<auth_token>}`
8. Finally, some required format arguments: `&format=json&nojsoncallback=1`

Using the above we can create a request builder function and pass it the required data needed for a given request.

Originally this is the approach I took to building out a data fetching service to build a gallery UI. While it worked just fine, it wasn't mobile friendly to say the least. Plus every time you navigated back to that part of the app, all the requests would be sent again because I wasn't caching the results. I could do better than that.

# Building a Better Solution

I knew I wanted to replace this clunky setup with something more elegant. I've also been playing around with [Apollo](http://dev.apollodata.com/) a lot for GraphQL APIs, and one of it's standout features is that it does automatic request caching. You can read up on the concepts behind GraphQL request caching [here](https://dev-blog.apollodata.com/the-concepts-of-graphql-bc68bd819be3). Since the Flickr API doesn't yet have a GraphQL endpoint, we're going to have to create an API Gateway on top of it in order to make GraphQL queries to their API.

What's the big benefit of using GraphQL though? Well for one, those 300+ requests from earlier? We can grab all of that data in **one** request using a query that looks a bit like this:

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
Don't believe me? You can try out that query in the finished product here: https://flickr.saeris.io/graphiql

Not only did we grab all the data we need to build out our UI in one request, we also got only the specific fields we asked for in exactly the same shape we requested it in, and we were able to apply some powerful filtering techniques to boot! Suck it REST!

I'm not going to go into detail explaining what [GraphQL](http://graphql.org/) is, there have been numerous [talks](https://www.youtube.com/watch?v=wPPFhcqGcvk), [blog posts](https://medium.freecodecamp.org/so-whats-this-graphql-thing-i-keep-hearing-about-baf4d36c20cf), and [tutorials](https://www.howtographql.com/) produced on the subject in the last year. But I will take a moment to address a particular point that people often get confused about when it comes to GraphQL servers.

Let's make one thing clear, GraphQL is not concerned with sourcing your data from whatever services or data sources you normally get it from. It's not an ORM, it's not a query language for a database. It's merely a transport layer that sits in your server behind a single endpoint, taking requests from your clients. You supply GraphQL with a Schema describing the types of data your API can return, and it's through resolver functions that the data is actually retrieved. You can use resolvers to interface with an ORM library, send queries to your database, or even make HTTP requests to other REST APIs. This solution will use the latter.

Okay! So what do we need to build out this server? Let's break it down into a few parts:

- An endpoint request handler. In this case we'll be using the [Hapi Node.js server framework](https://hapijs.com/) along with the [Apollo-Server-Hapi plugin](https://github.com/apollographql/apollo-server#hapi).
- A GraphQL Schema consisting of queries mapped to Type definitions describing our different data structures. For this we'll use the [graphql.js reference implementation](https://github.com/graphql/graphql-js) to build these out in JavaScript. You can optionally write your Schema in raw GraphQL and use [graphql-tools](https://github.com/apollographql/graphql-tools) instead, but I won't cover how to do that here.
- A REST request handler abstraction and method handler functions to programmatically build the requests.
- And Resolver functions which we will use to transform the results from the method handlers into the shape we need it in for our Type system.

We'll break those down into a few more useful abstractions later, but those are the primary parts we'll be using to build the server. So without further ado, let's take a look at some code!

## Creating a GraphQL endpoint

First thing on our list is setting up a request handler. While Apollo has a [solution specifically for AWS Lambda](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-lambda), we're going to take the slightly more complicated approach and use Hapi.js instead. The reason being that it will allow us to do some pretty interesting things such as custom logging, monitoring, and caching should we want to implement any of those things. The setup I'll outline here is derived from this [article](http://www.carbonatethis.com/hosting-a-serverless-hapi-js-api-with-aws-lambda/) written by software engineer Charlie Brown.

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
Pretty basic setup here. Nothing special except for the handler path being set to `"{proxy+}"`, which will pass our route to our request handler. In our case we'll have two routes, `/graphql` and `/graphiql`.

**index.js**
```javascript
import server from "./server"

exports.handler = (event, context, callback) => { // eslint-disable-line
  const { path, queryStringParameters: params, httpMethod: method, body: payload, headers } = event
  server.makeReady((err) => { //eslint-disable-line
    if (err) throw err

    let url = path
    if (params) {
      const qs = Object.keys(params).map(key => `${key}=${params[key]}`)
      if (qs.length > 0) url = `${url}?${qs.join(`&`)}`
    }

    server.inject({ method, url, payload, headers, validate: false }, ({ statusCode, headers, result: body }) => { // eslint-disable-line
      delete headers[`content-encoding`]
      delete headers[`transfer-encoding`]
      callback(null, { statusCode, headers, body }) // eslint-disable-line
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
In `server.js` we're defining a custom method `makeReady` on our new Hapi server instance to register our plugins. Normally you would call `server.start()` in the callback for `server.register()`, but instead we're using `server.inject()` to inject the HTTP request event from Lambda, because we're not using Hapi to listen to HTTP events. The reason why we have these two pieces separated this way is that if we called `server.register()` on every invocation of our Serverless event handler, Hapi would throw an error complaining that we've already registered the given plugins. This is because even though your function only executes on invocation, on first invocation the `server` instance that gets created is kept 'frozen' for a short period until either more requests come in and the instance is 'thawed', or a period of time passes in which no requests come in and it is destroyed.

As a general rule of thumb, if your server creates singletons that are expected to live for the duration of the server's uptime, avoid accidentally creating multiple instances of those singletons as a side-effect of your event handler.

> Note: This also means you can implement an in-memory cache for each of your functions, which may be useful for fulfilling certain common requests for non-sensitive data. A possible optimization you can make using this idea is to hydrate an in-memory cache on first invocation. This comes with the trade-off that your function will take longer to spin up from a cold start and incur a higher memory usage, so proceed with caution.

**webpack.config.js**
```javascript
const { join } = require(`path`)
const slsw = require(`serverless-webpack`)
const nodeExternals = require(`webpack-node-externals`)
const MinifyPlugin = require(`babel-minify-webpack-plugin`)
const { DefinePlugin, ProvidePlugin, optimize } = require(`webpack`)
const { ModuleConcatenationPlugin } = optimize

const dotenv = require(`dotenv`)
dotenv.config() // import environment variables defined in '.env' located in our project root directory

const ENV = process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() || (process.env.NODE_ENV = `development`)
const envProd = ENV === `production`
const srcDir = join(__dirname, `src`)
const outDir = join(__dirname, `dist`)
const npmDir = join(__dirname, `node_modules`)

module.exports = {
  entry: slsw.lib.entries,
  target: `node`,
  externals: [nodeExternals({ modulesFromFile: true })],
  output: {
    libraryTarget: `commonjs`,
    path: outDir,
    filename: `[name].js`
  },
  stats: {
    colors: true,
    reasons: false,
    chunks: false
  },
  performance: {
    hints: false
  },
  resolve: {
    extensions: [`.js`, `.json`, `.gql`, `.graphql`],
    alias: {
      '@': srcDir // used to allow root-relative imports, ie: import { invariant } from "@/utilities"
    }
  },
  module: {
    rules: [
      { test: /\.js$/, loader: `babel-loader`, exclude: npmDir, options: {
        plugins: [
          `transform-optional-chaining`, // enables the usage of Existential Operator, ie: ?.
          `transform-object-rest-spread`,
          `transform-es2015-shorthand-properties`
        ],
        presets: [
          [`env`, {
            targets: { node: `6.10` }, // AWS Lambda uses node v6.10, so transpile our code for that environment
            useBuiltIns: `usage`
          }],
          `stage-0`
        ]
      } },
      { test: /\.json$/, loader: `json-loader` },
      { test: /\.(graphql|gql)$/, exclude: npmDir, loader: `graphql-tag/loader` }
    ]
  },
  plugins: [
    new DefinePlugin({ // used to provide environment variables as global variables in our code
      '__DEV__': !envProd,
      'ENV': JSON.stringify(ENV),
      LOGLEVEL: JSON.stringify(process.env.LOGLEVEL),
      FLICKR_API_KEY: JSON.stringify(process.env.FLICKR_API_KEY)
    }),
    new ProvidePlugin({ // used to provide node module exports as global variables in our code
      // GraphQL
      GqlBool: [`graphql`, `GraphQLBoolean`],
      GqlDate: [`graphql-iso-date`, `GraphQLDate`],
      GqlDateTime: [`graphql-iso-date`, `GraphQLDateTime`],
      GqlEmail: [`graphql-custom-types`, `GraphQLEmail`],
      GqlEnum: [`graphql`, `GraphQLEnumType`],
      GqlError: [`graphql`, `GraphQLError`],
      GqlFloat: [`graphql`, `GraphQLFloat`],
      GqlID: [`graphql`, `GraphQLID`],
      GqlInput: [`graphql`, `GraphQLInputObjectType`],
      GqlInt: [`graphql`, `GraphQLInt`],
      GqlInterface: [`graphql`, `GraphQLInterfaceType`],
      GqlList: [`graphql`, `GraphQLList`],
      GqlNonNull: [`graphql`, `GraphQLNonNull`],
      GqlObject: [`graphql`, `GraphQLObjectType`],
      GqlScalar: [`graphql`, `GraphQLScalarType`],
      GqlSchema: [`graphql`, `GraphQLSchema`],
      GqlString: [`graphql`, `GraphQLString`],
      GqlTime: [`graphql-iso-date`, `GraphQLTime`],
      GqlUnion: [`graphql`, `GraphQLUnion`],
      GqlURL: [`graphql-custom-types`, `GraphQLURL`],
      globalId: [`graphql-relay`, `globalIdField`],
      toGlobalId: [`graphql-relay`, `toGlobalId`],
      fromGlobalId: [`graphql-relay`, `fromGlobalId`],
      // Daraloader
      Dataloader: `dataloader`,
      // Winston
      info: [`winston`, `info`],
      error: [`winston`, `error`]
    }),
    new ModuleConcatenationPlugin(),
    new MinifyPlugin({
      keepFnName: true,
      keepClassName: true,
      booleans: envProd,
      deadcode: true,
      evaluate: envProd,
      flipComparisons: envProd,
      mangle: false, // some of our debugging functions require variable names to remain intact
      memberExpressions: envProd,
      mergeVars: envProd,
      numericLiterals: envProd,
      propertyLiterals: envProd,
      removeConsole: envProd,
      removeDebugger: envProd,
      simplify: envProd,
      simplifyComparisons: envProd,
      typeConstructors: envProd,
      undefinedToVoid: envProd
    })
  ]
}
```
I specifically include the webpack config for this project here to note the usage of webpack's [provide plugin](https://webpack.js.org/plugins/provide-plugin/), which will be relevant to the rest of this article. What this does is it allows you to call exports from node modules without having to explicitly import them in the files in which you use them. As a matter of personal preference, I enjoy that this plugin saves me from having to remember to import frequently used things such as the built-in GraphQL scalar types, which we'll be using often throughout this project. It can get difficult to remember which types you are using in large type definitions, which can cause confusion during development from frequent undefined errors. So going forward **if you are confused why you're seeing things like `GqlString` instead of `GraphQLString`, this is why.**

Second of all, I want to point out that we're using `babel-plugin-transform-optional-chaining`, which adds support for the TC39 syntax proposal: [Optional Chaining](https://github.com/tc39/proposal-optional-chaining) aka the Existential Operator. You'll see this in the code base in the following format: `obj?.property` which is equivalent to `!!object.property ? object.property : undefined`. This syntactic sugar will test for the existence of a property or method before invocation, evaluating to undefined when a property or method does not exist. Using this syntax requires using [babel 7](https://babeljs.io/blog/2017/03/01/upgrade-to-babel-7), so keep that in mind before attempting to use the plugin in your own projects. It can be tricky to set up as babel 7 is still in beta and the syntax itself is a stage 1 proposal at the time of writing.

Finally take note that we're using a resolve alias, specifying `@` as the project root directory. This allows us to do project root relative imports, such as `import { invariant } from "@/utilities"`. Using this webpack feature is also a matter of personal preference, and I enjoy it as it helps with code organization and managing relative imports across refactors.

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
Okay so there's a few things going on here to take note of. Let's move through each in detail.

1. The object we're exporting is a Hapi plugin configuration, which we'll pass along as part of an array to our `server.register()` method on startup. There are a few files in the project that follow this pattern.
2. Please note that our path, `/graphql`, will be prefixed by your deployment stage on AWS, ie: `/dev/graphql`. This can result in some complications with some plugins, so be aware that passing `/` here will cause issues with the graphiql IDE.
3. In our context object we're providing variables that will be available to all of our resolver functions. Typically this is where you would include info such as the current user derived from authorization tokens passed along in the headers of the incoming HTTP request. We'll also use this to pass along a new instance of our Flickr connector, which will perform fetch request level caching over the course of it's lifetime (the duration of the incoming GraphQL query). Along with that we'll pass Dataloader instances, which also perform caching. This may seem like over-kill, but remember, we're effectively proxying REST calls with this gateway, so the more deduplication and parallelization we can achieve with those the better our the performance of our gateway will be. We'll go into more details on loaders later on.
4. Because we're running on Lambda, it's important to perform some [Query Complexity Analysis](https://www.howtographql.com/advanced/4-security/) to ensure incoming queries won't max out our execution times. To accomplish this we're going to use two libraries: [`graphql-depth-limit`](https://github.com/stems/graphql-depth-limit), which will prevent execution of deeply nested queries, and [`graphql-query-complexity`](https://github.com/ivome/graphql-query-complexity) which will use a budgeting strategy using complexity scores assigned to individual fields to prevent expensive queries from being executed. One limitation to consider here is that without knowing the total number of items that could be returned from a 'list all' operation, we can't accurately predict the cost of some requests. We can address this in a few ways: limit the number of items that can be returned from a list in a single request and paginate over the whole list, or request the maximum number of items in a single HTTP request as possible to the REST API to reduce the overall number of calls. Caching the results of some of these operations can provide a lot of savings in overall execution time. Use whatever makes sense for your application.
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
- If you do want to use a custom domain, I used [this Serverless article](https://serverless.com/blog/serverless-api-gateway-domain/?rd=true) and [this part of the AWS documentation](http://docs.aws.amazon.com/apigateway/latest/developerguide/how-to-custom-domains.html) to help get mine configured. This will really depend on your domain registrar and configuration, so I'm not going to attempt to cover that rabbit hole here. Good luck!

`scehma.js`
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
Also pretty straight forward. In each of our Type Definition files, we're going to have a default export, which will include our Type Definition and Queries associated with it. We'll see what those look like soon. We'll wrap all of those up in an `index.js` file as a default export, which we'll iterate over to generate pieces of our Schema. If you want to include Mutations in the same manner, simply copy the `query` key and follow it's format to import a Mutations object from each of your Type Definitions. I like to do things this way to keep code co-located in a tidy manner.

Alright! That covers the basics for configuring our endpoint. Let's take a look at a Type Definition, a Resolver, and some utilities for both.

## GraphQL Type Definitions

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
So we've got quite a bit going on here most of which we'll be breaking down in detail throughout the next few sections.

First of all, for most of our Type Definitions we're going to have two ID fields:
  - The first one, `id`, with be a programmatically generated ID that's a hash of the type name along with some other unique identifier sourced from the Flickr API, usually the ID Flickr has assigned to that object. This field will be used by our client for [cache normalization](http://dev.apollodata.com/react/cache-updates.html#normalization). `globalId()` is a utility function that webpack is providing us from the [`graphql-relay` library](https://github.com/graphql/graphql-relay-js).
  - The second will be the ID of the data type in the Flickr API, which we'll need to make REST calls, and typically won't be needed by our client.

Now let's go over a few important bits about the organization of this file (and those like it), how it differs from the [reference implementation](http://graphql.org/graphql-js/type/#examples) of a GraphQL Type Definition, and how we're structuring resolvers in this project.

> Note: I've removed all the description fields from all the GraphQL Objects shown here for brevity. Always document your GraphQL API with useful descriptions!

### Organization

The way I like to organize my type definition files is separated into a few sections:
  - First import any resolver functions and utilities, followed by dependent types.
  - Create the actual type definition. Name your export the same as the type so it's easy to reference when using it in other type definitions.
  - Generate filter and orderBy inputs from the type definition using the `createFilter` and `createOrderBy` factory functions. I'll cover these utilities later on.
  - Create any number of relevant Queries for this type. These will be the 'entry points' to our graph. Typically you'll only need a few of these, usually one per type definition, possibly two if you want to have one to request a single value, and another to request a list. I tend to skip making queries for types that are better accessed from a parent type.
  - Create any number of relevant Mutations for this type. This basically follows the same format as Queries. Because the project doesn't have any mutations and the time of this writing, there is no Mutations export shown here.
  - Create a Definition alias for the type definition and export the Definition, Queries and Mutations as a default export. This default export will be used by `schema.js` to build our Schema definition.

Of course if you feel like your type definitions are too cluttered living all in one file like this, you can put it all in a folder and split it up across three files plus an index. This is just what I've found to be easiest for me.

### Differences

You might be confused by a few of the properties on our fields. `complexity`, `sortable`, and `filter` are all custom properties that are not part of the `graphql.js` reference implementation. Let's quickly go over what they're for:
  - `complexity`: This property is used by the `graphql-query-complexity` library to calculate the complexity score of a field. You provide it with a function that returns an integer value. That function is automatically given your field's query arguments and the computed complexity score of the child type you're fetching. The way we're using it here, that field will need to make additional calls to the Flickr API, which is a very expensive operation, so we multiply the `childScore` by 5. The further we nest our queries, these scores will get exponentially bigger. Requesting too many of these fields will deplete our complexity budget faster. I'm still playing around with what's the best way to use this property.
  - `sortable`: If set to true, this field will be included in our list of sortable fields in the OrderBy input for this type, which is used in query arguments elsewhere in our schema. We'll cover how that works later on.
  - `filter`: When set with an object with at least a `type` property, this field will be included in a list of filterable fields in the Filter input for this type. `type` should be a list of whatever the field's `type` is, or it could be a custom input, such as the `Range` and `DateRange` inputs we've imported. You can also (and should) set a `description` field on this object in order to document how the filter works! We'll cover how `filter` inputs are generated as well as how `Range` and `DateRange` work later on.

One last oddity is you'll notice we're using a `disabled` argument in our Fields thunk. The reason why we're doing this is to prevent type errors from popping up when we're generating our `filter` and `orderBy` inputs for this type.

### Resolvers

For our resolvers, in general we're going to have one a few different variations depending on what type we're fetching and how many of it we need to fetch. Usually when we're fetching a list of items, we'll be applying a bunch of optional arguments to the request. In nearly every case, things have been boiled down to a set of abstractions so we don't clutter up our code base and everything remains easy to maintain. Let's go over two examples:

```javascript
resolve: ({ owner: userId }, args, { user }) => user.load(userId)
```
First let's take note of what parameters get passed to the `resolve` function: `parent`, `args`, `context`, and `info`. We're only ever going to use the first three.
  - `parent` includes the raw values returned by the parent resolver. This can be a little confusing, as it could be that not all of those values will get mapped to the fields on this type. Most often though, you'll see this get destructured into the field names our function needs in order to run, sometimes aliased to a different name, as we see here where `owner` is being renamed to `userId`. As you'll see going forward, we'll make consistent use of variable names as they get passed down the chain.
  - `args` consists of all the arguments passed in the query. This will also be destructured whenever we need to use specific values from it.
  - `context` will have all of the properties we set in `api.js`, such as the Flickr connector instance for the request and our Dataloader functions. We'll usually need at least one of these in our resolver function.

In this particular resolver, we're using the `loadUser.js` Dataloader from our `context` to fetch a single user by their `userId`. We're using a dataloader here in case we end up requesting the same user more than once in our query. This way we'll deduplicate the request, saving us valuable execution time.

```javascript
args: {
  first: { type: GqlInt },
  last: { type: GqlInt },
  count: { type: GqlInt },
  offset: { type: GqlInt },
  filter: { type: PhotoFilter },
  orderBy: { type: PhotoOrder }
},
resolve: async({ owner: userId, albumId: photosetId, photoCount, videoCount }, args, { flickr, photo }) =>
  applyFilters(await photo.loadMany(
    await fetchAlbumPhotos({
      flickr, userId, photosetId, ...pagination({ ...args, total: photoCount + videoCount })
    })
  ), args)
```
Here we've got a more complex example where we're fetching a list of Photos that belong to an Album. We've defined a number of arguments which will allow us to filter, sort, and paginate the results. Because both `fetchAlbumPhotos` and `photo.loadMany()` are asynchronous, we'll be using [async/await](https://ponyfoo.com/articles/understanding-javascript-async-await) to ensure everything executes in sequential order before applying our filters to the results of our REST calls. `fetchAlbumPhotos` will return a list of `photoId`s which `photo.loadMany()` will use to get the info for each of those photos, deduplicating any requests if anywhere in our query we're grabbing the same photo more than once. `pagination()` is a utility function that will generate `page`, `perPage`, and `skip` properties for our `fetchAlbumPhotos` resolver, which it will use to limit the number of REST calls made to the Flickr API, where normally it's default behavior is to fetch all of the Photos in an Album.

That just about covers the basic format of our Type Definitions. Now let's dig into how we're actually fetching the raw data from the Flickr API.

## Fetching Data from the Flickr API

So when I started build out this project, the first thing I actually put together was the Flickr connector, and I probably refactored it about a dozen times before I got things organized in a way that I liked. It's designed such that you can use it completely independently from GraphQL as a standalone library to interact with the Flickr API. Also, it's broken up into multiple parts, such that you can import only what you need to keep the bundle size down. At some point in the future I may spin this off as a separate project once I've added the currently missing support for authentication checking for POST requests. A lot of the Flickr API methods require read or write permissions, which require a user to be authenticated, in order to be executed. Right now this library only supports methods that do not require authentication.

Anyways! Let's break down the main connector class and an example method handler.

`flickr.js`
```javascript
import "isomorphic-fetch"
import { invariant, missingArgument, isString } from "@/utilities"

const snake = str => str.trim().split(``).map(char => (/[A-Z]/.test(char) ? `_${char.toLowerCase()}` : char)).join(``)

export class Flickr {
  constructor(apiKey) {
    invariant(apiKey, missingArgument({ apiKey }))
    this.apiKey = apiKey

    this.loader = new Dataloader(this.fetch.bind(this), { batch: false })
  }

  endpoint = `https://api.flickr.com/services/rest/`

  fetchResource = async(method = ``, args = {}, options = {}, requiresAuth = false) => {
    try {
      invariant(isString(method), missingArgument({ method }))
      const required = Object.entries(args)
        .map(([key, value]) => {
          invariant(isString(value), missingArgument({ [snake(`${key}`)]: key }))
          return `&${snake(`${key}`)}=${value}`
        })
        .join(``) || ``

      const optional = Object.entries(options)
        .map(([key, value]) => (!!value && isString(value) ? `&${snake(`${key}`)}=${value}` : ``))
        .join(``) || ``

      const data = await this.loader.load(`${method}${required}${optional}`)

      if (data.stat === `fail`) throw new Error(data.message)

      info(`Successfully fetched resource: ${method}`, { method, args, options, requiresAuth })
      return data
    } catch (err) {
      error(`Failed to fetch resource: ${method}`, err)
      return {}
    }
  }

  fetch = urls =>
    Promise.all(
      urls.map(url =>
        fetch(`${this.endpoint}?method=${url}&api_key=${this.apiKey}&format=json&nojsoncallback=1`)
          .then(res => res.json()) //eslint-disable-line
      )
    )
}

export default new Flickr(FLICKR_API_KEY)
```
Our Flickr connector is fairly simple. On instantiation it creates a new Dataloader instance to cache the results of each REST call. This is basically a hash-map of the request parameters and the result of the fetch request. The `fetch` method is where the actual request is dispatched if a cached result isn't already found.

`fetchResource` on the other hand is the method we'll invoke in our method handlers. It has two required arguments, `method` and an `args` object, which represent the Flickr REST API method string and a hash of the required arguments for that method respectively. It'll also accept a hash of optional arguments to process for that method as well. At the time of writing, `requiresAuth` is merely a placeholder for authentication checking which will be added at a later date to enable sending requests that require an authorization token.

Both `args` and `options` will be mapped to query string parameters, with each key/value pair of `args` tested to ensure that every property passed by the method handler is a non-empty string. Both strings will be combined with `method` and will get passed to the `loader` method to fetch the results. An error will be thrown if the response from Flickr is an error.

The default export will be a singleton instance of the connector, which the method handlers will use as a fallback if another instance isn't provided when they are invoked. In both cases, we'll grab the API Key from our environment variables, which are provided to use via webpack.

`getPhotos.js`
```javascript
import Flickr from "@/flickr"

async function getPhotos(
  { flickr = Flickr, photosetId = ``, userId = `` } = {},
  { privacyFilter = 0, media = `all`, extras = ``, page = 1, perPage = 500 } = {}
) {
  return await flickr.fetchResource(
    `flickr.photosets.getPhotos`,
    { photosetId, userId },
    { privacyFilter, media, extras, page, perPage }
  )
}

export default getPhotos
```
Method handlers are also quite simple. Each is an async function with up to two hash maps for required and optional arguments. You'll notice that defaults are set for many of the values, matching the defaults in the Flickr API documentation. This also serves as a type reference, which will later be updated to use Flow typings. From there, either the given or the default connector's `fetchResource` method will be invoked with the provided parameters. I did things this way to minimize the occurrence of typos and referral to the API documentation that would arise from having to invoke `fetchResource` manually. All of the method handlers are organized in folders matching the same groupings as in the Flickr API documentation. When the default export of the top-level index is imported into a file, individual handlers can be invoked using the same naming convention as the REST methods themselves, ie: `flickr.photosets.getPhotos`. However, it is recommended to import them individually instead, ie: `import getPhotos from "@/methods/photosets/getPhotos"`.

That it for the Flickr API library! Back to the GraphQL side of things.

## Resolvers, Loaders, and Data Models

Where the Flickr connector is concerned with making REST API calls and returning the raw JSON response, our resolvers determine how many requests need to be made from the query arguments with some help from our `pagination` utility, then pass the results off to our models, which will take care of transforming the raw data into a shape that can be consumed by our schema. Finally, loaders will be our first line of defense in ensuring we don't re-fetch data we've already retrieved.

Out of all of these, the resolvers will have the most variation among them. In general they'll have one of a few different behaviors. `getInfo` variants are the simplest, dispatching a single call then returning a single new instance of a data model. `getList` variants will instead only return an array of IDs which will be passed along to another resolver. While this isn't very efficient in terms of how many network requests get made, it's necessary given that many of the 'list' style methods in the Flickr API do not return all of the data for whatever item is being requested, which would cause inconsistencies in our API depending on the query path gets taken to return a particular type. In the remainder, lists retrieved will be transform directly into their final formats.

Let's take a look at a resolver of the second variety, as those tend to be the most complicated of the bunch.

`fetchAlbumPhotos.js`
```javascript
import { invariant, missingArgument } from "@/utilities"
import getPhotos from "@/methods/photosets/getPhotos"

async function fetchAlbumPhotos({ flickr, userId = ``, photosetId = ``, start = 1, perPage = 500, skip = 0 } = {}) {
  invariant(flickr, missingArgument({ flickr }))
  invariant(userId, missingArgument({ userId }))
  invariant(photosetId, missingArgument({ photosetId }))
  try {
    let page = start
    let total = 1
    const results = []

    do {
      const { photoset = {} } = await getPhotos({ flickr, userId, photosetId }, { page: page++, perPage })

      total = perPage < 500 ? 1 : perPage > 500 ? parseInt(perPage / 500, 10) : photoset?.pages

      photoset?.photo?.map(data => !!data?.id && results.push(data.id))
    } while (page <= total)

    results.splice(skip < 0 ? skip : 0, Math.abs(skip))
    info(`Successfully ran fetchAlbumPhotos`, { userId, photosetId, start, perPage, skip, results })
    return results
  } catch (err) {
    error(`Failed to run fetchAlbumPhotos`, err)
  }
}

export default fetchAlbumPhotos
```
As you can see here, we first start off by validating our required arguments. Then we'll jump into a [`do...while`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/do...while) loop, which will execute at least one call to the Flickr API. The reason why we're doing things this way is to facilitate a 'fetch all' behavior, since we won't always know what the total number of pages we'll need to fetch will be at the onset. Some assumptions can be made however based on data from the parent type, as albums specify the number of photos/videos or comments they have, etc.

Also take note of the `?.` syntax used here to check the existence of properties before continuing onward to execute methods such as `.map()` or `.push()`. It's important to remember that when using this syntax you provide a default value, as a non-existent property will evaluate to `undefined`. A good example of this would be in a [`for...of`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of) loop, as seen here:

```javascript
for(const item of obj?.arr || []) {
  // do stuff with item...
}
```
In this case, if `arr` did not exist on `obj`, then we'd get a type error. So by using `|| []` we've provided a fallback iterable for the loop.

`loadPhoto.js`
```javascript
import { fetchPhotoByID } from "@/resolvers"

export const loadPhoto = flickr =>
  new Dataloader(arr => Promise.all(arr.map(photoId => fetchPhotoByID({ flickr, photoId }))), { batch: false })
```
Next up we've got loaders, which are simple factory functions that return a new instance of [Dataloader](https://github.com/facebook/dataloader), which will create class with a hash map to [memoize](https://www.sitepoint.com/implementing-memoization-in-javascript/) the results of the value, or array of values we pass to it using it's `.load()` and `.loadMany()` methods. If a cached result is not found in the has map, it will execute one of our resolvers to fetch the value for that input. We used this loader earlier, first calling it `api.js` to add it to our context, then later in our `album.js` type definition with the `.loadMany()` method to load the photos from the array of IDs returned from `fetchAlbumPhotos.js` resolver.

`photo.js`
```javascript
import { invariant, missingArgument } from "@/utilities"
import Note from "./note"
import Tag from "./tag"

export default class Photo {
  constructor(data) {
    invariant(data, missingArgument({ data }))
    this.id = data?.id
    this.photoId = data?.id
    this.secret = data?.secret
    this.server = data?.server
    this.license = data?.license
    this.owner = (data?.owner)?.nsid
    this.title = (data?.title)?._content
    this.caption = (data?.description)?._content
    this.views = data?.views
    this.format = data?.originalformat
    this.media = data?.media
    this.isPublic = !!(data?.visibility)?.ispublic
    this.friends = !!(data?.visibility)?.isfriend
    this.family = !!(data?.visibility)?.isfamily
    this.notes = data?.notes?.note?.map(note => new Note({ photo: data?.id, ...note }))
    this.tags = data?.tags?.tag?.map(tag => new Tag({ photo: data?.id, ...tag }))
    this.hasLocation = !!data.location
    this.commentsCount = parseInt(data.comments?._content || 0, 10)
    this.hasPeople = !!data.people?.haspeople
    this.posted = new Date(parseInt((data.dates?.posted || 0) * 1000, 10))
    this.taken = new Date(...data.dates?.taken.replace(/(:| |-)/g, `,`).split(`,`))
    this.updated = new Date(parseInt((data.dates?.lastupdate || 0) * 1000, 10))
  }
}
```
In `fetchPhotoByID`, we'll pass along the raw data from the Flickr API to a new instance of our `photo.js` model. In the constructor for this class we'll re-map the raw data to the field names defined in our `Photo` type definition, performing some data transformation along the way, such as with the `posted`, `taken`, and `updated` dates. Because `flickr.photo.getInfo` includes all the tags and notes a photo has, we'll also map those to their respective models.

If we needed to do anything a little more complicated, we can define it as a method of the class and perform our transformation there. The album model does this to create a slug from the album's title.

Finally let's take a look at some of the utilities we've been using in our resolvers.

## Applying Filters, Sorting Results, and Pagination

In order to keep things as [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) as possible, I created a few abstractions to help with filtering, sorting and pagination in my resolvers. Putting these together took quite a bit of trial and error, with pagination being particularly difficult due to the fact that we're working with an API that isn't quite consistent in providing you with totals, the number of items you can request per page, and the fact that it doesn't support anything resembling cursor-based pagination. Suffice it to say, I think there's a lot of room for improvement in these utilities. But let's take a look at what we've got so far.

`createFilter.js`
```javascript
import { invariant, missingArgument, isObject } from "@/utilities"

export function createFilters(type) {
  invariant(isObject(type, true), missingArgument({ type }, `object`))
  return new GqlInput({
    name: `${type._typeConfig.name.toLowerCase()}Filter`,
    fields: () => Object.entries(type._typeConfig.fields(true))
      .filter(([name, values]) => !!values.filter)
      .reduce((hash, [name, values]) => {
        hash[name] = values.filter
        return hash
      }, {})
  })
}
```
Here we have a factory which will generate a new GraphQL Input Object for us from a given type definition. It will iterate over the fields in that type definition, searching for fields with a `filter` property set on them. For each one it finds, it will create a hash of the field names and filter values which the returned input object will use as it's fields property. This will allow us to create query arguments such as the following:

```GraphQL
images(filter: { size: [Small, Medium, Large] }) {
  size
}
```
This will filter a list of Image results to only include images with a `size` value of either `Small`, `Medium`, or `Large`. Because this particular filter's field has an Enum value, the only possible inputs have been pre-defined and cannot be misspelled if we're using graphiql or a linting plugin such as [`eslint-plugin-graphql`](https://github.com/apollographql/eslint-plugin-graphql). We could also enter a single value without brackets as well. Arrays will always be inclusive. You can also apply as many filters as you want. Each field you supply a value for will be applied in the order you define them.

`createOrder.js`
```javascript
import { invariant, missingArgument, isObject } from "@/utilities"

const Sort = new GqlEnum({
  name: `Sort`,
  values: { asc: {}, desc: {} }
})

export function createOrder(type) {
  invariant(isObject(type, true), missingArgument({ type }, `object`))
  const FieldsEnum = new GqlEnum({
    name: `${type._typeConfig.name.toLowerCase()}OrderByFields`,
    values: Object.entries(type._typeConfig.fields(true))
      .filter(([name, values]) => !!values.sortable)
      .reduce((hash, [name, values]) => {
        hash[`${name}`] = {}
        return hash
      }, {})
  })

  return new GqlInput({
    name: `${type._typeConfig.name.toLowerCase()}OrderBy`,
    fields: () => ({
      field: { type: new GqlNonNull(FieldsEnum) },
      sort: { type: Sort, defaultValue: `asc` }
    })
  })
}
```
Similar to `createFilter`, this factory will create a new GraphQL Input Object for us based on the type definition we supply it with. Only this time we're going to create a new GraphQL Enum of the fields with a `sortable` property set to `true.` Our input will then have two inputs, `field` and `sort`, where `field` is an enumerable list of all the sortable field names, and `sort` will be the sorting direction, defaulting to ascending. Here's an example of it's use in a query:

```GraphQL
photos(orderBy: { field: taken sort: desc }) {
  taken
}
```
This will sort the photo results by their taken date in descending order, ie: latest to oldest.

`range.js`
```javascript
export const Operators = new GqlEnum({
  name: `Operators`,
  values: { gt: {}, gte: {}, eq: {}, lte: {}, lt: {} }
})

export const Range = new GqlInput({
  name: `Range`,
  fields: () => ({
    value: { type: GqlFloat },
    min: { type: GqlFloat },
    max: { type: GqlFloat },
    operator: { type: Operators }
  })
})

export const DateRange = new GqlInput({
  name: `DateRange`,
  fields: () => ({
    date: { type: GqlDateTime },
    startDate: { type: GqlDateTime },
    endDate: { type: GqlDateTime },
    operator: { type: Operators }
  })
})
```
In this file we have two custom input types: `Range`, which is used to filter number fields by comparing them to a specified value or to test whether the field's value falls within a min and max range. Similarly `DateRange` performs does the same, except the field names and input types are specific to Dates. `Operators` will be used by both to specify what comparison operation to perform. Here's an example of how it's used in a query:

```graphql
photos(filter: { views: { value: 500 operator: gte } }) {
  views
}
```
This will filter the list of returned photos to those with a view count greater than or equal to 500.

`applyFilters.js`
```javascript
import { invariant, missingArgument, isBoolean, isNumber, isString, isArray, isObject, isDate } from "@/utilities"

export function applyFilters(results = [], args = {}) {
  invariant(isArray(results, true), missingArgument({ results }, `array`))
  invariant(isObject(args, true), missingArgument({ args }, `object`))

  const withinRange = (rule, res, date = false) => {
    const value = date ? rule?.date?.getTime() : rule?.value
    const min = date ? rule?.startDate?.getTime() : rule?.min
    const max = date ? rule?.endDate?.getTime() : rule?.max
    const { operator } = rule
    info(`Evaluation if results is within range:`, rule, res)
    if ((!!value && isNumber(value)) && (!!operator && isString(operator))) {
      switch (operator) {
        case `gte`: return res >= value
        case `gt`: return res > value
        case `lt`: return res < value
        case `lte`: return res <= value
        default: return res === value
      }
    }
    if ((!!min && isNumber(min)) && (!!max && isNumber(max))) return res >= min && res <= max
  }

  if (!!args.filter) {
    for (const [field, rule] of Object.entries(args.filter)) {
      results = results.filter(
        res => isArray(rule)
          ? rule.includes(res[field])
          : isString(rule) || isBoolean(rule)
            ? res[field] === rule
            : withinRange(rule, res[field], isDate(rule))
      )
    }
  }

  if (!!args.orderBy) {
    const { field, sort } = args.orderBy
    results.sort((a, b) => {
      if (isNumber(a[field] && isNumber(b[field]))) return a[field] - b[field]

      if (isDate(a[field]) && isDate(b[field])) return a[field].getTime() - b[field].getTime()

      if (isString(a[field]) && isString(b[field])) {
        const fieldA = a[field].toUpperCase()
        const fieldB = b[field].toUpperCase()
        return fieldA < fieldB ? -1 : fieldA > fieldB ? 1 : 0
      }
    })
    if (sort === `desc`) results.reverse()
  }

  return results
}
```
Here is where all the magic happens. In this function we'll parse all of the arguments to apply our filters to the results list, then sort the results by the specified field in the orderBy argument. Filter will behave differently depending on the type of the rule that was passed. Currently Filter does not support filtering by type definition, only basic scalars and either `Range` or `DateRange`. OrderBy will also behave slightly differently depending on the field type being sorted. It only works on numbers, strings, and dates. Nothing too fancy is going on here, so it should be pretty straight forward to understand.

`pagination.js`
```javascript
import { invariant, missingArgument, isNumber } from "@/utilities"

export function pagination({ first = 0, last = 0, count = 0, offset = 0, total = 0 } = {}) {
  invariant(isNumber(first) || isNumber(last) || isNumber(count), `Please set either 'first', 'last', or 'count'.`)
  invariant(isNumber(total), missingArgument({ total }, `number`))
  isNumber(offset)
  const minPerPage = (totalItems, minLimit) => {
    if (totalItems === minLimit) return minLimit
    let perPage = minLimit
    while (totalItems % perPage !== 0) {
      perPage++
    }
    return perPage
  }
  if (!!first) {
    const perPage = first
    const start = 1
    const skip = 0

    return { start, perPage, skip }
  }
  if (!!last && !!total) {
    const cursor = total - last
    const perPage = minPerPage(total, last)
    const start = Math.ceil(cursor / perPage) || 1
    const skip = cursor % perPage

    return { start, perPage, skip }
  }
  if (!!count) {
    const perPage = offset > count ? minPerPage(offset, count) : count
    const start = offset > count ? Math.ceil(offset / perPage) : 1
    const skip = perPage - count <= 0 ? 0 : perPage - count

    return { start, perPage, skip }
  }
  return {}
}
```
Pagination has easily caused me the most headaches and I'm still not satisfied with my implementation of it. This function will take in query arguments plus a total value, and use those to calculate a `start`, `perPage`, and `skip` value to pass along to the resolver. It's used as part of the resolver's arguments in the following manner:

```javascript
//...
fetchUserPhotos({ flickr, userId, ...pagination({...args, total}) })
//...
```
You use the spread `...` operator on the function to merge it's properties with the rest of the resolver's configuration argument. Similarly because `total` is computed from the parent type and not the query arguments, it too needs to be merged into a single object as shown above.

Pagination only works in one of three ways at present, either by the `first` number of results, the `last` number of results from the total, or a `count`, which is a subsection of the results offset by a given number from the start of the result set.

Out of everything implemented here, this is by far the most buggy piece of code and has plenty of room for improvement.

That covers all the basic components of the project! There are some other utility functions I didn't cover here, mostly error handling and validation related. You'll have to dig through the [source code](https://github.com/Saeris/Flickr-Wormhole) if you want to learn how they work!

## What's Missing

So there's a few things this project is still missing that you may have picked up on while reading through the code breakdown. Here's a short list to recap:
  - Right now the gateway only supports queries, there's no way to mutate data, meaning you can't do things like add comments or upload new photos to Flickr using the gateway. I haven't built out that functionality yet because I currently don't need it for my website, which is what I originally built this for.
  - Because of the above, requests that require authentication are also unsupported at this time. This include certain read methods, such as fetching a user's galleries, which requires requests to be signed, or fetching a private list of favorites, which requires authentication to validate read permissions.
  - I would like to add a shared cache between gateway instances using Amazon's Elasticache service. That way it could be possible to implement cursor based pagination and temporary caching of more sensitive data, which would require token based authentication and session tracking.
  - Pagination sucks, a lot. It's got the most room for improvement.
  - I'm working on adding more logging and monitoring tools, such as additional transports for [Winston](https://github.com/winstonjs/winston) to services like [Loggly](https://www.loggly.com/) or [Sentry](https://sentry.io/), and [Apollo Optic](https://www.apollodata.com/optics/)'s new [Engine](https://dev-blog.apollodata.com/apollo-engine-and-graphql-error-tracking-e7dd3ce8b99d) platform, which requires a Docker Container running on something like [Amazon's EC2 Container Service](https://aws.amazon.com/ecs/). These would help in tuning the performance of the gateway and monitoring for errors.
  - There are currently no tests, so eventually some should be written. Test writing isn't one of my strengths as a developer, unfortunately.
  - I would also like to add typings to the project as well using Flow. That would help to catch some bugs early as I continue development.

# Final Thoughts

Overall this has been a great learning experience for me! Most of my development experience is in the front-end side of things, so working on more of a back-end project such as this has been really exciting for me as there's been so much to learn! GraphQL has been a fantastic technology to work with and I firmly believe that it adds value to every project it's integrated into. By far it's more powerful and much more of a pleasure to use than traditional RESTful APIs, and I'm convinced that it's on trajectory to become the future standard for web APIs.

I hope this breakdown has been useful to you as an example of how to build a GraphQL server in JavaScript and encourages you to build that server on top of the Serverless platform! In my journey over the last year trying to learn how to write GraphQL servers, I found myself having to dig through dozens of blog posts, videos, and source code in order to work out the details. That's why I've attempted to be as thorough as possible in explaining each piece of the puzzle here for you, so that you can quickly get up and running with the technology!

Thanks for reading!

Drake Costa
Full-Stack JavaScript Engineer and Photographer

[Github](https://github.com/Saeris)
[LinkedIn](https://www.linkedin.com/in/saeris/)
[Twitter](https://twitter.com/Saeris)
[Instagram](https://www.instagram.com/saeris.io/)
