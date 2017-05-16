function make2DArray(cols, rows){
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++){
    arr[i] = new Array(rows);
  }
  return arr;
}

var grid, cols, rows, w = 40;
var totalBombs;
var bombIcon;
var flagIcon;
var game_over = false;
var game_win = false;

var mousePressedCounter = 0;
var mousePressedCounterBoolean = false;

function preload(){
  bombIcon = loadImage('assets/bomb.png');
  flagIcon = loadImage('assets/flag.png');
}

function setup() {
  var urlParams = window.location.search.substring(1);
  var difficultyParam = urlParams.split('&')[0];
  var difficulty = difficultyParam.split('=')[1];

  var rdBtn = null;
  if (difficulty == 'hard'){
    rdBtn = select('#hardRdBtn');
    cols = 15;
    rows = 15;
    totalBombs = 20;
  } else if (difficulty == 'medium'){
    rdBtn = select('#mediumRdBtn');
    cols = 12;
    rows = 12;
    totalBombs = 15;
  } else {
    rdBtn = select('#easyRdBtn');
    cols = 10;
    rows = 10;
    totalBombs = 10;
  }
  rdBtn.elt.checked = 'checked';

  createCanvas(cols * w + 1, rows * w + 1);
  grid = make2DArray(cols, rows);

  for (var i = 0; i < cols; i++){
    for (var j = 0; j < cols; j++){
      grid[i][j] = new Cell(i, j, w);
    }
  }

  var options = [];
  for (var i = 0; i < cols; i++){
    for (var j = 0; j < rows; j++){
      options.push([i, j]);
    }
  }
  for (var n = 0; n < totalBombs; n++){
    var index = floor(random(options.length));
    var choice = options[index];
    grid[choice[0]][choice[1]].bomb = true;
    options.splice(index, 1);
  }

  for (var i = 0; i < cols; i++){
    for (var j = 0; j < cols; j++){
      grid[i][j].countNeighborBombs();
    }
  }
}

function mousePressed(){
  mousePressedCounterBoolean = true;
}

function mouseReleased(){
  mousePressedCounterBoolean = false;
  if (mousePressedCounter / frameRate() > 0.5){
    for (var i = 0; i < cols; i++){
      for (var j = 0; j < cols; j++){
        if (grid[i][j].contains(mouseX, mouseY)){
          if (!grid[i][j].flagged){
            grid[i][j].flagged = true;
            checkGameWin();
          } else {
            grid[i][j].flagged = false;
            checkGameWin();
          }
        }
      }
    }
  } else {
    for (var i = 0; i < cols; i++){
      for (var j = 0; j < cols; j++){
        if (grid[i][j].contains(mouseX, mouseY)){
          if (!grid[i][j].flagged){
            grid[i][j].reveal();
            if (grid[i][j].bomb){
              gameOver();
            }
          }
          checkGameWin();
        }
      }
    }
  }
  mousePressedCounter = 0;
}

function gameOver(){
  for (var i = 0; i < cols; i++){
    for (var j = 0; j < cols; j++){
      grid[i][j].reveal();
    }
  }
  game_over = true;
  createElement('br');
  createElement('br');
  createButton('Play Again!').mousePressed(function(){
    window.location.reload();
  });
}

function checkGameWin(){
  var flaggedCells = 0;
  var revealedCells = 0;
  for (var i = 0; i < cols; i++){
    for (var j = 0; j < cols; j++){
      if (grid[i][j].flagged){
        flaggedCells++;
      } else if (grid[i][j].revealed){
        revealedCells++;
      }
    }
  }
  if (flaggedCells + revealedCells == rows * cols && flaggedCells == totalBombs){
    game_win = true;
    createElement('br');
    createElement('br');
    createButton('Play Again!').mousePressed(function(){
      window.location.reload();
    });
  }
}

function draw() {
  background(255);
  if (mousePressedCounterBoolean){
    mousePressedCounter++;
  }
  for (var i = 0; i < cols; i++){
    for (var j = 0; j < cols; j++){
      grid[i][j].show();
    }
  }
  if (game_over){
    stroke(255, 0, 0);
    fill(255, 0, 0);
    textSize(20);
    text('Game Over', width / 2, height / 2);
    noLoop();
  } else if (game_win){
    stroke(0, 255, 0);
    fill(0, 255, 0);
    textSize(20);
    text('You win!', width / 2, height / 2);
    noLoop();
  }
}
