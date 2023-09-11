import { getRandomIntInclusive } from "./utility"

export const levels: Record<number, Record<'enemies', () => Array<number>>> = {
  1: {
    enemies: () => [getRandomIntInclusive(9, 9)]
  },
  2: {
    enemies: () => [getRandomIntInclusive(9, 9), getRandomIntInclusive(9, 9)]
  },
  3: {
    enemies: () => [getRandomIntInclusive(7, 8)]
  },
  4: {
    enemies: () => [getRandomIntInclusive(7, 8), getRandomIntInclusive(6, 9)]
  },
  5: {
    enemies: () => [getRandomIntInclusive(7, 9), getRandomIntInclusive(5, 7), getRandomIntInclusive(5, 7)]
  },
  6: {
    enemies: () => [4, getRandomIntInclusive(5, 9), getRandomIntInclusive(5, 9)]
  },
  7: {
    enemies: () => [4, 4, getRandomIntInclusive(5, 7)]
  },
  8: {
    enemies: () => [3, 2, getRandomIntInclusive(7, 9)]
  },
  9: {
    enemies: () => [3, 2, 3]
  },
  10: {
    enemies: () => [1, 4, 3, 5]
  }
}
