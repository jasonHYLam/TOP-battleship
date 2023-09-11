
// create grid from gameboard
// take gamebaord as argument

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
    gameboard.grid.map(row => {
        let rowElement = populateElementInfo('div', null, gameboardContainer, 'row');
        row.map(space => {
            populateElementInfo('div', determineText(space), rowElement, 'column', determineCellStyle(space))
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

export {
    displayPlayerGameboard,
    displayComputerGameboard,
}