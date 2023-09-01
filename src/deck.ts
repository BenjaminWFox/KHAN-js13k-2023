import { Card, cards } from "./card";
import { DeckCollections } from "./enums";
import { cardElementBuilder } from "./renderer";
import { Cards, IDeck } from "./types";
import { gei, getRandomIntInclusive } from "./utility";

const MAX_IN_HAND = 8;
const STARTING_CARDS = 6;

export class Deck implements IDeck {
  drawPile: Cards;
  handPile: Cards;
  donePile: Cards;
  pendingDraw: number;
  game: any;

  constructor() {
    this.drawPile = [
      ...(new Array(6).fill('_')).map((_, i) => {
        return new Card(cards[i % 2])
      }),
      new Card(cards[2]),
      new Card(cards[3])
    ];
    this.handPile = [];
    this.donePile = [];
    this.pendingDraw = 0;
    this.renderScreenData();
  }

  register(game: any) {
    this.game = game;
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

  shuffleInto(basePile: Array<Card>, otherPile: Array<Card>) {
    while (otherPile.length) {
      const c = otherPile.splice(Math.floor(Math.random() * otherPile.length), 1)[0];
      const i = getRandomIntInclusive(0, basePile.length);
      basePile.splice(i, 0, c);
    }
  }

  renderScreenData() {
    gei('deck')!.innerHTML = `Deck: ${this.drawPile.length}`;
    gei('done')!.innerHTML = `Discard: ${this.donePile.length}`;
  }

  draw(n: number) {
    this.pendingDraw = n;

    if (n > 0 && this.handPile.length < MAX_IN_HAND) {
      if (this.drawPile.length) {
        const c: Card = this.drawPile.pop();
        this.handPile.push(c);
        console.log('PUSHING', c);
        const e = cardElementBuilder(c)
        console.log(e);
        e.addEventListener('click', (event: MouseEvent) => { event.stopPropagation(); this.game.combat(c, e) });
        e.id = c.id.toString();
        gei('card-holder')?.appendChild(e)
      } else if (this.donePile.length) {
        this.shuffleInto(this.drawPile, this.donePile);

        this.draw(n);
      }

      this.renderScreenData();
      setTimeout(() => this.draw(--n), 100)
    }

    return this;
  };
}
