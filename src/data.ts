import { CARD_TYPE, SPRITE_TYPE } from "./enums";
import { CardConstructorData, EnemyData, IEnemyActions, PlayerData } from "./types";
import { getRandomIntInclusive } from "./utility";

class EnemyActions implements IEnemyActions {
  actions: Array<CardConstructorData>

  constructor(actions: Array<CardConstructorData>) {
    this.actions = [...actions]
  }

  get() {
    return this.actions[getRandomIntInclusive(0, this.actions.length - 1)]
  }
}

export default {
  boardScale: 1,
  startLevel: 1,
  startTurn: 0,
  defaultDraw: 5,
  playerData: {
    name: 'khan',
    type: SPRITE_TYPE.player,
    hp: 50,
    d: 0,
    w: 0,
    f: 0,
    e: 0,
    mounted: true,
    stamina: 4
  } as PlayerData,
  enemyData: {
    1: {
      name: 'king',
      type: SPRITE_TYPE.enemy,
      hp: 50,
      d: 0,
      w: 0,
      f: 0,
      e: 0,
      mounted: true,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 15 }],
        ['', CARD_TYPE.assault, { a: 10, d: 5 }],
        ['', CARD_TYPE.assault, { a: 15, d: 5 }],
        ['', CARD_TYPE.assault, { a: 5, d: 10 }],
        ['', CARD_TYPE.defense, { d: 15 }],
        ['', CARD_TYPE.ability, { f: 2 }],
        ['', CARD_TYPE.ability, { w: 2 }],
        ['', CARD_TYPE.ability, { f: 1, w: 1 }],
      ])
    },
    2: {
      name: 'archer',
      type: SPRITE_TYPE.enemy,
      hp: 20,
      d: 0,
      w: 0,
      f: 0,
      e: 0,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 15 }],
        ['', CARD_TYPE.assault, { a: 12 }],
        ['', CARD_TYPE.assault, { a: 10 }],
        ['', CARD_TYPE.assault, { a: 8, e: 2 }],
        ['', CARD_TYPE.assault, { a: 8, w: 2 }],
        ['', CARD_TYPE.assault, { a: 8, f: 2 }],
      ])
    },
    3: {
      name: 'knight',
      type: SPRITE_TYPE.enemy,
      hp: 40,
      d: 0,
      w: 0,
      f: 0,
      e: 0,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 15 }],
        ['', CARD_TYPE.assault, { a: 8, e: 2 }],
        ['', CARD_TYPE.defense, { d: 5 }],
        ['', CARD_TYPE.ability, { e: 4, f: 2 }],
      ])
    },
    4: {
      name: 'dervish',
      type: SPRITE_TYPE.enemy,
      hp: 15,
      d: 0,
      w: 0,
      f: 0,
      e: 0,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 15 }],
        ['', CARD_TYPE.assault, { a: 10, e: 2 }],
        ['', CARD_TYPE.assault, { a: 10, w: 1 }],
      ])
    },
    5: {
      name: 'bear2',
      type: SPRITE_TYPE.enemy,
      hp: 20,
      d: 0,
      w: 0,
      f: 0,
      e: 1,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 10 }],
        ['', CARD_TYPE.assault, { a: 7, e: 2 }],
        ['', CARD_TYPE.defense, { d: 6 }],
        ['', CARD_TYPE.defense, { d: 4, e: 1 }],
        ['', CARD_TYPE.ability, { e: 2, f: 2 }],
      ])
    },
    6: {
      name: 'bear1',
      type: SPRITE_TYPE.enemy,
      hp: 20,
      d: 0,
      w: 0,
      f: 0,
      e: 2,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 10 }],
        ['', CARD_TYPE.assault, { a: 7, e: 2 }],
        ['', CARD_TYPE.defense, { d: 6 }],
        ['', CARD_TYPE.defense, { d: 4, e: 1 }],
        ['', CARD_TYPE.ability, { e: 2, f: 2 }],
      ])
    },
    7: {
      name: 'rok',
      type: SPRITE_TYPE.enemy,
      hp: 15,
      d: 0,
      w: 0,
      f: 0,
      e: 0,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 8, d: 5 }],
        ['', CARD_TYPE.assault, { a: 4, e: 2 }],
        ['', CARD_TYPE.assault, { a: 5, e: 2 }],
        ['', CARD_TYPE.defense, { d: 10 }],
      ])
    },
    8: {
      name: 'wolf',
      type: SPRITE_TYPE.enemy,
      hp: 15,
      d: 0,
      w: 0,
      f: 0,
      e: 3,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 10 }],
        ['', CARD_TYPE.assault, { a: 6, e: 2 }],
        ['', CARD_TYPE.ability, { e: 2, w: 3 }],
      ])
    },
    9: {
      name: 'snake',
      type: SPRITE_TYPE.enemy,
      hp: 12,
      d: 0,
      w: 0,
      f: 0,
      e: 0,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 9, w: 1, f: 1 }],
        ['', CARD_TYPE.assault, { a: 5, w: 1, e: 2 }],
        ['', CARD_TYPE.assault, { a: 7, w: 1 }],
        ['', CARD_TYPE.defense, { d: 6 }],
        ['', CARD_TYPE.ability, { e: 2, f: 2 }],
      ])
    },
  } as EnemyData
}
