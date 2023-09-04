import { Deck } from "./deck"
import { Entity } from "./entity";
import { CARD_TYPE, DeckCollections, SPRITE_TYPE } from "./enums";

export type GameElements = Record<string, HTMLElement>;
export type Cards = Array<Card>;

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
  enemies: Array<Entity>;
  player: Entity;
  newGame: () => void;
  render: () => void;
  combat: (card: Card) => void;
  entitySelect: (id: string) => void;
  endPlayerTurn: () => void;
  startNextTurn: () => void;
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
  removeFromHand: (card: Card) => void,
  endTurn: () => void,
  updateVisibleCards: (data: EntityData) => void;
}

export interface GameData {
  deck: Deck
}

interface Affects {
  a?: number // assault value
  d?: number // defend change value
  w?: number // weak change value
  f?: number // falter change value
  e?: number // enraged change value
  hp?: number // hp change value
}

interface IEnemyActions {
  actions: Array<Card>
}

interface Properties {
  d: number // defend value
  w: number // weak value
  f: number // falter value
  e: number // enraged value
  hp: number // hp value
}

export interface EntityData extends Properties {
  name: string,
  type: SPRITE_TYPE,
  mounted: boolean,
  actions?: EnemyActions,
  stamina: number,
}

export interface CardData extends Affects {
  c?: number; // cost
  flavor?: string;
};
