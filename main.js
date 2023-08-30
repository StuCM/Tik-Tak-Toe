const GameBoard = (() => {
    const board = new Array(9).fill(" ");
    const placeSign = (sign, index) => {
        board.splice(index, 0, sign);
        const cell = DisplayController.getCell(index);
        cell.textContent += sign;
    }
    return {board, placeSign}
})();

const Player = (name, playerSign) => {
    let getSign = playerSign;
    return {name, getSign}
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
    let currentPlayer = player1;

    const runGame = () => {
        DisplayController.createBoard();
        document.addEventListener("click", (event) => {
            playerTurn(event)
            turn++;
            _checkTurn();
        })          
    }

    const playerTurn = (event) => {
        if(event.target.classList.contains("cell")){
            GameBoard.placeSign(currentPlayer.getSign, event.target.id)
        }
    }

    const _checkTurn = () => {
        if(turn % 2 === 0) {
            currentPlayer = player2
        }
        else currentPlayer = player1
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