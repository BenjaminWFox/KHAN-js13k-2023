import { VisualCard, basicCards, cards, innateCards } from "./card";
import { CARD_TYPE, DeckCollections, GAME_STATE } from "./enums";
import { CardConstructorData, Cards, EntityData, ICard, IDeck, IGame, IVisualCard } from "./types";
import { gei, getRandomIntInclusive } from "./utility";
import { GameElement } from "./GameElement";
import sounds from "./sounds";

const MAX_IN_HAND = 8;
const alreadyShownCardsQueue: Array<number> = []
const alreadyShownInnateCardsQueue: Array<number> = []

function pickNewNumberIfInSeenCollection(collection: Array<number>, seenCollection: Array<number>, pickCollection: Array<CardConstructorData>, collectionMaxLen: number) {
  // console.log('** Collection MAX', collectionMaxLen)
  let newIds: Array<number> = [];

  collection.forEach((num, i) => {
    // console.log('Running for next number', num);
    let newId = num;

    while (seenCollection.includes(newId) || newIds.includes(newId)) {
      newId = getRandomIntInclusive(0, pickCollection.length - 1);
      // console.log('Trying to replace card id', num, 'with', newId)
    }

    newIds.push(newId);
    collection[i] = newId;
  })

  newIds.forEach(id => {
    seenCollection.push(id);
  })

  while (seenCollection.length > collectionMaxLen) {
    seenCollection.shift();
  }
}

function getNewCardsToPick() {
  // console.log('Fetching new cards - current seen queue:', { alreadyShownCardsQueue: [...alreadyShownCardsQueue], alreadyShownInnateCardsQueue: [...alreadyShownInnateCardsQueue] })
  const c1 = getRandomIntInclusive(0, cards.length - 1);
  let c2 = c1
  let c3 = c1

  while (c2 === c1 || c2 === c3) {
    c2 = getRandomIntInclusive(0, cards.length - 1);
  }

  while (c3 === c1 || c3 === c2) {
    c3 = getRandomIntInclusive(0, cards.length - 1);
  }

  const ci1 = getRandomIntInclusive(0, innateCards.length - 1);
  let ci2 = getRandomIntInclusive(0, innateCards.length - 1);
  while (ci1 === ci2) {
    ci2 = getRandomIntInclusive(0, innateCards.length - 1);
  }

  const cardIds = [c1, c2, c3];
  const innateCardIds = [ci1, ci2];

  // console.log({ cardIds: [...cardIds], innateCardIds: [...innateCardIds] })

  pickNewNumberIfInSeenCollection(cardIds, alreadyShownCardsQueue, cards, 6);
  pickNewNumberIfInSeenCollection(innateCardIds, alreadyShownInnateCardsQueue, innateCards, 4);

  // console.log({ cardIds, innateCardIds })
  // console.log('Finished, new queue is', { alreadyShownCardsQueue: [...alreadyShownCardsQueue], alreadyShownInnateCardsQueue: [...alreadyShownInnateCardsQueue] })

  return [
    new VisualCard(cards[cardIds[0]], true),
    new VisualCard(cards[cardIds[1]], true),
    new VisualCard(cards[cardIds[2]], true),
    new VisualCard(innateCards[innateCardIds[0]], true),
    new VisualCard(innateCards[innateCardIds[1]], true)];
}

export class Deck extends GameElement implements IDeck {
  deck: Cards;
  drawPile: Cards;
  handPile: Cards;
  donePile: Cards;
  innatePile: Cards;
  pendingDraw: number;
  pendingSelect: IVisualCard | undefined;
  game: IGame;

  constructor(game: IGame) {
    super(game);

    this.game = game;
    this.drawPile = [
      new VisualCard(basicCards[0]),
      new VisualCard(basicCards[0]),
      new VisualCard(basicCards[0]),
      new VisualCard(basicCards[1]),
      new VisualCard(basicCards[1]),
      new VisualCard(basicCards[2]),
      new VisualCard(basicCards[3]),
      new VisualCard(basicCards[4]),
      new VisualCard(basicCards[5]),
    ];
    this.deck = [...this.drawPile];
    this.handPile = [];
    this.donePile = [];
    this.innatePile = [];
    this.pendingDraw = 0;
    this.update();

    this.register(this.game);
  }

  register(game: IGame) {
    [this.drawPile, this.handPile, this.donePile].forEach(pile => pile?.forEach(card => card.register(game)));
  }

  selectToAdd(card: IVisualCard) {
    this.handPile.forEach(card => {
      card.sprite.classList.remove('selected');
    })
    if (this.pendingSelect === card) {
      (gei('confirmcard') as HTMLButtonElement).disabled = true
      this.pendingSelect = undefined;
    } else {
      (gei('confirmcard') as HTMLButtonElement).disabled = false
      this.pendingSelect = card;
      this.pendingSelect.sprite.classList.add('selected');
    }
  }

  confirmAdd() {
    const el = (gei('confirmcard') as HTMLButtonElement)
    el.removeEventListener('click', this.confirmAdd);
    el.disabled = true;
    el.classList.add('hide');

    if (this.pendingSelect && this.game?.state === GAME_STATE.PICKING_CARD) {
      this.game?.setState(GAME_STATE.TRANSITION)

      this.pendingSelect.sprite.classList.remove('selected');

      this.pendingSelect.sprite.removeEventListener('click', this.pendingSelect.listener)
      this.pendingSelect.listener = this.pendingSelect.cardSelect.bind(this.pendingSelect)
      this.pendingSelect.sprite.addEventListener('click', this.pendingSelect.listener)

      this.pendingSelect.type === CARD_TYPE.innate ?
        this.add(this.pendingSelect, DeckCollections.INNATE)
        : this.add(this.pendingSelect);

      this.pendingSelect = undefined;
    }
  }

  add(card: IVisualCard, collection?: DeckCollections) {
    switch (collection) {
      case DeckCollections.DONE:
        this.donePile.push(card);
        break;
      case DeckCollections.HAND:
        this.handPile.push(card);
        break;
      case DeckCollections.INNATE:
        this.innatePile.push(card);
        break;
      default:
      case DeckCollections.DRAW:
        this.drawPile.push(card);
        break;
    };

    this.deck.push(card);

    this.update();

    this.game.newCardPicked()

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
    gei('deck')!.innerHTML = `Draw: ${this.drawPile.length}`;
    gei('done')!.innerHTML = `Discard: ${this.donePile.length}`;
  }

  draw(n: number) {
    this.pendingDraw = n;

    if (n > 0 && this.handPile.length < MAX_IN_HAND) {
      sounds.draw();
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
    } else if (this.pendingDraw > 0) {
      this.game.alert('Your hand is full!')
    }

    return this;
  };

  startDraw(n: number) {
    setTimeout(() => this.draw(n), 100)
  }

  pickNewCards() {
    const cards = getNewCardsToPick();

    const el = (gei('confirmcard') as HTMLButtonElement)
    el.addEventListener('click', this.confirmAdd.bind(this));
    el.classList.remove('hide');

    cards.forEach(card => {
      card.register(this.game);
      this.handPile.push(card);
      gei('card-holder')?.appendChild(card.sprite)
    })
  }

  updateVisibleCards(modData: EntityData) {
    this.handPile.forEach(card => {
      card.update(modData);
    })
  }

  removeFromHand(card: IVisualCard, addToDone = true) {
    card.sprite.parentNode?.removeChild(card.sprite);

    if (addToDone) {
      this.donePile.push(card);
    }

    this.handPile.splice(this.handPile.indexOf(card), 1)

    this.update();
  }

  removeInnateBuffs(cards: Cards) {
    for (let i = 0; i < this.innatePile.length; i++) {
      const c = this.innatePile[i]

      if (cards.indexOf(c) !== -1) {
        this.innatePile.splice(i, 1);
        i--;
      }
    }
  }

  clearHand() {
    const card = this.handPile[this.handPile.length - 1];

    if (card) {
      this.removeFromHand(card, false);

      setTimeout(() => this.clearHand(), 100);
    }
  }

  endTurn() {
    const card = this.handPile[this.handPile.length - 1];

    if (card) {
      this.removeFromHand(card);

      setTimeout(() => this.endTurn(), 100);
    }
  }

  endRound() {
    this.endTurn();

    setTimeout(() => {
      this.shuffleInto(this.drawPile, this.donePile);
    }, 1000)
  }
}
