import { Deck } from "./deck"
import { DeckCollections, SPRITE_TYPE } from "./enums";

export type GameElements = Record<string, HTMLElement>;
export type Cards = Array<Card>;

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
  id: string;
  attributes: Array<string>;
  sprite: HTMLDivElement;
}

export interface IGame {
  e: GameElements
  level: number;
  turn: number;
  deck: IDeck;
  entities: Array<Entity>;
  player: Entity;
  new: () => void;
  render: () => void;
  combat: (card: Card) => void;
  entitySelect: (id: string) => void;
}

export interface IDeck {
  drawPile: Cards,
  handPile: Cards,
  donePile: Cards,
  pendingDraw: number,
  register: (game: IGame) => void,
  add: (card: Card, collection: DeckCollections) => void,
  shuffle: () => void,
  shuffleInto: (basePile: Cards, otherPile: Cards) => void,
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
  actions?: EnemyActions,
  stamina: number,
}

export interface CardData extends Affects {
  c: number; // cost
  flavor?: string;
};
