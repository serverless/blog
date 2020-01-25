---
title: "Deploying Your First Knative Service with the Serverless Framework"
description: "Learn how to use the Serverless Framework to deploy your first Knative service on a Kubernetes cluster running in Google Cloud."
date: 2020-01-24
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-01-knative-tutorial/deploy-knative_blog-thumbnail.png"
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-01-knative-tutorial/deploy-knative_blog.png"
category:
  - guides-and-tutorials
authors:
  - FernandoMedinaCorey
---

# Deploying Your First Knative Service with the Serverless Framework

One of the biggest ongoing conversations that I see when talking about modern microservice architectures is people asking "Should I be running that on containers or serverless?". Well, that's not entirely true. In fact, it is usually more of a vehemently opinionated response about why I should be using one or the other. My favorite example of this ongoing conversation is probably Trek10's Serverless vs. Containers Rap Battle:

<iframe width="560" height="315" src="https://www.youtube.com/embed/TN25-siFnS8?start=28" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

The somewhat surprising conclusion (considering the format of the discussion) is that both approaches are perfectly suited to different use cases. 

## How Kubernetes and Serverless Make Each Other Better

We can take this a slight step further and say that both architectural patterns provide us insight on the limitations and potential improvements of the other. 

Kubernetes has a reputation for operational complexity that Serverless infrastructure like AWS Lambda aim to eliminate entirely. The broader community around Kubernetes is constantly innovating to create tools like Knative that address these concerns and simplify the experience for developers and operators. 

Serverless technologies on the other hand, have a reputation for provider-imposed limitations such as cold starts and runtime length limits. Many of these concerns are starting to be addressed or are now solved problems on some platforms.

At Serverless, I think it's safe to say we think this conversation is a legitimate one and we want to contribute to it with new tools that support the best of both worlds. Because of this, the Serverless Framework [now supports](https://serverless.com/blog/serverless-framework-knative-integration) integrating with Knative - a tool to help build serverless applications on top of Kubernetes. We think that Knative can be a logical choice for many workloads, especially those that require multi-cloud portability either due to internal or regulatory requirements.

## Getting Started

There are a few prerequisite steps to getting started with the Serverless Framework Knative plugin. First, you'll need a Kubernetes cluster with Knative installed. Because of the open source nature of Kubernetes you have a lot of different options for this. You might choose to install it on any of a plethora of cloud providers or even in your own data center. For this demo, we'll leverage Google Cloud Platform.

### Creating a Kubernetes Cluster on the Google Cloud Platform

To get your Kubernetes cluster up and running in GCP, you'll need to create a Google Cloud Platform account.

**Create Your GCP Account**

Go to [https://cloud.google.com/](https://cloud.google.com/) and create an account. As of this tutorial, Google offers a $300 credit towards using GCP. I'll try and keep you within that credit allotment and the Google default limitations but keep in mind that while Kubernetes clusters can scale up and down, they still have a minimum node count of three and will be on even when they aren't in use. As the last step in this guide, I'll show you how to delete your cluster.

**Create a Project in GCP**

After you have an account up and running, you can create a project using the Google Cloud Console [here](https://console.cloud.google.com/projectcreate). I named mine `sls-kubernetes-project` to keep things straight:

![Screenshot of Google Cloud Project UI](https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/2020-01-knative-tutorial/step2.png)

Make sure that you keep a hold of that value whatever you name yours because we'll be using it later.

**Install and Configure the Google SDK**

To create your Kubernetes cluster and interface with it you'll need to use the Google SDK. It will provide a nice CLI interface to do everything you need. Depending on your operating system, you can get started [here](https://cloud.google.com/sdk/docs/quickstarts).

If you followed the installation instructions for the SDK you probably also authenticated it with your Google Cloud account. If not, you can do this with: `gcloud auth login`

When going through this process it should prompt you to select a project. Make sure to select the project you just created, `sls-kubernetes-project` in my case.

After that, let's set some environment variables to make creating our cluster a bit easier. We'll set one for our cluster name, our cluster zone (where we're deploying to in GCP), and our project name.

```
export CLUSTER_NAME=slsknative
export CLUSTER_ZONE=us-west1-c
export PROJECT=sls-kubernetes-project
```

I've used `slsknative` for my cluster name, you can use `knative` or something else that doesn't conflict with any other clusters you might have running and follows the naming conventions for a cluster.

Now make sure we set our project as the default in our Google Cloud CLI settings. You can check this with `gcloud config list`. If part of the output includes your project name in there like this you're good to go:

`project = sls-kubernetes-project`

Otherwise, set the project config with this command after you set the $PROJECT environment variable:

`gcloud projects create $PROJECT --set-as-default`

Next, let's enable some of the APIs for the services we're going to use on Google Cloud:

```
gcloud services enable \
  cloudapis.googleapis.com \
  container.googleapis.com \
  containerregistry.googleapis.com
```

After this command completes, we should be ready to create our Kubernetes cluster!

**Create Your Kubernetes Cluster**

Now for the hard part (sort of, Google makes the surprisingly easy). You'll use the following command to create a Kubernetes cluster in Google Cloud:

```
gcloud beta container clusters create $CLUSTER_NAME \
  --addons=HorizontalPodAutoscaling,HttpLoadBalancing,Istio \
  --machine-type=n1-standard-2 \
  --cluster-version=latest --zone=$CLUSTER_ZONE \
  --enable-stackdriver-kubernetes --enable-ip-alias \
  --enable-autoscaling --min-nodes=1 --max-nodes=10 \
  --enable-autorepair \
  --scopes cloud-platform
```

So, what's this doing? Well we're using GCP to create a new cluster and passing in some standard configuration to create a cluster that will work with Knative.

First, we add some addons like Istio that work well with Knative. We also specify the machine types we want to be in our cluster. I'm using slightly smaller machine types of `n1-standard-2` because Kubernetes clusters have a minimum of three nodes and as of this demo Google Cloud limits newly-created accounts to 8 vCPUs in a single region. You can spin up a more robust cluster with larger instances, but you might end up needing to activate the account and make sure your limits are increased. 

You'll notice that I also have auto-scaling enabled in this command, but in this case I might end up hitting some of those account limits if I scaled too far.

After the cluster finishes creating, you'll need to grant yourself admin permissions to administrate it. You can do that with this command:

``` 
kubectl create clusterrolebinding cluster-admin-binding \
  --clusterrole=cluster-admin \
  --user=$(gcloud config get-value core/account)
```

Once you have those administrator permissions, you'll be able to use `kubectl` to interact with the cluster and install Knative. If you've already installed Docker on your machine before you may see a warning about `kubectl` here or later on that looks like this:

```
WARNING:   There are older versions of Google Cloud Platform tools on your system PATH.
  Please remove the following to avoid accidentally invoking these old tools:

  /Applications/Docker.app/Contents/Resources/bin/kubectl
```

Just make sure that you restart your terminal at this point. Likely, GCP changed your path in the installation process so you will then find `kubectl` at `~/google-cloud-sdk/bin/kubectl`. If it didn't, just make sure you're using the Google Cloud SDK `kubectl` installation or some other recent installation. The easiest way to verify this is to enter `which kubectl` and confirm that it references the location in the Google Cloud SDK folder.

### Installing Knative on Our Cluster

So now we're ready to install Knative on our Kubernetes cluster! First, we'll run this command which helps avoid race conditions in the installation process:

```
kubectl apply --selector knative.dev/crd-install=true \
--filename https://github.com/knative/serving/releases/download/v0.11.0/serving.yaml \
--filename https://github.com/knative/eventing/releases/download/v0.11.0/release.yaml \
--filename https://github.com/knative/serving/releases/download/v0.11.0/monitoring.yaml
```

Then we can actually complete the install with this command:

```
kubectl apply \
--filename https://github.com/knative/serving/releases/download/v0.11.0/serving.yaml \
--filename https://github.com/knative/eventing/releases/download/v0.11.0/release.yaml \
--filename https://github.com/knative/serving/releases/download/v0.11.0/monitoring.yaml
```

This will get all the Knative goodies we need into our Kubernetes cluster. While it installs, we just need to wait for a few minutes and monitor the installation of the Knative components until they are all showing a running status. We do that with these three commands:

```
kubectl get pods --namespace knative-serving
kubectl get pods --namespace knative-eventing
kubectl get pods --namespace knative-monitoring
```

Run them each every few minutes and then confirm that all of the results have a status of running. When that's complete, you should have Knative up and running in Kubernetes in the Google Cloud!

### Using the Serverless Framework and Knative

Now that we've got our cluster and Knative setup we're ready to start using the Serverless Framework! 

First, make sure you have at least Node.js 8+ installed on your local machine. Then, if you still need to install the Serverless Framework run the following `npm` command to install it on your machine:

```sh
npm install --global serverless
```

Next up we need to create a new Serverless Framework project with the `knative-docker` template and then change directories into that project:

```sh
serverless create --template knative-docker --path my-knative-project

cd my-knative-project
```

Because we’re using the [`serverless-knative` provider plugin](https://github.com/serverless/serverless-knative) we need to install all the dependencies of our template with `npm install` before we do anything else. This will download the provider plugin that was listed as a dependency in the `package.json` file.

Next, let's take a look at the `serverless.yml` file in our project which looks like this:

```yaml
service: my-knative-project

provider:
  name: knative
  # optional Docker Hub credentials you need if you're using local Dockerfiles as function handlers
  docker:
    username: ${env:DOCKER_HUB_USERNAME}
    password: ${env:DOCKER_HUB_PASSWORD}

functions:
  hello:
    handler: hello-world.dockerfile
    context: ./code
    # events:
    #   - custom:
    #       filter:
    #         attributes:
    #           type: greeting
    #   - kafka:
    #       consumerGroup: KAFKA_CONSUMER_GROUP_NAME
    #       bootstrapServers:
    #         - server1
    #         - server2
    #       topics:
    #         - my-topic
    #   - awsSqs:
    #       secretName: aws-credentials
    #       secretKey: credentials
    #       queue: QUEUE_URL
    #   - gcpPubSub:
    #       project: knative-hackathon
    #       topic: foo
    #   - cron:
    #       schedule: '* * * * *'
    #       data: '{"message": "Hello world from a Cron event source!"}'

plugins:
  - serverless-knative
```

This is the Serverless Framework service definition which lists Knative Serving components as `functions` with their potential event sources as `events`.

You might be asking, this looks *too* simple. How is the Serverless Framework connecting with my cluster? Well, by default, we're using the `~/.kube/config` that was created on your machine when you setup your cluster. To get other developers started you'll also need to make sure they have access to your Kubernetes cluster and have their own [kubeconfig](https://kubernetes.io/docs/concepts/configuration/organize-cluster-access-kubeconfig/) file.

Also, one critical part of the above is the Docker Hub section. At the moment, that section allows you to specify credentials so that your local Docker image and code in the `code` directory can be sent into Docker Hub and used by Knative. In order to enable it to work you'll need to have a [Docker Hub](https://hub.docker.com/) account and set the docker environment variables locally. On Mac you can set those environment variables like this:

```bash
export DOCKER_HUB_USERNAME=yourusername
export DOCKER_HUB_PASSWORD=yourpassword
```

Once the Docker Hub credentials are set as environment variables we can deploy a service to our Kubernetes cluster:

```sh
serverless deploy
```

After the process finishes, invoking our new service is as easy as:

```sh
serverless invoke --function hello
```

And congratulations! After you see a response, you've just deployed your first Serverless Framework service using Knative, Kubernetes and Google Cloud! 

Now, if you need to remove the Knative Service you can use:

```sh
serverless remove
```

This should remove the Knative service but keep in mind that your Kubernetes cluster is still running! If you'd like to remove the cluster to save yourself some money you can run this command:

```
gcloud container clusters delete $CLUSTER_NAME --zone $CLUSTER_ZONE
```

That should delete your cluster, but to be safe make sure to also confirm that it worked by checking inside of the GCP UI for your cluster.

Now there's a lot more you can do as you continue to work with Knative. You'll probably want to try customizing your Docker containers with more interesting services, and integrate your Knative cluster with events from sources like Google Cloud Pub/Sub, Kafka, or AWS Simple Queue Service. There's a lot of possibilities and we can't wait to see what you do with it! 

Are you interested in guides on particular event sources or topics related to Knative and Serverless Framework? Leave us a comment below!
