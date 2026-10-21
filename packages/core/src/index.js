import { messages } from './messages.js';
export { messages };
const themes = ['system', 'light', 'dark', 'black'];
const directions = ['auto', 'ltr', 'rtl'];
const numberingSystems = ['auto', 'latn', 'arab'];
function localeOf(value) {
  const locale = new Intl.Locale(value).toString();
  if (!['en', 'ar'].includes(new Intl.Locale(locale).language)) throw new RangeError('Cave UI supports English and Arabic locales.');
  return locale;
}
function member(value, values, name) {
  if (!values.includes(value)) throw new RangeError(`Invalid ${name}: ${value}`);
  return value;
}
/** No document access occurs until a controller is created. Persistence is opt-in. */
export function createCave(options = {}) {
  const root = options.root ?? globalThis.document?.documentElement;
  if (!root?.ownerDocument?.defaultView) throw new TypeError('createCave requires a DOM element.');
  const win = root.ownerDocument.defaultView;
  const media = win.matchMedia?.('(prefers-color-scheme: dark)');
  const key = options.storageKey;
  let saved = {};
  if (key) {
    try {
      const value = JSON.parse(win.localStorage.getItem(key));
      if (value && typeof value === 'object') {
        if (themes.includes(value.theme)) saved.theme = value.theme;
        if (directions.includes(value.direction)) saved.direction = value.direction;
        if (numberingSystems.includes(value.numberingSystem)) saved.numberingSystem = value.numberingSystem;
        try { saved.locale = localeOf(value.locale); } catch {}
      }
    } catch {}
  }
  let locale = localeOf(options.locale ?? saved.locale ?? 'en');
  let theme = member(options.theme ?? saved.theme ?? 'system', themes, 'theme');
  let direction = member(options.direction ?? saved.direction ?? 'auto', directions, 'direction');
  let numberingSystem = member(options.numberingSystem ?? saved.numberingSystem ?? 'auto', numberingSystems, 'numbering system');
  let destroyed = false;
  const language = () => new Intl.Locale(locale).language;
  const state = () => Object.freeze({locale, theme, direction, numberingSystem,
    resolvedNumberingSystem: numberingSystem === 'auto' ? (language() === 'ar' ? 'arab' : 'latn') : numberingSystem,
    resolvedDirection: direction === 'auto' ? (language() === 'ar' ? 'rtl' : 'ltr') : direction,
    resolvedTheme: theme === 'system' ? (media?.matches ? 'dark' : 'light') : theme});
  function apply(persist = false) {
    if (destroyed) throw new Error('This Cave UI controller has been destroyed.');
    const current = state();
    root.lang = locale;
    root.dir = current.resolvedDirection;
    root.setAttribute('data-theme', current.resolvedTheme);
    if (persist && key) {
      try { win.localStorage.setItem(key, JSON.stringify({locale, theme, direction, numberingSystem})); } catch {}
    }
    root.dispatchEvent(new win.CustomEvent('cave:change', {detail:current, bubbles:true}));
    return current;
  }
  const onSystem = () => { if (theme === 'system') apply(); };
  media?.addEventListener('change', onSystem);
  apply();
  return Object.freeze({
    get state() { return state(); },
    setLocale(value) { locale = localeOf(value); return apply(true); },
    setTheme(value) { theme = member(value, themes, 'theme'); return apply(true); },
    setDirection(value) { direction = member(value, directions, 'direction'); return apply(true); },
    setNumberingSystem(value) { numberingSystem = member(value, numberingSystems, 'numbering system'); return apply(true); },
    t(key) {
      const value = options.messages?.[language()]?.[key] ?? messages[language()][key];
      if (typeof value !== 'string') throw new RangeError(`Unknown message: ${key}`);
      return value;
    },
    number(value, config) { return new Intl.NumberFormat(locale, {numberingSystem:state().resolvedNumberingSystem, ...config}).format(value); },
    date(value, config) { return new Intl.DateTimeFormat(locale, {numberingSystem:state().resolvedNumberingSystem, ...config}).format(value); },
    destroy() { media?.removeEventListener('change', onSystem); destroyed = true; }
  });
}
/** Native dialog provides modal focus containment, Escape and focus restoration. */
export function openDialog(dialog, returnFocus = dialog?.ownerDocument?.activeElement) {
  if (typeof dialog?.showModal !== 'function') throw new TypeError('Use a native <dialog> element.');
  if (!dialog.open) {
    // Safari does not focus buttons on pointer activation; callers can pass the trigger.
    dialog.addEventListener('close', () => { if (returnFocus?.isConnected) returnFocus.focus?.(); }, {once:true});
    dialog.showModal();
  }
}
export function closeDialog(dialog, value = '') { dialog.close(value); }
/** One tab stop, automatic activation, RTL-aware arrows, Home and End. */
export function mountTabs(tablist) {
  const tabs = [...tablist.querySelectorAll('[role="tab"]')];
  if (!tabs.length) throw new TypeError('The tablist must contain tabs.');
  const panels = tabs.map(tab => {
    const panel = tab.ownerDocument.getElementById(tab.getAttribute('aria-controls'));
    if (!tab.id || !panel) throw new TypeError('Each tab needs an id and a valid aria-controls target.');
    panel.setAttribute('role','tabpanel'); panel.setAttribute('aria-labelledby',tab.id);
    return panel;
  });
  tablist.setAttribute('role','tablist');
  const enabled = tab => !tab.disabled && tab.getAttribute('aria-disabled') !== 'true';
  function activate(index, focus = false) {
    if (index < 0 || !enabled(tabs[index])) return;
    tabs.forEach((tab,i) => {tab.tabIndex = i === index ? 0 : -1;tab.setAttribute('aria-selected',String(i === index));panels[i].hidden = i !== index;});
    if (focus) tabs[index].focus();
  }
  const selected = tabs.findIndex(t => enabled(t) && t.getAttribute('aria-selected') === 'true');
  activate(selected < 0 ? tabs.findIndex(enabled) : selected);
  function click(event) { const tab = event.target.closest('[role="tab"]'); activate(tabs.indexOf(tab)); }
  function keydown(event) {
    const current = tabs.indexOf(event.target);
    if (current < 0) return;
    const available = tabs.map((t,i) => enabled(t) ? i : -1).filter(i => i >= 0);
    const position = available.indexOf(current);
    const vertical = tablist.getAttribute('aria-orientation') === 'vertical';
    const rtl = tablist.ownerDocument.defaultView.getComputedStyle(tablist).direction === 'rtl';
    let next;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = available.length - 1;
    if (event.key === (vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight')) next = (position + 1) % available.length;
    if (event.key === (vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft')) next = (position - 1 + available.length) % available.length;
    if (next !== undefined) {event.preventDefault();activate(available[next],true);}
  }
  tablist.addEventListener('click',click);tablist.addEventListener('keydown',keydown);
  return () => {tablist.removeEventListener('click',click);tablist.removeEventListener('keydown',keydown);};
}
