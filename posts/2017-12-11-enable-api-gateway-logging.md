---
title: Enable API gateway logging
description: One stop to enable and manage API gateway logging
date: 2017-12-11
layout: Post
thumbnail: http://www.ahead.guru/img/logos/logo.png
authors:
  - BillWang
---

# Enable API Gateway logging

## Two different loggings in API Gateway

* Cloudwatch logs - useful for developers who need to troubleshooting api gateway functions
* Custom access logging - useful for business to custom the logging with nominiated data

Let's go through the details on how to enable them.

## Enable Amazon CloudWatch Logs in Amazon API Gateway

Notes: Serverless team are still working to [add this feature in core service directly](https://github.com/serverless/serverless/issues/4461). If you can't wait, please follow this document to implement with serverless plugin.

1. Provide an iam role ARN that has write access to CloudWatch logs in API Gateway.

Go through aws document [How do I enable Amazon CloudWatch Logs for APIs I created in the Amazon API Gateway?](https://aws.amazon.com/premiumsupport/knowledge-center/api-gateway-cloudwatch-logs/). **These are manual tasks.**

In general, you need to do:

* Create a new IAM role (for example, `apigateway-cloudwatch-logs-role`) with trust policy  `apigateway.amazonaws.com`
* Attach aws exist policy `AmazonAPIGatewayPushToCloudWatchLogs` to this role
* Record this IAM role's ARN
* Add this iam role's arn to apigateway -> settings -> CloudWatch log role ARN*

With this IAM role, all your api gateways are ready for generating api gateway logs in Cloudwatch. This is a global setting for all API Gateways, that's the reason why it can't be managed by serverless framework.

2. Enable Cloudwatch logs with plugin `serverless-plugin-stage-variables`

Add below lines into `serverless.yml`. 

    plugins:
      - serverless-plugin-stage-variables

    resources:
      Resources:
         ApiGatewayStage:
          Type: AWS::ApiGateway::Stage
          Properties:
            MethodSettings:
              - DataTraceEnabled: true
                HttpMethod: "*"
                LoggingLevel: INFO
                ResourcePath: "/*"
                MetricsEnabled: true

**Notes**: Don’t define `role` with the new role you created above in `serverless.yml`, because that role is used for lambda function, not for api gateway. If you do that, you lost all permissions in lambda functions.

3. Install the plugin `serverless-plugin-stage-variables` and run `sls deploy`

You should see the logs option enabled: 

![<Enable Cloudwatch logs>](https://user-images.githubusercontent.com/8954908/34353394-e604f5b6-ea7b-11e7-9137-6a0ed4d7546d.png)

4. Access the API gateway several times, go through the log group which is named as: 

     API-Gateway-Execution-Logs_{rest-api-id}/{stage_name}

The logs are very detail and useful for serverless developers to troubleshooting a problem in api gateway, especially when you have error `{"message": "Internal server error"}`

## Custom access logging

On Nov 21, 2017, [aws announced a new logging for API Gateway](http://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-logging.html), that you can custom logs with the data you want to collect. 

So far I have not seen any documents about how to configure API gateway access logging via Cloudformation or Serverless Framework, you have to manually enable it.

1. Create a log group, such as `/aws/apigateway/serverrless-dev-access-logs`

2. add the log group

Choice the api gateway you created, go to stages ==> staging name ==> logs, add the log group as below format

    arn:aws:logs:ap-southeast-2:123456789012:log-group:/aws/apigateway/serverless-dev-access-logs

3. set log format

you can insert an example directly, for example, enable a JSON template.

>{ "requestId":"$context.requestId", "ip": "$context.identity.sourceIp", "caller":"$context.identity.caller", "user":"$context.identity.user","requestTime":"$context.requestTime", "httpMethod":"$context.httpMethod","resourcePath":"$context.resourcePath", "status":"$context.status","protocol":"$context.protocol", "responseLength":"$context.responseLength" }

![Custom Access Logging](https://user-images.githubusercontent.com/8954908/34325485-ee0adffa-e8e6-11e7-9f06-0e9a41d6ea0d.png)

Save changes, access the api gateway, you will get logs in the log group you created

A sample log from above template:

    {
        "requestId": "849692fd-dd97-11e7-aaa1-c304949351c6",
        "ip": "12.123.1.2",
        "caller": "-",
        "user": "abc",
        "requestTime": "10/Dec/2017:10:47:29 +0000",
        "httpMethod": "POST",
        "resourcePath": "/create/id",
        "status": "200",
        "protocol": "HTTP/1.1",
        "responseLength": "18193"
    }

These logs will be very useful for business to analyze how many users are accessing the api gateway, their source IPs, access time, success or deny access, etc. You can adjust in the template depend on business requirements. For more information, see [Accessing the $context Variable](http://docs.aws.amazon.com/apigateway/latest/developerguide/api-gateway-mapping-template-reference.html#context-variable-reference).
