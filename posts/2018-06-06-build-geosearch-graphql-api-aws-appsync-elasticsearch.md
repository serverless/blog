---
title: "Build a Serverless GeoSearch GraphQL API using AWS AppSync & Elasticsearch"
description: "Learn how to build a GraphQL location search service similar to AirBnB's using a fully serverless stack on AWS."
date: 2018-06-06
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/header+images/serverless-general-yellow.jpg'
category:
  - guides-and-tutorials
heroImage: ''
authors:
  - AndrewGriffiths
---

In this tutorial, we're going to build an Elasticsearch-backed GraphQL API on AWS AppSync. All using the Serverless Framework.

[AppSync](https://aws.amazon.com/appsync/) offers the ability to create serverless GraphQL APIs with much less backend code than previously possible. We will take advantage of this to create our own geo search service (similar to the one used by AirBnB), which will allow users to search for items within a 10km radius of a given location.

Let's get started!

1. [Setup](#setup)
2. [Deploy Elasticsearch on AWS](#deploy-elasticsearch)
3. [Elasticsearch Geo Mappings](#elasticsearch-geomappings)
4. [Define GraphQL Schema for API](#graphql-schema)
5. [Appsync Mapping Template GraphQL Resolvers](#es-mapping-templates)
6. [Deploy GraphQL Appsync API](#deploy-api)
7. [Teardown](#destroy)


## 1. <a name="setup"></a>Setup
Go ahead and install the [Serverless Framework](https://serverless.com/framework/) CLI and create a new directory for our project:

```Shell
$ npm install -g serverless
$ mkdir geosearch
$ cd geosearch
```

## 2. <a name="deploy-elasticsearch"></a>Deploy Elasticsearch on AWS
First we need to provision our elasticsearch deployment on AWS. Create a `serverless.yml` file with the following contents:

```yaml
---
service: appsync-placesearch

frameworkVersion: ">=1.21.0 <2.0.0"

provider:
  name: aws
  region: eu-west-1

custom:
  esDomainName: placesearch
  esRoleName: AppSyncServiceRole

resources:
  Resources:
    ElasticSearchInstance:
      Type: AWS::Elasticsearch::Domain
      Properties:
        ElasticsearchVersion: 6.2
        DomainName: "${self:custom.esDomainName}"
        EBSOptions:
          EBSEnabled: true
          VolumeType: gp2
          VolumeSize: 10
        ElasticsearchClusterConfig:
          InstanceType: t2.small.elasticsearch
          InstanceCount: 1
          DedicatedMasterEnabled: false
          ZoneAwarenessEnabled: false
    AppSyncESServiceRole:
      Type: "AWS::IAM::Role"
      Properties:
        RoleName: "ElasticSearch-${self:custom.esRoleName}"
        AssumeRolePolicyDocument:
          Version: "2012-10-17"
          Statement:
            -
              Effect: "Allow"
              Principal:
                Service:
                  - "appsync.amazonaws.com"
              Action:
                - "sts:AssumeRole"
        Policies:
          -
            PolicyName: "AppSyncESServiceRolePolicy"
            PolicyDocument:
              Version: "2012-10-17"
              Statement:
                -
                  Effect: "Allow"
                  Action:
                    - "es:*"
                  Resource:
                    - 'Fn::Join':
                        - ''
                        -
                          - 'arn:aws:es:'
                          - Ref: 'AWS::Region'
                          - ':'
                          - Ref: 'AWS::AccountId'
                          - ':domain/'
                          - "${self:custom.esDomainName}"
                          - '/*'
```

This creates a cluster with a single instance running Elasticsearch version 6, and adds a role to access it. This will be used by the Appsync service we're creating later.

Let's go ahead and deploy this:

```Shell
$ serverless deploy
```

## 3. <a name="elasticsearch-geomappings"></a>Elasticsearch Geo Mappings

Elasticsearch supports two types of geo data: [`geo_point` fields](https://www.elastic.co/guide/en/elasticsearch/reference/current/geo-point.html) which support lat/lon pairs, and `geo_shape` fields which support points, lines, circles, polygons, multi-polygons etc.

To keep things simple, we're going to use `geo_point` fields to create a [geo distance query](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html). This will enable us to find places by distance from a central point.

In order to be able to use `geo_point` fields, we need to set up a mapping in elasticsearch. We're going to create a Lambda function to do this.

We'll use a library I wrote just for this purpose, [elasticsearchquery](https://github.com/techjacker/elasticsearchquery). It allows us to specify a JSON document containing our query to be invoked against an Elasticsearch deployment. The library takes care of [signing the requests](https://docs.aws.amazon.com/general/latest/gr/signature-version-4.html), which is required in order to query AWS Elasticsearch instances.

In order to instruct `serverless` to install the library when it packages the Lambda function, we'll need to create a `requirements.txt` file listing our dependency:

```ini
# requirements.txt
elasticsearchquery
```

We'll also need to install the `serverless-python-requirements` plugin:

```Shell
$ npm install --dev serverless-python-requirements
```

Now we're ready to create our Elasticsearch mapping. Create a JSON document named `location_geopoint_mapping.json` containing the query needed to create our geo mapping:

```JSON
{
  "mappings": {
    "_doc": {
      "properties": {
        "location": {
          "type": "geo_point"
        }
      }
    }
  }
}
```

Then, create the Lambda function to trigger this query. Create a file at `handlers/elasticsearch_geomapping.py` with the following contents:

```Python
import os
from elasticsearchquery import ElasticSearchQuery


def handler(event, context):
    esQuery = ElasticSearchQuery(
        es_endpoint=os.environ['ES_ENDPOINT'],
        index_name=os.environ['ES_INDEX'],
        query_file=os.environ['ES_GEO_MAPPING_FILE'],
        region=os.environ['ES_REGION'],
    )
    esQuery.run()
```

As you can see, we need to supply our Lambda function some parameters so that it knows the location of the Elaticsearch query JSON and the URL of the Elasticsearch deployment. We'll need to update our serverless config file to supply these, and also to create the required permissions for the Lambda function to access the cluster.

Add the following to `serverless.yml`:

```Yaml{5-6,11,16-20,22-32,36-79}
service: appsync-placesearch

frameworkVersion: ">=1.21.0 <2.0.0"

plugins:
  - serverless-python-requirements

provider:
  name: aws
  region: eu-west-1
  runtime: python3.6

custom:
  esDomainName: placesearch
  esRoleName: AppSyncServiceRole
  esGeoIndex: places
  esRegion: eu-west-1
  esGeoMappingFile: location_geopoint_mapping.json
  pythonRequirements:
    dockerizePip: true

functions:
  elasticsearchGeoMapping:
    handler: handlers/elasticsearch_geomapping.handler
    name: elasticsearchGeoMapping
    description: Creates geo mapping in Elasticsearch
    role: esGeoLambdaServiceRole
    environment:
      ES_ENDPOINT: ${self:custom.esEndpoint}
      ES_INDEX: ${self:custom.esGeoIndex}
      ES_GEO_MAPPING_FILE: ${self:custom.esGeoMappingFile}
      ES_REGION: ${self:custom.esRegion}

resources:
  Resources:
    # elkasticsearch resources omitted for brevity...
    esGeoLambdaServiceRole:
      Type: AWS::IAM::Role
      Properties:
        RoleName: esGeoLambdaServiceRole
        AssumeRolePolicyDocument:
          Statement:
            - Effect: Allow
              Principal:
                Service:
                  - lambda.amazonaws.com
              Action: sts:AssumeRole
        Policies:
          - PolicyName: esGeoLambdaServiceRolePolicy
            PolicyDocument:
              Version: "2012-10-17"
              Statement:
                - Effect: Allow
                  Action:
                    - logs:CreateLogGroup
                    - logs:CreateLogStream
                    - logs:PutLogEvents
                  Resource:
                    - 'Fn::Join':
                        - ':'
                        -
                          - 'arn:aws:logs'
                          - Ref: 'AWS::Region'
                          - Ref: 'AWS::AccountId'
                          - 'log-group~:/aws/lambda/*:*:*'
                - Effect: "Allow"
                  Action:
                    - "es:*"
                  Resource:
                    - 'Fn::Join':
                        - ''
                        -
                          - 'arn:aws:es:'
                          - Ref: 'AWS::Region'
                          - ':'
                          - Ref: 'AWS::AccountId'
                          - ':domain/'
                          - "${self:custom.esDomainName}"
                          - '/*'
```

Ideally, we would trigger this with our CI tool as part of the deployment process, but in our case we will just invoke the Lambda function manually:

```Shell
$ serverless invoke -f elasticsearchGeoMapping -l
```

If your command did not emit any errors, then your mappings should have been set up successfully and your Elasticsearch cluster is now ready to accept geo queries!

## 4. <a name="graphql-schema"></a>Define GraphQL Schema for API

Let's set up our API.

First, we'll define our GraphQL schema. Go ahead and create a file called `schema.graphql`:

```GraphQL
type Mutation {
  createPlace(input: CreatePlaceInput!): Place
}

type Query {
  searchPlaceByLatLng(lat:Float!, lng:Float!):  [Place]!
}

type Place {
  name: String!
  price: Float!
  lat: Float!
  lng: Float!
}

input CreatePlaceInput {
  name: String!
  price: Float!
  lat: Float!
  lng: Float!
}

schema {
  query: Query
  mutation: Mutation
}
```
We're defining the bare minimum in order to enable us to create places via the `createPlace` mutation, and then search for them by location using the `searchPlaceByLatLng` query method.


## 5. <a name="es-mapping-templates"></a>Appsync Mapping Template GraphQL Resolvers

We have our schema defined, and now we need to add resolvers for it. If you're expecting to need to write a Lambda function to interact with Elasticsearch in order to do this, then you'd be wrong!

AppSync introduces the concept of [mapping templates](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-overview.html), which removes this need. Instead, the templates translate the request and response into JSON payloads that your backing database and client will accept. Currently, only DynamoDB and Elasticsearch are natively supported, but in the future I'm sure we'll see support for SQL databases too.

Let's create a directory to house our mapping templates:

```Shell
$ mkdir mapping-templates
```

Then, let's create the request template for our `createPlace` query in a file called `mapping-templates/createPlace-request-mapping-template.txt`. This is going to relay the query on to Elasticsearch for us in the format it expects. It's written in [Apache Velocity Template Language (VTL)](http://velocity.apache.org/engine/2.0/vtl-reference.html), which is what Appsync uses as it's templating language:

```VTL
{
    "version":"2017-02-28",
    "operation":"PUT",
    "path":"/places/_doc/$util.autoId()",
    "params":{
        "body": {
        "name": "$context.arguments.input.name",
        "price": $context.arguments.input.price,
        "location": {
            "lat": $context.arguments.input.lat,
            "lon": $context.arguments.input.lng
        }
      }
    }
}
```

As you can see, we access the arguments through the [$context variable](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-context-reference.html), which Appsync supplies to our template. As we want to create the resource, we use a `PUT` operation.

We also specify that we want the document created in our `places` index via the `path` property. See the [Elasticsearch mapping template reference](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-elasticsearch.html) for the full list of supported fields. Finally, we are using a convenience method that AppSync supplies via the [`$util` object](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-context-reference.html#utility-helpers-in-util) to automatically assign a unique `id` to the document.


Let's go ahead and create the reponse template to translate Elasticsearch's response into the JSON response defined in our GraphQL schema. Create `mapping-templates/createPlace-request-mapping-template.txt` with the following contents:

```VTL
$util.toJson({
  "name": "$context.result.get('_source')['name']",
  "price": $context.result.get('_source')['price'],
  "lat": $context.result.get('_source')['location']['lat'],
  "lng": $context.result.get('_source')['location']['lon']
})
```

We use the [$context variable](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-context-reference.html) again, but this time it has been decorated with the response from Elasticsearch.

That's all the code we need in order to create an item in our database, but what about querying it? To be able to search for items by location, we'll create another set of templates to resolve the `searchPlaceByLatLng` query.

Let's with the request mapping template by creating a file at `mapping-templates/searchPlaceByLatLng-request-mapping-template.txt`:

```VTL
{
  "version": "2017-02-28",
  "operation": "GET",
  "path": "/places/_search",
  "params": {
    "body": {
      "query": {
        "bool": {
          "must": {
            "match_all": {}
          },
          "filter": {
            "geo_distance": {
              "distance": "10km",
              "location": {
                "lat": $context.arguments.lat,
                "lon": $context.arguments.lng,
              }
            }
          }
        }
      }
    }
  }
}
```

Here, we are specifying the index to search against via the `path` property. It is a `GET` operation as we just want to query existing items. We then run the search for places within 10km of our specified loccation using a [`geo_distance`](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-geo-distance-query.html) Elasticsearch query.

Now, let's create our response mapping template at `mapping-templates/searchPlaceByLatLng-response-mapping-template.txt`:

```VTL
[
  #foreach($entry in $context.result.hits.hits)
    ## $velocityCount starts at 1 and increments with the #foreach loop **
    #if( $velocityCount > 1 ) , #end
    $util.toJson({
      "name" : "$entry.get('_source')['name']",
      "lat" : $entry.get('_source')['location']['lat'],
      "lng": $entry.get('_source')['location']['lon'],
      "price": $entry.get('_source')['price'],
      "id": "$entry.get('_id')"
    })
  #end
]
```

We loop through the list of results using a VTL `foreach` statement, and create a JSON object in the format specified in our GraphQL schema. We have a small bit of extra logic to ensure that we don't end the list with a trailing comma; this ensures we return valid JSON in the response to the client.

That's the end of the backend code we need to write!

## 6. <a name="deploy-api"></a>Deploy the GraphQL AppSync API

We need to update our serverless config to provision our GraphQL API. In order to do this, we're going to use the [Serverless-AppSync-Plugin](https://github.com/sid88in/serverless-appsync-plugin).

Install it with `npm`:

```Shell
$ npm install --dev serverless-appsync-plugin
```

Then, update your serverless.yml to include the following lines:

```Yaml{7,16-17,25-50}
---
service: appsync-placesearch

frameworkVersion: ">=1.21.0 <2.0.0"

plugins:
  - serverless-appsync-plugin
  - serverless-python-requirements

provider:
  name: aws
  region: eu-west-1
  runtime: python3.6

custom:
  awsAccountId: ${env:AWS_ACCOUNT_ID}
  esEndpoint: ${env:ES_ENDPOINT}
  esRegion: eu-west-1
  esGeoIndex: places
  esGeoMappingFile: elasticsearch/location_geopoint_mapping.json
  esDomainName: placesearch
  esRoleName: AppSyncServiceRole
  pythonRequirements:
    dockerizePip: true
  appSync:
    name: appSyncElasticsearchTest
    apiId: ${env:APPSYNC_API_ID}
    apiKey: ${env:APPSYNC_API_KEY}
    authenticationType: API_KEY
    mappingTemplatesLocation: mapping-templates
    mappingTemplates:
      - dataSource: esInstance
        type: Query
        field: searchPlaceByLatLng
        request: searchPlaceByLatLng-request-mapping-template.txt
        response: searchPlaceByLatLng-response-mapping-template.txt
      - dataSource: esInstance
        type: Mutation
        field: createPlace
        request: createPlace-request-mapping-template.txt
        response: createPlace-response-mapping-template.txt
    schema: schema.graphql
    serviceRole: ${self:custom.esRoleName}
    dataSources:
      - type: AMAZON_ELASTICSEARCH
        name: esInstance
        description: 'ElasticSearch'
        config:
          endpoint: ${self:custom.esEndpoint}
          serviceRoleArn: arn:aws:iam::${self:custom.awsAccountId}:role/ElasticSearch-${self:custom.esRoleName}
```

We add the Serverless-AppSync-Plugin to the `custom` section, and tell it where to find the schema file and mapping templates we created earlier. We also specify the data source for the API (in our case, Elasticsearch), and the authentication type securing the API (in our case, we are using an API key which AWS will generate for us).

We then specify a couple of environment variables that the plugin requires, and the ID of the account where we created the Elasticsearch cluster earlier together with the endpoint URL. We will need to set the `AWS_ACCOUNT_ID` variable in our environment along with `ES_ENDPOINT` before running the command to deploy our GraphQL API. We can use the `aws-cli` tools to dynamically populate the latter.

Create a file called `.env` with the following contents, updating the `AWS_ACCOUNT_ID` with the appropriate value:

```Shell
# .env
export AWS_ACCOUNT_ID=123456789

export ES_DOMAIN=placesearch
ENDPOINT=$(aws es describe-elasticsearch-domain \
  --domain-name $ES_DOMAIN \
  --query 'DomainStatus.Endpoint' \
  --output text)
export ES_ENDPOINT=https://$ENDPOINT
```

Now, let's surce our `.env` file so the variables are present in our shell and then deploy our Appsync API:

```Shell
$ source .env
$ appsync deploy-appsync
```

Voila! We now have our GraphQL API fully deployed. Let's log in to the AWS console and run some queries against it.

To start off, how about we create a place in Australia:

```GraphQL
mutation CreatePlace {
  createPlace(input: {
    lat: -25.363,
    lng: 131.044,
    name: "House in Australia",
    price: 100.25
  }) {
    name
    price
    lat
    lng
  }
}
```

![Australia GraphQL Mutation](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/elasticsearch/graphql-mutation-createplace-australia.png "Australia GraphQL Mutation")

And another in London:

```GraphQL
mutation CreatePlace {
  createPlace(input: {
    lat: 51.6074,
    lng: 0.1378,
    name: "House in London",
    price: 200.25
  }) {
    name
    price
    lat
    lng
  }
}
```
![London GraphQL Mutation](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/elasticsearch/graphql-mutation-createplace-london.png "London GraphQL Mutation")


And then let's search for places within 10km of London:

```GraphQL
query {
  searchPlaceByLatLng(lat: 51.5, lng: 0.12) {
    name
    price
    lat
    lng
  }
}
```
![London GraphQL LatLng Query](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/elasticsearch/graphql-query-search-latlng.png "London GraphQL LatLng Query")

It only returns our London listing, so we can see our query is working just as we hoped!

## 7. <a name="destroy"></a>Teardown

We could easily add support for realtime updates to our API at this point, but we've already done a lot of work today. So let's destory our API and leave that for another tutorial.

In order to update or delete our API, we'll need to feed our serverless config its `apiId` and `apiKey`. Let's go ahead and add these to our `serverless.yml` instructing it to pick them up via environment variables:

```Yaml{26-27}
service: appsync-placesearch

frameworkVersion: ">=1.21.0 <2.0.0"

plugins:
  - serverless-appsync-plugin
  - serverless-python-requirements

provider:
  name: aws
  region: eu-west-1
  runtime: python3.6

custom:
  awsAccountId: ${env:AWS_ACCOUNT_ID}
  esEndpoint: ${env:ES_ENDPOINT}
  esGeoIndex: places
  esRegion: eu-west-1 # UPDATE ME
  esGeoMappingFile: elasticsearch/location_geopoint_mapping.json
  esDomainName: placesearch
  esRoleName: AppSyncServiceRole
  pythonRequirements:
    dockerizePip: true
  appSync:
    name: appSyncElasticsearchTest
    apiId: ${env:APPSYNC_API_ID}
    apiKey: ${env:APPSYNC_API_KEY}
  # ...rest omitted for brevity
```

Now, let's add the following lines to our `.env` file to dynamically populate these:

```Shell
# .env
export ES_DOMAIN=placesearch
export AWS_ACCOUNT_ID=863589972288
ENDPOINT=$(aws es describe-elasticsearch-domain \
  --domain-name $ES_DOMAIN \
  --query 'DomainStatus.Endpoint' \
  --output text)
export ES_ENDPOINT=https://$ENDPOINT

export APPSYNC_API_ID=$(aws appsync list-graphql-apis \
  --query 'graphqlApis[?name==`appSyncElasticsearchTest`].apiId' \
   --output text)

export APPSYNC_API_KEY=$(aws appsync list-api-keys \
  --api-id "$APPSYNC_API_ID" \
  --query 'apiKeys[0].id' \
   --output text)
```

And with that, we can destroy our API:

```Shell
$ source .env
$ serverless delete-appsync
$ serverless remove
```

## Wrap-up

We created a serverless GraphQL API. We got that API to handle an AirBnB-style geo search using Elasticsearch and AppSync. Not bad!

The
[full source code](https://github.com/techjacker/appsync-elasticsearch-geosearch) for this tutorial is available on github, so feel free to check it out!

My name is Andrew Griffiths, and [here's where you can find me](https://andrewgriffithsonline.com) on the web.
