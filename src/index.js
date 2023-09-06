
export class Ship {
    constructor(length) {
        this.length = length;
        this.lives = length;
        this.isSunk = false;
    }

    setSunk() {
        this.isSunk = true;
    }
}
