---
title: Awesome plugin and lifecycle system extensions
description: "Enhancements in the plugin system you should be aware of"
date: 2017-09-19
thumbnail: 'http://url-to-thumbnail.jpg'
layout: Post
authors:
  - FrankSchmid
---

# Awesome plugin and lifecycle system extensions

## Introduction

It has now been quite a while since my last post about plugins, event lifecycles and
the new spawn mechanisms that have been introduced by Serverless 1.12. Now, as the framework
is already in its 20's and more or less grown up, it is time to wrap up the changes that have been 
made in the meantime to make a plugin author's live much easier.

## Table of contents

* Command aliases
* Command delegates
* Enhanced logging

## Command aliases

Every plugin installs a unique set of commands. Until now these commands were fixed from the beginning,
even if UX experiences show that the commands would be better available under different names. The reason
for this fixed nature of commands is, that the command lifecycle and the hookable lifecycle events are
rooted at the command names. E.g. the deploy function lifecycle is built from these events:
`deploy:function:initialize`, `deploy:function:packageFunction` and `deploy:function:deploy`.

From a UX perspective it would be more natural to access the function deployment as subcommand of a
`function` command (i.e. `serverless function deploy`). A renaming of the command to `function:deploy`
is no option, because it would also change the command hooks, and any plugins depending on these hooks
will cease to function with a rename.

The solution for these problems are the new **command aliases**:

Commands now can specify alternatives (aliases) by which the command can also be accessed from the CLI.
Invoking a command alias is internally not different to an invocation of the original command. It will
start the original command's lifecycle and run through all known lifecycle events. The alias command behaves
exactly as if the original command was invoked. So any hooked plugin will work exactly the same as with the original command.

Aliases are simply added to any command definition. A command can even specify multiple aliases! However,
aliases cannot overwrite existing commands and Serverless will error accordingly if you try to do so.

Here is an example of the beforementioned `deploy function` command (code from `./lib/plugins/deploy/deploy.js`):

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

This sample makes the `deploy function` command available as `function deploy`. As you can notice, aliases
implicitly create hierarchies when needed (here: a virtual `function` command level).

In general, the alias command position is not limited and can also be a _new_ subcommand of any existing command.

`serverless help` will also reflect existing aliases and print the aliased command and the original command description
besides.

## Command delegates (lifecycle termination)

Sometimes it is needed to delegate execution to a different command depending on the options given. A recent example
of this is, that `serverless deploy --function=XXXX` now executes the `deploy function` command instead of `deploy`.

But how is this done?

As you might remember there is `pluginManager.spawn()` to start a command from within a lifecycle event that returns
after execution, so that the current lifecycle (command) is continued afterwards.

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

This mechanism works great, but only if you want to run another lifecycle **within** your lifecycle. In our case we
want to delegate the execution to the other command, but we do not want to continue **our own** lifecycle. For our example
this specifically means that we do not want to run the `deploy` lifecycle, because we want to run `deploy function` if we
encounter a `--function` option on the commandline.

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

Thanks to the latest extension of `pluginManager.spawn()` this is now possible. The spawn method now accepts a second _option_
parameter that enables to switch special behavior of the spawn on or off (`pluginManager.spawn(command, options)`).

The option that we use now is the new `terminateLifecycleAfterExecution` option. Setting it to true will spawn the command
and its lifecycle as before, but as soon as the invoked lifecycle terminates, it will also terminate our current lifecycle and
return control to our invoker (i.e. someone who spwaned us or the CLI).

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

It is important to remember that a terminating spawn will not execute any subsequent lifecycles of the current command, so it
is recommended that you do not spawn with termination when you depend on any subsequent event in the current lifecycle that 
does some cleanups. The deploy command delegates right after the validation step.

## Enhanced logging

A much requested feature was improved logging, especially for plugin authors. There have been some changes that allow us to
let us debug our plugins with less headaches.

### Stacktraces on plugin crashes

When the `SLS_DEBUG` environment variable is set, Serverless now prints the stacktraces of the crash, even if it happened
within a plugin instead of just telling us that the plugin could not be loaded.

### Plugin loading and command registration

With `SLS_DEBUG` the plugin manager will now output any commands as well as aliases that are registered during the plugin loading.
This allows to debug crashes during plugin initialization and shows the exact location if commands and aliases have clashes.

### Log of spawned and invoked commands

With `SLS_DEBUG` all commands that are started via invoke or spawn are now logged. This allows you to see if you spawn commands
correctly or if there are any plugins that change the event chain in an unexpected way.

