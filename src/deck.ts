import { Card, cards } from "./card";
import { DeckCollections } from "./enums";
import { IDeck } from "./types";

const MAX_IN_HAND = 8;
const STARTING_CARDS = 6;

export class Deck implements IDeck {
  drawPile: Array<Card>;
  handPile: Array<Card>;
  donePile: Array<Card>;

  constructor() {
    console.log('Constructor')

    new Array(STARTING_CARDS).forEach(() => {
      this.drawPile.push({ ...cards[0] });
    });
    this.drawPile = [
      ...(new Array(6).fill('_')).map((_, i) => {
        console.log('running...')
        return cards[i % 2]
      }),
      cards[2],
      cards[3]
    ];
    this.handPile = [];
    this.donePile = [];
  }

  add(card: Card, collection: DeckCollections) {
    switch (collection) {
      case DeckCollections.DONE:
        this.donePile.push(card);
        break;
      case DeckCollections.DRAW:
        this.drawPile.push(card);
        break;
      default:
      case DeckCollections.HAND:
        this.handPile.push(card);
        break;
    };

    return this;
  }

  shuffle() {
    const t: Array<Card> = [];
    while (this.drawPile.length) {
      t.push(this.drawPile.splice(Math.floor(Math.random() * this.drawPile.length), 1)[0])
    }
    this.drawPile = t;

    return this;
  };

  draw(n: number) {
    while (!!n-- && this.handPile.length < MAX_IN_HAND) {
      if (this.drawPile.length) {
        this.handPile.push(this.drawPile.pop()!);
      } else if (this.donePile.length) {
        this.drawPile = this.donePile.splice(0, this.donePile.length);
        this.shuffle();
        this.draw(n);
      }
    }

    return this;
  };
}
