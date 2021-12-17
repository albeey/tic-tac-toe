const WINNERAXIS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const player = (name, symbol) => {
  return {
    name,
    symbol,
  };
};

// BOARD

let gameBoard = ["", "", "", "", "", "", "", "", ""];

const boardGridElements = document.querySelectorAll("#gameBoard div");

function giveCellFunctionality() {
  boardGridElements.forEach((square) => {
    square.addEventListener("click", round);
  });
}

giveCellFunctionality();

// PLAYERS

const player1 = player("Player 1", "X");
const player2 = player("Player 2", "O");

let currentPlayer = player1;

const playerTurn = document.querySelector(".playerTurn");

const newGameBtn = document.querySelector(".new-game");
newGameBtn.addEventListener("click", newGame);

function newGame() {
  currentPlayer = player1;
  playerTurn.textContent = `${currentPlayer.name} turn`;
  gameBoard = ["", "", "", "", "", "", "", "", ""];

  boardGridElements.forEach((square) => {
    square.textContent = "";
  });

  giveCellFunctionality();
}

//

function fillSquare() {
  this.textContent = currentPlayer.symbol;
}

function updateGameBoard() {
  gameBoard[this.id] = currentPlayer.symbol;
  console.log(gameBoard);
}

function checkWinner() {
  for (const axis of WINNERAXIS) {
    if (gameBoard[axis[0]] === currentPlayer.symbol && gameBoard[axis[1]] === currentPlayer.symbol && gameBoard[axis[2]] === currentPlayer.symbol) {
      return true;
    }
  }

  return false;
}

function isBoardFull() {
  for (const cell of gameBoard) {
    if (cell === "") return false;
  }

  return true;
}

function gameOver() {
  if (checkWinner()) {
    boardGridElements.forEach((square) => {
      square.removeEventListener("click", round);
    });

    playerTurn.textContent = `${currentPlayer.name} is the winner!`;
  } else {
    playerTurn.textContent = "It's a tie!";
  }
}

//

function round() {
  // Fill cell
  if (gameBoard[this.id] != "") {
    return;
  } else {
    fillSquare.call(this);
  }

  // Update gameBoard array
  updateGameBoard.call(this);

  // Check for winner and if board is full
  if (checkWinner() || isBoardFull()) {
    return gameOver();
  }

  // Change Player
  if (currentPlayer === player1) {
    currentPlayer = player2;
  } else {
    currentPlayer = player1;
  }

  // Update current player in DOM
  playerTurn.textContent = `${currentPlayer.name} turn`;
}
