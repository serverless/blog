---
title: How to create a landing page with serverless components
description: Using serverless components to buy a static website landing page
date: 2018-04-22
layout: Post
thumbnail: https://user-images.githubusercontent.com/8188/38645932-e1973882-3db3-11e8-8a12-9a68ac905a10.png
authors:
  - DavidWells
---

[Serverless components](https://github.com/serverless/components) are a new way of composing together smaller bits of functionality into larger applications.

In this tutorial we are going to walk through building a landing page with the serverless netlify and lambda components.

The three components we are using are:

1. The netlify site component
2. The AWS lambda component talking to the mailchimp API
3. The Rest API component, which uses API gateway under the hood

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->
undefined [Composing Components](#composing-components)
- [1. Adding Netlify Site](#1-adding-netlify-site)
- [2. Adding the Lambda Function for Sign Up](#2-adding-the-lambda-function-for-sign-up)
- [3. Adding the Rest API to expose Lambda function](#3-adding-the-rest-api-to-expose-lambda-function)
- [4. Expose the API endpoint to the Netlify Site](#4-expose-the-api-endpoint-to-the-netlify-site)
- [Deploy](#deploy)
- [Summary](#summary)
<!-- AUTO-GENERATED-CONTENT:END -->

## Getting Started

1. First you will need to install the serverless components repo

```bash
git clone https://github.com/serverless/components
```

2. Then install the dependancies

```bash
cd components
npm install
```

This will install all the dependancies and all the component dependancies.

3. Set your AWS credentials in your ENV vars

```bash
export AWS_ACCESS_KEY_ID=my_access_key_id
export AWS_SECRET_ACCESS_KEY=my_secret_access_key
```

**Note:** Make sure you have Node.js 8+ and npm installed on your machine.

## Composing Components

This app is comprised of 3 parts: `aws-lambda`, `rest-api`, `netlify-site`.

Let's put them together.

### 1. Adding Netlify Site

We are using netlify to publish our landing page built with `create-react-app`.

I chose netlify over s3 for static hosting because:

- Builds on github repo events (CI/CD flow)
- Has automatic branch previews on PRs
- Handles redirects out of box via via `_redirects` file 👌
- Handles proxied URLs - this gives us escape hatches for dynamic pages/content
- It is insanely cheap
- and amazing support to boot

Okay, lets get the component setup.

In `serverless.yml` we need to define the components we are using under the `components` key.

The inputs the `netlify-site` component need can be [seen here](https://github.com/serverless/components/blob/738ec5d912d50d73f62ab94d0eeb3b634e792223/registry/netlify-site/README.md#input-types)

```yml
# serverless.yml
type: landing-page

components:
  myNetlifySite:
    type: netlify-site
    inputs:
      netlifyApiToken: abc
      githubApiToken: 123
      siteName: my-awesome-site-lol-lol.netlify.com
      siteDomain: testing-lol-lol-lol.com
      siteRepo: https://github.com/serverless/netlify-landing-page
      siteBuildCommand: npm run build
      siteBuildDirectory: build
      siteRepoBranch: master
      siteRepoAllowedBranches:
          - master
```

Lets break that down.

`netlifyApiToken` is grabbed from your netlify account at https://app.netlify.com/account/applications under "Personal Access tokens". Replace `abc` with your valid netlify token.

![image](https://user-images.githubusercontent.com/35479789/38898738-b9bfef7a-424a-11e8-9c80-8fb147d36982.png)

---

`githubApiToken` is setup in github at https://github.com/settings/tokens under "Personal access tokens". The token must have `admin:repo_hook` and `repo` access. Replace `123` with your valid github token.

![image](https://user-images.githubusercontent.com/35479789/38898777-db507bb4-424a-11e8-975b-fd1554352045.png)

---

`siteName` is the netlify domain you will use for your site. Every site on netlify lives on a unique netlify subdomain until you mask it with your custom domain name. Change `my-awesome-site-lol-lol.netlify.com` to a unique address for your project.

---

`siteDomain` is the actual domain name of your site. You will need to configure a CNAME to point to netlify. If you want to attach your own domain to this example, follow the [custom domain instructions](https://www.netlify.com/docs/custom-domains/).

---

`siteRepo` is where your site code lives, **this one is important**. You can use any type of site/app that you want in your repo, as long as you give netlify the build command and where the built site is output. We are going to be using `create-react-app` to create a landing page.

Our landing page code + repo can be seen [here](https://github.com/serverless/netlify-landing-page/)

---

`siteBuildCommand` is the build command for `create-react-app`. It will compile our react app and output files into the `build` directory for us. This command will change based on your site/apps build process.

---

`siteBuildDirectory` for us is the `/build` directory. This is the default behavior of create-react-app

---

`siteRepoBranch` will be the branch that triggers a re-build of our site. A.K.A when a change is merged into `master` branch, our netlify will automagically rebuild and update our live site.

---

You can deploy this as it is right now with

```bash
../../bin/components deploy
```

If you go into netlify and click into the newly created site, you should see the live landing page URL.

![image](https://user-images.githubusercontent.com/532272/38904159-a8b88c6a-425d-11e8-8db5-12939d666c4d.png)

### 2. Adding the Lambda Function for Sign Up

Now we need to add a lambda function to handle for form submissions.

In `serverless.yml` add the `aws-lambda` component to the `components` block.

```yml
components:
  landingPageFunction:
    type: aws-lambda
    inputs:
      memory: 512
      timeout: 10
      handler: code/handler.landingPageFunction
```

Then create the code for the lambda function in a `code` directory.

```bash
mkdir code
touch handler.js
```

Inside `handler.js` add your lambda code. `code/handler.landingPageFunction` references the `hander.js` file with the exported `landingPageFunction` function.

```js
const request = require('request')

const mailChimpAPI = process.env.MAILCHIMP_API_KEY
const mailChimpListID = process.env.MAILCHIMP_LIST_ID
const mcRegion = process.env.MAILCHIMP_REGION

module.exports.landingPageFunction = (event, context, callback) => {
  console.log('Function ran!')
  const formData = JSON.parse(event.body)
  const email = formData.email

  if (!formData) {
    console.log('No form data supplied')
    return callback('fail')
  }

  if (!email) {
    console.log('No EMAIL supplied')
    return callback('fail')
  }

  if (!mailChimpListID) {
    console.log('No LIST_ID supplied')
    return callback('fail')
  }

  const data = {
    email_address: email,
    status: 'subscribed',
    merge_fields: {}
  }

  const subscriber = JSON.stringify(data)
  console.log('start to mailchimp', subscriber)

  request({
    method: 'POST',
    url: `https://${mcRegion}.api.mailchimp.com/3.0/lists/${mailChimpListID}/members`,
    body: subscriber,
    headers: {
      Authorization: `apikey ${mailChimpAPI}`,
      'Content-Type': 'application/json'
    }
  }, (error, response, body) => {
    if (error) {
      return callback(error, null)
    }
    const bodyObj = JSON.parse(body)

    if (response.statusCode < 300 || (bodyObj.status === 400 && bodyObj.title === 'Member Exists')) {
      console.log('success added to list in mailchimp')
      return callback(null, {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Credentials': true
        },
        body: JSON.stringify({
          status: 'saved email ⊂◉‿◉つ'
        })
      })
    }

    console.log('error from mailchimp', response.body.detail)
    return callback('fail')
  })
}
```

Then we need to expose the `env` variables for the function to consume.

You can grab your mail chimp API keys under Account > Extras.

![image](https://user-images.githubusercontent.com/532272/38901904-fa57ff0c-4252-11e8-90ff-373e8f78b35b.png)

![image](https://user-images.githubusercontent.com/532272/38901981-4678acf6-4253-11e8-8819-eb312cf4aa0f.png)

Your mailchimp list ID can be found under your list settings.

![image](https://user-images.githubusercontent.com/532272/38902020-72c889a2-4253-11e8-9cf3-a4453e157638.png)

The region is up in the URL of your browser. In our case it's `us11`

Now let's add these to the function.

```yml
components:
  landingPageFunction:
    type: aws-lambda
    inputs:
      memory: 512
      timeout: 10
      handler: code/handler.landingPageFunction
      env:
        MAILCHIMP_API_KEY: xyzabc123456-us11
        MAILCHIMP_LIST_ID: f95d7512fd
        MAILCHIMP_REGION: us11
```

Your full `serverless.yml` at this point should look like:

```yml
type: landing-page

components:
  landingPageFunction:
    type: aws-lambda
    inputs:
      memory: 512
      timeout: 10
      handler: code/handler.landingPageFunction
      env:
        MAILCHIMP_API_KEY: xyzabc123456-us11
        MAILCHIMP_LIST_ID: f95d7512fd
        MAILCHIMP_REGION: us11
  myNetlifySite:
    type: netlify-site
    inputs:
      netlifyApiToken: abc
      githubApiToken: 123
      siteName: my-awesome-site-lol-lol.netlify.com
      siteDomain: testing-lol-lol-lol.com
      siteRepo: https://github.com/serverless/netlify-landing-page
      siteBuildCommand: npm run build
      siteBuildDirectory: build
      siteRepoBranch: master
      siteRepoAllowedBranches:
          - master
```

### 3. Adding the Rest API to expose Lambda function

So far we have a landing page and a function. They aren't connected in any way.

We need to expose a live endpoint for the landing page to ping on form submissions.

Lets do that with the `rest-api` component.

Add the rest API component to the `components` block of `serverless.yml`

```yml
components:
  apiEndpoint:
    type: rest-api
    inputs:
      gateway: aws-apigateway
      routes:
        /sign-up:
          post:
            function: ${landingPageFunction}
            cors: true
```

Let's break this down.

The inputs for the `rest-api` component take a `gateway` and `routes`.

`gateway` is the API gateway you want to use. In this case we are using `aws-apigateway`

`routes` are the URL paths and the functions that are triggered when they are hit. For a larger rest example see the `/examples/retail-app`

`${landingPageFunction}` being referenced in the `/sign-up` route refers to the function that we had previously defined. So we are passing a direct reference of the function into the rest-api component. A.k.a composiblity.

Your full `serverless.yml` should look like this at this point.

```yml
type: landing-page

components:
  landingPageFunction:
    type: aws-lambda
    inputs:
      memory: 512
      timeout: 10
      handler: code/handler.landingPageFunction
      env:
        MAILCHIMP_API_KEY: xyzabc123456-us11
        MAILCHIMP_LIST_ID: f95d7512fd
        MAILCHIMP_REGION: us11
  apiEndpoint:
    type: rest-api
    inputs:
      gateway: aws-apigateway
      routes:
        /sign-up:
          post:
            function: ${landingPageFunction}
            cors: true
  myNetlifySite:
    type: netlify-site
    inputs:
      netlifyApiToken: abc
      githubApiToken: 123
      siteName: my-awesome-site-lol-lol.netlify.com
      siteDomain: testing-lol-lol-lol.com
      siteForceSSL: true # not in use
      siteRepo: https://github.com/serverless/netlify-landing-page
      siteBuildCommand: npm run build
      siteBuildDirectory: build
      siteRepoBranch: master
      siteRepoAllowedBranches:
          - master
```

### 4. Expose the API endpoint to the Netlify Site

We have all the pieces we need for the functionality we are after. Great news.

There is one last step we need to handle. We need to give the live URL to the frontend for it to know where to actually send the form data.

We are going to supply the live endpoint to the frontend during the site build as an environment variable.

Because components have outputs, we can pass values from one component to another.

So we need to use the `siteEnvVars` input for the `netlify-site` component and pass it the `url` output from the `rest-api` component.

We do so like this:

```yml
type: landing-page

components:
  landingPageFunction:
    type: aws-lambda
    ...
  apiEndpoint:
    type: rest-api
    ...
  myNetlifySite:
    type: netlify-site
    inputs:
      netlifyApiToken: abc
      githubApiToken: 123
      siteName: my-awesome-site-lol-lol.netlify.com
      ...
      siteEnvVars:
        REACT_APP_SIGNUP_API: ${apiEndpoint.url}sign-up
```

`${apiEndpoint.url}` refers to the `apiEndpoint` rest-api component and it's outputted value of `url`

So `${apiEndpoint.url}sign-up` will resolve to something like `https://3m0ylzhbxk.execute-api.us-east-1.amazonaws.com/dev/sign-up`

We are passing that value into the netlify site build environment variables with the `create-react-app` conventions `REACT_APP_${YOUR KEY}`

This way we can use `process.env.REACT_APP_SIGNUP_API` in our react apps code.

```js
const formAPI = process.env.REACT_APP_SIGNUP_API

function formHandler(email) {
  const data = {
    email: email
  }
  return axios({
    method: 'post',
    url: formAPI,
    data: data,
  })
}
```

You can see this in action in our [landing page repo](https://github.com/serverless/netlify-landing-page/blob/58eacc5a745d48c8894b4a4932c338617848032e/src/App.js#L6).

Your full `serverless.yml` should look like:

```yml
type: landing-page

components:
  landingPageFunction:
    type: aws-lambda
    inputs:
      memory: 512
      timeout: 10
      handler: code/handler.landingPageFunction
      env:
        MAILCHIMP_API_KEY: xyz-us11
        MAILCHIMP_LIST_ID: lol-id-here
        MAILCHIMP_REGION: us11
  apiEndpoint:
    type: rest-api
    inputs:
      gateway: aws-apigateway
      routes:
        /sign-up:
          post:
            function: ${landingPageFunction}
            cors: true
  myNetlifySite:
    type: netlify-site
    inputs:
      netlifyApiToken: xxxx
      githubApiToken: yyyy
      siteName: serverless-components.netlify.com
      siteDomain: components.serverless.com
      siteForceSSL: true # not in use
      siteRepo: https://github.com/serverless/netlify-landing-page
      siteBuildCommand: npm run build
      siteBuildDirectory: build
      siteRepoBranch: master
      siteRepoAllowedBranches:
          - master
      siteEnvVars:
        REACT_APP_SIGNUP_API: ${apiEndpoint.url}sign-up
```

## Deploy

Now we have created our landing page and it's time for the final deploy.

In your terminal run

```bash
../../bin/components deploy
```

## Summary

So as you can see with just a couple components you can have a landing page up and running in a jiffy.

What will you build with components?
