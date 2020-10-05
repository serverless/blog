---
title: "No Server November: Join the #noServerNovember challenge!"
description: "All November, we're posting a series of serverless challenges. Do the challenge, tweet it out, and you might get swag!"
date: 2018-11-01
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/no-server-november-thumb.png"
category:
  - guides-and-tutorials
  - news
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-no-server-november.png"
authors:
  - AndreaPasswater
---

Ah, November. The month of re:Invent, pumpkin spice, and now: the #noServerNovember challenge.

Every week this month, we're releasing some Serverless Challenges that are designed to help experienced users level up, and brand new users get started. Do one, or three, for fun in your spare time!

If you do any of the challenges and tweet a link to your GitHub repo with the hashtag #noServerNovember, you just might win some official Serverless swag.

Be sure to [check the rules](#rules) before submitting!

As a side note, we also have a [Serverless Examples Explorer](https://serverless.com/examples/) on our website. So if you complete a challenge and feel good about it, submit it to our [Examples Repo](https://github.com/serverless/examples)! It might get featured on [serverless.com](https://serverless.com/).

#### The challenges

There are currently **9** challenges and **1** hackathon to choose from!

#### Nov 26: Special edition re:Invent hackathon!

We've got even cooler prizes this week for our hackathon entrants. The re:Invent virtual hackathon can be done from anywhere, on a team or not on a team, however you want to enter.

[Check out the hackathon assignment](https://serverless.com/blog/no-server-november-reinvent-hackathon/) and get building!

#### Nov 19: Twilio reminder, Slack bot, stock ticker

##### Make an SMS reminder bot with Twilio.

*Beginner track*

Create a serverless-backed Twilio reminder bot that sends you a text message. Have it tell you to take out the trash. Or move your car to avoid parking tickets. Or text your mom happy birthday.

Here are some resources to get you started:
* [How to avoid parking tickets with Serverless](https://serverless.com/blog/avoid-parking-tickets-with-serverless/)

How to submit to the Reminder Bot challenge:
1. Tweet the link to your GitHub repo with a screenshot of the sent text message.
2. Include the hashtag #noServerNovember.

##### Make a Slack bot that suggests a random 80s action flick.

*Intermediate/Advanced track*

Create a serverless-backed Slack bot. Users should be able to type a slash command (such as `/action`), and receive the name of a random action flick.

Bonus points if you include the cover art, a link to the IMDB / Rotten Tomatoes page, a quote, or really anything else that makes it more robust.

Here are some resources to get you started:
* [The `serverless-slackbot` example in GitHub](https://github.com/johnagan/serverless-slackbot)
* [The Movie Database API](https://developers.themoviedb.org/3/discover/movie-discover)
* [TMDB movie metadata](https://www.kaggle.com/tmdb/tmdb-movie-metadata)
* [Create a Slack bot with Serverless](https://foobar123.com/code-with-me-create-a-slack-app-with-serverless-part-1-18b1052310c8)
* [Make a serverless chatbot](https://acloud.guru/learn/serverless-chatbot)

How to submit to the 80s Action Flick challenge:
1. Tweet the link to your GitHub repo with a screenshot of the bot in action.
2. Include the hashtag #noServerNovember.

##### Create a cron + ETL-backed stock ticker.

*Intermediate/Advanced track*

Create a serverless-backed cron job that runs an ETL script to pull data from one SaaS service into another. For example, a phone number you can text to receive stock (or for additional buzzword bonus points, crypto) price information. We recommend going Twitter -> serverless backend (AWS Lambda, Microsoft Azure, or Google Cloud Functions) -> 

Here are some resources to get you started:
* [ETL job processing with Serverless and redshift](https://serverless.com/blog/etl-job-processing-with-serverless-lambda-and-redshift/)

How to submit to the Stock Ticker challenge:
1. Tweet the link to your GitHub repo and a screenshot of your Stock Ticker in action.
2. Include the hashtag #noServerNovember.

#### Nov 12: Cute Cats, Alexa skill, AnimalBot

##### Make a website that serves visitors cute cat gifs.

*Beginner track*

Make a website. On that website, pull in a random cat gif. At its most basic, the gif should change every time the page is refreshed. Bonus points if you create a custom domain name.

Here are some resources to get you started:
* [Cute cat gifs on Giphy](https://giphy.com/explore/cute-cat)
* [How to create a dynamic website with pre-built Serverless Components](https://serverless.com/blog/how-create-dynamic-website-with-serverless-components/)
* [Check our Examples Explorer for a dynamic website example](https://serverless.com/examples/aws-node-serve-dynamic-html-via-http-endpoint)
* [Create a custom domain name for Lambda and API Gateway](https://serverless.com/blog/serverless-api-gateway-domain/)

How to submit to the Cute Cat challenge:
1. Tweet the link to your GitHub repo and your Cute Cat webpage.
2. Include the hashtag #noServerNovember.

##### Build an Alexa skill that tells you a random fact about One Direction.

*Intermediate/Advanced track (fun version)*

Make a serverless-backed Alexa skill. When you say, “Alexa, tell me something about One Direction,” or “Alexa, hit me with some One Direction facts,” Alexa should answer you and tell you a random fact about One Direction.

Here are some resources to get you started:
* [Here are some One Direction facts; you’ll need to convert this to a database](https://www.thefactsite.com/2012/01/50-facts-about-one-direction.html)
* [Search Alexa examples](https://serverless.com/examples/) in the Serverless Examples Explorer
* [Building Alexa skills with the Serverless Bespoken plugin](https://serverless.com/blog/building-testing-alexa-skill-bespoken-plugin/)
* [How to build a serverless Alexa skill](https://medium.com/@rupakg/how-to-build-a-serverless-alexa-skill-51d8479e0432)

How to submit to the One Direction challenge:
1. Tweet the link to your GitHub repo, ideally also with a video (or sound clip) of the Alexa skill working, because that is way more fun.
2. Include the hashtag #noServerNovember.

##### Create a Twitter bot that recognizes animals in images.

*Advanced track*

Make a serverless, image-recognition-backed Twitter bot. When a user tweets at the bot: “@animalbot, what’s in this image?”, the bot should reply with the name of the animal, “It’s a panda!”

 Here are some resources to get you started:
* [Using Tensorflow with the Serverless Framework for image recognition](https://serverless.com/blog/using-tensorflow-serverless-framework-deep-learning-image-recognition/)
* [Deploying bots on Azure using the Serverless Framework](https://www.microsoft.com/developerblog/2017/06/01/deploying-bots-using-the-serverless-framework/)
* [Making a Twitter AWS Lambda bot](https://garywoodfine.com/twitter-wordpress-aws-lambda-bot/)

How to submit to the AnimalBot challenge:
1. Tweet the link to your GitHub repo and AnimalBot account.
2. Include the hashtag #noServerNovember.

#### Nov 5: Serverless Ipsum, DadJokeBot, GitHub Check

We've got three challenges this week to suit all levels! The Serverless Ipsum challenge can be done even if you've never set up an AWS account before, and have never coded anything in your life.

Every challenge you complete gets you one entry into the drawing.

##### Build a Serverless Ipsum generator.

*Beginner track*

Build a simple serverless-backed web app that displays Serverless Ipsum when it is loaded. Or Tony Danza Ipsum. Or The Office Ipsum. Or Reasons-I-Can’t-Take-Out-The-Trash Ipsum. 

As long as it looks like Lorem Ipsum, but uses different words, we’re good. The page doesn’t have to look fancy, and you can do this even if you’ve never coded anything in your life!

Here’s a tutorial to get you started:
* [I just deployed a Serverless app—and I can’t code](https://medium.freecodecamp.org/i-just-deployed-a-serverless-app-and-i-cant-code-here-s-how-i-did-it-94983d7b43bd)

Plus, some inspiration for all of you not-a-developer-yet-but-learning types:
* [From chef to Serverless developer in 4 years](https://serverless.com/blog/from-chef-to-serverless-developer-in-4-years/)

How to submit to the Serverless Ipsum challenge:
1. Tweet the link to your GitHub repo and your Ipsum webpage.
2. Include the hashtag #noServerNovember.

##### Make a Twitter bot that tweets dad jokes.

*Intermediate/Advanced track (fun version)*

Write a serverless-backed Twitter bot. Make it tweet dad jokes. That’s really all there is to it.

Here are some helpful links to get you started:
* [A dad jokes API](https://icanhazdadjoke.com/api)
* [Write a Twitter Wordpress AWS Lambda bot](https://garywoodfine.com/twitter-wordpress-aws-lambda-bot/)
* [Write a Twitter bot using Microsoft Azure](https://www.microsoft.com/developerblog/2017/06/01/deploying-bots-using-the-serverless-framework/)

How to submit to the DadBot Twitter challenge:
1. Tweet the link to your GitHub repo and your DadBot account.
2. Include the hashtag #noServerNovember.

##### Automate a GitHub Check with Serverless.

*Intermediate/Advanced track (actually useful (!!!) version)*

This project is one of our favorites around the office, for its sheer usability. Automating anything to do with GitHub is just incredibly useful.

For the easy version, set up a GitHub check that makes sure there’s a reference to a GitHub / Jira / etc issue in the PR title. For the harder version, set up a GitHub check to automatically lint & reformat your code on a new commit.

Or, do something else fun. We’ll leave this open-ended.

Here are some resources to get you started:
* [GitHub Checks documentation](https://developer.github.com/v3/checks/)
* [Using git on AWS Lambda](https://blog.enki.com/using-git-on-aws-lambda-f365a2db706b?gi=c17971d97e6a)
* [Set up a serverless GitHub webhook](https://serverless.com/blog/serverless-github-webhook-slack/)
* [See the GitHub webhook example in our Examples Explorer](https://serverless.com/examples/aws-node-github-webhook-listener)
* [How to build a GitHub bot](https://medium.freecodecamp.org/how-to-build-a-github-bot-with-phantomjs-react-and-serverless-framework-7b66bb575616)

How to submit to the GitHub Check challenge:
1. Tweet the link to your GitHub repo with a screenshot of the Check in action.
2. Include the hashtag #noServerNovember.

**Nov 26:** *Special Edition: re:Invent serverless hackathon*

#### How it works

The first three Mondays in November, we'll release a new set of Serverless Challenges. We’ll also include some resources to get you started. The final week of November, we'll have a special edition re:Invent hackathon instead.

Find a challenge you like! Or better yet, find multiple challenges you like! You can enter separately for every challenge you complete, and you can complete any challenge at any time.

Do the challenge. Put it in GitHub. Tweet a link to your repo, plus any other relevant links or screenshots, with the hashtag #NoServerNovember. 

Each entry qualifies you to win a prize. We will draw three winners every week, and we don't remove you from the pool until you win a prize. So if you complete a challenge during week 1, you could be in the drawing for weeks 2 and 3 as well. All the more reason to start early!

Draw dates:
- Nov. 12
- Nov. 19
- Nov. 26

#### Rules

To qualify, the entry must use the Serverless Framework and a serverless backend (such as AWS Lambda, Google Cloud Functions, or Microsoft Azure).

You may only enter one time per daily challenge. You can, however, complete as many daily challenges as you want, and those will count as separate entries.

You must follow any additional instructions contained within the challenge descriptions to have your entry counted.
Only entries that use the hashtag #noServerNovember will be qualified to win.
