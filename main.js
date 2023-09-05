const GameBoard = (() => {
    //winning combinations
    const _wins = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ]
    //create the board array with indexes
    const board = new Array(9).fill().map((_, index) => index);

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
        console.log(board)
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

    return {board, placeSign, checkWin, isMoves, findEmptySpaces}
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

const AiController = (player1, aiPlayer, difficulty) => {

    const aiMove = () => {
        let move;
        const bestMoveRatio = Math.floor(Math.random()*100);
        switch(difficulty) {
            case easy:
                move = randomMove();
                break;
            case medium:
                const randomNum = Math.floor(Math.random()*30);
                if(randomNum > bestMoveRatio){
                    move = minimax(GameBoard.board, 0, true)
                }
                else { move = randomMove()}
                break;
            case hard:
                randomNum = Math.floor(Math.random()*60);
                if(randomNum > bestMoveRatio){
                    move = minimax(GameBoard.board, 0, true)
                }
                else { move = randomMove()}
                break;
            case unbeatable:
                move = minimax(GameBoard.board, 0, true);
                break;
        }
        return move;

    }

    const randomMove = () => {
        let emptySpaces = GameBoard.findEmptySpaces(GameBoard.board);
        const randomNum = Math.floor(Math.random() * emptySpaces.length)
        return emptySpaces[randomNum];
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
    const createBoard = () => {
        const container = document.querySelector(".board-container")
        GameBoard.board.forEach((element, index) => {
            const cell = document.createElement("div");
            cell.classList.add("cell");
            cell.id = index
            container.appendChild(cell);
        });
    }

    const getCell = (index) => {
        return document.getElementById(index);
    }

    const getPlayerSelection = window.document.querySelectorAll('input[name=player-selection]')

    const getDifficulty = window.document.querySelectorAll('input[name="difficulty"]')

    console.log(getDifficulty, getPlayerSelection)
    return { createBoard, getCell, getPlayerSelection, getDifficulty }
})();

const GameController = (() => {
    //initialise the players
    let player1 = Player("player1", "X")   
    let player2 = Player("player2", "O")

    //check if user has selected a sign
    const assignPlayer = (sign) => {
        console.log(sign)
        if(sign === "O") {
            player1 = Player("player1", "O")   
            player2 = Player("player2", "X")
            console.log(player1, player2)
        }
        else {
            player1 = Player("player1", "X")
            player2 = Player("player2", "O")
            console.log("run",player1, player2)
        }
    }

    let playerSign = DisplayController.getPlayerSelection
    playerSign.forEach((input) => {
        input.addEventListener("change", () => {assignPlayer(input.value) ; console.log(input)})
    })

    let difficulty;
    let difficultyInput = DisplayController.getDifficulty
    difficultyInput.forEach((input) => {
        input.addEventListener("change", () => {difficulty = input.value; console.log(difficulty)})
    })

    //initialise the game and the ai
    const ai = AiController(player1, player2, difficulty)
    let turn = 1; 
    let _currentPlayer = player1;

    //start the game and add controls
    const runGame = () => {
        DisplayController.createBoard();

        document.addEventListener("click", (event) => { playerTurn(event) })          
    }

    //run the player and ai turns
    const playerTurn = async (event) => {
        if(event.target.classList.contains("cell") && event.target.textContent === ""){
            GameBoard.placeSign(_currentPlayer.getSign, event.target.id)
            turn++
            let hasWon = GameBoard.checkWin(_currentPlayer)
            hasWon ? console.log(_currentPlayer.name + " has won") : null;
            _checkTurn();
            
        }
        if(_currentPlayer === player2) {
            await new Promise(resolve => setTimeout(resolve, 750));
            aiTurn()
        }
    }

    const aiTurn = () => {
        let bestMove = ai.aiMove(difficulty)
        GameBoard.placeSign(_currentPlayer.getSign, bestMove.index);
        turn++;
        _checkTurn()
    }

    //switch player turns
    const _checkTurn = () => {
        if(turn % 2 === 0) {
            _currentPlayer = player2
        }
        else _currentPlayer = player1
    }
    return { runGame, player2 }
})();



window.onload = GameController.runGame