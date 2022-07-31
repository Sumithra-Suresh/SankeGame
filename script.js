//=========================================================================================================
//                                              Snake Game
//
//
//=========================================================================================================

function gameController() {
  return {
    board: {
      blockSize: 25, // Size of each square in pixels
      rows: 20,
      cols: 20,
    },
    food: {
      x: 75,
      y: 75,
    },
    snake: {
      x: 125,
      y: 125,
      velocityX: 0, // To move the snake in X and Y axis
      velocityY: 0,
      body: [],
    },
    score: 0,

    reset: function () {
      Object.assign(this, gameController());
    },
  };
}

// Global variables
let gameBoard = document.querySelector("#board");
let gameContext = gameBoard.getContext("2d");
let gameCtrl = gameController();
let isScoreModalOpen = false; // Flag to prevent the event listeners when score modal is opened

// Event Listeners
window.addEventListener("load", startup, false);
window.addEventListener("keydown", closeModal);
window.addEventListener("click", outsideClick);
document.addEventListener("keyup", changeDirection);

//=========================================================================================================
// Initialization
// Setting up a load handler to do the main startup work once the page is fully loaded.
//
//=========================================================================================================

function startup() {
  initializeBoard();

  placeFood();

  setInterval(updateBoard, 1000 / 10); // 10 times a sec

  openInstruction();
}

//=========================================================================================================
// initializeBoard()
// Initialize the board height and the width.
// Update the high score display in the board from the local storage.
//
//=========================================================================================================

function initializeBoard() {
  gameBoard.height = gameCtrl.board.rows * gameCtrl.board.blockSize;
  gameBoard.width = gameCtrl.board.cols * gameCtrl.board.blockSize;
  document.querySelector("#highScore").innerHTML =
    localStorage.getItem("highScore");
}

//=========================================================================================================
// placeFood()
// This will place the food randomly in the game board
// (0-1)*cols => Floor(0-19.99999) => (0-19) * 25
//
//=========================================================================================================

function placeFood() {
  gameCtrl.food.x =
    Math.floor(Math.random() * gameCtrl.board.cols) * gameCtrl.board.blockSize;
  gameCtrl.food.y =
    Math.floor(Math.random() * gameCtrl.board.rows) * gameCtrl.board.blockSize;
}

//=========================================================================================================
// updateBoard()
// This is called in the setInterval to update the board.
//
//=========================================================================================================

function updateBoard() {
  drawBoard();

  drawFood();

  checkForSnakeFoodCollision();

  makeSnakeBody();

  drawSnake();

  CheckForGameOver();
}

//=========================================================================================================
// CheckForGameOver()
// Game is over when the snake collides with the board edges or when the snake collides with its
// own body.
//
//=========================================================================================================
function CheckForGameOver() {
  let gameOver = false;
  // Check for board edges collision
  if (
    gameCtrl.snake.x < 0 ||
    gameCtrl.snake.x > gameCtrl.board.cols * gameCtrl.board.blockSize ||
    gameCtrl.snake.y < 0 ||
    gameCtrl.snake.y > gameCtrl.board.rows * gameCtrl.board.blockSize
  ) {
    gameOver = true;
  }

  // Check for body collision
  for (let i = 0; i < gameCtrl.snake.body.length && !gameOver; i++) {
    if (
      gameCtrl.snake.x == gameCtrl.snake.body[i][0] &&
      gameCtrl.snake.y == gameCtrl.snake.body[i][1]
    ) {
      gameOver = true;
    }
  }

  if (gameOver) {
    updateHighScore();
    openScoreModal();
    resetGame();
  }
}

//=========================================================================================================
// checkForSnakeFoodCollision()
// When the snakes eats its food, place the food in new random location and increment the score.
//
//=========================================================================================================

function checkForSnakeFoodCollision() {
  if (
    gameCtrl.snake.x === gameCtrl.food.x &&
    gameCtrl.snake.y === gameCtrl.food.y
  ) {
    gameCtrl.snake.body.push([gameCtrl.food.x, gameCtrl.food.y]);
    placeFood();

    document.querySelector("#score").innerHTML = gameCtrl.score += 1;
  }
}

//=========================================================================================================
// makeSnakeBody()
//
//
//=========================================================================================================

function makeSnakeBody() {
  for (let i = gameCtrl.snake.body.length - 1; i > 0; i--) {
    gameCtrl.snake.body[i] = gameCtrl.snake.body[i - 1];
  }

  if (gameCtrl.snake.body.length) {
    gameCtrl.snake.body[0] = [gameCtrl.snake.x, gameCtrl.snake.y];
  }
}

//=========================================================================================================
// drawBoard()
//
//
//=========================================================================================================

function drawBoard() {
  gameContext.fillStyle = "#b5dd64";
  gameContext.fillRect(0, 0, gameBoard.height, gameBoard.width);
}

//=========================================================================================================
// drawFood()
//
//
//=========================================================================================================

function drawFood() {
  gameContext.fillStyle = "#cc3300";
  gameContext.fillRect(
    gameCtrl.food.x,
    gameCtrl.food.y,
    gameCtrl.board.blockSize,
    gameCtrl.board.blockSize
  );
}

//=========================================================================================================
// drawSnake()
//
//
//=========================================================================================================

function drawSnake() {
  gameContext.fillStyle = "#3385ff";
  gameCtrl.snake.x += gameCtrl.snake.velocityX * gameCtrl.board.blockSize;
  gameCtrl.snake.y += gameCtrl.snake.velocityY * gameCtrl.board.blockSize;
  gameContext.fillRect(
    gameCtrl.snake.x,
    gameCtrl.snake.y,
    gameCtrl.board.blockSize,
    gameCtrl.board.blockSize
  );
  for (let i = 0; i < gameCtrl.snake.body.length; i++) {
    gameContext.fillRect(
      gameCtrl.snake.body[i][0],
      gameCtrl.snake.body[i][1],
      gameCtrl.board.blockSize,
      gameCtrl.board.blockSize
    );
  }
}

//=========================================================================================================
// changeDirection()
// This is responsible for moving the snake in the key pressed direction and prevent the snake
// from moving in the direction of its own body.
//
//=========================================================================================================

function changeDirection(e) {
  if (!isScoreModalOpen) {
    if (e.code == "ArrowUp" && gameCtrl.snake.velocityY != 1) {
      gameCtrl.snake.velocityX = 0;
      gameCtrl.snake.velocityY = -1;
    } else if (e.code == "ArrowDown" && gameCtrl.snake.velocityY != -1) {
      gameCtrl.snake.velocityX = 0;
      gameCtrl.snake.velocityY = 1;
    } else if (e.code == "ArrowLeft" && gameCtrl.snake.velocityX != 1) {
      gameCtrl.snake.velocityX = -1;
      gameCtrl.snake.velocityY = 0;
    } else if (e.code == "ArrowRight" && gameCtrl.snake.velocityX != -1) {
      gameCtrl.snake.velocityX = 1;
      gameCtrl.snake.velocityY = 0;
    }
  }
}

//=========================================================================================================
// Helper functions
// resetGame() - Reset the board for the new game
// updateHighScore() - Update the high score in the local storage
//
//=========================================================================================================
function resetGame() {
  gameCtrl.reset();
  document.querySelector("#score").innerHTML = 0;
}

function updateHighScore() {
  if (localStorage.getItem("highScore") < gameCtrl.score)
    localStorage.setItem("highScore", gameCtrl.score);
}

//=========================================================================================================
// Modal
// Two modals are used - one for displaying instructions and other for displaying the score.
//
//=========================================================================================================

// Modal - Instruction

let modalInstruction = document.querySelector("#modalInstruction");
document.querySelector(".closeBtn").addEventListener("click", closeModal);

function openInstruction() {
  modalInstruction.style.display = "block";
}

function closeModal() {
  modalInstruction.style.display = "none";
}

function outsideClick(e) {
  if (e.target === modalInstruction) {
    modalInstruction.style.display = "none";
  }
}

// Modal - Scoreboard

let modalScoreBoard = document.querySelector("#modalScoreBoard");
document.querySelector(".playBtn").addEventListener("click", playAgain);

function openScoreModal() {
  isScoreModalOpen = true;
  modalScoreBoard.style.display = "block";
  document.querySelector("#modalScore").innerHTML = gameCtrl.score;
  document.querySelector("#modalHighScore").innerHTML =
    localStorage.getItem("highScore");
}

function playAgain() {
  isScoreModalOpen = false;
  modalScoreBoard.style.display = "none";
  resetGame();
}
