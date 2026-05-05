const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const canvas = document.getElementById('ladder-canvas');
const ctx = canvas.getContext('2d');
const gameResults = document.getElementById('game-results');

const PLAYER_COUNT = 4;
const LADDER_WIDTH = canvas.width;
const LADDER_HEIGHT = canvas.height;
const LADDER_SPACING = LADDER_WIDTH / (PLAYER_COUNT + 1);

let players = [];
let results = [];
let ladders = [];

function drawLadder() {
    ctx.clearRect(0, 0, LADDER_WIDTH, LADDER_HEIGHT);

    // Draw vertical lines
    for (let i = 1; i <= PLAYER_COUNT; i++) {
        ctx.beginPath();
        ctx.moveTo(i * LADDER_SPACING, 0);
        ctx.lineTo(i * LADDER_SPACING, LADDER_HEIGHT);
        ctx.stroke();
    }

    // Draw horizontal lines
    ladders.forEach(rung => {
        const startX = (rung.start + 1) * LADDER_SPACING;
        const endX = (rung.start + 2) * LADDER_SPACING;
        ctx.beginPath();
        ctx.moveTo(startX, rung.y);
        ctx.lineTo(endX, rung.y);
        ctx.stroke();
    });
}

function createRungs() {
    ladders = [];
    for (let i = 0; i < PLAYER_COUNT - 1; i++) {
        for (let j = 0; j < 5; j++) { // Create 5 rungs per column
            if (Math.random() > 0.5) {
                ladders.push({
                    start: i,
                    y: Math.random() * (LADDER_HEIGHT - 40) + 20 // Avoid top and bottom edges
                });
            }
        }
    }
    // Sort rungs by y-coordinate to prevent overlaps
    ladders.sort((a, b) => a.y - b.y);
}

function runGame() {
    gameResults.innerHTML = '';
    for (let i = 0; i < PLAYER_COUNT; i++) {
        let currentPosition = i;
        ladders.forEach(rung => {
            if (rung.start === currentPosition) {
                currentPosition++;
            } else if (rung.start === currentPosition - 1) {
                currentPosition--;
            }
        });
        const resultText = `${players[i]} -> ${results[currentPosition]}`;
        const resultElement = document.createElement('p');
        resultElement.textContent = resultText;
        gameResults.appendChild(resultElement);
    }
}

startBtn.addEventListener('click', () => {
    players = [
        document.getElementById('player1').value,
        document.getElementById('player2').value,
        document.getElementById('player3').value,
        document.getElementById('player4').value
    ];
    results = [
        document.getElementById('result1').value,
        document.getElementById('result2').value,
        document.getElementById('result3').value,
        document.getElementById('result4').value
    ];

    createRungs();
    drawLadder();
    runGame();
});

resetBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, LADDER_WIDTH, LADDER_HEIGHT);
    gameResults.innerHTML = '';
    ladders = [];
});
