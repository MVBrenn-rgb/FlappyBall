let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let ball = { x: 50, y: 150, radius: 12, gravity: 0.5, lift: -8, velocity: 0 };
let score = 0;
let gameLoop;
let gameRunning = false;

function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    canvas.style.display = "block";
    resetGame();
    gameRunning = true;
    gameLoop = setInterval(updateGame, 20);
}

function goHome() {
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "flex";
    canvas.style.display = "none";
}

function openCredits() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("creditsScreen").style.display = "flex";
}

function closeCredits() {
    document.getElementById("creditsScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "flex";
}

function resetGame() {
    ball.y = 150;
    ball.velocity = 0;
    score = 0;
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ball physics
    ball.velocity += ball.gravity;
    ball.y += ball.velocity;
    if (ball.y + ball.radius > canvas.height) endGame();

    // Draw ball
    ctx.fillStyle = "brown";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function endGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    document.getElementById("finalScore").textContent = score;
    canvas.style.display = "none";
    document.getElementById("gameOverScreen").style.display = "flex";
}

function restartGame() {
    startGame();
}

// Controls
document.addEventListener("keydown", () => {
    if (gameRunning) ball.velocity = ball.lift;
});
document.addEventListener("mousedown", () => {
    if (gameRunning) ball.velocity = ball.lift;
});
