import { Deck } from "./deck";
import { cards } from "./card";
import { ce, gei, resize } from "./utility";
import { spriteElementBuilder, cardElementBuilder } from "./renderer";
import { GameElements } from "./types";
import { Game } from "./game";
import { SPRITE_TYPE } from "./enums";

const e: GameElements = {
  board: ce(),
  title: ce(),
  game: ce(),
  new: ce(),
  continue: ce(),
  endturn: ce()
}
const deck = new Deck();
const game = new Game(e, {
  deck,
})

window.addEventListener('resize', () => {
  resize(e);
})

window.addEventListener('load', () => {
  // Required to prevent awkward zoom-in if double-tapping on mobile
  document.ondblclick = function (e) {
    e.preventDefault();
  }

  Object.keys(e).forEach(key => {
    e[key] = document.getElementById(key)!;
  })

  e.new.addEventListener('click', game.new)
  e.continue.addEventListener('click', () => { })

  resize(e);
  game.new();
  game.render();

  // gei('enemies')?.appendChild(
  //   spriteElementFactory('king', 100, SPRITE_TYPE.enemy, true)
  // );
  // gei('players')?.appendChild(
  //   spriteElementFactory('khan', 100, SPRITE_TYPE.player, true)
  // );
  // gei('card-holder')?.appendChild(
  //   cardElementFactory(cards[0])
  // )
})
