
import { makeGameController } from "./gameController";
import { Gameboard } from "./gameboard";

// i am gonna put gameController in displayCOntroller;
// will need playRound function in the eventListener
function makeDisplayController() {

    let gameController = makeGameController();
    function populateElementInfo(divType,  text=null, parent=null, ...classes) {
        const newElement = document.createElement(divType);
        classes.forEach((className) => newElement.classList.add(className));
        // maybe spaces need another class to determine if they should be clicked or not
        if (text) newElement.textContent = text;
        if (parent) parent.appendChild(newElement)
        return newElement;
    }

    function determineText(space) {
        if (!space.hasShip && !space.wasGuessed) return '.'
        if (space.hasShip && !space.wasGuessed) return 'o'
        if (!space.hasShip && space.wasGuessed) return 'm'
        if (space.hasShip && space.wasGuessed) return 'X'
    }

    function determineCellStyle(space) {
        if (!space.hasShip && !space.wasGuessed) return 'clickable'
        if (space.hasShip && !space.wasGuessed) return 'clickable'
        if (!space.hasShip && space.wasGuessed) return 'unclickable'
        if (space.hasShip && space.wasGuessed) return 'unclickable'
    }

    // also, make divs clickable in css. don't allow clicks on already clicked.
    // make only the left gameboard clickable

    // maybe set timeout for enemy... wait a bit
    function displayPlayerGameboard(gameboard) {
        let gameboardContainer = document.querySelector('.gameboard-container.right')
        gameboard.grid.map((row, rowIndex) => {
            let rowElement = populateElementInfo('div', null, gameboardContainer, 'row');
            row.map((space) => {
                populateElementInfo('div', determineText(space), rowElement, 'column')
            })
        })
    }

    // make enemy (computer) gameboard clickable
    function displayComputerGameboard(gameboard) {
        let gameboardContainer = document.querySelector('.gameboard-container.left')
        gameboard.grid.map((row, rowIndex) => {
            let rowElement = populateElementInfo('div', null, gameboardContainer, 'row');
            row.map((space, colIndex) => {
                let spaceElement = populateElementInfo('div', determineText(space), rowElement, 'column',  determineCellStyle(space) )
                spaceElement.dataset.col = colIndex;
                spaceElement.dataset.row = rowIndex;
            })
        })
    }

    function displayBothGameboards() {
        displayPlayerGameboard(gameController.getPlayerGameboard())
        displayComputerGameboard(gameController.getComputerGameboard())
    }

    function removeBothGameBoards() {
        let gameboardContainers = document.querySelectorAll('.gameboard-container')
        gameboardContainers.forEach(container => container.textContent = "")
    }

    // do i put clickeventlisteners in displayController, or gameController?
    // or should i put gameController in displayController?

    // for some reason, it made sense to put displayBoard in gameController
    // but would it make sense to put playRound in displayController?

    // mm so UI needs to access the playRound function

    // so maybe, gameController.playRound()

    function getClickables() {

        return document.querySelectorAll('.clickable')
    }

    // the game loop is here

    // would i need to consider a future 2 player version?

    displayBothGameboards();
    // but these need playerGameboard and computerGameboard... 
    // figure it out from tic tac toe...
    // for each of these spaces
    // if clicked, then play a round
    // this means using attack, using the coordinates... i possibly need to add data.col and data.row... okay

    // click event
    let bodyElement = document.querySelector('body')

    // now, i need to end the game... 
    // maybe disable all? turn all clickables into unclickable

    // check what this does
    function checkIfGameOver() {
        console.log(gameController.getPlayerGameboard().checkIsGameOver())
        console.log(gameController.getComputerGameboard().checkIsGameOver())
        if (gameController.getPlayerGameboard().checkIsGameOver() ||
            gameController.getComputerGameboard().checkIsGameOver()
        ) {
            return true
        }


    }

    function setGameOver() {
        const enemyGrid = document.querySelectorAll('.clickable')
        enemyGrid.forEach(el => {
            el.classList.remove('clickable')
            el.classList.add('unclickable')
        })

    }


    bodyElement.addEventListener('click', (el) => {
        if (el.target.classList.contains('clickable')) {
            const space = el.target.dataset;
            gameController.playRound([parseInt(space.col), parseInt(space.row)])
            removeBothGameBoards();
            displayBothGameboards();

            // check what this function is doing
            if (checkIfGameOver()) {
                console.log('a')
                setGameOver()
            }

            else {
                console.log('b')
                // i definitely need to do tryAttackUntilSuccess for computer...
                gameController.playRound();
                removeBothGameBoards();
                displayBothGameboards();
            }
        }
    })
    // console.log(getClickables())

    // getClickables().forEach(el => {
        
    //     el.addEventListener('click', () => {
    //         console.log(
    //         el.dataset.col, el.dataset.row
    //         )
            // i can see that i need to change playRound, so that it takes string
            // will need to adjust for the computer... adjust it?
            // gameController.playRound([el.dataset.col, el.dataset.row])
            // removeBothGameBoards();
            // displayBothGameboards();
            // gameController.playRound();
            // removeBothGameBoards();
            // displayBothGameboards();
    //     })
    // })
    
}



export {
    // displayPlayerGameboard,
    // displayComputerGameboard,
    makeDisplayController,
}