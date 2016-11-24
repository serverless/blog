---
title: How serverless tells me when we can go kiteboarding.
description: "This post illustrates how I use serverless to update a `windclock` which shows me the windspeed and direction for our favorite watersports spot!"
date: 2016-11-224
thumbnail: 'https://github.com/douweh/windclock_serverless/blob/master/klok.jpg?raw=true'
layout: Post
authors:
  - DouweHomans
---

#How serverless tells me when we can go kiteboarding.

## Background
Long long time ago (somewhere in the 80's), my grandparents received a homemade gift from a friend: a 'windclock'. A 'clock-style' display which indicated the current wind direction near their home. The sensor part was an actual mechanical wind-vane which uses a magnet and reed-switches to determine the wind direction. It was placed multiple meters from their house on a high pole and was connected with a multicore cable (a core for every wind-direction) to the display inside. The display consisted of 8 LED's mounted in a black acrylic plate. The plate was then framed in a circular piece of wood.
<p align="center">
  <img width="400" src="https://github.com/douweh/windclock_serverless/blob/master/klok.jpg?raw=true">
</p>

When they moved to an apartment we never found the space to put op the sensor part and the clock has not been working since....

## Now
A lot changed since then: we now have internet! I thought it would be nice to hook up the clock to the internet so we just get the current wind-direction (and speed) from the web. This way I could just get rid of the mechanical wind-vane, and I could also add the display of wind*speed* (apart from the direction).

<p align="center">
  <img src="IMG_1510.gif">
 </p>

## How to
It comes down to 2 steps:

1. Connect the clock to the internet
2. Get the data to the clock


### Connect the clock to the internet 
I decided to work with a Photon (made by Particle.io). A microprocessor which auto-connects to the Particle-Cloud once set up. The particle can be programmed with C-code.

<p align="center">
  <img width="400" src="https://github.com/douweh/windclock_serverless/blob/master/photon.jpg">
</p>

So I just connected each LED (with a current limiting resistor) to a seperate pin of the Photon.

<p align="center">
  <img width="400" src="https://github.com/douweh/windclock_serverless/blob/master/inhoud.jpg">
</p>

The cool thing about the Photon is that you can program it over the air from your browser. In your code you can define functions which you'll be able to call over the internet once the code has been deployed to the device. [https://docs.particle.io/reference/api/#call-a-function](Particle Documentation).

I exposed two functions: `setWindSpeed` and `setWindDir`. The first one takes the windspeed (in Beaufort; which is a commonly used scale in the Netherlands) as argument, the second one the windDirection.

The code on the Photon just runs an infinite loop (something like this) see actual code on [https://github.com/douweh/windclock_photon](github):

```pseudo
if ( THERE_IS_NO_WIFI ) {
    blink_leds_fast_to_indicate_no_wifi();
} else if ( I_GOT_NO_WEATHER_UPDATE_FOR_A_LOOOOONG_TIME ) {
    blink_leds_slow_to_indicate_no_updates();
} else {
    // I HAVE INTERNET AND DATA!
    animate_all_leds_in_circle();
    turn_on_led_for_corresponding_wind_direction();
    animate_all_leds_in_circle();
    turn_on_number_of_leds_to_indicate_windspeed();
}
```

The clock is pretty 'dumb': it is not reaching out to the internet to find, parse, and display data... It just displays what it's instructed. This helps to keep the code on the display simple.

<iframe width="640" height="360" src="https://www.youtube.com/embed/CS6aQ6hjeuU" frameborder="0" allowfullscreen></iframe>

### So how do we get the data to the clock?
Once the clock is connected to the particle-cloud you can (with the right credentials) connect to it through the particle-cloud and call the functions you exposed in the code (`setWindSpeed` and `setWindDir`). So I can login to the particle-cloud; find out the ID of our wind-clock, and just use the `particle` command line tool.

`$ particle call ID_FROM_OUR_CLOCK setWindDir "NNE"`

And that makes my clock's `N` and `NE` LED's light up indicating the wind is blowing from North-North-East.

So this is cool and shows me the hardware is working, but ofcourse I want the *actual* winddirection for my favorite spot, pushed automically (and periodically) to the clock.

So basically I need to run the following steps periodically.

- Get data from the web
- Push data to particle-cloud

### Serverless

When I thought about how I wanted to run the code to update my clock I came to the following conclusion:

I really don't care that much where my code runs. As long as I know it *does* and I can *tune in* to see it *still does* :).

I could spin up a server myself, I could use an EC2 instance or heroku, or a virtual server from a different vendor.. Or....
I don't want to spend time figuring out what is the best option.

This is where serverless made sense to me. I just write my code and configure which events triggers my code to run.

The complete code is on [https://github.com/douweh/windclock_serverless](github). But it boils down to the following:

A `handler.js` which exposes an `update` function which:

1. Gets Weather data (from Dutch Weather Institute)
2. Converts M/S to Beaufort
3. Connects and pushes data to the particle cloud

A `serverless.yml`:

```yml
service: windclock
provider:
  name: aws
  runtime: nodejs4.3
  region: eu-central-1

functions:
  update:
    handler: handler.update
    events:
      - schedule: rate(15 minutes)
```

That's it!
I can just run a `$ serverless deploy` to deploy my code and know it gets run every 15 minutes. If I want to *tune in* I just run `$ serverless logs -f update`.

