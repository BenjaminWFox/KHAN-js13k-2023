import { GameElement } from "./GameElement";
import { ENEMY_INTENT } from "./enums";
import { spriteElementBuilder } from "./renderer";
import { EntityData, ICard, IEnemyAction, IGame } from "./types";
import { gei, qs, uuid } from "./utility";

export class Entity extends GameElement {
  sprite: HTMLDivElement;
  data: EntityData;
  id: string;
  currentHp: number;
  // nextAction?: IEnemyAction;

  constructor(data: EntityData, game: IGame) {
    super(game);

    const { name, type, hp } = data;

    this.id = uuid();
    this.data = data;
    this.currentHp = data.hp;
    this.sprite = spriteElementBuilder(name, hp, type, data.mounted, this.id);
    this.sprite.addEventListener('click', () => {
      console.log('This sprite select', this.id, this.data.name);
      game.entitySelect(this.id);
    });
  }

  render() {
    gei(this.data.type)?.appendChild(this.sprite);
    this.update();
  }

  update() {
    qs(this.sprite, '.hp .fill').style.width = Math.round(this.currentHp / this.data.hp * 100) + '%';
    qs(this.sprite, '.hp .number').innerHTML = `${this.currentHp}/${this.data.hp}`;
    qs(this.sprite, '.affects .armor').innerHTML = 'D:' + this.data.d;
    qs(this.sprite, '.affects .enrage').innerHTML = 'E:' + this.data.e;
    qs(this.sprite, '.affects .falter').innerHTML = 'F:' + this.data.f;
    qs(this.sprite, '.affects .weak').innerHTML = 'W:' + this.data.w;
  }

  play(card: ICard) {
    this.data.stamina -= card.data.c;

    this.update()
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

  applyFromEnemy(card: ICard) {
    const { a = 0, w = 0, f = 0, } = card.data

    this.currentHp = Math.max(0, this.currentHp - a);
    this.data.w += w;
    this.data.f += f;

    this.update();
  }

  applyFromFriendly(card: ICard) {
    const { d = 0, e = 0, hp = 0, } = card.data

    this.currentHp = Math.max(0, this.currentHp + hp);
    this.data.d += d;
    this.data.e += e;

    this.update();
  }
}
