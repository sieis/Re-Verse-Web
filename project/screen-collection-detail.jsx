// Collection detail — verse list for a single bucket

function CollectionDetail({ collectionId, theme, fonts, onBack, onOpen }) {
  const t = theme;
  const col = COLLECTIONS.find(c => c.id === collectionId);
  const verses = VERSES.filter(v => v.collection === collectionId);
  const mastered = verses.filter(v => MASTERY[v.id] === 'mastered').length;
  const accent = collectionId === 'foundation' ? t.red : collectionId === 'freedom' ? t.ochre : t.sage;

  return (
    <div style={{
      height: '100%', background: t.paper, color: t.ink,
      position: 'relative', overflow: 'auto',
      fontFamily: UI_SANS,
    }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: fiberBg(), mixBlendMode: 'multiply', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundImage: grainBg(0.28), mixBlendMode: 'overlay', pointerEvents: 'none' }} />

      {/* nav */}
      <div style={{ position: 'relative', padding: '60px 22px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div onClick={onBack} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: t.inkSoft, fontSize: 13 }}>
          <svg width="8" height="13" viewBox="0 0 8 13"><path d="M7 1L1 6.5 7 12" stroke={t.inkSoft} strokeWidth="1.3" fill="none" strokeLinecap="round" strokeLinejoin="round"/></svg>
          <span>All</span>
        </div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <AmpMark size={12} color={t.red} />
        </div>
      </div>

      {/* header */}
      <div style={{ position: 'relative', padding: '18px 22px 8px' }}>
        <div style={{ fontFamily: MONO, fontSize: 10, letterSpacing: 1.4, color: accent, textTransform: 'uppercase', fontWeight: 600 }}>
          Collection · {col.subtitle}
        </div>
        <div style={{ fontFamily: fonts.serif, fontSize: 48, letterSpacing: -0.8, marginTop: 8, color: t.ink, lineHeight: 1 }}>
          {col.name}
        </div>
        <div style={{ marginTop: 18, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ flex: 1, height: 2, background: t.faded, borderRadius: 1, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${(mastered/verses.length)*100}%`, background: accent }}/>
          </div>
          <div style={{ fontFamily: MONO, fontSize: 10.5, color: t.muted, letterSpacing: 0.3 }}>
            {mastered} / {verses.length}
          </div>
        </div>
      </div>

      {/* verses */}
      <div style={{ position: 'relative', padding: '20px 0 120px' }}>
        {verses.map((v, i) => (
          <VerseRow key={v.id} v={v} theme={t} fonts={fonts} accent={accent} onClick={() => onOpen(v.id)} />
        ))}
      </div>
    </div>
  );
}

function VerseRow({ v, theme, fonts, accent, onClick }) {
  const t = theme;
  const state = MASTERY[v.id] || 'new';
  const dotFill = state === 'mastered' ? accent : state === 'learning' ? t.ochre : 'transparent';
  const dotBorder = state === 'new' ? t.muted : 'transparent';
  const labelColor = t.ink;

  return (
    <div onClick={onClick} style={{
      padding: '18px 22px',
      borderTop: `0.5px solid ${t.hairline}`,
      cursor: 'pointer',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      {/* indicator */}
      <div style={{
        width: 14, height: 14, borderRadius: 7,
        background: dotFill,
        border: state === 'new' ? `1px dashed ${dotBorder}` : 'none',
        flexShrink: 0,
        position: 'relative',
      }}>
        {state === 'mastered' && (
          <svg width="10" height="10" viewBox="0 0 10 10" style={{ position: 'absolute', top: 2, left: 2 }}>
            <path d="M1.5 5l2.3 2.3L8.5 2.5" stroke={t.paper} strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        )}
      </div>

      <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'baseline', gap: 12 }}>
        <div style={{ fontFamily: MONO, fontSize: 10.5, color: t.muted, letterSpacing: 0.3, width: 46, flexShrink: 0 }}>{v.date}</div>
        <div style={{
          fontFamily: fonts.serif, fontSize: 19, lineHeight: 1.2,
          color: labelColor, letterSpacing: -0.15, flex: 1, minWidth: 0,
        }}>
          {v.ref}
        </div>
        {v.theme && <div style={{ fontFamily: MONO, fontSize: 9.5, color: accent, letterSpacing: 1.6, fontWeight: 600, flexShrink: 0 }}>{v.theme}</div>}
      </div>

      <svg width="7" height="12" viewBox="0 0 7 12" style={{ flexShrink: 0 }}>
        <path d="M1 1l5 5-5 5" stroke={t.muted} strokeWidth="1.1" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  );
}

Object.assign(window, { CollectionDetail });
