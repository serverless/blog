---
title: How the US Department of Defense is Streamlining Open Source Contributions with Serverless Code
description: Learn how the Defense Digital Service at the Pentagon used Serverless to automate the Developer Certificate of Origin process for contributors.
date: 2017-03-30
thumbnail: https://cloud.githubusercontent.com/assets/20538501/24520509/5c4edd80-154e-11e7-825c-600ad2e5e247.png
category:
  - user-stories
authors:
  - TomBereknyei
---

# Background

Hi everyone, my name is Tom Bereknyei, and I’m an engineer with the Defense Digital Service (DDS) at the Pentagon. We're an agency team of the U.S. Digital Service at the White House. Our mission is to bring private sector best practices, talent, and software into the Department of Defense (DoD).

It’s a tall order, but our small team of 25 engineers, product managers, designers and bureaucracy hackers have made significant strides in tech modernization across a variety of projects and initiatives in the year since we were created.

One such initiative is [Code.mil](http://code.mil).

> Code.mil is a free and open source platform created to encourage collaboration between the developer community and DoD, and release DoD developed and procured projects to the world for improvement and reuse.

# The Challenge

The first phase of Code.mil was to work with the developer community in crafting a licensing strategy that was accessible and made the most sense to users. Our team at DDS (composed of myself, fellow engineer Brandon Bouier and general counsel Sharon Woods) took the feedback from over 45 pull requests and hundreds of comments and decided upon using the Developer Certificate of Origin (DCO) as the mechanism for people to contribute while utilizing commonly accepted licenses selected for each project.

> During this process, a colleague mentioned it would be nice to automate the DCO process for project maintainers. I volunteered.

*My task:* I wanted to simplify the DCO process for contributors while also maintaining the integrity of the contributions. Ideally, there would be an automated pass/fail check to make sure that all pull requests and commits had a DCO sign off tagged to it. GitHub doesn’t currently provide a method of doing this (hint hint), so I began exploring other ways to incorporate this function into the user experience.

# The Solution

I was interested in using Lambda - an Amazon Web Services (AWS) feature that runs on demand computing rather than running it on a server. However, I felt like I was reinventing the wheel by implementing this with terraform and deploying the Lambda.

> This is when I came across Serverless, which was the perfect solution to leverage an AWS function minus all the boring work.

Serverless’s website led me to their [Examples repository](https://github.com/serverless/examples) in GitHub, where I did a quick forking of their [error code/error handling code](https://github.com/serverless/examples/tree/master/aws-node-github-webhook-listener) and used it as the basis of our automated DCO bot.

Combining this with some verification logic and the ability to update status and comments for a Pull Request made it pretty simple to put together. Debugging with `serverless logs -t` was much easier than messing with the logs in AWS, which shows that this is a tool developed by and for the convenience of developers.

This was my first AWS Lambda project, first GitHub bot project, first Serverless project; overall it was an easy and pleasant experience. The bot was built in a few hours over a weekend while simultaneously learning a few interesting technologies and APIs.

# The Results

This project was part of DDS’s effort to release its first open source project to positive reception, and we're excited to release more projects from the wider DoD community. The DCO bot is an uncomplicated way to ensure private contributors are correctly attributed as they’re working to improve the software that supports services for citizens worldwide.

***Check out [Code.mil](http://code.mil) to learn more about DoD’s open source initiative and contribute to DoD projects.***
