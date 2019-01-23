---
title: "Building a chat application using AWS AppSync and Serverless"
description: "Let's build a chat app using AWS AppSync and the Serverless Framework! Plus: info on data sources, metrics and logs, and authentication."
date: 2018-11-19
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/appsync-chat/appsync-chat-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/appsync-chat/appsync-chat-header.png'
category:
  - guides-and-tutorials
authors: 
  - AlexDeBrie
---

GraphQL gets a lot of praise for its expressiveness, for the idea of batching requests for data, and for its great development tooling. But there is an additional benefit that mostly goes unnoticed.

Namely—many frontend GraphQL frameworks make a distinction between the data in the app state and the data on a remote server. This is what allows React apps powered by GraphQL APIs to seem so fast, even if they are moving a lot of data: the moving of data happens in the background.

Users get from more responsive frontend apps, while also saving bandwidth. Developers can now model the data better, and deliver a more pleasant experience to the end user.

**AppSync**, AWS’s managed GraphQL layer, builds on the benefits of GraphQL and adds a few more cool things in its mobile and web SDKs: subscriptions, convenient authentication via Cognito Pools, and the ability to plug in directly to a bunch of AWS services for data.

AppSync can do a lot while still being a fully managed service, which works out great for Serverless applications. No more GraphQL resolvers in Lambda functions. No more hand-rolled authentication. 
It’s the best of GraphQL with less complexity than before.

In this article, we show how you can get started with AWS AppSync in a Serverless project, and talk about the benefits and drawbacks of using AppSync for your Serverless applications. Let’s get to it!
 
#### Building a chat app with AppSync
 
We broadly divided the process of getting a chat app running on Serverless with AWS AppSync into two parts: setting up the backend part of the service to fetch the data and deliver it via the GraphQL API, and creating a simple frontend to consume the API.
 
##### The backend

We start by defining how we will be using AppSync in our Serverless project. We are using the [Serverless AppSync plugin](https://github.com/sid88in/serverless-appsync-plugin) to simplify the configuration, and all we need to provide, in addition to the authentication config, is:

- A set of mapping templates that will help AppSync understand how to resolve each GraphQL you send out
- A GraphQL schema that describes our API
- A data source, in our case a DynamoDB database.

The AppSync section in our serverless.yml looks like this:

```
custom:
  stage: dev
  output:
    file: ./front/src/stack.json
  appSync:
    name: ${self:service}-${self:custom.stage}
# ... boring authentication details.
    mappingTemplates:
      # Here we show AppSync how to resolve our GraphQL queries.
      - dataSource: Messages
        type: Mutation
        field: createMessage
        request: "createMessage-request-mapping-template.txt"
        response: "createMessage-response-mapping-template.txt"
      - dataSource: Messages
        type: Query
        field: getMessages
        request: "getMessages-request-mapping-template.txt"
        response: "getMessages-response-mapping-template.txt"
    schema: schema.graphql
    dataSources:
      # Here we describe the DynamoDB table we’ll be using as the data source.
      - type: AMAZON_DYNAMODB
        name: Messages
        description: Messages Table
        config:
          tableName: { Ref: MessagesTable }
          serviceRoleArn: { Fn::GetAtt: [AppSyncDynamoDBServiceRole, Arn] }
          iamRoleStatements:
            - Effect: "Allow"
              Action:
                - "dynamodb:*"
              Resource:
                - "arn:aws:dynamodb:::table/Messages"
                - "arn:aws:dynamodb:::table/Messages/*"
```

Our mapping templates for DynamoDB are almost an identical copy of the example [from the AppSync docs](https://docs.aws.amazon.com/appsync/latest/devguide/resolver-mapping-template-reference-dynamodb.html#aws-appsync-resolver-mapping-template-reference-dynamodb-putitem), and allow us to get and create items in the Messages table. We place all mapping templates in the `mapping-templates` subdirectory.

For our GraphQL schema, we are starting simple, with only a few actions that are strictly necessary for a useful chat app:

- A way to create a message — in this case, the createMessage mutation.
- A way to get all messages — the getMessages query.
- A subscription for all incoming messages, addMessage.
- A description of the fields of the Message object — in this case, we want a message ID, the text of the message, the date it was posted, and the handle of the person who posted it.

With all those things our schema looks like this:

```
type Mutation {
    createMessage(
        body: String!
    ): Message!
}

type Query {
    getMessages(filter: String): [Message!]!
}

type Subscription {
    addMessage: Message
        @aws_subscribe(mutations: ["createMessage"])
}

type Message {
    messageId: String!
    body: String!
    createdAt: String!
    handle: String!
}

schema {
    query: Query
    mutation: Mutation
    subscription: Subscription
}
```

This is all we need on the backend side to get AppSync up and running. We can now deploy the service:

```
$ serverless deploy
```

And then watch all resources get created.

##### Frontend

On the frontend, we use the GraphQL operations and the Authentication module from [AWS Amplify](https://github.com/aws-amplify/amplify-js). The core of the app is the `App.js` file where we configure Amplify with all our authentication settings and point it to our GraphQL endpoint.

The whole user interface, in addition to the login / sign up screens provided by Amplify, consists of two components: `MessagesList` and `SendMessage`. We use `[react-chat-ui](https://github.com/brandonmowat/react-chat-ui)` for the messages list:

```
// Components/MessagesList.js

import React from "react";
import { ChatFeed, Message } from "react-chat-ui";

export default ({ messages, username }) => (
  <ChatFeed
    maxHeight={window.innerHeight - 80}
    messages={messages.map(
      msg =>
        new Message({
          id: msg.handle === username ? 0 : msg.messageId,
          senderName: msg.handle,
          message: msg.body,
        }),
    )}
    isTyping={false}
    showSenderName
    bubblesCentered={false}
  />
);
```

We then create our own Send Message box that allows us to type in it and save the contents in the component’s state:

```
// Components/SendMessage.js
import React, { Component } from "react";

export default class extends Component {
  state = {
    body: "",
  };

  handleChange(name, ev) {
    this.setState({ [name]: ev.target.value });
  }

  async submit(e) {
    e.preventDefault();

    await this.props.onCreate({ body: this.state.body });

    this.message.value = "";
  }

  render() {
    return (
      <form onSubmit={e => this.submit(e)} style={{
        ...
      }}>
        <input
          ref={m => {
            this.message = m;
          }}
          name="body"
          placeholder="body"
          onChange={e => this.handleChange("body", e)}
          className="message-input"
          style={{
            ...
          }}
        />
      </form>
    );
  }
}
```

We then use the two components in `App.js`.
We use the `Auth` info that’s coming from Amplify to get the username that we need to associate each sent message with. The `getMessages` subscription that we defined before plugs into the `MessagesList` component neatly, and the `submit` action from the `SendMessage` component triggers a GraphQL mutation that sends the message to the backend:

```
class App extends Component {
  async componentDidMount() {
    const { username } = await Auth.currentAuthenticatedUser();

    this.setState({
      username,
    });
  }

  render() {
    return (
      <div
        style={{
          ...
        }}
      >
        <Connect
          query={graphqlOperation(queries.getMessages)}
          subscription={graphqlOperation(subscriptions.addMessage)}
          onSubscriptionMsg={(prev, data) => ({
            getMessages: [...prev.getMessages, data.addMessage],
          })}
        >
          {({ data: { getMessages }, loading, error }) => {
            if (error) return <h3>Error</h3>;
            if (loading || !getMessages) return <h3>Loading...</h3>;

            return (
              <MessagesList
                messages={getMessages}
                username={this.state.username}
              />
            );
          }}
        </Connect>

        <Connect
          mutation={graphqlOperation(mutations.createMessage)}
        >
          {({ mutation }) => <SendMessage onCreate={mutation} />}
        </Connect>
      </div>
    );
  }
}
```

This is all for our frontend! Once we install all the dependencies we can run it via:

```
$ yarn run
```

We land on the authentication screen provided by AppSync, where we can pick a username and a password. We can then sign in and see the list of messages, send some messages, and get responses from other users:

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/appsync/serverless-appsync-login.gif">

<image src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/appsync/serverless-appsync-chat.gif">

#### Ready for production?

Getting started with AppSync takes very little time compared to creating and deploying your own GraphQL service, building authentication for it, and adding new API functionality.
The simplicity of AppSync, as it is generally the case for managed services, comes with a few limitations.

##### Data sources

In the chat app, we are using the [DynamoDB](https://serverless.com/developers/guides/dynamodb/) data source, which is one of the better-supported sources in AppSync. Another fully-managed data source that’s available out of the box is the Amazon Elasticsearch Service.

AWS Lambda is the third data source option supported by AppSync. You could create a service in AWS Lambda that would query an RDS database, or go to an HTTP service outside of AWS to get the data. While this allows for some extensibility, doing anything with Lambda would require more work than just using a fully managed service like in our DynamoDB example above.

Finally, you can use [Aurora Serverless](https://docs.aws.amazon.com/appsync/latest/devguide/tutorial-rds-resolvers.html) as a data source for your resolvers as well. Aurora Serverless is a fully-managed relational database with on-demand scale-up and scale-down. Aurora Serverless has versions compatible with MySQL or PostgreSQL, so they work well with existing tooling. While it's still early for Serverless Aurora, I'm [very bullish on its future in the serverless ecosystem](https://serverless.com/blog/serverless-aurora-future-of-data/).

##### Authentication options

In the chat app project, we used the Cognito User Pools authentication mechanism.

If that doesn’t work for you, there aren’t many other options that don’t require managing the users yourself. You can use an OpenID provider (Google and Heroku are some of the providers), but otherwise, you’ll have to come up with a user management solution yourself.

##### Metrics and logging

AppSync currently only supports submitting metrics to CloudWatch, and the metrics it can submit are limited to `4xx` responses, `5xx` responses and the latency of AppSync operations.

If AppSync becomes part of your production service, you don’t have much granularity in the metrics or the logs if something goes wrong.

#### Conclusion

In this article, we went through creating a chat app with AWS AppSync and Serverless, and saw that it's pretty easy to get started. The service isn't necessarily ready for production, but allows for fast development and prototyping.

The complete example is available [here](https://github.com/chief-wizard/serverless-appsync-chat-app). Check out [AWS AppSync](https://aws.amazon.com/appsync/), its [developer guide](https://docs.aws.amazon.com/appsync/latest/devguide/welcome.html), and [the docs for Amplify](https://aws-amplify.github.io/docs/js/api).

You can find the docs for the Serverless AppSync plugin [here](https://github.com/sid88in/serverless-appsync-plugin).

The React Chat UI project is [here](https://github.com/brandonmowat/react-chat-ui).

##### More on AppSync & GraphQL

- [Build a serverless GeoSearch GraphQL API using AWS AppSync & Elasticsearch](https://serverless.com/blog/build-geosearch-graphql-api-aws-appsync-elasticsearch)
- [Running a scalable & reliable GraphQL endpoint with Serverless](https://serverless.com/blog/running-scalable-reliable-graphql-endpoint-with-serverless)
- [How to make a serverless GraphQL API using Lambda and DynamoDB](https://serverless.com/blog/make-serverless-graphql-api-using-lambda-dynamodb)
