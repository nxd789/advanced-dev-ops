// Unit tests for brick-out-model.js
// ES6 Module version
// Run by: 
//  node brick-out-model-test.js
//  opening brick-out-model-test.html in static server/browser
// Model is pure JavaScript with no P5.js dependencies!

console.log('Test module loading...');

import { 
    Paddle, 
    Ball, 
    Brick, 
    BrickOutModel,
    BRICK_ROWS,
    BRICK_COLS 
} from './brick-out-model.js';

console.log('Model imported successfully');

// Simple test framework
class TestRunner {
    constructor() {
        this.tests = [];
        this.passed = 0;
        this.failed = 0;
    }
    
    test(name, fn) {
        this.tests.push({ name, fn });
    }
    
    assertEquals(actual, expected, message = '') {
        if (actual !== expected) {
            throw new Error(`${message}\n  Expected: ${expected}\n  Actual: ${actual}`);
        }
    }
    
    assertTrue(condition, message = '') {
        if (!condition) {
            throw new Error(message || 'Expected true but got false');
        }
    }
    
    assertFalse(condition, message = '') {
        if (condition) {
            throw new Error(message || 'Expected false but got true');
        }
    }
    
    assertApprox(actual, expected, tolerance = 0.01, message = '') {
        if (Math.abs(actual - expected) > tolerance) {
            throw new Error(`${message}\n  Expected: ~${expected}\n  Actual: ${actual}`);
        }
    }
    
    run() {
        console.log('Running tests...\n');
        
        for (let test of this.tests) {
            try {
                test.fn.call(this);
                this.passed++;
                console.log(`Pass: ${test.name}`);
            } catch (error) {
                this.failed++;
                console.log(`Fail: ${test.name}`);
                console.log(`  ${error.message}\n`);
            }
        }
        
        console.log(`\n${this.passed} passed, ${this.failed} failed`);
        return this.failed === 0;
    }
}

// Tests
const runner = new TestRunner();

// Paddle tests
runner.test('Paddle initializes at center', function() {
    const paddle = new Paddle(700, 500);
    this.assertEquals(paddle.x, 350, 'Paddle should be at horizontal center');
    this.assertEquals(paddle.y, 460, 'Paddle should be near bottom');
});

runner.test('Paddle moves to new position', function() {
    const paddle = new Paddle(700, 500);
    paddle.moveTo(200);
    this.assertEquals(paddle.x, 200, 'Paddle should move to specified x');
});

runner.test('Paddle respects left boundary', function() {
    const paddle = new Paddle(700, 500);
    paddle.moveTo(10);
    this.assertEquals(paddle.x, 50, 'Paddle should be constrained to width/2');
});

runner.test('Paddle respects right boundary', function() {
    const paddle = new Paddle(700, 500);
    paddle.moveTo(690);
    this.assertEquals(paddle.x, 650, 'Paddle should be constrained to canvas width - width/2');
});

runner.test('Paddle tracks velocity when moving right', function() {
    const paddle = new Paddle(700, 500);
    paddle.moveTo(350); // Start at center
    paddle.moveTo(360); // Move right by 10
    this.assertEquals(paddle.velocity, 10, 'Velocity should be positive when moving right');
});

runner.test('Paddle tracks velocity when moving left', function() {
    const paddle = new Paddle(700, 500);
    paddle.moveTo(350); // Start at center
    paddle.moveTo(340); // Move left by 10
    this.assertEquals(paddle.velocity, -10, 'Velocity should be negative when moving left');
});

runner.test('Paddle velocity is zero when not moving', function() {
    const paddle = new Paddle(700, 500);
    paddle.moveTo(350);
    paddle.moveTo(350);
    this.assertEquals(paddle.velocity, 0, 'Velocity should be zero when position unchanged');
});

// Ball tests
runner.test('Ball initializes at center bottom', function() {
    const ball = new Ball(700, 500);
    this.assertEquals(ball.x, 350, 'Ball should be at horizontal center');
    this.assertEquals(ball.y, 440, 'Ball should be near bottom');
});

runner.test('Ball launches straight up', function() {
    const ball = new Ball(700, 500);
    this.assertEquals(ball.speedX, 0, 'Ball should have no horizontal speed initially');
    this.assertEquals(ball.speedY, -5, 'Ball should move upward');
});

runner.test('Ball bounces off left wall', function() {
    const ball = new Ball(700, 500);
    ball.x = 6;
    ball.speedX = -2;
    ball.update();
    this.assertTrue(ball.speedX > 0, 'Ball should reverse direction after hitting left wall');
    this.assertTrue(ball.x >= ball.size/2, 'Ball should be pushed away from wall');
});

runner.test('Ball bounces off right wall', function() {
    const ball = new Ball(700, 500);
    ball.x = 694;
    ball.speedX = 2;
    ball.update();
    this.assertTrue(ball.speedX < 0, 'Ball should reverse direction after hitting right wall');
    this.assertTrue(ball.x <= 700 - ball.size/2, 'Ball should be pushed away from wall');
});

runner.test('Ball bounces off top wall', function() {
    const ball = new Ball(700, 500);
    ball.y = 6;
    ball.speedY = -2;
    ball.update();
    this.assertTrue(ball.speedY > 0, 'Ball should reverse direction after hitting top');
});

runner.test('Ball detects off bottom', function() {
    const ball = new Ball(700, 500);
    ball.y = 501;
    this.assertTrue(ball.isOffBottom(), 'Ball should be detected as off bottom');
});

runner.test('Ball follows paddle before launch', function() {
    const paddle = new Paddle(700, 500);
    const ball = new Ball(700, 500);
    paddle.moveTo(200);
    ball.followPaddle(paddle);
    this.assertEquals(ball.x, 200, 'Ball should follow paddle x position');
    this.assertEquals(ball.y, paddle.y - 20, 'Ball should be above paddle');
});

runner.test('Ball bounces up off paddle', function() {
    const paddle = new Paddle(700, 500);
    const ball = new Ball(700, 500);
    ball.x = 350;
    ball.y = 460;
    ball.speedY = 2; // Moving down
    
    ball.checkPaddle(paddle);
    this.assertTrue(ball.speedY < 0, 'Ball should bounce upward after hitting paddle');
});

runner.test('Ball gains horizontal speed from moving paddle (right)', function() {
    const paddle = new Paddle(700, 500);
    const ball = new Ball(700, 500);
    
    paddle.moveTo(350);
    paddle.moveTo(360); // Move right, velocity = 10
    
    ball.x = 355;
    ball.y = 460;
    ball.speedX = 0;
    ball.speedY = 2;
    
    ball.checkPaddle(paddle);
    this.assertTrue(ball.speedX > 0, 'Ball should gain rightward speed from paddle moving right');
});

runner.test('Ball gains horizontal speed from moving paddle (left)', function() {
    const paddle = new Paddle(700, 500);
    const ball = new Ball(700, 500);
    
    paddle.moveTo(350);
    paddle.moveTo(340); // Move left, velocity = -10
    
    ball.x = 345;
    ball.y = 460;
    ball.speedX = 0;
    ball.speedY = 2;
    
    ball.checkPaddle(paddle);
    this.assertTrue(ball.speedX < 0, 'Ball should gain leftward speed from paddle moving left');
});

runner.test('Ball speed is constrained', function() {
    const paddle = new Paddle(700, 500);
    const ball = new Ball(700, 500);
    
    paddle.moveTo(350);
    paddle.moveTo(450); // Large velocity
    
    ball.x = 355;
    ball.y = 460;
    ball.speedX = 0;
    ball.speedY = 2;
    
    ball.checkPaddle(paddle);
    this.assertTrue(ball.speedX <= 6, 'Ball speed should be capped at 6');
    this.assertTrue(ball.speedX >= -6, 'Ball speed should be capped at -6');
});

runner.test('Ball detects collision with brick', function() {
    const ball = new Ball(700, 500);
    const brick = new Brick(100, 100, { r: 255, g: 0, b: 0 });
    
    ball.x = 130;
    ball.y = 110;
    
    this.assertTrue(ball.hits(brick), 'Ball should detect collision with brick');
});

runner.test('Ball does not detect collision when away from brick', function() {
    const ball = new Ball(700, 500);
    const brick = new Brick(100, 100, { r: 255, g: 0, b: 0 });
    
    ball.x = 200;
    ball.y = 200;
    
    this.assertFalse(ball.hits(brick), 'Ball should not detect collision when away');
});

// Game Model tests
runner.test('Game initializes with correct state', function() {
    const game = new BrickOutModel(700, 500);
    this.assertEquals(game.score, 0, 'Score should start at 0');
    this.assertEquals(game.lives, 3, 'Lives should start at 3');
    this.assertFalse(game.gameStarted, 'Game should not be started');
    this.assertFalse(game.gameOver, 'Game should not be over');
    this.assertFalse(game.gameWon, 'Game should not be won');
    this.assertEquals(game.bricks.length, 50, 'Should have 50 bricks (5 rows × 10 cols)');
});

runner.test('Game starts when startGame is called', function() {
    const game = new BrickOutModel(700, 500);
    game.startGame();
    this.assertTrue(game.gameStarted, 'Game should be started');
});

runner.test('Paddle moves in game', function() {
    const game = new BrickOutModel(700, 500);
    game.movePaddle(200);
    this.assertEquals(game.paddle.x, 200, 'Paddle should move to specified position');
});

runner.test('Ball follows paddle before game starts', function() {
    const game = new BrickOutModel(700, 500);
    game.movePaddle(200);
    game.update();
    this.assertEquals(game.ball.x, 200, 'Ball should follow paddle before game starts');
});

runner.test('Score increases when brick is hit', function() {
    const game = new BrickOutModel(700, 500);
    const initialBrickCount = game.bricks.length;
    
    // Position ball to hit first brick
    game.startGame();
    game.ball.x = game.bricks[0].x + 30;
    game.ball.y = game.bricks[0].y + 10;
    game.ball.speedY = 1;
    
    game.update();
    
    this.assertEquals(game.score, 10, 'Score should increase by 10');
    this.assertEquals(game.bricks.length, initialBrickCount - 1, 'Brick should be removed');
});

runner.test('Game is won when all bricks are cleared', function() {
    const game = new BrickOutModel(700, 500);
    game.startGame();
    game.bricks = []; // Clear all bricks
    game.update();
    this.assertTrue(game.gameWon, 'Game should be won when no bricks remain');
});

runner.test('Life is lost when ball goes off bottom', function() {
    const game = new BrickOutModel(700, 500);
    game.startGame();
    game.ball.y = 600; // Move ball off bottom
    game.update();
    this.assertEquals(game.lives, 2, 'Should lose one life');
    this.assertFalse(game.gameStarted, 'Game should pause after losing life');
});

runner.test('Game over when all lives are lost', function() {
    const game = new BrickOutModel(700, 500);
    game.startGame();
    game.lives = 1;
    game.ball.y = 600; // Lose last life
    game.update();
    this.assertTrue(game.gameOver, 'Game should be over when lives reach 0');
});

runner.test('Game resets correctly', function() {
    const game = new BrickOutModel(700, 500);
    game.score = 100;
    game.lives = 1;
    game.gameStarted = true;
    game.bricks = [];
    
    game.reset();
    
    this.assertEquals(game.score, 0, 'Score should reset');
    this.assertEquals(game.lives, 3, 'Lives should reset');
    this.assertFalse(game.gameStarted, 'Game should not be started');
    this.assertEquals(game.bricks.length, 50, 'Bricks should be recreated');
});

// Export the test runner for use in HTML
export { runner };

// Auto-run tests in Node.js, but not in browser (browser imports explicitly)
if (typeof window === 'undefined') {
    // Node.js environment - run immediately
    runner.run();
}
