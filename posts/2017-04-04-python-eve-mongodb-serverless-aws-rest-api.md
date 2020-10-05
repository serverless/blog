---
title: Python EVE + MongoDB + Serverless + AWS = REST All Happiness
description: Learn how to build and deploy a Serverless REST API using Python EVE and MongoDB 
date: 2017-04-04
thumbnail: https://cloud.githubusercontent.com/assets/20538501/24419938/9ed1b9f0-13b6-11e7-8531-66a49808d338.png
layout: Post
authors:
 - NareshSurisetty
---
<img align="right" src="https://docs.python-eve.org/en/latest/_static/eve-sidebar.png">

Hi, I'm Naresh Surisetty, an enthusiastic Python developer based in India. I'm especially interested in developing scalable apps in the cloud - a main reason I'm drawn to experimenting with serverless architecture. In this post I'll share a Serverless project using [Python EVE](http://python-eve.org/) and [MongoDB](https://docs.mongodb.com/). 

> **What is Python EVE?** Python EVE is an open source Python REST API framework. Python EVE allows for [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) (Hypermedia As The Engine Of Application State), and includes pagination support, support for multiple content types (JSON, XML, plain text, ...), if-Match/ETag and MongoDB GridFS. 

# Get Started Progamming

## 1. Installation

We'll use pip to install **EVE**.
```bash
pip install eve
```
We'll create our MongoDB database using [mLab](https://mlab.com/). If you don't have an existing mLab account go ahead and create one as we'll be using mLab hosted database throughout the post. *(There's an option for a free Sandbox account.)* Make sure you create a database, as well. 

> **What is mLab?** mLab is a fully managed cloud database service that hosts MongoDB databases. mLab runs on cloud providers Amazon, Google, and Microsoft Azure, and has partnered with PaaS (Platform-as-a-Service) providers. Find more help getting started in the [mLab Docs & Quick Start Guide](http://docs.mlab.com/).

## 2. Creating a Basic API

Create a project named **eve-api-project**. Navigate to **eve-api-project** folder and create a file called **run.py**. Copy the following code:

**run.py**
  ```python
  import os
  from eve import Eve
    
  # AWS lambda, sensible DB connection settings are stored in environment variables.
  MONGO_HOST = os.environ.get('MONGO_HOST')
  MONGO_PORT = os.environ.get('MONGO_PORT')
  MONGO_USERNAME = os.environ.get('MONGO_USERNAME')
  MONGO_PASSWORD = os.environ.get('MONGO_PASSWORD')
  MONGO_DBNAME = os.environ.get('MONGO_DBNAME')
    
  # AWS 
  api_settings = {
        'MONGO_HOST': MONGO_HOST,
        'MONGO_PORT': MONGO_PORT,
        'MONGO_USERNAME' : MONGO_USERNAME,
        'MONGO_PASSWORD' : MONGO_PASSWORD,
        'MONGO_DBNAME': MONGO_DBNAME,
        'RESOURCE_METHODS' : ['GET', 'POST', 'DELETE'],
        'ITEM_METHODS' : ['GET', 'PATCH', 'DELETE'],
        'EXTENDED_MEDIA_INFO' : ['content_type', 'name', 'length'],
        'RETURN_MEDIA_AS_BASE64_STRING' : False,
        'RETURN_MEDIA_AS_URL': True,
        'CACHE_CONTROL' : 'max-age=20',
        'CACHE_EXPIRES' : 20,
        'DOMAIN' : {'people': {
                    'item_title': 'person',
                    'additional_lookup':
                        {
                            'url': 'regex("[\w]+")',
                            'field': 'lastname'
                        },
                    'schema':
                        {
                            'firstname': {
                                'type': 'string',
                                'minlength': 1,
                                'maxlength': 10,
                            },
                            'lastname': {
                                'type': 'string',
                                'minlength': 1,
                                'maxlength': 15,
                                'required': True,
                                'unique': True,
                            },
                        }
                    }
                }
  }
  app = Eve(settings=api_settings)  
  ```

### Lets break down the **run.py** file.
  - Initially we've imported the **EVE module**
      ```python
      import os
      from eve import Eve
      ```
  - **MONGO_HOST**, **MONGO_PORT**, **MONGO_USERNAME**, **MONGO_PASSWORD** and **MONGO_DBNAME** defines the variable for storing our MongoDB host, port, username, password and database name that we'll configure in our **serverless.yml** file as part of environment section. 
  - **api_settings** dictionary defines all the **configs and schemas** for our **API**. You can use any name for defining your dictionary. For ease I've defined it as **api_settings**.
  - **DOMAIN** section under **api_settings** defines the **endpoints** and their respective **schemas** for API.
      ```python
      {'people': {
                    'item_title': 'person',
                    'additional_lookup':
                        {
                            'url': 'regex("[\w]+")',
                            'field': 'lastname'
                        },
                    'schema':
                        {
                            'firstname': {
                                'type': 'string',
                                'minlength': 1,
                                'maxlength': 10,
                            },
                            'lastname': {
                                'type': 'string',
                                'minlength': 1,
                                'maxlength': 15,
                                'required': True,
                                'unique': True,
                            },
                        }
                 }
       }
      ```
       The above mentioned **people** schema defines EVE API to create an endpoint with name **people** and add the following structure for the API defined. We have two fields in the API named **firstname** and **lastname**. Different validations can be performed upon the schema such as **minlength, maxlenth, type and many more** that can be referred at [EVE Allowed Validations](http://python-eve.org/config.html#schema-definition).
  - Pass the **api_settings** as a parameter for settings in Eve.
      ```python
      app = Eve(settings=api_settings)
      ````
    This registers all the **configs and schemas** defined under **api_settings**.

## 3. Defining the Serverless File

Create a file named **serverless.yml** under the same project directory.

**serverless.yml** 
```yamlex
service: eve-api

frameworkVersion: ">=1.1.0 <2.0.0"

provider:
  name: aws
  runtime: python2.7
  environment:
    MONGO_HOST: "api.db.com"
    MONGO_PORT: 27104
    MONGO_USERNAME : "api-user"
    MONGO_PASSWORD : "api-pass"
    MONGO_DBNAME: "api-db"
  iamRoleStatements:
    -  Effect: "Allow"
       Action:
         - "lambda:InvokeFunction"
       Resource: "*"

plugins:
  - serverless-wsgi

functions:
  api:
    handler: wsgi.handler
    events:
      - http: ANY {proxy+}

custom:
  wsgi:
    app: run.app
```

### Lets break down the **serverless.yml** file.
  - If we get into the **environment** section under the **provider** section you can find **MONGO_HOST, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DBNAME** and update them as per your MongoDB credentials. These values will be defined as Environment values in AWS Lambda.
  - Under plugins section we added **serverless-wsgi** as a plugin which is used to build and deploy **Python WSGI** applications.
      ```npm
      npm install --save severless-wsgi
      ```
      > **What is Serverless WSGI?** The [Serverless WSGI plugin](https://github.com/logandk/serverless-wsgi) is used to deploy WSGI applications (Flask/Django/Pyramid etc.) and bundle Python packages.
      
## 4. Test the Service 

Fire up your console and run `serverless wsgi serve` in the project directory to see your live API at `http://localhost:5000`
.
```bash
$ curl -i http://localhost:5000/people
HTTP/1.1 200 OK
```
The response payload will look something like this:
```json
{
    "_items": [
        {
            "firstname": "Naresh",
            "lastname": "Surisetty",
            "_id": "50bf198338345b1c604faf31",
            "_updated": "Wed, 05 Dec 2012 09:53:07 GMT",
            "_created": "Wed, 05 Dec 2012 09:53:07 GMT",
            "_etag": "ec5e8200b8fa0596afe9ca71a87f23e71ca30e2d",
            "_links": {
                "self": {"href": "people/50bf198338345b1c604faf31", "title": "person"},
            },
        },
        ...
    ],
    "_meta": {
        "max_results": 25,
        "total": 70,
        "page": 1
    },
    "_links": {
        "self": {"href": "people", "title": "people"},
        "parent": {"href": "/", "title": "home"}
    }
}
```
The **_items** list contains the requested data. Along with its own fields, other fields such as **_created, _updated, _etag, _id**, are automatically handled by the API (clients don’t need to provide them when adding/editing resources).

The **_meta** field provides pagination data and will only be there if Pagination has been enabled (it is by default) and there is at least one document being returned. The **_links** list provides [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) directives. 

## 5. Deploy the Service

Deploy the service with `serverless deploy`. If you need to setup Serverless, please see [the Serverless Quick Start Guide](https://github.com/serverless/serverless#quick-start) for instructions.

# Conclusion

Python EVE and MongoDB enhanced with Serverless is an awesome bundle for REST API development. You can further enhance the REST API with more additions such as Adding **Authentication** , **OAuth2**, **Swaggger** documentation and even more. Check out more resources [on GitHub](https://github.com/pyeve).
 
