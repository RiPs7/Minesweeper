function make2DArray(cols, rows){
  var arr = new Array(cols);
  for (var i = 0; i < arr.length; i++){
    arr[i] = new Array(rows);
  }
  return arr;
}

var grid, cols, rows, w = 40;
var totalBombs = 10;
var bombIcon;
var game_over = false;
var game_win = false;

function preload(){
  bombIcon = loadImage('bomb.png');
}

function setup() {
  createCanvas(401, 401);

  cols = floor(width / w);
  rows = floor(height / w);
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
    grid[choice[0]][choice[1]].icon = bombIcon;
    options.splice(index, 1);
  }

  for (var i = 0; i < cols; i++){
    for (var j = 0; j < cols; j++){
      grid[i][j].countNeighborBombs();
    }
  }
}

function mousePressed(){
  for (var i = 0; i < cols; i++){
    for (var j = 0; j < cols; j++){
      if (grid[i][j].contains(mouseX, mouseY)){
        grid[i][j].reveal();
        if (grid[i][j].bomb){
          gameOver();
        } else {
          checkGameWin();
        }
      }
    }
  }
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
  var revealedCells = 0;
  for (var i = 0; i < cols; i++){
    for (var j = 0; j < cols; j++){
      if (grid[i][j].revealed){
        revealedCells++;
      }
    }
  }
  if (revealedCells + totalBombs == rows * cols){
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
