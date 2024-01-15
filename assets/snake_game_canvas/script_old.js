const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startSound = new Audio("start.mp3");
const dieSound = new Audio("die.mp3");
const scoreSound = new Audio("score.mp3");
const shootSound = new Audio("shoot.mp3");
const pauseSound = new Audio("pause.mp3");
const gameMusic = new Audio("ingamemusic.mp3");

gameMusic.volume = 0.5;
shootSound.volume = 0.5;
scoreSound.volume = 0.5;

const gridSize = 10;
const snakeColor = "green";
const foodColor = "red";
const enemyColor = "gray";
const bulletColor = "black";
const powerupColor = "yellow";
const goldenAppleColor = "gold";
const gridWidth = canvas.width / gridSize;
const gridHeight = canvas.height / gridSize;

let gameStarted = false;
let snake = [{ x: 5, y: 5 }];
let direction = "right";
let food = generateFood();
let score = 0;
let highScore = getHighScore();
let deaths = 0;
let health = 100;
let enemy = generateEnemy();
let enemyBullet = null;
let timeLeft = 255;
let gameOver = false;
let isPaused = false;
let level = 1;
let levelSpeedMultiplier = 0.9;
let goldenAppleActive = false;

let lastTime = 0;
let targetFPS = 15;
let fps_limiter = 1000 / targetFPS;

let hpRegenerationInterval = 500;
let hpRegenerationAmount = 1;
let i = 0;

let enemyShootInterval = 2000;
let lastShotTime = 0;

let powerup = null;
let invincibilityActive = false;

function updateFPS() {
  const now = performance.now();
  fps_limiter = 1000 / (now - lastTime);
  lastTime = now;
}

function drawFPS() {
  ctx.font = "16px Consolas";
  ctx.fillStyle = "black";
  ctx.fillText(`FPS: ${Math.round(fps_limiter)}`, 10, 20);
}

function generateFood() {
  return {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };
}

function generateEnemy() {
  return {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
  };
}

function moveEnemyBullet() {
  if (enemyBullet) {
    let dx = snake[0].x - enemyBullet.x;
    let dy = snake[0].y - enemyBullet.y;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0) enemyBullet.x++;
      else if (dx < 0) enemyBullet.x--;
    } else {
      if (dy > 0) enemyBullet.y++;
      else if (dy < 0) enemyBullet.y--;
    }

    if (
      enemyBullet.x < 0 ||
      enemyBullet.x >= gridWidth ||
      enemyBullet.y < 0 ||
      enemyBullet.y >= gridHeight
    ) {
      enemyBullet = null;
    }
  }
}

function generatePowerup() {
  const isGoldenApple = Math.random() < 0.1;
  return {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
    isGoldenApple: isGoldenApple,
  };
}

function drawPowerup() {
  if (powerup) {
    ctx.fillStyle = powerup.isGoldenApple ? goldenAppleColor : powerupColor;
    ctx.fillRect(
      powerup.x * gridSize,
      powerup.y * gridSize,
      gridSize,
      gridSize
    );
  }
}

function checkCollisionWithPowerup() {
  if (powerup && snake[0].x === powerup.x && snake[0].y === powerup.y) {
    if (powerup.isGoldenApple) {
      activateGoldenApple();
    } else {
      invincibilityActive = true;
      setTimeout(() => {
        invincibilityActive = false;
        powerup = null;
      }, 5000);
    }
  }
}

function drawInvincibilityStatus() {
  if (invincibilityActive && !goldenAppleActive) {
    ctx.fillStyle = goldenAppleColor;
    ctx.fillText("Invincibility", 10, 140);
  }
}

function activateGoldenApple() {
  if (!goldenAppleActive) {
    goldenAppleActive = true;
    setTimeout(() => {
      goldenAppleActive = false;
      powerup = null;
    }, 5000);
  }
}

function draw() {
  if (gameOver) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Consolas";
    ctx.fillStyle = "#ff0000";
    ctx.fillText("Game Over!", 265, 100);
    ctx.font = "16px Consolas";
    ctx.fillStyle = "black";
    ctx.fillText("Press F5 to restart", 244, 150);
    ctx.fillText(`Score: ${score}`, 10, 40);
    ctx.fillText(`High Score: ${highScore}`, 10, 60);
    ctx.fillText(`Health: ${health}%`, 10, 80);
    ctx.fillText(`Deaths: ${deaths}`, 10, 100);
    return;
  }

  if (isPaused) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "24px Consolas";
    ctx.fillStyle = "#000000";
    ctx.fillText("Paused", 280, 100);
    ctx.font = "16px Consolas";
    ctx.fillStyle = "black";
    ctx.fillText("Press Esc to resume", 240, 150);
    return;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  let headX = snake[0].x;
  let headY = snake[0].y;
  if (direction === "right") headX++;
  if (direction === "left") headX--;
  if (direction === "up") headY--;
  if (direction === "down") headY++;

  if (headX < 0) headX = gridWidth - 1;
  if (headX >= gridWidth) headX = 0;
  if (headY < 0) headY = gridHeight - 1;
  if (headY >= gridHeight) headY = 0;

  if (headX === food.x && headY === food.y) {
    score++;
    scoreSound.play();
    food = generateFood();
    timeLeft += 30;
    targetFPS += 1;
    fps_limiter = 1000 / targetFPS;

    if (score % 5 === 0) {
      level++;
      enemyShootInterval *= levelSpeedMultiplier;
    }
  } else {
    snake.pop();
  }

  if (headX === enemy.x && headY === enemy.y) {
    dieSound.play();
    health -= 20;
    if (health <= 0) {
      deaths++;
      if (score > highScore) {
        highScore = score;
        setHighScore(highScore);
      }
      snake = [{ x: 5, y: 5 }];
      direction = "right";
      score = 0;
      health = 100;
      timeLeft = 255;
      gameOver = true;
      gameMusic.pause();
    }
    enemy = generateEnemy();
  }

  if (health < 100) {
    if (i >= hpRegenerationInterval / fps_limiter) {
      health += hpRegenerationAmount;
      if (health > 0) {
        i = 0;
      } else {
        health = 0;
        deaths++;
        if (score > highScore) {
          highScore = score;
          setHighScore(highScore);
        }
        snake = [{ x: 5, y: 5 }];
        direction = "right";
        score = 0;
        timeLeft = 255;
        gameOver = true;
        gameMusic.pause();
      }
    } else {
      i++;
    }
  }

  snake.unshift({ x: headX, y: headY });

  ctx.fillStyle = foodColor;
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = enemyColor;
  ctx.fillRect(enemy.x * gridSize, enemy.y * gridSize, gridSize, gridSize);

  ctx.fillStyle = snakeColor;
  for (let segment of snake) {
    ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize, gridSize);
  }

  ctx.font = "16px Consolas";
  ctx.fillStyle = "black";
  ctx.fillText(`Score: ${score}`, 10, 40);
  ctx.fillText(`High Score: ${highScore}`, 10, 60);
  ctx.fillText(`Health: ${health}%`, 10, 80);
  ctx.fillText(`Deaths: ${deaths}`, 10, 100);
  ctx.fillText(`Level: ${level} (${Math.round((targetFPS / 30) * 100)}%)`, 10, 120);

  ctx.fillStyle = "blue";
  ctx.fillRect(5, 640, timeLeft, 3);
  timeLeft -= 0.5;
  if (timeLeft >= 255) {
    timeLeft = 255;
  }
  if (timeLeft <= 0) {
    gameOver = true;
  }

  if (goldenAppleActive) {
    health += 5;
  }

  ctx.fillStyle = "red";
  ctx.fillRect(5, 635, health * 2.55, 3);

  updateFPS();
  drawFPS();

  drawPowerup();
  drawInvincibilityStatus();
  checkCollisionWithPowerup();

  if (enemyBullet) {
    ctx.fillStyle = bulletColor;
    ctx.fillRect(
      enemyBullet.x * gridSize,
      enemyBullet.y * gridSize,
      gridSize,
      gridSize
    );
    moveEnemyBullet();
  }

  if (enemyBullet && enemyBullet.x === snake[0].x && enemyBullet.y === snake[0].y) {
    health -= 50;
    enemyBullet = null;
  }

  if (enemyBullet && enemyBullet.x === enemy.x && enemyBullet.y === enemy.y) {
    enemyBullet = null;
  }

  setTimeout(() => {
    requestAnimationFrame(draw);
  }, 50);
}

function handleKeydown(e) {
  if (gameOver) {
    if (e.key === "Enter") {
      snake = [{ x: 5, y: 5 }];
      direction = "right";
      score = 0;
      deaths = 0;
      health = 100;
      timeLeft = 255;
      gameOver = false;
      gameMusic.play();
    }
    return;
  }

  if (isPaused) {
    if (e.key === "Escape") {
      isPaused = false;
      pauseSound.play();
      requestAnimationFrame(draw);
    }
    return;
  }

  switch (e.key) {
    case "ArrowRight":
    case "d":
      if (direction !== "left") direction = "right";
      break;
    case "ArrowLeft":
    case "a":
      if (direction !== "right") direction = "left";
      break;
    case "ArrowUp":
    case "w":
      if (direction !== "down") direction = "up";
      break;
    case "ArrowDown":
    case "s":
      if (direction !== "up") direction = "down";
      break;
    case "Escape":
      isPaused = true;
      pauseSound.play();
      break;
  }
}

setInterval(() => {
  if (!gameOver && !isPaused) {
    let enemyHeadX = enemy.x;
    let enemyHeadY = enemy.y;

    let dx = snake[0].x - enemyHeadX;
    let dy = snake[0].y - enemyHeadY;

    enemy = { x: enemyHeadX, y: enemyHeadY };

    if (!enemyBullet) {
      enemyBullet = { x: enemy.x, y: enemy.y };
      shootSound.play();
    }
  }
}, enemyShootInterval);

setInterval(() => {
  powerup = generatePowerup();
}, 10000)

function clickHandler() {
  startSound.play();
  gameMusic.play();
  draw();
}

if (!gameStarted) {
  canvas.addEventListener("click", clickHandler);
  gameStarted = true;
} else {
  console.log("Game already started!");
  canvas.removeEventListener("click", clickHandler);
  gameStarted = false;
}

window.addEventListener("keydown", handleKeydown);

function setHighScore(value) {
  document.cookie = `highScore=${value}`;
}

function getHighScore() {
  const cookieValue = document.cookie.replace(
    /(?:(?:^|.*;\s*)highScore\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  return cookieValue ? parseInt(cookieValue, 10) : 0;
}
