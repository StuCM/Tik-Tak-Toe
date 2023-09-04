const GameBoard = (() => {
    const _wins = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ]
    const board = new Array(9).fill().map((_, index) => index);

    const isMoves = (gameBoard = board) => {
        return gameBoard.some((cell, index) => {
        return cell === index;
    })};

    const placeSign = (sign, index) => {
        board.splice(index, 1, sign);
        let cell = DisplayController.getCell(index);
        cell.textContent += sign;
        console.log(board)
    }

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
        console.log("win", win, isMoves, (!isMoves || win))
        if(!isMoves) { return "draw" }
        else { return win }
    }

    return {board, placeSign, checkWin, isMoves}
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

    const findEmptySpaces = (board) => {
        return board.filter(cell => cell !== 'X' && cell !== 'O' );
    }

    const _minimax = (board, depth, isMax) => {

        if(GameBoard.checkWin(player1, board)){
            return {score:-10}
        }
        else if(GameBoard.checkWin(aiPlayer, board)){
            return {score:10}
        }
        else if(!GameBoard.isMoves(board)){
            return {score:0}
        }

        console.log("board", GameBoard.board)
        let emptySpaces = findEmptySpaces(board)
        console.log("spaces", emptySpaces)
        let moves = [];
        let player = isMax ? aiPlayer : player1;
        console.log("player", player)

        for(let i = 0; i < emptySpaces.length; i++){
            let move = {};
            let index = emptySpaces[i]
            move.index = board[index];
            board[index] = player.getSign;

            if(isMax){
                let result = _minimax(board, depth + 1, false)
                move.score = result.score
                move.depth = depth;
            }
            else{
                let result = _minimax(board, depth + 1, true)
                move.score = result.score;
                move.depth = depth;
            }

            board[index] = move.index;

            moves.push(move);
        }

        var bestMove;
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
    return { _minimax }
}

const GameController = (() => {
    const _assignPlayer = () => {
        const selection = DisplayController.getPlayerSelection
        for(const item of selection) {
            if(item.checked) {
                return Player(player1, item.value);
            }
            return Player(player2, item.value);
        }
    }

    //initalise the game and players
    const player1 = Player("player1", "X")   
    const player2 = Player("player2", "O") 
    const ai = AiController(player1, player2)
    let turn = 1; 
    let _currentPlayer = player1;

    //start the game and add controls
    const runGame = () => {
        DisplayController.createBoard();

        document.addEventListener("click", (event) => { playerTurn(event) })          
    }

    const playerTurn = (event) => {
        if(event.target.classList.contains("cell") && event.target.textContent === ""){
            GameBoard.placeSign(_currentPlayer.getSign, event.target.id)
            _currentPlayer.setMove(Number((event.target.id)))
            turn++
            let hasWon = GameBoard.checkWin(_currentPlayer)
            hasWon ? console.log(_currentPlayer.name + " has won") : null;
            _checkTurn();
            if(_currentPlayer === player2) {
                aiTurn()
            }
        }
        return;
    }

    const aiTurn = () => {
        let bestMove = ai._minimax(GameBoard.board, 0, true)
        console.log("cpu", bestMove)
    }

    const _checkTurn = () => {
        if(turn % 2 === 0) {
            _currentPlayer = player2
        }
        else _currentPlayer = player1
    }
    return { runGame, player2 }
})();

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

    const getPlayerSelection = document.querySelectorAll('input[name=player-selection]')

    return { createBoard, getCell, getPlayerSelection }
})();



window.onload = GameController.runGame