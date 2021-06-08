
// The big brain for the game
let gameController = (function() {
    let board = [[],[],[]]; //[row][column]
    let turn = true; // If true, it is player 1's turn,
    let playerOne;  
    let playerTwo
    let isComp = false;
    
    const startGame = () => {
        playerOne = new Player(document.getElementById('p1').value);
        playerTwo = new Player(document.getElementById('p2').value);
        playerOne.setOpponent(playerTwo.name);
        playerTwo.setOpponent(playerOne.name);
        if (document.getElementById('computer').checked) {
            gameController.isComp = true;
        }

        for(let i=0; i<3; i++) {
            for(let j=0;j<3; j++) {
                board[i][j] = null;
            }
        }

        displayController.removeCurrentContent();
        displayController.createGameboard();
        displayController.changeMessage('It\'s ' + playerOne.name + '\'s turn.');
    }

    const changeTurn = () => turn = !turn;

    const currentPlayer = () => {return turn ? playerOne : playerTwo};
    
    const currentMarker = () => {
        return (turn ? 'x' : 'o');
    }

    const isPlayAllowed = function(row, col) {
        return (board[row][col] == null ? true : false);
    }

    const checkWin = function() {
        // Returns true if the last play resulted in a win for that player
        for (let i = 0; i < 3; i++) {
            // Check rows
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != null) {
                return true;
            // Check columns
            } else if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != null) {
                return true;
            }
        }
        // Check one diagonal
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != null) {
            return true;
        // Check other diagonal
        } else if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != null) {
            return true;
        }
        return false;
    }
    const checkDraw = function() {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (board[i][j] == null) {return false}; // No Draw
            }
        }
        return true; // Draw
    }
    const play = function(row, col) {
        // Need to add function that will check which marker should have been played,
        // then returns that marker. Either an x or an o.
        if (isPlayAllowed(row,col)) {
            let marker = currentMarker();
            board[row][col] = marker;
            let current = currentPlayer();
            if (checkWin()) {
                displayController.winCondition(current.name);
            } else if (checkDraw()) {
                displayController.drawCondition();
            } else {
                displayController.changeMessage(current.name + " played. It\'s now " + current.opponent + "\'s turn.")
                changeTurn();
                return marker;
            }
        }
    }
    return {
        isComp,
        board,
        turn,
        play,
        checkDraw,
        checkWin,
        startGame,
    }
  })();

function Player(name) {
    this.name = name;
    this.opponent = '';
    this.setOpponent = (oppName) => {this.opponent = oppName};
}

const displayController = (function() {
    const content = document.getElementById('content');
    const messages = document.createElement('h3');


    const createPlayerInput = () => {
        let displayElements = [];

        const playerArea = document.createElement('div');
        playerArea.setAttribute('id', 'player-area');

        const xDiv = document.createElement('div');
        xDiv.classList.add('x');
        displayElements.push(xDiv);
        
        const oDiv = document.createElement('div');
        oDiv.classList.add('o');
        displayElements.push(oDiv);        
        
        const playerOneLabel = document.createElement('p');
        playerOneLabel.innerText = 'Player 1:';
        displayElements.push(playerOneLabel);

        const playerTwoLabel = document.createElement('p');
        playerTwoLabel.innerText = 'Player 2:';
        displayElements.push(playerTwoLabel);

        const playerOneInput = document.createElement('input')
        playerOneInput.setAttribute('type', 'text');
        playerOneInput.setAttribute('id','p1');
        displayElements.push(playerOneInput);

        const playerTwoInput = document.createElement('input')
        playerTwoInput.setAttribute('type', 'text');
        playerTwoInput.setAttribute('id','p2');
        displayElements.push(playerTwoInput);
        
        const computerButton = document.createElement('input');
        computerButton.setAttribute('type', 'checkbox');
        computerButton.setAttribute('id', 'computer');
        computerButton.classList.add('computer-button');
        displayElements.push(computerButton);
        
        const computerLabel = document.createElement('label');
        computerLabel.innerText = 'Play Computer';
        computerLabel.setAttribute('for', 'computer');
        computerLabel.classList.add('computer-button');
        computerLabel.setAttribute('id','computer-label');
        displayElements.push(computerLabel);
        
        displayElements.forEach(element => playerArea.appendChild(element));

        let button = document.createElement('button');
        button.innerText = 'Play';
        button.addEventListener('click', e => {
            e.preventDefault()
            gameController.startGame();
        });

        computerButton.addEventListener('change', function() {
            if (this.checked) {
                playerTwoInput.value = 'The Computer';
                playerTwoInput.setAttribute('disabled', 'true');
            } else {
                playerTwoInput.value = '';
                playerTwoInput.removeAttribute('disabled');
            }
        })

        playerArea.appendChild(button);
        content.appendChild(playerArea);
    }

    const removeCurrentContent = () => {
        while (content.firstChild) {
            content.removeChild(content.lastChild);
        }
    }


    const createGameboard = () => {
        // Creates Gameboard and event listeners for each square
        const gameBoard = document.createElement('div');
        gameBoard.setAttribute('id','game-board');
        const squares = [];
        
        // Creates and labels game squares
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let square = document.createElement('div');
                square.setAttribute('data-row', i);
                square.setAttribute('data-col', j);
                square.classList.add('square');
                squares.push(square);
            }
        }
        // Add event listeners to each game square
        squares.forEach(square => {
            square.addEventListener('click', () => {
                const row = parseInt(square.getAttribute('data-row'));
                const col = parseInt(square.getAttribute('data-col'));
                const marker = gameController.play(row, col);
                if (marker != null) {square.classList.add(marker)};
                
                // If there's a computer and a player just played, computer goes
                if (marker == 'x' && gameController.isComp) {
                    ai.bestMove(gameController.board);
                }
            });
            gameBoard.appendChild(square);
    
        });

        content.appendChild(gameBoard);  
        content.appendChild(messages);
    }

    const changeMessage = (words) => {
        messages.innerText = words;
    }

    const winCondition = (winner) => {
        removeCurrentContent();
        changeMessage(winner + ' won the game!')
        messages.classList.add('gameover');
        content.appendChild(messages);
    }

    const drawCondition = () => {
        removeCurrentContent();
        changeMessage('The game ended in a draw!')
        messages.classList.add('gameover');
        content.appendChild(messages);
    }

    const computerPlayDisplay = (row, col) => {
        let computerSquare = document.querySelector(`[data-row="${row}"][data-col="${col}"]`)
        let marker = gameController.play(row, col);
        computerSquare.classList.add(marker);
    }

    return{
        createPlayerInput,
        createGameboard,
        removeCurrentContent,
        changeMessage,
        winCondition,
        drawCondition,
        computerPlayDisplay,
    }
})();


// AI Stuff

const ai = (function() {
    "use strict";

    const anyMovesLeft = (board) => {
        for(let i = 0; i<3; i++) {
            for(let j=0; j<3; j++) {
                if (board[i][j] == null) {
                    return true;
                }
            }
        }
        return false;
    }
    
    const boardScore = function(board) {
        'use strict';
        // Returns true if the last play resulted in a win for that player
        for (let i = 0; i < 3; i++) {
            // Check rows
            if (board[i][0] == board[i][1] && board[i][1] == board[i][2] && board[i][0] != null) {
                if (board[i][0] == 'o') {
                    return 10;
                } else {
                    return -10;
                }
            // Check columns
            } else if (board[0][i] == board[1][i] && board[1][i] == board[2][i] && board[0][i] != null) {
                if (board[0][i] == 'o') {
                    return 10;
                } else {
                    return -10;
                }
            }
        }
        // Check one diagonal
        if (board[0][0] == board[1][1] && board[1][1] == board[2][2] && board[0][0] != null) {
            if (board[0][0] == 'o') {
                return 10;
            } else {
                return -10;
            }
        // Check other diagonal
        } else if (board[0][2] == board[1][1] && board[1][1] == board[2][0] && board[0][2] != null) {
            if (board[0][2] == 'o') {
                return 10;
            } else {
                return -10;
            }
        }
        return 0;
    }
    
    const minimax = (board, isMaxPlayer) => {
        'use strict';
        let score = boardScore(board);
    
        if (score == 10 || score == -10) {
            return score;
        }
    
        if (!anyMovesLeft(board)) {
            return 0;
        }
        if (isMaxPlayer) {
            let best = -1000;
            for(let i=0; i<3; i++) {
                for(let j=0; j<3; j++) {
                    if (board[i][j] == null) {
                        board[i][j] = 'o';
                        best = Math.max(best, minimax(board, false));
    
                        board[i][j] = null;
                    }
                }
            }
            return best;
            
        } else {
            let best = 1000;

            for(let i=0; i<3; i++) {
                for(let j=0; j<3; j++) {
                    if (board[i][j] == null) {
                        board[i][j] = 'x';
                        best = Math.min(best, minimax(board, true));
    
                        board[i][j] = null;
                    }
                }
            }
            return best;
        }
    }
    
    const bestMove = (board) => {
        console.log(board);
        'use strict';
        let bestValue = -100;
        let bestRow = -1;
        let bestCol = -1;
    
        for(let i=0; i<3; i++) {
            for(let j=0; j<3; j++) {
    
                if (board[i][j] == null) {
                    board[i][j] = 'o';
    
                    let currentMove = minimax(board, false)
    
                    board[i][j] = null;
    
                    if (currentMove > bestValue) {
                        bestValue = currentMove;
                        bestRow = i;
                        bestCol = j;
                    }
                }
            }
        }
        displayController.computerPlayDisplay(bestRow, bestCol);
    }
    
    // end AI stuff

    return {
        bestMove,
    }
})()


displayController.createPlayerInput();