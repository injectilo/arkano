var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var canvasX = window.innerWidth;
var canvasY = window.innerHeight;
var centerX = window.innerWidth / 2;
var centerY = window.innerHeight / 2;

var balls = [];
var ball;
var floor;

var record;

if(window.localStorage.getItem("record") !== "undefined") {
  record = window.localStorage.getItem("record");
} else {
  record = 0;
} 

function randomRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resizeCanvas() {
	canvasX = window.innerWidth;
	canvasY = window.innerHeight;
	pixelsize = canvasY *.1;
  canvas.width = window.innerWidth - 5;
  canvas.height = window.innerHeight - 5;
  centerX = window.innerWidth/2;
	centerY = window.innerHeight/2;
}


function init() {
  createBall();
  ball.draw();
  text();
  createFloor();
}


function text() {
  /* record */
  ctx.textAlign = 'left';
  ctx.fillStyle = "white";
  ctx.font="1vw 'Press Start 2P'";
  ctx.fillText("Record " + record, 10, 50); 
  ctx.fill();
  /* actual score */
  ctx.textAlign = 'center';
  ctx.fillStyle = "white";
  ctx.font="3vw 'Press Start 2P'";
  ctx.fillText( balls.length, centerX-10, 200); 
  ctx.fill();
}

function createFloor() {
  floor = {
    sizeX : 300,
    sizeY : 20,
    posX : 300,
    posY : (canvasY -100),
    color : "white",
    draw: function() {
      ctx.beginPath(); 
      ctx.rect(this.posX,this.posY,this.sizeX,this.sizeY);
      ctx.fillStyle ="white";
      ctx.fill();
      ctx.closePath();
    }
  }
    
}

function floorMove(evt) {
  if((evt.clientX ) < (canvasX)) {
    floor.posX = (evt.clientX - (floor.sizeX / 2));
  }
}


function createBall() {
  ball = {
    posX : randomRange(10, (canvasX-100)),
    posY : randomRange(100, 400),
    radius : 10,
    color : "white",
    velocityX : 9, 
    velocityY : 9,
    draw : function() {
      /* ball */
      ctx.beginPath();
      ctx.arc(this.posX, this.posY, this.radius, 0, 2 * Math.PI, false);
      ctx.fillStyle = this.color;
      ctx.fill();
      ctx.closePath();
    }

  }

  balls.push(ball);
}


function render() {

  ctx.clearRect(0,0,canvasX,canvasY);
  text();
  floor.draw();

  for(var b in balls) {
    balls[b].draw();
    /* roof and walls collision */
    if(balls[b].posX < 0 || balls[b].posX > canvasX){
      balls[b].velocityX *= -1; 
    }
    if(balls[b].posY <= 0 ) {
      balls[b].velocityY *= -1; 
    }

    if(balls[b].posY > canvasY) {
      //out of screen
    if(floor.sizeX > 150) {
      floor.sizeX +=  balls.length;
     }
      balls.splice(b,1);

    }

    /* floor collision */
    if(balls[b].posX > floor.posX && balls[b].posX < (floor.posX + floor.sizeX) && balls[b].posY > floor.posY && (balls[b].posY - 10) < (floor.posY) ) {
      balls[b].velocityY *= -1;
      createBall();
      if(floor.sizeX < 600) {
        floor.sizeX +=  balls.length;
      }
      
    }

    balls[b].posX += balls[b].velocityX; 
    balls[b].posY += balls[b].velocityY; 
  }

  total = balls.length
  if(total >= record) {
    record = total;
    window.localStorage.setItem("record", record);
  }

}

window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();

resizeCanvas();
init();

(function animloop(){
  requestAnimFrame(animloop);
  render();
})();

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", function(evt){
  floorMove(evt)
});
