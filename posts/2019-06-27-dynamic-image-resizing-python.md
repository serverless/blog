---
title: Dynamic image resizing with Python and Serverless framework
description: In this article we will provide an example of how to dynamically resize images with Python and the Serverless framework.
date: 2019-06-27
layout: Post
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/image-processing-post/thumbnail.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/image-processing-post/header.png'
authors:
  - BryanKillian
category:
  - guides-and-tutorials
featured: guides-and-tutorials
---

Images are essential to creating an engaging user experience, but more isn’t always better. Large, high-resolution images may require little effort to integrate into the user interface, but they can drag down download speeds for the whole webpage - and the impact of all that additional points of resolution on the user experience is often minimal.

Imagine that you run a news site. A large percentage of your readers are viewing your site on their phones and don’t need the high-resolution pictures. Some of your users, though, are reading on a desktop computer where they have a better connection and a better screen, and so will appreciate the higher-quality images.

The right option from the user experience standpoint is to provide all your images in different sizes based on the device that you are visiting from. However, new devices with unexpected screen proportions come online unpredictably, and resizing an image in advance to fit any conceivable screen size is virtually impossible. Should we pay a huge storage bill and pre-generate all images in all possible sizes? Should we generate each image on the fly for every request? Neither option sounds like a good idea.

However, what if we created an image in each size when it’s first requested, and then saved it for later? This way each device would get the right image size for it, and we would save significantly on the storage costs and the compute costs.

This also is a use case that Serverless is a great fit for. With Serverless, you only use the compute you need at each moment, and you only pay for the compute you use. The Serverless applications are already designed to auto-scale to suit the user demands, so you don’t need to pre-scale any servers and can, therefore, reduce your costs even further. Even where the resizing of images in our use case is necessary, the compute costs are much lower when the resizing is done by a Serverless function.

## Using S3 and Python to scale images with Serverless
In this article, we use Python within the [Serverless framework](https://serverless.com/framework/) to build a system for automated image resizing. We use S3, the AWS cloud storage service, as an example, but Serverless also works well with other cloud services including GCP and Azure.

Storing images in S3 is an easy, scalable way to avoid the high compute costs of hosting a vast library of pre-scaled images without sacrificing the versatility of a dynamic image interface. Essentially, what we’ll do in this example is let each request generate the image of the size it needs. We then store the result in our S3 bucket.

Next time someone requests the same image, one of two things will happen: if the image already exists in that size, the corresponding S3 URI will serve us the previously stored image directly. But if we don't have the image in that size yet, following the S3 link will first generate the image in that size and then get it served to us, as well as saving that newly resized image in the cloud for future use.

This is what we mean by a “smart” resizing system: instead of preparing for every possible outcome of an image request, we let the users request the images in the sizes they actually need.

## Creating a Serverless API for image resizing
How exactly do we go about implementing the Serverless image-resizing API? In this section, we’ll cover the following steps:

- Writing a serverless.yml config file that contains all the specifics for the resizing service
- Implementing the resizing logic in a resizing function
- Setting up an S3 bucket to work with the resizing endpoint

Our plan is to have our S3 bucket do most of the work: if the image is present in the size we want in the S3 bucket, we just need to serve it to the customer. If the requested size of the image is not available in S3 yet, however, we will have our S3 bucket call our image resizing function which will create the image in the size that we need and respond to the end user with the resized image.

Let’s start by looking at the `serverless.yml` that sets up everything that will be needed for our function.

First, we specify the name of our service, its runtime and location, and grant permissions to our future function to access S3:

```yaml
service: image-resizing-python

provider:
  name: aws
  runtime: python2.7
  region: eu-west-1
  iamRoleStatements:
    - Effect: Allow
      Action:
        - s3:GetObject
        - s3:PutObject
      Resource: 'arn:aws:s3:::resized-images-python/*'
```

Note that the `Resource` declaration in the `iamRoleStatements` policy includes my bucket name. You'll need to change it for your bucket name.

Next comes the definition of the function that we are going to expose and its parameters:

```yaml
functions:
  resize:
    handler: handler.call
    environment:
      BUCKET: resized-images-python
      REGION: eu-west-1
    events:
      - http:
          path: /{size}/{image}
          method: get
```

We also need a Resource declaration for the S3 bucket where we will store all the images:

```yaml
  Resources:
    ResizedImages:
      Type: AWS::S3::Bucket
      Properties:
        BucketName: resized-images-python
```

That’s it for our `serverless.yml` file. You can view the full version of it [here](https://github.com/chief-wizard/serverless-python-image-resizing/blob/master/serverless.yml).

Now, let’s look at the implementation of the image resizing function in Python. We start by importing a number of modules that we will need in the function:

```python
import json
import datetime
import boto3
import PIL
from PIL import Image
from io import BytesIO
import os
```

The `json` and `datetime` modules are self-explanatory. `boto` is the Python wrapper for the Amazon Web Services API which we will need to download and upload images from and to S3. We use Pillow for image resizing — that’s what `PIL` is. We also include `BytesIO` as our function will work with file streams, and the `os` module so that we get access to the environment variables via `os.environ`.

Let’s now take a look at the very outer function in our file:

```python

def call(event, context):
    key = event["pathParameters"]["image"]
    size = event["pathParameters"]["size"]

    result_url = resize_image(os.environ["BUCKET"], key, size)

    response = {
        "statusCode": 301,
        "body": "",
        "headers": {
            "location": result_url
        }
    }

    return response
```

This is the function that will get called when there is a new incoming request for an image to be resized. We parse out the `key` and the `size` properties from the named path elements that we put down in the `serverless.yml` file previously. We then call `resize_image` with the key to the image and the new size that we need. Finally, we return the 301 redirect to the `result_url` location where our new resized image is.

Let’s see what the `resize_image` function does under the hood. First, it gets the image from S3 and reads it into a variable:

```python
def resize_image(bucket_name, key, size):
    size_split = size.split('x')
    s3 = boto3.resource('s3')
    obj = s3.Object(
        bucket_name=bucket_name,
        key=key,
    )
    obj_body = obj.get()['Body'].read()
```

Second, it resizes the image it just read to the new size:

```python

    img = Image.open(BytesIO(obj_body))
    img = img.resize((int(size_split[0]), int(size_split[1])), PIL.Image.ANTIALIAS)
    buffer = BytesIO()
    img.save(buffer, 'JPEG')
    buffer.seek(0)
```

Third, it uploads the newly resized image back to S3:

```python

    resized_key="{size}_{key}".format(size=size, key=key)
    obj = s3.Object(
        bucket_name=bucket_name,
        key=resized_key,
    )
    obj.put(Body=buffer, ContentType='image/jpeg')
```

And the final step, it returns the resized image URL so that we can put it into the 301 redirect in the outer function:

```python
   return resized_image_url(resized_key, bucket_name, os.environ["AWS_REGION"])
```

The resized image URL is built in a separate function as follows:

```python

def resized_image_url(resized_key, bucket, region):
    return "https://s3-{region}.amazonaws.com/{bucket}/{resized_key}".format(bucket=bucket, region=region, resized_key=resized_key)
```

At this point, we have the outer function `call` that resizes an image and performs the 301 redirect to the new location, which is the business logic we wanted for the function. You can see the entire `handler.py` file [right here](https://github.com/chief-wizard/serverless-python-image-resizing/blob/master/handler.py) on GitHub.

Our `requirements.txt` file for our function is just one line, as we only need two dependencies:

```
boto3
Pillow
```

We now have everything we need for our image resizing function and can proceed to deploy it.

## Deploying the Serverless API for image resizing
In order to deploy our function, we need the API credentials to our AWS account with permissions to access AWS Lambda, S3, IAM, and API Gateway. To configure these credentials, we use a `.env` file. You can find an example `.env` file in the example repo on GitHub [here](https://github.com/chief-wizard/serverless-python-image-resizing/blob/master/.env.example). Please make sure that you never check the `.env` file into Git, as that might leak your AWS credentials.

To make sure that our Python dependencies compile correctly both in development and in production, we use [the `serverless-python-requirements`  plugin](https://github.com/chief-wizard/serverless-python-image-resizing/blob/master/.env.example). It will make sure that, independently of the operating system we are developing on, the Python dependencies will get packaged correctly for the Lambda environment (Amazon Linux). If developing on a non-Linux system, deploying our function will require Docker to be installed and running.

So in order to deploy our function we need to:


- Fill out the credentials in the `.env` file.
- Run `sls deploy`.

There is one last step before everything is functional. In the output of the deploy we get the URL of the function on the AWS API Gateway, it looks like this:

```
https://XXXXX.execute-api.eu-west-1.amazonaws.com
```

We now need to configure our S3 bucket to work together with our Serverless function as follows:

- Configure our S3 bucket for website hosting as shown in the [S3 documentation](https://docs.aws.amazon.com/AmazonS3/latest/dev/HowDoIWebsiteConfiguration.html).
- In the [Advanced Conditional Redirects](https://docs.aws.amazon.com/AmazonS3/latest/dev/how-to-page-redirect.html#advanced-conditional-redirects) section of the Website Hosting settings for the S3 bucket, set up the following redirect rule:

```xml
<RoutingRules>
  <RoutingRule>
    <Condition>
      <HttpErrorCodeReturnedEquals>404</HttpErrorCodeReturnedEquals>
    </Condition>
    <Redirect>
      <Protocol>https</Protocol>
      <HostName>XXXXX.execute-api.us-east-1.amazonaws.com</HostName>
      <ReplaceKeyPrefixWith>dev/</ReplaceKeyPrefixWith>
      <HttpRedirectCode>307</HttpRedirectCode>
    </Redirect>
  </RoutingRule>
</RoutingRules>
```

In place of XXXXX we add the Lambda endpoint of our Serverless function from the deployment step output.


## Seeing the API in action

Once we configure the redirect rule on S3, we have a fully working solution.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/image-processing-post/2019-06-27-image-python.gif">

Once we upload the image to the S3 bucket, we can get the function to resize the image to the size we need on the fly.


## Wrapping Up
In this article, we walked you through setting up a dynamic image resizing API with Python and the Serverless framework.

Image resizing is a great use case for Serverless. When implemented with Serverless, the resizing of the images scales effectively with the load. The function will only use the compute it needs to quickly resize the images — you won’t waste compute time if there are no resizing requests. The solution with S3 and a Serverless function also provides for a very simple architecture and minimizes the number of moving parts, therefore ensuring the stability of the system.

There are many other use cases that can benefit from Serverless, from workflow automation and event streaming to backends for mobile apps and log processing.

If you’d like to explore Serverless, start with the [Serverless documentation](https://serverless.com/framework/docs/getting-started/) and check out [the Introduction to AWS with the Serverless framework](https://serverless.com/framework/docs/providers/aws/guide/intro/). If you are not using AWS you can find the documentation for your provider on the [Providers page](https://serverless.com/framework/docs/#Supported-Providers).

You can find the full example project in this [GitHub repository](https://github.com/chief-wizard/serverless-python-image-resizing).
