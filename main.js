const GameBoard = (() => {
    const _wins = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ]
    const board = new Array(9).fill(null);

    const isMoves = (gameBoard = board) => {
        return gameBoard.some((cell) => {
        return cell === null;
    })};

    const placeSign = (sign, index) => {
        board.splice(index, 1, sign);
        let cell = DisplayController.getCell(index);
        cell.textContent += sign;
        console.log(board)
    }

    const checkWin = (player) => {
        const moves = player.getMoves;
        if(moves.length < 3) {
            return false;
        }
        let win = _wins.some(combinations => {
                    return combinations.every(index => {
                        return moves.includes(index);
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

    const _checkForWin = (player1, aiPlayer) => {
        if(GameBoard.checkWin(player1)) {
            return -10;
        }
        else if(GameBoard.checkWin(aiPlayer)) {
            return 10;
        }
        else { return 0 }
    }
    const _minimax = (board, depth, isMax) => {
        let score = _checkForWin(player1, aiPlayer);
        console.log("mm running",score)
        if (score !== 0) {
            return score;
        }

        if(GameBoard.isMoves(board) === 'draw') {
            return 0;
        }

        if(isMax) {
            let best = -1000;
            board.forEach((cell, index) => {
                if(board[index] === null){
                    console.log("sign", aiPlayer.getSign)
                    board[index] = aiPlayer.getSign
                    best = Math.max(best, _minimax(board, depth +1, !isMax));
                    board[index] = "1"
                }
            })
            console.log("mm" , best)
            return best;
        }
        else {
            let best = 1000;
            board.forEach((cell, index) => {
                if(board[index] === null){
                    board[index] = player1.getSign
                    best = Math.min(best, _minimax(board, depth +1, !isMax));
                    board[index] = "1"
                }
            })
            console.log("mm" , best)
            return best;
        }
    }

    const _findBestMove = (board, aiPlayer) => {
        let bestValue = -1000;
        let bestMove = -1;

        board.forEach((cell, index) => {
            if(board[index] === null) {
                board[index] = aiPlayer.getSign
            }
            let moveVal = _minimax(board, 0, true)
            board[index] = null;
            if(moveVal > bestValue) {
                bestMove = index;
                bestValue = moveVal;
            }
        })
        console.log("best move is ", bestMove)
        return bestMove;
    }

    const bestMove = () => _findBestMove(GameBoard.board, aiPlayer)

    return { bestMove }
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
        console.log("1", _currentPlayer.getSign, ai.bestMove())
        GameBoard.placeSign(_currentPlayer.getSign, ai.bestMove());
        _currentPlayer.setMove(ai.bestMove());
        turn++;
        let hasWon = GameBoard.checkWin(_currentPlayer)
        hasWon ? console.log(_currentPlayer.name + " has won") : null;
        _checkTurn();
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