import { GameElement } from "./GameElement";
import { CARD_TYPE, SPRITE_TYPE } from "./enums";
import { spriteElementBuilder } from "./renderer";
import { Affects, CardData, EntityData, ICard, IGame } from "./types";
import { gei, qs, uuid } from "./utility";

export class Entity extends GameElement {
  sprite: HTMLDivElement;
  data: EntityData;
  id: string;
  currentHp: number;
  currentStamina: number;
  nextAction?: ICard;
  isPlayer: boolean;

  constructor(data: EntityData, game: IGame) {
    super(game);

    const { name, type, hp } = data;

    this.id = uuid();
    this.data = data;
    this.currentHp = data.hp;
    this.currentStamina = data.stamina;
    this.sprite = spriteElementBuilder(name, hp, type, data.mounted, this.id);
    this.sprite.addEventListener('click', () => {
      game.entitySelect(this.id);
    });
    this.isPlayer = this.data.type === SPRITE_TYPE.player;
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
    this.currentStamina -= card.data.c || 0;

    this.update()
  }

  intent(action: ICard) {
    const iEl = this.sprite.querySelector('.intent')!;
    const aEl = iEl.querySelector('.assault-value')!;
    iEl.classList.add(action.type)

    if (action.type === CARD_TYPE.assault) {
      aEl.innerHTML = action.data.a!.toString();
    }
  }

  pickAction() {
    if (this.data.actions) {
      this.nextAction = this.data.actions.get();

      this.intent(this.nextAction!);
    }
  }

  applyFromEnemy(cardData: CardData | Affects) {
    const { a = 0, w = 0, f = 0, } = cardData

    this.currentHp = Math.max(0, this.currentHp - a);
    this.data.w += w;
    this.data.f += f;

    this.update();
  }

  applyFromFriendly(cardData: CardData | Affects) {
    const { d = 0, e = 0, hp = 0, } = cardData

    this.currentHp = Math.max(0, this.currentHp + hp);
    this.data.d += d;
    this.data.e += e;

    this.update();
  }

  startTurn() {
    this.data.d = 0;
    this.data.e = Math.max(0, this.data.e - 1);
    this.currentStamina = this.data.stamina;
    this.update()
  }

  endTurn() {
    console.log('ENDING TURN', this.id)
    this.data.f = Math.max(0, this.data.f - 1);
    this.data.w = Math.max(0, this.data.w - 1);
    this.update()
  }

  do(type: CARD_TYPE) {
    let animationName = '';

    console.log('Do!');

    switch (type) {
      case CARD_TYPE.ability:
        animationName = 'bumpUp';
        break;
      case CARD_TYPE.assault:
        animationName = this.isPlayer ? 'bumpLeft' : 'bumpRight';
        break;
      case CARD_TYPE.defense:
        animationName = this.isPlayer ? 'bumpRight' : 'bumpLeft';
        break;
    }

    console.log('Do!', animationName);

    // qs(this.sprite, '.targeting').classList.add('myturn')
    this.sprite.style.animationName = animationName;
    setTimeout(() => {
      const e = qs(this.sprite, '.intent');
      e.className = 'intent';
      qs(e, ('.assault-value')).innerHTML = ''
    }, 500);
    setTimeout(() => {
      this.sprite.style.animation = '';
      // qs(this.sprite, '.targeting').classList.remove('myturn')
    }, 1000);
  }
}
