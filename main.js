const GameBoard = (() => {
    //winning combinations
    const _wins = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ]
    //create the board array with indexes
    let board = new Array(9).fill().map((_, index) => index);

    const getBoard = () => board;

    const resetBoard = () => {
        board = new Array(9).fill().map((_, index) => index);
    } 

    const findEmptySpaces = (gameBoard = board) => {
        return gameBoard.filter(cell => cell !== 'X' && cell !== 'O' );
    }

    //check if empty spaces on board
    const isMoves = (gameBoard = board) => {
        return gameBoard.some((cell, index) => {
        return cell === index;
    })};

    //places sign in the array and on screen
    const placeSign = (sign, index) => {
        board.splice(index, 1, sign);
        let cell = DisplayController.getCell(index);
        cell.textContent += sign;
    }

    //check for win or draw
    const checkWin = (player, gameBoard = board) => {
        const sign = player.getSign;
        const moves = new Array(9).fill().map((_, index) => index);
        gameBoard.map((cell, index) => {
            if(cell === sign) {
                moves.splice(index, 1, cell)
            }
        })
        if(moves.length < 3) {
            return false;
        }
        let win = _wins.some(combinations => {
                    return combinations.every(index => {
                        return moves[index] === sign;
                    })
        })
        if(!isMoves) { return "draw" }
        else { return win }
    }

    return {getBoard, placeSign, checkWin, isMoves, findEmptySpaces, resetBoard}
})();

const Player = (name, playerSign) => {
    let getSign = playerSign;
    let _moves = [];
    const getMoves = _moves;
    const setMove = (index) => {
        _moves.push(index)
    }
    return {name, getSign, getMoves, setMove}
}

const AiController = (player1, aiPlayer) => {

    const aiMove = (difficulty) => {
        let move = {};
        let randomNum;
        const bestMoveRatio = Math.floor(Math.random()*100);
        switch(difficulty) {
            case "easy":
                move.index = randomMove();
                break;
            case "medium":
                randomNum = Math.floor(Math.random()*30);
                if(randomNum > bestMoveRatio){
                    move = minimax(GameBoard.getBoard(), 0, true)
                }
                else { move.index = randomMove()}
                break;
            case "hard":
                randomNum = Math.floor(Math.random()*60);
                if(randomNum > bestMoveRatio){
                    move = minimax(GameBoard.getBoard(), 0, true)
                }
                else { move.index = randomMove()}
                break;
            case "unbeatable":
                move = minimax(GameBoard.getBoard(), 0, true);
                break;
        }
        return move;

    }

    const randomMove = (board) => {
        let emptySpaces = GameBoard.findEmptySpaces(GameBoard.getBoard());
        const randomNum = Math.floor(Math.random() * emptySpaces.length)
        return Number(emptySpaces[randomNum]);
    }

    const minimax = (board, depth, isMax) => {

        //base, check for winner or tie
        if(GameBoard.checkWin(player1, board)){
            return {score:depth -10}
        }
        else if(GameBoard.checkWin(aiPlayer, board)){
            return {score:10 - depth}
        }
        else if(!GameBoard.isMoves(board)){
            return {score:0}
        }

        //grab the empty spaces on the board
        let emptySpaces = GameBoard.findEmptySpaces(board)

        let moves = [];

        //logic for first move to speed up process
        if(board[4] === 4){
            return {index: 4}
        }
        else if(emptySpaces.length > 7){
            const corners = [0,2,6,8];
            return { index: corners[Math.floor(Math.random()*corners.length)]}
        }
        
        //minimax recurssive logic
        let player = isMax ? aiPlayer : player1;

        for(let i = 0; i < emptySpaces.length; i++){
            let move = {};
            let index = emptySpaces[i]
            move.index = board[index];
            board[index] = player.getSign;

            if(isMax){
                let result = minimax(board, depth + 1, false)
                move.score = result.score
                move.depth = depth;
            }
            else{
                let result = minimax(board, depth + 1, true)
                move.score = result.score;
                move.depth = depth;
            }

            board[index] = move.index;

            moves.push(move);
        }

        //find the best move
        let bestMove;

        if(isMax){
            let bestScore = -1000;
            for(let i =0; i< moves.length; i++){
                if(moves[i].score > bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        else{
            let bestScore = 1000;
            for(let i =0; i< moves.length; i++){
                if(moves[i].score < bestScore){
                    bestScore = moves[i].score;
                    bestMove = i;
                }
            }
        }
        return moves[bestMove];
    }
    return { aiMove }
}

const DisplayController = (() => {
    const container = document.querySelector(".board-container")
    const createBoard = () => {
        container.textContent = "";
        let board = GameBoard.getBoard();
        board.forEach((element, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = index
            container.appendChild(cell);
        });
    }

    const getBoard = () => container;

    const getCell = (index) => {
        return document.getElementById(index);
    }

    const getPlayerSelection = () => {
        const player = document.querySelectorAll('input[name=player-selection]')
        for(input of player){
            if(input.checked){
                return input.value
            }
        }
    }


    const getDifficultySelector = document.getElementById('difficulty')

    const getDifficulty = () => {
        console.log("diff", getDifficultySelector.value)
        return getDifficultySelector.value;
    }
    return { createBoard, getBoard, getCell, getPlayerSelection, getDifficulty}
})();

const GameController = (() => {
    let player1;
    let player2;
    //check if user has selected a sign
    const assignPlayer = (sign) => {
        if(sign === "O") {
            player1 = Player("player1", "O")   
            player2 = Player("player2", "X")
        }
        else {
            player1 = Player("player1", "X")
            player2 = Player("player2", "O")
        }
    }
    //set default difficulty
    let difficulty = "easy";
    //initialise ai
    let ai;
    let turn = 1; 
    let _currentPlayer;
    const boardContainer = DisplayController.getBoard();
    let hasWon = false;

    //start the game and add controls
    const runGame = () => {
        DisplayController.createBoard();
        let playerSelection = DisplayController.getPlayerSelection();
        difficulty = DisplayController.getDifficulty();
        assignPlayer(playerSelection);
        ai = AiController(player1, player2)
        boardContainer.classList.add("active");
        boardContainer.addEventListener("click", playerTurn)
        startButton.textContent = "Reset"
        startButton.addEventListener("click", () => resetGame());
        _currentPlayer = player1;

        if(player2.getSign === "X"){
            _currentPlayer = player2
            aiTurn(difficulty)
        }       
    }

    //set start button to run the game
    const startButton = document.querySelector("#startGame");
    startButton.addEventListener("click", () => runGame(), "once")

    const resetGame = () => {
        GameBoard.resetBoard();
        hasWon = false;
        turn = 1;
        startButton.addEventListener("click", () => runGame(), "once")
        startButton.textContent = "Start"
        
        
    }

    //run the player and ai turns
    const playerTurn = async (event) => {
        if(event.target.classList.contains("cell") && event.target.textContent === "" && _currentPlayer === player1){
            boardContainer.removeEventListener("click", playerTurn)
            GameBoard.placeSign(_currentPlayer.getSign, event.target.id)
            turn++
            hasWon = GameBoard.checkWin(_currentPlayer)
            if(hasWon){
                _endGame(_currentPlayer.name + " has won");
                return;
            }
            else if(!GameBoard.isMoves()){
                _endGame("It's a draw!")
                return;
            }
            else { 
                _checkTurn() 
            }
            
        }
       
        await new Promise(resolve => setTimeout(resolve, 750));
        aiTurn(difficulty)
        
    }

    const aiTurn = (difficulty) => {
        let signPlaced = false;
        let bestMove;
        let board = GameBoard.getBoard();
        while(!signPlaced){
            bestMove = ai.aiMove(difficulty)
            console.log("best move", bestMove, difficulty)
            if(board[bestMove.index] !== player2.getSign && board[bestMove.index] !== player1.getSign){
                GameBoard.placeSign(_currentPlayer.getSign, bestMove.index);
                signPlaced = true;
            }
        }
        turn++;
        let hasWon = GameBoard.checkWin(_currentPlayer)
        if(hasWon){
            _endGame(_currentPlayer.name + " has won");
        }
        else if(!GameBoard.isMoves()){
            _endGame("It's a draw!")
        }
        else { 
            _checkTurn();
            boardContainer.addEventListener("click", playerTurn)
        }
    }

    //switch player turns
    const _checkTurn = () => {
        if(player1.getSign === 'X'){
            if(turn % 2 === 0) {
                _currentPlayer = player2
            }
            else _currentPlayer = player1
        }
        else {
            if(turn % 2 === 0) {
                _currentPlayer = player1
            }
            else _currentPlayer = player2
        }
    }

    const _endGame = (message) => {
        let messageContainer = document.querySelector("#messageContainer");
        messageContainer.textContent = message
    }

    return { runGame }    
})();