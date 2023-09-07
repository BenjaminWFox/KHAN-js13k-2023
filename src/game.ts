import { IDeck, GameData, GameElements, IGame, IVisualCard, CardData, Cards } from "./types";
import { levels } from "./levels";
import { Entity } from "./entity";
import { Player } from "./player";
import { gei, uuid } from "./utility";
import { ACTIVATION_TRIGGER, GAME_STATE, SPRITE_TYPE } from "./enums";
import { Deck } from "./deck";
import { flashCardCost } from "./dom";
import { Enemy } from "./enemy";
import { messages, showMessage } from "./messaging";
import data from "./data";

interface Data {
  selectedCard: IVisualCard | undefined,
  targetedEntities: Array<HTMLDivElement>,
}

const globalGameData: Data = {
  selectedCard: undefined,
  targetedEntities: [],
}

function clearSelectedCard(card?: IVisualCard) {
  globalGameData.selectedCard = undefined;
  card?.sprite.classList.remove('selected');
}

function clearTargeted(targets: Array<HTMLDivElement>) {
  targets.forEach(el => {
    el.classList.remove('targeted');
  })
}

function getValidTargets(entities: Array<Entity>, card: IVisualCard) {
  if (card.data.a || card.data.aa || card.data.w) {
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
    const e = new Enemy(data.enemyData[enemy], c)
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
    this.level = data.startLevel;
    this.turn = data.startTurn;
    this.enemies = [];
    this.player = new Player(data.playerData, this);
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

  endGame(isWin = true) {
    setTimeout(() => {
      showMessage(isWin ? messages.final : messages.fail, () => {

        showMessage(messages.thanks, () => {
          window.location.reload();
        })

      }, true)
    }, 1000)
  }

  newCardPicked() {
    this.deck.clearHand();
    this.player.applyInnate(this.deck.innatePile, ACTIVATION_TRIGGER.buff);

    setTimeout(() => {
      this.newRound();
    }, 500)
  }

  newRound() {
    this.level += 1;
    this.turn = 0;
    getEnemiesForLevel(this);
    this.player.applyInnate(this.deck.innatePile, ACTIVATION_TRIGGER.round);

    setTimeout(() => {
      this.player.startRound();
      this.deck.shuffle();
      this.render();
      this.newTurn()
    }, 500)
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

    this.deck.startDraw(data.defaultDraw);
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

  onPlayerBuffsApplied(cards: Cards) {
    this.deck.removeInnateBuffs(cards);
  }

  /**
   * Called when a card is clicked in the hand during players turn. Card may have been
   * either Selected or De-selected. Targets are selected based on card data.
   * 
   * @param card 
   * @returns 
   */
  onPlayerSelectCard(card: IVisualCard) {
    /**
     * Clear selected & targets every time
     */
    clearTargeted(globalGameData.targetedEntities);

    globalGameData.targetedEntities = [];

    if (this.player.currentStamina < card.data.c!) {
      flashCardCost(card);

      this.alert('Not enough stamina!')

      return;
    }

    /**
     * Has a different card been selected?
     * 
     * If not, deselect current card.
     */
    if (globalGameData.selectedCard?.id !== card.id) {
      clearSelectedCard(globalGameData.selectedCard);
      globalGameData.selectedCard = card;
      card.sprite.classList.add('selected');
    } else {
      clearSelectedCard(globalGameData.selectedCard);

      return;
    }

    // Only calculate & apply targets after ensuring it is not a deselection
    const targets = getValidTargets([...this.enemies, this.player], card);

    targets.forEach(entity => {
      const el = entity!.sprite.querySelector('.targeting')! as HTMLDivElement;

      globalGameData.targetedEntities.push(el)

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
    if (globalGameData.selectedCard) {
      const target = getValidTargets([...this.enemies, this.player], globalGameData.selectedCard).find(item => item?.id === id)

      if (!target || this.player.currentStamina < globalGameData.selectedCard?.data?.c!) {
        return;
      }
      const cardToRemove = globalGameData.selectedCard;

      clearSelectedCard(globalGameData.selectedCard);
      clearTargeted(globalGameData.targetedEntities);

      this.player.play(cardToRemove);
      this.player.do(cardToRemove.type);

      // target may equal player, but that doesn't matter for this currently
      // since the enemy/friendly applications are different.
      // Main process for PLAYER attacking ENEMY and/or PLAYER buffing SELF:
      const dynamicData = cardToRemove.dData(this.player.data)

      console.log('* Player Action *')

      if (target && target !== this.player) {
        target.applyFromEnemy(dynamicData);
      }
      this.player.applyFromFriendly(dynamicData);

      this.deck.updateVisibleCards(this.player.data);
      this.update();

      // Remove this after playing, or just-played cards may be reshuffled into the draw pile
      this.deck.removeFromHand(cardToRemove);

      if (!this.enemies.length) {
        if (this.level === Object.keys(levels).length) {
          this.setState(GAME_STATE.GAME_OVER)
          console.log('* Game Won');
          this.endGame();
        } else {
          console.log('* Roud Won');
          this.endRound();
        }
      }
    }
  }

  applyToAllEnemies(cardData: CardData) {
    /**
     * Must make copy of array, otherwise if an enemy dies other enemies will be skipped
     */
    [...this.enemies].forEach(enemy => {
      enemy.applyFromEnemy(cardData);
    })
  }

  endPlayerTurn() {
    if (this.state === GAME_STATE.PLAYER_TURN) {

      this.setState(GAME_STATE.ENEMY_TURN);

      this.player.endTurn();
      clearSelectedCard(globalGameData.selectedCard);
      clearTargeted(globalGameData.targetedEntities);

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
        const dynamicData = enemy.nextAction.dData(enemy.data)

        console.log('* Enemy Action *', enemy.id, enemy.data.name);

        this.player.applyFromEnemy(dynamicData)
        enemy.applyFromFriendly(dynamicData)

        enemy.do(enemy.nextAction!.type);

        setTimeout(() => enemyTurn(), 1000)
      } else {
        this.startNextTurn()
      }
    }

    enemyTurn();
  }

  startNextTurn() {
    if (this.state !== GAME_STATE.GAME_OVER) {
      this.enemies.forEach(enemy => {
        enemy.endTurn();
      })

      this.turn += 1;
      this.newTurn();
    }
  }

  onDeath(entity: Entity) {
    entity.sprite.style.animationName = 'dead'

    setTimeout(() => {
      entity.sprite.parentNode?.removeChild(entity.sprite);
    }, 750);

    if (entity.isPlayer) {
      // game over
      console.log('* Game Lost');
      this.setState(GAME_STATE.GAME_OVER)
      this.endGame(false);

      return;
    }

    this.enemies.splice(this.enemies.indexOf(entity as Enemy), 1);

  }
}
