// Game Model - Contains all game state and logic
// ES6 Module - Pure JavaScript, no dependencies

// Utility functions (no P5.js dependencies)
function constrain(value, min, max) {
    return Math.max(min, Math.min(max, value));
}

function random(min, max) {
    if (max === undefined) {
        max = min;
        min = 0;
    }
    return Math.random() * (max - min) + min;
}

// Constants
export const BRICK_ROWS = 5;
export const BRICK_COLS = 10;
export const BRICK_WIDTH = 60;
export const BRICK_HEIGHT = 20;
export const BRICK_PADDING = 5;
export const BRICK_OFFSET_TOP = 60;
export const BRICK_OFFSET_LEFT = 30;

// Paddle class
export class Paddle {
    constructor(canvasWidth, canvasHeight) {
        this.width = 100;
        this.height = 15;
        this.x = canvasWidth / 2;
        this.y = canvasHeight - 40;
        this.canvasWidth = canvasWidth;
        this.prevX = this.x;
        this.velocity = 0;
    }
    
    moveTo(x) {
        this.prevX = this.x;
        let newX = constrain(x, this.width/2, this.canvasWidth - this.width/2);
        this.velocity = newX - this.prevX;
        this.x = newX;
    }
}

// Ball class
export class Ball {
    constructor(canvasWidth, canvasHeight) {
        this.size = 12;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.reset();
    }
    
    reset() {
        this.x = this.canvasWidth / 2;
        this.y = this.canvasHeight - 60;
        this.speedX = 0;  // Launch straight up
        this.speedY = -5;
    }
    
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off walls
        if (this.x <= this.size/2 || this.x >= this.canvasWidth - this.size/2) {
            this.speedX *= -1;
            
            // Ensure minimum horizontal speed to prevent vertical bouncing trap
            let minSpeed = 1.5;
            if (Math.abs(this.speedX) < minSpeed) {
                this.speedX = this.speedX < 0 ? -minSpeed : minSpeed;
            }
            
            // Add small random component to prevent perfectly vertical bounces
            this.speedX += random(-0.3, 0.3);
            
            // Move ball away from wall to prevent getting stuck
            if (this.x <= this.size/2) {
                this.x = this.size/2 + 1;
            } else {
                this.x = this.canvasWidth - this.size/2 - 1;
            }
        }
        
        // Bounce off top
        if (this.y <= this.size/2) {
            this.speedY *= -1;
            this.y = this.size/2 + 1;
        }
    }
    
    checkPaddle(paddle) {
        if (this.y + this.size/2 >= paddle.y - paddle.height/2 &&
            this.y - this.size/2 <= paddle.y + paddle.height/2 &&
            this.x >= paddle.x - paddle.width/2 &&
            this.x <= paddle.x + paddle.width/2) {
            
            // Bounce off paddle
            this.speedY = -Math.abs(this.speedY);  // Always bounce up
            
            // Impart paddle velocity to ball
            this.speedX += paddle.velocity * 0.5;
            
            // Limit speed
            this.speedX = constrain(this.speedX, -6, 6);
        }
    }
    
    hits(brick) {
        return (this.x + this.size/2 >= brick.x &&
                this.x - this.size/2 <= brick.x + brick.width &&
                this.y + this.size/2 >= brick.y &&
                this.y - this.size/2 <= brick.y + brick.height);
    }
    
    isOffBottom() {
        return this.y > this.canvasHeight;
    }
    
    followPaddle(paddle) {
        this.x = paddle.x;
        this.y = paddle.y - 20;
    }
}

// Brick class
export class Brick {
    constructor(x, y, brickColor) {
        this.x = x;
        this.y = y;
        this.width = BRICK_WIDTH;
        this.height = BRICK_HEIGHT;
        this.color = brickColor;
    }
}

// Game Model
export class BrickOutModel {
    constructor(canvasWidth, canvasHeight) {
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.paddle = new Paddle(canvasWidth, canvasHeight);
        this.ball = new Ball(canvasWidth, canvasHeight);
        this.bricks = [];
        this.score = 0;
        this.lives = 3;
        this.gameStarted = false;
        this.gameOver = false;
        this.gameWon = false;
        
        this.createBricks();
    }
    
    createBricks() {
        let colors = [
            { r: 255, g: 0, b: 0 },      // Red
            { r: 255, g: 127, b: 0 },    // Orange
            { r: 255, g: 255, b: 0 },    // Yellow
            { r: 0, g: 255, b: 0 },      // Green
            { r: 0, g: 0, b: 255 }       // Blue
        ];
        
        for (let row = 0; row < BRICK_ROWS; row++) {
            for (let col = 0; col < BRICK_COLS; col++) {
                let x = BRICK_OFFSET_LEFT + col * (BRICK_WIDTH + BRICK_PADDING);
                let y = BRICK_OFFSET_TOP + row * (BRICK_HEIGHT + BRICK_PADDING);
                this.bricks.push(new Brick(x, y, colors[row]));
            }
        }
    }
    
    update() {
        if (this.gameOver || this.gameWon) {
            return;
        }
        
        if (!this.gameStarted) {
            this.ball.followPaddle(this.paddle);
            return;
        }
        
        // Update ball
        this.ball.update();
        this.ball.checkPaddle(this.paddle);
        
        // Check brick collisions
        for (let i = this.bricks.length - 1; i >= 0; i--) {
            if (this.ball.hits(this.bricks[i])) {
                // Make ball bounce away from brick
                if (this.ball.speedY > 0) {
                    this.ball.speedY = -Math.abs(this.ball.speedY);
                } else {
                    this.ball.speedY = Math.abs(this.ball.speedY);
                }
                this.bricks.splice(i, 1);
                this.score += 10;
            }
        }
        
        // Check for win
        if (this.bricks.length === 0) {
            this.gameWon = true;
        }
        
        // Check if ball fell off bottom
        if (this.ball.isOffBottom()) {
            this.lives--;
            if (this.lives <= 0) {
                this.gameOver = true;
            } else {
                this.ball.reset();
                this.gameStarted = false;
            }
        }
    }
    
    // Controller methods
    movePaddle(x) {
        this.paddle.moveTo(x);
    }
    
    startGame() {
        if (!this.gameStarted && !this.gameOver && !this.gameWon) {
            this.gameStarted = true;
        } else if (this.gameOver || this.gameWon) {
            this.reset();
        }
    }
    
    reset() {
        this.score = 0;
        this.lives = 3;
        this.gameStarted = false;
        this.gameOver = false;
        this.gameWon = false;
        this.bricks = [];
        this.createBricks();
        this.ball.reset();
    }
}
