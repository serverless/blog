+---
title: 3 things I learned designing developer-centric tools
description: As the newest product designer at Serverless, I had to ramp fast. Here's what I learned about keeping developers at the center of my design strategy.
date: 2017-10-03
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/devtools.jpg
authors:
  - FelixDesroches
 +---

I joined the Serverless family about a month ago (in startup months, so make that 14 in enterprise company months). Let’s just say the ramp-up curve has been...intense. 

I’ve built complex developer tools before, but never for open source, and never with this many moving parts. But hey, when you gain knowledge fast, might as well share it around, right?

Here are 3 workstyle factors I’ve learned are paramount to keep in mind when it comes to designing dev tools in this new (to me, anyway) context.

## 1. Engineers need dual-screen

Code wrangling comes with a full posse of devious collaborators. You’ve got:
multiple terminal windows for writing code and accessing file structures
additional browser windows for viewing live changes
[GitHub](https://github.com/) and [Waffle](https://waffle.io/) (or if you prefer, [waffle](https://i.ytimg.com/vi/ZxF9RH_SRfQ/maxresdefault.jpg)) for project tracking and asynchronous comms
plus a couple extra windows for those reams of documentation (try using AWS without docs, not pretty)

Once you add in Google Drive, Slack and break-time Twitter, a savvy developer needs *at least* 2 screens, if not 3.

So what does that mean for slick dev tool design?

Enable rapid context switching between services. Let people deploy some code (switch), check that it loaded correctly in the browser (switch), open up a metrics dashboard to see why it’s not grabbing http requests (switch), rant about it on Twitter (switch), coffee break.

Spending hours in the depths of Atom cranking out code is the exception these days, not the norm.

## 2. Balance CLI and UI

There’s an art to ensuring that information presented in the UI is complementary to what the user is accomplishing in the CLI.

Let’s walk through the example most familiar to me: someone signing in to Serverless.

If the user has logged in before, it’s simpler for them to type sls login into the CLI and bam—they’re in. But what if the user is logging in for the first time? Usually, you want to send them through browser-based onboarding: get set up and immediately deploy something simple that gets straight to the “Ah HA!” moment. (Or, we try.)

Doing this with in-line prompts in the CLI is totally possible, but in the UI you’ll have more control over making it a great experience.

This brings up another, more subtle problem: shortcuts versus flow.

Through the CLI, an engineer will use shortcuts for everything. No need to traverse the chasm between them and what they’re looking for; using shortcuts is like snapping your fingers outside a hotel lobby and being teleported straight to the comfy sofa in Room 202 where you’re watching Fixer Upper on HGTV. Magical.

From a design perspective, this means that as long as the core commands still work, the entire structure of the application can change and engineers might not even notice or care. All they need to know is that a finger snap puts them on their comfy sofa.

UI has a whole different approach. It provides *progressive* context and waypoints.

Users start in the lobby, walk past the concierge, see the signs for the elevators, smell fresh-baked cookies wafting from the continental breakfast. All these cues help users orient themselves. 

Tl;dr: be careful about changing the UI. The CLI doesn’t matter as much.

## 3. Open source vs. focus

One of the things that drew me into Serverless from day one was the passionate developer community. We wouldn’t be where we are today without all those issues and PRs. 

Having said that, being open source adds an interesting aspect to the product development process: where a typical engineering planning meeting might involve going through maybe a couple handfuls of active issues and open PRs, we have *dozens*.

And many of them end up actually informing the direction of our product. Honestly—we frequently discuss user-submitted issues that uncover things we either hadn’t planned for or hadn’t realized were so important. It makes for some pretty lively development. :)

## Design at Serverless

As a semi-technical non-developer, I’ve embraced the daily ins and outs of how our own team works. CLI? All day all night now, thanks.

I’m keeping all this in mind as the team works hard to bring you the next generation of serverless tools.

--Felix
