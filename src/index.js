
class Ship {
    constructor(length) {
        this.length = length;
        this.lives = length;
        this.isSunk = false;
    }

    setSunk() {
        this.isSunk = true;
    }
}

function initialiseShip() {
    return new Ship(4)
}

export {initialiseShip, Ship}