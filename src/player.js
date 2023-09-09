export class Player {
    constructor() {
    }

    // hmm is this okay? do i need to import gameboard? surely not... that would be awful
    // i just called the receiveAttack method on the gameboard argument... is this a bad thing?
    attack(gameboard, [col, row]) {
        gameboard.receiveAttack(col, row)
    }
}
