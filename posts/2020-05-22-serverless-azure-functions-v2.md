---
title: "Serverless Azure Functions V2 - Linux, Python & .NET Core Support"
description: "Introducing the v2 release of the Serverless Azure Functions plugin, which includes support for Linux, Python & .NET Core Function Apps."
date: 2020-06-03
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure/azure_720.jpg"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/azure/azure_720.jpg"
category:
  - guides-and-tutorials
authors:
  - TannerBarlow
---

#### V2 Release

We're excited to announce the official v2 release of the [Serverless Azure Functions plugin](https://github.com/serverless/serverless-azure-functions) for the Serverless Framework. This version includes some exciting new features and fixes which we think will both simplify your development experience and enable you to do more with Azure Functions.

Feel free to check out our [full changelog](https://github.com/serverless/serverless-azure-functions/blob/master/CHANGELOG.md), but here are the highlights:

- Linux Support
- Python Support
- .NET Core Support
- Simplified runtime configuration
- No more `x-azure-settings` (still backwards compatible)
- Automated integration tests
- Invoke the APIM endpoint
- `sls info` and `sls deploy --dryrun`
- Configurable logging verbosity
- Resource group tagging

##### Linux Support

You can now deploy a Linux function app with the following flag in your configuration:

```yml
...
  provider:
    os: linux
...
```

The default `os` is still `windows` for all Function Apps (except Python, which does not allow Windows Function Apps).

##### Python Support

The [updated Python template](https://github.com/serverless/serverless/tree/master/lib/plugins/create/templates/azure-python) is now included in the Serverless Framework. Simply run:

```bash
$ sls create -t azure-python -p {your-app-name}
```

A mentioned above, Python Function Apps can *only* run on Linux, so if you're deploying a Python Function App, you'll be forced into using Linux, regardless of your specification in `serverless.yml`.

We *highly* recommend creating a virtual environment in your local development and make sure you add the name of your environment to the `exclude` section within `serverless.yml`.

##### .NET Core Support

In order to deploy a .NET Core Function app via the Serverless Framework, you also need to have the [.NET Core CLI](https://docs.microsoft.com/en-us/dotnet/core/tools/) installed. The `package` lifecycle event invokes the `dotnet build` command to compile the function app.

##### Simplified Runtime Configuration

Rather than pinning to a specific patch/minor version of Node, and trying to determine if that version is supported by Azure Functions, we simplified the `provider.runtime` property. Here are the valid values:

- `nodejs10`
- `nodejs12`
- `python3.6`
- `python3.7`
- `python3.8`
- `dotnet2.2`
- `dotnet3.1`

This is the recommended approach from the Azure Functions team as well.

##### No more `x-azure-settings`

The feature you've all been waiting for... We've flattened out the `function` configuration so that it no longer needs the `x-azure-settings` object to build the function bindings.

###### Before

```yaml
functions:
  hello:
    handler: hello.sayHello
    events:
      - http: true
        x-azure-settings:
          methods:
            - GET
          authLevel: anonymous
```

###### After

```yaml
functions:
  hello:
    handler: hello.sayHello
    events:
      - http: true
        methods:
          - GET
        authLevel: anonymous
```

We did, however, make this backwards compatible, so you can still use `x-azure-functions` if you want to for some reason. No judgments here.

##### Automated Integration Tests

Since we added support for two new runtime languages and an additional operating system, our ability to manually test deployment possibilities was quickly diminishing. We are using [Clover](https://www.npmjs.com/package/clvr) to automate the deployment, invocation and cleanup of function apps, as well as make assertions on the output of the commands. These integration tests are on a timer that runs twice a day, and runs in a GitHub workflow on the plugin repo.

Here are links to our workflows for [.NET](https://github.com/serverless/serverless-azure-functions/actions?query=workflow%3A%22.NET+Integration+Tests%22), [Python](https://github.com/serverless/serverless-azure-functions/actions?query=workflow%3A%22Python+Integration+Tests%22) and [Node](https://github.com/serverless/serverless-azure-functions/actions?query=workflow%3A%22Node+Integration+Tests%22) integration tests.

##### Invoke API Management Endpoint

The plugin allows for a deployment of an API Management instance, and previously, you'd have to copy/paste into Postman or your browser to test the APIM endpoint. Now, you can simply invoke it directly via the CLI by running:

```bash
$ sls invoke apim -f <function> ...
```

##### Info Command

The `info` command is a way to view a quick summary of your **deployed** resources. Run

```bash
$ sls info
```

and you'll see something like:

```
Resource Group Name: <resource-group-name>
Function App Name: <function-app-name>
Functions:
        hello
        goodbye
Azure Resources:
{
  "name": "<function-app-name>",
  "resourceType": "Microsoft.Web/sites",
  "region": "westeurope"
},
{
  "name": "<app-insights-name>",
  "resourceType": "microsoft.insights/components",
  "region": "westeurope"
},
{
  "name": "<storage-account-name>",
  "resourceType": "Microsoft.Storage/storageAccounts",
  "region": "westeurope"
}
```

##### Dry-run Deployments

Similar to the `info` command, we wanted a way for you to get info on what the deployment _will_ be like. We added the `--dryrun` option to the `deploy` command so tha tyou can take a look at the Azure resources that will be deployed with the current configuration. Run:

```bash
$ sls deploy --dryrun
```

and you'll see the exact same format as the `info` output, but based on what your current configuration would generate.

##### Tagging Resource Group

Resource group tags can be an important part of Azure governance. Previously, any deployment would overwrite any tags that existed on the resource group. Now, the deployment will check if any tags exist as well as add any that were included in `serverless.yml`, which can be included like so:

```yaml
...
provider:
  tags:
    TAG_1: tagValue1
    TAG_2: tagValue2
```

##### Conclusion

Thank you to the many of you that have used the plugin, provided valuable feedback and even pull requests back to the repo. Feel free to reach out with any questions, issues or feature requests by [posting an issue](https://github.com/serverless/serverless-azure-functions/issues/new/choose). Until next time ⚡
