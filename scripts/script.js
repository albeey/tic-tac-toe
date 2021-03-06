const player = (name, symbol) => {
  return { name, symbol };
};

const gameBoard = (() => {
  const grid = ["", "", "", "", "", "", "", "", ""];

  // Fill space in the grid
  const addToSpace = (position, symbol) => (grid[position] = symbol);

  const isSpaceEmpty = (spaceIdx) => {
    // Checks if the space in the grid is empty
    return grid[spaceIdx] === "";
  };

  const isFull = () => {
    // Checks if the board is full
    for (const space of grid) {
      if (space === "") return false;
    }
    return true;
  };

  // WIN CONDITIONS
  const WINNER_AXIS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  const isThereAWinner = (symbol) => {
    // Check if there's a win condition
    for (const axis of WINNER_AXIS) {
      if (grid[axis[0]] === symbol && grid[axis[1]] === symbol && grid[axis[2]] === symbol) {
        return axis;
      }
    }
    return false;
  };

  const reset = () => {
    // Empties Grid
    for (let i = 0; i < grid.length; i++) grid[i] = "";
  };

  return { addToSpace, isSpaceEmpty, isFull, isThereAWinner, reset };
})();

const displayController = (() => {
  const player = document.querySelector(".playerName");
  const updatePlayer = (current) => (player.textContent = current.name);

  const result = document.querySelector(".result");
  const displayResult = (text) => {
    result.textContent = text;
    result.style.display = "block";
  };

  return { updatePlayer, displayResult };
})();

const game = (() => {
  // BOARD OBJECT
  const board = gameBoard;

  // PLAYER OBJECT
  const player1 = player("Player 1", "X");
  const player2 = player("Player 2", "O");

  // DISPLAY CONTROLLER OBJECT
  const display = displayController;

  // GAME
  let activePlayer = player1;

  display.updatePlayer(activePlayer);

  const switchPlayer = () => (activePlayer === player1 ? (activePlayer = player2) : (activePlayer = player1));

  const isGameOver = () => {
    // Checks if game should end
    return board.isFull() || board.isThereAWinner(activePlayer.symbol);
  };

  const endGame = () => {
    // Ends the game and announces the winner
    const winner_axis = board.isThereAWinner(activePlayer.symbol);

    if (winner_axis) {
      // Add win class to winner axis
      for (const axis of winner_axis) {
        const space = document.getElementById(`${axis}`);
        space.classList.add("win");
      }
      // Text to display
      displayController.displayResult(`${activePlayer.name} is the winner!`);
    } else {
      displayController.displayResult("It's a tie!");
    }
  };

  // Event Listeners
  const boardGridElements = document.querySelectorAll("#gameBoard div");

  boardGridElements.forEach((element) => {
    element.addEventListener("click", () => {
      const id = element.id; // Number ID of the clicked div
      if (!board.isSpaceEmpty(id) || isGameOver()) return;

      board.addToSpace(id, activePlayer.symbol);
      element.textContent = activePlayer.symbol; // Add player move to DOM

      // Check if game is over
      if (isGameOver()) {
        endGame();
      } else {
        switchPlayer();
        display.updatePlayer(activePlayer);
      }
    });
  });

  const cleanGrid = () => {
    // Empties the grid
    boardGridElements.forEach((element) => {
      element.textContent = "";
      element.classList.remove("win");
    });
  };

  const newGame = () => {
    // Starts a new game
    cleanGrid();
    board.reset();
    activePlayer = player1;
    displayController.displayResult("");
    display.updatePlayer(activePlayer);
  };

  const newGameBtn = document.querySelector(".new-game");
  newGameBtn.addEventListener("click", newGame);
})();
