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

if (localStorage.getItem("shopItems")) {
    shopItems = JSON.parse(localStorage.getItem("shopItems"));
}
updateCoinDisplay();

// === Button Events (Click + Touch) ===
document.getElementById("startBtn").addEventListener("click", startGame);
document.getElementById("shopBtn").addEventListener("click", openShop);
document.getElementById("creditsBtn").addEventListener("click", openCredits);
document.getElementById("backFromShopBtn").addEventListener("click", closeShop);
document.getElementById("backFromCreditsBtn").addEventListener("click", closeCredits);
document.getElementById("restartBtn").addEventListener("click", restartGame);
document.getElementById("homeBtn").addEventListener("click", goHome);

document.getElementById("startBtn").addEventListener("touchstart", e => { e.preventDefault(); startGame(); });
document.getElementById("shopBtn").addEventListener("touchstart", e => { e.preventDefault(); openShop(); });
document.getElementById("creditsBtn").addEventListener("touchstart", e => { e.preventDefault(); openCredits(); });
document.getElementById("backFromShopBtn").addEventListener("touchstart", e => { e.preventDefault(); closeShop(); });
document.getElementById("backFromCreditsBtn").addEventListener("touchstart", e => { e.preventDefault(); closeCredits(); });
document.getElementById("restartBtn").addEventListener("touchstart", e => { e.preventDefault(); restartGame(); });
document.getElementById("homeBtn").addEventListener("touchstart", e => { e.preventDefault(); goHome(); });

// === Menu Functions ===
function startGame() {
    hideAllScreens();
    canvas.style.display = "block";
    resetGame();
    gameRunning = true;
    gameLoop = setInterval(updateGame, 20);
}

function goHome() {
    hideAllScreens();
    document.getElementById("startScreen").style.display = "flex";
}

function openCredits() {
    hideAllScreens();
    document.getElementById("creditsScreen").style.display = "flex";
}

function closeCredits() {
    hideAllScreens();
    document.getElementById("startScreen").style.display = "flex";
}

function openShop() {
    hideAllScreens();
    document.getElementById("shopScreen").style.display = "flex";
    renderShop();
}

function closeShop() {
    hideAllScreens();
    document.getElementById("startScreen").style.display = "flex";
}

function hideAllScreens() {
    document.querySelectorAll(".overlay").forEach(el => el.style.display = "none");
    canvas.style.display = "none";
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

// === Game Logic ===
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

        ctx.fillStyle = "green";
        ctx.fillRect(d.x, 0, defenderWidth, d.y);
        ctx.fillRect(d.x, d.y + defenderGap, defenderWidth, canvas.height - (d.y + defenderGap));

        if (ball.x + ball.radius > d.x && ball.x - ball.radius < d.x + defenderWidth) {
            if (ball.y - ball.radius < d.y || ball.y + ball.radius > d.y + defenderGap) {
                endGame();
                return;
            }
        }

        if (d.x + defenderWidth < ball.x && !d.passed) {
            score++;
            d.passed = true;
        }
    }

    if (defenders.length && defenders[0].x + defenderWidth < 0) {
        defenders.shift();
    }

    if (defenders.length < 2) {
        spawnDefender();
    }

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
    hideAllScreens();
    document.getElementById("gameOverScreen").style.display = "flex";
}

function restartGame() {
    startGame();
}

// Controls for desktop + mobile
document.addEventListener("keydown", () => {
    if (gameRunning) ball.velocity = ball.lift;
});
document.addEventListener("mousedown", () => {
    if (gameRunning) ball.velocity = ball.lift;
});
document.addEventListener("touchstart", e => {
    e.preventDefault();
    if (gameRunning) ball.velocity = ball.lift;
});