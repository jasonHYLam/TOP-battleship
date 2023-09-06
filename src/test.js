import { Ship } from "./index.js";
let newShip = new Ship(1)

// ship tests
// test its sunk 
// test its number of hits

test('test if Ship is sunk', () => {
    expect(newShip.isSunk).toBe(false);
})

test('test if Ship is sunk', () => {
    expect(newShip.isSunk).toBe(true);
})

test('test if ship returns lives correctly', () => {
    expect(newShip.lives).toBe(1);
})

test('test if ship returns lives correctly', () => {
    expect(newShip.lives).toBe(1);
})

newShip.setSunk();
test('test if Ship is sunk', () => {
    expect(newShip.isSunk).toBe(true);
})

