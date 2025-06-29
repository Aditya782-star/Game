const board = document.getElementById('board');
const status = document.getElementById('status');
const scoreboard = document.getElementById('scoreboard');
const popup = document.getElementById('popup');
const popupImage = document.getElementById('popupImage');
const popupMessage = document.getElementById('popupMessage');

let currentPlayer = 'X';
let gameActive = true;
const cells = [];
let playerScore = 0;
let botScore = 0;
let drawScore = 0;

function updateScore() {
    scoreboard.textContent = `player: ${playerScore} | bot: ${botScore} | Seri: ${drawScore}`;
}

function createBoard() {
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.addEventListener('click', handleClick);
        board.appendChild(cell);
        cells.push(cell);
    }
}

function handleClick(e) {
    if (!gameActive || e.target.textContent) return;
    e.target.textContent = currentPlayer;
    if (checkWinner()) return;
    currentPlayer = 'O';
    status.textContent = `Giliran: oline (O)`;
    setTimeout(botMove, 500);
}

function botMove() {
    if (!gameActive) return;
    const bestMove = minimax(cells.map(c => c.textContent), 'O').index;
    if (bestMove !== undefined) {
        cells[bestMove].textContent = 'O';
        if (checkWinner()) return;
    }
    currentPlayer = 'X';
    status.textContent = `Giliran: X (kamu)`;
}

function checkWinner() {
    const combos = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];

    for (const combo of combos) {
        const [a, b, c] = combo;
        if (cells[a].textContent && cells[a].textContent === cells[b].textContent && cells[a].textContent === cells[c].textContent) {
            gameActive = false;

            if (cells[a].textContent === 'X') {
                playerScore++;
                highlightCells(combo, 'win');
                showPopup('Selamat! Kamu Menang 🎉', 'gambar/menang.png');
            } else {
                botScore++;
                highlightCells(combo, 'lose');
                showPopup('HUH CUPU! ', 'gambar/kalah.png');
            }
            updateScore();
            return true;
        }
    }

    if (cells.every(c => c.textContent)) {
        gameActive = false;
        drawScore++;
        showPopup('OKE KITA SERI🤝', 'gambar/seri.png');
        updateScore();
        return true;
    }
    return false;
}

function minimax(boardState, player) {
    const availSpots = boardState.map((v, i) => v ? null : i).filter(i => i !== null);

    if (checkStaticWin(boardState, 'X')) return { score: -10 };
    if (checkStaticWin(boardState, 'O')) return { score: 10 };
    if (availSpots.length === 0) return { score: 0 };

    const moves = [];

    for (let i of availSpots) {
        const move = { index: i };
        boardState[i] = player;

        if (player === 'O') move.score = minimax(boardState, 'X').score;
        else move.score = minimax(boardState, 'O').score;

        boardState[i] = '';
        moves.push(move);
    }

    return player === 'O' ? moves.reduce((best, m) => m.score > best.score ? m : best, { score: -Infinity }) :
                            moves.reduce((best, m) => m.score < best.score ? m : best, { score: Infinity });
}

function checkStaticWin(state, player) {
    const winCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];
    return winCombos.some(c => c.every(i => state[i] === player));
}

function highlightCells(indices, className) {
    indices.forEach(i => cells[i].classList.add(className));
}

function showPopup(message, imageSrc) {
    popupMessage.textContent = message;
    popupImage.src = imageSrc;
    popup.style.display = 'block';
}

function resetGame() {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('win', 'lose');
    });
    currentPlayer = 'X';
    gameActive = true;
    status.textContent = 'Giliran: X (Player)';
    popup.style.display = 'none';
}

createBoard();
updateScore();
