// Tic Tac Toe - Player (X) vs Computer (O)

var cells = document.querySelectorAll(".cell");
var message = document.getElementById("message");
var restartBtn = document.getElementById("restart");

var board = ["", "", "", "", "", "", "", "", ""];
var gameOver = false;

var scores = { player: 0, computer: 0, draw: 0 };

// All the ways to win (row, column, diagonal)
var winPatterns = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6]
];

// Returns the winning pattern if someone won, otherwise null
function checkWinner() {
  for (var i = 0; i < winPatterns.length; i++) {
    var a = winPatterns[i][0];
    var b = winPatterns[i][1];
    var c = winPatterns[i][2];
    if (board[a] !== "" && board[a] === board[b] && board[a] === board[c]) {
      return winPatterns[i];
    }
  }
  return null;
}

function isBoardFull() {
  return board.indexOf("") === -1;
}

function updateBoard() {
  for (var i = 0; i < 9; i++) {
    cells[i].textContent = board[i];
    cells[i].className = "cell " + board[i].toLowerCase();
  }
}

function updateScore() {
  document.getElementById("playerScore").textContent = scores.player;
  document.getElementById("computerScore").textContent = scores.computer;
  document.getElementById("drawScore").textContent = scores.draw;
}

// Check if the game ended after a move. Returns true if it did.
function endGameIfNeeded(who) {
  var winLine = checkWinner();

  if (winLine) {
    gameOver = true;
    for (var i = 0; i < winLine.length; i++) {
      cells[winLine[i]].classList.add("win");
    }
    if (who === "X") {
      message.textContent = "You win!";
      scores.player++;
    } else {
      message.textContent = "Computer wins!";
      scores.computer++;
    }
    updateScore();
    return true;
  }

  if (isBoardFull()) {
    gameOver = true;
    message.textContent = "It's a draw!";
    scores.draw++;
    updateScore();
    return true;
  }

  return false;
}

// Find a square where "mark" can win in one move
function findWinningMove(mark) {
  for (var i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = mark;
      var win = checkWinner();
      board[i] = "";
      if (win) {
        return i;
      }
    }
  }
  return -1;
}

// Computer's brain:
// 1. win if it can, 2. block the player, 3. take center,
// 4. take a corner, 5. take anything left
function computerMove() {
  var move = findWinningMove("O");

  if (move === -1) {
    move = findWinningMove("X");
  }

  if (move === -1 && board[4] === "") {
    move = 4;
  }

  if (move === -1) {
    var corners = [0, 2, 6, 8];
    var freeCorners = [];
    for (var i = 0; i < corners.length; i++) {
      if (board[corners[i]] === "") {
        freeCorners.push(corners[i]);
      }
    }
    if (freeCorners.length > 0) {
      move = freeCorners[Math.floor(Math.random() * freeCorners.length)];
    }
  }

  if (move === -1) {
    for (var j = 0; j < 9; j++) {
      if (board[j] === "") {
        move = j;
        break;
      }
    }
  }

  board[move] = "O";
  updateBoard();

  if (!endGameIfNeeded("O")) {
    message.textContent = "Your turn";
  }
}

// When the player clicks a square
function handleClick(event) {
  var index = event.target.dataset.index;

  if (gameOver || board[index] !== "") {
    return;
  }

  board[index] = "X";
  updateBoard();

  if (endGameIfNeeded("X")) {
    return;
  }

  message.textContent = "Computer is thinking...";
  setTimeout(computerMove, 500);
}

function restartGame() {
  board = ["", "", "", "", "", "", "", "", ""];
  gameOver = false;
  message.textContent = "Your turn";
  updateBoard();
}

// Connect clicks to functions
for (var i = 0; i < cells.length; i++) {
  cells[i].addEventListener("click", handleClick);
}
restartBtn.addEventListener("click", restartGame);
