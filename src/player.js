export class Player {
    constructor(computer) {
    }

    attack(gameboard, [col, row]) {
        gameboard.receiveAttack(col, row)
    }
}

export class Computer extends Player {
    constructor() {
        super()
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