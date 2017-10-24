---
title: Creating a Serverless GraphQL Gateway on top of a 3rd Party REST API
description: Integrate GraphQL with Lambda; turn a 3rd party REST API to GraphQL. I built a microservice to interface with the Flickr API using Serverless, GraphQL and Hapi.js.
date: 2017-10-24
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/graphql.jpeg
authors:
  - DrakeCosta
---
# Introduction

I've spent a huge chunk of the last year learning how to write GraphQL servers. It took a lot of manual sifting through dozens of blog posts, videos and source code.

I wanted to consolidate all this info into a single walk-through. If I've done my job right, it's the only post you'll need to get up and running with your own project.

We're going step-by-step through the setup of my most recent project, [Flickr-Wormhole](https://github.com/Saeris/Flickr-Wormhole): a GraphQL to REST API Gateway built on top of Serverless and AWS Lambda, using [Apollo-Server-Hapi](https://github.com/apollographql/apollo-server#hapi) (to provide a modern interface to that aging Flickr API).

Let's get started!

# Background

As a web developer, I relish the challenge of building my personal website from scratch. It's a great opportunity to spend way too much time on creative solutions to weird problems.

My most recent challenge? Adding a gallery to showcase my photography. To ship this feature I had a handful of requirements to work around, which ultimately led me to creating the solution we'll be covering today:

- My site is statically generated and hosted on Netlify—no admin console to add/manage photos.
- I didn't want to upload my photos along with the rest of the site; it's being built from a GitHub repo, and would require me to write scripts for generating different image sizes for mobile.
- The gallery should be able to display titles, descriptions, EXIF metadata, geolocation, tags, comments, etc.
- Uploading/managing photos should fit into my existing photo editing workflow—I didn't want to create unnecessary steps.
- The image hosting solution needed to be dirt cheap, preferably free.
- Most importantly: as my site was designed to be a Progressive Web App, data retrieval had to be done in as few network requests as possible.

I decided to save myself a lot of coding and piggyback off Flickr for the majority of this work. It already had most of what I needed: free, generates a range of image sizes, public API and Adobe Lightroom integration for bulk uploads all in the press of a button.

That just left me with one "little" problem: having to use Flickr's horribly outdated REST API.

So you fully feel my pain, here's a quick look at what that process was like.

# The Old Way

Remember, I wanted to minimize my number of requests.

Here's the *bare* minimum with Flickr's REST:
1. Get the `userId` of the Flickr user whose albums (referred to as 'photosets') I wanted to grab photos from
2. Use `flickr.photosets.getList` with our `userId` to get a list of `photosetId`s for that user
3. Use `flickr.photosets.getPhotos` using those two ids to get a list of `photoId`s for that album
4. Use `flickr.photos.getSizes` for each of those `photoId`s for a list of URLs linking to automatically generated images for those photos (or use the `id`, `secret` and `server` fields from the previous response to construct the URLs manually)

I, however, would need to make even more: a call to `flickr.photosets.getInfo` to get info about the album (title, description, number of views, comments...), a call *per photo* to `flickr.photos.getInfo` to get its title, caption, views, comments & tags, and another call per photo to `flickr.photos.getExif` to get the EXIF metadata, a call to `flickr.photos.getSizes` to [build out a responsive `img` element](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images) for each photo in the gallery...

For a 100 photo album, I'd need 303 network requests. *\*groans*\* How about we not do that?

And it got worse. The response data was a mess to handle. The `photos` count was represented as a `string`, `views` was a `number`, the `title` and `description` were nested in an unnecessary object under a `_content` key, and the dates were either formatted as a UNIX timestamp or a MySQL DateTime value wrapped in a `string`.

Surely, I thought, there must be a better way.

# The New Way - GraphQL

Enter: GraphQL!

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

> **note:** While I won't go into detail explaining what [GraphQL](http://graphql.org/) is, I do want to make one thing clear: GraphQL is not concerned with sourcing your data. It's not an ORM; it's not a query language for a database. It's merely a transport layer that sits in your server behind a single endpoint, taking requests from your clients. You supply GraphQL with a Schema describing the types of data your API can return, and it's through resolver functions that the data is actually retrieved.

> If you *do* want/need further background on GraphQL, there are numerous [talks](https://www.youtube.com/watch?v=wPPFhcqGcvk), [blog posts](https://medium.freecodecamp.org/so-whats-this-graphql-thing-i-keep-hearing-about-baf4d36c20cf), and [tutorials](https://www.howtographql.com/) from the past year.

## GraphQL Setup

Since the Flickr API doesn't yet have a GraphQL endpoint, I had to create my own GraphQL gateway server that proxies GraphQL queries into requests to Flickr's REST interface.

To build the application, we'll need:

- A GraphQL endpoint request handler;
- An abstraction layer to programmatically build requests to Flickr's REST API; and
- A GraphQL Schema of queries mapped to Type definitions that describe our different data structures.

### Building the Endpoint Request Handler

The first step is to choose a GraphQL server implementation and set up the request handler. I'd used [Apollo](http://dev.apollodata.com/) on the front-end and really enjoyed it, but Flickr didn't have a GraphQL endpoint I could connect it to so I had to build one myself. Since I had a goal to reduce my network requests, I really liked Apollo for its [automatic request caching](https://dev-blog.apollodata.com/the-concepts-of-graphql-bc68bd819be3), which helps eliminate re-fetching.

After choosing Apollo, I needed to adapt it to work within Lambda's function signature. Apollo does have a [solution specifically for AWS Lambda](https://github.com/apollographql/apollo-server/tree/master/packages/apollo-server-lambda). However, I chose to use the [Hapi Node.js server framework](https://hapijs.com/) with [Apollo-Server-Hapi plugin](https://github.com/apollographql/apollo-server#hapi). I prefer Hapi as it allows for custom logging, monitoring and caching.

> **note:** the setup outlined below was derived from [this article](http://www.carbonatethis.com/hosting-a-serverless-hapi-js-api-with-aws-lambda/).

Let's take a look at our `serverless.yml` file:

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

Pretty basic setup here, except for the handler path being set to `"{proxy+}"`, which will pass our route to our request handler. In this case, we'll have two routes: `/graphql` and `/graphiql`, but all routing will be handled within our handler function.

Our `index.js` file contains our handler logic. This is doing the work to handle our Lambda function invocation, pull out the necessary HTTP elements that the Apollo server expects, and return the response from the Apollo server:

**index.js**
```javascript
import server from "@/server"

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

The `server.js` file contains our actual Hapi server:

**server.js**
```javascript
import hapi from "hapi"
import api from "@/api"
import graphiql from "@/graphiql"

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

In `server.js` we're defining a custom method, `makeReady`, on our new Hapi server instance to register our plugins. In a server-full world, you'd want to call `server.start()` in the callback for `server.register()`. In the serverless world, we're using `server.inject()` to inject the HTTP request event from Lambda, because we're not using Hapi to listen to HTTP events.

Note that we only register our plugins on the initial invocation to a particular Lambda instance. If we called `server.register()` on every invocation of our Serverless event handler, Hapi would throw an error complaining that we've already registered the given plugins.

Now let's take a look at our main GraphQL specific files used to create our endpoint: `api.js`, `graphiql.js`, and `schema.js`.

First, we have the `api.js` file which will define our main `/graphql` endpoint:

`api.js`
```javascript
import { graphqlHapi } from "apollo-server-hapi"
import depthLimit from 'graphql-depth-limit'
import queryComplexity from "graphql-query-complexity"
import * as loaders from "@/loaders"
import { formatError } from "@/utilities"
import { schema } from "@/schema"
import { Flickr } from "@/flickr"

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

The exported object from `api.js` is a Hapi plugin configuration, which we'll pass along as part of an array to our `server.register()` method on startup.

There are a couple interesting things to note:

1. In our context object, we're providing variables that will be available to all of our resolver functions, such as our Flickr connector and our Dataloader instances for caching.
2. Because we're running on Lambda, it's important to perform some [Query Complexity Analysis](https://www.howtographql.com/advanced/4-security/) to ensure incoming queries won't max out our execution times. To accomplish this we're going to use two libraries: [`graphql-depth-limit`](https://github.com/stems/graphql-depth-limit) and [`graphql-query-complexity`](https://github.com/ivome/graphql-query-complexity).
3. You'll notice that we have tracing enabled, which will append performance data to our responses. Check out [Apollo Tracing](https://github.com/apollographql/apollo-tracing) and [Apollo Engine](https://dev-blog.apollodata.com/apollo-engine-and-graphql-error-tracking-e7dd3ce8b99d) for more information on how you can use this to enable performance monitoring on your GraphQL endpoint.

There's also graphiql.js, which defines the /graphiql endpoint for the [GraphiQL IDE](https://github.com/graphql/graphiql):

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

Finally, let's look at our `schema.js` file which includes our GraphQL Schema for our GraphQL endpoint:

`schema.js`
```javascript
import Types from '@/types'

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

#### Webpack Notes

I do a few different tricks in my Webpack configuration to ease development.

Here's my full Webpack configuration for reference:

`webpack.config.js`
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
  resolve: {
    extensions: [`.js`, `.gql`, `.graphql`],
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
      { test: /\.(graphql|gql)$/, exclude: npmDir, loader: `graphql-tag/loader` } // in case you're using .gql files
    ]
   },
  plugins: [
    new DefinePlugin({ // used to provide environment variables as globals in our code
      ENV: JSON.stringify(ENV),
      LOGLEVEL: JSON.stringify(process.env.LOGLEVEL),
      FLICKR_API_KEY: JSON.stringify(process.env.FLICKR_API_KEY)
    }),
    new ProvidePlugin({ // used to provide node module exports as globals in our code
      // GraphQL
      GqlBool: [`graphql`, `GraphQLBoolean`], // same as import { GraphQLBoolean as GqlBool } from "graphql"
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

There are three important things to note:

1. I specifically include the webpack config for this project highlight webpack's [provide plugin](https://webpack.js.org/plugins/provide-plugin/). It allows you to call exports from node modules without having to explicitly import them in the files in which you use them. **So when you see things like `GqlString` instead of `GraphQLString`, this is why.**
2. We're using `babel-plugin-transform-optional-chaining`, which adds support for the TC39 syntax proposal: [Optional Chaining](https://github.com/tc39/proposal-optional-chaining), aka the Existential Operator. You'll see this in the code base in the following format: `obj?.property` which is equivalent to `!!object.property ? object.property : undefined`. Using this syntax requires using [babel 7](https://babeljs.io/blog/2017/03/01/upgrade-to-babel-7), so keep that in mind before attempting to use the plugin in your own projects.
3. We're using a resolve alias, specifying `@` as the project root directory. This lets us do project root relative imports, such as `import { invariant } from "@/utilities"`. I really like the way this webpack helps with code organization and managing relative imports across refactors.

### Fetching Data from the Flickr API

Now that we've built our GraphQL server and endpoint, it's time to fetch data from the Flickr API. Remember: Flickr's data is only accessible via a REST API. We have to write a connector library to interact with Flickr.

When I started this project, the first thing I actually put together was the Flickr connector. I probably refactored it about a dozen times before I got things organized in a way that I liked.

It's now designed such that you can use it completely independently from GraphQL as a standalone library to interact with the Flickr API. It's also broken up into multiple parts, such that you can import only what you need to keep the bundle size down.

The connector is fairly simple—you can check the [code here](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/flickr.js). There are two methods: `fetchResource`, which is invoked by the GraphQL method handlers to get Flickr data, and `fetch` which is used under the hood to make a request to the Flickr API.

The connector includes a Dataloader instance to cache results of each REST call. If a method handler calls `fetchResource` with the same arguments that handler has used before, it will return the cached results. Otherwise, the connector will call `fetch` to hit the Flickr API, cache the results, and return them to the handler.

The Flickr connector can be called as follows:

`getPhotos.js`
```javascript
import Flickr from "@/flickr" // A global instance of the connector is export by default as a fallback for each handler

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

You'll notice that defaults are set for many of the values, matching the defaults in the Flickr API documentation. This also serves as a type reference, which will later be updated to use Flow typings. I did things this way to minimize the occurrence of typos and referral to the API documentation that would arise from having to invoke `fetchResource` manually.

That's it for the Flickr API library! Back to the GraphQL side of things.

### GraphQL Type Definitions

For each different node type in our GraphQL schema, we'll need to create a Type Definition. There are fifteen Type Definitions in total for types such as Albums, Galleries, Images, and Tags. These Type Definitions are quite long, usually over 100 lines each, so I'll omit them for brevity. You can [explore them here](https://github.com/Saeris/Flickr-Wormhole/tree/develop/src/types) if you're curious.

Below, I'll offer a few tips on how I organize my Type Definition files and how they differ from the [reference implementation](http://graphql.org/graphql-js/type/#examples) of a GraphQL Type Definition. Then, I'll cover how I structure resolvers in this project. Finally, I'll show you how I built advanced features like filtering, pagination, and sorting to make it easier to get the exact data I wanted from Flickr.

#### Organization

I like to organize my type definition files as follows:

  - Import any resolver functions and utilities, followed by dependent types.
  - Create the actual type definition, and name the export the same as the type. This makes it easy to reference when using it in other type definitions.
  - Create any number of relevant Queries for this type; these will be the graph 'entry points'. Typically, you'll only need about one per type definition.
  - Create any number of relevant Mutations for this type. This basically follows the same format as Queries. Because the project doesn't have any mutations and the time of this writing, there is no Mutations export shown here.
  - Create a Definition alias for the type definition and export the Definition, Queries and Mutations as a default export. This default export will be used by `schema.js` to build our Schema definition.

This is my method, but feel free to do whatever works best for you.

#### Differences

If you look at my Type Definitions, you might be confused by a few of the properties on our fields—`complexity`, `sortable`, and `filter` are all custom properties that are not part of the `graphql.js` reference implementation. These fields are used for advanced functionality in my application:

  - `complexity`: This property is used by the `graphql-query-complexity` library to calculate the complexity score of a field. You provide it with a function that returns an integer value. That function is automatically given your field's query arguments and the computed complexity score of the child type you're fetching. The further we nest our queries, these scores will get exponentially bigger. Requesting too many of these fields will deplete our complexity budget faster.
  - `sortable`: If set to true, this field will be included in our list of sortable fields in the OrderBy input for this type, which is used in query arguments elsewhere in our schema.
  - `filter`: When set with an object with at least a `type` property, this field will be included in a list of filterable fields in the Filter input for this type. `type` should be a list of whatever the field's `type` is, or it could be a custom input, such as the `Range` and `DateRange` inputs we've imported.

You'll notice we're using a `disabled` argument in our Fields thunk. This is to prevent type errors from popping up when we're generating our `filter` and `orderBy` inputs for this type.

#### Resolvers, Loaders & Data Models

While the Flickr connector is concerned with making REST API calls and returning the raw JSON response, our **resolvers** determine how many requests need to be made from the query arguments with some help from our `pagination` utility. The resolvers pass the results off to our models, which will transform the raw data into a shape that can be consumed by our schema.

**Loaders** are simple factory functions that return a new instance of [Dataloader](https://github.com/facebook/dataloader). They create a class with a hash map to [memoize](https://www.sitepoint.com/implementing-memoization-in-javascript/) the results of the value (or array of values) we pass to it using the `.load()` and `.loadMany()` methods.

Loaders will be our first line of defense in ensuring we don't re-fetch data we've already retrieved. If a cached result is not found in the hash map, it will execute one of our resolvers to fetch the value for that input.

### Applying Filters, Sorting Results & Pagination

Finally, let's take a look at some of the utilities we've been using in our resolvers.

To keep things as [DRY](https://en.wikipedia.org/wiki/Don%27t_repeat_yourself) as possible, I created a few abstractions to help with filtering, sorting and pagination in my resolvers.

First, I made a [filter utility](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/resolvers/utilities/createFilter.js) (`createFilter.js`) to iterate over the fields in that type definition and search for fields with a `filter` property set on them. For each one it finds, it will create a hash of the field names and filter values which the returned input object will use as its fields property:

```javascript
import { isObject } from "lodash"
import { invariant, missingArgument } from "@/utilities"

export function createFilters(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
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

This will allow us to create query arguments such as the following:

```GraphQL
images(filter: { size: [Small, Medium, Large] }) {
  size
}
```
This will filter a list of Image results to only include images with a `size` value of either `Small`, `Medium`, or `Large`.

You can also apply as many filters as you want. Each field you supply a value for will be applied in the order you define them.

I also made an [orderBy utility](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/resolvers/utilities/createOrder.js) (`createOrder.js`). It takes two inputs, `field` and `sort`, where `field` is an enumerable list of all the sortable field names, and `sort` will be the sorting direction, defaulting to ascending:

```javascript
import { isObject } from "lodash"
import { invariant, missingArgument } from "@/utilities"

const Sort = new GqlEnum({
  name: `Sort`,
  values: { asc: {}, desc: {} }
})

export function createOrder(type) {
  invariant(isObject(type), missingArgument({ type }, `object`))
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

Here's an example of its use in a query:

```GraphQL
photos(orderBy: { field: taken sort: desc }) {
  taken
}
```
This will sort the photo results by their taken date in descending order (latest to oldest).

Finally, I made a [pagination utility](https://github.com/Saeris/Flickr-Wormhole/blob/develop/src/resolvers/utilities/pagination.js) (`pagination.js`). This function will take in query arguments plus a total value, and use those to calculate a `start`, `perPage`, and `skip` value to pass along to the resolver:

```javascript
import { isNumber } from "lodash"
import { invariant, missingArgument } from "@/utilities"

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
  - I'm working on adding more logging and monitoring tools, such as additional transports for [Winston](https://github.com/winstonjs/winston) to services like [Loggly](https://www.loggly.com/) or [Sentry](https://sentry.io/), and [Apollo Optics](https://www.apollodata.com/optics/)' new [Engine](https://dev-blog.apollodata.com/apollo-engine-and-graphql-error-tracking-e7dd3ce8b99d) platform, which requires a Docker Container running on something like [Amazon's EC2 Container Service](https://aws.amazon.com/ecs/). These would help in tuning the performance of the gateway and monitoring for errors.
  - There are currently no tests, so eventually some should be written. Test writing isn't one of my strengths as a developer, unfortunately.
  - I would also like to add typings to the project as well using Flow. That would help to catch some bugs early as I continue development.

# Final Thoughts

Overall this has been a great learning experience for me! Most of my development experience is in the front-end side of things, so working on more of a back-end project was a rapid-fire learning experience.

GraphQL has been a fantastic technology to work with and I firmly believe that it adds value to every project it's integrated into. It's more powerful and much more of a pleasure to use than traditional RESTful APIs, and I'm convinced that it's on trajectory to become the future standard for web APIs.

I hope this breakdown has been useful to you as an example of how to build a GraphQL server in JavaScript and encourages you to build that server on top of the Serverless platform!

Drake Costa
*Full-Stack JavaScript Engineer and Photographer*

[Github](https://github.com/Saeris) | [LinkedIn](https://www.linkedin.com/in/saeris/) | [Twitter](https://twitter.com/Saeris) | [Instagram](https://www.instagram.com/saeris.io/) | [Flickr](https://www.flickr.com/people/saeris/)
