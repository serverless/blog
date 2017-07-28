---
title: Anatomy of a Serverless Application
description: A step-by-step look at the development of a serverless application. 
date: 2017-07-27
layout: Post
thumbnail: https://s3-us-west-2.amazonaws.com/assets.site.serverless.com/blog/small-thumb.jpg
authors:
  - RupakGanguly
---
 
We've all been new to serverless before. In this post, I'll walk you through how to get up and running on your first application. Let's cut through the docs, shall we?

This application will be a backend email service that can be called over HTTP from a simple frontend like `curl`. You will learn how to:

* Setup the development environment
* Create an application project 
* Create a serverless service using a boilerplate template
* Run and test the service locally
* Deploy the service
* Run the service via the public HTTP endpoint
* Perform basic validation and error handling

## Getting Started

I had been following serverless technologies for a while, and skimmed over the provider documentation and examples. It was really helpful to know the lay of the land and what was available out there. AWS Lambda's [getting started](http://docs.aws.amazon.com/lambda/latest/dg/getting-started.html) documentation was helpful but overwhelming, and it was tedious to use the AWS Console. I wanted to use my own development workflow - code using my favorite editor, build using an easy to use toolchain, do a test/debug cycle, and finally deploy.

I had to make some choices before I started development:

* **Programming language**: [NodeJS](https://nodejs.org/en/) (my familiarity, all serverless platforms support it)
* **Platform**: [AWS Lambda](https://aws.amazon.com/lambda/) (most popular and mature, lots of supporting services)
* **Toolset**: [Serverless Framework](https://serverless.com/framework/) (opensource, repo with 17K+ stars, actively maintained, 2 week release cadence)

## Setup

The intial setup was straightforward:

1. Install NodeJS: [download](https://nodejs.org/en/download/) or [using package manager](https://nodejs.org/en/download/package-manager/#osx)
2. Install the [Serverless Framework](https://serverless.com/framework/): `npm install -g serverless`
3. Setup an AWS account
    * [Sign up for AWS](http://docs.aws.amazon.com/lambda/latest/dg/setting-up.html#setting-up-signup)
    * [Create an IAM User](http://docs.aws.amazon.com/lambda/latest/dg/setting-up.html#setting-up-iam)
    * [Install and setup AWS CLI](http://docs.aws.amazon.com/lambda/latest/dg/setup-awscli.html)

The AWS setup is necessary so that we can deploy our serverless application on AWS Lambda. After creating the AWS IAM user,  we'll have to [configure the credentials](https://serverless.com/framework/docs/providers/aws/guide/credentials/) to give access to the Serverless Framework, for creating and managing resources on our behalf.

You can use either of the options to configure the credentials:

`aws configure` or `serverless config credentials`

> Setting up an account with AWS and configuring was the most time-consuming and painful process, but as you will see, it gets better after that. So keep chugging along.

## Creating the Project

A little bit of planning on the project structure makes a lot of difference in visualizing the different parts of the system. We will build an application named `postman`, with a simple frontend using `curl` and a backend serverless email service, to send out emails to users over HTTP.

Here is an example that works for me:

```bash
|-- postman
  |-- README.md
  |-- frontend
  `-- services
```
where,

  * `frontend` folder holds the frontend application
  * `services` folder holds the serverless service(s)

A structure like this provides clear separation for the non-serverless and serverless code for the overall application. The way the non-serverless portion of the application is written is totally your choice. In this post, I will primarily focus on the serverless portion of the application inside the `services` folder. We will not create a frontend application, so we don't need the `frontend` folder.

## Creating the Email Service

Let's create an email service that will send out emails to users with some text. We will use [Mailgun](https://www.mailgun.com/) as our email service provider, and shoot for making the email service generic enough to be reused across other applications.

### Starting With a Boilerplate Template

The Serverless Framework comes with boilerplate templates that make it really quick to get started. In our case, since we are using AWS as our provider and NodeJS as our language of choice, we will start with:

```bash
$ cd services
$ serverless create --template aws-nodejs --path email-service
```
which creates the service for us:

```bash
Serverless: Generating boilerplate...
Serverless: Generating boilerplate in "/home/svrless/apps/postman/services/email-service"
 _______                             __
|   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
|   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
|____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
|   |   |             The Serverless Application Framework
|       |                           serverless.com, v1.16.0
 -------'

Serverless: Successfully generated boilerplate for template: "aws-nodejs"
```

> Read the docs for more info. on [creating a service](https://serverless.com/framework/docs/providers/aws/guide/services#creation).

We will briefly look at the generated files and then modify them to suit our requirements.

```bash
|-- services
    `-- email-service
        |-- handler.js
        `-- serverless.yml
```
Let's look at the `serverless.yml` and the `handler.js` files. I have removed the commented lines for brevity and clarity. **Note**: I have updated the function and handler names, to suit the example.

```yml
# serverless.yml

service: email-service

provider:
  name: aws
  runtime: nodejs6.10
  
functions:
  send:
    handler: handler.sendEmail

```

The **serverless.yml** file describes the service and it's where you define your `provider` settings, `functions` with their corresponding handlers, `events` that trigger them, and provider `resources` needed by the service.

```js
# handler.js

'use strict';

module.exports.sendEmail = (event, context, callback) => {
  callback(null, { message: 'Go Serverless! Simulating sending emails successful.', event });
};
```
The **handler.js** file contains your function code. The function definition in `serverless.yml` will point to this `handler.js` file and the function defined here. **Note**: I have updated the handler name and the code within to suit our example.

```yml
# serverless.yml

...
functions:
  send:
    handler: handler.sendEmail
```

In our example, `handler: handler.sendEmail` in the `serverless.yml` file points to `module.exports.sendEmail` in the `handler.js` file.

Also, note that while the handler method defined in `handler.js` file is `sendEmail`, the function name defined in `serverless.yml` file is `send`. The `serverless.yml` file provides the glue for that mapping. 

### Invoke Locally

Let's run the `send` function locally:

```bash
$ cd services/email-service
$ serverless invoke local --function send
{
    "message": "Go Serverless! Simulating sending emails successful.",
    "event": ""
}
```
We have successfully run a serverless function locally. It is very important to be able to run a function locally while you are developing, so you can get quick feedback.

### Mapping an HTTP endpoint

To be able to share this service across other applications, it is important that our service can be accessed publicly. Let's map an HTTP endpoint to our function so that we can call our function publicly over the web. Again, the `serverless.yml` file provides the glue to that mapping.

```yml
# serverless.yml

service: email-service

provider:
  name: aws
  runtime: nodejs6.10
  
functions:
  send:
    handler: handler.sendEmail
    events:
      - http:
          path: email
          method: post
```

The `events` sub-section defines the mapping of the `send` function to the `http` endpoint of `email`, and defines it to be of type `post`.

> Read the docs for detailed info. on the [services](https://serverless.com/framework/docs/providers/aws/guide/services), [functions](https://serverless.com/framework/docs/providers/aws/guide/functions/), [events](https://serverless.com/framework/docs/providers/aws/guide/events/), and [resources](https://serverless.com/framework/docs/providers/aws/guide/resources/).


The current code as shown below, has a response which is not good for HTTP results:

```js
callback(null, { message: 'Go Serverless! Simulating sending emails successful.', event });
```

The [HTTP response](https://www.w3.org/Protocols/rfc2616/rfc2616-sec6.html) expects a shape that has a status code and a body attribute. So we will change the response shape to follow the HTTP convention.

Testing it locally shows the newly-updated response.

```bash
$ serverless invoke local --function send

{
    "statusCode": 200,
    "body": "{\"message\":\"Go Serverless! Simulating sending emails successful.\",\"input\":\"\"}"
}
```

### Deploy to AWS

Now, let's deploy it to AWS Lambda, so we can invoke the function over the HTTP endpoint we created. 

```bash
$ sls deploy
Serverless: Packaging service...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (336 B)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..............................
Serverless: Stack update finished...
Service Information
service: email-service
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  POST - https://xdsf3ghy2s.execute-api.us-east-1.amazonaws.com/dev/email
functions:
  send: email-service-dev-send
```

There is a lot going on behind the scenes, which the Serverless Framework does for you. `sls deploy` will deploy all functions in your service. If you are just iterating on a single function, you can use `sls deploy function --function send` to just deploy the named function.

> Read the docs for detailed info. on [deployment](https://serverless.com/framework/docs/providers/aws/guide/deploying/) of services.

Without going into the details of the deployment itself, let's first focus on the usability aspect of the service. The output above gives us the HTTP endpoint for our service.

```bash
endpoints:
  POST - https://smif3ghy1c.execute-api.us-east-1.amazonaws.com/dev/email
```
**Note**, A stage identifier `dev` has been added automatically to the endpoint and the function name. You can specify a `stage` section in `serverless.yml` but it uses `dev` by default in our case.

Let's test the deployed function by running it via `curl`:

```bash
curl -X POST https://smif3ghy1c.execute-api.us-east-1.amazonaws.com/dev/email -d '{}'
```
and we get the following response:

```json
{
   "message":"Go Serverless! Simulating sending emails successful.",
   "input":{
      "resource":"/email",
      "path":"/email",
      "httpMethod":"POST",
      "headers":{
         ...
         "Content-Type":"application/x-www-form-urlencoded",
         "Host":"smif3ghy1c.execute-api.us-east-1.amazonaws.com",
         ...
      },
      "queryStringParameters":null,
      "pathParameters":null,
      "stageVariables":null,
      "requestContext":{
         "path":"/dev/email",
         "stage":"dev",
         "requestId":"1234acaa-5dcd-11e7-afcd-43efe3598b81",
         "identity":{
            ...
            "cognitoIdentityPoolId":null,
            ...
         },
         "resourcePath":"/email",
         "httpMethod":"POST",
         "apiId":"smif3ghy1c"
      },
      "body":"{}",
      ...
   }
}
```

**Note**: For brevity, I left some important items in the output JSON and deleted the rest.

Another important aspect to note is the `event` structure coming back from AWS API Gateway in the `input` attribute of the output JSON, as shown above. We will use this `event` structure to simulate local testing in the upcoming sections.

So, we have come full circle - starting with some boilerplate code, customizing a function, adding an HTTP endpoint, testing it locally, deploying it to AWS and finally running it live using the HTTP endpoint.

To remove the service, you can simply do `sls remove`.

> **Takeaway**: We did all this without thinking about servers or infrastructure, or how we will deploy the service after we are done with development. It just happened as part of our development workflow. The developer just focused on coding their business requirements, experimenting with features, and getting a quick feedback cycle - without worrying about deployment or provisioning infrastructure. That is the power and essence of serverless development. 

### Implementing the Email Service

Let's implement the email functionality and finish up our email service. At the end of it, we will have a fully functional service that can send emails. 

#### Setting up Mailgun

We will use [Mailgun](https://www.mailgun.com/) as our backend email service provider. To use the service, [sign up for a free account](https://app.mailgun.com/new/signup/), retrieve the [API keys from the dashboard](https://mailgun.com/app/dashboard), and configure them as part of the service.

> Read the [Mailgun docs](https://documentation.mailgun.com/en/latest/), to get started on sending emails.

#### Configuring the Service

Let's go back to our handler method `sendEmails` in `handler.js` file and update it. We will use the Node.js module [mailgun_js](https://www.npmjs.com/package/mailgun-js) for sending emails using the Mailgun API. 

Let's add the dependency. **Note**: You can `npm init` and follow the prompts to create your initial `package.json` file.

```bash
npm install mailgun-js --save
```

We should have:

```json
{
  ...
    "dependencies": {
    "mailgun-js": "^0.11.2"
  }
}
```

We need a place to store our configuration settings that the service can use. We will use a JSON formatted config file to stash our settings. The idea is to have one config file per stage of deployment i.e. dev, test, prod etc. Here is the `config.prod.example.json` file with some settings. Rename the file to `config.prod.json` and supply the values.

```json
# config.prod.example.json

{
  "region": "us-east-1",
  "MAILGUN_APIKEY": "your-mailgun-key-here",
  "MAILGUN_DOMAIN": "your-mailgun-domain-here"
}

```

**Note:** Make sure that you **DON'T** check-in the `config.prod.json` config file with your secrets into source control.

Let's look at some updates to the configuration settings in the `serverless.yml` file. 

- add `custom` section for custom settings
- add `environment` section to add the Mailgun settings
- update the `provider` section to add a stage and a region

```yml
...
custom:
  defaultStage: prod
  currentStage: ${opt:stage, self:custom.defaultStage}
  currentRegion: ${file(./config.${self:custom.currentStage}.json):region}
  
provider:
  ...
  stage: ${self:custom.currentStage}
  region: ${self:custom.currentRegion}
  environment:
    MAILGUN_APIKEY: ${file(./config.${self:custom.currentStage}.json):MAILGUN_APIKEY}
    MAILGUN_DOMAIN: ${file(./config.${self:custom.currentStage}.json):MAILGUN_DOMAIN}
...
```

One thing to note here, is the use of `${file(./config.${self:custom.currentStage}` to read the correct config file based on the value of `currentStage` which in turn is defined in the `custom` section. So just by changing the value of the `currentStage` and providing a config file named `config.<stage>.json`, you can have multiple configurations per stage of deployment.

#### Sending Emails

With the configuration out of the way, we can now focus on the actual code to send emails via Mailgun.

```js
'use strict';

const MAILGUN_APIKEY   = process.env.MAILGUN_APIKEY
const MAILGUN_DOMAIN   = process.env.MAILGUN_DOMAIN

const mailgun = require('mailgun-js')({
  apiKey: MAILGUN_APIKEY,
  domain: MAILGUN_DOMAIN
});
```

First, we initialize the `mailgun-js` module with the API key and domain, retrieving the appropriate values from the process' `env` space.

```js
const fromAddress    = `<demo@MAILGUN_DOMAIN>`;
const subjectText    = "Serverless Email Demo";
const messageText    = 'Sample email sent from Serverless Email Demo.';
const messageHtml    = `
<html>
  <title>Serverless Email Demo</title>
  <body>
    <div>
      <h1>Serverless Email Demo</h1>
      <span>Sample email sent from Serverless Email Demo.</span>
    </div>
  </body>
</html>
`
```
Then, we define some constants, text and HTML content that will form the body of the email.

```js
module.exports.sendEmail = (event, context, callback) => {

  var toAddress = "";
  if (event.body) {
    try {
      toAddress = JSON.parse(event.body).to_address || "";
    }
    catch (e){}
  }

  if (toAddress !== "") {

    const emailData = {
        from: fromAddress,
        to: toAddress,
        subject: subjectText,
        text: messageText,
        html: messageHtml
    };

    // send email
    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        // log error response
        console.log(error);
        callback(error);
      } else {
        const response = {
          statusCode: 202,
          body: JSON.stringify({
            message: "Request to send email is successful.",
            input: body,
          }),
        };
        console.log(response);
        callback(null, response);
      }
    });
  } else {
    const err = {
      statusCode: 422,
      body: JSON.stringify({
        message: "Bad input data or missing email address.",
        input: event.body,
      }),
    };
    // log error response
    console.log(err);
    callback(null, err);
  }
};
``` 

First, we define the handler method `sendEmail` that is mapped to the function `send` in the `serverless.yml` file. This method does some basic validation and then calls the `mailgun.messages().send()` API method passing in the required data via the `emailData` structure. 

We define some basic error handling code block, and if there is no error, it returns an appropriate response back. In case of an error, an appropriate error response is returned.

Note that the `event.body` holds the input data that is passed in by the caller.

#### Testing Locally

Before we deploy our function, let's test it locally first. 

To make it easier to test, let's create a data file `send-email-data.json` that mocks the `event` data structure passed in by the API Gateway:

```json
{
  "resource":"/email",
  "path":"/email",
  "httpMethod":"POST",
  "headers":{},
  "queryStringParameters":null,
  "pathParameters":null,
  "stageVariables":null,
  "requestContext":{
     "path":"/prod/email",
     "stage":"prod",
     "requestId":"123",
     "resourcePath":"/email",
     "httpMethod":"POST"
  },
  "body":"{\"to_address\":\"your@email.com\"}",
  "isBase64Encoded":false
}
```
Although we have a lot of attributes in the mocked data structure, the bare minimum attribute we need to make it work is the `body` attribute with its value.

```bash
$ sls invoke local --function send -p send-email-data.json

{
    "statusCode": 202,
    "body": "{\"message\":\"Request to send email is successful.\",\"input\":{\"id\":\"<20170721005146.92353.69A8F3012CBF231A@yourdomain.mailgun.org>\",\"message\":\"Queued. Thank you.\"}}"
}
```

Note, that we pass the mock `event` structure in the `send-email-data.json` file via the `-p` flag. The `event` structure contains the email address required by our function in the `body` attribute.  

And, now you should have an email in your inbox:

```
From: demo@mailgun_domain
Date: July 3, 2017 at 7:02:07 PM EDT
To: your@email.com
Subject: Serverless Email Demo

Serverless Email Demo

Sample email sent from Serverless Email Demo.
```

Alternatively, if we test for the not-so-happy path, i.e. calling without passing in an email address, we get our desired error message:

```bash
$ sls invoke local --function send

{
    "statusCode": 422,
    "body": "{\"message\":\"Bad input data or missing email address.\"}"
}
```

## Deploying the Email Service

Now that we feel we have the functionality working well, let's deploy the service.

```bash
$ sls deploy

Serverless: Packaging service...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (2.03 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
...............................
Serverless: Stack update finished...
Service Information
service: email-service
stage: prod
region: us-east-1
api keys:
  None
endpoints:
  POST - https://yt1i5ydiu4.execute-api.us-east-1.amazonaws.com/prod/email
functions:
  send: email-service-prod-send
```
Note, that the stage used is `prod` and it is reflected in the function name `email-service-prod-send`, and the resulting endpoint.

### Calling the Service

Let's call the live function that has been deployed to AWS. We will explore the `--log` flag that will output logging information about our invocation.

```bash
$ sls invoke --function send -p send-email-data.json --log

{
    "statusCode": 202,
    "body": "{\"message\":\"Request to send email is successful.\",\"input\":{\"id\":\"<20170721005341.92497.BF1D6AF2BA38787B@yourdomain.mailgun.org>\",\"message\":\"Queued. Thank you.\"}}"
}
--------------------------------------------------------------------
START RequestId: 09bd13cd-6daf-11e7-87e0-e9f5c3dd5058 Version: $LATEST
2017-07-21 00:53:41.960 (+00:00)	09bd13cd-6daf-11e7-87e0-e9f5c3dd5058	{ statusCode: 202,
  body: '{"message":"Request to send email is successful.","input":{"id":"<20170721005341.92497.BF1D6AF2BA38787B@yourdomain.mailgun.org>","message":"Queued. Thank you."}}' }
END RequestId: 09bd13cd-6daf-11e7-87e0-e9f5c3dd5058
REPORT RequestId: 09bd13cd-6daf-11e7-87e0-e9f5c3dd5058	Duration: 439.95 ms	Billed Duration: 500 ms 	Memory Size: 1024 MB	Max Memory Used: 38 MB
```

The email is successfully sent.

Since the deployment output also shows the HTTP endpoint for our email service, we can use `curl` to call that endpoint, passing it an email address.

```bash
$ curl -X POST https://yt1i5ydiu4.execute-api.us-east-1.amazonaws.com/prod/email -d '{"to_address":"your@email.com"}'

HTTP/1.1 202 Accepted
...
...

{"message":"Request to send email is successful.","input":{"id":"<20170721005711.6305.4865866169A6F957@sandbox77a6b258412d4bb9a2d12abeb33ac01e.mailgun.org>","message":"Queued. Thank you."}}
```

Again, another email is successfully sent.

### Error Handling

To have our code gracefully handle errors and bad input, I have added some validation checks. The code makes sure that if bad input data is passed in, the function returns an error even before calling the `mailgun` API method. That means quicker response times with potential cost gains at the Mailgun API side. Let's try out some error edge cases and see the results:

**No Data**

```bash
$ curl -i -X POST https://yt1i5ydiu4.execute-api.us-east-1.amazonaws.com/prod/email

{"message":"Bad input data or missing email address.","input":null}
```

**Bad Data**

```bash
$ curl -i -X POST -d '{"to_address":""}' https://yt1i5ydiu4.execute-api.us-east-1.amazonaws.com/prod/email

{"message":"Bad input data or missing email address.","input":"{\"to_address\":\"\"}"}
```

**Note**: Testing with bad input data `-d '{}'` or `-d '{"junk"}'`, results in the same output.

**Malformed Email Address**

```bash
$ curl -i -X POST -d '{"to_address":"junk"}' https://yt1i5ydiu4.execute-api.us-east-1.amazonaws.com/prod/email

{"message": "Internal server error"}
```

`curl` kind of barfs, as the function causes an exception in this case. We can see the exception if we call the function with the framework:

```bash
$ sls invoke --function send --data '{"body":"{\"to_address\":\"junk\"}"}' --log

{
    "errorMessage": "'to' parameter is not a valid address. please check documentation",
    "errorType": "Error",
    "stackTrace": [
        ...
    ]
}
--------------------------------------------------------------------
START RequestId: 0eb38aeb-6d9d-11e7-9787-2996c7e3fdb0 Version: $LATEST
2017-07-20 22:44:58.544 (+00:00)	0eb38aeb-6d9d-11e7-9787-2996c7e3fdb0	{ Error: 'to' parameter is not a valid address. please check documentation
...
...
2017-07-20 22:44:58.545 (+00:00)	0eb38aeb-6d9d-11e7-9787-2996c7e3fdb0	{"errorMessage":"'to' parameter is not a valid address. please check documentation","errorType":"Error","stackTrace":
...
...
END RequestId: 0eb38aeb-6d9d-11e7-9787-2996c7e3fdb0
REPORT RequestId: 0eb38aeb-6d9d-11e7-9787-2996c7e3fdb0	Duration: 339.84 ms	Billed Duration: 400 ms 	Memory Size: 1024 MB	Max Memory Used: 41 MB

```

**Note**: We have been passing in data via the `-p` flag in our previous examples but you can also pass in data using the `--data` flag. 

Leaving an exception unhandled is not acceptable, so let's refactor the code to return a proper HTTP response.

```js
    ...
    mailgun.messages().send(emailData, (error, body) => {
      if (error) {
        // log error response
        // console.log(error);
        // callback(error);
        const response = {
          statusCode: 400,
          body: JSON.stringify({
            message: error,
            input: body,
          }),
        };
        callback(null, response);
      } else {
        ...
```
Now, when we deploy the function and call it, we get a better response.

```bash
curl -i -X POST -d '{"to_address":"junk"}' https://yt9i5yniu3.execute-api.us-east-1.amazonaws.com/prod/email

HTTP/1.1 400 Bad Request
Content-Type: application/json
Content-Length: 118
...
...

{"message":{"statusCode":400},"input":{"message":"'to' parameter is not a valid address. please check documentation"}}
```

This concludes the development of the application.

> Code: Get the [full source code](https://github.com/rupakg/postman) to the application project on Github.

## Summary

We explored the path to creating a serverless application from scratch, starting with a boiler plate template. We then customized the code, tested the code locally, and deployed it to AWS Lambda. Finally, we accessed the public function via the HTTP endpoint, and also looked at some error conditions and use cases. At the end of it all, we created a fully functional serverless backed email service that sent out emails via the Mailgun email service provider.
