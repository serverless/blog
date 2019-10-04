---
title: "Announcing Serverless Framework Support for Alibaba Cloud"
description: "Learn how to deploy your first microservice in the Alibaba Cloud with the Serverless Framework."
date: 2019-10-08
thumbnail: ""
heroImage: ""
category:
  - news
authors:
  - FernandoMedinaCorey
---

# Overview

Today we're excited to announce Serverless Framework support for the biggest public cloud provider in the most populous in the world - Alibaba Cloud (Aliyun). 

As we continue our push towards more vendor choice with [Twilio](https://serverless.com/blog/serverless-and-twilio/) and new improvements to the [Microsoft Azure](https://serverless.com/blog/serverless-azure-functions-v1/) integration we are excited to offer developers everywhere a chance to use the Alibaba Cloud plugin to deploy to Alibaba Cloud regions in China and around the world.

This will allow organizations with customers or users inside China or other parts of East Asia and the Pacific to build geographically-proximate serverless applications. Organizations with previous Serverless Framework experience can use the framework they're used to while adopting features and services of Alibaba Cloud.

# Deploying Our First Alibaba Cloud Microservice

Let's take a look at how you can get started working with Alibaba Cloud by deploying our first hello world microservice.

## Setup Your Credentials

First, you'll need to create an Alibaba Cloud account and get setup with some credentials.

1. [Create an Alibaba Cloud Account](https://alibabacloud.com/help/doc-detail/50482.htm)
2. [Add your billing information](https://www.alibabacloud.com/help/doc-detail/50517.htm)
3. **Importantly** - If you are trying to deploy any services or applications in a Mainland China region you will need to also do a third step for [real name registration](https://www.alibabacloud.com/help/doc-detail/52595.htm). To avoid these requirements, you can deploy to a region outside of Mainland China such as `us-west-1`.
4. After these initial setup steps you will need to activate all the services that you will need for your first microservice.
	- [Resource Access Management](https://www.alibabacloud.com/product/ram)
	- [Log Service](https://www.alibabacloud.com/product/log-service)
	- [API Gateway](https://www.alibabacloud.com/product/api-gateway)
	- [Object Storage Service](https://www.alibabacloud.com/product/oss)
	- [Function Compute](https://www.alibabacloud.com/products/function-compute)

5. With all of these activated, you can then [create a RAM user](https://www.alibabacloud.com/help/doc-detail/28637.htm). Make sure that you create one with Programmatic Access so that you will be given an Access Key and Access Key Secret - be sure to save these values for later.
6. When the user is created, [add permissions](https://www.alibabacloud.com/help/doc-detail/28653.htm) for that user that include the following policies:
	- AliyunOSSFullAccess
	- AliyunRAMFullAccess
	- AliyunLogFullAccess
	- AliyunApiGatewayFullAccess
	- AliyunFCFullAccess
7. With that user created and permissions added, copy down the Account ID value for your Alibaba Cloud account from the [Security Settings page](https://account.console.aliyun.com/#/secure).
8. Finally, create a file containing the Alibaba Cloud credentials that you have collected:
	```ini
	[default]
	aliyun_access_key_secret = <collected in step 5>
	aliyun_access_key_id = <collected in step 5>
	aliyun_account_id = <collected in step 7>
	```
	Save this file somewhere like `~/.aliyuncli/credentials`. But make sure you remember the path for later.

## Setup the Demo Application

Now that we have the credentials, let's get started setting up our microservice. First, make sure you've already installed npm and node.js. You'll also need the Serverless Framework, which you can install with `npm i -g serverless`. 

To get the demo, run: 

`serverless install --url https://github.com/aliyun/serverless-function-compute-examples/tree/master/image-crawler-python`

This demo will deploy a microservice that is designed to take an incoming URL, crawl the URL for image links, and then download the links to Alibaba Cloud's Object Storage Service (OSS). When the demo is finished cloning, run `cd image-crawler-python`. Run `ls` in that directory and you should see something like this:

```
├── README.md
├── index.py
├── package.json
└── serverless.yml
```

Next, you'll need to install the Alibaba Cloud plugin with:

`serverless plugin install --name serverless-aliyun-function-compute`

After this, you will want to open up the `serverless.yml` file and make a few changes. First, make sure that the provider section accurately refers to where you put your `credentials` file.
```
provider:
  . . .
  credentials: ~/.aliyuncli/credentials
```

Next, if you have not gone through the [real name registration](https://www.alibabacloud.com/help/doc-detail/52595.htm) process mentioned above you should select a region outside of mainland China to deploy your microservice into. You can add that region to the `provider` section of your `serverless.yml` configuration:

```
provider:
  name: aliyun
  region: us-east-1
  runtime: python2.7
  credentials: ~/.aliyuncli/credentials
```

After saving the `serverless.yml` file with these changes you can run `serverless deploy` and see your application created inside of the Alibaba Cloud! The logs should include an API URL which you can test using curl or Postman. Just remember to replace the `http://999999example123123-us-east-1.alicloudapi.com/crawl` in the command below with your API url. 

```bash
curl -d '{"url": "https://serverless.com/blog/"}' -H "Content-Type: application/json" -X POST http://999999example123123-us-east-1.alicloudapi.com/crawl
```

You should see a response like this:
```json
{"result": "Download success, total pictures:11. Please check your images here: https://oss.console.aliyun.com/bucket/oss-us-east-1/sls-5111111111112222-us-east-1/object"}
```

If you do, congrats! You've just deployed your own microservice into the Alibaba Cloud and used it successfully! You can sign into Alibaba Cloud and visit the OSS management console and see your images. Now, before you deploy this into production, just keep in mind this is a simple demo that didn't implement any type of authorization. Anyone with your API URL could POST pages to crawl. So, if you'd like to remove the service when you're done testing it out, you can run `serverless remove`. 

Finally, if you're interested in (re)deploying the service to alternate regions you can also use the `--region` flag with the deploy command. For example, to deploy to Hong Kong you could use: `serverless deploy --region cn-hongkong`.

If you'd like to help guide the development of this plugin check out the [GitHub repo](https://github.com/aliyun/serverless-aliyun-function-compute). If you'd like to learn more about using the Framework with Alibaba Cloud, check out [the documentation](https://serverless.com/framework/docs/providers/alibaba-cloud/events/). 

## Takeaways

Using Alibaba Cloud's Function Compete gives you access to the same serverless characteristics we love, like pay-as-you-go pricing, auto-scaling, and event triggers. You also have the ability to program in a variety of languages including node.js, Python, PHP, and Java. 

We think this is an exciting addition to the growing number of cloud providers you can choose from to build your Serverless Framework applications and we hope to give developers continued access to the best cloud providers and best services.
