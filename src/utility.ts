export const ge = (selector: string) => document.querySelector(selector);
export const gei = (id: string) => document.getElementById(id);

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
