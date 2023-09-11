import { Gameboard } from "./gameboard";
import { Player, Computer } from "./player";
import { displayGameboard } from "./displayController";

// i need to change this a little
// need to display both gameboards...
export function makeGameController() {
    // at some point, will need to develop function to placeAllShips, which 

    let playerGameboard = new Gameboard();
    let computerGameboard = new Gameboard();

    const player = new Player();
    const computer = new Computer();

    let currentPlayer = player;
    let enemyGameboard = computerGameboard

    let isGameOver = false;

    // i can see that i need to change displayGameboard in displayController
    // cus it takes a reference to the parent container, which needs to change
    function displayBothGameboards() {
    }

    // wait, is this mocking? it may be worth a read again...
    // playerGameboard.placeShip(5, 'vertical', [9,6]);
    // playerGameboard.placeShip(4, 'horizontal', [0,8]);
    // playerGameboard.placeShip(3, 'vertical', [5,6]);
    // playerGameboard.placeShip(3, 'horizontal', [2,3]);
    playerGameboard.placeShip(2, 'vertical', [1,2]);

    // computerGameboard.placeShip(5, 'vertical', [9,3]);
    // computerGameboard.placeShip(4, 'horizontal', [0,8]);
    // computerGameboard.placeShip(3, 'vertical', [5,6]);
    // computerGameboard.placeShip(3, 'horizontal', [2,3]);
    computerGameboard.placeShip(2, 'vertical', [1,2]);

    // maybe i need to change this? maybe not!
    function swapPlayerAndEnemy() {
        currentPlayer === player ? currentPlayer = computer : currentPlayer = player;
        enemyGameboard === playerGameboard ? enemyGameboard = computerGameboard : enemyGameboard = playerGameboard;
    }

    // if game is over, set the isGameOver variable to true to end the while loop.
    function checkIsGameOver(gameboard) {
        if (gameboard.checkIsGameOver()) isGameOver = true;
    }
    
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

    // check if the guessedCoords array changes; if so, the attack was successful.
    // this absolutely must get tested...
    function tryAttackUntilSuccess() {

        let initialGuesses = JSON.stringify(enemyGameboard.guessedCoords)
        let currentGuesses = initialGuesses;

        let validPlayMade = false;

        switch (currentPlayer) {
            case player:
                while (!validPlayMade) {
                    // let [col, row] = prompt('coords to attack, in "x,y"').split(",")
                    const col = parseInt(prompt('col to attack'));
                    const row = parseInt(prompt('row to attack'));
                    currentPlayer.attack(enemyGameboard, [col, row])
                    currentGuesses = JSON.stringify(enemyGameboard.guessedCoords)
                    if (initialGuesses !== currentGuesses) validPlayMade = true;
                }
                break;

            case computer:
                while (!validPlayMade) {
                    currentPlayer.randomAttack(enemyGameboard)
                    currentGuesses = JSON.stringify(enemyGameboard.guessedCoords)
                    if (initialGuesses !== currentGuesses) validPlayMade = true;
                }
                break;
        }
    }

    function playRound() {

        switch (currentPlayer) {
            case player:
                console.log('player')
                displayGameboard(enemyGameboard)
                visualiseGameboard(enemyGameboard);
                // tryAttackUntilSuccess()
                checkIsGameOver(enemyGameboard);
                swapPlayerAndEnemy();
                break;
            
            case computer:
                console.log('computer')
                displayGameboard(enemyGameboard)
                visualiseGameboard(enemyGameboard);
                // tryAttackUntilSuccess();
                checkIsGameOver(enemyGameboard);
                swapPlayerAndEnemy();
                break;
            }
        }

    function playGame() {
        // while (!isGameOver) {
            playRound()
            if (isGameOver) console.log('GAME IS OVER')
        // }

    }
        return {
            tryAttackUntilSuccess,
            playGame,
        }
}