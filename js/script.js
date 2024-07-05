document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('game-board');
    const scannerDisplay = document.getElementById('scanner-display');
    const clueButton = document.getElementById('clue-button');
    const arrestButton = document.getElementById('arrest-button');
    const devModeButton = document.getElementById('dev-mode-button');
    let devMode = false;

    const boardSize = 10;
    let thiefLocation = [Math.floor(Math.random() * boardSize), Math.floor(Math.random() * boardSize)];
    let lastThiefLocation = [...thiefLocation]; // To track the last location

    // Initialize game board with different types of squares
    const squareTypes = [
        'crime', 'door', 'window', 'street', 'steps'
    ];

    let cellNumber = 1;
    for (let i = 0; i < boardSize * 2 - 1; i++) {
        for (let j = 0; j < boardSize * 2 - 1; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            if (i % 2 === 0 && j % 2 === 0) {
                const type = squareTypes[Math.floor(Math.random() * squareTypes.length)];
                cell.classList.add(type);
                cell.textContent = cellNumber++;
            }
            board.appendChild(cell);
        }
    }

    const updateBoard = () => {
        const cells = board.childNodes;
        cells.forEach((cell, index) => {
            if (cell.classList.contains('cell')) {
                const row = Math.floor(index / (boardSize * 2 - 1));
                const col = index % (boardSize * 2 - 1);
                cell.classList.remove('dev-mode');
                if (row % 2 === 0 && col % 2 === 0) {
                    cell.style.borderColor = (row / 2 === thiefLocation[0] && col / 2 === thiefLocation[1]) ? 'black' : '#ccc';
                    if (devMode && row / 2 === thiefLocation[0] && col / 2 === thiefLocation[1]) {
                        cell.classList.add('dev-mode');
                    }
                }
            }
        });
    };

    const getValidMoves = (location) => {
        const [row, col] = location;
        const potentialMoves = [
            [row - 2, col], [row + 2, col], // Vertical moves
            [row, col - 2], [row, col + 2], // Horizontal moves
            [row - 2, col - 2], [row - 2, col + 2], // Diagonal moves
            [row + 2, col - 2], [row + 2, col + 2]  // Diagonal moves
        ];
        return potentialMoves.filter(([r, c]) => r >= 0 && r < boardSize && c >= 0 && c < boardSize && !(r === lastThiefLocation[0] && c === lastThiefLocation[1]));
    };

    const moveThief = () => {
        const validMoves = getValidMoves(thiefLocation);
        if (validMoves.length === 0) return; // No valid moves, do nothing
        lastThiefLocation = [...thiefLocation];
        const [rowMove, colMove] = validMoves[Math.floor(Math.random() * validMoves.length)];
        thiefLocation = [rowMove, colMove];
        updateBoard();

        const cells = board.getElementsByClassName('cell');
        for (let cell of cells) {
            const cellRow = Math.floor(Array.from(cells).indexOf(cell) / (boardSize * 2 - 1)) / 2;
            const cellCol = (Array.from(cells).indexOf(cell) % (boardSize * 2 - 1)) / 2;
            if (cellRow === thiefLocation[0] && cellCol === thiefLocation[1]) {
                const squareType = Array.from(cell.classList).find(cls => squareTypes.includes(cls));
                scannerDisplay.textContent = `Thief is on a ${squareType} square.`;
                break;
            }
        }
    };

    clueButton.addEventListener('click', () => {
        moveThief();
    });

    const attemptArrest = () => {
        const cellNumber = prompt('Enter the cell number where you think the thief is:');
        const cells = board.getElementsByClassName('cell');
        for (let cell of cells) {
            if (cell.textContent == cellNumber) {
                const row = Math.floor(Array.from(cells).indexOf(cell) / (boardSize * 2 - 1)) / 2;
                const col = (Array.from(cells).indexOf(cell) % (boardSize * 2 - 1)) / 2;
                if (row === thiefLocation[0] && col === thiefLocation[1]) {
                    alert('You caught the thief!');
                } else {
                    alert('Wrong cell. The thief escaped!');
                }
                return;
            }
        }
        alert('Invalid cell number.');
    };

    arrestButton.addEventListener('click', () => {
        attemptArrest();
    });

    devModeButton.addEventListener('click', () => {
        devMode = !devMode;
        devModeButton.classList.toggle('on', devMode);
        updateBoard();
    });

    updateBoard();
});