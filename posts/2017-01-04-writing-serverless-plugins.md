---
title: 'How To Write Your First Plugin For The Serverless Framework - Part 1'
description: "Learn the basics of creating a Serverless plugin to extend the frameworks functionality"
date: 2017-01-04
thumbnail: https://cloud.githubusercontent.com/assets/20538501/21665215/e3c9aae6-d2b0-11e6-9865-498d91318e7a.png
layout: Post
authors:
  - AnnaDoubkova
---

Hi, I'm [Anna Doubkova](https://github.com/lithin), a software engineer at [Red Badger](https://red-badger.com/) in London. If you’re reading this post, you probably know some basics of **the Serverless Framework**, like deploying Lambdas and creating API endpoints. But maybe you've hit a block where you find doing something with the framework is either difficult, impossible, or simply too repetitive.

**You can ease your pain by using plugins.** Some are already built for the most common problems (check them out in the official [Serverless Plugins Github repo](https://github.com/serverless/plugins)), but there are always some project-specific issues that plugins can help you resolve. Fortunately, writing a plugin for the Serverless Framework is easier than you might think.

In this tutorial, **you’ll learn by examples how to write your own plugins.** We’ll start from very simple examples and build upon them to get all the way to writing useful plugins that could help you with your everyday deployments.

![writing plugins for 1](https://cloud.githubusercontent.com/assets/20538501/21665241/0d20c94c-d2b1-11e6-8d46-7615f47aa481.png)

##  Create Your First Plugin

The Serverless Framework is an incredibly well-built open source platform. It's nearly indefinitely extensible, and allows you to add new features with surprising ease. **Let’s see how you can add a plugin in the simplest way possible.**

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

**Every serverless plugin is a class.** This class gets instantiated with a `serverless` object and a bunch of `options`. We'll get to them in more detail in a little while, but for now it's enough to say that these will help you _do_ things in your plugin.

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

The next thing to notice in the constructor is the **definition of commands** that your plugin introduces. In the boilerplate we initialised using the Serverless CLI helper, command `serverless welcome` is added.

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

From `cleanup` to `deploy`, we have a list of tasks we should fulfill on our way to deploying a service. We don't write any implementation yet, though. **We're only describing the process** in a very general way that doesn't include any implementation details.

The advantage of this approach is that it doesn't tie us into one way of handling deployment (or executing any other command), which in turn helps us avoid vendor lock-in.

As such, you can **see the command definition as a guideline** that you can use later on to write your code. This makes for more readable, **self-documented code.**

#### Options - or Flags

You might notice that in the plugin template we also have the `options` section alongside `usage` and `lifecycleEvents`.

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

As with the command itself, we have a `usage` description which appears when asking for help in the CLI `serverless welcome --help`.

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

This will work in a very similar way to the definition above. However, it won't provide you with automatic checking that the required option is passed to the command, or any help information.

From this perspective, **I'd suggest spending the time with writing up `usage`, requirements and shortcuts.** It will make it significantly easier for the users of your plugin to figure out how to actually use it.

### Hook Into Events

Defining the commands and their lifecycle events is useful to describe what the plugin does. **Hooks describe _how_ the plugin does it.**

You can find them right under commands in the constructor:

```js
class ServerlessPlugin {
  constructor(serverless, options) {
    // ...
    this.hooks = {
      'before:welcome:hello': this.beforeWelcome.bind(this),
      'welcome:hello': this.welcomeUser.bind(this),
      'welcome:world': this.displayHelloMessage.bind(this),
      'after:welcome:world': this.afterHelloWorld.bind(this),
    };
  }
}
```

**Hooks help us define the implementation of each step.** In the code above, you can discern the command name `welcome` and the two lifecycle events we defined for it: `hello` and `world`.

Hook `welcome:hello` defines what to do at step `hello` of command `welcome`; `before:welcome:hello` describes what to do before the first step. Similarly, `after:welcome:world` defines what to do after the last step.

This gives us a very fine-grained control over definition of **what the command does at each step, and enter specific actions before and after each step.**

Remember you don't have to define every step. Maybe in your particular implementation, you only care about `world` and not `hello`, and that's absolutely fine.

Later on someone else can come with their plugin and define their own implementation of the `welcome` plugin based on the steps you specified in the command. It's an open-ended world, allowing (nearly) endless extensions.

### Implementation

After having defined the command, its lifecycle events and how we hook into them, **all that's left is the actual implementation.** The details are obviously specific to the plugin you're writing, which platform you're targeting it at, etc.

In the template, we're only logging out greetings and the message we've passed it:

```js
class ServerlessPlugin {
  // ...

  beforeWelcome() {
    this.serverless.cli.log('Hello from Serverless!');
  }

  welcomeUser() {
    this.serverless.cli.log('Your message:');
  }

  displayHelloMessage() {
    this.serverless.cli.log(`${this.options.message}`);
  }

  afterHelloWorld() {
    this.serverless.cli.log('Please come again!');
  }
}
```

That, however, _might not be quite enough_ in a real world project.

You'll learn **how to write implementations** of plugins, what the **serverless object** is all about, and how you can approach writing plugins in **multiple ways** - in [How To Write Your First Serverless Plugin - Part 2](https://serverless.com/blog/writing-serverless-plugins-2/).
