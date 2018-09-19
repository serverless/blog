---
title: "How to write your first Serverless Component"
description: "A step-by-step tutorial for writing your first Serverless Component, and then using it to build a serverless application."
date: 2018-06-02
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components.gif
category:
  - guides-and-tutorials
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/components/serverless-components.gif'
authors:
  - RupakGanguly
---

The open-source [Serverless Components project](https://github.com/serverless/components) makes it easy for anyone to author their own application components. We have [several previous posts](#more-serverless-components-tutorials).

But what if you want to try building a brand new reusable component of your own?

In this post, we will cover how to build your very first Serverless Component. Specifically, we'll be making an AWS CloudWatch Metric Alarm component from scratch.

The component will provision and encapsulate functionality for managing a CloudWatch metric alarms. We'll then use this component in an application that tracks AWS billing and sets alarms for estimated charges.

The goal here is two-fold: streamline the complexity of provisioning metric alarms, and provide an intuitive interface via well-defined inputs and outputs that can be reused to build applications and higher-order components.

Ready? Awesome.

What we will cover:

* Defining the reasoning for the component
* Defining the configuration
* Defining the input and output parameters
* Implementing the component
* Using the component in an example application
* Running the application

#### The CloudWatch Metric Alarm Component

We will build a `aws-cloudwatch-metric-alarm` component to create AWS CloudWatch alarms on metrics based on various conditions that are supported by AWS.

A Serverless Component consists of two files: `serverless.yml` for configuration and `index.js` for implementation code.

##### Configuration

To start off, let's create a `serverless.yml` file:

```bash
$ mkdir aws-cloudwatch-metric-alarm && cd aws-cloudwatch-metric-alarm
$ touch serverless.yml
```
Open the file in your favorite editor.

We will start by specifying some basic metadata about the component, like so:

```yml
# serverless.yml

type: aws-cloudwatch-metric-alarm
version: 0.1.0
core: 0.2.x

description: "Provision AWS CloudWatch Metric Alarms"
license: Apache-2.0
author: "Serverless, Inc. <hello@serverless.com> (https://serverless.com)"
repository: "github:serverless/components"
```

Let's go over what all of this does. The `type` attribute identifies the component. This will be used later in our example app to reference the component.

The `version` attribute is the current version of our component following semantic versioning. The `core` specifies the release version of Serverless Components we are using. It is helpful to fix a version against which our component has been built and tested.

The next block is quite intuitive and describes some other metadata for the component. Since I will merge this component to the main [Serverless Component registry](https://github.com/serverless/components/tree/master/registry), I have the `author` and `repository` attributes set accordingly.

##### Input Parameters

To create a component that can provide functionality in a flexible manner, Serverless Components has a concept of declaring `inputTypes`. This defines the spec for the component's input parameters.

When we write our example app that uses this component, the system will validate the user-supplied input parameters against this spec. We will see the validation at work later in the post.

In our case, we will be using the [AWS CloudWatch API](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html) to [create/update](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putMetricAlarm-property) alarms, [list](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#describeAlarms-property) alarms and [delete](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#deleteAlarms-property) alarms.

So let's start by defining our `inputTypes` that match the CloudWatch APIs.

Append the following block to the `serverless.yml` file:

```yml
# serverless.yml

...
inputTypes:
  alarmName:
    type: string
    required: true
    description: "The name for the alarm. This name must be unique within the AWS account."
  alarmDescription:
    type: string
    description: "The description for the alarm."
  comparisonOperator:
    type: string
    required: true
    description: "The arithmetic operation to use when comparing the specified statistic and threshold. Valid values are: `GreaterThanOrEqualToThreshold` | `GreaterThanThreshold` | `LessThanThreshold` | `LessThanOrEqualToThreshold`"
  threshold:
    type: number
    required: true
    description: "The value against which the specified statistic is compared."
  metricName:
    type: string
    required: true
    description: "The name for the metric associated with the alarm."
  namespace:
    type: string
    required: true
    description: "The namespace for the metric associated with the alarm."
  dimensions:
    type: object[]
    required: true
    description: "The dimensions for the metric associated with the alarm."
  period:
    type: integer
    required: true
    description: "The period, in seconds, over which the specified statistic is applied. Valid values are 10, 30, and any multiple of 60, max: 86400.)"
  evaluationPeriods:
    type: integer
    required: true
    description: "The number of periods over which data is compared to the specified threshold."
  actionsEnabled:
    type: boolean
    description: "Indicates whether actions should be executed during any changes to the alarm state."
  okActions:
    type: string[]
    description: "The actions to execute when this alarm transitions to an `OK` state from any other state. Each action is specified as an Amazon Resource Name (ARN)."
  alarmActions:
    type: string[]
    description: "The actions to execute when this alarm transitions to the `ALARM` state from any other state. Each action is specified as an Amazon Resource Name (ARN)."
  insufficientDataActions:
    type: string[]
    description: "The actions to execute when this alarm transitions to the `INSUFFICIENT_DATA` state from any other state. Each action is specified as an Amazon Resource Name (ARN)."
  statistic:
    type: string
    description: "The statistic for the metric associated with the alarm, other than percentile. Valid values are: `SampleCount` | `Average` | `Sum` | `Minimum` | `Maximum`. Either `statistic` or `extendedStatistic`, but not both."
  extendedStatistic:
    type: string
    description: "The percentile statistic for the metric associated with the alarm. Specify a value between p0.0 and p100. Either `statistic` or `extendedStatistic`, but not both."
  unit:
    type: string
    description: "The unit of measure for the statistic. Valid values are: `Seconds` | `Microseconds` | `Milliseconds` | `Bytes` | `Kilobytes` | `Megabytes` | `Gigabytes` | `Terabytes` | `Bits` | `Kilobits` | `Megabits` | `Gigabits` | `Terabits` | `Percent` | `Count` | `Bytes/Second` | `Kilobytes/Second` | `Megabytes/Second` | `Gigabytes/Second` | `Terabytes/Second` | `Bits/Second` | `Kilobits/Second` | `Megabits/Second` | `Gigabits/Second` | `Terabits/Second` | `Count/Second` | `None`"
  datapointsToAlarm:
    type: int
    description: "The number of datapoints that must be breaching to trigger the alarm."
  treatMissingData:
    type: string
    description: "Sets how this alarm is to handle missing data points. Valid values are: `breaching` | `notBreaching` | `ignore` | `missing`"
  evaluateLowSampleCountPercentile:
    type: string
    description: "Used only for alarms based on percentiles. Valid values are: `evaluate` | `ignore`"

```
Ya I know, it is quite verbose, but that's how many parameters are in the API.

##### Output Parameters

Just like `inputTypes`, Serverless Components also have a concept of declaring `outputTypes`. This is the spec for the component's outputs that it exposes.

Let's start by defining our `outputTypes` that match some of the important and relevant outputs from the calls to the CloudWatch APIs.

The outputs that you expose from your component is totally your choice. The point to keep in mind is that the component will be used later to build higher-order components and applications. So choose to expose outputs that will make sense later on. So for example, we expose the `alarmArn` output parameter, that can be passed into another component to do something with the alarm.

Append the following block to the `serverless.yml` file:

```yml
# serverless.yml

...
outputTypes:
  alarmName:
    type: string
    description: "The name for the alarm. This name must be unique within the AWS account."
  alarmArn:
    type: string
    description: "The Amazon Resource Name (ARN) of the alarm."
  alarmConfigurationUpdatedTimestamp:
    type: string
    description: "The time stamp of the last update to the alarm configuration."
  stateValue:
    type: string
    description: "The state value for the alarm."
  stateReason:
    type: string
    description: "An explanation for the alarm state, in text format."
  stateUpdatedTimestamp:
    type: string
    description: "The time stamp of the last update to the alarm state."
```

Notice that we use names for the input and output parameters that match the AWS API. The only subtle difference is that the AWS API uses CamelUpperCase whereas Serverless Components use camelCase. However this small transformation can be easily automated in code.

##### Documentation

Notice that the `inputTypes` and `outputTypes` have a nice format where it is easy to understand each parameter and is self-documenting. The system will use this information to automatically generate documentation for the README file.

Speaking of which, let's create a README.md file.

For auto-generating documentation for the input/output parameters, paste the following markers into your README file:

```
# README.md

# CloudWatch Metric Alarm component

The component encapsulates the functionality to manage provisioning of a CloudWatch Metric Alarm on the AWS cloud.

<!-- AUTO-GENERATED-CONTENT:START (TOC) -->

<!-- AUTO-GENERATED-CONTENT:END -->


<!-- AUTO-GENERATED-CONTENT:START (COMPONENT_INPUT_TYPES) -->

<!-- AUTO-GENERATED-CONTENT:END -->


<!-- AUTO-GENERATED-CONTENT:START (COMPONENT_OUTPUT_TYPES) -->

<!-- AUTO-GENERATED-CONTENT:END -->

## Example
...

```
The auto-doc generation capability is invoked by running `npm run docs` from the root of the Serverless Components project folder.

**Note:** Since our component is outside the Serverless Components project structure, you will have to temporarily copy your component under the `registry` folder of the Serverless Components project repo, and then run:

```bash
$ npm run docs
```

This will generate the required documentation and place them between the markers we added in the README.ms file. Check out the [README.md](https://github.com/rupakg/rg-components/blob/master/rg-registry/aws-cloudwatch-metric-alarm/README.md) file for the final documentation.

##### Implementation

Now that we have defined the input/output interface, let's look at the implementation for our component. Serverless Components lay down a contract for implementing provisioning, listing status and cleanup logic.

##### Commands

The provisioning functionality is implemented via the `deploy` command while the cleanup functionality is implemented via the `remove` command. The `info` command is for listing out resources or output parameters after provisioning.

The underlying system is set to call the `info` command automatically after the `deploy` command is executed. When there are higher-order components or applications that are composed of other components, the `deploy`, `info` and `remove` commands are called down the full dependency chain.

Apart from these three commands, a component author can include other commands. These are JS methods that are exported and available to the user as commands from the CLI.

The implementation code will live in the `index.js` file. Let's create the file in our project folder:

```bash
$ touch index.js
```
Open the file in your favorite editor.

Let's build these three commands for our component.

##### Provision Alarm

We will add the provisioning logic for the CloudWatch Metric Alarm in the `deploy` method. In the `index.js` file, let's create a method named `deploy`.

Add the following code to the file:

```js
# index.js

...
const deploy = async (inputs, context) => {
  let outputs = context.state

  if (!context.state.alarmName && inputs.alarmName) {
    context.log(`Creating CloudWatch Metrics Alarm: '${inputs.alarmName}'`)
    await putMetricAlarm(inputs)
    outputs = await describeAlarmsForMetric(inputs)
  }
  context.saveState({ ...inputs, ...outputs })
  return outputs
}
...
```

Let's look at the signature of the `deploy` method. It takes two parameters, `inputs` and `context`. The system packs the input parameters from the `serverless.yml` and passes them via the `inputs` parameter. The system packs some other valuable information via the `context` parameter. We will go over `context` later in the post.

The above command calls two helper methods: `putMetricAlarm(inputs)` and `describeAlarmsForMetric(inputs)`. The `putMetricAlarm(inputs)` method calls the CloudWatch [putMetricAlarm](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#putMetricAlarm-property) API method. It creates or updates an existing metric alarm. This API call does not return any information about the alarm that is provisioned.

Next, the `describeAlarmsForMetric(inputs)` method calls the CloudWatch [describeAlarms](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#describeAlarms-property) API method. This method returns information about the alarm provisioned by the earlier call.

The call to `context.saveState({ ...inputs, ...outputs })` saves the output as state. We will look at state management in detail later in the post.

##### List Alarm

We will add the code for listing the alarm that we just created, in the `info` method. In the `index.js` file, create a method named `info`. Add the following code to the file:

```js
# index.js

...
const info = async (inputs, context) => {
  if (!context.state.alarmName) return {}

  let outputs = context.state

  outputs = await describeAlarmsForMetric(inputs)
  context.saveState({ ...inputs, ...outputs })

  context.log(`Listing CloudWatch Metrics Alarm for '${context.state.alarmName}'`)
  console.log(
    '-------------------------------------------------------------------------------------'
  )
  console.log(`Metric Name: ${context.state.metricName}`)
  console.log(`Namespace: ${context.state.namespace}`)
  console.log(`Alarm Name: ${outputs.alarm.alarmName}`)
  console.log(`Alarm Arn: ${outputs.alarm.alarmArn}`)
  console.log(`Alarm State: ${outputs.alarm.stateValue}`)
  console.log(
    '-------------------------------------------------------------------------------------'
  )

  return outputs
}
...
```
The above `info` command calls the `describeAlarmsForMetric(inputs)` which in turn calls the [describeAlarms](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#describeAlarms-property) API to get information about the alarm that was provisioned in the `deploy` command.

The data is then written out to the log as output, and printed on the terminal.

##### Remove Alarm

We will add the code for deleting the alarm that we created, and cleanup any resources, in the `remove` method. In the `index.js` file, create a method named `remove`.

Add the following code to the file:

```js
# index.js

...
const remove = async (inputs, context) => {
  if (!context.state.alarmName) return {}

  try {
    context.log(`Removing CloudWatch Metrics Alarm: '${context.state.alarmName}'`)
    await deleteAlarm(context.state.alarmName)
  } catch (e) {
    if (!e.message.includes('Invalid Metric Alarm name specified')) {
      throw new Error(e)
    }
  }

  context.saveState()
  return {}
}
...
```
The `remove` command calls the `deleteAlarm(context.state.alarmName)` which in turn calls the CloudWatch [deleteAlarms](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/CloudWatch.html#deleteAlarms-property) API method, to delete the alarm that was provisioned earlier.

**Note:** You can view the full `index.js` file [here](https://github.com/rupakg/rg-components/blob/master/rg-registry/aws-cloudwatch-metric-alarm/index.js).

##### Context

Any method that is exported as a command is sent a `context` parameter for the method implementing the command. The `deploy()`, `remove()` and `info()` methods are such examples.

The system packs some valuable information via the `context` parameter, the most important ones being:

* Data structures: `state`, `options`, `children` and `archive`
* Functions: `load` and `saveState`

Let's look at each of these one at a time.

##### State Management

The system allows state management for components. The component author is in control of what gets saved as state.

The command methods can access the data stored in state via the `state` data structure. The component can look at the state of data and decide to execute different paths in logic. For instance, the `deploy` method can decide if the component needs to call the 'create'  or the 'update' logic.

##### The `saveState` method

You will notice that each command calls `context.saveState()` and optionally passes in some data that gets saved as state for the component. The system saves state for a component in the `state.json` file. We will look at the `state.json` file for our application later in the post.

In our component, the `deploy` command saves the relevant outputs to the state by calling the `context.saveState()` method.

##### Options

The CLI allows for passing in any command-line options and passes it in the `options` data structure, via the `context` to the command methods. For e.g. the `aws-dynamodb` component exposes an `insert` command that takes a few command-line options to insert data into a DynamoDB table.

```bash
$ components insert --tablename BlogPost --itemdata '{ "some":"data" }'
```

##### Children

Higher-order components or applications can be composed of child components. The `context` gives access to the child components via the `children` object. The `children` object can be used to call commands exposed by the child components.

For example, the [retail-app](https://github.com/serverless/components/tree/master/examples/retail-app)'s `deploy` command accesses the child component `aws-dynamodb`'s `insert` command to insert seed data.

```js
# index.js

const productsDb = await context.children.productsDb
...
...
const insertItem = (triesLeft, wait) => (product) =>
        productsDb.fns
          .insert(productsDb.inputs, {
            log: context.log,
            state: productsDb.state,
            options: {
              tablename,
              itemdata: product
            }
          })
          ...

```
Also, the system automatically figures out the dependency tree for your components' children. It has also built-in safeguards against accidental [circular-dependency](https://github.com/serverless/components/tree/master/examples/features/circular-dependencies) errors.

You can see how powerful and flexible Serverless Components can be.

##### The `load` method

The `context` also exposes a `load` method, which allows you to load a component programatically inside another component or an application. For instance, the `aws-lambda` component's `deploy` command, loads the child component `aws-iam-role` programmatically to provision an IAM role.

```js
# index.js

async function deploy(inputs, context) {
  ...
  ...

  const defaultRoleComponent = await context.load('aws-iam-role', 'defaultRole', {
    name: `${inputs.name}-execution-role`,
    service: 'lambda.amazonaws.com'
  })
  ...
  ...
```
Although the component we created here was all declarative, but you can see how powerful Serverless Components can be considering that a higher-order component or an application can be entirely written programmatically.

Hope this leaves you with enough information to create your own components!

Now that we have written our component, let's use it to build an application.

**Note:** You can find the full code for the `aws-cloudwatch-metric-alarm` component [here](https://github.com/rupakg/rg-components/blob/master/rg-registry/aws-cloudwatch-metric-alarm).

#### The Billing Alarm Application

We will use the `aws-cloudwatch-metric-alarm` component we just built to create a serverless application, `cw-billing-alarm-app`, that will trigger an alarm for AWS Billing based on our configured settings. It will also send us an email when the alarm is triggered.

The application is declaratively composed using the `cw-billing-alarm-app` component, and has no implementation of its own. Hence, we only have a `serverless.yml` configuration file to specify the component and its inputs.

##### File System Components

Serverless Components that are sourced from the [main registry](https://github.com/serverless/components/tree/master/registry), can be referenced by their `type` name. By default, the component will be loaded from the registry.

To make local development easy, Serverless Components have a feature of specifying a local folder as a value to the `type` attribute. In that case, the component will be [loaded from the file system](https://github.com/serverless/components/tree/master/examples/features/file-system-components).

In our application's `serverless.yml` file, we reference the `aws-cloudwatch-metric-alarm` component from the local folder like so:

```yml
# serverless.yml

...
type: ../../rg-registry/aws-cloudwatch-metric-alarm
...
```

##### Inputs

Based on the `inputTypes` defined in the `aws-cloudwatch-metric-alarm` component, we will add `inputs` to the component in our application's `serverless.yml` file. Let's create a `serverless.yml` file in the application folder and add the following code to it:

```bash
$ mkdir cw-billing-alarm-app && cw-billing-alarm-app
$ touch serverless.yml
```

```yml
# serverless.yml

type: cw-billing-alarm-app
version: 0.0.1

components:
  billingAlarm:
    type: ../../rg-registry/aws-cloudwatch-metric-alarm
    inputs:
      alarmName: rg-billing-alarm-${self.serviceId}
```
The `${self.serviceId}` is an unique identifier autogenerated by the system. You can always use your own value, but with this identifier in place you can create as many apps as you want by copying the configuration.

##### Input/Output Parameter Validation

If you inspect the `inputTypes` that we defined for our `aws-cloudwatch-metric-alarm` component, you will notice that there are several `required` input parameters. To safe-guard against non-compliance with the requrements, the system will automatically validate the applications `inputs` against the spec for the given component.

Notice that we have only included the `alarmName` parameter under the `inputs` section. If you run the `deploy` command you will see teh validation in action:

```
$ components deploy

Error:
Type error in component "billingAlarm"
 - Input comparisonOperator has `undefined` value of "undefined" but expected the following: required true.
 - Input threshold has `undefined` value of "undefined" but expected the following: required true.
 - Input metricName has `undefined` value of "undefined" but expected the following: required true.
 - Input namespace has `undefined` value of "undefined" but expected the following: required true.
 - Input dimensions has `undefined` value of "undefined" but expected the following: required true.
 - Input period has `undefined` value of "undefined" but expected the following: required true.
 - Input evaluationPeriods has `undefined` value of "undefined" but expected the following: required true.
...
```

Let's quickly fix that by passing in input parameters that will remove the errors. Replace the entries in the `serverless.yml` file with the following code:

```
# serverless.yml

type: cw-billing-alarm-app
version: 0.0.1

components:
  billingAlarm:
    type: ../../rg-registry/aws-cloudwatch-metric-alarm
    inputs:
      alarmName: rg-billing-alarm-${self.serviceId}
      alarmDescription: 'When Estimated Charges > $20'
      comparisonOperator: GreaterThanOrEqualToThreshold
      threshold: 20.0
      metricName: EstimatedCharges
      namespace: AWS/Billing
      dimensions:
        - name: 'Currency'
          value: 'USD'
      period: 28800 # 8 hrs
      evaluationPeriods: 1
      actionsEnabled: true
      alarmActions:
        - arn:aws:sns:us-east-1:xxxxxxxxxx:NotifyMe
      statistic: Maximum
      treatMissingData: missing
```

The `alarmActions` attribute points to a pre-configured SNS topic that points to an email address of your choosing.

##### Running the Application

To deploy the app, run the following in the terminal:

```bash
$ components deploy

Creating CloudWatch Metrics Alarm: 'rg-billing-alarm-43qnfm6uio'
Listing CloudWatch Metrics Alarm for 'rg-billing-alarm-43qnfm6uio'
-------------------------------------------------------------------------------------
Metric Name: EstimatedCharges
Namespace: AWS/Billing
Alarm Name: rg-billing-alarm-43qnfm6uio
Alarm Arn: arn:aws:cloudwatch:us-east-1:xxxxxxxxxx:alarm:rg-billing-alarm-43qnfm6uio
Alarm State: OK
-------------------------------------------------------------------------------------
```
As expected, the application calls the child components `deploy`, which in turn provisions the CloudWatch Metric Alarm. Then, it lists the alarms that it just provisioned.

The `info` command can be run anytime to list the alarms and get information about it. To list the alarms, run the following in the terminal:

```bash
$ components info

Listing CloudWatch Metrics Alarm for 'rg-billing-alarm-43qnfm6uio'
-------------------------------------------------------------------------------------
Metric Name: EstimatedCharges
Namespace: AWS/Billing
Alarm Name: rg-billing-alarm-43qnfm6uio
Alarm Arn: arn:aws:cloudwatch:us-east-1:xxxxxxxxxx:alarm:rg-billing-alarm-43qnfm6uio
Alarm State: OK
-------------------------------------------------------------------------------------
```
You can see the `outputs` in action. The `output` parameters are used to print the information about the alarm.

And, finally to clean up and remove all resources provisioned by the `deploy` command, run the following in the terminal:

```bash
$ components remove

Removing CloudWatch Metrics Alarm: 'rg-billing-alarm-43qnfm6uio'
```

In the deployed state of the application, whenever the AWS Billing estimated charges go beyond the configured amount, you will get an email as configured under the SNS topic.

##### Application State

We discussed that components manage their own state. Since our application is just a component in itself, it stores it's state in the `state.json` file, as shown below:

```json
{
  "$": {
    "serviceId": "43qnfm6uio"
  },
  "cw-billing-alarm-app": {
    "instanceId": "43qnfm6uio-cvkw0qhg"
  },
  "cw-billing-alarm-app:billingAlarm": {
    "type": "aws-cloudwatch-metric-alarm",
    "state": {
      "alarmName": "rg-billing-alarm-43qnfm6uio",
      "alarmDescription": "When Estimated Charges > $20",
      "comparisonOperator": "GreaterThanOrEqualToThreshold",
      "threshold": 20,
      "metricName": "EstimatedCharges",
      "namespace": "AWS/Billing",
      "dimensions": [
        {
          "Name": "Currency",
          "Value": "USD"
        }
      ],
      "period": 28800,
      "evaluationPeriods": 1,
      "actionsEnabled": true,
      "alarmActions": [
        "arn:aws:sns:us-east-1:xxxxxxxxxxx:NotifyMe"
      ],
      "statistic": "Maximum",
      "treatMissingData": "missing",
      "alarm": {
        "alarmName": "rg-billing-alarm-43qnfm6uio",
        "alarmArn": "arn:aws:cloudwatch:us-east-1:xxxxxxxxx:alarm:rg-billing-alarm-43qnfm6uio",
        "alarmConfigurationUpdatedTimestamp": "2018-05-25T19:06:33.562Z",
        "stateValue": "OK",
        "stateReason": "Threshold Crossed: 1 datapoint [20.0 (25/05/18 11:06:00)] was not greater than or equal to the threshold (20.0).",
        "stateUpdatedTimestamp": "2018-05-25T19:06:34.141Z"
      }
    },
    "instanceId": "43qnfm6uio-fcvgc9c2",
    "internallyManaged": false,
    "rootPath": "../../rg-registry/aws-cloudwatch-metric-alarm",
    "inputs": {
      "alarmName": "rg-billing-alarm-43qnfm6uio",
      "alarmDescription": "When Estimated Charges > $20",
      "comparisonOperator": "GreaterThanOrEqualToThreshold",
      "threshold": 20,
      "metricName": "EstimatedCharges",
      "namespace": "AWS/Billing",
      "dimensions": [
        {
          "Name": "Currency",
          "Value": "USD"
        }
      ],
      "period": 28800,
      "evaluationPeriods": 1,
      "actionsEnabled": true,
      "alarmActions": [
        "arn:aws:sns:us-east-1:xxxxxxxxx:NotifyMe"
      ],
      "statistic": "Maximum",
      "treatMissingData": "missing"
    }
  }
}
```
You will notice that our application does not have any state of its own, but includes the state of its child component `aws-cloudwatch-metric-alarm`. If it's relevant for an application to store its own state, it can do so as well.

**Note:** You can find the full source code for the `cw-billing-alarm-app` application [here](https://github.com/rupakg/rg-components/tree/master/rg-examples/cw-billing-alarm-app).

#### Summary

We created a Serverless component from scratch, defined the spec for it's input and output parameters, and implemented the functionality to create commands that provision, list and cleanup CloudWatch Metric Alarms.

We looked at some of the features that Serverless Components provide to make it easy to develop reusable components, that can be used to create higher-order components or applications, simply by composing other components.

At the end, we built an application that will trigger an alarm for AWS Billing estimated charges based on our configured settings. It will also send us an email when the alarm is triggered.

Hope you enjoyed creating your first Serverless Component and an exmaple application to go with it. If you have any follow-up questions, please hit me via the comments below. And, above all, I would like to hear what cool components and applications you built!

#### More Serverless Components tutorials

- [What are Serverless Components, and how do I use them?](https://serverless.com/blog/what-are-serverless-components-how-use/)
- [Create a REST API with pre-written Serverless Components](https://serverless.com/blog/how-create-rest-api-serverless-components/)
- [Create a static landing page with pre-written Serverless Components](https://serverless.com/blog/how-to-create-landing-page-with-serverless-components/)
- [Create a dynamic retail site with pre-written Serverless Components](https://serverless.com/blog/how-create-dynamic-website-with-serverless-components/)
- [Create a blog site with pre-written Serverless Components and Hugo](https://serverless.com/blog/how-to-create-blog-using-components-hugo/)

##### Roadmap

We are continuously adding features to Serverless Components, so be on the lookout for future updates via our newsletter, articles on our log and watch the Github repo. [Examples of features](https://github.com/serverless/components/tree/master/examples/features) are being added on a regular basis.
