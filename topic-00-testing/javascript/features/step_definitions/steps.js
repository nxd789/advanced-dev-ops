import { Given, When, Then } from '@cucumber/cucumber';
import { strictEqual, ok } from 'assert';
import { BrickOutModel, Paddle, Ball } from '../../brick-out-model.js';

// Shared state
let game, paddle, ball;

// Background steps
Given('a game with canvas size {int}x{int}', function (width, height) {
    game = new BrickOutModel(width, height);
    paddle = game.paddle;
    ball = game.ball;
});

// Paddle steps
Then('the paddle should be at horizontal position {float}', function (expectedX) {
    strictEqual(paddle.x, expectedX);
});

Then('the paddle should be at vertical position {int}', function (expectedY) {
    strictEqual(paddle.y, expectedY);
});

When('I move the paddle to position {int}', function (x) {
    game.movePaddle(x);
});

Then('the paddle velocity should be {int}', function (expectedVelocity) {
    strictEqual(paddle.velocity, expectedVelocity);
});

// Ball position steps
Then('the ball should be at horizontal position {float}', function (expectedX) {
    strictEqual(ball.x, expectedX);
});

Then('the ball should be at vertical position {int}', function (expectedY) {
    strictEqual(ball.y, expectedY);
});

Given('the ball is at position {int}, {int}', function (x, y) {
    ball.x = x;
    ball.y = y;
});

// Ball speed steps
Then('the ball horizontal speed should be {int}', function (expectedSpeed) {
    strictEqual(ball.speedX, expectedSpeed);
});

Then('the ball vertical speed should be {int}', function (expectedSpeed) {
    strictEqual(ball.speedY, expectedSpeed);
});

Given('the ball has horizontal speed {int}', function (speed) {
    ball.speedX = speed;
});

Given('the ball has vertical speed {int}', function (speed) {
    ball.speedY = speed;
});

Then('the ball horizontal speed should be greater than {int}', function (value) {
    ok(ball.speedX > value, `Expected ball.speedX (${ball.speedX}) to be greater than ${value}`);
});

Then('the ball horizontal speed should be less than {int}', function (value) {
    ok(ball.speedX < value, `Expected ball.speedX (${ball.speedX}) to be less than ${value}`);
});

Then('the ball vertical speed should be greater than {int}', function (value) {
    ok(ball.speedY > value, `Expected ball.speedY (${ball.speedY}) to be greater than ${value}`);
});

Then('the ball vertical speed should be less than {int}', function (value) {
    ok(ball.speedY < value, `Expected ball.speedY (${ball.speedY}) to be less than ${value}`);
});

// Ball update steps
When('the ball updates', function () {
    ball.update();
});

Then('the ball should be pushed away from the left wall', function () {
    ok(ball.x >= ball.size / 2, `Expected ball.x (${ball.x}) to be >= ${ball.size / 2}`);
});

Then('the ball should be pushed away from the right wall', function () {
    ok(ball.x <= 705 - ball.size / 2, `Expected ball.x (${ball.x}) to be <= ${705 - ball.size / 2}`);
});

Then('the ball should be off the bottom', function () {
    ok(ball.isOffBottom(), 'Expected ball to be off the bottom');
});

When('the ball follows the paddle', function () {
    ball.followPaddle(paddle);
});

Then('the ball vertical position should be {int} pixels above paddle', function (pixels) {
    strictEqual(ball.y, paddle.y - pixels);
});

When('the ball checks collision with paddle', function () {
    ball.checkPaddle(paddle);
});

// Game state steps
Then('the score should be {int}', function (expectedScore) {
    strictEqual(game.score, expectedScore);
});

Then('the lives should be {int}', function (expectedLives) {
    strictEqual(game.lives, expectedLives);
});

Then('the game should not be started', function () {
    strictEqual(game.gameStarted, false);
});

Then('the game should be started', function () {
    strictEqual(game.gameStarted, true);
});

Then('the game should not be over', function () {
    strictEqual(game.gameOver, false);
});

Then('the game should be over', function () {
    strictEqual(game.gameOver, true);
});

Then('the game should not be won', function () {
    strictEqual(game.gameWon, false);
});

Then('the game should be won', function () {
    strictEqual(game.gameWon, true);
});

Then('there should be {int} bricks', function (expectedCount) {
    strictEqual(game.bricks.length, expectedCount);
});

When('I start the game', function () {
    game.startGame();
});

When('the game updates', function () {
    game.update();
});

Given('the game is started', function () {
    game.startGame();
});

Given('the ball is positioned to hit a brick', function () {
    // Position ball at first brick
    const brick = game.bricks[0];
    ball.x = brick.x + 30;
    ball.y = brick.y + 10;
    ball.speedY = 1;
});

Given('all bricks are removed', function () {
    game.bricks = [];
});

Given('the player has {int} life remaining', function (lives) {
    game.lives = lives;
});

Given('the game has been played', function () {
    game.score = 100;
    game.lives = 1;
    game.gameStarted = true;
    game.bricks = [];
});

When('the game resets', function () {
    game.reset();
});
