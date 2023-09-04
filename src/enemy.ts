import { Entity } from "./entity";
import { CARD_TYPE } from "./enums";
import { CardData, EntityData, ICard, IGame } from "./types";
import { getAttackForData } from "./utility";

export class Enemy extends Entity {
  nextAction!: ICard;

  constructor(data: EntityData, game: IGame) {
    super(data, game);
  }

  intent(action: ICard) {
    const iEl = this.sprite.querySelector('.intent')!;
    const aEl = iEl.querySelector('.assault-value')!;
    iEl.classList.add(action.type)

    if (action.type === CARD_TYPE.assault) {
      console.log('Assigning attack value', getAttackForData(action.data.a!, this.data).toString(), this.data);

      aEl.innerHTML = getAttackForData(action.data.a!, this.data).toString();
    }
  }

  pickAction() {
    this.nextAction = this.data.actions.get();

    console.log('Picking next action', this.nextAction);

    this.intent(this.nextAction);
  }

  applyFromEnemy(cardData: CardData) {
    super.applyFromEnemy(cardData);

    this.intent(this.nextAction);
  }
}
