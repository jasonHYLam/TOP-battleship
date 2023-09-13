
import { makeGameController } from "./gameController";
import { Gameboard } from "./gameboard";

function makeDisplayController() {

    let bodyElement = document.querySelector('body')

    function populateElementInfo(divType,  text=null, parent=null, ...classes) {
        const newElement = document.createElement(divType);
        classes.forEach((className) => newElement.classList.add(className));
        // maybe spaces need another class to determine if they should be clicked or not
        if (text) newElement.textContent = text;
        if (parent) parent.appendChild(newElement)
        return newElement;
    }

    // pregame display code

    // would i have to use placeShip in this? 
    function createPreGameGrid() {
        let initialGrid = document.querySelector(".initial-grid")
        console.log(initialGrid)
        for (let i = 0; i < 10; i++) {
            let rowElement = populateElementInfo('div', null, initialGrid, 'row')
            for (let j = 0; j < 10; j++) {
                let spaceElement = populateElementInfo('div', '', rowElement, 'column', 'pregame-space')
                spaceElement.dataset.row = i;
                spaceElement.dataset.col = j;
            }
        }
    }


    function removeAllHovered() {
        let previouslyHoveredSpaces = document.querySelectorAll('.hovering')
        if (previouslyHoveredSpaces) {
            previouslyHoveredSpaces.forEach(space => {
                space.classList.remove('hovering')
            })
        }
    }
    
    // when hovering, need to get reference to 
    bodyElement.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('pregame-space')) {
            removeAllHovered();
            e.target.classList.add('hovering')

            // maybe check if out of bounds as well
            extendHover()
        }
    })

    function removeClassFromPreviouslyClicked() {
        let previousSelectedShip = document.querySelector('.selected-ship')
        if (previousSelectedShip) previousSelectedShip.classList.remove('selected-ship')
    }

    function extendHover() {
        let shipLength = document.querySelector('.selected-ship')
        let list = shipLength.classList

        function determineOtherHoverElements(shipLength) {
            let head = document.querySelector('.hovering')
            // get reference to row and col
            const headRow = parseInt(head.dataset.row)
            const headCol = parseInt(head.dataset.col)
            console.log(headCol, headRow)

            // get the next few, using array logic
            let numberOfAdditionalHovers = shipLength - 1;
            for (let i = headCol + 1; i < headCol + 1 + numberOfAdditionalHovers; i++) {
                // check if out of bounds; may have to make thingie red as well
                if (i > 9) break
                let otherElement = document.querySelector(`[data-col="${i}"][data-row="${headRow}"]`)
                console.log(otherElement)

                // then set those spaces to be hovering too
                otherElement.classList.add('hovering')
                // for horizontal, would be same row, increase column
            }
        }

        //just wanna get five-ship or four-ship...
        switch (true) {
            case list.contains('five-long'):
                determineOtherHoverElements(5)
                break;

            case list.contains('four-long'):
                determineOtherHoverElements(4)
                break;

            case list.contains('three-long'):
                determineOtherHoverElements(3)
                break;

            case list.contains('two-long'):
                determineOtherHoverElements(2)
                break;

        }
    }

    // clicking on ships
    bodyElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('ship')) {
            removeClassFromPreviouslyClicked();
            removeAllHovered();
            (e.target.classList.add('selected-ship'))

            
        }
    })

    // let pregameSpaces = document.querySelectorAll('.pregame-space')
    // pregameSpaces.forEach(space => {
    //     space.addEventListener('mouseover', (e) => {
    //         console.log(e.target)
    //     })
    // })

    // function to change the look of the ship when clicked
    // function to reset the look of the previously clicked ship

    // function to hover on the grid when the mouse is over it

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

    // game code

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

    let gameController = makeGameController();

    function displayBothGameboards() {
        displayPlayerGameboard(gameController.getPlayerGameboard())
        displayComputerGameboard(gameController.getComputerGameboard())
    }

    function removeBothGameBoards() {
        let gameboardContainers = document.querySelectorAll('.gameboard-container')
        gameboardContainers.forEach(container => container.textContent = "")
    }

    function getClickables() {

        return document.querySelectorAll('.clickable')
    }

    // the game loop is here

    // would i need to consider a future 2 player version?

    createPreGameGrid();
    displayBothGameboards();
    // but these need playerGameboard and computerGameboard... 
    // figure it out from tic tac toe...
    // for each of these spaces
    // if clicked, then play a round
    // this means using attack, using the coordinates... i possibly need to add data.col and data.row... okay

    function checkIfGameOver() {
        return gameController.getIsGameOver() ? true : false;
    }

    // maybe disable all? turn all clickables into unclickable
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

            if (checkIfGameOver()) setGameOver()
            else {
                console.log('b')
                gameController.playRound();
                removeBothGameBoards();
                displayBothGameboards();
            }
        }
    })
}



export {
    makeDisplayController,
}