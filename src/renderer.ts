import { Card } from "./card";
import { CARD_TYPE, SPRITE_TYPE } from "./enums";
import { ce } from "./utility"

function spriteElementBuilder(name: string, hp: number, type: SPRITE_TYPE, mounted: boolean, id: string): HTMLDivElement {
  const wrapper = ce(`sprite-wrapper ${type === SPRITE_TYPE.enemy ? 'enemy' : 'x'} ${mounted ? 'mounted' : 'x'}`)
  wrapper.id = id;
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
  e.appendChild(ce('armor', 'D:0'))
  e.appendChild(ce('enrage', 'E:0'))
  e.appendChild(ce('falter', 'F:0'))
  e.appendChild(ce('weak', 'W:0'))
  wrapper.appendChild(e)

  const f = ce('targeting')
  wrapper.appendChild(f)

  return wrapper;
}

function cardElementBuilder(card: Card) {
  const wrapper = ce('card pixel-border');
  wrapper.id = card.id;
  const d = ce('detail')

  card.attributes.forEach(attribute => {
    d.appendChild(ce('x', attribute));
  })

  const b = ce('body');
  b.appendChild(d);

  if (card.data.flavor) b.appendChild(ce('flavor', card.data.flavor))

  if (card.type !== CARD_TYPE.innate) {
    wrapper.appendChild(ce('cost', card.data.c!.toString()))
  } else {
    wrapper.classList.add('innate');
  }

  wrapper.appendChild(ce('title', card.name))
  wrapper.appendChild(b);

  return wrapper;
}

export { spriteElementBuilder, cardElementBuilder };
