---
title: Deploy a Serverless Frontend with the Serverless Finch Plugin
description: 'In this post, you will learn how to deploy a static website to AWS with the Serverless Finch Plugin.'
date: 2018-xx-xx
layout: Post
authors:
  - FernandoMedinaCorey
---

If you've already been using the Serverless Framework for your personal or professional development projects on AWS, you may have realized that deploying the frontend portion of your applications isn't built in. Fortunately for you, there's an easy solution - using Serverless Finch. In this post, I'll show you how you can use the Serverless Finch plugin to deploy your own static website assets in a way that is compatible with most modern frontend frameworks or less-complex static sites.

## Requirements

First off, I'll make a few assumptions about things you've done before you get started with Serverless Finch:

1. You installed the [Serverless Framework](https://serverless.com)
2. You configured AWS API keys that at least give you broad S3 permissions (you probably already have these if you've done any work with the Serverless Framework) 
3. You installed Node.js and npm (I'm using node v6.10.3 but more modern versions should work too)
4. You prepared some static website files and put them in a folder called `client/dist` in the same folder as your Serverless Framework project
5. You created an index.html and an error.html file to deploy to S3 as a default landing page and error page

Steps 4 and 5 are very customizable so I'll explain more about them in the advanced features section below.

## 1-2-3 Install, Configure, Deploy, Done.

After you make sure you have everything you need, the deployment process should be quick and easy:

1. While within an existing Serverless Framework project directory, install the Serverless Finch plugin with `npm install --save serverless-finch`
2. Update your `serverless.yml` file by adding this: 
```yaml
plugins:
  - serverless-finch

custom:
  client:
    bucketName: your-unique-s3-bucketname
```
3. Run `serverless client deploy` and see the magic happen (remember that _by default_ the plugin looks for your already-built frontend code in `./client/dist`). Don't have an index.html or other website files yet? Here's a one line script you can run before `serverless client deploy` just to give yourself a barebones page and see how things work: `mkdir -p client/dist && touch client/dist/index.html && touch client/dist/error.html && echo "Go Serverless" >> client/dist/index.html && echo "error page" >> client/dist/error.html`

Because Serverless Finch can take potentially destructive actions (overwriting existing files, changing bucket policies, etc.) the plugin should now display a confirmation prompt prior to taking any action. After entering `Y` for yes you should then see something like this:

```Serverless: Looking for bucket...
Serverless: Bucket found...
Serverless: Deleting all objects from bucket...
Serverless: Configuring bucket...
Serverless: Configuring policy for bucket...
Serverless: Configuring CORS for bucket...
Serverless: Uploading client files to bucket...
Serverless: Success! Your site should be available at http://your-unique-s3-bucketname.s3-website-us-east-1.amazonaws.com/
```

After that, congrats! You've just deployed your static website - go ahead and visit the domain shown to confirm your site was deployed.

## Advanced Features

Okay, so the basic tutorial was nice and all, but what if you want to set a custom distribution folder? Custom index and error documents? Or maybe use this with a custom domain? Here are a few common questions and answers for power users.

**Can I make the distribution folder something other than `client/dist`?**

Yes. Just add a distributionFolder path value to the `serverless.yml` file this:
```yaml
custom:
  client:
    ...
    distributionFolder: location/of/files
    ...
```

Keep in mind that this path is relative to the location of serverless.yml

**Can I set custom index and error documents?**

Yes! Just add a line to serverless.yml for each: 

```yaml
custom:
  client:
    ...
    indexDocument: custom-index.html
    errorDocument: custom-error.html
    ...
```

Keep in mind that you will need to put these inside whatever distribution folder you configure though!

**How does Serverless Finch integrate with custom domains?**

Great question! We're currently considering additional functionality to help manage custom domains. Currently, you can register your own domain on Route 53 and then point that domain to the S3 bucket using an AWS A record alias (this requires the bucket to share the name with the custom domain). You can also create a CloudFront Distribution to cache the files in your S3 bucket and then point your custom domain to that CloudFront distribution with a Route 53 A record alias. The benefit of CloudFront is that you can also get a free HTTPS certificate and you can name your S3 bucket whatever you want.

Either way, I'd recommend you determine how to setup your custom domain based on what's best for your needs and then use Serverless Finch to update and deploy the changes inside your S3 bucket (which should update your site regardless of the option you choose).

**What other customizations can I make?**

Lots! For a full list of features, you can view the project on GitHub [here](https://github.com/fernando-mc/serverless-finch#configuration-parameters). Don't see something that you think would be a useful feature? We are happy to add in your contributions! 

## Final Thoughts

About a year ago, I [adopted and republished](https://www.fernandomc.com/posts/publishing-serverless-finch/) a broken Serverless Framework plugin that turned into Serverless Finch. Over the last year, the community has added a bunch of new features with more on the way. If you're interested in becoming a contributor or maintainer please open a PR or [get in touch](https://www.fernandomc.com/contact/).