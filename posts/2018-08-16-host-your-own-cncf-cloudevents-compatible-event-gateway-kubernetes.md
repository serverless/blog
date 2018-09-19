---
title: "Host your own CNCF CloudEvents compatible Event Gateway on Kubernetes, point to any FaaS"
description: "The Serverless Event Gateway quickstart for Kubernetes. Host your own private Event Gateway, point to any FaaS provider with CloudEvents."
date: 2018-08-16
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/eg-kubernetes/event-gateway-kubernetes-header.png'
category:
  - news
  - guides-and-tutorials
heroImage: ''
authors:
  - SebastianBorza
---

Last year, we launched the [Event Gateway open source project](https://github.com/serverless/event-gateway): the event router for the serverless world.

In a nutshell, the Event Gateway is the way you take your business events, and route them to serverless (FaaS) compute. You can use it to easily build APIs or react to custom business events. You can even connect events across different vendors to integrate your new applications with legacy infrastructure or other SaaS.

While we do have a hosted (read: serverless) version of the Event Gateway contained inside our new [Serverless Platform](https://serverless.com/blog/serverless-platform-beta-helps-teams-operationalize-development/), the open source version is one that you have to host yourself.

And today, doing that is about to get a lot easier. **You can now deploy your own self-hosted Event Gateway instance to a Kubernetes cluster in just a few commands!**

Even better: the Event Gateway uses the CNCF’s [CloudEvents](https://github.com/cloudevents/spec) format. Meaning, it’s cloud-agnostic down to its core. Use it with any FaaS provider you want.

Read on to learn how to get set up with the Event Gateway on your own Kubernetes cluster, or [read the full release notes in GitHub](https://github.com/serverless/event-gateway/blob/master/contrib/helm/README.md).

## Self-hosting the Event Gateway

The Event Gateway is a distributed system. It’s designed to be highly-available and continue running even in the event that one of its component pieces fail.

In order to self-host it, you would need to stand up all the underlying infrastructure for the Event Gateway. That means building out and managing the VM, setting up an etcd cluster, and handling ingress via a load balancer (nginx, proxy). This can be a complex undertaking.

But now, if you’re already Kubernetes, self-hosting your own Event Gateway instance is easy. _YES._

### Why Kubernetes?

Kubernetes abstracts away all the support logic required in running your own infrastructure. You can just let the system do it for you. _YES x2._

## How to run the Event Gateway right now, on Kubernetes

Here are all the steps you need to get set up with a multi-node cluster.

## Getting Started

You'll need to have an existing Kubernetes cluster that supports Ingress for Deployments. The [instructions contained here](https://github.com/serverless/event-gateway/blob/master/contrib/helm/MINIKUBE.md) outline how to get that configured with minikube's native nginx ingress.

### Install Helm

[You’ll also need Helm installed](https://docs.helm.sh/using_helm/#quickstart).

Run `helm init` on your cluster to generate the `helm` and `tiller` files. This will help us easily deploy our config files later.

### Install the Helm Components

You’ll need to grab the `etcd-operator` from Helm, and use `event-gateway` components from the serverless/event-gateway github repo.

The `etcd-operator` is a community-added component that starts, stops and manages the `etcd` cluster you’ll be using. In this case, we're going to run 3 distinct Event Gateway copies and they'll each hook into the central `etcd` cluster managed by the `etcd-operator`.

To install the `etcd-operator` component, type:

```
helm install stable/etcd-operator --name ego
```

Then install the `event-gateway` component:

```
helm install event-gateway --name ego
```

These commands will install the components into the `default` namespace in Kubernetes. If you’d like to install them in a specific namespace, then you will need to append a `--namespace <namespace>` on the end of your install command, like so:

```
helm install stable/etcd-operator --name ego --namespace <namespace>
helm install event-gateway --name eg --namespace <namespace>
```

**Note:** the `namespace` here is separate from the concept of a `space` within the Event Gateway. You can read more about Event Gateway spaces [here](https://github.com/serverless/event-gateway/blob/master/README.md#spaces), but it’s not necessary for installation.

### Accessing the Event Gateway

If you have successfully installed the helm charts as listed above, you should now be able to access the `event-gateway` at your minikube IP. The helm chart explicitly assigns `eventgateway.minikube` to your Ingress ExternalIP. To enable your DNS resolution you can add this to your `/etc/hosts` file as follows:

```
echo "$(kubectl get ingress event-gateway-ingress -o jsonpath={.status.loadBalancer.ingress[0].ip}) eventgateway.minikube" | sudo tee -a "/etc/hosts"
```

The Ingress explicitly routes path access to the Event Gateway on your behalf, sending all configuration API calls over to the `config` service and all events API calls over to the `events` service. To test this out, you can pull the Event Gateway Prometheus metrics as follows:

```
curl --request GET \
--url http://eventgateway.minikube/v1/metrics
--header ‘content-type: application/json’
```

**Note:** if you did not add the hostname to your `/etc/hosts` file as above, you can replace `eventgateway.minikube` with your Ingress IP to do the same.


## Congrats, you’re done!

Well, that was easy. Now you have your very own self-hosted Event Gateway up and running on Kubernetes!

## How (and why) you’d use the Event Gateway

The Event Gateway gives developers a really easy way to ingest all business events as data, which they can then route anywhere they want—other cloud providers, SaaS, legacy infrastructure or containers.

**Building REST APIs**

One of the most popular use cases is building REST APIs, which we [have a walkthrough of here](https://serverless.com/blog/how-use-event-gateway-use-cases-rest-api-custom-events/).

**Reacting to custom events**

You can also use the Event Gateway to react to a single business event in multiple ways.

Let’s say a new user gets created. This event would route to the Event Gateway, from where three different things can occur asynchronously: (1) a new user gets created in your user table; (2) the user gets a welcome message; (3) the sales team gets notified that a new user just signed up.

All this can happen without updating any code on the original business event itself. ([Read more on this here](https://serverless.com/blog/how-use-event-gateway-use-cases-rest-api-custom-events/#using-the-event-gateway-with-custom-events).)

**Using services from different clouds together**

Kelsey Hightower demoed a multi-cloud scenario earlier this year. He ran the Event Gateway on Kubernetes via his own integration, and deployed it to Google Cloud. An S3 event on AWS was sent through the Event Gateway and routed to a Google Cloud Function:

<iframe width="560" height="315" src="https://www.youtube.com/embed/_1-5YFfJCqM" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

Austen Collins from Serverless, Inc., used the Event Gateway to trigger 11 different cloud providers:

<iframe width="560" height="315" src="https://www.youtube.com/embed/TZPPjAv12KU" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

## Additional Resources

- [See the full release notes](https://github.com/serverless/event-gateway/blob/master/contrib/helm/README.md)
- [Check out the Event Gateway open source project](https://github.com/serverless/event-gateway)
- [Learn more about the CNCF’s CloudEvents specification](https://github.com/cloudevents/spec)
- [Read up on popular Event Gateway use cases](https://serverless.com/blog/how-use-event-gateway-use-cases-rest-api-custom-events/)
- [Try the fully-hosted (serverless) version in the Serverless Platform](https://dashboard.serverless.com/)
