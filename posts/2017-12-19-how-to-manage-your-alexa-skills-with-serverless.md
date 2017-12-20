---
title: How To Manage Your Alexa Skills With Serverless
description: How to totally manage Alexa Skills and Lambda functions with Serverless Framework + Serverless Alexa Skills Plugin
date: 2017-12-19
layout: Post
thumbnail: https://raw.githubusercontent.com/marcy-terui/serverless-alexa-skills/master/images/serverless-alexa-skills.png
authors:
  - MasashiTerui
---

# Introduction

Serverless Framework is the best solution to develop AWS Lambda Function for Alexa Skills.

We can control our Lambda Functions completely using Serverless Framework. But we can't control our Alexa Skills by Serverless Framework.

Both the webapp of Alexa Skills Kit and [ask-cli](https://www.npmjs.com/package/ask-cli) doesn't have the simplicity like Serverless Framework. I'm so stressed!

However, Serverless Framework has a great plugin system and we can solve it with the power of the community!

# Overview
[Serverless Alexa Skills Plugin](https://github.com/marcy-terui/serverless-alexa-skills) is a plugin to integrate Alexa Skills into Serverless Framework. We can control the manifest and interaction model of Alexa Skills using `sls` command and `serverless.yml`!

# How to use

## Installation
Serverless Alexa Skills Plugin is hosted by npm.

```
$ npm install -g serverless
$ sls plugin install -n serverless-alexa-skills
```

## Get your credentials
You should get the credentials for `Login with Amazon`. `Login with Amazon` is a OAuth2.0 single sign-on system using your Amazon.com account.

First, Login to [Amazon Developer Console](https://developer.amazon.com/). And go to ` Login with Amazon` from `APPS & SERVICES` and create a new security profile at `Create a New Security Profile`.

![](https://raw.githubusercontent.com/marcy-terui/serverless-alexa-skills/master/images/developer_console.png)

Please enter each item freely.

![](https://raw.githubusercontent.com/marcy-terui/serverless-alexa-skills/master/images/create_security_profile.png)

Go to `Web Settings` of the new security profile.

![](https://raw.githubusercontent.com/marcy-terui/serverless-alexa-skills/master/images/security_profile_menu.png)

`Allowed Origins` can be empty. Enter `http://localhost:3000` in` Allowed Return URLs`. This port number can be changed with `serverless.yml`.

![](https://raw.githubusercontent.com/marcy-terui/serverless-alexa-skills/master/images/web_setting.png)

Remember your `Client ID` and` Client Secret` of the new security profile. And you need `Vendor ID` too. Keep login to Developer Console and check it at [here](https://developer.amazon.com/mycid.html).

This work is only once. If you use the same account, you can continue to use the same credentials.

**The troublesome browser working is over!! From now on, we will work with `sls` command!!**

## Set your credentials to the framework
Write `Client ID`,` Client Secret` and `Vendor ID` to` serverless.yml`. It is good to use environment variables as below. If you change the port number with `Allowed Return URLs` of` Login with Amazon`, add `localServerPort` and write the port number.

```yaml
provider:
  name: aws
  runtime: nodejs 6.10

plugin:
- serverless-alexa-skills

custom:
  alexa:
    VendorId: ${env:AMAZON_VENDOR_ID}
    ClientId: ${env:AMAZON_CLIENT_ID}
    ClientSecret: ${env:AMAZON_CLIENT_SECRET}
```

And execute the following command.

```
$ sls alexa auth
```

This command opens the login page of Amazon.com in your  browser. And you will be redirected to `localhost:3000` after the authentication. If the authentication is successful, you can see the message  **"Thank you for using Serverless Alexa Skills Plugin!!"**.

**Warning:** The security token expires in **1 hour**. If authentication error occurs, please re-execute the command. I plan to implement automatic token refreshing in the future.

# Create your skill
Let's make your skill. Execute the following command.

```
$ sls alexa create --name $YOUR_SKILL_NAME --locale $YOUR_SKILL_LOCALE --type $YOUR_SKILL_TYPE
```

These are descriptions of the options.

- name: Name of the skill
- locale: Locale of the skill (`en-US` for English, `ja-JP` for Japanese and so on)
- type: Type of the skill (`custom` or `smartHome` or `video`)

## Update the skill manifest
A manifest is initially set for the skill. You can check the manifest with the following command.

```
$ sls alexa manifests

Serverless:
------------------
[Skill ID] amzn1.ask.skill.xxxxxx-xxxxxx-xxxxx
[Stage] development
[Skill Manifest]
skillManifest:
  publishingInformation:
    locales:
      ja-JP:
        name: sample
  apis:
    custom: {}
  manifestVersion: '1.0'
```

Copy `[Skill ID]` and `[Skill Manifest]` and paste it to `serverless.yml` as below.

```yaml
custom:
  alexa:
    vendorId: $ {env: AMAZON_VENDOR_ID}
    clientId: $ {env: AMAZON_CLIENT_ID}
    clientSecret: $ {env: AMAZON_CLIENT_SECRET}
    skills:
      - id: $ {env: ALEXA_SKILL_ID}
        skillManifest:
          publishingInformation:
            locales:
              ja-JP:
                name: sample
          apis:
            custom: {}
          manifestVersion: '1.0'
```

Execute the following command to update the manifest after updating your `serverless.yml`. And you can use `--dryRun` option to check the difference between the local setting and the remote setting without updating.

```
$ sls alexa update
```

You can see the format of the manifest at [here](https://developer.amazon.com/docs/smapi/skill-manifest.html#sample-skill-manifests).

## Building the interaction model

The skill requires a interaction model. The skill does not have any model at first. So, you need to write a model definition to `serverless.yml` like this.

```yaml
custom:
  alexa:
    vendorId: ${env:AMAZON_VENDOR_ID}
    clientId: ${env:AMAZON_CLIENT_ID}
    clientSecret: ${env:AMAZON_CLIENT_SECRET}
    skills:
      - id: ${env:ALEXA_SKILL_ID}
        skillManifest:
          publishingInformation:
            locales:
              en-US:
                name: sample
          apis:
            custom: {}
          manifestVersion: '1.0'
        models:
          ja-JP:
            interactionModel:
              languageModel:
                invocationName: PPAP
                intents:
                  - name: PineAppleIntent
                    slots:
                    - name: Fisrt
                      type: AMAZON.Food
                    - name: Second
                      type: AMAZON.Food
```

You can see the format of the interaction model at [here](https://developer.amazon.com/docs/custom-skills/custom-interaction-model-reference.html).

Execute the following command to build the model after updating your `serverless.yml`. And you can also use `--dryRun` option with this command.

```
$ sls alexa build
```

And you can check the model with the following command.

```
$ sls alexa models

Serverless:
-------------------
[Skill ID] amzn1.ask.skill.xxxx-xxxx-xxxxx
[Locale] ja-JP
[Interaction Model]
interactionModel:
  languageModel:
    invocationName: PPAP
    intents:
      - name: PineAppleIntent
        slots:
        - name: Fisrt
          type: AMAZON.Food
        - name: Second
          type: AMAZON.Food
```

# And That's It!
There are a few more steps to publish your skills. I plan to integrate the simulation with Alexa Skills Kit in the future. However, I think that it is great to be able to integrate manifests and models. Because, we update them many times. And we'd better manage them with the source code of Lambda Functions.

# Summary
We can totally manage our Lambda Functions and Alexa Skills with Serverless Framework + Serverless Alexa Skills Plugin.

If you have any comments or feedback, please create a [issue](https://github.com/marcy-terui/serverless-alexa-skills/issues) or send a pull request. I always welcome them!!
