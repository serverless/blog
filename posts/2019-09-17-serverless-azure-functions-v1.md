---
title: "How to Create a REST API with Azure Functions and the Serverless Framework - Part 1"
description: "Learn how to create, run and deploy a simple REST API to Azure Functions with the Serverless Framework"
date: 2019-09-17
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part1/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure-functions-part1/header.png"
category:
  - guides-and-tutorials
authors:
  - TannerBarlow
---

#### Overview

With the [recent updates to the `serverless-azure-functions` plugin](https://github.com/serverless/serverless-azure-functions/blob/master/CHANGELOG.md), it is now easier than ever to create, deploy and maintain a real-world REST API running on Azure Functions. This post will walk you through the first few steps of doing that. 

To see the full end-to-end example used to create this demo, check out [my GitHub repo](https://github.com/tbarlow12/sls-az-func-rest-api). I structured [each commit](https://github.com/tbarlow12/sls-az-func-rest-api/commits/master) to follow the steps described in this post. Any steps named `Step X.X` are steps that involve no code or configuration changes (and thus not tracked by source control), but actions that could/should be taken at that point in the process. This is done to preserve the "commit-per-step" structure of the example repo.

This post will only cover the basics of creating and deploying a REST API with Azure Functions, which includes [step 1](https://github.com/tbarlow12/sls-az-func-rest-api/commit/6cd5deebf34645f1ebc829d590e0b169e6c23e29) and [step 2](https://github.com/tbarlow12/sls-az-func-rest-api/commit/5ac83c915e7e78ecfe8e30e03c8425d09c1de936) from the example repo. Stay tuned for posts on the additional steps in the future.

I will make the assumption that you have the Serverless Framework installed globally. If you do not (or have not updated in a while), run:

```
npm i serverless -g
```

Also, the `serverless` CLI can be referenced by either `serverless` or `sls`. I will use `sls` in this post just because it's shorter, but `serverless` would work just the same.

#### Step 1: Create your local Azure Function project

Let's begin by creating our Azure Function project with a template from serverless.

```
sls create -t azure-nodejs -p sls-az-func-rest-api
```

The resulting project will be in the directory `sls-az-func-rest-api`. `cd` into that directory and run `npm install`. To make sure you have the latest version of the Azure Functions plugin, run:

```
npm install serverless-azure-functions --save
```

It’s important to note that the generated `serverless.yml` file will contain a lot of commented lines, which start with `#`. Those are purely for your benefit in exploring features of the Azure Functions plugin, and can be safely removed.

#### Step 2: Add your own handlers

For the sake of this demo, we’re going to create a basic wrapper of the GitHub API for [issues](https://developer.github.com/v3/issues/) and [pull requests](https://developer.github.com/v3/pulls/).

As you’ve probably already noticed, the `azure-nodejs` [template](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/azure-nodejs) comes preloaded with two functions: `hello` and `goodbye`. Let’s remove those before we start adding our own code. To do this, remove both the `hello.js` and `goodbye.js` files. Also, remove their configuration definitions from `serverless.yml`.

Right now your file structure should look something like:

```
sls-az-func-rest-api
|-- host.json
|-- package.json
|-- README.md
|-- serverless.yml
```

and your `serverless.yml` should look like (not including any comments):

```yaml
service: sls-az-func-rest-api 
 
provider:
  name: azure
  location: East US
  runtime: nodejs10.x
 
plugins:
  - serverless-azure-functions
 
package:
  exclude:
    - local.settings.json
    - .vscode/**
 
functions:
```

##### Add Code

Let’s add in our own code. We’ll start by creating the directory `src/handlers`. This, perhaps to your great surprise, will be where our handlers will live. Inside that directory, we will put our two handlers: [issues.js](https://github.com/tbarlow12/sls-az-func-rest-api/blob/master/src/handlers/issues.js) and [pulls.js](https://github.com/tbarlow12/sls-az-func-rest-api/blob/master/src/handlers/pulls.js).

```javascript
// src/handlers/issues.js

const utils = require("../utils");
const axios = require("axios");

module.exports.handler = async (context, req) => {
  context.log("Issue Handler hit");

  const owner = utils.getQueryOrBodyParam(req, "owner");
  const repo = utils.getQueryOrBodyParam(req, "repo");

  if (owner && repo) {
    const response = await axios({
      url: `https://api.github.com/repos/${owner}/${repo}/issues`,
      method: "get"
    });
    context.res = {
      status: 200,
      body: response.data
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass the name of an owner and a repo in the request"
    };
  }
};
```
```javascript
// src/handlers/pulls.js

const utils = require("../utils");
const axios = require("axios");

module.exports.handler = async (context, req) => {
  context.log("Pull Request Handler hit");

  const owner = utils.getQueryOrBodyParam(req, "owner");
  const repo = utils.getQueryOrBodyParam(req, "repo");
  
  if (owner && repo) {
    const response = await axios({
      url: `https://api.github.com/repos/${owner}/${repo}/pulls`,
      method: "get"
    });
    context.res = {
      status: 200,
      body: response.data
    };
  } else {
    context.res = {
      status: 400,
      body: "Please pass the name of an owner and a repo in the request"
    };
  }
};
```

Just for fun, we’ll also add a [utils.js](https://github.com/tbarlow12/sls-az-func-rest-api/blob/master/src/utils.js) file for shared utility functions across handlers, and we’ll put that just inside the `src` directory.

```javascript
// src/utils.js

/** Gets the param from either the query string
 * or body of request
 */
module.exports.getQueryOrBodyParam = (req, param) => {
  const { query, body } = req;
  if (query && query[param]) {
    return query[param];
  }
  if (body && body[param]) {
    return body[param];
  }
};
```

You’ll also note that the handlers are using a popular NPM package for HTTP requests, `axios`. Run `npm install axios --save` in your service root directory.

##### Current Folder structure

```
sls-az-func-rest-api
|-- src
    |-- handlers
        |-- issues.js
        |-- pulls.js
    |-- utils.js
|-- host.json
|-- package.json
|-- README.md
|-- serverless.yml
```

Now we need to add our new handlers to the serverless configuration, which will now look like:

```yaml
service: sls-az-func-rest-api 
 
provider:
  name: azure
  location: East US
  runtime: nodejs10.x
 
plugins:
  - serverless-azure-functions
 
package:
  exclude:
    - local.settings.json
    - .vscode/**
 
functions:
  issues:
    handler: src/handlers/issues.handler
    events:
      - http: true
        x-azure-settings:
          authLevel: anonymous
  pulls:
    handler: src/handlers/pulls.handler
    events:
      - http: true
        x-azure-settings:
          authLevel: anonymous
```
 
#### Step 2.1: Test your API Locally

Run the following command in your project directory to test your local service.

```bash
sls offline
```

This will generate a directory for each of your functions with the file `function.json` in each of those directories. This file contains metadata for the “bindings” of the Azure function, and will be cleaned up when you stop the process. You shouldn’t try to change the bindings files yourself, as they will be cleaned up and regenerated from `serverless.yml`. If you make changes to your `serverless.yml` file, you’ll need to exit the process and restart. Changes to code, however, will trigger a hot reload and won’t require a restart.

Here is what you can expect as output when you run `sls offline`:

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure+plugin+update/offline.png)

When you see the “Http Functions” in the log, you are good to invoke your local service.

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure+plugin+update/urls.png)

One easy way to test your functions is to start up the offline process in one terminal, and then in another terminal, run:

```bash
sls invoke local -f {functionName} -p {fileContainingTestData.json}
```

Let’s create a file with some sample data at the root of our project, and we’ll just call it `data.json`:

```json
{
  "owner": "serverless",
  "repo": "serverless-azure-functions"
}
```

Luckily, `owner` and `repo` are the same parameters expected by both the `issues` and `pulls` handlers, so we can use this file to test both.

We’ll keep our `offline` process running in one terminal. I’ll open up another (pro tip: use the “Split Terminal” in the VS Code integrated terminal), and run:

```bash
sls invoke local -f pulls -p data.json
```

Here’s my output:

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure+plugin+update/invokeLocal.png)

You can see that it made a `GET` request to the locally hosted API and added the info from `data.json` as query parameters. There are no restrictions on HTTP methods, you would just need to specify in the CLI if it’s not a `GET`. (Example: `sls invoke local -f pulls -p data.json -m POST`)

You could also run a simple `curl` command that would accomplish the same thing:

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure+plugin+update/curl.png)

And here is the output in the terminal running the API. You can see our `console.log` statement from the handler output here:

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure+plugin+update/handlerLog.png)

When I’m done running the service locally, I’ll hit `Ctrl/Cmd + C` in the API terminal to stop the process. You can see that it cleans up those metadata files we discussed earlier:

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure+plugin+update/cleanup.png)

#### Step 2.2: Deploy

##### Authentication

That’s all the configuration we need, so we’re ready to deploy this Function App. In order to deploy, we’ll need to authenticate with Azure. There are two options for authentication: interactive login and a service principal (which, if you are unfamiliar, is essentially a service account). 

At first, when you run a command that requires authentication, the Interactive Login will open up a webpage for you to enter a code. You’ll only need to do this once. The authentication results are cached to your local machine. 

If you have a service principal, you’ll set the appropriate environment variables on your machine, and the plugin will skip the interactive login process. Unfortunately, if you’re using a free trial account, your only option is a service principal. The process for creating one and setting up your environment variables is detailed in the [Azure plugin README](https://github.com/serverless/serverless-azure-functions#creating-a-service-principal).

##### Deploy Command

With configuration and authentication in place, let’s ship this thing. From the root of your project directory, run:

`sls deploy`

and watch the magic happen. Your app will be packaged up into a `.zip` file, which will be located in the `.serverless` directory at the root of your project. From there, an Azure resource group will be created for your application, containing things like your storage account, Function App, and more. After the resource group is created, the zipped code will be deployed to your newly created function app and the URLs for your functions will be logged to the console.

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure+plugin+update/deploy+(1).png)

#### Step 2.3 Invoke Deployed Function

We can invoke a deployed function in the same way we invoked our local function, just without the `local` command:

```
sls invoke -f pulls -p data.json
```

![alt text](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure+plugin+update/invoke.png)

#### (Optional) Step 2.4: Cleanup

If you have been following this tutorial and would like to clean up the resources you deployed, you can simply run:

```
sls remove
```

BE CAREFUL when running this command. This will delete your entire resource group.

#### Additional Steps

Stay tuned for future posts walking you through other steps of setting up your service, including adding [API Management](https://azure.microsoft.com/en-us/services/api-management/) configuration, quality gates like linting and unit tests, adding Webpack support, CI/CD and more.

Also, if you're going to be at ServerlessConf 2019 in NYC, the Microsoft team is putting on a [Azure Serverless Hands-on Workshop](http://aka.ms/nycworkshop) on October 7th from 8:30 am to 5:00 pm.

#### Contributing

We’re eager to get your feedback on the `serverless-azure-functions` plugin. Please [log issues on the GitHub repo with any bug reports or feature requests](https://github.com/serverless/serverless-azure-functions/issues/new/choose). Or better yet, fork the repo and open up a [pull request](https://github.com/serverless/serverless-azure-functions/pulls)! 

Part Two of this tutorial can now be found [here](https://serverless.com/blog/serverless-azure-functions-v1-part2).
