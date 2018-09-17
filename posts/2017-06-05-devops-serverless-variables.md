---
title: DevOps Use Cases With Serverless Variables
description: Serverless Framework Engineer Eslam Hefnawy explores creative use cases for using Serverless Variables to optimize and automate operations.
date: 2017-06-05
category:
  - guides-and-tutorials
  - operations-and-observability
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/variables.jpg
authors:
  - EslamHefnawy
---


The Serverless Framework has a powerful built-in variable system that helps secure your sensitive data and can be used to keep even the most complex configuration simple and manageable. We have pretty comprehensive coverage of all of the features of the variable system in [our documentation](https://serverless.com/framework/docs/providers/aws/guide/variables/#variables), but when combined together in creative ways these features enable some extremely powerful workflows and real world use cases.

In this article we’ll explore some ideas on how you can use these features to better automate your serverless operations.

# Dynamic Configuration
You can use the variable system to dynamically generate configuration data for your config files with the help of JS scripts, which is normally not supported by YAML/JSON. Some examples include generating random numbers, dates, doing mathematical computation, or fetching remote data. Let’s look at two of these examples..


### Generating Random ID
Let’s say you want to create a bucket with a unique id attached to the name. It wouldn’t be possible to generate that random id inside of serverless.yml without the magic of programming. You can utilize the variable system for this use case like this:

```yml
# serverless.yml

Resources:
  Resources:
    myBucket:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: my-bucket-with-id-${file(vars.js):bucketId}
```

And in vars.js
```js
module.exports.bucketId = (new Date()).getTime().toString();
```

### Fetching Remote Data
You can go even further with JS scripts by working with promises and async operations, which is supported out of the box by the Framework. That means you can fetch data needed for your configuration from any remote source you want.

For example, if you need to use your Github first name as the function name, you can fetch that data from the Github API using a vars.js file like this:

```js
module.exports.githubFirstName = () => {
  /*
   * some async logic here calling the Github API...
   */
  const githubFirstName = “Mike”;
  return Promise.resolve(githubFirstName);
};
```
Then in serverless.yml you can do something like this:

```yml
functions:
  myPersonalFunction:
    name: ${file(vars.js):githubFirstName}
```
The use cases of this feature are limitless! You can fetch global config from DynamoDB, get sensitive data from KMS, or interact with your own API. Whatever is needed by your application.

## Predeployment Processing
A super creative usage of the variable system is to use it without having any actual variables at all! One use case of that is doing some pre-deployment processing as a build script, maybe to prepare or build certain AWS resources that your service depends on or make some changes to your config files. This works out of the box because processing variables happens at the beginning on Serverless initialization. You’ll just need to write your script and reference it wherever needed, most likely in the `custom` property of your `serverless.yml`.

Let’s take a look at an example. Say you want to control which AWS account to use based on certain logical conditions. You can make use of the variable system to setup the correct value for AWS_PROFILE environment variable for you before deployment. All you have to do is just reference a JS variables file that contain that logic. So in serverless.yml


```yml
service: myservice
custom:
  setup: ${file(vars.js):setup} # this is just to trigger the code. This var is not needed at all!
```
Then in vars.js, you can write your logic:


```js
module.exports.setup = () => {
  /*
   * some logic here...
   */
  process.env.AWS_PROFILE = “mike”;
  return process.env.AWS_PROFILE; // you don’t even need to return because you’d never use that value!
};
```
This way, vars.js could determine which AWS_Profile to use.

## Organizing Your Serverless Configuration
If you’ve been using Serverless in production for a while now, most likely you’ve realized how complex your serverless.yml can become. Many of the configuration options could actually be reused, not only within your services, but throughout all your services.

As the framework matured, we started to notice patterns in how users are organizing their config file with the help of the variable system. Here are some common structures:

### Custom Resources Files
Real world serverless applications require the use of many AWS resources that you’ll need to set up in the `resources` section of `serverless.yml`. Those resources themselves have many configurations on their own and they will most likely reference other variables. To keep `serverless.yml` from getting bloated, many users keep all their AWS resources in a single `resources.json` file, and reference that file in `serverless.yml` like this:

```yml
Resources:
  resources: ${file(resources.json)}
```
You can also have an outputs.json file and reference it the same way:

```yml
Resources:
  resources: ${file(resources.json)}
  outputs: ${file(outputs.json)}
```
Then, inside of your resources.json & outputs.json, you can still reference other variables as required by your resources.

### Function Config Files
Some users decide to follow a monolithic architecture when working the Serverless Framework. That means they have a single service, containing all their functions, for their entire project. As the number of functions grows, it become very difficult to manage configuration. Variables allow you to keep each function config in a separate file, for example sitting next to the handler in the service directory structure. Here is an example of what a serverless.yml might look like in this case:

```yml

functions:
  hello: ${file(hello/config.yml)}
  world: ${file(world/config.yml)}
```
And the directory structure would look something like this
```
service
  |-serverless.yml
  |-hello:
      |-config.yml
      |-handler.js
  |-world:
      |-config.yml
      |-handler.js
```

### Central Variables File
If you make extensive use of the variable system, and define a lot of variables for your project, you can keep them all in a single vars.json, vars.yml or vars.js file. Keeping them in a JS file is the most powerful option because it ensures that you can use logic to dynamically manipulate your exported variable values before they’re populated in serverless.yml.

So you’d have a vars.js file that looks something like this:

```js
module.exports.stage = ‘${opt:stage, self:provider.stage}’;
module.exports.region = ‘${opt:region, self:provider.region}’;
module.exports.now = (new Date()).getTime().toString();
...100 other variables...
```
And then reference this file in `serverless.yml` like this:


```yml
functions:
  hello:
    name: hello-${file(vars.js):stage}
```
This way, if you want to make changes to your variables, you’ll only have to do it once in this central vars.js file.


## Final Thoughts
We just touched the surface on what the variable system could do for your application. There are really no limits with what you can do thanks to the support for JS scripts. We hope this article gave you some inspiration on how to use the variable system in even more creative ways as needed by your application.
