---
title: "The true cost of a new employee: compensation calculator for startups"
description: "Employee compensation is probably your biggest expense, but the total cost of an employee goes beyond their salary. Use this total compensation calculator to accurately budget!"
date: 2018-11-14
thumbnail: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/serverless-employee-cost.jpg"
category:
  - engineering-culture
heroImage: "https://s3-us-west-2.amazonaws.com/assets.blog.serverless.com/startup-employee-cost-calculator.jpg"
authors:
  - CaseyShultz
---

If you’re a founder, this shouldn’t surprise you: for most companies, employee compensation is its largest expense.

At Serverless, employee compensation makes up about 70% of our annual expenses. And we have to keep very accurate estimates of how much each employee costs so that we know what our actual burn rate is. But the calculation isn’t as straightforward as the salary.

For starters, you have to budget an additional 20% for things like benefits and taxes. That’s the rule of thumb at least; it, of course, has exceptions. In San Francisco, the 20% rule works well when applying it to employees who make less than $80,000 per year. But it doesn’t factor in that many payroll taxes max out after a certain amount, and benefits for a family cost a lot more than benefits for an individual.

So to track this better, I made a total employee compensation calculator! Feel free to use it.

#### The total employee compensation calculator

At Serverless, the majority of our employees qualify as highly compensated individuals. (Such is the world of software.) When I applied the 20% rule of thumb, depending on their benefits selection, I found the estimate to be off by as much $20,000.

We’re a small and lean startup that has to make every dollar count. So, I decided to create my own compensation calculator for a more accurate estimate based on the costs that we have for each employee.

The calculator is focused on San Francisco, but feel free to copy it and edit it with your own state and city numbers:

[Employee Cost Calculator](https://docs.google.com/spreadsheets/d/1lzvqppwrMzTHnF83-RdsnflR9AZPR58HRYSMJcQTyRQ/edit#gid=0)

*Disclaimer - the purpose of this calculator is to share a tool that we use internally at Serverless to estimate the total cost of an employee. It is not intended for commercial use. We are not tax professionals and encourage you to consult with a financial professional before making decisions based on this calculator.*

*All numbers are based on 2018 tax rates.*
#### Inputs into the calculator
**Salary**

This calculator assumes an annual salary and does not take into account any commissions or bonuses.
**Health Insurance**

We work with Sequoia One, a PEO that specializes in technology companies in the Bay Area and New York. In sum, this lets us benefit from average rates instead of age banded rates, so our insurance costs are the same for each employee depending on which tier they are in.

We pay $1,244 per month for a family,  $800 per month for individual & children, $800 per month for individual & spouse, and $600 per month for an individual. This makes it a lot easier to estimate the annual benefits cost for an employee, unlike with age banded rates that change depending on an employee’s age and location.
**Taxes**

Social Security - employers pay 6.2% of the first $128,400 of an employee’s payroll

Medicare - employers pay 1.45% of an employee’s payroll with no limit

I was a little confused as to how these next three are calculated, so I looked up how much we paid for each employee in the last year and used the max amount as default.

Federal Unemployment Tax Act (FUTA) - Assuming annual max of $42.00 based on our payroll

CA SUI - Assuming annual max of $315.00 based on our payroll

CA ETT - Assuming annual max of $7.00 based on our payroll
**Human Resource Information System**

We originally used Gusto for our payroll and benefits provider, and really liked them. But then we started hiring all over the United States and found that the cost of benefits through them was too high for the quality of coverage we wanted to provide to our employees.

We recently switched to Sequoia One, which costs us $110/ month/ employee.

**401K Administration**

We use Guideline to administer our 401K. Our team has been really happy with the low fee model they provide. We don’t currently offer a match and it costs us $8/ month/ employee to administer the plan.

**Lunch and Snacks**

We provide lunch and snacks to our San Francisco employees. This costs about $3,000 per employee per year. 

**What’s not included in this calculator:**

* Recruiter costs - this is accounted for separately in our budget
* The cost of interviewing and onboarding a new employee (I’ll cover this in a blog post at a later date)
* Equipment/ setup cost - this is usually a one time cost and it’s accounted for separately in our budget.
* Options/ Equity - If you are trying to calculate an employee’s total compensation check out my nifty Equity Calculator that * I created to simplify writing up options agreements. 
* Cost of office space - We currently view the cost of our office as a fixed and it’s accounted for separately in our budget 
* Team retreats - We bring our entire team together twice a year. Past retreat locations include Austria, Northern California, and Morocco. Budgeting for retreats depend on where a team member is flying from and where the retreat is located, so we have a separate budget for that.
* Stuff I probably forgot - see anything that is missing? Shoot me a tweet @alaskacasey and let me know!

#### How to use this calculator

If you think that this calculator would be helpful to your team and you’d like to use it, go for it!

##### Make a copy

To make a copy from the master Google Spreadsheet, go to `File` and select `Make a Copy`. This will prompt you to change the name of the file and select where you would like to save it in your Google Drive. 

You can also download the calculator in different formats like Excel by going to `File` > `Download as` and choose your preferred format.

##### Setting up the calculator

Everything highlighted in blue is where you can input your own costs for these items. Or, you can change the headings to completely different costs that you may have.

Social Security and Medicare are federal tax rates, so you shouldn’t need to edit those except when the feds change the rates. 

##### Using the calculator

Once you have all the blue areas set up with your local numbers, you just update the cells highlighted in yellow with an individual employee’s numbers. Voila. 

#### Was this helpful?

This calculator is the perfect example of a minimal viable product. Please let me know if you found this useful or feel free to comment on how it can be improved!
