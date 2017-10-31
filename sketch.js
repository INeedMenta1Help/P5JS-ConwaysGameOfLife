var cols;
var rows;
var w = 20;

var frameSlider;

var drawing = false;
var killing = false;
var running = false;

var gen = 0;
var lcells = 0;

var cells = [];
var saveArray = [];

function preload() {
  soundFormats('mp3', 'ogg');
  myMusic = loadSound('assets/backgroundMusic.mp3');
}

function setup() {
  myMusic.setVolume(0,1);
  myMusic.play();
  createCanvas(window.innerWidth,window.innerHeight);

  cols = floor(width/w);
  rows = floor(height/w);

	for (var i = 0; i < cols; i++) {
    cells.push([]);
    for (var j = 0; j < rows; j++) {
      var cell = new Cell(i, j);
      cells[i].push(cell);
    }
  }

  frameSlider = createSlider(1, 60, 15, 1);
  frameSlider.position(10, 40)
}

function draw() {
  background(0);
  fill(0);

	for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
  		cells[i][j].draw();
  		//cells[i].rand();
  		if (cells[i][j].alive) {
  			cells[i][j].counter -= 10;
      }
		}
	}

	//hover
	if(drawing) {
		for (var i = 0; i < cells.length; i++) {
      for (var j = 0; j < cells[i].length; j++) {
  			if (mouseX >= cells[i][j].x
  				&& mouseX <= cells[i][j].x + w
  				&& mouseY >= cells[i][j].y
  				&& mouseY <= cells[i][j].y + w) {
  					cells[i][j].alive = true;
  					cells[i][j].counter = 255;
  					cells[i][j].colour = random(255);
        }
			}
		}
	}
  if(killing) {
		for (var i = 0; i < cells.length; i++) {
      for (var j = 0; j < cells[i].length; j++) {
  			if (mouseX >= cells[i][j].x
  				&& mouseX <= cells[i][j].x + w
  				&& mouseY >= cells[i][j].y
  				&& mouseY <= cells[i][j].y + w) {
  					cells[i][j].alive = false;
  					cells[i][j].counter = 255;
  					cells[i][j].colour = random(255);
        }
			}
		}
	}
  if (running) {
    run();
    frameRate(frameSlider.value());
    gen++;
  }  else {
    frameRate(60);
  }
  fill(255);
  textSize(32);
  text("Generation:", 10, 35);
  text(gen, 180, 37);

  text("Live Cells:", width - 210, 35);

  lcells = 0;
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      if (cells[i][j].alive) {
        lcells += 1;
      }
    }
  }
  text(lcells, width - 60, 37);
}

function Cell(i, j) {
  this.n = 0;
	this.colour = random(255);
	this.counter = 255;
  this.x = i * w - 1;
  this.y = j * w - 1;
  this.alive = false;
  this.balive = false;

	this.draw = function() {
		noFill();
	  stroke(255, 50);

	  if (this.alive) {
			fill(0,0,255);
	  } else if (this.balive) {
      fill(0,50,0);
    } else {
      fill(0);
    }
	  rect(this.x, this.y, w, w);
	}
/*
	this.rand = function() {
		if (random(10000) <= 1) {
			this.alive = true;
		}
	}
*/
}

function mousePressed() {
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      if (mouseX >= cells[i][j].x
        && mouseX <= cells[i][j].x + w
        && mouseY >= cells[i][j].y
        && mouseY <= cells[i][j].y + w) {
        if (cells[i][j].alive) {
          killing = true;
        } else {
          drawing = true;
        }
      }
    }
  }
}

function mouseReleased() {
	drawing = false;
  killing = false;
}

function keyPressed() {
  if (keyCode === CONTROL) {
    running = !running;
  }
  if (!running && keyCode === SHIFT) {
    run();
    gen++;
  }
  /*
  if (!running && keyCode === UP_ARROW) {
    // Object.create(every cell) and push to saveArray
    for (var i = 0; i < cols; i++) {
      var row = [];
      for (var j = 0; j < rows; j++) {
        row.push(Object.create(cells[i][j]));
      }
      saveArray.push(row);
    }
    console.log('save');
  }
  if (!running && keyCode === DOWN_ARROW) {
    cells = saveArray;
    console.log('load')
  }
  */
}

function run() {
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      cells[i][j].n = 0;

      //top left
      if (i - 1 >= 0 && j - 1 >= 0) {
        if (cells[i-1][j-1].alive) {
          cells[i][j].n += 1;
        }
      }

      //top right
      if (i - 1 >= 0 && j + 1 < cells[i].length) {
        if (cells[i-1][j+1].alive) {
          cells[i][j].n += 1;
        }
      }

      //bottom left
      if (i + 1 < cells.length && j - 1 >= 0) {
        if (cells[i+1][j-1].alive) {
          cells[i][j].n += 1;
        }
      }

      //bottom right
      if (i + 1 < cells.length && j + 1 < cells[i].length) {
        if (cells[i+1][j+1].alive) {
          cells[i][j].n += 1;
        }
      }

      //top
      if (i - 1 >= 0) {
        if (cells[i-1][j].alive) {
          cells[i][j].n += 1;
        }
      }

      //bottom
      if (i + 1 < cells.length) {
        if (cells[i+1][j].alive) {
          cells[i][j].n += 1;
        }
      }

      //left
      if (j - 1 >= 0) {
        if (cells[i][j-1].alive) {
          cells[i][j].n += 1;
        }
      }

      //right
      if (j + 1 < cells[i].length) {
        if (cells[i][j+1].alive) {
          cells[i][j].n += 1;
        }
      }
    }
  }
  for (var i = 0; i < cells.length; i++) {
    for (var j = 0; j < cells[i].length; j++) {
      if (cells[i][j].alive) {
        //game of life
        if (cells[i][j].n == 2 || cells[i][j].n == 3) {
          cells[i][j].alive = true;
          cells[i][j].balive = true;
        } else {
          cells[i][j].alive = false;
        }
      } else if (cells[i][j].n == 3) {
          cells[i][j].alive = true;
          cells[i][j].balive = true;
        } else {
          cells[i][j].alive = false;
      }
    }
  }
}
