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

    // need while loop, while game isn't finished
    // need to play a move, and somehow also get around problem of returning if invalid move
    function playRound() {
        switch (currentPlayer) {
            case player:
                let attackCoords = prompt('coords to attack, in "[x,y]"')
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
}