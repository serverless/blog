---
title: Managing secrets, API keys and more with Serverless
description: Use Lambda environment variables and AWS Parameter Store to handle configuration in your Serverless projects
date: 2017-10-18
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/lock2.jpg
category:
  - guides-and-tutorials
  - operations-and-observability
heroImage: ''
authors:
  - AlexDeBrie
---

Serverless applications are often _service-full_ applications. This means you use hosted services to augment your applications—think DynamoDB for data storage or Mailchimp for sending emails.

When using other services in your Serverless applications, you often need configuration data to make your application work correctly. This includes things like API keys, resource identifiers, or other items.

In this post, we'll talk about a few different ways to handle these configuration items. This post covers:

- Using environment variables in your functions;
- Handling secrets for small Serverless projects; and
- Managing secrets for larger Serverless projects.

Let's get started!

#### Using Environment Variables with Lambda

When building my first web applications, Heroku's [12 Factor App](https://12factor.net/) was hugely influential—a set of twelve principles to deploy stateless, scalable web applications. I found many of them were directly applicable to Serverless applications.

One of the twelve factors was to [store config in your environment](https://12factor.net/config). It recommended using environment variables for config (e.g. credentials or hostnames) as these would be easy to change between deploys without changing code.

Lambda and Serverless provide support for environment variables, and I would recommend using them _in certain situations_. Check out the last section on managing secrets with large projects for when you shouldn't use environment variables and how you should approach configuration in those situations.

Let's do a quick example to see how environment variables work. Imagine you're making a Twitter bot that checks for tweets with certain hashtags and retweets them with slight changes, similar to the [Serverless Superman](https://twitter.com/serverlesssuper) bot. To post these retweets, you'll need to get an [access token](https://developer.twitter.com/en/docs/basics/authentication/guides/access-tokens.html) to sign your requests.

Once you have your access token, you'll need to make it accessible to your function. Let's see how that's done.

Create an empty directory, and add the following `serverless.yml`:

```yml
# severless.yml

service: env-variables

provider:
  name: aws
  runtime: python3.6
  stage: dev
  region: us-east-1
  environment:
    TWITTER_ACCESS_TOKEN: '1234abcd'

functions:
  superman:
    handler: superman.handler
    events:
      - schedule: rate(10 minutes)
```

This is a simple service with a single function, `superman`, which will run the code for the Serverless Superman bot. Notice in the `provider` section that we have an `environment` block -- these are the environment variables that will be added to our Lambda environment.

In Python, you'll be able to access these environment variables in the `os.environ` dictionary, where the key is the name of the environment variable. For our example above, this would look like:

```python
import os

access_token = os.environ['TWITTER_ACCESS_TOKEN']
```

In Javascript, you can access environment variables from the `process.env` object:

```javascript
const access_token = process.env.TWITTER_ACCESS_TOKEN
```

One final note: environment variables in the `provider` block are accessible to _all_ functions in the service. You can also scope environment variables on a per-function basis by adding environment variables under the `function` block.

For example, imagine you ran both the Serverless Superman and [Big Data Batman](https://twitter.com/BigDataBatman) Twitter bots. Because these are separate accounts, they would each have their own Twitter access tokens. You would structure it as follows:

```yml
# serverless.yml

service: env-variables

provider:
  name: aws
  runtime: python3.6
  stage: dev
  region: us-east-1

functions:
  superman:
    handler: superman.main
    events:
      - schedule: rate(10 minutes)
    environment:
      TWITTER_ACCESS_TOKEN: 'mySupermanToken'
  batman:
    handler: batman.main
    events:
      - schedule: rate(10 minutes)
    environment:
      TWITTER_ACCESS_TOKEN: 'myBatmanToken'
```

Now we have two functions—`superman` and `batman`—and each one has its unique access token for authenticating with Twitter. Success!

#### Handling Secrets for Small Teams & Projects

Now that we've got the basics down, let's dig a little deeper into handling secrets for your projects.

In the example above, the big problem is that our access token is in plaintext directly in our `serverless.yml`. This is a sensitive secret that we don't want to commit to source control.

A better option is to use [AWS Parameter Store](http://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-paramstore.html) to store your secrets. This is a new service provided by AWS that acts as a centralized config store for your applications. It's quickly becoming a popular way to manage secrets—check out [this post from Segment](https://segment.com/blog/the-right-way-to-manage-secrets/) on how and why you should use it.

We added [integration with Parameter Store](https://github.com/serverless/serverless/pull/4062) (also known as SSM, for Simple Systems Manager) with version 1.22 of the Serverless Framework. This means you can refer to SSM parameters directly in `serverless.yml` using the following syntax:

```yml
...
  environment:
    MY_API_SECRET: ${ssm:nameOfKey}
...
```

Let's apply this to our previous example. Use the [AWS CLI](https://aws.amazon.com/cli/) to store two new SSM parameters—one for the Serverless Superman bot and one for the Big Data Batman bot:

```bash
aws ssm put-parameter --name supermanToken --type String --value mySupermanToken
aws ssm put-parameter --name batmanToken --type String --value myBatmanToken
```

The `name` is how you identify the key you want, and the `value` is the configuration value that you want to store.

Then, we update our `serverless.yml` to refer to these SSM parameters:

```yml
# serverless.yml

service: env-variables

provider:
  name: aws
  runtime: python3.6
  stage: dev
  region: us-east-1

functions:
  superman:
    handler: superman.main
    events:
      - schedule: rate(10 minutes)
    environment:
      TWITTER_ACCESS_TOKEN: ${ssm:supermanToken}
  batman:
    handler: batman.main
    events:
      - schedule: rate(10 minutes)
    environment:
      TWITTER_ACCESS_TOKEN: ${ssm:batmanToken}
```

Awesome! Now when we run `sls deploy`, the Serverless Framework will grab those values from the Parameter Store and inject them into our functions as environment variables. Now we can commit our `serverless.yml` to source control without fear of exposing our credentials.

#### Managing Secrets for Larger Projects and Teams

The methods mentioned above work well for certain types of projects. However, there are two different areas that may cause problems.

First, environment variables are inserted into your Lambda function as plain-text. This may be unacceptable for security purposes.

Second, environment variables are set at _deploy time_ rather than being evaluated at _run time_. This can be problematic for configuration items that change occasionally. This is even more painful if the same config item is used across multiple functions, such as a database connection string. If you need to change the configuration item for any reason, you'll need to redeploy all of the services that use that configuration item. This can be a nightmare.

If this is the case, I would still recommend using AWS Parameter Store to handle your secrets. It's very simple to use and allows for nice access controls on who and what is allowed to access certain secrets.

However, you'll have to write code with your Lambda handler to interact with Parameter Store—you can't use the easy shorthand from the Serverless Framework.

Here's an example of how you would get a configuration value from SSM in your Lambda function in Python:

```python
import boto3

client = boto3.client('ssm')


def get_secret(key):
	resp = client.get_parameter(
		Name=key,
		WithDecryption=True
	)
	return resp['Parameter']['Value']

access_token = get_secret('supermanToken')
database_connection = get_secret('databaseConn')
```

We create a simple helper utility that wraps a Boto3 call to the Parameter Store and returns the value for a requested secret. Then we can easily call that helper function by providing the name of the secret we want.

#### Other considerations

This is just scratching the surface of handling configuration in a larger Serverless project. Another issue you'll want to consider is refreshing your config within a particular Lambda container. Because a Lambda instance can be reused across many function invocations, you'll want to periodically refresh the configuration in case it changed since the instance was initially started.

Yan Cui has [written a more detailed post](https://hackernoon.com/you-should-use-ssm-parameter-store-over-lambda-env-variables-5197fc6ea45b) on this and other aspects of managing secrets in a larger Serverless project. I would recommend reading that (and all of Yan's other pieces!) for additional information.
