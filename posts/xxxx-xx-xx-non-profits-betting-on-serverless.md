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

## Background

Gamechanger Labs has grown up over the last few decades from youth organizing to being a concierge platform for major donors. In the half a year the scrappy little non-profit comprised mainly of part-time contractors and volunteers has raised millions of dollars and dispered them to nearly 100 different local grassroots organizations.

The bad news is that spike in attention was overwhelming the EC2 (free-teir tiny) Nodejs-React site that was collecting donations. The little site that could: couldn't. Too much of the energy of the tech folks was focused things like [chasing memory leaks in expressjs](https://github.com/expressjs/express/issues/2997) and generally just keeping the site from crashing. 

The site's content lives in a headless Wordpress installation where the admins and editors use the Wordpress admin app and plugins to edit the site. We use that WP installation to emits a [JSON RPC API](https://github.com/Movement-2016/movement2016-wp/blob/master/wp-content/themes/movement-admin-theme/inc/movement-json.php) that we use to populate the website. As thin as our React app was, it wasn't thin enough.

## Foreground

Taking a step back it was obvious that the website didn't really do any computing at all. The site is a single-page app with five static pages and a set of services (e.g. contacting staff and managing donations plans) that had very little to do with the webpages itself.

The highly componentized architecture of the AWS universe meant that we could migrate the server side functions and a completely static website in an S3 bucket one piece at a time. There was a period when I was tearing off AWS services and bolting them on to our environement and that was great.

The goal was to move the [server side functionality](https://github.com/Movement-2016/concierge/blob/master/src/server/api.js#L18) running on EC2 completely into Lambda and make that move completely transparent to the React code in the browser.

The mantra of the project became "this should be easier." However, I hit a wall when it came to AWS Lambda. The service itself is relatively easy to understand conceptually but one look behind the scenes of Serverless Framework is actually doing and it's obvious there are many 1000s of man hours involved in creating a seamless development environment that we didn't have time to invest.

### Server Computing

The server functions were moved into a new Git project called [bellman](https://github.com/Movement-2016/bellman) grouped by API each with their own `serverless.yml` configuration.

```
  src/
    |- contact
        |-serverless.yml
        |-handler.js
    |- users
        |-serverless.yml
        |-handler.js
```
Some of our services are CRUD, some are just straight up RPC APIs. For all cases I created a base class to encapsulate and normalize some of the more arcane AWS structures and methods called [LambdaFunc](https://github.com/Movement-2016/bellman/blob/master/src/lib/LambdaFunc.js). 

The stunning thing was how much of the previous code was plumbing versus functionality. When I started migrating from the http server Expressjs environment to Lambda the code shrunk an order of magnatude. Here's how I encapsulated the 'contact' form hander:
```js
/* src/contact/handler.js */
import LamdaFunc from '../lib/LambdaFunc';
import mailer    from '../lib/email';
import templates  from './templates';

class ContactEmail extends LamdaFunc {

  perform() {

    const body      = this.body;
    const { email } = body;
    const subject   = 'New contact form submission from ' + email;

    return mailer( { body: templates.contact(body), subject })
            .then( this.thenHandler )
            .catch( this.errorHandler );
  }
}
```
Exporting the method is encapulated in a property
```js
module.exports = {
  contact: (new ContactEmail()).handler
};

```
For CRUD APIs I created a [RESTService class](https://github.com/Movement-2016/bellman/blob/master/src/lib/RESTService.js) that also encapsulates boilerplate DynamoDB access to the point where you don't even have to code the methods. By passing the name of the DynamoDB table in the environment:
```yml
service: users

custom: 
  stage: "${opt:stage, self:provider.stage}"
  tableName: ${self:service}-${self:custom.stage}
resources:  
  Resources:
    restTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: ${self:custom.tableName}
        AttributeDefinitions:
          - AttributeName: email
            AttributeType: S  
```
The default REST code reduces to almost none (this is the *entire* code for the handler):
```js
/* src/users/handler.js */
import Service from '../lib/RESTService';

class UserTableFunc extends Service {

  get Key() {
    const { email = null } = this.params;
    return { email };
  }

}

module.exports = (new UserTableFunc()).exports;
```
### Client SDK

It is important to encapsulate the API for browser consumers so that when you install the `bellman` package it is very OOP/API-like. For that I generated the AWS SDK but then dolled it up so it looks like the API, not a generic catch-all. Here's a hint: if the process to generate the client is 100% automated, it will feel like that to the caller. Instead, I chose a system that is mostly automated but needs a little guidance. For that there's a [client side helper class](https://github.com/Movement-2016/bellman/blob/master/clients/lib/Client.js) for all cases and a specialized derivation for [REST/CRUD APIs](https://github.com/Movement-2016/bellman/blob/master/clients/lib/Service.js).

For custom APIs you have to manually create the end point class with the shape of the API:
```js
import Client from '../lib/Client';

class EmailClient extends Client {

  contact() {
    return this._post('contact',...arguments);
  }

  party() {
    return this._post('party',...arguments);
  }
```
The piece to the client SDK is a rathy funky [build-time script](https://github.com/Movement-2016/bellman/blob/master/bin/genclients.js) that extracts the API endpoint for both stages and creates an exports that encapsulates the endpoint into the client class:
```js
/* generated by build */
var a = require('./lib/Service');
var b = require('./email');

module.exports = {
  prod: {
    users:  cfg => new a({...cfg,endpoint:'https://xxxxhtuk84.execute-api.us-west-2.amazonaws.com/prod',slug:'users'}),
    email:  cfg => new b({...cfg,endpoint:'https://xxxxc17imc.execute-api.us-west-2.amazonaws.com/prod',slug:'email'}),
   },
  dev: {
    users:  cfg => new a({...cfg,endpoint:'https://xxx9e9xf9.execute-api.us-west-2.amazonaws.com/dev',slug:'users'}),
    email:  cfg => new b({...cfg,endpoint:'https://xxx2tv0ka.execute-api.us-west-2.amazonaws.com/dev',slug:'email'})}};
```
This then allows for a 'natural' interface in the browser:
```js
import bellman from 'bellman';

const authorizationStuff = {
  sessionId,
  ...
  };
  
 const users = bellman.prod.users(authorizationStuff);
 
 users.list().then( users => users.forEach( ... ) );
 ```
 ### Static Site
Having moved our server code into Lambda, it was now possible to serve our website from a static S3 bucket. What I learned in this migration however is that AWS CodeBuild deploys to a directory off of the root of your bucket but the Web hosting feature of S3 wants your `index.html` file to be at the root. There may be a way around this as well as the fact that CodeBuild leaves the files encrypted and the Web hoster wants the files to be public and unencrypted - but I couldn't figure out a way to handle that - until I wrote a couple of lines of script and pushed it [into our API project](https://github.com/Movement-2016/bellman/tree/master/src/deploy) that gets triggered from the AWS CloudWatch event after the CodeBuild project is finalized.

### Conclusion
On paper this setup seems like it will be a huge savings for the org in the future but we won't know until we've traversed another event that inspires folks to open their checkbooks. Either way none of this, not one piece of it, would have been possible without a tool like Serverless to glide us into the future.
 
