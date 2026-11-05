(function () {
  if (typeof VERSES === 'undefined') {
    console.error('VERSES not loaded: make sure verses.js is included before wheel.js');
    return;
  }

  const SESSION_KEY = 'reverse-wheel-session-v1';
  /* Section colors come from the CSS tokens (--sec-1 … --sec-7 in styles.css), the
     same ones the library uses. DOM elements reference them as var(--sec-N) so they
     follow the theme automatically; the canvas resolves them at draw time. */
  const SECTION_COLOR_COUNT = 7;
  const secVar = (i) => `var(--sec-${(i % SECTION_COLOR_COUNT) + 1})`;
  const cssVar = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();
  /* Spin-time options: duration -> full turns before landing (fewer turns at
     shorter times so it stays readable, but always enough to pass every slice). */
  const SPEEDS = { 1000: [2, 3], 3000: [3, 5], 6000: [5, 7] };
  const DEFAULT_MS = 3000;
  const HINT_WORDS = 5;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ===== DATA ===== */
  const sectionIndex = new Map();
  const verses = VERSES.map((v) => {
    if (!sectionIndex.has(v.section)) sectionIndex.set(v.section, sectionIndex.size);
    return {
      id: v.slug,
      ref: v.ref,
      text: v.words.join(' '),
      section: v.section,
      ci: sectionIndex.get(v.section),
      color: secVar(sectionIndex.get(v.section))
    };
  });
  const byId = new Map(verses.map((v, i) => [v.id, i]));
  const sections = [...sectionIndex.keys()].map((name) => ({
    name,
    color: secVar(sectionIndex.get(name)),
    verses: verses.filter((v) => v.section === name)
  }));
  const MIN_ACTIVE = 2;   // a wheel needs at least two verses to be worth spinning

  /* `active` is the verses currently on the wheel (everything not removed).
     N and SLICE follow it, so slices re-divide whenever the set changes. */
  let active = verses;
  let N = verses.length;
  let SLICE = 360 / N;
  function applyActive() {
    active = verses.filter((v) => !state.removed.has(v.id));
    N = active.length;
    SLICE = 360 / N;
  }

  /* ===== STATE ===== */
  const state = {
    mode: 'norepeat',      // 'random' | 'norepeat'
    spinMs: DEFAULT_MS,    // 1000 | 3000 | 6000
    counts: {},            // verse id -> times selected this session
    roundSeen: new Set(),  // verse ids seen in the current round (drives no-repeat)
    removed: new Set(),    // verse ids taken off the wheel
    round: 1,
    spins: 0,
    last: null,            // id of the most recent pick
    pending: null,         // id of a result still waiting to be dismissed
    angle: 0,              // wheel rotation in degrees (clockwise)
    spinning: false
  };

  /* Session state lives in sessionStorage so it survives going Home and back,
     or a refresh, but resets when the tab is closed. */
  function loadSession() {
    try {
      const raw = JSON.parse(sessionStorage.getItem(SESSION_KEY) || 'null');
      if (!raw) return;
      for (const [id, n] of Object.entries(raw.counts || {})) {
        if (byId.has(id) && n > 0) state.counts[id] = n | 0;
      }
      (raw.roundSeen || []).forEach((id) => { if (byId.has(id)) state.roundSeen.add(id); });
      (raw.removed || []).forEach((id) => { if (byId.has(id)) state.removed.add(id); });
      if (verses.length - state.removed.size < MIN_ACTIVE) state.removed.clear();
      state.round = Math.max(1, raw.round | 0 || 1);
      state.spins = Math.max(0, raw.spins | 0);
      state.last = byId.has(raw.last) ? raw.last : null;
      state.pending = byId.has(raw.pending) ? raw.pending : null;
      if (raw.mode === 'random' || raw.mode === 'norepeat') state.mode = raw.mode;
      if (SPEEDS[raw.spinMs]) state.spinMs = raw.spinMs;
    } catch (e) { /* storage unavailable or corrupt — start fresh */ }
  }

  function saveSession() {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify({
        counts: state.counts,
        roundSeen: [...state.roundSeen],
        removed: [...state.removed],
        round: state.round,
        spins: state.spins,
        last: state.last,
        pending: state.pending,
        mode: state.mode,
        spinMs: state.spinMs
      }));
    } catch (e) { /* ignore */ }
  }

  /* ===== ELEMENTS ===== */
  const $ = (sel, root = document) => root.querySelector(sel);
  const canvas = $('.wheel');
  const pointer = $('.pointer');
  const readout = $('.readout');
  const readoutLabel = $('.readout-label');
  const readoutRef = $('.readout-ref');
  const spinBtn = $('.spin-btn');
  const modeNote = $('.mode-note');
  const resetBtn = $('.reset-btn');
  const chipGrid = $('.chip-grid:not(.removed-grid)');
  const sectionGrid = $('.section-grid');
  const removedBox = $('.removed');
  const removedGrid = $('.removed-grid');
  const restoreBtn = $('.restore-btn');
  const live = $('#live');
  const dlg = $('.result');
  const revealBtns = dlg.querySelectorAll('[data-reveal]');
  const hintEl = $('.hint', dlg);
  let shown = null;                    // verse currently in the result card

  /* ===== WHEEL DRAWING =====
     Drawn once to a canvas; spinning is a CSS rotation of that canvas, so the
     animation never repaints. Slice i covers [i*SLICE, (i+1)*SLICE) degrees
     measured clockwise from 12 o'clock. */
  function drawWheel() {
    const size = canvas.clientWidth;
    if (!size) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = canvas.height = Math.round(size * dpr);
    const ctx = canvas.getContext('2d');
    ctx.scale(dpr, dpr);

    const c = size / 2;
    const R = c - 1;
    const hubR = R * 0.17;
    const step = (Math.PI * 2) / N;
    const start = -Math.PI / 2;
    const palette = Array.from({ length: SECTION_COLOR_COUNT }, (_, i) => cssVar(`--sec-${i + 1}`));
    const gap = cssVar('--wheel-gap');
    const shade = cssVar('--wheel-shade');
    const labelColor = cssVar('--wheel-text');

    active.forEach((v, i) => {
      const a0 = start + i * step;
      const a1 = a0 + step;
      ctx.beginPath();
      ctx.moveTo(c, c);
      ctx.arc(c, c, R, a0, a1);
      ctx.closePath();
      ctx.fillStyle = palette[v.ci % SECTION_COLOR_COUNT];
      ctx.fill();
      if (i % 2) {            // alternate shading so neighbours in one section stay distinct
        ctx.fillStyle = shade;
        ctx.fill();
      }
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = gap;
      ctx.stroke();
    });

    /* One font size for the whole wheel, shrunk until the longest reference fits. */
    const family = "'Inter', -apple-system, system-ui, sans-serif";
    const maxLen = R - hubR - 24;
    let fs = Math.max(8, Math.min(14, ((2 * Math.PI * R * 0.7) / N) * 0.5));
    ctx.font = `600 ${fs}px ${family}`;
    const longest = Math.max(...active.map((v) => ctx.measureText(v.ref).width));
    if (longest > maxLen) {
      fs = Math.max(6.5, fs * (maxLen / longest));
      ctx.font = `600 ${fs}px ${family}`;
    }

    ctx.fillStyle = labelColor;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';
    active.forEach((v, i) => {
      ctx.save();
      ctx.translate(c, c);
      ctx.rotate(start + (i + 0.5) * step);
      ctx.fillText(v.ref, R - 12, 0);
      ctx.restore();
    });
  }

  function setAngle(deg) {
    canvas.style.transform = `rotate(${deg}deg)`;
  }

  function indexAtPointer(angle) {
    const a = (((-angle) % 360) + 360) % 360;
    return Math.min(N - 1, Math.floor(a / SLICE));
  }

  /* ===== PICKING ===== */
  /* True random: any verse. No repeats: only verses not yet seen this round;
     once every verse has been seen a new round starts (and the verse just
     picked is held out so it can't land twice in a row across the boundary). */
  /* Verses seen this round that are still on the wheel. */
  function seenInRound() {
    return active.reduce((n, v) => n + (state.roundSeen.has(v.id) ? 1 : 0), 0);
  }

  function pickTarget() {
    const rollover = seenInRound() >= N;
    const seen = rollover ? new Set() : state.roundSeen;
    let pool = [];
    for (let i = 0; i < N; i++) {
      if (state.mode === 'random' || !seen.has(active[i].id)) pool.push(i);
    }
    if (state.mode === 'norepeat' && rollover && N > 1) {
      pool = pool.filter((i) => active[i].id !== state.last);
    }
    return { index: pool[Math.floor(Math.random() * pool.length)], rollover };
  }

  function commitPick(index, rollover) {
    const v = active[index];
    if (rollover) {
      state.round += 1;
      state.roundSeen.clear();
    }
    state.counts[v.id] = (state.counts[v.id] || 0) + 1;
    state.roundSeen.add(v.id);
    state.spins += 1;
    state.last = v.id;
    state.pending = v.id;
    saveSession();
  }

  /* ===== SPIN ===== */
  const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);

  function setReadout(v, { label, mode }) {
    readout.classList.toggle('is-idle', mode === 'idle');
    readout.classList.toggle('is-spinning', mode === 'spinning');
    readout.style.setProperty('--accent', v ? v.color : 'var(--hairline-strong)');
    if (label != null) readoutLabel.textContent = label;
    readoutRef.textContent = v ? v.ref : 'Press spin';

    /* Once a verse has landed, the card doubles as a button that reopens its pop-up. */
    const canOpen = !!v && mode === 'final';
    readout.classList.toggle('is-link', canOpen);
    if (canOpen) {
      readout.setAttribute('role', 'button');
      readout.tabIndex = 0;
      readout.setAttribute('aria-label', `${v.ref}. Open verse pop-up`);
      readout.title = 'Open verse pop-up';
    } else {
      readout.removeAttribute('role');
      readout.removeAttribute('tabindex');
      readout.removeAttribute('aria-label');
      readout.removeAttribute('title');
    }
  }

  function reopenLast() {
    if (state.spinning || dlg.open || !state.last) return;
    showResult(verses[byId.get(state.last)]);
  }

  function spin() {
    if (state.spinning || dlg.open) return;
    state.spinning = true;
    spinBtn.disabled = true;
    resetBtn.disabled = true;
    spinBtn.textContent = 'Spinning…';
    live.textContent = 'Spinning.';
    renderEditors();

    const { index, rollover } = pickTarget();

    /* Land somewhere inside the target slice (not on an edge), after a few full turns. */
    const within = (0.2 + Math.random() * 0.6) * SLICE;
    const wanted = (360 - ((index * SLICE + within) % 360)) % 360;  // angle mod 360 that puts it under the pointer
    const current = ((state.angle % 360) + 360) % 360;
    const delta = (wanted - current + 360) % 360;
    const [minTurns, maxTurns] = SPEEDS[state.spinMs];
    const turns = minTurns + Math.floor(Math.random() * (maxTurns - minTurns + 1));
    const duration = state.spinMs;
    const from = state.angle;
    const to = from + turns * 360 + delta;

    pointer.classList.remove('is-settling');
    setReadout(null, { label: 'Spinning', mode: 'spinning' });

    const finish = () => {
      state.angle = to % 360;
      setAngle(state.angle);
      pointer.classList.add('is-settling');
      pointer.style.transform = 'rotate(0deg)';
      state.spinning = false;
      spinBtn.textContent = 'Spin';
      spinBtn.disabled = false;
      resetBtn.disabled = false;

      commitPick(index, rollover);
      const v = active[index];
      setReadout(v, { label: v.section, mode: 'final' });
      live.textContent = `Landed on ${v.ref}.`;
      render({ flash: v.id });
      setTimeout(() => showResult(v), reducedMotion.matches ? 0 : 450);
    };

    if (reducedMotion.matches) {
      setAngle(to);
      setTimeout(finish, 150);
      return;
    }

    let lastIdx = indexAtPointer(from);
    let kick = 0;
    const t0 = performance.now();

    function frame(now) {
      const x = Math.min(1, (now - t0) / duration);
      const angle = from + (to - from) * easeOutCubic(x);
      setAngle(angle);

      const idx = indexAtPointer(angle);
      if (idx !== lastIdx) {
        lastIdx = idx;
        kick = 1;
        const v = active[idx];
        readoutRef.textContent = v.ref;
        readout.style.setProperty('--accent', v.color);
      }
      kick *= 0.8;                       // pointer flicks as each slice passes, then springs back
      pointer.style.transform = `rotate(${-kick * 24}deg)`;

      if (x < 1) requestAnimationFrame(frame);
      else finish();
    }
    requestAnimationFrame(frame);
  }

  /* ===== RESULT DIALOG ===== */
  function firstWords(text, n) {
    const words = text.trim().split(/\s+/);
    return words.slice(0, n).join(' ') + (words.length > n ? '…' : '');
  }

  /* One reveal panel, two contents: the first five words, or the whole verse.
     Pressing the active button again hides it. */
  function setReveal(mode) {
    const open = mode === 'hint' || mode === 'verse';
    if (open && shown) {
      const text = shown.text;
      $('.hint-label', dlg).textContent =
        mode === 'hint' ? 'First five words' : 'Full verse · ESV';
      $('.hint-text', dlg).textContent = mode === 'hint' ? firstWords(text, HINT_WORDS) : text;
    }
    hintEl.classList.toggle('is-open', open);
    hintEl.classList.toggle('is-verse', mode === 'verse');
    hintEl.inert = !open;
    revealBtns.forEach((btn) => {
      const on = btn.dataset.reveal === mode;
      btn.setAttribute('aria-expanded', String(on));
      btn.textContent = `${on ? 'Hide' : 'Show'} ${btn.dataset.reveal}`;
    });
  }

  function showResult(v) {
    if (dlg.open) return;
    const times = state.counts[v.id] || 1;
    $('.result-card', dlg).style.setProperty('--accent', v.color);
    $('.result-eyebrow', dlg).textContent =
      v.section;
    $('.result-ref', dlg).textContent = v.ref;
    $('.result-count', dlg).textContent =
      times === 1 ? 'First time this session.' : `Selected ${times} times this session.`;
    shown = v;
    setReveal(null);

    dlg.showModal();
    void dlg.offsetWidth;               // commit the start state so the transition runs
    dlg.classList.add('is-in');
  }

  function dismiss(thenSpin) {
    if (!dlg.open) return;
    state.pending = null;
    saveSession();
    dlg.classList.remove('is-in');
    const done = () => {
      if (dlg.open) dlg.close();
      if (thenSpin) spin();
      else spinBtn.focus({ preventScroll: true });
    };
    if (reducedMotion.matches) done();
    else setTimeout(done, 240);
  }

  revealBtns.forEach((btn) => btn.addEventListener('click', () => {
    const active = btn.getAttribute('aria-expanded') === 'true';
    setReveal(active ? null : btn.dataset.reveal);
  }));
  dlg.addEventListener('click', (e) => {
    if (e.target === dlg) dismiss(false);                       // backdrop
    const act = e.target.closest('[data-act]');
    if (act) dismiss(act.dataset.act === 'again');
  });
  dlg.addEventListener('cancel', (e) => { e.preventDefault(); dismiss(false); });  // Esc

  /* ===== TRACKER + STATS ===== */
  function chipFor(v, { removed }) {
    const li = document.createElement('li');
    li.className = removed ? 'chip is-removed' : 'chip';
    li.dataset.id = v.id;
    li.style.setProperty('--accent', v.color);
    li.title = v.section;
    const ref = document.createElement('span');
    ref.className = 'chip-ref';
    ref.textContent = v.ref;
    li.appendChild(ref);
    const tail = document.createElement('span');
    tail.className = 'chip-tail';
    if (!removed) {
      const count = document.createElement('span');
      count.className = 'chip-count';
      tail.appendChild(count);
    }
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = removed ? 'chip-btn chip-add' : 'chip-btn chip-remove';
    btn.dataset.verse = v.id;
    btn.dataset.do = removed ? 'add' : 'remove';
    btn.setAttribute('aria-label', `${removed ? 'Add' : 'Remove'} ${v.ref} ${removed ? 'to' : 'from'} the wheel`);
    btn.textContent = removed ? 'Add' : '×';
    tail.appendChild(btn);
    li.appendChild(tail);
    return li;
  }

  /* Rebuilds everything that depends on which verses are on the wheel:
     the section toggles, the verse list, and the removed-verses list. */
  function buildTracker() {
    chipGrid.innerHTML = '';
    active.forEach((v) => chipGrid.appendChild(chipFor(v, { removed: false })));

    removedGrid.innerHTML = '';
    verses.filter((v) => state.removed.has(v.id))
      .forEach((v) => removedGrid.appendChild(chipFor(v, { removed: true })));
    removedBox.hidden = state.removed.size === 0;

    sectionGrid.innerHTML = '';
    sections.forEach((sec) => {
      const on = sec.verses.filter((v) => !state.removed.has(v.id)).length;
      const li = document.createElement('li');
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'section-btn';
      btn.dataset.section = sec.name;
      btn.style.setProperty('--accent', sec.color);
      btn.setAttribute('aria-pressed', on === sec.verses.length ? 'true' : on === 0 ? 'false' : 'mixed');
      btn.classList.toggle('is-on', on === sec.verses.length);
      btn.classList.toggle('is-partial', on > 0 && on < sec.verses.length);
      const name = document.createElement('span');
      name.className = 'section-name';
      name.textContent = sec.name;
      const n = document.createElement('span');
      n.className = 'section-count';
      n.textContent = `${on} / ${sec.verses.length}`;
      btn.append(name, n);
      li.appendChild(btn);
      sectionGrid.appendChild(li);
    });
    renderEditors();
  }

  /* Edit controls lock while the wheel spins, and removal stops at the minimum. */
  function renderEditors() {
    const lock = state.spinning;
    const atMin = N <= MIN_ACTIVE;
    chipGrid.querySelectorAll('.chip-remove').forEach((b) => { b.disabled = lock || atMin; });
    removedGrid.querySelectorAll('.chip-add').forEach((b) => { b.disabled = lock; });
    restoreBtn.disabled = lock;
    sectionGrid.querySelectorAll('.section-btn').forEach((b) => {
      const sec = sections.find((s) => s.name === b.dataset.section);
      const onCount = sec.verses.filter((v) => !state.removed.has(v.id)).length;
      const wouldRemove = onCount === sec.verses.length;       // a click removes the section
      b.disabled = lock || (wouldRemove && N - onCount < MIN_ACTIVE);
    });
  }

  function updateWheel(message) {
    applyActive();
    buildTracker();
    drawWheel();
    saveSession();
    render();
    if (message) live.textContent = message;
  }

  function removeVerse(id) {
    if (state.spinning || N <= MIN_ACTIVE || state.removed.has(id)) return;
    const at = active.findIndex((v) => v.id === id);
    state.removed.add(id);
    updateWheel(`${verses[byId.get(id)].ref} removed from the wheel.`);
    /* The clicked button is gone; hand focus to its neighbour so keyboard users keep their place. */
    const next = chipGrid.querySelectorAll('.chip-remove')[Math.min(at, N - 1)];
    if (next && !next.disabled) next.focus({ preventScroll: true });
  }

  function addVerse(id) {
    if (state.spinning || !state.removed.has(id)) return;
    state.removed.delete(id);
    updateWheel(`${verses[byId.get(id)].ref} added to the wheel.`);
  }

  /* A section toggles as a unit: fully on removes it, anything else adds it all back. */
  function toggleSection(name) {
    const sec = sections.find((s) => s.name === name);
    if (!sec || state.spinning) return;
    const refocus = () => {
      const b = [...sectionGrid.querySelectorAll('.section-btn')].find((x) => x.dataset.section === name);
      if (b && !b.disabled) b.focus({ preventScroll: true });
    };
    const onCount = sec.verses.filter((v) => !state.removed.has(v.id)).length;
    if (onCount === sec.verses.length) {
      if (N - onCount < MIN_ACTIVE) return;
      sec.verses.forEach((v) => state.removed.add(v.id));
      updateWheel(`${name} removed from the wheel.`);
      refocus();
    } else {
      sec.verses.forEach((v) => state.removed.delete(v.id));
      updateWheel(`${name} added to the wheel.`);
      refocus();
    }
  }

  function render({ flash } = {}) {
    chipGrid.querySelectorAll('.chip').forEach((li) => {
      const n = state.counts[li.dataset.id] || 0;
      li.classList.toggle('is-hit', n > 0);
      li.querySelector('.chip-count').textContent = n;
      li.setAttribute('aria-label', `${verses[byId.get(li.dataset.id)].ref}: selected ${n} ${n === 1 ? 'time' : 'times'}`);
      li.classList.remove('is-new');
      if (flash === li.dataset.id) {
        void li.offsetWidth;
        li.classList.add('is-new');
      }
    });

    const seen = active.reduce((n, v) => n + (state.counts[v.id] ? 1 : 0), 0);
    $('[data-stat="spins"]').textContent = state.spins;
    $('[data-stat="seen"]').innerHTML = `${seen}<small> / ${N}</small>`;
    $('[data-stat="round"]').textContent = state.round;

    const left = N - seenInRound();
    if (state.mode === 'random') {
      modeNote.textContent = 'Every spin is independent, so the same verse can come up again, even back to back.';
    } else if (left === 0) {
      modeNote.textContent = `Round ${state.round} is complete. The next spin starts round ${state.round + 1}.`;
    } else {
      modeNote.textContent = `No verse repeats until all ${N} have come up. ${left} left in round ${state.round}.`;
    }

    resetBtn.disabled = state.spinning || (state.spins === 0);
    renderEditors();
  }

  /* Reset takes two clicks so a stray tap can't wipe a session. */
  let armTimer = null;
  function disarmReset() {
    clearTimeout(armTimer);
    resetBtn.classList.remove('is-armed');
    resetBtn.textContent = 'Reset session';
  }
  resetBtn.addEventListener('click', () => {
    if (!resetBtn.classList.contains('is-armed')) {
      resetBtn.classList.add('is-armed');
      resetBtn.textContent = 'Click again to confirm';
      armTimer = setTimeout(disarmReset, 3500);
      return;
    }
    disarmReset();
    state.counts = {};
    state.roundSeen = new Set();
    state.round = 1;
    state.spins = 0;
    state.last = null;
    state.pending = null;
    saveSession();
    setReadout(null, { label: 'Ready', mode: 'idle' });
    live.textContent = 'Session reset.';
    render();
  });

  /* ===== MODE + SPEED ===== */
  function setMode(mode) {
    state.mode = mode;
    document.querySelectorAll('.mode-toggle button').forEach((btn) => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    saveSession();
    render();
  }

  function setSpinMs(ms) {
    state.spinMs = ms;
    document.querySelectorAll('.speed-toggle button').forEach((btn) => {
      const active = Number(btn.dataset.ms) === ms;
      btn.classList.toggle('is-active', active);
      btn.setAttribute('aria-pressed', String(active));
    });
    saveSession();
  }

  /* ===== INIT ===== */
  document.addEventListener('DOMContentLoaded', () => {
    loadSession();
    applyActive();
    buildTracker();
    setMode(state.mode);
    setSpinMs(state.spinMs);

    document.querySelectorAll('.mode-toggle button')
      .forEach((btn) => btn.addEventListener('click', () => setMode(btn.dataset.mode)));
    document.querySelectorAll('.speed-toggle button')
      .forEach((btn) => btn.addEventListener('click', () => setSpinMs(Number(btn.dataset.ms))));
    spinBtn.addEventListener('click', spin);
    readout.addEventListener('click', () => { if (readout.classList.contains('is-link')) reopenLast(); });
    readout.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && readout.classList.contains('is-link')) {
        e.preventDefault();
        reopenLast();
      }
    });

    chipGrid.addEventListener('click', (e) => {
      const b = e.target.closest('.chip-remove');
      if (b) removeVerse(b.dataset.verse);
    });
    removedGrid.addEventListener('click', (e) => {
      const b = e.target.closest('.chip-add');
      if (b) addVerse(b.dataset.verse);
    });
    sectionGrid.addEventListener('click', (e) => {
      const b = e.target.closest('.section-btn');
      if (b) toggleSection(b.dataset.section);
    });
    restoreBtn.addEventListener('click', () => {
      if (state.spinning || !state.removed.size) return;
      state.removed.clear();
      updateWheel('All verses are back on the wheel.');
    });

    drawWheel();
    new ResizeObserver(drawWheel).observe(canvas);
    window.addEventListener('themechange', drawWheel);   // repaint the canvas with the new theme's tokens
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawWheel);

    /* A result stays up until dismissed, even across a refresh or a trip Home. */
    if (state.pending) {
      const v = verses[byId.get(state.pending)];
      setReadout(v, { label: v.section, mode: 'final' });
      showResult(v);
    } else if (state.last) {
      const v = verses[byId.get(state.last)];
      setReadout(v, { label: `Last pick · ${v.section}`, mode: 'final' });
    }
  });
})();
