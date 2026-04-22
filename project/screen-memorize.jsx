// Main memorization screen — full-bleed verse, tap reveals (or hides) words

const { useState, useEffect, useMemo, useRef } = React;

function MemorizeScreen({ verseId, theme, fonts, tapMode, onBack, wordsPerTap = 5, startMode = 'blank' }) {
  const t = theme;
  const v = VERSES.find(x => x.id === verseId) || VERSES[0];
  const col = COLLECTIONS.find(c => c.id === v.collection);
  const accent = v.collection === 'foundation' ? t.red : v.collection === 'freedom' ? t.ochre : t.sage;

  const tokens = useMemo(() => tokenize(v.text), [v.id]);
  const wordIndices = useMemo(() => tokens.map((tk, i) => tk.kind === 'word' ? i : -1).filter(i => i >= 0), [tokens]);

  // direction: 'reveal' starts blank (all hidden), each tap reveals `wordsPerTap` words.
  //            'hide' starts full, each tap hides words.
  const direction = startMode === 'full' ? 'hide' : 'reveal';

  const initialHidden = () => direction === 'reveal' ? new Set(wordIndices) : new Set();
  const [hidden, setHidden] = useState(initialHidden);
  const [taps, setTaps] = useState(0);

  useEffect(() => {
    setHidden(direction === 'reveal' ? new Set(wordIndices) : new Set());
    setTaps(0);
  }, [v.id, direction, wordIndices.length]);

  const visibleCount = wordIndices.length - hidden.size;
  const pct = wordIndices.length
    ? Math.round((direction === 'reveal' ? visibleCount : hidden.size) / wordIndices.length * 100)
    : 0;
  const done = direction === 'reveal' ? hidden.size === 0 : hidden.size >= wordIndices.length;

  function handleTap() {
    if (done) {
      setHidden(direction === 'reveal' ? new Set(wordIndices) : new Set());
      setTaps(0);
      return;
    }
    setHidden(prev => {
      const next = new Set(prev);
      if (direction === 'reveal') {
        // reveal: pick words currently hidden
        const pool = [...next];
        if (tapMode === 'progressive') {
          // reveal from start of verse
          pool.sort((a, b) => a - b);
          for (let k = 0; k < wordsPerTap && pool.length; k++) next.delete(pool.shift());
        } else {
          shuffle(pool);
          for (let k = 0; k < wordsPerTap && pool.length; k++) next.delete(pool.pop());
        }
      } else {
        // hide: pick words currently visible
        const pool = wordIndices.filter(i => !next.has(i));
        if (tapMode === 'progressive') {
          for (let k = 0; k < wordsPerTap && pool.length; k++) next.add(pool.pop());
        } else {
          shuffle(pool);
          for (let k = 0; k < wordsPerTap && pool.length; k++) next.add(pool.pop());
        }
      }
      return next;
    });
    setTaps(x => x + 1);
  }

  function handleReset(e) {
    e.stopPropagation();
    setHidden(direction === 'reveal' ? new Set(wordIndices) : new Set());
    setTaps(0);
  }

  // Cozy, Instagram-style sizing: short verses take up the whole screen.
  const fontSize = instagramSizeFor(v.text.length);

  return (
    <div
      onClick={handleTap}
      style={{
        height: '100%', background: t.paper, color: t.ink,
        position: 'relative', overflow: 'hidden',
        fontFamily: UI_SANS, cursor: 'pointer',
        userSelect: 'none', WebkitUserSelect: 'none',
      }}
    >
      <div style={{ position: 'absolute', inset: 0, backgroundImage: fiberBg(), mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: grainBg(0.32), mixBlendMode: 'overlay', pointerEvents: 'none' }} />
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: `radial-gradient(ellipse at 50% 40%, transparent 45%, ${t.paper === '#0E0C0A' || t.paper === '#110D0C' ? 'rgba(0,0,0,0.55)' : 'rgba(70,50,30,0.10)'} 100%)`,
      }} />

      {/* top chrome */}
      <div style={{ position: 'absolute', top: 56, left: 0, right: 0, padding: '0 22px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 3 }}
           onClick={e => e.stopPropagation()}>
        <div onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: t.inkSoft, fontSize: 13 }}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={t.inkSoft} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: t.muted }}>{col?.name || ''}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, color: t.muted }}>
            {pct.toString().padStart(2, '0')}%
          </div>
          <div onClick={handleReset} style={{ cursor: 'pointer' }}>
            <svg width="15" height="15" viewBox="0 0 15 15">
              <path d="M13 7.5a5.5 5.5 0 11-1.6-3.9M13 2v3.5h-3.5" stroke={t.inkSoft} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>

      {/* progress hairline */}
      <div style={{ position: 'absolute', top: 112, left: 22, right: 22, height: 1, background: t.faded, zIndex: 2 }}>
        <div style={{ height: '100%', background: accent, width: `${pct}%`, transition: 'width 420ms cubic-bezier(.2,.7,.2,1)' }} />
      </div>

      {/* verse body — cozy, large */}
      <div style={{
        position: 'absolute', top: 126, bottom: 118, left: 0, right: 0,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '8px 24px',
        zIndex: 1,
      }}>
        <div style={{
          fontFamily: fonts.serif,
          fontSize,
          lineHeight: 1.12,
          color: t.ink,
          letterSpacing: -0.6,
          fontWeight: 400,
          textWrap: 'balance',
          textAlign: 'left',
          hyphens: 'none',
          width: '100%',
        }}>
          {tokens.map((tk, i) => {
            if (tk.kind !== 'word') return <span key={i}>{tk.text}</span>;
            const isHidden = hidden.has(i);
            return <WordSpan key={i} text={tk.text} hidden={isHidden} mode={tapMode} theme={t} accent={accent} />;
          })}
        </div>
      </div>

      {/* bottom citation + tap hint */}
      <div style={{ position: 'absolute', bottom: 46, left: 0, right: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10, zIndex: 3 }}
           onClick={e => e.stopPropagation()}>
        <div style={{ width: 30, height: 0.5, background: t.hairline }} />
        <div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 15, color: t.inkSoft, letterSpacing: -0.1 }}>
          {v.ref} <span style={{ color: t.muted, fontStyle: 'normal', fontFamily: MONO, fontSize: 10, letterSpacing: 0.5, marginLeft: 6 }}>ESV</span>
        </div>
        <div onClick={handleTap} style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 2, textTransform: 'uppercase', color: t.muted, cursor: 'pointer', marginTop: 4 }}>
          {done
            ? 'Tap to reset'
            : direction === 'reveal'
              ? `Tap to reveal · ${taps}`
              : `Tap to hide · ${taps}`}
        </div>
      </div>
    </div>
  );
}

function WordSpan({ text, hidden, mode, theme, accent }) {
  const t = theme;
  if (hidden && mode === 'first-letter') {
    const first = text[0];
    const rest = text.slice(1);
    return (
      <span style={{ whiteSpace: 'nowrap' }}>
        <span>{first}</span>
        <span style={{
          display: 'inline-block',
          width: `${Math.max(0.3, rest.length * 0.42)}em`,
          borderBottom: `1px solid ${t.faded}`,
          verticalAlign: 'baseline',
          height: '0.95em',
          marginLeft: 1,
          transform: 'translateY(-0.08em)',
        }} />
      </span>
    );
  }
  if (hidden && mode === 'blanks') {
    return (
      <span style={{
        display: 'inline-block',
        width: `${Math.max(0.4, text.length * 0.42)}em`,
        borderBottom: `1px solid ${t.faded}`,
        height: '0.95em',
        verticalAlign: 'baseline',
        transform: 'translateY(-0.08em)',
      }} />
    );
  }
  return (
    <span style={{
      position: 'relative',
      transition: 'color 420ms ease, background-size 420ms ease',
      color: hidden ? 'transparent' : 'inherit',
      backgroundImage: hidden ? `linear-gradient(90deg, ${t.faded}, ${t.faded})` : 'none',
      backgroundSize: hidden ? '100% 34%' : '0 0',
      backgroundRepeat: 'no-repeat',
      backgroundPosition: '0 62%',
      padding: hidden ? '0 0.05em' : 0,
      borderRadius: 2,
    }}>
      {text}
    </span>
  );
}

function tokenize(s) {
  const out = [];
  const re = /(\s+|[^\s\w\u2018\u2019\u2014\u2013'-]+|[\w\u2018\u2019\u2014\u2013'-]+)/g;
  let m;
  while ((m = re.exec(s)) !== null) {
    const tk = m[0];
    if (/^\s+$/.test(tk)) out.push({ kind: 'ws', text: tk });
    else if (/^[\w\u2018\u2019\u2014\u2013'-]+$/.test(tk) && /[\w]/.test(tk)) out.push({ kind: 'word', text: tk });
    else out.push({ kind: 'punct', text: tk });
  }
  return out;
}

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Instagram-style cozy sizing — short verses fill the screen, only shrink for long passages.
function instagramSizeFor(len) {
  if (len < 60)   return 64;
  if (len < 100)  return 54;
  if (len < 150)  return 44;
  if (len < 220)  return 36;
  if (len < 300)  return 30;
  if (len < 400)  return 26;
  if (len < 500)  return 22;
  return 19;
}

Object.assign(window, { MemorizeScreen });
