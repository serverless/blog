---
title: How to create a REST API in Java using DynamoDB and Serverless
description: Build a serverless REST API service in Java, store the data in a DynamoDB table, and deploy it to AWS. All using the Serverless Framework.
date: 2018-04-16
thumbnail: https://user-images.githubusercontent.com/8188/38645932-e1973882-3db3-11e8-8a12-9a68ac905a10.png
category:
  - guides-and-tutorials
authors:
  - RupakGanguly
---

In this walkthough, we will build a `products-api` serverless service that will implement a REST API for products. We will be using Java as our language of choice. The data will be stored in a DynamoDB table, and the service will be deployed to AWS.

![image](https://user-images.githubusercontent.com/8188/38645675-ec708d0e-3db2-11e8-8f8b-a4a37ed612b9.png)

What we will cover:

* Pre-requisites
* Creating the REST API service
* Deep dive into the Java code
* Deploying the service
* Calling the API


## Install Pre-requisites

Before we begin, you'll need the following:

* Install `node` and `npm`
* Install the [Serverless Framework installed](https://serverless.com/framework/docs/providers/aws/guide/quick-start/) with an AWS account set up.
* Install [Oracle JDK](http://www.oracle.com/technetwork/java/javase/downloads/index.html) and NOT Java JRE. Set the following:
`export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-10.jdk/Contents/Home`
* Install [Apache Maven](https://maven.apache.org/). After [downloading](https://maven.apache.org/download.html) and [installing](https://maven.apache.org/install.html) Apache Maven, add the `apache-maven-x.x.x` folder to the `PATH` environment variable.

### Testing Pre-requisites

Test Java installation:

```bash
$ java --version

java 10 2018-03-20
Java(TM) SE Runtime Environment 18.3 (build 10+46)
Java HotSpot(TM) 64-Bit Server VM 18.3 (build 10+46, mixed mode)
```

Test Maven installation:

```bash
$ mvn -v

Apache Maven 3.5.3 (3383c37e1f9e9b3bc3df5050c29c8aff9f295297; 2018-02-24T14:49:05-05:00)
Maven home: /usr/local/apache-maven-3.5.3
Java version: 10, vendor: Oracle Corporation
Java home: /Library/Java/JavaVirtualMachines/jdk-10.jdk/Contents/Home
Default locale: en_US, platform encoding: UTF-8
OS name: "mac os x", version: "10.13.3", arch: "x86_64", family: "mac"
```

## Create the Serverless project

Let's create a project named `products-api`, using the `aws-java-maven` boilerplate template provided by the [Serverless Framework](https://serverless.com/framework/), as shown below:

```bash
$ serverless create --template aws-java-maven --name products-api -p aws-java-products-api

Serverless: Generating boilerplate...
Serverless: Generating boilerplate in "/Users/rupakg/projects/svrless/apps/aws-java-products-api"
 _______                             __
|   _   .-----.----.--.--.-----.----|  .-----.-----.-----.
|   |___|  -__|   _|  |  |  -__|   _|  |  -__|__ --|__ --|
|____   |_____|__|  \___/|_____|__| |__|_____|_____|_____|
|   |   |             The Serverless Application Framework
|       |                           serverless.com, v1.26.1
 -------'

Serverless: Successfully generated boilerplate for template: "aws-java-maven"
```

### Updating the project

The serverless boilerplate template `aws-java-maven` gives us a nice starting point and builds a fully functional service using Java and Maven. However, we'll need to adapt it to our Products API service that we are building.

Let's update the project `hello` to `products-api` in the POM i.e. `pom.xml`:

```xml
<groupId>com.serverless</groupId>
<artifactId>products-api</artifactId>
<packaging>jar</packaging>
<version>dev</version>
<name>products-api</name>
```

### The `serverless.yml`

Let's add the relevant Lambda handlers under `functions` and update the deployment artifact under `package`, as per our project requirements.

Update the following sections:

```yml
package:
  artifact: 'target/${self:service}-${self:provider.stage}.jar'

functions:
  listProducts:
    handler: com.serverless.ListProductsHandler

  getProduct:
    handler: com.serverless.GetProductHandler

  createProduct:
    handler: com.serverless.CreateProductHandler

  deleteProduct:
    handler: com.serverless.DeleteProductHandler

```

## Managing the DynamoDB table

Since we will be using a DynamoDB table to store our products data, we will let the Serverless Framework manage the DynamoDB resource and the relevant IAM Role permissions for the lambda functions to access the DynamoDB table.

Add the following section for `iamRoleStatements` under the `provider` section in the `serverless.yml` file:

```yml
iamRoleStatements:
   - Effect: "Allow"
     Action:
       - "dynamodb:*"
     Resource: "*"
```

Now, to create and manage the DynamoDB table from within our serverless project, we can add a `resources` section to our `serverless.yml` file. This section describes the DynamoDB resource via a CloudFormation syntax:

```yml
resources:
  Resources:
    productsTable:
      Type: AWS::DynamoDB::Table
      Properties:
        TableName: products_table
        AttributeDefinitions:
          - AttributeName: id
            AttributeType: S
          - AttributeName: name
            AttributeType: S
        KeySchema:
          - AttributeName: id
            KeyType: HASH
          - AttributeName: name
            KeyType: RANGE
        ProvisionedThroughput:
          ReadCapacityUnits: 1
          WriteCapacityUnits: 1
```

## The DynamoDB Adapter

We will create an adapter whose responsibility will be to manage the connection to the specifed DynamoDB table using configuration, like the AWS region where the table will be deployed. The DynamoDB adapter class is a singleton that instantiates a AmazonDynamoDB client and a [AWS DBMapper](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.Methods.html) class.

Here's an excerpt from the DynamoDBAdapter class:

```java
package com.serverless.dal;
...

public class DynamoDBAdapter {
    ...
    private DynamoDBAdapter() {
        this.client = AmazonDynamoDBClientBuilder.standard()
            .withRegion(Regions.US_EAST_1)
            .build();
    }
    public static DynamoDBAdapter getInstance() {
        if (db_adapter == null)
          db_adapter = new DynamoDBAdapter();

        return db_adapter;
    }
    ...
    public DynamoDBMapper createDbMapper(DynamoDBMapperConfig mapperConfig) {
        if (this.client != null)
            mapper = new DynamoDBMapper(this.client, mapperConfig);

        return this.mapper;
    }
}
```

## The Product POJO

We have the Product [POJO](https://en.wikipedia.org/wiki/Plain_old_Java_object) that represents the Product entity and encapsulates all its functionality in a class. The Product POJO class defines a data structure that matches the DynamoDB table schema and provides helper methods for easy management of product data.

> The AWS SDK provides an easy way to annotate a POJO with DynamoDB specific attributes as defined by [Java Annotations for DynamoDB](https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/DynamoDBMapper.Annotations.html)

We annotate the Product POJO class with:

* a `DynamoDBTable` attribute to specify the DynamoDB table name
* a `DynamoDBHashKey` attribute to map a property to a DynamoDB Haskey
* a `DynamoDBRangeKey` attribute to map a property to a DynamoDB RangeKey
* a `DynamoDBAutoGeneratedKey` attribute to map a property that needs to get a auto-generated id

Also, note that we get the product table name from a environment variable `PRODUCTS_TABLE_NAME` defined in our `serverless.yml` file:

```java
package com.serverless.dal;
...

@DynamoDBTable(tableName = "PLACEHOLDER_PRODUCTS_TABLE_NAME")
public class Product {
    private static final String PRODUCTS_TABLE_NAME = System.getenv("PRODUCTS_TABLE_NAME");
    ...
    private String id;
    private String name;
    private Float price;

    @DynamoDBHashKey(attributeName = "id")
    @DynamoDBAutoGeneratedKey
    public String getId() {
        return this.id;
    }
    public void setId(String id) {
        this.id = id;
    }

    @DynamoDBRangeKey(attributeName = "name")
    public String getName() {
        return this.name;
    }
    public void setName(String name) {
        this.name = name;
    }

    @DynamoDBAttribute(attributeName = "price")
    public Float getPrice() {
        return this.price;
    }
    public void setPrice(Float price) {
        this.price = price;
    }
    ...
}
```

Next, let's look at the methods that the Product POJO utilizes for data management.

### The constructor method

The public constructor does a couple of things:

* Overrides the `PLACEHOLDER_PRODUCTS_TABLE_NAME` table name annotation value with the actual value from the environment variable
* Gets an instance of DynamoDBAdapter
* Gets an instance of AmazonDynamoDB client
* Gets an instance of DynamoDBMapper


```java
public Product() {
    DynamoDBMapperConfig mapperConfig = DynamoDBMapperConfig.builder()
        .withTableNameOverride(new DynamoDBMapperConfig.TableNameOverride(PRODUCTS_TABLE_NAME))
        .build();
    this.db_adapter = DynamoDBAdapter.getInstance();
    this.client = this.db_adapter.getDbClient();
    this.mapper = this.db_adapter.createDbMapper(mapperConfig);
}
```

### The list() method

The `list()` method uses a `DynamoDBScanExpression` construct to retrieve all the products from the products table. It returns a list of  products via the `List<Product>` data structure. It also logs the list of products retrieved.

```java
public List<Product> list() throws IOException {
  DynamoDBScanExpression scanExp = new DynamoDBScanExpression();
  List<Product> results = this.mapper.scan(Product.class, scanExp);
  for (Product p : results) {
    logger.info("Products - list(): " + p.toString());
  }
  return results;
}
```

### The get() method

The `get()` method takes a product `id` and uses a `DynamoDBQueryExpression` to set up a query expression to match the passed in product `id`. The `mapper` object has a `query` method that is passed the `queryExp`, to retrieve the matching product:

```java
public Product get(String id) throws IOException {
    Product product = null;

    HashMap<String, AttributeValue> av = new HashMap<String, AttributeValue>();
    av.put(":v1", new AttributeValue().withS(id));

    DynamoDBQueryExpression<Product> queryExp = new DynamoDBQueryExpression<Product>()
        .withKeyConditionExpression("id = :v1")
        .withExpressionAttributeValues(av);

    PaginatedQueryList<Product> result = this.mapper.query(Product.class, queryExp);
    if (result.size() > 0) {
      product = result.get(0);
      logger.info("Products - get(): product - " + product.toString());
    } else {
      logger.info("Products - get(): product - Not Found.");
    }
    return product;
}
```

### The save() method

The `save()` method takes a `product` instance populated with values, and passes it to the `mapper` object's `save` method, to save the product to the underlying table:

```java
public void save(Product product) throws IOException {
    logger.info("Products - save(): " + product.toString());
    this.mapper.save(product);
}
```

### The delete() method

The `delete()` method takes a product `id` and then calls the `get()` method to first validate if a product with a matching `id` exists. If it exists, it calls the `mapper` object's `delete` method, to delete the product from the underlying table:

```java
public Boolean delete(String id) throws IOException {
    Product product = null;

    // get product if exists
    product = get(id);
    if (product != null) {
      logger.info("Products - delete(): " + product.toString());
      this.mapper.delete(product);
    } else {
      logger.info("Products - delete(): product - does not exist.");
      return false;
    }
    return true;
}
```

**Note**: The Product POJO class can be independently tested to make sure the data management functionality works against a DynamoDB table. This seperation allows us to write unit tests to test the core DAL functionality.

## Implementing the API

Now, that our Product DAL is written up and works as expected, we can start looking at the API function handlers that will be calling the Product DAL to provide the expected functionality.

We will define the API endpoints, then map the events to the handlers and finally write the handler code.


### The API Endpoints

Before we look at the API handlers, let's take a look at the API endpoints that we will map to the handlers.

The API endpoints will look like:

`POST /products`: Create a product and save it to the DynamoDB table.

`GET /products/`: Retrieves all existing products.

`GET /products/{id}`: Retrieves an existing product by `id`.

`DELETE /products/{id}`: Deletes an existing product by `id`.


### Mapping Events to Handlers

To implement the API endpoints we described above, we need to add  events that map our API endpoints to the corresponsing Lambda function handlers.

Update the following sections in the `serverless.yml`:

```yml
functions:
  listProducts:
    handler: com.serverless.ListProductsHandler
    events:
      - http:
          path: /products
          method: get
  getProduct:
    handler: com.serverless.GetProductHandler
    events:
      - http:
          path: /products/{id}
          method: get
  createProduct:
    handler: com.serverless.CreateProductHandler
    events:
      - http:
          path: /products
          method: post
  deleteProduct:
    handler: com.serverless.DeleteProductHandler
    events:
      - http:
          path: /products/{id}
          method: delete
```
The `listProducts` Lambda function maps to the `ListProductsHandler` handler and maps to the `http` event accessible at path `/products`. We define the other mappings in a similar fashion.

## Writing the Handlers

Let's write the code for the four handlers that will provide us the needed functionality to implement the Products REST API. Let's copy the `Handler.java` file that was generated by the boilerplate and create four new files under the `src/main/java/com/serverless` folder. We can now delete the `Handler.java` file.

* `CreateProductHandler.java`
* `ListProductHandler.java`
* `GetProductHandler.java`
* `DeleteProductHandler.java`

The basic code for all the handlers are the same. Each handler is defined as a class that implements `RequestHandler` from the AWS Lambda runtime. Then the `handleRequest` method is overriden in the class to provide the custom logic for the handler. The `handleRequest` method receives a `Map` object with the inputs from the caller and a `Context` object with information about the caller's environment.


### Create Product Handler

The `CreateProductHandler` method reads the JSON data received via the `body` attribute from the `input` object passed in. This data is used to instantiate a new Product instance, and the `save()` method is called to save the product to the underlying DynamoDB table.

If the call is successful, a `200 OK` response is returned back. In case of an error or exception, the exception is caught and a `500 Internal Server Error` response is returned back:

```java
package com.serverless;
...
import com.serverless.dal.Product;

public class CreateProductHandler implements RequestHandler<Map<String, Object>, ApiGatewayResponse> {

	private final Logger logger = Logger.getLogger(this.getClass());

	@Override
	public ApiGatewayResponse handleRequest(Map<String, Object> input, Context context) {

      try {
          // get the 'body' from input
          JsonNode body = new ObjectMapper().readTree((String) input.get("body"));

          // create the Product object for post
          Product product = new Product();
          // product.setId(body.get("id").asText());
          product.setName(body.get("name").asText());
          product.setPrice((float) body.get("price").asDouble());
          product.save(product);

          // send the response back
      		return ApiGatewayResponse.builder()
      				.setStatusCode(200)
      				.setObjectBody(product)
      				.setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & Serverless"))
      				.build();

      } catch (Exception ex) {
          logger.error("Error in saving product: " + ex);

          // send the error response back
    			Response responseBody = new Response("Error in saving product: ", input);
    			return ApiGatewayResponse.builder()
    					.setStatusCode(500)
    					.setObjectBody(responseBody)
    					.setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & Serverless"))
    					.build();
      }
	}
}
```

### List Product Handler

The `ListProductHandler` calls the `list()` method on the product instance to get back a list of products.

If the call is successful, a `200 OK` response is returned back. In case of an error or exception, the exception is caught and a `500 Internal Server Error` response is returned back:

```java
package com.serverless;
...
import com.serverless.dal.Product;

public class ListProductsHandler implements RequestHandler<Map<String, Object>, ApiGatewayResponse> {

	private final Logger logger = Logger.getLogger(this.getClass());

	@Override
	public ApiGatewayResponse handleRequest(Map<String, Object> input, Context context) {
    try {
        // get all products
        List<Product> products = new Product().list();

        // send the response back
        return ApiGatewayResponse.builder()
    				.setStatusCode(200)
    				.setObjectBody(products)
    				.setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & Serverless"))
    				.build();
    } catch (Exception ex) {
        logger.error("Error in listing products: " + ex);

        // send the error response back
        ...
    }
  }
}
```

### Get Product Handler

The `GetProductHandler` receives the `id` via the path parameters attribute of the input. Then it calls the `get()` method on the product instance passes it the `id` to get back a matching product.

If the call is successful, a `200 OK` response is returned back. If no products with the matching `id` are found, a `404 Not Found` response is returned back. In case of an error or exception, the exception is caught and a `500 Internal Server Error` response is returned back:

```java
package com.serverless;
...
import com.serverless.dal.Product;

public class GetProductHandler implements RequestHandler<Map<String, Object>, ApiGatewayResponse> {

	private final Logger logger = Logger.getLogger(this.getClass());

	@Override
	public ApiGatewayResponse handleRequest(Map<String, Object> input, Context context) {

    try {
        // get the 'pathParameters' from input
        Map<String,String> pathParameters =  (Map<String,String>)input.get("pathParameters");
        String productId = pathParameters.get("id");

        // get the Product by id
        Product product = new Product().get(productId);

        // send the response back
        if (product != null) {
          return ApiGatewayResponse.builder()
      				.setStatusCode(200)
      				.setObjectBody(product)
      				.setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & Serverless"))
      				.build();
        } else {
          return ApiGatewayResponse.builder()
                .setStatusCode(404)
                .setObjectBody("Product with id: '" + productId + "' not found.")
                .setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & Serverless"))
                .build();
        }
    } catch (Exception ex) {
        logger.error("Error in retrieving product: " + ex);

        // send the error response back
        ...
    }
  }
}
```

### Delete Product Handler

The `DeleteProductHandler` receives the `id` via the path parameters attribute of the input. Then it calls the `delete()` method on the product instance passing it the `id` to delete the product.

If the call is successful, a `204 No Content` response is returned back. If no products with the matching `id` are found, a `404 Not Found` response is returned back. In case of an error or exception, the exception is caught and a `500 Internal Server Error` response is returned back:

```java
package com.serverless;
...
import com.serverless.dal.Product;

public class DeleteProductHandler implements RequestHandler<Map<String, Object>, ApiGatewayResponse> {

	private final Logger logger = Logger.getLogger(this.getClass());

	@Override
	public ApiGatewayResponse handleRequest(Map<String, Object> input, Context context) {

    try {
        // get the 'pathParameters' from input
        Map<String,String> pathParameters =  (Map<String,String>)input.get("pathParameters");
        String productId = pathParameters.get("id");

        // get the Product by id
        Boolean success = new Product().delete(productId);

        // send the response back
        if (success) {
          return ApiGatewayResponse.builder()
      				.setStatusCode(204)
      				.setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & Serverless"))
      				.build();
        } else {
          return ApiGatewayResponse.builder()
      				.setStatusCode(404)
      				.setObjectBody("Product with id: '" + productId + "' not found.")
      				.setHeaders(Collections.singletonMap("X-Powered-By", "AWS Lambda & Serverless"))
      				.build();
        }
    } catch (Exception ex) {
        logger.error("Error in deleting product: " + ex);

        // send the error response back
        ...
    }
  }
}
```

**Note:** The full [source code](https://github.com/rupakg/aws-java-products-api) for the project is available on Github.

## Deploying the service

Now that we've looked at the code and understand the overall workings of the service, let's build the Java code, and deploy the service to the cloud.

To build the Java code:

```bash
$ mvn clean install

[INFO] Scanning for projects...
[INFO]
[INFO] --------------------< com.serverless:products-api >---------------------
[INFO] Building products-api dev
[INFO] --------------------------------[ jar ]---------------------------------
[INFO]
[INFO] --- maven-clean-plugin:2.5:clean (default-clean) @ products-api ---
[INFO] Deleting /Users/rupakg/projects/svrless/apps/aws-java-products-api/target

...
...

[INFO] --- maven-install-plugin:2.4:install (default-install) @ products-api ---
[INFO] Installing /Users/rupakg/projects/svrless/apps/aws-java-products-api/target/products-api-dev.jar to /Users/rupakg/.m2/repository/com/serverless/products-api/dev/products-api-dev.jar
[INFO] Installing /Users/rupakg/projects/svrless/apps/aws-java-products-api/pom.xml to /Users/rupakg/.m2/repository/com/serverless/products-api/dev/products-api-dev.pom
[INFO] ------------------------------------------------------------------------
[INFO] BUILD SUCCESS
[INFO] ------------------------------------------------------------------------
[INFO] Total time: 2.790 s
[INFO] Finished at: 2018-04-08T19:58:15-04:00
[INFO] ------------------------------------------------------------------------
```
After a successful build, we should have an artifact at `aws-java-products-api/target/products-api-dev.jar` that we will use in our deployment step.

Let's deploy the service to the cloud:

```bash
$ sls deploy

Serverless: Packaging service...
Serverless: Creating Stack...
Serverless: Checking Stack create progress...
.....
Serverless: Stack create finished...
Serverless: Uploading CloudFormation file to S3...
Serverless: Uploading artifacts...
Serverless: Validating template...
Serverless: Updating Stack...
Serverless: Checking Stack update progress...
..................................
Serverless: Stack update finished...
Service Information
service: products-api
stage: dev
region: us-east-1
stack: products-api-dev
api keys:
  None
endpoints:
  GET - https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products
  GET - https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products/{id}
  POST - https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products
  DELETE - https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products/{id}
functions:
  listProducts: products-api-dev-listProducts
  getProduct: products-api-dev-getProduct
  createProduct: products-api-dev-createProduct
  deleteProduct: products-api-dev-deleteProduct
```
On a successful deployment, we will have our four API endpoints listed as shown above.

## Calling the API

Now that we have a fully functional REST API deployed to the cloud, let's call the API endpoints.

### Create Product

```bash
$ curl -X POST https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products -d '{"name": "Product1", "price": 9.99}'

{"id":"ba04f16b-f346-4b54-9884-957c3dff8c0d","name":"Product1","price":9.99}
```

Now, we'll make a few calls to add some products.


### List Products

```bash
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products

[{"id":"dfe41235-0fe5-4e6f-9a9a-19b7b7ee79eb","name":"Product3","price":7.49},
{"id":"ba04f16b-f346-4b54-9884-957c3dff8c0d","name":"Product1","price":9.99},
{"id":"6db3efe0-f45c-4c5f-a73c-541a4857ae1d","name":"Product4","price":2.69},
{"id":"370015f8-a8b9-4498-bfe8-f005dbbb501f","name":"Product2","price":5.99},
{"id":"cb097196-d659-4ba5-b6b3-ead4c07a8428","name":"Product5","price":15.49}]
```

Here's the `java-products-dev` DynamoDB table listing our products:

![image](https://user-images.githubusercontent.com/8188/38694756-7231c25a-3e58-11e8-8f7c-d7551aaa86c9.png)

**No Product(s) Found:**

```bash
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products

[]
```

### Get Product

```bash
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products/ba04f16b-f346-4b54-9884-957c3dff8c0d

{"id":"ba04f16b-f346-4b54-9884-957c3dff8c0d","name":"Product1","price":9.99}
```

**Product Not Found:**

```bash
curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products/xxxx

"Product with id: 'xxxx' not found."
```

### Delete Product

```bash
$ curl -X DELETE https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products/24ada348-07e8-4414-8a8f-7903a6cb0253
```

**Product Not Found:**

```bash
curl -X DELETE https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products/xxxx

"Product with id: 'xxxx' not found."
```

### View the CloudWatch Logs

We have used the `log4j.Logger` in our Java code to log relevant info and errors to the logs. In case of AWS, the logs can be retrieved from CloudWatch.

Let's do a GET call and then take a look at the logs from our terminal:

```bash
// call get product API
$ curl https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/products/6f1dfeb9-ea08-4161-8877-f6cc724b39e3
```

```bash
// check logs
$ serverless logs --function getProduct

START RequestId: 34f45684-3dd0-11e8-bf8a-7f961671b2de Version: $LATEST
...

2018-04-11 21:35:14 <34f45684-3dd0-11e8-bf8a-7f961671b2de> DEBUG org.apache.http.wire:86 - http-outgoing-0 >> "{"TableName":"java-products-dev","ConsistentRead":true,"ScanIndexForward":true,"KeyConditionExpression":"id = :v1","ExpressionAttributeValues":{":v1":{"S":"6f1dfeb9-ea08-4161-8877-f6cc724b39e3"}}}"

...

2018-04-11 21:35:14 <34f45684-3dd0-11e8-bf8a-7f961671b2de> DEBUG org.apache.http.wire:86 - http-outgoing-0 << "{"Count":1,"Items":[{"price":{"N":"9.99"},"id":{"S":"6f1dfeb9-ea08-4161-8877-f6cc724b39e3"},"name":{"S":"Product1"}}],"ScannedCount":1}"

...

2018-04-11 21:35:14 <34f45684-3dd0-11e8-bf8a-7f961671b2de> DEBUG org.apache.http.impl.conn.PoolingHttpClientConnectionManager:314 - Connection [id: 0][route: {s}->https://dynamodb.us-east-1.amazonaws.com:443] can be kept alive for 60.0 seconds
2018-04-11 21:35:14 <34f45684-3dd0-11e8-bf8a-7f961671b2de> DEBUG org.apache.http.impl.conn.PoolingHttpClientConnectionManager:320 - Connection released: [id: 0][route: {s}->https://dynamodb.us-east-1.amazonaws.com:443][total kept alive: 1; route allocated: 1 of 50; total allocated: 1 of 50]
2018-04-11 21:35:14 <34f45684-3dd0-11e8-bf8a-7f961671b2de> DEBUG com.amazonaws.request:87 - Received successful response: 200, AWS Request ID: MT1EV3AV07T9OD0MJH9VBJSIB7VV4KQNSO5AEMVJF66Q9ASUAAJG
2018-04-11 21:35:14 <34f45684-3dd0-11e8-bf8a-7f961671b2de> DEBUG com.amazonaws.requestId:136 - x-amzn-RequestId: MT1EV3AV07T9OD0MJH9VBJSIB7VV4KQNSO5AEMVJF66Q9ASUAAJG
2018-04-11 21:35:14 <34f45684-3dd0-11e8-bf8a-7f961671b2de> INFO  com.serverless.dal.Product:107 - Products - get(): product - Product [id=6f1dfeb9-ea08-4161-8877-f6cc724b39e3, name=Product1, price=$9.990000]
END RequestId: 34f45684-3dd0-11e8-bf8a-7f961671b2de
REPORT RequestId: 34f45684-3dd0-11e8-bf8a-7f961671b2de	Duration: 5147.00 ms	Billed Duration: 5200 ms 	Memory Size: 1024 MB	Max Memory Used: 97 MB
```

Notice the lines about the database connection being open/closed, the request data structure going to DynamoDB and then the response coming back, and finally the response data structure that is being returned by our API code.

## Removing the service

At any point in time, if you want to remove the service from the cloud you can do the following:

```bash
$ sls remove

Serverless: Getting all objects in S3 bucket...
Serverless: Removing objects in S3 bucket...
Serverless: Removing Stack...
Serverless: Checking Stack removal progress...
..................................................
Serverless: Stack removal finished...
```
It will cleanup all the resources including IAM roles, the deployment bucket, the Lambda functions and will also delete the DynamoDB table.

## Summary

To recap, we used Java to create a serverless REST API service, built it and then deployed it to AWS. We took a deep dive into the DAL code that handles the backend data mapping and access to the DynamoDB table. We also looked at the mapping between events, the API endpoints and the lambda function handlers in the service, all described intuitively in the `serverless.yml` file.

By now, you should have an end-to-end implementation of a serverless REST API service written in Java and deployed to AWS.

Hope you liked the post, and feel free to give me your feedback or ask any questions, in the comments below.
