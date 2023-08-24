const GameBoard = (() => {
    const board = new Array(9).fill(" ");
    const placeSign = (sign, index) => {
        board.splice(index, 0, sign);
    }
    return {board, placeSign}
})();

const GameController = (() => {
    
    return
})

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
    return {createBoard}
})();

const Player = (playerSign) => {
    let sign = playerSign;
    return {sign}
}

window.onload = DisplayController.createBoard;