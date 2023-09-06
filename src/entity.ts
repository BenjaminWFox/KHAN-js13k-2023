import { GameElement } from "./GameElement";
import { CARD_TYPE, SPRITE_TYPE } from "./enums";
import { spriteElementBuilder } from "./renderer";
import { CardData, EntityData, IGame } from "./types";
import { gei, qs, uuid } from "./utility";

function flashChanged(el: HTMLElement) {
  el.classList.add('changed');
  setTimeout(() => {
    el.classList.remove('changed');
  }, 1500)
}

export class Entity extends GameElement {
  sprite: HTMLDivElement;
  data: EntityData;
  id: string;
  currentHp: number;
  isPlayer: boolean;

  constructor(data: EntityData, game: IGame) {
    super(game);

    const { name, type, hp } = data;

    this.id = uuid();
    this.data = { ...data };
    this.currentHp = data.hp;
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

  update(changed?: Partial<CardData>) {
    const fillEl = qs(this.sprite, `.hp .fill`)
    fillEl.style.width = Math.round(this.currentHp / this.data.hp * 100) + '%';
    this.data.d > 0 ? fillEl.classList.add('armored') : fillEl.classList.remove('armored');
    qs(this.sprite, '.hp .number').innerHTML = `${this.currentHp}/${this.data.hp}`;
    const dEl = qs(this.sprite, '.affects .armor')
    dEl.innerHTML = 'D:' + this.data.d;
    if (changed?.d) flashChanged(dEl);
    const eEl = qs(this.sprite, '.affects .enrage')
    eEl.innerHTML = 'E:' + this.data.e;
    if (changed?.e) flashChanged(eEl);
    const fEl = qs(this.sprite, '.affects .falter')
    fEl.innerHTML = 'F:' + this.data.f;
    if (changed?.f) flashChanged(fEl);
    const wEl = qs(this.sprite, '.affects .weak')
    wEl.innerHTML = 'W:' + this.data.w;
    if (changed?.w) flashChanged(wEl);
  }

  applyFromEnemy(cardData: CardData) {
    console.log(this.id, 'entity applying cardData', cardData);

    let changed: Partial<CardData> = {}
    const { a = 0, aa = 0, fa = 0, w = 0, f = 0, } = cardData

    let d = this.data.d;

    if (a > 0 && this.data.d > 0) {
      console.log('Applying against defense')
      changed.d = this.data.d
      d = d - a;

      if (d < 0) {
        this.currentHp = Math.min(this.data.hp, Math.max(0, this.currentHp - (a - this.data.d)));

        this.data.d = 0;
      } else {
        this.data.d = d;
      }
    } else {
      console.log('Applying against hp only')
      this.currentHp = Math.min(this.data.hp, Math.max(0, this.currentHp - a));
    }

    this.data.w += w;
    this.data.f += f;

    if (w > 0) changed.w = w;
    if (f > 0) changed.f = f;

    this.update(changed);

    if (this.currentHp <= 0) {
      this.game?.onDeath(this);
    }

    const parsedData = {} as CardData
    if (aa > 0) parsedData.a = aa;
    if (fa > 0) parsedData.f = fa;

    if (Object.keys(parsedData).length) this.game?.applyToAllEnemies(parsedData);
  }

  applyFromFriendly(cardData: CardData) {
    let changed: Partial<CardData> = {}
    const { d = 0, e = 0, hp = 0 } = cardData

    this.currentHp = Math.min(this.data.hp, Math.max(0, this.currentHp + hp));
    this.data.d += d;
    this.data.e += e;

    if (d > 0) changed.d = d;
    if (e > 0) changed.e = e;

    this.update(changed);

    if (this.currentHp <= 0) {
      this.game?.onDeath(this);
    }
  }

  startTurn() {
    this.data.d = 0;

    this.update()
  }

  endTurn() {
    this.data.e = Math.max(0, this.data.e - 1);
    this.data.f = Math.max(0, this.data.f - 1);
    this.data.w = Math.max(0, this.data.w - 1);

    this.update()
  }

  do(type: CARD_TYPE) {
    let animationName = '';

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
