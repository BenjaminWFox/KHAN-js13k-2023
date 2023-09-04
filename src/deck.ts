import { VisualCard, cards } from "./card";
import { DeckCollections } from "./enums";
import { Cards, EntityData, IDeck, IGame, IVisualCard } from "./types";
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
        return new VisualCard(cards[i % 2])
      }),
      new VisualCard(cards[2]),
      new VisualCard(cards[3])
    ];
    this.handPile = [];
    this.donePile = [];
    this.pendingDraw = 0;
    this.update();

    this.register(this.game);
  }

  register(game: IGame) {
    [this.drawPile, this.handPile, this.donePile].forEach(pile => pile?.forEach(card => card.register(game)));
  }

  add(card: IVisualCard, collection: DeckCollections) {
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
    const t: Array<IVisualCard> = [];

    while (this.drawPile.length) {
      t.push(this.drawPile.splice(Math.floor(Math.random() * this.drawPile.length), 1)[0])
    }

    this.drawPile = t;

    return this;
  };

  shuffleInto(basePile: Array<IVisualCard>, otherPile: Array<IVisualCard>) {
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
        const c = this.drawPile.pop()!;

        c.update(this.game.player.data);

        this.handPile.push(c);

        gei('card-holder')?.appendChild(c.sprite)

        this.update();
        setTimeout(() => this.draw(--n), 100)
      } else if (this.donePile.length) {
        this.shuffleInto(this.drawPile, this.donePile);

        this.draw(n);
      }
    }

    return this;
  };

  updateVisibleCards(modData: EntityData) {
    this.handPile.forEach(card => {
      card.update(modData);
    })
  }

  removeFromHand(card: IVisualCard) {
    card.sprite.parentNode?.removeChild(card.sprite);

    this.donePile.push(card);
    this.handPile.splice(this.handPile.indexOf(card), 1)
    this.update();
  }

  endTurn() {
    const card = this.handPile[this.handPile.length - 1];

    if (card) {
      this.removeFromHand(card);

      setTimeout(() => this.endTurn(), 100);
    }
  }
}
