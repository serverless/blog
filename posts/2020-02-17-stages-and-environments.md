---
title: Managing Stages and Environments
description: "Being able to manage multiple different stages of deployment within different environments is essential, and Serverless Framework Pro shows you how"
date: 2020-02-17
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/img-thumb-environment-stages.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/img-blog-environment-stages.png"
authors:
  - GarethMcCumskey
category:
  - guides-and-tutorials
---

Since day 1, the Serverless Framework has had the concept of stages; the ability to create different stacks of the same service. This concept works really well when you need to provide different types of environments for the software development lifecycle of your team or organisation, as it allows you to deploy development code to a development environment using a development stage:

`serverless deploy --stage develop`

This does come with a few issues, however. How do you manage different environment variables between the various environments? What if you wanted to deploy to multiple AWS accounts? How do you ensure that code deployed to the various environment meets minimum policy requirements?

Serverless Framework Pro adds the concept of a profile on top of the concept of a stage that allows us to help solve some of these issues.

#### Initial setup

Lets get started with the basic setup we need. Its pretty quick!

First, go to the [Serverless Framework Pro Dashboard](https://app.serverless.com), and create a new account if you haven't got one yet or log into your existing account. If you created a new account you will also see the on-boarding process that introduces you to the concepts in the dashboard. Go ahead and complete that or skip it.

Once done, make sure you have an `app` created and you should see something like this:

![Org and app](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/New-org-and-app.png)

Now lets go to the `profiles` section, top left menu, and we should have ourselves a default profile already created. Lets assume we want to create a development profile for our development environment. Click the default profile and lets rename it to `development` and save:

![Development Profile Saved](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/Development-profile-edited.png)

Before we start looking at anymore features, lets make one last configuration change:
1. Select `apps` in the top-right menu
2. Select your app you created
3. Click on `app settings` then on `stages` in the side bar menu.

This is where we will associate our new development profile we created with a specific stage we may deploy under. Clicking `add stage` I can now set the `dev` stage to be associated with the development profile:

![Dev stage to development profile](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/DevStageToDevelopmentProfile.png)

With this setup, a command such as `serverless deploy --stage dev` would hook the development profile we're about to configure into the whole deployment process to make our lives easier!

Now lets head back to profiles and look at what we can do with this new profile.

#### Separate AWS accounts

Separating our various environments, such as development and production, into alternate AWS accounts is a pretty common practice. If we want our development environment to deploy to an entirely different AWS account to our production environment, this is where we look to do that. Selecting the `AWS account` tab gives us the option to use local AWS credentials, so if we didn't necessarily want to alter the way we deploy now we don't have to. But if you select the option `Add an organization AWS account to deploy.` you immediately get the ability to click a link labelled `Open the AWS console.` which opens up a wizard you just need to click next through.

Once completed, you should have a new role created. Copy ARN for that role and paste it into the provided text box in the dashboard, hit that save button, and you are done. Your service can now deploy to that AWS account when you use the `dev` stage. 

![AWS Account linked to profile](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/AWSAccountAddedToProfile.png)

But there are more benefits built in by default as well. Because you can now do deployments to AWS via the Serverless Framework Dashboard, you no longer need to distribute Access Keys and Secrets to developers so that they can deploy from their local machines. When a deployment is done via the dashboard, at deployment time the Serverless Framework requests temporary access credentials created via the role you just setup. Once deployment is complete, those credentials are no longer in use. 

Much better for security!

#### Environment Parameters

Your application needs configuration data. Whether that's to connect to data sources or third party API's, it needs these details for the running of your application. However, these details often differ depending on whether you are running in the development environment or in production, or even locally.

Thankfully, the Serverless Framework Pro Dashboard has a feature in profiles to help us solve that. Looking at our profile, if we click on the `parameters` tab, we have the ability to add key-value pairs that can then be imported into our application at deployment time:

![Parameters](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/parameters.png)

By setting up my parameters in this way I can then add them to my project in the `serverless.yml` file as environment variables to be imported with my Lambda function, or even used anywhere within my serverless.yml file, as they are replaced by the actual value at deployment time. For example:

```yaml
org: garethsorg
app: my-new-app
service: my-new-service
provider:
  name: aws
  runtime: node12.x
  environment:    
    DB_HOST: ${param:DB_HOST}
    DB_NAME: ${param:DB_NAME}
    DB_PASSWORD: ${param:DB_PASSWORD}
    DB_USERNAME: ${param:DB_USERNAME}
```
 
The `${param:}` syntax retrieves the value stored against the key at runtime. But combined with the existing variables syntax of the Serverless Framework, I can also make sure that local development has the required values:

```yaml
  environment:    
    DB_HOST: ${param:DB_HOST, 'localhost'}
    DB_NAME: ${param:DB_NAME, 'localdbname'}
    DB_PASSWORD: ${param:DB_PASSWORD, 'localdbpass'}
    DB_USERNAME: ${param:DB_USERNAME, 'localdbusername'}
```

If the param does not exist, as may happen in a local environment, the default value after the `,` is used instead.

#### Lets make the infrastructure team happy

Otherwise known as `safeguards`. This last tab we have yet to look at is the Serverless Framework's way of adding an additional layer of policy enforcement onto all deployments. 

Let's say, for sake of argument, that you have an existing infrastructure team at your organisation and while you want to blaze a new Serverless path, they have some requirements as to what resources being deployed into AWS must look like. Requirements such as not having IAM policies being defined with too broad a set of permissions, for example. 

When building your Serverless application you might be able to define some IAM policies such as:

```yaml
  iamRoleStatements:
    - Effect: "Allow"
      Resource:
        - arn:aws:dynamodb:*:*:table/*
      Action:
        - "dynamodb:*"
```

But your infrastructure team may not be so happy with all those wildcards. And they would rather prefer something like this:

```yaml
  iamRoleStatements:
    - Effect: "Allow"
      Resource:
        - arn:aws:dynamodb:#{AWS::Region}:#{AWS::AccountId}:table/${self:custom.dynamodb.myTable}
      Action:
        - "dynamodb:Query"
        - "dynamodb:PutItem"
```

This would require human intervention at deploy time to enforce, except if we use a safeguard to check this for us. Opening the `safeguard` tab in my `development` profile, I should see a few safeguards added by default:

![Default safeguards](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/DefaultSafeguards.png)

Scrolling a little further down, I can see I should already have one added called `no-unsafe-wildcard-iam-permissions`, which will check for wildcards used in `iamRoleStatements` and either throw a warning or error out completely at deployment time, depending on my setting. I may want a warning in my development profile but definitely want to set this to an error if I was setting up a production profile.

![Enforcement level](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/stages-and-environments/EnforcementLevel.png)

And there are a huge range of these Safeguards to choose from. There are so many possible combinations we even provided a `javascript` safeguard that allows you to essentially write your own. You could even commit safeguards as a part of your code to be executed at deployment time. 

This is a far bigger topic than can be spoken of in complete detail here, so feel free to check out [our official documentation on Safeguards](https://serverless.com/framework/docs/dashboard/safeguards/) for all the details.

--------------------

With everything we've looked at, imagine combining that with a production environment and then also looping in Serverless Framework CI/CD which uses all of these features by default. It can help you manage a seamless software development lifecycle across multiple stages and deployment scenarios. All you need to get started is to go the [Serverless Framework Pro Dashboard](https://app.serverless.com) and sign up!
