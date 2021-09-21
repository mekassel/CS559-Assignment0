var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');


const targetFrameRate = 10;
const physicsUpdateRate = 100;


//Got inspiration for shapes from:
//https://en.wikipedia.org/wiki/Tetromino
const shapes = [
    [[[0,0],[0,1],[1,0],[1,1]]], //Square
    [[[0,0],[1,0],[2,0],[3,0]],[[0,0],[0,1],[0,2],[0,3]]], //Line
    [[[0,0],[0,1],[0,2],[1,2]],[[0,0],[1,0],[2,0],[0,1]],[[0,0],[1,0],[1,1],[1,2]],[[0,1],[1,1],[2,1],[2,0]]], //L shape
    [[[1,0],[0,1],[0,2],[0,0]],[[0,0],[1,1],[2,1],[0,1]],[[0,2],[1,0],[1,1],[1,2]],[[0,0],[1,0],[2,1],[2,0]]], //J shape
    [[[1,0],[0,1],[1,1],[2,1]],[[1,0],[0,1],[1,1],[1,2]],[[0,0],[1,0],[2,0],[1,1]],[[0,0],[0,1],[0,2],[1,1]]],//T shape
    [[[1,0],[0,1],[1,1],[2,0]],[[0,0],[0,1],[1,1],[1,2]]], //S shape
    [[[0,0],[1,0],[1,1],[2,1]],[[1,0],[0,1],[1,1],[0,2]]] //Z shape
];
const colors = ["red","orange","green","blue","purple"]
const scale = 20;
const startXBoard = 20;
const startYBoard = 30;
const boardRows = 24;
const boardCols = 10;

var board = new Array(boardRows);
for(var i = 0; i < boardRows;i++){
    board[i] = new Array(boardCols);
    for(var j = 0; j < boardCols; j++) {
        board[i][j] = -1;
    }
}

var frameCount = 0;
var physicsUpdateCount = 0;
var currentHeight = 0;
var currentPose = boardCols/2;
var currentPhysicsUpdates = 0;
var updateSpeed = 40; //Physics frames per update. 

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
    context.strokeStyle = colors[color];
    context.fillStyle = colors[color];
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
    context.stroke();
}

function drawBoard(){
    for(var row = 0; row < boardRows; row++) {
        for (var col = 0; col < boardCols; col++) {
            if(board[row][col] != -1) {
                setColor(board[row][col]);
                drawSquare(startXBoard + col * scale, startYBoard + row * scale);
            }
        }
    }
    drawGrid(startXBoard,startYBoard,boardRows,boardCols,scale);
}

function draw(){
    context.clearRect(0,0,canvas.width,canvas.height);
    movingShape.drawShape(startXBoard+currentPose*scale,startYBoard+(currentHeight*scale));
    drawBoard();
    //movingShape.rotateLeft();
    
    frameCount++;
}
function canMove(shape, x, y) {
    if(currentHeight + shape.height >= boardRows)
        return false;
    for(var i = 0; i < movingShape.getSquares().length; i++) {
        if(board[movingShape.getSquares()[i][1]+y][movingShape.getSquares()[i][0]+x]!= -1) {
            return false;
        }
    }
    return true;
}
function setShape(shape) {
   for(var i = 0; i < shape.getSquares().length; i++) {
        board[shape.getSquares()[i][1]+currentHeight][shape.getSquares()[i][0]+currentPose] = shape.color;
    }
}

function updateSliderMaxValue(){
    //Set the sliders maximum value to 10 - the width of the moving shape.
    //This ensures that the user cannot put the piece off of the board.
    //Found how to set attribute here: 
    //http://help.dottoro.com/ljgaxrgj.php
    slider1.setAttribute ("max", boardCols-movingShape.width);
}

function checkForFullLine(){
    var rowsToClear = new Array();
    for(var row = 0; row < boardRows; row++) {
        for(var col = 0; col < boardCols; col++){
            if(board[row][col] == -1)
                break;
            if(col == boardCols-1){
                rowsToClear.push(row);
                console.log("Row to clear!");
            }
        }
    }
    if(rowsToClear.length == 0)
        return;
    board.splice(rowsToClear[0],rowsToClear.length);
    for(var i = 0; i < rowsToClear.length; i++) {
        board.unshift(new Array(boardCols));
        for(var j = 0; j < boardCols;j++){
            board[0][j] = -1;
        }
    }
 
    if(updateSpeed > 30){
        updateSpeed -= rowsToClear.length * 0.8;
    } else if(updateSpeed > 20) {
        updateSpeed -= rowsToClear.length * 0.4;
    } else if (updateSpeed > 10) {
        updateSpeed -= rowsToClear.length * 0.2;
    } else if (updateSpeed > 10) {
        updateSpeed -= rowsToClear.length * 0.1;
    }
}

function dropShape(){
    setShape(movingShape);
    checkForFullLine();
    movingShape = new Shape(parseInt(Math.random()*7), parseInt(Math.random()*5));
    updateSliderMaxValue();
    currentHeight = 0;
    if(!canMove(movingShape,currentPose,currentHeight)) {
        console.log("GameOver");
    }
    
}
function fixedUpdate(){
    //move sideways using slider, if possible.
    if(canMove(movingShape,parseInt(slider1.value),currentHeight)) {
        currentPose = parseInt(slider1.value);
    }

    if(currentPhysicsUpdates >= updateSpeed) {
        currentPhysicsUpdates = 0;
        
        //Check if you can not move down
        if(!canMove(movingShape,currentPose,currentHeight+1)) {
            dropShape();
        } else {
            currentHeight++;
        }

        

        
    }


    
    physicsUpdateCount++;
    currentPhysicsUpdates++;
}

function rotateLeft(){
    var width = movingShape.width;
    movingShape.rotateLeft();
    currentPose = Math.min(boardCols-movingShape.width,width);
    
    if(!canMove(movingShape,currentPose,currentHeight)) {
        movingShape.rotateRight();
    }
    updateSliderMaxValue();
}
function rotateRight(){
    var width = movingShape.width;
    movingShape.rotateRight();
    currentPose = Math.min(boardCols-movingShape.width,width);
    if(!canMove(movingShape,currentPose,currentHeight)) {
        movingShape.rotateLeft();
    }
    updateSliderMaxValue();
}

function drop(){
    while(canMove(movingShape,currentPose,currentHeight+1)){
        currentHeight++;
    }
    dropShape();
}


var movingShape = new Shape(parseInt(Math.random()*7), parseInt(Math.random()*5));
updateSliderMaxValue();
setInterval(fixedUpdate, 10);
setInterval(draw, 200);
leftButton.addEventListener('click', rotateLeft);
rightButton.addEventListener('click', rotateRight);
dropButton.addEventListener('click',drop);