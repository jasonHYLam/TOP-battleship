import { Gameboard } from "./gameboard";
import { Player, Computer } from "./player";
// import { displayPlayerGameboard, displayComputerGameboard} from "./displayController";

// i need to change this a little
// need to display both gameboards...
export function makeGameController() {
    // at some point, will need to develop function to placeAllShips, which 

    let playerGameboard = new Gameboard();
    let computerGameboard = new Gameboard();

    const getPlayerGameboard = () => playerGameboard
    const getComputerGameboard = () => computerGameboard

    const player = new Player();
    const computer = new Computer();

    let currentPlayer = player;

    const getCurrentPlayer = () => currentPlayer;

    let enemyGameboard = computerGameboard

    let isGameOver = false;

    const getEnemyGameboard = () => enemyGameboard

    function tryRandomPlacementUntilSuccess(length) {
        // get reference to gameboard; 
        let oldShipCoords = JSON.stringify(getComputerGameboard().allShipCoords)
        let newShipCoords = oldShipCoords
        // get random orientation and random column and row, both between 0 and 9
        function generateRandomOrientation() {
            return ['horizontal', 'vertical'][Math.round(Math.random())]
        }

        function generateRandomCoordinates() {
            const randomCol = Math.floor(Math.random() * 10)
            const randomRow = Math.floor(Math.random() * 10)
            // console.log(randomCol, randomRow)
            return [randomCol, randomRow]
        }
        let isValidPlacement = false

        while (!isValidPlacement) {
            if (generateRandomOrientation() === 'horizontal') {
                getComputerGameboard().placeShip(length, 'horizontal', generateRandomCoordinates())
                newShipCoords = JSON.stringify(getComputerGameboard().allShipCoords)
                if (oldShipCoords !== newShipCoords) isValidPlacement = true;
            }
            else if (generateRandomOrientation() === 'vertical') {
                getComputerGameboard().placeShip(length, 'vertical', generateRandomCoordinates())
                newShipCoords = JSON.stringify(getComputerGameboard().allShipCoords)
                if (oldShipCoords !== newShipCoords) isValidPlacement = true;
            }
        }
    }

    function placeAllShipsOnComputerBoard() {
        tryRandomPlacementUntilSuccess(5)
        tryRandomPlacementUntilSuccess(4)
        tryRandomPlacementUntilSuccess(3)
        tryRandomPlacementUntilSuccess(3)
        tryRandomPlacementUntilSuccess(2)
    }

    placeAllShipsOnComputerBoard();

    function swapPlayerAndEnemy() {
        currentPlayer === player ? currentPlayer = computer : currentPlayer = player;
        enemyGameboard === playerGameboard ? enemyGameboard = computerGameboard : enemyGameboard = playerGameboard;
    }

    // if game is over, set the isGameOver variable to true to end the while loop.
    function checkIsGameOver(gameboard) {
        if (gameboard.checkIsGameOver()) isGameOver = true;
    }

    const getIsGameOver = () => isGameOver
    

    function tryRandomAttackUntilSuccess() {
        if (currentPlayer.name  !== 'Computer') return
        let initialGuesses = JSON.stringify(enemyGameboard.guessedCoords)
        let currentGuesses = initialGuesses;
        let validPlayMade = false;
        while (!validPlayMade) {
            currentPlayer.randomAttack(enemyGameboard)
            currentGuesses = JSON.stringify(enemyGameboard.guessedCoords)
            if (initialGuesses !== currentGuesses) validPlayMade = true;
        }
    }

    function playRound(coords = null) {

        switch (currentPlayer) {
            case player:
                currentPlayer.attack(enemyGameboard,coords)
                checkIsGameOver(enemyGameboard);
                if (isGameOver) break;
                swapPlayerAndEnemy();
                break;
            
            case computer:
                tryRandomAttackUntilSuccess();
                checkIsGameOver(enemyGameboard);
                if (isGameOver) break;
                swapPlayerAndEnemy();
                break;
            }
        }

        return {
            playRound,
            getPlayerGameboard,
            getComputerGameboard,
            getIsGameOver,
            getCurrentPlayer,

        }
}