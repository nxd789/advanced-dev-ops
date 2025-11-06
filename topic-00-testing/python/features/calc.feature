Feature: test the calc module

  Scenario: test add module
     Given we have included the calc module
      When we call the add function with 3 and 4
      Then we will get 7

  Scenario: test mul module
     Given we have included the calc module
      When we call the mul function with 3 and 4
      Then we will get 12

  Scenario: test mul module
     Given we have included the calc module
      When we call the mul function with -3 and 4
      Then we will get -12

  Scenario Outline: Adding
    Given we have included the calc module
     When we call the add function with <x> and <y>
     Then we will get <z>

    Examples: Number
     | x | y  | z |
     | 3 | 4  | 7 |
     | 3 | -4  | -1 |
     | 10000 | 10000  | 20000 |
     | 0 | 0  | 0 |

