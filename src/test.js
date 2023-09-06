import { Ship, initialiseShip } from "./index.js";
// let newShip = new Ship(1)

let newShip;

beforeEach(() => {
    newShip = initialiseShip();
})

test('test if Ship is sunk', () => {
    // let newShip = initialiseShip();
    console.log(newShip)
    expect(newShip.isSunk).toBe(false);
})