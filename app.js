'use strict';

// ── Mastery (persisted in localStorage) ──────────────────────────

function loadMastery() {
  try {
    const saved = JSON.parse(localStorage.getItem('pp_mastery'));
    if (saved && typeof saved === 'object') {
      return Object.assign({}, MASTERY, saved);
    }
  } catch (_) {}
  return Object.assign({}, MASTERY);
}

function saveMastery() {
  try { localStorage.setItem('pp_mastery', JSON.stringify(mastery)); } catch (_) {}
}

let mastery = loadMastery();

// ── App state ─────────────────────────────────────────────────────

const state = {
  dark: localStorage.getItem('pp_dark') === '1',
  // Memorize sub-state
  verseId: null,
  collectionId: null,
  tokens: [],
  wordIndices: [],
  hiddenSet: new Set(),
  taps: 0,
  wordsPerTap: 5,
};

// Navigation history stack: [{type, id}]
// type = 'collections' | 'detail' | 'memorize'
const navStack = [{ type: 'collections' }];

// ── Utility functions ─────────────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function truncate(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, '') + '…';
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function tokenize(s) {
  const out = [];
  const re = /(\s+|[^\s\w‘’—–‘-]+|[\w‘’—–‘-]+)/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const tk = m[0];
    if (/^\s+$/.test(tk))                                               out.push({ kind: 'ws',    text: tk });
    else if (/^[\w‘’—–’'-]+$/.test(tk) && /\w/.test(tk)) out.push({ kind: 'word',  text: tk });
    else                                                                out.push({ kind: 'punct', text: tk });
  }
  return out;
}

function fontSizeFor(len) {
  if (len < 60)  return 64;
  if (len < 100) return 54;
  if (len < 150) return 44;
  if (len < 220) return 36;
  if (len < 300) return 30;
  if (len < 400) return 26;
  if (len < 500) return 22;
  return 19;
}

function accentVar(collectionId) {
  if (collectionId === 'foundation') return 'var(--red)';
  if (collectionId === 'freedom')    return 'var(--ochre)';
  return 'var(--sage)';
}

function masteryLabel(id) {
  const st = mastery[id] || 'new';
  if (st === 'mastered') return 'Mastered';
  if (st === 'learning') return 'Learning';
  return 'New';
}

// ── Dark mode ─────────────────────────────────────────────────────

function applyDark() {
  document.body.classList.toggle('dark', state.dark);
  const meta = document.getElementById('theme-meta');
  if (meta) meta.setAttribute('content', state.dark ? '#0E0C0A' : '#F2E9D8');
  try { localStorage.setItem('pp_dark', state.dark ? '1' : '0'); } catch (_) {}
}

function toggleDark() {
  state.dark = !state.dark;
  applyDark();
  const btn = document.getElementById('dark-toggle');
  if (btn) btn.innerHTML = darkIcon();
}

function darkIcon() {
  if (state.dark) {
    // Sun — we're in dark mode, clicking goes light
    return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
      <circle cx="12" cy="12" r="4.5"/>
      <line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/>
      <line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/>
      <line x1="4.93" y1="4.93" x2="7.05" y2="7.05"/><line x1="16.95" y1="16.95" x2="19.07" y2="19.07"/>
      <line x1="4.93" y1="19.07" x2="7.05" y2="16.95"/><line x1="16.95" y1="7.05" x2="19.07" y2="4.93"/>
    </svg>`;
  }
  // Moon — we're in light mode, clicking goes dark
  return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>`;
}

// ── Mastery dot SVG (for memorize screen chrome) ──────────────────

function masteryDotSvg(id, accent) {
  const st = mastery[id] || 'new';
  if (st === 'mastered') {
    return `<svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="${accent}"/>
      <path d="M4.5 8l2.5 2.5L11.5 5" stroke="var(--paper)" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  }
  if (st === 'learning') {
    return `<svg width="16" height="16" viewBox="0 0 16 16">
      <circle cx="8" cy="8" r="7" fill="${accent}" fill-opacity="0.45"/>
      <circle cx="8" cy="8" r="7" stroke="${accent}" stroke-width="1.2" fill="none"/>
    </svg>`;
  }
  return `<svg width="16" height="16" viewBox="0 0 16 16">
    <circle cx="8" cy="8" r="7" stroke="var(--muted)" stroke-width="1.2" fill="none" stroke-dasharray="3 2"/>
  </svg>`;
}

function cycleMastery(id) {
  const current = mastery[id] || 'new';
  mastery[id] = current === 'new' ? 'learning' : current === 'learning' ? 'mastered' : 'new';
  saveMastery();
}

// ── HTML builders ─────────────────────────────────────────────────

function buildCollections() {
  const totalMastered = VERSES.filter(v => mastery[v.id] === 'mastered').length;

  const todayVerse = VERSES.find(v => mastery[v.id] === 'learning' && v.text.length < 150)
                  || VERSES.find(v => mastery[v.id] === 'learning')
                  || VERSES[0];

  const cardsHtml = COLLECTIONS.map((col, i) => {
    const verses  = VERSES.filter(v => v.collection === col.id);
    const mCount  = verses.filter(v => mastery[v.id] === 'mastered').length;
    const accent  = i === 0 ? 'var(--red)' : i === 1 ? 'var(--ochre)' : 'var(--sage)';
    const first   = verses[0];
    const preview = first ? `“${first.text.split(' ').slice(0, 7).join(' ')}…”` : '';
    const ticks   = verses.map((_, j) => {
      const filled = j < mCount;
      return `<div class="card-tick" style="background:${filled ? accent : 'var(--faded)'}"></div>`;
    }).join('');

    return `
      <div class="collection-card" data-nav="detail" data-id="${col.id}">
        <div class="card-accent-bar" style="background:${accent}"></div>
        <div class="card-top">
          <div class="card-name-row">
            <span class="card-name">${esc(col.name)}</span>
            <span class="card-subtitle">${esc(col.subtitle)}</span>
          </div>
          <span class="card-count">${mCount}/${verses.length}</span>
        </div>
        <div class="card-ticks">${ticks}</div>
        <div class="card-preview">${esc(preview)}</div>
      </div>`;
  }).join('');

  return `
    <div class="screen" id="screen-collections">
      <button class="dark-toggle" id="dark-toggle">${darkIcon()}</button>
      <div class="screen-scroll">
        <div class="collections-header">
          <div class="brand-label">
            <span class="amp-mark" style="font-size:13px">&amp;</span>
            <span>Progress &amp; Perfection</span>
          </div>
          <h1 class="hero-text">Hide His<br><em>word</em> in your heart.</h1>
        </div>

        <div class="today-section">
          <div class="today-card" data-nav="memorize" data-id="${todayVerse.id}">
            <div class="today-meta">
              <span>Today &middot; ${esc(todayVerse.date)}</span>
              <span class="today-status">${masteryLabel(todayVerse.id)}</span>
            </div>
            <div class="today-text">${esc(truncate(todayVerse.text, 82))}</div>
            <div class="today-footer">
              <span class="today-ref">&mdash; ${esc(todayVerse.ref)}</span>
              <svg width="14" height="10" viewBox="0 0 14 10" fill="none">
                <path d="M1 5h11m0 0L8 1m4 4L8 9" stroke="var(--red)" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
          </div>
        </div>

        <div class="collections-section">
          <div class="section-header">
            <span class="section-label">Collections</span>
          </div>
          ${cardsHtml}
        </div>

        <div class="verse-count-footer">
          ${totalMastered}&thinsp;/&thinsp;${VERSES.length} verses memorized this year.
        </div>
      </div>
    </div>`;
}

function buildDetail(collectionId) {
  const col    = COLLECTIONS.find(c => c.id === collectionId);
  const verses = VERSES.filter(v => v.collection === collectionId);
  const mCount = verses.filter(v => mastery[v.id] === 'mastered').length;
  const accent = accentVar(collectionId);
  const pct    = verses.length ? Math.round((mCount / verses.length) * 100) : 0;

  const rowsHtml = verses.map(v => {
    const st = mastery[v.id] || 'new';
    let dotHtml;
    if (st === 'mastered') {
      dotHtml = `<div class="mastery-dot dot-mastered" style="background:${accent}">
        <svg width="10" height="10" viewBox="0 0 10 10">
          <path d="M1.5 5l2.3 2.3L8.5 2.5" stroke="var(--paper)" stroke-width="1.4" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>`;
    } else if (st === 'learning') {
      dotHtml = `<div class="mastery-dot dot-learning"></div>`;
    } else {
      dotHtml = `<div class="mastery-dot dot-new"></div>`;
    }
    const themeHtml = v.theme
      ? `<span class="verse-theme" style="color:${accent}">${esc(v.theme)}</span>`
      : '';

    return `
      <div class="verse-row" data-nav="memorize" data-id="${v.id}">
        ${dotHtml}
        <div class="verse-row-info">
          <span class="verse-date">${esc(v.date)}</span>
          <span class="verse-ref">${esc(v.ref)}</span>
          ${themeHtml}
        </div>
        <svg width="7" height="12" viewBox="0 0 7 12" style="flex-shrink:0">
          <path d="M1 1l5 5-5 5" stroke="var(--muted)" stroke-width="1.1" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
      </div>`;
  }).join('');

  return `
    <div class="screen" id="screen-detail">
      <div class="screen-scroll">
        <nav class="detail-nav">
          <button class="back-btn" data-nav="back">
            <svg width="8" height="13" viewBox="0 0 8 13">
              <path d="M7 1L1 6.5 7 12" stroke="var(--ink-soft)" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
            All
          </button>
          <span class="amp-mark" style="font-size:12px;color:var(--red)">&amp;</span>
        </nav>

        <div class="detail-header">
          <div class="collection-meta" style="color:${accent}">
            Collection &middot; ${esc(col.subtitle)}
          </div>
          <h2 class="collection-title">${esc(col.name)}</h2>
          <div class="progress-bar-wrap">
            <div class="progress-bar-track">
              <div class="progress-bar-fill" style="width:${pct}%;background:${accent}"></div>
            </div>
            <span class="progress-count">${mCount}&thinsp;/&thinsp;${verses.length}</span>
          </div>
        </div>

        <div class="verse-list">${rowsHtml}</div>
      </div>
    </div>`;
}

function buildMemorize(verseId) {
  const v   = VERSES.find(x => x.id === verseId) || VERSES[0];
  const col = COLLECTIONS.find(c => c.id === v.collection);
  const accent = accentVar(v.collection);
  const fontSize = fontSizeFor(v.text.length);

  // Initialize memorize sub-state
  state.verseId     = v.id;
  state.collectionId = v.collection;
  state.tokens      = tokenize(v.text);
  state.wordIndices = state.tokens.map((tk, i) => tk.kind === 'word' ? i : -1).filter(i => i >= 0);
  state.hiddenSet   = new Set(state.wordIndices);
  state.taps        = 0;

  const verseHtml = state.tokens.map((tk, i) => {
    if (tk.kind === 'ws')    return esc(tk.text);
    if (tk.kind === 'punct') return `<span class="punct">${esc(tk.text)}</span>`;
    return `<span class="word hidden" data-idx="${i}">${esc(tk.text)}</span>`;
  }).join('');

  return `
    <div class="screen memorize-screen" id="screen-memorize">
      <div class="mem-vignette"></div>

      <div class="mem-chrome-top">
        <div class="mem-back" data-nav="back">
          <svg width="8" height="13" viewBox="0 0 8 13">
            <path d="M7 1L1 6.5 7 12" stroke="var(--ink-soft)" stroke-width="1.3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span class="mem-back-label">${col ? esc(col.name.toUpperCase()) : ''}</span>
        </div>
        <div class="mem-right">
          <span class="mem-pct" id="mem-pct">00%</span>
          <button class="mem-mastery-btn" id="mem-mastery-btn" data-action="toggle-mastery">
            ${masteryDotSvg(v.id, accent)}
          </button>
          <button class="mem-reset" id="mem-reset">
            <svg width="15" height="15" viewBox="0 0 15 15">
              <path d="M13 7.5a5.5 5.5 0 11-1.6-3.9M13 2v3.5h-3.5" stroke="var(--ink-soft)" stroke-width="1.2" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="mem-progress-wrap">
        <div class="mem-progress-fill" id="mem-progress-fill" style="background:${accent};width:0%"></div>
      </div>

      <div class="verse-body" id="verse-body">
        <div class="verse-text" style="font-size:${fontSize}px">${verseHtml}</div>
      </div>

      <div class="mem-bottom">
        <div class="mem-rule"></div>
        <div class="mem-ref">${esc(v.ref)} <span class="esv-badge">ESV</span></div>
        <div class="mem-hint" id="mem-hint">Tap to reveal &middot; 0</div>
      </div>
    </div>`;
}

// ── Memorize screen logic ─────────────────────────────────────────

function tapVerse() {
  const totalWords = state.wordIndices.length;
  const hiddenCount = state.hiddenSet.size;

  // Done: all words revealed — tap resets
  if (hiddenCount === 0) {
    resetMemorize();
    return;
  }

  // Reveal N random hidden words
  const pool = [...state.hiddenSet];
  shuffle(pool);
  const toReveal = pool.slice(0, state.wordsPerTap);

  toReveal.forEach(idx => {
    state.hiddenSet.delete(idx);
    const span = document.querySelector(`.word[data-idx="${idx}"]`);
    if (span) {
      span.classList.remove('hidden');
      span.classList.add('revealed');
    }
  });

  state.taps++;
  updateMemorizeUI();
}

function resetMemorize() {
  state.hiddenSet = new Set(state.wordIndices);
  state.taps = 0;

  document.querySelectorAll('.word.revealed').forEach(span => {
    span.classList.remove('revealed');
    span.classList.add('hidden');
  });

  updateMemorizeUI();
}

function updateMemorizeUI() {
  const total   = state.wordIndices.length;
  const visible = total - state.hiddenSet.size;
  const pct     = total ? Math.round((visible / total) * 100) : 0;
  const done    = state.hiddenSet.size === 0;

  const pctEl = document.getElementById('mem-pct');
  if (pctEl) pctEl.textContent = String(pct).padStart(2, '0') + '%';

  const fillEl = document.getElementById('mem-progress-fill');
  if (fillEl) fillEl.style.width = pct + '%';

  const hintEl = document.getElementById('mem-hint');
  if (hintEl) {
    hintEl.textContent = done
      ? 'Tap to reset'
      : `Tap to reveal · ${state.taps}`;
  }
}

function updateMasteryBtn() {
  const btn = document.getElementById('mem-mastery-btn');
  if (!btn) return;
  const accent = accentVar(state.collectionId);
  btn.innerHTML = masteryDotSvg(state.verseId, accent);
}

// ── Navigation ────────────────────────────────────────────────────

let currentEl = null;

function navigate(type, id, direction) {
  let html;
  if      (type === 'collections') html = buildCollections();
  else if (type === 'detail')      html = buildDetail(id);
  else if (type === 'memorize')    html = buildMemorize(id);
  else return;

  const wrapper = document.createElement('div');
  wrapper.innerHTML = html;
  const nextEl = wrapper.firstElementChild;

  const app = document.getElementById('app');

  if (!currentEl) {
    app.appendChild(nextEl);
    currentEl = nextEl;
    bindScreen(nextEl, type);
    return;
  }

  // Animate
  const outClass  = direction === 'forward' ? 'screen-exit-left'  : 'screen-exit-right';
  const inClass   = direction === 'forward' ? 'screen-enter-right' : 'screen-enter-left';

  app.appendChild(nextEl);
  nextEl.classList.add(inClass);

  const leaving = currentEl;
  leaving.classList.add(outClass);

  leaving.addEventListener('animationend', () => leaving.remove(), { once: true });

  currentEl = nextEl;
  bindScreen(nextEl, type);
}

function goTo(type, id) {
  navStack.push({ type, id });
  navigate(type, id, 'forward');
}

function goBack() {
  if (navStack.length <= 1) return;
  navStack.pop();
  const prev = navStack[navStack.length - 1];
  navigate(prev.type, prev.id, 'back');
}

// ── Event binding per screen ──────────────────────────────────────

function bindScreen(el, type) {
  // Delegate all nav clicks
  el.addEventListener('click', e => {
    const navTarget = e.target.closest('[data-nav]');
    if (navTarget) {
      e.stopPropagation();
      const navType = navTarget.dataset.nav;
      if (navType === 'back') { goBack(); return; }
      goTo(navType, navTarget.dataset.id);
      return;
    }

    // Dark toggle (collections screen only)
    if (e.target.closest('#dark-toggle')) {
      toggleDark();
      return;
    }

    // Memorize actions
    if (type === 'memorize') {
      if (e.target.closest('[data-action="toggle-mastery"]')) {
        cycleMastery(state.verseId);
        updateMasteryBtn();
        return;
      }
      if (e.target.closest('#mem-reset')) {
        resetMemorize();
        return;
      }
      // Tap anywhere on the verse body (but not chrome or bottom)
      const inChrome = e.target.closest('.mem-chrome-top') || e.target.closest('.mem-bottom');
      if (!inChrome) {
        tapVerse();
      }
    }
  });
}

// ── Boot ──────────────────────────────────────────────────────────

(function boot() {
  applyDark();
  navigate('collections', null, null);
})();
