---
title: Updated OpenWhisk support in The Serverless Framework
description: The Serverless Framework now has even better support for the OpenWhisk platform!
date: 2017-03-14
thumbnail: https://cloud.githubusercontent.com/assets/20538501/22410455/110d1f36-e65e-11e6-8db8-87e834504e13.jpg
layout: Post
authors:
  - Serverless
---
[The Serverless Framework](https://serverless.com/) announced support for the OpenWhisk platform earlier this year. Developers [can use the framework](https://www.youtube.com/watch?v=GJY10W98Itc) to build, deploy and manage serverless applications running on the OpenWhisk platform.

OpenWhisk has now released an [updated version (0.5.0)](https://github.com/serverless/serverless-openwhisk/releases/tag/v0.5.0) of the [provider plugin](https://www.npmjs.com/package/serverless-openwhisk). This release adds support for [Cloudant DB](https://cloudant.com/) and [IBM Message Hub](https://developer.ibm.com/messaging/message-hub/)events, [exporting Web Actions](https://github.com/openwhisk/openwhisk/blob/master/docs/webactions.md) and local OpenWhisk deployments.

Use the following command to upgrade the provider plugin to the latest version.

```
npm update -g serverless-openwhisk
```

*Due to an [outstanding issue](https://github.com/serverless/serverless/issues/2895) with provider plugins, the [OpenWhisk provider](https://github.com/serverless/serverless-openwhisk) must be installed as a global module.*

**Here are the new features supported in the latest release….**

### IBM Message Hub Events

Functions can be bound to events from [IBM Message Hub](https://developer.ibm.com/messaging/message-hub/) (“Apache Kafka”-as-a-Service) using a new event type (*message_hub*). Functions will be fired with the batch of messages received since the last invocation. Service credentials can be automatically read from an [OpenWhisk package](https://github.com/openwhisk/openwhisk/blob/master/docs/packages.md), removing the need for manual configuration.

```
functions:
    index:
        handler: users.main
        events:
            - message_hub: 
                topic: my_kafka_topic
                package: /packageName/serviceName_Credentials  
```

https://serverless.com/framework/docs/providers/openwhisk/events/messagehub/

### IBM Cloudant DB Events

Functions can be bound to events from [IBM Cloudant](https://cloudant.com/) (“CouchDB”-as-a-Service) using a new event type (*cloudant*). Functions are invoked for each database modification surfaced through the [CouchDB *_changes*](http://guide.couchdb.org/draft/notifications.html) feed. Service credentials can be automatically read from an OpenWhisk package, removing the need for manual configuration.

```
functions:
    index:
        handler: users.main
        events:
            - cloudant: 
                db: my_db_name                
                package: /packageName/serviceName_Credentials
```

https://serverless.com/framework/docs/providers/openwhisk/events/cloudant/

### **Export Web Actions**

Functions can be turned into [“*web actions*”](https://github.com/openwhisk/openwhisk/blob/master/docs/webactions.md) which return HTTP content without use of an API Gateway. This feature is enabled by setting an annotation (`web-export`) in the configuration file.

```
functions:
    my_function:
        handler: index.main
        annotations:
            web-export: true
```

Functions with this annotation can be invoked through a URL template with the following parameters.

```
https://{APIHOST}/api/v1/experimental/web/{USER_NAMESPACE}/{PACKAGE}/{ACTION_NAME}.{TYPE}
```

https://serverless.com/framework/docs/providers/openwhisk/guide/web-actions/

### **Support Local OpenWhisk Deployments**

This plugin now supports targeting OpenWhisk instances without valid SSL certificates. Developers running personal instances of the platform often do not have a custom SSL certificate set up for their domain.

To enable this feature, set the `ignore_certs` option in the serverless.yaml prior to deployment.

```
provider:
  name: openwhisk
  ignore_certs: true
```

### **Release Details & Future Plans**

For full details on the features added and bugs fixed, see the milestone release on Github.

[https://github.com/serverless/serverless-openwhisk/milestone/1?closed=1](https://github.com/serverless/serverless-openwhisk/milestone/1?closed=1)

If you find bugs or have feature requests, please open issues in the Github repository.

[https://github.com/serverless/serverless-openwhisk](https://github.com/serverless/serverless-openwhisk/milestone/2)

Items planned for the next release are shown in the 0.6 milestone.

[https://github.com/serverless/serverless-openwhisk/milestone/2](https://github.com/serverless/serverless-openwhisk/milestone/2)