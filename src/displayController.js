
// create grid from gameboard
// take gamebaord as argument

function populateElementInfo(divType, className, text=null, parent=null) {
    const newElement = document.createElement(divType)
    newElement.classList.add(className);
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

// need to change this a little
// need to change reference to gameboardContainer

// also, make divs clickable in css. don't allow clicks on already clicked.

// maybe set timeout for enemy... wait a bit
function displayGameboard(gameboard, containerName) {
    // let gameboardContainer = document.querySelector('.gameboard-container')
    let gameboardContainer = document.querySelector(containerName)
    gameboard.grid.map(row => {
        let rowElement = populateElementInfo('div', 'row', null, gameboardContainer);
        row.map(space => {
            populateElementInfo('div', 'column', determineText(space), rowElement)
        })
    })
}

export {
    displayGameboard
}