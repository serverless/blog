---
title: "Run Serverless Functions at half the cost with Spotinst & Serverless Framework"
description: "Using the Spotinst provider integration for serverless you can run multi-region, cross-cloud functions at 50-80% the cost"
date: 2017-09-06
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-thumb.png
authors:
  - DavidWells
---

We've seen it time and time again: companies get tremendous cost savings when they port over into the serverless realm.

**Some real world examples:**

- <a href="https://medium.freecodecamp.org/how-i-cut-my-aws-bill-by-90-35c937596f0c" target="_blank">How I cut my AWS bill by 90% by going serverless</a>
- <a href="https://www.infoq.com/news/2016/08/serverless-autodesk" target="_blank">Costs a small fraction (~1%) of the traditional cloud approach</a>
- <a href="https://medium.com/@PaulDJohnston/aws-lambda-9-million-api-calls-for-1-1134243c55d7" target="_blank">AWS Lambda: 9 million API calls for $1</a>

What if I told you...it just got even cheaper?  

## Serverless & Spotinst team up

Introducing the latest serverless provider integration, [Spotinst](https://spotinst.com/products/spotinst-functions/).

<img align='right' width="300" src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/sls-and-spotinst.png"/>

[Spotinst Functions](https://spotinst.com/products/spotinst-functions/) enables users to deploy multi-cloud functions at Spot Prices. By leveraging spot instances, you could **save 50 to 80%** over standard serverless FaaS pricing.

### Spotinst supported runtimes

Spotinst currently supports Node (4, 6, & 8.3), Java, Python, Ruby, Go as function runtimes.

### Cross-cloud deployments

Spotinst functions can be deployed simultaneously in AWS, Azure and Google Cloud Platform.

This ability to deploy across clouds improves SLA and offers higher function availability. If one cloud provider goes down (or pricing is cheaper elsewhere), Spotinst handles this for you under the hood.

<img src="https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/multi-cloud-multi-region-functions.jpg" />

### Edge location support

Reduce data transfer costs with edge location support. Unlike other edge FaaS solutions, Spotinst Functions doesn’t have limitations on external api calls or execution time limits.

They are currently supporting 15 different locations around the US and 10+ locations in APAC, SEA & Europe.

### Function Analytics

- Invocation count & latency metrics, errors & HTTP response codes analytics
- Geo Location analytics
- Easy log debugging

### Pricing Example (Compute Only):

Lets see how pricing stacks up with an example.

With 500,000 Requests per Minute (21,600,000,000 Monthly) with 256MB of RAM & <10ms execution time, the prices would break down like so:

- Google Functions: **~$10,000 compute time**
- Amazon Lambda: **~$9,000  compute time**
- Microsoft Azure: **~$8,500**
- IBM Bluemix (Open Whisk): **~$9,000**
- Spotinst Functions: **~$2,000 (!)**

## Demo

<iframe width="560" height="315" src="https://www.youtube.com/embed/SZm7SlT3EIQ" frameborder="0" allowfullscreen></iframe>

## Getting started

Here’s what you need to get started with the Spotinst plug-in now:

[Start here](/framework/docs/providers/spotinst/guide/quick-start/) in our docs.

- [GitHub repo](https://github.com/spotinst/serverless-spotinst-functions)
- [Spotinst Docs](https://serverless.com/framework/docs/providers/spotinst/)
- [Spotinst Functions Homepage](https://spotinst.com/products/spotinst-functions/)
- Ping us on [@goserverless](https://twitter.com/goserverless) or [@spotinst](https://twitter.com/spotinst)

Or continue reading for step by step instructions on how to set up and deploy your first service on Spotinst.

Pre-requisites: Make sure you have the latest version of serverless installed on your machine.

```bash
# install serverless in your command line
npm install serverless -g
```

### 1. Sign up for Spotinst Account

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/1._Sign_up_for_SpotInst_Account.jpg "1._Sign_up_for_SpotInst_Account.jpg")

You can [sign up for a Spotinst account here](https://console.spotinst.com/#/auth/signUp)

### 2. Head into the functions console

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/2._Head_into_the_functions_console.jpg "2._Head_into_the_functions_console.jpg")

Inside of Spotinst, head into the [Functions console](https://console.spotinst.com/functions).

[https://console.spotinst.com/functions](https://console.spotinst.com/functions)

### 3. Create a new Spotinst application

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/3._Create_a_new_SpotInst_application.jpg "3._Create_a_new_SpotInst_application.jpg")

Create a new app and give it a name.

An `application` in Spotinst is a logical group of several environments. Most commonly, it stores environments that share the same business application (e.g., testing and production of a specific function). More on Spotinst applications [in the Spotinst docs](https://help.spotinst.com/hc/en-us/articles/115004156989-Application)

### 4. Create a new environment in the Spotinst application

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/4._Create_a_new_environment_in_the_SpotInst_application.jpg "4._Create_a_new_environment_in_the_SpotInst_application.jpg")

Name the Environment and choose which regions and providers you want to run the function in.

This is where you can choose to run your function across cloud providers and within multiple regions. 🎉

Inside Spotinst, the `environment` refers to a configuration group that contains actual Functions. [Learn more in the spotinst docs](https://help.spotinst.com/hc/en-us/articles/115004157229-Environment)

### 5a. Grab an API token in Spotinst settings

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/5a._Grab_an_API_token_in_Spotinst_settings.jpg "5a._Grab_an_API_token_in_Spotinst_settings.jpg")

Now head into spotinst setting. We need to grab an API key!

### 5b. Generate Spotinst API token

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/5b._Generate_Spotinst_API_token.jpg "5b._Generate_Spotinst_API_token.jpg")

Click on API in settings and then on Generate Token. [Generate SpotInst API tokens here](https://console.spotinst.com/#/settings/tokens/permanent)

### 5c. Name your API token

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/5c._Name_your_API_token.jpg "5c._Name_your_API_token.jpg")

Name your token and click generate.

https://console.spotinst.com/#/settings/tokens/permanent

### 5d.Copy Token for `sls credentials`

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/5d.Copy_Token_for__sls_credentials_.jpg "5d.Copy_Token_for__sls_credentials_.jpg")

Now copy the token, we will need to use it with the `sls config credentials` command in our terminal.

https://console.spotinst.com/#/settings/tokens/permanent

### 6. Grab Account Id

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/6._Grab_Account_Id.jpg "6._Grab_Account_Id.jpg")

We also need your Spotinst account ID. You can grab that here: https://console.spotinst.com/#/settings/account/general

### 7. Use `sls create` and create a Spotinst service

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/7._Use__sls_create__and_create_a_Spotinst_service.jpg "7._Use__sls_create__and_create_a_Spotinst_service.jpg")

Back in your terminal, create a new Spotinst service.

### 8. Configure your Spotinst credentials on your machine

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/8._Configure_your_Spotinst_credentials_on_your_machine.jpg "8._Configure_your_Spotinst_credentials_on_your_machine.jpg")

```bash
sls config credentials -p spotinst -t hhhhhhhh -a act-73192739
```

### 9a. Grab environment ID from Spotinst UI

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/9a._Grab_environment_ID_from_Spotinst_UI.jpg "9a._Grab_environment_ID_from_Spotinst_UI.jpg")

You will need your spotInst environment ID from the UI to deploy your functions.

[Grab the environment ID](https://console.spotinst.com/functions/explorer/) and drop it in the serverless.yml of the service.

### 9b. Add your SpotInst environment key to serverless.yml

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/9b._Add_your_SpotInst_environment_key_to_serverless.yml.jpg "9b._Add_your_SpotInst_environment_key_to_serverless.yml.jpg")

### 10. Deploy your functions

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/10._Deploy_your_functions.jpg "10._Deploy_your_functions.jpg")

Run `serverless deploy`

The serverless framework will read your config from `serverless.yml`, package up the function and deploy the code to your Spotinst function environment

### 11. Get info about service

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/11._Get_info_about_service.jpg "11._Get_info_about_service.jpg")

Run `sls info` for information and live endpoints of your service.

### You can view your functions in UI

![](https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/spotinst-post/You_can_view_your_functions_in_UI.jpg "You_can_view_your_functions_in_UI.jpg")

or via the `sls info` command in your terminal.

## Multi-Cloud & Multi-region functions

🎉 Congrats you are now leveraging spot instance prices and running your functions across multiple clouds.

If you have questions or comments about the integration, we'd love to hear from you in the comments below or over on the [serverless forums](https://forum.serverless.com/).
