var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');



var frameCount = 0;
var physicsUpdates = 0;
var scene = 0;

const targetFrameRate = 10;
const physicsUpdateRate = 100;

//Got inspiration for shapes from:
//https://en.wikipedia.org/wiki/Tetromino
const shapes = [
    [[[0,0],[0,1],[1,0],[1,1]]], //Square
    [[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[0,3]]], //Line
    [[[0,0],[0,1],[0,2],[1,2]]], //L shape
];
const colors = ["red","orange","yellow","green","blue","purple"]
const scale = 20;
const startXBoard = 20;
const startYBoard = 20;
const boardRows = 20;
const boardCols = 10;
var board = new Array(boardCols);
for(var i = 0; i < boardCols;i++){
    board[i] = new Array(boardRows);
    for(var j = 0; j < boardRows; j++) {
        board[i][j] = -1;
    }
}
board[0][1] = 1;
board[0][2] = 2;
board[4][15] = 3;
board[8][5] = 4;

//Found how to create classes here:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Shape {
    height;
    width;
  
   constructor(type, color) {
    this.squares = shapes[type];
    this.color = color;
    this.rotationState = 0;
    this.updateWidthAndHeight();
  }


    getSquares() {
        return this.squares[this.rotationState];
    }

    drawShape(x, y) {
        setColor(this.color);
        for(var i = 0; i < this.getSquares().length;i++) {
            drawSquare(x + scale*this.getSquares()[i][0],y + scale*this.getSquares()[i][1]);
        }
   }

    updateWidthAndHeight() {
        this.width = 0;
        this.height = 0;
        for(var i = 0; i < this.getSquares().length;i++) {
            this.width = Math.max(this.width,this.getSquares()[i][0]+1);
            this.height = Math.max(this.height,this.getSquares()[i][1]+1);
        }
        return 0;
   }

   rotateLeft(){
       this.rotationState--;
        if(this.rotationState < 0) {
            this.rotationState = this.squares.length - 1;
        }
        this.updateWidthAndHeight();
   }

   rotateRight() {
       this.rotationState++;
        if(this.rotationState > this.squares.length-1) {
            this.rotationState = 0;
        }
        this.updateWidthAndHeight();
   }

  
  
}

function setColor(color){
    context.strokeStyle=color;
    context.fillStyle = color;
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

function drawBoard(){
    drawGrid(startXBoard,startYBoard,boardRows,boardCols,scale);

    for(var row = 0; row < boardRows; row++) {
        for (var col = 0; col < boardCols; col++) {
            if(board[col][row] != -1) {
                setColor(colors[board[col][row]-1])
                drawSquare(startXBoard + col * scale, startYBoard + row * scale);
            }
        }
    }
}
var movingShape = new Shape(1,"red");
function draw(){
     context.clearRect(0,0,canvas.width,canvas.height);
    console.log("UPDATE");
    movingShape.drawShape(startXBoard+slider1.value*scale,startYBoard+Math.floor(frameCount/2)*scale);
    drawBoard();
    //movingShape.rotateLeft();
    //Found how to set attribute here: 
    //http://help.dottoro.com/ljgaxrgj.php
    
    
    
     switch(scene) {
         case 0:
          
        break;
         case 1:
            
        break;
     }
    frameCount++;
}

function fixedUpdate(){
    //slider1.value = 1;
    slider1.setAttribute ("max", 10-movingShape.width);
}

function rotateLeft(){
    movingShape.rotateLeft();
}
function rotateRight(){
    movingShape.rotateLeft();
}
setInterval(fixedUpdate, 10);
setInterval(draw, 200);
leftButton.addEventListener('click', rotateLeft);
rightButton.addEventListener('click', rotateRight);