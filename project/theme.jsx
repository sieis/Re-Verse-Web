// Design system for P&P Memory
// Palette: warm earthy (clay red, ochre, sage) on cream + deep ink night mode.

const PALETTES = {
  default: {
    name: 'Clay & Cream',
    light: {
      paper:     '#F2E9D8',   // warm cream
      paperDeep: '#E8DDC6',   // shadowed cream
      ink:       '#1E1A17',   // deep ink
      inkSoft:   '#4A3F36',   // warm brown
      muted:     '#8A7A68',   // dusty
      hairline:  'rgba(30,26,23,0.12)',
      red:       '#C44A2E',   // P&P clay red
      ochre:     '#B88A3C',
      sage:      '#6F7A5A',
      faded:     'rgba(30,26,23,0.14)',
    },
    dark: {
      paper:     '#0E0C0A',
      paperDeep: '#16120F',
      ink:       '#EDE4D2',
      inkSoft:   '#B8A88F',
      muted:     '#7A6C5A',
      hairline:  'rgba(237,228,210,0.10)',
      red:       '#D95A3D',
      ochre:     '#D1A158',
      sage:      '#92A07A',
      faded:     'rgba(237,228,210,0.12)',
    },
  },
  monastic: {
    name: 'Monastic',
    light: {
      paper: '#ECE7DA', paperDeep: '#DDD6C2', ink: '#181D1A', inkSoft: '#3B4238',
      muted: '#6F7668', hairline: 'rgba(24,29,26,0.12)',
      red: '#8F3A2E', ochre: '#8A7A3A', sage: '#4C5A42',
      faded: 'rgba(24,29,26,0.14)',
    },
    dark: {
      paper: '#0B0E0C', paperDeep: '#111613', ink: '#E4E2D5', inkSoft: '#A79F89',
      muted: '#6F6A5A', hairline: 'rgba(228,226,213,0.10)',
      red: '#B4523F', ochre: '#C59A5A', sage: '#7D8A68',
      faded: 'rgba(228,226,213,0.12)',
    },
  },
  dusty: {
    name: 'Dusty',
    light: {
      paper: '#F1E6E0', paperDeep: '#E5D6CE', ink: '#221A19', inkSoft: '#4E3E3B',
      muted: '#8D7872', hairline: 'rgba(34,26,25,0.12)',
      red: '#B05040', ochre: '#B5824F', sage: '#7E8A78',
      faded: 'rgba(34,26,25,0.14)',
    },
    dark: {
      paper: '#110D0C', paperDeep: '#18120F', ink: '#ECDDD6', inkSoft: '#B8A59C',
      muted: '#80685F', hairline: 'rgba(236,221,214,0.10)',
      red: '#D06A54', ochre: '#D0A072', sage: '#98A692',
      faded: 'rgba(236,221,214,0.12)',
    },
  },
};

const FONT_STACKS = {
  sectra: { // GT Sectra vibe — warm humanist serif
    serif: '"Newsreader", "Source Serif 4", Georgia, serif',
    label: 'Newsreader',
  },
  literata: {
    serif: '"Literata", "Source Serif 4", Georgia, serif',
    label: 'Literata',
  },
  fraunces: {
    serif: '"Fraunces", "Source Serif 4", Georgia, serif',
    label: 'Fraunces',
  },
};

const UI_SANS = '"Inter Tight", -apple-system, system-ui, sans-serif';
const MONO   = '"JetBrains Mono", ui-monospace, monospace';

// Grain texture — SVG fractal noise, returned as a data URL
function grainBg(opacity = 0.22, dark = false) {
  // layered: coarse grain + fine paper fiber
  const color = dark ? '255,255,255' : '0,0,0';
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'>
      <filter id='n'>
        <feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch' seed='7'/>
        <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 ${opacity} 0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#n)' opacity='1'/>
    </svg>`.replace(/\s+/g, ' ');
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

function fiberBg(dark = false) {
  const svg = `
    <svg xmlns='http://www.w3.org/2000/svg' width='520' height='520'>
      <filter id='f'>
        <feTurbulence type='fractalNoise' baseFrequency='0.012 0.09' numOctaves='2' stitchTiles='stitch' seed='3'/>
        <feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.10 0'/>
      </filter>
      <rect width='100%' height='100%' filter='url(#f)'/>
    </svg>`.replace(/\s+/g, ' ');
  return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`;
}

// Ampersand mark — subtle
function AmpMark({ size = 22, color = 'currentColor' }) {
  return (
    <span style={{
      fontFamily: '"Fraunces", "Playfair Display", Georgia, serif',
      fontWeight: 900, fontStyle: 'italic',
      fontSize: size, lineHeight: 1, color,
      display: 'inline-block',
    }}>&amp;</span>
  );
}

Object.assign(window, {
  PALETTES, FONT_STACKS, UI_SANS, MONO,
  grainBg, fiberBg, AmpMark,
});
