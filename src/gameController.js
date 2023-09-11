import { Gameboard } from "./gameboard";
import { Player, Computer } from "./player";

export function makeGameController() {
    // at some point, will need to develop function to placeAllShips, which 
    // needs to get around the problem of looping placeShip until it is actually placed

    let playerGameboard = new Gameboard();
    let computerGameboard = new Gameboard();

    const player = new Player();
    const computer = new Computer();

    let currentPlayer = player;
    let enemyGameboard = computerGameboard

    let isGameOver = false;

    // wait, is this mocking? it may be worth a read again...
    playerGameboard.placeShip(5, 'vertical', [9,6]);
    playerGameboard.placeShip(4, 'horizontal', [0,8]);
    playerGameboard.placeShip(3, 'vertical', [5,6]);
    playerGameboard.placeShip(3, 'horizontal', [2,3]);
    playerGameboard.placeShip(2, 'vertical', [1,2]);

    computerGameboard.placeShip(5, 'vertical', [9,3]);
    computerGameboard.placeShip(4, 'horizontal', [0,8]);
    computerGameboard.placeShip(3, 'vertical', [5,6]);
    computerGameboard.placeShip(3, 'horizontal', [2,3]);
    computerGameboard.placeShip(2, 'vertical', [1,2]);

    // will need to test each of these...
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

        // i still need to change this... change it to a function and call it in player
        function askPlayerForCoords() {
            // maybe make regex in the future...
            return prompt('coords to attack, in "[x,y]"').split(",")
        }

        let initialGuesses = JSON.stringify(enemyGameboard.guessedCoords)
        let currentGuesses = initialGuesses;

        switch (currentPlayer) {
            case player:
                // is it cus of this while loop?
                let validPlayMade = false;
                // while (initialGuesses === currentGuesses) {
                while (!validPlayMade) {
                    console.log(initialGuesses === currentGuesses)
                    console.log('work?')
                    // let [col, row] = askPlayerForCoords();
                    let [col, row] = prompt('coords to attack, in "x,y"').split(",")
                    // let [col, row] = [1,3]
                    currentPlayer.attack(enemyGameboard, [col, row])
                    currentGuesses = JSON.stringify(enemyGameboard.guessedCoords)
                    console.log(initialGuesses)
                    console.log(currentGuesses)
                    if (initialGuesses !== currentGuesses) validPlayMade = true;
                }
                break;

            case computer:
                while (initialGuesses !== currentGuesses) {
                    currentPlayer.randomAttack(enemyGameboard)
                    currentGuesses = JSON.stringify(enemyGameboard.guessedCoords)
                }
                break;
        }
    }
    // need while loop, while game isn't finished
    // need to play a move, and somehow also get around problem of returning if invalid move
    function playRound() {

        switch (currentPlayer) {
            case player:
                console.log('player')
                visualiseGameboard(enemyGameboard);
                // let [col, row] = prompt('coords to attack, in "[x,y]"').split(",")
                tryAttackUntilSuccess()
                checkIsGameOver(enemyGameboard);
                swapPlayerAndEnemy();
                console.log(currentPlayer)
                console.log(enemyGameboard)
                break;

                //does it swap at all?
            
            case computer:
                console.log('computer')
                visualiseGameboard(enemyGameboard);
                tryAttackUntilSuccess();
                checkIsGameOver(enemyGameboard);
                swapPlayerAndEnemy();
                break;
            }
        }

        // the culprit for infinite tsukuyomi is here
    function playGame() {
        while (!isGameOver) {
            playRound()
        }

    }
        return {
            tryAttackUntilSuccess,
            playGame,
        }
}