import { SPRITE_TYPE } from "./enums";
import { EntityData } from "./types";

export const playerData: EntityData = {
  name: 'khan',
  type: SPRITE_TYPE.player,
  hp: 100,
  d: 0,
  w: 0,
  f: 0,
  e: 0,
  mounted: true,
  stamina: 4
}
