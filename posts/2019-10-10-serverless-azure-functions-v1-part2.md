---
title: "How to Create a REST API with Azure Functions and the Serverless Framework - Part 2"
description: "Learn how to add API Management, Webpack and CI/CD to your Azure Functions REST API"
date: 2019-10-10
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part1/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part1/header.png"
category:
  - guides-and-tutorials
authors:
  - TannerBarlow
---

#### Overview

Now that you've created and deployed a basic API from [Part 1](https://serverless.com/blog/serverless-azure-functions-v1), let's take a few more steps towards making that API more resilient and secure. This post will still be based on the [example repo](https://github.com/tbarlow12/sls-az-func-rest-api), and will follow the same "commit-per-step" format as [Part 1](https://serverless.com/blog/serverless-azure-functions-v1), which contains Steps 1 and 2.

To pick up where we left off in the example repo (after having completed Step 2), run:

```bash
# Assumes you've already forked the repo
$ git clone https://github.com/<your-github-name>/sls-az-func-rest-api && git checkout cf46d1d
```

#### Step 3: Add unit testing and linting - (commit [465ecfe](https://github.com/tbarlow12/sls-az-func-rest-api/commit/465ecfe04bda8d4d5ac7c9c5ce31557a8993408f))

Because this isn't a blog post on unit tests, linting or quality gates in general, I'll just share the tools that I'm using and the quality gates that I added to the repository. Feel free to use them as stubs for your own future tests or lint rules.

For unit tests, I'm using the [Jest](https://jestjs.io/) test runner from Facebook. I've used it for several projects in the past and have never had any issues. Jest tests typically sit alongside the file they are testing, and end with `.test.js`. This is configurable within [`jest.config.js`](https://github.com/tbarlow12/sls-az-func-rest-api/commit/465ecfe04bda8d4d5ac7c9c5ce31557a8993408f#diff-2d0cd5d10b9604941c38c6aac608178a), which is found at the root of the project.

Because my code makes REST calls via `axios`, I'm using the `axios-mock-adapter` to mock the request & response. The tests that I wrote ([issues.test.js](https://github.com/tbarlow12/sls-az-func-rest-api/commit/465ecfe04bda8d4d5ac7c9c5ce31557a8993408f#diff-fb5daf13ab24c55eef4f041fc89c5025) and [pulls.test.js](https://github.com/tbarlow12/sls-az-func-rest-api/commit/465ecfe04bda8d4d5ac7c9c5ce31557a8993408f#diff-29c6cbdb5c35cdd4da7f67589ae7121a)) run some simple checks to make sure the correct URLs are hit and return the expected responses.

For linting, I'm using [ESLint](https://eslint.org) with a very basic configuration, found in [`.eslintrc.json`](https://github.com/tbarlow12/sls-az-func-rest-api/commit/465ecfe04bda8d4d5ac7c9c5ce31557a8993408f#diff-df39304d828831c44a2b9f38cd45289c). To run a lint check, you can run:

```bash
$ npm run lint
```

Many errors can be fixed automatically with:

```bash
$ npm run lint:fix
```

Run your tests with:

```bash
$ npm test
```

For more details, take a look at the [commit in the example repo](https://github.com/tbarlow12/sls-az-func-rest-api/commit/465ecfe04bda8d4d5ac7c9c5ce31557a8993408f) or check out the commit locally

```bash
$ git checkout 465ecfe
```

#### Step 4: Add basic API Management Configuration - (commit [c593308](https://github.com/tbarlow12/sls-az-func-rest-api/commit/c593308efc5a60e2701ec97122564592072080e2))

This was one of the first features we implemented into the `v1` of the `serverless-azure-functions` plugin. because most Azure Function Apps are REST APIs, and it's hard to have a real-world API in Azure without [API Management](https://azure.microsoft.com/en-us/services/api-management/).

If you have no special requirements for API Management, the plugin will actually generate the default configuration for you if you just include:

```yaml
...
provider:
    ...
    apim: true
```

That's exactly what I did for [Step 4](https://github.com/tbarlow12/sls-az-func-rest-api/commit/c593308efc5a60e2701ec97122564592072080e2). Also, because we want API Management to be the only entry point for our API endpoints, I also changed each function's `authLevel` to `function`. This requires a function-specific API key for authentication. You can see in the screenshot what happens in the first command, when I try to `curl` the original function URL. I get a `401` response code. But when I hit the URL provided by API Management, I get the response I expect:

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part2/apim_curl.jpg)

For more details on `authLevel`, check out the [trigger configuration docs](https://docs.microsoft.com/en-us/azure/azure-functions/functions-bindings-http-webhook#trigger---configuration).


###### Consumption SKU

One important thing to note is that the API Management configuration will default to the `consumption` SKU, which [recently went GA](https://azure.microsoft.com/en-ca/updates/azure-api-management-consumption-tier-is-now-generally-available/). For now, the only regions where `Consumption` API Management is allowed are:

- North Central US
- West US
- West Europe
- North Europe
- Southeast Asia
- Australia East

If you are deploying to a region outside of that list, you will need to specify a different SKU (`Developer`, `Basic`, `Standard` or `Premium`) within the `apim` configuration, which will be demonstrated in the next section.

###### Deploy your updates:

```bash
$ sls deploy
```

#### Step 5: Add more advanced API Management Configuration - (commit [38413a0](https://github.com/tbarlow12/sls-az-func-rest-api/commit/38413a03100a65c423dc18ab47754471a4c6f245))

If you need a few more knobs to turn when configuring your API Management instance, you can provide a more verbose configuration. Here is the verbose config I added to the sample repo (the `...` means the rest of the config for that section stayed the same):

```yaml
service: sls-az-func-rest-api

provider:
  ...
  apim:
    apis:
      - name: github-api
        # Require an API Key if true
        subscriptionRequired: false
        displayName: Github API
        description: The GitHub API
        protocols:
          - https
        # Defaults to /api
        path: github
        # Azure resource tags
        tags:
          - apimTag1
          - apimTag2
        authorization: none
    backends:
      - name: github-backend
        url: api/github
    cors:
      allowCredentials: false
      allowedOrigins:
        - "*"
      allowedMethods:
        - GET
        - POST
        - PUT
        - DELETE
        - PATCH
      allowedHeaders:
        - "*"
      exposeHeaders:
        - "*"
...

functions:
  issues:
    ...
    apim:
      api: github-api
      backend: github-backend
      operations:
        - method: get
          urlTemplate: /issues
          displayName: GetIssues
  pulls:
    ...
    apim:
      api: github-api
      backend: github-backend
      operations:
        - method: get
          urlTemplate: /pulls
          displayName: GetPullRequests
```

If you did not want the `Consumption` SKU of API Management, you would need to have a verbose configuration and specify the `sku` as:

```yaml
provider:
  ...
  apim:
    ...
    sku:
      name: {Consumption|Developer|Basic|Standard|Premium}
```

The example just uses the default and deploys to region(s) where Consumption API Management is currently available.

###### Deploy your updates:

```bash
$ sls deploy
```

#### (Optional) Step 5.1: Revert back to basic API Management configuration - (commit [4c5803f](https://github.com/tbarlow12/sls-az-func-rest-api/commit/4c5803f1e5adf21befbeac8e91cac4552b4f9c1c))

To make the demo simple and easy to follow, I'm going to revert my `apim` configuration back to the defaults:

```yaml
apim: true
```

You might be able to do the same, depending on your requirements.

#### Step 6: Add Webpack configuration - (commit [1aefac7](https://github.com/tbarlow12/sls-az-func-rest-api/commit/1aefac7e5ed99db009632724c6a70c9cb3d29bf8))

[Webpack](https://webpack.js.org/) dramatically reduces the packaging time as well as the size of your deployed package. After making these changes, your packaged Function App will be optimized with Webpack (You can run `sls package` to package it up or just run `sls deploy` which will include packaging as part of the lifecycle).

Just as an example, even for this very small application, my package size went from **324 KB** to **28 KB**. 

To accomplish this, we'll use another awesome Serverless plugin, [`serverless-webpack`](https://github.com/serverless-heaven/serverless-webpack) to make Webpacking our Azure Function app really easy.

First thing you'll want to do, assuming you're working through this tutorial in your own git repository, is add the generated Webpack folder to your `.gitignore`

```yaml
# .gitignore
...
# Webpack artifacts
.webpack/
```

Next, we'll need to install 3 packages from npm:

```bash
$ npm i serverless-webpack webpack webpack-cli --save-dev
```

Then we'll add the plugin to our `serverless.yml`:

```yaml
plugins:
  - serverless-azure-functions
  - serverless-webpack
```

And then copy this exact code into `webpack.config.js` in the root of your service directory:

```javascript
const path = require("path");
const slsw = require("serverless-webpack");

module.exports = {
  entry: slsw.lib.entries,
  target: "node",
  output: {
    libraryTarget: "commonjs2",
    library: "index",
    path: path.resolve(__dirname, ".webpack"),
    filename: "[name].js"
  },
  plugins: [],
};
```
And just like that, your deployed Azure Function apps will be webpacked and ready to go.

![alt text](https://media.giphy.com/media/zcCGBRQshGdt6/giphy.gif)

#### Step 7: Enable Serverless CLI configuration - (commit [4cb42fd](https://github.com/tbarlow12/sls-az-func-rest-api/commit/4cb42fdf17d7793a3ac9660bb43f28e8fe2d46d5))

If you're running a real-life production service, you will most likely be deploying to multiple regions and multiple stages. Maybe merges to your `dev` branch will trigger deployments to your `dev` environment, `master` into `prod`, etc. I'll show you an example of that in Step 8. To accomplish CLI-level configurability, we need to make a few changes `serverless.yml`.

```yaml
provider:
  region: ${opt:region, 'West US'}
  stage: ${opt:stage, 'dev'}
  prefix: ${opt:prefix, 'demo'}
```

As you might have guessed, the values `West US`, `dev` and `demo` are my default values. If I wanted to deploy my service to `North Central US` and `West Europe`, but keep everything else the same, I would run:

```bash
$ sls deploy --region "North Central US"
$ sls deploy --region "West Europe"
```

We could do similar operations with `--prefix` and `--stage`. Now let's create a pipeline that actually does this.

#### Step 8: Add CI/CD (with Azure DevOps) - (commit [a8fabf6](https://github.com/tbarlow12/sls-az-func-rest-api/commit/a8fabf6faa30f7ceab7c18395a5c69c21abd4640))

For the CI/CD on my sample repo, I'm using [Azure DevOps](), but it would work the same on any other service you want to use. If you want to use Azure DevOps for an open-source project, [here are a few steps to get started](https://docs.microsoft.com/en-us/azure/devops/organizations/public/about-public-projects?view=azure-devops#get-started-with-a-public-project)

No matter the CI/CD environment, here is what we are looking to accomplish:

1. Install dependencies
2. Validate the changes (run quality gates)
3. Deploy the service

These steps can all be accomplished in just a few CLI commands. At bare minimum, we'll want to run something like:

```bash
# Clean install
npm ci
# Runs tests and linting
npm test
# Serverless not contained within dev dependencies to avoid conflicts
# because most users have it installed globally on their dev machine
npm i serverless -g
# Deploy service
sls deploy
```

There are a lot more bells and whistles we could add, but that's essentially what it boils down to. Of course, we'll need authentication in whatever system we're deploying from, and that's where the [service principal](https://github.com/serverless/serverless-azure-functions#creating-a-service-principal) will come in. I'll show you how to use the service principal in the `deploy.yml` pipeline below.

For my pipelines, I'm actually going to split up my CI and CD into `unit-tests.yml` and `deploy.yml`. Unit tests will be run on PRs into `master` or `dev` (this is assuming there are branch policies in place to prevent devs from pushing straight to either branch). Deployment will be run on commits (merges) to `master`.

##### Unit Tests
```yaml
# pipelines/unit-tests.yml

# Only run on Pull Requests into `master` or `dev`
pr:
  branches:
    include:
    - master
    - dev

# Run pipeline on node 8 and 10 on Linux, Mac and Windows 
strategy:
  matrix:
    Linux_Node8:
      imageName: 'ubuntu-16.04'
      node_version: 8.x
    Linux_Node10:
      imageName: 'ubuntu-16.04'
      node_version: 10.x
    Mac_Node8:
      imageName: 'macos-10.14'
      node_version: 8.x
    Mac_Node10:
      imageName: 'macos-10.14'
      node_version: 10.x
    Windows_Node8:
      imageName: 'win1803'
      node_version: 8.x
    Windows_Node10:
      imageName: 'win1803'
      node_version: 10.x

# https://docs.microsoft.com/en-us/azure/devops/pipelines/agents/hosted?view=azure-devops#use-a-microsoft-hosted-agent
pool:
  vmImage: $(imageName)

steps:
- task: NodeTool@0
  inputs:
    versionSpec: $(node_version)
  displayName: 'Install Node.js'

# Make pipeline fail if tests or linting fail, linting occurs in `pretest` script
- bash: |
    set -euo pipefail
    npm ci
    npm test
  displayName: 'Run tests'
```

##### Deployment
```yaml
# pipelines/deploy.yml

trigger:
  branches:
    include:
    - master

# https://docs.microsoft.com/en-us/azure/devops/pipelines/library/variable-groups?view=azure-devops&tabs=yaml
variables:
- group: sls-deploy-creds

jobs:

- job: "Deploy_Azure_Function_App"
  timeoutInMinutes: 30
  cancelTimeoutInMinutes: 1

  pool:
    vmImage: 'ubuntu-16.04'

  steps:
  - task: NodeTool@0
    inputs:
      versionSpec: 10.x
    displayName: 'Install Node.js'

  - bash: |
      npm install -g serverless
    displayName: 'Install Serverless'
    # Deploy service with prefix `gh`, stage `prod` and to region `West Europe`
  - bash: |
      npm ci
      sls deploy --prefix gh --stage prod --region "West Europe"
    env:
      # Azure Service Principal. Secrets need to be mapped here
      # USE THIS EXACT TEXT, DON'T COPY/PASTE YOUR CREDENTIALS HERE.
      # Azure DevOps will use the variables within
      # the variable group `sls-deploy-creds` to replace all the $() values
      AZURE_SUBSCRIPTION_ID: $(AZURE_SUBSCRIPTION_ID)
      AZURE_TENANT_ID: $(AZURE_TENANT_ID)
      AZURE_CLIENT_ID: $(AZURE_CLIENT_ID)
      AZURE_CLIENT_SECRET: $(AZURE_CLIENT_SECRET)
    displayName: 'Deploy Azure Function App' 
```

Notice [this line](https://github.com/tbarlow12/sls-az-func-rest-api/blob/master/pipelines/deploy.yml#L30) in the deployment pipeline that leverages our setup from Step 7. You might have multiple pipelines for the different stages, you might dynamically infer these values from the branch name or you might just provide the values as environment variables. The point of the setup in Step 7 was to provide you the flexibility to deploy your service to wherever you see fit at the time, without needing to change your `serverless.yml` file.

#### Concluding Thoughts

A big part of our reason for investing time and effort into the `serverless-azure-functions` plugin was so that developers could easily deploy Azure Functions to solve more real-world, business-level scenarios. We hope that as you use the tool and discover areas for improvement that you'll [file issues on the repo](https://github.com/serverless/serverless-azure-functions/issues/new/choose) or even open up a [pull request](https://github.com/serverless/serverless-azure-functions/pulls).
