import { GameElement } from "./GameElement";
import { cardElementBuilder } from "./renderer";
import { CardData, ICard } from "./types";
import { uuid } from "./utility";

export enum CARD_TYPE {
  assault = 'assault',
  ability = 'ability',
  defense = 'defense',
}

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

    console.log({ name, type, data })

    this.id = uuid();
    this.name = name;
    this.type = type;
    this.data = data;
    this.attributes = []
    if (data.a) this.attributes.push(`ATTACK ENEMY: ${data.a}`)
    if (data.d) this.attributes.push(`DEFEND SELF: ${data.d}`)
    if (data.e) this.attributes.push(`ENRAGE SELF: ${data.e}`)
    if (data.w) this.attributes.push(`WEAKEN ENEMY: ${data.w}`)
    if (data.f) this.attributes.push(`FALTER ENEMY: ${data.f}`)
    if (data.hp && data.hp < 0) this.attributes.push(`Lose ${Math.abs(data.hp)} life`)
    if (data.hp && data.hp > 0) this.attributes.push(`Gain ${data.hp} life`)

    this.sprite = cardElementBuilder(this);
    this.sprite.addEventListener(
      'click',
      (event: MouseEvent) => {
        event.stopPropagation();

        this.game?.combat(this)
      }
    );
  };
};

export const cards: Array<ConstructorData> = [
  ['Basic Attack', CARD_TYPE.assault, { a: 5, c: 1, flavor: 'You spend your life perfecting something, is it really basic?' }],
  ['Basic Shield', CARD_TYPE.defense, { d: 5, c: 1, flavor: 'Discretion is the better part of valor, after all.' }],
  ['War Cry', CARD_TYPE.ability, { c: 5, w: 2, e: 2 }],
  ['Rally Cry', CARD_TYPE.ability, { c: 5, f: 2, d: 2 }],
  ['Wrath Of Khan', CARD_TYPE.assault, { c: 1, a: 5, e: 2, hp: -2, flavor: 'The Khan was merciless in pursuit of his enemies.' }]
];
