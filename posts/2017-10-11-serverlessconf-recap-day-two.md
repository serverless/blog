---
title: ServerlessConf 2017 Recap - NYC
description: Breakdowns of our favorite ServerlessConf talks, plus some high-level takeaways for the serverless community.
date: 2017-10-10
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf_nyc.jpg'
authors:
  - AndreaPasswater
---

## Why the Fuss About Serverless?
by [Simon Wardley](https://twitter.com/swardley)

Simon regaled the crowd with a thoughtful appraisal of how we think about systems—and what this all means for serverless. It was densely packed and every slide was good, so information was kind of flying at our heads. But here are some of his key points: 

**Maps don’t equal Diagrams**<br>
Maps help us better conceptualize problem spaces; we should all be making them. And we're all making maps, right? Like systems maps!

Except...maps imply that if you alter them, the world also fundamentally changes. Maps are more than just a visual; they also need to take into account an anchor, position and movement. Imagine if you were to take Australia and plop it down beside Peru. Instantly different globe.

<img width="600" src="http://blog.gardeviance.org/2017/05/is-my-diagram-map.html">

So back to our systems "map". It doesn’t have any of those characteristics. Move CRM over to the right? Nothing about the relationship between components change (as there’s no anchor). We constantly make business decisions using diagrams and not maps, and then are surprised when a gap emerges. Our diagrams aren't painting a picture of the market landscape.

Basically, we've been doing it wrong.

Simon's approach was to start with a User as his anchor, and draw his map trickling down from that user, on to what that user wanted and needed, then what those needs would require, and so on, until he ended up at the technology that would support those needs.

