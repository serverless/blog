---
title: Software Engineering resources you must read / watch
description: Resources you should read / watch to enhance your Software Engineering career
date: 2017-04-11
layout: Post
authors:
  - PhilippMuns
---

At Serverless we're constantly educating ourselves to incorporate the latest best practices in our engineering 
processes and deliver the best Serverless toolings out there.

In this blog post we'll provide a list with useful Software Engineering books we've read and recommend you to read.

**Note:** This list is a living document. We'll update it constantly to reflect our recent learnings / recommendations.

*We're not associated with any authors or platforms we list here*

# Clean Code

This is a really classic book every software engineer / programmer should read. It teaches you how to write code in a way that it's easy to read and understand.

Not all techniques which are shown here need to be followed but even after adapting some of them your code "reads like" prose.

Remember that we spent most of the time reading code rather than writing code.

And to be honest

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

# The Clean Coder

This is another great book by the same autohr (uncle Bob) who also wrote ["Clean Code"](#clean-code).

The main topic of this book is how professional software developers should behave. How they should communicate and work on projects / problems.

Did you ever feel empowered and super happy after hitting a super tight deadline while being you're overloaded with tasks in the current sprint? You should be proud and your boss too, right?

Read this book and think again...

[Get the book](https://www.amazon.com/Clean-Coder-Conduct-Professional-Programmers/dp/0137081073/ref=sr_1_2?ie=UTF8&qid=1490274327&sr=8-2&keywords=clean+code)

# The Phoenix Project

This novel about IT operations is not the usual tech book. It's really something you can read before going to sleep without wrapping your head around all the complex tech problems you've read about.

"The Phoenix Project" is a good read if you want to see how the "wrong work" will negatively impact the performance of your company. You'll learn the different types of work and see how a (fictional) doomed corporation transitioned from being a ["poor dog" to a "star"](https://en.wikipedia.org/wiki/Growth%E2%80%93share_matrix).

[Get the book](https://www.amazon.com/Phoenix-Project-DevOps-Helping-Business/dp/0988262509/ref=sr_1_1?ie=UTF8&qid=1490274311&sr=8-1&keywords=phoenix+project)

# The Pragmatic Programmer

This is another classic every software engineer should read. A true "pldie but goldie".

You'll learn how you should think and tackle different problems you might face during your professional career. This book is a little bit dated but was revolutionary when it was publised in the 90s.

[Get the book](https://www.amazon.com/Pragmatic-Programmer-Journeyman-Master/dp/020161622X/ref=sr_1_1?ie=UTF8&qid=1490274295&sr=8-1&keywords=pragmatic+programmer)

# Design Patterns

Even after the rise of new programming paradigms such as Functional Programming there's still lots of Object Oriented thinking and designed software around.

"Design Patterns" be the infamous "Gang of four" is a great compilation of all relevant architectural patterns you can utilize to make your Object Oriented software easier to maintain.

[Get the book](https://www.amazon.com/Design-Patterns-Elements-Reusable-Object-Oriented/dp/0201633612/ref=sr_1_2?ie=UTF8&qid=1490274362&sr=8-2&keywords=gang+of+four)

## Is something missing?

Do you feel that something is missing in this list? Great! just open up a PR by clicking on the "edit" button above or add
your favorite book in the comments below!
