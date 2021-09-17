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
function drawDice( x,  y,  size, number, color, rotation, centered = false) {
    if(!centered) {
       context.translate(size/2,size/2); 
    }
    context.translate(x,y);
    context.rotate(rotation);
    context.translate(-size/2, - size/2);
    //Draw outer dice
    context.strokeStyle = "black"; 
    context.lineWidth = Math.sqrt(size)/5;
    var diceScale = size/4;
    var circleSize = diceScale/3;
    context.beginPath();
    context.arc(diceScale, diceScale, diceScale,  -Math.PI , -Math.PI / 2, false);
    context.arc(size - diceScale, diceScale, diceScale,  -Math.PI / 2, 0, false);
    context.arc(size - diceScale, size - diceScale, diceScale, 0, Math.PI / 2, false);
    context.arc(diceScale, size - diceScale, diceScale, Math.PI / 2, - Math.PI, false);
    context.closePath();
    context.stroke();
    //Draw numbers on dice
    context.strokeStyle = "black"; 
    context.fillStyle = color;
    context.lineWidth = Math.sqrt(size)/10;
    
    context.beginPath();
    switch(number) {
        case 1: 
            drawCircle(size/2, size/2, circleSize);
            break;
        case 2: 
            drawCircle(size/10 * 7, size/10 * 7, circleSize);
            drawCircle(size/10 * 3, size/10 * 3, circleSize);
            break;
        case 3: 
            drawCircle(size/10 * 8, size/10 * 2, circleSize);
            drawCircle(size/10 * 5, size/10 * 5, circleSize);
            drawCircle(size/10 * 2, size/10 * 8, circleSize);
            break;
        case 4: 
            drawCircle(size/4, size/4, circleSize);
            drawCircle(size/4 * 3, size/4, circleSize);
            drawCircle(size/4, size/4 * 3, circleSize);
            drawCircle(size/4 * 3, size/4 * 3, circleSize);
            break;
        case 5: 
            drawCircle(size/4, size/4, circleSize);
            drawCircle(size/4 * 3, size/4, circleSize);
            drawCircle(size/4, size/4 * 3, circleSize);
            drawCircle(size/4 * 3, size/4 * 3, circleSize);
            drawCircle(size/2, size/2, circleSize);
            break;
        case 6: 
            for(var i = 1; i < 4; i++) {
                drawCircle(size/4, (size/10) * (3 * i - 1), circleSize);
                drawCircle(size/4 * 3, (size/10) * (3 * i - 1), circleSize);
            }
            break;
    }
    context.stroke();
    context.fill();  
    
    context.translate(size/2, size/2);
    context.rotate(-rotation);
    context.translate(-x,-y);
    if(!centered) {
       context.translate(-size/2,-size/2); 
    }
}  

/*
* Draw the dice background!
*/
function drawChangingDiceBackground(){
    for(var i = 0; i < 6; i++) {
        for(var j = 0; j < 6; j++)
            drawDice(i*canvas.width/6,j * canvas.width/6,canvas.width/6,(frameCount+j+i)%6+1, colors[(j+i)%6],0,false);

    }
}

function drawFirstScene(){


}

function draw(){
     context.clearRect(0,0,canvas.width,canvas.height);
     switch(scene) {
         case 0:
            drawFirstScene();
        break;
         case 1:
            drawChangingDiceBackground();
        break;
     }
    frameCount++;
}

setInterval(draw, 200);
