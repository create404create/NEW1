const board = document.querySelector(".board");
const cells = document.querySelectorAll(".cell");
const statusText = document.querySelector(".status");
const resetButton = document.querySelector(".tic-tac-toe button");

let currentPlayer = "X"; // Human is "X", Computer is "O"
let gameActive = true;
let gameState = ["", "", "", "", "", "", "", "", ""];

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

// Handle cell click (Human move)
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

    if (gameState[clickedCellIndex] !== "" || !gameActive) return;

    // Human makes a move
    makeMove(clickedCellIndex, currentPlayer);

    // Check if the game is over after human's move
    if (checkForWinner()) return;

    // Switch to computer's turn
    currentPlayer = "O";
    statusText.textContent = "Computer is thinking...";

    // Computer makes a move after a short delay
    setTimeout(computerMove, 500);
}

// Make a move (update game state and UI)
function makeMove(index, player) {
    gameState[index] = player;
    cells[index].textContent = player;
}

// Computer's move (Minimax AI)
function computerMove() {
    let bestMove = findBestMove();
    makeMove(bestMove, currentPlayer);

    // Check if the game is over after computer's move
    if (checkForWinner()) return;

    // Switch back to human's turn
    currentPlayer = "X";
    statusText.textContent = "Your turn (X)";
}

// Minimax algorithm to find the best move
function findBestMove() {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === "") {
            gameState[i] = "O"; // Computer tries this move
            let score = minimax(gameState, 0, false);
            gameState[i] = ""; // Undo the move

            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }

    return bestMove;
}

// Minimax function
function minimax(board, depth, isMaximizing) {
    let result = checkWinner(board);

    if (result !== null) {
        if (result === "O") return 10 - depth; // Computer wins
        if (result === "X") return depth - 10; // Human wins
        return 0; // Draw
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "O";
                let score = minimax(board, depth + 1, false);
                board[i] = "";
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === "") {
                board[i] = "X";
                let score = minimax(board, depth + 1, true);
                board[i] = "";
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

// Check for a winner or draw
function checkWinner(board) {
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (board[a] !== "" && board[a] === board[b] && board[b] === board[c]) {
            return board[a]; // Return the winning player ("X" or "O")
        }
    }

    if (!board.includes("")) return "draw"; // Return "draw" if the board is full
    return null; // Return null if the game is still ongoing
}

function checkForWinner() {
    const result = checkWinner(gameState);

    if (result === "X") {
        statusText.textContent = "You win!";
        gameActive = false;
        return true;
    } else if (result === "O") {
        statusText.textContent = "Computer wins!";
        gameActive = false;
        return true;
    } else if (result === "draw") {
        statusText.textContent = "It's a draw!";
        gameActive = false;
        return true;
    }

    return false;
}

// Reset the game
function resetGame() {
    gameState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    statusText.textContent = "Your turn (X)";
    cells.forEach(cell => cell.textContent = "");
}

// Add event listeners
cells.forEach(cell => cell.addEventListener("click", handleCellClick));
resetButton.addEventListener("click", resetGame);

// Initialize game status
statusText.textContent = "Your turn (X)";
