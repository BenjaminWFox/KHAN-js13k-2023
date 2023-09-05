import { Entity } from "./entity";
import { ACTIVATION_TRIGGER } from "./enums";
import { CardData, ICard, IGame, IVisualCard, PlayerData } from "./types";

export class Player extends Entity {
  data: PlayerData;
  currentStamina: number;

  constructor(data: PlayerData, game: IGame) {
    super(data, game);

    this.data = { ...data };
    this.currentStamina = data.stamina;
  }

  resetStamina() {
    this.currentStamina = this.data.stamina;
  }

  resetProperties() {
    this.data.d = 0;
    this.data.w = 0;
    this.data.f = 0;
    this.data.e = 0;
  }

  startRound() {
    this.resetProperties();

    this.resetStamina();
  }

  startTurn() {
    super.startTurn();

    this.resetStamina();

    this.update()
  }

  applyFromFriendly(cardData: CardData): void {
    super.applyFromFriendly(cardData)

    const { s = 0, draw = 0 } = cardData;

    this.currentStamina += s;

    console.log('Apply')
    if (draw > 0) {
      console.log("draw")
      this.game?.deck.draw(draw);
    }

    this.update();
  }

  applyInnate(cards: Array<IVisualCard>, type: ACTIVATION_TRIGGER) {
    console.log('Apply innate', cards)
    let applyCards: Array<IVisualCard> = []

    switch (type) {
      case ACTIVATION_TRIGGER.round:
        applyCards = cards.filter(card => card.data.on === ACTIVATION_TRIGGER.round);
        break;
      case ACTIVATION_TRIGGER.turn:
        applyCards = cards.filter(card => card.data.on === ACTIVATION_TRIGGER.turn);
        break;
    }

    console.log('Found innate', applyCards)

    applyCards.forEach(card => {
      this.applyFromFriendly(card.data);
    })

  }

  play(card: ICard) {
    this.currentStamina -= card.data.c || 0;

    this.update()
  }
}
