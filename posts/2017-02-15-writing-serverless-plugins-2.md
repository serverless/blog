---
title: 'How To Write Your First Plugin For The Serverless Framework - Part 2'
description: "Now that you've written your first Serverless plugin, learn about different approaches to implementation in part 2 of this series."
date: 2017-02-15
thumbnail: https://cloud.githubusercontent.com/assets/20538501/22978450/58c89e48-f358-11e6-96b1-dd665f3c9c5e.png
layout: Post
authors:
  - AnnaDoubkova
---
Hi, I'm [Anna Doubkova](https://github.com/lithin), a software engineer at [Red Badger](https://red-badger.com/) in London. In my previous post ([How To Write Your First Plugin for the Serverless Framework - Part 1](https://serverless.com/blog/writing-serverless-plugins/)), you learned what Serverless plugins are and how you can use them to hook into the Serverless Framework yourself. In this follow-up post, you’ll see how to write implementation of a plugin that could be used in real life.

## Extending The Serverless Framework
Plugins extend functionality of the framework to tailor it for your use case. The framework is very flexible and allows you to take different approaches to implementing your logic. The main ways are:

1.	Writing a new command
2.	Extending an existing command to implement additional functionality
3.	Writing your own implementation of an existing command from scratch

## Writing A New Command
Let's have a look at a practical example that will illustrate why you'd want to write a new command for the Serverless Framework.

Imagine you have a microservice defined in your `serverless.yml` that contains a DynamoDB table. You can deploy the functions, add API Gateway endpoints, and create the table automatically by running `serverless deploy`. Easy!

What if you want to copy data from production to dev table so that you can test your application with real data? You could export and import data from one table to another, but that'd be very tedious if done frequently. Instead, we'll write a plugin for it.

## Copy Data Plugin
You can start by defining the command in a new class as shown in [Part 1 of this series](https://serverless.com/blog/writing-serverless-plugins/). I imagine the command would have two steps, or lifecycle events - one for downloading the data and one for uploading it. It could look something like this:

```js
class CopyDataPlugin {
  constructor(serverless, options) {
    this.commands = {
      'copy-data': {
        lifecycleEvents: [
          'downloadData',
          'uploadData'
        ],
        usage: 'Pushes data from one database to another',
      },
    };
  }
}

module.exports = CopyDataPlugin;
```

When the command is defined, you attach lifecycle functions by defining them as hooks. Again, one function will handle downloading the data and the other one will upload it. Notice that we're binding `serverless` and `options` to these functions so that they can access their data.

```js
// Version 1
class CopyDataPlugin {
  constructor(serverless, options) {
    this.commands = {
      'copy-data': {
        lifecycleEvents: [
          'downloadData',
          'uploadData'
        ],
        usage: 'Pushes data from one database to another',
      },
    };

    this.hooks = {
      'copy-data:downloadData': downloadData.bind(null, serverless, options),
      'copy-data:uploadData': uploadData.bind(null, serverless, options),
    };
  }
}
```

## Object-Oriented Programming (OOP) Approach
If you'd rather not bind `serverless` and `options` to these functions, there's another more object-oriented approach.

```js
// Version 2
class CopyDataPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      // ...
    };

    this.hooks = {
      'copy-data:downloadData': this.downloadData.bind(this),
      'copy-data:uploadData': this.uploadData.bind(this),
    };
  }

  downloadData() {
    // ...code
  }

  uploadData() {
    // ...code
  }
}
```

Or if you're using babel and like cutting-edge ES features, you can use [Class Properties Transform](http://babeljs.io/docs/plugins/transform-class-properties/) to use arrow functions and remove the need for binding completely.

```js
// Version 3
class CopyDataPlugin {
  constructor(serverless, options) {
    this.serverless = serverless;
    this.options = options;

    this.commands = {
      // ...
    };

    this.hooks = {
      'copy-data:downloadData': this.downloadData,
      'copy-data:uploadData': this.uploadData,
    };
  }

  downloadData = () => {
    // ...code
  }

  uploadData = () => {
    // ...code
  }
}
```

However, I personally prefer a more functional approach. That's why we'll carry on in this tutorial with the two functions completely separate from the class itself - as per `Version 1`.

Having defined the command, it's time to jump to the implementation.

## Downloading Data
First, you want to download the data from a production database and save it somewhere so that you can upload it in the second step. I decided in this case to save the downloaded data to `serverless.variables` so that it can be easily accessed.

```js
const downloadData = (serverless, options) => new Promise((resolve, reject) => {
  // function configuring aws-sdk and getting the DynamoDB client
  const dynamodb = getDynamoDB(serverless);

  const params = {
    TableName: 'users-production',
  };

  dynamodb.scan(params, (error, result) => {
    if (error) {
      serverless.cli.log(`Error on downloading data! ${JSON.stringify(error)}`);
      return reject(error);
    }
    serverless.variables.copyData = result;
    serverless.cli.log(`Downloaded ${JSON.stringify(result.Items.length)} items`);
    return resolve(result);
  });
});
```

As downloading is likely an asynchronous event, your function needs to return a promise. This way, the Serverless Framework will know to wait for this step to finish before starting the following one.

Another handy thing to notice here is `cli.log()` function on the serverless object. It provides you with uniform message logs to the console.

_Note:_ In your implementation, you can easily swap DynamoDB for another database (or even provider!) entirely - however, for now we'll stick to AWS - the most widely used provider.

## Uploading Data
In the second step of the implemention, we simply need to take data from `serverless.variables.copyData` and upload it to the test/dev database. As far as I'm aware, we can only do that by uploading the data one by one:

```js
const getPutPromise = (dynamodb, params, serverless) => new Promise((resolve, reject) => {
  dynamodb.putItem(params, (error) => {
    if (error) {
      return reject(error);
    }
    serverless.cli.log(`Uploaded: ${JSON.stringify(params)}`);
    return resolve();
  });
});

const uploadData = (serverless, options) => new Promise((resolve, reject) => {
  // function configuring aws-sdk and getting the DynamoDB client
  const dynamodb = getDynamoDB(serverless);
  const uploads = [];

  serverless.variables.copyData.Items.forEach(data => {
    const params = {
      TableName: 'users-dev',
      Item: data
    };
    uploads.push(getPutPromise(dynamodb, params, serverless));
  });

  Promise.all(uploads).then(() => {
    serverless.cli.log('Data uploaded successfully!');
    resolve();
  }).catch(error => {
    serverless.cli.log(`Data upload failed: ${JSON.stringify(error)}`);
    reject(error);
  });
});
```

And we're done!

Somehow, this doesn't quite feel satisfying. Why should this be a Serverless plugin when really we could write this easily as node or bash script?

## Why Create A Serverless Plugin?
To see where the Serverless Framework helps us, we need to dig a bit deeper. Generally speaking, it contains whatever we specified in `serverless.yml`. To give a few practical examples related to our case:

- region
- default stage and custom variables
- service resources

If we look at the implementation of `getDynamoDB`, some of its benefits become immediately obvious:

```js
const aws = require('aws-sdk');

const getDynamoDB = serverless => {
  aws.config.update({
    region: serverless.service.provider.region,
    apiVersions: {
      dynamodb: '2012-08-10',
    }
  });
  return new aws.DynamoDB();
}
```

Getting region from the `serverless` object makes our plugin more resilient. If we decide to deploy the service to another region, the plugin will still work.

It also makes it useful outside of our particular service. We could use it across our codebase or even open source it. Well, nearly...

## Defining Stage
Our plugin is so far really useful only if I have a `users` table deployed to `production` and `dev`. I might also want to use it for `customers`, moving data from `test` to `dev` for debugging and testing purposes.

We've already used region to configure `aws-sdk`. For the others, we need to first consider what we might have defined in `serverless.yml`. One of the typical set-ups would be to have a default stage that can be optionally replaced by passing `--stage` flag to `sls`.

```
provider:
  name: aws
  runtime: nodejs4.3
  region: eu-west-1
  stage: dev

custom:
  stage: ${opt:stage, self:provider.stage}
```

We are now sure we'll have a stage specified whenever we're running serverless commands. This allows us to swap `users-production` for a more generic formulation:

```js
const downloadData = (serverless, options) => new Promise((resolve, reject) => {
  // function configuring aws-sdk and getting the DynamoDB client
  const dynamodb = getDynamoDB(serverless);

  const params = {
    TableName: `users-${serverless.service.custom.stage}`,
  };

  //...scan
});
```

This code is equivalent to the original one if we run `serverless copy-data -s production`.

## Upload Stage
Being able to choose which stage of the table to upload data to will be a bit more tricky. In the original example, we're using a flag already used by the service. We now want to introduce a new one - and that's done by defining `options`.

This is very easy in serverless:

```js
class CopyDataPlugin {
  constructor(serverless, options) {
    this.commands = {
      'copy-data': {
        lifecycleEvents: [
          'downloadData',
          'uploadData'
        ],
        usage: 'Pushes data from one database to another',
        options: [
          'target-stage': {
            usage: 'Stage you want to upload data to',
            required: true,
            shortcut: 't'
          },
        ],
      },
    };

    // hooks...
  }
}
```

Now in the upload function, we update table name the same way we did in upload; this time however, getting target from the options.

```js
const uploadData = (serverless, options) => new Promise((resolve, reject) => {
  // dynamodb...

  serverless.variables.copyData.Items.forEach(data => {
    const params = {
      TableName: `users-${options['target-stage']}`,
      Item: data
    };
    uploads.push(getPutPromise(dynamodb, params, serverless));
  });

  // wait for promises...
});
```

Now the plugin can get data from `users` table in any stage and upload it to another one by running `sls copy-data -s production -t dev`.

## Which Table?
To get the right table, you can again specify an option and swap `users` for `options.tableName`. However, there's another way to do it that illustrates the capabilities of the Serverless Framework.

Let's say you've defined your DynamoDB as a resource in your `serverless.yml` in a following way:

```
resources:
  Resources:
    ArticlesTable:
      Type: "AWS::DynamoDB::Table"
      Properties:
        AttributeDefinitions:
          -
            AttributeName: "Title"
            AttributeType: "S"
          -
            AttributeName: "Author"
            AttributeType: "S"
        KeySchema:
          -
            AttributeName: "Title"
            KeyType: "HASH"
          -
            AttributeName: "Author"
            KeyType: "RANGE"
        ProvisionedThroughput:
          ReadCapacityUnits: "5"
          WriteCapacityUnits: "5"
        TableName: "articles-${self:custom.stage}"
```

Although the format of the table name is still `name-stage`, it won't work with our plugin because it expects a `user` table. Luckily, the format of the data can be defined in any way, so you only need to change the way you're getting the table name.

You add a new option `--resource` that will point to the Resource name. Then you get the right table name from its Resource definition, and can replace the original stage with the target one:

```js
const getTableName = (serverless, options, isUpload = false) => {
  const table = serverless.service.resources.Resources[options.resource].Properties.TableName;
  if (!isUpload) return table;
  return table.replace(serverless.service.custom.stage, options['target-stage']);
}
```

Although this solution has its issues, it makes the plugin yet a bit more reusable and resilient.

## Ready
Well done! You've just finished a Serverless Framework plugin that not only solves a real-world issue, but also can be easily packaged, published to npm and shared with others!

There's yet much more to explore. What other things can we get from the `serverless` object? How do we hook into existing commands to extend them? How do we write a plugin that could be used, say, with both AWS and OpenWhisk?

I'll leave these questions for you to answer with your own experiments.

PS: To see the whole plugin together, including a service it works with, [check my GitHub](https://github.com/lithin/sls-plugins-example).
