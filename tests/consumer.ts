import {createCave,mountTabs,openDialog,type CaveState} from '@cave-ui/core';
import {themes,foundations,type ColorToken} from '@cave-ui/tokens';
const controller=createCave({root:document.documentElement,locale:'ar-LB',theme:'system',direction:'auto'});
const state:CaveState=controller.setLocale('en-GB');
controller.setTheme('black');
controller.number(1234,{style:'currency',currency:'USD'});
controller.date(new Date(),{dateStyle:'medium'});
controller.t('save');
const color:ColorToken='accent-strong';
const cssValue:string=themes.light[color];
const font:string=foundations.fonts.sans;
const stop=mountTabs(document.querySelector<HTMLElement>('[role="tablist"]')!);stop();
openDialog(document.querySelector<HTMLDialogElement>('dialog')!);
// @ts-expect-error Unknown themes are rejected by the public API.
controller.setTheme('blue');
// @ts-expect-error Only documented token names are accepted.
const bad:ColorToken='unknown';
console.log(state,cssValue,font,bad);
controller.destroy();

const numerals = createCave({locale: 'ar', numberingSystem: 'latn'});
numerals.setNumberingSystem('arab');
