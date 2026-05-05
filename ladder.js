const startBtn = document.getElementById('start-btn');
const resetBtn = document.getElementById('reset-btn');
const themeToggleBtn = document.getElementById('theme-toggle-btn');
const canvas = document.getElementById('ladder-canvas');
const ctx = canvas.getContext('2d');
const gameResults = document.getElementById('game-results');
const body = document.body;

const PLAYER_COUNT = 13;
const LADDER_WIDTH = canvas.width;
const LADDER_HEIGHT = canvas.height;
const LADDER_SPACING = LADDER_WIDTH / (PLAYER_COUNT + 1);

let players = [];
let results = [];
let ladders = [];

function drawLadder() {
    ctx.clearRect(0, 0, LADDER_WIDTH, LADDER_HEIGHT);

    // Set line color based on theme
    if (body.classList.contains('dark-mode')) {
        ctx.strokeStyle = '#ccc';
    } else {
        ctx.strokeStyle = '#000';
    }
    ctx.lineWidth = 1;

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
            const y = Math.random() * (LADDER_HEIGHT - 40) + 20;
            const nearbyRung = ladders.find(r => r.start === i && Math.abs(r.y - y) < 20);
            if (Math.random() > 0.5 && !nearbyRung) {
                ladders.push({
                    start: i,
                    y: y
                });
            }
        }
    }
}

function tracePath(playerIndex) {
    let currentPosition = playerIndex;
    const path = [{ x: (playerIndex + 1) * LADDER_SPACING, y: 0 }];

    const sortedLadders = [...ladders].sort((a, b) => a.y - b.y);

    sortedLadders.forEach(rung => {
        const rungY = rung.y;
        if (rung.start === currentPosition) {
            path.push({ x: (currentPosition + 1) * LADDER_SPACING, y: rungY });
            path.push({ x: (currentPosition + 2) * LADDER_SPACING, y: rungY });
            currentPosition++;
        } else if (rung.start === currentPosition - 1) {
            path.push({ x: (currentPosition + 1) * LADDER_SPACING, y: rungY });
            path.push({ x: (currentPosition) * LADDER_SPACING, y: rungY });
            currentPosition--;
        }
    });

    path.push({ x: (currentPosition + 1) * LADDER_SPACING, y: LADDER_HEIGHT });
    return { finalPosition: currentPosition, path: path };
}

function runGameAndDrawPath() {
    gameResults.innerHTML = '';
    drawLadder(); // Redraw ladder to clear previous paths

    for (let i = 0; i < PLAYER_COUNT; i++) {
        const { finalPosition, path } = tracePath(i);

        // Draw the path
        ctx.beginPath();
        ctx.moveTo(path[0].x, path[0].y);
        ctx.strokeStyle = `hsl(${i * (360 / PLAYER_COUNT)}, 70%, 50%)`; // Different color for each path
        ctx.lineWidth = 3;
        for (let j = 1; j < path.length; j++) {
            ctx.lineTo(path[j].x, path[j].y);
        }
        ctx.stroke();

        const resultText = `${players[i]} -> ${results[finalPosition]}`;
        const resultElement = document.createElement('p');
        resultElement.textContent = resultText;
        gameResults.appendChild(resultElement);
    }
}

startBtn.addEventListener('click', () => {
    players = [];
    results = [];
    for (let i = 1; i <= PLAYER_COUNT; i++) {
        players.push(document.getElementById('player' + i).value);
        results.push(document.getElementById('result' + i).value);
    }

    createRungs();
    runGameAndDrawPath();
});

resetBtn.addEventListener('click', () => {
    ctx.clearRect(0, 0, LADDER_WIDTH, LADDER_HEIGHT);
    gameResults.innerHTML = '';
    ladders = [];
    drawLadder();
});

themeToggleBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    drawLadder();
    if(ladders.length > 0) {
        runGameAndDrawPath();
    }
});

// Initial draw
drawLadder();
