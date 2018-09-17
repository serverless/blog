---
title: Using the Serverless Dashboard plugin for Atom
description: Making it easier to manage serverless applications from within the Atom editor
date: 2018-02-05
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/atom-editor-square.jpeg
category:
  - engineering-culture
  - guides-and-tutorials
authors:
  - RupakGanguly
---

Many developers love and use the Serverless Framework for writing their serverless applications. In the spirit of making it even easier to manage the serverless applications using the Serverless Framework, [Takahiro Horike](https://serverless.com/community/champions/takahiro-horike/), created the Serverless Dashboard package for the Atom editor.

In this post, I will give you an overview of the Serverless Dashboard package.

We'll cover:

* Installing the plugin in Atom
* Visualizing the serverless.yml file
* Using the Atom plugin to manage a serverless app

# Installation

Let's start by installing the Atom package or plugin. If you don't have [Atom](https://atom.io/), you'll need that first! If you don't have the [Serverless Framework](https://serverless.com/framework/) installed, you'll need that too.

Installing the Serverless Framework is a breeze:

```bash
npm install -g serverless
```

You can search for the [Serverless Dashboard](https://atom.io/packages/serverless-dashboard) package on the Atom site:

![Search for the package](https://user-images.githubusercontent.com/8188/35174727-676e17c0-fd3e-11e7-91c0-b2ccb53c6117.png)
*Search for the package*

To install it, do the following:

1. Launch Atom
1. Open 'Settings View' using <kbd>Cmd+,</kbd> on macOS or <kbd>Ctrl+,</kbd> on other platforms
1. Click the 'Install' tab on the left side
1. Enter `serverless-dashboard` in the search box and press <kbd>Enter</kbd>
1. Click the 'Install' button that appears

![Install the package](https://user-images.githubusercontent.com/8188/35175208-934451dc-fd40-11e7-8111-f7af675d0d06.png)
*Install the package*

## Visualizing the serverless.yml file

Let's create a simple app named `helloatom` using the boilerplate template provided by the Serverless Framework.

```bash
sls create -t hello-world -n helloatom -p helloatom
```

Open the app files in atom.

To use the Serverless Dashboard plugin, locate the 'Serverless Dashboard' item on the 'Packages' menu list as shown below:

![Post install](https://user-images.githubusercontent.com/8188/35174627-0685b0b2-fd3e-11e7-85f0-a4b83d6b7edb.png)
*Post installation*

Click on the 'Open your serverless.yml' and choose the `serverless.yml` for the project.

A new pane will open with the Serverless Dashboard showing a visual representation of the `serverless.yml` file.

![Serverless Dashboard](https://user-images.githubusercontent.com/8188/35176844-8e8f42a6-fd49-11e7-9bb1-866a9954c2ee.png)
*Serverless Dashboard*

# Managing a serverless app

The Serverless Dashboard plugin not only lets you visualize the `serverless.yml` file, but also helps you easily manage a few things inside the Atom editor pane.

## Deploy a service

You can easily deploy the service by clicking on the 'Deploy Service' button. The service will be deployed to the stage and the region as specified. Note that you can change those settings directly from the pane.

![Update deploy settings](https://user-images.githubusercontent.com/8188/35177082-09db1f7e-fd4b-11e7-8610-01cca5d31f78.png)
*Update deploy settings*

Let's see what the deployment looks like:

![Deployment](https://user-images.githubusercontent.com/8188/35177180-8d13569a-fd4b-11e7-8460-04efaeffa9f1.png)
*Deployment*

Nothing new here if you're already familiar with Serverless Framework. The output of the deployment is exactly what you would see in the terminal if you'd deployed using `sls deploy`.

## Updating the serverless.yml file

Let's add a new function, `byeWorld`, to the serverless.yml file, like so:

```yaml

  byeWorld:
    handler: handler.byeWorld
    # The `events` block defines how to trigger the handler.byeWorld code
    events:
      - http:
          path: bye-world
          method: get
          cors: true
```
Switch over to the Serverless Dashboard pane, and click on the 'Reload serverless.yml' button.

![Reload serverless.yml](https://user-images.githubusercontent.com/8188/35177381-df382e18-fd4c-11e7-85fe-091dc6af5131.png)
*Reload serverless.yml*

Let's deploy the service by clicking on the 'Deploy Service' button.

## Deploying a function

Let's update some code in our functions. We will just add a simple line to log the event object that we receive.

```js
console.log(`***** From helloWorld: *****\n Event: JSON.stringify(event) \n******\n`);
```

Since we just updated our function code, let's just deploy the `helloWorld` function alone. Select the 'Deploy Function' and click on the 'Apply' button as shown below:

![Deploying a function](https://user-images.githubusercontent.com/8188/35177812-f83dd6ac-fd50-11e7-8ca6-e387246bf336.png)
*Deploying a function*

## Invoking a function

To invoke a function, click on the dropdown next to the function name. Select 'Invoke', and then hit 'Apply':

![Invoking a function](https://user-images.githubusercontent.com/8188/35177846-4ac02740-fd51-11e7-8a53-fb3f8803a0e6.png)
*Invoking a function*

## Logs for a function

To view the logs for a function, click on the dropdown next to the function name and select 'Logs', and then hit 'Apply' as shown below:

![Logs for a function](https://user-images.githubusercontent.com/8188/35177865-86666390-fd51-11e7-9c67-0e851dbbf2dd.png)
*Logs for a function*

## Removing a service

Last but not least, you can remove the service right from the pane:

![Removing a service](https://user-images.githubusercontent.com/8188/35177901-e1ca1664-fd51-11e7-838b-ccf3432e901b.png)
*Removing a service*

# Summary

The Serverless Dashboard is a convenient package that you can install in Atom to easily access various commands for the Serverless Framework within the Atom editor. It does not support all the commands that are available via the CLI, but it covers the most commonly used commands for managing a service.

Kudos to the Serverless Champion, [Takahiro Horike](https://serverless.com/community/champions/takahiro-horike/), for writing this package and helping the community.
