---
title: "Provisioned Concurrency: What it is and how to use it with the Serverless Framework"
description: "If you were trying to use Lambda in a use case that was very latency sensitive, cold starts were probably your greatest concern. AWS has heard the concerns"
date: 2019-12-03
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/provisioned-concurrency/blog-thumbnail-comp.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/provisioned-concurrency/blog-header-comp.png"
authors:
  - GarethMcCumskey
category:
  - news
---

[AWS Lambda](https://www.serverless.com/aws-lambda/) pretty much single-handedly kick-started the serverless movement we find ourselves in. A compute service with automated scaling and complete elimination of machine or container maintenance. However, some of the characteristics of the service made it a little less than desirable for certain workloads.

If you were trying to use Lambda in a use case that was very latency sensitive, cold starts were probably your greatest concern. Cold starts have also been the biggest issue pointed out by detractors of service as to why you need to be cautious about adopting Lambda as your primary compute platform. However, thankfully, AWS has heard the concerns and has provided the means for us to solve the problem.

If you have just deployed a Serverless service, or none of your functions have been invoked in some time, your functions will be cold. This means that if a new event trigger did occur to invoke a Lambda function, a brand new micro VM would need to be instantiated, the runtime loaded in, your code and all of its dependencies imported and finally your code executed; a process that could take 50 - 200 ms (or longer depending on the runtime you choose) before any execution actually started. However, after execution, this micro VM that took some time to spin up is kept available for afterwards for anywhere up to an hour and if a new event trigger comes in, then execution could begin immediately.

Before now, if you were trying to use techniques to create warm Lambda instances, this was a tricky exercise. It was a little difficult to exactly control how many warm instances you wanted simultaneously and you then had to execute the Lambda you wanted with some kind of branching logic that determined whether this was a warm up execution or an actual execution. It was rather ugly. But it helped folks step past the cold start issues to some degree.

However, AWS has now launched Provisioned Concurrency as a feature. It does pretty much the same thing as those Serverless Framework plugins that try to keep a certain number of warm functions running by allowing you configure warm instances right from the get go. In addition, there are no code changes needed. All we need to do is set a value as to how many provisioned instances we want for a specific function, and the [AWS Lambda](https://www.serverless.com/aws-lambda/) service itself will ensure to always have that quantity of warmed instances waiting for work!

Combine this with the auto scaling features of Lambda and we now have the means to respond rapidly to traffic as well as automatically accommodate more traffic as it comes in.

#### AWS Console

This setting can be made very simply in the AWS Console. Go to the function in the Lambda service, scroll all the way to the bottom and set it at what you want the minimum provisioned concurrency to always be. Easy as that.

#### Serverless Framework

Of course, we don’t really want to dip into the console if our service is built with the Serverless Framework, so instead, we can change one setting on our functions definition to add provisioned concurrency to that function.

```yml
functions:
  hello:
    handler: handler.hello
      events:
        - http:
            path: /hello
          method: get
    provisionedConcurrency: 5
```

In the example above, the `hello` Lambda function will always have 5 warm instances ready to go to handle incoming HTTP requests from API Gateway.

#### AWS API
However, it doesn’t end there. You can even go so far as to write a simple Lambda that you run on an hourly basis with a pre-determined schedule in mind. If you are like a lot of organsiations, you will have busy spikes you know about well in advance. In these situations, you may not want `provisionedConcurrency` all the time, but you may want it during those known spikes. 

Provisioned Concurrency can be set via the AWS SDK:

```javascript
'use strict';
const AWS = require('aws-sdk')

module.exports.setProvisionedConcurrency = async event => {
  const params = {
    FunctionName: 'MyFunctionName',
    ProvisionedConcurrentExecutions: '5',
    Qualifier: 'aliasname'
  };
  const lambda = new AWS
  lambda.putProvisionedConcurrencyConfig(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
};
```

Now you have the means to schedule the provisioned concurrency whenever you choose and so optimise the cost efficiency of it. 

#### Conclusion

This single feature released by AWS gives those needing greater control over ensuring lower latencies exactly the tool they needed while keeping Lambda Serverless. You are not provisioning hardware or networks, runtimes and operating systems, but tweaking the settings that directly affect the end result in a measurable and predictable way. And this single feature opens Serverless up even further to more use cases and makes it far more competitive in the world of application development.
