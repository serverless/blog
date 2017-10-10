---
title: ServerlessConf 2017 Recap - NYC
description: Breakdowns of our favorite ServerlessConf talks and high-level takeaways for the serverless community.
date: 2017-10-06
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/slsconf_nyc.jpg'
authors:
  - AndreaPasswater
---

# The State of Serverless Security
by [Mark Nunnikhoven](https://twitter.com/marknca)<br>

How does security in the serverless world *really* shape up?

Let's first go back to basics—the 6 part Shared Responsibility Model:
- data
- application
- OS
- virtualization
- infrastructure
- physical

When cloud entered the scene, this list got cut in half:
- data
- application
- OS

And then containers whittled it away a bit more:
- data
- application

Until  under a serverless paradigm, we are left only with:
- data

So what, then, are the three components to serverless security?

**1. Functions**

Code quality is a problem. Okay...it's *the* problem. If you look at the OWASP top 10 most common vulnerabilities, they've barely changed since 2010.

Dependencies are another factor. Whatever issues they have become your issue; dozens of dependencies mean dozens of possible threat points. And don't think that low-level threats are nothing to worry about—people can get root access by exploiting the right combination of grade 3 threats.

Still, we're doing pretty good overall here. Mark gives Serverless Fucntions security a **B+**.

**2. Services**

How does the provider secure their service? Make sure to check their certifications, and if they don't have certs (reasonably common in newer companies or smaller start-ups), grill them. Make sure they are fully transparent with you.

Also, what kind of security controls do they have? Can you encrypt at rest, use your own keys?

Vendors have a lot to lose if there's a breach, and they tend to be pretty good about this stuff. Services get a solid **A**.

**3. Data flows**

