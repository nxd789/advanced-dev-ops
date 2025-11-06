Feature: Game Play
  As a player
  I want to play a complete game of Brick Out
  So that I can have fun breaking bricks and winning

  Background:
    Given a game with canvas size 705x500

  Scenario: Game initializes with correct state
    Then the score should be 0
    And the lives should be 3
    And the game should not be started
    And the game should not be over
    And the game should not be won
    And there should be 50 bricks

  Scenario: Game starts when clicked
    When I start the game
    Then the game should be started

  Scenario: Paddle moves during game
    When I move the paddle to position 200
    Then the paddle should be at horizontal position 200

  Scenario: Ball follows paddle before game starts
    When I move the paddle to position 200
    And the game updates
    Then the ball should be at horizontal position 200

  Scenario: Score increases when brick is hit
    Given the game is started
    And the ball is positioned to hit a brick
    When the game updates
    Then the score should be 10
    And there should be 49 bricks

  Scenario: Game is won when all bricks are cleared
    Given the game is started
    And all bricks are removed
    When the game updates
    Then the game should be won

  Scenario: Life is lost when ball goes off bottom
    Given the game is started
    And the ball is at position 350, 600
    When the game updates
    Then the lives should be 2
    And the game should not be started

  Scenario: Game over when all lives are lost
    Given the game is started
    And the player has 1 life remaining
    And the ball is at position 350, 600
    When the game updates
    Then the game should be over

  Scenario: Game resets correctly
    Given the game has been played
    When the game resets
    Then the score should be 0
    And the lives should be 3
    And the game should not be started
    And there should be 50 bricks
