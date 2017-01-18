---
title: A Serverless Weatherclock To Monitor My Favorite Kiteboarding Spot At The Lake
description: This post illustrates how I use Serverless to update a `windclock` that shows me the wind speed and direction at my favorite kiteboarding spot.
date: 2017-01-17
thumbnail: https://cloud.githubusercontent.com/assets/20538501/22045696/720957f4-dce1-11e6-9a5e-15f34c8c6ec6.jpg
layout: Post
authors:
  - DouweHomans
---

Hi, I'm [Douwe Homans](https://www.douwehomans.com/). I'm a trained medical doctor, software engineer and entrepreneur in the Netherlands. I recently decided to turn an old weatherclock into an IoT project using a Particle Photon and the Serverless Framework. In this post I'll share how I did it.

## Background

In the 80's, my grandparents received a homemade weatherclock as a gift from a friend. The device had a clock-like display that indicated the current wind direction near their home. The sensor part was an actual mechanical wind vane that used a magnet and reed switches to determine the wind direction.

They placed it several meters from their house on a high pole. It was connected with a multicore cable (a core for every wind direction) to the display inside. The display consisted of 8 LEDs mounted in a black acrylic plate. The plate was framed in a circular piece of wood.
<p align="center">
  <img width="400" src="https://cloud.githubusercontent.com/assets/20538501/22045501/41045826-dce0-11e6-8203-48d5bf6e5c08.jpg">
</p>

After my grandparents moved to an apartment, we never found the space to put up the sensor. The clock hadn't been working since.

## Now
A lot has changed since then. Now we have the Internet! I thought it would be nice to hook up the clock to the Internet so we could get the current wind direction (and speed) from the web. This would allow me to get rid of the mechanical wind vane, and I could also add wind*speed* to the display in addition to the direction.

<p align="center">
  <img src="https://cloud.githubusercontent.com/assets/20538501/22045403/b1c3444c-dcdf-11e6-8876-3c3491d056c1.gif">
</p>

## Getting Started
It came down to 2 steps:

1. Connect the clock to the Internet
2. Get the data to the clock


### Connect the clock to the Internet 
I decided to work with a Photon made by [Particle.io](https://www.particle.io/). It's a microprocessor that automatically connects to the Particle Cloud once set up. The device can be programmed in C.

<p align="center">
  <img width="400" src="https://cloud.githubusercontent.com/assets/20538501/22045527/70b1499e-dce0-11e6-864d-15f33feb8511.jpg">
</p>

I connected each LED, using a current limiting resistor, to a seperate pin of the Photon.

<p align="center">
  <img width="400" src="https://cloud.githubusercontent.com/assets/20538501/22045561/93b6b99c-dce0-11e6-8084-088a2f2b7d3c.jpg">
</p>

The cool thing about the Photon is that you can program it over the air from your browser. In your code you can define [remote functions](https://docs.particle.io/reference/firmware/photon/#particle-function-) which you'll be able to call over the Internet once the code has been deployed to the device. ([Particle Documentation](https://docs.particle.io/reference/api/#call-a-function)).

I exposed two of those functions: `setWindSpeed` and `setWindDir`. The first one takes the windspeed in Beaufort (a commonly used scale in the Netherlands), the second one the windDirection.

The code on the Photon simply runs an infinite loop, similar to this:

```pseudo
if ( THERE_IS_NO_WIFI ) {
    blink_leds_fast_to_indicate_no_wifi();
} else if ( I_GOT_NO_WEATHER_UPDATE_FOR_A_LOOOOONG_TIME ) {
    blink_leds_slow_to_indicate_no_updates();
} else {
    // I HAVE INTERNET AND DATA!
    animate_all_leds_in_circle();
    turn_on_led_for_corresponding_wind_direction(); // which has been set by externally calling setWindDir
    animate_all_leds_in_circle();
    turn_on_number_of_leds_to_indicate_windspeed(); // which has been set by externally calling setWindSpeed
}
```
You can see actual code [on GitHub](https://github.com/douweh/windclock_photon).

The clock is pretty 'dumb'. It's not reaching out to the Internet to find, parse, and display data. It just displays the values for the windSpeed and windDir and those values get set by calling `setWindSpeed` and `setWindDir`. This helps to keep the code in the clock really simple and focused on one job.

Gathering weather data and getting it to the clock is not the concern of the clock itself.

<iframe width="640" height="360" src="https://www.youtube.com/embed/CS6aQ6hjeuU" frameborder="0" allowfullscreen></iframe>

### So how do we get the data to the clock?
Once the clock is connected to the Particle Cloud you can (with the right credentials) connect to it through the Particle Cloud and call the functions you exposed in the code (`setWindSpeed` and `setWindDir`). I can login to the Particle Cloud, find out the ID of our wind-clock, and just use the `particle` command line tool.

`$ particle call ID_FROM_OUR_CLOCK setWindDir "NNE"`

And that makes my clock's `N` and `NE` LED's light up indicating the wind is blowing from North-North-East.

This shows me that the hardware is working, but of course I want the *current* wind direction for my favorite spot, pushed automically (and periodically) to the clock.

So basically I need to run the following steps periodically.

- Get data from the web
- Push data to particle-cloud

### Serverless

When I thought about how I wanted to run the code to update my clock I came to the following conclusion:

I really don't care that much where my code runs. As long as I know it *does* AND I can *tune in* to see it *still does* :).

I could spin up a server myself, I could use an EC2 instance, or Heroku, or a virtual server from a different vendor, or....
I don't want to spend time figuring out what is the best option.

This is where Serverless made sense to me. I just write my code and configure which events triggers my code to run.

The complete code is [on GitHub](https://github.com/douweh/windclock_serverless). But it boils down to the following:

A `handler.js` which exposes an `update` function which:

1. Gets Weather data (from Dutch Weather Institute)
2. Converts M/S to Beaufort
3. Connects and pushes data to the Particle Cloud

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
I can run a `$ serverless deploy` to deploy my code and know that it runs every 15 minutes. If I want to *tune in* I simply run `$ serverless logs -f update`.

And just like that I can tell whether it's time to head out with my kiteboard.
