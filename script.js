/* 
Notes for what to do next:
-Figure out how to implement player names into it.
-Maybe add mousedown to change color, and mouseup to add the marker
-What happens to event controllers at game end? Perhaps disable all marker event controllers?
*/

// The big brain for the game
let gameController = (function() {
    'use strict';
    let board = [[],[],[]]; //[row][column]
    let turn = true; // If true, it is player 1's turn,  
    
    const changeTurn = () => turn = !turn;

    const currentPlayer = () => (turn ? 'player1' : 'player2');
    
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
            changeTurn();
            return marker;
        }
    }
    return {
        turn,
        play,
        checkDraw,
        checkWin,
    }
  })();

const Player = (name) => {
    return {name};
}

const displayController = (function() {

    const createPlayerInput = () => {
        let displayElements = [];

        const playerArea = document.getElementById('player-area');

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
        displayElements.push(playerOneInput);

        const playerTwoInput = document.createElement('input')
        playerTwoInput.setAttribute('type', 'text');
        displayElements.push(playerTwoInput);

        

        for (let i = 0; i <2; i++) {
            let playerLabel = document.createElement('label');
            let playerNameInput = document.createElement('input');
            let playerNumber = (players[0] == null ? 1 : 2);
            playerLabel.innerText = marker + ': Player ' + playerNumber;
            playerLabel.setAttribute('name','player' + playerNumber);
            playerArea.appendChild(playerLabel);
            playerArea.appendChild(playerNameInput);
            players.push(playerNameInput);
        }

        let button = document.createElement('button');
        button.innerText = 'Play';
        button.addEventListener('click', e => {
            e.preventDefault()
            players.forEach(player => {
                let name = player.value()
                
            })
        });
        playerArea.appendChild(button);
    }
    const createGameboard = () => {
        // Creates Gameboard and event listeners for each square
        const gameBoard = document.getElementById('game-board');
        const squares = [];
        
        // Creates and labels game squares
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                let square = document.createElement('div')
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
                if (gameController.checkWin()) {console.log('You win!')};
                if (gameController.checkDraw()) {endDraw()};
            });
            gameBoard.appendChild(square);
    
        });
        
    }

    const initialize = function() {
        
    }
    return{
        initialize,
    }
})();

displayController.initialize();
document.querySelector
