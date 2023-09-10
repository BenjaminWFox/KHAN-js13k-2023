import { deserializeFromLocalStore, gei, resize } from "./utility";
import { GameElements } from "./types";
import { Game } from "./game";
import { messages, showMessage } from "./messaging";
import { createP1 } from "./p1";

export const globals = {
  music: false,
  sfx: true,
  tutorial: false,
}

window.addEventListener('load', () => {
  const p1 = createP1();
  const e: GameElements = {
    board: gei('board')!,
    title: gei('title')!,
    game: gei('game')!,
    new: gei('new')!,
    continue: gei('continue')!,
    endturn: gei('endturn')!,
    music: gei('music')!,
    sfx: gei('sfx')!,
    tutorial: gei('tutorial')!,
    gotit: gei('gotit')!,
  }
  const gameData = deserializeFromLocalStore();

  console.log('Game Data', gameData);

  const game = new Game(e)

  // Required to prevent awkward zoom-in if double-tapping on mobile
  document.ondblclick = function (e) {
    e.preventDefault();
  }

  function play() {
    if (globals.music) return;

    globals.music = true;
    e.music.classList.remove('stopped')
    p1`50.25
    |C-------|--------|        |J-------|--------|        |F-------|--------|        |H-------|--------|        |A-------|--------|        |E-------|--------|        |F-------|--------|        |C-------|--------|     |`
  }
  function stop() {
    globals.music = false;
    e.music.classList.add('stopped')
    p1``;
  }
  function tutorial(show: boolean) {
    console.log('TUTORIAL', show)
    if (!show) {
      globals.tutorial = false
      gei('board')!.classList.remove('tutorial')
      gei('context')!.classList.add('hide')
      gei('context')!.classList.remove('show')
      gei('gotit')!.classList.add('hide')
    } else {
      globals.tutorial = true
      gei('board')!.classList.add('tutorial')
      gei('context')!.classList.remove('hide')
      gei('context')!.classList.add('show')
      gei('gotit')!.classList.remove('hide')
    }
  }

  e.tutorial.addEventListener('click', () => {
    tutorial(!globals.tutorial);
  })

  e.gotit.addEventListener('click', () => {
    tutorial(false);
  })

  e.new.addEventListener('click', () => {
    play();

    showMessage(messages.intro, () => {
      e.tutorial.classList.remove('hide');

      game.newGame.call(game)
    })
  })
  e.endturn.addEventListener('click', () => game.endPlayerTurn())

  e.music.addEventListener('click', () => {
    globals.music ? stop() : play();
  })

  e.sfx.addEventListener('click', () => {
    if (globals.sfx) {
      globals.sfx = false;
      e.sfx.classList.add('stopped');
    } else {
      globals.sfx = true;
      e.sfx.classList.remove('stopped');
    }
  })

  window.addEventListener('resize', () => {
    resize(e);
  })

  resize(e);

  if (navigator.userAgent.match('CriOS')) {
    alert('Hello iOS Chrome User!\n\nYou may have to rotate your phone orientation back/forth once for correct display.\n\nEnjoy the game!')
  }

  // game.newGame();
})
