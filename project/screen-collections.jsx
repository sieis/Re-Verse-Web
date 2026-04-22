// Collections (home) screen — list of verse buckets + quiet header

function CollectionsScreen({ theme, fonts, onOpen, onAdd }) {
  const t = theme;
  const totals = COLLECTIONS.map(c => {
    const verses = VERSES.filter(v => v.collection === c.id);
    const mastered = verses.filter(v => MASTERY[v.id] === 'mastered').length;
    return { ...c, count: verses.length, mastered };
  });

  // Prefer a 'learning' verse that's short enough to read at a glance
  const today = VERSES.find(v => MASTERY[v.id] === 'learning' && v.text.length < 150)
             || VERSES.find(v => MASTERY[v.id] === 'learning')
             || VERSES[0];

  return (
    <div style={{
      height: '100%', background: t.paper, color: t.ink,
      position: 'relative', overflow: 'hidden',
      fontFamily: UI_SANS,
    }}>
      {/* paper fiber */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: fiberBg(t.paper[1] === '0'), mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      {/* grain */}
      <div style={{ position: 'absolute', inset: 0, backgroundImage: grainBg(0.28, t.paper[1] === '0'), mixBlendMode: 'overlay', pointerEvents: 'none' }} />

      <div style={{ position: 'relative', padding: '70px 22px 28px', display: 'flex', flexDirection: 'column', gap: 2 }}>
        {/* tiny top label with & mark */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, color: t.muted, fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', fontWeight: 500 }}>
          <AmpMark size={13} color={t.red} />
          <span>Progress &amp; Perfection</span>
        </div>
        <div style={{ fontFamily: fonts.serif, fontSize: 42, lineHeight: 1.02, fontWeight: 400, letterSpacing: -0.8, marginTop: 14, color: t.ink }}>
          Hide His<br/>
          <span style={{ fontStyle: 'italic', color: t.red }}>word</span> in your heart.
        </div>
      </div>

      {/* Today card */}
      <div style={{ position: 'relative', padding: '18px 22px 0' }}>
        <div onClick={() => onOpen(today.id)} style={{
          padding: '18px 20px 20px',
          borderRadius: 18,
          background: t.paperDeep,
          border: `0.5px solid ${t.hairline}`,
          boxShadow: `0 1px 0 ${t.hairline}, 0 12px 28px -20px rgba(0,0,0,0.25)`,
          cursor: 'pointer',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 10, letterSpacing: 1.4, textTransform: 'uppercase', color: t.muted, fontWeight: 600 }}>
            <span>Today · {today.date}</span>
            <span style={{ color: t.ochre }}>{MASTERY[today.id] === 'learning' ? 'Learning' : MASTERY[today.id] === 'mastered' ? 'Mastered' : 'New'}</span>
          </div>
          <div style={{ fontFamily: fonts.serif, fontSize: 20, lineHeight: 1.32, marginTop: 12, color: t.ink, letterSpacing: -0.1 }}>
            {truncate(today.text, 82)}
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginTop: 14 }}>
            <div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 13, color: t.inkSoft }}>— {today.ref}</div>
            <svg width="14" height="10" viewBox="0 0 14 10"><path d="M1 5h11m0 0L8 1m4 4L8 9" stroke={t.red} strokeWidth="1.2" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
        </div>
      </div>

      {/* Collections list */}
      <div style={{ position: 'relative', padding: '28px 22px 24px' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 10 }}>
          <div style={{ fontSize: 11, letterSpacing: 1.4, textTransform: 'uppercase', color: t.muted, fontWeight: 600 }}>Collections</div>
          <div onClick={onAdd} style={{ fontSize: 11, letterSpacing: 1.2, textTransform: 'uppercase', color: t.red, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>+ New</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {totals.map((c, i) => (
            <CollectionCard key={c.id} c={c} theme={t} fonts={fonts} onClick={() => onOpen(c.id, 'list')} index={i} />
          ))}
        </div>
      </div>

      <div style={{ padding: '8px 22px 100px', position: 'relative', fontFamily: MONO, fontSize: 10.5, color: t.muted, letterSpacing: 0.3 }}>
        {VERSES.filter(v => MASTERY[v.id] === 'mastered').length} / {VERSES.length} verses memorized this year.
      </div>
    </div>
  );
}

function CollectionCard({ c, theme, fonts, onClick, index }) {
  const t = theme;
  const pct = Math.round((c.mastered / c.count) * 100);
  // pick an accent per card
  const accent = index === 0 ? t.red : index === 1 ? t.ochre : t.sage;

  return (
    <div onClick={onClick} style={{
      position: 'relative', padding: '16px 18px 18px',
      background: t.paperDeep,
      borderRadius: 16,
      border: `0.5px solid ${t.hairline}`,
      cursor: 'pointer', overflow: 'hidden',
    }}>
      {/* tiny texture swatch on left */}
      <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 3, background: accent }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{ fontFamily: fonts.serif, fontSize: 22, letterSpacing: -0.3, color: t.ink, fontWeight: 500 }}>{c.name}</div>
          <div style={{ fontFamily: MONO, fontSize: 10, color: t.muted, letterSpacing: 0.3 }}>{c.subtitle}</div>
        </div>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: t.muted, letterSpacing: 0.3 }}>{c.mastered}/{c.count}</div>
      </div>
      {/* progress ticks row — one tick per verse */}
      <div style={{ display: 'flex', gap: 3, marginTop: 4 }}>
        {Array.from({ length: c.count }).map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 1,
            background: i < c.mastered ? accent : t.faded,
          }} />
        ))}
      </div>
      <div style={{ fontFamily: fonts.serif, fontStyle: 'italic', fontSize: 13, color: t.inkSoft, marginTop: 12, letterSpacing: -0.1 }}>
        {previewForCollection(c.id)}
      </div>
    </div>
  );
}

function previewForCollection(id) {
  const first = VERSES.find(v => v.collection === id);
  return first ? `"${first.text.split(' ').slice(0, 7).join(' ')}…"` : '';
}

function truncate(s, n) {
  if (s.length <= n) return s;
  return s.slice(0, n).replace(/\s+\S*$/, '') + '…';
}

Object.assign(window, { CollectionsScreen });
