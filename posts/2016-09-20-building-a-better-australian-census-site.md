---
layout: Post
title: 'Building A Better Australian Census Website with Serverless Architecture'
date: 2016-09-20
description: "Two students built an alternative Australian Bureau of Statistics Census website for $10 million less than the Australian government"
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/austrialia.png
authors:
  - StefanieMonge
---

Austin Wilshire and Bernd Hartzer [received world-wide attention](http://www.dailymail.co.uk/news/article-3742618/Two-university-students-just-54-hours-build-Census-website-WORKS-10-MILLION-ABS-disastrous-site.html) in August when they built an alternative Australian Bureau of Statistics Census website for $10 million less than the Australian government.

The kicker? The official ABS site crashed almost immediately after launching. Whereas, the site created by Austin and Bernd at a weekend hack-a-thon remained stable because it was built using serverless architecture. It also cost less than $500 compared to the government’s $10 million price tag. Here’s what Austin had to say about the whole process when he recently connected with Serverless, Inc. CEO Austen Collins and Developer Evangelist David Wells. Watch the video or read the transcript below.

<iframe width="500" height="281" src="https://www.youtube.com/embed/LFatDLhj4YA?feature=oembed" frameborder="0" allowfullscreen=""></iframe>

**[Transcript]**

**AC:**  This is Austen Collins. I’m the founder of Serverless, Inc. I created the Serverless Framework. We’ve got David Wells here on the line. He is our head of community over at Serverless, as well. Then we have Austin here, who built, well Austin maybe you should just take it away and talk a bit about yourself and then tell us this classic story. Tell us what happened.

**AW:**  Just a little bit about me. I’m just a web dev in Brisbane at the moment, working at a start-up called iRecruit. I went to my first hack-a-thon the other week, which was pretty awesome. A challenge was put out to build a better census. Because you guys are American, I don’t know if you’ve heard, but the Australian census was a massive, massive fail.

**DW:**  We heard.

**AW:**  You did hear? Okay, good. So the challenge was put up to build it for web scale. That’s something I actually wasn’t familiar with doing. So me and Bernd we were just like, sounds fun learning new tech, even if we don’t do it right. So over the weekend we just built it, tested it, and turns out we did it.

**AC:**  What was the massive fail for those watching that don’t know the story? What happened with the original census?

**AW:**  It crashed pretty much straight away. The government tried blaming it on DoS attacks, but they only tested for like one million requests per hour. They didn’t go higher than that and so I’m pretty sure what happened is just a bunch of people went on after dinner and the servers fell over.

**AC:**  To me, this is like a classic story. You hear about this stuff all the time. The government grossly overpays for some sort of simple solution. It goes totally wrong and crashes. Didn’t even sound like anything unexpected, really. But from what I’ve read, they’re doing the Australian census, and this happens … how frequently does this happen, every six years or four years?

**AW:**  Every five years, I’m pretty sure.

**AC:**  Okay. Every five years. What I read was that 16 million Australians were expected to complete the census entirely online, and so they spent over $9,000,000 creating this website so that they could collect the census information. I also read that they spent over $400,000 on load testing alone. So four hundred grand on just load testing, making sure that it could perform at scale. They said that servers were load tested at a 150% of expected usage levels, but all the money spent, after all the testing done, servers crashed in the evening and everyone was sort of erroring out when they were trying to complete their information. As of today, I think the census was … let’s see. What day is this? This is the 18th. The census was, what day was it Austin? It was like the 8th?

**AW:**  Yeah, I think so, yeah 8th, last week, Tuesday.

**AC:**  So as of today, less than half of all the Australian households have completed the survey. With this level of turnout they’re saying that the entire effort may be irrelevant because it’s just not enough data to draw sort of general patterns and stuff from it. So you guys went in and you did this hack-a-thon. How long did it take you to recreate it and how much detail did you put into recreating?

**AW:**  For the frontend, just the statistic pages, I just ripped them straight from the site because I didn’t want to waste time on just rebuilding it completely.

**AC:**  Sure.

**AW:**  I just grabbed them and that took probably an hour because I had to get past the code. I won’t go into how I did that but it happened. Then after that, to set up the actual architecture, it took me most of Saturday because I’d never touched AWS in my life.

**AC:**  Oh, wow.

**AW:**  So I was feeling my way out. Then on the Sunday I actually had to redo it on a different AWS account that had credits and that took me half an hour. It was pretty great.

**AC:**  What was the total time involved, would you say?

**AW:**  I’d give it under 24 hours, just under 24 hours total work.

**AC:**  Under 24 hours and you’re totally new to AWS which is amazing. Did you guys load test it at all? Did you test, how’d you do that?

**AW:**  Yeah, we did load tests. We used an open-source tool called Goad which you can find at [goad.io](https://goad.io/) and it uses Lambda functions to smash websites with requests. I’m actually not sure of the specifics but you can get up to 100k requests per second.

**DW:**  Was this hack-a-thon focused on this problem? Was everyone trying to…

**AW:**  No.

**DW:**  Okay, it was just your guys’ idea?

**AC:**  Nice.

**DW:**  I like the initiative.

**AW:**  No, it was actually our challenge. How a hack-a-thon works is people pitch their ideas and then you could work on whatever you wanted. One of the guys just got up and was like, make it great again. So we decided to do it. Everyone else was just building cool shit with VR and automatic time and space recognition. It’s crazy.

**AC:**  So you’re totally new to AWS. Did you know about Lambda before you started this project?

**AW:**  I’d heard whispers about it during the week like at work because we’re going to be using them I’m pretty sure. I’d heard a little bit about microservices and all of that, but it was really Friday night and Saturday where I picked up what serverless architecture was and all that.

**AC:**  What are the services that you’re using on AWS? What services did you use to recreate this?

**AW:**  It’s a really super basic stack. It’s just an S3 bucket then one of the pages makes a call to an API Gateway, which triggers the Lambda function, which inserts the data into DynamoDB. Just easy.

**AC:**  Super, super simple stuff, and when you load tested, what was the total cost of all that?

**AW:**  Look, we’ve put out in the media like $500, but the projected costs on Amazon were looking like under $30.

**AC:**  Wow.

**AW:**  Thirty dollars. Yeah.

**AC:**  Pretty amazing.

**AW:**  The best part about the load testing budget actually is it wasn’t automatic. They legitimately got people to go on to the site to test it. They didn’t just have bots smashing at it. They manually did it and that’s probably why it was so expensive.

**DW:**  Interesting.

**AC:**  Was there any official response to all this media coverage you guys got from the government?

**AW:**  Not really. In one of the articles, an ABS spokeswoman said they weren’t allowed to comment because of the investigation they had going on, so that’s the best we’re going to get I think.

**DW:**  Are you worried about being deported?

**AW:**  No. Not yet.

**DW:**  Come to San Francisco. Join us.

**AW:**  Aw, man.

**DW:**  You’ll be welcome here.

**AC:**  I was reading, I can’t remember what the article was, but there were a few good comments underneath the article and the first one was, someone says that if the Stats Bureau is clearly totally incapable of building a computer system capable of handling this task, why would anybody believe that their rock-solid guarantees of its total security in handling their data? Like, if they can’t put up a website that handles this much load, which isn’t really that big of a deal, how can we know that they’re really competent in handling the data? I thought that was an interesting point.  Of course, the other comment was that even more unfortunately, this highly publicized failure means e-voting and e-referenda which would be far cheaper and ultimately better will be delayed now, probably by years or maybe decades. I think that’s such a great point. Unfortunately, because of this, everybody’s going to have, in government at least, it’s highly likely that people are going to get more risk-adverse and they’re not going to want to build more elegant, simple solutions for people who need to comply with government regulations to do certain things: to take a census, to pay taxes or whatnot. For me, there’s nothing worse in the world than going to a government website to do something. Like the IRS website of the United States, anything that’s related to the Department of Motor Vehicles in California, that is just the worst experience and it’s been that way forever. Unfortunately, the downside of all this stuff is that they’re probably going to be more scared to embrace more online efforts and stuff in the future, which is just on the wrong side of history, unfortunately.

**AW:**  Yeah, no, absolutely. It does such.

**DW:**  How does it feel to have Werner Vogels tweeting about your guys’ story, the CTO of Amazon?

**AW:**  That was pretty crazy. When I saw that one, I was like, hey, wait, hang on. One of the guys who interviewed me said, “This guy’s kind of a big deal.” He’s actually going to come to Brisbane next month, I’m pretty sure. We might try and have a sit down and just chat about what happened, I guess. I don’t know, pretty cool.

**DW:**  He owes you one, man. This is like, put it on the front page.

**AW:**  It was all over Reddit, as well, which was really crazy.

**AC:**  Yeah, all right. I don’t have any other questions other than this is a fantastic story. Austin, you rock. You’re clearly going to do lots of cool stuff. I hope that all the traction and interest that’s come as a result of this works to your benefit and just great job, all around.

**AW:**  Thank you, man. Means a lot, man. It’s good stuff.

* * *

_Also published on [Medium](https://medium.com/@serverlessinc/challenge-accepted-building-a-better-australian-census-site-with-serverless-architecture-c5d3ad836bfa)._
