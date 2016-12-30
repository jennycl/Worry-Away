# Worry Away

# Please use HTTPS, not HTTP!

## Overview

Worry Away is an interactive digital art piece. What Worry Away aims to do is help the user 'visualize' their current preoccupations, and give a way for them to visually push away these 'worries'.

Worry Away shows the worries of all users who have entered the site, and provides a way for a user to see other people's worries and perhaps then realize, that their worries aren't as bad as they seemed, and that they aren't alone.

Anonymity is important, so no name is taken, and the worries that are entered are scrambled so that key words are the emphasis.

The words move in a random motion, aimed to be calming,by using Perlin Noise, rather than sudden and sporadic.


## Data Model

We'll to store Worries, Scores, and Game Statistics (to see when people have come on the site)

First draft schema:

```javascript
// total scores, kept anonymous
var score = new mongoose.Schema({
  score: Number
})

// each user on the site can pick their color and have that worry be that color
var worries = new mongoose.Schema({
  red: Number,
  green: Number,
  blue: Number,
  worry: String
})

// game Statistics - when someone has come on, maybe more, like what kind of browser was used, etc
var gameStats = new mongoose.Schema({
  time: Date
})

```

## Wireframes

![wireframe](https://github.com/nyu-csci-ua-0480-007-fall-2016/cl2540-final-project/blob/master/documentation/wireframe.jpg)


## Site map

![site-map](https://github.com/nyu-csci-ua-0480-007-fall-2016/cl2540-final-project/blob/master/documentation/sitemap.jpg)


## User stories

1. as a user, I can enter my worries
2. as a user, I can click submit to submit my worry to the Worry Away universe/canvas
3. as a user, I can put my mouse over Worries and collect points
4. as a user, I can play indefinitely, as worries never go Away
5. as a user, I can submit my score
6. as a user, I can view high scores, average scores, and game Statistics

## Research Topics

(4 Points) External API used - Client side Javascript
* I will be using Processing in p5 to do the graphics for this project: https://p5js.org/reference/
* p5 provides DOM manipulation, as well as a "canvas" in which my worry universe will take place
* p5 processes Javascript, so that works well with everything in this class

(2 Points) External API used - Socket.IO
* I will be using Socket.IO to allow for interaction among users
* When user's click, their worries will be sent over to the screen of another user
* This portion is just something, since users will be able to interact with others directly
* When Users are on, their mouse position will be displayed so that other users know that they are on(maybe)

(2 Points) External API used - Google Charts
* Make a chart of when people play the game, in terms of plays per day per month
* Use google charts to make the graphic
* Have it update in according to the month

# Attributions & Annotations
* Movement of words are generated with Perlin Noise https://p5js.org/reference/#/p5/noise
* Idea for having moving words from this p5 Example of input on the canvas: https://p5js.org/examples/dom-input-and-button.html
* Colors Idea: https://p5js.org/examples/dom-slider.html
* Google charts line graph API: https://developers.google.com/chart/interactive/docs/gallery/linechart
* General usage of p5 and interaction with the DOM using p5 can be attributed to the p5 website as well as Craig Kapp's Interactive Computing class: http://cs.nyu.edu/~kapp/courses/cs0380fall2016/wrapup06.php
* Using Socket.IO with Express: http://www.programwitherik.com/socket-io-tutorial-with-node-js-and-express/
