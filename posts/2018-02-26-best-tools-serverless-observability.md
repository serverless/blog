---
title: Best tools for serverless observability
description: "The current best tools for serverless observability: benefits, drawbacks, and which are right for you."
date: 2018-02-26
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/graph-thumb.png"
category:
  - operations-and-observability
authors:
  - AndreaPasswater
---

We admit it. In the serverless realm, getting the observability you need can be really frustrating.

In [his series on serverless observability](https://hackernoon.com/serverless-observability-part-1-new-challenges-to-old-practices-95de1b94d379), Yan Cui has stated the challenges, and the reasons behind them, incredibly well.

But there is hope.

There is a constant onslaught of new tools, new features, and loud voices demanding change. At this point, we’re truly at the cusp of serverless observability being not just passable, but great.

In this post, we are compiling resources that you can use to have top notch insight into your functions. We will update this as new information becomes available, so it can serve as an observability tools guide for you, the intrepid serverless developer.

Read on for the best tools and best practices.

## The tools

- [AWS CloudWatch](https://serverless.com/blog/best-tools-serverless-observability/#aws-cloudwatch)
- [AWS X-ray](https://serverless.com/blog/best-tools-serverless-observability/#aws-x-ray)
- [Dashbird](https://serverless.com/blog/best-tools-serverless-observability/#dashbird)
- [IOpipe](https://serverless.com/blog/best-tools-serverless-observability/#iopipe)
- [Thundra](https://serverless.com/blog/best-tools-serverless-observability/#thundra)
- [OpenTracing](https://serverless.com/blog/best-tools-serverless-observability/#opentracing)
- [Epsagon](https://serverless.com/blog/best-tools-serverless-observability/#epsagon)

### AWS CloudWatch

[CloudWatch](https://aws.amazon.com/cloudwatch/) is the native AWS logging tool. It’s primarily for logging, monitoring, and alerts.

Benefits:
- Tracing & profiling to investigate performance and cold starts
- Monitoring and error logs
- Customizable alerts
- For Lambda users, works out of the box
- A lot of people use it, which means there are a lot of plugins and other resources widely available

Drawbacks:
- Metrics have up to one minute delay (not real-time)
- No customizable events
- Will probably need to use a separate log aggregator for centralized logging

*Metrics*: Cloudwatch comes with easy Lambda metrics; no setup.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/cloudwatch-metrics.png">

Logs: Logs from your Lambda function, plus general status logs, are sent directly to Cloudwatch Logs.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/cloudwatch-logs.png">

Further reading:
- [Using CloudWatch metrics and alarms](https://serverless.com/blog/serverless-ops-metrics/)
- [Using CloudWatch logs](https://serverless.com/blog/serverless-ops-logs/)

### AWS X-ray

[X-ray](https://docs.aws.amazon.com/xray/latest/devguide/xray-services-lambda.html) is a distributed tracing system you can use for debugging across various AWS systems. It’s usage is not mutually exclusive with another tool, like IOpipe or CloudWatch, and most people use X-ray in conjunction with another monitoring tool.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/x-ray-trace.jpg">

Further reading:
- [X-ray and Lambda: the good, the bad, the ugly](http://theburningmonk.com/2017/06/aws-x-ray-and-lambda-the-good-the-bad-and-the-ugly/)

### Dashbird

Ever used the native CloudWatch interface? Not always touted as the most user-friendly UI. [Dashbird](https://dashbird.io/) sits on top of CloudWatch and provides a more navigable user experience, plus a few additional features.

Benefits:
- Tracing & profiling to investigate performance and cold starts
- Monitoring and error logs for debugging your serverless functions
- Doesn’t require additional code to implement
- Customizable alerts
- Lambda cost-analysis (per-function basis)

Drawbacks:
- Metrics have up to one minute delay (not real-time)

*Performance metrics*: includes extras like Lambda cost analysis.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/dashbird-price.png">

*Architecture metrics*: track account-level stats across your entire architecture (individual microservice views also available).

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/dashbird-dashboard.png">

Further reading:
- [Log-based monitoring for AWS Lambda with Dashbird](https://dashbird.io/blog/log-based-monitoring-for-aws-lambda/)

### IOpipe

[IOpipe](https://www.iopipe.com/) works with AWS Lambda functions written in Node.js, Python, and Java. It provides tracing, profiling, monitoring, alerts, and real-time metrics.

Benefits:
- Tracing & profiling to investigate performance and cold starts
- Monitoring & customizable events for granular error logs and debugging your serverless functions
- Real-time metrics
- Customizable alerts
- Really easy to install and get running

Drawbacks:
- You have to use a wrapper for each function, which can result in performance delays (about 20ms)

*Real-time metrics*: Monitor invocations, duration, memory usage, and errors in one place.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/iopipe-search.png">

*Search functionality*: You can add multiple “rules” to find invocations that match. The example below looks for long-running invocations over 100ms, but you can search for errors, cold starts, or even custom metric values (e.g., “userId” = 1234).

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/observability-tools/iopipe-realtime-metrics.png">

Further reading:
- [X-ray and IOpipe: better together](https://read.iopipe.com/x-ray-and-iopipe-better-together-d638be86356f)
- [IOpipe Serverless Plugin](https://github.com/iopipe/serverless-plugin-iopipe)

### Thundra

Thundra has not yet hit general availability, but you can sign up for beta access [here](https://www.thundra.io/).

Much like IOpipe, it promises to provide tracing, profiling, monitoring, alerts, and metrics.

Thunda will differ from IOpipe in a couple ways. They plan to focus on Java rather than Node.js or Python. They are also attempting to avoid latency by keeping data-sending separate from the Lambda function itself. Instead, they’ll first write their metrics to logs, and an out-of-band log processor will send those metrics to the Thundra backend.

Further reading:
- [The state of serverless observability—why we built Thundra](https://serverless.com/blog/state-of-serverless-observability-why-we-built-thundra/)

### OpenTracing

[OpenTracing](http://opentracing.io/), is a vendor-neutral open standard for distributed tracing that is supported by the [CNCF](https://www.cncf.io/). Libraries are available in 9 languages: Go, JavaScript, Java, Python, Ruby, PHP, Objective-C, C++, and C#.

Note that this is a standard, and not a tool. You’ll have to set up your own collector and interface, or you can use a paid tool such as [LightStep](https://lightstep.com/).

Benefits:
- You can use it with any cloud provider, not just AWS

Drawbacks:
- Takes some set-up

Further Reading:
- [Supported Tracer Implementations](http://opentracing.io/documentation/pages/supported-tracers.html)
- [Distributed Tracing in 10 Minutes](https://medium.com/opentracing/distributed-tracing-in-10-minutes-51b378ee40f1)
- [Towards Turnkey Distributed Tracing](https://medium.com/opentracing/towards-turnkey-distributed-tracing-5f4297d1736)
- [OpenTracing: An Open Standard for Distributed Tracing](https://thenewstack.io/opentracing-open-standard-distributed-tracing/)

### Epsagon

[Epsagon](https://epsagon.com) is a serverless monitoring and observability tool that automatically detects full transactions throughout a company’s system, calculates costs and provides aggregated numbers around cost and performance across the most critical business functions. Using distributed tracing and AI technologies, Epsagon helps companies significantly reduce downtime and cost by providing end-to-end observability and application performance monitoring at the application level.

*Troubleshooting using distributed tracing:* automatic instrumentation provides full traces.
<img src="https://s3.us-east-2.amazonaws.com/epsagon-public-screenshots/epsagon-trace.png">

*Application performance and cost monitoring*: complete dashboard for the health of the serverless application.
<img src="https://s3.us-east-2.amazonaws.com/epsagon-public-screenshots/epsagon-dashboard.png">

Benefits:
- Automatic tracing and monitoring of the entire application, including distributed tracing.
- AI-based prediction and alerting of issues before they happen.

Drawbacks:
- Automatic instrumentation adds a few milliseconds to the running time of the code.

Further Reading:
- [Epsagon emerges from stealth](https://techcrunch.com/2018/10/17/epsagon-emerges-from-stealth-with-serverless-monitoring-tool)
- [Epsagon Launch - Why We Started Epsagon](https://blog.epsagon.com/epsagon-is-launching)
- [5 Ways to Gain Serverless Observability](https://blog.epsagon.com/five-ways-to-gain-serverless-observability)

## Did we miss anything?

Feel free to leave comments, and/or submit a PR against this post to leave us suggestions.
