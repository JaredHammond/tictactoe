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
    let playerOne;  
    let playerTwo
    
    const startGame = () => {
        playerOne = new Player(document.getElementById('p1').value);
        playerTwo = new Player(document.getElementById('p2').value);
        playerOne.setOpponent(playerTwo.name);
        playerTwo.setOpponent(playerOne.name);


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
        console.log(board);
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

        displayElements.forEach(element => playerArea.appendChild(element));

        let button = document.createElement('button');
        button.innerText = 'Play';
        button.addEventListener('click', e => {
            e.preventDefault()
            gameController.startGame();
        });

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

    return{
        createPlayerInput,
        createGameboard,
        removeCurrentContent,
        changeMessage,
        winCondition,
        drawCondition,
    }
})();

displayController.createPlayerInput();