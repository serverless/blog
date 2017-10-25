---
title: Avoid parking tickets with Serverless 
description: How to build a simple Serverless app that reminds of street sweeping in your neighborhood. 
date: 2017-11-01
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/jordan-andrews-300359.jpg
authors: 
- NickGottlieb
---

If you park on the streets in a city that has street sweeping, you’ve shared felt my frustration a getting a ticket for not moving your car. With everything else going on in life it’s inevitable that you’ll forget to move your car eventually, especially in cities like San Francisco which seem to intentionally create confusing street sweeping schedules.

Well here is your chance to fight back and learn a little Serverless development at the same time.

This example is done using the Serverless Framework, AWS Lambda, and Node.js, so the first thing you’ll need to do is get all three of those setup. [Here is a handy guide for doing that](https://serverless.com/framework/docs/providers/aws/guide/quick-start/). 

Once you’ve successfully deployed your node template to to AWS you’ll need to properly configure your serverless.yml to include the functions you need for your parking reminder needs. In my neighborhood street sweeping comes in the mornings on the second and fourth Wednesday as well as the second and fourth Friday of each month, so I set up my functions like this:

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

AWS provides really some really expressions for describing your cron jobs, [full documentation is available here](http://docs.aws.amazon.com/lambda/latest/dg/tutorial-scheduled-events-schedule-expressions.html). 

Once you’ve set up your serverless.yml, you’ll need to configure your code in your handler.js file. The first step in doing that is setting up a [Twilio account](https://www.twilio.com/sms) (free) and configuring your API credentials in your project. You’ll need to set both your Twilio accountId and your authToken. To get started you can simply set them as JavaScript variables in your handler.js file but for production you’ll want to encrypt them with something like [AWS KMS.](https://serverless.com/framework/docs/providers/aws/guide/functions#kms-keys) 
```js
// Twilio Credentials 
var accountSid = 'ACCOUNTID'; 
var authToken = 'AUTHTOKEN';
```

Next you’ll need to require the Twilio module.

```js
//require the Twilio module 
var client = require('twilio')(accountSid, authToken);
```

Then you’ll need to write your reminder function, mine looks like this:

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

Pretty simple. The last step is to include the Twilio module in your package.json, run ’npm install’ and test our your functions by running ‘sls invoke --function functionName’.

You now have a serverless service for reminding you to move your car for street sweeping! You can run this without paying anything using the free Lambda tier and the Twilio free trial, but even you were paying full price it wouldn’t break the bank. The example here would cost about $.0000002/month in Lambda fees and $.09/month in Twilio fees.

[Here is a complete working example up on GitHub.](https://github.com/worldsoup/serverless-parking-reminder)

