var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

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

//Constants:
const targetFrameRate = 10; //Framerate in HZ [ms per frame = targetFrameRate/1000 ms]
const physicsUpdateRate = 100; //Physics update rate in HZ [ms per physics update = physicsUpdateRate/1000 ms]
const colors = ["red", "orange", "green", "blue", "purple"] //Possible colors
const scale = 20; //The scale of the cubes (length of cube in pixels)
const startXBoard = 20; 
const startYBoard = 30;
const boardRows = 24;
const boardCols = 10;
const helpingHeight = 3; //The amount of squares that can be climbed if the player wants to move.

var board = new Array(boardRows);
for (var i = 0; i < boardRows; i++) {
    board[i] = new Array(boardCols);
    for (var j = 0; j < boardCols; j++) {
        board[i][j] = -1;
    }
}

var frameCount = 0;
var physicsUpdateCount = 0;
var currentHeight = 0;
var currentPose = boardCols / 2;
var currentPhysicsUpdates = 0;
var updateSpeed = 40; //Physics frames per update. 
var lastPosition = [-1, -1];
var settledUpdates = 0; //Updates where you can't moved
var maximumSettledUpdates = 30;
var movingShape = Shape.getRandom();
var nextShape = Shape.getRandom();





function setColor(color) {
    context.strokeStyle = colors[color];
    context.fillStyle = colors[color];
}

function drawGrid(x, y, height, width) {
    context.beginPath();
    context.strokeStyle = "black";
    context.lineWidth = 2;
    for (var i = 0; i < width + 1; i++) {
        context.moveTo(x + (i * scale), y);
        context.lineTo(x + (i * scale), y + height * scale);
    }
    for (var i = 0; i < height + 1; i++) {
        context.moveTo(x, y + (i * scale));
        context.lineTo(x + width * scale, y + (i * scale));
    }
    context.stroke();
}

function drawSquare(x, y) {
    context.beginPath();
    context.moveTo(x, y);
    context.lineTo(x + scale, y);
    context.lineTo(x + scale, y + scale);
    context.lineTo(x, y + scale);
    context.closePath();
    context.fill();
    context.stroke();
}

function drawBoard() {
    for (var row = 0; row < boardRows; row++) {
        for (var col = 0; col < boardCols; col++) {
            if (board[row][col] != -1) {
                setColor(board[row][col]);
                drawSquare(startXBoard + col * scale, startYBoard + row * scale);
            }
        }
    }
    drawGrid(startXBoard, startYBoard, boardRows, boardCols, scale);
}

function drawBackground() {

}

function drawNextShape() {
    context.fillStyle = "grey";
    context.beginPath();
    context.moveTo(230,165);
    context.lineTo(230,300);
    context.lineTo(340,300);
    context.lineTo(340,165);
    context.closePath();
    context.fill();
    context.stroke();
    context.lineTo(230,190);
    context.lineTo(340,190);
    context.fill();
    context.stroke();
    context.fillStyle = "red";
    context.font = '20px Arial';
    context.textAlign = "center";
    context.fillText('Next Piece:', 285, 185);
    nextShape.drawShape(230 + (110-nextShape.width*scale)/2,190 + (110-nextShape.height*scale)/2);
}

function drawBackground(){
    //Clear screen
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = "#AAAAAA";
    context.beginPath();
    context.moveTo(0,0);
    context.lineTo(canvas.width,0);
    context.lineTo(canvas.width,canvas.height);
    context.lineTo(0,canvas.height);
    context.closePath();
    context.fill();
    context.stroke();
}

function draw() {
    

    drawBackground();
    drawNextShape();
    movingShape.drawShape(startXBoard + currentPose * scale, startYBoard + (currentHeight * scale));
    drawBoard();
    //movingShape.rotateLeft();

    frameCount++;
}

function canMove(shape, x, y) {
    if (y + shape.height > boardRows)
        return false;
    for (var i = 0; i < movingShape.getSquares().length; i++) {
        if(movingShape.getSquares()[i][1] + y >= boardRows || movingShape.getSquares()[i][0] + x >= boardCols)
            return false;
        if(movingShape.getSquares()[i][1] + y < 0 || movingShape.getSquares()[i][0] + x < 0)
            return false;
        if (board[movingShape.getSquares()[i][1] + y][movingShape.getSquares()[i][0] + x] != -1) {
            return false;
        }
    }
    return true;
}

function setShape(shape) {
    for (var i = 0; i < shape.getSquares().length; i++) {
        board[shape.getSquares()[i][1] + currentHeight][shape.getSquares()[i][0] + currentPose] = shape.color;
    }
}

function updateSliderMaxValue() {
    var max = boardCols - movingShape.width;
    //Set the sliders maximum value to 10 - the width of the moving shape.
    //This ensures that the user cannot put the piece off of the board.
    //Found how to set attribute here: 
    //http://help.dottoro.com/ljgaxrgj.php
    slider1.setAttribute("max", max);
    if (currentPose > max) {
        currentPose = max;
    }
}

function checkForFullLine() {
    var rowsToClear = new Array();
    for (var row = 0; row < boardRows; row++) {
        for (var col = 0; col < boardCols; col++) {
            if (board[row][col] == -1)
                break;
            if (col == boardCols - 1) {
                rowsToClear.push(row);
                console.log("Row to clear!");
            }
        }
    }
    if (rowsToClear.length == 0)
        return;
    board.splice(rowsToClear[0], rowsToClear.length);
    for (var i = 0; i < rowsToClear.length; i++) {
        board.unshift(new Array(boardCols));
        for (var j = 0; j < boardCols; j++) {
            board[0][j] = -1;
        }
    }

    if (updateSpeed > 30) {
        updateSpeed -= rowsToClear.length * 1;
    } else if (updateSpeed > 20) {
        updateSpeed -= rowsToClear.length * 0.4;
    } else if (updateSpeed > 10) {
        updateSpeed -= rowsToClear.length * 0.2;
    } else if (updateSpeed > 4) {
        updateSpeed -= rowsToClear.length * 0.1;
    }
}

function dropShape() {
    setShape(movingShape);
    checkForFullLine();
    movingShape = nextShape;
    nextShape =  Shape.getRandom();
    updateSliderMaxValue();
    currentHeight = 0;
    if (!canMove(movingShape, currentPose, currentHeight)) {
        console.log("GameOver");
    }

}

function fixedUpdate() {
    //move sideways using slider, if possible, can move up one or two sides. 
    if (canMove(movingShape, parseInt(slider1.value), currentHeight)) {
        currentPose = parseInt(slider1.value);
    } else if(canMove(movingShape, parseInt(slider1.value), currentHeight-1)) {
 currentPose = parseInt(slider1.value);
 currentHeight -= 1;
    }

    if (currentPhysicsUpdates >= updateSpeed) {
        currentPhysicsUpdates = 0;

        //Check if you can not move down
        if (!canMove(movingShape, currentPose, currentHeight + 1)) {
            if(settledUpdates > maximumSettledUpdates) {
                dropShape();
            }
            settledUpdates++;
        } else {
            settledUpdates = 0;
            currentHeight++;
        }




    }



    physicsUpdateCount++;
    currentPhysicsUpdates++;
}

function rotateLeft() {
   var width = movingShape.width;
    movingShape.rotateLeft();
    currentPose = Math.min(boardCols - movingShape.width, width);
    if (!canMove(movingShape, currentPose, currentHeight)) {
        for(var i = 1; i < helpingHeight; i++) {
            if(currentHeight - i < 0)
                break;
            if(canMove(movingShape, currentPose, currentHeight-i)) {
                currentHeight = currentHeight-i;
                updateSliderMaxValue();
                return;
            }
        }
        movingShape.rotateRight();
    }
    updateSliderMaxValue();
}

function rotateRight() {
    var width = movingShape.width;
    movingShape.rotateRight();
    currentPose = Math.min(boardCols - movingShape.width, width);
    if (!canMove(movingShape, currentPose, currentHeight)) {
        for(var i = 1; i < helpingHeight; i++) {
            if(currentHeight - i < 0)
                break;
            if(canMove(movingShape, currentPose, currentHeight-i)) {
                currentHeight = currentHeight-i;
                updateSliderMaxValue();
                return;
            }
        }
        movingShape.rotateLeft();
    }
    updateSliderMaxValue();
}

function drop() {
    while (canMove(movingShape, currentPose, currentHeight + 1)) {
        currentHeight++;
    }
    dropShape();
}



updateSliderMaxValue();
setInterval(fixedUpdate, targetFrameRate/1000);
setInterval(draw, physicsUpdateRate/1000);
leftButton.addEventListener('click', rotateLeft);
rightButton.addEventListener('click', rotateRight);
dropButton.addEventListener('click', drop);