import { Gameboard } from "./gameboard";
import { Player, Computer } from "./player";

export function makeGameController() {
    // at some point, will need to develop function to placeAllShips, which 
    // needs to get around the problem of looping placeShip until it is actually placed

    // do i use 
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

    computerGameboard.placeShip(5, 'vertical', [9,6]);
    computerGameboard.placeShip(4, 'horizontal', [0,8]);
    // computerGameboard.placeShip(4, 'vertical', [5,9]);
    // computerGameboard.placeShip(4, 'horizontal', [5,9]);
    computerGameboard.placeShip(3, 'vertical', [5,6]);
    computerGameboard.placeShip(3, 'horizontal', [2,3]);
    computerGameboard.placeShip(2, 'vertical', [1,2]);

    // i will need DOM in another separate file

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

        // i need to console log each row
        

    }

    // check if the guessedCoords array changes; if so, the attack was successful.
    // this absolutely must get tested...
    function tryAttackUntilSuccess(col, row) {
        let initialGuesses = JSON.stringify(enemyGameboard.guessedCoords)
        let currentGuesses;

        switch (currentPlayer) {
            case player:
                while (initialGuesses === currentGuesses) {
                    currentPlayer.attack(enemyGameboard, [col, row])
                    currentGuesses = JSON.stringify(enemyGameboard.guessedCoords)
                }
                break;

            case player:
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
                // let [col, row] = prompt('coords to attack, in "[x,y]"').split(",")

                // how do i make it so that if an invalid move is made, try again?
                // do i implement that here?
                // there are three places i could implement it; receiveAttack(), attack(), or playRound()
                // i need to make use of something? either the return statement, or the gameboard changing? or maybe wasGuessed changing?

                // currentPlayer.attack(enemyGameboard, [col, row])
                // currentPlayer.tryAttackUntilSuccess(enemyGameboard, [col, row])
                // maybe print the board...?
                visualiseGameboard(enemyGameboard);
                checkIsGameOver(enemyGameboard);
                swapPlayer();
                break;
            
            case computer:
                console.log('computer')
                visualiseGameboard();
                // currentPlayer.tryAttackUntilSuccess(enemyGameboard);
                checkIsGameOver(enemyGameboard);
                swapPlayer();
                break;
            }
        }

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