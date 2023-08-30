import { Deck } from "./deck";
import { cards } from "./card";
import { ce, gei } from "./utility";
import { SPRITE_TYPE, spriteElementFactory, cardElementFactory } from "./renderer";
const BOARD_SCALE = 1;

const e: Record<string, HTMLElement> = {
  board: ce(),
  title: ce(),
  game: ce(),
  new: ce(),
  continue: ce()
}
// spriteElementFactory('king', 100, SPRITE_TYPE.enemy, false);
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

  gei('enemies')?.appendChild(
    spriteElementFactory('king', 100, SPRITE_TYPE.enemy, true)
  );
  gei('enemies')?.appendChild(
    spriteElementFactory('dervish', 100, SPRITE_TYPE.enemy, true)
  );
  gei('enemies')?.appendChild(
    spriteElementFactory('rok', 100, SPRITE_TYPE.enemy, false)
  );
  gei('enemies')?.appendChild(
    spriteElementFactory('bear2', 100, SPRITE_TYPE.enemy, false)
  );
  gei('players')?.appendChild(
    spriteElementFactory('khan', 100, SPRITE_TYPE.player, true)
  );

  gei('card-holder')?.appendChild(
    cardElementFactory(cards[4])
  )
  gei('card-holder')?.appendChild(
    cardElementFactory(cards[3])
  )
  gei('card-holder')?.appendChild(
    cardElementFactory(cards[2])
  )
  gei('card-holder')?.appendChild(
    cardElementFactory(cards[1])
  )
  gei('card-holder')?.appendChild(
    cardElementFactory(cards[0])
  )
})
