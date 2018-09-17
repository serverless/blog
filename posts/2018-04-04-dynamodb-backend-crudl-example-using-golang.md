---
title: "A DynamoDB-backed CRUDL example using Golang"
description: "What a veteran coder learned about Golang by building a working CRUDL serverless example."
date: 2018-04-05
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Golang/golang-logo.png'
category:
  - guides-and-tutorials
authors:
  - PeteJohnson
---

This post is going to revolve around my adventure of building a working CRUDL serverless example in Golang. But first, some quick background about how and why I got here.

## Why I decided to experiment with Golang

Let's just say—for a software engineer, I'm kinda old. Not punchcard old, but audio-cassettes-as-storage old. It's no surprise, then, that I've used a lot of different languages: BASIC, Pascal, COBOL, assembler, C, C++, LISP, Smalltalk, Java, Javascript/Node, a little bit of Python/PHP, and an alphabet soup of .NET variants, to be exact.

I did my [first Lambda project](https://fmlnerd.com/2016/08/16/30k-page-views-for-0-21-a-serverless-story/) in Java, because I didn't want to have to get proficient in a new language while I was also learning a new platform. Even though the cold start issues didn't plague me too much—all of my processing was backend batch data collection and massaging—it was pretty clear that Java had limitations for user-facing Lambda projects.

So for [my second Lambda project](http://functionrouter.com/), I used Node.js. Like many others, I had a love/hate relationship with Node. And while I loved how easy it was to find and use new packages with _npm_, I really couldn't get past all the hoops I had to jump through to deal with callback hell. While Node is great for other tasks, it just doesn't make sense to deal with concurrency in some form when building stateless functions that almost never need it.

### And then came Golang

So when (1) AWS announced Golang support for Lambda, (2) my friends at the [Serverless Framework added support for it almost immediately](https://serverless.com/blog/framework-example-golang-lambda-support/), and (3) some [really good performance numbers for Golang Lambda functions](https://hackernoon.com/aws-lambda-go-vs-node-js-performance-benchmark-1c8898341982) started to get published, I was intrigued.

There's not a "best language for serverless" winner yet, and given the limitations I ran into my first two legitimate tries, I thought it was worth my while to give Golang a test run.

## Getting started

I started by working through [Maciej Winnicki's initial Golang example](https://serverless.com/blog/framework-example-golang-lambda-support/). After that, it seemed like a good next step was to build upon it, and produce a full CRUDL example that backed the functions with DynamoDB.

AWS had a nice [example of using Golang to interact with DynamoDB](https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/go/example_code/dynamodb), so all I did was repurpose that code so that it was called from within Lambda functions.

### The application structure

The overview below will be general, but feel free to check out all the code on GitHub: [`go-sls-crud`](https://github.com/nerdguru/go-sls-crud).

Here's the basic structure.

I put each function in its own `.go` file. Then, I centralized all the DynamoDB code in its own file, to isolate it in case I wanted to swap in a different data store later. That gave me a comfortable separation of powers: the function code dealt with the interaction with API Gateway objects, and the DAO file handled data.

I'm not entirely convinced that I got the file structure right, but it's functional, and this more complete example gave me a decent view into the good and bad of Golang.

## Golang: the good and the bad

It was nice to have a compiler back after spending a few years with interpretive languages.

I knew I'd make syntactical mistakes, and it was comforting to know that the compiler message gives you precision without the overhead of spinning up your whole binary first. I really like how the Golang compiler considers an import you don't need to be an error, helping reduce the size of your eventual upload to Lambda.

In order for Golang to scale for me, though, I'd have to be smarter about the structure of the `makefile`.  For noob level development like I was doing, having it compile every function every time was fine. But back in my C++ days, it was sure handy to have a `makefile` that was smart enough to only recompile things that changed.

Productivity got a lot better when I switched from [IntelliJ's Golang plugin](https://plugins.jetbrains.com/plugin/5047-go-language-golang-org-support-plugin) to [Atom's](https://atom.io/packages/go-plus). I found the linter to be a bit more powerful in Atom. If I were to continue with Golang, though, I'd spend some time figuring out how to get it to compile upon change using my `makefile` instead of its default install behavior.

The hardest part of this early Golang learning curve was figuring out how to segment code into different files. And frankly, I'm still not certain I'm doing it right.

I wanted to put all the DAO-like code that interacted with DynamoDB into one place so that it would be easier to swap it out for a different data store in the future. The path structure was difficult to follow, and I had trouble finding good examples. But I did eventually get it functional.

### In sum?

Overall, I really liked how Golang minimized the amount of code I had to write. Once I overcame the path structure issue and got used to the syntax, progress came quickly.

## Stuff I still need to learn, & what's next

I stopped short of working in unit or system tests for this little CRUDL example, but those are the obvious next steps in the march towards a full-blown CI/CD toolchain example.

As someone whose career started before test-driven development was a thing, I tend to favor system testing over unit testing; it tells you more about the production readiness of your code given the full interaction you get from all your components. If I were to continue with this project, I'd build some sort of endpoint testing suite ([like the one I started to build for Node over a year ago](https://serverless.com/blog/cicd-for-serverless-part-1/)).

Alternatively, I was really impressed with [Siddharth Gupta's GraphQL example](https://serverless.com/blog/running-scalable-reliable-graphql-endpoint-with-serverless/), and think it would be fun to try to build a Golang, GraphQL, serverless CRUDL example (and win Buzzword Bingo in the process 🤓).

That would provide a nice foundation for the larger killer app example I think the serverless community is missing. Something like a serverless, GraphQL version of WordPress or Discourse. This would provide a bridge between an application most people understand, and a new way of architecting it with serverless—to both lower costs and make easier to iterate over.

I'd love to hear some thoughts or suggestions on what might make sense, as the serverless revolution continues to gain ground.
