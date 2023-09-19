import { makeGameController } from "./gameController";
import { Gameboard } from "./gameboard";

function makeDisplayController() {

    let currentShip = null;
    let movingShip = false;
    function setMovingShipToTrue() {movingShip = true}
    function setMovingShipToFalse() {movingShip = false}
    function checkIfMovingShip() {return movingShip}

    function findShipFromClassListAndPerformAction(list, action) {
        switch (true) {
            case list.contains('carrier'):
                action('carrier'); break;

            case list.contains('battleship'):
                action('battleship'); break;

            case list.contains('cruiser'):
                action('cruiser'); break;

            case list.contains('submarine'):
                action('submarine'); break;

            case list.contains('destroyer'):
                action('destroyer'); break;
        }
    }

    let shipLengths = {
        'carrier': 5,
        'battleship': 4,
        'cruiser': 3,
        'submarine': 3,
        'destroyer': 2,
    }

    function getCurrentShip() {
        return currentShip;
    }

    function setCurrentShip(ship) {
        currentShip = ship
    }

    function setCurrentShipFromDOM(element) {
        let list = element.classList
        findShipFromClassListAndPerformAction(list, setCurrentShip)
    }


    function resetCurrentShip() {
        currentShip = null
    }

    function getCurrentShipLength() {
        return shipLengths[currentShip];
    }

    let bodyElement = document.querySelector('body')

    function populateElementInfo(divType,  text=null, parent=null, ...classes) {
        const newElement = document.createElement(divType);
        classes.forEach((className) => newElement.classList.add(className));
        if (text) newElement.textContent = text;
        if (parent) parent.appendChild(newElement)
        return newElement;
    }

    // pregame display code

    function createPreGameGrid() {
        let initialGrid = document.querySelector(".initial-grid")
        for (let i = 0; i < 10; i++) {
            let rowElement = populateElementInfo('div', null, initialGrid, 'row')
            for (let j = 0; j < 10; j++) {
                let spaceElement = populateElementInfo('div', '', rowElement, 'column', 'pregame-space')
                spaceElement.dataset.row = i;
                spaceElement.dataset.col = j;
            }
        }
    }

    function removeHoveredClass(hoveredElementSelector) {
        let hovering = document.querySelectorAll(`.${hoveredElementSelector}`)
        if (hovering) {
            hovering.forEach(space => {
                space.classList.remove(hoveredElementSelector)
            })
        }
    }

    function removeAllHovered() {
        removeHoveredClass('valid-hovering');
        removeHoveredClass('invalid-hovering');
        removeHoveredClass('ship-head-hover')
    }

    function addShipHeadStyleForAllShips(clickTarget) {
        let list = clickTarget.classList
        function addShipHeadStyle(shipClass) {
            document.querySelector(`.${shipClass}.ship-head`).classList.add('ship-head-hover')
        }
        findShipFromClassListAndPerformAction(list, addShipHeadStyle)
    }
    
    // when hovering, need to get reference to 
    bodyElement.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('pregame-space')) {
            removeAllHovered();
            if (currentShip) extendHover(e.target)
            addShipHeadStyleForAllShips(e.target)
        }
    })

    // when the mouse leaves the grid, hide the hovered spaces
    document.querySelector('.initial-grid').addEventListener('mouseleave', () => {
        removeAllHovered();
    })

    // dont change this
    // is this why stuff is weird?
    function removeClassFromPreviouslySelected() {
        let previousSelectedShip = document.querySelector('.selected-ship-off-grid')
        if (previousSelectedShip) previousSelectedShip.classList.remove('selected-ship-off-grid')
    }

    function extendHover(clickTarget) {

        function markValidHover(col, row) {
            let space = document.querySelector(`[data-col="${col}"][data-row="${row}"]`)
            space.classList.add('valid-hovering')
        }

        function markInvalidHover(col, row) {
            let space = document.querySelector(`[data-col="${col}"][data-row="${row}"]`)
            space.classList.add('invalid-hovering')
        }
        
        function determineOtherHoverElements(clickTarget, dataLength) {
            let invalidPlacement = false;
            const headRow = parseInt(clickTarget.dataset.row)
            const headCol = parseInt(clickTarget.dataset.col)
            let shipLength = parseInt(dataLength);

            // get the next few, using array logic
            for (let i = headCol; i < headCol + shipLength; i++) {
                if (i > 9 || checkIfAlreadyPlaced(i, headRow)) {
                    invalidPlacement = true;
                    break;
                }
                // for horizontal, would be same row, increase column
            }

            if (!invalidPlacement) {
                for (let i = headCol; i < headCol + shipLength; i++) markValidHover(i, headRow)
            }
            else if (invalidPlacement) {
                // for (let i = headCol; (i < 10) || (i < headCol + shipLength); i++) markInvalidHover(i, headRow)
                for (let i = headCol; i < headCol + shipLength; i++) markInvalidHover(i, headRow)
            }
        }

        determineOtherHoverElements(clickTarget, getCurrentShipLength())
    }

    function greyOutSelectedShip() {
        // dont need to change this
        document.querySelector('.selected-ship-off-grid').classList.add('grey-out')
    }

    function addShipClassToSpace(space) {
        space.classList.add('ship-in-space')
        space.classList.add(getCurrentShip())
    }

    function addShipHead(clickTarget) {
        clickTarget.classList.add('ship-head')
    }

    function removeShipHead() {
        document.querySelector(`.ship-head.${getCurrentShip()}`).classList.remove('ship-head')
    }

    // clicking on spaces on grid

    // i need to not add stuff when there's a element too close... do i need to use row and column?
    //maybe
    // check if can place..

    function decorateSelectedShip(clickTarget) {
        function decorate(shipName) {
            const grid = document.querySelector('.initial-grid')
            grid.querySelectorAll(`.${shipName}`).forEach(space => {
                space.classList.add('selected-ship-on-grid')
            })
        }
        findShipFromClassListAndPerformAction(clickTarget.classList, decorate)
    }

    // will need a removeDecoration function 
    function removeSelectedShipDecoration() {
        document.querySelectorAll(`.selected-ship-on-grid`).forEach(space => {
            space.classList.remove('selected-ship-on-grid')
        })
    }

    bodyElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('ship-head')) {
            console.log('clicked ship head')

            setMovingShipToTrue()
            // this sets currentShip, when clicking on the ship head
            function setCorrespondingShipFromGrid(clickTarget) {
                setCurrentShipFromDOM(clickTarget)
            }

            setCorrespondingShipFromGrid(e.target)
            // need to decorate ship... darken to indicate it is clicked
            decorateSelectedShip(e.target)
            // also need to remove decoration... when successful replacement, or maybe unsuccessful?


            console.log(currentShip)
            // add the rotate decoration

            // get the ship that was clicked

            // move it again, show hover
            // may need to use extendHover. 
            extendHover(e.target)
            // how do i place the ship, and remove the ship?

            // well, i think i need to introduce another thing in the click event on the board. 
            // remove currentShip instance on the board if it exists.
            // might need if statement on the first placement of it... 


            // try to rotate
            // might need another variable called rotate
            // determine if rotateMode is on; if it is, then clicking on ship head will make it rotate, if possible

        }
    })

    // clicking on the grid to place a ship
    bodyElement.addEventListener('click', (e) => {
        // don't allow click if ship is not selected
        if (!currentShip) return
        if (e.target.classList.contains('pregame-space')) {
        
            if (checkInvalidPlacement(e.target)) return
            
            //move existing ship
            if (checkIfMovingShip()) {
                removeShipHead();
                // also need to remove movingShip decoration... 
                removeSelectedShipDecoration();
                removeCurrentShipFromGrid();
                setMovingShipToFalse();
            }
            //place ship for the first time
            else {
                greyOutSelectedShip();
                removeClassFromPreviouslySelected();
            }

            let allHovered = document.querySelectorAll('.valid-hovering')
            allHovered.forEach(space => addShipClassToSpace(space))
            removeAllHovered();
            addShipHead(e.target);
            resetCurrentShip();
        }
    })
    // for length of ship, along horionztal or vertical, check each space if out of bounds or if ship-in-space
    function checkIfAlreadyPlaced(col, row) {
        return document.querySelector(`[data-col="${col}"][data-row="${row}"]`).classList.contains('ship-in-space')
    }

    function checkInvalidPlacement(clickTarget) {
        let cannotPlaceShip = false;

        const length = getCurrentShipLength();
        const headRow = parseInt(clickTarget.dataset.row)
        const headCol = parseInt(clickTarget.dataset.col)

        // maybe requires vertical and horizontal
        // if horizontal
        // means row is the same, and columns change
        for (let i = headCol; i < headCol + length; i++) {
            if (i > 10) cannotPlaceShip = true;
            if (checkIfAlreadyPlaced(i, headRow)) cannotPlaceShip = true;
        }
        return cannotPlaceShip;
    }

    function removeShipFromGrid(shipName) {
        const grid = document.querySelector('.initial-grid')
        grid.querySelectorAll(`.${shipName}`).forEach(space => {
            space.classList.remove(shipName)
            space.classList.remove('ship-in-space')
        })
    }

    function removeCurrentShipFromGrid() {
        removeShipFromGrid(getCurrentShip())
    }

    // remove the corresponding ship from the board, when clicking on it.
    function removeCorrespondingShipFromGridForAllShips(shipToReplace) {
        let classList = shipToReplace.classList;
        findShipFromClassListAndPerformAction(classList, removeShipFromGrid);
    }

    // click on ship which is off the board, for placing on board
    bodyElement.addEventListener('click', (e) => {
        let list = e.target.classList
        if (list.contains('ship')) {
            if (list.contains('grey-out')) removeCorrespondingShipFromGridForAllShips(e.target);
            removeClassFromPreviouslySelected();
            removeAllHovered();
            (list.add('selected-ship-off-grid'))
            setCurrentShipFromDOM(e.target)
        }
    })

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