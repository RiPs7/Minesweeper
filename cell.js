function Cell(i, j, w){
  this.bomb = false;
  this.revealed = false;
  this.i = i;
  this.j = j;
  this.x = i * w;
  this.y = j * w;
  this.w = w;
  this.neighborBombs = 0;
  this.icon = undefined;
}

Cell.prototype.show = function(){
  stroke(0);
  noFill();
  rect(this.x, this.y, this.w, this.w);

  if (this.revealed){
    if (this.bomb){
      //fill(127);
      //ellipse(this.x + this.w / 2, this.y + this.w / 2, this.w * 0.5)
      image(this.icon, this.x, this.y, this.w, this.w);
    } else {
      fill(200);
      rect(this.x, this.y, this.w, this.w);
      if (this.neighborBombs > 0){
        textAlign(CENTER);
        fill(0);
        text(this.neighborBombs, this.x + this.w / 2, this.y + this.w / 2 + 5);
      }
    }
  }
}

Cell.prototype.contains = function(x, y){
  return ((x > this.x && x < this.x + this.w) && (y > this.y && y < this.y + this.w));
}

Cell.prototype.reveal = function(){
  this.revealed = true;
  if (this.neighborBombs == 0){
    for (var xoff = -1; xoff <= 1; xoff++){
      for (var yoff = -1; yoff <=1 ; yoff++){
        var i = this.i + xoff;
        var j = this.j + yoff;
        if (i >= 0 && i < cols && j >= 0 && j < rows){
          var neighbor = grid[i][j];
          if (!neighbor.bomb && !neighbor.revealed){
            neighbor.reveal();
          }
        }
      }
    }
  }
}

Cell.prototype.countNeighborBombs = function(){
  if (this.bomb){
    this.neighborBombs = -1;
  } else {
    var total = 0;
    for (var xoff = -1; xoff <= 1; xoff++){
      for (var yoff = -1; yoff <=1 ; yoff++){
        var i = this.i + xoff;
        var j = this.j + yoff;
        if (i >= 0 && i < cols && j >= 0 && j < rows){
          var neighbor = grid[i][j];
          if (neighbor.bomb){
            total++;
          }
        }
      }
    }
    this.neighborBombs = total;
  }
}
