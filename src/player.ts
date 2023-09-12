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

  applyFromEnemy(cardData: CardData): void {
    super.applyFromEnemy(cardData)
  }

  applyFromFriendly(cardData: CardData): void {
    super.applyFromFriendly(cardData)

    // console.log('*****', 'Additional Player Buffs', { ...cardData }, 'current stats are', { ...this.data })

    const { s = 0, draw = 0, mhp = 0, ca = 0 } = cardData;

    this.currentStamina += s;

    this.currentHp += mhp;
    this.data.hp += mhp;

    if (ca > 0) {
      this.data.e = 0;
      this.data.w = 0;
    }

    if (draw > 0) {
      this.game?.deck.startDraw(draw);
    }

    this.update();

    if (this.currentHp <= 0) {
      this.game?.onDeath(this);
    }
  }

  applyInnate(cards: Array<IVisualCard>, type: ACTIVATION_TRIGGER) {
    let applyCards: Array<IVisualCard> = []

    switch (type) {
      case ACTIVATION_TRIGGER.buff:
        applyCards = cards.filter(card => card.data.on === ACTIVATION_TRIGGER.buff);
        this.game?.onPlayerBuffsApplied(applyCards);
        break;
      case ACTIVATION_TRIGGER.round:
        applyCards = cards.filter(card => card.data.on === ACTIVATION_TRIGGER.round);
        break;
      case ACTIVATION_TRIGGER.turn:
        applyCards = cards.filter(card => card.data.on === ACTIVATION_TRIGGER.turn);
        break;
    }

    applyCards.forEach(card => {
      this.applyFromFriendly(card.data);

      if (card.data.w) {
        this.game?.applyToAllEnemies(card.data);
      }
    })
  }

  play(card: ICard) {
    this.currentStamina -= card.data.c || 0;

    this.update()
  }
}
