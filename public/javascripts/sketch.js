var socket;
var rangeData = 30;
var radioData = "ellipse";
var theCanvas;
var coinArtWork;

var coins = [];
var points = 0;

var text;

var socketData;

var playerName;
var colorObj;

var startTime, endTime;

var worries, happies;

var dancingWords = [];
var bounds;

var gameStats;

var startedGame = false;

var hideTheCanvas = false;

function preload(){

}

var redSlider;
var greenSlider;
var bludSlider;

var redValue, blueValue, greenValue;

var startButton, userInput;

function setup() {
  theCanvas = createCanvas(windowWidth, windowHeight);
  theCanvas.parent("sketch");

  var submitScoreBtn = document.getElementsByClassName('submitButton')[0];
  submitScoreBtn.style.display = 'none';

  noiseDetail(24);
  socket = io.connect();

  socket.on('mouse', function(data){
    fillWithWords(data.word);
  });

}

function fillWithWords(w){

  if (dancingWords.length < 30){
    for (var j = 0; j < w.length; j++){
      var dw = new Word(w[j].x, w[j].y, w[j].word, w[j].red, w[j].green, w[j].blue);
      dancingWords.push(dw);
    }
  }
}

function getGameStats(){

  var time = new Date();

  var req = new XMLHttpRequest();

  // dev
  //var url = "http://localhost:3000/api/gameStats";

  //prod
  var url = "https://cat5.herokuapp.com/api/gameStats";

  req.open('POST', url, true);

  req.addEventListener('load', function(){
    if(req.status >= 200 && req.status < 400){
      gameStats = JSON.parse(req.responseText);
      var todaysDate = new Date();
      var todaysMonth = String(todaysDate.getMonth()+1);
      var today = todaysDate.getDate();

      var dataArray = [];
      var dayIterate;
      dataArray.push(['Day', 'Times Played']);
      for (var i = 1 ;i <= today; i++){
        var dayData = [];
        dayData.push(todaysMonth + "/" + i);
        dayIterate = i;
        var filteredArr = gameStats.filter(matchMonthAndDay);
        dayData.push(filteredArr.length);
        dataArray.push(dayData);
      }


      function matchMonthAndDay(gameDate){;
          var gameDay = String(parseInt(gameDate.stat.slice(8,10)));
          var gameMonth = String(parseInt(gameDate.stat.slice(5,7)));
          return gameDay == dayIterate && String(gameMonth) == String(todaysMonth);
      }

      var googleChart = document.createElement('div');
      googleChart.id = "curve_chart";
      googleChart.class = "curve_chart";
      googleChart.style.width = '1000px';
      googleChart.style.height = '500px';

      var endPage = document.getElementById('pg-content');
      endPage.appendChild(googleChart);
      google.charts.load('current', {'packages':['corechart']});
      google.charts.setOnLoadCallback(drawChart);


      function drawChart() {
        var data = google.visualization.arrayToDataTable(
          dataArray
        );

        var options = {
         title: 'Times played this month',
         legend: { position: 'bottom' }
       };

        var chart = new google.visualization.LineChart(document.getElementById('curve_chart'));
        chart.draw(data, options);

      }
    }
  });

  req.addEventListener('error', function(e){
    console.log(e);
    document.body.appendChild(document.createTextNode("error!"));
  })

  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  // send data
  req.send("time=" + time);

}

function validateInput(){
  var inputVal = document.getElementById('userInput').value;
  if (inputVal.trim() ==null || inputVal.trim()==""|| inputVal ===" "){
    document.getElementById('possibleError').innerHTML = "Worries cannot be empty, you must have *something* on your mind... Did you remember to turn the stove off?";
    return false;
  }
  else{
    startGame()
  }
}

function startGame(){

  startedGame = true;

  var submitScoreBtn = document.getElementsByClassName('submitButton')[0];
  submitScoreBtn.style.display = 'inline-block';

  var fp = document.getElementsByClassName('startPage');
  for (var i = 0; i < fp.length; i++){
    fp[i].style.display='none';
  }

  var texts = document.getElementById('userInput').value;

  var redValue = updateRange1();
  var greenValue = updateRange2();
  var blueValue = updateRange3();

  var req = new XMLHttpRequest();

  // dev
  var url = "http://localhost:3000/api/worries";

  // prod
  var url = "https://cat5.herokuapp.com/api/worries";

  req.open('POST', url, true);

  req.addEventListener('load', function(){

    var worries = JSON.parse(req.responseText);

    if(req.status >= 200 && req.status < 400){

      for (var i = 0 ; i < random(10); i++){

          if (worries[i] != null){
            var paragraphs = worries[i].worry;
            var words = paragraphs.split(' ');
            for (var j = 0; j < words.length; j++){
              var dw = new Word(random(windowWidth-200), random(windowHeight-200), words[j], worries[i].red,  worries[i].green,  worries[i].blue);
              dancingWords.push(dw);
            }
         }
      }

      if (texts != null){
        var textArr = texts.split(' ');
        var l;
        if (textArr.length > 30){
          l = 30;
        }
        else{
          l = textArr.length;
        }
        for (var j = 0; j < l; j++){
          var dw = new Word(random(windowWidth-200), random(windowHeight-200), textArr[j], redValue, greenValue, blueValue);
          dancingWords.push(dw);
        }
      }
    }
  });

  req.addEventListener('error', function(e){
    console.log(e);
    document.body.appendChild(document.createTextNode("error!"));
  })
  // make sure request header specifies content type
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

  //console.log(redValue + " " + greenValue + " " + blueValue);
  // send data
  req.send("worry=" + texts + "&" + "red=" + redValue + "&" + "green=" + greenValue + "&blue=" + blueValue);
}

function Word(x, y, word, r, g, b){

  this.x = x;
  this.y = y;

  this.word = word;

  this.red = r;
  this.green = g;
  this.blue = b;

  // store our rotation
  this.rotation = random(0, 360);

  // compute a perlin noise offset
  this.noiseOffsetX = random(0,1000);
  this.noiseOffsetY = random(0,1000);
}

Word.prototype.display = function(){

    textSize(30);
    textStyle(BOLD);

    push();
    fill(this.red, this.green, this.blue);
    imageMode(CENTER);
    strokeWeight(4);
    stroke(51)
    translate(this.x, this.y);
    rotate(radians(this.rotation));
    text(this.word, 0, 0);
    pop();
    this.rotation+=1;
}

Word.prototype.move = function() {

  var xMovement = map(noise(this.noiseOffsetX), 0, 1, -2, 2);
  this.x += xMovement;

  var yMovement = map(noise(this.noiseOffsetY), 0, 1, -2, 2);
  this.y += yMovement;

  // coin should wrap around if necessary
  if (this.x > width) {
    this.x = 0;
  }
  if (this.x < 0) {
    this.x = width;
  }
  // coin should cycle around to the top of the screen, if necessary
  if (this.y > height) {
    // random position on top of the screen
    this.y = random(-400, 0);
  }

  // did the user touch the coin?
  if (dist(mouseX, mouseY, this.x, this.y) < 25) {
    points += 1;
    this.y = random(-400, 0);
  }
  // advance our noise offset a little bit
  this.noiseOffsetX += 0.01;
  this.noiseOffsetY += 0.01;
}


function draw() {

    if (hideTheCanvas == true){
      theCanvas.hide();
    }
    else{
      if (updateRange1() || updateRange2() || updateRange3()){
        background(updateRange1(),updateRange2(), updateRange3());
      }

      for (var i =0 ; i < dancingWords.length; i++){
        dancingWords[i].display();
        dancingWords[i].move();
      }

      if (startedGame == true){
        push();
        stroke(0);
        fill(255);
        text("Points: " + points, windowWidth/8, windowHeight/10);
        pop();
      }
    }
}
var endGame = false;
function sendScore(){

  var submitScoreBtn = document.getElementsByClassName('submitButton')[0];
  submitScoreBtn.style.display = 'none';

  endGame = true;

  theCanvas.hide();
  hideTheCanvas = true;

  var fp = document.getElementsByClassName('highScores');

  for (var i = 0; i < fp.length; i++){
    fp[i].style.display='block';
  }
  var pg = document.getElementsByClassName('pg-content');
  for (var i = 0; i < pg.length; i++){
    pg[i].style.display='block';
  }


  var req = new XMLHttpRequest();

  // dev
  //var url = "http://localhost:3000/api/highScores";

  // prod
  var url = "https://cat5.herokuapp.com/api/highScores";

  req.open('POST', url, true);
  req.addEventListener('load', function(){

    if (req.status >= 200 && req.status <400){

      var scores = JSON.parse(req.responseText);

      var tbody = document.getElementById('highScores');
      while(tbody.firstChild){
        tbody.removeChild(tbody.firstChild);
      }
      // player's score
      var playerScore = document.createElement('h1');
      playerScore.classList.add('scoreFormat');
      playerScore.classList.add('highScores');
      playerScore.appendChild(document.createTextNode("Your score is: " + points));
      tbody.appendChild(playerScore);

      // find average score
      var scoreArray = [];
      for (var i =0 ; i < scores.length; i++){
        scoreArray.push(scores[i].scores);
      }

      var totalScores = scoreArray.reduce(function(a, b){
          return a + b;
      }, 0);

      var average = totalScores/(scoreArray.length);

      // player's score
      var averageScore = document.createElement('h2');
      averageScore.classList.add('scoreFormat');
      averageScore.appendChild(document.createTextNode("The Average Score is: " + Math.floor(average)));
      tbody.appendChild(averageScore);

      var hs = document.createElement('h3');
      hs.classList.add('scoreFormat');
      var pele = document.createElement('p');
      hs.appendChild(pele.appendChild(document.createTextNode("Top 5 scores: ")));
      tbody.appendChild(hs);
      scoreArray.sort(sortNum);

      function sortNum(a,b) {
          return a - b;
      }

      var ul = document.createElement('ul');
      for (var i = scoreArray.length-1; i > scoreArray.length-6; i--){
        var li = document.createElement('li');
        li.classList.add('highScores')
        li.appendChild(document.createTextNode(scoreArray[i]));
        ul.appendChild(li);
        tbody.appendChild(ul);
      }
    }
  })
  req.addEventListener('error', function(e){
    console.log(e);
    document.body.appendChild(document.createTextNode("error!"));
  })
  // make sure request header specifies content type
  req.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
  // send data
  req.send("highScore=" + points);

  getGameStats();

}

function mouseClicked(){

    if (endGame === false){

      socketData = {
        word: dancingWords
      }
      socket.emit('mouse', socketData);
    }
}


function windowResized(){
  theCanvas.size(windowWidth, windowHeight);
}

function updateRange1(theRange){
  var range = document.getElementById('range1').value;
  return range;
}
function updateRange2(theRange){
  var range = document.getElementById('range2').value;
  return range;
}

function updateRange3(theRange){
  var range = document.getElementById('range3').value;
  return range;
}
