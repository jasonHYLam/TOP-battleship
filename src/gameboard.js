import { Ship, initialiseShip } from "./ship";

class Space {
    constructor() {
        this.hasShip = false;
        this.wasGuessed = false;
        this.missedHit = false;
        this.ship = null;
    }
}

// use col,row for method arguments and pushing into variables like guessedCoords
// use row, col for gameboard logic
class Gameboard {
    constructor() {
        function createGrid() {
            let newGrid = [];
            for (let i = 0; i<10; i++) {
                let row = [];
                for (let j = 0; j<10; j++) {
                    const square = new Space();
                    row.push(square)
                }
                newGrid.push(row)
            }
            return newGrid
        }
        this.grid = createGrid();
        this.allShipCoords = [];
        this.guessedCoords = [];
    }

    isOutOfBounds(col, row) {
        if (col > 9 || row > 9) return true;
        return false;
    }

    checkIfAlreadyPlaced(col, row) {
        if (this.grid[row][col].hasShip === true) return true;
        return false;
    }

    populateShipCoordsArray(col, row) {
        this.allShipCoords.push([col, row])
    }

    placeShip(length, orientation, [startCol, startRow]) {
        let invalidPlacement = false;

        // test if start coord is out of bounds
        if (this.isOutOfBounds(startCol, startRow)) return 'out of bounds';

        let newShip = initialiseShip(length);
        if (!newShip) return;

        switch(orientation) {
            // if orientation is horizontal
            // stuff happens from left to right
            case 'horizontal':
                //loop for length and check if out of bounds or already occupied; if so cancel execution
                for (let i = 0; i< length; i++) {
                    if (this.isOutOfBounds(startCol + i, startRow))  {
                        invalidPlacement = true;
                        return;
                    }
                    if (this.checkIfAlreadyPlaced(startCol + i, startRow)) {
                        invalidPlacement = true;
                        return 'position already occupied: tried horizontal';
                    }
                }

                // else, loop along the row (occupy columns of the same row)
                // at each grid square, occupy with ship ID
                if (!invalidPlacement) {
                    for (let i = 0; i< length; i++) {
                    this.grid[startRow][startCol + i].hasShip = true;
                    this.grid[startRow][startCol + i].ship = newShip;
                    this.populateShipCoordsArray(startCol + i, startRow)
                    }
                }
                break

            // if orientation is vertical
            case 'vertical':
                for (let i = 0; i< length; i++) {
                    if (this.isOutOfBounds(startCol, startRow + i)) {
                        invalidPlacement = true;
                        return;
                    }
                    if (this.checkIfAlreadyPlaced(startCol, startRow + i)) {
                        invalidPlacement = true;
                        return 'position already occupied: tried vertical'
                    }
                }

                // and then put stuff along the column (occupy rows of the same column)
                if (!invalidPlacement) {
                    for (let i = 0; i< length; i++) {
                        this.grid[startRow + i][startCol].hasShip = true;
                        this.grid[startRow + i][startCol].ship = newShip;
                    this.populateShipCoordsArray(startCol, startRow + i)
                    }
                }
                break
        }
    }

    getPosition(col, row) {
        return this.grid[row][col]
    }

    checkShipExists(col, row) {
        return this.grid[row][col].hasShip
    }


    getShip(col, row) {
        return this.grid[row][col].ship
    }

    checkMissedHit(col, row) {
        return this.grid[row][col].missedHit
    }

    checkWasGuessed(col, row) {
        return this.grid[row][col].wasGuessed
    }

    // compare stringified ship coords to the guessed coords, and return true if all ship coords are guessed.
    checkIsGameOver() {
        let convertedAllShipCoords = this.allShipCoords.map(coord => JSON.stringify(coord))
        let convertedGuessedCoords = this.guessedCoords.map(coord =>JSON.stringify(coord))
        return convertedAllShipCoords.every(shipCoord => convertedGuessedCoords.includes(shipCoord))
    }

    receiveAttack(col, row) {
        // first, check if position is already guessed
        if (this.checkWasGuessed(col, row)) return 'already attacked';
        // if not guessed, then mark as guessed
        this.getPosition(col, row).wasGuessed = true;
        this.guessedCoords.push([col, row])

        // if not, check if there is a ship there
        if (this.checkShipExists(col, row)) {
            // if there is, then identify the ship
            // then hit the ship
            this.getShip(col, row).hit()
            // then check if ship is sunk
            this.getShip(col, row).isSunk();
        }
        // if there isn't a ship, then mark the place with missedHit
        else {
            this.getPosition(col, row).missedHit = true;
        }
    }

    
}
export {Gameboard}