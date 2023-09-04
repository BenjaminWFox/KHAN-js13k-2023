import { GameElement } from "./GameElement";
import { CARD_TYPE } from "./enums";
import { cardElementBuilder } from "./renderer";
import { CardData, EntityData, ICard } from "./types";
import { ce, getAttackForData, getDefenceForData, qs, qsa, uuid } from "./utility";

type ConstructorData = [string, CARD_TYPE, CardData];

export class Card extends GameElement implements ICard {
  name: string;
  type: CARD_TYPE;
  data: CardData;
  id: string;
  attributes: Array<string>;
  sprite: HTMLDivElement;

  constructor(constructorData: ConstructorData) {
    super();

    const [name, type, data] = constructorData;

    this.id = uuid();
    this.name = name;
    this.type = type;
    this.data = data;
    this.attributes = []

    if (this.name) {
      this.buildAttributes(this.data);

      this.sprite = cardElementBuilder(this);

      this.sprite.addEventListener(
        'click',
        (event: MouseEvent) => {
          event.stopPropagation();

          this.game?.combat(this)
        }
      );
    } else {
      this.sprite = ce();
    }
  };

  buildAttributes(data: CardData, modData?: EntityData) {
    this.attributes = [];
    if (data.a) this.attributes.push(`ATTACK ENEMY: ${getAttackForData(modData, data.a)}`)
    if (data.d) this.attributes.push(`DEFEND SELF: ${getDefenceForData(modData, data.d)}`)
    if (data.e) this.attributes.push(`ENRAGE SELF: ${data.e}`)
    if (data.w) this.attributes.push(`WEAKEN ENEMY: ${data.w}`)
    if (data.f) this.attributes.push(`FALTER ENEMY: ${data.f}`)
    if (data.hp && data.hp < 0) this.attributes.push(`Lose ${Math.abs(data.hp)} life`)
    if (data.hp && data.hp > 0) this.attributes.push(`Gain ${data.hp} life`)
  }

  update(modData: EntityData) {
    this.buildAttributes(this.data, modData);

    const newSprite = cardElementBuilder(this);

    console.log('Old/NewSprite', this.sprite, newSprite, qsa(newSprite, '*'))

    // @ts-ignore
    this.sprite.replaceChildren(...newSprite.childNodes);
  }
};

export const cards: Array<ConstructorData> = [
  ['Basic Attack', CARD_TYPE.assault, { a: 5, c: 1, flavor: 'You spend your life perfecting something, is it really basic?' }],
  ['Basic Shield', CARD_TYPE.defense, { d: 5, c: 1, flavor: 'Discretion is the better part of valor, after all.' }],
  ['War Cry', CARD_TYPE.ability, { c: 2, w: 2, e: 2 }],
  ['Rally Cry', CARD_TYPE.ability, { c: 2, f: 2, d: 2 }],
  ['Wrath Of Khan', CARD_TYPE.assault, { c: 1, a: 5, e: 2, hp: -2, flavor: 'The Khan was merciless in pursuit of his enemies.' }]
];
