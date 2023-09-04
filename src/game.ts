import { IDeck, GameData, GameElements, IGame, IVisualCard } from "./types";
import { levels } from "./levels";
import { Entity } from "./entity";
import { enemies } from "./enemies";
import { Player, playerData } from "./player";
import { gei, uuid } from "./utility";
import { ACTIVATION_TRIGGER, GAME_STATE, SPRITE_TYPE } from "./enums";
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

/**
 * Grabs `enemies` arry from passed instance to add enemies for level and
 * register IGame instance with enemy instance.
 * 
 * @param c 
 * @param level 
 */
function getEnemiesForLevel(c: IGame) {
  levels[c.level].enemies().forEach((enemy => {
    const e = new Enemy(enemies[enemy], c)
    c.enemies.push(e);
  }))
}

export class Game implements IGame {
  e: GameElements;
  level: number;
  turn: number;
  deck: IDeck;
  enemies: Array<Enemy>;
  player: Player;
  state: GAME_STATE;

  constructor(e: GameElements, gameData?: GameData) {
    this.deck = gameData?.deck || new Deck(this);
    if (gameData?.deck) this.deck.register(this);

    this.e = e;
    this.level = 1;
    this.turn = 0;
    this.enemies = [];
    this.player = new Player(playerData, this);
    this.state = GAME_STATE.PLAYER_TURN
  }

  setState(newState: GAME_STATE) {
    this.state = newState
  }

  alert(str: string) {
    const id = uuid();
    const el = gei('alert')!
    el.setAttribute('data-id', id)
    el.innerHTML = str;

    setTimeout(() => {
      if (gei('alert')!.getAttribute('data-id') === id) {
        gei('alert')!.innerHTML = ''
      }
    }, 4000);
  }

  newGame() {
    this.e.title.classList.add('hide');
    this.e.game.classList.remove('hide');

    getEnemiesForLevel(this);

    this.deck.shuffle();
    this.render();
    this.newTurn();
  }

  // Waiting on deck.pickNewCards...
  endRound() {
    // Wait for this
    this.deck.endRound();

    setTimeout(() => {
      this.setState(GAME_STATE.PICKING_CARD)
      this.deck.pickNewCards();
      gei('stamina')!.innerHTML = "Pick a card to add to your deck OR an innate ability!"
    }, 1000)
  }

  newCardPicked() {
    this.deck.clearHand();

    setTimeout(() => {
      this.newRound();
    }, 500)
  }

  newRound() {
    this.level += 1;
    this.turn = 0;
    this.setState(GAME_STATE.PLAYER_TURN);

    this.player.applyInnate(this.deck.innatePile, ACTIVATION_TRIGGER.round);

    setTimeout(() => {
      getEnemiesForLevel(this);
      this.player.startRound();
      this.deck.shuffle();
      this.render();
      this.newTurn()
    }, 1000)
  }

  newTurn() {
    this.turn += 1;

    this.setState(GAME_STATE.PLAYER_TURN)
    this.player.startTurn();
    this.player.applyInnate(this.deck.innatePile, ACTIVATION_TRIGGER.turn);

    this.update();

    this.enemies.forEach(enemy => {
      enemy.pickAction();
    })

    this.deck.draw(4);
  }

  render() {
    this.enemies.forEach(entity => {
      entity.render();
    })
    this.player.render();

    gei('stamina')!.innerHTML = `Stamina: ${this.player.currentStamina}`;
    gei('stage')!.innerHTML = `Stage ${this.level} / ${Object.keys(levels).length}`
    gei('round')!.innerHTML = `Round ${this.turn}`
  }

  update() {
    gei('stamina')!.innerHTML = `Stamina: ${this.player.currentStamina}`;
    gei('round')!.innerHTML = `Round ${this.turn}`
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
      this.alert('Not enough stamina!')

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

    const targets = getValidTargets([...this.enemies, this.player], card);

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
      const target = getValidTargets([...this.enemies, this.player], data.selectedCard).find(item => item?.id === id)

      if (!target || this.player.currentStamina < data.selectedCard?.data?.c!) {
        return;
      }
      const cardToRemove = data.selectedCard;

      clearSelectedCard(data.selectedCard);
      clearTargeted(data.targetedEntities);

      this.player.play(cardToRemove);
      this.deck.removeFromHand(cardToRemove);
      this.deck.updateVisibleCards(this.player.data);

      this.player.do(data.selectedCard.type);

      // target may equal player, but that doesn't matter for this currently
      // since the enemy/friendly applications are different.
      // Main process for PLAYER attacking ENEMY and/or PLAYER buffing SELF:
      target?.applyFromEnemy(
        data.selectedCard.dData(this.player.data)
      );
      this.player.applyFromFriendly(
        data.selectedCard.dData(this.player.data)
      );

      this.update();
    }
  }

  endPlayerTurn() {
    if (this.state === GAME_STATE.PLAYER_TURN) {
      this.setState(GAME_STATE.ENEMY_TURN);
      this.player.endTurn();
      clearSelectedCard(data.selectedCard);
      clearTargeted(data.targetedEntities);

      this.enemies.forEach(enemy => {
        enemy.startTurn();
      })

      this.deck.endTurn();

      setTimeout(() => this.runEnemyTurns(), 1000);
    }
  }

  runEnemyTurns() {
    const enemiesToGo = [...this.enemies]

    const enemyTurn = () => {
      const enemy = enemiesToGo.pop();


      if (enemy) {
        // Main process for ENEMY attacking PLAYER and/or ENEMY buffing SELF:'
        const dd = enemy.nextAction.dData(enemy.data)

        this.player.applyFromEnemy(dd)

        const dd2 = enemy.nextAction.dData(enemy.data)

        enemy.applyFromFriendly(dd2)

        enemy.do(enemy.nextAction!.type);

        setTimeout(() => enemyTurn(), 1000)
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
    this.newTurn();
  }

  onDeath(entity: Entity) {
    entity.sprite.style.animationName = 'dead'

    setTimeout(() => {
      entity.sprite.parentNode?.removeChild(entity.sprite);
    }, 750);

    if (entity.isPlayer) {
      // game over
      console.log('GAME OVER :( :(');

      return;
    }

    this.enemies.splice(this.enemies.indexOf(entity as Enemy), 1);

    if (!this.enemies.length) {
      console.log('ROUND WON!!');
      this.endRound();
    }
  }
}
