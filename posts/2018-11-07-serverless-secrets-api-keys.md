---
title: Managing secrets, API keys and more with Serverless
description: Use Lambda environment variables and AWS Parameter Store to handle configuration in your Serverless projects
date: 2017-11-07
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

A better option is to use the [Serverless Framework Pro Dashboard](https://app.serverless.com) Parameters feature. If you are already using Serverless Framework Pro for monitoring your Serverless Services, it makes sense to use the same tool to help you centrally maintain your secrets. And this can be very easily done across stages (or environments) as well.

When you have logged into your `org` on the dashboard, click on 'profiles' in the top left, then either choose from an existing profile you already assign to a particular stage or create a new one. Once you have opened a profile, you will see a tab labelled parameters. It is here that you can then add whatever parameter you like for that deployment profiles stage. You can then repeat that for any other stage that your services may need and add the values specific to that stage.

But how does this work? Well, within our `serverless.yml` we can reference those parameters using the `${param:keyname}` syntax. And then, on deployment time, the Serverless Framework will read the values from our Serverless Pro configuration and replace the variable syntax with the actual values.

```yml
...
  environment:
    MY_DASHBOARD_PARAM: ${param:nameOfKey}
...
```
![Video of process to add new param](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/secrets-api-keys/secrets-api-keys.gif)

#### Managing Secrets for Larger Projects and Teams

The methods mentioned above work well for certain types of projects. However, there are two different areas that may cause problems.

First, environment variables are inserted into your Lambda function as plain-text. This may be unacceptable for security purposes.

Second, environment variables are set at _deploy time_ rather than being evaluated at _run time_. This can be problematic for configuration items that change occasionally. This is even more painful if the same config item is used across multiple functions, such as a database connection string. If you need to change the configuration item for any reason, you'll need to redeploy all of the services that use that configuration item. This can be a nightmare.

If this is the case, I would recommend using AWS Parameter Store to handle your secrets. It's very simple to use and allows for nice access controls on who and what is allowed to access certain secrets.

However, you'll have to write code within your Lambda handler to interact with Parameter Store—you can't use the easy shorthand from the Serverless Framework.

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

We have [another blog post](https://serverless.com/blog/aws-secrets-management) that goes into even more detail about secrets management and if you are looking for more information I would recommend reading that one as well.
