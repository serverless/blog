---
title: CICD for Serverless Part 1 - Mocha Endpoint Testing
description: Part 1 of 2 on how to implement a CICD workflow for a Serverless project
date: 2017-02-17
thumbnail: https://cloud.githubusercontent.com/assets/20538501/23073708/05595248-f4fc-11e6-9a30-8e7ddaa16b56.png
category:
  - operations-and-observability
authors:
  - PeteJohnson
---

By day, I'm a Technical Solutions Architect at Cisco where I teach Cisco's vast ecosystem of partners to present the value of CloudCenter ([formerly CliQr](http://www.cisco.com/c/en/us/about/corporate-strategy-office/acquisitions/cliqr.html)). It's a Cloud Management Platform that uses abstraction on top of multiple IaaS APIs to enable a systems administrator to manage applications running on different clouds from a single pane of glass.

But since March of last year, [I've been using AWS Lambda on a personal project](https://fmlnerd.com/2016/08/16/30k-page-views-for-0-21-a-serverless-story/). I quickly became interested in what the good folks here at the Serverless Framework have been doing to similarly abstract details of different FaaS platforms to lower the learning curve and deployment overhead for developers.

In this 2-part series I'll demonstrate how it's possible for emerging FaaS technology to coexist with modern programming techniques like test-driven development (TDD) and Continuous Integration/Continuous Delivery (CICD). I'll show you how to perform automated endpoint testing using Mocha (this post) and a AWS CodePipeline CICD workflow (next post).

I'm kind of a web old timer. My first web application went into production in January of 1996. It was written in CGI-BIN Perl, only worked with a specific version of Mosaic, and used `<pre>` tags to space the page elements because the `<table>` tag wasn't part of the HTML specification yet.

As a web veteran, the current state of FaaS reminds me of other technology waves in that it shows great promise, but needs to change some minds before it can experience widespread adoption.

So when I met up with the Serverless Framework team in Las Vegas at their mixer during AWS re:Invent, among the things we talked about was the need for more complete examples. And how to demonstrate how this cutting edge technology can coexist with modern programming techniques like test-driven development (TDD) and Continuous Integration/Continuous Delivery (CICD).

[The team followed through with an excellent set of examples](https://github.com/serverless/examples) and [I riffed off one of them](https://github.com/nerdguru/serverlessTodos) to provide automated endpoint testing using Mocha (this post) and a AWS CodePipeline CICD workflow (next time).

**At a high level, the whole thing looks like this:**

![Serverless CICD Diagram](https://s3.amazonaws.com/analyzer.fmlnerd.com/img/ServerlessCICDmed.png)

## Automating API Gateway Endpoint Testing
Before the days of TDD there wasn't always a lot of agreement on when you were done with a particular coding task. So scope creep ruled the day. To prove to a wider set of developers that FaaS is ready for prime time, then, you need to be able to demonstrate that TDD is still possible with a more loosely related set of functions working together as opposed to a more monolithic set of application logic that is the norm now. As a first step, that's what I set out to do.

Feel free to try this yourself with the [Local Execution](https://github.com/nerdguru/serverlessTodos/blob/master/local.md) instructions on my GitHub repo, but the basic set up is as follows:

* Take [the todos example](https://github.com/serverless/examples/tree/master/aws-node-rest-api-with-dynamodb) (slightly altered) to deploy a set of Lambda functions behind AWS API Gateway
* Use the [Node.js simplified HTTP request client](https://www.npmjs.com/package/request) to interact with API Gateway endpoints
* Let [Mocha](https://mochajs.org/) automate the testing of those endpoints

What I appreciate most about the Serverless Framework is how much it lowers the learning curve on the deployment process involving multiple AWS services. [Take a look at the serverless.yml file I used](https://github.com/nerdguru/serverlessTodos/blob/master/serverless.yml) and compare that with the CloudFormation templates that get generated in your .serverless directory to see what I mean. It handles the mechanics for you nicely, allowing you to focus on adding your value.

In my case, that meant writing four Mocha tests that utilize the request client to initiate transactions with the API endpoints and check both the HTTP return codes and payloads for different combinations. There's an argument to be made for also utilizing Mocha to test the Lambda services directly in absence of API Gateway or even the business logic inside the Lambda functions independently. But for the sake of simplicity I stuck with the API endpoints.

When you deploy the service, set an environment variable containing the endpoint root, and then execute those tests, you get something like this:

```bash
> aws-rest-with-dynamodb@1.0.0 test /Users/petercjo/serverlessTodos
> mocha



  Create, Delete
    ✓ should create a new Todo, & delete it (1938ms)

  Create, List, Delete
    ✓ should create a new Todo, list it, & delete it (2859ms)

  Create, Read, Delete
    ✓ should create a new Todo, read it, & delete it (2663ms)

  Create, Update, Delete
    ✓ should create a new Todo, update it, verify the update, & delete it (2559ms)


  4 passing (10s)

```
This enables a team of developers all working on the same Serverless Framework project to deploy the service independently and run tests locally. Should those individuals then merge their code and perform pull requests on the master branch, those changes and tests could be integrated into a CICD workflow when bound for staging or production.  Speaking of . . .

## Next Time: CICD with AWS CodePipeline
Now that we have automated testing for our simple todos example, the next step would be to automate the whole toolchain in a CICD workflow.  In my case, I chose to do what with the newly announced AWS CodePipeline, which will look at the master branch of a repo on GitHub, download it when there has been a change and then execute a set of steps that causes the service to be deployed and tested.

We'll cover this in Part 2 coming next week.


