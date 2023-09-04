import { GameElement } from "./GameElement";
import { Deck } from "./deck"
import { Entity } from "./entity";
import { ACTIVATION_TRIGGER, CARD_TYPE, DeckCollections, GAME_STATE, SPRITE_TYPE } from "./enums";

export type GameElements = Record<string, HTMLElement>;
export type Cards = Array<IVisualCard>;
export type CardConstructorData = [string, CARD_TYPE, CardData];

export interface ICard extends GameElement {
  name: string;
  type: CARD_TYPE;
  id: string;
  attributes: Array<string>;
  data: CardData;
  dData: (modData?: EntityData | CardData) => CardData;
}

export interface IVisualCard extends ICard {
  sprite: HTMLDivElement;
  update: (modData: EntityData) => void;
  buildVisualAttributes: (data: CardData, modData?: EntityData) => void;
}

export interface IGame {
  e: GameElements
  level: number;
  turn: number;
  deck: IDeck;
  enemies: Array<Entity>;
  player: Entity;
  state: GAME_STATE;
  alert: (str: string) => void;
  newGame: () => void;
  newRound: () => void;
  endRound: () => void;
  endGame: () => void;
  newCardPicked: () => void;
  render: () => void;
  combat: (card: Card) => void;
  entitySelect: (id: string) => void;
  endPlayerTurn: () => void;
  startNextTurn: () => void;
  onDeath: (entity: Entity) => void;
}

export interface IDeck {
  drawPile: Cards,
  handPile: Cards,
  donePile: Cards,
  innatePile: Cards,
  pendingDraw: number,
  register: (game: IGame) => void,
  pickNewCards: () => void,
  add: (card: IVisualCard, collection?: DeckCollections) => void,
  shuffle: () => void,
  shuffleInto: (basePile: Cards, otherPile: Cards) => void,
  draw: (n: number) => void,
  removeFromHand: (card: IVisualCard) => void,
  endTurn: () => void,
  clearHand: () => void,
  endRound: () => void;
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
  s?: number // stamina change value
  draw?: number // draw cards value
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
}

export interface PlayerData extends EntityData {
  stamina: number,
}

export interface CardData extends Affects {
  c?: number; // cost
  on?: ACTIVATION_TRIGGER;
  flavor?: string;
};
