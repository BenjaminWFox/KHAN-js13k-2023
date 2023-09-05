export enum DeckCollections {
  HAND = 'HAND',
  DRAW = 'DRAW',
  DONE = 'DONE',
  INNATE = 'INNATE',
}

export enum SPRITE_TYPE {
  player = 'player',
  enemy = 'enemy',
  mount = 'mount',
}

export enum CARD_TYPE {
  assault = 'assault',
  ability = 'ability',
  defense = 'defense',
  innate = 'innate',
}

export enum ACTIVATION_TRIGGER {
  round = 'round',
  turn = 'turn'
}

export enum GAME_STATE {
  PLAYER_TURN = 'player_turn',
  ENEMY_TURN = 'enemy_turn',
  PICKING_CARD = 'picking_card',
  GAME_OVER = 'game_over',
}
