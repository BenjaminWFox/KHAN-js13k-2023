import { getRandomIntInclusive } from "./utility"

export const levels: Record<number, Record<'enemies', () => Array<number>>> = {
  1: {
    enemies: () => [getRandomIntInclusive(9, 9)]
  },
  2: {
    enemies: () => [getRandomIntInclusive(8, 9), getRandomIntInclusive(8, 9)]
  },
  3: {
    enemies: () => [getRandomIntInclusive(7, 9), getRandomIntInclusive(5, 7), getRandomIntInclusive(5, 7)]
  },
  4: {
    enemies: () => [4, getRandomIntInclusive(5, 9), getRandomIntInclusive(5, 9)]
  },
  5: {
    enemies: () => [3, 2]
  },
  6: {
    enemies: () => [3, 2, getRandomIntInclusive(7, 9)]
  },
  7: {
    enemies: () => [3, 2, 3]
  },
  8: {
    // enemies: () => [1, getRandomIntInclusive(2, 3), getRandomIntInclusive(2, 3), getRandomIntInclusive(2, 3)]
    enemies: () => [1]
  }
}
