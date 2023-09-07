import { Gameboard } from "./gameboard.js";

// i feel like it would be wrong to test if i can place a ship, because that seems like implementation rather than behaviour
// and what do i even assert for? what value can i even expect?
test('place ship in coordinate', () => {
    let newGameboard = new Gameboard();
    newGameboard.placeShip(4, [1,3], [2,3])
    expect(newGameboard.getPosition([1,3])).toBe(!'')
    expect(newGameboard.getPosition([2,3])).toBe(!'')
})

test('console log test', () => {
    console.log(new Gameboard.grid)
})
// test if ship exceeds gameboard
// test if ship is not horizontal or vertical