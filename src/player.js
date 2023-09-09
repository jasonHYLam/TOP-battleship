export class Player {
    constructor(computer) {
    }

    // hmm is this okay? do i need to import gameboard? surely not... that would be awful
    // i just called the receiveAttack method on the gameboard argument... is this a bad thing?
    attack(gameboard, [col, row]) {
        gameboard.receiveAttack(col, row)
    }
}

export class Computer extends Player {
    constructor() {
    }

    randomAttack(gameboard) {
        // take random numbers for column and row
        const randomCol = Math.floor(Math.random() * 10)
        const randomRow = Math.floor(Math.random() * 10)

        //then check if has been attacked,
        if(gameboard.checkWasGuessed(randomCol, randomRow)) return

        //then call attack
        this.attack(randomCol, randomRow)
    }
}