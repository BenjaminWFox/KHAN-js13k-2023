import { GameElement } from "./GameElement";
import { ACTIVATION_TRIGGER, CARD_TYPE, DeckCollections, GAME_STATE } from "./enums";
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
      aa: getAttackForData(this.data.aa || 0, modData),
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
    if (this.game?.state === GAME_STATE.PICKING_CARD) {
      this.game?.setState(GAME_STATE.TRANSITION)

      this.sprite.removeEventListener('click', this.listener)
      this.listener = this.cardSelect.bind(this)
      this.sprite.addEventListener('click', this.listener)

      this.type === CARD_TYPE.innate ?
        this.game?.deck.add(this, DeckCollections.INNATE)
        : this.game?.deck.add(this);
    }
  }

  cardSelect(event: MouseEvent) {
    event.stopPropagation();

    this.game?.onPlayerSelectCard(this)
  }

  buildVisualAttributes(data: CardData, modData?: EntityData) {
    this.attributes = [];
    if (data.a) this.attributes.push(`ATTACK ENEMY: ${getAttackForData(data.a, modData)}`)
    if (data.aa) this.attributes.push(`ATTACK ALL: ${getAttackForData(data.aa, modData)}`)
    if (data.wa) this.attributes.push(`WEAKEN ALL: ${getAttackForData(data.wa, modData)}`)
    if (data.d)
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Start with +${data.d} defend/TURN`)
        : this.attributes.push(`DEFEND SELF: ${getDefenceForData(data.d, modData)}`)

    if (data.e) this.attributes.push(`ENRAGE SELF: ${data.e}`)
    if (data.w)
      this.type === CARD_TYPE.innate ?
        this.attributes.push(`Enemies start +${data.w} weak/ROUND`)
        : this.attributes.push(`WEAKEN ENEMY: ${data.w}`)
    // if (data.f)
    //   this.type === CARD_TYPE.innate ?
    //     this.attributes.push(`Enemies start +${data.f} falter/ROUND`)
    //     : this.attributes.push(`FALTER ENEMY: ${data.f}`)
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
    if (data.mhp) this.attributes.push(`Gain +${data.mhp} max life this ONCE`)
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
  ['Basic Attack', CARD_TYPE.assault, { a: 8, c: 1, flavor: 'You spend your life perfecting something, can it really be called basic?' }],
  ['Basic Shield', CARD_TYPE.defense, { d: 10, c: 1, flavor: 'Discretion is the better part of valor, after all.' }],
  ['War Cry', CARD_TYPE.ability, { c: 2, w: 2, e: 4, flavor: 'Enemies could scarcely move to defend themselves on hearing the screams of the Khans\' army.' }],
  ['Rally Cry', CARD_TYPE.defense, { c: 2, d: 18, e: 1, flavor: 'Such were The Khans regrouping tactics that enemies could find nowhere to strike.' }],
  ['Tactical Retreat', CARD_TYPE.defense, { c: 2, d: 14, draw: 1, flavor: 'Better to retreat, and entice the enemy into a trap or your making.' }],
  ['Surgical Strike', CARD_TYPE.assault, { c: 1, a: 12, draw: 1, flavor: 'Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.' }],
];

export const cards: Array<CardConstructorData> = [

  ['Recharge', CARD_TYPE.ability, { c: 0, s: 2, flavor: 'The Khan\'s army could rest on the move, allowing them to be where noone thought they could be.' }],

  ['Push Through', CARD_TYPE.ability, { c: 1, draw: 3, flavor: 'Any obstacle may be overcome with enough force.' }],
  ['Clairvoyance', CARD_TYPE.ability, { c: 0, draw: 2, flavor: 'The Khan had a preternatural ability to know what to do next.' }],

  ['Shield Wall', CARD_TYPE.defense, { c: 3, d: 30, e: 2, flavor: '' }],
  ['Reluctant Withdrawl', CARD_TYPE.defense, { c: 1, d: 12, e: 3, flavor: 'The Khan grew more determined with every forced step backwards.' }],

  ['Whirling Dervish', CARD_TYPE.assault, { c: 2, aa: 10, wa: 2, flavor: 'The Persians were a magnificent addition to the Khan\'s army.' }],
  ['Wrath Of Khan', CARD_TYPE.assault, { c: 3, aa: 15, e: 4, hp: -10, flavor: 'The Khan was merciless, sometimes reckless, in pursuit of his enemies.' }],
  ['Reckless Assault', CARD_TYPE.assault, { c: 2, a: 25, hp: -5, flavor: 'Let your plans be dark and impenetrable as night, and when you move, fall like a thunderbolt.' }],
  ['Overpower', CARD_TYPE.assault, { c: 2, a: 18, w: 2, flavor: 'Attack where the enemy is unprepared, appear where you are not expected.' }],
  ['Cavalry Charge', CARD_TYPE.assault, { c: 4, aa: 18, flavor: 'The Khan\'s cavalry were second to none thanks, in no small part, to the stirrup.' }],

  ['Shock and Awe', CARD_TYPE.ability, { c: 1, e: 3, wa: 3, flavor: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.' }],

  ['Combat Medics', CARD_TYPE.defense, { c: 1, d: 8, hp: 6, flavor: 'A little ginsing, some water, a BIG shield and you\'ll be back up in no time.' }],
  ['Field Hospital', CARD_TYPE.ability, { c: 2, hp: 12, flavor: 'He will win who knows when to fight and when not to fight.' }],

  // ['Meditation', CARD_TYPE.ability, { c: 2, ca: 1, flavor: '' }],
];

export const innateCards: Array<CardConstructorData> = [
  ['Strategic Planning', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.turn, c: 0, draw: 1, flavor: 'Water flows according to the ground as the soldier plots victory in relation to his foe.' }],
  ['Calisthenics', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.turn, c: 0, s: 1, flavor: 'To not prepare is the greatest of crimes; to be prepared for any contingency is the greatest of virtues.' }],
  ['Tenger Spirit', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.round, c: 0, hp: 10, flavor: 'The Khan was considered the embodiment of this highest deity.' }],
  ['Fearsome Reputation', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.round, c: 0, w: 5, flavor: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.' }],
  ['Scientific Advancement', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.buff, c: 0, mhp: 10, flavor: 'To fight harder, be stronger, and live longer one must do more than just cross swords.' }],
  ['Defensive Perimeter', CARD_TYPE.innate, { on: ACTIVATION_TRIGGER.turn, c: 0, d: 5, flavor: 'Supreme excellence consists of breaking the enemy\'s resistance without fighting.' }],
]
