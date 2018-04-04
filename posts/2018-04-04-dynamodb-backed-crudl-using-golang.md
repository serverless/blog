---
title: DynamoDB-Backed CRUDL using Golang
description: "What a veteran coder learned about Golang by building a working CRUDL serverless example."
date: 2018-04-04
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/Golang/golang-logo.png'
layout: Post
authors:
  - PeteJohnson
---

## DynamoDB-backed CRUDL in Golang

For a software engineer, I&#39;m kinda old.  Not punchcard old, but audio-cassettes-as-storage old.  It&#39;s no surprise, then, that I&#39;ve used a lot of different languages.  BASIC, Pascal, COBOL, assembler, C, C++, LISP, Smalltalk, Java, Javascript/Node, a little bit of Python/PHP, and an alphabet soup of .NET variants, to be exact.

[I did my first Lambda project in Java](https://fmlnerd.com/2016/08/16/30k-page-views-for-0-21-a-serverless-story/) because I didn&#39;t want to have to get proficient in a new language while I was also learning a new platform.  Cold start issues didn&#39;t plague me too much since all of my processing was back end batch data collection and massaging, but it was pretty clear what Java&#39;s limitations were for user-facing Lambda projects.

Like many others, I have a love/hate relationship with Node.js.   [My second Lambda project](http://functionrouter.com/) used it and while I love how easy it is to find and use new packages with _npm_, I just really can&#39;t get past all the hoops you have to jump through to deal with callback hell.  While it is great for other tasks, it just doesn&#39;t make sense to me to have to deal with concurrency in some form when building stateless functions that almost never need it.

So when [AWS announced Golang support for Lambda](https://aws.amazon.com/blogs/compute/announcing-go-support-for-aws-lambda/), my friends at the [Serverless Framework added support for it almost immediately](https://serverless.com/blog/framework-example-golang-lambda-support/), and some [really good performance numbers for Golang Lambda functions](https://hackernoon.com/aws-lambda-go-vs-node-js-performance-benchmark-1c8898341982) started to get published, I was intrigued.  There&#39;s not a &quot;best language for serverless&quot; winner yet and given limitations I ran into my first two legitimate tries, I thought it was worth some time to try out Golang.

## What I Did

After working through [Maciej Winnicki&#39;s initial Golang example](https://serverless.com/blog/framework-example-golang-lambda-support/), it seemed like a good next step was to build upon it to produce a full CRUDL example that backed the functions with DynamoDB.  To AWS&#39; credit, they have a nice [example of using Golang to interact with DynamoDB](https://github.com/awsdocs/aws-doc-sdk-examples/tree/master/go/example_code/dynamodb), so all I did was repurpose that code so that was called from within Lambda functions.

[You can try it out yourself](https://github.com/nerdguru/go-sls-crud), but the basic structure is that I put each function in its own .go file. Then I centralized all the DynamoDB code in its own file in an attempt to isolate it in case I later wanted to swap in a different data store.  That gave me a comfortable separation of powers where the function code dealt with the interaction with API Gateway objects while the DAO file handled data.

I&#39;m not entirely convinced that I got the file structure right, but it&#39;s functional and this more complete example gave me a decent view into the good and bad of Golang.

## What I Liked/Disliked

It was nice to have a compiler back after spending a few years with interpretive languages.  I knew I&#39;d make syntactical mistakes and there was something comforting about the precision a compiler message gives you without the overhead of spinning up your whole binary first.  In particular, I like how the Golang compiler considers an import you don&#39;t need to be an error, helping reduce the size of your eventual upload to Lambda.

In order for Golang to scale for me, though, I&#39;d have to be smarter about the structure of the _makefile_.  For noob level development like I was doing, having it compile every function every time was fine but back in my C++ days it was sure handy to have a _makefile_ that was smart enough to only recompile things that changed.

Productivity got a lot better when I switched from [IntelliJ&#39;s Golang plugin](https://plugins.jetbrains.com/plugin/5047-go-language-golang-org-support-plugin) to [Atom&#39;s](https://atom.io/packages/go-plus).  I found the linter to be a bit more powerful in Atom, although if I were to continue with Golang I&#39;d spend some time figuring out how to get it to compile upon change using my _makefile_ instead of its default install behavior.

The hardest part of this early Golang learning curve was figuring out how to segment code into different files and as I mentioned earlier, I&#39;m still not certain I&#39;m doing it right.  I wanted to put all the DAO-like code that interacted with DynamoDB into one place so that it would be easier to swap it out for a different data store in the future if I wanted.  The path structure was difficult to follow and I had trouble finding good examples but eventually got it functional.

Overall, though, I really liked how Golang minimizes the amount of code you have to write.  Once I overcame the path structure issue and got used to the syntax, progress came quickly.

## Stuff I Still Need to Learn and What&#39;s Next?

I stopped short of working in unit or system tests for this little CRUDL example, but those are the obvious next steps in the march towards a full-blown CI/CD toolchain example.  As someone whose career started before test-driven development was a thing, I tend to favor system testing over unit testing because it tends to tell you more about the production readiness of your code given the full interaction you get from all your components, so if I were to continue I&#39;d build some sort of endpoint testing suite [like the one I started to build for Node over a year ago](https://serverless.com/blog/cicd-for-serverless-part-1/).

Alternatively, I was really impressed with [Siddharth Gupta&#39;s GraphQL example](https://serverless.com/blog/running-scalable-reliable-graphql-endpoint-with-serverless/) and think it would be fun to try to build a Golang, GraphQL, serverless CRUDL example (and win Buzzword Bingo in the process 8)).  That would provide a nice foundation for the larger killer app example I think the serverless community is missing to win over more converts.  Something like a serverless, GraphQL version of WordPress or Discourse would provide a bridge between an application a larger number of people understand and a new way of architecting it with serverless to lower costs and make easier to iterate over given the smaller pieces.

I&#39;d love to hear some thoughts or suggestions on what might make sense, as the serverless revolution continues to gain ground.
