import { Ship, initialiseShip } from "./ship.js";
import { Gameboard } from "./gameboard.js";

let newShip;

beforeEach(() => {
    // newShip = new Ship(4)
    newShip = initialiseShip(4)
})

test('test invalid Ship construction', () => {
    newShip = initialiseShip(5);
    expect(newShip).toBe(undefined);
})
test('test if Ship is hit', () => {
    newShip.hit()
    expect(newShip.hits).toBe(1);
})

test('test if Ship is sunk', () => {
    newShip.hit()
    newShip.hit()
    newShip.hit()
    newShip.hit()
    newShip.isSunk()
    expect(newShip.sunk).toBe(true);
})




test('console log test', () => {
    let testGameboard = new Gameboard()
    console.log(testGameboard)
})
// i feel like it would be wrong to test if i can place a ship, because that seems like implementation rather than behaviour
// and what do i even assert for? what value can i even expect?
test('place ship in coordinate', () => {
    let newGameboard = new Gameboard();
    newGameboard.placeShip(4, [1,3], [2,3])
    expect(newGameboard.getPosition([1,3])).toBe(!'')
    expect(newGameboard.getPosition([2,3])).toBe(!'')
})

// test if ship exceeds gameboard
// test if ship is not horizontal or vertical