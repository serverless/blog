---
title: From chef to Serverless developer in 4 years
description: I started out my career as a chef. Now I'm a serverless developer.
date: 2018-01-09
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/clem-onojeghuo-175180.jpg
category:
  - user-stories
  - engineering-culture
authors:
  - KieranMcCarthy
---
I started out my software development career in a funny way—as a chef.

See, I fell in love with cooking and baking in high school. I was fascinated with the way I could experiment by mixing different ingredients to try and make something delicious...sometimes frankenstein-ish. I got a job in my home town in Ireland, my first time actually in a kitchen and supplying food to people, along with washing an insane amount of dishes.

I got really into baking when one of the chefs there showed me how to make Banoffee Pie. It was so simple and tasty that it actually blew my mind. I started baking over the summer to make some extra money while living at home, making cupcakes, cheesecakes and other little desserts.

That’s when I moved out with my long-time school friend, and I’d often cook for us, trying to make the most with what little we had. But with our new place, it was harder to travel to and fro from the restaurant I worked in and our home in the city. I decided to work part time there and got another job as a barista.

Jumping from job to job got exhausting at times, on top of the baking I did on the side in the hopes of starting a little bakery business. I’d have bad days doing the morning shift in the restaurant and the closing shift in the coffee shop. When I’d make my way home, my friend would cook to help out while also trying to learn how to cook himself. He’d always ask me what could he make with the ingredients we had lying around, “I have this, this and this. What can I do with it?!”

Instead of texting or calling and trying to think on the spot all the time, I thought—huh, maybe I could make a mobile app! Something he could throw a few ingredients into and a recipe would pop out. I mean, how hard could it be?

So off I went to learn how to build an app.

# From chef to dev

It was summer 2014 that I quickly realized I had no idea where to even start. What language should I learn? What platform should I do it on? Web or Mobile? What is a front and back end? Ah!

I turned to the same place many people do: Code Academy. I started learning some web development and tried to put myself more and more into a developer mindset. It opened my perception of everything! (Ok, maybe not the wonders of the universe, but you get what I mean.)

Messing around and trying to build static websites made we wonder about mobile apps and how they were built. I invested in a Udemy online course to learn Java, and used that knowledge to start working on Android. I found it really hard at the start, to the point where getting the screen to say `Hello World` was a huge accomplishment.

But I really wanted this. I really wanted to learn how to code. So I powered through.

After finishing my Java course and constantly working on Android, I built my first app and delivered it to the Play Store. (Funnily enough, it wasn’t the app for my friend, ha!)

I felt there was so much more out there to learn and didn’t want to stop at just mobile. Questions went through my head of “How do I connect to other devices?”, “What are servers and what do they do?”, “What is the cloud….and why is it called ‘the cloud’?”

All these questions were a Google away. So I tasked myself to learn about servers and how to code for them. I started building silly backend apps in PHP that took data from mobile test apps, web forms and curl commands.

This was when I started to feel like I was in the wrong profession. The more I learned and built things, the less excited I felt about cooking.

I wanted to be a developer. I wanted to create things that made a difference and were innovative. But I didn’t have a degree in Computer Science, or a degree full stop (didn’t finish college, dropped out in my second year). But I truly wanted to work as a developer.

I invested some money in taking the Java certification, in hopes of getting my CV taken seriously. I failed it the first time, but passed it the my second time around. I was so happy; this could be my ticket into being an actual developer!

## Thus began the job hunt

I put it into my CV and sent it everywhere I could find that was hiring developers. But nothing… “We are looking for someone with a degree”, “someone with experience”, “someone with a masters.” I started to think it was more “just someone else.” While feeling a bit down, thinking I would never get a job because I don’t have a degree or the money to start one, I decided to take more courses on Udemy.

I added everything I got from Udemy to my CV. I was proud of the work I did, so why not have it there? It must have paid off because I got an interview for an IT Consultancy here in Ireland. Dream come true!

Feeling excited and a bit scared, I was brought into a different world. But god I wanted to do well in it. I always asked to do more and be a part of more projects. I was given charge of migrating PHP applications from on-premise to the cloud. Some learning curve! The apps had to be updated to PHP7, we needed to implement DevOps and I needed to understand AWS on top of it all.

I bought a book called The Phoenix Project to understand DevOps and bought ACloudGuru’s Developer Associate course to learn AWS. I loved the cloud and DevOps. It was so much fun! After putting in a lot of time to learn all about the tooling, the project became much easier, and ultimately a success. We managed to not only migrate our apps, but also to create a skeleton for us to repeat this process in the future by following the steps we laid out during  migration.

This opened up the start of our Innovation team in the office. We wanted to build innovative ideas to make the office smarter and all of our lives easier. I was given charge to gather the stack needed for our idea of a smart desk booking service: a live data feed of our office that would show staff the best times to bring clients in,the best times for the staff themselves to come in, or if they should stay home and avoid the commute.

When building the backend, I found we’d need to spend a lot of time creating listeners for data changes and using streams. We planned to use Lambdas and the connection to them through API Gateway. So, off I went looking for time-saving frameworks to use.

Lo and behold, Serverless came into play!

## Transitioning to Severless development

I fell in love with it in an instant. I got to concentrate on the code and to get the app out fast—both for people to use, and for us to continually develop and grow what we had in mind.

I watched and rewatched everything the YouTube Channel FooBar had to offer; I couldn’t recommend it more to get up to scratch with Serverless. I took in every bit of knowledge Marcia had, and I found I grew comfortable building what I needed to.

In the end, I came up with the simple little architecture below:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/hotdesk.png">

Using Serverless, I was able to create a full flow for users to claim desks and see changes in real time: staff in/out of the office and desks available. All while keeping full control of our data, having a scalable model which practically takes care of itself, and *without* having to worry about our infrastructure and just focus on making something great for people to use.

# And now?

It took 4 years of teaching myself a whole new profession. Long evenings of making my way through Code Academy, studying OOP concepts for exams and just creating things I thought were really cool and fun to see working on the phone in my hand.

I’ve been learning Serverless for the last 5 months, and I’m now planning to bring Serverless into my job—a service to help clients build and migrate their applications. Along with building a chatbot side business using Serverless as my platform to do so!

It was a very busy 4 years! From cooking for people, baking cakes for events and growing an addiction to coffee, I never felt I’d be creating things like serverless text adventure chatbots and mobile apps that teach you about our solar system.

Maybe someday I will finish off my recipe maker app 😝
