# DGMDE28-Assignment6

Requirements: Create a Wordle-like game that makes use of an API to fetch a word and test that a user guess is both a valid word and matches the random generated answer

URL: https://trinidads-portfolio.com/DGMDE28/Wordle-Clone/index.html

Approach:
1. Followed an approach similar to that of the Tic-Tac-Toe game - creating a grid for the game board
2. Added an on-screen keyboard through a series of div's each with a click event listener to capture a letter entered by the user
3. Added a key-up event listener in the event user playing with an actual keyboard
4. Used Random Words API available through RapidAPI to generate a 5 letter random word that would serve as the answer
5. Used Words API to validate that a user entered 5 letter word was valid.  
6. Used @media query to work with different screen sizes with the approach of designing for a mobile phone and then making adjustments based on width or height
7. Applied animation to the tiles and keyboard
8. Worked through a number of scenarios to ensure that tile and on-screen keyboard elements had the proper background color applied to mimic the NYT version of the game.  
9. Applied additional features to play multiple times and to reveal the word before the game is complete.

The most satisfying part of the assignment was just getting the game to work.  I shared it with my family and they enjoy now being able to play a Wordle like game multiple times.  I enjoyed this assignment but it was by far the most difficult of the course thus far - especially working through various background color scenarios.  I'm not 100% convinced that I've captured all scenarios and perhaps there is a simpler way of executing the criteria. 

I plan to keep working on it to add other features such as statistics, additional animation, and optimizing play for the screen.  The media queries appear to work but likely need some adjustments - especially for tablets or mobile devices in landscape mode. 

I first used Words API to generate a random 5 letter word.  However, the API was also returning acronyms, latin words, and 5 letters that were a two word phrase.  The API did not seem to have the parameters needed to alter the query string when returning a random word.  Therefore, I shifted to Random Words API