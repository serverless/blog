---
title: "Easily Deploy A Serverless CDN With Serverless Components"
description: "How to easily deploy a serverless content delivery network (CDN) using Serverless Components."
date: 2019-08-21
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cdn-with-components/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cdn-with-components/header.png"
category:
  - guides-and-tutorials
authors:
  - EslamHefnawy
---

Two weeks ago we released a complete solution for deploying serverless websites that supports custom domain, SSL & CDN in a single [website component](https://github.com/serverless-components/website). Since then we've received great feedback about related use cases of the underlying infrastructure and we realized there is a need for a standalone content delivery network solution to serve your static assets, even if they're not directly related to your website.

Today we're releasing the zero-config [Serverless CDN component](https://github.com/serverless-components/cdn) to serve that exact use case. Just like the [website component](https://github.com/serverless-components/website), it supports secure SSL-enabled custom domains and is powered by AWS S3, AWS CloudFront, AWS Route53 & AWS Certificate Manager. All can be deployed with **only 2 lines of YAML**.

#### Deploying the Serverless CDN Component

To deploy the [Serverless CDN component](https://github.com/serverless-components/cdn), you'll need to first install the latest version of the Serverless Framework if you haven't done that already.

```
npm i -g serverless
```

Once installed, make sure you have set your AWS keys in your machine. For more info regarding setting AWS keys, [checkout this guide](https://github.com/serverless/components#credentials).

Once you're done with that, you'll have over [30 serverless components](https://github.com/serverless-components) that you can instantly deploy with a single YAML file. In this article, we will focus on the [Serverless CDN component](https://github.com/serverless-components/cdn). To deploy the [Serverless CDN component](https://github.com/serverless-components/cdn), just create a `serverless.yml` template file in the current working directory. This YAML template file should have the following content:

```yml
myServerlessCDN:
  component: "@serverless/cdn"
```

That's literally all the YAML you need to deploy a complete serverless content delivery network. All you need to do now is just run the `serverless` command in the current working directory:

```
myApp (master)$ serverless

  myServerlessCDN:
    bucketName: 9c7hh2-f1swq5c
    region:     us-east-1
    url:        https://d29sqymsceo6j1.cloudfront.net

  18s › myServerlessCDN › done

myApp (master)$
```

There you have it! Your Serverless CDN has been deployed. It may take a few minutes for AWS CloudFront to propagate across edge locations and be completely ready. While this is happening, you can upload your first file to your CDN. Just visit the AWS S3 console, find the bucket that is shown in the CLI outputs (in this case it's `9c7hh2-f1swq5c`) and upload your first file to it. You may of course do that programatically from your application. Also keep in mind that visiting the root URL shown in the CLI will likely show an error because you don't have any content in your CDN.

After you upload your first file, you can request & view this file via your CDN by prefixing the root URL you see in the CLI. In this case that would be:

```
https://d29sqymsceo6j1.cloudfront.net/my-first-image.png
```

#### Adding a Custom Domain to Your Serverless CDN

Just like the [website component](https://github.com/serverless-components/website), you can add your own custom domain to your content delivery network with a single input.

```yml
myServerlessCDN:
  component: "@serverless/cdn"
  inputs:
    domain: cdn.example.com
```

Please note that your domain (`example.com` in this example) must have been purchased via AWS Route53 and available in your AWS account. For advanced users, you may also purchase it elsewhere, then configure the name servers to point to an AWS Route53 hosted zone. How you do that depends on your registrar.

To deploy your custom domain, just run `serverless` again:

```
myApp (master)$ serverless

  myServerlessCDN:
    bucketName: 9c7hh2-f13wq5c
    region:     us-east-1
    url:        https://d29sqymsceo6j1.cloudfront.net
    domain:     https://cdn.example.com

  14s › myServerlessCDN › done

myApp (master)$
```

You'll now notice there's a new `domain` output in the CLI and that it's already SSL-enabled and completely secure by default, as the [Serverless CDN component](https://github.com/serverless-components/cdn) creates a free certificate for you automatically via AWS Certificate Manager. If this is the first time you use your domain with AWS, deployment may take a while during certificate creation and validation.

You may now use this domain instead of the root CloudFront URL we used earlier to access our file. Again, keep in mind that domain propagation may take a few minutes:

```
https://cdn.example.com/my-first-image.png
```

#### Composing Your Serverless CDN with Other Components

As mentioned before, the Serverless CDN is just one of [30+ components we already have available for you](https://github.com/serverless-components). You will likely need to use this serverless content delivery network with other components of your application (for example the [backend component](https://github.com/serverless-components/backend)) to be able to dynamically upload files from your backend to the bucket that was created for you. For a full stack application, your YAML file may look something like this:

```yml
website:
  component: "@serverless/website"
  inputs:
    code:
      src: ../website
    domain: www.example.com

backend:
  component: "@serverless/backend"
  inputs:
    code:
      src: ../backend
    domain: api.example.com
    # dynamically passing the bucket name output to the backend as an environment variable
    env:
      CDN_BUCKET: ${cdn.bucketName}

cdn:
  component: "@serverless/cdn"
  inputs:
    domain: cdn.example.com
```

Checkout the docs for the [backend component](https://github.com/serverless-components/backend) and the [website component](https://github.com/serverless-components/website) for more information.

#### Using the Serverless CDN Component in Your Own Custom Component

If you're building [your own custom component](https://github.com/serverless/components#building-components), we've also created a custom `upload` function that you can use to directly upload files to your bucket, without even knowing the bucket name. Here's an example on how this might look like:

```js
// serverless.js
const { Component } = require("@serverless/core");

class myCustomComponent extends Componetn {
  async default(inputs = {}) {
    // ...your custom component default logic here

    // load the @serverless/cdn component
    // must be in your package.json file
    const myCdn = await this.load("@serverless/cdn", "myCdn");

    // deploy your serverles CDN
    const myCdnOutputs = await myCdn({ domain: "cdn.example.com " });

    // upload a single file to your CDN
    await myCdn.upload({ file: "./assets/my-image.png" });

    // or upload an entire directory like a boss!
    await myCdn.upload({ dir: "./assets" });
  }
}

module.exports = myCustomComponent;
```

Needless to say, you must deploy your [Serverless CDN component](https://github.com/serverless-components/cdn) before you're able to use the `upload` function as it stores the required CDN data in the state.

#### Wrapping up

In this article, we've seen how you can deploy a zero-config Serverless CDN, and adding your own custom domain to it using the [Serverless CDN component](https://github.com/serverless-components/cdn). We've also seen how you could use this CDN component in your existing application by composing it with other [serverless components](https://github.com/serverless-components), and finally, we demonstrated how you could use this [Serverless CDN component](https://github.com/serverless-components/cdn) as a child component in [your own custom component](https://github.com/serverless/components#building-components) and how you could utilize the custom `upload` function we're exposing to [your custom component](https://github.com/serverless/components#building-components) to easily upload files and directories to your new serverless content delivery network.

We hope you will find this [Serverless CDN component](https://github.com/serverless-components/cdn) useful for your application, and we can't wait to see what you'll do with it. If you have any questions, feedback or showoffs (we love those!), [feel free to contact me directly on Twitter](https://twitter.com/eahefnawy).

Go Serverless!
