//Found how to create classes here:
//https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes
class Shape {
    height;
    width;

    constructor(type, color, rotationState) {
        this.squares = shapes[type];
        this.color = color;
        this.rotationState = rotationState % 4;
        this.updateWidthAndHeight();
    }

    static getRandom() {
       return new Shape(parseInt(Math.random() * shapes.length), parseInt(Math.random() * colors.length), 0)
    }


    getSquares() {
        return this.squares[this.rotationState];
    }

    drawShape(x, y) {
        setColor(this.color);
        for (var i = 0; i < this.getSquares().length; i++) {
            drawSquare(x + scale * this.getSquares()[i][0], y + scale * this.getSquares()[i][1]);
        }
    }

    updateWidthAndHeight() {
        this.width = 0;
        this.height = 0;
        for (var i = 0; i < this.getSquares().length; i++) {
            this.width = Math.max(this.width, this.getSquares()[i][0] + 1);
            this.height = Math.max(this.height, this.getSquares()[i][1] + 1);
        }
        return 0;
    }

    rotateLeft() {
        this.rotationState--;
        if (this.rotationState < 0) {
            this.rotationState = this.squares.length - 1;
        }
        this.updateWidthAndHeight();
    }

    rotateRight() {
        this.rotationState++;
        if (this.rotationState > this.squares.length - 1) {
            this.rotationState = 0;
        }
        this.updateWidthAndHeight();
    }
}