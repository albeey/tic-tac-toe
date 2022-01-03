const player = (name, symbol) => {
  return { name, symbol };
};

const gameBoard = (() => {
  const grid = ["", "", "", "", "", "", "", "", ""];

  // Add to grid
  const addToBoard = (index, symbol) => (grid[index] = symbol);

  const isEmpty = (index) => {
    // Checks if the space is empty
    return grid[index] === "";
  };

  const isBoardFull = () => {
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

  const checkForWin = (symbol) => {
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

  return { addToBoard, isEmpty, isBoardFull, checkForWin, reset };
})();

const displayController = (() => {
  const player = document.querySelector(".playerName");
  const updatePlayer = (current) => (player.textContent = current.name);

  const result = document.querySelector(".result");
  const showResult = (text) => {
    result.textContent = text;
    result.style.display = "block";
  };

  const hideResult = () => {
    result.style.display = "none";
  };

  return { updatePlayer, showResult, hideResult };
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
    return board.isBoardFull() || board.checkForWin(activePlayer.symbol);
  };

  const endGame = () => {
    const winner_axis = board.checkForWin(activePlayer.symbol);

    if (winner_axis) {
      for (const axis of winner_axis) {
        const space = document.getElementById(`${axis}`);
        space.classList.add("win");
      }
      displayController.showResult(`${activePlayer.name} is the winner!`);
    } else if (board.isBoardFull()) {
      displayController.showResult("It's a tie!");
    }
  };

  // Event Listeners
  const boardGridElements = document.querySelectorAll("#gameBoard div");

  boardGridElements.forEach((element) => {
    element.addEventListener("click", () => {
      const id = element.id; // Number ID of the clicked div
      if (!board.isEmpty(id) || isGameOver()) return;

      board.addToBoard(id, activePlayer.symbol);
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
    displayController.hideResult();
    display.updatePlayer(activePlayer);
  };

  const newGameBtn = document.querySelector(".new-game");
  newGameBtn.addEventListener("click", newGame);
})();
