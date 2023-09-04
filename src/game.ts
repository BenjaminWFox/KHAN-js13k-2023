import { IDeck, GameData, GameElements, IGame, IVisualCard } from "./types";
import { levels } from "./levels";
import { Entity } from "./entity";
import { enemies } from "./enemies";
import { Player, playerData } from "./player";
import { gei } from "./utility";
import { SPRITE_TYPE } from "./enums";
import { Deck } from "./deck";
import { flashCardCost } from "./dom";
import { Enemy } from "./enemy";

interface Data {
  selectedCard: IVisualCard | undefined,
  targetedEntities: Array<HTMLDivElement>,
}

const data: Data = {
  selectedCard: undefined,
  targetedEntities: [],
}

function clearSelectedCard(card?: IVisualCard) {
  card?.sprite.classList.remove('selected');
}

function clearTargeted(targets: Array<HTMLDivElement>) {
  targets.forEach(el => {
    el.classList.remove('targeted');
  })
}

function getValidTargets(entities: Array<Entity>, card: IVisualCard) {
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
  enemies: Array<Enemy>;
  player: Player;

  constructor(e: GameElements, gameData?: GameData) {
    this.e = e;
    this.level = 1;
    this.turn = 1;
    this.deck = gameData?.deck || new Deck(this);
    if (gameData?.deck) this.deck.register(this);
    this.entities = [];
    this.enemies = [];
    this.player = new Player(playerData, this);
  }

  newGame() {
    this.e.title.classList.add('hide');
    this.e.game.classList.remove('hide');

    levels[this.level].enemies().forEach((enemy => {
      const e = new Enemy(enemies[enemy], this)
      this.enemies.push(e);
    }))

    this.entities = [...this.enemies, this.player];

    this.deck.shuffle();

    this.render();
    this.newTurn();
  }

  newTurn() {
    this.update();
    this.enemies.forEach(enemy => {
      enemy.pickAction();
    })

    this.deck.draw(8);
  }

  render() {
    this.entities.forEach(entity => {
      entity.render();
    })

    gei('stamina')!.innerHTML = `Stamina: ${this.player.currentStamina}`;
  }

  update() {
    gei('stamina')!.innerHTML = `Stamina: ${this.player.currentStamina}`;
  }

  combat(card: IVisualCard) {
    /**
     * Clear selected & targets every time
     */
    clearSelectedCard(data.selectedCard);
    clearTargeted(data.targetedEntities);

    data.targetedEntities = [];

    if (this.player.currentStamina < card.data.c!) {
      flashCardCost(card);

      console.error('Not enough stamina!');

      return;
    }

    /**
     * Has a different card been selected?
     * 
     * If not, deselect current card.
     */
    if (data.selectedCard?.id !== card.id) {
      data.selectedCard = card;
      card.sprite.classList.add('selected');
    } else {
      data.selectedCard = undefined

      return;
    }


    const targets = getValidTargets(this.entities, card);

    targets.forEach(entity => {
      const el = entity!.sprite.querySelector('.targeting')! as HTMLDivElement;

      data.targetedEntities.push(el)

      el.classList.add('targeted');
    })
  }

  /**
   * Called when an entity is selected during combat.
   * 
   * *should not* be called if player stamina is insufficient for played card
   * 
   * @param id id of selected entity
   */
  entitySelect(id: string) {
    if (data.selectedCard) {
      const target = getValidTargets(this.entities, data.selectedCard).find(item => item?.id === id)

      if (!target || this.player.currentStamina < data.selectedCard?.data?.c!) {
        return;
      }

      // target may equal player, but that doesn't matter for this currently
      // since the enemy/friendly applications are different.
      // Main process for PLAYER attacking ENEMY and/or PLAYER buffing SELF:
      target?.applyFromEnemy(
        data.selectedCard.dData(this.player.data)
      );
      this.player.applyFromFriendly(
        data.selectedCard.dData(this.player.data)
      );

      this.player.do(data.selectedCard.type);

      const cardToRemove = data.selectedCard;

      clearSelectedCard(data.selectedCard);
      clearTargeted(data.targetedEntities);

      this.player.play(cardToRemove);
      this.deck.removeFromHand(cardToRemove);
      this.deck.updateVisibleCards(this.player.data);
      this.update();
    }
  }

  endPlayerTurn() {
    this.player.endTurn()
    this.enemies.forEach(enemy => {
      enemy.startTurn();
    })

    this.deck.endTurn();

    setTimeout(() => this.runEnemyTurns(), 1000);
  }

  runEnemyTurns() {
    const enemiesToGo = [...this.enemies]

    const enemyTurn = () => {
      const enemy = enemiesToGo.pop();

      if (enemy) {
        // Main process for ENEMY attacking PLAYER and/or ENEMY buffing SELF:
        this.player.applyFromEnemy(enemy.nextAction.dData(enemy.data))
        enemy.applyFromFriendly(enemy.nextAction.dData(enemy.data))
        enemy.do(enemy.nextAction!.type);

        setTimeout(enemyTurn, 1000)
      } else {
        this.startNextTurn()
      }
    }

    enemyTurn();
  }

  startNextTurn() {
    this.enemies.forEach(enemy => {
      enemy.endTurn();
    })
    this.turn += 1;

    this.player.startTurn();
    this.newTurn();
  }
}
