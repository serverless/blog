---
title: "Build and Deploy a Serverless Node.js App"
description: "In this tutorial I'm going to show you how to get started with the Cosmic JS Serverless Starter app in a matter of minutes. And as a bonus I'll show you the steps to transform any Node.js app into an infinitely scalable Node.js Serverless App. Let's get started."
date: 2018-07-10
layout: Post
thumbnail: https://cosmic-s3.imgix.net/e07fd3b0-7eee-11e8-bc42-55745f37e956-cosmic-serverless-lambda.jpg?w=1000
authors:
  - TonySpiro
---

<img src="https://cosmic-s3.imgix.net/e07fd3b0-7eee-11e8-bc42-55745f37e956-cosmic-serverless-lambda.jpg?w=1000">

Serverless application development is growing in popularity in no small part due to the appealing proposition to "build apps, not infrastructure". This way of building apps provides many benefits including not having to manage server infrastructure, not having to pay for idle server time, paying only when your service is in use.

[The Serverless platform](https://serverless.com) further abstracts building serverless apps into a delightful developer experience that helps you get a cloud function-powered app up and running fast.

In this tutorial I'm going to show you how to get started with the [Cosmic JS Serverless Starter app](https://github.com/cosmicjs/serverless-starter) in a matter of minutes. And as a bonus I'll show you the steps to transform any Node.js app into an infinitely scalable Node.js Serverless App. Let's get started.


## TL;DR
[Check out the Cosmic JS Serverless Starter on GitHub](https://github.com/cosmicjs/serverless-starter)


## Install the Cosmic JS Serverless Starter
To install the Cosmic JS Serverless Starter, run the following commands:
```bash
npm i -g cosmic-cli
cosmic login
cosmic init serverless-starter
```
These commands do the following:
1. Install the [Cosmic CLI](https://www.npmjs.com/package/cosmic-cli)
2. [Login to your Cosmic JS Account](https://cosmicjs.com) (you may need to create a new Bucket, if so, it'll walk you through this 😀)
3. Download the [Serverless Starter](https://github.com/cosmicjs/serverless-starter) and import the demo content to your selected Bucket.

Once it's downloaded, you'll be prompted to start the app with the following commands:
```bash
cd serverless-starter
cosmic develop
Your application should now be running at http://localhost:3000
```
![Serverless Node.js App](https://s3-us-west-2.amazonaws.com/cosmicjs/146a8fc0-8143-11e8-8bfa-139dde8f58ed-Screen%20Shot%202018-07-06%20at%2012.35.53%20PM.png)

## Get Ready for Lift Off
Now that we have our application running locally, let's get ready to launch it to the AWS cloud. First we'll need to connect our AWS credentials. To find these on your AWS account, Serverless has a great walk through on their website.

After you've retrieved your AWS keys run the following commands:
```bash
export AWS_ACCESS_KEY_ID=your-aws-key-id
export AWS_SECRET_ACCESS_KEY=your-aws-secret-key
```
And now we're all set to launch our Serverless Starter to AWS.  Run the following command to login to the Serverless service and deploy our app:
```bash
npm i -g serverless
serverless login
COSMIC_BUCKET=your-bucket-slug serverless deploy
```
The serverless deploy command does all the heavy-lifting for us. It performs some magic behind the scenes with our AWS account, then once our app is available, it will provide the endpoints to find the deployed app. Adding the environment variable COSMIC_BUCKET, connects our deployed app to our Cosmic JS Bucket via the Cosmic JS API.  This enables us to manage content for our newly deployed serverless app from the Cosmic JS Admin Dashboard.
![Serverless Output](https://s3-us-west-2.amazonaws.com/cosmicjs/36d5f170-8144-11e8-8bfa-139dde8f58ed-Screen%20Shot%202018-07-06%20at%2012.43.48%20PM.png)
From the output above, you can see our available endpoints where our Serverless app is now deployed.


## Make any Node.js App Serverless-Ready
So we ran a few commands and pushed the Cosmic JS Serverless Starter app to AWS... cool. But let's go a bit deeper and take a look at how we transformed the Node Starter app and how we can convert most any Node.js app into a serverless app.


#### Edit serverless.yml
To transform the Node Starter to a Serverless app, we had to create a serverless.yml file and set the config to handle dynamic routes.  This is accomplished in the function > app > events area to indicate the dynamic http events.  It looks like this:
```yml
# serverless.yml

service: cosmic-serverless

provider:
  name: aws
  runtime: nodejs6.10
  stage: dev
  region: us-east-1
  environment:
    COSMIC_BUCKET: ${env:COSMIC_BUCKET}
    COSMIC_READ_KEY: ${env:COSMIC_READ_KEY}

functions:
  app:
    handler: app.handler
    events:
      - http: ANY /
      - http: 'ANY {proxy+}'
plugins:
  - serverless-offline
```


#### Edit app.js
Next we needed to edit the entry point for the app, app.js file to export the main handler function.  We also included the [serverless-http node module](https://www.npmjs.com/package/serverless-http) to wrap our Express app for Serverless use.  Here's the app.js file converted to serverless:
```javascript
// app.js
const serverless = require('serverless-http')
const express = require('express')
const app = express()
const PORT = process.env.PORT || 3000
const Cosmic = require('cosmicjs')
const api = Cosmic()
const COSMIC_BUCKET = process.env.COSMIC_BUCKET || 'node-starter'
const COSMIC_READ_KEY = process.env.COSMIC_READ_KEY || ''
let stage_path = 'dev/'
if (process.env.STAGE === 'local')
  stage_path = ''
const bucket = api.bucket({
  slug: COSMIC_BUCKET,
  read_key: COSMIC_READ_KEY
})
app.set('view engine', 'ejs')
app.get('/:slug?', (req, res) => {
  let slug = req.params.slug
  const year = (new Date().getFullYear())
  if (!slug)
    slug = 'home'
  bucket.getObject({ slug }).then(data => {
    const page = data.object
    res.render('pages/default', { page, year, stage_path })
  }).catch(err => {
    const page = { title: 'Page not found' }
    res.render('pages/404', { page, year, stage_path })
  })
})

module.exports.handler = serverless(app);
```

## In Conclusion
With a few edits, you can quickly transform a Node.js app into a serverless app.  The Serverless platform abstracts the complexity of AWS account configuration to give you a delightful development experience.  Add Cosmic JS-powered content and you have an infinitely scalable serverless app with content managed via the Cosmic JS API.  No servers to manage, no CMS to maintain. Building apps, not infrastructure is the future!

If you have any comments or questions about building serverless apps with Cosmic JS, [reach out to us on Twitter](https://twitter.com/cosmic_js) and [join the conversation with the Cosmic JS Community on Slack](https://cosmicjs.com/community).
