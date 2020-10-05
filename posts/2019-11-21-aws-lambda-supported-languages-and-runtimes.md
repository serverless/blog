---
title: "The State of AWS Lambda Supported Languages & Runtimes (Updated November 2019)"
description: "A look at the past, present, and future of AWS Lambda runtimes."
date: 2019-11-21
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-11-state-of-lambda-runtimes/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2019-11-state-of-lambda-runtimes/header.png"
category:
  - news
authors:
  - FernandoMedinaCorey
---

### Overview

In the last few years a lot has changed with AWS Lambda supported languages and runtimes. With all of these changes there are some older runtimes reaching the end of their supported life and several new runtimes and new features to think about taking advantage of.

Real quickly, let's make sure we're all on the same page with our terminology. By a `supported language` I'm talking about something like Node.js, Python, or Java. By a `runtime` I mean a specific version of that language like Python 3.7 or Java 11. Now let's take a look at some of the upcoming changes and what they mean for you.

## Managed Runtimes

When AWS Lambda was launched you could only pick from a small set of AWS Lambda runtimes for your functions. While you could try and hack the underlying container somewhat to support additional runtimes, you ended up doing that at your own peril. Because of the popularity and demand for AWS Lambda, support for additional languages, and newer languages versions quickly followed.

As of right now, there are several runtime versions of Node.js, Python, and Java. You can also use the Ruby, Go, and .NET Core runtimes. All of these runtimes don't require you to do anything other than specify what runtime you're looking for and you're good to continue writing your code, configuring your events, and pressing onwards.

## New Managed Runtimes

In the last week or so, AWS also launched three new supported runtime versions for AWS Lambda: Node.js 12, Python 3.8 and Java 11. This means that you can take advantage of new language features and performance improvements in these runtimes just by reviewing the compatibility of these new versions and migrating your function code over.

And of course, the Serverless Framework already has support for these runtimes! Just set your `runtime` in `serverless.yml` to `python3.8`, `nodejs12.x` or `java11` and you'll be good to go! For more information on these supported runtimes and AWS Lambda you can check out our [Ultimate Guide to Lambda](https://serverless.com/aws-lambda/#languages-runtimes).

So what's new with these runtimes? First of all, all these new runtimes rely on an Amazon Linux 2 execution environment so keep this in mind if you're interacting with the operating system layer and might rely on something that differs between the OS versions. Additionally, each of these runtimes brings with it a bunch of new language features - let's take a look:

### [Python3.8 releases](https://docs.python.org/3/whatsnew/3.8.html)

- Assignment expressions allow you to assign variables within expressions using the new `:=` also known as a "walrus operator"

```py
# Before Python 3.8
walrus = True
print(walrus)
```

The above would print `True` but requires a separate statement for the variable assignment. Now, you can use assignment expressions to do the same thing in a single line:

```py
# Now in Python 3.8
print(walrus := True)
```

- Positional-only parameters introduce a new syntax with the `/` character to require some function parameters be specified positionally and prevents them from being keyword arguments. This can be combined with the `*` character a function definition to require named arguments. For example:

```py
def my_function(positional_argument, /, positional_or_named_argument, *, named_argument):
    print(a, b, c, d, e, f)
```

When calling the function above, you must always provide the `positional_argument` positionally. The `positional_or_named_argument` can work either way and the `named_argument` must be named when you call the function. This allows you to change positional arguments at a later time and reserve some keywords for future possible arguments in your functions.

- There are additional features and performance improvements for the `csv` module that might benefit folks using Lambda to parse csv files.
- The new, fully-supported `asyncio.run()` method is now a stable part of the language to help manage coroutines

A full summary of Python 3.8 release details can be found [here](https://docs.python.org/3/whatsnew/3.8.html).

### [Node.js 12.x](https://medium.com/@nodejs/introducing-node-js-12-76c41a1b3f3f)

The Node.js 12.x runtime is the current Long Term Support (LTS) version of Node. This means that using it for current functions will give you the longest stable life for your code. You'll also get any of the minor updates as AWS pushes them into the runtime for security and performance reasons. Here are some of the new features and improvements in Node.js 12:

- V8 has been updated to 7.4 and may be upgraded to 7.6 later in Node 12's lifetime
- Support for TLS 1.3 and other TLS improvements
- A new experimental feature called a "Diagnostic report" that will let you generate a report on demand or when certain events occur
- Potentially significant startup improvements that may give "a ~30% speedup in startup time for the main thread."

You can review the full release details [here](https://medium.com/@nodejs/introducing-node-js-12-76c41a1b3f3f).

### [Java 11](https://www.oracle.com/technetwork/java/javase/11-relnote-issues-5012449.html)

- This version introduces a native HTTP Client API that can make interacting with HTTP services easier
- It also has additional support for TLS 1.3 
- You can now use `var` to declare local variables (introduced in Java 10)
- Additional support for security and cryptography and various other language improvements and optimizations

You can read more about the Java 11 release details [here](https://www.oracle.com/technetwork/java/javase/11-relnote-issues-5012449.html).

## Developer-Provided Runtimes

In addition to all the benefits of the AWS-managed runtimes, AWS also has support for brining your own custom runtimes. This process was enabled by the Lambda Layers feature which allows you to share code and dependencies across functions more easily. Using Lambda Layers you can also bring your own custom runtime like Rust or PHP. This is also supported using the Serverless Framework by using the `runtime` value of `provided` in your `serverless.yml` files and creating a Lambda layer that contains this runtime. The process of creating the layer is slightly different for each custom runtime you might want to work with, but an example of your `serverless.yml` file for PHP might look like this:

```yaml
service: php-service
provider:
  name: aws
  runtime: provided
  region: us-east-1

functions:
  hello:
    handler: handler.hello
    layers:
      # In order to get this Ref name you will TitleCase the layer name ("php" --> "Php") and append "LambdaLayer"
      - {Ref: PhpLambdaLayer}
layers:
  php:
    path: layer/php
```

If you'd like an example on creating a PHP Lambda layer, you can take a look at [this guide](https://akrabat.com/serverless-php-on-aws-lamda/) by Rob Allen.

## Runtime Deprecations 

With new runtimes coming out all the time you also have to watch out for the other side of the coin - runtime deprecations. AWS also has a few runtimes scheduled for deprecation in the coming months. You can always keep tabs on the [deprecation schedule](https://docs.aws.amazon.com/lambda/latest/dg/runtime-support-policy.html) here, but it isn't always updated.

**Node.js 8.10**

As of November 2019, the next deprecation appears to be Node.js 8.10 and AWS plans to prevent creating new Node.js 8.10 functions on Jan 6, 2020 and prevent updating them on Feb 3, 2020. It is probably a good idea to start testing and migrating functions in Node.js 12.x at this point.

**Python 2.7**

Additionally, while Python 2.7 isn't listed on the runtime support policy page that AWS provides, it is ending it's supported life on Janurary 1, 2020 and AWS has mentioned elsewhere that a similar deprecation pattern will happen at that time.

For each of these deprecated runtimes, existing functions should theoretically continue to respond to invocations - you just wont be able to update them after the final deprecation. Moving off these old runtimes is **highly recommended**. But if for some reason this is completely impossible you might want to consider how Developer-Provided Runtimes could technically act as a loophole to extend your ability to work with code written for these runtimes for a little longer.
