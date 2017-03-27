---
title: Python EVE + MongoDB + Serverless +AWS = REST all happiness.
description: Build and Deploy your serverless Python EVE + MongoDB REST API
date: 2017-03-27
thumbnail: http://python-eve.org/_static/eve-sidebar.png
layout: Post
authors:
 - NareshSurisetty
---
<img align="right" src="http://python-eve.org/_static/eve-sidebar.png">

Serverless Architecture has been a buzz word these days, obviously this architecture has brought in a whole new world of possibilities. Here is an another serverless project based on **Python EVE as the framework of choice** and **MongoDB as our database engine**. 

> Why **Python EVE** ?

> We sometimes need to create a simple REST API server that can accept queries and process it hassle free. But, if you only need a REST API you have lots of other framework which can do that but especially when u need some features such as **[HATEOAS](https://en.wikipedia.org/wiki/HATEOAS), pagination support, multiple content types (JSON, XML, plain text, ...) support, if-Match/ETag, MongoDB GridFS** and the support for controlling everything this on a whole makes Python EVE one of the best framework for REST API development.

> [more_info] http://python-eve.org/

## Let's do some programming

### 1. Installation

we will use pip to install **EVE**.
```bash
pip install eve
```
we will use **MongoDB** as our database for which we will create our database using [mLab](https://mlab.com/). If you dont have an existing mLab account just go ahead and create one as we will be using mLab hosted database throughout the post. Make sure u create a database as well.

> what is **mLab** ?

> mLab is a fully managed cloud database service that hosts MongoDB databases. mLab runs on cloud providers Amazon, Google, and Microsoft Azure, and has partnered with platform-as-a-service providers.

> [more_info] https://en.wikipedia.org/wiki/MLab

### 2. Creating a Basic API

create a project named **eve-api-project** . Navigate to **eve-api-project** folder and create a file called **run.py**. Copy the code mentioned below.

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
Lets breakdown the **run.py** file.
  - initially we have imported the **EVE module**
      ```python
      import os
      from eve import Eve
      ```
  - **MONGO_HOST**, **MONGO_PORT**, **MONGO_USERNAME**, **MONGO_PASSWORD** and **MONGO_DBNAME** defines the variable for storing out MongoDB host, port, username, password and database name which we will configure in our **serverless.yml** file as part of environment section. 
  - **api_settings** dictionary defines all the **configs and schemas** for our **api**. you can use any name for defining your dictionary for ease i have defined it as **api_settings**.
  - **DOMAIN** section under **api_settings** defines the **endpoints** and there respective **schemas** for API.
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
       this above mentioned **people** schema defines eve api to create an endpoint with name **people** and add the following structure for the api defined. As per the above schema we have two fields in the api named **firstname** and **lastname**. Different validations can be performed upon the schema such as **minlength, maxlenth, type and many more** which can be referred at [EVE Allowed Validations](http://python-eve.org/config.html#schema-definition).
  - pass the **api_settings** as a parameter for settings in Eve.
      ```python
      app = Eve(settings=api_settings)
      ````
    this registers all the **configs and schemas** defined under **api_settings**.

### 3. Defining the serverless file

create a file name **serverless.yml** under the same project directory.

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

Lets breakdown the **serverless.yml** file.
  - if we get into the **environment** section under the **provider** section u can find **MONGO_HOST, MONGO_USERNAME, MONGO_PASSWORD, MONGO_DBNAME** update them as per your MongoDB credentials. These values will be defined as Environment values in AWS Lambda.
  - under plugins section we added **serverless-wsgi** as a plugin which is used to build and deploy **Python WSGI** applications.
      ```npm
      npm install --save severless-wsgi
      ```
      > what is **Serverless WSGI** ?
      
      > A Serverless WSGI plugin is to build your deploy Python WSGI applications using Serverless. Compatible WSGI application frameworks include Flask, Django and Pyramid.
      
      > [more_info] https://github.com/logandk/serverless-wsgi

### 4. Test the Service 

Fire up your console and run the `serverless wsgi serve` in the project directory to see your live api at `http://localhost:5000`

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
The **_items** list contains the requested data. Along with its own fields, other fields such as **_created, _updated, _etag, _id** are automatically handled by the API (clients don’t need to provide them when adding/editing resources).

The **_meta** field provides pagination data and will only be there if Pagination has been enabled (it is by default) and there is at least one document being returned. The **_links** list provides [HATEOAS](https://en.wikipedia.org/wiki/HATEOAS) directives. 

> [more_info] http://python-eve.org/features.html

### 5. Deploy the Service

Deploy the service with `serverless deploy`. If you need to setup Serverless, please see [these install instructions](https://github.com/serverless/serverless#quick-start).

## Conclusion

**Python EVE, MongoDB** enhanced with **Serverless** is an awesome bundle for REST API development and your can further enhance the REST API with much more additions such as Adding **Authentication** , **OAuth2**, **Swaggger** documentation and even more. I will drop some links for you all to refer.
  
## References
  - [Hosted AWS EVE Lambda API](https://v5jc6620c5.execute-api.us-east-1.amazonaws.com/dev/api/v1/people)
  - [A fully functional REST Web API. Powered by Eve](https://github.com/pyeve/eve-demo) 
  - [A very simple API consumer client](https://github.com/pyeve/eve-demo-client) 
  - [Swagger extension for Eve-powered RESTful APIs](https://github.com/pyeve/eve-swagger)
  - [Tuts + Build REST APIs using EVE](https://code.tutsplus.com/tutorials/building-rest-apis-using-eve--cms-22961)
  - [Building EVE RESTFul APIs using SQL Alchemy](https://blogs.rdoproject.org/7625/build-your-restful-api-web-service-in-5-minutes)
  - [Nicola Iarocci: "Eve - REST API for Humans™"](https://www.youtube.com/watch?v=Hs8u1TdEx6A)
