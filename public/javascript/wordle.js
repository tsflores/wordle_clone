
//use Random Words API to generate an answer with length 5
//used RapidAPI to get javascript
function getRandomWord() {
  const data = null;

  const xhr = new XMLHttpRequest();
  xhr.withCredentials = false;  //no cookies

  xhr.addEventListener('readystatechange', function () {
    if (this.readyState === this.DONE) {
      randomWord = this.responseText;
      gameStatus.answer = randomWord;
    }
  });

  xhr.open('GET', 'https://random-words5.p.rapidapi.com/getRandom?wordLength=5');
  xhr.setRequestHeader('X-RapidAPI-Key', '78aa73499dmsh6cf4e39ff5b6bbdp14d7ecjsna90581a5dde0');
  xhr.setRequestHeader('X-RapidAPI-Host', 'random-words5.p.rapidapi.com');

  xhr.send(data);
}

//globally scoped variables
const numRows = 6;
const numColumns = 5;
var matchedKey = {};
var randomWord = "";

// use an object to store / retrieve info on the game status such as guessed words and game board locations
// reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Array

const gameStatus = {
  answer: randomWord,
  playerGuesses: Array.from({ length: numRows }, () => Array(numColumns).fill('')),
  activeRow: 0,
  activeColumn: 0,
  winFlag: false,
  fillLetter: (a, b, c) => gameStatus.playerGuesses[a][b] = c,
  tileColor: new Array(numColumns).fill(''),
  keyColor: {}
};

document.addEventListener("DOMContentLoaded", function () {

console.log(screen.width);
console.log(screen.height);

  getRandomWord();
  createGameBoard(); //create the inital 5 x 6 matrix
  createKeyBoard(); //create virtual keyboard below the game board

  //event listener for a physical keyboard - alternate option to virtual on screen keyboard
  document.addEventListener("keyup", (keyBoardEvent) => { addLetterToBoard(keyBoardEvent); });

  // function that creates a numRows x numColumns grid that serves as the word to guess
  // each row is a 5 letter word that serves as a guess
  // each tile is a single letter within the guess
  function createGameBoard() {
    gameBoard = document.getElementById("board");

    // insert a div for each row - <div class = rows id = row#>
    for (i = 0; i < numRows; i++) {
      let row = document.createElement("div");
      row.classList.add("rows");
      row.setAttribute("id", "row" + i);
      gameBoard.appendChild(row);
      gameRow = document.getElementById("row" + i);

      // insert a div for each tile <div class = tiles id = tile-##>
      for (j = 0; j < numColumns; j++) {
        let column = document.createElement("div");
        column.classList.add("tiles");
        column.setAttribute("id", "tile-" + i + j);
        gameRow.appendChild(column);
      }
    }
  }

  /* 
   provide an option to use a virtual keyboard on screen or a physical keyboard
   Click event for on-screen and keyup event for virtual.
   
   Researched how to incorporate a keyboard object and the instance properties of it.
   To use the same functions for filling out the game board, structure the virtual keyboard
   with ids and values that match the instance properties in the below link - notably the code
   for the id in the form of Key#.
  
   reference: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
  */

  function createKeyBoard() {
    //store virtual keyboard keys in an array
    let arrKeys = [
      ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
      ["", "A", "S", "D", "F", "G", "H", "J", "K", "L", ""],
      ["Enter", "Z", "X", "C", "V", "B", "N", "M", "del"],
    ];

    keyBoard = document.getElementById("keyBoard"); //find the element and insert keyboard within it

    for (i = 0; i < arrKeys.length; i++) {
      let rowKeys = arrKeys[i];
      let row = document.createElement("div");
      row.classList.add("keyBoardRow");
      row.setAttribute("id", "keyBoardRow" + i);
      keyBoard.appendChild(row);
      keyBoardRow = document.getElementById("keyBoardRow" + i);

      for (j = 0; j < rowKeys.length; j++) {
        let tileLetter = rowKeys[j]; //accesses the individual value within arrKeys for a given row column combination

        //create an individual div for each key on the keyboard
        let key = document.createElement("div");
        key.classList.add("key");

        //special consideration for the Enter and Delete keys
        if (tileLetter == "Enter") {
          key.setAttribute("id", tileLetter);
        }
        else if (tileLetter == "del") {
          key.setAttribute("id", "Backspace");
        }
        else {
          key.setAttribute("id", "Key" + tileLetter);
        }

        key.innerHTML = tileLetter;
        keyBoardRow.appendChild(key);

        key.addEventListener("click", getLetter); //add click event listener to the keys of the virtual keyboard
      }
    }
  }

  function getLetter() {
    userEvent = { code: this.id, key: this.innerText }; //capture the id attribute from the tile selected on the virtual keyboard
    addLetterToBoard(userEvent);
  }

  function addLetterToBoard(userEvent) {

    if (gameStatus.winFlag) return;  //end game

    //only accept letters and not other characters
    if ("KeyA" <= userEvent.code && userEvent.code <= "KeyZ") {
      let wordleTiles = document.getElementById("tile-" + gameStatus.activeRow + gameStatus.activeColumn);
      if (gameStatus.activeColumn < numColumns && gameStatus.activeRow < numRows) {
        wordleTiles.innerHTML = userEvent.key.toUpperCase();
        gameStatus.fillLetter(gameStatus.activeRow, gameStatus.activeColumn, userEvent.key);
        gameStatus.activeColumn += 1;
        wordleTiles.style.borderColor = "black";
      }
    }

    // "erase" a letter if backspace or delete is struck
    if (userEvent.code === "Backspace" && 0 < gameStatus.activeColumn && gameStatus.activeColumn <= numColumns) {
      gameStatus.activeColumn -= 1;
      let wordleTiles = document.getElementById("tile-" + gameStatus.activeRow + gameStatus.activeColumn);
      wordleTiles.innerHTML = "";
      gameStatus.fillLetter(gameStatus.activeRow, gameStatus.activeColumn, "");
      wordleTiles.style.borderColor = "#d3d6da";
    }

    if (userEvent.code === "Enter") {
      if (gameStatus.activeColumn != 5) {
        alert("You need to enter a valid 5 letter word.");
      }
      else {
        checkWord();
      }
    }
  }

  //compare what the user entered to the answer and add class to apply styling to the game tiles and keyboard
  function checkWord() {

    let joinedGuess = gameStatus.playerGuesses[gameStatus.activeRow].reduce(((previous, current) => previous + current), "").toLowerCase();

    let letterCount = {}; //keep track of letter frequency within the answer through a key:value pair to be used for duplicate situations

    //use the Words API to check if the guessed word is valid
    const url = 'https://wordsapiv1.p.rapidapi.com/words/' + joinedGuess;

    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': '78aa73499dmsh6cf4e39ff5b6bbdp14d7ecjsna90581a5dde0',
        'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
      }
    };

    fetch(url, options)
      .then((res) => {
        if (!res.ok) {
          throw Error(); //alert user of an invalid word
        }

        /* 
          it's possible for a guess to have the same letter entered multiple times but show up less frequently in the answer; testing through this situation showed that I needed to keep track of letters to make sure that the tiles were properly colored.  For example, if answer = PAINT and guess = PENNY, then one N would show up with a green background and the other should show up with a grey background.
          I started using a number of conditional branches but determined that I couldn't catch all of the scenarios.  So I switched to first finding direct matches and then dealing with correct letters but wrong positions and correct letters but duplicates that should not be highlighted. 
        */

        for (i = 0; i < numColumns; i++) {
          let answerLetter = gameStatus.answer[i];

          let letter = gameStatus.playerGuesses[gameStatus.activeRow][i].toLowerCase();
          let key = gameStatus.playerGuesses[gameStatus.activeRow][i].toUpperCase();

          if (letterCount[answerLetter]) {
            letterCount[answerLetter] += 1;
          }
          else {
            letterCount[answerLetter] = 1;
          }

          //cycle through guessed letters, check for direct match, select styling, and remove frequency of letter from letterCount
          if (letter == gameStatus.answer[i].toLowerCase()) {
            gameStatus.tileColor[i] = "tile-right";
            gameStatus.keyColor[answerLetter.toUpperCase()] = "key-right";
            matchedKey["Key" + key] = true;
            letterCount[letter] -= 1;
          }
        }

        // loop through letters again but this time focus on those that are wrong, in wrong position, or duplicates

        for (i = 0; i < numColumns; i++) {
          let letter = gameStatus.playerGuesses[gameStatus.activeRow][i].toLowerCase();
          let key = gameStatus.playerGuesses[gameStatus.activeRow][i].toUpperCase();

          if (gameStatus.tileColor[i] != "tile-right") {

            if (gameStatus.answer.includes(letter) && letterCount[letter] > 0) {

              letterCount[letter] -= 1;  //in case the guessed word has multiple instances of same letter

              //original Wordle retains the green background color of the keyboard as long as the letter was a direct match in a previous guess
              //use matchedKey object to retain the color
              gameStatus.tileColor[i] = "tile-wrong-place";
              if (!matchedKey["Key" + key]) {
                gameStatus.keyColor[letter.toUpperCase()] = "key-wrong-place";
              }
            }
            //case where letter appears once in answer but multiple times in guess - perserves the yellow keyboard shading
            else if (gameStatus.answer.includes(letter)) {
              if (!matchedKey["Key" + key]) {
                gameStatus.keyColor[letter.toUpperCase()] = "key-wrong-place";
                gameStatus.tileColor[i] = "tile-wrong";
              }
              else {
                gameStatus.tileColor[i] = "tile-wrong";
              }
            }
            else {
              gameStatus.tileColor[i] = "tile-wrong";
              gameStatus.keyColor[letter.toUpperCase()] = "key-wrong";
            }
          }
        }

        console.log(gameStatus);
        console.log(gameStatus.playerGuesses[0]);
        applyAnimation();

        colorKeys();

        finalCheck(joinedGuess);

      })
      .catch(() => {
        window.alert("That is not a valid word!  Please try again.");
      });
  }
});

function revealWord() {

  let answerReveal = document.getElementById("answer");

  answerReveal.innerText = "The word is " + gameStatus.answer.toUpperCase();
}

function playAgain() {
  window.location.reload();
}

function messageToUser() {

  let message = document.getElementById("answer");

  switch (gameStatus.activeRow) {
    case 1:
      message.innerText = "Stupendous!! You got the word in 1 try."
      break;
    case 2:
      message.innerText = "Marvelous!! You got the word in 2 tries."
      break;
    case 3:
      message.innerText = "Outstanding! You got the word in 3 tries."
      break;
    case 4:
      message.innerText = "Excellent! You got the word in 4 tries."
      break;
    case 5:
      message.innerText = "Well Done. You got the word in 5 tries."
      break;
    case 6:
      message.innerText = "Nice work.  You correctly guessed the answer."
      break;
    default:
      message.innerText = "Thanks for playing.  The word was " + gameStatus.answer.toUpperCase();
      break;
  }
}

//wait until the animation is complete before checking the word
function finalCheck(guess) {
  const timerInterval = 3000;
  setTimeout(function () {
    gameStatus.activeRow += 1;
    gameStatus.activeColumn = 0;
    gameStatus.tileColor = new Array(numColumns).fill('');

    if (guess === gameStatus.answer) {
      gameStatus.winFlag = true;
      messageToUser();

    }
    else if (!gameStatus.winFlag && gameStatus.activeRow === numRows) {
      gameStatus.activeRow++;
      messageToUser();
    }
  }, timerInterval)
}

//cycle through each letter and apply animation class and the correct tile color
function applyAnimation() {
  const timerInterval = 500;
  for (i = 0; i < numColumns; i++) {
    let wordleTiles = document.getElementById("tile-" + gameStatus.activeRow + i);
    let tileColorClass = gameStatus.tileColor[i];
    setTimeout(() => {
      wordleTiles.classList.add(tileColorClass);
      wordleTiles.classList.add("animated");
    }, timerInterval * i);
  }
}

function colorKeys() {
  setTimeout(() => {
    for (letter in gameStatus.keyColor) {
      let virtualKey = document.getElementById("Key" + letter);
      if (virtualKey.classList.contains("key-wrong-place")) {  //letter in wrong position originally
        virtualKey.classList.remove("key-wrong-place")
      }
      virtualKey.classList.add(gameStatus.keyColor[letter]);
    }
  }, 3000)
}
