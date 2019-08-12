---
title: "Serverless Components Beta"
description: "Forget infrastructure.  We’re giving you a new option to deploy serverless use-cases easily — without managing complex infrastructure configuration files."
date: 2019-08-01
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-components-beta/serverless-components-thumbnail.gif'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-components-beta/serverless_components_header.gif'
category:
  - news
authors: 
  - AustenCollins
---


**Forget infrastructure** — Today, we’re giving you a new option to **deploy serverless use-cases — without managing complex infrastructure configuration files**.  

It’s called Serverless Components and you can now use them with the Serverless Framework to deploy software on serverless cloud services, more easily than ever.  

[Deploy Serverless Components right now](https://www.github.com/serverless/components), or keep reading to learn why we believe they are a game-changer for the serverless era.

<video width="560" controls autoplay muted>
  <source src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-components-beta/serverless-framework-components-beta-overview.mp4" type="video/mp4">
  Your browser does not support HTML5 video.
</video>

## Deploy Serverless Use-Cases More Easily

Serverless, as a paradigm, is about focusing less on technology, and more on outcomes.

But, the software development tools we use for serverless applications are still very focused on the underlying infrastructure and suffer from the bloated configuration files and complexity that comes with that mind-set.

The Serverless Framework helped by offering a single, simpler abstraction to deploy multiple use-cases.  Serverless Components takes this a step further by offering infinite abstractions, for all use-cases.

For example, here is a Serverless Component that deploys a React Application on AWS S3, AWS Cloudfront with an AWS ACM Certificate and a custom domain.

```yaml
# serverless.yml

name: website

website:
  component: '@serverless/website'
  inputs:
    code:
      src: dist
      root: dashboard
      hook: npm run build
    domain: https://www.serverless-website.com
```

[The full codebase for this can be found here](https://github.com/serverless/components/tree/master/templates/website).

Even better, here is a Fullstack Serverless Application using multiple Serverless Components, which you can deploy in seconds:

```yaml
# serverless.yml

name: fullstack-application

dashboard:
  component: '@serverless/website'
  inputs:
    code:
      src: dist
      root: dashboard
      hook: npm run build
    env:
      apiUrl: ${api.domain}
    domain: www.serverless-fullstack.com

api:
  component: '@serverless/backend'
  inputs:
    code:
      src: api/src
    env:
      dbName: ${database.name}
      dbRegion: ${database.region}
    domain: api.serverless-fullstack.com

database:
  component: '@serverless/aws-dynamodb'
  inputs:
    region: us-east-1
    attributeDefinitions:
      - AttributeName: 'pk'
        AttributeType: 'S'
    keySchema:
      - AttributeName: 'pk'
        KeyType: 'HASH'
```

This fullstack app includes an AWS Lambda-based API, a react-based front-end, an on-demand DynamoDB database table, a custom domain, an SSL certificate and more, all on auto-scaling, pay-per-execution, serverless cloud infrastructure.  

This software stack has extremely low total overhead and cost.

[The full codebase for this can be found here](https://github.com/serverless/components/tree/master/templates/fullstack-application).

## Serverless Components Are Reusable

There hasn’t been an easy way to create reusable outcomes built on serverless cloud infrastructure, like AWS Lambda, AWS S3, Azure Functions, Twilio, Stripe, Cloudflare Workers, Google Big Query — especially across all cloud vendors. 

Serverless Components are designed for reuse and composition.  They can be composed together in YAML (like the examples above) so you and your team can build software faster than ever.

If you want to create a reusable Serverless Component, you can do it programmatically via javascript using `serverless.js`, like this:

```javascript
// serverless.js

const { Component } = require('@serverless/core')

MyBlog extends Component {
  async default(inputs) { // The default method is the only required class.  It is to Serverless Components what 'render()' is to a React Component.
    this.context.status('Deploying a serverless blog')
    const website = await this.load('@serverless/website') // Load a component
    const outputs = await website({ code: { src: './blog-code' } }) // Deploy it
    this.state.url = outputs.url // Save state
    await this.save()
    return outputs
  }
}
```

The programmatic experience takes a lot of inspiration from Component-based front-end frameworks, like React.  The APIs are simple and familiar.  Lastly, Serverless Components are written in vanilla Javascript, making them as approachable as possible.

## Vendor Choice

At Serverless Inc., we believe in order to deliver the best product, you must be free to use the best services.

Serverless Components are being designed to be entirely vendor agnostic, enabling you to easily use services from different vendors, together.  Whether it's big public cloud, like AWS, Azure, Google, Alibaba, Tencent, or services from smaller vendors like Stripe, Algolia, Twilio and others.

## Wrapping Up

We have big plans for Serverless Components.  Our belief is we will see an increasing number of serverless cloud infrastructure services in the future, and we aim for Serverless Components to help everyone create simpler abstractions on top of them, focused on outcomes.

If you are a vendor of cloud infrastructure services lookng for a compelling developer experience and community, [please reach out to us](mailto:hello@serverless.com) to learn more about our partner program with Serverless Components.

**Please Note** While in Beta, Serverless Components does not yet work with existing `serverless.yml` files.  You will have to create a new `serverless.yml` file.  Additionally, Serverless Components are not yet integrated with the Serverless Framework Dashboard.  We have some exciting announcements for this soon.  Stay tuned.

Go make amazing things with Serverless Components and [let us know what you think ](https://github.com/serverless/components/issues).

Cheers,

Austen & the team @ Serverless Inc.

P.S. Eslam is the lead architect of Serverless Components.  He's stellar.  [Reach out to him to chat about anything related to Serverless Components](https://twitter.com/eahefnawy)!




