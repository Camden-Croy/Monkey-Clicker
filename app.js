const gameBoard = document.querySelector('.gameBoard');
const start = document.querySelector('h1')
const monkees = []
const scoreDisplay = document.querySelector('#score')
const endGame = document.createElement('div')
const timeB = 1000;
const highScore = document.querySelector('#highScore');


bongo = new Audio('Audio/monkee_beat.wav');
bongo.loop = true;
let gameStatusID;
let checkStatusID;
let monkeeStatusID;
let n = 1;
const gameStatus = {
    lives: 3,
    score: 0,
    lost: false,
    monkeysOnBoard: 0,
    time: 1000,
    highScore: 0,
    monkeyPoints: 0
};

startGame();
function gameOver() {
    endGame.classList.add('gameOver');

    endGame.innerHTML = '<span class = "gameOverSpan">Game Over !</span> <span class = "tryAgain">Try Again?</span>'
    gameBoard.append(endGame);
    let startOver = document.querySelector('.tryAgain');
    startOver.addEventListener('click', startGameOver)

}


function startGameOver() {
    for (let i = 0; i < endGame.childElementCount; i++) {
        endGame.lastChild.remove()
    }
    endGame.remove();
    start.classList.toggle('hover')
    if (gameStatus.score > gameStatus.highScore) {
        gameStatus.highScore = gameStatus.score;
        highScore.innerText = gameStatus.highScore;
    }
    startGame();
}
function startGame() {
    start.addEventListener('click', startBrain)
    gameStatus.lives = 3;
    gameStatus.lost = false;
    gameStatus.score = 0;
    gameStatus.monkeysOnBoard = 0;
    n = 1;
    scoreDisplay.innerText = 'Your Score'
}
function startBrain() {
    bongo.play();
    checkGameStatus();
    gameStatusID = setInterval(() => {
        n = gameStatus.score + 1;
        gameStatus.time = timeAdjust(n);
        clearInterval(monkeeStatusID);
        addMonkeys(gameStatus.time);
    }, 1200)
    start.removeEventListener('click', startBrain);
    start.classList.toggle('hover');
}

function timeAdjust(n) {
    return timeB * (1 - .015) ** n;
}


const defMonkey = function (a) {
    let posX = Math.floor(Math.random() * (window.screen.availWidth * 0.74) + (screen.availWidth * 0.1)),
        posY = Math.floor(Math.random() * (window.screen.availHeight * 0.67) + (screen.availHeight * 0.1));
    a.src = "Images/monkey_head.png";
    a.height = "40";
    a.width = "40";
    a.style.position = 'absolute';
    a.style.top = `${posY}px`;
    a.style.left = `${posX}px`;
    a.addEventListener('click', () => {
        a.remove();
        new Audio('Audio/monkey_screams.mp3').play();
        monkees.splice(0, 1)
        gameStatus.monkeysOnBoard -= 1;
        gameStatus.score += 1;
        scoreDisplay.innerText = gameStatus.score;
    })
};

const addMonkey = function () {
    gameStatus.monkeysOnBoard += 1;
    monkees.push(document.createElement('img'));
    let monkeyNum = monkees.length - 1;
    defMonkey(monkees[monkeyNum]);
    gameBoard.append(monkees[monkeyNum]);
}

const addMonkeys = function (time) {
    monkeeStatusID = setInterval(() => {
        if (gameStatus.lost === false) {
            addMonkey();
        } else {
            for (let i = 0; i < monkees.length; i++) {
                monkees.pop()
                gameBoard.lastChild.remove()
            }
            bongo.pause();
            clearInterval(gameStatusID);
            clearInterval(CheckStatusID);
            clearInterval(monkeeStatusID)
            gameOver();
        }
    }, time);
}

const checkGameStatus = function () {
    CheckStatusID = setInterval(() => {
        if (gameStatus.monkeysOnBoard > 2) {
            for (let i = 0; i < monkees.length; i++) {
                monkees.pop()
                gameBoard.lastChild.remove()
                gameStatus.monkeysOnBoard -= 1
            }
            gameStatus.lives -= 1;
        }
        if (gameStatus.lives > 0) {
            gameStatus.lost = false;
        } else {
            gameStatus.lost = true;
        }
    }, 20);
}