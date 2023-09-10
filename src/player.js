export class Player {
    constructor(computer) {
    }

    // hmm is this okay? do i need to import gameboard? surely not... that would be awful
    // i just called the receiveAttack method on the gameboard argument... is this a bad thing?
    attack(gameboard, [col, row]) {
        gameboard.receiveAttack(col, row)
    }

    // actually this can't be in here... cus the col and row don't change... they gotta change
    tryAttackUntilSuccess(gameboard, [col, row]) {
        let initialGuesses = JSON.stringify(gameboard.guessedCoords)
        let currentGuesses;
        while (initialGuesses !== currentGuesses) {
            this.attack(gameboard, [col, row])
            currentGuesses = JSON.stringify(gameboard.guessedCoords)
        }
    }
}

// ahhh don't think this works,,, gotta use super?
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