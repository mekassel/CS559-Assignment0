var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

var colors = ["red","orange","yellow","green","blue","purple"]

var frameCount = 0;
var scene = 1;

/*
Draws a circle on the canvas of a set size
*/
function drawCircle(x, y, size, fill){
    context.moveTo(x, y);
    context.arc(x, y, size, Math.PI, 0);
    context.arc(x, y, size, 0, Math.PI);
}

/*
Draws a dice on the canvas from point (x, y) on a 
canvas to its size, with the dice number specified.
The color of the dice number can 
*/
function drawDice( x,  y,  size, number, color) {
    //Draw outer dice
    context.strokeStyle = "black"; 
    context.lineWidth = Math.sqrt(size)/5;
    var diceScale = size/4;
    var circleSize = diceScale/3;
    context.beginPath();
    context.arc(x + diceScale, y + diceScale, diceScale,  -Math.PI , -Math.PI / 2, false);
    context.arc(x + size - diceScale, y + diceScale, diceScale,  -Math.PI / 2, 0, false);
    context.arc(x + size - diceScale, y + size - diceScale, diceScale, 0, Math.PI / 2, false);
    context.arc(x + diceScale, y + size - diceScale, diceScale, Math.PI / 2, - Math.PI, false);
    context.closePath();
    context.stroke();
    //Draw numbers on dice
    context.strokeStyle = "black"; 
    context.fillStyle = color;
    context.lineWidth = Math.sqrt(size)/10;
    
    context.beginPath();
    switch(number) {
        case 1: 
            drawCircle(x + size/2, y + size/2, circleSize);
            break;
        case 2: 
            drawCircle(x + size/10 * 7, y + size/10 * 7, circleSize);
            drawCircle(x + size/10 * 3, y + size/10 * 3, circleSize);
            break;
        case 3: 
            drawCircle(x + size/10 * 8, y + size/10 * 2, circleSize);
            drawCircle(x + size/10 * 5, y + size/10 * 5, circleSize);
            drawCircle(x + size/10 * 2, y + size/10 * 8, circleSize);
            break;
        case 4: 
            drawCircle(x + size/4, y + size/4, circleSize);
            drawCircle(x + size/4 * 3, y + size/4, circleSize);
            drawCircle(x + size/4, y + size/4 * 3, circleSize);
            drawCircle(x + size/4 * 3, y + size/4 * 3, circleSize);
            break;
        case 5: 
            drawCircle(x + size/4, y + size/4, circleSize);
            drawCircle(x + size/4 * 3, y + size/4, circleSize);
            drawCircle(x + size/4, y + size/4 * 3, circleSize);
            drawCircle(x + size/4 * 3, y + size/4 * 3, circleSize);
            drawCircle(x + size/2, y + size/2, circleSize);
            break;
        case 6: 
            for(var i = 1; i < 4; i++) {
                drawCircle(x + size/4, y + (size/10) * (3 * i - 1), circleSize);
                drawCircle(x + size/4 * 3, y + (size/10) * (3 * i - 1), circleSize);
            }
            break;
    }
    context.stroke();
    context.fill();  
}  

/*
* Draw the dice background!
*/
function drawChangingDiceBackground(){
    for(var i = 0; i < 6; i++) {
        for(var j = 0; j < 6; j++)
            drawDice(i*canvas.width/6,j * canvas.width/6,canvas.width/6,(frameCount+j+i)%6+1, colors[(j+i)%6]);
    }
}

function drawFirstScene(){

}

function draw(){
     context.clearRect(0,0,canvas.width,canvas.height);
     switch(scene) {
         case 0:
            drawChangingDiceBackground();
        break;
         case 1:
            drawChangingDiceBackground();
        break;
     }
    frameCount++;
}

setInterval(draw, 200);
