import { Gameboard } from "./gameboard";
import { Player, Computer } from "./player";

function makeGameController() {
    // at some point, will need to develop function to placeAllShips, which 
    // needs to get around the problem of looping placeShip until it is actually placed

    // do i use 
    let playerGameboard = new Gameboard();
    let computerGameboard = new Gameboard();

    const player = new Player();
    const computer = new Computer();

    let currentPlayer = player;
    let enemyPlayer = computer;

    let isGameOver = false;

    // wait, is this mocking? it may be worth a read again...

    playerGameboard.placeShip(5, 'vertical', [9,3]);
    playerGameboard.placeShip(4, 'horizontal', [0,8]);
    playerGameboard.placeShip(3, 'vertical', [5,6]);
    playerGameboard.placeShip(3, 'horizontal', [2,3]);
    playerGameboard.placeShip(2, 'vertical', [1,2]);

    computerGameboard.placeShip(5, 'vertical', [9,3]);
    computerGameboard.placeShip(4, 'horizontal', [0,8]);
    computerGameboard.placeShip(3, 'vertical', [5,6]);
    computerGameboard.placeShip(3, 'horizontal', [2,3]);
    computerGameboard.placeShip(2, 'vertical', [1,2]);

    // i will need DOM in another separate file

    // will need to test each of these...
    function swapPlayerAndEnemy() {
        currentPlayer === player ? currentPlayer = computer : currentPlayer = player;
        enemyPlayer === player ? enemyPlayer = computer : enemyPlayer = player;
    }

    function checkIsGameOver(gameboard) {
        // hmm i think i need to change the checkIsGameOver() in gameboard.js cus that sets isGameOver in gameboard... need to change test
        if (gameboard.checkIsGameOver()) isGameOver = true;
    }
    // need while loop, while game isn't finished
    // need to play a move, and somehow also get around problem of returning if invalid move
    function playRound() {
        switch (currentPlayer) {
            case player:
                let attackCoords = prompt('coords to attack, in "[x,y]"')
                // how do i make it so that if an invalid move is made, try again?
                // do i implement that here?
                // there are three places i could implement it; receiveAttack(), attack(), or playRound()
                // i need to make use of something? either the return statement, or the gameboard changing? or maybe wasGuessed changing?
                currentPlayer.attack(enemyPlayer, attackCoords)
                // maybe print the board...?
                checkIsGameOver(computerGameboard);
                swapPlayer();
                break;
            
            case computer:
                currentPlayer.randomAttack(playerGameboard);
                checkIsGameOver(playerGameboard);
                swapPlayer();
                break;
            }
        }

        // while (!isGameOver) {
            playRound()

        // }
}