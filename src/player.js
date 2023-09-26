export class Player {
    // constructor(computer) {
    constructor(name) {
        this.name = 'Player';
    }

    attack(gameboard, [col, row]) {
        gameboard.receiveAttack(col, row)
    }
}

export class Computer extends Player {
    constructor() {
        super()
        this.name = 'Computer'
    }

    randomAttack(gameboard) {
        // take random numbers for column and row
        const randomCol = Math.floor(Math.random() * 10)
        const randomRow = Math.floor(Math.random() * 10)

        //then check if has been attacked,
        if(gameboard.checkWasGuessed(randomCol, randomRow)) return

        //then call attack
        this.attack(gameboard, [randomCol, randomRow])
    }
}