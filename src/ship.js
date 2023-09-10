
class Ship {
    // i need to make sure length is between 1 and 4
    constructor(length) {
        this.length = length;
        this.hits = 0;
        this.sunk = false;
    }

    setSunk() {
        this.sunk = true;
    }

    hit() {
        this.hits ++
    }

    isSunk() {
        if (this.length === this.hits) this.setSunk();
    }
}

function initialiseShip(length) {
    if (length < 1 || length > 5) return 
    return new Ship(length)
}


export {initialiseShip, Ship}