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

    this.listener = isCardAdd ? this.deckAddSelect.bind(this) : this.cardSelect.bind(this)

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
    this.listener = this.cardSelect.bind(this)
    this.sprite.addEventListener('click', this.listener)

    console.log('Adding...')

    this.type === CARD_TYPE.innate ?
      this.game?.deck.add(this, DeckCollections.INNATE)
      : this.game?.deck.add(this);
  }

  cardSelect(event: MouseEvent) {
    event.stopPropagation();

    this.game?.onPlayerSelectCard(this)
  }

  buildVisualAttributes(data: CardData, modData?: EntityData) {
    this.attributes = [];
    if (data.a) this.attributes.push(`ATTACK ENEMY: ${getAttackForData(data.a, modData)}`)
    if (data.d) this.attributes.push(`DEFEND SELF: ${getDefenceForData(data.d, modData)}`)
    if (data.e) this.attributes.push(`ENRAGE SELF: ${data.e}`)
    if (data.w)
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Enemies start +${data.w} weak/ROUND`)
        : this.attributes.push(`WEAKEN ENEMY: ${data.w}`)
    if (data.f)
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Enemies start +${data.f} falter/ROUND`)
        : this.attributes.push(`FALTER ENEMY: ${data.f}`)
    if (data.s) {
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Gain +${data.s} stamina per TURN`)
        : this.attributes.push(`STAMINA: +${data.s}`)
    }
    if (data.draw) {
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Draw ${data.draw} extra card${data.draw > 1 ? 's' : ''} per TURN`)
        : this.attributes.push(`DRAW CARDS: ${data.draw}`)
    }
    if (data.hp && data.hp < 0) this.attributes.push(`Lose ${Math.abs(data.hp)} life`)
    if (data.hp && data.hp > 0) {
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Gain ${data.hp} life at the start of each ROUND`)
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
  ['War Cry', CARD_TYPE.ability, { c: 2, w: 3, e: 2, flavor: 'Enemies could scarcely move to defend themselves on hearing the screams of the Khan\'s riders.' }],
  ['Rally Cry', CARD_TYPE.ability, { c: 2, f: 3, d: 5, flavor: 'Such were the regrouping tactics that enemies could find nowhere to strike.' }],
];

export const cards: Array<CardConstructorData> = [
  ['Recharge', CARD_TYPE.assault, { c: 0, s: 2, flavor: '??' }],
  ['Push Through', CARD_TYPE.assault, { c: 1, draw: 2, flavor: '??' }],
  ['Clairvoyance', CARD_TYPE.assault, { c: 0, draw: 1, flavor: '??' }],
  ['Wrath Of Khan', CARD_TYPE.assault, { c: 1, a: 5, e: 2, hp: -2, flavor: 'The Khan was merciless in pursuit of his enemies.' }],
  ['Reeckless Assault', CARD_TYPE.assault, { c: 2, a: 20, hp: -10, flavor: 'Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.' }],
  ['Shock and Awe', CARD_TYPE.ability, { c: 2, w: 3, f: 3, flavor: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.' }],
  ['Combat Medics', CARD_TYPE.ability, { c: 1, d: 5, hp: 5, flavor: '??' }],
  ['Field Hospital', CARD_TYPE.ability, { c: 2, hp: 15, flavor: 'He will win who knows when to fight and when not to fight.' }],
];

export const innateCards: Array<CardConstructorData> = [
  // ['Strategic Planning', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.turn, c: 0, draw: 1, flavor: 'Water shapes its course according to the ground as the soldier works out victory in relation to his foe.' }],
  // ['Calisthenics', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.turn, c: 0, s: 1, flavor: 'To not prepare is the greatest of crimes; to be prepared beforehand for any contingency is the greatest of virtues.' }],
  // ['Shamanism', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.round, c: 0, hp: 10, flavor: '??' }],
  ['Fearsome Reputation', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.round, c: 0, w: 2, f: 2, flavor: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.' }]
]
