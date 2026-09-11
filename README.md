# Re-Verse

Scripture memory web app for Progress &amp; Perfection. Pick a passage, tap to reveal words at random, and work it into memory.

**Live site:** https://re-verse-web.netlify.app/

## Files

- `index.html` — library view, verses grouped by theme
- `study.html` — memorization view for a single verse
- `verses.js` — verse data shared by both pages
- `styles.css` — shared styles

## Running locally

Static site, no build step. Serve the directory and open `index.html`, e.g.:

```
npx serve .
```

## Lighthouse checks

The site still has no build step or production dependencies. The optional audit
tooling requires Node.js 22.19+ and a local Chrome/Chromium installation:

```sh
npm ci
npm run audit
```

The command serves the static site locally and audits the library, a short
passage, and a longer passage using Lighthouse's mobile **and** desktop configs.
It exits unsuccessfully if any scored category is below 95. HTML/JSON reports
and a score summary are saved in `lighthouse-reports/` (ignored by Git).
Set `CHROME_PATH` if Chrome is not automatically detected.

To check a Netlify deploy preview or the live site instead:

```sh
AUDIT_BASE_URL=https://re-verse-web.netlify.app npm run audit
```

Local results do not measure Netlify latency, headers, or third-party availability;
repeat against the deployed URL after merging. Scores can vary between runs.

Inter's Latin variable font is served locally; its SIL Open Font License is in
`fonts/OFL.txt`. The Beehiiv embed loads after selecting **Subscribe**, with a
direct subscription link available if the form is blocked or unavailable.
