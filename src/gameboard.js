import { Ship, initialiseShip } from "./ship";

class Space {
    constructor() {
        this.hasShip = false;
        this.wasGuessed = false;
    }
}
class Gameboard {
    constructor() {

        // no idea if this works but the idea is to run this function to create a grid with 10 rows and 10 cols
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
            // for some reason nwGrid is an empty grid, rather than being populated with stuff
            return newGrid
        }
        this.grid = createGrid();
        this.over = false;
    }


    // hmm do i need to make something to show that a space is occupied by a ship?
    // by id?

    isOutOfBounds(col, row) {
        // do i return, or do i cancel something?
        if (col > 9 || row > 9) return true

    }
    // maybe its better to use horizontal and vertical
    placeShip(length, orientation, [startCol, startRow]) {

        // test if start coord is out of bounds
        if (this.isOutOfBounds(startCol, startRow)) return 

        let newShip = initialiseShip(length)
        if (!newShip) return

        switch(orientation) {
            // if orientation is horizontal
            case 'horizontal':
                //loop for length and check if out of bounds
                //but then if any of them are bad, then cancel

                // else, loop again and put them in
                // do something at the grid square,
                // and then put stuff along the row (occupy columns of the same row)
                // maybe give some information, like ship ID
                this.grid[startRow][startCol] = 'occupied'

                break

            // if orientation is vertical
            case 'vertical':
                // do something at the grid square,
                // and then put stuff along the column (occupy rows of the same column)
                this.grid
                break
        }
    }

}

// should be able to place ships at specific coordinates
// so this gameboard needs coordinates
// i guess i should define a start and end coordinate, and
// ignore if they aren't horizontal or vertical or one block

//how do i test these things? what needs testing?
// what does it mean by public methods?


export {Gameboard}