(function () {
  const boardEl = document.getElementById("js__board");
  const turnEl = document.getElementById("js__turn");
  const resultEl = document.getElementById("js__result");
  const resetBtn = document.getElementById("js__reset");
  const tauntEl = document.getElementById("js__taunt");

  let board = ["", "", "", "", "", "", "", "", ""];
  let currentPlayer = "player"; // 'player' or 'ai'
  let gameActive = true;

  const taunts = [
    "🤖 AI is thinking...",
    "🤖 Easy peasy!",
    "😂 Uh oh...",
    "🤖 One more move!",
    "🤖 I see your move!",
    "😂 AI is happy!",
    "🤖 Let's keep playing!",
  ];

  const winMessages = [
    "😎 You win! Great job!",
    "😂 The AI is sad!",
    "🎉 You did it!",
    "🚀 You beat the robot!",
    "👑 You are the winner!",
  ];
  const loseMessages = [
    "🤖 AI wins!",
    "😅 Try again next time!",
    "🤖 The robot won!",
    "😭 You lost this round!",
    "🤖 AI is happy!",
  ];
  const drawMessages = [
    "🤝 It's a tie! Even match!",
    "😄 Nobody wins!",
    "🤖 Game is even!",
    "🤖 No winner!",
  ];

  function createBoard() {
    boardEl.innerHTML = "";
    for (let i = 0; i < board.length; i++) {
      const cell = board[i]; // Get value of this cell ("", "X","O")
      const div = document.createElement("div");
      div.className = "cell"; //default class

      //If the cell is filled, add "filled" class
      if (cell !== "") {
        div.classList.add("filled");
      }

      //set the cell index for reference
      div.dataset.index = i;

      //Show emoji for X or O
      if (cell === "X") {
        div.innerHTML = "😎";
      } else if (cell === "O") {
        div.innerHTML = "🤖";
      }

      //Add this cell to the board in HTML
      boardEl.appendChild(div);
    }
  }

  function aiMove() {
    const mistakeChance = 0.2; //20% chance to make a mistake
    let move;

    if (Math.random() < mistakeChance) {
      //Make a mistake: pick random empty cell
      const emptyCells = [];

      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          emptyCells.push(i); //store empty cell index
        }
      }

      //Pick a random index from empty cells
      if (emptyCells.length > 0) {
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        move = emptyCells[randomIndex];
      } else {
        return; // no move possible
      }
    } else {
      // Smart move
      move = minimax(board, "O").index;
    }

    //Place AI's move on the board for both smart and mistake move
    board[move] = "O";

    //Update the UI after a short delay
    setTimeout(() => {
      const cell = document.querySelector(`[data-index="${move}"]`);
      cell.innerHTML = "🤖";
      cell.classList.add("ai");
      cell.classList.add("filled");

      checkGameEnd();
      currentPlayer = "player"; //switch turn to player
      turnEl.textContent = "Your turn 😎";

      // Pick and show random taunt
      const randomTaunt = Math.floor(Math.random() * taunts.length);
      tauntEl.textContent = taunts[randomTaunt];
    }, 800);
  }

  //Calculate best move for AI
  function minimax(newBoard, player) {
    const emptyCells = [];
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        emptyCells.push(i);
      }
    }

    // Check for end game
    if (checkWin(newBoard, "O")) return { score: 10 };
    if (checkWin(newBoard, "X")) return { score: -10 };
    if (emptyCells.length === 0) return { score: 0 };

    const moves = [];
    for (let i = 0; i < emptyCells.length; i++) {
      const move = {};
      move.index = emptyCells[i];
      newBoard[emptyCells[i]] = player;

      if (player === "O") {
        const result = minimax(newBoard, "X");
        move.score = result.score;
      } else {
        const result = minimax(newBoard, "O");
        move.score = result.score;
      }

      newBoard[emptyCells[i]] = "";
      moves.push(move);
    }

    let bestMove;
    if (player === "O") {
      let bestScore = -Infinity; //to find the biggest number
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score > bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    } else {
      let bestScore = Infinity; // to find the smallest number
      for (let i = 0; i < moves.length; i++) {
        if (moves[i].score < bestScore) {
          bestScore = moves[i].score;
          bestMove = moves[i];
        }
      }
    }
    return bestMove;
  }

  function checkWin(cellToCheck, player) {
    // All possible winning positions
    const wins = [
      [0, 1, 2], // top row
      [3, 4, 5], // middle row
      [6, 7, 8], // bottom row
      [0, 3, 6], // left column
      [1, 4, 7], // middle column
      [2, 5, 8], // right column
      [0, 4, 8], // diagonal \
      [2, 4, 6], // diagonal /
    ];

    for (let i = 0; i < wins.length; i++) {
      const combo = wins[i];

      if (
        cellToCheck[combo[0]] === player &&
        cellToCheck[combo[1]] === player &&
        cellToCheck[combo[2]] === player
      ) {
        return true; //player wins
      }
    }
    return false; // no winning
  }

  function checkGameEnd() {
    // check if player X wins
    if (checkWin(board, "X")) {
      resultEl.innerHTML =
        winMessages[Math.floor(Math.random() * winMessages.length)];
      gameActive = false;
      highlightWin("X");
      return;
    }

    // check if AI (O) wins
    if (checkWin(board, "O")) {
      resultEl.innerHTML =
        loseMessages[Math.floor(Math.random() * loseMessages.length)];
      gameActive = false;
      highlightWin("O");
      return;
    }

    // check for a draw
    if (board.every((cell) => cell !== "")) {
      resultEl.innerHTML =
        drawMessages[Math.floor(Math.random() * drawMessages.length)];
      gameActive = false;
      return;
    }
  }

  function highlightWin(player) {
    // All possible winning positions
    const wins = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let i = 0; i < wins.length; i++) {
      let combo = wins[i];

      if (
        board[combo[0]] === player &&
        board[combo[1]] === player &&
        board[combo[2]] === player
      ) {
        for (let j = 0; j < combo.length; j++) {
          const index = combo[j];
          const cell = document.querySelector(`[data-index="${index}"]`);
          cell.classList.add("win");
        }
      }
    }
  }

  function makeMove(index) {
    if (board[index] !== "" || !gameActive || currentPlayer !== "player")
      return;

    board[index] = "X";
    document.querySelector(`[data-index="${index}"]`).innerHTML = "😎";
    document
      .querySelector(`[data-index="${index}"]`)
      .classList.add("player", "filled");

    checkGameEnd();
    if (gameActive) {
      currentPlayer = "ai";
      turnEl.textContent = "AI thinking 🤖";
      tauntEl.textContent = taunts[Math.floor(Math.random() * taunts.length)];
      setTimeout(aiMove, 1000);
    }
  }

  // BULLETPROOF FOR MINI-APP SYSTEM
  document.addEventListener("click", (e) => {
    if (
      e.target.classList.contains("cell") &&
      gameActive &&
      currentPlayer === "player"
    ) {
      const index = parseInt(e.target.dataset.index);
      makeMove(index);
    } else if (e.target.id === "reset") {
      resetGame();
    }
  });

  function resetGame() {
    board = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "player";
    turnEl.textContent = "Your turn 😎";
    resultEl.textContent = "";
    tauntEl.textContent = "";
    createBoard();
  }

  resetBtn.onclick = resetGame;

  createBoard();
})();
