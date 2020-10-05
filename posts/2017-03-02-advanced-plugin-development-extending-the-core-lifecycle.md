---
title: Advanced Plugin Development - Extending The Serverless Core Lifecycle
description: Learn how to expose lifecycle hooks in a hook-driven Serverless plugin.
date: 2017-03-08
thumbnail: https://cloud.githubusercontent.com/assets/20538501/23727876/87005e18-041f-11e7-8bb0-cc8fd2c0ad0f.png 
layout: Post
authors:
  - FrankSchmid
---
# Introduction

In Serverless 1.x you can easily write plugins to add additional commands that in turn define a lifecycle
that can be hooked by other plugins. This works great as long as you initiate your plugin functionality by
invoking it through the defined commands.

But imagine, you've written a plugin (myplugin) that adds some functionality to the standard behavior of Serverless,
i.e. the plugin does not offer any explicit commands, but only hooks into Serverless' core lifecycle events.

```js
  this.hooks = {
    'after:deploy:deploy': () => BbPromise.bind(this)
      .then(this.prepareData)
      .then(this.transformData)
      .then(this.storeData)
      .then(this.printData)
  }
```

Your plugin is automatically invoked after the Serverless core deploy plugin left its deploy:deploy lifecycle.
With this implementation you've implicitly created a dead end in the lifecycle dependencies, but why?

*Let me explain it:* Everything works as expected as soon as `serverless deploy` is executed and its deploy:deploy
lifecycle event is run. And because you hooked after that, your plugin is executed right after the deploy has
been finished. So far, so good.

But what if you want to expose hooks by yourself in that case? What if you want a plugin to be able to hook just before
or just after your storeData() step, so that it can either add additional transformations or grab any work on the data
after you've stored it?

You just didn't offer any lifecycle events that can be hooked. That's why this is a *dead end*.

To offer the best functionality for other plugin writers, the plugin should extend the Serverless core lifecycle
and offer lifecycle events that can be hooked by others. That's what most people expect and what makes the plugin
system valuable and usable.

From a lifecycle event point of view, we'd expect that the following lifecycle events are available after
adding your plugin to any Serverless service project:

```
-> deploy:deploy
-> after:deploy:deploy
-> myplugin:data:prepare
-> myplugin:data:transform
-> myplugin:data:store
```

Now any other plugin could hook before or after any of your plugin actions. That's exactly how it should work.

# Extending the Serverless Core Lifecycle

The Serverless core implementation composes the lifecycle by inspecting the commands offered by any plugins. There is
no direct way for a plugin to inject its own lifecycle events when triggered by a hook. Only a command invocation will
start the plugin's defined lifecycle.

The solution to this problem is the plugin manager that controls the lifecycle, runs commands and triggers the hooks.
The plugin manager is available as property on the serverless object in every plugin, so we can use and access it from there.

As lifecycles can only be started by invoking a command, and the plugin manager is able to run commands, we already have a 
feasible solution here.

In short, we have to define an internal command, that defines our plugin lifecycle and that can be
run by the plugin manager from within our hook implementation. Here's the step-by-step walkthrough.

## Adding Our Internal Command(s)

We add the internal command to our plugin, although the plugin is only triggered by hooks.
```js
class myPlugin {
  constructor(serverless, options) {
    ...
    this.commands = {
      myplugin: {
        commands: {
          data: {
            // Definition of out myplugin:data:* hookable lifecycle events
            lifecycleEvents: [
              'prepare',
              'transform',
              'store',
              'print'
            ]
          }
        }
      }
    }
    ...
  }
}
```
The command only defines the lifecycle, not anything else. We don't want to let it be called from the user.

## Invoke the Command Within Our Hook / Enter Our Lifecycle

In our hook we now use the plugin manager to enter our very own plugin lifecycle. Therefore we modify our hook's
definition from above.

```js
  this.hooks = {
    // Main hook entry point - starts our data lifecycle
    'after:deploy:deploy': () => this.serverless.pluginManager.run(['myplugin', 'data']),
    // New sub lifecycle event implementations
    'myplugin:data:prepare': () => BbPromise.bind(this)
      .then(this.prepareData),
    'myplugin:data:transform': () => BbPromise.bind(this)
      .then(this.transformData),
    'myplugin:data:store': () => BbPromise.bind(this)
      .then(this.storeData),
    'myplugin:data:print': () => BbPromise.bind(this)
      .then(this.printData)
  }
```

## Multiple Descriptive Sub Lifecycles

You may have noticed the it would be possible to define additional lifecycles besides the 'data' lifecycle.
For larger plugins that will make the lifecycle model much more structured and transparent and implicitly adds
more intuition to your exposed lifecycle events.

**Example:**
```
-> deploy:deploy
-> after:deploy:deploy
-> myplugin:data:prepare
-> myplugin:data:transform
-> myplugin:data:store
-> myplugin:analysis:evalBandwidth
```

A further advanced use case could be a combination of user command lifecycles and internal lifecycles. Your plugin
could offer additional commands that are accessible by the user and can also be invoked within your internal
hook chain. There are no limits to what you can do there.

## Prevent Invocation from the Outside (User)

Serverless will show all defined commands in its help output and every shown command normally can also be executed.
For our internal hook lifecycle both of these behaviors are issues, so we have to add a workaround - Serverless does 
not allow commands to not be exposed nor does it allow you to hide commands from the help output.

We add a small description to our data command that will be shown on the help screen and a validate lifecycle event that
we'll use to check if the invocation has been done from our hook implementation:
```js
        ...
        commands: {
          data: {
            usage: 'Internal use only!',
            lifecycleEvents: [
              'validate',
            ...
```

Additionally, we prevent the user from starting it via 'serverless myplugin data' and add a local invocation check to our
hook implementation and the new validate event as follows:

```js
  ...
  // Our main entry point
  'after:deploy:deploy': () => {
    this._triggeredFromHook = true;
    return this.serverless.pluginManager.run(['myplugin', 'data']);
  },
  'myplugin:data:validate': () => this._triggeredFromHook ? BbPromise.resolve() : BbPromise.reject(new Error('Internal use only')),
  ...
```

Maybe the plugin manager can support some flag for internal commands in the future that prevents calling from the outside and 
display on the help screen. Then the trigger check can be removed completely.

# Conclusion

Hopefully this approach will make your plugins more flexible and allow other plugin contributors to integrate easily with them.
