import { IGame } from "./types";

export class GameElement {
  game: IGame | undefined;

  constructor(game?: IGame) {
    if (game) { this.register(game) }
  }

  register(game: IGame) {
    this.game = game;
  }
}
