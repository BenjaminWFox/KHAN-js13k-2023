import {star} from './graphics'
import { initKeys, KEY_A, KEY_D, KEY_DOWN, KEY_LEFT, KEY_RIGHT, KEY_S, KEY_UP, KEY_W, keys, updateKeys } from './keys';
import { initMouse, mouse, updateMouse } from './mouse';
import { music } from './music';
import { zzfx, zzfxP } from './zzfx';

const WIDTH = 480;
const HEIGHT = 270;
const CENTER_X = WIDTH / 2;
const CENTER_Y = HEIGHT / 2;
const MILLIS_PER_SECOND = 1000;
const FRAMES_PER_SECOND = 30;
const MILLIS_PER_FRAME = MILLIS_PER_SECOND / FRAMES_PER_SECOND;
const ENTITY_TYPE_PLAYER = 0;
const ENTITY_TYPE_BULLET = 1;
const ENTITY_TYPE_SNAKE = 2;
const ENTITY_TYPE_SPIDER = 3;
const ENTITY_TYPE_GEM = 6;
const PLAYER_SPEED = 2;
const BULLET_SPEED = 4;
const SPIDER_SPEED = 1;

interface Entity {
  entityType: number;
  x: number;
  y: number;
  dx: number;
  dy: number;
  render: (ctx: CanvasRenderingContext2D) => void;
}

// const canvas = document.querySelector('#c') as HTMLCanvasElement;
// const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

class Entity {
  constructor() {
    this.y = 100;
    this.x = 100;
    this.dx = 0;
    this.dy = 0;

    this.render = function(ctx) {
      ctx.fillStyle = "#ff00ff";
      ctx.fillRect(this.x, this.y, 100, 100);
      
    }
  }
}

const player = new Entity();

let iter = 0

// function gameLoop(): void {
//   player.render(ctx);
// }

// window.setInterval(gameLoop, MILLIS_PER_FRAME);
