---
layout: Post
title: 'Writing Serverless Framework Plugins'
date: 2016-12-12
description: "In this tutorial, you’ll learn by examples how to write your own plugins. We’ll start from very simple examples and build up on them to get all the way to writing useful plugins that coul help you with your everyday deployments."
tags:
- serverless
---

If you’ve opened this article, you probably know some basics of **the Serverless Framework** such as deploying lambdas and creating API endpoints. While using it, you might have hit a block where doing something with the framework is either difficult, impossible, or simply too repetitive. **You can ease your pain by using plugins.** Some are already built for the most common problems but there are always some project-specific issues that plugins can help you resolve. Fortunately, writing a plugin for the Serverless Framework is easier than you might think.

In this tutorial, **you’ll learn by examples how to write your own plugins.** We’ll start from very simple examples and build up on them to get all the way to writing useful plugins that could help you with your everyday deployments.

## Lesson 1 – Create First Plugin

The Serverless Framework is an incredibly well-built open source platform. It is nearly indefinitely extensible and allows you to add new features with surprising ease. **Let’s see how you can add a plugin in the simplest way possible.**

Somewhere in a new directory run:

```
serverless create --template plugin
```

This command will create an `index.js`. When you open this file, you'll see a class with a constructor and a few simple functions. Let's have a look at it step by step.

### Plugin as a Class

```js
class ServerlessPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;
    // ...
  }
  // ...
}
```

**Every serverless plugin is a class.** This class gets instantiated with a `serverless` object and a bunch of `options`. We'll get to them in more detail in a little while but for now it's enough to say that these will help you _do_ things in your plugin.

### Define Your Commands

```js
class ServerlessPlugin {
  constructor(serverless, options) {
    // ...
    this.commands = {
      welcome: {
        usage: 'Helps you start your first Serverless plugin',
        lifecycleEvents: [
          'hello',
          'world',
        ],
        // ...
      },
    };
  }
}
```

Next thing to notice in the constructor is the **definition of commands** that your plugin introduces. In the boileplate we initialised using the serverless cli helper, command `serverless welcome` is added.

#### Usage - or Help

In the `usage` section, you can specify **a hint how the command should be used.** This hint will appear when you run `serverless --help` in the list of commands and their descriptions.

#### Lifecycle Events

The crucial bit in any command is the `lifecycleEvents` array. **Lifecycle events allow you to define the steps that are most likely to be taken while executing the command.** For example, these are the lifecycle events for `serverless deploy` command:

- cleanup
- initialize
- setupProviderConfiguration
- createDeploymentArtifacts
- compileFunctions
- compileEvents
- deploy

From `cleanup` to `deploy`, we have a list of tasks we should fulfil on our way to deploying a service. We don't write any implementation yet, though. **We're only describing the process** in a very general way that doesn't include any implementation details.

The advantage of this approach is that it doesn't tie us into one way of doing deployment (or executing any other command), which in turn helps us avoid vendor lock-in.

As such, you can **see the command definition as a guideline** that you can use later on to write your code. This makes for more readable, **self-documented code.**

#### Options - or Flags

You might notice that in the plugin template, we also have `options` section alongside `usage` and `lifecycleEvents`.

```js
this.commands = {
  welcome: {
    usage: 'Helps you start your first Serverless plugin',
    lifecycleEvents: [
      'hello',
      'world',
    ],
    options: {
      message: {
        usage:
          'Specify the message you want to deploy '
          + '(e.g. "--message \'My Message\'" or "-m \'My Message\'")',
        required: true,
        shortcut: 'm',
      },
    },
  },
};
```

The `options` section can be used to **describe which flags can be used in CLI with your command.** In this definition, the `--message` option is required, and has a shortcut `-m` so that you can equally write `serverless welcome --message "Hello!"` and `serverless welcome --m "Hello!"`.

As with the command itself, we have a `usage` description which appears when asking for help int he CLI `serverless welcome --help`.

#### Requirements for Defining a Command

The snippet discussed above is defining lifecycle events, help description, and a flag. For the flag, we have again a help description section, information whether the flag is required and a flag shortcut. As you could guess, **not all of them are required.** A very minimalistic approach would be:

```js
this.commands = {
  welcome: {
    lifecycleEvents: [
      'hello',
      'world',
    ],
    options: {
      message: {},
    },
  },
};
```

This will work in a very similar way as the definition above. However, it won't provide you with automatic checking that the required option is passed to the command, or any help information.

From this perspective, **I'd suggest spending the time with writing up `usage`, requirements and shortcuts.** It will make it significantly easier for the users of your plugin to figure out how to actually use it.
