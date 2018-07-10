## Event Gateway

The [Event Gateway](https://github.com/serverless/event-gateway) is an open-source event router which enables you to connect your existing data and workloads to serverless compute via an event-driven pattern.  

You can use all of the new features below via our [hosted Event Gateway](https://dashboard.serverless.com/).  Follow [these docs](https://github.com/serverless/platform/tree/master/docs/event-gateway) to get started.

### Subscription Simplicity & Power

We’ve overhauled how Subscriptions work in the Event Gateway to make them easier and more powerful.  

A Subscription binds a single Event to a single serverless Function (1-to-1).  Like this:

```
myapp.user.created + sendWelcomeEmail()
```

Our new updates enable Subscriptions to call serverless Functions two simple ways: **asynchronously** or **synchronously**.

An **asynchronous** Subscription means when you send an Event to the Event Gateway and it routes the Event to a Function, the Event Gateway will not send the Function's response back to the origin/client that made the request.  You can use async Subscriptions to create a traditional pub/sub pattern.

For example, if you want to perform multiple actions when a user signs up for your application, create multiple Subscriptions:

```
user.created + sendWelcomeEmail()
user.created + addToDripCampaign()
user.created + notifySalesTeam()
```

Here's what this looks like in Serverless Framework V.1 using the [Event Gateway plugin](https://github.com/serverless/serverless-event-gateway-plugin):

```yaml
# serverless.yml

service: users

custom:
  eventgateway: # Get this @ dashboard.serverless.com
    url: myorg-app.slsgateway.com
    accessKey: <yourkey>
  eventTypes:
    user.created
    
functions:
  sendWelcomeEmail:
    handler: code.sendWelcomeEmail
    events:
      - eventgateway:
          type: async
          eventType: user.created
  addToDripCampaign:
    handler: code.addToDripCampaign
    events:
      - eventgateway:
          type: async
          eventType: user.created
  notifySalesTeam:
    handler: code.notifySalesTeam
    events:
      - eventgateway:
          type: async
          eventType: user.created

plugins:
  - "@serverless/serverless-event-gateway-plugin"

```

A **synchronous** Subscription means the Event Gateway will wait for a serverless function to process an event and then return the response to the origin/client that published the Event.  You can use this to create a traditional request/response experience, even though it’s powered by an event-driven model.

You can use synchronous Subscriptions along with the `path` and `method` setting on the Subscription, to create a single REST API route:

```
/users/create + POST + http.request + createUser()
```

Here's what this looks like using Serverless Framework V.1 using the [Event Gateway plugin](https://github.com/serverless/serverless-event-gateway-plugin):

```yaml
# serverless.yml

service: users

custom:
  eventgateway: # Get this @ dashboard.serverless.com
    url: myorg-app.slsgateway.com
    accessKey: <yourkey>
  eventTypes:
    http.request
    
functions:
  createUser:
    handler: code.createUser
    events:
      - eventgateway:
          type: sync
          eventType: http.request
          path: /users/create
          method: POST

plugins:
  - "@serverless/serverless-event-gateway-plugin"
```

What's even cooler is that you can ditch the `path`, `method` and thinking about endpoints entirely and simply use the [Event Gateway SDK](https://github.com/serverless/event-gateway-sdk) to publish synchronous Events from the client-side of your application.

Here's an example of what that looks like using Serverless Framework V.1 with the [Event Gateway plugin](https://github.com/serverless/serverless-event-gateway-plugin) as well as the [Event Gateway SDK](https://github.com/serverless/event-gateway-sdk):

```yaml
# serverless.yml

service: users

custom:
  eventgateway: # Get this @ dashboard.serverless.com
    url: user.create.request
    accessKey: <yourkey>
  eventTypes:
    http.request
    
functions:
  createUser:
    handler: code.createUser
    events:
      - eventgateway:
          type: sync
          eventType: user.create.request

plugins:
  - "@serverless/serverless-event-gateway-plugin"
```

```javascript
// Event Gateway SDK running on the client side (e.g. React)

eventGateway.emit({
  eventType: ‘user.create.request’,
  data:  {
    email: ‘john@serverless.com’
  }
})
.then((response) => {
   // Response from the Function that was set to handle this Event synchronously
})
```

The great thing about this pattern is that you don’t have to worry about paths, methods or the general location of the Function that’s receiving this.  The experience is utterly simple.

Keep in mind, you can also publish Events asynchronously too from your client to do all types of user activity tracking, error logging and more.

Lastly, you can combine both **synchronous** and **asynchronous** Subscriptions on a single Event.  Here's an example using Serverless Framework V.1 and the [Event Gateway plugin](https://github.com/serverless/serverless-event-gateway-plugin), which synchronously processes an HTTP request to create a user, while asynchronously processing the HTTP request for analytics purposes and storing it in an Event log:

```yaml
# serverless.yml

service: users-crud

custom:
  eventgateway: # Get this @ dashboard.serverless.com
    url: myorg-app.slsgateway.com
    accessKey: <yourkey>
  eventTypes:
    http.request
    
functions:
  createUser:
    handler: code.createUser
    events:
      - eventgateway:
          type: sync
          eventType: http.request
          path: /users/create
          method: POST
  addToAnalytics:
    handler: code.addToAnalytics
    events:
      - eventgateway:
          type: async
          eventType: http.request
          path: /users/create
          method: POST
  storeEvent:
    handler: code.storeEvent
    events:
      - eventgateway:
          type: async
          eventType: http.request
          path: /users/create
          method: POST
    
plugins:
  - "@serverless/serverless-event-gateway-plugin"
```

We hope this simple Subscription experience gives you the flexibility you need to power many types of workflows, while enabling you to take greater advantage of serverless compute.

All of this is available now in the [hosted Event Gateway](https://dashboard.serverless.com/) and you can learn more about this in the [hosted Event Gateway documentation](https://github.com/serverless/platform/tree/master/docs/event-gateway).

### Authorization

In this release, we also dramatically simplified how the Event Gateway does Authorization.

You can now set custom authorization at the Event level.  

This means you can block Events from entering the Event Gateway (on any path and method) if the Event does not first pass authorization.  Here’s how it works:

When using the Event Gateway, you must first register the Events you want to use within the Event Gateway.  When registering those Events, you're able to specify a serverless Function that contains your authorization logic, which will process the Event first and determine if the Event Gateway should pass it to the Function containing your business logic.

Here's an example of this with Serverless Framework V.1 using the [Event Gateway plugin](https://github.com/serverless/serverless-event-gateway-plugin):

```yaml
# serverless.yml

service: users-crud

custom:
  eventgateway:
    url: myorg-app.slsgateway.com
    accessKey: <yourkey>
  eventTypes:
    user.create.request: # Event to register
      authorizerId: authorize # Custom authorizer
    
functions:
  authorize: # Authorization function
    handler: users.authorize
  createUser:
    handler: users.create
    events:
      - eventgateway:
          type: sync
          eventType: user.create.request

plugins:
  - "@serverless/serverless-event-gateway-plugin"
```

The `createUser` Function will not be called unless the `authorize` Function allows the `user.create.request` Event to be accepted.
