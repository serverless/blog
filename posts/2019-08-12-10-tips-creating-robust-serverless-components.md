---
title: "10 Tips for Creating Robust Serverless Components"
description: "A practical guide for creating robust, safe and fast serverless components."
date: 2019-08-07
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/10-tips-robust-components/thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/10-tips-robust-components/header.png"
category:
  - guides-and-tutorials
authors:
  - EslamHefnawy
---

[Serverless Components](https://github.com/serverless/components) allow anyone to design and build specific use cases and share them with the world, without having to be tied to a single pattern or a single opinion. We then released 20+ components to bootstrap these uses cases, and we’re constantly building more. One of our core design goals is simplicity, so we produced an incredibly simple core and components API that makes creating components a breeze, and we’ve covered them all in a [simple one-page documentation](https://github.com/serverless/components/blob/master/README.md).

In this article, we will give you practical advice (not docs) on creating robust Serverless Components based on our experience building all these components over the past year, to help as you start creating components for your own unique use cases. So let’s dig in..

### 1. Start with the Outcome

Serverless Components is an outcomes framework. Every single component produces a specific outcome. Those outcomes could be low-level (like an S3 bucket), or high level (like an image processing feature). Before you even start building your component, you need to decide on what that outcome is and how much abstraction you want to provide for the best UX.

Once you know what outcome you’re after, you’ll need to think about your component’s inputs and outputs, as well as what the defaults are. We recommend that you minimize the inputs at first, then you can iteratively add more config if at all needed, simply because removing inputs later is a breaking change, but adding inputs is not.

If at all possible, aim for a zero config component that would use sane defaults to deploy even a demo of that outcome. One example for a zero-config component is the [aws-s3 component](https://github.com/serverless-components/aws-s3). If you don’t specify any inputs to that component, it’ll just create an accelerated bucket for you with a randomly generated name.

### 2. See Real-World Examples

While the components core API is simple, the cloud provider you’re working with (ie. AWS) might not be super straightforward. Fortunately there are some repeated patterns that we have seen after creating 20+ serverless components. We recommend that you browse through the [available component repos on Github](https://github.com/serverless-components/) and check which one is close to what you’re building. Just open up the repo and check the code and see how everything fits together.

All component code is open source, and we are striving to keep it clean, simple and easy to follow. After you look around you’ll be able to understand how our core API works, how we interact with external APIs, and how we are reusing other components. Which brings us to the next point…

### 3. Reuse Existing Components

Serverless Components were designed from the ground up to be sharable and reusable. You can compose components together to deliver higher level component with minimum code. For example, the website component uses the [aws-s3 component](https://github.com/serverless-components/aws-s3) to deploy and upload to the S3 bucket, and it also uses the [domains component](https://github.com/serverless-components/domain) to setup the custom domain. Likewise, you can reuse the [website component](https://github.com/serverless-components/website), add to it your own frontend code (ie. an entire React app) to create a configurable/reusable chat app for example, and that’s exactly what the [chat-app component](https://github.com/serverless-components/chat-app) does!

Here's a real example that illustrates how the [backend component](https://github.com/serverless-components/backend) is reusing 5 different components in a couple of lines of code:

```js
const bucket = await this.load("@serverless/aws-s3");
const role = await this.load("@serverless/aws-iam-role");
const lambda = await this.load("@serverless/aws-lambda");
const apig = await this.load("@serverless/aws-api-gateway");
const domain = await this.load("@serverless/domain");

this.context.status("Deploying AWS S3 Bucket");

const bucketOutputs = await bucket({
  name: "backend-" + this.context.resourceId(),
  region: inputs.region
});

// ... we continue deploying the rest of the loaded components
```

We believe that the real value of Serverless Components is in the components themselves, not the core. As a matter of fact, the core is extremely thin and lightweight. Serverless Components is an ecosystem, and the more components there are, the easier it is to write more components.

### 4. Keep Most of the State in the Provider

The Serverless Components core has a simple built-in state storage system. However it’s very easy for your component state to diverge from the actual state in the cloud provider. For example, let’s say you used the [aws-lambda component](https://github.com/serverless-components/aws-lambda) to deploy a lambda function. When you do this, we save the lambda name locally in the .serverless directory. This is where the local state is saved.

However, if you delete the lambda function from the AWS console, the [aws-lambda component](https://github.com/serverless-components/aws-lambda) is smart enough to check with AWS what the “state” of your lambda function is before deploying. It’ll detect that it no longer exists and will initiate a create operation again instead of the expected update, even though the local state indicate that it already exists. This also applies to all component inputs (in the case of aws-lambda, that’s memory, timeout...etc).

That’s why we recommend that you make a get request to the resource you’re provisioning before deploying just to make sure it exists, and check whether any of its inputs has changed. This also helps the component pick up where it left from later on in case of any errors. In many cases, you may not need to store state locally, but if you do, only store what you actually need and try to verify with the provider on each deployment. Here's a simplified example on how we're doing it with the [aws-lambda component](https://github.com/serverless-components/aws-lambda):

```js
const prevLambda = await getLambda({ lambda, ...config });

if (prevLambda) {
  await updateLambda({ lambda, ...config });
} else {
  await createLambda({ lambda, ...config });
}
```

### 5. Handle Name Collisions & Changes

In many cases, especially if you’re creating a low level component, you’ll have to provision resources in some cloud provider (ie. AWS). In that case, you will likely need to choose a name or some sort of an identifier to your resource (ie. bucket name). If the resource name is an input, you will need to be aware that a resource of that name might already exist and handle that edge case. You will also need to handle the case of the user changing the name input, in which case you should delete the old resource with the old name (that was saved in state in a previous deployment), and create a new one with the new name. We recommend that you create the new resource before deleting the old one, in case something went wrong during creation. Here's how this might look like:

```js
// we already created a new lambda with the new name
// now let's make sure we delete the old one...
if (this.state.name && this.state.name !== inputs.name) {
  this.context.status(`Replacing Lambda`);
  await deleteLambda({ lambda, name: this.state.name });
}
```

However if your use cases allows it, we recommend that you use random names for better UX and to avoid collisions completely, and then save that in the local state. We have a helper function that makes it easy to create random resource names that share a global `contextId` as a form of tagging. Using this function could look something like this:

```js
const name = this.state.name || this.context.resourceId();
```

### 6. Detect Changes in Inputs

On every deployment, you may be able to just update your resources with the inputs that the user provided. However, some resources could take a long time to update (ie. CloudFront takes around 20 minutes). So we recommend that instead, you could just fetch the resource properties from the provider before deployment, and compare that to the inputs the user provided. If no changes were detected, the you can skip deployments completely, which could dramatically increase the deployment speed of your component, and any other component that depend on it.

This also applies to code input, and a very good example of this is how we are deploying lambda functions. Before each deployment, we package your dependencies as a lambda layer and save its SHA string to the local state. Then on every deployment, we compare that SHA string to the one that AWS provides. If they match, then we skip the dependency upload step completely, which saves a couple of minutes of deploy time in practical scenarios. Here's how the `configChanged()` function looks like for the [aws-lambda component](https://github.com/serverless-components/aws-lambda)

```js
// the "hash" here represent the SHA string of the lambda
// for both the new and old code
const configChanged = (prevLambda, lambda) => {
  const keys = [
    "description",
    "runtime",
    "role",
    "handler",
    "memory",
    "timeout",
    "env",
    "hash"
  ];
  const inputs = pick(keys, lambda);
  const prevInputs = pick(keys, prevLambda);
  return not(equals(inputs, prevInputs));
};
```

So we only deploy when we have to, and it’s the main reason why we can provide super fast deployment speeds for all our components.

### 7. Use Provider Errors to Your Favor

Handling provider errors can be a drag. But we recommend that you experiment with the types of errors your API calls might throw, and take advantage of that to detect the best course of action. A very common pattern that we’ve been using is to try to update a resource with a specific name, and if it throws a `NotFound` error, we can catch that and run a create operation instead of an update. This is another example of keeping state in the provider as we discussed above. Here's how the [aws-lambda component](https://github.com/serverless-components/aws-lambda) is taking advantage of that:

```js
const getLambda = async ({ lambda, name }) => {
  try {
    const res = await lambda
      .getFunctionConfiguration({
        FunctionName: name
      })
      .promise();

    return res;
  } catch (e) {
    if (e.code === "ResourceNotFoundException") {
      // in case of ResourceNotFoundException error, return null,
      // to let the component know that the lambda does not exist
      return null;
    }
    throw e;
  }
};
```

### 8. Removal Should Use State, Not Inputs

In case of removal, we recommend that you use state data that was previously saved by the previous deployment instead of using the inputs object. The reasoning behind that is that inputs do not represent the actual state on the provider, but rather the state that you want it to be. They are also not guaranteed to be always available (for example, if inputs are passed from other component's outputs, then running `sls remove`), but the state is accessed programmatically and will always be there. The state is always kept up to date with every deployment and it represents the last known “state” of the component and its resources.

here's how the [aws-lambda component](https://github.com/serverless-components/aws-lambda) removes the lambda using the name stored in state, instead of the name passed as an input (which the user might change):

```js
await deleteLambda({ lambda, name: this.state.name });
```

Keep in mind however what we mentioned earlier about keeping most of the state in the provider. You can’t completely trust the local state, so you better verify the state of the resources on the provider, either by making a get request, or as mentioned in the previous section, by using a try/catch strategy of the removal (if it doesn’t exist, it’s already removed)

### 9. Save Time by Using Core Utils

When you first create your component, you’ll need to extend the Component class from the `@serverless/core` npm package. In that package, there are plenty of useful utilities that you can use to make your life easier. For example, we have a `Utils.sleep()` function that pauses runtime for a few seconds before moving on. This is extremely helpful when dealing with cloud infrastructure as it might take a while to create some resources before we make further operations on it. There are also file system, parsing and packaging utilities that you can use when dealing with files that you might need to upload to the cloud. Here's a common use-case:

```js
const { Component, utils } = require("@serverless/core");

class myComponent extends Component {
  async default(inputs = {}) {
    // your logic here...

    if (!(await utils.fileExists(path))) {
      await utils.writeFile(path, contents);
    }
  }
}

module.exports = myComponent;
```

We recommend that you check out the existing components and see how they use the core utilities to minimize technical debt. We also recommend that you use the `this.context.debug()` function to let users who enable debug mode know what’s going on during deployment. It’s very helpful to you as well during development, and you’ll find it all over our components’ code base.

### 10. Publish Your Component

Once your component is ready for prime time (and after a lot of testing ;), don't forget to publish your component! Components are published to npm just like any other npm package. Just make sure you point the `main` property of `package.json` to the `serverless.js` file and use semantic versioning just like any other npm package. Once it’s published, anyone could just use your new component in YAML or JS files.

For extra exposure, we would be happy to host your component in our [Serverless Components Github Organization](https://github.com/serverless-components/), which acts as our official registry for the time being. Just [ping me on twitter](https://twitter.com/eahefnawy) and I’ll add you to the org and create a repo for you. Creating Serverless Components is one of the biggest contributions to the Serverless Framework and we highly appreciate it. We will provide all the help you need to get you up and running and make your component more discoverable. We are also building a Serverless Components registry that would make publishing a lot easier.

### Wrapping up

We hope this article made you feel more confident and comfortable creating [Serverless Components](https://github.com/serverless-components/). We can’t wait to see what you come up with, and remember, if you have any questions, feel free to [reach out to me on twitter](https://twitter.com/eahefnawy), or anywhere you could find me.

Now go build something great!
