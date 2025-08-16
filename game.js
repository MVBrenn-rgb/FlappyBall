const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Scale canvas for iPhone
function resizeCanvas() {
  const scale = Math.min(window.innerWidth / 320, window.innerHeight / 480);
  canvas.width = 320;
  canvas.height = 480;
  canvas.style.width = (320 * scale) + "px";
  canvas.style.height = (480 * scale) + "px";
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

// Screens
const startScreen = document.getElementById("startScreen");
const shopScreen = document.getElementById("shopScreen");
const creditsScreen = document.getElementById("creditsScreen");
const gameOverScreen = document.getElementById("gameOverScreen");
const scoreboard = document.getElementById("scoreboard");

// Buttons
document.getElementById("startBtn").onclick = startGame;
document.getElementById("shopBtn").onclick = () => switchScreen(shopScreen);
document.getElementById("creditsBtn").onclick = () => switchScreen(creditsScreen);
document.getElementById("backFromShop").onclick = () => switchScreen(startScreen);
document.getElementById("backFromCredits").onclick = () => switchScreen(startScreen);
document.getElementById("restartBtn").onclick = startGame;
document.getElementById("homeBtn").onclick = () => switchScreen(startScreen);

function switchScreen(screen) {
  [startScreen, shopScreen, creditsScreen, gameOverScreen].forEach(s => s.classList.add("hidden"));
  scoreboard.classList.add("hidden");
  if (screen) screen.classList.remove("hidden");
}

// Game vars
let ball, gravity, velocity, score, running, loop;

function resetGame() {
  ball = { x: 50, y: 200, r: 12 };
  gravity = 0.5;
  velocity = 0;
  score = 0;
}

function startGame() {
  resetGame();
  switchScreen(null); // hide all screens
  scoreboard.classList.remove("hidden");
  running = true;
  loop = requestAnimationFrame(update);
}

function endGame() {
  running = false;
  cancelAnimationFrame(loop);
  document.getElementById("finalScore").innerText = "Score: " + score;
  switchScreen(gameOverScreen);
}

// Controls
function flap() {
  if (running) velocity = -7;
}
canvas.addEventListener("mousedown", flap);
canvas.addEventListener("touchstart", flap);

// Game loop
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // physics
  velocity += gravity;
  ball.y += velocity;

  // boundaries
  if (ball.y + ball.r > canvas.height || ball.y - ball.r < 0) {
    endGame();
    return;
  }

  // draw ball
  ctx.fillStyle = "brown";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  // score
  score++;
  scoreboard.innerText = score;

  if (running) loop = requestAnimationFrame(update);
}