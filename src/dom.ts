import { IVisualCard } from "./types";

export function flashCardCost(card: IVisualCard) {
  const el = card.sprite.querySelector('.cost')!
  el.classList.add('flash')
  setTimeout(() => el.classList.remove('flash'), 250);
}
