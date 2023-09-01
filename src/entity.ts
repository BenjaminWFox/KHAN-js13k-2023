import { ENEMY_INTENT } from "./enums";
import { spriteElementBuilder } from "./renderer";
import { EntityData, IEnemyAction } from "./types";
import { gei } from "./utility";

export class Entity {
  sprite: HTMLDivElement;
  data: EntityData;
  // nextAction?: IEnemyAction;

  constructor(data: EntityData) {
    const { name, type, hp } = data;

    this.data = data;
    this.sprite = spriteElementBuilder(name, hp, type, data.mounted);
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

      console.log('I am going to', action, this.data.actions)

      this.intent(action);
    }
  }
}
