---
title: "Building an API with Ruby and the Serverless Framework"
description: "AWS Lambda now supports Ruby! Here's how you can get started and build an API with the Serverless Framework."
date: 2018-12-04
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ruby/serverless-ruby-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ruby/serverless-ruby-header.png'
category:
  - guides-and-tutorials
authors: 
  - JaredShort
---

On the heels of re:Invent, it's been a great week for the serverless community. And one of the most exciting things in AWS's re:Invent goodie basket? Ruby support for Lambda!

Personally, I love Ruby, and was really excited to play around with a Ruby deployment on the Serverless Framework.

So here you have it, Ruby fans. Your Ruby + Serverless Framework getting started template. I'm going to start by covering some Ruby + Serverless Framework basics and testing practices, and then we'll build a fully-fledged Ruby API.

Let's get to it.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/ruby/serverless-ruby-body.png" alt="Serverless Ruby API">

#### Getting Started

First up, we need to install the Serverless Framework (if you haven't already), and create a new Ruby service:

```
npm install -g serverless
serverless create -t aws-ruby -p myservice
```
Navigate to your new service folder, and deploy the default `hello world`:

```
cd myservice
sls deploy
sls invoke -f hello 
```

##### Testing Locally

Right now the framework only supports NodeJS, Python and Java in the local testing. (We hope to get that updated soon!) In the meantime, because Ruby is awesome, we have some great testing tools and capabilities right at our fingertips with some of the built-in testing tooling.

Let's say we want to run our local handler and make sure it returns the status code:

```
mkdir test
touch test/handler_test.rb
```

Open `test/handler_test.rb` in a and copy/paste in the following code:

```ruby
require_relative '../handler.rb'
require 'test/unit'

class TestHandler < Test::Unit::TestCase
    def test_happy_path()
        response = hello(event: {}, context: {})
        assert_equal 200, response[:statusCode]
        assert_match /Serverless/, response[:body]
    end
end
```

If we run `ruby -I test test/handler_test.rb`, we'll get a nice simulated invoke (assuming you have Ruby installed locally of course).

We'll dive a bit more into this in the next more advanced section, building an API!

#### Building an API With Ruby, the Serverless Framework, and AWS Lambda

Building on what we already have in `serverless.yml`, let's add an event to our function:

```yaml
service: aws-ruby # NOTE: update this with your service name

provider:
  name: aws
  runtime: ruby2.5

functions:
  hello:
    handler: handler.hello
    events:
      - http:
          path: hello
          method: post
```

Let's also update our `handler.rb` with a some more interesting logic. We're going to echo back a posted request body as part of the message.

If we don't get a request body or something else goes wrong, we handle that as well:

```ruby
require 'json'

def hello(event:, context:)
  begin
    puts "Received Request: #{event}"

    { statusCode: 200, body: JSON.generate("Go Serverless v1.0! Your function executed successfully! #{event['body']}") }
  rescue StandardError => e  
    puts e.message  
    puts e.backtrace.inspect  
    { statusCode: 400, body: JSON.generate("Bad request, please POST a request body!") }
  end
end
```

As always, let's update our test to make sure we're still happy. Make `test/handler_test.rb` contain the following:

```ruby
require_relative '../handler.rb'
require 'test/unit'

class TestHandler < Test::Unit::TestCase
    def test_happy_path()
        response = hello(event: {"body": "Hello, World!"}, context: {})
        assert_equal 200, response[:statusCode]
        assert_match /Serverless/, response[:body]
    end

    def test_sad_path()
        response = hello(event: nil, context: {})
        assert_equal 400, response[:statusCode]
        assert_match /please POST/, response[:body]
    end
end
```

After running a quick `ruby -I test test/handler_test.rb` to make sure all our tests still pass, then an `sls deploy`, we should have an API!

```text
Serverless: Stack update finished...
Service Information
service: aws-ruby
stage: dev
region: us-east-2
stack: aws-ruby-dev
api keys:
  None
endpoints:
  POST - https://someid.execute-api.us-east-1.amazonaws.com/dev/hello
functions:
  hello: aws-ruby-dev-hello
```

Grab that `POST` endpoint, run a curl against it, and you should see something like the following:

```
# curl -X POST https://someid.execute-api.us-east-2.amazonaws.com/dev/hello -d "Hello, World!"
"Go Serverless v1.0! Your function executed successfully! Hello, World!
```

#### Ruby Examples

I can't wait to see what the serverless community builds with Ruby! When you make your first (or fifth) Ruby app, please do submit it to our [Examples Repo](https://github.com/serverless/examples) and share it with the community.

Here are some great community examples contributions we've already gotten:
-[aws-ruby-simple-http-endpoint](https://github.com/serverless/examples/tree/master/aws-ruby-simple-http-endpoint)
