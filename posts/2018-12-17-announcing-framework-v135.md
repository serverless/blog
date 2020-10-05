---
title: "Serverless Framework v.1.35: Local Invoke Ruby, CloudFormation variable syntax"
description: "Check out the latest Serverless Framework v1.35 release, featuring Ruby invoke local support, CloudFormation config, and more."
date: 2018-12-17
thumbnail: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v135-thumb.png'
heroImage: 'https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/framework-updates/framework-v135-header.svg'
category:
  - news
authors: 
  - JaredShort
---

Hot on the heels of our day 1 support for [Lambda Layers](https://serverless.com/blog/publish-aws-lambda-layers-serverless-framework/) and the [AWS Lambda Ruby Runtime](https://serverless.com/blog/api-ruby-serverless-framework/), we’re announcing an even fresher Serverless Framework **v1.35**!

This release is shipping with **2 features**, **1 enhancement** and **5 bug fixes**, as well as accompanying documentation updates.

#### Features

##### Local invoke Ruby support

[PR #5559](https://github.com/serverless/serverless/pull/5559), thank you [Dean Holdren - @dholdren](https://github.com/dholdren)!

You can now `serverless invoke local -f {function}` for AWS Lambda Ruby runtimes. This makes it easier to pass in test payloads and quickly iterate locally.

An important note, you will want to make sure you are running a Ruby version equal to AWS Lambda’s runtime (as of this writing, it is `2.5`). macOS system Ruby likely will NOT work properly.

##### AWS `${cf}` syntax now supports outputs from other regions

[PR #5579](https://github.com/serverless/serverless/pull/5579), thank you [TATSUNO Yasuhiro - @exoego](https://github.com/exoego)

Often, you’ll want to centralize configs in CloudFormation outputs, making them easy to access for use in other services. However, this becomes complex in the case that you want to have a multi-region service, or otherwise regionally distributed services.

This feature addition makes it so you can optionally specify a region to look at for outputs, allowing cross-region resolution of the outputs. Usage is as simple as`${cf.REGION:stackName.outputKey}`. For example, `${cf.us-east-2:my-service-dev.kinesisStreamArn}`.

Check out the docs for more information on [CloudFormation output usage](https://serverless.com/framework/docs/providers/aws/guide/variables#reference-cloudformation-outputs) in the variable resolution system.

#### Enhancements

##### Faster exclusion of files during packaging

[PR #5574](https://github.com/serverless/serverless/pull/5574), thank you [Jeff Soloshy - @MacMcirish](https://github.com/MacMcIrish).

You may know that you can exclude various things from being packaged, including dev only packages in `package.json`. You can [check out the docs](https://serverless.com/framework/docs/providers/aws/guide/packaging/#exclude--include) for more info.

This could be a slow process if you had a large project with many dependencies. According to Jeff, when running package on “a project with a large file count with many dev dependencies. The difference in timing is ~30s compared to ~15 minutes.” - [github](https://github.com/serverless/serverless/pull/5574#issue-236643438). WOW!

#### Bug fixes

- [PR #5563](https://github.com/serverless/serverless/pull/5562) `logRententionInDays` regression fix, once again parses strings to integers.
- [PR #5566](https://github.com/serverless/serverless/pull/5566) Set reserved function concurrency even if it was set to 0.
- [PR #5565](https://github.com/serverless/serverless/pull/5565) Set env vars from --env last in invoke local, allowing for more intuitive overrides.
- [PR #5571](https://github.com/serverless/serverless/pull/5571) Preserve whitespace in variable fallback
- [PR #5587](https://github.com/serverless/serverless/pull/5587) Upgrade to aws-sdk v2.373.0. Fixes SDK bugs aws-sdk package had with using profiles.

#### Roadmap & focus

We are focusing our internal efforts on eliminating regressions, and tackling the backlog of bugs. Other members of our fantastic community have been adding features and enhancements, and as always these contributions are welcomed and valued!

#### Contributor thanks

Each release, there are always many people involved. This release is no different, and we would like to thank everyone below for their contributions and participation in the community.

We couldn’t do it without you!

[Rupak Ganguly - @rupakg](https://github.com/rupakg), [Dean Holdren - @dholdren](https://github.com/dholdren), [TATSUNO Yasuhiro - @exoego](https://github.com/exoego), [Jeff Soloshy - @MacMcirish](https://github.com/MacMcIrish), [Federico - @asyba](https://github.com/asyba), [Jaap Taal - @q42jaap](https://github.com/q42jaap), [Joshua Napoli - @joshuanapoli](https://github.com/joshuanapoli), [Enrique Valenzuela - @enriquemanuel](https://github.com/enriquemanuel)

