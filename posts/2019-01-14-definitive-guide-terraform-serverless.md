---
title: "The definitive guide to using Terraform with the Serverless Framework"
description: "Wondering when to use Terraform and/or the Serverless Framework for your infrastructure as code? We've got answers."
date: 2019-01-14
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/terraform/serverless-terraform-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/terraform/serverless-terraform-header.png'
category:
  - guides-and-tutorials
authors: 
  - SebastianBorza
---

If your organisation uses automation to manage cloud infrastructure, you’ve almost certainly heard about Terraform. And if you’ve built anything serverless, you might have noticed that deploying with the Serverless Framework is a lot like running Terraform.

To which we say: you’re absolutely right. Many companies using Serverless already use Terraform, and some Serverless Framework functionality is similar to what Terraform can do, especially when it comes to provisioning cloud resources.

So if both Terraform and Serverless can solve your infrastructure automation needs, which one should you use? And should you use just one for all purposes?

We’ve got answers.

In this article, we’ll talk about the right way to manage infrastructure when using both Terraform and Serverless, and check out a real-world example of integrating Terraform and Serverless in a project.

#### Why automate infrastructure management

Infrastructure as Code (IaC) becomes really important once developers need a way to organize their growing cloud infrastructure and collaborate across teams.

Most importantly, IaC tools make it necessary to have process and discipline; there’s a smaller chance of accidental or unexpected changes, and it’s easier to share configuration between different parts of your infrastructure.

#### Managing shared vs. app-specific infrastructure

While we believe that all infrastructure should be managed with IaC automation, we like to distinguish between the infrastructure that’s specific to one application and the infrastructure that’s shared between multiple applications in your stack. Those might need to be managed in different ways.

Application-specific infrastructure gets created and torn down as the app gets deployed. You rarely change a piece of application-specific infrastructure; you’ll just tear everything down and re-create it from scratch. As the app is developed, the infrastructure that supports it also needs to change, sometimes significantly from one deploy to another.

The shared infrastructure, on the other end, rarely gets re-created from scratch and is more stateful. The core set of infrastructure (such as the set of security groups and your VPC ID), won’t change between the deploys of your application, as they’re probably referenced by many applications in your stack. Those more persistent pieces of infrastructure will generally be managed outside of your deploy pipeline.

So, application-specific and shared infrastructure are different enough that they should be managed with different tools.

#### Serverless vs Terraform: when to use which

For an organization using both Terraform and Serverless, here are the benefits of each, and when you should choose one over the other.

##### Serverless for app-specific infrastructure

For application-specific infrastructure, we suggest managing all the pieces with the Serverless Framework, for a few reasons.

First, you couple this infrastructure to the application itself. Second, we like to think that the application "owns" things, like the tables in the Postgres database. There is little value in managing the table names outside of the application context (e.g. in Terraform).

Third, you can iterate your application release without touching your shared infrastructure. Software releases decouple from shared infrastructure, allowing you to focus on the application itself without having to worry about infrastructure changes.

##### Terraform for shared infrastructure

However, coupling shared infrastructure to a specific application isn’t correct. Shared infrastructure will usually get updated instead of re-created from scratch. 

This makes Terraform a nice way to manage that shared infrastructure; it can be a central source of truth for the persistent cloud infrastructure and it manages updates to the existing infrastructure very well.

##### For example

If you have a shared database and two Serverless applications that create tables in it, the database should be managed by Terraform.
The specific tables should be created and destroyed by the Serverless Framework during the app deployment and teardown process.

#### Where to draw the line

With a database and its tables, the distinction between app-specific and shared infrastructure is clear.

But what happens if the entire database is only being used by one app? What about the queues and queue subscriptions? What if there is a contract between two Serverless microservices and they use a queue as an interface?

All these items fall somewhere between the app-specific and the shared.

For cases like those, we believe either option is fine. It’s more important to avoid confusion by keeping the decision consistent across your infrastructure.

#### Sharing data between Terraform and Serverless with SSM

If you use Terraform and Serverless to manage different pieces of your infrastructure, you’ll eventually need to share data between Terraform and Serverless projects. Think VPC IDs, security group IDs, database names for RDS instances—everything that gets created via Terraform and consumed in Serverless.

[The SSM parameter store](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store) is a great way to share the values between the two systems. Terraform provides [an SSM parameter resource](https://www.terraform.io/docs/providers/aws/r/ssm_parameter.html) that you can use to write arbitrary SSM keys. You can then consume those keys in your `serverless.yml` via the `${ssm:...}` reference.

#### An example of using SSM with Terraform and Serverless

To illustrate the passing of parameters via SSM, we’ve created an example!

Infrastructure is managed by Terraform, and there is a Serverless app that uses the results of Terraform operations to connect to a database. The application can use that database connection to create the database tables or anything else required for the application itself to work.

Let’s walk through both the Terraform and the Serverless configuration files to see how this looks in a simple project.

##### Terraform

In the Terraform project, we create a resource that we need, in this case it’s a MySQL RDS instance:

```
# main.tf
provider "aws" {
  region = "us-east-1"
}

resource "aws_db_instance" "default" {
  name                   = "${var.name}"
  username               = "${var.user}"
  password               = "${random_string.password.result}"
  parameter_group_name   = "default.mysql5.7"
  # a few more options go here…
}
```

We use the `aws_db_instance` data source (you can find full documentation for it [here](https://www.terraform.io/docs/providers/aws/d/db_instance.html)). Instead of specifying the database name directly, we reference the variables called `name` and `user`, and generate a random string to act as a password.

We then create a `variables.tf` file with the content of `name` and `user`, and set a few parameters on the random string:

```
# variables.tf
variable "name" {
  default = "testdb"
}
variable "user" {
  default = "serverless"
}

resource "random_string" "password" {
  length  = 16
  special = false
}


Now, if we want the Serverless application to get the details of the DB connection string we need to save the DB name and the password as encrypted strings in the SSM parameter store. We can do that by using the aws_ssm_parameter resource like this:

# parameters.tf
resource "aws_ssm_parameter" "endpoint" {
  name        = "/database/${var.name}/endpoint"
  description = "Endpoint to connect to the ${var.name} database"
  type        = "SecureString"
  value       = "${aws_db_instance.default.address}"
}
...
```

When we run `terraform apply` the following happens:

1. `${var.name}` gets replaced by the name value that we define in the `variables.tf`.
2. Once the database we specify in `main.tf` is created, the `${aws_db_instance.default.address}` value is replaced with the IP address of the database instance.
3. An SSM parameter is created with the name `/database/testdb/endpoint` and contains the IP address of our database instance.

Our Terraform configuration stores not only the database endpoint, but also the database user, the password, and the name of the database we are accessing.

##### Serverless

In our Serverless config file, we define a function that needs to connect to the database that we manage with Terraform.

In the definition of the function, we create the environment variables to contain all the database connection parameters. In each variable, we reference an SSM parameter (you can find docs on this [here](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store)).

Note that we save the parameters to SSM as SecureStrings in the Terraform files above, so we need to use the special `~true` syntax to get those values inside `serverless.yml`:

```
# serverless.yml
service: terraform-serverless-integration

provider:
  name: aws
  runtime: nodejs8.10

functions:
  rdsConnector:
    handler: handler.handle
    environment:
      DATABASE_ENDPOINT: ${ssm:/database/testdb/endpoint~true}
      DATABASE_NAME: ${ssm:/database/testdb/name~true}
      DATABASE_USER: ${ssm:/database/testdb/user~true}
      DATABASE_PASSWORD: ${ssm:/database/testdb/password~true}
    events:
      - http:
          method: GET
          path: /
```
The variables we specify in the environment section get populated with the correct values from SSM during the deployment process, and those values become available in the function’s runtime environment.

In the body of the Serverless function we can then configure a MySQL connection with these values:

```
# handler.js

const mysql = require("serverless-mysql")({
  config: {
    host: process.env.DATABASE_ENDPOINT,
    database: process.env.DATABASE_NAME,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD
  }
});
...
```

After that, we’re able to access the MySQL database managed via Terraform in our Serverless application!

##### Changing the database connection data

If you need to change the configuration of the database in Terraform, upon running `terraform apply` the SSM parameters the Serverless app references get updated. But you need to redeploy the Serverless application to get those updated in the running app.

#### The limitations of SSM

SSM provides a convenient way to reference parameters from Terraform in your Serverless projects. It’s important to note, however, that SSM is *only* available in Amazon Web Services.

It’s also not the most secure solution, as the values from SSM might end up in the build logs or CloudFormation templates. (See the disclaimer [in this doc section](https://serverless.com/framework/docs/providers/aws/guide/variables/#reference-variables-using-the-ssm-parameter-store)).

Despite these limitations, the option of using SSM to pass data from Terraform to Serverless works for most cases of managing shared and app-specific infrastructure.

#### Conclusion

Terraform is best suited for managing more persistent shared infrastructure, while Serverless is a good fit to manage the application-specific infrastructure.

Check above for the example of sharing information between Terraform and Serverless, and you can find the full example here [in the GitHub repo](https://github.com/chief-wizard/serverless-terraform-example).

Do you currently use Terraform together with Serverless? Share your approach in the comments below or [in our forum](https://forum.serverless.com/)!
