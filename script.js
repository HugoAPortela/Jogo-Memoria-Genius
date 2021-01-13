// DECLARATION

let order = [];
let clickedOrder = [];
let score = 0;
let gameStarted = false;
let isGameOver = false;

const green = document.querySelector('.green');     // 0 - green
const red = document.querySelector('.red');         // 1 - red
const yellow = document.querySelector('.yellow');   // 2 - yellow
const blue = document.querySelector('.blue');       // 3 - blue

const menu = document.querySelector('.menu');
const startButton = document.querySelector('.start-button');

const C = new Audio('./audio/do.wav');
const D = new Audio('./audio/re.wav');
const E = new Audio('./audio/mi.wav');
const F = new Audio('./audio/fa.wav');

const samples = [C, D, E, F];



// INITIAL SETUP

for (let i in samples) {
  samples[i].playbackRate = 3.0;
  samples[i].preload = 'auto';
}

green.onclick = () => click(0);
red.onclick = () => click(1);
yellow.onclick = () => click(2);
blue.onclick = () => click(3);

startButton.onclick = () => playGame();



// AUXILIAR FUNCTIONS

let playBeep = (color) => {
  samples[color].play();
}

let sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}



// MAIN FUNCTIONS

let playGame = () => {
  gameStarted = true;

  for (let i = 0; i < 4; i++) {
    sleep(i * 150).then(() => {
      playBeep(i);
    });
  }

  sleep(1500).then(() => {
    score = 0;
    menu.removeChild(startButton);
    createScoreMenu();
  });

  sleep(2500).then(() => {
    nextLevel();
  });
}


let createScoreMenu = () => {
  const scoreP = document.createElement('p');
  const scoreText = document.createTextNode(`Score: ${score}`);
  scoreP.className += ' score-text';
  
  scoreP.appendChild(scoreText);
  menu.appendChild(scoreP);
}


let nextLevel = () => {
  score++;
  shuffleOrder();
}


let shuffleOrder = () => {
  let colorOrder = Math.floor(Math.random() * 4);
  order[order.length] = colorOrder;
  clickedOrder = [];

  for (let i in order) {
    let elementColor = createColorElement(order[i]);
    lightColor(order[i], elementColor, Number(i) + 1);
  }
}


let createColorElement = (color) => {
  if (color == 0) return green;
  else if (color == 1) return red;
  else if (color == 2) return yellow;
  else if (color == 3) return blue;
}


let lightColor = (color, element, number) => {
  number *= 500;
  let time = 250;

  setTimeout(() => {
    element.classList.add('selected');
    playBeep(color);

    setTimeout(() => {
      element.classList.remove('selected');
    }, time);

  }, number - time);
}


let click = (color) => {
  playBeep(color);

  if (gameStarted) {
    clickedOrder[clickedOrder.length] = color;
    createColorElement(color).classList.add('selected');
  
    setTimeout(() => {
      createColorElement(color).classList.remove('selected');
      checkOrder();
    }, 250);
  }
}


let checkOrder = () => {
  for (let i in clickedOrder) {
    if (clickedOrder[i] != order[i]) {
      isGameOver = true;
      gameOver();
      break;
    }
  }

  if (!isGameOver && clickedOrder.length == order.length) {
    const oldScore = document.querySelector('.score-text');
    menu.removeChild(oldScore);
    createScoreMenu();
    
    sleep(2000).then(() => {
      nextLevel();
    });
  }
}


let gameOver = () => {
  for (let i = 0; i < 4; i++) {
    sleep(i * 150).then(() => {
      playBeep(3 - i);
    });
  }

  sleep(1000).then(() => {
    alert(`Game over!\nScore: ${score - 1}\nReload the page.`);
    window.location.reload();
  });
}