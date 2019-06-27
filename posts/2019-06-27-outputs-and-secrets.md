---
title: "Managing Secrets and Output Variables With Serverless Framework Enterprise"
description: "With the Serverless Framework Enterprise v0.11.0 release, we are adding support for output variables and secrets management"
date: 2019-06-28
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/outputs-and-secrets/Thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/outputs-and-secrets/header.png'
category:
  - news
authors: 
  - MaciejSkierkowski
---

With the Serverless Framework Enterprise v0.11.0 release, we are adding support for output variables and secrets management to make it easier for developers to separate secrets and shared components from their services.
#### Output Variables
As developers developing a Serverless Framework service we typically include two distinct types of resources in a single `serverless.yml` file - a few _shared resources_ (e.g. auth function, SNS Topic) and numerous _individual resources_ (like lambda functions) which depend on the shared resources. All of the shared and individual resources are bundled together into a single `serverless.yml` to accommodate the interdependency. Output Variables make it easier to share resources across services.

Serverless Framework Enterprise Output Variables enable you to detangle the dependencies by separating the shared resources and the individual service resources into independent `serverless.yml` files all while sharing variables with each other. The shared resources publish output variables while each of the individual resources consume them. By refactoring into smaller services, as a bonus, we get smaller and easier to manage `serverless.yml` files, the ability to independently deploy each service, and shorter deploy times.

There are two parts to sharing state across services - publishing the output variables and consuming them in other services.

For example, if you have a service called “products” and you want to share the SNS Topic name with other services you can just add the `name` value to the new `outputs` section of the `serverless.yml` file.

**products/serverless.yml**
![products](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/outputs-and-secrets/SFE_products-serverless_yml.png)

Now any other service (e.g. “inventory”) can use that output variable simply be referencing it using the new `${state}` variable.

**inventory/serverless.yml**
![inventory](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/outputs-and-secrets/SFE_inventory-serverless_yml.png)

You can find more details on [defining output variables](https://github.com/serverless/enterprise/blob/master/docs/output-variables.md#define-output-variables-for-shared-services), [using them in dependent services](https://github.com/serverless/enterprise/blob/master/docs/output-variables.md#use-output-variables-in-dependent-services) and [viewing them in the dashboard](https://github.com/serverless/enterprise/blob/master/docs/output-variables.md#use-output-variables-in-dependent-services) in the docs.
#### Secrets

When using third party services in your Serverless applications, you often need configuration data for things like API keys, resource identifiers, or other items. This configuration data often includes sensitive secrets which must not be stored in source control.

Properly securing the sensitive secrets requires the use of a secrets management solution like SSM, KMS, Vault, or Secrets Manager, to store and encrypt the variables. Each of these introduce significant new infrastructure with additional operational overhead and cost. This touches every part of the service’s lifecycle:
- Developers must implement a way to retrieve secrets and load them into their service.
- If developers deploy from their local environment then you need to securely distribute the secrets to the developer’s machine.
- When running tests in a CI service, the secrets must also be configured in the CI service, or retrieved on each run.
- Once tests are complete, the CI/CD pipeline will need the secrets again to perform the deployment to the appropriate stage.

Serverless Framework Enterprise Secrets alleviates all of these challenges by providing a way to centrally secure and store sensitive secrets and use them in your `serverless.yml` file.

With Serverless Framework Enterprise Secrets you can [create a secret](https://github.com/serverless/enterprise/blob/master/docs/secrets.md#creating-a-new-secret) in the dashboard as a part of a [deployment profile](https://github.com/serverless/enterprise/blob/master/docs/profiles.md#deployment-profiles). 

![SFE Screenshot](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/outputs-and-secrets/sfe_screenshot.png)

To use the secret you just add the `${secrets}` variable to your `serverless.yml` file. When you deploy it’ll decrypt and resolve the value. 

```
provider:
  environment:
    STRIPE_API_KEY: ${secrets:stripeApiKey}
```

Since the secrets are defined in a [profile](https://github.com/serverless/enterprise/blob/master/docs/profiles.md#deployment-profiles), you can set different values for each stage. For example, if you have two Stripe accounts, one for prod and one for qa, then you can create a secret `stripeApiKey` to store the API Key for each stage. When you deploy, it’ll automatically use the right stripeApiKey value.

You can find more information on [creating new secrets](https://github.com/serverless/enterprise/blob/master/docs/secrets.md#creating-a-new-secret) and [using them](https://github.com/serverless/enterprise/blob/master/docs/secrets.md#using-a-secret-to-deploy) in the docs.
