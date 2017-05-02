---
title: "Serverless Air #2 - The Serverless ecosystem now & where it's going with Jared Short"
description: Jared Short from Trek10 joins us to share his take on the serverless ecosystem and where it's going.
date: 2017-05-01
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/jared-short.jpg
authors:
  - DavidWells
---

In this episode, Jared Short from Trek10 joins us to share his take on the serverless ecosystem. We get his take on where he thinks the serverless world is headed.

We dive into current challenges in the space while discussing his #AWSWishlist for 2017 and touch on why servers still have their place in the stack.

He also goes into detail on Trek10's auto scaling dynamoDB project and how it moves dynamoDB towards the set it and forget it end of the serverless spectrum.

Enjoy the video

<iframe width="560" height="315" src="https://www.youtube.com/embed/oKd47AQW99I" frameborder="0" allowfullscreen></iframe>

Or listen to the audio

<iframe width="100%" height="166" scrolling="no" frameborder="no" src="https://w.soundcloud.com/player/?url=https%3A//api.soundcloud.com/tracks/320525433&amp;color=ff5500&amp;auto_play=false&amp;hide_related=false&amp;show_comments=true&amp;show_user=true&amp;show_reposts=false"></iframe>

## Transcript

**David:** Hey, everybody. Welcome to another installment of Serverless Air. Today I'm joined by a very special guest, Mr. Jared Short. He is the director of innovation over at Trek10. Jared, welcome to Serverless Air. Glad to have you here.

**Jared:** Hi there. Yeah, thanks for having me. I'm really excited to be here. And just be able to talk about Serverless and really get that knowledge out there for everyone.

**David:** Yeah, for sure. So before we jump into it, can you give us a little bit of background about yourself? How did you start working in the industry?

### How did you start working in the industry?

**Jared:** That's...it's a good question. It's a little bit of a long story but we'll make it short. So roughly...I don't know. 12, 13 years ago some...probably more than now. I got into programming and I grew up in Indiana. So I went to programming and technology because I did a few years of fieldwork. I literally worked in a cornfield in Indiana. So I did...it was like the worst experience ever. And I liked video games and so I would play video games a lot and my parents told me, "Don't do that. You're never going to make a living just playing video games or sitting on a computer." So I decided as anyone would do to prove my parents wrong. And so, I went through being a developer. I ran a small consulting agency for a little while. I did a short stint in software QA, quality assurance stuff and then had just a meeting with a few folks and I eventually ended up at Trek10 doing the Amazon Web Services stuff working in the Cloud. And then it just kind of progressed from there. From the Cloud, I just kept pushing technology further and further and seeing what I could get out of it and ended up in what we now call Serverless. And so that's..

**David:** Nice, nice.

**Jared:** Yep.

**David:** So yeah. So you're working atTrek10. What...like Trek10 is one of or Serverless partner agencies. One of our favorites. Love you guys over there.

**Jared:** We love you too.

**David:** Yeah. So like what kind of projects are you guys working on over there?

### What kind of projects are you guys working on over there?

**Jared:** Oh, man. A lot of stuff. There's been some larger Serverless projects and some smaller ones. And then it's not all Serverless, there's certainly still some containers here and there and some legacy infrastructure and...

**David:** How dare you, sir?

**Jared:** You know, it's funny. We always joke about this. Up until very recently like every single Serverless project we had ended up with at least one kind of server somewhere doing something. Just because there's some limitations of Serverless that maybe we could go over a little bit later.

**David:** Yeah, yeah.

**Jared:** But at some point, there's always...ended up being a server in our Serverless stuff which is quite funny. But we've done some fairly large projects. Some stuff doing tens of millions of hits plus a day and we've seen some really excellent results all the way up in the enterprise world down to just smaller projects and some of the really exciting stuff that we can definitely talk about later and talk...and kind of put in front of people is the idea of like Serverless Graph QL is...this is amazing combination of two really hot technologies. Everyone likes to talk about Serverless and Graph QL kind of apart from each other but we put them together and it's just been fantastic.

**David:** Yeah. That's the pattern we're seeing all the time too and we're actually using that internally here.

**Jared:** It's just fantastic combination and I can't say enough good about it.

**David:** I don't know. I was against it at first because my JavaScript fatigue was hitting me really hard but I've come to the light and I do see the benefit in it.

**Jared:** Are you guys using typescript at all yet?

**David:** No. So we use flow on some stuff but yeah.

**Jared:** We have done that as well. We actually...our first Serverless Graph QL project was with flow.

**David:** Yes.

**Jared:** But we've just seen slowly that typescript seems to be winning the war there a little bit.

**David:** Interesting.

**Jared:** But we'll see.

**David:** Yeah, I'll just check it out again.

**Jared:** Yeah.

**David:** Cool. So being like in this industry for quite some time like what are some of the biggest like shifts and changes you've seen?

### What are some of the biggest shifts & changes you've seen in the space?

**Jared:** Yeah. So I would say what's been quite interesting to us kind of seeing it from all over the board from startups to our internal stuff up to enterprise is that...and certainly there's some self-selection going on here but folks are coming to us and Docker was hot for like a year maybe.

**David:** Yeah.

**Jared:** But we've really seen that trend somewhat skipped over. The companies that would have been willing to go to Docker in the first place are now coming to us and asking about Serverless and so the whole container trend has kind of gotten jumped over for rather the managed platforms that underlying [inaudible 00:05:25] container type engines but they're more interested in just throwing their code at a platform and saying like, "Just run this in response to some event." Right?

So that very much has been skipped over the whole container...orchestrating your own containers has been skipped over which is really interesting.

**David:** Yeah, why do you think that is? Just the...you know, I wanna build my app and not worry about the underlying pieces or...

**Jared:** I think it's vastly more compelling to just say, "Look, here's my code." And just run it in response to these particular events exactly when I need them at the scale that I need them at. I don't want to worry about the actual patching and management of my underlying containers or my underlying host systems and so that's something that's nontrivial. I know Coke does a presentation about this at the previous reinvent and we could probably link that in the resources or whatever. In the "Do Billy do", yeah. Coke talks about like in...I'm kind of working on a blog post about this where we really look at what's the actual cost of running a server, right? So, the server, the compute cost is the cheap part. The expensive part is the guy that has to jump in there and maintain it. Even if you're doing it with Ansible or things like that. There're still the overhead of actually managing the OS and that kinda...in all of your daemons running on the OS. Your antivirus if you're doing that, your log aggregation. And then if you just jump to Serverless and say, "Look, I don't care about all of that. Here's my code. Run that."

There's just this massive like weight lifted off of your ops team shoulders or your team shoulders where it just works and work being a relative term in some cases. But the underlying of it is that you just don't care about and that is a massive win in very tangible ways, right. The financial benefits from that can be massive. I think it's...Coke estimate something like $600 of the cost of a server even if it's like a T2 medium. The T2 medium, if you run it for years in the US East one is probably...I think it's like less than $20 a month so 240 a year. It's like $600 just for the maintenance cost and other things you have to run on that server. So it's a large factor of cost is just not [inaudible 00:08:00] cost. Whereas if you move to Serverless that's just all handled.

**David:** Yeah, it's really like the lowest like total cost of ownership.

**Jared:** Yeah.

**David:** Yeah, and to me personally like digging into containers and having to orchestrate that stuff, it was just beyond kind of my skillset at the time when I jumped into Docker. So when I kind of saw this whole Serverless movement happening I was like, "That's the thing that I want. I wanna build my apps and just have them work."

**Jared:** Yeah. And I certainly wish...and there're some platforms I hear that kind of orchestrate it and then...I know we're gonna talk about Wish List stuff later. But I would love to be able to actually build my own container and hand its Lambda and say, "Run my functions in this container." Right? I would love that capability but...

**David:** Yeah, that would be cool. There are a lot of projects kind of cropping up running...like basically that function as Serverless provider in like Kubernetes or what have you. So it's kind of interesting to see what's happening over there.

**Jared:** That said, I really don't want to manage the underlying post and that gets back to that problem.

**David:** Indeed, indeed. Cool, cool. Yeah, so getting back to that Wish List then like what are some of the things...so for those of you that don't know there's #AWS Wish List on Twitter that's really telling it like kind of the missing pieces that AWS...basically the missing features they should build. What are some of those for you? What would you like to see? And it doesn't have to be specifically about AWS. It could be about just the space in general.

### What is on your #AWSWishList?

**Jared:** Yeah. There's a few things and some of them are actually being worked on. One of them was actually fixed yesterday I believe or two days ago. So like just even just something as simple as tagging Lambda functions. So we do a lot of stuff at Trek10 around monitoring and figuring out how to monitor Serverless applications, right. So it changes to some extent. And I think everyone is still trying to figure out what is the actual best way to monitor and respond to Serverless event driven architecture type stuff, right. So if a function starts failing a whole bunch, jump in and start looking at that and it'd be nice for us to have tags rather than relying on like parsing function names or things like that. Because right now we just do some parsing and say, "Well, if it has like service name - prod or service name - you know, production or something like that." Then we actually care if it's starts failing a whole bunch as opposed to service name - David's Dev. Like we don't care if that starts failing. Of course, it's gonna start failing, right? You know, we don't care if...

**David:** Where are you guys seeing these tags with like...is this going through like a Cloud Watch or how do you guys...like parsing...

**Jared:** Yeah, we actually use Data Dog and they pull in Cloud Watch and things like that. And we also have some other small, just monitoring script and things like that. But yeah. We...so there's actual tagging of Lambda functions which was announced which is great, right. So now we can just tag stuff with monitor. We have this convention. We just monitor through and we put that on resources and then we can just aggregate all of our resources by that monitor trough across, you know, dozens of clients. And it makes it much easier to filter out all of the noise from, you know, dozens and dozens of AWS accounts.

**David:** Nice.

**Jared:** See what else? X-ray is another thing coming from Lambda but I'm sure everyone's heard everyone else complain about it. It's really, really hard to debug Serverless stuff.

**David:** Yeah.

**Jared:** There was like a tweet recently where I had this massive system of all of these moving cups and wheels and everything.

**David:** Yeah, I saw that on your Twitter. I love that gif.

**Jared:** And it was quite interesting because actually previously to that day I was explaining to a new sales guy that we brought on. He's like, "So why is like Serverless hard to debug?" Because I had said that at one point and he pressed me on the question and I ended up with a picture that was like, "So in a normal flow like with servers it's like...comes in from the public Internet through your load balancer to a server, maybe hits a database and then it comes right back out." It's very linear like in, out, in A fairly typical infrastructure whereas in the Serverless world it's like there's just like 5,000 arrows going every which direction and it's like you have no idea what went where and it's very hard to pull it out.

So debugging and I think x-ray solves parts of that. I don't know if it's the whole story but that's still part of my Wish List. It's just better at debugging and that's been there since day one, right.

The other interesting bits I brought up, being able to run your own containers and that's not just because I want different runtimes. I don't...not just because I want Ruby or I want other things but I would like to bake a slightly more solid container that has some of my dependencies just built-in, that has, you know, maybe a specific version of the AWS SDK or a specific version of internal tooling and SDKs and things like that. So I just...I can get it to be faster all the time so...

**David:** That's a challenge right now if you're using any type of binary as well. You kinda have to compile it against the Lambda image.

**Jared:** Yeah.

**David:** So if you're using like Phantom JS or something like that.

**Jared:** Yeah.

**David:** Yeah. That's on my list.

**Jared:** Yeah, so that's...I mean, that's part of it. I mean, the interesting part there is the thing that made that easier is the Amazon Linux Stocker Container that they released, the officially supported one. That does make that a little bit easier but certainly as...

**David:** Have you guys done anything with binaries over at Trek10?

### Are you using binaries in Lambda functions?

**Jared:** Yes. Actually, we did some interesting stuff with image resizing. There's some native binding stuff. So image magic is kinda slow. There's some node packages that have native bindings to some specific like image manipulation libraries and so we do do some packaging with that. I actually talked about it at the Serverless Conf. Not the Serverless Conf. The Serverless Meetup in San Francisco. I talked a little bit about how we're doing some interesting image manipulation stuff there.

**David:** Yeah. I think we recorded that as well.

**Jared:** Yes. Link in the "Do Billy do".

**David:** Awesome. Yeah, that's cool. So, yeah. You were talking all about like image resizing and what have you which is a really common use case that we see.

**Jared:** Yes.

**David:** What are some of your other like favorite use cases like for Serverless technology?

### What are some of your favorite use cases for Serverless technology?

**Jared:** Oh, man. Well, see, image resizing, Graph QL, data processing, some analytics type stuff. Those are all kind of the normal target ones. Some other fun ones that I've seen are...and actually...kinda Athena kinda kills part of it was really this ad hoc querying of S3 data, right. So Athena came out and kind of kills part of that use case that we have for it. Because we could quickly aggregate over a whole bunch of S3 files and query data in kind of an ad hoc fashion out of it. That was in which case.

**David:** So what would you use that for?

**Jared:** Say you have a whole bunch of load balancer logs or Cloud front logs and we wanted to know how many 503s we got in the past week and what those sources were, right. Instead of having to pull it out of all those files onto a local machine and kinda graph through them we just have a Lambda function that we could go type in like a regular expression and run it and then it would just spit out the deluxe. And it would actually just fan out. So we did the fan out pattern, right, where one function would essentially list all of the items at a particular path in S3 and then each...and then fan it out so each of those items had a Lambda function run against it. And so, we could very quickly like do an ad hoc regular expression against, you know, hundreds of thousands of files and see...yeah, we had you know, 500 503's and all of them came from the same IP address or something like that.

**David:** Yeah, that's awesome. Yeah, the fan out pattern is really interesting. I don't see too much about it to be honest.

**Jared:** We have a blog post on it. We actually do. That's like a year-old blog post too.

**David:** But it...that's kind of one of the beauties of like kind of the Serverless space as well. It's like, you know, you could basically just spin up an infinite amount of functions like, you know, and you don't really have to worry about that piece so...

**Jared:** And in combination with Graph QL, one of the really compelling things I like about it is that you can essentially have Lambda functions for each of your different like disparate data sources. So you might have one Lambda function that specifically is grabbing things from Dynamo BDB, another Lambda function that pulls from RDS. Another Lambda function that pulls from your rest API or something like that and so you have your central Graph QL end points that gets hit. And then inside of your resolvers, for those of you that know Graph QL. It is smart enough to resolve against those different data sources and says, you know, "Well, I know if I'm fetching users. Those are coming from Dynamo DB, but if I'm fetching posts for each of those users or comments for those posts they're coming from RDS and maybe I'm fetching image information or something like that from like Cloud Aneri." That's more of a frontend thing but...and then we'll resolve that to a rest API or something like that, right.

And so is that one Lambda function can now aggregate across three different services or Lambda functions and you can essentially get this burst of CPU capacity to respond dynamically to your queries as you have them. And say that model is insanely powerful.

**David:** Nice. Is that what you guys typically use on all of your projects then?

**Jared:** Not always. But it's been something that we've been trying to kind of feel our way around a little bit more. We've used it for a couple of things. The flipside of that, the alternative to that is that it gets harder to debug all of the sudden, right, because now my stuff isn't all on the one Lambda function. It's who knows where. So it gets back to that particular problem. You can put some logging hooks and things in place that try to make it easier but it certainly doesn't. Doesn't help the case.

**David:** Have you guys seen any like additional latency with that pattern as well because it's like...I mean, if you're stitching together desperate data sources.

**Jared:** Yeah. It certainly can add some latency. It hasn't been too bad but certainly like if you have a rest API or something that you don't necessarily even have control of it can hurt you pretty bad and then in that case you might wanna write timeouts or something on your own and just well, sorry. Like that data didn't come back or we gonna fail this query.

But on the flipside of that though, there is the other alternative where you have this idea of...in Graph QL someone can just ask for things as deep as they want into the graph, right, where you can ask for all of a user's posts and then all of the users that commented on that post and then all of those users posts and you can just recourse down the graph essentially infinitely. And you can break a lot of things doing that, right.

**David:** Yeah, yeah.

**Jared:** There's some ways around it. Facebook has data loader, but one of the really cheap ways to handle that that we do is we just say like, "This Lambda function's timeout is five seconds. If it doesn't return in five seconds, something is very wrong and very broken or you're trying to do something you shouldn't and we're just going to fail."

**David:** Right, right.

**Jared:** Right, so we just time it out. And there you go. You took care of 97% of the bad things that could happen in a really like deep nested graph attack.

**David:** Yeah, we notice a little bit of latency on one of our Graph QL end points. And like we basically like implemented data loader to kind of cache it up.

**Jared:** Yep.

**David:** But yeah. Interesting, interesting, yeah. I still...I don't know. A lot of things that I do are smaller and I'm like, "Just a couple of rest end points and I'm done." But it's definitely powerful especially from the developer experience in the Graph QL world just, you know, using graphical like their UI tool to like explore what data you can get back.

**Jared:** Yeah.

**David:** Very cool.

**Jared:** From the Graph QL end point I will tell you what we started doing internally for some of our tooling and things like that and to enable people that aren't necessarily...whose jobs aren't day-to-day no JS developers, right, which is a fair amount of people at Trek10 at this point is there's a few services out there that essentially offer like Graph QL as a service. And recently graph.cool came out and is probably the most exciting tool that I've seen since really Serverless framework probably.

**David:** Wow. Bold claim.

**Jared:** It's a bold claim but the...I think those guys who genuinely understood the power of Serverless compute so it's Graph QL with a really fancy like schema editor and relationships and they generate the full Graph QL schema and mutations in filtering and you can say, you know, "Give me this particular object and all of the relationships to this object." A brilliant permission system. But more importantly and I think what we're gonna see from more companies moving forward and this is something I really wanna talk about, something that I think is important in companies even if they aren't doing Serverless themselves should realize is that they are adding this extensibility to their product that is very tightly coupled with this idea of functions as a service or Serverless compute whereas they have these mutations that come to their system. So Graph QL mutations is this idea of changing data, right, So it's like a post request or something like that in a rest API or a put or a patch or something like that. So these mutations come in changing data or adding data or deleting data. And they offer this capability that says that when the particular type of node or something is changed, it triggers an event or an execution of a code that you could be hosting in your own systems or platform, right, So you write a Lambda function that says, "When a new user is created, I want to post the slack notification to my own system and I want to create a record in Sales Force and I want to send an email back and that extensibility in their platform is perfect, right. So [inaudible 00:23:32] has very similar type thing where they use their own system's webtask.io to run kind of this sandboxed code.

And I think that's the new web hook, right. So that's...it's the new web hook and I think companies are slowly starting to realize that and I think that's gonna be critical. I think in the next two years we're gonna see some things around kind of this code execution in response to events. Yeah, maybe the extendible end point.

**David:** I agree. It's like the evolution of web hooks that just offers almost like infinite flexibility to your system and it almost like out of the box...like if you build your product in this way, where you can trigger these events and have users write whatever custom code against that, it's like you're out-of-the-box. You're building like a platform, right?

**Jared:** Yeah.

**David:** Which is what most successful companies have done but yeah. It's...

**Jared:** And I think...and to that point...so I'm 100% in on AWS, Trek10 is 100% AWS. To that point, I think Azure has actually done something here really, really well that I don't think many people realize or have seen. They have something called the logic app service which is like literally something like Zapier or [inaudible 00:24:55] except it's like their own implementation of it but it's kinda built with this core idea of events rather than this just web hooks. It's like event-triggering type service and they have stitched together a bunch of the different services.

Really brilliant service. I think I have a tweet of it where I was like, "This is the first thing I've seen that Azure did that..." I was like, "Why doesn't AWS have this?" Like, "I want this." So yeah, and I think that just paints an interesting picture where the space is getting more competitive. Lambda was there first, AWS was there first. They have the lion share obviously but Google computer functions is catching up I think. They're still beta, I believe but...and then Azure is doing a lot of efforts, putting a lot of effort into their systems there. So it's interesting and exciting and I think it certainly says that this is the way forward. People have realized that this is the future.

**David:** Yeah, yeah. And not only that. It's like just the competition is what keeps, you know, that #AWS Wish List like rolling, right? Like if there was no, you know, no competitor you'd be like, "This thing is good enough, you know, there's nothing else. Pay us money." But yeah. That competition is amazing to see. And yeah, a lot of the providers are doing some really interesting stuff and we're working on kinda building out our kinda fleet of examples and what have you with a bunch of them. And like you mentioned Graph Cool. We're working with them on some stuff as well. Can't talk about it yet but it should be pretty, pretty interesting how we tie that in but cool.

I wanted to talk to you about...so I called you out on a previous episode. You shared an auto scaling...you guys wrote a post on Dynamo DB auto scaling. And I was like, "Why isn't this open source? Release it to the world, Jared."

So yeah. So like give us a little bit of background on that project like what does it do and, you know, how did it start.

### DynamoDB auto scaling? How did that project come about?

**Jared:** Yeah. Yeah, so we did open source it, we got called out and we made good on it. [inaudible 00:27:21]. But yeah. So we actually had a need. It was one of our first...it was actually our very first large implementation of Serverless and we leveraged Dynamo DB and the issue was that it was in a space, enterprise space where people come in in the morning and towards midafternoon are actually using the system very, very heavily and then at night there's like no usage to the point of, you know, millions and millions of hits over like something like 60% that hits are over like a two-hour period in their system. So it's literally like just...every day massive spikes. Like the typical auto scaling scenario, you see for EC2 the AWS is always like, "Oh, if you use auto scaling you'll save billions of dollars." Right? We're like, "Okay. what do we gonna do? Go on a Dynamo and like have...like just create a task or just API like every day we'll just increase and then decrease over the hours but then what happens if it's a holiday? What happens if there's like an unexpected spike?" Right?

Dynamo has no capability of handling that. So we essentially said, "Well, we can look at like Cloud Watch metrics or we could look at metrics so why not just create a Lambda function that looks at those metrics and kind of intelligently decides if we should start scaling up or if it's safe to scale down?"

So that's basically exactly what we did. It has a small API in front of it to make it easier. So if you have other systems or people that need to communicate with their API and change their own tables they can. But really the basic concept is behind...it's just a small scheduled Lambda function that just does some basic polling and just polls and says, "Hey, is this table reaching like a certain threshold of capacity and if so we're gonna scale up, and if it's below a certain threshold of capacity, we're going to scale down."

And it reacts pretty quickly and we've seen it actually work quite well, where after we get to like 80% of capacity of a table and we just say, "All right. Like we're gonna scale up. Maybe you can set how much you...the scale up factors are."

**David:** Yeah.

**Jared:** And then you just keep scaling up. The interesting part is, scale-ups are...you can do as many as you want during a day. Scale up doesn't matter. But you can only scale down four times in any given day. Right? So...

**David:** And that's per table, right?

**Jared:** That is per table yes. Yeah, so we just kinda take a fairly blunt force approach where we just have one Lambda function that checks four times a day if our capacity is below our threshold and then scale down and then we have another Lambda function that actually...I think you can configure it. I think we just do it like every five minutes or something, it might be every minute. I'm not sure. Where it checks and just scales up as needed. But it's worked really, really well. It saves a lot of money and then also, right, it kinda tells you how much reserved the system doesn't but you can kinda look at where your auto scaling starts balancing out and then just by reserved capacity is also another money saver for Dynamo DB.

If you're at the point that you're auto-scaling Dynamo tables, look at reserved capacity as well.

**David:** Right, right. Yeah, it's an awesome project, it's...I can't remember who said this, it might have actually been you. Someone was mentioning that like the Serverless world is on this spectrum where there's things that like you don't care about, it scales for you. Like you put your code there, it runs and then there's things that fall kind of in the middle there like towards the Serverless world like Dynamo, where you're not really concerned with the machine, the software etc. But you do have to manage that scaling, so like you guys kind of took that and like moved it more towards the, you know, totally Serverless space.

**Jared:** Yeah, so I guess the way I've always explained Serverless to people and the concept of Serverless is that it's really only Serverless if I don't...if there is a painless way to scale my services on demand, right. I should never have to over provision capacity and pay for that over provision and there should be a path to painlessly scaling. That's what Serverless is. I don't care if there's servers, I don't care if I have to pay somebody else to do it, right. As long as it's just a painless method where...we had a client once that said to us, "If it's just a button and money, I don't care. It's easy like..." That's the easiest problem in the world to solve. I can throw money at stuff and it just works, right? That's the scenario that I like to be in. If it's just a button or checkbox and money, I'm in. Right?

**David:** Well, that's business.

**Jared:** Yeah.

**David:** So yeah. So you just mentioned like you don't care if there is a server, like you mentioned earlier, you know, like in, you know, some of your Serverless projects you guys still end up using a server for something. What are you guys using that server for? You peaked my interest.

### What are you guys still using servers for?

**Jared:** Yeah, so in one of the projects it's because we needed a binary. We needed to be able to accept and return binary traffic. So images.

**David:** Okay.

**Jared:** In the first days...and you still can't do this through API Gateway very effectively. We needed to be able to accept and return images because we are integrating in some legacy platform stuff to the new completely Serverless system we had built and there was no method for returning images through like API Gateway or anything like that. So the systems essentially were uploading images and then asking for like resized images back, right? Typical system, but they were doing it in such a way that it was kinda like this request, response model and there was just no way to do that in API Gateway at that point so we had to change it so that the request...we had to essentially put it like Engine X proxy. Actually, I think we did like Engine X in node or something like that. That was this kinda black box system to our actual Serverless API so like the request comes in, we on the back end of that use the API and then return back what this legacy system expected. So that was one reason we did it. We've done some...there's some Web Socket requirements, right. Everybody knows this. You can [inaudible 00:34:17] or whatever to get around it but it's not elegant.

**David:** Yeah.

**Jared:** So just Web Sockets and persistent connections. You can't do that.

**David:** Yeah, we have a blog post on how to use like Web Sockets in the IOT. I haven't done it personally yet but yeah.

**Jared:** Yeah, we did it. We've done it and we have some folks actually looking at it right now and are using it for some really, really clever use cases but IOT is actually not super cheap either. It's a fairly expensive solution. Especially if you're just trying to leverage it for Web Sockets. It actually ends...it's like $3 for a million messages. And you can get much cheaper other providers out there as well. So IOT, right? You're also paying for the cost of all of these other kinds of systems where if you're just using it for Web Sockets, it's this massive, massive solution to a very simple problem. Yeah, so there's that...I can't think of any other really big use cases we've had for servers and our systems. There's always, you know, the pulling in...

**David:** Long running process?

**Jared:** Yeah. Long-running processes that aren't embarrassingly parallel or aren't easy to chop up into little segments and throw in the Lambda functions, things like that.

**David:** Cool. Awesome. Well, thanks for clarifying why you use servers. It was weighing on my soul a little [inaudible 00:35:57]

**Jared:** I mean, interestingly in most cases it has been because like, well, there's like legacy pieces of this system that just have to somehow communicate to the new system.

**David:** Yeah.

**Jared:** So it's never been a game stopper, right? And yeah.

**David:** I think...I mean, that's actually like what we're seeing a lot is, you know, it's not like when you're adopting this like Serverless approach, you can't...a lot of companies can't just throw everything away, right? And start Greenfield. It's like they'll adopt it kind of piecemeal and basically have kind of like a hybrid system where they might have to get a container fleet and, you know, functions running as well kind of in parallel so...

**Jared:** Yeah, one of the ways we always bring it up with clients or a lot time we'll have folks come to us and say, "We've heard about Serverless, we've done some research but we don't really know how or where to get started." Right? And so, one of the things we'll always ask kind of after just initial chatter and discovery is we'll say, "What is the biggest like problem area you have right now in your systems, right? What doesn't scale and is a bottleneck? What are your ops guys spending disproportionate amount of time maintaining or fixing?" Right?

And if we can look at that part of the system and say...we can enter and look at it and say, "Yeah, we could...this fits Serverless fairly well if we would break it out." And then we can go back to them and say, "If we can just make all of these problems like magically go away, right, is that a benefit to your company in terms of, you know...the ops guys don't have that problem anymore. You don't have the scaling issues, you don't have all of this maintenance. Basically, a magic wand that goes away, right? Is that worth it to you for, you know, for being able to invest in other systems at that point and you almost never get to know. They're just like, "Well, yeah."

**David:** Shut up and take my money.

**Jared:** Yeah, yeah. Checkbox and money, yes. There are...

**David:** Awesome, awesome.

**Jared:** So yeah. So people looking at Serverless are trying to bring their company into the Serverless world. Like look at your systems and say like, "Okay, if we can take this specific chunk, this thing that causes a disproportionate amount of pain and transition at the Serverless, right? How much better does our world get if we do that?" And you can also look at it as a marketing, internal marketing and say like, "Look, we did it for this and now we can do it for this." And we've had people become champions of Serverless and kind of even of Trek10 inside of larger companies, simply because there's like this massive success with this one pain point and then they're like, "If we could do it across all this other stuff, it becomes this...kind of this epidemic of Serverless." Right? Like everyone's just like, "Okay, now we have to do it." It just spreads.

**David:** I like that, "The epidemic of Serverless." That's gonna be our new T-shirt. Awesome. So looking into the future, where do you see things, you know, heading?

**Jared:** Oh, man. This is a good question and is something that obviously, no one's sure about but...

**David:** We'll get through this in a year.

**Jared:** Well, certainly like I mentioned before, I think events are the new web hook. But I think on top of that and certainly you and I, David, have kind of talked about this before and I know this idea is kinda floating out there. But the unified event log I think is going to be...I think is going to be huge.

**David:** Yeah.

**Jared:** And we could probably...we can spend some time talking about that I think certainly where there's this idea that you can model essentially all of the activity or events in a domain or business in a structured fashion and pipe it all to this unified event log, this block of events that have all occurred and then your various systems can feed off of those event logs, filtering for what they need and reacting.

**David:** And reacting. Yeah, yeah.

**Jared:** Yeah. And then in terms of reacting, they can actually feed events right back to the same log. And so, other folks or systems can react off the reactions, right? And that I think is going to be part of the future. I think someone's going to really build something exciting in that space, whether its services or just unified event log providers, and then more importantly, I don't know if it's more important but also there's just interesting world that that enables where you can replay your entire history of your business against a new system and so your system comes online with full contextual knowledge of all the history of your business, right. And there's just these really powerful things. You can essentially in kind of like this...the stock market example, you can replay your algorithm against a chunk of your history and make predictions and see if they actually hold true against another slightly further head chunk of history.

**David:** Right, right. It's this idea of having like that immutable data that you can just replay over and over again or like even just from like the development side, having that...your like full data in development environment that you can replay etc.

**Jared:** Right.

**David:** Yeah.

**Jared:** Or the idea of...if I'm a service provider, I can say, " Just throw your event log at me." And if data is structured properly, right, the integration point for new services is I just say, "Just feed your unified log to me and I will...my service will execute operations just from your event log." So if I'm just the provider, you give me that and that is the integration point between our two surfaces and now I can provide, you know, massive value to you for a little integration cost.

**David:** Indeed. Yeah, there's a really good book I highly recommend for everybody watching. It's called, "I heart blogs." It's from O'Reilly but it was written by the guy that...I can't remember his name right now but he basically like invented Kafka at LinkedIn. And he was basically talking about like why they did it and the use cases that fell out of it, like touching all the different orgs inside of LinkedIn.

**Jared:** Yeah.

**David:** Really interesting stuff. But yeah.

**Jared:** Yeah. I guess to throw the ball at you little bit here, what do you see in the future?

**David:** I mean, you stole all my answers but yeah. It's really...I see...I mean, all these are really good soundbites like, you know, events are the new web hooks. I totally agree. I think more companies will start exposing events and like giving people the ability to react to them either like in their product itself, or I could see that happening, you know, with let's say a Serverless framework but yeah. Just like this idea that everything is an event and you can react to it I and kind of chain these kinds of event driven systems together or just, you know...it's happening now but as like tooling matures and what have you, I can see just being able to build stuff much faster but yeah.

**Jared:** So what's after Serverless? What's after functions as a service? Is it like...I know one thing though that comes up occasionally is this like composability of functions, right. So I can just pull down from a library of pre-created or pre-provisioned functions, Standard Lib kinda does this.

**David:** Right.

**Jared:** I've seen that. Is that the next iteration on top of it?

**David:** Yeah, there's a couple of people there are doing this. I don't know. I've always been in the camp of like I build my own functions or I'll use libraries and like incorporate those into my functions but there are a lot of common use cases where I could absolutely see either pulling down functions that are already written that are for a specific use case or tying into already provision functions where you don't even have to like worry about it. There's, you know...obviously when you do stuff like that, there's more...your system is even more distributed and you're relying on more third-parties so...I don't know. Like things need to be solved in that space for I think that to take off but I could definitely see that happening.

**Jared:** Sure.

**David:** And again, this unified like event log, it's more...I mean, again like going back to the idea of immutability, it's like we're seeing this kind of...like the concept's not new by any means but we're seeing it being popularized by things like React and Redux and what have you, and databases like Atomic where it's like instead of updating data in place which is what we used to have to do for technical reasons, it's like now there's no like limit on how much data you can store so having that immutable log of information that you can react to and replay and do, you know...have other people react and replay to it like...I think that's just gonna be a total game changer.

**Jared:** Yeah, I guess, not necessarily Serverless but one interesting thing that comes up there that I think will get more common like you said. So Cockroach DB has this feature where you can issue a query and get a response for a given time. So you say, "I want to know what this query looks like for yesterday." Right? And you query it and it has the full history of data. And so, you can say, "Give me that the answer to this query for yesterday or for last year or for right now, the current time and it will actually give you kind of like the snapshot of data as of the given timestamp that you've asked for it.

**David:** How nice.

**Jared:** So that's something that I think will be...I think will become more common. I'm not sure if Fauna...I think Fauna might have something similar. I think they like store the history of data as well. We'll have to look at that.

**David:** Interesting. Cool, man, yeah. I don't know. It's definitely an exciting space. But yeah. One final question. I wanted to get your take on like, what are your favorite resources to learn about this stuff and like keep up-to-date on what's happening?

### What are your favorite resources to learn about serverless stuff?

**Jared:** Yeah, so there's the awesome Serverless page [inaudible 00:47:25] That's a good one to kind of look over. And then some other...I guess I probably have somewhat of a problem here but I just go to YouTube and type in Serverless and just sort by most recent and I'll just kinda...I'll do that and then there's just...the Serverless blog is a good one and then the Serverless getter on occasion is a good one and kinda just to follow that and get a baseline for what people are talking about to some extent about Serverless and then the Serverless Conf actually tends to be a great resource as well. Even just watching the videos online you can kind of see. Even in like the three or four month increments or whatever that it ends up being. Maybe it's been like what...I think November, December, January. Something like five months since the last Serverless Conf. Those...it's interesting to watch those videos progress and those talks progress where kind of the first Serverless Conf in New York City was like, "What is this thing?" And then there was Tokyo which was still kind of a little bit about, "What is this thing?" And then London was like, "All right. We kinda know what it is now. Now here's how to orchestrate it or how to do it."

So I'm really excited to see what Austin is gonna be about.

**David:** Yeah, you're gonna be there right?

**Jared:** I will be, I will be talking, yes.

**David:** Yeah, we'll be there as well. I think we've got like six or seven people going but yeah.

**Jared:** Yeah, so I mean...and there's...is there actually...I don't...is there a Serverless like...there's a Graph QL weekly. Is there like a Serverless weekly type thing yet? I don't actually know if there is.

**David:** I don't know, that's a good idea. Oh, we actually were talking about doing something like that on the blog like a recap of what's happening in the industry...

**Jared:** Yeah.

**David:** Every week so...

**Jared:** That's something we need. Because I'm tired of wasting time just going through YouTube and...I just want somebody to tell me what I should know.

**David:** All right, we're on it, we're on it. All right, awesome. Jared, where can people find you online?

### Where can people find you online?

**Jared:** Actually, @ShortJared on Twitter and GitHub and jared short a.t. trek10.com is my email address and I'm more than happy to talk with anyone about basically anything. This stuff's exciting and the more people we have in it, the better.

**David:** Yeah, totally, totally. And if you, you know...anything peaked your interest on this interview that you want Jared to open source just hound him and, you know, they'll do it eventually so...

**Jared:** Eventually.

**David:** Yeah, thanks so much for coming on, Jared. It was a pleasure.

**Jared:** Yes, thanks for having me. I'm excited to see what the future holds for all of us.
