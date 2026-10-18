/* Theme choice (Light, Dark, Black, System) and the mobile menu. The first paint is set by the inline script in <head>. */
(function () {
  var KEY = 'cave-design-theme';
  var root = document.documentElement;
  var select = document.getElementById('theme-select');
  var dark = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;

  function read() {
    try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; }
  }
  function resolve(choice) {
    if (choice === 'light' || choice === 'dark' || choice === 'black') return choice;
    return dark && dark.matches ? 'dark' : 'light';
  }
  function apply(choice) { root.setAttribute('data-theme', resolve(choice)); }

  if (select) {
    select.value = read();
    select.addEventListener('change', function () {
      try { localStorage.setItem(KEY, select.value); } catch (e) {}
      apply(select.value);
    });
  }
  if (dark && dark.addEventListener) {
    dark.addEventListener('change', function () { if (read() === 'system') apply('system'); });
  }

  var btn = document.getElementById('menu-btn');
  var side = document.getElementById('side');
  if (btn && side) {
    btn.addEventListener('click', function () {
      var open = side.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // Size each component preview to its content.
  var frames = document.querySelectorAll('iframe.preview');
  function fit(f) {
    try {
      var doc = f.contentDocument;
      if (!doc || !doc.documentElement) return;
      f.style.height = '0px';
      f.style.height = Math.ceil(doc.documentElement.scrollHeight) + 'px';
    } catch (e) {}
  }
  Array.prototype.forEach.call(frames, function (f) {
    f.addEventListener('load', function () { fit(f); });
    if (f.contentDocument && f.contentDocument.readyState === 'complete') fit(f);
  });
  window.addEventListener('resize', function () { Array.prototype.forEach.call(frames, fit); });
})();
