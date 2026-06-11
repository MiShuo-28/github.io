const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");

navToggle.addEventListener("click", () => {
  const isOpen = navLinks.classList.toggle("is-open");
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    navLinks.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
  });
});

const moodButton = document.getElementById("moodButton");
const moodLines = [
  "今日灵感：把远方写进代码里",
  "今日灵感：先把页面跑起来，再把细节点亮",
  "今日灵感：古城、海风和数据都可以被记录",
  "今日灵感：用一个小作品介绍自己",
  "今日灵感：从寿县出发，去看更大的世界",
];

if (moodButton) {
  moodButton.addEventListener("click", () => {
    const nextLine = moodLines[Math.floor(Math.random() * moodLines.length)];
    moodButton.textContent = nextLine;
  });
}

const lightbox = document.getElementById("travelLightbox");
const lightboxImage = lightbox?.querySelector("img");
const lightboxCaption = lightbox?.querySelector("p");
const lightboxClose = lightbox?.querySelector(".lightbox-close");

document.querySelectorAll(".travel-card").forEach((card) => {
  card.tabIndex = 0;
  const openCard = () => {
    const image = card.querySelector("img");
    const caption = card.querySelector("figcaption");
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    lightboxCaption.textContent = caption.textContent;
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
  };

  card.addEventListener("click", openCard);
  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      openCard();
    }
  });
});

function closeLightbox() {
  lightbox?.classList.remove("is-open");
  lightbox?.setAttribute("aria-hidden", "true");
}

lightboxClose?.addEventListener("click", closeLightbox);
lightbox?.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeLightbox();
  }
});

const countdownText = document.getElementById("countdownText");

function updateCountdown() {
  if (!countdownText) {
    return;
  }

  const target = new Date("2026-09-25T00:00:00+08:00");
  const now = new Date();
  const distance = target.getTime() - now.getTime();

  if (distance <= 0) {
    countdownText.textContent = "中秋快乐";
    return;
  }

  const day = 24 * 60 * 60 * 1000;
  const hour = 60 * 60 * 1000;
  const days = Math.floor(distance / day);
  const hours = Math.floor((distance % day) / hour);
  countdownText.textContent = `${days} 天 ${hours} 小时`;
}

updateCountdown();
setInterval(updateCountdown, 60 * 60 * 1000);

const placeData = {
  shouxian: {
    tag: "家乡起点",
    title: "寿县",
    text: "古城墙、月亮、灯火和家乡味道，是这条路线的起点。",
    image: "assets/new/new-01.jpg",
    alt: "寿县夜晚城墙与月亮",
  },
  xiamen: {
    tag: "海风城市",
    title: "厦门",
    text: "适合慢慢走的海边城市，把风、街道和日落装进相册。",
    image: "assets/travel/travel-03.jpg",
    alt: "海边岩石与蓝色海面",
  },
  nanjing: {
    tag: "古城记忆",
    title: "南京",
    text: "城墙、寺塔和街头夜色，让历史感和城市生活站在一起。",
    image: "assets/travel/travel-06.jpg",
    alt: "南京城墙旅行照片",
  },
  hangzhou: {
    tag: "湖光与夜",
    title: "杭州",
    text: "西湖的远景和夜色很适合做一页安静的旅行笔记。",
    image: "assets/travel/travel-15.jpg",
    alt: "杭州西湖远景",
  },
  sanya: {
    tag: "海岛片段",
    title: "三亚",
    text: "阳光、礁石和浮潜，是相册里最明亮的一段蓝色记忆。",
    image: "assets/travel/travel-02.jpg",
    alt: "三亚浮潜照片",
  },
  eerduosi: {
    tag: "北方远行",
    title: "鄂尔多斯",
    text: "蓝天、黄沙和骆驼队，是和江南古城完全不同的辽阔风景。",
    image: "assets/travel/eerduosi-desert.jpg",
    alt: "鄂尔多斯沙漠与骆驼队",
  },
  kunming: {
    tag: "学习所在",
    title: "昆明",
    text: "现在生活和学习的城市，也是继续做项目、继续出发的地方。",
    image: "assets/hero-workspace.png",
    alt: "个人主页工作台视觉图",
  },
};

const mapInfo = document.getElementById("mapInfo");
const mapButtons = document.querySelectorAll("[data-place]");

function setPlace(placeKey) {
  const place = placeData[placeKey];
  if (!place || !mapInfo) {
    return;
  }

  mapInfo.innerHTML = `
    <span class="card-tag">${place.tag}</span>
    <h3>${place.title}</h3>
    <p>${place.text}</p>
    <img src="${place.image}" alt="${place.alt}" />
  `;

  mapButtons.forEach((button) => {
    button.classList.toggle("is-selected", button.dataset.place === placeKey);
  });
}

mapButtons.forEach((button) => {
  button.addEventListener("click", () => setPlace(button.dataset.place));
});

setPlace("shouxian");

const canvas = document.getElementById("mooncakeGame");
const ctx = canvas.getContext("2d");
const scoreValue = document.getElementById("scoreValue");
const timeValue = document.getElementById("timeValue");
const startButton = document.getElementById("startGame");
const resetButton = document.getElementById("resetGame");
const gameMessage = document.getElementById("gameMessage");

const game = {
  running: false,
  score: 0,
  timeLeft: 30,
  lastTime: 0,
  spawnTimer: 0,
  basket: {
    x: canvas.width / 2 - 54,
    y: canvas.height - 56,
    width: 108,
    height: 28,
    speed: 420,
    direction: 0,
  },
  cakes: [],
  raf: null,
  timer: null,
};

function drawBackground() {
  const sky = ctx.createLinearGradient(0, 0, 0, canvas.height);
  sky.addColorStop(0, "#111a2b");
  sky.addColorStop(0.55, "#203150");
  sky.addColorStop(1, "#111722");
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#ffe2a4";
  ctx.beginPath();
  ctx.arc(canvas.width - 95, 78, 42, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = "rgba(255,255,255,0.8)";
  for (let i = 0; i < 36; i += 1) {
    const x = (i * 137) % canvas.width;
    const y = 24 + ((i * 53) % 145);
    ctx.fillRect(x, y, 2, 2);
  }

  ctx.fillStyle = "#263447";
  ctx.fillRect(0, canvas.height - 40, canvas.width, 40);
  ctx.fillStyle = "#31415a";
  for (let x = 0; x < canvas.width; x += 62) {
    ctx.fillRect(x, canvas.height - 92 - ((x / 62) % 3) * 18, 46, 92);
  }
}

function drawBasket() {
  const basket = game.basket;
  ctx.fillStyle = "#d95745";
  roundRect(basket.x, basket.y, basket.width, basket.height, 8);
  ctx.fill();

  ctx.strokeStyle = "#ffe0a3";
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(basket.x + basket.width / 2, basket.y + 4, 38, Math.PI, Math.PI * 2);
  ctx.stroke();
}

function roundRect(x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

function drawCake(cake) {
  ctx.fillStyle = "#d7a33f";
  ctx.beginPath();
  ctx.arc(cake.x, cake.y, cake.r, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#fff0b7";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cake.x, cake.y, cake.r - 7, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#fff6cc";
  ctx.font = "bold 16px Microsoft YaHei, Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("月", cake.x, cake.y + 1);
}

function draw() {
  drawBackground();
  game.cakes.forEach(drawCake);
  drawBasket();
}

function spawnCake() {
  game.cakes.push({
    x: 34 + Math.random() * (canvas.width - 68),
    y: -30,
    r: 22 + Math.random() * 6,
    speed: 140 + Math.random() * 120,
  });
}

function update(delta) {
  const basket = game.basket;
  basket.x += basket.direction * basket.speed * delta;
  basket.x = Math.max(8, Math.min(canvas.width - basket.width - 8, basket.x));

  game.spawnTimer += delta;
  if (game.spawnTimer > 0.74) {
    spawnCake();
    game.spawnTimer = 0;
  }

  game.cakes.forEach((cake) => {
    cake.y += cake.speed * delta;
  });

  game.cakes = game.cakes.filter((cake) => {
    const hitBasket =
      cake.y + cake.r >= basket.y &&
      cake.y - cake.r <= basket.y + basket.height &&
      cake.x >= basket.x &&
      cake.x <= basket.x + basket.width;

    if (hitBasket) {
      game.score += 1;
      scoreValue.textContent = String(game.score);
      return false;
    }

    return cake.y - cake.r <= canvas.height;
  });
}

function loop(timestamp) {
  if (!game.running) {
    draw();
    return;
  }

  const delta = Math.min((timestamp - game.lastTime) / 1000, 0.04);
  game.lastTime = timestamp;
  update(delta);
  draw();
  game.raf = requestAnimationFrame(loop);
}

function endGame() {
  game.running = false;
  clearInterval(game.timer);
  cancelAnimationFrame(game.raf);
  gameMessage.textContent = `游戏结束，你接住了 ${game.score} 个寿州月饼。`;
  draw();
}

function startGame() {
  clearInterval(game.timer);
  cancelAnimationFrame(game.raf);
  game.running = true;
  game.score = 0;
  game.timeLeft = 30;
  game.lastTime = performance.now();
  game.spawnTimer = 0;
  game.cakes = [];
  game.basket.x = canvas.width / 2 - game.basket.width / 2;
  scoreValue.textContent = "0";
  timeValue.textContent = "30";
  gameMessage.textContent = "月饼已经落下来了，稳稳接住它们。";
  game.timer = setInterval(() => {
    game.timeLeft -= 1;
    timeValue.textContent = String(game.timeLeft);
    if (game.timeLeft <= 0) {
      endGame();
    }
  }, 1000);
  game.raf = requestAnimationFrame(loop);
}

function resetGame() {
  clearInterval(game.timer);
  cancelAnimationFrame(game.raf);
  game.running = false;
  game.score = 0;
  game.timeLeft = 30;
  game.cakes = [];
  game.basket.x = canvas.width / 2 - game.basket.width / 2;
  scoreValue.textContent = "0";
  timeValue.textContent = "30";
  gameMessage.textContent = "准备好之后点击开始，把寿州中秋的月饼都接住。";
  draw();
}

document.addEventListener("keydown", (event) => {
  if (event.key === "ArrowLeft" || event.key.toLowerCase() === "a") {
    game.basket.direction = -1;
  }
  if (event.key === "ArrowRight" || event.key.toLowerCase() === "d") {
    game.basket.direction = 1;
  }
});

document.addEventListener("keyup", (event) => {
  if (["ArrowLeft", "ArrowRight", "a", "d"].includes(event.key.toLowerCase())) {
    game.basket.direction = 0;
  }
});

canvas.addEventListener("pointermove", (event) => {
  const rect = canvas.getBoundingClientRect();
  const scale = canvas.width / rect.width;
  game.basket.x = (event.clientX - rect.left) * scale - game.basket.width / 2;
  game.basket.x = Math.max(8, Math.min(canvas.width - game.basket.width - 8, game.basket.x));
});

startButton.addEventListener("click", startGame);
resetButton.addEventListener("click", resetGame);

draw();
