import { ICard } from "./types";

export function flashCardCost(card: ICard) {
  const el = card.sprite.querySelector('.cost')!
  el.classList.add('flash')
  setTimeout(() => el.classList.remove('flash'), 250);
}
