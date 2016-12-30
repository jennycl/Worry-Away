var mongoose = require('mongoose');

var score = new mongoose.Schema({
  score: Number
})

var worries = new mongoose.Schema({
  red: Number,
  green: Number,
  blue: Number,
  worry: String
})


var gameStats = new mongoose.Schema({
  time: Date
})


mongoose.model('score', score);
mongoose.model('worries', worries);
mongoose.model('gameStats', gameStats);
mongoose.connect('mongodb://heroku_gltx8b0w:77ub4e6lbgunm2q9qq1qh333d4@ds151117.mlab.com:51117/heroku_gltx8b0w');
