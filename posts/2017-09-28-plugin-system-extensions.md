---
title: What's new for Serverless plugins?
description: Being a Serverless plugin author has never been easier. Take advantage of these awesome new features to write your very own plugin.
date: 2017-09-29
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/plugin.jpg
layout: Post
authors:
  - FrankSchmid
---

## Introduction

It's been quite a while since my [last post about plugins](https://serverless.com/blog/advanced-plugin-development-extending-the-core-lifecycle/), way back in the ancient days of Serverless 1.12. The [Framework](https://serverless.com/framework/) is in its 20's now and so grown up...(sniffle).

Things have changed since then. It's a new age, filled with new features. Your dreams of being a plugin author have never been easier to achieve.

Let's do this.

### Table of contents

- [Command aliases](https://serverless.com/blog/plugin-system-extensions/#command-aliases)
- [Command delegates](https://serverless.com/blog/plugin-system-extensions/#command-delegates-lifecycle-termination)
- [Enhanced logging](https://serverless.com/blog/plugin-system-extensions/#enhanced-logging)

## Command aliases

### Before

Every plugin installs a unique set of commands. Since the command lifecycle and the hookable lifecycle are rooted at the command names, the commands cannot be changed.

E.g. the deploy function lifecycle is built from these events: `deploy:function:initialize`, `deploy:function:packageFunction` and `deploy:function:deploy`.

From a UX perspective, wouldn't it would be more natural to access the function deployment as subcommand of a `function` command (i.e. `serverless function deploy`)?

But alas, if you rename the command to `function:deploy` it also changes the command hooks, and any plugins depending on these hooks cease to function. Whoops!

### Now

The solution? **Command aliases**.

Commands can now have specified alternatives (aliases), and you can use those alises to access the command from the CLI.

Invoking a command alias is internally no different than invoking the original command--it will start the original command's lifecycle and run through all known lifecycle events. So, any hooked plugin will work exactly the same as with the original command.

Aliases are simply added to any command definition. You can even specify multiple aliases! However, aliases cannot overwrite existing commands and Serverless will error accordingly if you try to do so.

Here is an example of the aforementioned `deploy function` command (code from `./lib/plugins/deploy/deploy.js`):

```js
this.commands = {
  deploy: {
    ...
    commands: {
      function: {
        usage: 'Deploy a single function from the service',
        lifecycleEvents: [ ... ],
        aliases: [
          'function:deploy'
        ]
      }
    }
  }
};
```

This sample makes the `deploy function` command available as `function deploy`. As you can see, aliases implicitly create hierarchies when needed (here: a virtual `function` command level).

In general, the alias command position is not limited and can also be a _new_ subcommand of any existing command.

`serverless help` will also reflect existing aliases, in addition to printing both the aliased command and the original command description.

## Command delegates (lifecycle termination)

### Before

Sometimes, depending on the options given, you'll need to delegate execution to a different command. E.g., our example from above, where `serverless deploy --function=XXXX` now executes the `deploy function` command instead of `deploy`.

But how is this done?

As you might remember, there is `pluginManager.spawn()` that starts a command from within a lifecycle event. It returns
after execution so that the current lifecycle (command) is continued afterwards.

```
CLI
  + cmd1
    + lifecycleEvent1cmd1
      --> spawn(cmd2)
            + lifecycleEvent1cmd2
            + lifecycleEvent2cmd2
      <--
    + lifecycleEvent2cmd1
    + lifecycleEvent3cmd1
```

This mechanism works great, but only if you want to run another lifecycle _within_ your lifecycle.

In our case, we want to delegate the execution to the other command, but we do _not_ want to continue our own lifecycle. This means we do not want to run the `deploy` lifecycle, because we want to run `deploy function` if we encounter a `--function` option on the commandline.

So what we actually want is:

```
CLI
  + cmd1
    + lifecycleEvent1cmd1
      --> spawn(cmd2)
            + lifecycleEvent1cmd2
            + lifecycleEvent2cmd2
      <--
      ABORT THE CMD1 LIFECYCLE
    <--
```

This behavior effectively replaces the execution of cmd1 with cmd2 after the initial lifecycle event of cmd1 has been started.

### Now

Thanks to the latest extension of `pluginManager.spawn()`, this is now possible. The spawn method now accepts a second _option_ parameter that lets you switch special behavior of the spawn on or off (`pluginManager.spawn(command, options)`).

The option that we use is the new `terminateLifecycleAfterExecution` option. Setting it to `true` will spawn the command
and its lifecycle as before, but as soon as the invoked lifecycle terminates, it will also terminate our current lifecycle and
return control to our invoker (i.e., someone who spwaned us or the CLI).

Example (`deploy --function` delegate invocation, see `./lib/plugins/deploy/deploy.js`):
```
    this.hooks = {
      'before:deploy:deploy': () => BbPromise.bind(this)
        .then(this.validate)
        .then(() => {
          if (this.options.function) {
            // If the user has given a function parameter, spawn a function deploy
            // and terminate execution right afterwards. We did not enter the
            // deploy lifecycle yet, so nothing has to be cleaned up.
            return this.serverless.pluginManager.spawn(
              'deploy:function', { terminateLifecycleAfterExecution: true }
            );
          }
```

It is important to remember that a terminating spawn will not execute any subsequent lifecycles of the current command. I recommend that you do not spawn with termination when you depend on any subsequent event in the current lifecycle to do some cleanups. The deploy command delegates right after the validation step.

## Enhanced logging

A much-requested feature was improved logging, especially for plugin authors. There have been some changes that allow us to
let us debug our plugins with fewer headaches.

### Stacktraces on plugin crashes

When the `SLS_DEBUG` environment variable is set, Serverless now prints the stacktraces of the crash (even if it happened
within a plugin), instead of just telling us that the plugin could not be loaded.

### Plugin loading and command registration

With `SLS_DEBUG` the plugin manager will now output any commands as well as aliases that are registered during the plugin loading.

This allows us to debug crashes during plugin initialization, and shows us the exact location where commands and aliases have clashes.

### Log of spawned and invoked commands

With `SLS_DEBUG`, all commands that are started via invoke or spawn are now logged. This allows you to see if you spawn commands correctly or if there are any plugins that change the event chain in an unexpected way.

## Grand finale

That's it, team. Now you have no excuses--go author the next big plug-in!
