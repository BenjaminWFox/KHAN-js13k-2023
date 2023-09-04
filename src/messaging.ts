import { ce, gei } from "./utility";

export const messages = {
  intro: `Oh Great Khan! The Gods have decreed the world shall know and fear the name, Ghengis Khan.
  All lands shall be yours, Oh Great Khan...you must simply go forth and seize them.
  <br /><br />
  Should you prepare wisely, even the Great King of the West will be no match for your might! Go forth and conquer!`,
  final: `Oh Great Khan! You've done it! The King of the West has fallen and all lands are yours, from sea to sea on all sides! Go 
  forth now and prosper and multiply so that these lands will know the lineage and rule of Khan until the end of time!`,
  thanks: `Thank you for playing, hope you enjoyed this tiny game!`
}

export function showMessage(message: string, callback: () => void, multiMessage = false) {
  gei('context')!.classList.remove('hide');
  gei('context')!.classList.add('show');
  gei('content')!.innerHTML = message;

  const b = document.createElement('button');
  b.classList.add('pixel-border');
  b.innerHTML = 'Continue ...';
  b.id = 'context-close';

  gei('context-close')!.replaceWith(b)
  gei('context-close')!.addEventListener('click', () => {
    callback();

    if (!multiMessage) {
      gei('context')!.classList.remove('show');
      setTimeout(() => {
        gei('context')!.classList.add('hide');
      })
    }
  })
}
