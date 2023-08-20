interface CardData {
  a?: number; // attack
  c: number; // cost
  d?: number; // defense
  w?: number; // weak
  f?: number; // fortify
};

let globalId = 0;

export class Card {
  static id = 0;

  name: string;
  data: CardData;
  id: number;

  constructor(name: string, data: CardData) {

    this.id = globalId++;
    this.name = name;
    this.data = data;
  };
};

Object.defineProperties(Card, {
  'id': {
    value: 0
  }
});

export const cards = [
  new Card('Basic Attack', { a: 5, c: 1 }),
  new Card('Basic Shield', { d: 5, c: 1 }),
  new Card('War Cry', { c: 1, w: 2 }),
  new Card('Rally Cry', { c: 1, f: 2 })
];
