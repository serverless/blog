---
title: "Preparing for Big Scale in a Small Shop Using Serverless"
description: When a ragtag group of scrappy activists raise millions of dollars they need an architecture that never turns a donor away
date: 2017-09-01
layout: Post
thumbnail: https://movementvote.org/images/Movement-2018-logo-blue.png
authors:
  - VictorStone
---
The business of "funding the resistance" is a volatile one with huge spikes of donations and interest after major events (Charlottesville, Harvey, etc.) followed by relatively quiet periods. The idea of a zero-maintanence build, deploy and web-hosting environment that is pay-as-you-go is very attractive given shoestring budgets and itenerate swarms of volunteers that come and ghost at a moment's notice.

Having a highly componentized services like AWS is a blessing for its flexibility, but any number of advantages can be overwhelmed by an arcane systems that require a PhD in configuration files. When we tried out Sererless Frameworks, all of a sudden all that power seemed within reach.

## The Old Environment

Gamechanger Labs has grown up over the last few decades from youth organizing to being a concierge platform for major donors. In the half a year the scrappy little non-profit comprised mainly of part-time contractors and volunteers has raised millions of dollars and dispered them to nearly 100 different local grassroots organizations.

The bad news is that spike in attention was overwhelming the EC2 (free-teir tiny) Nodejs-React site that was collecting donations. The little site that could: couldn't. Too much of the energy of the tech folks was focused things like [chasing memory leaks in expressjs](https://github.com/expressjs/express/issues/2997) and generally just keeping the site from crashing. 

The site's content lives in a headless Wordpress installation where the admins and editors use the Wordpress admin app and plugins to edit the site. We use that WP installation to emits a [JSON RPC API](https://github.com/Movement-2016/movement2016-wp/blob/master/wp-content/themes/movement-admin-theme/inc/movement-json.php) that we use to populate the website. As thin as our React app was, it wasn't thin enough.

## The New Environment

Taking a step back it was obvious that the website didn't really do any computing at all. The site is a single-page app with five static pages and a set of services (e.g. contacting staff and managing donations plans) that had very little to do with the webpages itself.

The highly componentized architecture of the AWS universe meant that we could migrate the server side functions and a completely static website in an S3 bucket one piece at a time. There was a period when I was tearing off AWS services and bolting them on to our environement and that was great.

The goal was to move the [server side functionality](https://github.com/Movement-2016/concierge/blob/master/src/server/api.js#L18) running on EC2 completely into Lambda and make that move completely transparent to the React code in the browser.

The mantra of the project became "this should be easier." However, I hit a wall when it came to AWS Lambda. The service itself is relatively easy to understand conceptually but one look behind the scenes of Serverless Framework is actually doing and it's obvious there are many 1000s of man hours involved in creating a seamless development environment that we didn't have time to invest.

### Server Computing

The server functioned were moved into a new Git project called [bellman](https://github.com/Movement-2016/bellman)

