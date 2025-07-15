# Wordle Clone

Based on the popular New York Times Wordle game.

This version utlilizes a simple server that makes the API call to Random Word with length of 5.  A free dictonary API is used to test whether the word guessed by the user is valid.

The application makes use of 2 free APIs requiring no keys or tokens:
- https://random-word-api.herokuapp.com/home
- https://dictionaryapi.dev/

## Live Demo
[Play Wordle Clone](http://104.131.189.144:3000/index.html)

## Features
- Guess 5 letter word 
- 6 wrong guesses allowed
- On-screen and physical keyboard support
- Animation similar to NYT Wordle version
- Allows for plural words
- Repeated play

## Setup Instructions

1. Clone this repository
2. npm install at the command line to install all dependencies
3. npm start to run on localhost:8000

## Technologies Used
- Vanilla JavaScript (ES6 modules)
- Random Word API
- Free Dictionary API
- Custom CSS3 with responsive design via Bootstrap
- Express.js for simple server to provide routing from the Random Word API