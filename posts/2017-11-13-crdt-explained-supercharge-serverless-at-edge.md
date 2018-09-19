---
title: "CRDTs explained - supercharge your serverless with CRDTs at the Edge"
description: "How to supercharge your serverless with CRDTs at the edge. Your comprehensive CRDT explainer."
date: 2017-11-13
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/kuihro-logo.png'
category:
  - guides-and-tutorials
  - operations-and-observability
authors:
  - RussellSullivan
---

You all read this blog, and are probably pretty familiar with serverless concepts. But few of you are likely to be fluent in [CRDTs](https://en.wikipedia.org/wiki/Conflict-free_replicated_data_type).

It’s okay, they’re super new. Like, *new* new. But CRDTs are quickly gaining traction.

I’m [Kuhirō](http://www.kuhiro.com) founder Russell Sullivan; I’m here to yank these concepts out of the lofty academia-sphere, and place them squarely in the ‘what can I use these for’ engineering-sphere.

By the end of this post, you will be the foremost CRDT expert you know (unless you know [Jared Short](https://twitter.com/ShortJared)).

In this post, we’re going to do two things: set the stage by defining a few high-level CRDT concepts, and then take a deep dive by walking step-by-step through a CRDT video explainer.

# Part 1: CRDT concepts

Here, we’ll set the stage for our deep dive a bit further down. If you already feel pretty primed for CRDTs, then feel free to skip down to Part 2.

## What even is a CRDT?

CRDT stands for *Conflict-free Replicated Data Type*. In sum, CRDTs provide a way for you to merge concurrent modifications, always, in any order.

Let’s talk more about what CRDTs are, how they work, plus what they mean for serverless multi-region and failover.

## Serverless & CRDTs

At its core, serverless is based on event-driven functions. The further you commit to the serverless architecture, the further you embrace asynchrony.

CRDTs are designed from the bottom up to thrive in asynchronous environments.

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/serverless-yin-yang.png" align="center">

The marriage of serverless and CRDTs has implications ranging from IoT to the cloud. Think: CDN-Edge data replication, multi-master data center replication, shared data between IoT/mobile devices, offline first data, asynchronous materialized views...it goes on.

All of these use cases are event-driven and asynchronous. Right in CRDTs’ wheelhouse.

## The serverless data layer

At Kuhirō, we use CRDTs as the base data layer of our serverless stack.

Kuhirō runs a globally distributed **S**tateful **S**erverless **A**t the CDN-**E**dge system (SSAE). [SSAE](http://bit.ly/NearCloud) pushes both serverless and real-time state to the CDN edge.

This means your edge-based functions call into shared global data at the CDN edge. Your global user base calls into a nearby SSAE edge to process dynamic web requests with predictably low latency.

(More details on this up at [High Scalability](http://highscalability.com/blog/2017/11/6/birth-of-the-nearcloud-serverless-crdts-edge-is-the-new-next.html).)

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/kuhiro-map.png" align="center">

# Part 2: CRDTs explained

Below is a video walking through some slides I made called “CRDTs for Non-Academics”. My goal with those slides was to keep it simple: explain what CRDTs are, how they work, the gotchas, and their overall flow—all with a bare minimum of academic terms.

To make sure it’s fully grok-able, there will also be GI-Joes and Gandalfs.

## Without further ado, here’s the video!

For those not into watching a 15 minute video rant on the ins and out of CRDTs, I wrote a summary. Keep scrolling to read that instead.

The summary is short on text and can be skimmed quickly: you can pick and choose which snippets you watch.

**Full video: CRDTs for non-academics:**

<iframe width="560" height="315" src="https://www.youtube.com/embed/vBU70EjwGfw" frameborder="0" allowfullscreen></iframe>

## Scene by scene video break-down

### WTF are CRDTs?

When you ask most engineers about CRDTs, you usually get a reaction like this:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/wtf-crdt.png" align="center">

The standard response to this WTF is to explain CRDTs via an acronym-filled, high-level mathematical/comp-sci dissertation. One that involves words like: *semi-lattices*, *state-based*, *causality*.

Too complicated.

IMHO, CRDT explanations should go like this: “They act autonomously and still provide consistency—like the magical offspring of a Pegasus and Gandalf.”

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/pegasus-gandalf.png" align="center">

### Strong Eventual Consistency (SEC)

How do CRDTs provide Autonomy and Consistency? By relaxing [ACID](https://en.wikipedia.org/wiki/ACID) consistency into what is called [Strong Eventual Consistency](https://www.microsoft.com/en-us/research/video/strong-eventual-consistency-and-conflict-free-replicated-data-types/) (SEC).

SECs guarantee all actors will eventually converge to the same state without data loss. These guarantees are tailor-made for a distributed asynchronous world.

In this distributed world, there is no guarantee that all actors have the same value at a given point in time, but they will get there eventually. And no data will be discarded in the process (which happens in EC).

CRDTs perform replication as commutative operations. This has the desirable quality (for distributed systems) that order of replication **does not matter**.

Replication in an arbitrary order fundamentally reframes many distributed race conditions, and its usefulness increases as asynchrony (e.g. distribution) increases.

### CRDT counter increment example

For a real world example, let’s take a look at what happens when 3 different actors concurrently increment the same counter.

It does a good job of showing how CRDTs replicate the commutative *addition* operation.

**Video 1: CRDT counter increment example**

<a href="https://youtu.be/vBU70EjwGfw?t=108"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-1.png">
</a>

Now that we have shown how commutative replication works for incrementing counters, we will make a bold assertion: Commutative Replication works for all of JSON (nested JSON included).

JSON consists of 4 data types: `[string, number, object, array]`, for example:

```
{name      : “Russ”,
score      : 123,
attributes : {occupation : ”coder”},
history    : [“signed up”, “logged out”]
}
```

These 4 data types only require 4 base operations to build all higher level operations. JSON’s data types and respective operations are shown in the table below:

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/data-type-operation-table.png">

The operations `increment`, `insert`, and `delete` are commutative and function much as the increment counter example we just walked thru. The `set` operation is convergent and behaves differently.

A convergent operation is one where all actors eventually converge to the same state (set uses Last-Writer-Wins) but values during convergence may differ between actors.

### Last Writer Wins (LWW)

To demonstrate how Last-Writer-Wins (LWW) works in a distributed environment, we show an example of 3 gurus sitting on different mountains answering the question: “What is the meaning of life”.

Since we are using LWW, the last one to give an answer wins. Simple, right?

But there’s more to it. As the end of the video shows, while all of the gurus’ followers eventually converge on the same final answer, the answers they have during this time of convergence differ.

This oddity to distributed LWW is something CRDT users must take into account while architecting.

**Video 2: three gurus**

<a href="https://youtu.be/vBU70EjwGfw?t=201"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-2.png">
</a>

### Decrementing counters

Enough philosophy, let’s get back to straightforward CRDT examples. We started with counter incrementing, next up we decrement counters.

(**Note:** these examples build on one another, so you’ll really want to watch them all in order from the [beginning](http://bit.ly/CRDTs4NonAcademics).)

This shows a simple mechanism CRDTs use for increment/decrement counters. We use two counters—one for increments, one for decrements. The final value is adding them together (yet another commutative action).

**Video 3: decrement counter example:**

<a href="https://youtu.be/vBU70EjwGfw?t=321"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-3.png">
</a>

### SET example

Next, let’s see an example of setting values.

In this case, we’ll do 3 concurrent numerical `SET`s. This example shows how the `SET` operation converges to the value +9 via LWW.

**Video 4: SET example:**

<a href="https://youtu.be/vBU70EjwGfw?t=352"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-4.png">
</a>

### Resetting a field

Now, to demonstrate the full life cycle of a field, let’s look at an example of resetting a field. This will illustrate how a late-coming operation is ignored via versioning (implemented via per-field UUIDs).

Sounds complicated, but the video makes it simple and intuitive.

**Video 5: SET then RESET**

<a href="https://youtu.be/vBU70EjwGfw?t=375"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-5.png">
</a>

### CRDTs and versioning

One of CRDTs’ core functionalities is versioning, and they use a lot of additional metadata to resolve conflicts.

Examples of this metadata are:
1. Document: UUID & Garbage Collection version
2. Field: UUID & Timestamp
3. Delta: Dependency vector clocks

Versioning holds the state commutative algorithms require to be able to autonomously resolve conflicts and converge to the same state without using consensus.

In the next example we `DELETE` a field and then we (RE)`SET` the field. Then, similar to the `RESET` example, we show a late-coming operation being (correctly) ignored.

**Video 6: DELETE example**

<a href="https://youtu.be/vBU70EjwGfw?t=491"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-6.png">
</a>

### Modifying nested JSON

Time to move up to modifying nested JSON.

We start with JSON Objects, often referred to as dictionaries. CRDTs create UUIDs for each nested field. They reference those nested fields by specifying all field-UUIDs in the nested field’s path.

In order to be applied, operations for a nested field must match all UUIDs in the field’s path. Otherwise, they are ignored.

**Video 7: objects & dictionaries**

<a href="https://youtu.be/vBU70EjwGfw?t=550"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-7.png">
</a>

### JSON arrays

Next up is JSON’s other nested field: the Array.

Arrays are initialized via set operations (e.g. `SET H=[]`). Array elements can be overwritten (`SET H[1]=X`), or inserted between existing elements (`INSERT` value Y between the 2nd and 3rd array elements).

**Video 8: arrays & linked lists**

<a href="https://youtu.be/vBU70EjwGfw?t=597"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-8.png">
</a>

Arrays in JSON are also used to represent causality (such as linked lists). They can represent that something (*A*) happened and then something else (*B*) happened afterwards—represented as A<-B or [A,B].

To support causality, we implemented array-ordering as a reverse linked list, which specifies linkage via Left-Hand-Neighbors (LHN). The Array [A,B,C] is actually [A<-B<-C].

### Inserting values into an array

Now we step up the level of complexity. Let’s examine the concept of concurrently inserting values into an array in a distributed environment.

Technically speaking, concurrent inserts have the same LHN and are internally sorted via LWW. If we start with the array `[A,B,C]` and two different actors concurrently insert values D and E (both with LHN = C) we expect to arrive at one of two possible arrays: (`[A,B,C,D,E]` or `[A,B,C,E,D]`).

The ordering of D before E, or vice versa, is determined via LWW of their modification timestamps.

Internally we represent an array w/ concurrent inserts as a tree. In the example below D is the Last Writer, and therefore the winner. So D is placed left in the tree.

Evaluating the tree into an array is done via a depth-first traversal, yielding the array: `[A,B,C,D,E]`

<img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/evaluate-tree.png" align="center">

This next video shows an example of how concurrent inserts work in practice.

**Video 9: concurrent array inserts**

<a href="https://youtu.be/vBU70EjwGfw?t=630"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-9.png">
</a>

### CRDT consistency models

Finally, let’s take a look at causal+ consistency, the academic term for CRDTs’ consistency model.

CRDTs accomplish causality via vector clocks, which are created on each modification and sent with each delta. The vector clocks represent a delta’s distributed dependencies. Upon replication, a delta will only be applied once all of its dependencies have been satisfied.

This video is silly, but it does a good job at explaining a difficult distributed concept. When a team of GI Joes fail to respect causality of inserts into a chat array, things go pretty badly for them. :)


**Video 10: causal+ consistency (GO JOE!)**

<a href="https://youtu.be/vBU70EjwGfw?t=747"  target="_blank">
  <img src="https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/crdt/video-10.png">
</a>

# Conclusion

We have examined how CRDT operations work on the 4 operations required to cover the 4 JSON data types. We have explained the convergent property of `set` to be sub-optimal but still useful when utilized correctly.

We walked through examples demonstrating how replication race-conditions are handled by commutative algorithms and lots of versioning. And finally, we (us and the Joes) learned that CRDTs provide causal+ consistency via delta vector clocks representing the delta’s dependencies.

## Even more to learn

This is just an introduction to CRDTs; the rabbit hole goes a lot deeper. But it’s a good start, and let’s be honest—it was a ton of content in a short amount of video/text.

One of these days, I’ll write about the rest of CRDT concepts: tombstones & garbage collection, peer-to-peer mesh of clusters, extreme robustness, and architectures spanning IoT to CDN-Edge to DataCenter.

For now though, let’s just let this post marinate a bit. We’ve learned a lot today, yeah?
