---
title: "Fast, Cheap & Global React Apps via Serverless Framework Components (Video)"
description: "Easily deploy React applications that are fast, global and cheap to host on AWS S3 and AWS Cloudfront."
date: 2019-08-07
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-components-react-apps/react-apps-serverless-components-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-components-react-apps/react-apps-serverless-components-hero.png'
category:
  - guides-and-tutorials
authors: 
  - AustenCollins
---

Here's a tutorial on how you can deploy React applications that are fast, global and cheap to host.

The outcome of this is a website with a React app, a custom domain and SSL certificate — **Basically, everything you need to be production ready.**

And all of this will be made simple via the Serverless Framework and its new Serverless Components feature.

This post features few images because an entire walkthrough video of this tutorial can be found here:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ts26BVuX3j0" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>


### Overview

Your React app will be distributed via a global Content Delivery Network.  This enables it to have incredibly fast performance around the world.

And we will be using possibly the cheapest infrastructure to do this which is S3 and Cloudfront from Amazon Web Services.

How cheap is that?  

For a year, you can transfer 50 GB of data and serve 2 million requests a month, **for free**.  

After that, it will cost you 8-2 cents per GB, depending on how much data you transfer, plus 1 cent per 10,000 HTTPs requests.  Check out the AWS Cloudfront pricing page for more details.

You will have to pay for your custom domain.  However, you will get a free public SSL certificate from AWS Certificate Manager.

Now a disclaimer – I did not analyze all of the options on the market for static site hosting before this, so I'm not aware of cheaper alternatives that may exist.  But, S3 and Cloudfront have been around for many years.  They're reliable and fast.  Actually, many products for static site hosting are built on S3 and Cloudfront and charge you a mark-up.

The reason why developers don't often use plain AWS S3 and AWS Cloudfront is because the experience of using them is just too darn complicated, compared to other offerings.

However, this is where Serverless Framework comes in.  It brings a great developer experience to all infrastructure providers, especially infrastructure with auto-scaling, pay-per-use, AKA "serverless" qualities.


### Set-Up

Before doing anything, you will need to have an AWS account.  You must have a credit card to sign up, though you will not be charged until you go over the free tier limits.

Next, log into AWS, navigate to the IAM dashboard to create access keys that the Serverless Framework will use to provision the infrastructure needed for your React website.

Go to "Users", and click "add user".  Give it a name that includes serverless-framework then click enable "Programmatic Access", and click "Next".  

Select "Attach existing policies directly".  Check the box next to "AdministratorAccess".  Hit "Next" and "Next" again to skip the tags screen, then hit "Create".

Note:  Later, you may want to scope down these permissions so the Serverless Framework will the least amount of access necessary.  Though, this can be complex because the Serverless Framework uses many AWS services.  To give you a helping hand here, the Website Component currently uses S3, Certificate Manager, Cloudfront and Route53, and needs access specifically for those.

Copy the "Access Key ID" and the "Secret Access Key".  You will need them in second... 

Now, it's time for the fun Serverless Framwork part.

Make sure you have [Node.js](https://nodejs.org/en/download/) installed.  Then, install the Serverless Framework via NPM and add the global flag `-g`.

```bash
$ npm i -g serverless
```

Make sure you have Serverless Framework version 1.49 or later installed.  Hint:  If you're installing it right now, you will.

We're going to use a Website template that has all of the scaffolding you need to get started quickly.  It's a complete boilerplate.  Install the Website template using this command.

```
$ serverless create --template-url https://github.com/serverless/components/tree/master/templates/website
```

This will create a `website` folder for you.

Go into that folder and install the React dependencies via npm by running `npm i`.

```
$ npm i
```

Also in the `website` folder, create a file named `.env` and paste in your AWS Keys, formatted like this:

```text
AWS_ACCESS_KEY_ID=A92JA098J10FAJ10JAAFASF
AWS_SECRET_ACCESS_KEY=fJajajaf0919jIJFJA7813hAAFJHL
```

You're done with set-up.  It's time to start development!

### Development

This project uses React and Parcel for building and bundling the application.

You can also run the application locally with Parcel using this command:

```
$ npm run start
```

Now, you can develop rapidly.

### Deployment

Out of the box, the Website template should be ready to deploy.

If you look at your `serverless.yml` file, you will see a Serverless Compont in it titled "website".  A Serverless Component is simply code that knows how to deploy the cloud infrastructure needed to create a specific outcome or use-case.

Serverless Components are open-source and you can use them to easily deploy lots of use-cases on serverless cloud infrastructure.  [Check them out here](https://www.github.com/serverless/components).

Every Serverless Component has an `inputs` property, which allows you to configure the use-case that the Component will provision.  For example, here you can see the `src` input that points to the directory containing your website assets.  As well as a `hook` to call in order to build your website before deployment. This way, you don't have to run the build script before deploying, it just happens automatically.

Alright, let's get to the deployment part!

To deploy your React app, in your website folder, simply run the `serverless` command.

```bash
$ serverless
```

Your website should deploy in less than a minute and you should get URL pointing to your live website!.  

The first deployment always takes the longest because creating cloud infrastructure resources can be more time-consuming than updating them.

**Setting Up A Custom Domain, Cloudfront & SSL Certificate**

To set up your custom domain, your Cloudfront CDN and an SSL certificate, you will need to do one manual step: you must log into your AWS account and purchase your domain.  Currently, the Website Component only works with domains purchased on AWS Route53.  Within the next few weeks, we will enable support for existing domains registered on different registrars.

Go to AWS Route53's dashboard, egister your domain and wait for the registration to complete.  This could take up to an hour.  Once it has completed, simply add in the custom domain to the Website Component's inputs.

Run `serverless` again and it will acknowledge the new `input` and set up your custom domain, Cloudfront & SSL Certificate.

You will need to wait for your new domain to propogate to the DNS servers around the world. This may take up to an hour as well. Once it's available, you will be able to see it live, as well as any changes you make.

Every time you run `serverless` to deploy changes to your website, the Website Component invalidates the assets you have cached in AWS Cloudfront. This enables you to see changes almost immediately.

### State Management

Currently, Serverless Components do not have remote state management.  This is coming within a month.  Until then, make sure you push the `.serverless` directory to Github, since it contains state info about the cloud infrastructure resources that have been deployed for your website.

### Adding A Serverless API Backend, Database & More

If you want to go further and build out a fullstack application just as easily as this website, check out [the fullstack application template](https://github.com/serverless/components/tree/master/templates/fullstack-application).  This will give you everything you need to deliver a fast, cheap and global entire serverless application.

Enjoy!
