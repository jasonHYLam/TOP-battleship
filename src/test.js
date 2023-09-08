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

// i feel like it would be wrong to test if i can place a ship, because that seems like implementation rather than behaviour
// and what do i even assert for? what value can i even expect?

test('place ship in coordinate', () => {
    let newGameboard = new Gameboard();
    newGameboard.placeShip(4, 'horizontal', [1,3])
    expect(newGameboard.getPosition(1,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(2,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(3,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(4,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(5,3).hasShip).toBe(false)
})

test('ship receives a hit with receiveAttack', () => {
    let newGameboard = new Gameboard();
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(1,3)
    console.log('a')
    let hitShip = newGameboard.getShip(1,3)
    console.log(hitShip)

    expect(hitShip.hits).toBe(1)
})

test('miss a hit with receiveAttack', () => {
    let newGameboard = new Gameboard();
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(8,3)
    //what to expect
    expect(newGameboard.getPosition(8,3).missedHit).toBe(true)
})

test('check that using placeShip() on the same coordinate is not allowed', () => {
    let newGameboard = new Gameboard();
    newGameboard.placeShip(4, 'horizontal', [1,3])
    expect(
        newGameboard.placeShip(4, 'horizontal', [1,3])
    )
    .toBe('position already occupied')
})

test('check that using receiveAttack() on the same coordinate is not allowed', () => {
    let newGameboard = new Gameboard();
    newGameboard.receiveAttack(8,3)
    expect(
        newGameboard.receiveAttack(8,3)
    )
    .toBe('already attacked')
})

test('store all missed hit coordinates', () => {
    let newGameboard = new Gameboard();
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(8,3)
    newGameboard.receiveAttack(1,3)
    newGameboard.receiveAttack(5,5)
    
    //work on storing coordinates
    expect(newGameboard.guessedCoords).toStrictEqual([[8,3],[1,3],[5,5]])
})


// maybe make another test, testing trying to attack twice, and then only storing one instance of coordinate


// report that all ships are sunk
//need to ensure that a ship is sunk correctly// test if hitting it 4 times will make it sunk