---
title: Creating, monitoring, and testing cron jobs on AWS
description: "In this article we walk you through how to create a cron job on AWS using AWS Lambda and Serverless Framework and how to get the right alerts and security measures in place."
date: 2019-10-23
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cron-jobs-on-aws/cron-jobs-on-aws-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cron-jobs-on-aws/cron-jobs-on-aws-header.png"
authors:
  - GarethMcCumskey
category:
  - guides-and-tutorials
---

Cron jobs are everywhere—from scripts that run your data pipelines to automated cleanup of your development machine, from cleaning up unused resources in the cloud to sending email notifications. These tasks tend to happen unnoticed in the background. And in any business, there are bound to be many tasks that *could* be cron jobs but are instead processes run manually or as part of an unrelated application.

Many companies want to take control of their cron jobs: to manage costs, to make sure the jobs are maintainable and the infrastructure running them is up to date, and to share the knowledge about how the jobs run. For those already bringing the rest of their infrastructure to Amazon’s public cloud, running cron jobs in AWS is an obvious choice. 

If you are a developer using AWS, and you’d like to bring your cron jobs over to AWS, there are two main options: use an EC2 machine—spin up a VM and configure cron jobs to run on it; or use AWS Lambda—a serverless computing service that abstracts away machine management and provides a simple interface for task automation.

On the face of it, EC2 might seem like the right choice to run cron jobs, but over time you’ll find yourself starting to run into the following issues:

1. Most cron jobs don’t need to be run every second, nor even every hour. This means that the EC2 machine reserved for the cron jobs is idle at least 90% of the time, not to mention that its resources aren’t being used efficiently.
2. The machine running the cron jobs will of course require regular updates, and there must be a mechanism in place to handle that, whether it’s a Terraform description of the instance or a Chef cookbook.
3. Did the cron job run last night? Did the average run time change in the last few weeks? Answering these and other questions will require adding more code to your cron job, which can be hard to do if your cron job is a simple Bash script.

AWS Lambda addresses all of these issues. With its pay-per-use model, you only pay for the compute time used by your Lambda applications. For short-lived tasks, this can generate significant savings. When deploying Lambda with Serverless Framework, the description of all the infrastructure to which the function connects resides in the same repository as the application code. In addition, you get metrics, anomaly detection, and easy-to-use secrets management right out of the box.

In this article we'll walk you through how to create a cron job on AWS using AWS Lambda and Serverless Framework, how to get the right alerts and security measures in place, and how to scale your cron jobs as needed. Take a look at [our example repo for this article on GitHub](https://github.com/chief-wizard/serverless-cron-job-example) if you’d like to follow along. Let’s dive in!

### Creating a cron job with AWS Lambda

In this example we’ll walk through a cron job that performs database rollovers. Our use case: we want to archive the past week’s data from a production database in order to keep the database small while still keeping its data accessible. We start by defining all the details of our cron job application in the `serverless.yml` file in the root of our repository:

```yaml
    # serverless.yml
    service: week-cron

    provider:
      name: aws
      runtime: nodejs8.10
      region: 'us-east-1'
      frameworkVersion: ">=1.43.0"
      timeout: 900 # in seconds
    ...
```

Our function needs to connect to our production database, so we supply the secrets we need for that database via environment variables:

```yaml
    # serverless.yml
    ...
      environment:
        DB_HOST: ${file(./secrets.json):DB_HOST}
        DB_USER: ${file(./secrets.json):DB_USER}
        DB_PASS: ${file(./secrets.json):DB_PASS}
        DB_NAME: ${file(./secrets.json):DB_NAME}
    ...
```

We then add the description of our function. We want it to have a single function called `transfer` which performs the database rollover. We want the `transfer` function to run automatically every week at a time when the load for our application is the lowest, say around 3am on Mondays:

```yaml
    # serverless.yml
        ...
    functions:
        transfer:
        handler: handler.transfer
        events:
            # every Monday at 03:15 AM
            - schedule: cron(15 3 ? * MON *)
```

#### Syntax for the Schedule expressions

In our example above, the `transfer` handler gets run on a schedule specified in the `events` block, in this case via the `schedule` event. The syntax for the `schedule` event can be of two types: 

- `rate` — with this syntax you specify the rate at which your function should be triggered.

The `schedule` event using the `rate` syntax must specify the rate as `rate(value unit)`. The supported units are `minute`/`minutes`, `hour`/`hours` and `day`/`days`. If the value is 1 then the singular form of the unit should be used, otherwise you’ll need to use the plural form. For example:

```text
          - schedule: rate(15 minutes)
          - schedule: rate(1 hour)
          - schedule: rate(2 days)
```

- `cron` — this option is for specifying a more complex schedule using the Linux `crontab` syntax.

The `cron` schedule events use the syntax `cron(minute hour day-of-month month day-of-week year)`.  You can specify multiple values for each unit separated by a comma, and a number of wildcards are available. See [the AWS Schedule Expressions docs page](https://docs.aws.amazon.com/AmazonCloudWatch/latest/events/ScheduledEvents.html) for the full list of supported wildcards restrictions on using multiple wildcards together.

These are valid `schedule` events:

```text
    # the example from our serverless.yml that runs every Monday at 03:15AM UTC
    - schedule: cron(15 3 ? * MON *)
    # run in 10-minute increments from the start of the hour on all working days
    - schedule: cron(1/10 * ? * W *)
    # run every day at 6:00PM UTC
    - schedule: cron(0 18 * * ? *)
```

You can specify multiple schedule events for each function in case you’d like to combine the schedules. It’s possible to combine `rate` and `cron` events on the same function, too.

#### Business logic for transferring database records

At this point, the description of the function is complete. The next step is to add code to the  `transfer` handler. The `handler.js` file defining the handlers is quite short:

```javascript
    // handler.js
    exports.transfer = require("./service/transfer_data").func;
```

The actual application logic lives in the `service/transfer_data.js` file.  Let’s take a look at that file next.

The task that we want our application to accomplish is a database rollover. When it runs, the application goes through three steps:

1. Ensures all the necessary database tables are created.
2. Transfers data from the production table to a “monthly” table.
3. Cleans up the data that has been transferred from the production table.

We assume that no records with past dates can be added in the present, and that creating additional load on the production database is fine.

We start by referencing the helper functions for each of the three tasks we defined above and initializing the utilities for date operations and database access:

```javascript
    // service/transfer_data.js
    var monthTable = require('../database/create_month_table')
    var transferData = require('../database/transfer_data')
    var cleanupData = require('../database/cleanup_data')
    var dateUtil = require('../utils/date')
    const Client = require('serverless-mysql')
```

The function code is quite straightforward: ensure the tables exist, transfer the data, delete the data, and log all the actions that are happening. The simplified version is below:

```javascript
    // service/transfer_data.js
    exports.func = async () => {
        var client = Client({
            config: {
              ...
            }
        })
        var weeknumber = dateUtil.getWeekNumber(new Date())
        var currentWeek = weeknumber[1];
        var currentYear = weeknumber[0];
        try {
            await monthTable.create(client, currentWeek, currentYear)
            await transferData.transfer(client, currentWeek, currentYear)
            await cleanupData.cleanup(client, currentWeek, currentYear)
            } catch (error) {
            if (error.sqlMessage) {
                // handle SQL errors
            } else {
                // handle other errors
            }
        }
        client.quit()
        return "success";
    }
```

You can find the full version of the file [in our GitHub repository](https://github.com/chief-wizard/serverless-cron-job-example/blob/master/service/transfer_data.js).

The helper function for creating the monthly table exports a single `create` function that essentially consists of a SQL query:

```javascript
    // database/create_month_table.js
    exports.create = async (client, week, year) => {
        await client.query(`
        CREATE TABLE IF NOT EXISTS weather_${year}_${week}
        (
            id MEDIUMINT UNSIGNED not null AUTO_INCREMENT, 
            date TIMESTAMP,
            city varchar(100) not null, 
            temperature int not null, 
            PRIMARY KEY (id)
        );  
        `)
    }
```

The `transfer_data` helper is similar in structure with its own SQL query:

```javascript
    // database/transfer_data.js
    exports.transfer = async (client, week, year) => {
        var anyId = await client.query(`select id from weather where YEAR(date)=? and WEEK(date)=?`, [year, week])
        if (anyId.length == 0) {
            console.log(`records does not exists for year = ${year} and week = ${week}`)
            return
        }
        await client.query(`
        INSERT INTO weather_${year}_${week}
        (date, city, temperature)
        select date, city, temperature 
        from weather
        where YEAR(date)=? and WEEK(date)=? 
        `, [year, week])
    }
```

And finally, the cleanup of the data in the `cleanup` helper looks like this:

```javascript
    // database/cleanup_data.js
    exports.cleanup = async (client, week, year) => {
        var anyId = await client.query(`select id from weather where YEAR(date)=? and WEEK(date)=?`, [year, week])
        if (anyId.length == 0) {
            console.log(`cleanup did't needed, because does not exists records for year = ${year} and week = ${week}`)
            return
        }
        anyId = await client.query(`select id from weather_${year}_${week} limit 1`, [year, week])
        if (anyId.length == 0) {
            throw Error(`cleanup can't finished, because records are not transfered for year = ${year} and week = ${week} in`)
        }
        await client.query(`
        delete
        from weather 
        where YEAR(date)=? and WEEK(date)=? 
        `, [year, week])
    }
```

With this, the core business logic is done. We also add a number of unit tests for the business logic that can be found [in the](https://github.com/chief-wizard/serverless-cron-job-example/blob/master/test/database_transfer_test.js) `[test](https://github.com/chief-wizard/serverless-cron-job-example/blob/master/test/database_transfer_test.js)` [directory](https://github.com/chief-wizard/serverless-cron-job-example/blob/master/test/database_transfer_test.js) in our repo.

The next step is to deploy our cron job.

#### Deploying our cron job to AWS

Both the application code and the `serverless.yml` file are now set up. The remaining steps to deploy our cron job are as follows:

- Install the Serverless Framework.
- Install the required dependencies.
- Run the deployment step.

To install Serverless Framework, we run:

```bash
    $ npm install -g serverless
```

To install our application’s dependencies, we run:

```bash
    $ npm install
```

in the project directory.

We now have two options for how to run the deployment step. One option involves setting up AWS credentials on your local machine, and the other is to set up the AWS credentials in the Serverless Dashboard without giving your local machine direct access to AWS.

**Option 1:** **Use AWS credentials on the development machine**
This option works well if you have only one person deploying a sample cron job, or if the developers on your team already have access to the relevant AWS production account. We don’t recommend this option for larger teams and production applications. Follow these steps:

1. Make sure that the AWS CLI is installed locally. Try running `aws --version`, and if the CLI is not yet installed, run `pip install awscli`.
2. Configure the AWS credentials for the AWS CLI by running `aws configure`.
3. Once the credentials are set up, run `serverless deploy` to deploy the cron job.

**Option 2:** **Use the Serverless Dashboard to generate single-use AWS credentials for each deploy**
We recommend this option for teams with multiple developers. With this setup, you grant the Serverless Dashboard a set of AWS permissions, and for each deploy the Serverless Framework will generate a single-use credential with limited permissions to deploy your cron job.

Before deploying, if you don’t yet have an account, sign up for [the Serverless Dashboard](https://serverless.com). Once your account is set up, create a new application using the *Add* button:

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cron-jobs-on-aws/serverless-aws-cron-applications.png)

To make sure Serverless Framework knows which application to associate with our cron job, we add the `tenant` and `app` attributes to the `serverless.yml` file at the root level. You will need to replace the values shown here with the ones from your Serverless account:

```yaml
    # serverless.yml

    # our Serverless Dashboard account name
    tenant: chiefwizard
    # our Serverless Dashboard application name
    app: cron-database-rollover
```

After that, the steps to deploy are:

1. In the Dashboard, navigate to Profiles → Create or choose a profile → AWS credential access role.
2. Select *Personal AWS Account* and specify the IAM role you’d like to use for deployment. If the role doesn’t exist yet, click the *Create a role* link to create it.
3. Click *Save and Exit.*
![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cron-jobs-on-aws/aws-profiles-setup.png)

4. Run `serverless login` in the console on your local machine and log in with your Serverless Dashboard credentials.
5. Run `serverless deploy` without configuring the production AWS account on your machine.

Done! The cron job is deployed and will run on the schedule that we configured in the `serverless.yml` file.

Check out [this YouTube video](https://www.youtube.com/watch?v=KTsWDCXvxqU) where we walk through the deployment process live.

#### Setting up monitoring for your cron job

When you deploy via the Serverless Dashboard (our recommended approach), the monitoring is already set up once the cron job is deployed. On the Applications page, we click through to the deployment we just ran:

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cron-jobs-on-aws/aws-database-cron.png)

On the deployment page, when we go to the Overview section we see the list of alerts and a graph of function invocations and errors:

![](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/cron-jobs-on-aws/aws-cron-job-alerts.png)

It’s currently empty, but more information will appear as the cron job starts being invoked. On the Alerts tab, any alerts relevant to your cron job will be displayed. That’s it! No extra work needed to set up monitoring and alerting.

Deploying via the Serverless Dashboard also allows you to use the Dashboard to look through recent invocations of your function (to be found in the Invocations Explorer tab), list all the deployments of your service, and more.

#### Writing and running tests for your cron job

To increase confidence in our cron job’s code, we’ll create a few unit tests to cover the main parts of our database rollover logic in the `test/database_transfer_test.js` file.

We start by requiring all of our helper files and setting up the test data:

```javascript
    // test/database_transfer_test.js
    var assert = require('assert');
    var fs = require("fs")
    var dateUtil = require('../utils/date')
    var monthTable = require('../database/create_month_table')
    var transferData = require('../database/transfer_data')
    var cleanupData = require('../database/cleanup_data')
    var init = require('../database/init_data')
    const Client = require('serverless-mysql')
    const secrets = JSON.parse(fs.readFileSync("secrets.json"));

    describe('Transfer test', function () {
        // initialize the database client
        var client = Client({
            config: {
              ...
            }
        })
        // set up the test vars
        ...
```

Within the `describe` block, we add individual tests for our business logic. For example, in this snippet we test the `monthTable.create` helper function:

```javascript
    // test/database_transfer_test.js
    ...
        describe('#monthTable.create(client, week, year)', function () {
            it('exists new table for week = 33 and year = 2018', async function () {
                await client.query(`drop table if exists weather_${year}_${week}`)
                await monthTable.create(client, week, year)
                var anyId = await client.query(`SELECT table_schema db,table_name tb  FROM information_schema.TABLES
                where table_name='weather_${year}_${week}'`)
                assert.equal(anyId.length, 1);
            });
        });
    ...
```

We continue in this fashion until all key pieces of our cron job are covered by unit tests (or, if you prefer, integration tests). See all the tests [in our example repo](https://github.com/chief-wizard/serverless-cron-job-example/blob/master/test/database_transfer_test.js).

To run the tests, we need to make sure we have a MySQL instance running locally. If you need to install MySQL, pick a method that works for your [from the MySQL Community Downloads page](https://dev.mysql.com/downloads/).

On our Mac, we’ve installed MySQL using Homebrew, and to start it we run:

```bash
    $ brew services start mysql
    ==> Successfully started `mysql` (label: homebrew.mxcl.mysql)
```

To create the test database, we connect to MySQL via the CLI:

```bash
    $ mysql -uroot
    Welcome to the MySQL monitor.  Commands end with ; or \g.
    Your MySQL connection id is 3
    Server version: 5.7.16 Homebrew

    Copyright (c) 2000, 2016, Oracle and/or its affiliates. All rights reserved.

    Oracle is a registered trademark of Oracle Corporation and/or its
    affiliates. Other names may be trademarks of their respective
    owners.

    Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

    mysql> create database testdb;
    Query OK, 1 row affected (0.00 sec)

    mysql> ^DBye
```

In our `secrets.json` file, we set up the local credentials for the MySQL database:

```json
    # secrets.json
    {
      "DB_HOST": "127.0.0.1",
      "DB_USER": "root",
      "DB_PASS": "",
      "DB_NAME": "testdb"
    }
```

**Note:** by default, MySQL root password is empty. Please consider changing the password to something more secure and make sure that you’re not exposing the database outside of your local development environment.

With the credentials configured, we can now run the tests:

```bash
    npm test

    > cron-aws@1.0.0 test /Users/alexey/wizard/serverless-cron-job-example
    > mocha

      Transfer test
        #init(client, year, month, day, city)
          ✓ exists record for 2018/08/21 (167ms)
        #monthTable.create(client, week, year)
          ✓ exists new table for week = 33 and year = 2018
        #transferData.transfer(client, week, year)
          ✓ exists record in new and old table for week = 33 and year = 2018
        #cleanupData.cleanup(client, week, year)
          ✓ exists record in new table and not exists in old table for week = 33 and year = 2018

      Date utils test
        #getWeekNumber(d)
          ✓ should return week = 33 and year = 2018 for 2018/08/21


      5 passing (205ms)
```

Great! Our cron job is good to go.

#### Iterating on the cron job

In order to iterate on and update the cron job’s code, just run `serverless deploy` after you’ve made your changes to deploy the newest version. We recommend setting up [a CI/CD pipeline](https://serverless.com/framework/docs/dashboard/pipelines/) to continuously validate and deploy your cron job every time you push changes to GitHub.

The full example of the application we just walked through is available [in our GitHub repo](https://github.com/chief-wizard/serverless-cron-job-example).

### Summary

In this article, we walked through creating and deploying a cron job on AWS with Serverless Framework. Using AWS Lambda may be a better fit for your cron jobs than AWS EC2, since with Lambda you pay only for what you use, and good infrastructure is already in place to deploy, monitor, and secure the cron jobs you create.

Working with AWS Lambda directly can be challenging in terms of the developer experience. By using Serverless Framework, you get a easier deployment and iteration flow and also benefit from built-in AWS credentials management, zero-setup monitoring for your cron jobs, and more. Using Serverless Framework also helps you avoid vendor lock-in should you ever decide to migrate away from AWS.

While we believe that using AWS Lambda with Serverless Framework is a great solution for most kinds of cron jobs, Lambda does have a number of limitations. If your jobs need to run for longer than 15 minutes, for example, or if your functions need access to special hardware (a GPU, for example), then using EC2 might be a better fit. In addition, when you have a very high volume of cron jobs running simultaneously, using EC2 might well be more cost-effective in the long run.

You can find the full example that we walked through [in our GitHub repo](https://github.com/chief-wizard/serverless-cron-job-example).

Check out the details of Serverless Framework [on the Serverless website](https://serverless.com). [The Serverless AWS docs](https://serverless.com/framework/docs/providers/aws/cli-reference/) might be helpful, as well as the reference [for the Serverless Dashboard](https://serverless.com/framework/docs/dashboard/).

Find more examples of Serverless applications [on our Examples page.](https://serverless.com/examples/)