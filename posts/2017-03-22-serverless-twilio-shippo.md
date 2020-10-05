---
title: How To Use AWS Lambda & API Gateway to Send Shipment Tracking Updates via SMS with Shippo & Twilio
description: A guide on using Serverless to create an AWS Lambda function that triggers on updates sent to AWS API Gateway to send SMS updates via Twilio for shipments you're tracking using Shippo
date: 2017-03-22
thumbnail: https://cloud.githubusercontent.com/assets/20538501/24521012/27ac7428-1550-11e7-895d-64f1e04208f5.png
layout: Post
authors:
  - RichardMoot
---

In this project, we’re going to receive a notification from a webhook about an a physical shipment in transit and trigger an SMS with the updated tracking information.  We'll build an AWS Lambda function that will trigger whenever Shippo pushes an update about a shipment to our AWS API Gateway Endpoint. Inside of the Lambda function, we’re going to call Twilio to send an SMS update with our tracking info provided by Shippo’s webhook.

Now, I know what you’re thinking, this sounds pretty complicated and requires a lot of manual set up and repeated uploading of JavaScript files to AWS, but you’d be wrong. We’re going to use Serverless to do a lot of the heavy lifting on this for us, because I’m all about writing less code to do more.

You can find the full project repo at [https://github.com/shipping-api/serverless-twilio-shippo](https://github.com/shipping-api/serverless-twilio-shippo)

Things you'll want before getting started with this tutorial:

* [Twilio Account](https://www.twilio.com/try-twilio)

> You'll need your Account SID and Auth Token from this (you can find these both in your dash after signing up)

* [Shippo Account](https://goshippo.com/register)

> You just need to plug in your API endpoint URL to the [webhooks](https://goshippo.com/docs/webhooks) area to have it work.

You can get Serverless by installing it globally on your machine using:

`npm install -g serverless`

Serverless provides a way to easily create a new service by just using their CLI as follows (you can omit the path if you don't want it to create a directory for you):

`serverless create --template aws-nodejs --path twilio-shippo`

Before you dig into creating your Lambda function, you'll want to setup a User in your AWS account for Serverless to have access for creating everything. They have a useful guide [here](https://serverless.com/framework/docs/providers/aws/guide/credentials/) that can walk you through getting your credentials setup.

It's as simple as adding a user `serverless-admin` with `AdministratorAccess` and using the credentials with the following command:

`serverless config credentials --provider aws --key ACCESS_KEY_ID --secret SECRET_ACCESS_KEY`

Once you have the credentials setup you can start adding function dependencies at the top of the `handler.js` file that Serverless created:

```javascript
const twilio = require('twilio')('TWILIO_ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
```

From here, we want to create the endpoint that we'll be putting into [Shippo's webhook](https://goshippo.com/docs/webhooks) interface for capturing all of our tracking updates. Every time Shippo detects a new update to the status of a tracking number that we have POSTed to them, Shippo will send out updates to our API endpoint that we give to them.

By default, Serverless will create an exported function named `hello`, but we're going replace that with our own called `smsUpdates` (its also probably good to add a log so we can see this show up in CloudWatch):
```javascript
// Reminder: This should be appended below the code found above
module.exports.smsUpdates = (event, context, callback) => {
  console.log(event);
  // Don't worry, we'll be adding more here down below
}
```

We are creating a POST endpoint, since Shippo will be POSTing the tracking updates to us. We'll then parse the data to relay over to Twilio to send out our SMS messages.

First, let's parse the body of the message that Shippo has sent to us. We'll set up a few variable to prevent repeating ourselves, and we'll add some logic in there to handle if there is no location provided with our tracking update.

```javascript
module.exports.smsUpdates = (event, context, callback) => {
  console.log(event);
  var body = event.body,
      trackingStatus = body.tracking_status,
      trackingLocation = '';

  if (trackingStatus.location && trackingStatus.location.city) {
      trackingLocation = trackingStatus.location.city + ', '
      + trackingStatus.location.state
  } else {
    trackingLocation = 'UNKNOWN';
  };
}
```
Now that we have our logic built for handling the body of the response and safely handle when we don't get a location with our tracking status, we can dig into sending a formatted SMS using Twilio.

The basic format for sending Twilio messages requires that we have a destination number (for sending our SMS to), our Twilio number that we're sending from, and a message to send (duh!).

Here is what it looks like once we add sending our message:
```javascript
module.exports.smsUpdates = (event, context, callback) => {
  console.log(event);
  var body = event.body,
      trackingStatus = body.tracking_status,
      trackingLocation = '';

  if (trackingStatus.location && trackingStatus.location.city) {
      trackingLocation = trackingStatus.location.city + ', '
      + trackingStatus.location.state
  } else {
    trackingLocation = 'UNKNOWN';
  };

  const response = {
      statusCode: 200,
      body: JSON.stringify({
        input: event,
      }),
    };

	const destinationNumber = '+12025550119'; // Replace with your own number
	const twilioNumber = '+12025550118'; // Replace with your Twilio number

  twilio.sendMessage({
    to: destinationNumber,
    from: twilioNumber,
    body: 'Tracking #: ' + body.tracking_number +
          '\nStatus: ' + trackingStatus.status +
          '\nLocation: ' + trackingLocation
  })
  .then(function(success) {
    console.log(success);
    callback(null, response);
  })
  .catch(function(error) {
    console.log(error);
    callback(null, response);
  })
};
```

You'll also notice that we create a `response` object for sending a 200 response back, since Shippo expects a 200 response when there is a successful receipt of a webhook post.

We're also using `console.log()` to log all messages to CloudWatch, which is really helpful in debugging or seeing the history of webhook events.

Now is a good time for us to tackle fixing up the serverless.yml file that will tell serverless how we want our lambda function configured and what AWS services it would use.

```yml
service: serverless-tracking

provider:
  name: aws
  runtime: nodejs4.3
  stage: dev
  region: us-west-2
  memorySize: 128

functions:
  smsUpdates:
    handler: handler.smsUpdates
    events:
      - http:
          path: smsupdates
          method: post
          integration: lambda
          cors: true
```

The above should get our function linked up to trigger when an AWS API Gateway endpoint `smsupdates` receives a POST. That should send off our tracking update to Twilio. If you want more details on configuring your Serverless service, checkout their docs [here](https://serverless.com/framework/docs/providers/aws/guide/services/).

Once you have your `serverless.yml` file setup, you can just use

`serverless deploy`

And your function should be uploaded to AWS with details about it logged out to the console.

Next, navigate to [https://app.goshippo.com/api](https://app.goshippo.com/api) and scroll down to Webhooks to click **+ Add Webhook**. Since we had our route go to `smsupdates` we'll want to append that to our url so that the updates post to the right place.

Look for these lines:

```
endpoints:
  POST - https://YOUR_UNIQUE_ID.execute-api.us-west-2.amazonaws.com/dev/smsupdates
```

After pasting this into the URL field in Shippo, make sure that the dropdown under Event Type is set to tracking and click the green checkbox to save it. Now we can test the function by clicking on test on the far right. If everything goes well, you should receive an SMS with tracking information at the number you had in the `to` field of your Twilio sendMessage object.

Now you can get SMS updates for all numbers that you post to Shippo automatically without having to provision any servers, and you only pay when you are receiving updates using Lambda and API Gateway with AWS. You could even take it a step further and include phone numbers for SMS updates in the `metadata` field when POSTing to Shippo and parse that out to dynamically send SMS updates to customers.

You can find more information about Shippo and how to use their [shipping API](https://goshippo.com/docs) to improve your shipping experience at [goshippo.com](https://goshippo.com).
