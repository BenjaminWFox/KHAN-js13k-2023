import { Deck } from "./deck";

const ce = (str?: string) => str ? document.createElement(str) : document.createElement('i');

const BOARD_SCALE = 1;

const e: Record<string, HTMLElement> = {
  board: ce(),
  title: ce(),
  game: ce(),
  new: ce(),
  continue: ce()
}

const deck = new Deck();

console.log('deck', deck);

function resize() {
  let scale = BOARD_SCALE;

  e.board.style.transform = `scale(${scale})`

  while (
    e.board?.getBoundingClientRect().width > window.innerWidth ||
    e.board.getBoundingClientRect().height > window.innerHeight) {
    scale -= .05;
    e.board.style.transform = `scale(${scale})`
  }
}

function newGame() {
  e.title.classList.add('hide');
  e.game.classList.remove('hide')
}

window.addEventListener('resize', () => {
  resize();
})

window.addEventListener('load', () => {
  // Required to prevent awkward zoom-in if double-tapping on mobile
  document.ondblclick = function (e) {
    e.preventDefault();
  }

  Object.keys(e).forEach(key => {
    e[key] = document.getElementById(key)!;
  })

  e.new.addEventListener('click', newGame)
  e.continue.addEventListener('click', () => { })

  console.log('Check 1 2')

  resize();
})
