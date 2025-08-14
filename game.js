const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Game state
let gameActive = false;
let football = { x: 50, y: 200, radius: 12, velocity: 0 };
let defenders = [];
let score = 0;
let gravity = 0.4;
let jump = -7;

// Menu elements
const startMenu = document.getElementById("startMenu");
const gameOverMenu = document.getElementById("gameOver");
const creditsMenu = document.getElementById("credits");
const finalScore = document.getElementById("finalScore");

// Buttons
document.getElementById("startBtn").onclick = startCountdown;
document.getElementById("shopBtn").onclick = () => alert("Shop coming in Phase 2!");
document.getElementById("creditsBtn").onclick = () => {
  startMenu.classList.add("hidden");
  creditsMenu.classList.remove("hidden");
};
document.getElementById("backFromCredits").onclick = () => {
  creditsMenu.classList.add("hidden");
  startMenu.classList.remove("hidden");
};
document.getElementById("restartBtn").onclick = startCountdown;
document.getElementById("homeBtn").onclick = () => {
  gameOverMenu.classList.add("hidden");
  startMenu.classList.remove("hidden");
};

// Tap to flap
document.addEventListener("touchstart", () => {
  if (gameActive) football.velocity = jump;
});
document.addEventListener("mousedown", () => {
  if (gameActive) football.velocity = jump;
});

function startCountdown() {
  startMenu.classList.add("hidden");
  gameOverMenu.classList.add("hidden");
  creditsMenu.classList.add("hidden");

  let countdown = 3;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.font = "48px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(countdown, canvas.width / 2, canvas.height / 2);

  const timer = setInterval(() => {
    countdown--;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(countdown > 0 ? countdown : "GO!", canvas.width / 2, canvas.height / 2);

    if (countdown < 0) {
      clearInterval(timer);
      startGame();
    }
  }, 1000);
}

function startGame() {
  football = { x: 50, y: 200, radius: 12, velocity: 0 };
  defenders = [];
  score = 0;
  gameActive = true;
  requestAnimationFrame(gameLoop);
}

function spawnDefender() {
  const gap = 100;
  const topHeight = Math.random() * (canvas.height - gap - 50) + 20;
  defenders.push({
    x: canvas.width,
    top: topHeight,
    bottom: topHeight + gap,
    width: 30
  });
}

function gameLoop() {
  if (!gameActive) return;

  // Background football field
  ctx.fillStyle = "#004C54";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Draw football
  ctx.fillStyle = "#A67C52";
  ctx.beginPath();
  ctx.ellipse(football.x, football.y, football.radius * 1.5, football.radius, 0, 0, Math.PI * 2);
  ctx.fill();

  // Football movement
  football.velocity += gravity;
  football.y += football.velocity;

  // Spawn defenders
  if (Math.random() < 0.02) spawnDefender();

  // Move and draw defenders
  ctx.fillStyle = "#222";
  defenders.forEach((d, i) => {
    d.x -= 2;
    // Top defender
    ctx.fillRect(d.x, 0, d.width, d.top);
    // Bottom defender
    ctx.fillRect(d.x, d.bottom, d.width, canvas.height - d.bottom);

    // Collision detection
    if (
      football.x + football.radius > d.x &&
      football.x - football.radius < d.x + d.width &&
      (football.y - football.radius < d.top || football.y + football.radius > d.bottom)
    ) {
      endGame();
    }

    // Score update
    if (d.x + d.width < football.x - football.radius && !d.passed) {
      d.passed = true;
      score++;
    }

    // Remove off-screen defenders
    if (d.x + d.width < 0) defenders.splice(i, 1);
  });

  // Out of bounds
  if (football.y - football.radius < 0 || football.y + football.radius > canvas.height) {
    endGame();
  }

  // Draw score
  ctx.fillStyle = "white";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${score}`, 10, canvas.height - 10);

  requestAnimationFrame(gameLoop);
}

function endGame() {
  gameActive = false;
  finalScore.textContent = `Score: ${score}`;
  gameOverMenu.classList.remove("hidden");
}
