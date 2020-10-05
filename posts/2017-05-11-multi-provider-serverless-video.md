---
title: The Multi-Provider Future of Serverless Application Development [Video]
description: Serverless Product Manager Brian Neisler gives tips for overcoming provider lock-in to create more portability and freedom in your Serverless projects.
date: 2017-05-11
thumbnail: https://cloud.githubusercontent.com/assets/20538501/25921531/625cca6c-359b-11e7-8f63-1435740a74cc.png
layout: Post
authors:
  - BrianNeisler
---

[Serverless Meetups](https://www.meetup.com/pro/serverless/) are a gathering place for anyone interested in building web, mobile and IoT apps with serverless or event-driven architectures using the [Serverless Framework](https://github.com/serverless/serverless) or other tools. Writing a serverless function is easy. But deploying that same function to multiple cloud providers can seem impossible. The serverless community in SF recently gathered for a discussion on how developers are overcoming provider lock-in, creating portability and freedom in their Serverless projects.

Serverless, Inc. Product Manager Brian Neisler gave a talk covering some of the main challenges behind multi-provider support for serverless functions and what the Serverless Framework team is doing to solve them.

## Watch the video

<iframe width="560" height="315" src="https://www.youtube.com/embed/d7LsJ0KSlh8" frameborder="0" allowfullscreen></iframe>

## Transcript

**Brian:** Thank you, everyone, for coming out. These Serverless Meetups are always a really good time, and you learn a lot of really cool, new technologies. So hopefully I can shed a little bit of light on something that's neat and interesting. Definitely, if you have any questions afterwards, feel free to come up and chat with me or find me in the back. So I'm going to be talking tonight about multi-provider Serverless and some of the challenges associated with multi-provider - specifically around writing multi-provider functions and what this means. What this opens the door for. This is really our vision of where we see both Serverless and multi-provider support going. 

So first, a little bit about me. Casey already mentioned this, but I'm Product Manager over at Serverless. There's my contact info. Feel free to take it down. Reach out to me if you've got ideas, questions, you just want to talk about Serverless in general. Always interested in meeting new people. Alright. So Serverless. The serverless movement kind of speaks for itself. It's really taking off. Lots of clear interest, especially since 2016. We’ve seen a massive uptick, definitely a wave of new technology emerging. 

So the question is, what is this all about? I think some people definitely have this kind of core question of, "Hey, what's going on over here? It sounds interesting." Hopefully, I can shed a little light there. Some people are calling it the next step in cloud computing. It's the natural evolution. We went through virtual machines and Platform-as-a-Service (PaaS), containers. Now, we're kind of touching on this next thing, which is serverless. But I think it's a little bit more than that. What it really is, is this idea from the developer's perspective that, "I just want to create without restriction."

I think we all feel this way. That we want to be able to introduce new things into the world and not be prohibited by boundaries, not be prohibited by just the general idea of having to think about, "How do I get this out to as many people as possible?" It should just naturally happen. I think we're all, especially in this room, feeling that that's the way that development should occur. So in a lot of ways, we're kind of moving past scale. We're heading into this era of optimization, which is an interesting one. 

Because instead of thinking about, "How am I just going to support as many people as possible?" now we're really thinking, "How do I optimize for specific use cases? How do I get my business logic, my data, as close to the use case as possible?" Sometimes that's the end user, but then it also might be data processing or any other type of backend-style applications. So this is a kind of basic example of what I call the "optimization problem." Right? 

You have your end user, your function, and then the data and the third-party services that it needs to interact with. There's all these things that we want to be able to optimize for; we want to be able to optimize for capacity, latency, region. Sometimes whenever you're dealing with certain restrictions, those types of things - the provider, cost, security - these are all things that we have to take into account when we think about optimizing where our business logic lives, where is it running. 

So I think the general value proposition that we're talking about for serverless and kind of where serverless as a whole is going is this idea that you can offer a developer the lowest total cost of ownership. We can take away the problems of scale and optimization, and security, all the things that are usually really difficult to think about, and allow them to be able to have highest output. Really give them that ability to be able to innovate, have productivity, be able to create new things. Again, that's, you know, what we all want. But we want more. We also want freedom of choice. We want the ability to be able to determine where this thing is going to run, who am I going to be depending upon, and not to be potentially locked into specific providers. 

So that's kind of the theme of the talk tonight, about how do we kind of remove some of those restrictions and give us that freedom of choice to allow us to be able to move between multiple layers, or multiple different providers, and effectively run our code where we want to. But before we dive into that, for those of you who might be newer to serverless, let's do a quick little recap here. 

What is serverless? So this is the definition we like to use with serverless, though the servers exist, yes, there are servers there, the developer does not have to think about them. That's kind of the way we've been thinking about this conceptual serverless concept. Again, removing that concern and need to have to think about these things, and instead offloading that to these larger providers and other systems, to be able to handle some of these complex problems. 

So serverless qualities, these are the things we like to associate with serverless in general and the general concept of serverless. So microservice, server administration, event-driven, built on top of powerful platforms, and a real key one here is pay-per-execution. This is something that is huge for developers, this ability to be able to only pay whenever your code is actually running. That opens so many doors for people to be able to build new and very interesting things that originally weren't even feasible. So I think this is a real key kind of component to the quality of what serverless offers. 

General, just quick serverless architecture, I think everyone is pretty familiar with this. But again, the general concept of Lambda is this idea of infinite scale very quickly, and that it's on demand. So you're only paying for what's executed, handles bring it up and bring you down, all very, very fast. Serverless compute providers, so there are a lot of obviously big companies in this game. We're talking about, obviously, AWS. But Microsoft, Google, IBM, these are all major providers that are entering into this space and giving us more options. 

So that being said, the question that we oftentimes get is, "What about lock-in?" How do we kind of overcome this problem of being locked in to a particular provider? So it's an interesting question, and I think it's definitely a valid concern. It's one that we hear a lot whenever we're going and talking to customers, and just talking to people in the industry in general. But I want to make a clear distinction here. I think something that's missed when we talk about this is that there's too different types of lock-in that we're referring to here. 

We're talking about compute lock-in, which is this idea of, "Where's my function actually going to execute? Is it being locked in to a particular provider, and then incompatible with other ones so that I would have to actually make code changes in order to be able to move it to a new location?" And service lock-in. Service lock-in, giving it a little bit clearer of a definition here, but that's the idea of being dependent upon a third-party service. Utilizing a third-party service within your function creates a form of lock-in. Right? You are now dependent upon that service. So there's two different types there. 

So compute, lock-in, kind of inability to potentially take one function and move it to another provider, and service lock-in. Again, you may have a function that does work appropriately across multiple providers. But again, they all make use of that same service, and so therefore, they are dependent upon that particular service. So there are different problems. Some of these problems we can solve. Some of them we can't. It's just kind of the way of things. 

So this one specifically is about solving compute lock-in. How do we get to this point where I can write a function and easily deploy it to any potential provider? So our solution here, we can solve compute lock-in by creating what we call "provider-agnostic functions." It's the idea that I'm writing a function that is in a format that can work inside of any provider. So you can take that single function, move it over to another provider, and it will work in the exact way that you would expect it to. But we're still bound to services in this area. This doesn't solve the service lock-in problem. It is just a solution for the idea of compute lock-in. 

So provider-agnostic functions. There's a few problems associated with provider-agnostic functions. James Thomas from IBM gave this really great talk called "Taming Dragons." He referred to each of these problems as basically a dragon to be tamed. As I think it's a pretty apt description, there are some definitely, rather complex problems here to try and deal with. But I highly recommend checking out this talk. He did an excellent job of kind of breaking down these problems. I'll walk through the core basics of these things here, but I definitely can't do his talk justice. 

So some of these problems can be fixed. Interfaces problems, so this is the basic idea that functional interfaces are different across providers. Each provider expects a different function format, and this is kind of like one core problem to being able to take a function, and then cleanly and easily be able to move it over to another provider. So the interface solution, this is part of what the Serverless team has been working on is this idea of we want to be able to effectively wrap or provide the kind of interface point for your function. So that we can have this kind of universal function format that you can then convert from the provider into this format. 

That would give you a way then of being able to take a single function and deploy it to any provider, and that kind of conversion layer would do what's necessary to be able to bring in the parameters appropriately, and to be able to handle the response appropriately that comes out of that function, both in a SyncEnd and asynchronous way. This is kind of a little sneak peek at some of the general concepts of what we're working on currently on the team. So there's also an events problem. So this is the basic idea that event shapes and available events are different across providers. So there's a little bit of two different problems here. 

The general idea of event shapes being different is that an HTTP event that you get inside of Azure might look a little bit different than what you get inside of AWS or what Google gives you, etc., and the idea that each provider has different offerings. Right? So therefore, there are different events associated with those different offerings. I would argue that that's a little bit similar to the service problem. If we have customer events that are specific to a particular service, there's not necessarily a clear solution for that. But for the common ones, we can offer a common event shape. 

So here, we're talking about again this idea that, through this wrapping layer, we can take in the inbound events, identify the types, and correctly convert them into a shape that you would expect. This way, whenever you're dealing with that event, you can write your code in one way and it will work appropriately across all providers. Some problems, though, are harder or don't have appropriate solutions. So one of these is the runtimes problem, for instance. This is an idea that providers offer different languages and different versions of those languages, and this is something that is definitely more difficult to overcome. 

But there are some partial solutions. Right? We have a few tricks in the bag that you can use to kind of overcome these particular issues, especially things like transpilation, shimmying. I was talking with Nick Graf [SP], who was in the audience earlier today, about whether or not we could shim up or down, depending upon if you wanted to run a different version of Node, or a different version of whatever language you needed. So there are some kind of interesting, conceptual ideas there, but again they're not really full solutions. 

But I think the providers are definitely keenly interested in this area, and are trying to move forward, keeping their environments up to date, keeping the language versions up to date, offering new languages, etc. So this is a problem that is likely to get a lot better on its own. The SDKs problem, so this is a fundamental concept that the providers' offerings can be accessed through their SDKs. Right? We have this ability to be able to make use of the providers' functionality through the SDKs that they give us. But these SDKs are different on a per provider basis, obviously, because they have different offerings, plus the idea that they just provided you their own code. 

So in that scenario, there, again, a couple of partial solutions. So for the interfaces issue, for the common types of functionality, like function invocation, if you wanted to be able to invoke a function within the provider, we can offer an SDK that would allow you to be able to correctly invoke against the correct SDK. So it can kind of handle that conversion. But again, different offerings, this is really the same problem as service lock-in. We're depending upon a third-party service or a managed service in this scenario that the provider is offering. 

So again, that's kind of the same problem in this scenario. So the question is, what do we do about service lock-in? I would make the argument that third-party services are here to stay. They're not going anywhere. In fact, if you think about the kind of momentum associated with just the general ecosystem altogether, it's more likely that more services are going to be introduced. Things are being created kind of faster than ever. I mean, the whole point of serverless is to make it easier to write more services. 

So we're only going to see more and more of these things get created. In fact, I think we're going to see much more sophisticated services being created. The fact that we were able to remove some of these hard problems opens the door for people to be able to build much more complicated things. These complicated things are clearly things that we will depend upon, and we want to be able to make use of these things. We get some questions about this idea of, "Well, can we abstract? Can we find the common overlap, and then abstract those types of things, downward?" 

I don't necessarily know that this is really a solution. You're kind of attuned to the idea then that you're really just getting the lowest common denominator of functionality, and that's not necessarily something that I think we all want. Then, oftentimes, the devil is really in the details there. We're talking about little things that we can do to either optimize, or little bits of functionality that we want to be able to take advantage of and that we wouldn't be able to through abstraction. 

So we don't really see that potentially as a solution. But what we can do, we can look at solving this optimization problem. We can try to make it very easy to be able to inject your functionality and to make use of these third-party services, and bring your functions to that correct point of optimization. We can focus on, again, looking at capacity and region, latency, cost, security, provider, all of these things, and kind of finding that sweet spot of getting your function at the perfect point between your end user and the things that it needs to actually be able to operate on. 

A lot of those third-party services kind of fall under that umbrella. What's interesting about this problem is that, especially going back to the idea that you're only paying for whenever you're actually running, is that some of these problems actually get very easy to solve. We can, in all reality, just deploy everywhere. We can take our function and put it across all providers, and all regions, and not have to worry, actually, about the fact that it's been deployed everywhere. Normally, that would've been a nightmare and extremely costly. 

But nowadays, this is actually a real approach. So this kind of opens the door for us to really be able to say, "Hey, here's how we can effectively handle all regions, remove the kind of concerns, and make regions be something that's agnostic, and handle multiple providers, etc." So that your function and your kind of core functionality can get as close as possible to the services that it's making use of. I think that's where we, in general, can really see these things going. 

So that's my general presentation. These are some hard problems. If you want to help us solve these problems, we are hiring. Like we actively need really good developers, and we have a lot of really good developers on board. But it takes an army to solve these problems. I think, these are all ones, again, going back to the idea that we just want to be able to create and we want to be able to do it without restriction, and I think that's really what we're out to do, trying to make that a reality. Any questions? Anything I can help shed some light on? 

**Person 1:** I'm curious about the runtime problem. Where you might have different providers offering different versions of languages, or libraries. What do you think about using containers as a layer of abstraction there? 

**Brian:** Yeah. I mean, when you're talking about running Lambda functions within kind of a compute provider, clearly containers, I think, is an option for if you want to run your own container system. Right? But it doesn't really open that same door, at least not unless I'm missing something. But it doesn't really open that same door of being able to easily just hand over that code to a provider and say, "Let them run with it." So that's why the shims, I think, are an interesting approach. 

Clearly, I think, there's obviously some great work going on in the containers area, which kind of solves that problem. But a lot of these problems are very provider-specific and they kind of have those systems locked up. So it becomes a much more harder problem to solve, since it's no longer within the developer's control. You're giving that control over. 

**Person 2:** I think the difference with Lambda, why Lambda got so much attention is just it spins up so quickly. You can't do that with containers. They're heavy. Lambda spins up fast enough to handle HTTP requests and return a response. That's one of the big benefits of using Lambda. Runtime, I wouldn't say it's that bad, actually. I mean, all the runtimes are pretty consistent. The difference is, maybe if you use Lambda, the AWS SDK is there.

**Brian:** Right. 

**Person 2:** But you're probably not going to be using AWS SDK on Google when you provision a Google Cloud Functions. So I don't think it's a big problem. Me, personally, I love the value of containers. I get it. Affordability, having that perfect consistency. I just don't want to think about that, actually. 

**Brian:** Yeah. Right. 

**Person 2:** I don't want to manage the lifecycle of containers, personally. I just don't want to care about that stuff. I want to Runtime as a Service, have pretty strong consistency. You know, if you're using Node.js 4.3 on AWS Lambda, Node.js 4.3 on Cloud Functions is going to be pretty consistent give or take an SDK or something like that. 

**Brian:** Yeah. I think one of the interesting spaces there is this idea of, right now, clearly, we see a pretty wide division in terms of the languages that are being supported by different providers. But one of the kind of cool aspects of becoming provider-agnostic is that you can actually make use of multiple providers at the same time, today, to handle those different languages for you. Right? So by being able to write these kind of provider-agnostic functions, you can then have this bulk of functionality, which you can easily deploy to a different provider in order to give you that language that you need. This opens up, I think a lot of doors. 

**Person 2:** Yeah. 

**Brian:** So again, it's that idea of, if we can get away from having to be concerned with, "Which provider is going to run my compute and where is it going to land?" instead, just like, "Hey, I want to run on C#." Like, "Okay. Go find a place to run C# or F#, great." They're like, "This is supported over here," and you can literally just go and it would figure out where to put it for you. I think that's part of the vision that we see coming down the road. 

**Person 3:** When we made the Serverless Framework, it was amazing how many people from the container community immediately came over. We didn't know this was going to be that appealing to them. But the reasons are kind of timeless. Like they just want to manage less. They don't want to think about containers anymore, or have any cognitive overhead related to containers. So what the future looks like to us, I think, it's a lot of serverless functions. It's containers for certain use cases. Functions-as-a-Service do have limitations still, like a five-minute maximum duration and language limitations, and stuff like that. 

But it's incredible, these qualities that Brian put out there: micro-services, event-driven, pay-per-execution, zero administration. Amidst these big platforms, we have all these other services we can work with compute. It's the lowest total cost of ownership, a.k.a. so convenient, that people are using them increasingly for every use case under the sun. It's that convenience that brings all users and use cases to the table. So in terms of the future, I think containers will be a part of that, I think a lot of serverless functions.

More serverless functions than anybody anticipates, too, because all these companies, we see these serverless teams growing in each company, and these teams are like two people, two developers, and they're provisioning hundreds of functions. Right? Because once they provision a function, they're done. They don't have to operate it anymore and really worry about it, or pay for it until it gets spun, crazy productive. So I think the future is kind of like containers are part of that, lots of serverless functions, more than anyone kind of anticipates right now, no APIs. It's a mesh, you know, of architecture. 

**Brian:** Any other questions? Oh, go ahead. 

**Person 4:** So I like the idea of solving this lock-in problem. I have been dealing with it a bit for databases. So when you provide the rack you are actually [inaudible 00:23:54] your own locking in that. Right? Or maybe not. [inaudible 00:23:59].

**Brian:** Yeah. That's a fair question. So part of what we're trying to do to avoid that being the case is that, our wrapper we are open-sourcing. So this is something that you can take in open source, and you can literally go wrap your own code, and then just put it wherever you need to. So it's not meant to be, clearly, a form of lock-in. The other thing that we're really trying to do is to also bring you down to kind of the root fundamentals. It's this idea that a function at the end of the day is arguments, and it's return type. Right? 

If we can get the behavior of these functions to behave in exactly that way, then I think we can start to kind of stop having these very specific function signatures, and instead being able to use them in kind of any way that we desire. So I think there's a lot of things there that we're pushing to the open source community, because we understand, clearly, that's a concern. 

**Person 5:** Lock-in is such a weird thing. Like it's natural. Right? As humans, we're locked into the Earth. The Earth is our platform. I'm locked into oxygen. The thing we talk about a lot is we hear people characterize this as lock-in and stuff, and we understand it's about concern, especially, for the enterprise, of course. It's not a different field to be able to diversify. That's the a huge problem. 

**Person 4:** The open source might not be the ultimate solution for the lock-in problem. Because the open source tool, whoever want to use it for free, at the same time, they might not have the capability that you guys do. So eventually, you still have to get a service, some kind of service lock-in behind this open source. So it's still a different layer again. It's a chicken-egg problem.

**Brian:** Of course. 

**Person 4:** I'm not saying you're not doing a good job. But it's kind of like a philosophy issue. When I was trying to deal with lock-in of the current situation, you're always ready to... It's just how you say it. 

**Person 6:** Yeah. I mean, what we have seen at Fauna, it's like right now, if you use something, you've invested in it. In particular, at the data tier you choose to get locked into proprietary software and the specific infrastructure provider, which doesn't make sense. Like there's no reason... They have the software like Google Spanner... is not actually specialized to the hardware. 

So at Fauna for example, Fauna is a service, you can also [inaudible 00:26:19]. You can choose which cloud providers you want your database has to be provisioned in. So you can pass directly through your functions to the regions you would be in [inaudible 00:26:33]. 

**Person 4:** I see you are improving user experience by... Instead of saying, "You're not getting [inaudible 00:26:42] lock-in computing," you're just improving the user experience. That kind of explains what [inaudible 00:26:49]. 

**Person 6:** Like unless you use physical machines that you go in and can build yourself, I guess, you can't ever get out of lock-in to something. 

**Person 6:** You can increase development choice by an enormous amount by removing these artificial [inaudible 00:27:06]...

**Person 4:** But eventually, it's a user experience or performance you're exposing to the user or you're enhancing over time. 

**Person 6:** Yeah. Like Amazon doesn't own JavaScript. That shouldn't be the only place you can write node. They don't have disks either or keep a database there. Why [inaudible 00:27:25] be made inside the infrastructure? 

**Person 7:** The user experience is one way of characterizing it. I characterize it as possibility. Because the interesting thing about the serverless function is zero administration and pay-per-execution. What you get out of that is you can start putting functions everywhere, across multiple providers. I mean, why not? To replicate it across regions, just like Brian was saying, deploy everywhere across multiple providers. What you get out of that is these big cloud providers are offering so many other high-value services, machine learning services, storage services. 

The easiest way to adopt a cloud provider now to gain access to those other services is just put a function there. It's not going to cost you anything until it runs. Put functions everywhere. Why not? So we talk about it in the context of lock-in and we try to chip away at that problem. I don't know if it can ever be solved, but we chip away at it. But I like to refer to it now as just possibility. As a developer, I just want to use every single tool under the sun to solve my damn problem. 

I don't want anyone telling me, "You can only use the tools in the Amazon platform," and stuff like that. No, no, no. Let me just put a code wherever I want, and from that code, I can access all these great services and stuff. We get this regular request like, "Oh, we love Lambda. It's amazing. But we really want to use Google's machine learning stuff, because they're doing the best at that right now. We wish we had a great alternative to DynamoDB. Does anyone know an awesome service [inaudible 00:28:56]?" 

**Person 8:** One more question about hiring for Serverless. Do you have remote employee, or can you talk a little bit about... 

**Brian:** Yes. 

**Person 9:** Yeah, we do. If you want to come speak with myself, Brian, Austin, or Nick after this, we're happy to give you some more information. Thank you. 

**Person 10:** We build a company like we build software, everything, product strategy, values, all that stuff. Regardless of role or location, you can have an impact by just submitting a PR in the company repo. You can change the whole company overnight. 

**Person 9:** Thank you, Brian. Did you have any last? 

**Brian:** No. If there are no other questions. Thank you.
