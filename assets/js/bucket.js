const B_SIZE = 70;
const HALF_B_SIZE = B_SIZE / 2;

var basket; // player
var orbs = []; // falling Balls

var score;

var isStarted = false;

var img;
var imgs = [];
function preload() {
  img = loadImage("https://maxomeuniverse.github.io/assets/img/emotes_56/crane_56.png");
  
  imgs[0] = loadImage("https://maxomeuniverse.github.io/assets/img/emotes_56/crane_56.png");
  imgs[1] = loadImage("https://maxomeuniverse.github.io/assets/img/emotes_56/moulaxome_56.png");
  imgs[2] = loadImage("https://maxomeuniverse.github.io/assets/img/emotes_56/maxome_enerve_56.png");
}

function loadStarting(){
  let urlParams = new URLSearchParams(window.location.search);
  console.log(urlParams);

  if(window.location.search == ""){ // If no parameters in the url      
      return; // stop here
  }
  
  // TODO do it better checking the real value of start parameter
  isStarted = true;

}

function setup() {

  createCanvas(400, 600);

  loadStarting();

  basket = new Basket(width / 2, height - B_SIZE);

  score = 0;
  textAlign(CENTER);

  // Create a button and place it beneath the canvas.
  let button = document.querySelector("#button");
  //button.position(0, 100);
  button.addEventListener("click", function(event){
    if(isStarted){
      window.open("https://maxomeuniverse.github.io/rain?start=true", '_self');
      return;
    }

    isStarted = true;
  });

}

function draw() {

    background(51);

    if(isStarted){
        handleOrbs();
        attemptNewOrb(frameCount);
        
        basket.update(mouseX);
        basket.draw();
        
        drawScore();
    }
}

/**
 * updates & draws Balls in orbs array
 * handles catching
 * triggers endGame
 */
function handleOrbs() {

	for (var i = orbs.length - 1; i >= 0; i--) {
		// loop through all orbs

    if (orbs[i].onScreen) {

			/* update & draw */
      orbs[i].update();
      orbs[i].draw();

      if (orbs[i].caughtBy(basket)) {
				// we've caught the orb

        score += 1;
        orbs.splice(i, 1);
      }

    } else {
			// Ball has gone off-screen

      endGame();
    }
  }
}

/**
 * attempts to push a new Ball to the
 * orbs array
 */
function attemptNewOrb(frame) {

	if (frame % 20 === 0) { // every 1/3 second

		var chance = map(score, 0, 100, 0.25, 0.99);
		if (random() < chance) {
			// push to the orbs array

			/* build Ball */
			var color = randomColor();
			var size = random(20) + 10;
			var velocity = random(3) + 3;

			var orb = new Ball(random(width), 0, size, velocity);
			orbs.push(orb);
		}
	}
}

/**
 * draws the player's score
 */
function drawScore() {

	textSize(40);
    noStroke();
    fill(255);
    document.getElementById("score").innerText = score;
    //text(score, width / 2, 50);
}

/**
 * ends the loop, draws game over message
 */
function endGame() {

  noLoop();
  textSize(60);
  noStroke();
  fill(255);
  text("Ruined ! :) \n Tu avais "+score+"£", width / 2, height / 2);
  score = "rien";
  drawScore();
}

/**
 * returns a random color
 */
function randomColor() {

  return color(random(255), random(255), random(255));
}

// ##################################################################
// ####   BASKET                                                  ###
// ##################################################################

function Basket(x, y) {

	this.position = createVector(x, y);

}

Basket.prototype.update = function(x) {

	this.position.x = constrain(x, 0, width);
};

/**
 * draws the Basket
 */
Basket.prototype.draw = function() {

	/* calculate coordinates */
	var leftX = this.position.x - HALF_B_SIZE; // left-most X
	var rightX = this.position.x + HALF_B_SIZE; // right-most X

	var bottomY = this.position.y - HALF_B_SIZE; // bottom-most Y
	var topY = this.position.y + HALF_B_SIZE; // top-most Y

	/* contents */
	noStroke();
	rect(leftX, this.position.y, B_SIZE, HALF_B_SIZE);

	stroke(255);
	strokeWeight(3);
	noFill();

	/* walls */
	beginShape();
	vertex(leftX, bottomY);
	vertex(leftX, topY);
	vertex(rightX, topY);
	vertex(rightX, bottomY);
	endShape();
};

// ##################################################################
// ####   BALL                                                    ###
// ##################################################################


function Ball(x, y, size, velocity) {

    this.position = createVector(x, y);
    this.velocity = velocity;
  
    this.size = size;
  
    this.onScreen = true;

    this.masked = null;
  }
  
  /**
   * draws the Ball
   */
  Ball.prototype.draw = function() {
  
    stroke(255);
    strokeWeight(3);
  
    //ellipse(this.position.x, this.position.y, this.size);
    //image(imgs[random(3)], this.position.x, this.position.y);
    image(imgs[1], this.position.x, this.position.y);
  };
  
  /**
   * handles position & onScreen values
   */
  Ball.prototype.update = function() {
  
    this.position.y += this.velocity;
  
    this.onScreen = (this.position.y < height);
  };
  
  /**
   * returns whether or not the Ball is
   * caught by passed Basket
   */
  Ball.prototype.caughtBy = function(basket) {
  
    var leftX = basket.position.x - HALF_B_SIZE*1.5; 
    var rightX = basket.position.x + HALF_B_SIZE*1.5; 
  
    var topY = basket.position.y + HALF_B_SIZE; 
  
    return !(this.position.x < leftX || this.position.x > rightX ||
      this.position.y < (basket.position.y - HALF_B_SIZE) || this.position.y > topY);
  };

// Thanks to Kaelinator for inspiration / made by Maxome_
  