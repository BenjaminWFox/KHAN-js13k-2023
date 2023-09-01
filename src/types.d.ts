import { Deck } from "./deck"
import { DeckCollections, SPRITE_TYPE } from "./enums";

export type GameElements = Record<string, HTMLElement>

interface Affects {
  a?: number // assault value
  d?: number // defend change value
  w?: number // weak change value
  f?: number // falter change value
  e?: number // enraged change value
  hp?: number // hp change value
}

interface Properties {
  d: number // defend value
  w: number // weak value
  f: number // falter value
  e: number // enraged value
  hp: number // hp value
}

export interface ICard {
  name: string;
  type: CARD_TYPE;
  data: CardData;
  id: number;
  attributes: Array<string>;
}

export interface IDeck {
  drawPile: Array<Card>,
  handPile: Array<Card>,
  donePile: Array<Card>,
  add: (card: Card, collection: DeckCollections) => void,
  shuffle: () => void,
  draw: (n: number) => void,
}

export interface GameData {
  deck: Deck
}

interface IEnemyAction {
  type: ENEMY_INTENT,
  affects: Affects,
}

interface IEnemyActions {
  actions: Array<EnemyAction>
}

export interface EntityData extends Properties {
  name: string,
  type: SPRITE_TYPE,
  mounted: boolean,
  actions?: EnemyActions
}

export interface CardData extends Affects {
  c: number; // cost
  flavor?: string;
};
