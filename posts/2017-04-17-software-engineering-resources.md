---
title: 7 Must Read Books for Becoming a Better Software Developer
description: Want to be a better engineer or programmer? Check out this list of resources from the Serverless team.
date: 2017-04-17
thumbnail: https://cloud.githubusercontent.com/assets/20538501/24940473/2bdb229a-1ef8-11e7-9e8d-8f75b5461748.png
layout: Post
authors:
  - PhilippMuns
---

At Serverless we're constantly educating ourselves to incorporate the latest best practices into our engineering 
processes so we can deliver the best Serverless toolings out there.

This blog post lists useful software engineering books we've read and highly recommend.

**Note:** This list is a living document. We'll update it periodically to reflect our recent learnings/recommendations.

*We are not associated with any authors or platforms we list here*

## Clean Code: A Handbook of Agile Software Craftsmanship

<img align="right" src="https://cloud.githubusercontent.com/assets/20538501/25054483/36c7f428-2112-11e7-8318-b12234266df2.png">

*Clean Code* by Robert C. Martin (aka Uncle Bob) is a classic book every software engineer and programmer should read. It teaches you how to write code in a way that's easy to read and understand.

You don't have to follow every single technique, but even adopting some of them will ensure that your code "reads like prose".

Remember that a majority of our time as developes is spent reading code rather than writing it.

And to be honest:

```javascript
if (isTester && hasBetaAccess) {
  return betaTest();
}

return standardTest();
```

is way easier to read than:

```javascript
return tester && beta ? beta() : default();
```

[Get the book](https://www.amazon.com/Clean-Code-Handbook-Software-Craftsmanship/dp/0132350882/ref=sr_1_1?ie=UTF8&qid=1490274327&sr=8-1&keywords=clean+code)

## The Clean Coder: A Code of Conduct for Professional Programmers

<img align="right" src="https://cloud.githubusercontent.com/assets/20538501/25054571/ba5e5638-2112-11e7-91c3-b3e93563ad84.png">

This is another great book from Robert C. Martin, the author of ["Clean Code"](#clean-code).

The main topic of this book is how professional software developers should behave, incluing how they should communicate and work on projects or solve problems.

Have you ever felt empowered and overjoyed after hitting a super tight deadline inspite of being overloaded with tasks in the current sprint? You and your manager should be proud, right?

Read this book and think again...

[Get the book](https://www.amazon.com/Clean-Coder-Conduct-Professional-Programmers/dp/0137081073/ref=sr_1_2?ie=UTF8&qid=1490274327&sr=8-2&keywords=clean+code)

## The Phoenix Project: A Novel about IT, DevOps, and Helping your Business Win

<img align="right" src="https://cloud.githubusercontent.com/assets/20538501/25055177/22726158-2116-11e7-87a3-2139e1aa791b.png">

Authored by Gene Kim, Kevin Behr, and George Spafford, this novel about IT operations is not the usual tech book. It's really something you can read before going to sleep without your head spinning with all the complex tech problems you've just read about.

*The Phoenix Project* is a good read if you want to see how the "wrong work" will negatively impact the performance of your company. You'll learn the different types of work and see how a (fictional) doomed corporation transitioned from being a ["poor dog" to a "star"](https://en.wikipedia.org/wiki/Growth%E2%80%93share_matrix).

[Get the book](https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262509/ref=sr_1_1?ie=UTF8&qid=1490274311&sr=8-1&keywords=phoenix+project)

## The Pragmatic Programmer: From Journeyman to Master

<img align="right" src="https://cloud.githubusercontent.com/assets/20538501/25055150/0133a524-2116-11e7-830a-77c3c1df9872.png">

*The Pragmatic Programmer* by Andrew Hunt and David Thomas is another classic every software engineer should read. A true "oldie but goldie".

You'll learn how to approach tackling different problems you might face during your professional career. This book is a little bit dated, but was revolutionary when it was publised in the 90s.

[Get the book](https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master/dp/020161622X/ref=sr_1_1?ie=UTF8&qid=1490274295&sr=8-1&keywords=pragmatic+programmer)

## Design Patterns: Elements of Reusable Object-Oriented Software

<img align="right" src="https://cloud.githubusercontent.com/assets/20538501/25054865/5890722c-2114-11e7-9a8c-84c8af27640f.png">

Even with the rise of new programming paradigms (like Functional Programming), Object-Oriented thinking and designed software is definitely still around.

*Design Patterns* by the infamous "Gang of Four (GoF)" - Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides - with foreword by Grady Booch, is a great compilation of all relevant architectural patterns you can utilize to make your Object-Oriented software easier to maintain.

[Get the book](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612/ref=sr_1_2?ie=UTF8&qid=1490274362&sr=8-2&keywords=gang+of+four)

## The Imposter's Handbook: A Primer for Self-Taught Programmers

<img align="right" src="https://cloud.githubusercontent.com/assets/20538501/25054993/20f586c6-2115-11e7-95b6-58d3d14175f3.png">

Can you relate to the feeling that you just don't know enough? Perhaps someday you might be exposed as a "fraud" because you do your job, but compared to others you're still lacking some knowledge?

This is called ["Impostor Syndrome"](https://en.wikipedia.org/wiki/Impostor_syndrome) and quite a common feeling in the tech industry where experienced coders are hired even if they don't have an academic degree.

Some people even find themselves sitting next to a 16 years old who was hired from college because of his coding experience.

But [*The Imposter's Handbook*](https://bigmachine.io/products/the-imposters-handbook/) by Rob Conery has got you covered. It fills your knowledge gaps and walks you through all the topics you'll also learn in a CS degree program.

This will enhance your career, solidify your self-esteem and you can finally chit chat with the Ph.D. who's working in the Machine Learning division.

[Get the book](https://bigmachine.io/products/the-imposters-handbook/)

## Refactoring: Improving the Design of Existing Code

<img align="right" src="https://cloud.githubusercontent.com/assets/20538501/25055071/943c4d18-2115-11e7-990e-b2de3546fee9.png">

Code gets messy over time. That's just a circumstance we cannot change. But what we can change is the complexity of our codebase through refactoring.

The classic *Refactoring* by Martin Fowler and Kent Beck will show you how you can identify bloated code, and how you can work your way through the old, entangled codebase to a new shiny, refactored one.

The books is old, but still a classic. The examples are Java heavy but can be applied to other codebases, as well.

[Get the book](https://www.amazon.com/Refactoring-Improving-Design-Existing-Code/dp/0201485672/)

### Is something missing?

Know of a great book that's missing from this list? Great! Just open up a PR by clicking on the "edit" button above or add
your favorite book in the comments below!
