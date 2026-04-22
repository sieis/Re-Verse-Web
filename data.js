// ─────────────────────────────────────────────────────────────────
//  P&P Memory — Verse Data
//  Edit this file to add new verses, collections, or update mastery.
// ─────────────────────────────────────────────────────────────────

// Each verse needs:
//   id         – unique slug (lowercase, no spaces)
//   ref        – scripture reference (e.g. "John 3:16")
//   date       – week label shown in the list (e.g. "Jan 05")
//   theme      – one-word theme tag shown in the list (can be "")
//   text       – full ESV verse text
//   collection – must match a COLLECTIONS id below

const VERSES = [

  // ── FOUNDATION ─────────────────────────────────────────────────
  { id: 'ps119-11',  ref: 'Psalm 119:11',        date: 'Jan 05', theme: 'WHY',         collection: 'foundation',
    text: 'I have stored up your word in my heart, that I might not sin against you.' },

  { id: 'ps19-14',   ref: 'Psalm 19:14',          date: 'Jan 12', theme: 'HOW',         collection: 'foundation',
    text: 'Let the words of my mouth and the meditation of my heart be acceptable in your sight, O LORD, my rock and my redeemer.' },

  { id: 'col3-12',   ref: 'Colossians 3:12–14',   date: 'Jan 19', theme: 'ARMOR',       collection: 'foundation',
    text: 'Put on then, as God’s chosen ones, holy and beloved, compassionate hearts, kindness, humility, meekness, and patience, bearing with one another and, if one has a complaint against another, forgiving each other; as the Lord has forgiven you, so you also must forgive. And above all these put on love, which binds everything together in perfect harmony.' },

  { id: '2co5-17',   ref: '2 Corinthians 5:17',   date: 'Jan 26', theme: 'ASSURANCE',   collection: 'foundation',
    text: 'Therefore, if anyone is in Christ, he is a new creation. The old has passed away; behold, the new has come.' },

  { id: '1jn4-4',    ref: '1 John 4:4',            date: 'Feb 02', theme: 'RESILIANCE',  collection: 'foundation',
    text: 'Little children, you are from God and have overcome them, for he who is in you is greater than he who is in the world.' },

  { id: 'ps27-1',    ref: 'Psalm 27:1',            date: 'Feb 09', theme: 'DAUNTLESS',   collection: 'foundation',
    text: 'The LORD is my light and my salvation; whom shall I fear? The LORD is the stronghold of my life; of whom shall I be afraid?' },

  { id: 'isa41-10',  ref: 'Isaiah 41:10',          date: 'Feb 16', theme: 'CONFIDENCE',  collection: 'foundation',
    text: 'Fear not, for I am with you; be not dismayed, for I am your God; I will strengthen you, I will help you, I will uphold you with my righteous right hand.' },

  { id: 'jer29-11',  ref: 'Jeremiah 29:11',        date: 'Feb 23', theme: 'HOPE',        collection: 'foundation',
    text: 'For I know the plans I have for you, declares the LORD, plans for welfare and not for evil, to give you a future and a hope.' },

  // ── FREEDOM ────────────────────────────────────────────────────
  { id: 'rom6-6',    ref: 'Romans 6:6',            date: 'Mar 02', theme: 'RELEASE',     collection: 'freedom',
    text: 'We know that our old self was crucified with him in order that the body of sin might be brought to nothing, so that we would no longer be enslaved to sin.' },

  { id: 'rom8-1',    ref: 'Romans 8:1',            date: 'Mar 09', theme: 'RELIEF',      collection: 'freedom',
    text: 'There is therefore now no condemnation for those who are in Christ Jesus.' },

  { id: 'gal5-1',    ref: 'Galatians 5:1',         date: 'Mar 16', theme: 'PAROLE',      collection: 'freedom',
    text: 'For freedom Christ has set us free; stand firm therefore, and do not submit again to a yoke of slavery.' },

  { id: '1pe2-1',    ref: '1 Peter 2:1–3',    date: 'Mar 23', theme: 'RENEW',       collection: 'freedom',
    text: 'So put away all malice and all deceit and hypocrisy and envy and all slander. Like newborn infants, long for the pure spiritual milk, that by it you may grow up into salvation—if indeed you have tasted that the Lord is good.' },

  { id: 'jn8-36',    ref: 'John 8:36',             date: 'Mar 30', theme: 'FINALITY',    collection: 'freedom',
    text: 'So if the Son sets you free, you will be free indeed.' },

  { id: 'col1-13',   ref: 'Colossians 1:13–14', date: 'Apr 06', theme: 'DELIVERANCE', collection: 'freedom',
    text: 'He has delivered us from the domain of darkness and transferred us to the kingdom of his beloved Son, in whom we have redemption, the forgiveness of sins.' },

  { id: 'ps37-30',   ref: 'Psalm 37:30–31',   date: 'Apr 13', theme: '',            collection: 'freedom',
    text: 'The mouth of the righteous utters wisdom, and his tongue speaks justice. The law of his God is in his heart; his steps do not slip.' },

  { id: '2ti1-7',    ref: '2 Timothy 1:7',         date: 'Apr 20', theme: '',            collection: 'freedom',
    text: 'For God gave us a spirit not of fear but of power and love and self-control.' },

  // ── GOD'S PRESENCE ─────────────────────────────────────────────
  { id: 'ps23-4',    ref: 'Psalm 23:4',            date: 'Apr 27', theme: '',            collection: 'presence',
    text: 'Even though I walk through the valley of the shadow of death, I will fear no evil, for you are with me; your rod and your staff, they comfort me.' },

  { id: 'jn8-31',    ref: 'John 8:31–32',     date: 'May 04', theme: '',            collection: 'presence',
    text: 'If you abide in my word, you are truly my disciples, and you will know the truth, and the truth will set you free.' },

  { id: 'php4-6',    ref: 'Philippians 4:6–7', date: 'May 11', theme: '',           collection: 'presence',
    text: 'Do not be anxious about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God. And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.' },

  { id: '1th5-16',   ref: '1 Thessalonians 5:16–18', date: 'May 18', theme: '',    collection: 'presence',
    text: 'Rejoice always, pray without ceasing, give thanks in all circumstances; for this is the will of God in Christ Jesus for you.' },

  { id: '2co1-3',    ref: '2 Corinthians 1:3–4', date: 'May 25', theme: '',        collection: 'presence',
    text: 'Blessed be the God and Father of our Lord Jesus Christ, the Father of mercies and God of all comfort, who comforts us in all our affliction, so that we may be able to comfort those who are in any affliction, with the comfort with which we ourselves are comforted by God.' },

  { id: 'ps139-7',   ref: 'Psalm 139:7–8',    date: 'Jun 01', theme: '',            collection: 'presence',
    text: 'Where shall I go from your Spirit? Or where shall I flee from your presence? If I ascend to heaven, you are there! If I make my bed in Sheol, you are there!' },

  { id: 'isa43-2',   ref: 'Isaiah 43:2',           date: 'Jun 08', theme: '',            collection: 'presence',
    text: 'When you pass through the waters, I will be with you; and through the rivers, they shall not overwhelm you; when you walk through fire you shall not be burned, and the flame shall not consume you.' },

  { id: 'heb13-5',   ref: 'Hebrews 13:5–6',   date: 'Jun 15', theme: '',            collection: 'presence',
    text: 'Keep your life free from love of money, and be content with what you have, for he has said, “I will never leave you nor forsake you.” So we can confidently say, “The Lord is my helper; I will not fear; what can man do to me?”' },

];

// Mastery state — used as the default if no localStorage data exists.
// Override by tapping the mastery circle on any verse screen.
// Values: 'mastered' | 'learning' | 'new'
const MASTERY = {
  'ps119-11':  'mastered',
  'ps19-14':   'mastered',
  'col3-12':   'mastered',
  '2co5-17':   'mastered',
  '1jn4-4':    'mastered',
  'ps27-1':    'mastered',
  'isa41-10':  'mastered',
  'jer29-11':  'mastered',
  'rom6-6':    'mastered',
  'rom8-1':    'mastered',
  'gal5-1':    'mastered',
  '1pe2-1':    'mastered',
  'jn8-36':    'mastered',
  'col1-13':   'mastered',
  'ps37-30':   'learning',
  '2ti1-7':    'learning',
  'ps23-4':    'learning',
  'jn8-31':    'new',
  'php4-6':    'new',
  '1th5-16':   'new',
  '2co1-3':    'new',
  'ps139-7':   'new',
  'isa43-2':   'new',
  'heb13-5':   'new',
};

// Collections — add new ones here by pushing to this array.
// hueShift is unused in the web version (accent colors are fixed per index).
const COLLECTIONS = [
  { id: 'foundation', name: 'Foundation',      subtitle: 'Jan — Feb' },
  { id: 'freedom',    name: 'Freedom',         subtitle: 'Mar — Apr' },
  { id: 'presence',   name: "God’s Presence", subtitle: 'Apr — Jun' },
];
