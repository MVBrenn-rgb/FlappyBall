let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

canvas.width = 320;
canvas.height = 480;

let gameInterval;
let score = 0;
let ball, gravity, velocity, obstacles, isGameOver = false;

function startGame() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("creditsScreen").classList.add("hidden");
  document.getElementById("gameOverScreen").classList.add("hidden");
  canvas.classList.remove("hidden");

  resetGame();
  gameInterval = setInterval(updateGame, 20);

  window.addEventListener("keydown", flap);
  window.addEventListener("touchstart", flap);
}

function resetGame() {
  ball = { x: 50, y: 200, size: 20 };
  gravity = 0.4;
  velocity = 0;
  obstacles = [];
  score = 0;
  isGameOver = false;
}

function flap() {
  if (!isGameOver) velocity = -6;
}

function updateGame() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ball physics
  velocity += gravity;
  ball.y += velocity;
  ctx.fillStyle = "brown";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.size, 0, Math.PI * 2);
  ctx.fill();

  // Check floor/ceiling
  if (ball.y + ball.size > canvas.height || ball.y - ball.size < 0) {
    endGame();
  }

  // Obstacles
  if (Math.random() < 0.02) {
    let gap = 120;
    let topHeight = Math.floor(Math.random() * (canvas.height - gap));
    obstacles.push({ x: canvas.width, top: topHeight, bottom: topHeight + gap });
  }

  for (let i = 0; i < obstacles.length; i++) {
    let obs = obstacles[i];
    obs.x -= 2;
    ctx.fillStyle = "green";
    ctx.fillRect(obs.x, 0, 40, obs.top);
    ctx.fillRect(obs.x, obs.bottom, 40, canvas.height - obs.bottom);

    // Collision
    if (
      ball.x + ball.size > obs.x &&
      ball.x - ball.size < obs.x + 40 &&
      (ball.y - ball.size < obs.top || ball.y + ball.size > obs.bottom)
    ) {
      endGame();
    }

    if (obs.x + 40 < ball.x && !obs.scored) {
      score++;
      obs.scored = true;
    }
  }

  ctx.fillStyle = "white";
  ctx.font = "20px Arial";
  ctx.fillText("Score: " + score, 10, 25);
}

function endGame() {
  clearInterval(gameInterval);
  isGameOver = true;
  document.getElementById("finalScore").innerText = "Score: " + score;
  document.getElementById("gameOverScreen").classList.remove("hidden");
}

function restartGame() {
  startGame();
}

function goHome() {
  clearInterval(gameInterval);
  canvas.classList.add("hidden");
  document.getElementById("gameOverScreen").classList.add("hidden");
  document.getElementById("creditsScreen").classList.add("hidden");
  document.getElementById("startScreen").classList.remove("hidden");
}

function showCredits() {
  document.getElementById("startScreen").classList.add("hidden");
  document.getElementById("creditsScreen").classList.remove("hidden");
}