// Shared theme picker for kijnreyyca-bot.github.io sites.
// Reads and writes the same "theme" key, so the choice follows you between sites.
(function () {
  'use strict';

  var COLORS = { void: '#000000', dark: '#1a1a1d', white: '#eceef1', blue: '#0a1628' };

  function start() {
    var root = document.documentElement;
    var btn = document.querySelector('#theme-btn');
    var menu = document.querySelector('#theme-menu');
    var meta = document.querySelector('#theme-color');
    var opts = menu ? menu.querySelectorAll('.theme-opt') : [];

    function apply(name, save) {
      if (!COLORS[name]) name = 'dark';
      root.dataset.theme = name;
      if (meta) meta.setAttribute('content', COLORS[name]);
      for (var i = 0; i < opts.length; i++) {
        opts[i].setAttribute('aria-checked', String(opts[i].dataset.t === name));
      }
      if (save) { try { localStorage.setItem('theme', name); } catch (e) {} }
    }

    function toggle(open) {
      if (!menu || !btn) return;
      menu.hidden = !open;
      btn.setAttribute('aria-expanded', String(open));
    }

    apply(root.dataset.theme, false);

    if (btn && menu) {
      btn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggle(menu.hidden);
      });
      for (var i = 0; i < opts.length; i++) {
        opts[i].addEventListener('click', function () {
          apply(this.dataset.t, true);
          toggle(false);
          btn.focus();
        });
      }
      document.addEventListener('click', function (e) {
        if (!menu.hidden && !menu.contains(e.target) && !btn.contains(e.target)) toggle(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && !menu.hidden) {
          toggle(false);
          btn.focus();
        }
      });
    }

    // Update live when another tab or site on this origin changes the theme.
    window.addEventListener('storage', function (event) {
      if (event.key === 'theme') apply(event.newValue, false);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start);
  } else {
    start();
  }
})();
