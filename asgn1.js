var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var colors = ["red","orange","yellow","green","blue","purple"]

var frameCount = 0;
var scene = 0;
var scale = 20;
var   shapes = [
    [[0,0],[0,1],[1,0],[1,1]], //Square
    [[0,0],[1,0],[2,0],[3,0]], //Line
    [[0,0],[0,1],[0,2],[1,2]], //L shape
];
//Found how to create classes here:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Shape {

  
   constructor(type, color) {
    this.squares = shapes[type];
    this.color = color;
    this.rotateStep = false;
  }

    drawShape(x, y) {
        context.strokeStyle=this.color;
        context.fillStyle = this.color;
        for(var i = 0; i < this.squares.length;i++) {
            drawSquare(x + scale*this.squares[i][0],y + scale*this.squares[i][1]);
        }
   }

   rotateLeft() {
       if(this.rotateStep) {
            for(var i = 0; i < this.squares.length;i++) {
                var temp = this.squares[i];
                this.squares[i] = [temp[1],temp[0]];
            }
        } else {
            for(var i = 0; i < this.squares.length;i++) {
                var temp = this.squares[i];
                this.squares[i] = [2-temp[0],3-temp[1]];
            }
        }
        this.rotateStep = !this.rotateStep;
   }

   rotateRight() {

   }

   getWidth() {
       var width = 0;

   }
}

function drawGrid(x, y, height, width) {
     context.beginPath();
     context.strokeStyle = "black";
     context.lineWidth = 2;
    for(var i = 0; i < width+1; i++) {
        context.moveTo(x + (i*scale),y);
        context.lineTo(x + (i*scale),y+height*scale);
    }
    for(var i = 0; i < height+1; i++) {
        context.moveTo(x,y + (i*scale));
        context.lineTo(x+width*scale,y + (i*scale));
    }
    context.stroke();
}

function drawSquare(x, y) {
    context.beginPath(); 
    context.moveTo(x,y);
    context.lineTo(x+scale, y);
    context.lineTo(x+scale, y+scale);
    context.lineTo(x, y+scale);
    context.closePath();
    context.fill();
}

function draw(){
     context.clearRect(0,0,canvas.width,canvas.height);
    var movingShape = new Shape(2,"red");
    movingShape.drawShape(20,20);
    movingShape.rotateLeft();
    //Found how to set attribute here: 
    //http://help.dottoro.com/ljgaxrgj.php
    slider1.setAttribute ("max", 6);
    drawGrid(20,50,20,10,20);
     switch(scene) {
         case 0:
          
        break;
         case 1:
            
        break;
     }
    frameCount++;
}


setInterval(draw, 200);
