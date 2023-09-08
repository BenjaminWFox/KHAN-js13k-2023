import { deserializeFromLocalStore, gei, resize } from "./utility";
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

  const gameData = deserializeFromLocalStore();

  console.log('Game Data', gameData);

  const game = new Game(e)

  // Required to prevent awkward zoom-in if double-tapping on mobile
  document.ondblclick = function (e) {
    e.preventDefault();
  }

  e.new.addEventListener('click', () => {
    createP1();

    p1`50.25
    |C-------|--------|        |J-------|--------|        |F-------|--------|        |H-------|--------|        |A-------|--------|        |E-------|--------|        |F-------|--------|        |C-------|--------|     |`

    showMessage(messages.intro, game.newGame.bind(game))
  })
  e.endturn.addEventListener('click', () => game.endPlayerTurn())
  e.continue.addEventListener('click', () => { })

  window.addEventListener('resize', () => {
    resize(e);
  })

  resize(e);

  if (navigator.userAgent.match('CriOS')) {
    alert('Hello iOS Chrome User!\n\nYou may have to rotate your phone orientation back/forth once for correct display.\n\nEnjoy the game!')
  }

  // game.newGame();
})
