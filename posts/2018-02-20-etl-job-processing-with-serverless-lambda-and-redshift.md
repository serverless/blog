---
title: ETL job processing with Serverless, Lambda, and AWS Redshift
description: Build an ETL job service by fetching data from a public API endpoint and dumping it into an AWS Redshift database.
date: 2018-02-20
thumbnail: https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/redshift.png
category:
  - operations-and-observability
  - guides-and-tutorials
authors:
  - RupakGanguly
---

One of the big use cases of using serverless is ETL job processing: dumping data into a database, and possibily visualizing the data.

In this post, I'll go over the process step by step. We'll build a serverless ETL job service that will fetch data from a public API endpoint and dump it into an AWS Redshift database. The service will be scheduled to run every hour, and we'll visualize the data using Chart.io.

At Serverless Inc., we use ETL jobs just like this for tracking metrics across an array of data points (though feel free to modify the one I'll show here to fit your own needs).

Let's get to it.

What we will cover:

* Prerequisites
* Creating the ETL job service
* Deploying and scheduling the job
* Visualizing the data


## Prerequisites

Before we begin, you'll need the [Serverless Framework installed](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) with an AWS account set up. Your version of Serverless must be 1.25 or higher to take advantage of all the latest updates.

### AWS Redshift

Setting up AWS Redshift is out of the scope of this post, but you'll need one set up to dump data into it from our ETL job. Once you have it set up and configured, keep the cluster endpoint in Redshift handy, as we will need it later to configure the database connection string.

Redshift cluster endpoint:

`<cluster_name>.xxxxxxxxxxxx.<region>.redshift.amazonaws.com:<port>`

DB connection string:

`postgres://<username>:<password>@<hostname>:<port>/<db_name>`
where `<hostname>:<port>` is the cluster endpoint.


## Building the ETL job service

My previous projects were in Node.js, but I'm going to write this in Python because I have recently started to play with Python. And, (to the chagrin ofmy colleague [Alex DeBrie](https://twitter.com/alexbdebrie) I love it! But you can write this in any language you want.

Let's create a new Serverless project from a template. Use the `sls create` command and change into that directory:

```bash
$ sls create -t aws-python3 -p serverless-etl
$ cd serverless-etl
```

Next, let's install some required dependencies.

We'll use the `serverless-python-requirements` plugin for handling our Python packages on deployment:

```bash
$ npm install --save-dev serverless-python-requirements
```

**Note:** If you want a deeper dive on the `serverless-python-requirements` plugin, check out our previous post on [handling Python packaging with Serverless](https://serverless.com/blog/serverless-python-packaging/).

With the dependencies out of the way, let's get started. Replace the `serverless.yml` file contents with the following `yaml` code:

```yml
service: sample-etl

plugins:
  - serverless-python-requirements

custom:
  pythonRequirements:
    dockerizePip: non-linux
  dbConn: ${ssm:/ETL/RedshiftConn~true}

provider:
  name: aws
  runtime: python3.6
  region: us-west-2
  timeout: 300
  environment:
    DB_CONN: ${self:custom.dbConn}
  vpc:
    securityGroupIds:
      - sg-xxxxxxx
    subnetIds:
      - subnet-xxxxxxx
  iamRoleStatements:
    - Effect: Allow
      Action:
        - "ec2:CreateNetworkInterface"
      Resource: "*"

functions:
  etlSample:
    handler: handler.main
    events:
      - schedule: rate(1 hour)
```

Let's review the above `serverless.yml` configuration for our service.

We need to specify the connection string to the Redshift postgres database. You'll notice I have used the AWS Parameter Store (SSM) to store the connection string for obvious security reasons:

```yml
custom:
  ...
  dbConn: ${ssm:/ETL/RedshiftConn~true}
```

**Note:** For a detailed explanation of secrets management strategies, check out our previous post on [managing secrets, API keys and more with Serverless](https://serverless.com/blog/serverless-secrets-api-keys/).

Since Redshift is secured by running under a VPC, you'll need to supply the appropriate security groups, subnets, and IAM roles like so:

```yml
  ...
  vpc:
    securityGroupIds:
      - sg-xxxxxxx
    subnetIds:
      - subnet-xxxxxxx

  iamRoleStatements:
    - Effect: Allow
      Action:
        - "ec2:CreateNetworkInterface"
      Resource: "*"
  ...
```

### Using a Public API

To keep it simple, I wanted to use a free, public API without any authentication.

We'll be using the [CoinMarketCap API](https://coinmarketcap.com/api/). Bitcoin is in peak hype, and I thought it would be interesting to see the metrics over time.

### Fetch data and stash into Redshift

Now that we have our configuration set, let's replace the `handler.py` file with the following code:

```python
# handler.py

import datetime
import json
import logging
import os
import pprint
from datetime import date

import requests
from sqlalchemy import create_engine, MetaData, text, Table, Column, Integer, String, DateTime, Boolean, Numeric

SAMPLE_ENDPOINT = "https://api.coinmarketcap.com/v1/ticker"
DB_CONN=os.environ.get('DB_CONN')

#### Raw API calls
def get_data(limit):
    payload = {
      'limit': limit
    }

    resp = requests.get(SAMPLE_ENDPOINT, params=payload)
    resp.raise_for_status()
    data = resp.json()

    return data

def cleanup(item):
    return {
        "name": item.get("name", ''),
        "symbol": item.get("symbol", ''),
        "rank": int(item.get("rank", 0)),
        "price_usd": float(item.get("price_usd", 0.0)),
        "24h_volume_usd": float(item.get("24h_volume_usd", 0.0)),
        "total_supply": float(item.get("total_supply", 0.0)),
        "percent_change_1h": float(item.get("percent_change_1h", 0.0)),
        "last_updated": make_datetime(int(item.get("last_updated", 0))),
    }

#### util methods
def make_datetime(timestamp):
    return datetime.datetime.fromtimestamp(timestamp / 1000)


# SQL Tables
metadata = MetaData()

sample_table = Table('sample_coinmarketcap', metadata,
    Column('name', String(100), nullable=True),
    Column('symbol', String(100), nullable=True),
    Column('rank', Integer, nullable=True),
    Column('price_usd', Numeric, nullable=True),
    Column('24h_volume_usd', Numeric, nullable=True),
    Column('total_supply', Numeric, nullable=True),
    Column('percent_change_1h', Numeric, nullable=True),
    Column('last_updated', DateTime, nullable=False)
)

def init_tables(engine):
    sample_table.drop(engine, checkfirst=True)
    metadata.create_all(engine)

def main(event, context):

    # get sample data
    data = get_data(5)

    sample_data = [cleanup(item)
                    for item in data]

    engine = create_engine(DB_CONN)
    init_tables(engine)
    conn = engine.connect()

    conn.execute(sample_table.insert().values(sample_data))

    pprint.pprint(sample_data)


if __name__ == "__main__":
    main(None, None)

```

Let's review the code.

We start by importing the required libraries, and specifically we are using the [SqlAlchemy](https://www.sqlalchemy.org/) library to work with postgres.

The `get_data()` method accesses the API to fetch the data for bitcoin. The `cleanup()` method is a helper method to filter out only the fields from the API that we need.

In the following code segment, we define the schema for the `sample_coinmarketcap`:

```python
...
metadata = MetaData()

sample_table = Table('sample_coinmarketcap', metadata,
    Column('name', String(100), nullable=True),
...
```

In the `init_tables()` method, we first drop the table if it exists, and then create the table, if it does not exist. We are dropping the table each time because we want to store the latest set of data every time we process. If instead you want to append data to the table, do not drop the table.

Finally, the `main()` method brings it all together by fetching data and inserting the data into the database.

You can review the full source code at the [serverless-etl](https://github.com/rupakg/serverless-etl) Github repo.

## Test the job service

Before we deploy the service, let's test the service to see if our code is functioning properly. Since we're mainly concerned with testing whether or not our API call gets us the required data correctly, we'll comment out the database-related code for now.

Comment out the code in the `main()` method as shown below:

```python
# handler.py

...
def main(event, context):

    # get sample data
    data = get_data(5)

    sample_data = [cleanup(item)
                    for item in data]

    # engine = create_engine(DB_CONN)
    # init_tables(engine)
    # conn = engine.connect()
    #
    # conn.execute(sample_table.insert().values(sample_data))

    pprint.pprint(sample_data)
...
```

To test locally, simply do:

```bash
$ sls invoke local -f etlSample
```

The output is shown below:

```json

[{
    '24h_volume_usd': 8529300000.0,
    'last_updated': datetime.datetime(1970, 1, 18, 13, 55, 9, 567000),
    'name': 'Bitcoin',
    'percent_change_1h': 2.01,
    'price_usd': 11077.9,
    'rank': 1,
    'symbol': 'BTC',
    'total_supply': 16870925.0
  },
  {
    '24h_volume_usd': 2510770000.0,
    'last_updated': datetime.datetime(1970, 1, 18, 13, 55, 9, 551000),
    'name': 'Ethereum',
    'percent_change_1h': 0.7,
    'price_usd': 975.651,
    'rank': 2,
    'symbol': 'ETH',
    'total_supply': 97679773.0
  },
  {
    '24h_volume_usd': 1172320000.0,
    'last_updated': datetime.datetime(1970, 1, 18, 13, 55, 9, 541000),
    'name': 'Ripple',
    'percent_change_1h': 0.96,
    'price_usd': 1.21,
    'rank': 3,
    'symbol': 'XRP',
    'total_supply': 99992725510.0
  },
  {
    '24h_volume_usd': 663760000.0,
    'last_updated': datetime.datetime(1970, 1, 18, 13, 55, 9, 553000),
    'name': 'Bitcoin Cash',
    'percent_change_1h': 0.78,
    'price_usd': 1547.14,
    'rank': 4,
    'symbol': 'BCH',
    'total_supply': 16973175.0
  },
  {
    '24h_volume_usd': 865458000.0,
    'last_updated': datetime.datetime(1970, 1, 18, 13, 55, 9, 542000),
    'name': 'Litecoin',
    'percent_change_1h': 0.19,
    'price_usd': 230.273,
    'rank': 5,
    'symbol': 'LTC',
    'total_supply': 55263408.0
  }
]
```

Now that all the data we want looks good, we can deploy our service.


### Deploy and schedule the job

Before we deploy, **remember to uncomment the database code that we commented above**.

Once that's done, deploy the ETL job service:

```bash
$ sls deploy

Serverless: WARNING: You provided a docker related option but dockerizePip is set to false.
Serverless: Installing required Python packages with python3.6...
Serverless: Linking required Python packages...
Serverless: Packaging service...
Serverless: Excluding development dependencies...
Serverless: Unlinking required Python packages...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Uploading service .zip file to S3 (6.78 MB)...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
.........
Serverless: Stack update finished...
Service Information
service: sample-etl
stage: prod
region: us-west-2
stack: sample-etl-prod
api keys:
  None
endpoints:
  None
functions:
  etlSample: sample-etl-prod-etlSample
```

This will set up our ETL job service in AWS to run as per the specified schedule. In our case, the job will run every hour.

## Visualizing the data

I thought it would be useful to show the fact that you can visualize that data easily via services like [Chart.io](https://chartio.com/) or Metabase.io. Without going into too much detail about these services, you can see the visualization below:

![Chart.io graph](https://user-images.githubusercontent.com/8188/36358496-7043c5f0-14dd-11e8-9236-69d9e9f13d33.png)

## Summary

We saw how easy it is to create an ETL job service in Serverless, fetch data via an API, and store it in a database like Redshift. The service can be deployed on AWS and executed based on a schedule.

The cost savings of running this kind of service with serverless is huge. Redshift instances are pretty expensive; with serverless you'll only pay when the job executes. No need for dedicated infrastructure.

If you have other use cases you've implemented or have any questions, please leave a comment below. I'd be happy to discuss it with you.
