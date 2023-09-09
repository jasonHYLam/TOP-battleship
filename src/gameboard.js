import { Ship, initialiseShip } from "./ship";

class Space {
    constructor() {
        this.hasShip = false;
        this.wasGuessed = false;
        this.missedHit = false;
        this.ship = null;
    }
}

// not sure where to put this but need to be careful about ordinate order; col,row vs row, col
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
        this.isGameOver = false;
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

        // test if start coord is out of bounds
        if (this.isOutOfBounds(startCol, startRow)) return 

        let newShip = initialiseShip(length)
        if (!newShip) return

        switch(orientation) {
            // if orientation is horizontal
            // stuff happens from left to right
            case 'horizontal':
                //loop for length and check if out of bounds or already occupied; if so cancel execution
                for (let i = 0; i< length; i++) {
                    if (this.isOutOfBounds(startRow, startCol + i)) return 'out of bounds'
                    if (this.checkIfAlreadyPlaced(startRow, startCol + i)) return 'position already occupied'
                }

                // else, loop along the row (occupy columns of the same row)
                // at each grid square, occupy with ship ID
                for (let i = 0; i< length; i++) {
                   this.grid[startRow][startCol + i].hasShip = true;
                   // this may be not good
                   this.grid[startRow][startCol + i].ship = newShip;

                   // may be an error in the col and row argument order
                   //not understand...
                   // change this from spaces, to coordinates, cus i don't want a copy of objects
                   this.populateShipCoordsArray(startCol + i, startRow)
                }
                break

            // if orientation is vertical
            // ship is created from bottom to top
            // row[0] is bottom, row[9] to top, due to the `9 - `
            case 'vertical':
                for (let i = 0; i< length; i++) {
                    if (this.isOutOfBounds(9 - startRow + i, startCol)) return 'out of bounds'
                    if (this.checkIfAlreadyPlaced(9 - startRow + i, startCol)) return 'position already occupied'
                }

                // and then put stuff along the column (occupy rows of the same column)
                for (let i = 0; i< length; i++) {
                    this.grid[9 - startRow + i][startCol].hasShip = true;
                    this.grid[9 - startRow + i][startCol].ship = newShip;

                   // may be an error in the col and row argument order
                   // change this from spaces, to coordinates, cus i don't want a copy of objects
                   this.populateShipCoordsArray(startCol, startRow + i)
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

    checkIsGameOver() {
        // do i need to stringify these? what a pain...
        let convertedAllShipCoords = this.allShipCoords.map(coord => JSON.stringify(coord))
        console.log(convertedAllShipCoords)
        let convertedGuessedCoords = this.guessedCoords.map(coord => JSON.stringify(coord))
        console.log(convertedGuessedCoords)
        if (convertedAllShipCoords.every(shipCoord => convertedGuessedCoords.includes(shipCoord))) {
            this.isGameOver = true;
        }
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

            // then check if all ships are hit, by comparing allShipCoords and guessedCoords arrays 
            // this.checkIsGameOver();

        }
        // if there isn't a ship, then mark the place with missedHit
        else {
            this.getPosition(col, row).missedHit = true;
        }
    }
}
export {Gameboard}