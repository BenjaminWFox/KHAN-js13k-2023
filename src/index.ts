import { ce, resize } from "./utility";
import { GameElements } from "./types";
import { Game } from "./game";
import { messages, showMessage } from "./messaging";

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

  e.new.addEventListener('click', () => {
    showMessage(messages.intro, game.newGame.bind(game))
  })
  e.endturn.addEventListener('click', () => game.endPlayerTurn())
  e.continue.addEventListener('click', () => { })

  resize(e);

  // game.newGame();
})
