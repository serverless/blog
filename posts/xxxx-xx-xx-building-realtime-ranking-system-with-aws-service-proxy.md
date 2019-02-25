---
title: "Building a realtime ranking system with Serverless API Gateway Service Proxy plugin"
description: "How to build a realtime ranking system with Serverless Service Proxy plugin"
date: xxxx-xx-xx
thumbnail: 'https://raw.githubusercontent.com/horike37/sls-images/master/realtime-ranking/thumbnail.png'
heroImage: 'https://raw.githubusercontent.com/horike37/sls-images/master/realtime-ranking/hero.jpg'
category:
  - guides-and-tutorials
authors:
  - TakahiroHorike
---
In one of our customers, we help mainaining a web site built by WordPress and they have a realtime access ranking content on the site.
We have built the backend system with Serverless architechture in AWS so I will tell you how on this article.

By the way, the same system can be also built with [the Google Analytics Real Time Reporting API](https://developers.google.com/analytics/devguides/reporting/realtime/v3/). First, we decided to use that and sent a request because of still Private Beta. However, we don't know why but we didn't get their responses. Therefore, we have decided it from scratch.

## Architechture
Here is the system architecture, which needs the following two APIs
- One is to get ranking API for showing it on ths passionate
- Aonother one is to gather page views

The gathering api is inserted into article pages to get page ID visiters are looking at and put them to Kinesis stream. the getting ranking api gets gathered page IDs from the kinesis stream　within a few minitues after visiters visit article pages, and returns ranking json to API response.

![The archtecture](https://raw.githubusercontent.com/horike37/sls-images/master/realtime-ranking/ranking-architecture.png)

The reason why dividing Kinesis streams into two places is that we need to adjast the number of shards according to the number of concurrent connections from the website. We need to change `shardID` parametor of `getShardIterator` method of kinesis sdk within your Lambda function　whenever we change the number of shards if we only use one Kinesis Steam

To avoid that, we have made the number controllable in the front side Kinesis, and another one has been fixed one shard.

We can actually decide the number by monitoring of throughput. `WriteProvisionedThroughputExceeded` metrics of clouswatch teaches us stable value for that.

## serverless.yml
Here is the serverless.yml file.

```yaml
service: realtime-ranking

provider:
  name: aws
  runtime: nodejs8.10
  stage: dev
  region: ap-northeast-1

functions:
  rankingCollector:
    handler: lambda/apiGateway/rankingCollector.handler
    events:
      - http:
          path: /ranking
          method: get
          cors: true
    environment:
      MINUITES_OF_RANKING_TERM: 10
      COUNT_OF_RANKING: 10
      COLLECTOR_STREAM_NAME: { Ref: 'RankingCollectorStream' }
    iamRoleStatements:
      - Effect: Allow
        Action:
           - 'kinesis:GetRecords'
           - 'kinesis:GetShardIterator'
        Resource: {"Fn::GetAtt":[ "RankingCollectorStream", "Arn" ]}
  rankingConsumer:
    handler: lambda/kinesisStreams/rankingConsumer.handler
    events:
      - stream:
          type: kinesis
          batchSize: 1000
          arn:
            Fn::GetAtt:
              - RankingConsumerStream
              - Arn
    environment:
      COLLECTOR_STREAM_NAME: { Ref: 'RankingCollectorStream' }
    iamRoleStatements:
      - Effect: Allow
        Action:
           - 'kinesis:PutRecord'
        Resource: {"Fn::GetAtt":[ "RankingCollectorStream", "Arn" ]}
custom:
  stage: ${opt:stage, self:provider.stage}
  apiGatewayServiceProxies:
    - kinesis:
        path: /ranking
        method: post
        streamName: { Ref: 'RankingConsumerStream' }
        cors: true

resources:
  Resources:
    RankingConsumerStream:
      Type: AWS::Kinesis::Stream
      Properties:
        ShardCount: 3
        Name: ${self:service}-${self:custom.stage}-ranking-consumer
    RankingCollectorStream:
      Type: AWS::Kinesis::Stream
      Properties:
        ShardCount: 1
        Name: ${self:service}-${self:custom.stage}-ranking-collector
plugins:
  - serverless-apigateway-service-proxy
  - serverless-iam-roles-per-function
```

At this time, to connect directly API Gateway to Kinesis, I have created [Serverless API Gateway Service Proxy](https://github.com/horike37/serverless-apigateway-service-proxy), which supports the AWS service proxy integration feature of API Gateway and save time to define.

You may put a Lambda function between API Gateway and backend AWS Services if you create a similar architecture.
However, Lambda only passes events to backend services if it don’t need to process something as a API Backend.
So API gateway would be better to connect directly to the backend services so that you can reduce the cost of unnecessary Lambda invocations or reduce the number of Lambda concurrences in your entire AWS region becasue lambda Concurrent executions are limited one thouthand per-regions by default.

## Conclusion
To use the plugin, you can easily connect API Gateway to other AWS services without Lambda.
Consider whether your Lambda is actually needed once more!
This plugin still Beta so hope that getting more feedbacks or pull requests from you! Thanks!
