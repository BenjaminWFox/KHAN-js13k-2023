export interface CardData {
  a?: number; // attack
  c: number; // cost
  d?: number; // defense
  w?: number; // weak
  f?: number; // frail
  e?: number; // enrage
  l?: number; // life lostt
  flavor?: string;
};

export enum CARD_TYPE {
  assault = 'assault',
  ability = 'ability',
  defense = 'defense',
}

let globalId = 0;

export class Card {
  name: string;
  type: CARD_TYPE;
  data: CardData;
  id: number;
  attributes: Array<string>;

  constructor(name: string, type: CARD_TYPE, data: CardData) {
    this.id = globalId++;
    this.name = name;
    this.type = type;
    this.data = data;
    this.attributes = []

    if (data.a) this.attributes.push(`ATTACK: ${data.a}`)
    if (data.d) this.attributes.push(`DEFEND: ${data.d}`)
    if (data.e) this.attributes.push(`ENRAGE: ${data.e}`)
    if (data.w) this.attributes.push(`WEAKEN: ${data.w}`)
    if (data.f) this.attributes.push(`FALTER: ${data.f}`)
    if (data.l && data.l < 0) this.attributes.push(`Lose ${Math.abs(data.l)} life`)
    if (data.l && data.l > 0) this.attributes.push(`Gain ${data.l} life`)
  };
};

Object.defineProperties(Card, {
  'id': {
    value: 0
  }
});

export const cards = [
  new Card('Basic Attack', CARD_TYPE.assault, { a: 5, c: 1, flavor: 'You spend your life perfecting something, is it really basic?' }),
  new Card('Basic Shield', CARD_TYPE.defense, { d: 5, c: 1, flavor: 'Discretion is the better part of valor, after all.' }),
  new Card('War Cry', CARD_TYPE.ability, { c: 1, w: 2 }),
  new Card('Rally Cry', CARD_TYPE.ability, { c: 1, f: 2 }),
  new Card('Wrath Of Khan', CARD_TYPE.assault, { c: 1, a: 5, e: 2, l: -2, flavor: 'The Khan was merciless in pursuit of his enemies.' })
];
