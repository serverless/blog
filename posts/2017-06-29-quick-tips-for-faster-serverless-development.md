---
title: 3 Steps To Faster Serverless Development 
description: Sometimes the development feedback loop can be slow when working with serverless functions. This posts walks through some quick tips I use to speed things up
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/sls-speed.jpg
date: 2017-06-29
layout: Post
authors:
  - DavidWells
---

<img align="right" width="250" height="250" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/sls-speed.jpg">

One of the biggest pain points we hear from developers moving into the serverless world, is the slower feedback loop while developing.

In this post, I'm going to walk through some of the ways I speed up building and deploying live serverless services.

The serverless framework has a ton of hidden gems to speed up your dev cycle.

**Lets explore!**

## 1. Deploy changes faster with `sls deploy function`

Many users aren't aware of the `serverless deploy function` command and instead use `serverless deploy` each time their code has changed.

**What is the difference?**

`sls deploy` re-deploys the entire stack through cloud formation and can be noticeably slooowww.

On the flip side, `sls deploy function` only zips up the code (& any dependancies) and updates the lambda function only. This is much much faster than waiting for an entire stack update.

So, when developing you can use `sls deploy function -f myFuncName` for speedier code changes in your live AWS account.

One note: If you make any changes to `serverless.yml` config, like changing endpoint paths or updating custom resources, etc that will require a full `sls deploy` to update the entire stack.

If you have only make changes to your function code, `sls deploy function -f myFuncName` will work just fine and be much snappier.

```bash
# Redeploy entire stack through cloud formation
sls deploy

# Redeploy only the code + dependancies to update the AWS lambda function
sls deploy function -f myFuncName
```

## 2. Tail your live service logs

Debugging remote code in the serverless world can be tricky. Luckily `console.log` and lambda functions go together like peanut butter and jelly.

One of my favorite serverless framework commands is the `sls logs` command. It will pull the logs from your remote function directly into the terminal.

This is handy for debugging errors or inspecting what the `event` or `context` args contain.

It's even more useful when you tail the logs and get a live update as you are pinging your live functions.

```bash
# View logs of myFuncName and tail via -t flag
serverless logs -f myFuncName -t
```

I will pop open a new terminal window and run `sls logs -f funcName -t` and then ping my lambda function with Postman (or my UI) and live debug the function.

Having 2 terminal windows open and combining `sls deploy function -f funcName` for quicker code changes and watching the live logs with `sls logs -f funcName -t` is super easy to do and speeds up my feedback loop.

## 3. Offline Emulation

Now you might be asking, what about offline emulation? It's absolutely a way to speed up dev cycles without having to re-deploy anything.  

With the [serverless offline plugin](https://github.com/dherault/serverless-offline) you can speed up local dev is by emulating AWS lambda and API Gateway locally when developing your Serverless project.

1. Install the plugin

  ```bash
  npm install serverless-offline --save-dev
  ```

2. Then add the `plugins` key in `serverless.yml`

  ```yml
  plugins:
    - serverless-offline
  ```

3.  Now you should have the `serverless offline` commands available when running `serverless -help`

Serverless has a lot of useful plugins to test code locally before deploying to a remote environment. This helps developers save time of unnecessary deploys.

### Additional emulation resources:

- [Emulate AWS Lambdas and API Gateway locally](https://github.com/dherault/serverless-offline)
- [Emulate DynamoDB locally](https://www.npmjs.com/package/serverless-dynamodb-local)
- [Local Stack](https://github.com/atlassian/localstack)

_PS! How do you speed up your dev flow?!_

[Image credit](https://unsplash.com/search/faste?photo=WR-ifjFy4CI)
