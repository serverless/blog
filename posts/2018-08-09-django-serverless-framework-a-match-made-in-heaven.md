---
title: "Deploy a REST API using Serverless, Django and Python"
description: "Use the Serverless Framework, Django, SQLite and Python to quickly deploy a REST API."
date: 2018-08-09
thumbnail: ''
category:
  - guides-and-tutorials
authors:
  - EfiMerdlerKravitz
---

I started using Django seriously 2 years ago, and I think it's an exceptional framework.

In addition to its core strength, Django has a vast list of add-ons and supporting libraries. One of those gems is called the Django Rest Framework (or DRF for short), a library that gives developers an easy-to-use, out-of-the-box REST functionality that plugs seamlessly with Django’s ORM functionality.

But what if you want to do this serverless-ly? In this post, I'll talk about deploying serverless Django apps with the Serverless Framework!

## Django: the SQL beast

Django is powerful, but it’s also heavily dependent on a SQL database like MySql or Postgresql. No matter how hard I tried, I couldn’t find any Django DB engine that is able to work on top of AWS DynamoDB.

The solution I'm suggesting here is built from 2 components:

1. Using RDS. RDS is a managed SQL service, but not completely serverless; you pay for idle, and it does not scale automatically.

2. Using a VPC. When using RDS, this is a necessary step for security. When adding VPC into the mix, your Lambda must also run inside the VPC, which leads to slow starts and [a complicated configuration](https://gist.github.com/efi-mk/d6586669a472be8ea16b6cf8e9c6ba7f).

But, all that is too complicated for my demo. I wanted something quick and dirty.

### Using SQLite

SQLite here I come!

Ok, so [SQLite](https://www.sqlite.org/index.html) is actually not that dirty. It's the right tool for constrained environments (like mobile), or when you don't need to save a lot of data and you want to keep everything in memory.

Global shared configuration might be a good idea. Have a look at the following diagram:

![sqlite](https://user-images.githubusercontent.com/822542/43189524-7331b9c8-8fff-11e8-8dc7-75612d36ff65.png)

* You have a lambda function that requires configuration in order to function, the configuration is saved in a SQLite DB located in S3 bucket.
* The Lambda pulls the SQLite on startup and does its magic.
* On the other end, you have a management console that does something similar, it pulls the SQLite DB, changes it and puts it back
* Pay attention that only **a single writer is allowed here**, otherwise things will get out of sync.

How long will it take us to develop this? None. [We can use this one](https://blog.zappa.io/posts/s3sqlite-a-serverless-relational-database) from Zappa. Let's call it Serverless SQLite, or 'SSQL' for short.

## Let's get this thing started

Let’s define what we're building here:

* It's going to be a Django app with the appropriate Django admin for our models

* You should be able to log into the admin and add or change configuration.

* The user should be able to call a REST API created by DRF to read configuration details, something very similar to to [this Python rest API](https://serverless.com/blog/flask-python-rest-api-serverless-lambda-dynamodb/).

You can find all the code for the demo [here](https://github.com/efi-mk/serverless-django-demo).

I'm assuming you already know how to create a [Django app](https://docs.djangoproject.com/en/2.0/intro/tutorial01/), so we’ll skip the boring stuff and concentrate on the extra steps required to set up this app.

### WSGI configuration

It’s something small, but that’s what’s doing the magic. In `serverless.yml`, the wsgi configuration points to the `wsgi` app that Django exposes.

### SSQL configuration

Under `settings.py` a configuration was added which loads the SSQL DB driver:

``` python
    DATABASES = {
        'default': {
            'ENGINE': 'zappa_django_utils.db.backends.s3sqlite',
            'NAME': 'sqlite.db',
            'BUCKET': SQLITE_BUCKET
        }
    }
```

But when testing locally, I do not want to connect to any S3 bucket. It slows down the operation. Therefore, we'll make a check to verify whether we are running a Lambda environment or not. If not, then we'll load the regular SQLite driver:

`IS_OFFLINE = os.environ.get(‘LAMBDA_TASK_ROOT’) is None`

I prefer not to run `sls wsgi serve`, because Django already has wonderful management CLI support. Instead, I like to run `manage.py runserver`.

As part of its configuration, SSQL requires a bucket name. You can create it manually and set the name in `local_settings.py`, but note that under `serverless.yml` the Lambda function has `Get` and `Put` permissions on all S3 buckets. You should use your S3 bucket ARN instead.

### WhiteNoise configuration

[WhiteNoise](http://whitenoise.evans.io/en/stable/) allows our web app to serve its own static files, without relying on nginx, Amazon S3 or any other external service.

We’ll use this library to serve our static admin files. I’m not going to go over all the configuration details here, but [you can feel free follow them on your own](https://github.com/evansd/whitenoise/issues/164). Make sure the static files are part of the Lambda package.

### A tale of a missing SO

While trying to make it work, I encountered a strange error—*Unable to import module ‘app’: No module named ‘_sqlite3’.* After some digging, I found out that the Lambda environment does not contain the shared library which is required by SQLite. 😲

Luckily, Zappa has provided a compiled SO which is packaged as part of the deployment script.

### Deployment script

Let's review the step:

* Collect all static files ✔️

* Migrate our remote DB before code deployment ✔️

* Create a default admin `root` user with password `MyPassword` ✔️

* Add _sqlite3.so to the mix ✔️

* `sls deploy` ✔️

You have a deploy script located under `scripts` folder.

### So how do I prepare my environment locally?

1. `npm install — save-dev serverless-wsgi serverless-python-requirements`

2. Create a virtual env for your python project

3. `pip install -r requirements.txt`

4. Run DB migration: `./manage.py migrate`

5. Create a super user for the management console: `./manage.py createsuperuser`

6. Run the server locally: `./manage.py runserver`

7. Go to [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin) and log in onto the management console; add a configuration

8. Try `curl -H “Content-Type: application/json” -X GET [http://127.0.0.1:8000/configuration/](http://127.0.0.1:8000/configuration/)` and see if you get the configuration back

## Fin

We covered how to use Django with the Serverless Framework, using SQLite as our SQL database, which was served from a S3 bucket.

I hope you enjoyed the journey! You are more than welcom to ask question below, and/or [fork the repository](https://github.com/efi-mk/serverless-django-demo).
