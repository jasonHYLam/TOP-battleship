
// create grid from gameboard
// take gamebaord as argument

function populateElementInfo(divType, className, text=null, parent=null) {
    const newElement = document.createElement(divType)
    newElement.classList.add(className);
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

function displayGameboard(gameboard) {
    let gameboardContainer = document.querySelector('.gameboard-container')
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