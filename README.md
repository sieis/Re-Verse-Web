![Re-Verse](my-favicon/twitterimg.png)

# Re-Verse

Re-Verse is a scripture memory app for [Progress & Perfection](https://progressandperfection.com). Pick a verse, and it hides the words one at a time so you can practice recalling them from memory.

**Live site:** https://re-verse-web.netlify.app/

## Who it's for

Anyone memorizing Bible verses — individually or as part of a group study.

## How to use it

1. Open the [library](https://re-verse-web.netlify.app/) and browse verses by theme.
2. Pick a verse to open its study view.
3. Tap words to reveal them as you recite the verse from memory. Keep going until you can say the whole thing without help.

## Verse Wheel

Prefer to be surprised? Open the [Verse Wheel](https://re-verse-web.netlify.app/verse-wheel/) from the link in the library header, or press **Spin** to land on a random verse. The pick appears full screen until dismissed, with a **Show hint** button (first five words) and a **Show verse** button (full ESV text). Choose a spin time (1, 3, or 6 seconds) and **True Random** or **No Repeats** (no verse comes up twice until all have been seen). A session tracker shows which verses were picked and how many times. Session data lives in `sessionStorage`, so it survives a trip Home but resets when the tab closes. The wheel reads `verses.js`, so new weekly verses appear on it automatically.
