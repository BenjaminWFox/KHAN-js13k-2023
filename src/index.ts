import { Deck } from "./deck";
import { ce, resize } from "./utility";
import { GameElements } from "./types";
import { Game } from "./game";

const e: GameElements = {
  board: ce(),
  title: ce(),
  game: ce(),
  new: ce(),
  continue: ce(),
  endturn: ce()
}

window.addEventListener('resize', () => {
  resize(e);
})

window.addEventListener('load', () => {
  const game = new Game(e)

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
