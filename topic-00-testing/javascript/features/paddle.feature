Feature: Paddle Control
  As a player
  I want to control the paddle with my mouse
  So that I can hit the ball and break bricks

  Background:
    Given a game with canvas size 705x500

  Scenario: Paddle initializes at center
    Then the paddle should be at horizontal position 352.5
    And the paddle should be at vertical position 460

  Scenario: Paddle moves to new position
    When I move the paddle to position 200
    Then the paddle should be at horizontal position 200

  Scenario: Paddle respects left boundary
    When I move the paddle to position 10
    Then the paddle should be at horizontal position 50

  Scenario: Paddle respects right boundary
    When I move the paddle to position 690
    Then the paddle should be at horizontal position 655

  Scenario: Paddle tracks velocity when moving right
    When I move the paddle to position 350
    And I move the paddle to position 360
    Then the paddle velocity should be 10

  Scenario: Paddle tracks velocity when moving left
    When I move the paddle to position 350
    And I move the paddle to position 340
    Then the paddle velocity should be -10

  Scenario: Paddle velocity is zero when stationary
    When I move the paddle to position 350
    And I move the paddle to position 350
    Then the paddle velocity should be 0
