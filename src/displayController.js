


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
function displayPlayerGameboard(gameboard, containerName) {
    let gameboardContainer = document.querySelector(containerName)
    gameboard.grid.map((row, rowIndex) => {
        let rowElement = populateElementInfo('div', null, gameboardContainer, 'row');
        row.map((space, colIndex) => {
            let spaceElement = populateElementInfo('div', determineText(space), rowElement, 'column', determineCellStyle(space))
            // how do i set column number? where do i get it from?
            spaceElement.dataset.col = colIndex;
            spaceElement.dataset.row = rowIndex;
            // space.setAttribute('data-col', colIndex)
            // space.setAttribute('data-row', rowIndex)
        })
    })
}

function displayComputerGameboard(gameboard, containerName) {
    let gameboardContainer = document.querySelector(containerName)
    gameboard.grid.map(row => {
        let rowElement = populateElementInfo('div', null, gameboardContainer, 'row');
        row.map(space => {
            populateElementInfo('div', determineText(space), rowElement, 'column')
        })
    })
}

// do i put clickeventlisteners in displayController, or gameController?
// or should i put gameController in displayController?

// for some reason, it made sense to put displayBoard in gameController
// but would it make sense to put playRound in displayController?

// mm so UI needs to access the playRound function

function getClickables() {
    return document.querySelectorAll('.clickable')
}

// the game loop is here

// would i need to consider a future 2 player version?

// for each of these spaces
// if clicked, then play a round
// this means using attack, using the coordinates... i possibly need to add data.col and data.row... okay
getClickables().forEach(el => {
    el.addEventListener('click', () => {

    })
})


export {
    displayPlayerGameboard,
    displayComputerGameboard,
}