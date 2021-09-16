var canvas = document.getElementById('myCanvas');
var context = canvas.getContext('2d');

/*
Draws a dice on the canvas from point (x, y) on a 
canvas to its size, with the dice number specified.
todo: fix scaling, add switch statement to for dice number
! the red surrounding is the size of the dice, this needs to be removed later
*/
function Draw_Dice( x,  y,  size, number) {
    context.strokeStyle = "red";
    context.lineWidth = 1;
    context.beginPath();
    context.moveTo(x,y);
    context.lineTo(x,y + size);
    context.lineTo(x + size,y + size);
    context.lineTo(x + size,y);
    context.lineTo(x,y);
    context.stroke();
    //Draw outer dice
    context.strokeStyle = "black"; 
    context.lineWidth = Math.sqrt(size)/5;
    var diceScale = size/4;
    context.beginPath();
    context.arc(x + diceScale, y + diceScale, diceScale,  -Math.PI , -Math.PI / 2, false);
    context.arc(x + size - diceScale, y + diceScale, diceScale,  -Math.PI / 2, 0, false);
    context.arc(x + size - diceScale, y + size - diceScale, diceScale, 0, Math.PI / 2, false);
    context.arc(x + diceScale, y + size - diceScale, diceScale, Math.PI / 2, - Math.PI, false);
    context.closePath();
    context.stroke();
}

Draw_Dice(100,100,50);
