import { Card } from "./card";
import { CARD_TYPE, SPRITE_TYPE } from "./enums";
import { EntityData, IEnemyActions } from "./types";
import { getRandomIntInclusive } from "./utility";


class EnemyActions implements IEnemyActions {
  actions: Array<Card>

  constructor(actions: Array<Card>) {
    this.actions = actions
  }

  get() {
    return this.actions[getRandomIntInclusive(0, this.actions.length - 1)]
  }
}

export const enemies: Record<number, EntityData> = {
  1: {
    name: 'king', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 0, mounted: true,
    // actions: new EnemyActions()
  },
  2: {
    name: 'archer', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 0, mounted: false,
    // actions: new EnemyActions()
  },
  3: {
    name: 'knight', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 0, mounted: false,
    // actions: new EnemyActions()
  },
  4: {
    name: 'dervish', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 0, mounted: false,
    // actions: new EnemyActions()
  },
  5: {
    name: 'snake', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 0, mounted: false,
    actions: new EnemyActions([
      new Card(['', CARD_TYPE.assault, { a: 15 }]),
      new Card(['', CARD_TYPE.assault, { a: 8, e: 2 }]),
      new Card(['', CARD_TYPE.defense, { d: 5 }]),
      new Card(['', CARD_TYPE.ability, { e: 4, f: 2 }]),
    ])
  },
  6: {
    name: 'rok', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 0, mounted: false,
    actions: new EnemyActions([
      new Card(['', CARD_TYPE.assault, { a: 15 }]),
      new Card(['', CARD_TYPE.assault, { a: 8, e: 2 }]),
      new Card(['', CARD_TYPE.defense, { d: 5 }]),
      new Card(['', CARD_TYPE.ability, { e: 4, f: 2, w: 2 }]),
    ])
  },
  7: {
    name: 'wolf', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 3, mounted: false,
    actions: new EnemyActions([
      new Card(['', CARD_TYPE.assault, { a: 15 }]),
      new Card(['', CARD_TYPE.assault, { a: 8, e: 2 }]),
      new Card(['', CARD_TYPE.defense, { d: 5 }]),
      new Card(['', CARD_TYPE.ability, { e: 4, w: 2 }]),
    ])
  },
  8: {
    name: 'bear1', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 2, mounted: false,
    actions: new EnemyActions([
      new Card(['', CARD_TYPE.assault, { a: 15 }]),
      new Card(['', CARD_TYPE.assault, { a: 8, e: 2 }]),
      new Card(['', CARD_TYPE.defense, { d: 5 }]),
      new Card(['', CARD_TYPE.ability, { e: 4, f: 2 }]),
    ])
  },
  9: {
    name: 'bear2', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 1, mounted: false,
    actions: new EnemyActions([
      new Card(['', CARD_TYPE.assault, { a: 15 }]),
      new Card(['', CARD_TYPE.assault, { a: 8, e: 2 }]),
      new Card(['', CARD_TYPE.defense, { d: 5 }]),
      new Card(['', CARD_TYPE.ability, { e: 4, f: 2, w: 2 }]),
    ])
  },
}

