# KiddieWordle

Free word games for kids ages 3-12, live at **[kiddiewordle.com](https://kiddiewordle.com)**.

Wordle-style guess-the-word, kid-safe Hangman, anagrams and more — made by parents to be gentle, low-pressure, and playable by early readers.

## Features

- **Multiple modes** — Wordle-style guessing, Hangman, and anagram play
- **Adjustable word length** — 3 to 7 letters, so the game grows with the child
- **Word Forge** — blends English with 7 ancient and indigenous languages (Sanskrit, Hindi, Hawaiian, Maori, Latin, and more) into kid-safe discovery words
- **Parent-configurable difficulty** — grown-ups set the level once, kids just play
- **Mindful by design** — no accounts needed, no pressure mechanics, calm pacing
- **Installable PWA** — manifest + service worker, works offline

## Tech

The entire game lives in a single `index.html` — vanilla JavaScript, no frameworks, no build step. Word lists live in `data/`, and `scripts/ci-smoke.mjs` runs a JS-syntax and structural smoke check in CI.

Hosted on GitHub Pages behind the `kiddiewordle.com` custom domain (see `CNAME`).

## Branches

- `main` — the live site
- `feat/daily-word` — adds a Daily Word mode (pending review)

## Site pages

How to Play, Tips for Parents, Educational Benefits, and FAQ pages ship alongside the game, plus a small blog.
