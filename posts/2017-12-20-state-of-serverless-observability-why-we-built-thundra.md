---
title: "The state of serverless observability—why we built Thundra"
description: "Here's where serverless observability is today. Learn why we decided to build yet another AWS Lambda monitoring solution, Thundra."
date: 2017-12-20
thumbnail: "https://s3-us-west-2.amazonaws.com/why-thundra-serverless-blog/logo.png"
category:
  - operations-and-observability
authors:
  - SerkanOzal
---

For a very long time, monitoring tools were simple. They were mainly used as external pings.

But monitoring tools have significantly evolved in recent years. They provide things like time series traces, metrics, and logs. This kind of monitoring is called “whitebox monitoring”—a subcategory of monitoring, based on information derived from the internals of systems.

It’s what people have come to expect, and frankly a turn that is much-needed as companies continue to embrace microservice architectures.

What we noticed at OpsGenie was that the serverless world had some monitoring tools, but none that were powerful enough. As we began the process of turning our monolith into a microservice architecture, and deploying various services with AWS Lambda, we felt the pain. We couldn’t see anything.

We wanted observability. So we got to work.

The end result of this work is Thundra, which we hope will solve all of your serverless pain points in the same way it did ours.

# The road to observability
“Observability” is the dev trendword of 2017.

As explained in [Cindy Sridharan’s blog post](https://medium.com/@copyconstruct/monitoring-and-observability-8417d1952e1c), observability is a superset of monitoring. It aims to provide insights into the behavior of systems along with rich context, which is perfect for debugging purposes.

In general, there are three pillars of observability:
**Traces** provide end-to-end visibility into requests throughout the entire chain. Traces can be used for identifying which parts of the system have performance bottlenecks, detecting which components of the system lead to errors, and debugging the whole request flow for domain-level bugs.
**Metrics** provide measured or calculated information (mostly numbers) about a particular process or activity in the system over intervals of time—in other words, a time series. A metric can be application/environment specific (CPU metrics, memory metrics), module/layer specific (cache metrics, DynamoDB metrics) or domain specific (user metrics).
**Logs** are an immutable and verbose representation of discrete events that happened over time. Logs are used for debugging, auditing, and analyzing system behavior.

## The current state of serverless observability
At OpsGenie, we’d been implementing new applications as microservices and splitting our existing monolithic architecture into microservices ([more on that here](https://read.acloud.guru/opsgenie-journey-to-serverless-architecture-785540261ec3)). We were using AWS Lambda as FaaS for deploying and running our microservices.

There are all kinds of frameworks and tools for monitoring typical web applications. But for Lambda? Almost nothing. Especially for Java, which was our language of choice.

AWS does provide you with some metrics about how long an invocation took. But it doesn’t say much about what is going on under the hood. X-Ray added more detail about calls to external services, but it didn’t do enough to expose internal metrics automatically.

We spent a lot of time on figuring out what our monitoring setup should be.

We could have gone with a regular APM tool, or the Lambda-specific new products, but all of them had at least one of the following issues/drawbacks:

**They didn’t consider the nature of a Lambda environment.** Publishing data synchronously is an anti-pattern here because it increases the request duration. Besides, receiver-side data monitoring might not be available all the time. This meant we’d need to either retry sending the request, or just skip it silently.

Since Lambda functions should be stateless and the container itself can be destroyed at any time, monitoring data should not be saved on local storage (in memory or on disk). Publishing with background threads is not a good idea either, because when there is no request handled by the container, the container is in a frozen state. No CPU resource/slot is assigned so there will be no running background threads to publish monitor data.

**They didn’t support automated instrumentation.** Updating our code by injecting instrumentation logic would complicate things. That approach was error-prone and didn’t support instrumenting 3rd party libraries because they don’t relinquish their source code for you to play with.

**They didn’t have metrics and logs.** Collecting trace data is good, but for gaining better visibility into our application, we also needed metrics and logs. And they needed to be correlated. Logs wouldn’t be helpful if we couldn’t associate them with the trace data of the request itself, where the logs were printed.

# Enter: Thundra
We ended up implementing an in-house monitoring product, [Thundra](https://www.thundra.io), to bring deeper observability to our Lambdas in deployment.

AWS X-ray already did a great job with end-to-end observability, so we piggybacked on X-ray for visibility. We added a way to enrich X-Ray with trace IDs, so we could view our traces there directly.

We also incorporated several additional metrics & logging features into Thundra, to pick up where X-Ray left off.

## Integration with AWS X-Ray
Most modern systems interact with each other, either providing or consuming services to/from other systems. Even for a single request, there might be a flow-through system. So distributed tracing is an essential requirement.

Fortunately, AWS has [X-Ray](https://aws.amazon.com/xray/), which is a distributed tracing service integrated with AWS Lambda. X-Ray provides you an end-to-end view of requests as they move through your systems.

With X-Ray, you can analyze how your Lambda functions and their connected services are performing. You can identify and troubleshoot the root cause of performance issues and errors, and see a map of your application’s underlying components.

X-Ray is good for the end-to-end visibility, but it instruments at a high level. For low-level instrumentation, you still need to manage X-Ray’s sub-segments yourself.

We integrated our tracing infrastructure with X-Ray. When a span starts, a mapped X-Ray sub-segment is automatically created. This way, we can monitor and query our local traces on X-Ray.

This integration puts us on the road to full observability, by combining distributed tracing with local tracing:

![xray-integration](https://s3-us-west-2.amazonaws.com/why-thundra-serverless-blog/xray-integration.png)

## Asynchronous publishing
Thundra publishes all data through AWS CloudWatch in an asynchronous way, as described as a best practice in [AWS’s white paper](https://d1.awsstatic.com/whitepapers/serverless-architectures-with-aws-lambda.pdf).

Sending data this way allows us to eliminate the concerns mentioned above, and come up with a solution which provides zero overhead:
Our functions run as fast as they can; there is no additional latency caused by sending monitoring data.
Monitoring does not cost us additional money because of request latency.
Our functions send monitoring data in a reliable way, making sure we don’t miss any critical information along the way.

Here’s how all that works at a high level:

![monitoring-architecture](https://s3-us-west-2.amazonaws.com/why-thundra-serverless-blog/monitoring-arch.png)

Trace, metric and log data are written in a structured format as JSON, and sent to CloudWatch asynchronously via
`com.amazonaws.services.lambda.runtime.LambdaLogger`. We also have another Lambda function—let's call it **monitor lambda**—which subscribes to log groups of monitored Lambda functions with a subscription filter that is triggered by monitor data.
The *monitor lambda* then forwards the data to ElasticSearch, either directly or indirectly through Kinesis or Firehose stream, where it can be queried and analyzed later.

## Correlating traces, metrics, and logs
To have full system observability, you not only need all the trace, metric, and log data—you need them to be correlated.

You should be able to answer these key questions:
- Which metrics were calculated in which trace? For a specific request, what were the cache metrics, DB access metrics, etc?
- Which logs were printed in which trace? For a specific request, what were the application logs that let you analyze activity during the request?
- If I find a trace that was much slower than other, what were the metrics and logs flowing from that trace? I need to investigate from the general (slow request) to the specific (a cache miss that resulted in a slow database call).
- If I find some metrics that are abnormal for a set of requests, how can I find their source traces to see the related metrics and logs?

We modeled our metric and log data to be able to reference the current trace. Check out the [OpenTracing specification and data model documentation](https://github.com/opentracing/specification/blob/master/specification.md) for the Span and Trace concepts if you’d like a bit more info on how we structured things.

![trace-and-log](https://s3-us-west-2.amazonaws.com/why-thundra-serverless-blog/trace-and-log.png)

## Ability to instrument without messing up your code
To use existing monitoring tools on AWS Lambda, you need to instrument the code by inserting custom spans (contexts).

Before accessing the database, for example, you’d need to start a span and finish it after the operation to measure the duration.

```java
Span span = Span.start("db");
saveItem(item);
span.end();
publishSpan(span);
```

This requires changing your application code, which will ultimately require more testing and maintenance. It’s also error-prone, as anyone who’s ever forgotten to end a span can attest. Plus, you can’t trace external libraries without rebuilding them—not really feasible for most.

For our team, we wanted Thundra to support automated instrumentation as a cross-cutting operation.

Automated instrumentation is good, but it is not always enough. Sometimes you might need to start/end custom spans with custom attributes, even in a single method. So tracing should support both automatic and manual instrumentation.

We took these issues into consideration and implemented our own JVM agent, which does bytecode level instrumentation. The agent can be dynamically attached to the JVM at runtime, which was necessary since there’s no way to give a JVM argument to a Lambda function for the agent.

With our agent, traced methods can be marked with class- or method-level annotations. For 3rd-party libraries, you can’t put annotations on them because you don’t have their source code. That means you’ll need to specify/configure them declaratively somehow, such as by configuration files or system properties.

To overcome such limitations, as stated before, our instrumentation infrastructure also supports declaring methods/classes to be traced as regular expression definitions by environment variable, which is given to the Lambda function configuration or by configuration files included in the uploaded artifact/jar.

Thundra’s instrumentation agent has the following supports:
- Trace methods and classes programatically using annotations
- Trace method arguments, return values and thrown errors
- Measure execution time for each line
- Track local variable’s states for debugging
- Execute actions before/after a method call, or when an error is thrown
- Take action when a method call exceeds specified limits

Here’s an example. We can instrument all public methods of a class named `UserService` and trace it by annotation as follows:

![trace-by-annotation](https://s3-us-west-2.amazonaws.com/why-thundra-serverless-blog/trace-by-annotation.png)

## Detecting long run and taking consequent action
You can’t instrument everything. And really, you shouldn’t.

If you instrument everything, most of the time there will be redundant tracing data. This will ultimately cause CPU and memory overhead in the system. And also, let’s say you *do* instrument every method—you may not know which part of the method body takes up the majority of the time.

Detailed tracing should be kicked in just as it is needed. If the method call exceeds its predefined time limit, then that call is considered as a “long-run”. In other words, when the method call takes so long that it hits its long-run limit, you can trigger detailed tracing.

When it is detected that the current method call is a long run call, it is too late for instrumentation—the method call is already active. In this case, method level CPU profiling provides us useful metrics about CPU consumption percentages of methods. By using this information, we can focus on the problematic method to find and understand the bottleneck.

Here is a typical example of how our CPU profiler points us that regex related methods are the most CPU consuming operations:

```
   101 (21.17%) java.util.regex.Pattern$Curly.match0
    94 (19.71%) java.util.regex.Pattern$GroupTail.match
    59 (12.37%) java.util.regex.Pattern$BmpCharProperty.match
    32 (6.71%)  java.util.regex.Pattern$Node.match
    23 (4.82%)  java.util.regex.Pattern$GroupHead.match
    23 (4.82%)  java.lang.String.charAt
    21 (4.40%)  java.util.regex.Pattern$Loop.match
    19 (3.98%)  java.util.regex.Pattern$Curly.match
     6 (1.26%)  java.util.regex.Pattern$Single.isSatisfiedBy
    ...
    ...
```

# Interested in Thundra?
Cool! We’re launching it very soon as a private beta. If you want to give it a try, [sign up here](http://www.thundra.io/) for early access.

## Further reading:
See [how we monitor AWS Lambda at OpsGenie](https://engineering.opsgenie.com/how-we-monitor-aws-lambda-at-opsgenie-with-thundra-ba239fc17863), and check out [our engineering blog](https://engineering.opsgenie.com/thundra/home) to keep up with Thundra’s progress.
