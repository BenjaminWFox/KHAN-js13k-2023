import { ENEMY_INTENT, SPRITE_TYPE } from "./enums";
import { EntityData, IEnemyActions, IEnemyAction, Affects } from "./types";
import { getRandomIntInclusive } from "./utility";


class EnemyActions implements IEnemyActions {
  actions: Array<EnemyAction>

  constructor(actions: Array<EnemyAction>) {
    this.actions = actions
  }

  get() {
    return this.actions[getRandomIntInclusive(0, this.actions.length - 1)]
  }
}

class EnemyAction implements IEnemyAction {
  type: ENEMY_INTENT;
  affects: Affects;

  constructor(type: ENEMY_INTENT, affects: Affects) {
    this.type = type;
    this.affects = affects;
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
      new EnemyAction(ENEMY_INTENT.assault, { a: 15 }),
      new EnemyAction(ENEMY_INTENT.assault, { a: 8, e: 2 }),
      new EnemyAction(ENEMY_INTENT.defence, { d: 5 }),
      new EnemyAction(ENEMY_INTENT.ability, { e: 4, f: 2 }),
    ])
  },
  6: {
    name: 'rok', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 0, mounted: false,
    actions: new EnemyActions([
      new EnemyAction(ENEMY_INTENT.assault, { a: 15 }),
      new EnemyAction(ENEMY_INTENT.assault, { a: 8, e: 2 }),
      new EnemyAction(ENEMY_INTENT.defence, { d: 5 }),
      new EnemyAction(ENEMY_INTENT.ability, { e: 4, f: 2 }),
    ])
  },
  7: {
    name: 'wolf', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 3, mounted: false,
    actions: new EnemyActions([
      new EnemyAction(ENEMY_INTENT.assault, { a: 15 }),
      new EnemyAction(ENEMY_INTENT.assault, { a: 8, e: 2 }),
      new EnemyAction(ENEMY_INTENT.defence, { d: 5 }),
      new EnemyAction(ENEMY_INTENT.ability, { e: 4, f: 2 }),
    ])
  },
  8: {
    name: 'bear1', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 2, mounted: false,
    actions: new EnemyActions([
      new EnemyAction(ENEMY_INTENT.assault, { a: 15 }),
      new EnemyAction(ENEMY_INTENT.assault, { a: 8, e: 2 }),
      new EnemyAction(ENEMY_INTENT.defence, { d: 5 }),
      new EnemyAction(ENEMY_INTENT.ability, { e: 4, f: 2 }),
    ])
  },
  9: {
    name: 'bear2', type: SPRITE_TYPE.enemy, hp: 50, d: 0, w: 0, f: 0, e: 1, mounted: false,
    actions: new EnemyActions([
      new EnemyAction(ENEMY_INTENT.assault, { a: 15 }),
      new EnemyAction(ENEMY_INTENT.assault, { a: 8, e: 2 }),
      new EnemyAction(ENEMY_INTENT.defence, { d: 5 }),
      new EnemyAction(ENEMY_INTENT.ability, { e: 4, f: 2 }),
    ])
  },
}

