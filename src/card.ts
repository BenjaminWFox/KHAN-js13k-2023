import { GameElement } from "./GameElement";
import { ACTIVATION_TRIGGER, CARD_TYPE, DeckCollections } from "./enums";
import { cardElementBuilder } from "./renderer";
import { CardConstructorData, CardData, EntityData, ICard, IVisualCard } from "./types";
import { getAttackForData, getDefenceForData, uuid } from "./utility";

export class Card extends GameElement implements ICard {
  name: string;
  type: CARD_TYPE;
  data: CardData;
  id: string;
  attributes: Array<string>;

  constructor(constructorData: CardConstructorData) {
    super();

    const [name, type, data] = constructorData;

    this.id = uuid();
    this.name = name;
    this.type = type;
    this.data = { ...data };
    this.attributes = []
  };

  dData(modData?: EntityData | CardData) {
    return {
      ...this.data,
      a: getAttackForData(this.data.a || 0, modData),
      d: getDefenceForData(this.data.d || 0, modData),
    };
  }
};

export class VisualCard extends Card implements IVisualCard {
  sprite: HTMLDivElement;
  listener: (e: MouseEvent) => void;

  constructor(constructorData: CardConstructorData, isCardAdd = false) {
    super(constructorData);

    this.buildVisualAttributes(this.data);

    this.sprite = cardElementBuilder(this);

    this.listener = isCardAdd ? this.deckAddSelect.bind(this) : this.combatSelect.bind(this)

    if (isCardAdd) {
      this.sprite.addEventListener(
        'click',
        this.listener
      );
    } else {
      this.sprite.addEventListener(
        'click',
        this.listener
      );
    }
  };

  deckAddSelect(event: MouseEvent) {
    event.stopPropagation();

    this.sprite.removeEventListener('click', this.listener)
    this.listener = this.combatSelect.bind(this)
    this.sprite.addEventListener('click', this.listener)

    console.log('Adding...')

    this.type === CARD_TYPE.innate ?
      this.game?.deck.add(this, DeckCollections.INNATE)
      : this.game?.deck.add(this);
  }

  combatSelect(event: MouseEvent) {
    event.stopPropagation();

    this.game?.combat(this)
  }

  buildVisualAttributes(data: CardData, modData?: EntityData) {
    this.attributes = [];
    if (data.a) this.attributes.push(`ATTACK ENEMY: ${getAttackForData(data.a, modData)}`)
    if (data.d) this.attributes.push(`DEFEND SELF: ${getDefenceForData(data.d, modData)}`)
    if (data.e) this.attributes.push(`ENRAGE SELF: ${data.e}`)
    if (data.w) this.attributes.push(`WEAKEN ENEMY: ${data.w}`)
    if (data.f) this.attributes.push(`FALTER ENEMY: ${data.f}`)
    if (data.s) {
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Gain ${data.s} extra stamina every TURN.`)
        : this.attributes.push(`STAMINA: +${data.s}`)
    }
    if (data.draw) {
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Draw ${data.draw} extra card${data.draw > 1 ? 's' : ''} every TURN.`)
        : this.attributes.push(`DRAW CARDS: ${data.draw}`)
    }
    if (data.hp && data.hp < 0) this.attributes.push(`Lose ${Math.abs(data.hp)} life`)
    if (data.hp && data.hp > 0) {
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Gain ${data.hp} life at the start of each ROUND.`)
        : this.attributes.push(`Gain ${data.hp} life`)
    }
  }

  update(modData: EntityData) {
    this.buildVisualAttributes(this.data, modData);

    const newSprite = cardElementBuilder(this);

    // @ts-ignore
    this.sprite.replaceChildren(...newSprite.childNodes);
  }
}

export const basicCards: Array<CardConstructorData> = [
  ['Basic Attack', CARD_TYPE.assault, { a: 5, c: 1, flavor: 'You spend your life perfecting something, is it really basic?' }],
  ['Basic Shield', CARD_TYPE.defense, { d: 5, c: 1, flavor: 'Discretion is the better part of valor, after all.' }],
  ['War Cry', CARD_TYPE.ability, { c: 2, w: 2, e: 2 }],
  ['Rally Cry', CARD_TYPE.ability, { c: 2, f: 2, d: 2 }],
];

export const cards: Array<CardConstructorData> = [
  ['Recharge', CARD_TYPE.assault, { c: 0, s: 2, flavor: '' }],
  ['Push Through', CARD_TYPE.assault, { c: 1, draw: 2, flavor: '' }],
  ['Clairvoyance', CARD_TYPE.assault, { c: 0, draw: 1, flavor: '' }],
  ['Healing Ritual', CARD_TYPE.assault, { c: 2, hp: 15, flavor: 'He will win who knows when to fight and when not to fight.' }],
  ['Wrath Of Khan', CARD_TYPE.assault, { c: 1, a: 5, e: 2, hp: -2, flavor: 'The Khan was merciless in pursuit of his enemies.' }],
  ['Reeckless Assault', CARD_TYPE.assault, { c: 2, a: 20, hp: -10, flavor: 'Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.' }],
  ['Shock and Awe', CARD_TYPE.ability, { c: 2, w: 3, f: 3, flavor: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.' }],
  ['Combat Medics', CARD_TYPE.ability, { c: 0, flavor: '??' }],
  ['Field Hospital', CARD_TYPE.ability, { c: 0, flavor: '??' }],
];

export const innateCards: Array<CardConstructorData> = [
  ['Strategic Planning', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.turn, c: 0, draw: 1, flavor: 'Water shapes its course according to the nature of the ground over which it flows; the soldier works out his victory in relation to the foe whom he is facing.' }],
  ['Calisthenics', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.turn, c: 0, s: 1, flavor: 'To not prepare is the greatest of crimes; to be prepared beforehand for any contingency is the greatest of virtues.' }],
  ['Shamanism', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.round, c: 0, hp: 10, flavor: '' }],
  ['Fearsome Reputation', CARD_TYPE.ability, { c: 0, w: 1, f: 1, flavor: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.' }]
]
