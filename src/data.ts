import { CARD_TYPE, SPRITE_TYPE } from "./enums";
import { CardConstructorData, CardData, EnemyDataCollection, IEnemyActions, PlayerData } from "./types";
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

const data = {
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
      hp: 75,
      d: 0,
      w: 0,
      e: 0,
      mounted: true,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 25 }],
        ['', CARD_TYPE.assault, { a: 20, d: 10 }],
        ['', CARD_TYPE.assault, { a: 15, d: 15 }],
        ['', CARD_TYPE.defense, { d: 25, w: 2 }],
        ['', CARD_TYPE.defense, { d: 20, e: 2, w: 2 }],
      ])
    },
    2: {
      name: 'archer',
      type: SPRITE_TYPE.enemy,
      hp: 30,
      d: 0,
      w: 0,
      e: 0,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 15 }],
        ['', CARD_TYPE.assault, { a: 12 }],
        ['', CARD_TYPE.assault, { a: 10 }],
        ['', CARD_TYPE.assault, { a: 8, e: 2 }],
        ['', CARD_TYPE.assault, { a: 8, w: 2 }],
      ])
    },
    3: {
      name: 'knight',
      type: SPRITE_TYPE.enemy,
      hp: 40,
      d: 0,
      w: 0,
      e: 0,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 15 }],
        ['', CARD_TYPE.assault, { a: 12, e: 2 }],
        ['', CARD_TYPE.assault, { a: 10, d: 10 }],
      ])
    },
    4: {
      name: 'dervish',
      type: SPRITE_TYPE.enemy,
      hp: 28,
      d: 0,
      w: 0,
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
      hp: 22,
      d: 0,
      w: 0,
      e: 1,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 10 }],
        ['', CARD_TYPE.assault, { a: 7, e: 2 }],
        ['', CARD_TYPE.defense, { d: 6 }],
        ['', CARD_TYPE.defense, { d: 4, e: 2 }],
        ['', CARD_TYPE.ability, { e: 2 }],
      ])
    },
    6: {
      name: 'bear1',
      type: SPRITE_TYPE.enemy,
      hp: 22,
      d: 0,
      w: 0,
      e: 2,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 10 }],
        ['', CARD_TYPE.assault, { a: 7, e: 2 }],
        ['', CARD_TYPE.defense, { d: 6 }],
        ['', CARD_TYPE.defense, { d: 4, e: 2 }],
        ['', CARD_TYPE.ability, { e: 2 }],
      ])
    },
    7: {
      name: 'rok',
      type: SPRITE_TYPE.enemy,
      hp: 18,
      d: 0,
      w: 0,
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
      e: 0,
      mounted: false,
      actions: new EnemyActions([
        ['', CARD_TYPE.assault, { a: 9, w: 1 }],
        ['', CARD_TYPE.assault, { a: 5, w: 1, e: 2 }],
        ['', CARD_TYPE.assault, { a: 7, w: 1 }],
        ['', CARD_TYPE.defense, { d: 6 }],
        ['', CARD_TYPE.ability, { e: 2 }],
      ])
    },
  } as EnemyDataCollection
}

function getEnemyDataWithMult(mult: number): EnemyDataCollection {
  const enemyData = { ...data.enemyData };

  Object.keys(enemyData).forEach((key) => {
    let k = Number(key) as keyof EnemyDataCollection;

    const e = { ...enemyData[k] }

    if (mult === 2 || mult === 3) {
      e.hp = e.hp * mult;
    }

    let temp = [...e.actions!.actions];
    const newActions: Array<CardConstructorData> = []

    temp.forEach((action) => {
      const newAction = [action[0], action[1], { ...action[2] }]
      const newData = { ...newAction[2] as CardData };

      if (newData.a!) {
        newData.a! *= mult;
      }
      if (newData.d) {
        newData.d! *= mult;
      }
      newAction[2] = newData;
      newActions.push(newAction as CardConstructorData);
    })

    e.actions = new EnemyActions(newActions);
    enemyData[k] = e
  })

  console.log(data.enemyData[9].hp, enemyData[9].hp, data.enemyData[9].actions.actions[0], enemyData[9].actions.actions[0])

  return enemyData;
}

export default data;
export { getEnemyDataWithMult };
