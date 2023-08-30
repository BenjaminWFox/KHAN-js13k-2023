import { Card, CardData } from "./card";
import { ce } from "./utility"

export enum SPRITE_TYPE {
  player = 'player',
  enemy = 'enemy',
  mount = 'mount',
}

function spriteElementFactory(name: string, hp: number, type: SPRITE_TYPE, mounted: boolean): HTMLDivElement {
  const wrapper = ce(`sprite-wrapper ${type === SPRITE_TYPE.enemy ? 'enemy' : 'x'} ${mounted ? 'mounted' : 'x'}`)
  if (mounted) {
    // mount
    wrapper.appendChild(ce('sprite horse'))
  }
  const a = ce(`sprite ${name}`);
  const b = ce('intent');
  const c = ce('assault-value');
  b.appendChild(c);
  a.appendChild(b);
  wrapper.appendChild(a)

  const d = ce('stats hp')
  d.appendChild(ce('number', `${hp}/${hp}`))
  d.appendChild(ce('fill'))
  wrapper.appendChild(d)

  const e = ce('stats affects')
  e.appendChild(ce('armor', 'A:0'))
  e.appendChild(ce('enrage', 'E:0'))
  e.appendChild(ce('frail', 'F:0'))
  e.appendChild(ce('weak', 'W:0'))

  wrapper.appendChild(e)

  return wrapper;
}

export function cardElementFactory(card: Card) {
  const wrapper = ce('card pixel-border');
  const d = ce('detail')

  card.attributes.forEach(attribute => {
    d.appendChild(ce('x', attribute));
  })

  const b = ce('body');
  b.appendChild(d);

  if (card.data.flavor) b.appendChild(ce('flavor', card.data.flavor))

  wrapper.appendChild(ce('cost', card.data.c.toString()))
  wrapper.appendChild(ce('title', card.name))
  wrapper.appendChild(b);

  return wrapper;
}

export { spriteElementFactory };

// class Sprite {
//   constructor(name: string, type: SPRITE_TYPE, mounted: boolean) {

//   }
// }



// const player = {
//   khan: '',
// }
