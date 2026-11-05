/* Theme switcher. Light is the default regardless of the OS setting; the
   header button flips to dark and remembers the choice.

   Loaded synchronously in <head> so the saved theme is applied before first
   paint (no light-to-dark flash). The button is wired up after the DOM loads. */
(function () {
  var KEY = 'reverse-theme';
  var root = document.documentElement;
  var META_COLORS = { light: '#faf8f5', dark: '#14181c' };   // keep in step with --canvas in styles.css

  function saved() {
    try {
      var v = localStorage.getItem(KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch (e) { return null; }
  }

  function apply(theme, announce) {
    root.setAttribute('data-theme', theme);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', META_COLORS[theme]);
    var btn = document.querySelector('.theme-toggle');
    if (btn) {
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme');
      btn.setAttribute('aria-pressed', String(theme === 'dark'));
    }
    /* Canvas-drawn content (the wheel) listens for this to repaint with the new tokens. */
    if (announce) window.dispatchEvent(new Event('themechange'));
  }

  apply(saved() || 'light', false);

  document.addEventListener('DOMContentLoaded', function () {
    apply(root.getAttribute('data-theme') || 'light', false);
    var btn = document.querySelector('.theme-toggle');
    if (!btn) return;
    btn.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(KEY, next); } catch (e) { /* storage unavailable: still switch for this visit */ }
      apply(next, true);
    });
  });
})();
