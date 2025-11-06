Feature: Ball Physics
  As a player
  I want the ball to bounce realistically
  So that the game is fun and playable

  Background:
    Given a game with canvas size 705x500

  Scenario: Ball initializes at center bottom
    Then the ball should be at horizontal position 352.5
    And the ball should be at vertical position 440

  Scenario: Ball launches straight up
    Then the ball horizontal speed should be 0
    And the ball vertical speed should be -5

  Scenario: Ball bounces off left wall
    Given the ball is at position 6, 250
    And the ball has horizontal speed -2
    When the ball updates
    Then the ball horizontal speed should be greater than 0
    And the ball should be pushed away from the left wall

  Scenario: Ball bounces off right wall
    Given the ball is at position 699, 250
    And the ball has horizontal speed 2
    When the ball updates
    Then the ball horizontal speed should be less than 0
    And the ball should be pushed away from the right wall

  Scenario: Ball bounces off top wall
    Given the ball is at position 350, 6
    And the ball has vertical speed -2
    When the ball updates
    Then the ball vertical speed should be greater than 0

  Scenario: Ball detects when off bottom
    Given the ball is at position 350, 510
    Then the ball should be off the bottom

  Scenario: Ball follows paddle before launch
    When I move the paddle to position 200
    And the ball follows the paddle
    Then the ball should be at horizontal position 200
    And the ball vertical position should be 20 pixels above paddle

  Scenario: Ball bounces up off paddle
    Given the ball is at position 350, 460
    And the ball has vertical speed 2
    When the ball checks collision with paddle
    Then the ball vertical speed should be less than 0

  Scenario: Ball gains horizontal speed from moving paddle
    When I move the paddle to position 350
    And I move the paddle to position 360
    Given the ball is at position 355, 460
    And the ball has vertical speed 2
    And the ball has horizontal speed 0
    When the ball checks collision with paddle
    Then the ball horizontal speed should be greater than 0
