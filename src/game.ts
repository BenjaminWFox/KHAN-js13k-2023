import { IDeck, GameData, GameElements, IGame, CardData } from "./types";
import { levels } from "./levels";
import { Entity } from "./entity";
import { enemies } from "./enemies";
import { player } from "./player";
import { ce, gei } from "./utility";
import { Card } from "./card";
import { SPRITE_TYPE } from "./enums";

const data = {
  selectedCard: ce(),
  targetedEntities: [] as Array<HTMLDivElement>,
}

function getValidTargets(entities: Array<Entity>, card: Card) {
  console.log(card)
  if (card.data.a || card.data.f || card.data.w) {
    return entities.filter(entity => entity.data.type === SPRITE_TYPE.enemy)
  }

  return [entities.find(entity => entity.data.type === SPRITE_TYPE.player)];
}

export class Game implements IGame {
  e: GameElements
  level: number;
  turn: number;
  deck: IDeck;
  entities: Array<Entity>;
  player: Entity;

  constructor(e: GameElements, gameData: GameData) {
    this.e = e;
    this.level = 1;
    this.turn = 1;
    this.deck = gameData.deck;
    this.entities = [];
    this.player = new Entity(player);
  }

  new() {
    this.e.title.classList.add('hide');
    this.e.game.classList.remove('hide');

    levels[this.level].enemies().forEach((enemy => {
      this.entities.push(new Entity(enemies[enemy]))
    }))

    this.entities.push(this.player);

    this.deck.shuffle();

    console.log('Game has deck', this.deck);

    this.deck.draw(4);

    this.deck.register(this);
  }

  render() {
    this.entities.forEach(entity => {
      entity.render();
      entity.pickAction();
    })

    gei('stamina')!.innerHTML = `Stamina: ${this.player.data.stamina}`;
  }

  combat(card: Card, el: HTMLDivElement) {
    data.selectedCard.classList.remove('selected');
    data.targetedEntities.forEach(el => {
      el.classList.remove('targeted');
    })
    data.targetedEntities = [];

    if (data.selectedCard !== el) {
      data.selectedCard = el;
      el.classList.add('selected');

      console.log('Card id', card.id, 'clicked.')
    } else {
      data.selectedCard = ce()

      return;
    }

    const targets = getValidTargets(this.entities, card);

    targets.forEach(entity => {
      const el = entity!.sprite.querySelector('.targeting')! as HTMLDivElement;
      data.targetedEntities.push(el)
      el.classList.add('targeted');
    })
  }
}
