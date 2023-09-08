import { Ship, initialiseShip } from "./ship.js";
import { Gameboard } from "./gameboard.js";

let newShip;
let newGameboard

beforeEach(() => {
    // newShip = new Ship(4)
    newShip = initialiseShip(4)
    newGameboard = new Gameboard()
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
    newGameboard.placeShip(4, 'horizontal', [1,3])
    expect(newGameboard.getPosition(1,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(2,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(3,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(4,3).hasShip).toBe(true)
    expect(newGameboard.getPosition(5,3).hasShip).toBe(false)
})

test('ship receives a hit with receiveAttack', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(1,3)
    let hitShip = newGameboard.getShip(1,3)
    console.log(hitShip)

    expect(hitShip.hits).toBe(1)
})

test('miss a hit with receiveAttack', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(8,3)
    //what to expect
    expect(newGameboard.getPosition(8,3).missedHit).toBe(true)
})

test('check that using placeShip() on the same coordinate is not allowed', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    expect(
        newGameboard.placeShip(4, 'horizontal', [1,3])
    )
    .toBe('position already occupied')
})

test('check that using receiveAttack() on the same coordinate is not allowed', () => {
    newGameboard.receiveAttack(8,3)
    expect(
        newGameboard.receiveAttack(8,3)
    )
    .toBe('already attacked')
})

test('store all missed hit coordinates', () => {
    newGameboard.placeShip(4, 'horizontal', [1,3])
    newGameboard.receiveAttack(8,3)
    newGameboard.receiveAttack(1,3)
    newGameboard.receiveAttack(5,5)
    
    //work on storing coordinates
    expect(newGameboard.guessedCoords).toStrictEqual([[8,3],[1,3],[5,5]])
})


// maybe make another test, testing trying to attack twice, and then only storing one instance of coordinate
test('test only one instance of a coordinate is in guessedCoords', () => {
    newGameboard.receiveAttack(8,3)
    newGameboard.receiveAttack(8,3)
    expect(newGameboard.guessedCoords).toStrictEqual([[8,3]])
})

// report that all ships are sunk
test('report all ships are sunk', () => {
    newGameboard.placeShip(4, 'horizontal', [0,0])
    newGameboard.placeShip(4, 'vertical', [5,5])

    newGameboard.receiveAttack(0,0)
    newGameboard.receiveAttack(0,1)
    newGameboard.receiveAttack(0,2)
    newGameboard.receiveAttack(0,3)

    newGameboard.receiveAttack(5,5)
    newGameboard.receiveAttack(6,5)
    newGameboard.receiveAttack(7,5)
    newGameboard.receiveAttack(8,5)

    //now, how should the message be reported?
    // should something be set as a property? like gameboard.isOver

    expect(newGameboard.isGameOver).toBe(true)

})
//need to ensure that a ship is sunk correctly// test if hitting it 4 times will make it sunk

// also, how do i know all ships are sunk?
// maybe have a function to check all positions if there any that have hasShip and was guessed