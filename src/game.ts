import { IDeck, GameData, GameElements } from "./types";
import { levels } from "./levels";
import { Entity } from "./entity";
import { enemies } from "./enemies";
import { player } from "./player";

export class Game {
  e: GameElements
  level: number;
  turn: number;
  deck: IDeck;
  entities: Array<Entity>

  constructor(e: GameElements, gameData: GameData) {
    this.e = e;
    this.level = 1;
    this.turn = 1;
    this.deck = gameData.deck;
    this.entities = [];
  }

  new() {
    this.e.title.classList.add('hide');
    this.e.game.classList.remove('hide');

    levels[this.level].enemies().forEach((enemy => {
      this.entities.push(new Entity(enemies[enemy]))
    }))
    this.entities.push(new Entity(player))
  }

  render() {
    this.entities.forEach(entity => {
      entity.render();
      entity.pickAction();
    })
  }
}
