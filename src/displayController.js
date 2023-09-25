import { makeGameController } from "./gameController";
import { Gameboard } from "./gameboard";

function makeDisplayController() {

    let gameController = makeGameController();

    let currentShip = null;
    let movingShip = false;
    let currentlyRotating = false;

    function setToCurrentlyRotating() {currentlyRotating = true}
    function getCurrentlyRotating() {return currentlyRotating}
    function disableCurrentlyRotating() {currentlyRotating = false}
    function setMovingShipToTrue() {movingShip = true}
    function setMovingShipToFalse() {movingShip = false}
    function checkIfMovingShip() {return movingShip}

    function findShipFromClassListAndPerformAction(list, action) {
        switch (true) {
            case list.contains('carrier'):
                return action('carrier'); break;

            case list.contains('battleship'):
                return action('battleship'); break;

            case list.contains('cruiser'):
                return action('cruiser'); break;

            case list.contains('submarine'):
                return action('submarine'); break;

            case list.contains('destroyer'):
                return action('destroyer'); break;
        }
    }

    let shipList = {
        'carrier': {
            length: 5,
            orientation: 'horizontal',
            isPlaced: false,
        },
        'battleship': {
            length: 4,
            orientation: 'horizontal',
            isPlaced: false,
        },
        'cruiser': {
            length: 3,
            orientation: 'horizontal',
            isPlaced: false,
        },
        'submarine': {
            length: 3,
            orientation: 'horizontal',
            isPlaced: false,
        },
        'destroyer': {
            length: 2,
            orientation: 'horizontal',
            isPlaced: false,
        },
    }

    function getCurrentShipOrientation() {
        return shipList[currentShip].orientation
    }

    function toggleCurrentShipOrientation() {
        return shipList[currentShip].orientation = shipList[currentShip].orientation === 'horizontal' ? 'vertical' : 'horizontal';
    }

    function declareCurrentShipPlaced() {
        return shipList[currentShip].isPlaced = true;
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

    //need to change this
    function getCurrentShipLength() {
        return shipList[currentShip].length;
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
            const shipHead = document.querySelector(`.${shipClass}.ship-head`);
            shipHead.classList.add('ship-head-hover')
        }
        findShipFromClassListAndPerformAction(list, addShipHeadStyle)
    }
    
    // hovering to show the extended hover 
    bodyElement.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('pregame-space')) {
            removeAllHovered();
            if (currentShip) extendMainHover(e.target)
            addShipHeadStyleForAllShips(e.target)
        }
    })

    // hovering over the ship head to show rotated hover
    bodyElement.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('ship-head')) {
            if (currentlyRotating) {
                showRotatedHover(e.target)
            }
        }
    })

    // when the mouse leaves the grid, hide the hovered spaces
    document.querySelector('.initial-grid').addEventListener('mouseleave', () => {
        removeAllHovered();
    })

    function removeClassFromPreviouslySelected() {
        let previousSelectedShip = document.querySelector('.selected-ship-off-grid')
        if (previousSelectedShip) previousSelectedShip.classList.remove('selected-ship-off-grid')
    }

        function markValidHover(col, row) {
            let space = document.querySelector(`[data-col="${col}"][data-row="${row}"]`)
            space.classList.add('valid-hovering')
        }

        function markInvalidHover(col, row) {
            let space = document.querySelector(`[data-col="${col}"][data-row="${row}"]`)
            space.classList.add('invalid-hovering')
        }

    function extendMainHover(clickTarget) {

        function determineOtherHoverElements(clickTarget) {
            let invalidPlacement = false;
            const headRow = parseInt(clickTarget.dataset.row)
            const headCol = parseInt(clickTarget.dataset.col)
            let shipLength = getCurrentShipLength();

            // this is horizontal
            // get the next few, using array logic
            if (getCurrentShipOrientation() === 'horizontal') {
                for (let i = headCol; i < headCol + shipLength; i++) {
                    if (i > 9 || checkIfAlreadyPlaced(i, headRow)) {
                        invalidPlacement = true;
                        break;
                    }
                }

                if (!invalidPlacement) {
                    for (let i = headCol; i < headCol + shipLength; i++) markValidHover(i, headRow)
                }
                else if (invalidPlacement) {
                    for (let i = headCol; i < headCol + shipLength; i++) {
                        if (i > 9) break;
                        markInvalidHover(i, headRow)}
                }
            }
            //this, THIS is vertical
            else if (getCurrentShipOrientation() === 'vertical') {
                for (let i = headRow; i < headRow + shipLength; i++) {
                    if (i > 9 || checkIfAlreadyPlaced(headCol, i)) {
                        invalidPlacement = true;
                        break;
                    }
                }

                if (!invalidPlacement) {
                    for (let i = headRow; i < headRow + shipLength; i++) markValidHover(headCol, i)
                }
                else if (invalidPlacement) {
                    for (let i = headRow; i < headRow + shipLength; i++) {
                        if (i > 9) break;
                        markInvalidHover(headCol, i)}
                }
            }
        }

        determineOtherHoverElements(clickTarget)
    }

    function showRotatedHover(clickTarget) {
        const length = getCurrentShipLength()
        let invalidPlacement = false;
        const headCol = parseInt(clickTarget.dataset.col);
        const headRow = parseInt(clickTarget.dataset.row);
        // kinda simialr to determineOther HoverEleemnts, except increase row rather than column

        if (getCurrentShipOrientation() === 'horizontal') {
            for (let i = headRow + 1; i < headRow + length; i++) {
                if (i > 9 || checkIfAlreadyPlaced(headCol, i)) {
                    invalidPlacement = true;
                }
            }

            if (invalidPlacement) {
                for (let i = headRow; i < headRow + length; i++) {
                    if (i > 9) break;
                    markInvalidHover(headCol, i)
                }
            }
            if (!invalidPlacement) {
                for (let i = headRow; i < headRow + length; i++) {markValidHover(headCol, i)}
            }
        }


        else if (getCurrentShipOrientation() === 'vertical') {
            for (let i = headCol + 1; i < headCol + length; i++) {
                if (i > 9 || checkIfAlreadyPlaced(i, headRow)) {
                    invalidPlacement = true;
                }
            }

            if (invalidPlacement) {
                for (let i = headCol; i < headCol + length; i++) {
                    if (i > 9) break;
                    markInvalidHover(i, headRow)
                }
            }
            if (!invalidPlacement) {
                for (let i = headCol; i < headCol + length; i++) {markValidHover(i, headRow)}
            }
        }
    }

    function greyOutSelectedShip() {
        // dont need to change this
        document.querySelector('.selected-ship-off-grid').classList.add('grey-out')
    }

    function addShipClassToSpace(col, row) {
        let space = document.querySelector(`[data-col="${col}"][data-row="${row}"]`)
        space.classList.add('ship-in-space')
        space.classList.add(getCurrentShip())
    }

    function addShipHead(clickTarget) {
        clickTarget.classList.add('ship-head')
    }

    function removeShipHead() {
        const currentShipHead = document.querySelector(`.ship-head.${getCurrentShip()}`);
        if (currentShipHead) currentShipHead.classList.remove('ship-head')
        // document.querySelector(`.ship-head.${getCurrentShip()}`).classList.remove('ship-head')
    }

    function checkIfClickShipHead(clickTarget) {
        return clickTarget.classList.contains('ship-head')
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

    function removeRotateIcon() {
        let icon = document.querySelector('i')
        icon.parentNode.removeChild(icon)
    }

    // click on ship head to move or rotate
    bodyElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('ship-head')) {

            // this sets currentShip, when clicking on the ship head
            function setCorrespondingShipFromGrid(clickTarget) {
                setCurrentShipFromDOM(clickTarget)
            }

            function showRotateIcon(clickTarget) {
                if (clickTarget.querySelector('i')) clickTarget.removeChild(clickTarget.querySelector('i'))
                const template = document.querySelector('#rotate-template')
                const clone =template.content.cloneNode(true)
                clickTarget.appendChild(clone.children[0])
            }

            // this is to set to rotate/move mode
            if (!currentlyRotating) {
                console.log('ship head CLICKED and in NOW in rotate mode')
                setToCurrentlyRotating();
                setMovingShipToTrue()
                setCorrespondingShipFromGrid(e.target)
                decorateSelectedShip(e.target)
                showRotateIcon(e.target);
                // may need to use extendHover. 
                // dont think it's needed here... 
                extendMainHover(e.target)
            }


            // this is to rotate the ship
            else if (currentlyRotating) {
                // check if invalid or out of bounds for rotated placement
                if (checkInvalidPlacement(e.target)) return;

                // and use placeShip which just converts hover into ship pieces
                removeCurrentShipFromGrid();
                removeSelectedShipDecoration();
                removeRotateIcon();
                // convertValidHoverIntoShip();
                placeShip(e.target);
                // this is where i need to remove current ship 

                // use toggleCurrentShipRotation
                // and maybe resetCurrentShip
                removeAllHovered();
                console.log(getCurrentShipOrientation())
                toggleCurrentShipOrientation();
                console.log(getCurrentShipOrientation())
                resetCurrentShip();
                disableCurrentlyRotating();
                setMovingShipToFalse();
                console.log('ship head CLICKED and disable rotate mode and reset current ship')
            }
        }
    })

    function placeShip(clickTarget) {
        let invalidPlacement = false;
        const headRow = parseInt(clickTarget.dataset.row)
        const headCol = parseInt(clickTarget.dataset.col)
        let shipLength = getCurrentShipLength();

        if (getCurrentShipOrientation() === 'horizontal'
         && !currentlyRotating
                || getCurrentShipOrientation() === 'vertical' && currentlyRotating
        ) {
            for (let i = headCol; i < headCol + shipLength; i++) {
                if (i > 9 || checkIfAlreadyPlaced(i, headRow)) {
                    invalidPlacement = true;
                    break;
                }
            }

            if (!invalidPlacement) {
                for (let i = headCol; i < headCol + shipLength; i++) addShipClassToSpace(i, headRow)
            }
        }


        else if (getCurrentShipOrientation() === 'vertical'
        && !currentlyRotating
                || (getCurrentShipOrientation() == 'horizontal' && getCurrentlyRotating())
        ) {
            for (let i = headRow; i < headRow + shipLength; i++) {
                if (i > 9 || checkIfAlreadyPlaced(headCol, i)) {
                    invalidPlacement = true;
                    break;
                }
            }
            if (!invalidPlacement) {
                for (let i = headRow; i < headRow + shipLength; i++) addShipClassToSpace(headCol, i)
            }
        }


    }

    // click on the grid to place a ship
    bodyElement.addEventListener('click', (e) => {
        // don't allow click if ship is not selected
        if (!currentShip) return
        if (e.target.classList.contains('pregame-space')) {

            if (checkInvalidPlacement(e.target)) return
            //move existing ship
            if (checkIfMovingShip()) {

                console.log('ship is MOVING')
                //ship head is not clicked
                if (!checkIfClickShipHead(e.target)) {
                    
                    console.log('ship head NOT clicked, ship is moving')
                    removeShipHead();
                    removeRotateIcon()
                    removeSelectedShipDecoration();
                    removeCurrentShipFromGrid();
                    setMovingShipToFalse();
                    disableCurrentlyRotating();

                    placeShip(e.target)
                    removeAllHovered();
                    addShipHead(e.target);
                    declareCurrentShipPlaced();
                    resetCurrentShip();
                    checkIfCanStartGame();
                }
            
                // ship head is clicked... this should not do anything btw
                else if (checkIfClickShipHead(e.target)) {
                    console.log('ship head was clicked')
                }
            }

            //place ship for the first time
            else {
                console.log('ship NOT moving, placing for the first time')
                greyOutSelectedShip();
                removeClassFromPreviouslySelected();

                placeShip(e.target);
                removeAllHovered();
                addShipHead(e.target);
                declareCurrentShipPlaced();
                resetCurrentShip();
                checkIfCanStartGame();
            }
        }
    })
    // for length of ship, along horionztal or vertical, check each space if out of bounds or if ship-in-space
    function checkIfAlreadyPlaced(col, row) {
        return document.querySelector(`[data-col="${col}"][data-row="${row}"]`).classList.contains('ship-in-space')
    }

    //check if can place the ship
    function checkInvalidPlacement(clickTarget) {
        let cannotPlaceShip = false;

        const length = getCurrentShipLength();
        const headRow = parseInt(clickTarget.dataset.row)
        const headCol = parseInt(clickTarget.dataset.col)

        console.log(getCurrentShipOrientation())
        console.log(currentlyRotating)

        // requires checking if currently rotating; if so, check the opposite orientation
        if (getCurrentShipOrientation() === 'horizontal'&& !currentlyRotating
                || getCurrentShipOrientation() === 'vertical' && checkIfClickShipHead(clickTarget)
                ) {
            // means row is the same, and columns change
            for (let i = headCol + 1; i < headCol + length; i++) {
                if (i > 9 || checkIfAlreadyPlaced(i, headRow)) {
                    cannotPlaceShip = true;
                    break;
                }
            }
        }

        else if ((getCurrentShipOrientation() === 'vertical' && !currentlyRotating)
                || getCurrentShipOrientation() == 'horizontal' && checkIfClickShipHead(clickTarget)
                ) {
            // means column is the same, and rows change
            for (let i = headRow + 1; i < headRow + length; i++) {
                if (i > 9 || checkIfAlreadyPlaced(headCol, i)) {
                    cannotPlaceShip = true;
                    break;
                }
            }
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
        console.log(`remove current ship from grid: ${getCurrentShip()}`)
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
            removeShipHead()
            removeAllHovered();
            (list.add('selected-ship-off-grid'))
            setCurrentShipFromDOM(e.target)
        }
    })

    function checkIfCanStartGame() {
        // make sure all ships are placed
        let canStart = true;
        for (let ship in shipList) {
            if (shipList[ship].isPlaced === false) canStart = false;
        }
        if (canStart) {
            activateStartButton()
        }
        // or setNotPlaced if moving the ship
        // then activate the play button
    }

    function hidePopUp() {
        document.querySelector('.popup').style.display = 'none'

    }

    function activateStartButton() {
        const startButton = document.querySelector('.start-button')
        startButton.style.display = 'block'
        console.log(startButton)

    }

    bodyElement.addEventListener('click', (e) => {
        if (e.target.classList.contains('start-button')) {
            console.log('927')
            addToPlayerGameBoard();
            hidePopUp();
            // i sincerely hope that this will populate player gameboard, i don't think it will thougth:
            displayBothGameboards();
        }

    })

    function getLengthAndOrientationFromHeadClass(list) {
        return findShipFromClassListAndPerformAction(list, (ship) => {
            return [
                shipList[ship].length,
                shipList[ship].orientation,
            ]
        })

    }

    function addToPlayerGameBoard() {
        //needs to take pieces from the grid
        const shipHeads = document.querySelectorAll('.ship-head')
        shipHeads.forEach(head => {
            let [length, orientation] = getLengthAndOrientationFromHeadClass(head.classList)
            gameController.getPlayerGameboard().placeShip(
                length,
                orientation,
                [parseInt(head.dataset.col),
                parseInt(head.dataset.row)]
            )
        })
    }


    function determineMark(space, element) {

        if (!space.hasShip && !space.wasGuessed) return ' ';
        if (space.hasShip && !space.wasGuessed) element.textContent = '.'
        if (!space.hasShip && space.wasGuessed) element.textContent = '\u00B7';
        if (space.hasShip && space.wasGuessed) addIcon(element, '#x-template')
    }

    function determineText(space) {
        // bruh aint this middle dot
        if (!space.hasShip && !space.wasGuessed) return ' ';
        if (space.hasShip && !space.wasGuessed) return '.'
        if (!space.hasShip && space.wasGuessed) return '\u00B7'
        if (space.hasShip && space.wasGuessed) return 'x'
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

    function addIcon(el, iconSelector) {
        const template = document.querySelector(iconSelector)
        const clone = template.content.cloneNode(true)
        el.appendChild(clone.children[0])
    }

    // maybe set timeout for enemy... wait a bit
    function displayPlayerGameboard(gameboard) {
        let gameboardContainer = document.querySelector('.gameboard-container.right')
        gameboard.grid.map((row, rowIndex) => {
            let rowElement = populateElementInfo('div', null, gameboardContainer, 'row');
            row.map((space) => {
                // populateElementInfo('div', determineText(space), rowElement, 'column')
                // let spaceElement = populateElementInfo('div', determineText(space), rowElement, 'column')
                let spaceElement = populateElementInfo('div', null, rowElement, 'column')
                console.log(space)
                determineMark(space, spaceElement)
            })
        })
    }

    // make enemy (computer) gameboard clickable
    function displayComputerGameboard(gameboard) {
        let gameboardContainer = document.querySelector('.gameboard-container.left')
        gameboard.grid.map((row, rowIndex) => {
            let rowElement = populateElementInfo('div', null, gameboardContainer, 'row');
            row.map((space, colIndex) => {
                // let spaceElement = populateElementInfo('div', determineText(space), rowElement, 'column',  determineCellStyle(space) )
                let spaceElement = populateElementInfo('div', null, rowElement, 'column', 'game-column', determineCellStyle(space) )
                determineMark(space, spaceElement)
                spaceElement.dataset.col = colIndex;
                spaceElement.dataset.row = rowIndex;
            })
        })
    }

    //hovering over the playable gameboard
    bodyElement.addEventListener('mouseover', (e) => {
        if (e.target.classList.contains('game-column')) {
            removeHoveredClass('game-hovering')
            e.target.classList.add('game-hovering')
        }
    })



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
    // displayBothGameboards();
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