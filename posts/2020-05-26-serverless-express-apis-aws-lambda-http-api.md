---
title: Serverless Express – Easy APIs On AWS Lambda & AWS HTTP API
description: "Serverless Express enables you to easily host Express.js APIs on AWS Lambda and AWS HTTP API"
date: 2020-05-26
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-express-thumbnail.png"
authors:
  - AustenCollins
category:
  - news
---

**TLDR -** Take existing Express.js apps and host them easily onto cheap, auto-scaling, serverless infrastructure on *AWS Lambda* and *AWS HTTP API* with **[Serverless Express](https://github.com/serverless-components/express)**.  It's packed loads of production-ready features, like custom domains, SSL certificates, canary deployments, and costs **~$0.000003** per request.

If you simply want to host a common **Express.js** Node.js application, have it auto-scale to billions of requests, and charge you only when it's used, we have something special for you...

Announcing **[Serverless Express](https://github.com/serverless-components/express)**, a Serverless Framework offering enabling you to easily host and manage Express.js applications on AWS Lambda and the new AWS HTTP API, which is 60% faster and 71% cheaper than their initial API Gateway product.

Serverless Expess is a pure Express.js experience and **it's perfect for those that want to focus on apps, not infrastructure complexity**.

Here are the highlights:

- **Easy, Safe, Performance** - Includes the optimal infrastructure pattern for cost, performance & scale.
- **Never Pay For Idle** - No API requests?  No cost.  Averages ~$0.000003 per request.
- **Zero Configuration** - Add your Express app, then deploy (advanced config options are available).
- **Fast Deployments** - Deploy changes to the cloud in seconds.
- **Real-time Logging** - Rapidly develop on the cloud w/ real-time logs and errors in the CLI.
- **Canary Deployments** - Deploy your app gradually to a subset of your traffic.
- **Custom Domain + SSL** - Auto-configure a custom domain w/ a free AWS ACM SSL certificate.
- **Team Collaboration** - Collaborate with your teamates with shared state and outputs.

Here is how to get started and deliver a Serverless Express.js based API with a custom domain, free SSL certificate and much more!  You can also check out our **[Serverless Fullstack Application](https://github.com/serverless-components/fullstack-app)** boilerplate, which includes Serverless Express in a real-world example that features a database, website using React and more.

# Set-Up

Serverless Express is a [Serverless Framework Component](https://github.com/serverless/components) (i.e premium experiences for popular serverless use-cases) and you'll need to install Node.js and the Serverless Framework CLI to use it.

Install Node.js here.

Then run this command to install Serverless Framework.

```
npm i -g serverless
```

Next, install the Serverless Express template:

```
serverless create --template-url https://github.com/serverless/components/tree/master/templates/express
```

Lastly, Serverless Express deploys onto your own Amazon Web Services account, so you'll need Access Keys to an AWS account you own.  [Follow this guide to create those](https://www.serverless.com/framework/docs/providers/aws/guide/credentials/).

After you have created AWS Access Keys you can add them directly to an `.env` file, or reference an AWS Profile in a `.env` file, within the root of the template you installed.

```
AWS_ACCESS_KEY_ID=123456789
AWS_SECRET_ACCESS_KEY=123456789
```

You can also reference an AWS Profile in a `.env` file like this.  

```
AWS_PROFILE=default
```

If you don't include a `.env` file, the Serverless Framework will automatically look for a `default` AWS Profile in the root folder of your machine.

Also, Serverless Framework has a built-in `stages` concept.  If you change the `stage` it will deploy a totally separate copy of your serverless application.

```yaml
# serverless.yml

component: express@1.0.8
name: express-api
stage: prod
```

Even better, you can use different `.env` files for each `stage` by simply using this convention:

```
.env # all stages
.env.dev # "dev" stage
.env.prod # "prod" stage
```

One last—often overlooked—step is to install the Express.js dependency, by running `npm i` in the template.

# Deployment

Now, you are ready to deploy.  The template should work out-of-the-box, so run this command to get up and running...

```
$ serverless deploy
```

Serverless Express will provision all of the infrastructure and upload your code to it, in a matter of seconds.  Though, the first deployment always takes longer than the rest.

You should see your teminal return the following:

![Serverless Framework Express.js](https://s3.amazonaws.com/assets.github.serverless/components/serverless_express_cli_deploy.gif)

# Development

Most like to run their Express app locally, and you can absolutely boot up your Express app locally, as you always would.  

However, local emulations are never the same as running it on real serverless infrastructure, resulting in surprising bugs when you push to production.  

Further, you will most likely end up using other cloud resources with your Express.js API, and you want to be sure everything works together well.

So we *wholeheartedly* recommend you develop on the real cloud environment (AWS Lambda)—and Serverless Express comes with some powerful features to help you do that, via an experience that looks and feels local.

Serverless Express features fast deployments and real-time logging from your live AWS Lambda.  To get started, simply run:

```
$ serverless dev
```

Now, every time you save, your Serverless Express will quickly push your changes to the cloud.  Further, if all API requests, log statements and errors will stream into your terminal.  It should look like this:

![Serverless Framework Express.js](https://s3.amazonaws.com/assets.github.serverless/components/serverless_express_cli_dev_mode.gif)

# Advanced Configuration

Serverless Express may be easy, but that does not mean it isn't powerful or customizable.  It features the best possible defaults, but when you are ready for more, there is a ton of possibility.

This tutorial was written with Serverless Express version 1.0.8, which at the time of writing, supports all of the following configuration options.

There is a ton of possibility here!

```yaml
component: express@1.0.8         # (required) name of the component. In that case, it's express.
name: express-api                # (required) name of your express component instance.
stage: dev                       # (optional) serverless dashboard stage. default is dev.

inputs:
  src: ./                        # (optional) path to the source folder. default is a hello world app.
  memory: 512                    # (optional) lambda memory size.
  timeout: 10                    # (optional) lambda timeout.
  description: My Express App    # (optional) lambda & api gateway description.
  env:                           # (optional) env vars.
    DEBUG: 'express:*'           #            this express specific env var will print express debug logs.
  roleName: my-custom-role-name  # (optional) custom AWS IAM Role name for setting custom permissions.
  traffic: 0.2                   # (optional) traffic percentage to apply to this deployment.
  layers:                        # (optional) list of lambda layer arns to attach to your lambda function.
    - arn:aws:first:layer
    - arn:aws:second:layer
  domain: api.serverless.com     # (optional) if the domain was registered via AWS Route53 on the account you are deploying to, it will automatically be set-up with your Express app's API Gateway, as well as a free AWS ACM SSL Cert.
  region: us-east-2              # (optional) aws region to deploy to. default is us-east-1.
```

# Setting Up A Custom Domain Registered With AWS Route53 & SSL Certificate

Here's how to easily set up a custom domain and SSL certificate on AWS Route53.  You can also follow the next section to add a custom domain registered outside of AWS Route53.

To set up a custom domain purchased on AWS Route53, make sure you it is in a "registered" status and within the same AWS account your Express.js application is running in.

Once this domain's status goes from "pending" to "registered", simply add the following configuration to your `serverless.yml`...

```yaml
inputs:
  src: ./
  domain: mydomain.com   
```

Serverless Express will then add your custom domain to your API as well as automatically set-up an SSL certificated with it, so that you can have a production-ready Express.js API.

Don't forget to use `.env` files for different `stages` to use different domains for different environments. 

```yaml
# serverless.yml

domain: ${env:domain}
```

```
# .env.dev
# .env.prod

domain=api.webapp.com
```

```yaml
$ serverless deploy --stage prod
```

# Setting Up A Custom Domain Registered Outside Of Route53 & SSL Certificate

If your domain is not on AWS Route53, you will have to set this up manually because the component does not have access to your registrar. Here are the general steps involved:

1. Create an AWS ACM certificate for your domain. Make sure you set the "Additional Names" field to `*.yourdomain.com` as well to include all subdomains as well.

2. After you create the certificate, it should be in a `PENDING_VALIDATION` status. Now you will need to validate your domain. We suggest you follow the DNS steps by adding the validation CNAME record you see on the AWS console to your domain via your registrar dashboard.

3. After you add the validation record, it might take a while, but eventually the certificate should change status to `ISSUED`. Usually it takes around 5 minutes.

4. Add your domain to the `serverless.yml` file as shown above and deploy. This step is important as it adds your domain to API Gateway.

5. Notice the regional url that is returned as an output. Copy this URL, get back to your registrar and add another CNAME record with your domain or subdomain name and a value of this regional url. This ensures that your domain points to that cloudfront URL.

6. After around 20 mins, your SSL certificate and domain should all be working and pointing to your URL. Keep in mind that if you change the `name`, `stage`, `app` or `org` properties in `serverless.yml`, this would result in a completely new instance with a new cloudfront url. This allows you to setup different domains for each stage or instance


# Bundling Your Express App (Webpack, etc.)

By reducing your code size, your Express app will actually perform better in the AWS Lambda environment, resulting in a faster API.  A great way to reduce your code size is to bundle it with Webpack, Parcel, or others.

To do this, you can modify the `src` input to run a `hook` script before deployment, like this:

```yaml
inputs:
  src:
    src: ./
    hook: npm run build
    dist: ./dist
```

# Canary Deployments

At scale, when you want to push changes out to a small set of users, Serverless Express offers easy Canary Deployments out of the box!

This enables you to push out a version of your app (containing code changes you deem risky) which is only served to a percentage of traffic that you specificy (0-99%).  This allows you to test big changes with little risk.

To perform a canary deployment, first update your code with the potentially risky change.  

Next, set a traffic weighting in your `serverless.yml` `inputs`:

```yaml

inputs:
  src: ./
  traffic: 0.5 # 50%

```

This tells Serverless Express to serve the new (potentially risky) code to 50% of the API requests, and the old (stable) code to the other 50% of requests.

Run `serverless deploy`.  After deployment is complete, 50% of your requests will be randomly handled by the new experimental code.

You can slowly increment the percentage over time, just continue to re-deploy it.

If things aren't working, revert your code to the old code, remove the `traffic` configuration option, and deploy.

If things are working, keep the new code, remove the `traffic` configuration option, and deploy.

# Wrapping Up

Our goal is to offer the best Serverless Express.js experience possible.  We have packed years of serverless experience into Serverless Express so you and your team don't have to configure, manage and automate the underlying infrastructure, and we've barely touched on the tremendous power Serverless Express offers. 

As always, you should focus on your application, not infrastructure.  That is the Serverless Way!

If you want to learn more, check out these resources:

**[Serverless Express](https://github.com/serverless-components/express)** - This is the repo for Serverless Express and it contains lots of additional documentation.

**[Serverless Components](https://github.com/serverless/components)** - You will most likely want to include a database, custom permissions role, website and more with your Express.js app.  Composition of serverless infrastructure is what Components are all about, so check out all of the neat things you can do via the Components Documentation.

**[Serverless Fullstack Application](https://github.com/serverless-components/fullstack-app)** - Here is a real-world example of how to use Serverless Express within the context of a fullstack application that features a database, website, authentication, authorization and more.  It's a great starting point.
