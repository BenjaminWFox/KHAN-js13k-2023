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
  listener: (e: MouseEvent) => void;
  cardSelect: (e: MouseEvent) => void;
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
  diffMult: number;
  modifiedEnemyData: EnemyDataCollection;
  setState: (state: GAME_STATE) => void;
  alert: (str: string) => void;
  newGame: () => void;
  newRound: () => void;
  endRound: () => void;
  endGame: () => void;
  newCardPicked: () => void;
  render: () => void;
  onPlayerBuffsApplied: (cards: Cards) => void;
  onPlayerSelectCard: (card: Card) => void;
  entitySelect: (id: string) => void;
  endPlayerTurn: () => void;
  startNextTurn: () => void;
  onDeath: (entity: Entity) => void;
  applyToAllEnemies: (cardData: CardData) => void;
}

export interface IDeck {
  deck: Cards,
  drawPile: Cards,
  handPile: Cards,
  donePile: Cards,
  innatePile: Cards,
  pendingDraw: number,
  pendingSelect: IVisualCard | undefined,
  selectToAdd: (card: IVisualCard) => void,
  confirmAdd: () => void,
  register: (game: IGame) => void,
  pickNewCards: () => void,
  add: (card: IVisualCard, collection?: DeckCollections) => void,
  shuffle: () => void,
  shuffleInto: (basePile: Cards, otherPile: Cards) => void,
  draw: (n: number) => void,
  startDraw: (n: number) => void,
  removeFromHand: (card: IVisualCard) => void,
  removeInnateBuffs: (cards: Cards) => void,
  endTurn: () => void,
  clearHand: () => void,
  endRound: () => void;
  updateVisibleCards: (data: EntityData) => void;
}

export interface GameData {
  level: number,
  turn: number,
  enemies: Array<Enemy>,
  player: Player,
  deck: Deck,
}

interface Affects {
  a?: number // assault value
  aa?: number // assult all value
  d?: number // defend change value
  w?: number // weak change value
  // f?: number // falter change value
  wa?: number // weak all change value
  e?: number // enraged change value
  hp?: number // hp change value
  mhp?: number // max hp change value
  s?: number // stamina change value
  ca?: number // clear all debuffs value
  draw?: number // draw cards value
}

interface IEnemyActions {
  actions: Array<CardConstructorData>
  get: () => CardConstructorData
}

interface Properties {
  d: number // defend value
  w: number // weak value
  // f: number // falter value
  e: number // enraged value
  hp: number // hp value
}

export interface EntityData extends Properties {
  name: string,
  type: SPRITE_TYPE,
  mounted: boolean,
}

export interface PlayerData extends EntityData {
  stamina: number,
}

export interface CardData extends Affects {
  c?: number; // cost
  on?: ACTIVATION_TRIGGER;
  flavor?: string;
};

export interface EnemyData extends EntityData {
  actions: IEnemyActions;
}
export type EnemyDataCollection = Record<number, EnemyData>;
