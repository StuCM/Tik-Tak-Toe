const GameBoard = (() => {
    const _wins = [
        [0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]
    ]
    const board = new Array(9).fill(null);

    const placeSign = (sign, index) => {
        board.splice(index, 1, sign);
        const cell = DisplayController.getCell(index);
        cell.textContent += sign;
        console.log(board)
    }
    const checkWin = (player) => {
        const moves = player.getMoves;
        if(moves.length < 3) {
            return;
        }
        return _wins.some(combinations => {
            return combinations.every(index => {
                return moves.includes(index);
            })
        })
    }
    return {board, placeSign, checkWin}
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

    const player1 = Player("player1", "X")   
    const player2 = Player("player2", "O")  
    let turn = 1; 
    let _currentPlayer = player1;

    const runGame = () => {
        DisplayController.createBoard();
        document.addEventListener("click", (event) => {
            console.log("event", event)
            playerTurn(event)
            turn++;
            let hasWon = GameBoard.checkWin(_currentPlayer)
            console.log("winner", hasWon)
            if (hasWon) {
                console.log(_currentPlayer.name + " has won")
            }
            _checkTurn();
        })          
    }

    const playerTurn = (event) => {
        if(event.target.classList.contains("cell")){
            GameBoard.placeSign(_currentPlayer.getSign, event.target.id)
            _currentPlayer.setMove(Number((event.target.id)))
        }
    }

    const _checkTurn = () => {
        if(turn % 2 === 0) {
            _currentPlayer = player2
        }
        else _currentPlayer = player1
    }
    return { runGame }
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