document.addEventListener('DOMContentLoaded', function() {
    let currentPlayer = 'X';
    let cells = document.querySelectorAll('.cell');
    let gameEnded = false;
    let againstBot = false;
    let difficulty = 1;

    document.getElementById('start-button').addEventListener('click', startGame);
    
    function startGame() {
        againstBot = document.getElementById('player').value === 'bot';
        difficulty = parseInt(document.getElementById('difficulty').value);
        document.getElementById('start-dialog').style.display = 'none';
        document.querySelector('.board').style.display = 'grid';
        if (againstBot && currentPlayer === 'O') {
            setTimeout(makeBotMove, 300); 
        }
    }

    function cellClicked(event) {
        if (gameEnded) return;

        let cell = event.target;
        if (cell.textContent === '') {
            cell.textContent = currentPlayer;
            if (checkWinner(currentPlayer)) {
                setTimeout(() => { alert(currentPlayer + ' wygrał!'); }, 100);
                gameEnded = true;
                return;
            }
            if (checkDraw()) {
                setTimeout(() => { alert('Remis!'); }, 100);
                gameEnded = true;
                return;
            }
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';

            if (againstBot && currentPlayer === 'O') {
                setTimeout(makeBotMove, 300); 
            }
        }
    }

    function makeBotMove() {
        if (gameEnded) return;

        let emptyCells = [];
        cells.forEach(cell => {
            if (cell.textContent === '') {
                emptyCells.push(cell);
            }
        });

        let botCell;
        if (difficulty === 1) {
            botCell = emptyCells[Math.floor(Math.random() * emptyCells.length)]; 
        } else if (difficulty === 2) {
            botCell = findBestMove(emptyCells);
        } else {
            let bestScore = -Infinity;
            let bestMove;
            emptyCells.forEach(cell => {
                cell.textContent = currentPlayer;
                let score = minimax(0, false);
                cell.textContent = '';
                if (score > bestScore) {
                    bestScore = score;
                    bestMove = cell;
                }
            });
            botCell = bestMove;
        }

        botCell.textContent = currentPlayer;
        if (checkWinner(currentPlayer)) {
            setTimeout(() => { alert(currentPlayer + ' wygrał!'); }, 100);
            gameEnded = true;
            showPlayAgainButton();
            return;
        }
        if (checkDraw()) {
            setTimeout(() => { alert('Remis!'); }, 100);
            gameEnded = true;
            showPlayAgainButton();
            return;
        }
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function checkWinner(player) {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        return winPatterns.some(pattern => pattern.every(index => cells[index].textContent === player));
    }

    function checkDraw() {
        return Array.from(cells).every(cell => cell.textContent !== '');
    }

    function minimax(depth, isMaximizing) {
        let scores = {
            X: -1,
            O: 1,
            tie: 0
        };

        if (checkWinner('X')) {
            return scores.X - depth;
        } else if (checkWinner('O')) {
            return scores.O + depth;
        } else if (checkDraw()) {
            return scores.tie;
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            cells.forEach(cell => {
                if (cell.textContent === '') {
                    cell.textContent = 'O';
                    let score = minimax(depth + 1, false);
                    cell.textContent = '';
                    bestScore = Math.max(score, bestScore);
                }
            });
            return bestScore;
        } else {
            let bestScore = Infinity;
            cells.forEach(cell => {
                if (cell.textContent === '') {
                    cell.textContent = 'X';
                    let score = minimax(depth + 1, true);
                    cell.textContent = '';
                    bestScore = Math.min(score, bestScore);
                }
            });
            return bestScore;
        }
    }

    function findBestMove(emptyCells) {
        let opponent = currentPlayer === 'X' ? 'O' : 'X';

        for (let i = 0; i < emptyCells.length; i++) {
            let cell = emptyCells[i];
            cell.textContent = opponent;
            if (checkWinner(opponent)) {
                cell.textContent = '';
                return cell;
            }
            cell.textContent = '';
        }

        return emptyCells[Math.floor(Math.random() * emptyCells.length)];
    }

    
    function resetGame() {
        currentPlayer = 'X';
        gameEnded = false;
        cells.forEach(cell => cell.textContent = '');
        document.querySelector('.board').style.display = 'none';
        document.getElementById('play-again').style.display = 'none';
        document.getElementById('start-dialog').style.display = 'block';
    }

    cells.forEach(cell => cell.addEventListener('click', cellClicked));
});