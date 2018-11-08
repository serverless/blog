---
title: Build a Github webhook handler with Serverless & AWS Lambda
description: Deploy a Serverless service that posts notifications of Github stars in a Slack channel
date: 2018-01-03
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/logos/serverless-square-icon-text.png'
category:
  - guides-and-tutorials
authors:
  - AlexDeBrie
---

One of the great applications for Serverless is using it as glue code between different services. You can spin up an endpoint to handle a webhook in seconds without bugging your company's Ops department.

Github has a very mature [webhook integration](https://developer.github.com/webhooks/) where you can be notified of a wide range of events. You can run a linter when a pull request is opened, send a notification when an issue is created, or trigger a deploy when a pull request is merged.

In this tutorial, we'll show how to handle Github webhooks. We'll create a webhook that fires whenever our open-source repository is starred. Our handler for this event will post a celebratory message in a Slack channel.

The end result will look like this:

<img width="412" alt="Slack example message" src="https://user-images.githubusercontent.com/6509926/32450649-5c1a4e82-c2da-11e7-98a4-2a9ec1cd2ab7.png">

Let's get started!

# Before you start

To complete this tutorial, you'll need:

- The [Serverless Framework installed](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) with an AWS account set up;
- A Github account, plus a repo where you have admin or owner permissions; and
- A [Slack](https://slack.com/) account where you have the ability to create apps.

# Setting up your Slack incoming webhook

The first thing we'll do is set up an Incoming Webhook for a Slack channel. This will give us an HTTP endpoint to post messages that will be displayed in our Slack channel.

First, create a new channel in Slack where you want the messages to go. You probably don't want to spam your whole team in `#general`. 😬

In your new channel, click the link to `Add an app`:

<img width="825" alt="Slack Add an app" src="https://user-images.githubusercontent.com/6509926/32443968-90fa0232-c2c6-11e7-96a1-4862cca62534.png">

Search for the "Incoming Webhook" application, and create a new one for your channel:

<img width="997" alt="Create Incoming Webhook app" src="https://user-images.githubusercontent.com/6509926/32444016-bfd1c8a6-c2c6-11e7-89a0-3a6efe4c0a02.png">

After you create it, it will display a Slack webhook URL. This is the URL where you will post data to show in the channel:

<img width="1010" alt="Webhook URL" src="https://user-images.githubusercontent.com/6509926/32444071-ebec9a92-c2c6-11e7-9e26-bd5a9b4f18a0.png">

> Save this URL as you will need it in your Serverless function.

Finally, you can customize the webhook display so it's nicer when it posts in the channel. Here, I change the name to "Github Stars" and use a star emoji as the icon:

<img width="999" alt="Webhook display" src="https://user-images.githubusercontent.com/6509926/32444132-112e17f4-c2c7-11e7-8dba-b025fb9e65dd.png">

# Deploying our Serverless webhook handler

Now, let's move on to setting up our webhook handler. In our handler, we'll want to parse the given event for the information we want, then send a formatted message to Slack using our webhook URL from the previous step.

First, let's create a new directory for our Serverless service and initialize it with a `package.json`:

```bash
$ mkdir stargazer
$ cd stargazer
$ npm init -y
```

We're going to be using the [`WatchEvent`](https://developer.github.com/v3/activity/events/types/#watchevent) from Github to get notifications of our repository being starred. We want to post a message that looks as follows:

<img width="412" alt="Slack example message" src="https://user-images.githubusercontent.com/6509926/32450649-5c1a4e82-c2da-11e7-98a4-2a9ec1cd2ab7.png">

For this message, we'll need:

 - the repository being starred;
 - the total number of stars for the repository;
 - the username starring our repository; and
 - the URL to the user's Github profile.

Github includes an example event structure, which is very useful. A truncated version is below:

```json
{
  "action": "started",
  "repository": {
    "id": 35129377,
    "name": "public-repo",
    "full_name": "baxterthehacker/public-repo",
    ...
    "stargazers_count": 0,
	 ...
  },
  "sender": {
    "login": "baxterthehacker",
    "id": 6752317,
    "avatar_url": "https://avatars.githubusercontent.com/u/6752317?v=3",
    "gravatar_id": "",
    "url": "https://api.github.com/users/baxterthehacker",
    "html_url": "https://github.com/baxterthehacker",
    ...
  }
}
```

In our service directory, let's create a `handler.js` with our handler code:

```js
'use strict';

const request = require('sync-request');

const WEBHOOK_URL = process.env.WEBHOOK_URL;

module.exports.stargazer = (event, context, callback) => {
  const body = JSON.parse(event.body)
  const { repository, sender } = body;

  const repo = repository.name;
  const stars = repository.stargazers_count;
  const username = sender.login;
  const url = sender.html_url;

  try {
    sendToSlack(repo, stars, username, url);
  } catch (err) {
    console.log(err);
    callback(err);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: "Event processed"
    }),
  };
  callback(null, response);
};

const sendToSlack = (repo, stars, username, url) => {
  const text = [
    `New Github star for _${repo}_ repo!.`,
    `The *${repo}* repo now has *${stars}* stars! :tada:.`,
    `Your new fan is <${url}|${username}>`
  ].join('\n');
  const resp = request('POST', WEBHOOK_URL, {
    json: { text }
  });

  // Use getBody to check if there was an error.
  resp.getBody();
}
```

Let's walk through this handler code.

The exported `stargazer` function is the handler for our Lambda. This is what will be called when our function is triggered. In that function, we pull out the necessary elements of the webhook event, then use our `sendToSlack` function to assemble the message and post it to Slack.

We should look at two other things before moving on. First, notice how we're getting the webhook URL from a WEBHOOK_URL environment variable. This is something we'll need to inject with our `serverless.yml`.

Second, we're using a third-party NPM package, [`sync-request`](https://github.com/ForbesLindesay/sync-request) (yes, I use sync-request because I don't like messing with callbacks 😬). We'll need to install this package locally with NPM, and then Serverless will include it in our deployment package. Let's install that now:

```bash
$ npm install --save sync-request
```

With our handler code written, let's move on to our `serverless.yml`. This is our "infrastructure-as-code", where we configure our different functions, events, and additional configuration:

```yml
# serverless.yml

service: stargazing

provider:
  name: aws
  runtime: nodejs6.10
  environment:
    WEBHOOK_URL: "https://hooks.slack.com/services/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"

functions:
  stargazer:
    handler: handler.stargazer
    events:
      - http: POST stargazer
```

In our `functions` block, we configure a single function, `stargazer`. We provide a path to our handler file and the name of the function to be triggered. Then, we set up an http event to be triggered on a POST request to `/stargazer`.

Notice in the `provider` block that we've added the `WEBHOOK_URL` environment variable under the `environment` section. This matches with our handler code, which required our Slack webhook URL in the environment. Make sure to update that value with your URL from setting up your webhook.

Let's deploy our service! Run `sls deploy` to send it to the cloud ⚡️:

<img width="565" alt="Serverless deploy" src="https://user-images.githubusercontent.com/6509926/32457263-211c686a-c2ee-11e7-96ae-17ce6261586d.png">

Serverless will print out a URL for your function to be accessed. Copy that URL as you will use it to configure your Github webhook.

# Setting up your Github webhook

We're ready for the last step -- creating the Github webhook to send to our function endpoint.

Navigate to a repository where you're an owner or an admin. Click "Settings" at the top, then the "Webhooks" tab on the left hand side. Then, click the "Add webhook button":

<img width="1027" alt="Create webhook" src="https://user-images.githubusercontent.com/6509926/32457444-c978b2f2-c2ee-11e7-9d5d-dd59ceee941d.png">

In the Add webhook screen, enter your function endpoint into the Payload URL input box and choose `application/json` as the Content Type:

<img width="735" alt="Webhook config" src="https://user-images.githubusercontent.com/6509926/32457548-2617c61a-c2ef-11e7-85b2-24e009eca1e0.png">

Then, go to the section to choose which events trigger the webhook. Click the "Let me select individual events" option, then choose the "Watch" event at the bottom of the list.

<img width="736" alt="Watch event" src="https://user-images.githubusercontent.com/6509926/32457623-5ff485da-c2ef-11e7-8dcd-7249d00d01d8.png">

Click the "Add webhook" button, and you're ready to go! Github will immediately send a test event to your endpoint. There will be a section showing "Recent Deliveries" and the status code, so you can see if you're having any failures. If you are, check the logs in your console with `sls logs -f stargazer` to find the errors.

# Conclusion

You did it! Quick and fun notifications of anytime a user stars your Github project.

If you want the code used in this application, check it out [here](https://github.com/alexdebrie/stargazer)

Check out the full range of [Github webhook events](https://developer.github.com/webhooks/#events) -- you can implement some really powerful workflows with webhooks + Serverless. Let us know what you build!
