import { Entity } from "./entity";
import { SPRITE_TYPE } from "./enums";
import { ICard, IGame, PlayerData } from "./types";

export const playerData: PlayerData = {
  name: 'khan',
  type: SPRITE_TYPE.player,
  hp: 100,
  d: 0,
  w: 0,
  f: 0,
  e: 0,
  mounted: true,
  stamina: 4
}

export class Player extends Entity {
  data: PlayerData;
  currentStamina: number;

  constructor(data: PlayerData, game: IGame) {
    super(data, game);

    this.data = data;
    this.currentStamina = data.stamina;
  }

  startTurn() {
    super.startTurn();

    this.currentStamina = this.data.stamina;

    this.update()
  }

  play(card: ICard) {
    this.currentStamina -= card.data.c || 0;

    this.update()
  }
}
