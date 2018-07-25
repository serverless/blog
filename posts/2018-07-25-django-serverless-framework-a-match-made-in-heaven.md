
# Django + Serverless framework a match made in heaven

I started using Django seriously 2 years ago, an exceptional framework that in addition to its core strength has also a vast list of add-ons and supporting libraries, one of those gems is called Django Rest Framework or DRF for short, a library which gives an easy to use/out of the box REST functionality that plugs seamlessly with Django’s ORM functionality.

Up until now I’ve been using [Zappa](https://github.com/Miserlou/Zappa) which is an extremely powerful Serverless framework that is tailored made to WSGI web apps, for me the selling point was the capability to take my Django knowledge and transfer it in a flick of a switch to the serverless world. Zappa has many features that enable an easy Django (and Flask BTW) development, I’m using it in production and all is well, so how the Serverless framework (SF for short) fits into the picture ? 

Curiosity, I want to try it out.

## Django — a SQL beast 

Django is very powerful, however it’s heavily dependent on SQL database, MySql or Postgresql for example, no matter how hard I tried I couldn’t find any Django DB engine that is able to work on top of AWS DynamoDB. Currently the suggested solution is built from 2 components:

1. Using RDS, which is a managed SQL service, but not completely Serverless in that you are paying even if you are not using and it does not scale automatically.

1. Using VPC, for security reasons you do not want to expose your DB on the public internet, therefore VPC is the suggested solution, when adding VPC into the mix it requires your Lambda to run inside the VPC → slow start and [complicated configuration](https://gist.github.com/efi-mk/d6586669a472be8ea16b6cf8e9c6ba7f).

It’s too complicated for my demo, I wanted something quick (and dirty?)
![](https://user-images.githubusercontent.com/822542/43189371-1792774c-8fff-11e8-8b79-2cd9d16c4e53.png)
###### Quick and Dirty, Photo by Quino Al on Unsplash
SQLite here I come. [SQLite](https://www.sqlite.org/index.html) actually is not that dirty, in the right scenarios its the the right tool, scenarios like constrained environments (mobile) or when you do not need to save a lot of data and you want to keep everything in memory. Global shared configuration might be a good idea. Have a look at the following diagram:

![sqlite](https://user-images.githubusercontent.com/822542/43189524-7331b9c8-8fff-11e8-8dc7-75612d36ff65.png)

* You have a lambda function that requires configuration in order to function, the configuration is saved in a SQLite DB located in S3 bucket.

* The Lambda pulls the SQLite on startup and does its magic.

* On the other end, you have a management console that does something similar, it pulls the SQLite DB, changes it and puts it back

* Pay attention that only **a single writer is allowed here**, otherwise things will get out of sync.

Mmmmm, interesting, I wonder how much time is going to take us to develop it… Nothing, nada, zilch, [we already have one](https://blog.zappa.io/posts/s3sqlite-a-serverless-relational-database), the good folks of Zappa developed one for us, we shell call it Serverless SQLite or SSQL for short.

## Let’s start with the action

Let’s define what the app is going to do:

* A Django app with appropriate Django admin for our models.

* You can log into the admin and add or change configuration.

* The user is able to call a REST api created by DRF to read configuration details, something very similar to to [this](https://serverless.com/blog/flask-python-rest-api-serverless-lambda-dynamodb/).

You can find the latest code [here](https://github.com/efi-mk/serverless-django-demo)

You already know how to create a [Django app](https://docs.djangoproject.com/en/2.0/intro/tutorial01/) so we’ll skip the boring stuff and concentrate on the extra steps required to setup this app.

### WSGI configuration

It’s something small, but that’s what’s doing the magic, in `serverless.yml` the wsgi configuration points to the `wsgi` app that Django exposes.

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
but when testing locally I do not want to connect to any S3 bucket, it slows the operation, therefore a check is made in order to verify whether we are running a Lambda environment or not if not then load the regular SQLite driver  — 

`IS_OFFLINE = os.environ.get(‘LAMBDA_TASK_ROOT’) is None`

I prefer not to run `sls wsgi serve` because Django already has wonderful management CLI support, I prefer to run `manage.py runserver`.

SSQL as part of its configuration requires a bucket name, you can create it manually and set the name in `local_settings.py` , pay attention that under `serverless.yml` the lambda function has `Get` and `Put` permissions on all S3 buckets, you should use your S3 bucket ARN instead.

### WhiteNoise configuration

[WhiteNoise](http://whitenoise.evans.io/en/stable/) allows our web app to serve its own static files, without relying on nginx, Amazon S3 or any other external service. We’ll use this library to serve our static admin files. I’m not going to go over all the configuration details, [you can follow them on your own](https://github.com/evansd/whitenoise/issues/164). Pay attention that the static files should be part of the Lambda package.

### A tale of a missing SO

While trying to make it work, I encountered a strange error — *Unable to import module ‘app’: No module named ‘_sqlite3’.* After some digging I found out that the Lambda environment does not contain the shared library which is required by SQLite 😲. Again the good folks of Zappa provided a compiled SO which is packaged as part of the deployment script

### Deployment script

So, what do we have ?

* Collect all static files ✔️

* Migrate our remote DB before code deployment ✔️

* Create a default admin `root` user with password `MyPassword` ✔️

* Add _sqlite3.so to the mix ✔️

* `sls deploy` ✔️

You have a deploy script located under `scripts` folder

### So how do I prepare my environment locally?

1. `npm install — save-dev serverless-wsgi serverless-python-requirements`

1. Create a virtual env for your python project.

1. `pip install -r requirements.txt`

1. Run DB migration `./manage.py migrate`

1. Create super user for the management console `./manage.py createsuperuser`

1. Run the server locally `./manage.py runserver`

1. Go to [http://127.0.0.1:8000/admin](http://127.0.0.1:8000/admin) and login onto the management console. Add a configuration

1. Try `curl -H “Content-Type: application/json” -X GET [http://127.0.0.1:8000/configuration/](http://127.0.0.1:8000/configuration/)` and see if you get the configuration back.

## Fin

I hope you enjoyed the journey, showing you how to use Django with SF, we used SQLite as our SQL database which was served from a S3 bucket.

You are more than welcomed to ask question and [fork](https://github.com/efi-mk/serverless-django-demo) the repository.
