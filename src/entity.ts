import { GameElement } from "./GameElement";
import { ENEMY_INTENT } from "./enums";
import { spriteElementBuilder } from "./renderer";
import { EntityData, IEnemyAction, IGame } from "./types";
import { gei, uuid } from "./utility";

export class Entity extends GameElement {
  sprite: HTMLDivElement;
  data: EntityData;
  id: string;
  // nextAction?: IEnemyAction;

  constructor(data: EntityData, game: IGame) {
    super(game);

    const { name, type, hp } = data;

    this.id = uuid();
    this.data = data;
    this.sprite = spriteElementBuilder(name, hp, type, data.mounted, this.id);
    this.sprite.addEventListener('click', () => {
      console.log('CLICKED')
      game.entitySelect(this.id);
    });
  }

  render() {
    gei(this.data.type)?.appendChild(this.sprite);
  }

  intent(action: IEnemyAction) {
    const iEl = this.sprite.querySelector('.intent')!;
    const aEl = iEl.querySelector('.assault-value')!;
    iEl.classList.add(action.type)

    if (action.type === ENEMY_INTENT.assault) {
      aEl.innerHTML = action.affects.a!.toString();
    }
  }

  pickAction() {
    if (this.data.actions) {
      const action = this.data.actions.get();

      this.intent(action);
    }
  }
}
