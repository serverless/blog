---
title: How to Handle your Python packaging in Lambda with Serverless plugins
description: Handling Python dependencies in your Lambda functions can be a pain. Here's how I handle Python packaging with Serverless for dev/prod parity.
date: 2017-08-04
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/serverless-python-packaging.jpg'
category:
  - guides-and-tutorials
heroImage: ''
authors:
  - AlexDeBrie
---

I use AWS Lambda for almost all of my projects these days-from Flask apps and Slack bots to cron jobs and monitoring tools. I love how cheap and easy it is to deploy something valuable.

Python is my go-to language, but handling Python packages in Lambda can be tricky. Many important packages need to compile C extensions, like psycopg2 for Postgres access, or numpy, scipy, pandas, or sklearn for numerical analysis. If you compile these on a Mac or Windows system, you'll get an error when your Lambda tries to load them.

The import path also requires finesse. You can install your dependencies directly into your top-level directory, but that clutters up your workspace. If you install them into a subdirectory like `deps/` or `vendored/`, you have to mess with your `sys.path` at the beginning of your function.

But there is a much better way. In this post, I'll show you a how, by using the [`serverless-python-requirements`](https://github.com/UnitedIncome/serverless-python-requirements) plugin for the Serverless Framework.

#### Initial Setup

Let's get our environment ready. If you have Node and NPM installed, install the Serverless Framework globally with:

```bash
$ npm install -g serverless
```

You'll also need to configure your environment with AWS credentials.

**Note:** if you need a refresher on how to install the Framework or get AWS credentials, check out the Prerequisites portion on the top of our [Quick Start Guide](https://serverless.com/framework/docs/providers/aws/guide/quick-start/).

# Creating your service locally

For this quick demo, we'll deploy a Lambda function that uses the popular [NumPy](http://www.numpy.org/) package.

We can create a service from a template. I'm going to use Python 3, but this works with Python 2 as well.

```bash
$ serverless create \
  --template aws-python3 \
  --name numpy-test \
  --path numpy-test
```

This will create a Serverless Python 3 template project at the given path (`numpy-test/`) with a service name of `numpy-test`. You'll need to change into that directory and create a virtual environment for developing locally.

(**Note:** further reading [here](https://python-guide-pt-br.readthedocs.io/pt_BR/latest/dev/virtualenvs.html) about how and why to use virtual environments with Python.)

```bash
$ cd numpy-test
$ virtualenv venv --python=python3
Running virtualenv with interpreter /usr/local/bin/python3
Using base prefix '/usr/local/Cellar/python3/3.6.1/Frameworks/Python.framework/Versions/3.6'
New python executable in /Users/username/scratch/numpy-test/venv/bin/python3.6
Also creating executable in /Users/username/scratch/numpy-test/venv/bin/python
Installing setuptools, pip, wheel...done.
$ source venv/bin/activate
(venv) $
```

Let's set up the function we want to deploy. Edit the contents of `handler.py` so that it contains the following:

```python
# handler.py

import numpy as np


def main(event, context):
    a = np.arange(15).reshape(3, 5)

    print("Your numpy array:")
    print(a)


if __name__ == "__main__":
    main('', '')
```

This is a super simple function using an example from the [NumPy Quick Start](https://docs.scipy.org/doc/numpy-dev/user/quickstart.html#an-example). When working with Lambda, you'll need to define a function that accepts two arguments: `event`, and `context`. You can read more at AWS about the [Lambda Function Handler for Python](http://docs.aws.amazon.com/lambda/latest/dg/python-programming-model-handler-types.html).

Notice the last two lines of the file, which give us a way to quickly test the function locally. If we run `python handler.py`, it will run our `main()` function. Let's give it a shot:

```bash
(venv) $ python handler.py
Traceback (most recent call last):
  File "handler.py", line 1, in <module>
    import numpy as np
ImportError: No module named numpy
```

Ah, we haven't installed `numpy` in our virtual environment yet. Let's do that now, and save the package versions of our environment to a `requirements.txt` file:

```bash
(venv) $ pip install numpy
Collecting numpy
  Downloading numpy-1.13.1-cp36-cp36m-macosx_10_6_intel.macosx_10_9_intel.macosx_10_9_x86_64.macosx_10_10_intel.macosx_10_10_x86_64.whl (4.5MB)
    100% |████████████████████████████████| 4.6MB 305kB/s
Installing collected packages: numpy
Successfully installed numpy-1.13.1
(venv) $ pip freeze > requirements.txt
(venv) $ cat requirements.txt
numpy==1.13.1
```

If we run our command locally now, we'll see the output we want:

```bash
(venv) $ python handler.py
Your numpy array:
[[ 0  1  2  3  4]
 [ 5  6  7  8  9]
 [10 11 12 13 14]]
```

Perfect.

#### Deploying your service

Our function is working locally, and it's ready for us to deploy to Lambda. Edit the `serverless.yml` file to look like the following:

```yml
# serverless.yml

service: numpy-test

provider:
  name: aws
  runtime: python3.6

functions:
  numpy:
    handler: handler.main
```

This is a basic service called `numpy-test`. It will deploy a single Python 3.6 function named `numpy` to AWS, and the entry point for the `numpy` function is the `main` function in the `handler.py` module.

Our last step before deploying is to add the `serverless-python-requirements` plugin. Create a package.json file for saving your node dependencies. Accept the defaults, then install the plugin:

```bash
(venv) $ npm init
This utility will walk you through creating a package.json file.

...Truncated...

Is this ok? (yes) yes

(venv) $ npm install --save serverless-python-requirements
```

To configure our `serverless.yml` file to use the plugin, we'll add the following lines in our `serverless.yml`:

```yml
# serverless.yml

plugins:
  - serverless-python-requirements

custom:
  pythonRequirements:
    dockerizePip: non-linux
```

_Note: a previous version of this post set `dockerizePip: true` instead of `dockerizePip: non-linux`. You'll need `serverless-python-requirements` v3.0.5 or higher for this option._

> You need to have Docker [installed](https://docs.docker.com/install/) to be able to set `dockerizePip: true` or `dockerizePip: non-linux`. Alternatively, you can set `dockerizePip: false`, and it will not use Docker packaging.
But, Docker packaging is essential if you need to build native packages that are part of your dependencies like Psycopg2, NumPy, Pandas, etc.

The `plugins` section registers the plugin with the Framework. In the `custom` section, we tell the plugin to use Docker when installing packages with pip. It will use a Docker container that's similar to the Lambda environment so the compiled extensions will be compatible. You will need Docker installed for this to work.

The plugin works by hooking into the Framework on a deploy command. Before your package is zipped, it uses Docker to install the packages listed in your `requirements.txt` file and save them to a `.requirements/` directory. It then symlinks the contents of `.requirements/` into your top-level directory so that Python imports work as expected. After the deploy is finished, it cleans up the symlinks to keep your directory clean.

```bash
(venv) $ serverless deploy
Serverless: Parsing Python requirements.txt
Serverless: Installing required Python packages for runtime python3.6...
Serverless: Docker Image: lambci/lambda:build-python3.6
Serverless: Linking required Python packages...

... Truncated ...

Serverless: Stack update finished...
Service Information
service: numpy-test
stage: dev
region: us-east-1
api keys:
  None
endpoints:
  None
functions:
  numpy: numpy-test-dev-numpy
```

Great. Let's invoke our `numpy` function and read the logs:

```bash
(venv) $ serverless invoke -f numpy --log
--------------------------------------------------------------------
START RequestId: b32af7a8-52fb-4145-9e85-5985a0f64fe4 Version: $LATEST
Your numpy array:
[[ 0  1  2  3  4]
 [ 5  6  7  8  9]
 [10 11 12 13 14]]
END RequestId: b32af7a8-52fb-4145-9e85-5985a0f64fe4
REPORT RequestId: b32af7a8-52fb-4145-9e85-5985a0f64fe4	Duration: 0.52 ms	Billed Duration: 100 ms 	Memory Size: 1024 MB	Max Memory Used: 37 MB
```

And there it is. You've got NumPy in your Lambda!

Be sure to check out the repo for additional functionality, including automatic compression of libraries before deploying, which can be a huge help with the larger numerical libraries in Python.

*Many thanks to the [United Income](https://unitedincome.com/) team and [Daniel Schep](https://twitter.com/schep_) in particular for creating the `serverless-python-requirements` package. If you want to work on serverless full-time, check out United Income. They use a 100% serverless architecture for everything from serving up their web application to running millions of financial simulations, and they are always looking for talented engineers to join their growing team in Washington, DC.*
