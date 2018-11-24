---
title: How you can avoid parking tickets with a Serverless reminder
description: How to build a simple Serverless app that reminds you about street sweeping days in your neighborhood. Never get a parking ticket again!
date: 2017-10-30
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/jordan-andrews-300359.jpg
authors: 
- NickGottlieb
---

If you live in a city, then you are incredibly familiar with these three, terrifying little words: "street cleaning day."

The worst part about street cleaning isn't the morning you wake up at 6:00am, groggy, still in pajamas, and run barefoot into the cold streets. Oh no. The worst part is the morning you forget to. The morning where you innocently slide behind the driver's seat to discover, nested under your windshiled wiper: another parking ticket.

Well. Here is your chance to fight back.

And learn a little Serverless development at the same time! Today, we're going to make a super simple serverless parking reminder.

# Set up the environment

We're going to create a cron job that sends us an SMS the night before every street cleaning day.

This example uses the [Serverless Framework](https://serverless.com/framework/), AWS Lambda and Node.js. You can install the Framework with:

```bash
$ npm install -g serverless
```

> **Note:** If you've never used these before, [here is a handy guide](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) for getting everything set up on your machine. 

# Configure your Serverless service

Once we're set up, we'll need to configure our Serverless service. In my neighborhood, the street sweeper comes on each second and fourth Wednesday, and each second and fourth Friday. I'll need to trigger a `schedule` event on each of those four days.

Create a new directory. Then create a new `serverless.yml` file in your directory with the following configuration: 

```yml
service: parking-reminder

provider:
  name: aws
  runtime: nodejs6.10
  region: us-east-1

functions:
  parkingReminder:
    handler: messenger.reminder
    events:
    # triggers at 17:00 UTC on the second and fourth Wednesdays and Fridays. 
      - schedule: cron(00 17 ? * 4#2 *)
      - schedule: cron(00 17 ? * 4#4 *)
      - schedule: cron(00 17 ? * 6#2 *)
      - schedule: cron(00 17 ? * 6#4 *)
```

After giving our service a name and configuring the `provider` section, the key portion is in the `functions` block.

We have one function configured, which we've named `parkingReminder`. It will invoke the `reminder` function in the `messenger.js` module, as noted by the `handler` property.

Finally, we've configured four events to trigger this function. Each of the events is a [schedule](https://serverless.com/framework/docs/providers/aws/events/schedule/) event, meaning they'll be invoked on a given schedule. In this example, I use cron syntax to list the four times on which I need my function to be invoked.

> **Note:** AWS provides really some really useful expressions for describing your cron jobs. [Full documentation is available here](http://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html).

# Hooking into Twilio 

Now, this service is only useful when it can actually send you a reminder. To do that, we're going to use Twilio inside our Lambda function. (If you don't have a [Twilio account](https://www.twilio.com/sms), you can set one up for free.)

Let's create a `package.json` file, then install the Twilio SDK:

```bash
$ npm init -y
$ npm install twilio
```

Then, we'll write our `reminder` function in the `messenger.js` module:

```js
// messenger.js

// Twilio Credentials 
var accountSid = 'ACCOUNTID'; 
var authToken = 'AUTHTOKEN';

//require the Twilio module 
var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

module.exports.reminder = (event, context, callback) => {
  client.messages.create({ 
    to: "YOUR NUMBER", 
    from: "TWILIO NUMBER",
    body: "move your car! street sweeping!", 
  }, function(err, message) { 
    console.log(err); 
  });
};
```

Pretty simple! I create a Twilio client, then use the client to send a message inside my `reminder` handler function.

> Note that I've stored my Twilio credentials directly in my handler file. You can do this for the testing stage as JavaScript variables in your `handler.js` file, but for production you’ll want to take more care with your credentials. Check out our post on [managing secrets with Serverless](https://serverless.com/blog/serverless-secrets-api-keys/) for different approaches.

Let's deploy our function to AWS:

```bash
$ sls deploy
```

Now that it's deployed, you can test out your functions by running `sls invoke --function functionName`.

# And the cost? Basically free.

You can run this without paying anything. Lambda has a generous free tier, and Twilio offers a free trial. But even if you were paying full price, it would be dirt cheap.

The example here would cost about $.0000002/month in Lambda fees and $.09/month in Twilio fees -- much cheaper than the cost of a parking ticket!

# See it on GitHub

You now have a serverless service for reminding you to move your car for street sweeping! 

Feel free to check out [the complete working example up on GitHub.](https://github.com/worldsoup/serverless-parking-reminder).
