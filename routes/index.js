var express = require('express');
var server = require('http').Server(express);
var router = express.Router();

var mongoose = require('mongoose');

var Score = mongoose.model('score');
var Worries = mongoose.model('worries');
var GameStats = mongoose.model('gameStats');

var ObjectId = require('mongoose').Types.ObjectId;

var fs = require('fs');

router.get('/', function(req, res, next) {
  res.render('index');
});


router.post('/api/highScores', function(req, res){
  (new Score({
    score: req.body.highScore,
  })).save(function(err, score, count){
    if (err){
      return res.send(500, "error occured");
    }

    Score.find({}, function(err, scores, count){
      res.json(scores.map(function(ele){
        return{
          'scores' : ele.score,
          'playerName' : ele.playerName
        }
      }))
    })
  })
})

router.post('/api/worries', function(req, res){

  (new Worries({
    worry: req.body.worry,
    red: req.body.red,
    green: req.body.green,
    blue: req.body.blue
  })).save(function(err, score, count){
    if (err){
      return res.send(500, "error occured");
    }

    Worries.find({}, function(err, worry, count){
      res.json(worry.map(function(ele){
        return{
          'worry' : ele.worry,
          'red' : ele.red,
          'green': ele.green,
          'blue' : ele.blue
        }
      }))
    })

  })
})

router.post('/api/gameStats', function(req, res){

  (new GameStats({
    time: req.body.time
  })).save(function(err, time, count){
    if (err){
      return res.send(500, "error occurred");
    }

    GameStats.find({}, function(err, stats, count){
      res.json(stats.map(function(ele){
        return{
          'stat':ele.time
        }
      }))
    })
  })
})


module.exports = router;
