---
title: "A Serverless Twitter bot helps house Camp Fire victims"
description: "When the California Camp Fire displaced thousands of people from their homes, I built a simple serverless Twitter bot to help people get placed in temporary housing!"
date: 2018-12-05
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/camp-fire/camp-fire-housing-thumb.jpg'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/camp-fire/camp-fire-housing.jpg'
category:
  - guides-and-tutorials
  - user-stories
authors: 
  - EricWyne
---

For those of you not living in Northern California, I’m sure you’ve at least heard of our most devastating wildfire to date: Camp Fire, which spread out north of Sacramento, taking out entire towns like Paradise, Concow and Magalia.

I live in Chico, a mere twenty minutes from Paradise, where thousands of people lost their homes in a span of hours. Especially because of my proximity, the devastation from the fire was really poignant for me. Many of these people weren’t strangers; they were my friends.

I knew I wanted to do everything I could to help out, and housing was the biggest need.

There was a website, [campfirehousing.org](https://www.campfirehousing.org/) (created by [nvpoa.org](https://www.nvpoa.org/)), where individuals could post about temporary housing opportunities for Camp Fire victims—extra bedrooms in homes, and things like that. The idea behind that website was fantastic, but it was missing some critical features that I knew would help people find housing faster.

For instance, there was no way to be notified when a new housing opportunity was posted, and it was hard to tell which postings were still open. People who were looking for places to stay still had a hard time seeing what was even truly available, and jumping on new housing as it got added to the site.

So I thought, hm. How long would it take to throw some code together that would notify people of new housing opportunities as soon as they were posted?

#### The Serverless Twitter bot

I decided to create a Twitter bot that would tweet out housing opportunities as they were added to campfirehousing.org. Anyone who was interested could follow the bot on Twitter and stay on top of what was newly-added and available.

I chose to power the app with a serverless backend for a couple reasons. For starters, it was going to be the quickest way to get the app off the ground and helping people. On top of that, due to Lambda’s generous free tier, it was almost certainly going to cost me nothing.

The whole thing was built with the Serverless Framework + AWS Lambda. I was able to get this entire project off the ground in only two hours, from initial research to first successful tweet.

#### Building the bot: just one function

Campfirehousing.org didn’t have an RSS feed, so I had to set up a CRON ([scheduled function](https://serverless.com/framework/docs/providers/aws/events/schedule/)) that would check the website for updates every five minutes, and read the values from a Google Sheet. When there were new postings, my Twitter bot would tweet them out.

The tweets included important info like price, city, availability date, whether pets were allowed, and a short description. I scraped all this data directly from campfirehousing.org, and truncated the full text down to 280 characters when applicable.

<blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">Posted: Dec 4th @ 10:34:47AM<br>1 bed/1 bath<br>Price: $0<br>City: Valencia (Santa Clarita)<br>Term: Temporary<br>Available: 12/4/2018<br>Pets: No<br>Description: Bedroom(s) Available</p>&mdash; CampFireHousing (@CampFireHousing) <a href="https://twitter.com/CampFireHousing/status/1070024789736095744?ref_src=twsrc%5Etfw">December 4, 2018</a></blockquote>
<script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Overall, the code is just a pretty simple and straightforward single function; [check it out here](https://gist.github.com/ecwyne/0438408804cd6e1023ba381c4cb5efc9) and feel free to use it in your own projects!

You can also find the full Twitter stream at [@CampFireHousing](https://twitter.com/CampFireHousing).

#### Challenges along the way

The hardest part of this entire project was actually figuring out how to handle dates. I was working locally on my machine in PST, but when I ran code in AWS it defaulted to GMT.

I ended up having to tell Lambda function to run as though it was in PST, so I could have the same experience locally as in the cloud.

#### A special shout-out to the Serverless Framework and open source

Working on side projects like these make me realize how amazing the open source community is.

I’m grateful for the open source projects that allow date manipulation and quick tweet integrations, and for how easy the Serverless Framework made it to ship my code into the world. The [serverless-plugin-typescript](https://github.com/prisma/serverless-plugin-typescript) plugin made writing TypeScript functions in Lambda super easy, for example.

It’s just awesome to know I can think of a project, and be able to lean on open source contributions like this to make it happen much quicker and easier than I could do it all alone.

#### A note in closing from the Serverless team

We absolutely love the way that serverless technologies are enabling people to build applications that serve their communities like this!

If you’ve done something for a non-profit with Serverless, please don’t hesitate to share it with us so we can help you spread the word. We want your code to help others do the same.

#opensourceforever
