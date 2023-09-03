import { Card, cards } from "./card";
import { DeckCollections } from "./enums";
import { Cards, ICard, IDeck, IGame } from "./types";
import { gei, getRandomIntInclusive } from "./utility";
import { GameElement } from "./GameElement";

const MAX_IN_HAND = 8;
const STARTING_CARDS = 6;

export class Deck extends GameElement implements IDeck {
  drawPile: Cards;
  handPile: Cards;
  donePile: Cards;
  pendingDraw: number;
  game: IGame;

  constructor(game: IGame) {
    super(game);

    this.game = game;
    this.drawPile = [
      ...(new Array(STARTING_CARDS).fill('_')).map((_, i) => {
        return new Card(cards[i % 2])
      }),
      new Card(cards[2]),
      new Card(cards[3])
    ];
    this.handPile = [];
    this.donePile = [];
    this.pendingDraw = 0;
    this.update();

    this.register(this.game);
  }

  register(game: IGame) {
    console.log('REGISTER');
    console.log(this.drawPile, this.handPile, this.donePile);

    [this.drawPile, this.handPile, this.donePile].forEach(pile => pile?.forEach(card => card.register(game)));
  }

  add(card: Card, collection: DeckCollections) {
    card.register(this.game);

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

  update() {
    gei('deck')!.innerHTML = `Deck: ${this.drawPile.length}`;
    gei('done')!.innerHTML = `Discard: ${this.donePile.length}`;
  }

  draw(n: number) {
    this.pendingDraw = n;

    if (n > 0 && this.handPile.length < MAX_IN_HAND) {
      if (this.drawPile.length) {
        const c: Card = this.drawPile.pop();
        this.handPile.push(c);

        gei('card-holder')?.appendChild(c.sprite)

      } else if (this.donePile.length) {
        this.shuffleInto(this.drawPile, this.donePile);

        this.draw(n);
      }

      console.log('Drawing', this.handPile);

      this.update();
      setTimeout(() => this.draw(--n), 100)
    }

    return this;
  };

  play(card: ICard) {
    this.donePile.push(card);
    this.handPile.splice(this.handPile.find((c, i) => c.id === card.id && i), 1)

    this.update();
  }
}
