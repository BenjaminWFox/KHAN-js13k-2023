import { gei, resize } from "./utility";
import { GameElements } from "./types";
import { Game } from "./game";
import { messages, showMessage } from "./messaging";

window.addEventListener('load', () => {
  const e: GameElements = {
    board: gei('board')!,
    title: gei('title')!,
    game: gei('game')!,
    new: gei('new')!,
    continue: gei('continue')!,
    endturn: gei('endturn')!
  }

  const game = new Game(e)

  // Required to prevent awkward zoom-in if double-tapping on mobile
  document.ondblclick = function (e) {
    e.preventDefault();
  }

  e.new.addEventListener('click', () => {
    showMessage(messages.intro, game.newGame.bind(game))
  })
  e.endturn.addEventListener('click', () => game.endPlayerTurn())
  e.continue.addEventListener('click', () => { })

  window.addEventListener('resize', () => {
    resize(e);
  })

  resize(e);

  // game.newGame();
})
