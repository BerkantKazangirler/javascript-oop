var context;
const resetbtn = document.querySelector("#reset");
const startbtn = document.querySelector("#basla");
const skordaydet = document.querySelector("#skorkaydet");
const closeModal = document.querySelector("#closemodal");
const kullaniciAdi = document.querySelector("#kad");
const modalKaydet = document.querySelector("#kaydet");
let currentGame;
let scoreBoard;

const monthNames = [
  "Ocak",
  "Şubat",
  "Mart",
  "Nisan",
  "Mayıs",
  "Haziran",
  "Temmuz",
  "Ağustos",
  "Eylül",
  "Ekim",
  "Kasım",
  "Aralık",
];

const tarih = new Date();
const ay = tarih.getMonth();
const yil = tarih.getFullYear();
const gün = tarih.getUTCDate();

class Game {
  constructor() {
    this.width = 1200;
    this.height = 900;
    this.classList = "bg-black mx-auto relative top-40";
    this.gameStatus = false;
    this.size = 30;
    this.score = 0;
    this.modalStatus = false;
    this.snake = null;
    this.food = null;
  }

  get Score() {
    return this.score;
  }

  set Score(deger) {
    this.score = deger;
    document.querySelector("#anlik").innerHTML = "Skorunuz : " + this.score;
  }

  get Modal() {
    return this.modalStatus;
  }

  set Modal(deger) {
    this.modalStatus = deger;
  }

  get GameStatuss() {
    return this.gameStatus;
  }

  set GameStatuss(deger) {
    this.gameStatus = deger;
  }

  finishGame() {
    this.GameStatuss = false;
    console.log("bitti");
  }

  reset() {
    this.score = 0;
    document.querySelector("#anlik").innerHTML = "Skorunuz : " + 0;
    this.snake = new Snake(this);
    this.food = new Food();
    this.draws();
    this.GameStatuss = true;
    console.log("Oyun resetlendi");
  }

  saveJson() {
    const newVehicleId = {
      name: kullaniciAdi.value,
      score: this.Score,
      date: `${gün} ${monthNames[ay]} ${yil}`,
    };

    fetch("http://localhost:3000/datas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newVehicleId),
    })
      .then((res) => res.json())
      .finally(this.loadDatas);
  }

  loadDatas() {
    fetch("http://localhost:3000/datas")
      .then((res) => res.json())
      .then((data) => {
        scoreBoard = data;
        console.log(data);
      })
      .catch((error) => console.error("Veri yüklenirken hata oluştu:", error));
  }

  showModal() {
    document.querySelector("#modal").classList.remove("hidden");
    document.querySelector("#modal").classList.add("flex");
    this.Modal = true;
    console.log("Modal yüklendi");
  }

  closeModal() {
    this.modalStatus = false;
    this.showLeaderBoard();
    document.querySelector("#modal").classList.add("hidden");
    document.querySelector("#modal").classList.remove("flex");
  }

  showLeaderBoard() {
    this.loadDatas();
  }

  modalSave() {
    this.saveJson();
  }

  draws() {
    context.clearRect(0, 0, this.width, this.height);
    this.snake.spawnSnake();
    this.food.spawnFood();
  }

  update() {
    if (!this.GameStatuss) return;

    if (this.Modal) return;

    this.snake.move();

    const head = this.snake.SnakeLocation[0];
    const food = this.food.FoodPosition[0];

    if (head.x === food.x * this.size && head.y === food.y * this.size) {
      this.snake.grow();
      this.food = new Food();
      this.Score = this.score + 1;
    }

    if (this.snake.checkCollision()) {
      this.finishGame();
    }
  }

  createCanvas() {
    const canvas = document.createElement("canvas");
    canvas.width = this.width;
    canvas.height = this.height;
    canvas.classList = this.classList;
    context = canvas.getContext("2d");
    document.body.insertBefore(canvas, document.body.childNodes[0]);
  }

  startGame() {
    this.createCanvas();
    this.snake = new Snake(this);
    this.food = new Food();
    this.GameStatuss = true;

    const gameLoop = () => {
      if (this.GameStatuss) {
        this.update();
        this.draws();
        setTimeout(() => requestAnimationFrame(gameLoop), 100);
      }
    };

    gameLoop();
  }
}

class Snake {
  constructor(game) {
    this.game = game;
    this.color = "green";
    this.controls();
    this.positions = [
      {
        x:
          Math.floor(Math.random() * (this.game.width / this.game.size)) *
          this.game.size,
        y:
          Math.floor(Math.random() * (this.game.height / this.game.size)) *
          this.game.size,
      },
    ];
    this.speed = { x: this.game.size, y: 0 };
    this.growth = 0;
  }

  controls() {
    document.addEventListener("keydown", (event) => {
      switch (event.key.toLowerCase()) {
        case "w":
          if (this.speed.y === 0) {
            this.speed = { x: 0, y: -this.game.size };
          }
          break;
        case "a":
          if (this.speed.x === 0) {
            this.speed = { x: -this.game.size, y: 0 };
          }
          break;
        case "s":
          if (this.speed.y === 0) {
            this.speed = { x: 0, y: this.game.size };
          }
          break;
        case "d":
          if (this.speed.x === 0) {
            this.speed = { x: this.game.size, y: 0 };
          }
          break;
      }
    });
  }

  move() {
    const head = {
      x: this.positions[0].x + this.speed.x,
      y: this.positions[0].y + this.speed.y,
    };

    this.positions.unshift(head);

    if (this.growth === 0) {
      this.positions.pop();
    } else {
      this.growth--;
    }
  }

  grow() {
    this.growth++;
  }

  checkCollision() {
    const head = this.positions[0];

    if (
      head.x < 0 ||
      head.x >= this.game.width ||
      head.y < 0 ||
      head.y >= this.game.height
    ) {
      return true;
    }

    for (let i = 1; i < this.positions.length; i++) {
      if (head.x === this.positions[i].x && head.y === this.positions[i].y) {
        return true;
      }
    }

    return false;
  }

  get SnakeLocation() {
    return this.positions;
  }

  spawnSnake() {
    const ctx = context;
    ctx.fillStyle = this.color;
    this.positions.forEach((position) => {
      ctx.fillRect(position.x, position.y, this.game.size, this.game.size);
    });
  }
}

class Food {
  constructor() {
    this.color = "yellow";
    this.positions = [
      {
        x: Math.floor(Math.random() * 40),
        y: Math.floor(Math.random() * 30),
      },
    ];
  }

  get FoodPosition() {
    return this.positions;
  }

  spawnFood() {
    const ctx = context;
    ctx.fillStyle = this.color;
    ctx.fillRect(this.positions[0].x * 30, this.positions[0].y * 30, 30, 30);
  }
}

function startGame() {
  currentGame = new Game();
  currentGame.startGame();

  skordaydet.addEventListener("click", (e) => {
    console.log(currentGame.Score);
    currentGame.showModal();
  });

  closeModal.addEventListener("click", (e) => {
    currentGame.closeModal();
  });

  modalKaydet.addEventListener("click", (e) => {
    currentGame.modalSave();
  });
}

resetbtn.addEventListener("click", (e) => {
  currentGame.reset(); // Oyunu sıfırla
  if (!currentGame.gameStatus) {
    currentGame.startGame(); // Yeniden oyun döngüsünü başlat
  }
});

startbtn.addEventListener("click", (e) => {
  if (!currentGame) {
    startGame();
  }
});
