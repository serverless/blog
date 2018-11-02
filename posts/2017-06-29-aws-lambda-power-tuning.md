---
title: AWS Lambda Power Tuning with AWS Step Functions
description: Alex Casalboni presents his Serverless Service powered by AWS Step Functions and the Serverless Framework to optimize your Lambda Functions performance and costs.
date: 2017-06-29
layout: Post
thumbnail: https://github.com/alexcasalboni/aws-lambda-power-tuning/blob/master/state-machine-screenshot.png?raw=true
authors:
  - AlexCasalboni
---

During the last few months, I realized that most developers using serverless technologies have to rely on **blind choices** or **manual tuning** to optimize their Lambda Functions. In this article I will present: the data I collected, the [open-source project](https://github.com/alexcasalboni/aws-lambda-power-tuning) I created to solve this problem, and the design ideas that guided me.

## AWS Lambda optimizations, let's go data-driven

I launched [this poll](https://twitter.com/alex_casalboni/status/854059283465383937) a few weeks ago, and I managed to collect almost 160 responses thanks to the community who helped me share it.

It turned out that **more than 50%** of the responders just go for the same RAM configuration all the time (I'm still wondering why they didn't call it "power"!). I guess they got tired of measuring different configurations against aleatory performance results?

Apparently, the other half is still trying to optimize each Lambda Function manually. Well, unless we consider very special use cases, this manual process requires you to **waste a lot of time**, and it often comes with very subjective interpretations of **statistical relevance**.

This is why I decided to work on a side project that would help everyone solve this problem in a language agnostic and deterministic way.

But first, let's dive deeper into the problem and a few possible solutions.

### What can make your functions slow?

If you are developing small self-contained functions that do only one thing, there are not too many factors that can slow them down.

Some functions just involve plain computation and get their job done in a few milliseconds, they are usually easy to test, debug, and optimize (unless you need [weird machine learning stuff](https://aws.amazon.com/blogs/aws/machine-learning-recommendation-systems-and-data-analysis-at-cloud-academy/), as we do at [Cloud Academy](https://cloudacademy.com)).

On the other hand, most functions are meant to interact with other functions and APIs, as a sort of glue code between services. Here is a brief list of the reasons why your functions may slow down:

 * **AWS SDK calls**: everytime you invoke an AWS API using the official SDK - for example, to read data from S3 or DynamoDB, or to publish a new SNS message. 
 
These calls are usually pretty fast because they are executed locally within AWS's datacenters. You may try to perform bulk read/write operations and further optimize those services configuration, whenever possible.

 * **External HTTP calls**: By invoking external APIs, you might incur significant network latency unless the API is also hosted on AWS and provides regional endpoints. You may try to execute multiple calls in parallel and avoid serial execution, whenever possible (this is trivial in Node.js, but it might become a bit tricky to handle in Python and other languages).
 
 * **Intense computation**: Complex algorithms might take a while to converge, especially if you use libraries that require loading a dataset into memory. For example: Natural Language Processing or Machine Learning models that need to manipulate and normalize textual data, invert matrices, process multimedia files, etc.
 
 * **Cold starts**: These occur whenever you update your code,when your Lambda container gets cold, or even just when AWS decides to swap containers around. Unfortunately, you don't have much control on this, but luckily it happens every once in awhile, and we can keep this in mind when evaluating our Functions performance.

### How to achieve objectiveness and repeatability?

My goal was finding an objective way to analyze the performance of any given Lambda Function, and then make informed decisions about the corresponding power configuration based on its priority level in the system.

Such a tool should be cheap and fast to execute, and it should provide repeatable results, taking into consideration the fluctuant trend of CPU, network, external resources, cold starts, etc.

Here is the complete list of requirements I gathered initially:
 
 * **Speed**: similarly to unit tests, you should be able to evaluate the impact of code changes as quickly as possible, which means the tool should run within seconds (not minutes or hours)
 * **Cost**: evaluating performance should be cheap enough to be executed automatically and as often as needed. In some critical and high-throughput scenarios, spending up to $1 could be more than acceptable since the resulting power optimization might generate considerable savings
 * **Complexity**: the tool should be easy to deploy, understand, extend, and visualize
 * **Flexibility**: you may want to use the same tool for different functions, and provide different configurations or optimization strategies
 * **Concreteness**: the tool should provide insights based on a real AWS environment, without limiting assumptions or mocks
 * **Statistical relevance**: the results should be relevant and robust to random fluctuations of measurement tools and external services
 * **Multi-language support**: the tool should be language agnostic and provide the same level of accuracy and relevance for Node.js, Java, Python, Ruby, Go, etc.
 
I easily solved the complexity issue by using the [Serverless Framework](https://serverless.com) for deploying and provisioning all the resources I needed.

Since I wanted everything to run in a real AWS environment and generate statistically relevant results, I quickly realized I had to actually execute the Lambda Function provided as input, as opposed to computing a performance estimate based on code static analysis (which wouldn't be easy to achieve across languages).

To be fast and cost-effective, I thought the tool itself would need to run on AWS Lambda, and it'd need to invoke the input function thousands of times in parallel (at least a few hundreds for each of the 24 available power configurations).

### Why AWS Step Functions?

Given the problems and requirements described above, I figured I'd need some **orchestration logic** to invoke the input Lambda Function with all those different configurations, retrieve the resulting logs, crunch some per-configuration statistics, and then aggregate everything together to take a final decision.

This sounded like the **perfect scenario for AWS Step Functions** since I wanted all of this to happen in parallel, map the results into the corresponding performance/cost metrics, and finally reduce it to a single value (i.e. the optimal power configuration). Therefore I went on and designed a multi-branch state machine on paper, where each parallel branch would correspond to a power value.

Here is when I found out that AWS Step Functions does not allow you to generate states dynamically, and you can't update the state machine structure via API either. I didn't give up, so I started building a simple command that would take a list of power configuration to evaluate as input to generate the state machine JSON code.

One more problem: every branch would need to run the same Lambda Function in parallel with different power configurations. Therefore I decided that I'd need an **initialization step** that would **create a Function Version/Alias for each configuration**. Since I didn't like the idea of leaving a mess after the state machine execution, I also added a **cleaning step** at the end.

Once the state machine contains the correct number of branches, you can still tune a few parameters at runtime:

 * **lambdaARN**: the AWS Lambda ARN of the Function you want to optimize
 * **num**: the number of invocations to execute for each branch (recommended between 10 and 100)
 * **payload** (optional): the static payload to be passed as the input of each invocation
 * **enableParallel** (*false* by default): if *true*, it will enable parallel executions at the branch level (Note: enabling this may cause invocation throttling, depending on the value of *num* and your account soft limit)

Here is a screenshot of a sample execution, generated with only three power values:

<img src="https://github.com/alexcasalboni/aws-lambda-power-tuning/blob/master/state-machine-screenshot.png?raw=true">


### How-to and Use Cases

You can find detailed instructions to get started [on the repository](https://github.com/alexcasalboni/aws-lambda-power-tuning). Basically, you `sls install` the service, `npm install` its dependencies, `npm run generate` the state machine, and `sls deploy` to AWS.

The current optimization strategy is based on cost alone. The state machine will return the power configuration which provides the cheapest per-invocation cost. Of course, we could implement more strategies in the future. For now, you should keep in mind that if your input function executes in less than 50ms or 100ms, 128MB will always be the optimal RAM configuration. This happens because that's the cheapest configuration and it's more or less always optimal for very trivial functions.

The real performance evaluation makes sense for those functions that perform intensive computational tasks or time-consuming HTTP/SDK calls.

For example, imagine a Lambda Function that updates a DynamoDB record and then sends a new SNS message. Your code may look like the following:

```js
const AWS = require("aws-sdk");
const DDB = new AWS.DynamoDB.DocumentClient();
const sns = new AWS.SNS();

exports.handler = (event, context, callback) => {
    const ID = event.ID;
    return Promise.resolve()
        .then(() => updateRecord(ID))
        .then(() => sendNotification(ID))
        .then(data => callback(null, 'OK')
        .catch(err => callback(err));
};

function updateRecord(ID) {
    const params = {
        TableName: "MyTable",
        Key: {ID: ID},
        UpdateExpression: "set Active = :a",
        ExpressionAttributeValues: {":a": true}
    };
    return DDB.update(params).promise();
}

function sendNotification(ID) {
    const params = {
        Message: `Record ${ID} has been activated`,
        Subject: 'New Active Record',
        TopicArn: process.env.TopicArn
    };
    return sns.publish(params).promise();
}
```


If you instrument this Lambda Function with AWS X-Ray, you will see how long each API call is taking. Here is a screenshot of a real X-Ray Trace:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/x-ray-screenshot.png">


With a RAM configuration of **1024MB**, the Function spent around **80ms** updating the DynamoDB record and **70ms** sending the SNS message.

With only **128MB**, the DynamoDB call would take approximately **110ms** and the SNS call would take **120ms**. With **1536MB**, the latencies would go down to **35ms and 45ms** (note: the total is less than 100ms!).

In the case of 128MB, we'd be charged for 300ms. In the case of 1024MB, we'd be charged for 200ms; however, in the case of 1536MB, we'd be charged for only 100ms.

In terms of cost, the 128MB configuration would be the cheapest (but very slow!). Interestingly, using **the 1536MB configuration would be both faster and cheaper than using 1024MB**. This happens because the 1536MB configuration is 1.5 times more expensive, but we'll pay for half the time, which means we'd roughly save 25% of the cost overall.

Now, what about all the other configurations in between? Maybe we could achieve the same performance (under 100ms) and save even more by using 1472MB or 1408MB of RAM.


Please note that before finding this out, you may want to update your code and eventually execute those two API calls in parallel or even split them across multiple functions, depending on your use case.

Once you're happy with your code, you can find out which configuration corresponds to the cheapest cost per-invocation by running the AWS Step Function state machine with the following input object:

```js
{
    "lambdaARN": "arn:aws:lambda:{REGION}:{ACCOUNT_ID}:function:HelloWorld",
    "payload": {"ID": "YourID"},
    "num": 50,
    "enableParallel": true
}
```

Also, remember that the **total number of parallel invocations** will depend on the **enableParallel** parameter and how many branches you have generated. Assuming that you have generated only 10 branches (out of the 24 available values), the state machine may launch up to 500 parallel invocations (10 branches that invoke the same input function 50 times in parallel).

If you need to test more power configurations, or if you'd like to achieve better statistical relevance, I'd suggest raising the soft limit of your account to at least 1000 concurrent invocations and use **"num": 100**.

### Final Thoughts

I believe performance and cost optimization are still quite an open issue in the serverless world. Not only is it hard to estimate costs, but it's even more so without an objective way of measuring and optimizing your code.

I hope this tool will help you take more data-driven decisions, and save some time while optimizing your Lambda Functions.

Let me know what you think about my [AWS Lambda Power Tuning project](https://github.com/alexcasalboni/aws-lambda-power-tuning), and feel free to contribute on Github.
