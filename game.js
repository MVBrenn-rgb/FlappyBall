// === Game Variables ===
let canvas = document.getElementById("gameCanvas");
let ctx = canvas.getContext("2d");

let ball = { x: 50, y: 150, radius: 12, gravity: 0.5, lift: -8, velocity: 0, color: "brown" };
let score = 0;
let coins = parseInt(localStorage.getItem("coins")) || 0;
let selectedBall = localStorage.getItem("selectedBall") || "brown";
let shopItems = [
    { color: "brown", price: 0, owned: true },
    { color: "red", price: 20, owned: false },
    { color: "blue", price: 20, owned: false },
    { color: "gold", price: 50, owned: false }
];
let defenders = [];
let defenderGap = 100;
let defenderWidth = 40;
let defenderSpeed = 2;
let gameRunning = false;
let gameLoop;

// Load shop state
if (localStorage.getItem("shopItems")) {
    shopItems = JSON.parse(localStorage.getItem("shopItems"));
}
updateCoinDisplay();

// === Menu Functions ===
function startGame() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("gameOverScreen").style.display = "none";
    document.getElementById("shopScreen").style.display = "none";
    document.getElementById("creditsScreen").style.display = "none";
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

function openShop() {
    document.getElementById("startScreen").style.display = "none";
    document.getElementById("shopScreen").style.display = "flex";
    renderShop();
}

function closeShop() {
    document.getElementById("shopScreen").style.display = "none";
    document.getElementById("startScreen").style.display = "flex";
}

function renderShop() {
    let shopDiv = document.getElementById("shopItems");
    shopDiv.innerHTML = "";
    shopItems.forEach((item, index) => {
        let div = document.createElement("div");
        div.className = "shopItem";
        div.innerHTML = `
            <div style="width:30px;height:30px;background:${item.color};margin:auto;border-radius:50%;"></div>
            <p>${item.color}</p>
            <p>${item.owned ? "Owned" : item.price + " coins"}</p>
            <button onclick="buyItem(${index})">${item.owned ? "Equip" : "Buy"}</button>
        `;
        shopDiv.appendChild(div);
    });
}

function buyItem(index) {
    let item = shopItems[index];
    if (item.owned) {
        selectedBall = item.color;
        localStorage.setItem("selectedBall", selectedBall);
    } else if (coins >= item.price) {
        coins -= item.price;
        item.owned = true;
        selectedBall = item.color;
        saveShop();
        updateCoinDisplay();
        renderShop();
    } else {
        alert("Not enough coins!");
    }
}

function saveShop() {
    localStorage.setItem("shopItems", JSON.stringify(shopItems));
    localStorage.setItem("coins", coins);
    localStorage.setItem("selectedBall", selectedBall);
}

function updateCoinDisplay() {
    document.getElementById("coinCount").textContent = coins;
}

// === Game Mechanics ===
function resetGame() {
    ball.y = 150;
    ball.velocity = 0;
    ball.color = selectedBall;
    defenders = [];
    score = 0;
    spawnDefender();
}

function spawnDefender() {
    let gapY = Math.floor(Math.random() * (canvas.height - defenderGap - 40)) + 20;
    defenders.push({ x: canvas.width, y: gapY });
}

function updateGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ball physics
    ball.velocity += ball.gravity;
    ball.y += ball.velocity;
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        endGame();
        return;
    }

    // Draw ball
    ctx.fillStyle = ball.color;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Update defenders
    for (let i = 0; i < defenders.length; i++) {
        let d = defenders[i];
        d.x -= defenderSpeed;

        // Top defender
        ctx.fillStyle = "green";
        ctx.fillRect(d.x, 0, defenderWidth, d.y);

        // Bottom defender
        ctx.fillStyle = "green";
        ctx.fillRect(d.x, d.y + defenderGap, defenderWidth, canvas.height - (d.y + defenderGap));

        // Collision check
        if (ball.x + ball.radius > d.x && ball.x - ball.radius < d.x + defenderWidth) {
            if (ball.y - ball.radius < d.y || ball.y + ball.radius > d.y + defenderGap) {
                endGame();
                return;
            }
        }

        // Passed defender
        if (d.x + defenderWidth < ball.x && !d.passed) {
            score++;
            d.passed = true;
        }
    }

    // Remove off-screen defenders
    if (defenders.length && defenders[0].x + defenderWidth < 0) {
        defenders.shift();
    }

    // Add new defenders
    if (defenders.length < 2) {
        spawnDefender();
    }

    // Draw score
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, 10, 20);
}

function endGame() {
    clearInterval(gameLoop);
    gameRunning = false;
    let earned = score;
    coins += earned;
    saveShop();
    document.getElementById("finalScore").textContent = score;
    document.getElementById("coinsEarned").textContent = earned;
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