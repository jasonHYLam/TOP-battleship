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
    let enemyGameboard = computerGameboard

    let isGameOver = false;

    const getEnemyGameboard = () => enemyGameboard

    function tryRandomPlacementUntilSuccess(length) {
        // get reference to gameboard; 
        // maybe if not successful, oldShipCoords becomes this... phooey
        let oldShipCoords = JSON.stringify(getComputerGameboard().allShipCoords)
        // console.log(oldShipCoords)
        // get reference to new gameboard
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
        // have isValidPlacement set to false
        // while (!isValidPlacement) {
            // if vertical
            // place ship
            // if oldGameboard's has Ship !== newGameboard's has Ship then set validplacement
        // }

        while (!isValidPlacement) {
            if (generateRandomOrientation() === 'horizontal') {
                console.log('try horizontal placement')
                getComputerGameboard().placeShip(length, 'horizontal', generateRandomCoordinates())
                newShipCoords = JSON.stringify(getComputerGameboard().allShipCoords)
                // console.log(`new ship coords: ${newShipCoords}`)
                // console.log(newShipCoords)
                if (oldShipCoords !== newShipCoords) isValidPlacement = true;
                console.log(isValidPlacement)
            }
            else if (generateRandomOrientation() === 'vertical') {
                console.log('try vertical placement')
                getComputerGameboard().placeShip(length, 'vertical', generateRandomCoordinates())
                newShipCoords = JSON.stringify(getComputerGameboard().allShipCoords)
                // console.log(`new ship coords: ${newShipCoords}`)
                // console.log(newShipCoords)
                if (oldShipCoords !== newShipCoords) isValidPlacement = true;
                console.log(isValidPlacement)
            }
        }
    }

    // somehow, i'll need to get the grid placed ships, and convert them into this.
    // wait, is this mocking? it may be worth a read again...
    // playerGameboard.placeShip(5, 'vertical', [9,6]);
    // playerGameboard.placeShip(4, 'horizontal', [0,8]);
    // playerGameboard.placeShip(3, 'vertical', [5,6]);
    // playerGameboard.placeShip(3, 'horizontal', [2,3]);
    // playerGameboard.placeShip(2, 'vertical', [1,2]);

    // computerGameboard.placeShip(5, 'vertical', [9,3]);
    // computerGameboard.placeShip(4, 'horizontal', [0,8]);
    // getComputerGameboard().placeShip(3, 'vertical', [5,6]);
    // computerGameboard.placeShip(3, 'horizontal', [2,3]);
    // getComputerGameboard().placeShip(2, 'vertical', [1,2]);
    // console.log(getComputerGameboard().allShipCoords)
    console.log(5)
    tryRandomPlacementUntilSuccess(5)
    console.log(' ')

    console.log(4)
    tryRandomPlacementUntilSuccess(4)
    console.log(' ')

    console.log(3)
    tryRandomPlacementUntilSuccess(3)
    console.log(' ')

    console.log(3)
    tryRandomPlacementUntilSuccess(3)
    console.log(' ')

    console.log(2)
    tryRandomPlacementUntilSuccess(2)

    // maybe i need to change this? maybe not!
    function swapPlayerAndEnemy() {
        currentPlayer === player ? currentPlayer = computer : currentPlayer = player;
        enemyGameboard === playerGameboard ? enemyGameboard = computerGameboard : enemyGameboard = playerGameboard;
    }

    // if game is over, set the isGameOver variable to true to end the while loop.
    function checkIsGameOver(gameboard) {
        if (gameboard.checkIsGameOver()) isGameOver = true;
    }

    const getIsGameOver= () => isGameOver
    
    function visualiseGameboard(gameboard) {
        // how do i convert the gameboard with the spaces, into a console log?
        // maybe a double map
        gameboard.grid.map(row => {
            console.log(
            row.map(space => {
                if(space.hasShip === false && space.wasGuessed === false) return '_'
                else if (space.hasShip === false && space.wasGuessed === true) return 'm'
                else if (space.hasShip === true && space.wasGuessed === false) return 'o'
                else if (space.hasShip === true && space.wasGuessed === true) return 'x'
            }
            )
                )
        })
    }

    function tryRandomAttackUntilSuccess() {

        let initialGuesses = JSON.stringify(enemyGameboard.guessedCoords)
        let currentGuesses = initialGuesses;
        let validPlayMade = false;
        while (!validPlayMade) {
            currentPlayer.randomAttack(enemyGameboard)
            currentGuesses = JSON.stringify(enemyGameboard.guessedCoords)
            if (initialGuesses !== currentGuesses) validPlayMade = true;
        }
    }

    function playRound(coords=null) {

        switch (currentPlayer) {
            case player:
                console.log('player')
                // visualiseGameboard(enemyGameboard);
                currentPlayer.attack(enemyGameboard,coords)
                checkIsGameOver(enemyGameboard);
                swapPlayerAndEnemy();
                break;
            
            case computer:
                console.log('computer')
                // visualiseGameboard(enemyGameboard);
                tryRandomAttackUntilSuccess();
                checkIsGameOver(enemyGameboard);
                swapPlayerAndEnemy();
                break;
            }
        }

        return {
            playRound,
            getPlayerGameboard,
            getComputerGameboard,
            getIsGameOver,
        }
}