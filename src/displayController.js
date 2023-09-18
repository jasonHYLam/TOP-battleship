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
        switch (true) {
            case list.contains('carrier'): 
                addShipHeadStyle('carrier'); break

            case list.contains('battleship'): 
                addShipHeadStyle('battleship'); break

            case list.contains('cruiser'): 
                addShipHeadStyle('cruiser'); break

            case list.contains('submarine'): 
                addShipHeadStyle('submarine'); break

            case list.contains('destroyer'): 
                addShipHeadStyle('destroyer'); break

        }

    }
    
    // when hovering, need to get reference to 
    bodyElement.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('pregame-space')) {
            removeAllHovered();
            if (document.querySelector('.selected-ship')) extendHover(e.target);
            addShipHeadStyleForAllShips(e.target)

        }
    })

    // when the mouse leaves the grid, hide the hovered spaces
    document.querySelector('.initial-grid').addEventListener('mouseleave', () => {
        removeAllHovered();
    })

    function removeClassFromPreviouslySelected() {
        let previousSelectedShip = document.querySelector('.selected-ship')
        if (previousSelectedShip) previousSelectedShip.classList.remove('selected-ship')
    }

    function extendHover(clickTarget) {
        let selectedShip = document.querySelector('.selected-ship')

        function markValidHover(col, row) {
            let space = document.querySelector(`[data-col="${col}"][data-row="${row}"]`)
            space.classList.add('valid-hovering')
        }

        function markInvalidHover(col, row) {
            console.log(col, row)
            let space = document.querySelector(`[data-col="${col}"][data-row="${row}"]`)
            space.classList.add('invalid-hovering')
        }
        
        function determineOtherHoverElements(clickTarget, dataLength) {
            let invalidPlacement = false;
            // let head = document.querySelector('.valid-hovering')
            const headRow = parseInt(clickTarget.dataset.row)
            const headCol = parseInt(clickTarget.dataset.col)

            // get the next few, using array logic
            let shipLength = parseInt(dataLength);
            
            // fix console log error here, and make red here too
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
            // the actual error is here
            else if (invalidPlacement) {
                for (let i = headCol; i < 10; i++) markInvalidHover(i, headRow)
            }
        }

        determineOtherHoverElements(clickTarget, selectedShip.dataset.length)
    }

    function greyOutSelectedShip() {
        document.querySelector('.selected-ship').classList.add('grey-out')
    }

    function addShipClassToSpace(space) {
        let selectedShip = document.querySelector('.selected-ship')
        let classList = selectedShip.classList
        space.classList.add('ship-in-space')
        switch (true) {
            case classList.contains('carrier'):
                space.classList.add('carrier');
                break;

            case classList.contains('battleship'):
                space.classList.add('battleship');
                break;

            case classList.contains('cruiser'):
                space.classList.add('cruiser');
                break;

            case classList.contains('submarine'):
                space.classList.add('submarine');
                break;

            case classList.contains('destroyer'):
                space.classList.add('destroyer');
                break;

        }
    }

    function addShipHead(clickTarget) {
        console.log(clickTarget)
        console.log(clickTarget.classList)
        clickTarget.classList.add('ship-head')
        console.log(clickTarget.classList)
    }

    // clicking on spaces on grid

    // i need to not add stuff when there's a element too close... do i need to use row and column?
    //maybe
    // check if can place..

    bodyElement.addEventListener('click', (e) => {
        // don't allow click if ship is not selected
        if (document.querySelector('.selected-ship') === null) return
        if (e.target.classList.contains('pregame-space')) {
        
            if (checkInvalidPlacement(e.target)) return

            let allHovered = document.querySelectorAll('.valid-hovering')
            allHovered.forEach(space => addShipClassToSpace(space))
            // maybe also put placed-ship-head where the click is. so that i can make it change color if hovered over
            greyOutSelectedShip();
            addShipHead(e.target)
            removeClassFromPreviouslySelected();
            removeAllHovered();
        }
    })

    // color for invalid placement
    // if out of bounds, or if there's already a ship
    // maybe requires row and col, and length
    // for length of ship, along horionztal or vertical, check each space if out of bounds or if ship-in-space

    function checkIfAlreadyPlaced(col, row) {
        console.log(document.querySelector(`[data-col="${col}"][data-row="${row}"]`))
        return document.querySelector(`[data-col="${col}"][data-row="${row}"]`).classList.contains('ship-in-space')
    }

    function checkInvalidPlacement(clickTarget) {
        let cannotPlaceShip = false;
        const selectedShip = document.querySelector('.selected-ship')
        const length = parseInt(selectedShip.dataset.length)
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


    
    
    // clicking on ships
    // if clicking on already placed ship, then remove it
    // if contains destoryer, then remove destroyer

    function removeCorrespondingShipFromGrid(shipToReplace) {
        let classList =shipToReplace.classList
        console.log(classList)
        // if class list contains any of the ships, then 
        switch (true) {
            case classList.contains('carrier'):
                document.querySelectorAll('.pregame-space.carrier').forEach(space => {
                    space.classList.remove('carrier')
                    space.classList.remove('ship-in-space')
                }
                    )
                break;

            case classList.contains('battleship'):
                document.querySelectorAll('.pregame-space.battleship').forEach(space => {
                    space.classList.remove('battleship')
                    space.classList.remove('ship-in-space')
                })
                break;

            case classList.contains('cruiser'):
                document.querySelectorAll('.pregame-space.cruiser').forEach(space => {
                    space.classList.remove('cruiser')
                    space.classList.remove('ship-in-space')
                })
                break;

            case classList.contains('submarine'):
                document.querySelectorAll('.pregame-space.submarine').forEach(space => {
                    space.classList.remove('submarine')
                    space.classList.remove('ship-in-space')
                })
                break;

            case classList.contains('destroyer'):
                document.querySelectorAll('.pregame-space.destroyer').forEach(space => {
                    space.classList.remove('destroyer')
                    space.classList.remove('ship-in-space')
                })
                break;

        }
        // remove the corresponding ship on the board

    }

    // click on ship for placing on board
    bodyElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('ship')) {
            if (e.target.classList.contains('grey-out')) removeCorrespondingShipFromGrid(e.target);
            removeClassFromPreviouslySelected();
            removeAllHovered();
            (e.target.classList.add('selected-ship'))

            
        }
    })

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