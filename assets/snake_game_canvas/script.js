// Copyright by: Michael Oslizlo.
// Version: 1.0.0
// Final date release: 21.11.2023
// Final time spended in project: about: 45.5 hours.
// Help documentations:
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API
// -----------------------------------------------------------

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const startSound = new Audio("start.mp3");
const dieSound = new Audio("die.mp3");
const scoreSound = new Audio("score.mp3");
const shootSound = new Audio("shoot.mp3");
const pauseSound = new Audio("pause.mp3");
const gameMusic = new Audio("ingamemusic.mp3");

const volumeControl = document.getElementById("volumeControl");
const sounds = [startSound, dieSound, pauseSound, gameMusic, shootSound, scoreSound];

// Funkcja ustawiająca głośność na podstawie wartości suwaka
function setVolume() {
  const volume = volumeControl.value / 100; // Normalizuj wartość do zakresu 0-1
  for (const sound of sounds) {
    sound.volume = volume;
  }
  saveVolumeToCookie(volume); // Zapisz głośność do pliku cookie
}

// Funkcja zapisująca głośność do pliku cookie
function saveVolumeToCookie(volume) {
  document.cookie = `volume=${volume}`;
}

// Funkcja wczytująca głośność z pliku cookie i ustawiająca suwak
function loadVolumeFromCookie() {
  const cookieValue = document.cookie.replace(
    /(?:(?:^|.*;\s*)volume\s*=\s*([^;]*).*$)|^.*$/,
    "$1"
  );
  const savedVolume = cookieValue !== "" ? parseFloat(cookieValue) : 0.2;
  volumeControl.value = savedVolume * 100;
  setVolume(); // Ustaw głośność na podstawie wczytanej wartości
}

// Ustawienie głośności na początku (wczytanie z pliku cookie)
loadVolumeFromCookie();
gameMusic.loop = true;

// Nasłuchiwanie na zdarzenie input (zmiany wartości suwaka)
volumeControl.addEventListener("input", setVolume);

const gridSize = 10;
const snakeColor = "green";
const foodColor = "red";
const enemyColor = "gray";
const bulletColor = "black";
const powerupColor = "orange";
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
let ingameTime = 0;
let gameOver = false;
let isPaused = false;
let level = 1;
let levelSpeedMultiplier = 0.9;
let goldenAppleActive = false;

let lastTime = 0;
let targetFPS = 50;
let fps_limiter = 1000 / targetFPS;

let hpRegenerationInterval = 500;
let hpRegenerationAmount = 1;
let i = 0;
let temp = 0;

let enemyShootInterval = 2000;
let lastShotTime = 0;

let powerup = null;
let invincibilityActive = false;

let goldenAppleDuration = 10000;
let goldenAppleTimer = 0;

function drawStartText() {
  ctx.font = "24px Consolas";
  ctx.fillStyle = "#000000";
  ctx.fillText("Press left mouse button", 173, 300);
  ctx.fillText("on this square to start.", 169, 330);
  ctx.font = "20px Consolas";
  ctx.fillStyle = "#0000ff";
  ctx.fillText("Version: 1.0.0 (Final) (Last update -> 21.11.2023)", 0, 650);
}

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
  const timeToLive = isGoldenApple ? goldenAppleDuration : Math.floor(Math.random() * 26) + 5;

  return {
    x: Math.floor(Math.random() * gridWidth),
    y: Math.floor(Math.random() * gridHeight),
    isGoldenApple: isGoldenApple,
    timeToLive: timeToLive * 1000, // Convert seconds to milliseconds
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
      health = 100;
      temp = hpRegenerationInterval;
      hpRegenerationInterval = 0;
      powerup = null; // Dodaj tę linię
      setTimeout(() => {
        invincibilityActive = false;
        hpRegenerationInterval = temp;
      }, 10000);
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
      invincibilityActive = false;
      health = 100;
    }, 10000);
  }
}

function handleBulletCollision() {
  if (enemyBullet && enemyBullet.x === snake[0].x && enemyBullet.y === snake[0].y) {
    health -= 50;
    enemyBullet = null;
    if (health <= 0) {
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
  }
}

function draw() {
  if (gameOver) {
    health = 0;
    deaths = 1;
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
    gameMusic.pause();
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
    gameMusic.pause();
    return;
  } else {
    if (gameMusic.paused) {
      gameMusic.play();
    }
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

  for (let i = 1; i < snake.length; i++) {
    if (headX === snake[i].x && headY === snake[i].y) {
      dieSound.play();
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
      console.log("Game ended. Snake poped.");
    }
  }

  if (headX === food.x && headY === food.y) {
    score++;
    scoreSound.play();
    food = generateFood();
    timeLeft += 30;

    if (score % 5 === 0) {
      level++;
      enemyShootInterval *= levelSpeedMultiplier;
    }

    if (powerup && powerup.isGoldenApple) {
      activateGoldenApple();
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

  ctx.fillStyle = "red";
  ctx.fillRect(5, 635, health * 2.55, 3);

  updateFPS();
  drawFPS();

  drawPowerup();
  drawInvincibilityStatus();
  checkCollisionWithPowerup();
  handleBulletCollision();

  ctx.fillStyle = "#000000";
  ctx.fillText(`Time left (Blue bar value): ${Math.round(timeLeft / 8)} s`, 10, 620);
  ctx.fillText(`In-game time:`, 530, 20);
  ctx.fillText(`${Math.round(ingameTime)} s`, 530, 40);

  if (goldenAppleActive) {
    ctx.fillStyle = goldenAppleColor;
    ctx.fillRect(10, 120, (goldenAppleTimer / goldenAppleDuration) * 100, 10);
    goldenAppleTimer -= fps_limiter;
    if (goldenAppleTimer <= 0) {
      goldenAppleActive = false;
      powerup = null;
      invincibilityActive = false;
      health = 100;
    }
  }

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
    if (health <= 0) {
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
  }

  if (enemyBullet && enemyBullet.x === enemy.x && enemyBullet.y === enemy.y) {
    enemyBullet = null;
  }

  if (powerup && snake[0].x === powerup.x && snake[0].y === powerup.y) {
    if (powerup.isGoldenApple) {
      activateGoldenApple();
    } else {
      invincibilityActive = true;
      health = 100;
      setTimeout(() => {
        invincibilityActive = false;
        powerup = null;
      }, 10000);
    }
  }

  setTimeout(() => {
    requestAnimationFrame(draw);
  }, targetFPS);
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
  if (gameStarted) {
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
  }
}, enemyShootInterval);

setInterval(() => {
  if (gameStarted) {
    powerup = generatePowerup();
  }
}, 10000);

setInterval(() => {
  if (gameStarted) {
    ingameTime++;
  }
}, 1000);

function clickHandler() {
  startSound.play();
  gameMusic.play();
  draw();
}

function startGame() {
  if (!gameStarted) {
    console.log("Game started!");
    console.log(canvas);
    canvas.removeEventListener("click", clickHandler);
    gameStarted = true;
    startSound.play();
    gameMusic.play();
    draw(); // Rozpocznij grę
  }
}

canvas.addEventListener("click", startGame);
drawStartText();
// Desktop Key Handler
window.addEventListener("keydown", handleKeydown);

function openModal() {
  // Tworzymy nowe elementy modalu
  var modalContainer = document.createElement('div');
  modalContainer.id = 'modal-container';
  modalContainer.style.display = 'flex';
  modalContainer.style.position = 'fixed';
  modalContainer.style.top = '0';
  modalContainer.style.left = '0';
  modalContainer.style.width = '100%';
  modalContainer.style.height = '100%';
  modalContainer.style.background = 'rgba(0, 0, 0, 0.85)';
  modalContainer.style.alignItems = 'center';
  modalContainer.style.justifyContent = 'center';
  document.body.appendChild(modalContainer);

  var modalContent = document.createElement('div');
  modalContent.id = 'modal-content';
  modalContent.style.background = '#000';
  modalContent.style.color = '#fff';
  modalContent.style.padding = '20px';
  modalContent.style.fontSize = '20px';
  modalContent.style.borderRadius = '15px';
  modalContent.style.textAlign = 'center';
  modalContainer.appendChild(modalContent);

  var closeButton = document.createElement('span');
  closeButton.id = 'close-btn';
  closeButton.innerHTML = '&times;';
  closeButton.style.cursor = 'pointer';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '10px';
  closeButton.style.right = '10px';
  closeButton.style.fontSize = '18px';
  closeButton.onclick = function () {
    closeModal(false);
  };
  modalContent.appendChild(closeButton);

  var modalTitle = document.createElement('div');
  modalTitle.id = 'modal-title';
  modalTitle.innerHTML = 'Mobile Support';
  modalTitle.style.fontSize = '48px';
  modalTitle.style.marginBottom = '10px';
  modalTitle.style.color = '#E91E63';
  modalContent.appendChild(modalTitle);

  var modalText = document.createElement('p');
  modalText.innerHTML = 'It appears that you are using a mobile device. Would you like to proceed to the mobile version of the Snake game?';
  modalContent.appendChild(modalText);

  var modalButtons = document.createElement('div');
  modalButtons.id = 'modal-buttons';
  modalButtons.style.marginTop = '20px';
  modalContent.appendChild(modalButtons);

  var closeButtonDynamic = document.createElement('button');
  closeButtonDynamic.className = 'modal-btn';
  closeButtonDynamic.innerHTML = 'Close';
  closeButtonDynamic.style.fontSize = '18px';
  closeButtonDynamic.style.padding = '10px 20px';
  closeButtonDynamic.style.backgroundColor = '#EFAE95';
  closeButtonDynamic.style.marginRight = '5px';
  closeButtonDynamic.onclick = function () {
    closeModal(false);
  };
  modalButtons.appendChild(closeButtonDynamic);

  var okButton = document.createElement('button');
  okButton.className = 'modal-btn';
  okButton.innerHTML = 'OK';
  okButton.style.fontSize = '18px';
  okButton.style.padding = '10px 20px';
  okButton.style.backgroundColor = '#2196F3';
  okButton.onclick = function () {
    closeModal(true);
  };
  modalButtons.appendChild(okButton);
}

function closeModal(result) {
  var modalContainer = document.getElementById('modal-container');
  modalContainer.parentNode.removeChild(modalContainer);
  console.log("Modal result:", result);
  if (result == true) {
    window.location.href = window.location.href + '?device=mobile';
  }
}

// Check if the 'device' parameter is present in the URL
const urlParams = new URLSearchParams(window.location.search);
const isMobileParam = urlParams.get('device') === 'mobile';

// Check if the screen width is below a certain threshold to consider it a mobile device
const isMobileResolution = window.innerWidth <= 768;

// Add touch event listeners if on mobile or if the parameter is present
if (isMobileParam || isMobileResolution) {
  console.log("Mobile controls activated.");

  // Redirect to the same page with the 'device' parameter if not already present
  if (!isMobileParam) {
    openModal();
  }

  document.addEventListener("touchstart", handleTouchStart);
  document.addEventListener("touchend", handleTouchEnd);

  // Remove the 'options' div if it exists
  const optionsDiv = document.getElementById('options');
  if (optionsDiv) {
    optionsDiv.remove();
  }
} else {
  console.log("Mobile controls not activated.");
}

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(e) {
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
}

function handleTouchEnd(e) {
  const touchEndX = e.changedTouches[0].clientX;
  const touchEndY = e.changedTouches[0].clientY;

  const deltaX = touchEndX - touchStartX;
  const deltaY = touchEndY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    // Horizontal swipe
    if (deltaX > 0 && direction !== "left") direction = "right";
    else if (deltaX < 0 && direction !== "right") direction = "left";
  } else {
    // Vertical swipe
    if (deltaY > 0 && direction !== "up") direction = "down";
    else if (deltaY < 0 && direction !== "down") direction = "up";
  }
}

if (!isMobileParam && !isMobileResolution) {
  document.getElementById('showDebugLogButton').addEventListener('click', function () {
    let temp = prompt("Do you seriously want to show the debug log? (Y/N)");
    while (true) {
      if (temp == "N") {
        console.log("Debug broken.")
        break;
      } else {
        console.log("Debug show enabled.")
        ShowDebugLog();
        break;
      }
    }
  });
}

function debugGame() {
  const debugData = {
    gameStarted,
    snake,
    direction,
    food,
    score,
    highScore,
    deaths,
    health,
    enemy,
    enemyBullet,
    timeLeft,
    gameOver,
    isPaused,
    level,
    levelSpeedMultiplier,
    goldenAppleActive,
    lastTime,
    targetFPS,
    fps_limiter,
    hpRegenerationInterval,
    hpRegenerationAmount,
    i,
    temp,
    enemyShootInterval,
    lastShotTime,
    powerup,
    invincibilityActive,
  };

  return debugData;
}

function ShowDebugLog() {
  console.table(debugGame()); // Wyświetl dane w formie tabeli
}

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
