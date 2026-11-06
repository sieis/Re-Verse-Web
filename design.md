# Design System: Re-Verse (Scripture Memory)

Hand this file to another project as the visual spec. It describes the look, the tokens, and the component patterns. Content (verses, copy) is not part of it.

## Character

Calm, light, soft. A warm off-white canvas, a blue-slate primary, and one clay accent used sparingly. Rounded corners everywhere, gentle shadows, no hard edges. Scripture and headings use a warm serif; everything else uses Inter. Light is the default theme, dark is opt-in through a header toggle. The site is a single static page set (plain HTML, one `styles.css`, vanilla JS, no framework, no build step).

Guiding rules:
- Color is muted. Every colored fill holds 4.5:1 against white text.
- Clay is an accent, never a surface. Use it for eyebrows, the wheel pointer, and small highlights.
- One accent color per content group (a "section color"). Cards in that group share it.
- Motion is short and eased. Respect `prefers-reduced-motion`.
- Pill shapes for controls, large radii for cards.

## Fonts

- **Sans:** Inter variable (weights 100 to 900), Latin subset, self-hosted as `fonts/inter-latin-wght-normal.woff2`, `font-display: swap`, preloaded. Fallback: `-apple-system, system-ui, sans-serif`. License: OFL.
- **Serif (headings, verse text, readouts):** system stack, no download.
  `'Iowan Old Style', 'Palatino Linotype', Palatino, 'Book Antiqua', Georgia, serif`

Type scale:

| Role | Font | Size | Weight | Notes |
|---|---|---|---|---|
| H1 | serif | `clamp(34px, 6vw, 54px)` | 600 | line-height 1.1, letter-spacing -0.6px |
| Panel title (H2) | serif | `clamp(26px, 4vw, 36px)` | 600 | line-height 1.15, letter-spacing -0.3px |
| Popup title | serif | `clamp(30px, 6vw, 44px)` | 600 | line-height 1.1, letter-spacing -0.4px |
| Section head | serif | 30px | 600 | letter-spacing -0.2px |
| Card name | serif | 19 to 20px | 600 | line-height 1.2 |
| Readout / big reference | serif | 32px | 600 | line-height 1.15 |
| Scripture body | serif | 17px, line-height 1.65 | 400 | color `--body` |
| Hint text | serif | `clamp(21px, 3.6vw, 28px)`, line-height 1.35 | 400 | verse variant: `clamp(18px, 2.6vw, 22px)`, line-height 1.6 |
| Lead paragraph | sans | 16px, line-height 1.55 | 400 | max-width 46ch, color `--body` |
| Button / control | sans | 14px | 600 | |
| Eyebrow / label | sans | 12px | 600 | uppercase, letter-spacing 1.1 to 1.2px |
| Small date label | sans | 11px | 600 | uppercase, letter-spacing 1px, color `--muted` |
| Stat value | sans | 32px | 600 | `tabular-nums`, letter-spacing -0.4px |
| Footnote | sans | 11 to 13px | 400 | color `--muted`, line-height 1.5 to 1.6 |

Base: `-webkit-font-smoothing: antialiased`. Eyebrows use `--clay-text`; labels inside cards use `--body`.

## Color tokens

All color lives in two token blocks in `styles.css`. Every rule reads from them, so recoloring the site means editing only those blocks.

### Light (default, `:root`)

```css
--primary: #3f5f82;          /* buttons, active states */
--primary-hover: #334e6c;
--on-primary: #ffffff;
--primary-text: #3f5f82;     /* primary as text on canvas */
--primary-soft: rgba(63, 95, 130, 0.10);
--clay: #c47a4e;             /* accent: pointer, hub dot, highlights */
--clay-text: #985527;        /* clay as readable text */

--canvas: #faf8f5;           /* page background */
--surface: #ffffff;          /* cards, dialog */
--surface-2: #f2eee8;        /* sunken: segmented tracks, hub ring, chips */
--overlay: rgba(38, 48, 59, 0.46);

--ink: #26303b;              /* headings, primary text */
--body: #4a5562;             /* paragraphs */
--muted: #646d7a;            /* meta, notices */

--hairline: #e6e0d6;
--hairline-strong: #cfc7ba;
--shadow-sm: 0 1px 2px rgba(38,48,59,.06), 0 1px 3px rgba(38,48,59,.05);
--shadow-md: 0 4px 14px rgba(38,48,59,.08), 0 2px 4px rgba(38,48,59,.04);
--shadow-lg: 0 18px 48px rgba(38,48,59,.18);

/* section colors, one per group of content */
--sec-1: #4f7396;  --sec-2: #3f8079;  --sec-3: #a8623a;
--sec-4: #7d5c93;  --sec-5: #547a5a;  --sec-6: #a55d76;
--sec-7: #5f68a3;  /* spare */
```

### Dark (`:root[data-theme="dark"]`, override only what changes)

```css
--primary: #8fb0d3;  --primary-hover: #a6c2df;  --on-primary: #11202f;
--primary-text: #9dbbdc;  --primary-soft: rgba(143,176,211,.14);
--clay: #e0a07a;  --clay-text: #e6ae8b;

--canvas: #14181c;  --surface: #1d2228;  --surface-2: #262c33;
--overlay: rgba(6,9,12,.7);

--ink: #eceff3;  --body: #b6bec9;  --muted: #909aa7;

--hairline: #2d343c;  --hairline-strong: #414a54;
--shadow-sm: 0 1px 2px rgba(0,0,0,.4);
--shadow-md: 0 4px 14px rgba(0,0,0,.35);
--shadow-lg: 0 18px 48px rgba(0,0,0,.55);

--sec-1: #5d82a7;  --sec-2: #4a9189;  --sec-3: #b8704a;
--sec-4: #8d6ba4;  --sec-5: #628a69;  --sec-6: #b56a85;  --sec-7: #6f79b6;
```

To adapt to a new brand: swap `--primary` (and its hover, soft, and dark-mode counterparts), `--clay`, the warm neutrals in `--canvas`/`--surface-2`/`--hairline`, and the `--sec-*` set. Keep the contrast rules: white text on every `--sec-*` at 4.5:1 or better, `--primary-text` and `--clay-text` readable on `--canvas`.

## Spacing, shape, motion

```css
/* 8px base ladder */
--sp-xxxs: 4px;  --sp-xxs: 8px;  --sp-xs: 16px;  --sp-sm: 24px;
--sp-md: 32px;   --sp-lg: 48px;  --sp-xl: 64px;  --sp-xxl: 96px;

/* radii */
--r-sm: 10px;  --r-md: 14px;  --r-lg: 20px;  --r-xl: 28px;  --r-pill: 999px;

--ease-out: cubic-bezier(0.2, 0.65, 0.3, 1);
```

Radius usage: pills for buttons, toggles, segmented controls; `--r-md` for stat tiles and embedded forms; `--r-lg` for cards; `--r-xl` for modal cards.

Motion: hover transitions 0.15 to 0.2s with `--ease-out`; accordion and card height 0.32 to 0.36s; modal enter 0.26s opacity plus 0.38s transform; theme color change 0.25s. Under `prefers-reduced-motion: reduce`, all animation and transition durations collapse to 0.001ms.

## Layout

- Single centered column: `.wrap { max-width: 900px; margin: 0 auto; padding: 48px 16px 96px; }`. The wheel page widens to 1080px.
- Page head: a flex row (eyebrow on the left, actions on the right, 32px below), then the H1 and a one-line lead paragraph. 64px below the head.
- Grids use `repeat(auto-fill, minmax(N, 1fr))` with a 16px gap: theme cards `220px`, verse cards `260px`, chips `230px`, stat tiles `repeat(auto-fit, minmax(120px, 1fr))` with an 8px gap.
- Under 420px: theme grid goes to two columns, verse grid to one, segmented buttons tighten to 12px horizontal padding.
- Footer: centered row of 40px round icon links, top hairline, 64px top margin.

## Components

### Eyebrow
12px, 600, uppercase, 1.2px tracking, `--clay-text`. Sits above titles and as the site label in the header.

### Pill button (outlined)
`inline-flex`, 10px 18px padding, 14px/600, `--surface` background, 1px `--hairline-strong` border, `--shadow-sm`, fully rounded. Hover: border becomes `--primary`, text becomes `--primary-text`. Active or armed: filled `--primary`, text `--on-primary`, no shadow. Disabled: 0.35 to 0.45 opacity, `not-allowed` cursor. The icon-only variant (`.nav-link`) is min 42px wide with 10px padding.

### Primary action button
Full width, 24px 32px padding, 20px/700, 1px tracking, `--primary` fill, `--on-primary` text, `--shadow-md`, pill. Hover: `--primary-hover`. Active: `scale(0.99)` and `--shadow-sm`. Disabled: 0.45 opacity.

### Segmented control
A sunken track: inline-flex, 2px gap, 4px padding, 1px `--hairline` border, `--surface-2` background, pill. Segments are 10px 20px, 14px/600, `--body` text. Active segment: `--primary` fill, `--on-primary` text, `--shadow-sm`. Hover text goes to `--ink`.

### Theme toggle
40px circle, `--surface` background, 1px `--hairline` border, `--shadow-sm`, 18px stroked icon (moon in light, sun in dark). Hover darkens the border and text.

### Gradient-topped card (theme card, verse card, modal)
White `--surface` card with a 1px `--hairline` border, `--r-lg` radius, `--shadow-sm`, overflow hidden. The top band is a gradient in the card's `--accent`:

```css
background: linear-gradient(135deg, var(--accent), color-mix(in srgb, var(--accent) 62%, white));
```

A small 22 to 28px by 3px white bar (70 to 75% opacity, 2px radius) sits at the band's bottom left as a signature mark. Each component sets `--accent` itself (for example `style="--accent: var(--sec-3)"`).

- **Theme card:** 4/3 aspect ratio, band takes the top 55%, serif name (19px) and a 12px `--muted` range line below. Hover: lift 3px, `--shadow-md`, border becomes `--accent`.
- **Verse card:** band 84px tall, small uppercase date label, serif title (20px) with a 13px sans reference under it. Hover: lift 2px and `--shadow-md`. Open state: border `--accent`, band collapses to 14px, signature bar fades out.
- **Inline expand:** CSS-only accordion using `display: grid; grid-template-rows: minmax(0, 0fr)` animating to `minmax(0, 1fr)` over 0.32s. The `minmax(0, …)` is required so the closed row does not floor at one line.

### Modal (native `<dialog>`)
Full-viewport transparent dialog, content card centered with `max-width: 640px`, `--r-xl` radius, `--shadow-lg`, 72px gradient band, 48px body padding. Backdrop is `--overlay` with `blur(3px)`. Enter: backdrop fades, card moves from `translateY(20px) scale(0.97)` to rest. Esc and backdrop click dismiss through a shared animated close. Focus returns to the originating card. Left and right arrow keys step through the list, with a "3 of 12" position label between two icon buttons and a Close pill on the right.

### Reveal panel (hint / full text)
Two pill buttons ("Show hint", "Show verse") toggle one panel via `aria-expanded`. The panel is a grid-rows accordion (0.36s), `inert` while closed, with a top hairline, a 12px uppercase label, and serif text. Pressing the active button hides it again.

### Readout card
Surface card with a 6px left border in the current `--accent`, `--r-lg`, `--shadow-sm`, 24px padding, 112px min height. Small uppercase label above a 32px serif value. Idle state mutes the value to `--muted` at weight 500. Clickable variant lifts to `--shadow-md` on hover.

### Stat tile
`--surface`, 1px `--hairline`, `--r-md`, `--shadow-sm`, 16px 24px padding. 12px uppercase label, 32px tabular-nums value, optional 14px `--muted` suffix in `<small>`.

### Wheel (signature element)
- Circular `--surface` frame: 12px padding, 1px `--hairline` border, `--shadow-md`, 14px top margin for the pointer overhang.
- Canvas drawn once, spun by CSS rotation, clipped by a circular `overflow: hidden` wrapper. Slice fills come from `--sec-*` read at draw time via `getComputedStyle`. Slices are separated by a 1.5px `--wheel-gap` line (equals the canvas color), alternate slices get a `--wheel-shade` overlay (`rgba(0,0,0,.10)` light, `.16` dark), and labels are 600-weight white text sized down until the longest label fits.
- Center hub: 17% of the wheel, `--surface` fill, 3px `--surface-2` ring, `--shadow-md`, with a clay dot at 24% of the hub.
- Pointer: clay triangle, 34 by 46px, `clip-path: polygon(8% 0, 92% 0, 50% 100%)`, drop shadow `0 2px 2px rgba(0,0,0,.25)`, tilts and settles back over 0.28s.
- Spin easing: ease-out cubic over 1s, 3s, or 6s with fewer or more full turns by duration.
- The canvas listens for a `themechange` event on `window` and repaints from the new tokens.

### Chips / list items
Grid of `minmax(230px, 1fr)` items, 8px gap, `--surface` with hairline border and small radius, using `--surface-2` for sunken states.

### Footer, subscribe, notice
- Social icons: 40px circles, 18px filled glyphs, `--muted`; hover swaps to `--primary-text` on `--primary-soft`.
- Embedded subscribe form: max 420px wide, centered, iframe rounded to `--r-md` so it reads as a tidy card in dark mode. Intro line is 13px `--body`.
- Legal / attribution notice: max 560px, centered, 11px, line-height 1.6, `--muted`.

## Theming behavior

- `theme.js` loads synchronously in `<head>` and sets `html[data-theme]` before first paint, so there is no flash.
- Light is the default regardless of OS preference. The header toggle flips it and saves the choice to `localStorage` under `reverse-theme` (wrapped in try/catch).
- `<meta name="theme-color">` updates with the theme (`#faf8f5` light, `#14181c` dark). Keep these in step with `--canvas`.
- `body` transitions `background-color` and `color` over 0.25s.
- Canvas content dispatches and listens for `themechange` to repaint.

## Accessibility

- `:focus-visible` is a 2px `--primary` outline with a 2px offset on everything interactive.
- Toggle buttons expose `aria-pressed` or `aria-expanded`; the theme toggle updates its `aria-label`.
- Dialogs use `aria-labelledby`, trap focus natively through `showModal()`, and restore focus on close. Closed reveal panels are `inert`.
- Position labels use `aria-live="polite"`. Decorative SVGs are `aria-hidden`.
- A `.sr-only` utility class (1px clip, `clip-path: inset(50%)`) hides text visually.
- Third-party iframes get an `title` added by a small observer.

## Base reset

```css
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; background: var(--canvas); color: var(--ink);
  font-family: var(--font); -webkit-font-smoothing: antialiased; }
h1, h2, h3, p, ul { margin: 0; }
a { color: inherit; }
button { font: inherit; border: none; background: none; color: inherit; cursor: pointer; padding: 0; text-align: left; }
```

## Porting checklist

1. Copy the token blocks (light, dark, non-color) and the base reset into the new site's stylesheet.
2. Self-host Inter variable and preload it; keep the serif system stack.
3. Replace `--primary`, `--clay`, the neutrals, and `--sec-*` for the new brand; verify contrast for white-on-`--sec-*` and for both `*-text` tokens.
4. Add `theme.js` in `<head>` and a `.theme-toggle` button in the header.
5. Build pages from the components above: eyebrow, H1 plus lead, segmented control, gradient-topped cards, dialog, footer icons.
6. Assign one `--sec-*` color per content group and set it as `--accent` on each component.
7. Keep the signature touches: gradient band with the small white bar, pill controls, clay used only in tiny doses, serif for anything people read slowly.
