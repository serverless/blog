---
title: "Real World Security for your Serverless Apps with FaunaDB [Video]"
description: FaunaDB's Chris Anderson walks through extending the popular todo list serverless-crud example app to allow sharing and collaboration on lists.
date: 2017-05-04
layout: Post
thumbnail: https://cloud.githubusercontent.com/assets/20538501/23813615/4b53e4fc-05a5-11e7-8214-e34c2c02b949.png
authors:
  - ChrisAnderson
---
[Serverless Meetups](https://www.meetup.com/pro/serverless/) are a gathering place for anyone interested in building web, mobile and IoT apps with serverless or event-driven architectures using the Serverless Framework or other tools. During a recent Meetup at [Fauna](https://fauna.com/), their Director of Developer Experience Fauna, Chris Anderson, shared his experience building a real world app with FaunaDB and the Serverless Framework.

## Check out the video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/c_DijBxb7JA" frameborder="0" allowfullscreen></iframe>

*You can read more about Chris' project in this blog post - [Using Serverless Authentification Boilerplate with FaunaDB](https://serverless.com/blog/faunadb-serverless-authentication/)*

## Transcript

**Chris:** I'm Director of Developer Experience at FaunaDB, Chris Anderson. I don't have a slide about me, but you can find me on Twitter, [@jchris](https://twitter.com/jchris). And I've been working with Fauna for a few months now, focusing on the developer experience and like really, just getting up to my eyeballs as a user of the database and recently, as a user of the Serverless Framework, putting them together to write some application code, sort of just to see how apps are written in 2017. 

My background, I've done various iterations of that at different database companies and open source projects and stuff over the years, so I really enjoy seeing what a new platform can bring to the table. And today we're gonna talk about my adventure making the popular TodoMVC Example App into a real application.

So who here has messed around with TodoMVC in any capacity, ever? So the way I end up there is when it's time to start a new project and have to figure out what it is that JavaScript developers have adopted this year as the framework, I go TodoMVC and figure out which one is the least bad. So I spent a month maybe, a few weeks looking around, like somebody somewhere has got to have written one of these that talks through a database and cares which user you're logged in as. Nobody nowhere has done that.

The best I could find was this Reddit thread that says if you decide to do a to-do list app again, please give it a back-end with user auth and persistent storage using a database. So I did that. We'll look at it in a little bit. Kind of what's going on here, what I've done is essentially, taken TodoMVC from a front-end demo to a full stack application that, while it's still got a demo level of features, the implementation of this stuff is the same way you would implement it for a production app.

So what are we gonna do today? First, I'll tell you why FaunaDB is the first serverless database. Then we'll get into the application architecture and the code and talk about the components to making this sort of production-style TodoMVC. And then we'll go and do a short demo at the end and, if we have time, maybe I'll talk a little bit about some best practices stuff that came up for me when I was doing this.

So FaunaDB, it's a serverless database and we'll have two slides on this. This is the first slide. These are kind of the table stakes. The second slide is the stuff that FaunaDB does that competition hasn't really gotten to yet. So obviously, you're serverless developers, your stuff runs in the cloud. I don't really need to get into this particular bullet point, except for to say that currently we're running in five data centers around the world and...AWS and adding Google Compute and Azure sort of as we speak. So you'll be able to not only deploy your data everywhere, but also do dynamic site selection and only pay for the points of presence that you're interested in. And you roll those changes out on the fly, so if you add a new customer base in Southeast Asia, you can just turn that data center on.

The data model that we use in FaunaDB is friendly to JSON. It allows you to have rich, nested data structures. So it's not tabular. You don't have to worry about being constrained by the schema like you had to in the past with relational databases. But that doesn't mean we're not relational. So the objects that are stored in FaunaDB can have references to other objects and they're lightweight. You do it all the time. You could have constraints and unique indexes and all those features that you wanna have as an application developer.

I guess this is a little bit of a history lesson and it hasn't been that long. We're all old enough to remember the beginning like, I don't know, what, 10 years ago? You just used a relational database. And when your app got too big for it, or too much scale for that, it's just too bad, like you had Fail Whale.

But then, there was, "No, we gotta do something other than that," and so then NoSQL came around and you started to throw away features because you thought you had to in order to scale. So what we're doing with FaunaDB is bringing those features back, but it scales. So you've got this database that will take you from one user to millions of users and you can do your joins and all your good stuff all the way through. So yeah, if your database can understand the application now again, it's kind of retro but it's also futuristic and we're gonna go through the code and talk about, sort of, what it means in 2017 to have an application-aware, security-aware database.

Just to round out the set of important features, you need to be able to build streams and have triggers fire and have your Lambdas around when things happen in the database. So we have a temporal data model that allows you to ask, for a given instance or for an index query, what did it look like at a previous snapshot or what changes have happened since that previous snapshot? So you can play a stream or build an elastic search index or something off of it in a reliable way.

So now, what makes Fauna really different? This object-level security that I talked a little bit about means that you can model your business rules in the database. Your database can know who was the author of that blog post instead of just having a lambda know that. And it becomes a lot harder to write a bug that gives people access to data they're not supposed to be messing with when your database is security-aware.

I wrote a whole blog post on the second point, escaping the provisioning trap. So I guess the question... I assume folks here are using DynamoDB. Who has ever set your DynamoDB through put either too high or spent a bunch of money you didn't need to or too low and had your app fall on its face when it got popular? So that's happened before. We don't have that. That's not one of the options. So instead you just pay for the actual traffic that runs.

The hierarchical multi-tendency is useful for a whole bunch of things. The way I think about it is it means that your programs can provision things as complicated as themselves, like you wanna have somebody sign up for their hotel booking service and so you spin up a new database for the new hotel chain or maybe a new database for each hotel in the chain and it's all in the same hierarchical multi-tendency, so the billing is really simple for you to do.

I didn't mention this anywhere, but the billing figures... You know what we charge you, all those headers are on every response, so you can bill through to your customers, too. And the client is stateless, it's HTTP, it means that you're not doing collection pooling and then throwing out the connection pool or whatever when your lambda runs.

Kind of a small one, but I go to Google and people are having all kinds of problems with this, so it's good that it's not a problem. So let's talk about the object-level security as we dig into TodoMVC. So there's four main components to the application. The content service. Back in the day, this was the thing in the rails directory that does all your business rules and knows about recipes or blog posts or authors or whatever your domain model is.

So your content service is typically your app and it may be more than one lambda. It may be one lambda. It may be some lambdas talking to lots of different back-ends. It could be arbitrarily complex. And in our case, the content service is pretty simple and we'll dig into it lambda by lambda.

There's also, in the architecture, this reasonable authentication service that's based on the Serverless authentication boilerplate, which is linked from the Serverless read-me. It's probably one of the more popular Lego bricks in making a Serverless app. And before I submitted my full request to that project, it just used like, a dumb key value store to keep track of who you were and hand out authorization tokens to you.

But then your content service had to have like lots of permissions on the database and then be trusted to only act on behalf of the user that the authentication service said was there. So, instead, what we do is the authentication service actually gives the content service just the credentials that it needs to operate on the database as the current user. So you can't write these app bugs that corrupt the database in terms of permissions.

Then I pulled this out because it's its own moving piece in terms of how we talk about it, but part of the authentication service is this custom authorizer. And all it does is play a role in getting this FaunaDB access token from the authorization header to the content service. It essentially runs as a proxy inside of API Gateway before your content service runs. It all lives over here in this Serverless project, but the custom authorizer gets called at run-time when your content service does.

And then the front-end which is where all the integration happens, so the front-end goes and hits the Facebook login endpoint and sends that information back to the Serverless lambdas that get you logged into FaunaDB. And that hands the authorization token back to the browser and it runs the queries. So there's definitely some session glue that happens in the browser.

So I'll go through these. This isn't all the lambdas in the content service, but it's enough to kind of show you the different things that we're doing in there. So I'll talk through them and then we'll go look at the code, because I wanted to show you the code in my editor, not put codes onto the screen. It's more fun to see it in the editor.

So you create a Todo item. You type something into the UI and hit enter and it does an HTTP post to the Serverless endpoint and what we're gonna do is write that to the database, but before we write it in, we're gonna tag it with a current user and we're gonna grant that user the ability to read and update the item. So we actually apply the access control rules on the way in. We write the item with the permissions of who's allowed to mess with it. Then when we read all the Todos, we used to have a naive query that says give me all of the ToDos and it's actually the access control system that says, "Well, no, I'm actually just gonna give you your Todos." So you can see this is a security-naive code. It doesn't care about any of that policy stuff and it still does the right thing.

Well, with update, you already know what you're gonna do, so I'll just show you how we swap fields out on an object so you get a sense of how the database works. And then toggling all is a bulk operation. It's a lot like a read all but instead of just finding all of my Todos, it loads them up and then switches done to not done or vice versa. So we'll take a look at those.

We are creating a Todo. And I'll skip some of the noise and just go to the FaunaDB part. What we've got here is, we're grabbing this little atom of query language stuff. It's kinda neat. So this doesn't execute in terms of going to the server and figuring out who this reference is and getting them and selecting that field off of it. Instead, the return value of all this is just some abstract syntax tree of the query. And so now we just have a little query item in this me variable.

So we're gonna say the Todo.user is me and we're also gonna say the permissions involve me. And, essentially, that's just taking that query snippet and dropping it in all those places. So when the query runs, the server runs all this code, rather Fauna runs all this code and doesn't know that I used to have it decomposed into a variable. So that's one of the fun things about having essentially a query builder as your SDK because then you can use these little query built things and reuse them. 

Your question?

**Person:** Yeah, are other query builders in other languages?

**Chris:** Yeah, so we've got most languages already covered and they're all on the website. We develop all our own drivers. We have some community folks who are interested in developing drivers and when they get to a certain point we're probably gonna adopt them.

**Person:** So you can use this with...like, on the server as well?

**Chris:** Yeah. And this is running in the lambda.

**Person:** Okay.

**Chris:** You could write this and have it be in the browser. Our whole dashboard is just the browser talking directly to FaunaDB. So that's an option, too. Question?

**Person 2:** So where do you put in the region here?

**Chris:** So it's nice that we don't have to worry about it. I'll show you my whole server list to YAML. Hey, it looks like there's nothing in there about FaunaDB. The closest there is to anything about FaunaDB is the authorizer ARN. And so you set up this authorizer and that's what passes the fauna secret back to the, you know, to instantiate the client. I hit in the client for event logic over here in utils, but all it's doing is parsing out that policy document.

**Person 2:** So, as a user, I still have to go to FaunaDB and provision something?

**Chris:** As a user, what I had to do for this crowd service we're looking at now, that works already done, so the only time I had to provision something was when I was setting up the authentication service and then in the environment here nobody memorized that. So that's the secret that has the ability to delete all the Todos and all the users, right? And so you had to go create the database with the users and Todos lived in and then create a database secret for that database and hand it here. If we have time at the end, I'll talk a little bit about how I managed the schema in this stuff, but that's also the secret that's gonna run the setup schema code.

**Person 2:** So no region?

**Chris:** Yeah, all the regions... So, in the future, right now we run all our data with the same availability which is all the availability, but in the future we're gonna have dynamic site selection where you say like, "I wanna be US East 1 and US West 2 and that's all I need." Or, "I also need Australia," or something.

**Person 2:** Yeah, but I love that I don't have to think about region.

**Chris:** Yeah. You get to if you want, but you don't have to.

**Person 2:** Right. So my next question is, what's the response time?

**Chris:** It's fast enough. I mean like, I'm gonna say we are beating the competition at benchmarks.

**Person 2:** Is that Dynamo?

**Chris:** Dynamo, Cassandra, in general. And core team can probably talk to it better, but the consistency model that we used is oriented towards batch throughput, and so you end up with just having...being able to process lots of data and slowing everything down when there's contention.

So yeah, let's go look at this read-all because you get a sense of what can happen on the server. So what I'm doing is I'm looping. First, I load all the Todos. In this case, they all fit in one page. So production code, I need to hit all the pages of this. But I'm loading all the Todos and...or rather, loading all the references out of the index, looping over it and then, for each one in the loop I'm going and fetching the actual instance. And so the result set is just a list of all the instances.

And we'll see that loop construction again. Not here, here's a simple update, but we'll see an update inside a loop after this. So, in the simple update, we see all our data is in this top level data field because there's other top level fields you don't need to worry about but sometimes you might want. And this is just allowing the user to change the completed state and the title of their Todo. We're not allowing them to change who the author is in this code.

And the reason that I wanted to start with the content service, just because then you get to see these Fauna queries without all the complicated authentication requirements and stuff around it. And so this is about as complex of a query as you'll see today. And it's the same queries you saw before. We're grabbing all the Todos and we're looping over them. But then instead of just returning them, we're loading it and then making the completed field be the opposite of what it used to be.

So if it was true, it's false, and vice versa. And that's the only field we changed in this update. So we just go touch all the Todos and flip the bit on there, completed. So that's all the code in the content service that I want to take a look at. Are there any other code questions?

**Person 3:** So the query that you're building there, is that... Like, should you be building a representation of the query and it's actually sent to Fauna, it doesn't map in there?

**Chris:** That's right. All this looping happens on the server and you have loops and branches and all that good stuff and it all runs inside the transaction.

**Person 3:** I see.

**Person 4:** And I'm just looking at the 2011 data and internal...?

**Chris:** Yeah, all your user data lives under here because this could be time-stamped or something, like there's some top level fields that aren't user controlled, so you might want to index or update. I guess you can't update them, but you might want to select them. Everything lives in the data name space.

**Person 5:** So you provide that data or that envelope just out of the box?

**Chris:** Yeah, so the time-stamp is built in out of the box. We don't do auto-increment but we do... What's the name of it for the ID service?

**Person 5:** Snowflake.

**Chris:** We do a snowflake-style ID service and then there's metadata saying what the class of an instance is so we can use that to look up the ACL rules and stuff.

**Person 5:** So in Dynamo, you have to set all this up, too?

**Chris:** Then the time-stamp will automatically... You might not want to use our machine time-stamps for your time-stamps, but we use our time-stamps for the internal temporality tracking and all that.

So I found this great blog post about basic app architecture and stole the image to sort of show the difference between the status quo and what we're doing in this app with Fauna. And the main difference, so you've got the browser, it talks to all these lambdas via the API Gateway. Let's not worry about what order they go in. But in the status quo, the user service talks to a dumb database that doesn't know anything about your application rules, and the content service talks to whatever, right? And in the app that we've got, we've got both the content service and the user service talking to the same database so that they can share these business rules and whatnot.

So has anyone here written a Serverless app that uses that authentication boilerplate? It's probably the easiest way to add login to your app. The thing that took the longest was going onto Facebook and getting a Facebook app ID. But this is how it works, this is what your code's gonna do. We can be the code for a minute. So you go to the app, you click login, you get sent to this sign-in lambda. The sign-in lambda has to look up some environment stuff in lambda-land like whether or not this app wants you to sign in with Facebook or Google or whatever. And assuming it's Facebook, it redirects you to Facebook which does its thing and decides who you are and redirects you back to this callback lambda.

And so the callback lambda then has your Facebook user ID, essentially. And what we do is we find or create a user that's in FaunaDB. And by a user, that's not like some special Fauna class, it's just like, I happened to call it class user, I could have called it people. Any instance in Fauna can have credentials and access control, so you can actually have different classes of things that can log into your app if you want. So, in our case, we happen to have a class called user and it has some credentials, and so we're able to get a secret for it. And the callback then packages that secret up as an authorization header and that goes back to the browser. So now the browser is equipped to talk to the content service.

So when you go talk to the content service, you're gonna make an API request, like, "Give me all my Todos." And the content service goes to this authorizer. Forgive me, the arrows had to be like this because I just couldn't make sense of it any other way, but the authorizer is really a wrapper around the content service. So the first thing that happens when you call the content service is the authorizer unpacks your authorization header and makes sure that the content service has the unpacked version of it or rejects the call altogether if it's been expired or something like that, or the roles don't match up.

And so now the content service has this user...this FaunaDB that corresponds to the current user and it can do all its database work against FaunaDB with only the credentials that it should have and no super user powers at all and then sends that response back to the browser and everybody's happy. Except for I have a bug right now in my particular setup where, for whatever reason, this thing that happens when you get logged out because you were inactive for long enough, it's just happening all the time for me. I need to get to the bottom of this. And so it refreshes, and what that means is that the browser goes and tries to do what we just saw, but instead it gets access denied and the content service is like, "Oh, I got access denied," and the browser's like...

It's not that bad because it has this refresh joke in that it got back early on in the process that it's just been sitting on for a time like this. And it sends the refresh joke into this refresh lambda, which is nice because the refresh lambda doesn't have an authorizer in front of it. It doesn't have any other functionality except for converting tokens to headers. So the refresh lambda goes and looks up the user by the token and gives a new secret to the user back and resets that authorization header and now we're back here, making API requests.

**Person 6:** So the authorizer applies the policy of which functions you guys..the policy of which data you can access?

**Chris:** That's right. And in my particular app, there's all these authorizer features that correspond to stuff you can and can't do in API Gateway and whatever. Mostly, it didn't matter for me. Mostly, it was the data stuff. So I'm doing the simple thing, but there are a ton of complex features and you can make the authorizer grant different things to people with different Amazon roles and all that stuff. But at the end of the day, in this system, you're gonna either attach a FaunaDB secret to that policy or not and do the database work with that policy.

**Person 7:** Okay.

**Person 8:** So how do I configure lambda functions to listen to FaunaDB events or downstream stuff? So the user is signed up and now I want to send them a... How do I do that?

**Chris:** Right now you're gonna have to do that the ugly way. We're working on web hooks, essentially, which would be the way to have Fauna light up a lambda instead of having something listening to Fauna light up a lambda.

**Person 8:** Cool.

**Person 9:** Apparently, you used lambda streaming and triggers, they used to be called triggers...

**Chris:** So let's see if it still works. Should be no maintenance, right? So I'm all logged out and this is the application and this is where we keep the embarrassing stuff. And I'll log in and you'll see... If you're fast about paying attention to the stuff going down here in the corner, you'll even see that says sign in, that corresponds to my sign in lambda, it'll blink callback just for a second, there will be a Facebook URL that pops up. So I'm gonna click and I'm gonna define the word width. So we're waiting. Things are slower than they ought to be for a whole host of reasons, I'm on the slow Wi-Fi right now, stuff like that. Unless we actually hit time out, then it's gonna succeed eventually.

So here we go. Here are the Todos. I can make a new one, you can see that it's running that refresh loop in the background because of my bug that I need to fix. So I'm not gonna fix that tonight, but what's essentially happening is that it's making kind of four requests for every one that it should be making, which makes it seem slower than it really is. But once I get to the bottom of that, what I love about Serverless, coming from a different background, is the maintenance costs.

Once you've got the bugs down to zero, you can walk away and never look back. And, to me, that's really exciting, because if I still had all the cool stuff that I had deployed over the course of my career, I would have a really neat portfolio, but instead all I have is memories.

**Person 10:** So when you can send it out, you don't care which site is making callback to the conference server, doing that all navigation stuff again, but then it waits for confirmation from the conference server or adding it to the UI?

**Chris:** Yeah, I'm just doing the simplest UI thing, so basically every time I change the database I do a full query and repaint. But, yeah, it really should like, be way much faster if it wasn't churning through Facebook on every request and stuff. Maybe some Serverless folks can help me debug this core's caching thing.

And, yeah, you're welcome to try it yourself. All this is open source. I'll have the links at the end for you to go download the projects and deploy it yourself. There's a blog post on serverless.com that'll get you up and configured with a running Serverless authentication boiler plate and FaunaDB with an even simpler content service, just a little test content service, but if you walk through that blog post, you'll be ready to write a real app on FaunaDB that has all your data access control stuff happening.

So I did two different things, how I managed my schemas as an application developer building this stuff. On the authentication service, because the authentication service is already configured with a powerful secret, I just made a lambda that doesn't have any API gateway access configured. And so you have the lambda invoke it and it sets up the schema for you, creates the indexes, that kind of stuff. I think that's good, but then I also had this crud service that doesn't have a privileged secret, right? It doesn't have any secret.

And so, instead, I just had a privileged secret on my workstation and I hit the cloud and set up the schema that way. And I thought that was kinda sketchy, like I guess I wasn't used to thinking like that at first, but then after I did them both, I feel like they're both equally valid. If you have a big org, you'd wanna know which workstations you trust for that sort of thing, but that's a different problem.

So yeah, it's nice to have options. It's one of the nice things about the cloud is that it's not gonna yell at you about where your firewalls are and stuff. So if you wanna try this stuff out, you can go ahead and get up and running and have a database with data that you created in it in a minute and a half on fauna.com, maybe faster, because last time I timed it we were still making you come up with a password. And then the crud example is Serverless crud. It's been around forever as example code talking to other back-ends. I wrote an example that talked to FaunaDB using a privileged secret, using the boring old school patterns and then I rewrote it again for this using the database access control pattern.

And then this... That's our fork of it, you might actually, when you get there click and go to the original fork because our PR has been merged and improved since then. So yeah, that's all I've got for today except for QA. Thanks.

**Person 11:** The pricing of FaunaDB?

**Chris:** It's supposed to be very easy to reason about. So if points... And you get 1000 points for a dollar. No, you get 1000 points for a penny and a point is roughly what it costs to run a simple query.

**Person 11:** Is there a free tier, free points?

**Chris:** You get a sign up pack with some points, so we basically don't start trying to email you to get you into the billing system until you've used all those up.

**Person 11:** $10 worth of points?

**Chris:** Yeah.

**Person 11:** Which is a million points.

**Chris:** It's enough to let you develop for a few months or run in production for a few minutes.

**Person 11:** So DynamoDB is like 50 cents for each read and write throughput and it charges you regardless of whether or not you used it of course, not the old archaic model that's going away soon. This is like paper execution.

**Chris:** Yes, paper execution for sure. If you're like extremely highly utilized, that's when you may want to move to our on premise, because if you're running full bore all the time, paper and the machines that you're running on, you'll save money.

The off-premise licensing is by Core. So yeah, probably talk to Evan more about that if you're interested. Any other questions? Great, well thank you.
