import { CardData, EntityData, GameData, GameElements } from "./types";

export const ge = (selector: string) => document.querySelector(selector);
export const gei = (id: string) => document.getElementById(id);
export const qs = (e: HTMLElement, selector: string): HTMLElement => e.querySelector(selector)!;
export const qsa = (e: HTMLElement, selector: string): NodeListOf<Element> => e.querySelectorAll(selector)!;

export const ce = (c: string = 'x', innerHTML: string = '') => {
  const el = document.createElement('div')

  el.classList.add(...c.trim().split(' '));

  el.innerHTML = innerHTML;

  return el
};

export function getRandomIntInclusive(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor((max)) + 1;
  return Math.floor(Math.random() * (max - min) + min);
}

export function resize(e: GameElements) {
  let scale = 1;

  e.board.style.transform = `scale(${scale})`

  while (
    e.board?.getBoundingClientRect().width > window.innerWidth ||
    e.board.getBoundingClientRect().height > window.innerHeight) {
    scale -= .05;
    e.board.style.transform = `scale(${scale})`
  }
}

export function uuid(): string {
  // @ts-ignore
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
  );
}

export function getAttackForData(attack: number, modData: EntityData | CardData | undefined) {
  if (!modData) return attack;

  return Math.ceil((attack * (modData.e ? 1.5 : 1)) * (modData.w ? .75 : 1));
}

export function getDefenceForData(defence: number, modData: EntityData | CardData | undefined) {
  if (!modData) return defence;

  return Math.ceil(defence * (!!modData.w ? .5 : 1));
}

export function serializeToLocalStore(data: GameData): void {
  const sData = JSON.stringify(data);

  console.log('sData', sData);

  window.localStorage.setItem('js13k_2023_khan', sData);
}

export function deserializeFromLocalStore(): GameData | undefined {
  const data = window.localStorage.getItem('js13k_2023_khan');
  const pData = data ? JSON.parse(data) : undefined

  console.log('pData', pData);

  return data ? pData : undefined;
}
