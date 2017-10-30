---
title: Avoid parking tickets with Serverless 
description: How to build a simple Serverless app that reminds of street sweeping in your neighborhood. 
date: 2017-11-01
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

We're going to create a cron job that sends us an sms the night before every street cleaning day.

This example uses the [Serverless Framework](https://www.serverless.com/framework), AWS Lambda and Node.js.

> **Note:** If you've never used these before, [here is a handy guide](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) for getting everything set up on your machine. 

# Write the reminder function

After you’ve successfully deployed your Node template to to AWS, you’ll need to properly configure your `serverless.yml` to include functions that configure your reminders.

In my neighborhood, the street sweeper comes on each second and fourth Wednesday, and each second and fourth Friday. So I set up my functions like this:

```js
functions:
  secondWed:
    handler: messenger.hello
    events:
    #triggers at 17:00 UTC on the 4th day of the week (Tuesday) and the second occurence each month
      - schedule: cron(00 17 ? * 4#2 *)
  fourthWed:
    handler: messenger.hello
    events:
      - schedule: cron(00 17 ? * 4#4 *)
  secondFri:
    handler: messenger.hello
    events:
      - schedule: cron(00 17 ? * 6#2 *)
  fourthFri:
    handler: messenger.hello
    events:
      - schedule: cron(00 17 ? * 4#4 *)
```

> **Note:** AWS provides really some really useful expressions for describing your cron jobs. [Full documentation is available here](http://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html).

# Hooking into Twilio 

Now, this service is only useful when it can actually send you a reminder. To do that, we're going to use Twilio. (If you don't have a [Twilio account](https://www.twilio.com/sms), you can set one up for free.)

First up, you’ll need to set both your Twilio accountId and your authToken. You can do this for the testing stage as JavaScript variables in your `handler.js` file, but for production you’ll want to encrypt them with something like [AWS KMS](https://serverless.com/framework/docs/providers/aws/guide/functions#kms-keys):

```js
// Twilio Credentials 
var accountSid = 'ACCOUNTID'; 
var authToken = 'AUTHTOKEN';
```

Then, require the Twilio module:

```js
//require the Twilio module 
var client = require('twilio')(accountSid, authToken);
```

And write your reminder function. Mine looks like this:

```js
module.exports.hello = (event, context, callback) => {
  client.messages.create({ 
    to: "YOUR NUMBER", 
    from: "TWILIO NUMBER",
    body: "move your car! street sweeping!", 
}, function(err, message) { 
    console.log(err); 
});
};
```

Pretty simple!

To finish things up, include the Twilio module in your `package.json`, run `npm install` and test out your functions by running `sls invoke --function functionName`.

# And the cost? Basically free.

You can run this without paying anything. Lambda has a generous free tier, and Twilio offers a free trial. But even if you were paying full price, it would be dirt cheap.

The example here would cost about $.0000002/month in Lambda fees and $.09/month in Twilio fees.

# See it on GitHub

You now have a serverless service for reminding you to move your car for street sweeping! 

Feel free to check out [the complete working example up on GitHub.](https://github.com/worldsoup/serverless-parking-reminder).
