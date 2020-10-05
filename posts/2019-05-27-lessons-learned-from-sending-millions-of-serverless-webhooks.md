---
title: Lessons Learned From Sending Millions of Serverless Webhooks
description: Using a serverless architecture to send Dwolla's webhooks faster and at a lower cost.
date: 2019-05-27
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/lessons-millions-webhooks/serverless-millions-webhooks-thumb.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/lessons-millions-webhooks/serverless-millions-webhooks-header.png"
authors:
  - RockyWarren
categories:
  - operations-and-observability
---

In March, Dwolla’s engineering team launched an updated [webhook notifications](https://developers.dwolla.com/guides/webhooks/) architecture, cutting delivery times during peak load from minutes to seconds. At the same time, we increased reliability, reduced costs and enabled configuration on a per-customer basis.

Is your company just starting out and can’t handle much traffic? We can send webhooks one-by-one. Do you have an auto-scaling API that can handle hundreds of parallel requests? We’ll send them as fast as you can receive them.

Webhooks  are HTTP calls to our customers’ APIs providing real-time updates for specific events, eliminating the need for long polling. Our old architecture was simple by design. We used a RabbitMQ queue serviced by a pool of Elastic Container Service (ECS) handlers. As events occurred in the system, we sent them to the queue. The handlers received them, called the appropriate customer's API and sent the result to another queue for storage.

After years of serving us well, we needed improvements. The shared queue meant high-volume customers doing large payouts and APIs with high response times delayed webhooks for everyone. Scaling the handlers to drain the queue caused all customer APIs to receive webhooks in parallel, even those that couldn't handle them.

To further scale, [we moved to a multi-queue, serverless architecture](https://discuss.dwolla.com/t/webhook-improvements-a-deeper-dive/5161). When a customer subscribes to webhooks via our API, we dynamically provision a Simple Queue Service (SQS) queue and Lambda handler just for them. Now as events happen, we look up the appropriate customer’s queue, send them there for handling and send the result to a separate queue for storage. This allows us to configure the send rate of each individually and ensures high-volume customers or those with high response times aren’t impacting others.

After sending millions of webhooks on the new architecture, we've learned valuable lessons. Not of fan of lists? Head straight to the [open-sourced code](https://github.com/search?q=topic%3Awebhooks+org%3ADwolla&type=Repositories)!

1. **TypeScript is great.** Our old handlers were written in Scala and while you can run Scala on Lambda via the Java runtime, cold start times are high. Since our handlers get invoked a lot and scale up and down with load, we run into cold starts often. TypeScript is a superset of and compiles to JavaScript, the runtime of which performs much better in this regard. We’ve appreciated the type safety and improved IDE experience TypeScript provides.

2. **Serverless Framework and AWS Cloud Development Kit (CDK) work well together.** The Serverless Framework allows you to configure Lambda functions and event source triggers (SQS, in our case) with a few lines in a `serverless.yml` file. The file also allows custom CloudFormation YAML for resources it doesn't support. That's where AWS CDK comes in. With it, you can configure AWS resources with all the power of TypeScript and then run `cdk synth` to produce a CloudFormation template YAML file. You can then import this file into your `serverless.yml` file and deploy the whole thing with one `serverless deploy` command!

3. **Audit dependencies to keep bundle sizes small.** Frontend JavaScript developers are familiar with this concept, but it's less of a concern for backend developers. Since Lambda cold start times are impacted by bundle sizes, though, it's important to keep your eye on them. [Serverless Webpack](https://github.com/serverless-heaven/serverless-webpack) is a great plugin to minify your code and [Bundlephobia](https://bundlephobia.com/) allows you to compare popular libraries and their sizes.

4. **CloudWatch's default log retention period is forever.** This can get expensive with high-volume Lambda functions. Either ship your logs to your preferred aggregator or set the retention to a finite value. With Serverless Framework, this is as easy as adding `logRetentionInDays: 365` to `serverless.yml`.

5. **Follow AWS Best Practices.** The [Lambda](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html) and [Using Lambda with SQS](https://docs.aws.amazon.com/lambda/latest/dg/with-sqs.html) Best Practices helps avoid Lambda throttles, understand SQS message batches (they succeed or fail together) and configure redrive policies high enough to prevent prematurely sending messages to dead-letter queues.

6. **Structure your logs to ease alert creation and debugging.** As an example, we preface errors with “[error]” allowing us to create a [Log Metric Filter](https://docs.aws.amazon.com/AmazonCloudWatch/latest/logs/FilterAndPatternSyntax.html) and get alerts anytime they occur. Consistently including high cardinality values in log messages (think account or transaction ID) is another good habit, allowing you to more easily track specific requests through the system.

7. **Lambda errors can be elusive, but CloudWatch Insights helps.** When a Lambda Error alert triggers, it’s not immediately clear what happened, especially if there are lots of logs to search through. Only through experience do you find timeouts log “timed out” and out-of-memory errors log “process exited.” CloudWatch Insights provides query capabilities to easily search Log Groups for these messages:

```
| fields @timestamp, @message
| filter @message like /\[error\]|timed|exited/
| sort @timestamp
```

8. **Understand AWS account limits.** Each service has its own limits and while some can be increased, others cannot. By default, Lambda has a limit of 1,000 concurrent executions, for example, and CloudFormation has a limit of 200 stacks. Before getting too far along with a solution, understand your limits. AWS Trusted Advisor can help keep tabs on them and trigger alerts if you cross certain thresholds.

9. **Think twice before dynamically provisioning AWS resources.** In our initial testing, we created the SQS queue and Lambda handler when a new customer subscribed to webhooks via the API and deleted them on unsubscribe. These are time intensive, however, and we quickly ran into race conditions during functional testing. Instead, we provision disabled resources on customer creation and only enable/disable the Lambda Event Source Mapping on subscribe/unsubscribe. This is much faster and still ensures we pay nothing for resources not in use.

10. **Utilize tagging to manage lots of resources.** Each SQS queue, Lambda handler, and CloudWatch Log Group have Project, Version, and Environment tags. This allows us to easily search for, update, and monitor costs across thousands of AWS resources.

Moving to a serverless architecture improved the timeliness, configurability, cost and reliability of our webhooks. Taken together, they make the Dwolla Platform even more valuable to our customers. We hope these lessons ease adoption of Serverless on your projects.

For more details, check out the open-sourced code detailed below and the [slides presented at Des Moines’s JavaScript meetup](https://gitpitch.com/dwolla/webhook-handler#/).

- [webhook-provisioner](https://github.com/Dwolla/webhook-provisioner) - Create, update and delete customer-specific AWS resources
- [webhook-handler](https://github.com/dwolla/webhook-handler) - POST webhooks to APIs
- [webhook-receiver](https://github.com/dwolla/webhook-receiver) - Sample application to receive and verify Dwolla’s webhooks
- [cloudwatch-alarm-to-slack](https://github.com/dwolla/cloudwatch-alarm-to-slack) - Map and forward CloudWatch Alarms to Slack
- [sqs-mv](https://github.com/dwolla/sqs-mv) - Move SQS messages from one queue to another. In the event of errors, used to move messages from the dead-letter-queue back to the appropriate customer queue
- [generator-serverless](https://github.com/therockstorm/generator-serverless) - Yeoman generator for TypeScript and JavaScript serverless functions
