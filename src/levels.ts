import { getRandomIntInclusive } from "./utility"

export const enemies = {
  1: 'king',
  2: 'archer',
  3: 'knight',
  4: 'dervish',
  5: 'snake',
  6: 'rok',
  7: 'wolf',
  8: 'bear1',
  9: 'bear2',
}

export const levels = {
  1: {
    enemies: [getRandomIntInclusive(5, 9)]
  },
  2: {
    enemies: [getRandomIntInclusive(5, 9), getRandomIntInclusive(5, 9)]
  },
  3: {
    enemies: [4, getRandomIntInclusive(5, 9)]
  },
  4: {
    enemies: [4, getRandomIntInclusive(5, 9), getRandomIntInclusive(5, 9)]
  },
  5: {
    enemies: [3, 2]
  },
  6: {
    enemies: [3, 2, getRandomIntInclusive(7, 9)]
  },
  7: {
    enemies: [3, 2, 3]
  },
  8: {
    enemies: [1, getRandomIntInclusive(2, 3), getRandomIntInclusive(2, 3), getRandomIntInclusive(2, 3)]
  }
}
